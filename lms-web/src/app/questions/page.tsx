import { getQuestions } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function QuestionsPage() {
  const questions = getQuestions();

  // 챕터별 분포 — 질문이 몰린 곳 = 진짜 궁금해하는 곳
  const byChapter = new Map<string, number>();
  for (const q of questions) {
    byChapter.set(q.chapter, (byChapter.get(q.chapter) ?? 0) + 1);
  }
  const dist = [...byChapter.entries()].sort((a, b) => b[1] - a[1]);
  const max = dist[0]?.[1] ?? 1;
  const top = dist[0];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold mb-1">💬 질문 모음 ({questions.length})</h1>
        <p className="text-sm text-gray-500">
          질문은 부끄러운 게 아니라 가장 좋은 학습 신호예요. 여기 쌓인 질문이 곧 우리 반의 진짜 커리큘럼입니다.
        </p>
      </section>

      {/* 인사이트: 어디를 궁금해하나 */}
      <section className="rounded-xl bg-white p-5 shadow-sm border border-amber-100">
        <h2 className="font-bold mb-1">🔍 우리가 진짜 궁금해하는 곳</h2>
        {top && (
          <p className="text-sm text-gray-600 mb-4">
            질문이 가장 많이 나온 영역은 <span className="font-bold text-amber-700">{top[0]}</span> ({top[1]}건) —
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

      {/* 질문 타임라인 */}
      <section className="space-y-3">
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
