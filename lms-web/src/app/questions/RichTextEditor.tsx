"use client";

import { useRef } from "react";

// 외부 라이브러리 없는 가벼운 위지윅 에디터 (contentEditable 기반)
export default function RichTextEditor({
  onChange,
  placeholder = "내용을 입력하세요…",
  minHeight = "8rem",
}: {
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function exec(cmd: string, value?: string) {
    ref.current?.focus();
    document.execCommand(cmd, false, value);
    onChange(ref.current?.innerHTML ?? "");
  }

  function addLink() {
    const url = window.prompt("연결할 주소(URL)를 입력하세요", "https://");
    if (url && url !== "https://") exec("createLink", url);
  }

  const BUTTONS: { label: string; title: string; action: () => void }[] = [
    { label: "B", title: "굵게", action: () => exec("bold") },
    { label: "I", title: "기울임", action: () => exec("italic") },
    { label: "U", title: "밑줄", action: () => exec("underline") },
    { label: "• 목록", title: "글머리 목록", action: () => exec("insertUnorderedList") },
    { label: "1. 목록", title: "번호 목록", action: () => exec("insertOrderedList") },
    { label: "</>", title: "코드 블록", action: () => exec("formatBlock", "pre") },
    { label: "🔗", title: "링크", action: addLink },
    { label: "지우개", title: "서식 지우기", action: () => exec("removeFormat") },
  ];

  return (
    <div className="rounded-lg border border-amber-200 bg-white overflow-hidden">
      <div className="flex flex-wrap gap-1 border-b border-amber-100 bg-amber-50 px-2 py-1.5">
        {BUTTONS.map((b) => (
          <button
            key={b.title}
            type="button"
            title={b.title}
            onMouseDown={(e) => e.preventDefault()}
            onClick={b.action}
            className="rounded px-2 py-1 text-xs font-bold text-amber-900 hover:bg-amber-200 transition-colors"
          >
            {b.label}
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        className="rich-editor md-body p-3 text-sm focus:outline-none"
        style={{ minHeight }}
      />
    </div>
  );
}
