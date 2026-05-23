"""
nitibot_vectorstore.py
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NitiBot Legal Compliance — PDF → ChromaDB Vector Ingestion
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PURPOSE
  Reads legal/regulatory PDFs, splits them into ~500-token chunks,
  generates semantic embeddings, and stores everything in a persistent
  ChromaDB collection with rich metadata:
      { source, section, page, chunk_index, char_count, chunk_id }

USAGE
  1. Drop your PDFs into the `PDF_DIR` folder (default: ./legal_docs/)
  2. Optionally edit PDF_METADATA below to give each file a friendly
     source name and section label.
  3. Run:  python nitibot_vectorstore.py
  4. Query the store with query_vectorstore("your question here")

DEPENDENCIES (install once)
  pip install langchain langchain-community chromadb pypdf sentence-transformers

EMBEDDING MODEL
  Default: all-MiniLM-L6-v2  (fast, 384-dim, runs on CPU, no API key)
  Swap to OpenAI embeddings by uncommenting the OpenAI block below.

NOTES
  • Re-running skips PDFs whose chunks already exist in the DB
    (de-duplication via chunk_id = sha256 hash of text).
  • ChromaDB persists to disk at CHROMA_DIR (default: ./chroma_db/).
"""

# ──────────────────────────────────────────────────────────────────────────────
# IMPORTS
# ──────────────────────────────────────────────────────────────────────────────
import os
import re
import sys
import json
import hashlib
import textwrap
from pathlib import Path
from typing import Any

# PDF extraction
from pypdf import PdfReader

# LangChain text splitter (token-aware)
from langchain_text_splitters import RecursiveCharacterTextSplitter

# ChromaDB
import chromadb
from chromadb.config import Settings

# Embeddings — HuggingFace (local, no API key required)
# ── Option A: Local sentence-transformers (default) ──────────────────────────
from langchain_community.embeddings import HuggingFaceEmbeddings

# ── Option B: OpenAI embeddings — uncomment if preferred ─────────────────────
# from langchain_openai import OpenAIEmbeddings


# ──────────────────────────────────────────────────────────────────────────────
# CONFIGURATION  ← edit these to match your project
# ──────────────────────────────────────────────────────────────────────────────

# Directory that holds your PDF files
PDF_DIR = Path(r"C:\Users\sujal\OneDrive\Desktop\PROJECT\Data")

# Where ChromaDB will persist data (created automatically)
CHROMA_DIR = Path(r"C:\Users\sujal\OneDrive\Desktop\PROJECT\chroma_db")

# ChromaDB collection name (one per project is fine)
COLLECTION_NAME = "nitibot_legal"

# Embedding model — any sentence-transformers model works here
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

# Chunk size in characters (~500 tokens ≈ 1,800–2,000 chars for English legal text)
# LangChain's RecursiveCharacterTextSplitter is character-based; we tune it
# to land near 500 tokens. Legal text averages ~3.5 chars/token.
CHUNK_SIZE     = 1800   # characters  ≈ 500 tokens
CHUNK_OVERLAP  = 200    # characters overlap to preserve cross-chunk context

# ── PER-FILE METADATA ─────────────────────────────────────────────────────────
# Map filename → { source, section } metadata.
# Files NOT listed here get source=filename, section="General".
# Add as many entries as you have PDFs.
PDF_METADATA: dict[str, dict[str, str]] = {
    "GST_Act_2017.pdf": {
        "source": "GST Act",
        "section": "Central Goods and Services Tax Act 2017",
    },
    "Companies_Act_2013.pdf": {
        "source": "Companies Act",
        "section": "Companies Act 2013",
    },
    "IT_Act_2000.pdf": {
        "source": "IT Act",
        "section": "Information Technology Act 2000",
    },
    "SEBI_Regulations.pdf": {
        "source": "SEBI",
        "section": "Securities and Exchange Board of India Regulations",
    },
    "RBI_Guidelines.pdf": {
        "source": "RBI",
        "section": "Reserve Bank of India Guidelines",
    },
    # Add more PDFs here ↓
    # "my_file.pdf": { "source": "Short Name", "section": "Full Section Title" },
}


# ──────────────────────────────────────────────────────────────────────────────
# SECTION DETECTOR — parses heading patterns common in Indian legal documents
# Detects strings like "Section 22", "Part III", "Chapter IV", "Rule 45"
# ──────────────────────────────────────────────────────────────────────────────

_SECTION_PATTERN = re.compile(
    r"(?:"
    r"Section\s+(?P<section>\d+[A-Z]?)"          # Section 22, Section 4A
    r"|Part\s+(?P<part>[IVXLCDM]+|\d+)"           # Part III, Part 2
    r"|Chapter\s+(?P<chapter>[IVXLCDM]+|\d+)"     # Chapter IV
    r"|Rule\s+(?P<rule>\d+[A-Z]?)"                # Rule 45
    r"|Schedule\s+(?P<schedule>[IVXLCDM]+|\d+)"   # Schedule II
    r")",
    re.IGNORECASE,
)


