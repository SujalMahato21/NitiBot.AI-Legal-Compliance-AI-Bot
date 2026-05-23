# NitiBot — AI Legal Compliance Assistant for Indian Businesses

> **"Niti"** (Sanskrit: नीति) means *policy, law, or governance*. NitiBot brings the power of AI to Indian legal compliance — making complex regulatory documents accessible, searchable, and actionable for businesses.

---

## Table of Contents

- [What is NitiBot?](#what-is-nitibot)
- [Key Features](#key-features)
- [Project Architecture](#project-architecture)
- [Folder Structure](#folder-structure)
- [Tech Stack](#tech-stack)
- [System Components](#system-components)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Flowise Chatflow Setup](#flowise-chatflow-setup)
- [Legal Document Database](#legal-document-database)
- [API Reference](#api-reference)
- [Premium Features](#premium-features)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

---

## What is NitiBot?

NitiBot is an **AI-powered legal compliance chatbot** built for Indian startups and businesses. It answers legal and regulatory questions by searching through a curated vector database of Indian laws and guidelines — including GST Act, Companies Act 2013, IT Act 2000, SEBI Regulations, and RBI Guidelines.

**The Problem it Solves:**
Small businesses and startups in India struggle with understanding dense legal documents. Hiring a lawyer for every compliance query is expensive. NitiBot gives instant, cited answers directly from the source acts and regulations.

**One-liner:** *Ask a legal question. Get a cited answer from the actual Indian law. Instantly.*

---

## Key Features

- **RAG-based Legal QA** — Retrieval Augmented Generation over real Indian legal PDFs
- **Source Citations** — Every answer references the exact Act, Chapter, or Section it came from
- **Act Filtering** — Filter queries by GST Act, Companies Act, IT Act, SEBI, or RBI
- **Company Profile Onboarding** — Premium flow collects company identity (CIN, PAN, GST, TAN, etc.)
- **Premium Access Control** — Gated document generation features for verified premium users
- **Beautiful Chat UI** — Dark-themed, gold-accented professional interface
- **Persistent ChromaDB** — Vector store survives restarts; de-duplication via SHA-256 chunk IDs
- **REST API Backend** — Express.js API with MongoDB for storing company profiles

---

## Project Architecture

```
User Query
    │
    ▼
NitiBot Chat UI (nitibot-ui.html)
    │
    ▼
Flowise API (localhost:3000)
    │
    ├── Groq LLM (llama-3.3-70b-versatile)
    │
    └── ChromaDB Vector Store (localhost:8000)
            │
            └── HuggingFace Embeddings (all-MiniLM-L6-v2)
                        │
                        └── Ingested Legal PDFs

NitiBot API (nitibot-api — localhost:3001)
    │
    └── MongoDB — Company Profile Storage
```

**Data Flow:**
1. User asks a legal question in the chat UI
2. UI sends POST to Flowise `/api/v1/prediction/{chatflowId}`
3. Flowise rephrases the question using chat history
4. ChromaDB retrieves the top-K most semantically relevant legal document chunks
5. Groq's LLaMA 3.3 70B generates a cited answer using only the retrieved context
6. Answer is streamed back to the UI with source document badges

---

## Folder Structure

```
PROJECT/
│
├── nitibot-ui.html                  # Main chat interface (open in browser)
├── nitibot-compliance-logo.html     # Logo design showcase (dark/light/icon variants)
├── nitibot_vectorstore.py           # PDF → ChromaDB ingestion pipeline
├── test.py                          # Quick vectorstore query test script
│
├── NitiFlowise Chatflow.json        # Flowise chatflow — RAG + ChromaDB + Groq
├── NitiBot_Premium Chatflow.json    # Flowise chatflow — Premium onboarding + doc generation
│
├── Data/                            # Legal PDF source documents
│   ├── CGST-Act-Updated-30092020.pdf
│   ├── Startup India Kit_v5.pdf
│   ├── Startup-Playbook-DPIIT-Recognised-Startups-in-India.pdf
│   ├── MoA and AoA.pdf
│   ├── SAMPLE MOA.pdf
│   ├── FOUNDER_AGREEMENT.pdf
│   ├── Form_AOC-4_help.pdf
│   ├── Instruction-Kit-for-eForm-MGT-7.pdf
│   ├── Shareholder aggrement sample.pdf
│   ├── THE MICRO, SMALL AND MEDIUM ENTERPRISES DEVELOPMENT ACT, 2006.pdf
│   └── MCA21-MoCorporate-Affaire-2021.pdf
│
├── chroma_db/                       # Persisted ChromaDB vector store (auto-generated)
│   └── nitibot_legal/               # Collection: embeddings + HNSW index
│
├── nitibot-api/                     # Node.js REST API backend
│   ├── index.js                     # Express server — company profile CRUD
│   ├── package.json
│   ├── .env                         # MONGO_URI, PORT
│   └── node_modules/
│
├── ngrok.yml                        # ngrok tunnel config (for public URL exposure)
├── project_scope.pdf                # Original project scope document
├── AI_LegalBot_Gantt.pdf            # Project Gantt chart / timeline
└── .env                             # Root environment variables
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **LLM** | Groq API — `llama-3.3-70b-versatile` (temperature: 0) |
| **Orchestration** | Flowise (self-hosted, `npx flowise start`) |
| **Vector Store** | ChromaDB (local persistent, cosine similarity) |
| **Embeddings** | HuggingFace — `sentence-transformers/all-MiniLM-L6-v2` |
| **PDF Parsing** | PyPDF (via LangChain) |
| **Text Splitting** | LangChain `RecursiveCharacterTextSplitter` (~500 tokens/chunk) |
| **Chat UI** | Vanilla HTML/CSS/JS (zero-dependency, single file) |
| **API Backend** | Node.js + Express.js |
| **Database** | MongoDB (via Mongoose) |
| **Tunneling** | ngrok (optional, for public demo) |

---

## System Components

### 1. `nitibot-ui.html` — Chat Interface
The main user-facing interface. Single HTML file, no build step required.

**Features:**
- Animated dark-gold design with NitiBot branding
- Act filter chips (All Acts / GST / Companies Act / IT Act / SEBI / RBI)
- Starter question cards for quick exploration
- Real-time token streaming simulation
- Source document citation badges
- Flowise connection config panel (settings gear icon)
- Session persistence via `localStorage`
- Mobile responsive

**How to use:**
1. Serve via HTTP (see [Running the Project](#running-the-project))
2. Click the gear icon ⚙ to enter your Flowise URL and Chatflow ID
3. Ask any legal question

---

### 2. `nitibot_vectorstore.py` — PDF Ingestion Pipeline
Reads all PDFs from the `Data/` folder, chunks them, generates embeddings, and stores them in ChromaDB.

**What it does:**
- Extracts text page-by-page using `pypdf`
- Splits text into ~500 token chunks (1800 chars) with 200-char overlap
- Auto-detects section labels (Section 22, Part III, Rule 45, etc.) using regex
- Generates deterministic SHA-256 chunk IDs for de-duplication (safe to re-run)
- Stores `source`, `section`, `page`, `chunk_index`, `char_count` as metadata
- Persists to `chroma_db/` directory

**Configuration (edit in file):**
```python
PDF_DIR     = Path("./Data")          # Folder with your PDFs
CHROMA_DIR  = Path("./chroma_db")     # Where ChromaDB persists
COLLECTION  = "nitibot_legal"         # Collection name
CHUNK_SIZE  = 1800                    # Characters per chunk
CHUNK_OVERLAP = 200                   # Overlap between chunks
```

---

### 3. `NitiFlowise Chatflow.json` — Core RAG Chatflow
Import this into Flowise to set up the main legal QA chatbot.

**Nodes:**
- **Groq Chat** → `llama-3.3-70b-versatile`, temperature 0 (deterministic legal answers)
- **HuggingFace Inference Embeddings** → `sentence-transformers/all-MiniLM-L6-v2`
- **Chroma Vector Store** → collection `nitibot_legal`, connects to `http://localhost:8000`
- **Conversational Retrieval QA Chain** → returns source documents, maintains chat history

**System Prompt used:**
```
You are NitiBot, an AI legal compliance assistant for Indian businesses.
Answer the question using ONLY the provided legal document context below.
Always mention the specific Act, Chapter, or Section your answer comes from.
Give a clear direct answer.
```

---

### 4. `NitiBot_Premium Chatflow.json` — Premium Onboarding Flow
A separate Flowise chatflow for premium users that collects company profile information conversationally before unlocking document generation.

**Collects 10 company profile fields:**
1. Legal company name
2. Business type (Pvt Ltd / LLP / Partnership / Sole Proprietor)
3. CIN number
4. PAN number
5. TAN number
6. GST number
7. Registered address
8. Founders (names and roles)
9. Industry / sector
10. Year of incorporation

**Access Control:** Uses a custom JS function node (`checkPremiumUsers`) that validates userId against a hardcoded premium users list before granting document generation access.

---

### 5. `nitibot-api/` — Company Profile REST API
Node.js/Express backend for storing and retrieving company profiles in MongoDB.

**Endpoints:**

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/profile` | Create or update a company profile (upsert by userId) |
| `GET` | `/api/profile/:userId` | Check if profile exists and retrieve it |

**Data model:**
```javascript
{
  userId: String,
  legalName: String,
  businessType: String,    // "Pvt Ltd", "LLP", etc.
  CIN: String,
  PAN: String,
  TAN: String,
  GST: String,
  address: String,
  founders: Array,
  industry: String,
  createdAt: Date
}
```

---

## Setup & Installation

### Prerequisites

- Python 3.9+ 
- Node.js 18+
- [Flowise](https://flowiseai.com/) installed globally
- ChromaDB running as a server
- MongoDB (local or Atlas)
- Groq API key (free at [console.groq.com](https://console.groq.com))
- HuggingFace API key (free at [huggingface.co](https://huggingface.co))

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/nitibot.git
cd nitibot
```

---

### Step 2 — Install Python Dependencies

```bash
pip install langchain langchain-community chromadb pypdf sentence-transformers
```

---

### Step 3 — Install Node.js Dependencies

```bash
cd nitibot-api
npm install
cd ..
```

---

### Step 4 — Install Flowise

```bash
npm install -g flowise
```

---

## Environment Variables

### Root `.env`
```env
GROQ_API_KEY=your_groq_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

### `nitibot-api/.env`
```env
MONGO_URI=mongodb://localhost:27017/nitibot
PORT=3001
```

> **Security Note:** Never commit `.env` files to Git. They are already listed in `.gitignore`. Add `chroma_db/`, `__pycache__/`, and `node_modules/` to your `.gitignore` as well.

---

## Running the Project

Run each of these in a separate terminal:

### Terminal 1 — Start ChromaDB Server
```bash
pip install chromadb
chroma run --path ./chroma_db --port 8000
```

### Terminal 2 — Ingest Legal PDFs into ChromaDB
```bash
# Place your legal PDFs inside the Data/ folder first
python nitibot_vectorstore.py
```
> This step only needs to run once (or when you add new PDFs). It is idempotent — safe to re-run.

### Terminal 3 — Start Flowise
```bash
npx flowise start
# Opens at http://localhost:3000
```

### Terminal 4 — Import Chatflow into Flowise
1. Open `http://localhost:3000` in your browser
2. Go to **Chatflows → Add New → Import**
3. Upload `NitiFlowise Chatflow.json`
4. Add your **Groq API Key** and **HuggingFace API Key** in the credentials section
5. Save and note the **Chatflow ID** from the URL

### Terminal 5 — Start the Node.js API
```bash
cd nitibot-api
npm start
# Runs on http://localhost:3001
```

### Terminal 6 — Serve the Chat UI
```bash
# From the project root
npx serve .
# Opens at http://localhost:3001 or similar
```

### Final Step — Connect UI to Flowise
1. Open the served URL in your browser
2. Click the **⚙ gear icon** in the top right
3. Enter:
   - **Flowise Base URL:** `http://localhost:3000`
   - **Chatflow ID:** (paste from Flowise dashboard URL)
4. Click **Save & Connect**
5. Start chatting!

---

## Flowise Chatflow Setup

### Credential Configuration in Flowise

After importing the JSON chatflow:

| Credential | Where to Get | Node to Configure |
|---|---|---|
| Groq API Key | [console.groq.com](https://console.groq.com) | Groq node |
| HuggingFace API Key | [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) | HuggingFace Inference Embeddings node |

The Chroma node is pre-configured to connect to `http://localhost:8000` with collection name `nitibot_legal`.

---

## Legal Document Database

The `Data/` folder contains the following source documents currently loaded into the vector store:

| Document | Coverage |
|---|---|
| CGST Act 2017 (updated Sept 2020) | GST registration, rates, returns, penalties |
| Startup India Kit v5 | DPIIT recognition, tax exemptions, schemes |
| Startup Playbook (DPIIT) | End-to-end startup compliance playbook |
| Memorandum & Articles of Association | MoA/AoA templates and requirements |
| Sample MoA | Draft memorandum example |
| Founder Agreement | Co-founder equity and IP agreement template |
| Form AOC-4 Help | Annual financial statement filing guide |
| Form MGT-7 Instructions | Annual return filing instructions |
| Shareholder Agreement Sample | Sample SHA template |
| MSME Development Act 2006 | MSME classification and benefits |
| MCA21 Corporate Affairs 2021 | Ministry of Corporate Affairs digital filings |

**To add more legal documents:**
1. Drop PDF files into the `Data/` folder
2. Add metadata in `nitibot_vectorstore.py` under `PDF_METADATA`
3. Re-run `python nitibot_vectorstore.py`

---

## API Reference

### POST `/api/profile`
Save or update a company profile.

**Request Body:**
```json
{
  "userId": "user_123",
  "legalName": "Acme Technologies Pvt Ltd",
  "businessType": "Pvt Ltd",
  "CIN": "U72900MH2023PTC123456",
  "PAN": "AABCA1234A",
  "TAN": "MUMA12345A",
  "GST": "27AABCA1234A1Z5",
  "address": "123, MG Road, Bangalore - 560001",
  "founders": ["Alice (CEO)", "Bob (CTO)"],
  "industry": "SaaS / LegalTech"
}
```

**Response:**
```json
{ "success": true }
```

---

### GET `/api/profile/:userId`
Check if a company profile exists.

**Response:**
```json
{
  "exists": true,
  "profile": { ... }
}
```

---

## Premium Features

The `NitiBot_Premium Chatflow.json` adds these capabilities beyond the free tier:

- **Conversational onboarding** — Collects 10 company identity fields in 3-4 turns
- **Access control** — Custom JS function validates premium user IDs before granting access
- **Document generation (planned)** — Auto-fill legal documents using collected company profile
- **Buffer memory** — Full conversation history maintained across the session

**To add a premium user**, edit the `checkPremiumUsers` function inside Flowise:
```javascript
const premiumUsers = ["test_user_001", "your_user_id_here"];
```

---

## Screenshots

| View | File |
|---|---|
| Chat UI | `nitibot-ui.html` |
| Logo variants (dark/light/icon) | `nitibot-compliance-logo.html` |
| Flowise chatflow diagram | `NitiFlowise.html` |

---

## Roadmap

- [x] PDF ingestion pipeline with ChromaDB
- [x] Flowise RAG chatflow with Groq + HuggingFace
- [x] Chat UI with act filtering and source citations
- [x] Company profile API (Node.js + MongoDB)
- [x] Premium onboarding chatflow
- [ ] Auto-generate legal documents (MoA, SHA, Founder Agreements) using company profile
- [ ] Multi-user auth with JWT
- [ ] Deploy ChromaDB + Flowise to cloud (Railway / Render)
- [ ] Add SEBI and RBI regulatory PDFs to document corpus
- [ ] Webhook integration for ngrok public URL auto-update
- [ ] Mobile app wrapper (React Native)

---

## Contributing

This project was built as part of a hackathon/academic project at **HIT (Haldia Institute of Technology)**.

To contribute:
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add: your feature"`
4. Push and open a Pull Request

---

## Important Notes for Developers

**Do NOT commit these to Git:**
- `.env` files (contain API keys)
- `chroma_db/` folder (large binary vector store — regenerate locally)
- `node_modules/` (run `npm install`)
- `__pycache__/` (Python bytecode)
- `NitiFlowise_files/` (downloaded Flowise UI assets)

**Recommended `.gitignore`:**
```
.env
chroma_db/
node_modules/
__pycache__/
NitiFlowise_files/
*.pyc
ngrok.yml
```

---

## License

This project is for educational and demonstration purposes. Legal document PDFs used are publicly available government publications.

---

*Built with ❤️ by the NitiBot team — HIT Students | AI For Everyone (A4E)*
