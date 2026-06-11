import { NextResponse } from "next/server";
import { saveQuizResult, getQuiz } from "@/lib/data";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });
  }

  const r = body as {
    quizId?: string;
    student?: string;
    score?: number;
    total?: number;
    finishedAt?: string;
    answers?: { qid: string; correct: boolean }[];
  };

  if (!r.quizId || !r.student || !getQuiz(r.quizId) || !["학생A", "학생B"].includes(r.student)) {
    return NextResponse.json({ error: "퀴즈 또는 학생 정보가 올바르지 않아요" }, { status: 400 });
  }

  await saveQuizResult({
    quizId: r.quizId,
    student: r.student,
    score: Number(r.score) || 0,
    total: Number(r.total) || 0,
    finishedAt: r.finishedAt ?? new Date().toISOString().slice(0, 19),
    answers: Array.isArray(r.answers) ? r.answers : [],
  });

  return NextResponse.json({ ok: true });
}
