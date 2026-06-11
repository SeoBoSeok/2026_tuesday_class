// 배포용 데이터 동기화: 워크스페이스의 lms/ 와 CLAUDE_BASIC/한글정리/ 를 data/ 로 복사한다.
// Vercel에서는 파일 쓰기가 안 되므로, 읽기 데이터를 앱과 함께 배포하기 위함.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd(), "..");
const out = path.join(process.cwd(), "data");

const COPIES = [
  ["lms/curriculum.md", "lms/curriculum.md"],
  ["lms/log", "lms/log"],
  ["lms/review", "lms/review"],
  ["lms/students", "lms/students"],
  ["lms/quizzes", "lms/quizzes"],
  ["lms/classlog", "lms/classlog"],
  ["lms/coaching", "lms/coaching"],
  ["CLAUDE_BASIC/한글정리", "materials"],
];

fs.rmSync(out, { recursive: true, force: true });
let count = 0;
for (const [src, dst] of COPIES) {
  const s = path.join(root, src);
  const d = path.join(out, dst);
  if (!fs.existsSync(s)) {
    console.warn(`건너뜀 (없음): ${src}`);
    continue;
  }
  fs.mkdirSync(path.dirname(d), { recursive: true });
  fs.cpSync(s, d, { recursive: true });
  count++;
}
console.log(`✅ data/ 동기화 완료 (${count}개 항목) — 이제 커밋하고 푸시하면 배포에 반영됩니다`);
