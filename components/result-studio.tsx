"use client";

import type { DragEventHandler, ReactNode } from "react";
import { useMemo, useState } from "react";
import type { LessonDraftResponse } from "@/lib/api";

type StudioCardType = "card" | "rubric" | "review";

type StudioCard = {
  id: string;
  type: StudioCardType;
  title: string;
  body: string;
  meta: string;
};

type ZoneKey = "mustUse" | "consider" | "revise";

const zones: Array<{ key: ZoneKey; title: string; subtitle: string }> = [
  {
    key: "mustUse",
    title: "이번 차시에 바로 반영",
    subtitle: "핵심 활동, 필수 평가, 반드시 유지할 설계 요소",
  },
  {
    key: "consider",
    title: "조건 보고 선택",
    subtitle: "시간과 학급 상황에 따라 넣거나 뺄 수 있는 요소",
  },
  {
    key: "revise",
    title: "수정 후 반영",
    subtitle: "표현, 난이도, 안전성 기준을 다시 손봐야 하는 요소",
  },
];

export function ResultStudio({ result }: { result: LessonDraftResponse }) {
  const cards = useMemo(() => buildStudioCards(result), [result]);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [zoneLayout, setZoneLayout] = useState<Record<ZoneKey, string[]>>({
    mustUse: [],
    consider: [],
    revise: [],
  });

  const placedIds = useMemo(() => new Set(Object.values(zoneLayout).flat()), [zoneLayout]);
  const backlogCards = cards.filter((card) => !placedIds.has(card.id));

  function moveCard(cardId: string, nextZone: ZoneKey) {
    setZoneLayout((current) => {
      const stripped = {
        mustUse: current.mustUse.filter((id) => id !== cardId),
        consider: current.consider.filter((id) => id !== cardId),
        revise: current.revise.filter((id) => id !== cardId),
      };

      return {
        ...stripped,
        [nextZone]: [...stripped[nextZone], cardId],
      };
    });
  }

  function removeCard(cardId: string) {
    setZoneLayout((current) => ({
      mustUse: current.mustUse.filter((id) => id !== cardId),
      consider: current.consider.filter((id) => id !== cardId),
      revise: current.revise.filter((id) => id !== cardId),
    }));
  }

  return (
    <section className="result-box studio-box">
      <div className="result-box-head">
        <h3>설계 카드 스튜디오</h3>
      </div>
      <p className="panel-text">
        추천 카드, 루브릭, 검토 의견을 직접 끌어다 놓으면서 이번 차시에 바로 쓸 요소와 수정이
        필요한 요소를 구분할 수 있습니다.
      </p>

      <div className="studio-grid">
        <aside className="studio-backlog">
          <div className="stack-card-head">
            <span className="badge">Backlog</span>
            <span className="muted-label">Design Cards</span>
          </div>
          <div className="studio-card-list">
            {backlogCards.map((card) => (
              <StudioCardView
                key={card.id}
                card={card}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData("text/plain", card.id);
                  setActiveCardId(card.id);
                }}
                onDragEnd={() => setActiveCardId(null)}
              />
            ))}
            {backlogCards.length === 0 ? (
              <div className="palette-empty">모든 설계 카드가 작업 영역으로 이동했습니다.</div>
            ) : null}
          </div>
        </aside>

        <div className="studio-zones">
          {zones.map((zone) => (
            <section
              key={zone.key}
              className="studio-zone"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                const cardId = event.dataTransfer.getData("text/plain") || activeCardId;
                if (!cardId) return;
                moveCard(cardId, zone.key);
                setActiveCardId(null);
              }}
            >
              <div className="lane-head">
                <div>
                  <p className="lane-title">{zone.title}</p>
                  <p className="lane-subtitle">{zone.subtitle}</p>
                </div>
                <span className="lane-count">{zoneLayout[zone.key].length}</span>
              </div>

              <div className="studio-card-list">
                {zoneLayout[zone.key].map((cardId) => {
                  const card = cards.find((item) => item.id === cardId);
                  if (!card) return null;
                  return (
                    <StudioCardView
                      key={card.id}
                      card={card}
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.setData("text/plain", card.id);
                        setActiveCardId(card.id);
                      }}
                      onDragEnd={() => setActiveCardId(null)}
                      action={
                        <button
                          type="button"
                          className="lane-remove"
                          onClick={() => removeCard(card.id)}
                        >
                          제거
                        </button>
                      }
                    />
                  );
                })}
                {zoneLayout[zone.key].length === 0 ? (
                  <div className="lane-empty">여기로 설계 카드를 끌어오세요.</div>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

function buildStudioCards(result: LessonDraftResponse): StudioCard[] {
  const selectedCards = result.selectedCards.map((card, index) => ({
    id: `selected-${String(card.id ?? index)}`,
    type: "card" as const,
    title: formatAny(card.title) || `추천 카드 ${index + 1}`,
    body: formatAny(card.summary) || formatAny(card.phase) || "추천 이유 없음",
    meta: String(card.category ?? "추천 카드"),
  }));

  const rubricCards = result.rubricDimensions.map((item, index) => ({
    id: `rubric-${index}`,
    type: "rubric" as const,
    title: item.name,
    body: item.descriptor,
    meta: "루브릭",
  }));

  const reviewCards = result.reviewItems.map((item, index) => ({
    id: `review-${index}`,
    type: "review" as const,
    title: item.reviewer,
    body: item.summary,
    meta: "검토 의견",
  }));

  return [...selectedCards, ...rubricCards, ...reviewCards];
}

function formatAny(value: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value == null) return "";
  return JSON.stringify(value);
}

function StudioCardView({
  card,
  draggable,
  onDragStart,
  onDragEnd,
  action,
}: {
  card: StudioCard;
  draggable?: boolean;
  onDragStart?: DragEventHandler<HTMLElement>;
  onDragEnd?: DragEventHandler<HTMLElement>;
  action?: ReactNode;
}) {
  return (
    <article
      className={`studio-card studio-card-${card.type}`}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="mini-card-top">
        <span className="mini-badge">{card.meta}</span>
        {action ?? <span className="mini-index">drag</span>}
      </div>
      <strong>{card.title}</strong>
      <p>{card.body}</p>
    </article>
  );
}
