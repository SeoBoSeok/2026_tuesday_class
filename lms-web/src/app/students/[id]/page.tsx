import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { getCommits, getQuizResults, getStudent, getStudentNote, getCards } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function StudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = getStudent(id);
  if (!student) notFound();

  const commits = await getCommits(student, 20);
  const note = getStudentNote(student);
  const noteHtml = note ? await marked.parse(note) : "";
  const myResults = (await getQuizResults()).filter((r) => r.student === student.name.replace(" ", ""));
  const weakCards = getCards().filter((c) => c.status === "활성" && c.box === 1);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold">{student.name} — {student.project}</h1>
        <a href={student.github} target="_blank" rel="noreferrer" className="text-sm text-amber-700 underline">
          {student.github} ↗
        </a>
      </section>

      {/* 프로젝트 발전 타임라인 */}
      <section className="rounded-xl bg-white p-5 shadow-sm border border-amber-100">
        <h2 className="font-bold mb-1">🚀 프로젝트 발전 타임라인</h2>
        <p className="text-xs text-gray-400 mb-4">git 커밋 기록 = 내가 만든 발자취 (최근 20개)</p>
        {commits.length === 0 ? (
          <p className="text-sm text-gray-400">아직 커밋이 없어요. 수업에서 /share 로 첫 커밋을 만들어 봐요!</p>
        ) : (
          <ol className="relative border-l-2 border-amber-200 ml-2 space-y-4">
            {commits.map((c) => (
              <li key={c.hash} className="ml-4">
                <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-amber-500" />
                <p className="text-sm font-medium">{c.message}</p>
                <p className="text-xs text-gray-400 font-mono">{c.date} · {c.hash}</p>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        {/* 퀴즈 성적 */}
        <div className="rounded-xl bg-white p-5 shadow-sm border border-amber-100">
          <h2 className="font-bold mb-3">📝 내 퀴즈 기록</h2>
          {myResults.length === 0 ? (
            <p className="text-sm text-gray-400">아직 푼 퀴즈가 없어요. <Link href="/quiz" className="text-amber-700 underline">퀴즈 풀러 가기 →</Link></p>
          ) : (
            <ul className="space-y-2">
              {myResults.map((r, i) => (
                <li key={i} className="text-sm flex justify-between">
                  <span>{r.quizId}</span>
                  <span className="font-bold text-amber-700">{r.score}/{r.total}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* 함께 다지는 개념 */}
        <div className="rounded-xl bg-white p-5 shadow-sm border border-amber-100">
          <h2 className="font-bold mb-3">🌱 지금 다지는 중인 개념</h2>
          <p className="text-xs text-gray-400 mb-2">복습 1단계(박스 1)에 있는 카드 — 아직 새싹이에요</p>
          <ul className="flex flex-wrap gap-2">
            {weakCards.map((c) => (
              <li key={c.id} className="text-xs bg-amber-50 border border-amber-200 rounded-full px-3 py-1">{c.concept}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 학습 노트 (강사 기록) */}
      {noteHtml && (
        <section className="rounded-xl bg-white p-5 shadow-sm border border-amber-100">
          <h2 className="font-bold mb-3">📒 학습 노트</h2>
          <div className="md-body text-sm" dangerouslySetInnerHTML={{ __html: noteHtml }} />
        </section>
      )}
    </div>
  );
}
