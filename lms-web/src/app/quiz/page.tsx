import Link from "next/link";
import { getQuizzes, getQuizResults } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function QuizListPage() {
  const quizzes = getQuizzes();
  const results = await getQuizResults();

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold mb-1">📝 퀴즈</h1>
        <p className="text-sm text-gray-500">
          선생님이 보낸 퀴즈예요. 답을 보기 전에 <b>먼저 스스로 떠올려보는 것</b>이 기억에 제일 오래 남아요 (인출 연습).
        </p>
      </section>

      {quizzes.length === 0 && (
        <p className="rounded-xl bg-white p-8 text-center text-sm text-gray-400 border border-amber-100">
          아직 발송된 퀴즈가 없어요. 선생님이 보내면 여기에 나타나요!
        </p>
      )}

      <ul className="space-y-3">
        {quizzes.map((quiz) => {
          const submitted = results.filter((r) => r.quizId === quiz.id);
          return (
            <li key={quiz.id}>
              <Link
                href={`/quiz/${quiz.id}`}
                className="block rounded-xl bg-white p-5 shadow-sm border border-amber-100 hover:border-amber-400 transition-colors"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-bold">{quiz.title}</h2>
                  <span className="text-xs text-gray-400">{quiz.sentAt} 발송 · 대상 {quiz.target}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{quiz.questions.length}문항</p>
                {submitted.length > 0 && (
                  <p className="text-xs text-amber-700 mt-2">
                    제출: {submitted.map((r) => `${r.student} ${r.score}/${r.total}`).join(" · ")}
                  </p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
