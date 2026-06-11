import { NextResponse } from "next/server";
import { AUTHORS, saveBoardQuestion, sanitizeHtml, type BoardQuestion } from "@/lib/qna";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });
  }

  const r = body as { title?: string; author?: string; bodyHtml?: string; images?: string[] };
  const title = (r.title ?? "").trim();
  if (!title || title.length > 200) {
    return NextResponse.json({ error: "제목을 입력해 주세요 (200자 이내)" }, { status: 400 });
  }
  if (!AUTHORS.includes((r.author ?? "") as (typeof AUTHORS)[number])) {
    return NextResponse.json({ error: "질문자를 선택해 주세요" }, { status: 400 });
  }
  const bodyHtml = sanitizeHtml(r.bodyHtml ?? "");
  if (!bodyHtml.replace(/<[^>]*>/g, "").trim() && (!r.images || r.images.length === 0)) {
    return NextResponse.json({ error: "질문 내용을 입력해 주세요" }, { status: 400 });
  }

  const q: BoardQuestion = {
    id: `q-${Date.now()}`,
    title,
    author: r.author as string,
    bodyHtml,
    images: Array.isArray(r.images) ? r.images.filter((u) => typeof u === "string").slice(0, 5) : [],
    status: "답변 대기",
    createdAt: new Date().toISOString().slice(0, 19),
    answers: [],
  };
  await saveBoardQuestion(q);
  return NextResponse.json({ ok: true, id: q.id });
}
