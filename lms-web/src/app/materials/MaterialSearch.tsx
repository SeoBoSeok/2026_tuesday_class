"use client";

import { useState } from "react";
import Link from "next/link";

interface Item {
  slug: string;
  title: string;
  difficulty: string;
  haystack: string;
  excerpt: string;
}

const LEVELS = ["전체", "★☆☆", "★★☆", "★★★"];

export default function MaterialSearch({ materials }: { materials: Item[] }) {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("전체");

  const filtered = materials.filter((m) => {
    const okLevel = level === "전체" || m.difficulty === level;
    const okQuery = q.trim() === "" || m.haystack.includes(q.trim().toLowerCase());
    return okLevel && okQuery;
  });

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

      <p className="text-xs text-gray-400">{filtered.length}편</p>

      <ul className="grid md:grid-cols-2 gap-3">
        {filtered.map((m) => (
          <li key={m.slug}>
            <Link
              href={`/materials/${m.slug}`}
              className="block rounded-xl bg-white p-4 shadow-sm border border-amber-100 hover:border-amber-400 transition-colors h-full"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold text-sm">{m.title}</h2>
                <span className="text-xs text-amber-600 whitespace-nowrap">{m.difficulty}</span>
              </div>
              {m.excerpt && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{m.excerpt}</p>}
            </Link>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && (
        <p className="text-sm text-gray-400 py-8 text-center">검색 결과가 없어요. 다른 키워드로 해보거나, 수업에서 질문해 주세요!</p>
      )}
    </div>
  );
}
