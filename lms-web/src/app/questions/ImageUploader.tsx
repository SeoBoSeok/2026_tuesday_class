"use client";

import { useState } from "react";

export interface UploadedImage {
  url: string;
  caption: string;
}

// 사진 첨부 — /api/qna/upload 로 올리고 미리보기 표시. withCaption이면 이미지 설명 입력칸 제공.
export default function ImageUploader({
  images,
  onChange,
  withCaption = false,
  max = 5,
}: {
  images: UploadedImage[];
  onChange: (imgs: UploadedImage[]) => void;
  withCaption?: boolean;
  max?: number;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError("");
    setBusy(true);
    const next = [...images];
    for (const file of Array.from(files)) {
      if (next.length >= max) break;
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/qna/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (res.ok && json.url) next.push({ url: json.url, caption: "" });
        else setError(json.error ?? "업로드에 실패했어요");
      } catch {
        setError("업로드에 실패했어요. 다시 시도해 주세요.");
      }
    }
    onChange(next);
    setBusy(false);
  }

  return (
    <div className="space-y-2">
      <label className="inline-flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800 hover:border-amber-500 transition-colors">
        📷 사진 첨부 ({images.length}/{max})
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={busy || images.length >= max}
          onChange={(e) => {
            void upload(e.target.files);
            e.target.value = "";
          }}
        />
      </label>
      {busy && <p className="text-xs text-gray-400">업로드 중…</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
      {images.length > 0 && (
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((img, i) => (
            <li key={img.url} className="space-y-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={`첨부 ${i + 1}`} className="w-full rounded-lg border border-amber-100 object-cover" />
              {withCaption && (
                <input
                  value={img.caption}
                  onChange={(e) => {
                    const next = [...images];
                    next[i] = { ...img, caption: e.target.value };
                    onChange(next);
                  }}
                  placeholder="이미지 설명 (선택)"
                  className="w-full rounded border border-amber-200 px-2 py-1 text-xs focus:outline-none focus:border-amber-500"
                />
              )}
              <button
                type="button"
                onClick={() => onChange(images.filter((_, j) => j !== i))}
                className="text-xs text-red-500 hover:underline"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
