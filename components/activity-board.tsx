"use client";

import { useMemo, useState } from "react";

type ActivityCard = {
  id: string;
  title: string;
  category: string;
  note: string;
};

type LaneKey = "intro" | "explore" | "closing";

const cardPool: ActivityCard[] = [
  {
    id: "activity-1",
    title: "기사문 핵심 문장 찾기",
    category: "읽기",
    note: "도입에서 학습 문제와 읽기 초점을 빠르게 공유합니다.",
  },
  {
    id: "activity-2",
    title: "AI 요약과 직접 요약 비교",
    category: "비교",
    note: "전개 단계에서 차이와 근거를 분석합니다.",
  },
  {
    id: "activity-3",
    title: "모둠별 기준 만들기",
    category: "협업",
    note: "좋은 요약의 기준을 팀별로 정리합니다.",
  },
  {
    id: "activity-4",
    title: "성찰 질문 카드",
    category: "정리",
    note: "AI 활용의 장점과 한계를 정리합니다.",
  },
  {
    id: "activity-5",
    title: "형성평가 체크",
    category: "평가",
    note: "배운 내용을 스스로 점검하고 바로 피드백합니다.",
  },
];

const lanes: Array<{ key: LaneKey; title: string; subtitle: string }> = [
  { key: "intro", title: "도입", subtitle: "문제 인식, 목표, 규칙 제시" },
  { key: "explore", title: "전개", subtitle: "탐구, 비교, 협업, 분석 활동" },
  { key: "closing", title: "정리", subtitle: "성찰, 공유, 형성평가 마무리" },
];

const initialLayout: Record<LaneKey, string[]> = {
  intro: ["activity-1"],
  explore: ["activity-2", "activity-3"],
  closing: ["activity-4", "activity-5"],
};

export function ActivityBoard() {
  const [layout, setLayout] = useState<Record<LaneKey, string[]>>(initialLayout);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const availableCards = useMemo(() => {
    const used = new Set(Object.values(layout).flat());
    return cardPool.filter((card) => !used.has(card.id));
  }, [layout]);

  function moveCard(cardId: string, nextLane: LaneKey) {
    setLayout((current) => {
      const stripped = {
        intro: current.intro.filter((id) => id !== cardId),
        explore: current.explore.filter((id) => id !== cardId),
        closing: current.closing.filter((id) => id !== cardId),
      };

      return {
        ...stripped,
        [nextLane]: [...stripped[nextLane], cardId],
      };
    });
  }

  function removeCard(cardId: string) {
    setLayout((current) => ({
      intro: current.intro.filter((id) => id !== cardId),
      explore: current.explore.filter((id) => id !== cardId),
      closing: current.closing.filter((id) => id !== cardId),
    }));
  }

  return (
    <section className="board-shell">
      <div className="board-header">
        <div>
          <p className="overview-kicker">Activity studio</p>
          <h2 className="board-title">드래그 앤 드롭 학습 활동 보드</h2>
          <p className="panel-text">
            왼쪽 팔레트의 활동 카드를 차시 흐름 보드로 끌어다 놓고, 필요하면 다른 구간으로
            옮겨 수업 구조를 바로 수정할 수 있습니다.
          </p>
        </div>
        <div className="board-summary">
          <strong>{Object.values(layout).flat().length} activities placed</strong>
          <span>활동 카드를 직접 배치하면서 수업 시퀀스를 빠르게 조정합니다.</span>
        </div>
      </div>

      <div className="board-grid">
        <aside className="palette-panel">
          <div className="stack-card-head">
            <span className="badge">Palette</span>
            <span className="muted-label">Activity Cards</span>
          </div>
          <div className="palette-list">
            {availableCards.map((card) => (
              <PaletteCard
                key={card.id}
                card={card}
                onDragStart={() => setActiveCardId(card.id)}
                onDragEnd={() => setActiveCardId(null)}
              />
            ))}
            {availableCards.length === 0 ? (
              <div className="palette-empty">모든 활동 카드가 보드에 배치되었습니다.</div>
            ) : null}
          </div>
        </aside>

        <div className="lane-grid">
          {lanes.map((lane) => (
            <section
              key={lane.key}
              className="lane-panel"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                const cardId = event.dataTransfer.getData("text/plain") || activeCardId;
                if (!cardId) return;
                moveCard(cardId, lane.key);
                setActiveCardId(null);
              }}
            >
              <div className="lane-head">
                <div>
                  <p className="lane-title">{lane.title}</p>
                  <p className="lane-subtitle">{lane.subtitle}</p>
                </div>
                <span className="lane-count">{layout[lane.key].length}</span>
              </div>

              <div className="lane-cards">
                {layout[lane.key].map((cardId) => {
                  const card = cardPool.find((item) => item.id === cardId);
                  if (!card) return null;
                  return (
                    <article
                      key={card.id}
                      className="lane-card"
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.setData("text/plain", card.id);
                        setActiveCardId(card.id);
                      }}
                      onDragEnd={() => setActiveCardId(null)}
                    >
                      <div className="mini-card-top">
                        <span className="mini-badge">{card.category}</span>
                        <button
                          type="button"
                          className="lane-remove"
                          onClick={() => removeCard(card.id)}
                        >
                          제거
                        </button>
                      </div>
                      <strong>{card.title}</strong>
                      <p>{card.note}</p>
                    </article>
                  );
                })}
                {layout[lane.key].length === 0 ? (
                  <div className="lane-empty">여기로 활동 카드를 끌어오세요.</div>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

function PaletteCard({
  card,
  onDragStart,
  onDragEnd,
}: {
  card: ActivityCard;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  return (
    <article
      className="palette-card"
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", card.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
    >
      <div className="mini-card-top">
        <span className="mini-badge">{card.category}</span>
        <span className="mini-index">drag</span>
      </div>
      <strong>{card.title}</strong>
      <p>{card.note}</p>
    </article>
  );
}
