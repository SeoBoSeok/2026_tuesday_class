# 권한(Permissions) — Claude의 행동에 안전벨트 채우기
> 원본: claude_permissions.pdf · 난이도: ★★☆(곧 필요)

## 한 줄 요약
권한 시스템은 Claude가 파일 수정·명령 실행을 하기 전에 허락을 받게 만드는 안전장치이며, `/permissions`에서 allow(허용)/ask(물어보기)/deny(금지) 규칙으로 관리한다.

## 이게 뭐예요?
Claude Code는 내 컴퓨터에서 파일을 고치고 명령을 실행할 수 있는 강력한 도구예요. 그래서 자동차의 안전벨트와 브레이크 같은 권한 시스템이 붙어 있어요. 위험한 명령(`rm -rf /` 같은 전체 삭제)이나 비밀 파일(.env, 비밀번호 저장 파일) 접근을 막아주고, 모든 변경에 대해 최종 결정권을 나에게 남겨줘요. Claude가 뭘 하려는지 승인 창으로 하나씩 보여주기 때문에 "무슨 일이 일어나는지" 투명하게 볼 수 있어요. 실제 사용자들은 권한 요청의 약 93%를 승인한다고 해요 — 즉 대부분은 통과시키되, 위험한 순간에 잡아주는 그물망이에요.

## 핵심 정리
- `/permissions` 입력 → 권한 관리 화면. 규칙 3종류: **allow**(승인 없이 허용) / **ask**(매번 물어봄) / **deny**(아예 금지)
- 검사 순서: **Deny → Ask → Allow → Default** (금지가 항상 우선)
- 도구 종류별 기본 동작: 읽기 전용(ls, cat, grep 등)은 승인 불필요 / Bash 명령은 승인하면 그 프로젝트에서 계속 유지 / 파일 수정은 세션(현재 대화) 끝날 때까지 유지
- 규칙 문법 `Tool(지정자)`: `Bash(npm run *)` npm run으로 시작하는 명령 허용, `Read(./.env)` .env 읽기 규칙, `WebFetch(domain:example.com)` 특정 사이트만 허용
- 설정 파일에 직접 쓸 수도 있음: `"permissions": { "allow": [...], "deny": ["Bash(git push *)", "Read(./.env)"] }`
- 권한 모드: **default**(기본, 처음에 물어봄), **acceptEdits**(파일 수정 자동 승인), **plan**(읽기만, 수정 안 함), **bypassPermissions**(전부 통과 — 위험) 등
- 설정 우선순위(센 것부터): 관리자 설정 > 명령줄 옵션 > 프로젝트 로컬(.claude/settings.local.json) > 프로젝트 공유(.claude/settings.json) > 개인(~/.claude/settings.json)
- 복합 명령(`a && b`)은 **모든** 부분 명령이 허용돼야 통과 — 나중에 더 배워요.

## 따라해보기
1. `/permissions` — 현재 적용된 권한 규칙과 출처(settings.json) 확인
2. `Shift+Tab` — 권한 모드(default → acceptEdits → plan)를 순환 전환해보기
3. `!cat ~/.claude/settings.json` — 내 개인 설정 파일에 어떤 권한이 저장됐는지 보기

## 주의할 점 / 자주 헷갈리는 것
- "한 번 허용"과 "항상 허용"은 달라요. 승인 창에서 어떤 버튼을 누르는지 확인하세요.
- deny가 allow보다 항상 우선이에요. "허용했는데 왜 막히지?" 싶으면 deny 규칙을 의심하세요.
- `Bash(ls *)`(공백 있음, "ls 다음에 뭐가 와도")와 `Bash(ls*)`(공백 없음, "ls로 시작하는 단어")는 다르게 동작해요.
- bypassPermissions 모드는 모든 확인을 건너뛰어요. 초보 단계에서는 절대 켜지 마세요. (`rm -rf /`만은 최후의 안전장치로 여전히 물어봐요)
