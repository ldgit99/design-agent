export type LessonDraftRequest = {
  title: string;
  subject: string;
  gradeLevel: string;
  durationMinutes: number;
  teacherPrompt: string;
  constraints: string;
};

export type ScenarioBlock = {
  phase: string;
  durationMinutes: number;
  teacherActions: string;
  studentActions: string;
  aiActions: string;
};

export type RubricDimension = {
  name: string;
  descriptor: string;
};

export type ReviewItem = {
  reviewer: string;
  summary: string;
};

export type LessonDraftResponse = {
  intentProfile: Record<string, unknown>;
  selectedCards: Array<Record<string, unknown>>;
  scenarioBlocks: ScenarioBlock[];
  rubricDimensions: RubricDimension[];
  reviewItems: ReviewItem[];
};

export async function createDraftPlan(payload: LessonDraftRequest): Promise<LessonDraftResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";
  const response = await fetch(`${baseUrl}/api/lesson/draft`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
}