def detect_section(text: str) -> str:
    """Return the first detected section/part/chapter label in a chunk."""
    match = _SECTION_PATTERN.search(text)
    if not match:
        return "General"
    for group_name, value in match.groupdict().items():
        if value:
            return f"{group_name.capitalize()} {value}"
    return "General"


# ──────────────────────────────────────────────────────────────────────────────
# HELPERS
# ──────────────────────────────────────────────────────────────────────────────

def chunk_id(text: str, source: str, page: int, idx: int) -> str:
    """Deterministic ID — same chunk always gets the same ID (enables de-dup)."""
    raw = f"{source}::page{page}::idx{idx}::{text[:120]}"
    return hashlib.sha256(raw.encode()).hexdigest()[:24]


def extract_text_from_pdf(pdf_path: Path) -> list[dict]:
    """
    Extract text page-by-page from a PDF.
    Returns a list of dicts: { page: int (1-based), text: str }
    Skips pages with no extractable text (scanned images).
    """
    pages = []
    try:
        reader = PdfReader(str(pdf_path))
    except Exception as exc:
        print(f"  ✗ Cannot read {pdf_path.name}: {exc}")
        return pages

    for page_num, page in enumerate(reader.pages, start=1):
        try:
            text = page.extract_text() or ""
            text = text.strip()
            if len(text) < 30:          # skip nearly-empty pages
                continue
            pages.append({"page": page_num, "text": text})
        except Exception:
            continue

    return pages


def build_splitter() -> RecursiveCharacterTextSplitter:
    """
    RecursiveCharacterTextSplitter splits on paragraph → sentence → word
    boundaries in that order, so chunks stay semantically coherent.
    Legal text has long paragraphs, so we keep separators broad.
    """
    return RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ".", " ", ""],
        length_function=len,
    )


# ──────────────────────────────────────────────────────────────────────────────
# CORE INGESTION
# ──────────────────────────────────────────────────────────────────────────────

def ingest_pdfs(pdf_dir: Path, collection: chromadb.Collection, embedder) -> None:
    """
    Walk every PDF in pdf_dir, chunk it, embed it, and upsert into ChromaDB.
    Existing chunk IDs are skipped (idempotent — safe to re-run).
    """
    pdf_files = sorted(pdf_dir.glob("*.pdf"))
    if not pdf_files:
        print(f"\n⚠  No PDFs found in {pdf_dir.resolve()}")
        print("   Create the folder and drop your legal PDFs there, then re-run.\n")
        return

    splitter = build_splitter()
    total_chunks = 0

    for pdf_path in pdf_files:
        fname = pdf_path.name
        meta_defaults = PDF_METADATA.get(fname, {})
        friendly_source  = meta_defaults.get("source",  fname.replace(".pdf", ""))
        friendly_section = meta_defaults.get("section", "General")

        print(f"\n Processing: {fname}  [{friendly_source}]")

        pages = extract_text_from_pdf(pdf_path)
        if not pages:
            print("    ↳ No extractable text — skipping (scanned PDF?)")
            continue

        print(f"    ↳ {len(pages)} pages with text extracted")

        file_chunks = 0
        for page_info in pages:
            page_num   = page_info["page"]
            page_text  = page_info["text"]

            # Split page text into chunks
            raw_chunks = splitter.split_text(page_text)

            for idx, chunk_text in enumerate(raw_chunks):
                chunk_text = chunk_text.strip()
                if not chunk_text:
                    continue

                cid = chunk_id(chunk_text, friendly_source, page_num, idx)

                # Auto-detect section from chunk content (overrides default)
                detected = detect_section(chunk_text)
                section  = detected if detected != "General" else friendly_section

                metadata: dict[str, Any] = {
                    "source":       friendly_source,
                    "section":      section,
                    "page":         page_num,
                    "chunk_index":  idx,
                    "char_count":   len(chunk_text),
                    "chunk_id":     cid,
                    "filename":     fname,
                }

                # Generate embedding via LangChain embedder
                embedding = embedder.embed_documents([chunk_text])[0]

                # Upsert into ChromaDB (no-op if ID already exists)
                collection.upsert(
                    ids=[cid],
                    embeddings=[embedding],
                    documents=[chunk_text],
                    metadatas=[metadata],
                )

                file_chunks += 1

        print(f"    ↳ {file_chunks} chunks stored")
        total_chunks += file_chunks

    print(f"\n  Ingestion complete — {total_chunks} total chunks in collection "
          f"'{COLLECTION_NAME}'\n")


