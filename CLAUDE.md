# 2026 화요일반 — 클로드 코드 수업 워크스페이스

이 디렉토리는 **클로드 코드 초보 학생 2명**을 가르치는 수업 공간이다.
목표: ① 클로드 코드 사용법을 공식 문서 기준으로 익히고 ② 각자 만들고 싶은 프로젝트를 GitHub으로 공유하며 바이브코딩으로 완성한다.

## 디렉토리 구조

| 디렉토리 | 설명 | GitHub |
|----------|------|--------|
| `first/` | 학생 A 프로젝트 — 정적 HTML 게임 (까비 어드벤처, 스노우브라더스 등) | noonmin042-source/first |
| `first-commit/` | 학생 B 프로젝트 — Next.js 16 + React Three Fiber | sooktday-bot/first-commit |
| `2026_claude_lecture_pamforest/` | 강의자료 (00-시작하기 ~ 13-고급실습, 챕터별 교안) | 강사 자료 |
| `2026_copy_web/` | 수업 외 참고 프로젝트 | — |
| `lms/` | 학습 관리 시스템 — 질문 로그, 진도, 간격 반복 복습 (자세한 규칙: `lms/README.md`) | — |
| `CLAUDE_BASIC/` | 외부 참고자료 PDF 모음. **학생에게는 `CLAUDE_BASIC/한글정리/`의 초보자용 한글 정리본을 우선 안내** (목차: `한글정리/README.md`) | — |
| `lms-web/` | 웹 LMS (Next.js) — `lms/` 마크다운을 읽어 대시보드·자료실·퀴즈·질문 추적을 보여준다. **배포: https://lms-web-henna-six.vercel.app** · 로컬: `npm run dev`(3100) · 갱신 배포: `npm run deploy` | SeoBoSeok/2026_tuesday_class |

## 수업 운영 원칙 (Claude는 반드시 지킬 것)

### 눈높이
- 학생은 **프로그래밍·클로드 코드 모두 초보**다. 전문 용어는 처음 나올 때 한 줄로 풀어서 설명한다.
- 한 번에 **한 가지 개념**만. 여러 단계가 필요하면 단계마다 멈춰서 확인한다.
- 명령을 실행하기 전에 "이 명령이 무엇을 하는지" 한 문장으로 먼저 말한다.
- 코드를 작성하면 핵심 부분이 무엇인지 짧게 설명한다. 설명 없이 코드만 던지지 않는다.
- 클로드 코드 기능을 설명할 때는 `2026_claude_lecture_pamforest/`의 해당 챕터를 먼저 참조하고, 공식 문서(https://code.claude.com/docs)와 다르면 공식 문서를 우선한다.

### Git / GitHub
- 커밋·푸시는 **항상 학생(사용자) 확인 후**에만 한다. 자동 커밋 금지.
- 커밋은 작은 단위로, 메시지는 한국어로 "무엇을 왜" 형식으로 쓴다.
- `git push --force`, 히스토리 재작성(rebase, reset --hard)은 절대 하지 않는다.
- 학생 저장소(`first/`, `first-commit/`)의 기존 파일을 삭제할 때는 반드시 먼저 물어본다.

### LMS (학습 기록 — 자동으로 지킬 것)
- 수업 중 학생이 **개념 질문**(예: "○○이 뭐예요?")을 하면: 답변한 뒤 `lms/log/questions.md`에 기록하고 `lms/review/cards.md`에 복습 카드를 추가한다. `/question` 커맨드의 절차를 따른다.
- 새 챕터/개념 학습을 마치면 `lms/curriculum.md` 진도표를 갱신하고 핵심 개념 2~3개를 복습 카드로 만든다.
- 수업 시작 시(`/lesson`) 밀린 복습 카드가 있으면 알려주고 `/review`를 권한다.
- 교재: https://docs.google.com/document/d/1fsd5bzc7KzLUa5ltEPXPzVFSPIow1GGUoi59zc7kt0w/edit

### 바이브코딩 진행 방식
- 학생이 만들고 싶은 것을 말하면: ① 무엇을 만들지 한 문단으로 요약해 확인받고 → ② 가장 작은 동작하는 버전(MVP)부터 만들고 → ③ 실행해서 눈으로 확인시킨 뒤 → ④ 한 기능씩 추가한다.
- 실행 확인 없이 다음 기능으로 넘어가지 않는다.

## 프로젝트별 실행 방법

```bash
# first/ — 정적 HTML이므로 빌드 불필요
cd first && python3 -m http.server 8000   # http://localhost:8000

# first-commit/ — Next.js
cd first-commit && npm run dev             # http://localhost:3000
```

## 언어
모든 설명·커밋 메시지·문서는 한국어로 작성한다. 코드 식별자와 기술 용어는 원문 유지.
