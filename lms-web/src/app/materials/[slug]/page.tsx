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

  return (
    <div className="space-y-4">
      <Link href="/materials" className="text-sm text-amber-700 underline">← 자료실로</Link>
      <article className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-amber-100">
        <div className="md-body" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      <p className="text-xs text-gray-400">
        읽다가 궁금한 게 생기면 수업에서 바로 질문하세요 — 질문은 자동으로 기록되고 복습 카드가 돼요.
      </p>
    </div>
  );
}
