import Link from "next/link";
import { getQuestions } from "@/lib/data";
import { getBoardQuestions } from "@/lib/qna";

export const dynamic = "force-dynamic";

export default async function QuestionsPage() {
  const board = await getBoardQuestions();
  const questions = getQuestions();
  const waiting = board.filter((b) => b.status === "답변 대기").length;

  // 챕터별 분포 — 질문이 몰린 곳 = 진짜 궁금해하는 곳 (수업 중 기록 기준)
  const byChapter = new Map<string, number>();
  for (const q of questions) {
    byChapter.set(q.chapter, (byChapter.get(q.chapter) ?? 0) + 1);
  }
  const dist = [...byChapter.entries()].sort((a, b) => b[1] - a[1]);
  const max = dist[0]?.[1] ?? 1;
  const top = dist[0];

  return (
    <div className="space-y-10">
      {/* 질문 게시판 */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold mb-1">💬 질문 게시판</h1>
            <p className="text-sm text-gray-500">
              궁금한 건 언제든 남겨주세요. 질문은 부끄러운 게 아니라 가장 좋은 학습 신호예요.
              {waiting > 0 && <span className="text-amber-700 font-bold"> · 답변 대기 {waiting}건</span>}
            </p>
          </div>
          <Link
            href="/questions/new"
            className="rounded-lg bg-amber-700 text-white px-5 py-2.5 font-bold hover:bg-amber-800 transition-colors"
          >
            ✍️ 질문 남기기
          </Link>
        </div>

        {board.length === 0 ? (
          <p className="rounded-xl bg-white p-8 text-center text-sm text-gray-400 border border-amber-100">
            첫 질문을 남겨보세요! 막힌 화면 사진과 함께 올리면 더 빨리 답변받을 수 있어요.
          </p>
        ) : (
          <ul className="space-y-3">
            {board.map((q) => (
              <li key={q.id}>
                <Link
                  href={`/questions/${q.id}`}
                  className="block rounded-xl bg-white p-4 shadow-sm border border-amber-100 hover:border-amber-400 transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs font-bold rounded-full px-3 py-1 whitespace-nowrap ${
                        q.status === "답변 완료" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {q.status}
                    </span>
                    <span className="font-semibold flex-1">{q.title}</span>
                    {q.images.length > 0 && <span className="text-xs text-gray-400">📷 {q.images.length}</span>}
                    {q.answers.length > 0 && <span className="text-xs text-green-700 font-bold">답변 {q.answers.length}</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">{q.author} · {q.createdAt.replace("T", " ")}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 인사이트: 어디를 궁금해하나 */}
      <section className="rounded-xl bg-white p-5 shadow-sm border border-amber-100">
        <h2 className="font-bold mb-1">🔍 우리가 진짜 궁금해하는 곳</h2>
        {top && (
          <p className="text-sm text-gray-600 mb-4">
            수업 중 질문이 가장 많이 나온 영역은 <span className="font-bold text-amber-700">{top[0]}</span> ({top[1]}건) —
            이 부분을 복습과 퀴즈에서 우선으로 다룹니다.
          </p>
        )}
        <div className="space-y-2">
          {dist.map(([chapter, count]) => (
            <div key={chapter} className="flex items-center gap-3 text-sm">
              <span className="w-40 truncate text-gray-600">{chapter}</span>
              <div className="flex-1 bg-amber-50 rounded-full h-5 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full flex items-center justify-end pr-2 text-[10px] text-white font-bold"
                  style={{ width: `${Math.max((count / max) * 100, 12)}%` }}
                >
                  {count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 수업 중 질문 기록 */}
      <section className="space-y-3">
        <h2 className="font-bold text-lg">📒 수업 중 질문 기록 ({questions.length})</h2>
        <p className="text-sm text-gray-500 -mt-1">수업 시간에 나온 질문과 답변이에요. 클릭하면 답변이 펼쳐져요.</p>
        {[...questions].reverse().map((q) => (
          <details key={q.id} className="rounded-xl bg-white shadow-sm border border-amber-100 group">
            <summary className="cursor-pointer p-4 flex items-baseline gap-3 hover:bg-amber-50 rounded-xl list-none">
              <span className="text-xs font-mono text-gray-400">{q.id}</span>
              <span className="font-medium flex-1">{q.title}</span>
              <span className="text-xs text-gray-400 whitespace-nowrap">{q.chapter}</span>
              <span className="text-gray-300 group-open:rotate-90 transition-transform">▶</span>
            </summary>
            <div className="px-4 pb-4 text-sm text-gray-700 leading-relaxed border-t border-amber-50 pt-3">
              {q.answer}
              <p className="text-xs text-gray-400 mt-2">{q.date} · {q.student}</p>
            </div>
          </details>
        ))}
      </section>
    </div>
  );
}
