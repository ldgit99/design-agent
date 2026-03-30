from fastapi import APIRouter

from api.schemas.lesson import (
    LessonDraftRequest,
    LessonDraftResponse,
    ReviewItem,
    RubricDimension,
    ScenarioBlock,
)
from api.services.orchestrator import build_lesson_draft

router = APIRouter()


@router.post("/api/lesson/draft", response_model=LessonDraftResponse)
def create_lesson_draft(payload: LessonDraftRequest) -> LessonDraftResponse:
    return build_lesson_draft(payload)
