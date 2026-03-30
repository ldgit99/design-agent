import json
from typing import Any

from api.config import get_settings
from api.schemas.lesson import LessonDraftRequest

try:
    from openai import OpenAI
except ImportError:  # pragma: no cover - dependency may not be installed yet
    OpenAI = None


def generate_lesson_draft_payload(
    payload: LessonDraftRequest, cards: list[dict[str, Any]]
) -> dict[str, Any]:
    settings = get_settings()

    if not settings.openai_api_key or OpenAI is None:
        return build_fallback_payload(payload, cards)

    client = OpenAI(api_key=settings.openai_api_key)
    response = client.responses.create(
        model=settings.openai_model,
        input=[
            {
                "role": "system",
                "content": [
                    {
                        "type": "input_text",
                        "text": (
                            "You are an orchestration engine for teacher-centered lesson design. "
                            "Return only structured JSON matching the provided schema."
                        ),
                    }
                ],
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": build_prompt(payload, cards),
                    }
                ],
            },
        ],
        text={
            "format": {
                "type": "json_schema",
                "name": "lesson_draft",
                "strict": True,
                "schema": LESSON_DRAFT_SCHEMA,
            }
        },
    )

    content = response.output_text
    return json.loads(content)


def build_prompt(payload: LessonDraftRequest, cards: list[dict[str, Any]]) -> str:
    return json.dumps(
        {
            "teacher_input": payload.model_dump(),
            "available_cards": cards,
            "requirements": [
                "teacher remains the final approver",
                "make AI use explicit but bounded",
                "produce a three-block lesson flow when possible",
                "recommend cards with reasons",
                "include pedagogy and safety review notes",
            ],
        },
        ensure_ascii=False,
        indent=2,
    )


def build_fallback_payload(
    payload: LessonDraftRequest, cards: list[dict[str, Any]]
) -> dict[str, Any]:
    return {
        "intentProfile": {
            "title": payload.title,
            "subject": payload.subject,
            "gradeLevel": payload.gradeLevel,
            "durationMinutes": payload.durationMinutes,
            "teacherPrompt": payload.teacherPrompt,
            "constraints": payload.constraints,
            "assessmentMode": "formative",
            "aiUsageMode": "bounded-support",
        },
        "selectedCards": cards,
        "scenarioBlocks": [
            {
                "phase": "도입",
                "durationMinutes": 10,
                "teacherActions": "수업 목표와 AI 활용 규칙을 설명한다.",
                "studentActions": "학습 목표를 확인하고 문제의식을 공유한다.",
                "aiActions": "도입 질문과 예시 응답 초안을 제공한다.",
            },
            {
                "phase": "전개",
                "durationMinutes": max(payload.durationMinutes - 20, 15),
                "teacherActions": "카드 활동을 운영하고 팀별 해석을 조정한다.",
                "studentActions": "AI 응답을 비교하고 비판적으로 검토한다.",
                "aiActions": "비교용 예시와 추가 질문 초안을 제안한다.",
            },
            {
                "phase": "정리",
                "durationMinutes": 10,
                "teacherActions": "핵심 학습 내용과 AI 활용 한계를 정리한다.",
                "studentActions": "배운 점과 주의점을 성찰한다.",
                "aiActions": "성찰 질문 초안을 제공한다.",
            },
        ],
        "rubricDimensions": [
            {
                "name": "Flow",
                "descriptor": "활동 흐름이 목표와 시간 구조에 맞게 정렬되어 있는가",
            },
            {
                "name": "AI Use",
                "descriptor": "AI 활용이 학습 목표를 지원하고 과도하지 않은가",
            },
            {
                "name": "Engagement",
                "descriptor": "학생 참여와 협업을 촉진하는가",
            },
        ],
        "reviewItems": [
            {
                "reviewer": "Pedagogy Reviewer",
                "summary": "목표-활동 정렬은 무난하지만 학생 산출물 예시를 더 구체화할 필요가 있다.",
            },
            {
                "reviewer": "Safety Reviewer",
                "summary": "학생 개인정보 입력 금지와 AI 응답 검증 책임을 명시해야 한다.",
            },
        ],
    }


LESSON_DRAFT_SCHEMA: dict[str, Any] = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "intentProfile": {"type": "object", "additionalProperties": True},
        "selectedCards": {
            "type": "array",
            "items": {"type": "object", "additionalProperties": True},
        },
        "scenarioBlocks": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "properties": {
                    "phase": {"type": "string"},
                    "durationMinutes": {"type": "integer"},
                    "teacherActions": {"type": "string"},
                    "studentActions": {"type": "string"},
                    "aiActions": {"type": "string"},
                },
                "required": [
                    "phase",
                    "durationMinutes",
                    "teacherActions",
                    "studentActions",
                    "aiActions",
                ],
            },
        },
        "rubricDimensions": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "properties": {
                    "name": {"type": "string"},
                    "descriptor": {"type": "string"},
                },
                "required": ["name", "descriptor"],
            },
        },
        "reviewItems": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "properties": {
                    "reviewer": {"type": "string"},
                    "summary": {"type": "string"},
                },
                "required": ["reviewer", "summary"],
            },
        },
    },
    "required": [
        "intentProfile",
        "selectedCards",
        "scenarioBlocks",
        "rubricDimensions",
        "reviewItems",
    ],
}
