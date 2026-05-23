from nitibot_vectorstore import query_vectorstore, print_results
import chromadb
from chromadb.config import Settings
from langchain_community.embeddings import HuggingFaceEmbeddings
from pathlib import Path

# ── same paths as your main script ──
CHROMA_DIR = Path(r"C:\Users\sujal\OneDrive\Desktop\PROJECT\chroma_db")
COLLECTION_NAME = "nitibot_legal"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

# Load embedder and collection
print("Loading embedder...")
embedder = HuggingFaceEmbeddings(
    model_name=EMBEDDING_MODEL,
    model_kwargs={"device": "cpu"},
    encode_kwargs={"normalize_embeddings": True},
)

chroma_client = chromadb.PersistentClient(
    path=str(CHROMA_DIR),
    settings=Settings(anonymized_telemetry=False),
)
collection = chroma_client.get_or_create_collection(
    name=COLLECTION_NAME,
    metadata={"hnsw:space": "cosine"},
)

print(f"\n Connected. {collection.count()} chunks loaded.")
print("Type your question and press Enter. Type 'exit' to quit.\n")

# ── interactive loop ──
while True:
    question = input(" Your question: ").strip()
    if question.lower() in ("exit", "quit", "q"):
        print("Bye!")
        break
    if not question:
        continue

    hits = query_vectorstore(question, collection, embedder, n_results=3)
    if hits:
        print_results(hits)
    else:
        print("No results found.")
    print()