# ──────────────────────────────────────────────────────────────────────────────
# QUERY INTERFACE  (convenience helper — use in your app or REPL)
# ──────────────────────────────────────────────────────────────────────────────

def query_vectorstore(
    question: str,
    collection: chromadb.Collection,
    embedder,
    n_results: int = 5,
    source_filter: str | None = None,
) -> list[dict]:
    """
    Semantic search over the ChromaDB collection.

    Args:
        question:      Natural language query.
        collection:    ChromaDB collection object.
        embedder:      Same embedder used during ingestion.
        n_results:     Number of top chunks to return.
        source_filter: Optional — restrict to one source, e.g. "GST Act".

    Returns:
        List of dicts with keys: text, source, section, page, score.
    """
    query_embedding = embedder.embed_query(question)

    where_filter = {"source": source_filter} if source_filter else None

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
        where=where_filter,
        include=["documents", "metadatas", "distances"],
    )

    hits = []
    docs      = results["documents"][0]
    metas     = results["metadatas"][0]
    distances = results["distances"][0]

    for doc, meta, dist in zip(docs, metas, distances):
        hits.append({
            "text":    doc,
            "source":  meta.get("source"),
            "section": meta.get("section"),
            "page":    meta.get("page"),
            "score":   round(1 - dist, 4),   # cosine similarity (higher = better)
        })

    return hits


def print_results(hits: list[dict]) -> None:
    """Pretty-print query results to the terminal."""
    for i, h in enumerate(hits, 1):
        print(f"\n{'─'*70}")
        print(f"  #{i}  [{h['source']}]  §{h['section']}  page {h['page']}"
              f"   score={h['score']}")
        print(f"{'─'*70}")
        print(textwrap.fill(h["text"], width=78, initial_indent="  ",
                            subsequent_indent="  "))


# ──────────────────────────────────────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────────────────────────────────────

def main() -> None:
    print("\n" + "═"*70)
    print("  NitiBot — Legal PDF → ChromaDB Vectorization Pipeline")
    print("═"*70)

    # ── 1. Ensure directories exist ──────────────────────────────────────────
    PDF_DIR.mkdir(parents=True, exist_ok=True)
    CHROMA_DIR.mkdir(parents=True, exist_ok=True)

    # ── 2. Initialize embedding model ────────────────────────────────────────
    print(f"\n  Loading embedding model: {EMBEDDING_MODEL}")
    print("    (first run downloads ~90 MB — cached after that)")

    # ── Option A: Local HuggingFace embeddings (default, no API key) ─────────
    embedder = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        model_kwargs={"device": "cpu"},   # change to "cuda" if GPU available
        encode_kwargs={"normalize_embeddings": True},
    )

    # ── Option B: OpenAI embeddings — uncomment + set OPENAI_API_KEY env var ─
    # embedder = OpenAIEmbeddings(model="text-embedding-3-small")

    print("     Embedder ready")

    # ── 3. Initialize ChromaDB ───────────────────────────────────────────────
    print(f"\n🗄   Opening ChromaDB at: {CHROMA_DIR.resolve()}")
    chroma_client = chromadb.PersistentClient(
        path=str(CHROMA_DIR),
        settings=Settings(anonymized_telemetry=False),
    )

    # get_or_create is idempotent — safe to call on every run
    collection = chroma_client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},   # cosine similarity for legal text
    )
    print(f"     Collection '{COLLECTION_NAME}' ready  "
          f"({collection.count()} chunks already stored)")

    # ── 4. Ingest PDFs ───────────────────────────────────────────────────────
    ingest_pdfs(PDF_DIR, collection, embedder)

    # ── 5. Demo query ────────────────────────────────────────────────────────
    demo_questions = [
        "What is the threshold for GST registration?",
        "Director responsibilities under Companies Act",
        "Data protection obligations for businesses",
    ]

    if collection.count() > 0:
        print("\n" + "═"*70)
        print("  DEMO QUERY  (searching the vectorstore)")
        print("═"*70)

        for q in demo_questions[:1]:   # run just the first demo question
            print(f"\n  Query: \"{q}\"")
            hits = query_vectorstore(q, collection, embedder, n_results=3)
            if hits:
                print_results(hits)
            else:
                print("  (no results — collection may be empty)")
    else:
        print("\n  Tip: Add PDFs to ./legal_docs/ and re-run to populate the store.")

    # ── 6. Collection stats ──────────────────────────────────────────────────
    count = collection.count()
    print(f"\n\n  Final collection size: {count} chunks")
    print(f"    Persist path:           {CHROMA_DIR.resolve()}")
    print(f"    Collection name:        {COLLECTION_NAME}")
    print("\n    To query in your own code:")
    print("      from nitibot_vectorstore import query_vectorstore")
    print("      hits = query_vectorstore('your question', collection, embedder)")
    print("\n" + "═"*70 + "\n")


if __name__ == "__main__":
    main()