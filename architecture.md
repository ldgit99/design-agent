# Human-AI Orchestration Lesson Design Agent Architecture

## 1. 목적

이 시스템의 목적은 생성형 AI가 교사의 수업 설계를 대체하는 것이 아니라, 교사가 더 정교하게 설계하고 검토할 수 있도록 지원하는 것이다. 시스템은 교사 입력을 구조화하고, 카드 기반 설계 자원을 검색하며, 수업 시나리오와 루브릭을 생성하고, 검토 에이전트와 교사 승인 단계를 거쳐 최종 설계안을 확정한다.

핵심 원칙은 다음과 같다.

- 교사가 최종 승인자다.
- AI는 설명 가능한 제안자이자 검토 보조자다.
- 카드, 시나리오, 루브릭은 구조화된 데이터로 저장한다.
- 멀티에이전트 구조와 검증 루프를 기본 운영 방식으로 삼는다.

---

## 2. 시스템 범위

### 포함 범위

- 교사 입력 수집
- 의도 추출과 구조화
- 카드 검색 및 추천
- 수업 시나리오 생성
- 루브릭 생성
- 교육학적 및 윤리적 검토
- 교사 수정과 승인
- 버전 저장 및 로그 기록

### 제외 범위

- 학생용 실시간 학습 앱 전체 구현
- LMS 전체 대체
- 자동 채점 시스템 전체 구현
- 학생 개인정보 기반 개인화 추천의 과도한 확장

---

## 3. 사용자와 역할

### 교사

- 수업 목표와 조건을 입력한다.
- 추천 카드와 시나리오를 검토한다.
- 수정, 교체, 삭제, 승인 결정을 내린다.

### 연구자 또는 운영자

- 카드 라이브러리와 하네스 문서를 관리한다.
- 검증 기준과 실험 조건을 업데이트한다.
- 로그와 품질 지표를 분석한다.

### AI 에이전트

- 입력을 해석하고 설계 초안을 생성한다.
- 카드와 시나리오를 연결한다.
- 루브릭과 검토 의견을 생성한다.

---

## 4. 권장 기술 스택

### 프론트엔드

- Next.js
- TypeScript
- Tailwind CSS 또는 토큰 기반 디자인 시스템

### 백엔드

- FastAPI
- Python 3.11+

### 데이터 저장

- PostgreSQL 또는 MongoDB
- Vector DB for 카드 검색 및 유사 시나리오 검색

### AI 계층

- OpenAI Responses API
- 서버 측 함수 호출

### 배포

- GitHub
- Vercel

---

## 5. 상위 구조

시스템은 아래 계층으로 나눈다.

1. Presentation Layer
2. API Layer
3. Orchestration Layer
4. Agent Layer
5. Retrieval and Storage Layer
6. Verification Layer

### 5.1 Presentation Layer

교사가 실제로 사용하는 인터페이스다.

- 프로젝트 생성 화면
- 수업 설계 입력 폼
- 카드 추천 패널
- 시나리오 편집기
- 루브릭 검토 패널
- 승인 및 버전 비교 화면

### 5.2 API Layer

프론트엔드와 오케스트레이션 엔진 사이의 경계 계층이다.

주요 엔드포인트 예시는 다음과 같다.

- `POST /api/projects`
- `POST /api/intent/parse`
- `POST /api/cards/recommend`
- `POST /api/scenario/generate`
- `POST /api/rubric/generate`
- `POST /api/review/pedagogy`
- `POST /api/review/safety`
- `POST /api/plan/finalize`
- `GET /api/projects/{id}`

### 5.3 Orchestration Layer

이 시스템의 핵심 운영 계층이다. 각 에이전트 호출 순서, 실패 시 재시도, 검토 실패 후 되돌림, 교사 수정 반영 범위를 관리한다.

오케스트레이션 엔진은 다음 상태 전이를 관리해야 한다.

- `draft`
- `intent_parsed`
- `cards_selected`
- `scenario_generated`
- `rubric_generated`
- `reviewed`
- `teacher_revised`
- `finalized`

### 5.4 Agent Layer

역할별 에이전트를 분리해 운용한다.

- Planner
- Intent Parser
- Card Curator
- Scenario Composer
- Rubric Generator
- Pedagogy Reviewer
- Safety Reviewer

### 5.5 Retrieval and Storage Layer

구조화 데이터와 검색 데이터를 분리해 관리한다.

- 카드 메타데이터 저장소
- 시나리오 버전 저장소
- 루브릭 저장소
- 리뷰 로그 저장소
- 유사 시나리오 검색용 벡터 저장소

### 5.6 Verification Layer

생성 결과를 다차원 기준으로 판정한다.

- 형식 검증
- 교육학 검토
- 윤리 검토
- 데이터 보호 검토
- 배포 전 기술 검증

---

## 6. 멀티에이전트 파이프라인

권장 실행 흐름은 아래와 같다.

`Teacher Input -> Planner -> Intent Parser -> Card Curator -> Scenario Composer -> Rubric Generator -> Pedagogy Reviewer -> Safety Reviewer -> Teacher Revision -> Finalize`

### 6.1 각 에이전트 입력과 출력

#### Planner

