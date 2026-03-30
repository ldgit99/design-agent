from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes.lesson import router as lesson_router

app = FastAPI(title="Human-AI Lesson Design Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(lesson_router)


@app.get("/api/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}
