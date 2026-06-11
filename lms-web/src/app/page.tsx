import Link from "next/link";
import { STUDENTS, getCommits, getCurriculum, getDueCards, getQuestions, getQuizzes, getQuizResults } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const curriculum = getCurriculum();
  const done = curriculum.filter((c) => c.status.includes("✅")).length;
  const doing = curriculum.filter((c) => c.status.includes("🔄"));
  const due = getDueCards();
  const questions = getQuestions();
  const recentQ = questions.slice(-3).reverse();
  const quizzes = getQuizzes();
  const results = await getQuizResults();
  const commitsByStudent = await Promise.all(STUDENTS.map((s) => getCommits(s, 3)));

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold mb-1">오늘의 학습 현황</h1>
        <p className="text-sm text-gray-500">진도·복습·질문을 한눈에 봅니다.</p>
      </section>

      {/* 요약 카드 */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white p-4 shadow-sm border border-amber-100">
          <div className="text-3xl font-bold text-amber-700">{done}<span className="text-base text-gray-400">/{curriculum.length}</span></div>
          <div className="text-sm text-gray-500 mt-1">완료한 챕터</div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-amber-100">
          <div className="text-3xl font-bold text-red-600">{due.length}</div>
          <div className="text-sm text-gray-500 mt-1">오늘 복습할 카드</div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-amber-100">
          <div className="text-3xl font-bold text-amber-700">{questions.length}</div>
          <div className="text-sm text-gray-500 mt-1">누적 질문</div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-amber-100">
          <div className="text-3xl font-bold text-amber-700">{results.length}<span className="text-base text-gray-400">/{quizzes.length * 2}</span></div>
          <div className="text-sm text-gray-500 mt-1">퀴즈 제출 (2인 기준)</div>
        </div>
      </section>

      {due.length > 0 && (
        <section className="rounded-xl bg-red-50 border border-red-200 p-4">
          <p className="font-semibold text-red-800">🔔 복습 기한이 된 카드가 {due.length}장 있어요</p>
          <p className="text-sm text-red-700 mt-1">
            배운 직후가 가장 빨리 잊어버리는 때예요(망각곡선). <Link href="/quiz" className="underline font-medium">퀴즈 페이지</Link>에서 풀거나, 수업에서 <code className="bg-red-100 px-1 rounded">/review</code>로 복습하세요.
          </p>
        </section>
      )}

      {/* 학생 카드 */}
      <section className="grid md:grid-cols-2 gap-4">
        {STUDENTS.map((s, si) => {
          const commits = commitsByStudent[si];
          return (
            <Link key={s.id} href={`/students/${s.id}`} className="rounded-xl bg-white p-5 shadow-sm border border-amber-100 hover:border-amber-400 transition-colors block">
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-bold">{s.name}</h2>
                <span className="text-xs text-gray-400">{s.repoDir}/</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{s.project}</p>
              <div className="mt-3 space-y-1">
                {commits.length === 0 && <p className="text-xs text-gray-400">커밋 이력 없음</p>}
                {commits.map((c) => (
                  <p key={c.hash} className="text-xs text-gray-500 truncate">
                    <span className="font-mono text-amber-700">{c.date}</span> {c.message}
                  </p>
                ))}
              </div>
            </Link>
          );
        })}
      </section>

      {/* 진행중 + 최근 질문 */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-white p-5 shadow-sm border border-amber-100">
          <h2 className="font-bold mb-3">🔄 지금 배우는 중</h2>
          {doing.length === 0 && <p className="text-sm text-gray-400">진행 중인 챕터가 없어요</p>}
          <ul className="space-y-2">
            {doing.map((c) => (
              <li key={c.chapter} className="text-sm">
                <span className="font-semibold">{c.chapter}.</span> {c.topic}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm border border-amber-100">
          <h2 className="font-bold mb-3">💬 최근 질문</h2>
          <ul className="space-y-2">
            {recentQ.map((q) => (
              <li key={q.id} className="text-sm">
                <Link href="/questions" className="hover:text-amber-700">
                  <span className="text-gray-400 font-mono text-xs mr-1">{q.id}</span>
                  {q.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/questions" className="text-xs text-amber-700 underline mt-3 inline-block">전체 질문 보기 →</Link>
        </div>
      </section>
    </div>
  );
}
