import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "코코 LMS — AI 에이전트 코코와 함께하는 클로드코드·바이브코딩 학습",
  description: "AI 에이전트 코코(KoKo)와 함께하는 클로드코드 + 바이브코딩 학습 관리 시스템 — 진도, 자료실, 퀴즈, 질문, 코칭",
};

const NAV = [
  { href: "/", label: "대시보드" },
  { href: "/students/a", label: "학생 A" },
  { href: "/students/b", label: "학생 B" },
  { href: "/materials", label: "자료실" },
  { href: "/quiz", label: "퀴즈" },
  { href: "/questions", label: "질문 게시판" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen">
        <header className="bg-amber-900 text-amber-50 shadow">
          <div className="mx-auto max-w-5xl px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/" className="text-lg font-bold tracking-tight">
              🤖 코코 LMS <span className="hidden sm:inline text-xs font-normal text-amber-200">· 금요일반</span>
            </Link>
            <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="hover:text-amber-300 transition-colors">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-8 text-xs text-gray-400">
          🤖 AI 에이전트 <b>코코(KoKo)</b>와 함께하는 클로드코드 + 바이브코딩 학습 관리 시스템 — 코코가 수업을 기록하면 이 사이트에 자동 반영돼요
        </footer>
      </body>
    </html>
  );
}
