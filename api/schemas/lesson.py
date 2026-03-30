from pydantic import BaseModel, Field


class LessonDraftRequest(BaseModel):
    title: str = Field(default="")
    subject: str = Field(default="")
    gradeLevel: str = Field(default="")
    durationMinutes: int = Field(default=45)
    teacherPrompt: str = Field(default="")
    constraints: str = Field(default="")


class ScenarioBlock(BaseModel):
    phase: str
    durationMinutes: int
    teacherActions: str
    studentActions: str
    aiActions: str


class RubricDimension(BaseModel):
    name: str
    descriptor: str


class ReviewItem(BaseModel):
    reviewer: str
    summary: str


class LessonDraftResponse(BaseModel):
    intentProfile: dict
    selectedCards: list[dict]
    scenarioBlocks: list[ScenarioBlock]
    rubricDimensions: list[RubricDimension]
    reviewItems: list[ReviewItem]
