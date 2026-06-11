import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { put, list } from "@vercel/blob";

// 데이터 루트:
// - 로컬: 수업 워크스페이스의 lms/ 와 CLAUDE_BASIC/한글정리/ 마크다운을 직접 읽는다
// - Vercel 배포: `npm run sync-data`로 복사해 함께 배포한 data/ 폴더를 읽는다 (읽기 전용)
const ON_VERCEL = !!process.env.VERCEL;
const WORKSPACE = process.env.LMS_ROOT ?? path.resolve(process.cwd(), "..");
const BUNDLED = path.join(process.cwd(), "data");
export const LMS_DIR = ON_VERCEL ? path.join(BUNDLED, "lms") : path.join(WORKSPACE, "lms");
export const MATERIALS_DIR = ON_VERCEL ? path.join(BUNDLED, "materials") : path.join(WORKSPACE, "CLAUDE_BASIC", "한글정리");
export const QUIZ_DIR = path.join(LMS_DIR, "quizzes");
export const QUIZ_RESULTS_DIR = path.join(LMS_DIR, "quiz-results");

// 퀴즈 결과 저장소: Vercel에서는 파일 쓰기가 안 되므로 Vercel Blob(파일 저장소)을 쓴다
const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN;

function readSafe(p: string): string {
  try {
    return fs.readFileSync(p, "utf-8");
  } catch {
    return "";
  }
}

export function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ── 질문 로그 ──────────────────────────────────────────────
export interface Question {
  id: string;
  title: string;
  date: string;
  student: string;
  chapter: string;
  answer: string;
}

