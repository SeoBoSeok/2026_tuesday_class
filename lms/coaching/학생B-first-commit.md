# 학생 B 코칭 — SpaceKkabbi 공식 홈

> 이 문서는 선생님이 관리합니다. 코치 세션은 수업 마무리 때 class-manager 에이전트가 함께 기록합니다.

## 🛸 프로젝트 정체성 — 까비 생태계의 "공식 창구"

학생B의 웹앱은 **SpaceKkabbi(까비 NFT IP)의 공식 홈**이다: 세계관(팩션 3종·캐릭터) 소개,
회원(이메일 인증·Discord), Stripe 결제(테스트 모드), 그리고 **까비 월드(학생A)로 들어가는 관문**.

| 역할 분담 | 까비 월드 (학생A) | 공식 홈 (학생B) |
|----------|------------------|----------------|
| 무엇 | 팬들이 모여 노는 본진 (실시간 게임) | 세계관·멤버십·결제·공지 |
| 최종 연결 | 홈의 `/world`에 임베드 + 닉네임 자동 전달 | |

## 🎯 완성 로드맵 (마일스톤)

- [x] 기본 구조 + 메인 화면 (세계관·음악·3D)
- [x] 회원: 가입·이메일 인증·Discord 로그인·닉네임·계정 삭제
- [x] Stripe 결제 흐름 연결 (테스트 모드)
- [ ] **M1. 진짜 데이터베이스** — 파일 JSON → Prisma+Postgres(Neon). 지금은 Vercel 배포 불가의 원인
- [ ] **M2. 회원·결제 완성** — 실패·취소 화면, 웹훅 서명 검증·멱등성, 만료 토큰 처리
- [ ] **M3. 세상에 공개** — Vercel 배포 + 환경변수
- [ ] **M4. 까비 생태계 연결** — `/world` 임베드(까비 월드), NFT 갤러리(OpenSea)

## 🧰 필요한 기술·라이브러리

| 기술 | 왜 필요한가 | 상태 | 참고 |
|------|------------|------|------|
| Next.js App Router | 페이지·API의 뼈대 | 🔄 배우는 중 | AGENTS.md: Next 16 동봉 문서 우선 |
| 서버/클라이언트 컴포넌트 | "use client"를 언제 쓰나 | 🔄 배우는 중 | 잎(leaf)으로 밀어내기 |
| next-auth + bcrypt | 인증 | ✅ 동작 중 | 만료 토큰 처리만 다듬기 (M2) |
| Stripe (테스트 모드) | 결제 | 🔄 배우는 중 | **돈 코드 3원칙**: 서명 검증·멱등성·금액은 서버가 |
| 환경 변수 관리 | 비밀키 보호 | ✅ **습관 잡힘** 👏 | .env.example 패턴 추가 (선생님 버전 참고) |
| Prisma + Postgres | 진짜 DB (M1) | ⬜ 다음 주제 | store.ts 함수 표면 유지하며 내부만 교체 |
| Vercel 배포 | 서비스 공개 (M3) | ⬜ 예정 | LMS와 같은 플랫폼 — 배운 것 재사용 |
| iframe + postMessage | 까비 월드 임베드 (M4) | ⬜ 예정 | 학생A 프로젝트와의 연결 고리 |

상태: ✅ 배움 · 🔄 배우는 중 · ⬜ 예정

## 👨‍🏫 선생님 버전

> 학생 버전을 fork해서 "운영 가능한 서비스까지" 진행하는 참고 구현.

- **저장소**: https://github.com/SeoBoSeok/first-commit-teacher
- **핵심 문서** (코드보다 먼저 읽기):
  - [PRD — 비전·마일스톤 M1~M4·하지 않을 것](https://github.com/SeoBoSeok/first-commit-teacher/blob/main/docs/01-PRD.md)
  - [기능 & 시나리오 — 실패 케이스 중심](https://github.com/SeoBoSeok/first-commit-teacher/blob/main/docs/02-features-scenarios.md)
  - [기술 결정 — 스토어 전환(Prisma+Neon)·임베드·배포](https://github.com/SeoBoSeok/first-commit-teacher/blob/main/docs/03-tech-decisions.md)
  - [선생님 노하우 — 돈이 오가는 코드의 3원칙](https://github.com/SeoBoSeok/first-commit-teacher/blob/main/docs/04-teacher-notes.md)
- 배포 데모는 M1(DB 전환) 후 — 파일 스토어 상태로는 Vercel에 올릴 수 없음 (그게 M1의 교훈)

## 📈 코치 세션 (성장 기록)

### 2026-06-12 — 코칭 체계 시작 + 선생님 버전 분석
- **현재 상태**: auth+Stripe+이메일 인증+프로필+세계관 데이터까지 — 초보 수준을 한참 넘는 진행
- **칭찬 2가지**: ① `.env`·`data/` git 제외, bcrypt — 보안 기본기가 습관 ②
  `store.ts`에 "Prisma 임시 대체, 호출부 무변경 전제" 주석 — **임시 코드에 의도를 남기는 일급 습관**
- **코멘트**: 기능 붙이는 힘은 충분하다. 이제 "안 되는 경우"(결제 실패·만료 토큰)와
  "운영"(진짜 DB·배포)이 다음 단계. 본인이 store.ts에 설계해 둔 전환 계획을 실행하는 게 M1
- **다음 과제**: 테스트 카드 4000…0002(거절)로 결제 실패 시 무슨 화면이 나오는지 직접 확인해보기

## 💬 선생님 코멘트 (수시)

- 2026-06-12 — 너의 사이트가 까비 생태계의 "공식 창구"다. 학생A의 월드와 합쳐지는 M4가 이 수업의 피날레.
