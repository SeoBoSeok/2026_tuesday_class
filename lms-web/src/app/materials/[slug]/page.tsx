import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { getMaterial } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function MaterialPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const material = getMaterial(decodeURIComponent(slug));
  if (!material) notFound();

  const html = await marked.parse(material.content);
  const original = material.original;
  const hasImages = !!original && original.images.length > 0;

  return (
    <div className="space-y-4">
      <Link href="/materials" className="text-sm text-amber-700 underline">← 자료실로</Link>

      {/* 한글 정리본 */}
      <article className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-amber-100">
        <div className="md-body" dangerouslySetInnerHTML={{ __html: html }} />
      </article>

      {/* 원본 자료 */}
      {original?.pdf && (
        <section className="rounded-xl bg-white p-6 shadow-sm border border-amber-100 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-bold">📄 원본 PDF</h2>
            <a
              href={original.pdf}
              download
              className="rounded-lg bg-amber-700 text-white px-4 py-2 text-sm font-bold hover:bg-amber-800"
            >
              ⬇ PDF 다운로드
            </a>
          </div>
          <iframe src={original.pdf} className="w-full h-[80vh] rounded-lg border border-amber-100" title="원본 PDF" />
        </section>
      )}

      {!original?.pdf && hasImages && (
        <details className="rounded-xl bg-white shadow-sm border border-amber-100 group" open>
          <summary className="cursor-pointer p-5 font-bold list-none flex items-center justify-between hover:bg-amber-50 rounded-xl">
            🖼 원본 자료 보기 ({original!.images.length}페이지)
            <span className="text-gray-300 group-open:rotate-90 transition-transform text-sm">▶</span>
          </summary>
          <div className="px-5 pb-5 space-y-3">
            {original!.images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt={`원본 ${i + 1}페이지`} loading="lazy" className="w-full rounded-lg border border-amber-100" />
            ))}
          </div>
        </details>
      )}

      {original?.html && (
        <section className="rounded-xl bg-white p-6 shadow-sm border border-amber-100 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-bold">🎞 원본 슬라이드</h2>
            <a href={original.html} target="_blank" rel="noreferrer" className="rounded-lg bg-amber-700 text-white px-4 py-2 text-sm font-bold hover:bg-amber-800">
              새 창에서 크게 보기 ↗
            </a>
          </div>
          <iframe src={original.html} className="w-full h-[70vh] rounded-lg border border-amber-100" title="원본 슬라이드" />
        </section>
      )}

      <p className="text-xs text-gray-400">
        읽다가 궁금한 게 생기면 수업에서 바로 질문하세요 — 질문은 자동으로 기록되고 복습 카드가 돼요.
      </p>
    </div>
  );
}
