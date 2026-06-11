"use client";

import { useState } from "react";
import Link from "next/link";

interface Item {
  slug: string;
  title: string;
  difficulty: string;
  section: string;
  hasOriginal: boolean;
  isPdf: boolean;
  haystack: string;
  excerpt: string;
}

const LEVELS = ["전체", "★☆☆", "★★☆", "★★★"];

function Card({ m }: { m: Item }) {
  return (
    <Link
      href={`/materials/${m.slug}`}
      className="block rounded-xl bg-white p-4 shadow-sm border border-amber-100 hover:border-amber-400 transition-colors h-full"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm">{m.title}</h3>
        <span className="text-xs text-amber-600 whitespace-nowrap">{m.difficulty}</span>
      </div>
      {m.excerpt && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{m.excerpt}</p>}
      {m.hasOriginal && (
        <p className="text-[10px] text-gray-400 mt-2">
          {m.isPdf ? "📄 PDF 원본 보기·다운로드 가능" : "🖼 원본 이미지로 보기 가능"}
        </p>
      )}
    </Link>
  );
}

export default function MaterialSearch({ materials }: { materials: Item[] }) {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("전체");

  const filtered = materials.filter((m) => {
    const okLevel = level === "전체" || m.difficulty === level;
    const okQuery = q.trim() === "" || m.haystack.includes(q.trim().toLowerCase());
    return okLevel && okQuery;
  });

  // 검색·필터 중이 아니면 공식 문서 순서의 섹션별로 묶어서 표시
  const grouped = q.trim() === "" && level === "전체";
  const sections: { title: string; items: Item[] }[] = [];
  if (grouped) {
    for (const m of filtered) {
      const last = sections[sections.length - 1];
      if (last && last.title === m.section) last.items.push(m);
      else sections.push({ title: m.section, items: [m] });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="검색 — 예: MCP, 메모리, 권한, /compact"
          className="flex-1 min-w-60 rounded-lg border border-amber-200 bg-white px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
        />
        <div className="flex gap-1">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`text-xs rounded-full px-3 py-1.5 border transition-colors ${
                level === l ? "bg-amber-700 text-white border-amber-700" : "bg-white border-amber-200 hover:border-amber-400"
              }`}
            >
              {l === "전체" ? "전체" : `${l} ${l === "★☆☆" ? "지금" : l === "★★☆" ? "곧" : "나중에"}`}
            </button>
          ))}
        </div>
      </div>

      {grouped ? (
        <div className="space-y-8">
          {sections.map((sec, i) => (
            <section key={sec.title}>
              <h2 className="font-bold text-amber-900 mb-3">
                <span className="text-amber-500 mr-1">{i + 1}.</span> {sec.title}
              </h2>
              <ul className="grid md:grid-cols-2 gap-3">
                {sec.items.map((m) => (
                  <li key={m.slug}><Card m={m} /></li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-400">{filtered.length}편</p>
          <ul className="grid md:grid-cols-2 gap-3">
            {filtered.map((m) => (
              <li key={m.slug}><Card m={m} /></li>
            ))}
          </ul>
          {filtered.length === 0 && (
            <p className="text-sm text-gray-400 py-8 text-center">검색 결과가 없어요. 다른 키워드로 해보거나, 수업에서 질문해 주세요!</p>
          )}
        </>
      )}
    </div>
  );
}
