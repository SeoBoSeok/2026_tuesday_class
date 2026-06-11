import Link from "next/link";
import { notFound } from "next/navigation";
import { getBoardQuestion } from "@/lib/qna";
import { getMaterials } from "@/lib/data";
import AnswerForm from "./AnswerForm";

export const dynamic = "force-dynamic";

export default async function QuestionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const q = await getBoardQuestion(id);
  if (!q) notFound();

  const materials = getMaterials();
  const titleBySlug = new Map(materials.map((m) => [m.slug, m.title]));

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href="/questions" className="text-sm text-amber-700 underline">← 질문 게시판으로</Link>

      {/* 질문 */}
      <article className="rounded-xl bg-white p-6 shadow-sm border border-amber-100 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-xs font-bold rounded-full px-3 py-1 ${
              q.status === "답변 완료" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
            }`}
          >
            {q.status}
          </span>
          <h1 className="text-xl font-bold flex-1">{q.title}</h1>
        </div>
        <p className="text-xs text-gray-400">{q.author} · {q.createdAt.replace("T", " ")}</p>
        {q.bodyHtml && <div className="md-body text-sm" dangerouslySetInnerHTML={{ __html: q.bodyHtml }} />}
        {q.images.length > 0 && (
          <div className="space-y-3">
            {q.images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt={`질문 첨부 ${i + 1}`} loading="lazy" className="w-full rounded-lg border border-amber-100" />
            ))}
          </div>
        )}
      </article>

      {/* 답변 목록 */}
      <section className="space-y-4">
        <h2 className="font-bold">💬 답변 {q.answers.length > 0 && `(${q.answers.length})`}</h2>
        {q.answers.length === 0 && (
          <p className="rounded-xl bg-white p-6 text-center text-sm text-gray-400 border border-amber-100">
            아직 답변이 없어요. 선생님이 곧 답변해 드릴게요!
          </p>
        )}
        {q.answers.map((a) => (
          <article key={a.id} className="rounded-xl bg-green-50/50 p-6 shadow-sm border border-green-200 space-y-4">
            <p className="text-xs text-gray-500">
              <span className="font-bold text-green-800">{a.author}</span> · {a.createdAt.replace("T", " ")}
            </p>
            {a.bodyHtml && <div className="md-body text-sm" dangerouslySetInnerHTML={{ __html: a.bodyHtml }} />}
            {a.images.length > 0 && (
              <div className="space-y-3">
                {a.images.map((img, i) => (
                  <figure key={img.url}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.caption || `답변 첨부 ${i + 1}`} loading="lazy" className="w-full rounded-lg border border-green-100" />
                    {img.caption && <figcaption className="text-xs text-gray-500 mt-1">📷 {img.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            )}
            {a.materialSlugs.length > 0 && (
              <div className="rounded-lg bg-white border border-green-200 p-3">
                <p className="text-xs font-bold text-green-800 mb-2">📚 함께 보면 좋은 강의 자료</p>
                <ul className="space-y-1">
                  {a.materialSlugs.map((slug) => (
                    <li key={slug}>
                      <Link href={`/materials/${slug}`} className="text-sm text-amber-700 underline hover:text-amber-900">
                        {titleBySlug.get(slug) ?? slug} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        ))}
      </section>

      {/* 답변 작성 */}
      <AnswerForm
        questionId={q.id}
        materials={materials.map((m) => ({ slug: m.slug, title: m.title, section: m.section }))}
      />
    </div>
  );
}
