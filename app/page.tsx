import { ActivityBoard } from "@/components/activity-board";
import { TeacherInputForm } from "@/components/teacher-input-form";

const signals = [
  {
    label: "Flow",
    value: "카드 기반 시나리오",
    note: "도입, 전개, 정리 흐름을 한 화면에서 설계",
  },
  {
    label: "Review",
    value: "교육학 검토",
    note: "Pedagogy와 Safety 관점을 함께 확인",
  },
  {
    label: "Studio",
    value: "드래그 앤 드롭",
    note: "활동과 설계 카드를 직접 재배치하며 초안을 조정",
  },
];

export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Human-AI Orchestration Studio</p>
          <h1 className="hero-title">교사 주도 AI 수업 설계 대시보드</h1>
          <p className="hero-text">
            수업 목표와 제약 조건을 구조화하면 추천 카드, 시나리오, 루브릭, 검토 의견까지
            연결해서 보여주는 설계 워크스페이스입니다. 아래 보드에서 학습 활동과 설계 카드를
            직접 옮기며 차시 흐름을 빠르게 조정할 수 있습니다.
          </p>
        </div>
        <div className="hero-board">
          <div className="hero-board-head">
            <span className="status-dot" />
            <span>Active orchestration workspace</span>
          </div>
          <div className="signal-grid">
            {signals.map((signal) => (
              <article key={signal.label} className="signal-card">
                <p className="signal-label">{signal.label}</p>
                <strong className="signal-value">{signal.value}</strong>
                <p className="signal-note">{signal.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="overview-grid">
        <article className="overview-panel emphasis">
          <p className="overview-kicker">Current focus</p>
          <h2>Lesson Drafting Workflow</h2>
          <p>
            교사 입력에서 시작해 카드 추천, 시나리오 생성, 루브릭 설계, 검토 피드백까지 한
            흐름으로 연결합니다.
          </p>
        </article>
        <article className="overview-panel">
          <p className="overview-kicker">Reference direction</p>
          <h2>프로젝트 보드형 구성</h2>
          <p>
            상단 요약 보드와 좌우 분할 작업 공간, 그리고 드래그 앤 드롭 스튜디오를 조합해 설계
            과정이 바로 보이도록 정리했습니다.
          </p>
        </article>
        <article className="overview-panel">
          <p className="overview-kicker">Interaction mode</p>
          <h2>직접 배치하는 설계 화면</h2>
          <p>
            결과를 읽는 데서 끝나지 않고, 활동 카드와 설계 카드를 직접 옮기며 수업 흐름을
            손으로 조정할 수 있습니다.
          </p>
        </article>
      </section>

      <TeacherInputForm />
      <ActivityBoard />
    </main>
  );
}
