import { TeacherInputForm } from "@/components/teacher-input-form";

export default function HomePage() {
  return (
    <main style={{ padding: "40px 24px 64px" }}>
      <section
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "grid",
          gap: 24,
        }}
      >
        <header
          style={{
            background: "var(--panel)",
            border: "1px solid var(--line)",
            borderRadius: 28,
            padding: 28,
            boxShadow: "0 18px 48px rgba(31, 27, 24, 0.08)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "var(--accent)",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Human-AI Orchestration
          </p>
          <h1 style={{ margin: "12px 0 8px", fontSize: 40, lineHeight: 1.1 }}>
            AI 수업 설계 에이전트
          </h1>
          <p style={{ margin: 0, maxWidth: 760, color: "var(--muted)", fontSize: 17, lineHeight: 1.6 }}>
            교사의 수업 목표와 제약을 구조화하고, 카드 추천, 시나리오 생성, 루브릭 설계,
            검토 단계를 통해 최종 수업 설계를 지원하는 대시보드의 초기 골격입니다.
          </p>
        </header>

        <TeacherInputForm />
      </section>
    </main>
  );
}
