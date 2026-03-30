# Progress

## Current Status

Project initialization completed.

Available documents:

- `research.md`
- `architecture.md`
- `deployment.md`
- `CLAUDE.md`
- `AGENTS.md`

Initial scaffold created for:

- Next.js frontend
- FastAPI backend
- shared data contracts
- environment variable template
- local card repository
- OpenAI Responses API integration path with fallback mode
- GitHub Actions CI workflow

## Current Scope

MVP focus:

- teacher input
- intent parsing
- card recommendation
- scenario generation
- rubric generation
- review checkpoints

## Next Priorities

1. Wire the frontend form to backend APIs.
2. Replace fallback generation with full tool-calling orchestration.
3. Add persistent storage for lesson plans, reviews, and versions.
4. Define stable JSON contracts for intent, scenario, and rubric.
5. Prepare actual GitHub remote and Vercel project connection.

## Risks

- Overly broad AI outputs without enough structure.
- Weak traceability between recommended cards and rubric items.
- Excessive reliance on model output before validation layers exist.

## Decision Log

- FastAPI selected for orchestration and API services.
- Next.js selected for teacher-facing dashboard and workflow UI.
- OpenAI integration should remain server-side only.
- Teacher approval remains mandatory before finalization.
- Local development should work even without an OpenAI API key by returning structured fallback drafts.
