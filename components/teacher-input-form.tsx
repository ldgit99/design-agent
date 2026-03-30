"use client";

import type { CSSProperties, FormEvent, ReactNode } from "react";
import { useState } from "react";
import {
  createDraftPlan,
  type LessonDraftRequest,
  type LessonDraftResponse,
} from "@/lib/api";

const defaultForm: LessonDraftRequest = {
  title: "",
  subject: "",
  gradeLevel: "",
  durationMinutes: 45,
  teacherPrompt: "",
  constraints: "",
};

export function TeacherInputForm() {
  const [form, setForm] = useState<LessonDraftRequest>(defaultForm);
  const [result, setResult] = useState<LessonDraftResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await createDraftPlan(form);
      setResult(response);
    } catch (error) {
      setError(error instanceof Error ? error.message : "요청 처리 중 오류가 발생했습니다.");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)",
        gap: 24,
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          background: "var(--panel)",
          border: "1px solid var(--line)",
          borderRadius: 28,
          padding: 24,
          display: "grid",
          gap: 16,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 24 }}>교사 입력</h2>
        <Field
          label="수업 제목"
          value={form.title}
          onChange={(value) => setForm((prev) => ({ ...prev, title: value }))}
          placeholder="예: 생성형 AI 활용 교육 현황 및 교수 경험 분석"
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 140px", gap: 12 }}>
          <Field
            label="교과"
            value={form.subject}
            onChange={(value) => setForm((prev) => ({ ...prev, subject: value }))}
            placeholder="예: 교육학"
          />
          <Field
            label="학년 또는 대상"
            value={form.gradeLevel}
            onChange={(value) => setForm((prev) => ({ ...prev, gradeLevel: value }))}
            placeholder="예: 예비교사"
          />
          <Field
            label="차시 시간"
            type="number"
            value={String(form.durationMinutes)}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, durationMinutes: Number(value || 0) }))
            }
            placeholder="45"
          />
        </div>
        <TextArea
          label="교사 프롬프트"
          value={form.teacherPrompt}
          onChange={(value) => setForm((prev) => ({ ...prev, teacherPrompt: value }))}
          placeholder="수업 목표, 활동 의도, AI를 어디까지 활용할지 자유롭게 적습니다."
        />
        <TextArea
          label="제약 조건"
          value={form.constraints}
          onChange={(value) => setForm((prev) => ({ ...prev, constraints: value }))}
          placeholder="시간, 도구, 평가 방식, 윤리적 제한 등을 적습니다."
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            height: 52,
            border: "none",
            borderRadius: 16,
            background: "var(--accent)",
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {isLoading ? "초안 생성 중..." : "초안 생성"}
        </button>
      </form>

      <aside
        style={{
          background: "#1f1b18",
          color: "#f7f1e8",
          borderRadius: 28,
          padding: 24,
          display: "grid",
          gap: 14,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 24 }}>응답 미리보기</h2>
        <p style={{ margin: 0, color: "#d5cabc", lineHeight: 1.6 }}>
          초안 생성 결과를 의도 프로필, 카드 추천, 시나리오, 루브릭, 검토 의견으로 분리해 보여줍니다.
        </p>
        {error ? <ResultBox title="오류">{error}</ResultBox> : null}
        {result ? (
          <>
            <ResultBox title="의도 프로필">
              <pre style={preStyle}>{JSON.stringify(result.intentProfile, null, 2)}</pre>
            </ResultBox>
            <ResultBox title="추천 카드">
              <pre style={preStyle}>{JSON.stringify(result.selectedCards, null, 2)}</pre>
            </ResultBox>
            <ResultBox title="시나리오 블록">
              <pre style={preStyle}>{JSON.stringify(result.scenarioBlocks, null, 2)}</pre>
            </ResultBox>
            <ResultBox title="루브릭 차원">
              <pre style={preStyle}>{JSON.stringify(result.rubricDimensions, null, 2)}</pre>
            </ResultBox>
            <ResultBox title="검토 의견">
              <pre style={preStyle}>{JSON.stringify(result.reviewItems, null, 2)}</pre>
            </ResultBox>
          </>
        ) : (
          <ResultBox title="상태">아직 생성 결과가 없습니다.</ResultBox>
        )}
      </aside>
    </section>
  );
}

const preStyle: CSSProperties = {
  margin: 0,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  fontSize: 13,
  lineHeight: 1.5,
};

function ResultBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section
      style={{
        padding: 16,
        borderRadius: 18,
        background: "rgba(255,255,255,0.06)",
        display: "grid",
        gap: 10,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 15, color: "#f2e4d5" }}>{title}</h3>
      <div>{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={{ fontSize: 14, fontWeight: 700 }}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={{
          height: 48,
          borderRadius: 14,
          border: "1px solid var(--line)",
          padding: "0 14px",
          background: "white",
        }}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={{ fontSize: 14, fontWeight: 700 }}>{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={6}
        style={{
          borderRadius: 18,
          border: "1px solid var(--line)",
          padding: 14,
          background: "white",
          resize: "vertical",
        }}
      />
    </label>
  );
}
