---
description: 퀴즈 발송 — 복습 카드·질문에서 퀴즈를 만들어 웹 LMS에 게시
---

학생들이 웹(http://localhost:3100/quiz)에서 풀 퀴즈를 만들어 발송한다. 주제/대상: $ARGUMENTS

1. `date +%Y-%m-%d`로 오늘 날짜를 확인한다.
2. 출제 재료를 모은다:
   - `lms/review/cards.md`에서 복습 기한이 지났거나 박스가 낮은(취약한) 카드 우선
   - `lms/log/questions.md`의 답변 요지를 정답·해설의 근거로 사용
   - $ARGUMENTS에 주제가 있으면 그 주제 위주로, "학생A"/"학생B"가 있으면 target에 반영 (없으면 "공통")
3. `lms/quizzes/quiz-###.json`을 만든다 (기존 파일 다음 번호). 스키마:
   ```json
   {
     "id": "quiz-002",
     "title": "제목",
     "sentAt": "YYYY-MM-DD",
     "target": "공통",
     "questions": [
       { "id": "q1", "type": "choice", "prompt": "...", "options": ["...", "...", "...", "..."], "answer": 0, "explanation": "..." },
       { "id": "q2", "type": "short", "prompt": "...", "answer": "모범 답안", "explanation": "..." }
     ]
   }
   ```
4. 출제 원칙 (교육학 근거):
   - 4~6문항. choice 위주 + 마지막에 short 1문항(내 말로 설명하기 = 정교화)
   - 정답을 그대로 묻지 말고 응용·변별 상황으로 (예: "이 중 GUI인 것은?")
   - 오답 보기는 학생이 실제로 헷갈릴 법한 것으로
   - explanation에는 "왜"가 들어가야 한다
5. JSON 유효성을 검증한 뒤(`python3 -c "import json; json.load(open(...))"`)
6. 강사에게 보고: 퀴즈 제목, 문항 수, 학생에게 공유할 주소(`http://localhost:3100/quiz`). 웹 서버가 꺼져 있으면 `cd lms-web && npm run dev` 안내.