입력:
- 교사 자유 입력
- 학년
- 교과
- 차시 길이
- 제약 조건

출력:
- 설계 계획 객체
- 필요한 카드 범주 목록
- 검토 필요 항목

#### Intent Parser

입력:
- 교사 입력
- Planner 계획 객체

출력:
- `intent_profile`
- 신뢰도 점수
- 누락 정보 플래그

#### Card Curator

입력:
- `intent_profile`
- 카드 라이브러리
- 유사 시나리오 검색 결과

출력:
- `selected_cards`
- 추천 이유
- 제외 이유
- 위험 카드 플래그

#### Scenario Composer

입력:
- `selected_cards`
- 차시 정보

출력:
- `scenario_blocks`
- 교사 개입 포인트
- 예상 학습자 활동

#### Rubric Generator

입력:
- `scenario_blocks`
- `intent_profile`

출력:
- `rubric_dimensions`
- 항목별 수준 기술
- 활동-평가 연결 설명

#### Pedagogy Reviewer

입력:
- 시나리오
- 루브릭
- 학년 및 과목 맥락

출력:
- 교육학적 강점
- 수정 권고
- 정렬성 위험 플래그

#### Safety Reviewer

입력:
- 시나리오
- 카드
- AI 사용 계획

출력:
- 개인정보 위험
- 과도한 자동화 위험
- AI 의존도 위험

---

## 7. 데이터 모델 초안

### Project

- `id`
- `title`
- `subject`
- `grade_level`
- `teacher_id`
- `status`
- `created_at`
- `updated_at`

### TeacherInput

- `project_id`
- `raw_prompt`
- `constraints`
- `duration_minutes`
- `target_competencies`

### IntentProfile

- `project_id`
- `learning_goals`
- `activity_preferences`
- `assessment_type`
- `ai_usage_mode`
- `confidence_score`

### Card

- `id`
- `title`
- `prompt`
- `category`
- `phase`
- `difficulty`
- `agency_target`
- `risk_tags`
- `rubric_links`

### SelectedCard

- `project_id`
- `card_id`
- `reason_selected`
- `reason_rejected_alternatives`
- `rank`

### ScenarioBlock

- `id`
- `project_id`
- `phase`
- `duration_minutes`
- `teacher_actions`
- `student_actions`
- `ai_actions`
- `materials`

### RubricDimension

- `id`
- `project_id`
- `dimension_name`
- `level_1`
- `level_2`
- `level_3`
- `level_4`

### ReviewLog

- `id`
- `project_id`
- `review_type`
- `reviewer`
- `summary`
- `risk_flags`
- `created_at`

---

## 8. OpenAI API 활용 방식

OpenAI는 다음 책임 범위로 제한한다.

- 자연어 입력 구조화
- 카드 추천 설명 생성
- 시나리오 생성
- 루브릭 생성
- 검토 초안 생성

모든 호출은 서버 측에서만 수행한다.

권장 도구 함수는 다음과 같다.

- `search_cards`
- `get_card_detail`
- `retrieve_similar_scenarios`
- `validate_plan_schema`
- `save_review_log`

응답은 가능한 한 구조화된 JSON으로 받는다.

핵심 출력 구조는 다음과 같다.

- `intent_profile`
- `selected_cards`
- `scenario_blocks`
- `teacher_checkpoints`
- `rubric_dimensions`
- `risk_flags`

---

## 9. GitHub 및 브랜치 운영

권장 브랜치 전략:

- `main`
- `develop`
- `feature/*`
- `experiment/*`

권장 PR 점검 항목:

- 테스트 통과
- 타입과 린트 통과
- API 스키마 변화 검토
- 카드 및 루브릭 포맷 변화 검토
- 민감 정보 노출 여부 확인

---

## 10. Vercel 배포 구조

### 배포 대상

- Next.js 프론트엔드
- FastAPI API 엔드포인트

### 환경 변수

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `DATABASE_URL`
- `VECTOR_DB_URL`
- `VECTOR_DB_API_KEY`
- `APP_ENV`

### 환경 분리

- Development
- Preview
- Production

Preview 환경은 기능 브랜치 검증과 연구 실험 분리에 사용한다.

---

## 11. 검증 체크포인트

### 기술 검증

- API 스키마 유효성
- 테스트 통과
- 오류 로그 확인

### 교육학 검증

- 학습목표-활동-평가 정렬
- 교사 통제감 보장
- 학생 수준 적합성

### 윤리 검증

- 학생 데이터 최소 수집
- 설명 가능한 AI 사용
- 과도한 자동화 방지

---

## 12. 1차 구현 우선순위

### MVP

- 교사 입력 UI
- intent parsing API
- 카드 검색 API
- 시나리오 생성 API
- 루브릭 생성 API
- 교사 승인 UI

### 그다음 단계

- 리뷰 로그 저장
- 실험 버전 비교
- 유사 시나리오 검색
- 에이전트별 재실행 제어

---

## 13. 향후 문서 연결

이 문서는 다음 문서와 함께 운영한다.

- [research.md](D:\OneDrive\Agent\design-agent\research.md)
- `CLAUDE.md`
- `AGENTS.md`
- `progress.md`
- `deployment.md`