export function getQuestions(): Question[] {
  const md = readSafe(path.join(LMS_DIR, "log", "questions.md"));
  const out: Question[] = [];
  for (const block of md.split(/^## /m).slice(1)) {
    const head = block.split("\n")[0]?.trim() ?? "";
    const hm = head.match(/^(Q\d+)\s*·\s*(.+)$/);
    if (!hm) continue;
    const meta = block.match(/\*\*날짜\*\*:\s*(.+?)\s*·\s*\*\*학생\*\*:\s*(.+?)\s*·\s*\*\*챕터\*\*:\s*(.+)/);
    const ans = block.match(/\*\*답변 요지\*\*:\s*([\s\S]+?)(?=\n##|\n*$)/);
    out.push({
      id: hm[1],
      title: hm[2],
      date: meta?.[1]?.trim() ?? "",
      student: meta?.[2]?.trim() ?? "공통",
      chapter: meta?.[3]?.trim() ?? "",
      answer: ans?.[1]?.trim() ?? "",
    });
  }
  return out;
}

// ── 복습 카드 ──────────────────────────────────────────────
export interface Card {
  id: string;
  concept: string;
  prompt: string;
  student: string;
  box: number;
  due: string;
  status: string;
}

export function getCards(): Card[] {
  const md = readSafe(path.join(LMS_DIR, "review", "cards.md"));
  const out: Card[] = [];
  for (const line of md.split("\n")) {
    if (!/^\|\s*C\d+\s*\|/.test(line)) continue;
    const c = line.split("|").map((s) => s.trim());
    out.push({ id: c[1], concept: c[2], prompt: c[3], student: c[4], box: Number(c[5]) || 1, due: c[6], status: c[7] });
  }
  return out;
}

export function getDueCards(): Card[] {
  const t = today();
  return getCards().filter((c) => c.status === "활성" && c.due <= t);
}

// ── 진도 ──────────────────────────────────────────────────
export interface CurriculumRow {
  chapter: string;
  topic: string;
  status: string;
  date: string;
  memo: string;
}

export function getCurriculum(): CurriculumRow[] {
  const md = readSafe(path.join(LMS_DIR, "curriculum.md"));
  const out: CurriculumRow[] = [];
  for (const line of md.split("\n")) {
    if (!line.startsWith("|")) continue;
    const c = line.split("|").map((s) => s.trim());
    if (c.length < 6 || c[1] === "챕터" || c[1].startsWith("--")) continue;
    out.push({ chapter: c[1], topic: c[2], status: c[3], date: c[4], memo: c[5] });
  }
  return out;
}

// ── 수업 기록 (classlog) ──────────────────────────────────
export interface ClassLog {
  date: string;
  title: string;
  content: string;
}

export function getClassLogs(): ClassLog[] {
  const dir = path.join(LMS_DIR, "classlog");
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f));
  } catch {
    return [];
  }
  return files
    .sort()
    .reverse()
    .map((f) => {
      const content = readSafe(path.join(dir, f));
      const title = content.split("\n")[0]?.replace(/^#\s*/, "") ?? f;
      return { date: f.replace(/\.md$/, ""), title, content };
    });
}

// ── 학생 ──────────────────────────────────────────────────
export interface Student {
  id: string;
  name: string;
  project: string;
  repoDir: string;
  github: string;
  file: string;
}

export const STUDENTS: Student[] = [
  {
    id: "a",
    name: "학생 A",
    project: "레트로 HTML 게임",
    repoDir: "first",
    github: "https://github.com/noonmin042-source/first",
    file: "학생A-first.md",
  },
  {
    id: "b",
    name: "학생 B",
    project: "Next.js 웹앱",
    repoDir: "first-commit",
    github: "https://github.com/sooktday-bot/first-commit",
    file: "학생B-first-commit.md",
  },
];

export function getStudent(id: string): Student | undefined {
  return STUDENTS.find((s) => s.id === id);
}

export function getStudentNote(s: Student): string {
  return readSafe(path.join(LMS_DIR, "students", s.file));
}

export interface Commit {
  hash: string;
  date: string;
  message: string;
}

// 프로젝트 발전도: 로컬에서는 git log, 배포 환경에서는 GitHub API로 커밋 이력 조회
export async function getCommits(s: Student, limit = 20): Promise<Commit[]> {
  const repoPath = path.join(WORKSPACE, s.repoDir);
  if (!ON_VERCEL && fs.existsSync(path.join(repoPath, ".git"))) {
    try {
      const raw = execSync(`git -C "${repoPath}" log --date=short --pretty=format:"%h%x09%ad%x09%s" -${limit}`, {
        encoding: "utf-8",
        timeout: 5000,
      });
      return raw
        .split("\n")
        .filter(Boolean)
        .map((l) => {
          const [hash, date, ...rest] = l.split("\t");
          return { hash, date, message: rest.join("\t") };
        });
    } catch {
      // git 실패 시 GitHub API로 폴백
    }
  }
  try {
    const repo = s.github.replace("https://github.com/", "");
    const headers: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "lms-web" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=${limit}`, {
      headers,
      next: { revalidate: 300 }, // 5분 캐시 — API 한도 보호
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { sha: string; commit: { author?: { date?: string }; message: string } }[];
    return json.map((c) => ({
      hash: c.sha.slice(0, 7),
      date: c.commit.author?.date?.slice(0, 10) ?? "",
      message: c.commit.message.split("\n")[0],
    }));
  } catch {
    return [];
  }
}

// ── 학습자료 (CLAUDE_BASIC/한글정리) ───────────────────────
// 클로드 코드 공식 문서(code.claude.com/docs) 목차 순서를 따른 섹션 배치
export const MATERIAL_SECTIONS: { title: string; slugs: string[] }[] = [
  { title: "시작하기", slugs: ["claude_intro", "claude-code-cheat-sheet", "claude_cmd_init", "claude_harness"] },
  { title: "기본 사용법", slugs: ["claude_bash_command", "claude_rewind", "claude_model_cost_cmd", "claude_output_style"] },
  { title: "메모리 · 컨텍스트", slugs: ["claude_memory", "claude_auto_memory", "claude_context_eng_cmd", "claude_context_engineering"] },
  { title: "설정 · 권한 · 자동화 (Hooks)", slugs: ["claude_permissions", "claude_hooks"] },
  { title: "확장하기 — 스킬 · MCP · 플러그인", slugs: ["claude_skills_command", "claude_mcp_cmd", "claude_mcp_skills", "claude_plugin"] },
  { title: "에이전트", slugs: ["claude_agent", "claude_subagent", "claude_agent_team", "claude_batch", "claude_channel"] },
  { title: "고급 활용 · 기타", slugs: ["claude_ralph", "claude_simplify", "claude_debugging", "llm-wiki-slides", "claude_opus4.8", "claude_ollama", "claude_vercel_intro"] },
];

export interface OriginalAsset {
  images: string[];
  pdf?: string;
  html?: string;
}

// 원본 자료(PDF→이미지 변환본, PDF 원본, HTML) 매니페스트 — scripts/convert-originals.sh가 생성
export function getOriginals(): Record<string, OriginalAsset> {
  try {
    return JSON.parse(readSafe(path.join(process.cwd(), "public", "originals", "manifest.json")));
  } catch {
    return {};
  }
}

export interface Material {
  slug: string;
  title: string;
  difficulty: string;
  content: string;
  section: string;
  order: number;
  original?: OriginalAsset;
}

export function getMaterials(): Material[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(MATERIALS_DIR).filter((f) => f.endsWith(".md") && f !== "README.md");
  } catch {
    return [];
  }
  const originals = getOriginals();
  const orderMap = new Map<string, { order: number; section: string }>();
  let i = 0;
  for (const sec of MATERIAL_SECTIONS) {
    for (const slug of sec.slugs) {
      orderMap.set(slug, { order: i++, section: sec.title });
    }
  }
  return files
    .map((f) => {
      const content = readSafe(path.join(MATERIALS_DIR, f));
      const title = content.split("\n")[0]?.replace(/^#\s*/, "") ?? f;
      const difficulty = content.match(/★[★☆]*/)?.[0] ?? "";
      const slug = f.replace(/\.md$/, "");
      const pos = orderMap.get(slug) ?? { order: 999, section: "기타" };
      return { slug, title, difficulty, content, section: pos.section, order: pos.order, original: originals[slug] };
    })
    .sort((a, b) => a.order - b.order);
}

export function getMaterial(slug: string): Material | undefined {
  return getMaterials().find((m) => m.slug === slug);
}

// ── 퀴즈 ──────────────────────────────────────────────────
export interface QuizQuestion {
  id: string;
  type: "choice" | "short";
  prompt: string;
  options?: string[];
  answer: number | string;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  sentAt: string;
  target: string; // "공통" | "학생A" | "학생B"
  questions: QuizQuestion[];
}

export interface QuizResult {
  quizId: string;
  student: string;
  score: number;
  total: number;
  finishedAt: string;
  answers: { qid: string; correct: boolean }[];
}

export function getQuizzes(): Quiz[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(QUIZ_DIR).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
  return files
    .map((f) => JSON.parse(readSafe(path.join(QUIZ_DIR, f))) as Quiz)
    .sort((a, b) => (a.sentAt < b.sentAt ? 1 : -1));
}

export function getQuiz(id: string): Quiz | undefined {
  return getQuizzes().find((q) => q.id === id);
}

export async function getQuizResults(): Promise<QuizResult[]> {
  if (USE_BLOB) {
    try {
      const { blobs } = await list({ prefix: "quiz-results/" });
      return await Promise.all(
        blobs.map(async (b) => (await fetch(b.url, { cache: "no-store" })).json() as Promise<QuizResult>)
      );
    } catch {
      return [];
    }
  }
  let files: string[] = [];
  try {
    files = fs.readdirSync(QUIZ_RESULTS_DIR).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
  return files.map((f) => JSON.parse(readSafe(path.join(QUIZ_RESULTS_DIR, f))) as QuizResult);
}

export async function saveQuizResult(r: QuizResult): Promise<void> {
  const safe = `${r.quizId}-${r.student}-${r.finishedAt}`.replace(/[^a-zA-Z0-9가-힣_-]/g, "_");
  if (USE_BLOB) {
    await put(`quiz-results/${safe}.json`, JSON.stringify(r, null, 2), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });
    return;
  }
  fs.mkdirSync(QUIZ_RESULTS_DIR, { recursive: true });
  fs.writeFileSync(path.join(QUIZ_RESULTS_DIR, `${safe}.json`), JSON.stringify(r, null, 2));
}
