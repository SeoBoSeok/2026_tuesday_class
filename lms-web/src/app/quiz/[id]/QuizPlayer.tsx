"use client";

import { useState } from "react";
import type { Quiz } from "@/lib/data";

type Phase = "pick-student" | "question" | "revealed" | "done";

export default function QuizPlayer({ quiz }: { quiz: Quiz }) {
  const [student, setStudent] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("pick-student");
  const [picked, setPicked] = useState<number | null>(null);
  const [shortAnswer, setShortAnswer] = useState("");
  const [records, setRecords] = useState<{ qid: string; correct: boolean }[]>([]);
  const [saved, setSaved] = useState(false);

  const q = quiz.questions[idx];
  const score = records.filter((r) => r.correct).length;

  function next(correct: boolean) {
    const newRecords = [...records, { qid: q.id, correct }];
    setRecords(newRecords);
    if (idx + 1 < quiz.questions.length) {
      setIdx(idx + 1);
      setPicked(null);
      setShortAnswer("");
      setPhase("question");
    } else {
      setPhase("done");
      void submit(newRecords);
    }
  }

  async function submit(finalRecords: { qid: string; correct: boolean }[]) {
    try {
      const res = await fetch("/api/quiz-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.id,
          student,
          score: finalRecords.filter((r) => r.correct).length,
          total: quiz.questions.length,
          finishedAt: new Date().toISOString().slice(0, 19),
          answers: finalRecords,
        }),
      });
      if (res.ok) setSaved(true);
    } catch {
      // 저장 실패해도 점수는 화면에 남는다
    }
  }

  // 1) 학생 선택
  if (phase === "pick-student") {
    return (
      <div className="rounded-xl bg-white p-8 shadow-sm border border-amber-100 text-center space-y-5">
        <h1 className="text-xl font-bold">{quiz.title}</h1>
        <p className="text-sm text-gray-500">{quiz.questions.length}문항 · 누구인가요?</p>
        <div className="flex justify-center gap-3">
          {["학생A", "학생B"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStudent(s);
                setPhase("question");
              }}
              className="rounded-lg bg-amber-700 text-white px-6 py-3 font-bold hover:bg-amber-800 transition-colors"
            >
              {s === "학생A" ? "학생 A" : "학생 B"}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400">💡 답을 보기 전에 꼭 먼저 머릿속으로 답해보세요. 그게 진짜 복습이에요!</p>
      </div>
    );
  }

  // 3) 완료
  if (phase === "done") {
    const pct = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="rounded-xl bg-white p-8 shadow-sm border border-amber-100 text-center space-y-4">
        <h1 className="text-xl font-bold">수고했어요, {student}! 🎉</h1>
        <p className="text-5xl font-bold text-amber-700">
          {score}<span className="text-2xl text-gray-400">/{quiz.questions.length}</span>
        </p>
        <p className="text-sm text-gray-600">
          {pct === 100 ? "완벽해요! 이 개념들은 며칠 뒤 한 번 더 만나요 (간격 반복)." :
           pct >= 60 ? "잘했어요! 틀린 문제는 내일 다시 물어볼게요 — 그때 맞히면 진짜 내 것이 돼요." :
           "괜찮아요, 틀리면서 배우는 게 정상이에요. 다음 수업에서 같이 다시 봐요!"}
        </p>
        <p className="text-xs text-gray-400">{saved ? "✅ 결과가 저장됐어요 (선생님도 볼 수 있어요)" : "결과 저장 중…"}</p>
      </div>
    );
  }

  // 2) 문제 풀이
  const isChoice = q.type === "choice";
  const revealed = phase === "revealed";
  const choiceCorrect = isChoice && picked === q.answer;

  return (
    <div className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-amber-100 space-y-5">
      <div className="flex justify-between text-xs text-gray-400">
        <span>{quiz.title} · {student}</span>
        <span>{idx + 1} / {quiz.questions.length}</span>
      </div>
      <h2 className="text-lg font-bold leading-relaxed">{q.prompt}</h2>

      {isChoice ? (
        <div className="space-y-2">
          {q.options?.map((opt, i) => {
            let cls = "border-amber-200 bg-white hover:border-amber-400";
            if (revealed) {
              if (i === q.answer) cls = "border-green-500 bg-green-50";
              else if (i === picked) cls = "border-red-400 bg-red-50";
              else cls = "border-gray-100 bg-gray-50 text-gray-400";
            }
            return (
              <button
                key={i}
                disabled={revealed}
                onClick={() => {
                  setPicked(i);
                  setPhase("revealed");
                }}
                className={`block w-full text-left rounded-lg border px-4 py-3 text-sm transition-colors ${cls}`}
              >
                {String.fromCharCode(9312 + i)} {opt}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={shortAnswer}
            onChange={(e) => setShortAnswer(e.target.value)}
            disabled={revealed}
            rows={3}
            placeholder="내 말로 설명해 보세요 — 완벽하지 않아도 좋아요"
            className="w-full rounded-lg border border-amber-200 p-3 text-sm focus:outline-none focus:border-amber-500"
          />
          {!revealed && (
            <button
              onClick={() => setPhase("revealed")}
              disabled={shortAnswer.trim().length === 0}
              className="rounded-lg bg-amber-700 text-white px-5 py-2 text-sm font-bold disabled:opacity-40 hover:bg-amber-800"
            >
              다 썼어요 — 정답 보기
            </button>
          )}
        </div>
      )}

      {revealed && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 space-y-3">
          {isChoice ? (
            <p className="font-bold">{choiceCorrect ? "⭕ 정답!" : "❌ 아쉬워요"}</p>
          ) : (
            <p className="font-bold">📖 모범 답안</p>
          )}
          {!isChoice && <p className="text-sm">{String(q.answer)}</p>}
          {q.explanation && <p className="text-sm text-gray-600">{q.explanation}</p>}

          {isChoice ? (
            <button onClick={() => next(choiceCorrect)} className="rounded-lg bg-amber-700 text-white px-5 py-2 text-sm font-bold hover:bg-amber-800">
              다음 문제 →
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => next(true)} className="rounded-lg bg-green-600 text-white px-4 py-2 text-sm font-bold hover:bg-green-700">
                비슷하게 맞혔어요
              </button>
              <button onClick={() => next(false)} className="rounded-lg bg-red-500 text-white px-4 py-2 text-sm font-bold hover:bg-red-600">
                많이 달랐어요
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
