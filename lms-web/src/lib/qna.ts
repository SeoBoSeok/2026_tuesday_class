import fs from "node:fs";
import path from "node:path";
import { put, list } from "@vercel/blob";
import { LMS_DIR } from "./data";

// 질문 게시판 저장소: Vercel Blob(배포·로컬 공용), 토큰 없으면 lms/qna/ 파일 폴백
const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN;
const QNA_DIR = path.join(LMS_DIR, "qna");

export const AUTHORS = ["학생A", "학생B", "선생님"] as const;

export interface AnswerImage {
  url: string;
  caption?: string;
}

export interface BoardAnswer {
  id: string;
  author: string;
  bodyHtml: string;
  images: AnswerImage[];
  materialSlugs: string[];
  createdAt: string;
}

export interface BoardQuestion {
  id: string;
  title: string;
  author: string;
  bodyHtml: string;
  images: string[];
  status: "답변 대기" | "답변 완료";
  createdAt: string;
  answers: BoardAnswer[];
}

// 게시판 HTML 위생 처리 — 스크립트·이벤트 핸들러 제거
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<\s*(script|style|iframe|object|embed|form)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|form|link|meta)[^>]*\/?\s*>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript\s*:/gi, "");
}

export async function getBoardQuestions(): Promise<BoardQuestion[]> {
  let items: BoardQuestion[] = [];
  if (USE_BLOB) {
    try {
      const { blobs } = await list({ prefix: "qna/" });
      items = await Promise.all(
        blobs
          .filter((b) => b.pathname.endsWith(".json"))
          .map(async (b) => (await fetch(b.url, { cache: "no-store" })).json() as Promise<BoardQuestion>)
      );
    } catch {
      items = [];
    }
  } else {
    try {
      items = fs
        .readdirSync(QNA_DIR)
        .filter((f) => f.endsWith(".json"))
        .map((f) => JSON.parse(fs.readFileSync(path.join(QNA_DIR, f), "utf-8")) as BoardQuestion);
    } catch {
      items = [];
    }
  }
  return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getBoardQuestion(id: string): Promise<BoardQuestion | undefined> {
  if (!/^q-[0-9]+$/.test(id)) return undefined;
  if (USE_BLOB) {
    try {
      const { blobs } = await list({ prefix: `qna/${id}.json` });
      if (blobs.length === 0) return undefined;
      return (await (await fetch(blobs[0].url, { cache: "no-store" })).json()) as BoardQuestion;
    } catch {
      return undefined;
    }
  }
  try {
    return JSON.parse(fs.readFileSync(path.join(QNA_DIR, `${id}.json`), "utf-8")) as BoardQuestion;
  } catch {
    return undefined;
  }
}

export async function saveBoardQuestion(q: BoardQuestion): Promise<void> {
  const body = JSON.stringify(q, null, 2);
  if (USE_BLOB) {
    await put(`qna/${q.id}.json`, body, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }
  fs.mkdirSync(QNA_DIR, { recursive: true });
  fs.writeFileSync(path.join(QNA_DIR, `${q.id}.json`), body);
}

// 첨부 이미지 업로드 — Blob에 저장하고 공개 URL 반환 (로컬 폴백: public/uploads)
export async function uploadQnaImage(file: File): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9가-힣._-]/g, "_");
  const pathname = `qna-images/${Date.now()}-${safeName}`;
  if (USE_BLOB) {
    const blob = await put(pathname, file, { access: "public", addRandomSuffix: false });
    return blob.url;
  }
  const dir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(dir, { recursive: true });
  const local = `${Date.now()}-${safeName}`;
  fs.writeFileSync(path.join(dir, local), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${local}`;
}
