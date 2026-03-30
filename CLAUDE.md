# Project Constitution

## Project Purpose

This repository builds a Human-AI orchestration lesson design agent for educators.
The goal is not to replace teacher judgment, but to help teachers design, review, and refine lesson plans with structured AI support.

## Mandatory Rules

1. Teacher authority comes first.
2. AI must propose, explain, and review. It must not silently finalize lesson plans.
3. Student personal data must not be sent to third-party APIs unless explicitly approved and documented.
4. OpenAI API keys must never be exposed in client-side code.
5. Outputs must be structured so the UI, storage layer, and review layer can share the same contract.
6. Every meaningful implementation change must keep `research.md`, `architecture.md`, and `progress.md` consistent.

## Product Constraints

- The system must support teacher input, intent parsing, card recommendation, scenario generation, rubric generation, review, and teacher approval.
- The system must preserve explainability for card recommendations and rubric generation.
- The system must support experimentation through branch-based preview deployments.
- The system must be designed for server-side OpenAI API usage only.

## Forbidden Actions

- Do not hardcode secrets.
- Do not call OpenAI directly from browser code.
- Do not remove teacher approval checkpoints from the workflow.
- Do not store unnecessary student personal data.
- Do not merge new schema or API changes without updating documentation.

## Definition of Done

A feature is not done unless:

- types and interfaces are coherent
- API contracts are explicit
- the change fits the teacher-centered workflow
- `progress.md` is updated

## Key Documents

- `research.md`
- `architecture.md`
- `deployment.md`
- `AGENTS.md`
- `progress.md`

## Key Runtime Direction

- Frontend: Next.js + TypeScript
- Backend: FastAPI
- AI: OpenAI Responses API with server-side tool calling
- Deploy: GitHub + Vercel
