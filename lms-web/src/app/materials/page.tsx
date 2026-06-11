import { getMaterials } from "@/lib/data";
import MaterialSearch from "./MaterialSearch";

export const dynamic = "force-dynamic";

export default function MaterialsPage() {
  const materials = getMaterials().map((m) => ({
    slug: m.slug,
    title: m.title,
    difficulty: m.difficulty,
    // 검색용 본문 (소문자) — 클라이언트로 내려보냄
    haystack: (m.title + "\n" + m.content).toLowerCase(),
    excerpt: m.content.split("## 한 줄 요약")[1]?.split("##")[0]?.trim() ?? "",
  }));

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold mb-1">📚 자료실</h1>
        <p className="text-sm text-gray-500">
          클로드 코드 참고자료 {materials.length}편 — 전부 초보자 눈높이 한글 정리본이에요. 키워드로 검색해 보세요.
        </p>
      </section>
      <MaterialSearch materials={materials} />
    </div>
  );
}
