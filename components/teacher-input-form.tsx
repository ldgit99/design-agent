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

const quickNotes = [
  "교사의 최종 승인권을 유지합니다.",
  "카드 추천 이유와 제외 이유를 함께 남깁니다.",
  "AI 활용은 목표를 보조하는 범위로 제한합니다.",
];

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
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "요청 처리 중 오류가 발생했습니다.");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="workspace-grid">
      <div className="left-rail">
        <article className="stack-card dark">
          <div className="stack-card-head">
            <span className="badge badge-live">Live Draft</span>
            <span className="muted-label">Teacher Orchestration Input</span>
          </div>
          <h2>수업 설계 입력</h2>
          <p className="panel-text">
            목표, 학습자 수준, AI 활용 범위, 제약 조건을 입력하면 서버가 구조화된 초안과
            검토 결과를 반환합니다.
          </p>
          <ul className="check-list">
            {quickNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </article>

        <form className="stack-card form-card" onSubmit={onSubmit}>
          <div className="form-grid">
            <Field
              label="수업 제목"
              value={form.title}
              onChange={(value) => setForm((prev) => ({ ...prev, title: value }))}
              placeholder="예: 생성형 AI 활용 교육 현황 및 교수 경험 분석"
            />
            <div className="triple-grid">
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
              placeholder="수업 목표, 활동 의도, 생성형 AI를 어디까지 활용할지 구체적으로 입력합니다."
            />
            <TextArea
              label="제약 조건"
              value={form.constraints}
              onChange={(value) => setForm((prev) => ({ ...prev, constraints: value }))}
              placeholder="시간, 도구, 평가 방식, 안전성 또는 윤리 조건을 적습니다."
            />
          </div>

          <div className="submit-row">
            <div>
              <p className="submit-caption">현재 모드</p>
              <strong>{isLoading ? "초안 생성 중" : "구조화 초안 생성"}</strong>
            </div>
            <button className="primary-button" type="submit" disabled={isLoading}>
              {isLoading ? "생성 중..." : "초안 생성"}
            </button>
          </div>
        </form>
      </div>

      <aside className="right-rail">
        <article className="stack-card result-shell">
          <div className="stack-card-head">
            <span className="badge">Structured Output</span>
            <span className="muted-label">Intent · Cards · Scenario · Rubric</span>
          </div>
          <h2>응답 보드</h2>
          <p className="panel-text">
            결과를 해석하기 쉬운 카드 묶음으로 나눠 보여줍니다. 이후 단계에서는 여기서 카드
            선택 수정과 루브릭 비교까지 확장할 수 있습니다.
          </p>

          {error ? <ResultBox title="오류" tone="warn">{error}</ResultBox> : null}

          {result ? (
            <div className="result-grid">
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
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-title">아직 생성된 초안이 없습니다.</p>
              <p className="empty-text">
                좌측 입력 패널에서 수업 주제와 제약을 입력하면, 여기서 구조화된 결과를 바로
                확인할 수 있습니다.
              </p>
            </div>
          )}
        </article>
      </aside>
    </section>
  );
}

const preStyle: CSSProperties = {
  margin: 0,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  fontSize: 12,
  lineHeight: 1.6,
  color: "var(--ink)",
};

function ResultBox({
  title,
  children,
  tone = "default",
}: {
  title: string;
  children: ReactNode;
  tone?: "default" | "warn";
}) {
  return (
    <section className={`result-box${tone === "warn" ? " result-box-warn" : ""}`}>
      <div className="result-box-head">
        <h3>{title}</h3>
      </div>
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
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
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
    <label className="field">
      <span>{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={6}
      />
    </label>
  );
}
