import cards from "@/data/cards.json";

export type LessonDraftInput = {
  title: string;
  subject: string;
  gradeLevel: string;
  durationMinutes: number;
  teacherPrompt: string;
  constraints: string;
};

export type LessonDraftOutput = {
  intentProfile: Record<string, unknown>;
  selectedCards: Array<Record<string, unknown>>;
  scenarioBlocks: Array<{
    phase: string;
    durationMinutes: number;
    teacherActions: string;
    studentActions: string;
    aiActions: string;
  }>;
  rubricDimensions: Array<{
    name: string;
    descriptor: string;
  }>;
  reviewItems: Array<{
    reviewer: string;
    summary: string;
  }>;
};

export async function generateLessonDraft(input: LessonDraftInput): Promise<LessonDraftOutput> {
  const normalized = normalizeInput(input);

  if (!process.env.OPENAI_API_KEY) {
    return buildFallbackDraft(normalized);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.4",
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text:
                  "You are a teacher-centered lesson design orchestrator. Return only valid JSON. Keep teacher approval explicit, bound AI usage carefully, align activities with rubric dimensions, and preserve selected card metadata.",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: JSON.stringify(
                  {
                    teacherInput: normalized,
                    availableCards: cards,
                    requiredKeys: [
                      "intentProfile",
                      "selectedCards",
                      "scenarioBlocks",
                      "rubricDimensions",
                      "reviewItems",
                    ],
                  },
                  null,
                  2,
                ),
              },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "lesson_draft",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                intentProfile: {
                  type: "object",
                  additionalProperties: true,
                },
                selectedCards: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: true,
                  },
                },
                scenarioBlocks: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      phase: { type: "string" },
                      durationMinutes: { type: "integer" },
                      teacherActions: { type: "string" },
                      studentActions: { type: "string" },
                      aiActions: { type: "string" },
                    },
                    required: [
                      "phase",
                      "durationMinutes",
                      "teacherActions",
                      "studentActions",
                      "aiActions",
                    ],
                  },
                },
                rubricDimensions: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      name: { type: "string" },
                      descriptor: { type: "string" },
                    },
                    required: ["name", "descriptor"],
                  },
                },
                reviewItems: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      reviewer: { type: "string" },
                      summary: { type: "string" },
                    },
                    required: ["reviewer", "summary"],
                  },
                },
              },
              required: [
                "intentProfile",
                "selectedCards",
                "scenarioBlocks",
                "rubricDimensions",
                "reviewItems",
              ],
            },
          },
        },
      }),
    });

    if (!response.ok) {
      return buildFallbackDraft(normalized);
    }

    const payload = (await response.json()) as {
      output_text?: string;
    };

    if (!payload.output_text) {
      return buildFallbackDraft(normalized);
    }

    return JSON.parse(payload.output_text) as LessonDraftOutput;
  } catch {
    return buildFallbackDraft(normalized);
  }
}

function normalizeInput(input: LessonDraftInput): LessonDraftInput {
  return {
    title: input.title || "",
    subject: input.subject || "",
    gradeLevel: input.gradeLevel || "",
    durationMinutes: Number.isFinite(input.durationMinutes) ? input.durationMinutes : 45,
    teacherPrompt: input.teacherPrompt || "",
    constraints: input.constraints || "",
  };
}

function buildFallbackDraft(input: LessonDraftInput): LessonDraftOutput {
  return {
    intentProfile: {
      title: input.title,
      subject: input.subject,
      gradeLevel: input.gradeLevel,
      durationMinutes: input.durationMinutes,
      teacherPrompt: input.teacherPrompt,
      constraints: input.constraints,
      assessmentMode: "formative",
      aiUsageMode: "bounded-support",
    },
    selectedCards: cards,
    scenarioBlocks: [
      {
        phase: "도입",
        durationMinutes: 10,
        teacherActions: "수업 목표와 생성형 AI 활용 규칙을 설명하고 학습 맥락을 제시한다.",
        studentActions: "문제의식을 공유하고 오늘 활동의 기대 결과를 확인한다.",
        aiActions: "도입 질문 또는 비교용 예시 응답 초안을 제공한다.",
      },
      {
        phase: "전개",
        durationMinutes: Math.max(input.durationMinutes - 20, 15),
        teacherActions: "카드 활동을 운영하고 팀별 탐구와 비교 토론을 조정한다.",
        studentActions: "AI 응답을 검토하고 협업 기반 분석 또는 설계를 수행한다.",
        aiActions: "추가 질문, 비교 관점, 예시 응답 초안을 제안한다.",
      },
      {
        phase: "정리",
        durationMinutes: 10,
        teacherActions: "핵심 학습 내용과 AI 활용의 한계를 정리한다.",
        studentActions: "배운 점과 주의점을 성찰하고 다음 활동으로 연결한다.",
        aiActions: "성찰 질문과 정리 문장 초안을 제공한다.",
      },
    ],
    rubricDimensions: [
      {
        name: "Flow",
        descriptor: "활동 흐름이 목표와 시간 구조에 맞게 정렬되어 있는가",
      },
      {
        name: "AI Use",
        descriptor: "AI 활용이 학습 목표를 지원하고 과도하지 않은가",
      },
      {
        name: "Engagement",
        descriptor: "학생 참여와 협업을 촉진하는가",
      },
    ],
    reviewItems: [
      {
        reviewer: "Pedagogy Reviewer",
        summary: "목표-활동 연결은 양호하지만 학생 산출물 예시를 더 구체화하면 좋다.",
      },
      {
        reviewer: "Safety Reviewer",
        summary: "학생 개인정보 입력 금지와 AI 응답 검증 책임을 명시해야 한다.",
      },
    ],
  };
}
