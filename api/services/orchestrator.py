from api.schemas.lesson import (
    LessonDraftRequest,
    LessonDraftResponse,
    ReviewItem,
    RubricDimension,
    ScenarioBlock,
)
from api.services.card_repository import get_seed_cards
from api.services.openai_client import generate_lesson_draft_payload


def build_lesson_draft(payload: LessonDraftRequest) -> LessonDraftResponse:
    cards = get_seed_cards()
    generated_payload = generate_lesson_draft_payload(payload, cards)

    return LessonDraftResponse(
        intentProfile=generated_payload["intentProfile"],
        selectedCards=generated_payload["selectedCards"],
        scenarioBlocks=[ScenarioBlock(**block) for block in generated_payload["scenarioBlocks"]],
        rubricDimensions=[RubricDimension(**item) for item in generated_payload["rubricDimensions"]],
        reviewItems=[ReviewItem(**item) for item in generated_payload["reviewItems"]],
    )
