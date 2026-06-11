"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "../RichTextEditor";
import ImageUploader, { type UploadedImage } from "../ImageUploader";

const AUTHORS = ["학생A", "학생B", "선생님"];

export default function QuestionForm() {
  const router = useRouter();
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/qna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, bodyHtml, images: images.map((i) => i.url) }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "등록에 실패했어요");
        setBusy(false);
        return;
      }
      router.push(`/questions/${json.id}`);
      router.refresh();
    } catch {
      setError("등록에 실패했어요. 다시 시도해 주세요.");
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-amber-100 space-y-5">
      <div>
        <p className="text-sm font-bold mb-2">누구인가요?</p>
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
        <p className="text-sm font-bold mb-2">질문 제목</p>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: npm run dev 하면 빨간 글씨가 떠요"
          maxLength={200}
          className="w-full rounded-lg border border-amber-200 px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
        />
      </div>

      <div>
        <p className="text-sm font-bold mb-2">질문 내용</p>
        <RichTextEditor onChange={setBodyHtml} placeholder="무엇이 궁금한가요? 했던 것과 안 되는 것을 적어주면 좋아요." />
      </div>

      <ImageUploader images={images} onChange={setImages} />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={submit}
        disabled={busy}
        className="rounded-lg bg-amber-700 text-white px-6 py-2.5 font-bold hover:bg-amber-800 disabled:opacity-40 transition-colors"
      >
        {busy ? "등록 중…" : "질문 등록"}
      </button>
    </div>
  );
}
