# 학생 A 코칭 — 레트로 HTML 게임

> 이 문서는 선생님이 관리합니다. 코치 세션은 수업 마무리 때 class-manager 에이전트가 함께 기록합니다.

## 🎯 프로젝트 완성 로드맵

- [x] 게임 기본 동작 (RETRO CHASER, 까비 어드벤처)
- [ ] 게임 오버 → 다시 시작 흐름 다듬기
- [ ] 최고 점수 저장 (껐다 켜도 기억하게)
- [ ] 효과음·배경음 넣기
- [ ] 모바일에서도 터치로 조작되게
- [ ] 세상에 공개 (배포) — 친구에게 링크 보내기

## 🧰 필요한 기술·라이브러리

| 기술 | 왜 필요한가 | 상태 | 참고 |
|------|------------|------|------|
| Canvas / requestAnimationFrame | 게임 화면을 부드럽게 그리는 기본기 | 🔄 배우는 중 | 지금 게임 코드 안에 이미 있음 — 같이 읽어보기 |
| 충돌 판정 (AABB) | 캐릭터와 적이 "닿았다"를 판단 | 🔄 배우는 중 | 사각형 겹침 검사 한 가지면 충분 |
| localStorage | 최고 점수를 브라우저에 저장 | ⬜ 예정 | 5줄이면 됨, 다음 코치 세션 주제 |
| Web Audio (new Audio) | 효과음 재생 | ⬜ 예정 | mp3 파일 하나로 시작 |
| 터치 이벤트 (touchstart) | 모바일 조작 | ⬜ 예정 | 키보드 이벤트와 짝으로 이해 |
| GitHub Pages 또는 Vercel | 게임을 인터넷에 공개 | ⬜ 예정 | 자료실 [Vercel 입문] 참고 |

상태: ✅ 배움 · 🔄 배우는 중 · ⬜ 예정

## 👨‍🏫 선생님 버전

> 학생 버전을 fork해서 "소프트웨어 공학적으로 완성까지" 진행하는 참고 구현.

- **저장소**: https://github.com/SeoBoSeok/first-teacher (학생A repo의 fork)
- **핵심 문서** (코드보다 먼저 읽기):
  - [PRD — 비전·마일스톤 M1~M4·하지 않을 것](https://github.com/SeoBoSeok/first-teacher/blob/main/docs/01-PRD.md)
  - [기능 리스트 & 플레이어 시나리오](https://github.com/SeoBoSeok/first-teacher/blob/main/docs/02-features-scenarios.md)
  - [기술 결정 — 참고 게임·엔진 선택·조작법](https://github.com/SeoBoSeok/first-teacher/blob/main/docs/03-tech-decisions.md)
  - [선생님 노하우 — 게임 개발·클로드코드 습관](https://github.com/SeoBoSeok/first-teacher/blob/main/docs/04-teacher-notes.md)
- **보는 법**: 학생 버전과 선생님 버전의 커밋 diff가 곧 수업 자료. "기능이 아니라 과정이 다르다"
- 진행 순서: M1 저장(localStorage) → M2 게임필·밸런스 → M3 모바일 터치 → M4 배포

## 📈 코치 세션 (성장 기록)

### 2026-06-12 — 코칭 체계 시작
- **현재 상태**: 단일 HTML 파일 게임 2개 동작. 캐릭터 이미지 에셋 직접 준비함 (잘함!)
- **코멘트**: 게임이 "돌아간다"에서 "완성됐다"로 가는 차이는 게임 오버 처리·점수·소리 같은 마감 요소. 하나씩 잡아가자.
- **다음 과제**: 게임 오버 후 R 키로 다시 시작하기 — 클로드에게 어떻게 시킬지 프롬프트를 스스로 써보기

## 💬 선생님 코멘트 (수시)

- 2026-06-12 — 빌드 도구 없이 단일 파일로 유지하는 건 지금 단계에서 정답. 구조가 복잡해질 때까지는 이대로 간다.
