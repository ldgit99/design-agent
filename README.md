# Human-AI Orchestration Lesson Design Agent

## Overview

Teacher-centered lesson design system with:

- intent parsing
- lesson design card retrieval
- scenario generation
- rubric generation
- pedagogy and safety review checkpoints

## Structure

- `app/`: Next.js frontend
- `api/`: FastAPI backend
- `data/`: local card repository
- `research.md`: research foundation
- `architecture.md`: implementation architecture
- `deployment.md`: deployment checklist

## Local Development

Frontend:

```bash
npm install
npm run dev
```

Backend:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn api.index:app --reload --port 8000
```

## Environment

Copy `.env.example` and set:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `NEXT_PUBLIC_API_BASE_URL`

If `OPENAI_API_KEY` is missing, the backend returns a structured fallback draft so the UI can still be tested.
