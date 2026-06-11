"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "../RichTextEditor";
import ImageUploader, { type UploadedImage } from "../ImageUploader";

const AUTHORS = ["선생님", "학생A", "학생B"];

interface MaterialOption {
  slug: string;
  title: string;
  section: string;
}

export default function AnswerForm({ questionId, materials }: { questionId: string; materials: MaterialOption[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [author, setAuthor] = useState("선생님");
  const [bodyHtml, setBodyHtml] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function toggle(slug: string) {
    const next = new Set(selected);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    setSelected(next);
  }

  async function submit() {
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`/api/qna/${questionId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author,
          bodyHtml,
          images: images.map((i) => ({ url: i.url, caption: i.caption || undefined })),
          materialSlugs: [...selected],
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "등록에 실패했어요");
        setBusy(false);
        return;
      }
      router.refresh();
      setOpen(false);
      setBodyHtml("");
      setImages([]);
      setSelected(new Set());
      setBusy(false);
    } catch {
      setError("등록에 실패했어요. 다시 시도해 주세요.");
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 py-4 font-bold text-amber-800 hover:border-amber-500 transition-colors"
      >
        ✏️ 답변 작성하기
      </button>
    );
  }

  const visible = materials.filter(
    (m) => filter.trim() === "" || m.title.toLowerCase().includes(filter.trim().toLowerCase())
  );

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-amber-100 space-y-5">
      <h2 className="font-bold">✏️ 답변 작성</h2>

      <div>
        <p className="text-sm font-bold mb-2">답변자</p>
        <div className="flex gap-2">
          {AUTHORS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAuthor(a)}
              className={`rounded-full px-4 py-1.5 text-sm border transition-colors ${
                author === a ? "bg-amber-700 text-white border-amber-700" : "bg-white border-amber-200 hover:border-amber-400"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-bold mb-2">답변 내용</p>
        <RichTextEditor onChange={setBodyHtml} placeholder="답변을 적어주세요." />
      </div>

      <div>
        <p className="text-sm font-bold mb-1">이미지 (선택)</p>
        <p className="text-xs text-gray-400 mb-2">스크린샷을 올리고 아래 칸에 이미지 설명을 적을 수 있어요.</p>
        <ImageUploader images={images} onChange={setImages} withCaption />
      </div>

      <div>
        <p className="text-sm font-bold mb-1">관련 강의 자료 연결 (선택)</p>
        <p className="text-xs text-gray-400 mb-2">체크하면 답변에 자료실 링크가 함께 표시돼요. {selected.size > 0 && `— ${selected.size}개 선택됨`}</p>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="자료 검색…"
          className="w-full rounded-lg border border-amber-200 px-3 py-1.5 text-xs mb-2 focus:outline-none focus:border-amber-500"
        />
        <div className="max-h-52 overflow-y-auto rounded-lg border border-amber-100 p-3 space-y-1">
          {visible.map((m, i) => {
            const newSection = i === 0 || visible[i - 1].section !== m.section;
            return (
              <div key={m.slug}>
                {newSection && <p className="text-[10px] font-bold text-amber-500 mt-2 first:mt-0">{m.section}</p>}
                <label className="flex items-start gap-2 text-xs cursor-pointer hover:bg-amber-50 rounded px-1 py-0.5">
                  <input
                    type="checkbox"
                    checked={selected.has(m.slug)}
                    onChange={() => toggle(m.slug)}
                    className="mt-0.5 accent-amber-700"
                  />
                  <span>{m.title}</span>
                </label>
              </div>
            );
          })}
          {visible.length === 0 && <p className="text-xs text-gray-400">검색 결과가 없어요</p>}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={submit}
          disabled={busy}
          className="rounded-lg bg-amber-700 text-white px-6 py-2.5 font-bold hover:bg-amber-800 disabled:opacity-40 transition-colors"
        >
          {busy ? "등록 중…" : "답변 등록"}
        </button>
        <button onClick={() => setOpen(false)} className="rounded-lg border border-amber-200 px-6 py-2.5 text-sm hover:border-amber-400">
          취소
        </button>
      </div>
    </div>
  );
}
