import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "금요일반 LMS",
  description: "클로드 코드 수업 학습 관리 — 진도, 자료실, 퀴즈, 질문 추적",
};

const NAV = [
  { href: "/", label: "대시보드" },
  { href: "/students/a", label: "학생 A" },
  { href: "/students/b", label: "학생 B" },
  { href: "/materials", label: "자료실" },
  { href: "/quiz", label: "퀴즈" },
  { href: "/questions", label: "질문 모음" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen">
        <header className="bg-amber-900 text-amber-50 shadow">
          <div className="mx-auto max-w-5xl px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/" className="text-lg font-bold tracking-tight">
              🎓 금요일반 LMS
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
          클로드 코드로 함께 만드는 수업 · 데이터는 lms/ 폴더의 마크다운에서 실시간으로 읽어옵니다
        </footer>
      </body>
    </html>
  );
}
