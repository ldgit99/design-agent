"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
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
  "추천 카드와 검토 의견을 함께 보여줍니다.",
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

  const intentEntries = useMemo(
    () => (result ? Object.entries(result.intentProfile) : []),
    [result],
  );

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
              placeholder="예: 중학교 2학년 국어, 생성형 AI로 기사문 요약과 비교 읽기"
            />
            <div className="triple-grid">
              <Field
                label="교과"
                value={form.subject}
                onChange={(value) => setForm((prev) => ({ ...prev, subject: value }))}
                placeholder="예: 국어"
              />
              <Field
                label="학년 또는 대상"
                value={form.gradeLevel}
                onChange={(value) => setForm((prev) => ({ ...prev, gradeLevel: value }))}
                placeholder="예: 중학교 2학년"
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
              placeholder="학생들이 기사문의 핵심 내용을 파악하고, 생성형 AI가 만든 요약과 직접 쓴 요약을 비교해 차이를 설명하도록 하는 수업을 만들고 싶습니다. AI는 초안 비교용으로만 사용하고 최종 판단은 학생이 하게 하고 싶습니다."
            />
            <TextArea
              label="제약 조건"
              value={form.constraints}
              onChange={(value) => setForm((prev) => ({ ...prev, constraints: value }))}
              placeholder="45분 수업, 4인 모둠 활동, 학교 계정으로만 AI 사용, 개인정보 입력 금지, 형성평가 중심으로 진행합니다."
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
            결과를 읽기 쉬운 카드 레이아웃으로 나눠 보여줍니다. 다음 단계에서는 여기서 직접
            카드 교체와 시나리오 수정을 지원할 수 있습니다.
          </p>

          {error ? <MessageBox title="오류" tone="warn" body={error} /> : null}

          {result ? (
            <div className="result-grid">
              <section className="result-box">
                <div className="result-box-head">
                  <h3>의도 프로필</h3>
                </div>
                <div className="kv-grid">
                  {intentEntries.map(([key, value]) => (
                    <div className="kv-card" key={key}>
                      <p className="kv-key">{formatKey(key)}</p>
                      <strong className="kv-value">{formatValue(value)}</strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className="result-box">
                <div className="result-box-head">
                  <h3>추천 카드</h3>
                </div>
                <div className="mini-card-grid">
                  {result.selectedCards.map((card, index) => (
                    <article className="mini-card" key={String(card.id ?? index)}>
                      <div className="mini-card-top">
                        <span className="mini-badge">{String(card.category ?? "card")}</span>
                        <span className="mini-index">{index + 1}</span>
                      </div>
                      <strong>{formatValue(card.title)}</strong>
                      <p>{formatValue(card.summary ?? card.phase ?? "")}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="result-box">
                <div className="result-box-head">
                  <h3>시나리오 블록</h3>
                </div>
                <div className="timeline">
                  {result.scenarioBlocks.map((block, index) => (
                    <article className="timeline-card" key={`${block.phase}-${index}`}>
                      <div className="timeline-head">
                        <div>
                          <p className="timeline-phase">{block.phase}</p>
                          <strong>{block.durationMinutes}분</strong>
                        </div>
                        <span className="mini-badge">{index + 1} step</span>
                      </div>
                      <dl className="timeline-meta">
                        <div>
                          <dt>교사</dt>
                          <dd>{block.teacherActions}</dd>
                        </div>
                        <div>
                          <dt>학생</dt>
                          <dd>{block.studentActions}</dd>
                        </div>
                        <div>
                          <dt>AI</dt>
                          <dd>{block.aiActions}</dd>
                        </div>
                      </dl>
                    </article>
                  ))}
                </div>
              </section>

              <section className="result-box">
                <div className="result-box-head">
                  <h3>루브릭 차원</h3>
                </div>
                <div className="pill-list">
                  {result.rubricDimensions.map((item) => (
                    <article className="pill-card" key={item.name}>
                      <strong>{item.name}</strong>
                      <p>{item.descriptor}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="result-box">
                <div className="result-box-head">
                  <h3>검토 의견</h3>
                </div>
                <div className="review-list">
                  {result.reviewItems.map((item, index) => (
                    <article className="review-card" key={`${item.reviewer}-${index}`}>
                      <p className="reviewer-name">{item.reviewer}</p>
                      <p className="review-summary">{item.summary}</p>
                    </article>
                  ))}
                </div>
              </section>
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

function MessageBox({
  title,
  body,
  tone = "default",
}: {
  title: string;
  body: string;
  tone?: "default" | "warn";
}) {
  return (
    <section className={`result-box${tone === "warn" ? " result-box-warn" : ""}`}>
      <div className="result-box-head">
        <h3>{title}</h3>
      </div>
      <p className="message-body">{body}</p>
    </section>
  );
}

function formatKey(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/^./, (char) => char.toUpperCase());
}

function formatValue(value: unknown) {
  if (typeof value === "string") return value || "-";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value == null) return "-";
  return JSON.stringify(value);
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
