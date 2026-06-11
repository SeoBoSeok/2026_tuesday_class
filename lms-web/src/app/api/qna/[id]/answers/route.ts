import { NextResponse } from "next/server";
import { AUTHORS, getBoardQuestion, saveBoardQuestion, sanitizeHtml, type AnswerImage } from "@/lib/qna";
import { getMaterials } from "@/lib/data";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const question = await getBoardQuestion(id);
  if (!question) {
    return NextResponse.json({ error: "질문을 찾을 수 없어요" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });
  }

  const r = body as { author?: string; bodyHtml?: string; images?: AnswerImage[]; materialSlugs?: string[] };
  if (!AUTHORS.includes((r.author ?? "") as (typeof AUTHORS)[number])) {
    return NextResponse.json({ error: "답변자를 선택해 주세요" }, { status: 400 });
  }
  const bodyHtml = sanitizeHtml(r.bodyHtml ?? "");
  if (!bodyHtml.replace(/<[^>]*>/g, "").trim() && (!r.images || r.images.length === 0)) {
    return NextResponse.json({ error: "답변 내용을 입력해 주세요" }, { status: 400 });
  }

  // 관련 강의: 실제 자료실에 존재하는 slug만 허용
  const validSlugs = new Set(getMaterials().map((m) => m.slug));
  const materialSlugs = Array.isArray(r.materialSlugs)
    ? r.materialSlugs.filter((s) => typeof s === "string" && validSlugs.has(s))
    : [];

  const images: AnswerImage[] = Array.isArray(r.images)
    ? r.images
        .filter((i) => i && typeof i.url === "string")
        .slice(0, 5)
        .map((i) => ({ url: i.url, caption: typeof i.caption === "string" ? i.caption.slice(0, 300) : undefined }))
    : [];

  question.answers.push({
    id: `a-${Date.now()}`,
    author: r.author as string,
    bodyHtml,
    images,
    materialSlugs,
    createdAt: new Date().toISOString().slice(0, 19),
  });
  question.status = "답변 완료";
  await saveBoardQuestion(question);
  return NextResponse.json({ ok: true });
}
