# Human-AI 오케스트레이션 기반 AI 수업 설계 에이전트 연구 정리

## 1. 연구 주제 정의

이 프로젝트의 핵심 주제는 **교사, 학생, AI가 역할과 통제권을 분담하는 Human-AI 오케스트레이션 기반 수업 설계 에이전트**를 만드는 것이다.  
여기서 목표는 단순히 "AI가 수업안을 자동 생성"하는 도구가 아니라, 다음을 지원하는 설계 파트너를 만드는 데 있다.

- 교사의 수업 의도와 교수학습 맥락을 구조화한다.
- 수업 설계 과정에서 교사와 AI의 역할을 구분한다.
- 학생 활동, 협업, 모니터링, 피드백, 윤리까지 포함한 **실행 가능한 수업 시나리오**를 만든다.
- 결과물로 차시안, 활동 흐름, 프롬프트 카드, 평가 루브릭까지 연결한다.

즉, 이 에이전트는 "콘텐츠 생성기"가 아니라 **수업 설계 오케스트레이터**에 가깝다.

---

## 2. reference.md에서 읽히는 핵심 아이디어

현재 폴더의 [reference.md](D:\OneDrive\Agent\design-agent\reference.md)를 기준으로 보면, 원래 구상은 다음 축으로 정리된다.

- 입력은 교사의 의도와 카드 데이터다.
- 카드는 질문 문구, 의도, 난도, 범주를 가진다.
- 카드를 수업 흐름에 매핑해서 시나리오를 만든다.
- Human-AI agency 구조를 분명히 둔다.
- 최종 출력은 시나리오와 루브릭이다.

이 구상은 교육공학적으로 충분히 확장 가능하다. 다만 실제 제품/연구 수준으로 올리려면 아래 네 가지가 더 명확해야 한다.

1. **오케스트레이션이 무엇인지**
2. **공유 통제(shared control)를 어떻게 설계할지**
3. **카드 기반 설계를 어떤 엔진으로 연결할지**
4. **평가와 피드백을 어떤 루브릭 구조로 환원할지**

---

## 3. 이론적 배경

### 3.1 오케스트레이션의 의미

수업 오케스트레이션은 교사가 여러 활동, 여러 사회적 수준(개인-모둠-전체), 여러 도구, 여러 시간 제약을 동시에 관리하는 행위를 뜻한다.  
이는 단순한 classroom management보다 넓고, **설계와 실행 사이를 실시간으로 조정하는 능력**에 가깝다.

관련 연구는 오케스트레이션을 다음처럼 본다.

- 다층적 활동을 다중 제약 속에서 실시간 관리하는 교사의 행위
- 계획된 수업 설계와 실제 수업 전개 사이의 차이를 현장에서 조정하는 행위
- 기술 도구가 교사를 대체하는 것이 아니라, 교사의 판단을 보강하는 구조

이 관점은 본 프로젝트에 직접 연결된다. AI 수업 설계 에이전트는 교사를 대신해 수업을 "결정"하는 시스템이 아니라, **교사의 오케스트레이션 부담을 줄이면서 판단 품질을 높이는 시스템**이어야 한다.

