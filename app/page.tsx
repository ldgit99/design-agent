import { TeacherInputForm } from "@/components/teacher-input-form";

const signals = [
  { label: "Flow", value: "카드 기반 시나리오", note: "도입 · 전개 · 정리 흐름 자동 구성" },
  { label: "Review", value: "교육학 검토", note: "Pedagogy · Safety 이중 점검" },
  { label: "Deploy", value: "GitHub + Vercel", note: "실험 브랜치와 운영 배포 분리" },
];

export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Human-AI Orchestration Studio</p>
          <h1 className="hero-title">교사 중심 AI 수업 설계 대시보드</h1>
          <p className="hero-text">
            수업 목표와 제약 조건을 구조화하고, 카드 추천, 시나리오 생성, 루브릭 설계,
            검토 의견까지 한 화면에서 연결하는 설계 워크스페이스입니다.
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
            교사 입력을 시작점으로 삼고, Intent Parser, Card Curator, Scenario Composer,
            Reviewer를 거쳐 최종 승인안까지 이어지는 흐름을 기준으로 화면을 구성합니다.
          </p>
        </article>
        <article className="overview-panel">
          <p className="overview-kicker">Reference direction</p>
          <h2>프로젝트 보드형 정보 구조</h2>
          <p>
            큰 헤드라인, 밀도 있는 상태 카드, 좌우 작업 분할, 결과 패널의 계층적 그룹핑을
            중심으로 재구성했습니다.
          </p>
        </article>
        <article className="overview-panel">
          <p className="overview-kicker">Output mode</p>
          <h2>구조화된 결과 뷰</h2>
          <p>
            결과를 raw JSON 한 덩어리로 보지 않고, 의도 프로필, 카드, 시나리오, 루브릭,
            검토 의견으로 분리해 읽기 쉽게 배치합니다.
          </p>
        </article>
      </section>

      <TeacherInputForm />
    </main>
  );
}
