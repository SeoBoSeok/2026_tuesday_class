import Link from "next/link";
import QuestionForm from "./QuestionForm";

export default function NewQuestionPage() {
  return (
    <div className="space-y-4 max-w-3xl">
      <Link href="/questions" className="text-sm text-amber-700 underline">← 질문 게시판으로</Link>
      <section>
        <h1 className="text-2xl font-bold mb-1">✍️ 질문 남기기</h1>
        <p className="text-sm text-gray-500">
          어떤 질문이든 좋아요 — 막힌 화면을 사진으로 찍어 올리면 더 빨리 도와드릴 수 있어요.
        </p>
      </section>
      <QuestionForm />
    </div>
  );
}