근거:
- Dillenbourg & Jermann 계열의 오케스트레이션 연구 요약이 실린 *Design for classroom orchestration* [Computers & Education, 2013](https://www.sciencedirect.com/science/article/abs/pii/S0360131513001061)
- *Orchestration in a networked classroom: Where the teacher's real-time enactment matters* [Computers & Education, 2013](https://www.sciencedirect.com/science/article/pii/S0360131513000985)
- *Deconstructing orchestration load* [IJCSCL, 2021](https://link.springer.com/article/10.1007/s11412-021-09351-9)

### 3.2 오케스트레이션 부담(orchestration load)

오케스트레이션이 어려운 이유는 교사가 동시에 다음을 처리해야 하기 때문이다.

- 학생 상태 파악
- 모둠별 진도와 질 관리
- 전환 시점 판단
- 시간 통제
- 기술 도구 문제 대응
- 피드백과 평가

따라서 AI 설계 에이전트의 가치는 "초안 생성"보다 **오케스트레이션 부담을 구조적으로 낮추는 데** 있다.  
예를 들어 좋은 시스템은 교사에게 아래를 제공해야 한다.

- 어떤 시점에 어떤 카드/질문이 필요한지
- 학생 협업이 막힐 때 개입할 방법
- AI를 어디까지 쓰고 어디서 교사가 판단해야 하는지
- 수업 후 관찰 포인트와 평가 기준

이는 단순 추천보다 훨씬 더 "교사 실행 지원"에 가깝다.

---

## 4. Human-AI 공유 통제(shared control) 설계 원칙

가장 중요한 선행연구 중 하나는 Pair-Up 도구 연구다.

- *How teachers conceptualise shared control with an AI co-orchestration tool* [BJET, 2024](https://doi.org/10.1111/bjet.13372)
- 요약 페이지: [Monash University](https://research.monash.edu/en/publications/how-teachers-conceptualise-shared-control-with-an-ai-co-orchestra/)

이 연구에서 교사들은 AI와의 공유 통제를 설계할 때 특히 다음 다섯 요소를 중요하게 봤다.

- control
- trust
- responsibility
- efficiency
- accuracy

이 다섯 요소는 본 프로젝트의 핵심 제품 원칙으로 바로 전환할 수 있다.

### 제품 원칙으로 재정리

1. **Control**
   - AI는 제안한다.
   - 교사는 선택, 수정, 삭제한다.
   - 자동 실행보다 승인 기반 워크플로가 적합하다.

2. **Trust**
   - 카드 추천 이유를 설명해야 한다.
   - 왜 이 질문, 왜 이 활동, 왜 이 루브릭인지 근거를 보여줘야 한다.

3. **Responsibility**
   - 최종 교수 판단은 교사에게 있다.
   - AI는 책임 주체가 아니라 설계 조력자다.

4. **Efficiency**
   - 수업 설계 시간을 줄여야 한다.
   - 단, 빠름 때문에 맥락 품질이 희생되면 안 된다.

5. **Accuracy**
   - AI가 교육과정, 학습목표, 학생 수준을 오독하지 않게 해야 한다.
   - 검토 체크포인트가 반드시 필요하다.

이 구조는 "교사 중심 co-orchestration"을 만들 때 필수다.

---

## 5. 카드 기반 수업 설계 모델의 타당성

reference.md의 가장 흥미로운 부분은 **카드 기반 설계**다.  
이 접근은 좋은 이유가 있다.

### 5.1 왜 카드인가

카드는 수업 설계 지식을 **작은 단위의 행동 가능한 프롬프트**로 만든다.

예:
- 이해 점검 카드
- 사고 확장 카드
- AI 역할 선언 카드
- AI 결과 검증 카드

이런 카드는 추상적인 교수 원리를 실제 수업행동 단위로 바꿔준다.  
즉, 카드는 이론과 실행 사이의 번역 매개체다.

### 5.2 카드가 담당할 수 있는 기능

카드는 최소한 다음 메타데이터를 가져야 한다.

- `title`
- `prompt`
- `intent`
- `timing`
- `difficulty`
- `category`
- `agency_target`
- `applicable_phase`
- `risk_tags`
- `evidence_tags`

reference.md의 기본 구조인 "질문 문구 / 의도 / 난도 / 범주"는 시작점으로 충분하다.  
다만 실제 에이전트로 가려면 아래를 추가하는 편이 좋다.

- 어느 수업 단계에서 쓰는지
- 누구의 agency를 강화하는지
- AI 활용 위험이 무엇인지
- 어떤 평가 루브릭과 연결되는지

### 5.3 카드 범주 추천

reference.md의 Monitoring, Engagement, AI Agency, Critical AI 범주는 좋은 출발점이다.  
이를 확장하면 다음 8개 범주 정도가 적절하다.

- Goal Alignment
- Engagement
- Monitoring
- Collaboration
- Cognitive Challenge
- AI Agency
- Critical AI Literacy
- Ethics & Safety

이렇게 하면 카드가 단순 질문 세트가 아니라 **오케스트레이션 제어 레이어**가 된다.

---

## 6. Human-AI agency 구조

reference.md의 agency 구분은 매우 중요하다.

- 교사: 조정, 판단, 개입
- 학생: 탐구, 협업, 산출
- AI: 정보 제공, 확장, 피드백

이 구조는 그대로 유지하되, 더 세밀하게 설계할 필요가 있다.

### 6.1 권장 agency 레이어

#### 교사 agency
- 학습목표 확정
- 카드 선택/제외
- AI 제안 승인/수정
- 개입 시점 결정
- 평가 기준 최종화

#### 학생 agency
- 질문 생성
- 자료 탐색
- AI 응답 검토
- 팀 합의 형성
- 결과물 산출

#### AI agency
- 카드 추천
- 활동 흐름 초안 생성
- 루브릭 초안 생성
- 대안 시나리오 제안
- 성찰 질문 생성

### 6.2 설계 원칙

AI agency는 강할수록 좋은 것이 아니다.  
좋은 구조는 **학생 agency와 교사 agency를 확장하는 범위 안에서만 AI agency를 허용**하는 구조다.

이 관점은 최근 교육 AI agency 연구와도 맞닿아 있다.

- *Redefining Agency: A Capability-Driven Research Agenda for Generative AI in Education* [Education Sciences, 2026](https://www.mdpi.com/2227-7102/16/1/155)
- *A Collaborative Model for Integrating Teacher and GenAI into Future Education* [TechTrends, 2025](https://link.springer.com/article/10.1007/s11528-025-01105-w)

---

## 7. 제안하는 시스템 구조

reference.md의 입력-의도-카드 매핑-시나리오-루브릭 흐름은 적절하다.  
다만 제품 수준에서는 다음 구조가 더 좋다.

### 7.1 전체 파이프라인

`Teacher Input -> Intent Parser -> Card Retriever -> Orchestration Engine -> Scenario Composer -> Rubric Generator -> Review Layer`

### 7.2 각 모듈 역할

#### 1. Teacher Input
- 교과
- 학년
- 차시 길이
- 학습목표
- 학생 특성
- AI 활용 허용 범위
- 수업 유형(탐구, 토의, 프로젝트, 문제해결 등)

#### 2. Intent Parser
- 입력을 구조화된 설계 의도로 변환
- 예: `개념이해 강화`, `학생 주도 탐구`, `AI 활용 비판적 검토`

#### 3. Card Retriever
- 의도와 맥락에 맞는 카드 후보 검색
- 우선순위와 충돌 카드 탐지

#### 4. Orchestration Engine
- 카드 조합 순서 결정
- 차시 흐름 설계
- 활동 전환 시점 생성
- 교사/학생/AI 역할 배치

#### 5. Scenario Composer
- 도입-전개-정리 흐름 생성
- 교사 발화 예시
- 학생 활동 지시문
- AI 사용 프롬프트

#### 6. Rubric Generator
- 활동별 관찰 포인트 생성
- 산출물 기준 생성
- 협업/AI 활용/윤리 차원 포함

#### 7. Review Layer
- 교사가 최종 수정
- AI 결과 검증
- 현장 맞춤화

---

## 8. 수업 시나리오 생성 로직

reference.md의 "카드 기반 시나리오"는 다음 식으로 정교화할 수 있다.

### 8.1 차시 구성 기본 프레임

1. 도입
2. 문제 제기
3. 개별 탐색
4. 협업 조정
5. AI 활용
6. 검증/비판
7. 산출
8. 성찰

### 8.2 카드 매핑 규칙 예시

#### 도입
- 목표 제시 카드
- 맥락 연결 카드
- 사전 인식 진단 카드

#### 전개 초반
- 사고 확장 카드
- 개별 탐색 카드
- 질문 생성 카드

#### AI 사용 구간
- AI 역할 선언 카드
- AI 프롬프트 카드
- AI 결과 검증 카드

#### 협업 구간
- 역할 분담 카드
- 합의 형성 카드
- 근거 비교 카드

#### 마무리
- 이해 점검 카드
- 성찰 카드
- 윤리 점검 카드

핵심은 카드가 콘텐츠를 생성하는 게 아니라 **수업의 전환 리듬과 개입 포인트를 설계**한다는 점이다.

---

## 9. 루브릭 설계

reference.md는 6개 영역을 제안한다.

- Flow
- Engagement
- Collaboration
- Monitoring
- AI
- Ethics

이 구조는 매우 적절하다. 다만 실제 평가에 쓰려면 각 영역을 관찰 가능 행동으로 변환해야 한다.

### 9.1 권장 루브릭 구조

#### 1. Flow
- 활동 전환이 자연스러운가
- 시간 배분이 적절한가
- 목표와 활동 흐름이 일치하는가

#### 2. Engagement
- 학생 참여가 고르게 일어나는가
- 학생 질문과 발화가 활성화되는가
- 활동 몰입이 유지되는가

#### 3. Collaboration
- 역할 분담이 명확한가
- 상호 설명과 조정이 일어나는가
- 결과 통합이 이뤄지는가

#### 4. Monitoring
- 교사가 적절한 순간에 개입하는가
- 학생 이해 상태를 점검하는가
- 수업 중 재조정이 가능한가

#### 5. AI Use
- AI 사용 목적이 분명한가
- AI가 학생 사고를 대체하지 않는가
- AI 결과를 검토하고 수정하는가

#### 6. Ethics
- 출처와 신뢰성 검토가 있는가
- 편향/오류를 점검하는가
- 책임 있는 사용 규칙이 있는가

### 9.2 루브릭 수준화

각 영역은 4수준 척도가 적절하다.

- 1: 미흡
- 2: 부분 충족
- 3: 적절
- 4: 우수

---

## 10. 연구 설계 관점에서의 기여 가능성

이 프로젝트는 단순 앱 개발보다 연구로서 더 의미가 있다.  
기여 지점은 최소 세 가지다.

### 10.1 카드 기반 오케스트레이션 모델

수업 설계 지식을 카드 단위로 구조화하고, 이를 AI가 조합하는 모델은  
기존의 프롬프트 중심 수업 설계 도구보다 더 명시적인 설계 구조를 제공한다.

### 10.2 Human-AI shared control의 교육적 모델화

교사-AI 관계를 "자동화"가 아니라 "공유 통제"와 "오케스트레이션 보조"로 모델링한다는 점이 중요하다.

### 10.3 설계-실행-평가의 통합

대부분의 AI lesson planner는 수업안 생성까지만 지원한다.  
하지만 본 프로젝트는 카드, 시나리오, AI 활용 규칙, 루브릭까지 연결하므로 **설계-실행-평가 폐루프**를 지향한다.

---

## 11. 제품 설계 시 필수 고려사항

### 11.1 교사 중심 설계

교사의 수정권을 항상 보장해야 한다.  
자동 추천보다 "편집 가능한 추천"이 핵심이다.

### 11.2 학생 포함 코디자인

최근 연구는 교사만이 아니라 학생까지 설계 과정에 포함할 필요를 강조한다.

- *Co-designing AI-powered learning analytics: bringing students and teachers together* [IJETHE, 2025](https://link.springer.com/article/10.1186/s41239-025-00572-8)

이 연구는 세 가지 주요 tension을 보여준다.

- teaching-learning goals tension
- privacy-utility tension
- human-AI guidance preferences tension

이 세 가지 tension은 이 프로젝트에도 그대로 적용된다.

### 11.3 현장성

실제 수업 설계 도구는 예쁜 결과보다 **현장에서 바로 수정 가능한 구조**가 중요하다.

### 11.4 윤리와 책임

AI 활용 수업 설계는 반드시 다음을 포함해야 한다.

- AI 사용 목적 명시
- 학생 검증 활동 포함
- 편향/오류 점검 질문 포함
- 교사 최종 검토

---

## 12. 권장 기술 구조

reference.md의 제안은 다음과 같다.

- FastAPI
- GPT
- MongoDB
- Vector DB

이 조합은 타당하다. 다만 역할을 명확히 나누는 편이 좋다.

### 권장 아키텍처

- `FastAPI`: 오케스트레이션 API, 카드 검색, 시나리오 생성
- `MongoDB`: 카드, 시나리오, 루브릭, 사용자 설정 저장
- `Vector DB`: 카드 의미 검색, 유사 시나리오 검색
- `LLM`: 카드 조합 설명, 시나리오 문장화, 루브릭 초안 생성

### 데이터 스키마 예시

#### Card
- `id`
- `title`
- `prompt`
- `intent`
- `difficulty`
- `category`
- `phase`
- `agency_target`
- `risk_tags`
- `rubric_links`

#### LessonPlan
- `lesson_id`
- `teacher_input`
- `intent_profile`
- `selected_cards`
- `scenario`
- `rubric`
- `review_log`

---

## 13. 구현 우선순위

### 1단계 MVP

- 교사 입력 폼
- 카드 DB
- 카드 추천
- 시나리오 생성
- 루브릭 생성

### 2단계

- 교사 수정 인터페이스
- 카드 우선순위 조정
- AI 역할 범위 설정
- 결과 저장/재사용

### 3단계

- 수업 실행 로그 반영
- 수업 후 성찰 기반 재설계
- 카드 추천 고도화
- 개인화/학교급별 모델

---

## 14. 제안하는 연구 질문

### RQ1
Human-AI 오케스트레이션 기반 수업 설계 에이전트는 교사의 수업 설계 부담을 어떻게 변화시키는가?

### RQ2
카드 기반 설계 구조는 교사의 AI 활용 통제감과 신뢰를 높이는가?

### RQ3
교사, 학생, AI의 agency를 명시적으로 분배한 수업안은 일반 AI 수업안보다 실행 가능성과 수정 용이성이 높은가?

### RQ4
이 에이전트가 생성한 루브릭은 수업 실행 후 성찰과 재설계에 실질적으로 기여하는가?

---

## 15. 결론

이 프로젝트의 차별점은 "AI가 수업안을 대신 써준다"가 아니라,  
**교사-학생-AI의 역할을 오케스트레이션 가능한 형태로 구조화한다**는 데 있다.

reference.md의 카드 기반 구상은 충분히 발전 가능하다.  
이를 연구와 제품 수준으로 끌어올리려면 다음 세 가지를 중심축으로 삼는 것이 좋다.

- 카드 기반 설계 지식 구조화
- Human-AI shared control 설계
- 시나리오-루브릭-성찰의 통합

이 방향은 기존의 classroom orchestration, teacher-AI co-design, human-centred learning analytics 연구 흐름과도 잘 맞는다.  
따라서 이 에이전트는 교육공학적 연구 주제이면서 동시에 실제 교사 도구로 발전 가능한 가능성이 높다.

---

## 16. 하네스 엔지니어링 관점에서의 재정의

현재 폴더에 설치한 [Harness-Engineering](D:\OneDrive\Agent\design-agent\Harness-Engineering) 템플릿은 이 연구를 단순한 "프롬프트 기반 수업안 생성기"가 아니라, **지속적으로 품질을 유지하는 AI 작업 환경**으로 재정의하는 데 유용하다. 템플릿의 핵심 메시지는 프롬프트를 잘 쓰는 것보다, AI가 일하는 규칙과 역할 구조, 검증 루프를 먼저 설계해야 한다는 점이다.

이 관점은 본 연구 주제와 직접 맞닿아 있다. Human-AI 오케스트레이션 기반 수업 설계 에이전트는 단발성 생성보다 다음을 안정적으로 반복해야 한다.

- 교사 의도를 해석하는 규칙
- 카드 추천과 조합 원칙
- 교사 승인 지점
- 산출물 검증 기준
- 수정-검토-재생성의 반복 루프

Harness-Engineering 템플릿은 이를 네 가지 축으로 정리한다.

- `Constitution`: AI가 반드시 따라야 할 규칙과 금지선
- `Work Structure`: 무엇을 어떤 구조로 만들지에 대한 청사진
- `Verification`: 결과물의 품질을 판정하는 기준
- `Execution Loop`: 수정, 검토, 재실행을 반복하는 운영 루프

이 네 축을 수업 설계 에이전트에 대응시키면 다음과 같다.

| Harness 축 | 수업 설계 에이전트 대응 |
|---|---|
| Constitution | 교사 주도권 보장, 학생 데이터 보호, AI 자동 결정 금지, 설명 가능성 확보 |
| Work Structure | 교사 입력, 의도 파싱, 카드 매핑, 시나리오 생성, 루브릭 생성 흐름 정의 |
| Verification | 교육적 타당성, 실행 가능성, AI 활용 적절성, 윤리성, 현장 적합성 점검 |
| Execution Loop | 교사 수정 -> AI 재구성 -> 검토자 평가 -> 최종 확정 루프 |

### 16.1 왜 하네스가 필요한가

수업 설계는 한 번 잘 생성되는 것보다, 반복해도 일정 수준 이상으로 유지되는 것이 더 중요하다. 같은 입력을 받아도 프롬프트만으로 운용하는 시스템은 세션마다 품질 편차가 커질 수 있다. 반면 하네스 기반 시스템은 역할, 금지선, 검증 기준이 축적되므로 설계 일관성을 높일 수 있다.

특히 이 연구 주제는 다음 이유로 하네스가 필요하다.

- 교육적 책임이 AI에 완전히 위임될 수 없다.
- 카드 추천 근거와 시나리오 구조가 설명 가능해야 한다.
- 학생 데이터, AI 활용 윤리, 교수학습 적합성 등 비기술 기준이 강하다.
- 초기 설계보다 반복 개선이 더 중요하다.

### 16.2 저장소 하네스와 애플리케이션 하네스

Harness-Engineering 문서는 하네스를 두 층으로 본다.

- `Repository Harness`: 저장소 전반에 적용되는 공통 원칙
- `Application Harness`: 현재 제품에 특화된 구조와 규칙

이를 본 연구에 적용하면 다음과 같이 분리하는 것이 합리적이다.

#### 저장소 하네스

- 교육 도메인 윤리 원칙
- 학생 데이터 처리 원칙
- AI 설명 가능성 규칙
- 검증 루브릭 구조
- 멀티에이전트 실행 루프

#### 애플리케이션 하네스

- 수업 설계 카드 스키마
- 교사 입력 양식
- Intent taxonomy
- 차시 시나리오 포맷
- 루브릭 항목과 가중치
- 승인 워크플로

이 구분은 연구적으로도 중요하다. 왜냐하면 어떤 원칙은 여러 교육용 AI 시스템에 공통적으로 적용될 수 있고, 어떤 원칙은 특정 수업 설계 에이전트에만 맞기 때문이다. 즉, 하네스는 단지 개발 편의 도구가 아니라 **설계 지식의 재사용 가능한 층위화**라고 볼 수 있다.

### 16.3 연구 에이전트를 위한 하네스 문서 구성 제안

설치한 템플릿 구조를 참고하면, 향후 이 프로젝트는 아래 문서 셋을 중심으로 운용하는 것이 적절하다.

- `CLAUDE.md`: 교사 주도권, 자동화 금지 범위, 개인정보 처리 금지선, 완료 조건
- `AGENTS.md`: Planner, Orchestrator, Card Curator, Reviewer, Pedagogy Reviewer 역할
- `architecture.md`: 입력, 카드 DB, 생성 파이프라인, 검토 흐름, 로그 구조
- `progress.md`: 현재 실험 버전, 다음 검증 과제, 실패 사례 기록
- `docs/verification-rubric.md`: 교육적 타당성 및 안전성 검증 기준

즉, 하네스 엔지니어링은 이 에이전트에서 "모델 선택"보다 "판단 구조의 외부화"를 의미한다.

---

## 17. 멀티에이전트 구조와 Human-AI 오케스트레이션

이 연구 주제는 단일 LLM 호출보다 멀티에이전트 구조에 더 잘 맞는다. 이유는 수업 설계가 본질적으로 복합 과업이기 때문이다. 교사 의도 해석, 카드 검색, 시나리오 구성, 평가 설계, 윤리 검토는 서로 다른 판단 규칙을 가진다. 이를 하나의 프롬프트에 모두 넣으면 품질이 흔들리기 쉽다.

Harness-Engineering의 [AGENTS.md](D:\OneDrive\Agent\design-agent\Harness-Engineering\AGENTS.md)는 역할 분리를 통해 인지 부하를 낮추는 방식을 제안한다. 이 아이디어를 수업 설계 에이전트에 맞게 확장하면 다음 구조가 적절하다.

### 17.1 권장 멀티에이전트 역할

#### 1. Planner

- 교사 입력을 구조화한다.
- 설계 목표, 제약, 학습자 수준, 수업 단계 정보를 추출한다.
- 어떤 카드 범주와 검토 단계가 필요한지 계획한다.

#### 2. Intent Parser

- 자연어 입력을 intent taxonomy로 변환한다.
- 예: 협업 강화, 참여 유도, AI 활용, 형성평가, 비판적 AI 리터러시
- 애매한 요구는 다중 intent 후보로 남기고 신뢰도를 부여한다.

#### 3. Card Curator 또는 Retriever

- 카드 라이브러리에서 적절한 카드를 검색한다.
- 단순 유사도 검색이 아니라, 단계 적합성, 학년 적합성, agency target을 함께 고려한다.
- 충돌 카드, 중복 카드, 위험 카드도 표시한다.

#### 4. Scenario Composer

- 선택된 카드를 차시 흐름으로 배열한다.
- 도입, 탐구, AI 활용, 협업, 성찰, 평가 구간을 시간축에 배치한다.
- 필요한 경우 교사 개입 타이밍을 삽입한다.

#### 5. Rubric Generator

- 시나리오를 기준으로 평가 항목을 생성한다.
- 활동 흐름, 참여, 협업, AI 사용, 윤리, 모니터링 등 다차원 루브릭을 작성한다.
- 카드와 루브릭 간 연결 근거를 남긴다.

#### 6. Pedagogy Reviewer

- 교육학적 타당성을 점검한다.
- 학습목표-활동-평가 정렬 여부를 검토한다.
- 학생 수준 대비 과업 난이도, AI 사용 적절성, 교사 개입 필요 시점을 판단한다.

#### 7. Safety and Ethics Reviewer

- 학생 데이터 처리, AI 의존도, 편향, 과도한 자동화 위험을 검토한다.
- 생성형 AI 활용이 학습 목표를 침해하지 않는지 점검한다.

#### 8. Human Teacher

- 최종 승인자다.
- 수정, 교체, 삭제, 보류 결정을 내린다.
- 시스템은 교사를 reviewer가 아니라 실질적 orchestrator로 대우해야 한다.

### 17.2 에이전트 간 상호작용 구조

권장 흐름은 다음과 같다.

`Teacher Input -> Planner -> Intent Parser -> Card Curator -> Scenario Composer -> Rubric Generator -> Pedagogy Reviewer -> Teacher Revision -> Final Plan`

이 구조의 장점은 세 가지다.

- 해석, 생성, 검토가 분리되어 오류 원인을 추적하기 쉽다.
- 특정 에이전트만 교체하거나 개선할 수 있어 시스템 진화가 용이하다.
- 교사 승인 지점을 명시할 수 있어 shared control 구조를 구현하기 쉽다.

### 17.3 멀티에이전트가 필요한 이유

수업 설계 과업은 하나의 최적 답을 찾기보다, 여러 제약을 조정해 "설득 가능한 설계안"을 만드는 일에 가깝다. 따라서 다음과 같은 분업이 필요하다.

- 해석 에이전트는 입력을 안정적으로 구조화한다.
- 생성 에이전트는 대안을 넓힌다.
- 검토 에이전트는 교육적, 윤리적 기준으로 수렴시킨다.
- 인간 교사는 최종 문맥 판단을 담당한다.

즉, 멀티에이전트 구조는 기술적 복잡화를 위한 장식이 아니라, **공유 통제와 책임 분배를 구현하기 위한 운영 구조**다.

### 17.4 오케스트레이션 엔진과 멀티에이전트의 관계

본 연구에서 오케스트레이션 엔진은 단순한 워크플로 관리기가 아니다. 오케스트레이션 엔진은 다음 기능을 수행해야 한다.

- 어떤 에이전트를 언제 호출할지 결정
- 검토 실패 시 어느 단계로 되돌릴지 결정
- 교사 수정이 들어왔을 때 어떤 산출물을 무효화할지 추적
- 카드, 시나리오, 루브릭 간 정합성 유지
- 로그를 남겨 다음 세션의 근거로 활용

따라서 오케스트레이션 엔진은 멀티에이전트를 묶는 운영 계층이자, 실질적인 하네스 런타임이라고 볼 수 있다.

### 17.5 연구 설계로서의 함의

하네스 엔지니어링과 멀티에이전트 구조를 결합하면, 이 프로젝트는 단순한 인터페이스 개발을 넘어 다음 연구 질문을 탐색할 수 있다.

- 어떤 역할 분리가 교사의 통제감과 신뢰를 높이는가
- 검토 에이전트의 개입이 설계 품질을 실제로 높이는가
- 교사 승인 지점의 위치가 사용성에 어떤 영향을 미치는가
- 카드 검색과 교육학 검토를 분리했을 때 설명 가능성이 향상되는가
- 하네스 문서의 정교화가 반복 사용 시 품질 안정성에 기여하는가

이 점에서 하네스 엔지니어링은 개발 방법론인 동시에 연구 변인 설계의 틀이 될 수 있다.

---

## 18. GitHub 및 Vercel 배포 전략

이 에이전트는 연구 프로토타입에서 끝나지 않고, 반복 실험과 사용자 피드백을 받는 운영형 시스템으로 발전할 가능성이 높다. 따라서 배포 전략은 단순 호스팅이 아니라, 실험 버전 관리와 검증 가능한 운영 구조를 함께 고려해야 한다.

### 18.1 GitHub 중심 운영 구조

GitHub는 코드 저장소 이상의 의미를 가진다. 이 프로젝트에서는 다음 네 가지 역할을 맡는 것이 적절하다.

- 하네스 문서 버전 관리
- 카드 스키마와 루브릭 규칙 변경 추적
- 기능 개발과 연구 실험 분기 관리
- 이슈, PR, 리뷰를 통한 설계 판단 기록

권장 브랜치 전략은 다음과 같다.

- `main`: 안정 배포 브랜치
- `develop`: 다음 통합 버전
- `feature/*`: 카드 추천, 루브릭 생성, 교사 리뷰 UI 등 기능 단위 작업
- `experiment/*`: 특정 연구 실험이나 프롬프트, 하네스 변형 테스트

이 구조가 중요한 이유는, 본 프로젝트의 핵심 자산이 코드만이 아니라 하네스 문서와 검증 기준 자체이기 때문이다. 즉, GitHub는 단순 소스 저장소가 아니라 **오케스트레이션 규칙의 진화 이력**을 보존하는 연구 인프라가 된다.

### 18.2 GitHub Actions와 검증 자동화

향후 CI 파이프라인에는 최소한 아래 검증이 포함되어야 한다.

- 테스트 통과 여부
- 타입 및 린트 확인
- 카드 스키마 유효성 검사
- 루브릭 포맷 검증
- 배포 전 환경 변수 존재 여부 확인

이는 Harness-Engineering의 verification 철학과 맞닿아 있다. 수업 설계 에이전트는 잘 "동작"하는 것만으로 충분하지 않고, 잘 "판정"되어야 한다.

### 18.3 Vercel 배포 적합성

공식 문서 기준으로 Vercel은 FastAPI 애플리케이션을 배포할 수 있고, `app.py`나 `index.py` 등의 엔트리포인트에서 `FastAPI` 인스턴스를 내보내면 된다. 2025년 12월 4일 기준 Vercel 문서는 FastAPI를 zero configuration으로 배포할 수 있다고 안내한다. 이는 본 프로젝트의 권장 기술 구조인 FastAPI 백엔드와 잘 맞는다.

이 점을 바탕으로 배포 아키텍처는 다음처럼 설계할 수 있다.

- 프론트엔드: Vercel
- Python API: Vercel의 FastAPI 배포
- 카드/로그/루브릭 저장소: 외부 DB 또는 매니지드 스토리지
- 벡터 검색 계층: 외부 Vector DB
- OpenAI API 호출: 서버 측 함수에서만 실행

즉, 교사용 대시보드와 API 서버를 하나의 GitHub 저장소로 관리하면서, Vercel Preview Deployment를 통해 실험 브랜치를 빠르게 검증하는 구조가 가능하다.

### 18.4 Preview Deployment의 연구적 가치

Vercel의 Preview Deployment는 이 프로젝트에 특히 유리하다. 기능 브랜치마다 별도 미리보기 배포를 만들 수 있으므로, 다음과 같은 연구 운영이 가능하다.

- 다른 카드 추천 전략을 브랜치별로 비교
- 다른 루브릭 구조를 실제 UI에서 검토
- 교사 파일럿 그룹별로 별도 실험 버전 제공
- Prompt 또는 harness 문서 변화의 결과 차이 관찰

즉, Preview Deployment는 단순 개발 편의가 아니라, **연구 실험 조건을 분리하는 배포 메커니즘**으로 활용될 수 있다.

### 18.5 환경 변수와 비밀 정보 관리

Vercel 공식 문서에 따르면 환경 변수는 프로젝트 수준 또는 팀 수준으로 선언할 수 있고, Production, Preview, Development 환경별로 다르게 적용할 수 있다. 또한 변경된 환경 변수는 이전 배포에 자동 반영되지 않으며, 새 배포에만 적용된다. 이는 실험 버전과 운영 버전을 구분하는 데 중요하다.

본 프로젝트에서 최소한 다음 환경 변수를 분리해야 한다.

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `DATABASE_URL`
- `VECTOR_DB_URL`
- `VECTOR_DB_API_KEY`
- `APP_ENV`
- `LOG_LEVEL`

특히 OpenAI 키는 브라우저에 노출되면 안 되므로, Vercel 서버 환경 변수로만 주입하고 클라이언트 코드에서는 직접 참조하지 않아야 한다.

### 18.6 권장 배포 흐름

실무적으로는 아래 흐름이 적절하다.

1. GitHub에서 기능 브랜치 작업
2. PR 생성
3. GitHub Actions로 테스트와 스키마 검증 수행
4. Vercel Preview Deployment에서 실제 UI 및 API 동작 확인
5. 교사 리뷰 또는 연구팀 검토
6. `main` 병합 후 Production 배포

이 구조는 하네스 엔지니어링의 execution loop를 배포 계층까지 확장한 형태라고 볼 수 있다.

---

## 19. OpenAI API 활용 전략

이 프로젝트에서 OpenAI API는 단순 텍스트 생성기가 아니라, **의도 해석, 카드 조합 설명, 시나리오 생성, 루브릭 작성, 검토 보조**를 담당하는 핵심 추론 계층이다. 따라서 어떤 API를 어떤 책임 범위로 사용할지 명확히 설계해야 한다.

### 19.1 Responses API 중심 설계

OpenAI 공식 문서 기준으로 `Responses API`는 텍스트와 이미지 입력, 텍스트 또는 JSON 출력, 대화 상태 유지, 함수 호출, 내장 도구 확장을 지원하는 가장 발전된 인터페이스다. 또한 OpenAI는 best practice로 새로운 기능에는 Responses API 사용을 권장하고 있으며, Responses API를 에이전트 구축의 미래 방향으로 제시한다.

이 프로젝트에서는 Chat Completions보다 Responses API를 우선 고려하는 것이 타당하다. 이유는 다음과 같다.

- 구조화된 입력과 출력이 필요하다.
- 멀티에이전트 흐름에서 이전 응답을 재사용할 수 있다.
- 함수 호출을 통해 카드 검색, DB 조회, 검증 함수와 연결하기 쉽다.
- 장기적으로 agentic workflow와 잘 맞는다.

### 19.2 OpenAI API의 책임 분리

OpenAI API는 다음 역할로 제한하는 것이 바람직하다.

#### 1. Intent extraction

- 교사 자연어 입력을 구조화된 intent로 변환
- 차시, 학년, 활동 형태, AI 활용 목적, 평가 목적 추출

#### 2. Card recommendation explanation

- 왜 특정 카드를 추천했는지 설명
- 선택 근거와 제외 근거를 함께 제시

#### 3. Scenario generation

- 선택된 카드 조합을 바탕으로 수업 흐름 생성
- 도입, 탐구, AI 활용, 협업, 성찰, 평가를 일관된 형식으로 구성

#### 4. Rubric generation

- 시나리오 기반 루브릭 초안 생성
- 활동과 평가 항목의 정렬 상태를 문장화

#### 5. Reviewer assistance

- 교육학적 위험, 과도한 AI 의존, 평가 정합성 문제를 점검하는 초안 생성

반대로 다음 책임은 LLM에 전적으로 맡기지 않는 편이 낫다.

- 최종 교사 승인
- 학생 개인정보 처리 판단
- 점수 산정의 최종 확정
- 카드 DB의 사실적 메타데이터 관리

### 19.3 함수 호출과 도구 연결

Responses API는 함수 호출을 통해 외부 시스템과 연결할 수 있다. 이 프로젝트에서는 다음 도구 계층을 두는 것이 적절하다.

- `search_cards(intent_profile, phase, grade_level)`
- `get_card_detail(card_id)`
- `validate_lesson_plan(plan_json)`
- `save_review_log(review_json)`
- `retrieve_similar_scenarios(query)`

이 구조를 쓰면 LLM은 "모든 사실을 기억하는 존재"가 아니라, **필요할 때 저장된 카드와 규칙을 호출하는 추론 오케스트레이터**로 동작할 수 있다.

### 19.4 구조화 출력과 JSON 스키마

수업 설계 에이전트는 자유 서술만으로는 운영하기 어렵다. 다음과 같은 JSON 산출 구조를 강제하는 편이 낫다.

- `intent_profile`
- `selected_cards`
- `scenario_blocks`
- `teacher_checkpoints`
- `rubric_dimensions`
- `risk_flags`

이렇게 하면 프론트엔드 UI, 저장소, 검토 계층이 같은 구조를 공유할 수 있고, 멀티에이전트 파이프라인도 안정화된다.

### 19.5 API 키 보안과 서버 측 호출

OpenAI 공식 API 문서는 API 키를 비밀로 유지해야 하며, 브라우저나 클라이언트 코드에 노출하면 안 된다고 명시한다. 따라서 모든 OpenAI 호출은 서버 측에서만 수행해야 한다.

권장 원칙은 다음과 같다.

- 브라우저에서 직접 OpenAI API 호출 금지
- Vercel 서버 함수 또는 FastAPI 백엔드에서만 호출
- 키는 환경 변수로 관리
- 로깅 시 원문 프롬프트와 민감 정보 마스킹

### 19.6 비용과 속도 운영

OpenAI 공식 rate limits 가이드는 제한이 조직과 프로젝트 단위로 적용되고, 모델별로 다르며, 일반적으로 RPM, TPM 등의 형태로 관리된다고 설명한다. 따라서 이 프로젝트는 초기부터 비용과 호출량 제어 전략을 가져야 한다.

권장 전략은 다음과 같다.

- 짧은 검토 작업과 긴 생성 작업을 분리
- 동일 카드 검색은 캐시 우선
- 교사 입력이 바뀌지 않으면 재생성 대신 부분 수정
- 루브릭 생성과 리뷰는 필요 시 지연 실행
- 실패 재시도는 exponential backoff 적용

### 19.7 모델 활용 전략

모델 선택은 연구 질문과 운영 비용을 함께 고려해야 한다.

- 고품질 수업 시나리오 생성: 상위 추론 모델
- intent 분류나 포맷 정리: 더 경량한 모델
- 검토와 위험 탐지: 규칙 기반 검증과 모델 검토 병행

즉, 하나의 모델로 모든 역할을 처리하기보다, 오케스트레이션 엔진이 작업 성격에 맞는 모델 계층을 선택하는 구조가 바람직하다.

### 19.8 OpenAI API를 연구 변인으로 보는 관점

이 프로젝트에서 OpenAI API는 단순 인프라가 아니라 연구 변인으로도 다뤄질 수 있다. 예를 들어 아래 비교가 가능하다.

- 단일 호출 vs 멀티에이전트 호출
- 자유 생성 vs 카드 검색 후 생성
- 교사 승인 전 루브릭 생성 vs 승인 후 루브릭 생성
- 함수 호출 없음 vs 카드 DB 도구 연결

이 비교는 "어떤 AI 모델이 더 좋다"보다, **어떤 오케스트레이션 구조가 교육적 품질을 더 안정적으로 보장하는가**를 탐색하게 해 준다.

---

## 참고 문헌 및 링크

1. Lawrence, Echeverria, Yang, Aleven, Rummel. *How teachers conceptualise shared control with an AI co-orchestration tool* (2024)  
   https://doi.org/10.1111/bjet.13372  
   요약: https://research.monash.edu/en/publications/how-teachers-conceptualise-shared-control-with-an-ai-co-orchestra/

2. Holstein, McLaren, Aleven. *Co-Designing a Real-Time Classroom Orchestration Tool to Support Teacher–AI Complementarity* (2019)  
   https://doi.org/10.18608/jla.2019.62.3  
   요약: https://aievidencehub.org/lib/LHKPRYNV

3. Lawrence et al. *Co-designing AI-based orchestration tools to support dynamic transitions* (2022)  
   https://research.monash.edu/en/publications/co-designing-ai-based-orchestration-tools-to-support-dynamic-tran/

4. Amarasinghe, Hernández-Leo, Hoppe. *Deconstructing orchestration load* (2021)  
   https://link.springer.com/article/10.1007/s11412-021-09351-9

5. Sperling et al. *Behind the Scenes of Co-designing AI and LA in K-12 Education* (2024)  
   https://link.springer.com/article/10.1007/s42438-023-00417-5

6. Alfredo et al. *Co-designing AI-powered learning analytics: bringing students and teachers together* (2025)  
   https://link.springer.com/article/10.1186/s41239-025-00572-8

7. Choi et al. *Analyzing teacher–AI interaction patterns across teacher experience and AI proficiency in student-centered lesson design* (2026)  
   https://doi.org/10.1016/j.tate.2025.105266

8. Memon & Kwan. *A Collaborative Model for Integrating Teacher and GenAI into Future Education* (2025)  
   https://link.springer.com/article/10.1007/s11528-025-01105-w

9. Saito. *Redefining Agency: A Capability-Driven Research Agenda for Generative AI in Education* (2026)  
   https://www.mdpi.com/2227-7102/16/1/155

10. OpenAI API Reference, Responses API and Authentication  
    https://platform.openai.com/docs/api-reference/

11. Vercel Docs, Managing Environment Variables  
    https://vercel.com/docs/environment-variables/managing-environment-variables

12. Vercel Docs, FastAPI on Vercel  
    https://vercel.com/docs/frameworks/backend/fastapi/
