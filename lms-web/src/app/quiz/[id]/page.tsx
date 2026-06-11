import Link from "next/link";
import { notFound } from "next/navigation";
import { getQuiz } from "@/lib/data";
import QuizPlayer from "./QuizPlayer";

export const dynamic = "force-dynamic";

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quiz = getQuiz(id);
  if (!quiz) notFound();

  return (
    <div className="space-y-4">
      <Link href="/quiz" className="text-sm text-amber-700 underline">← 퀴즈 목록으로</Link>
      <QuizPlayer quiz={quiz} />
    </div>
  );
}
