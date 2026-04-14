// QUIZ - Sergio

import { useState } from 'react'
import type { QuizQuestion } from '../data/modules'

interface Props {
  questions: QuizQuestion[]
  onComplete?: (score: number) => void
}

export default function Quiz({ questions, onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const passingScore = 70

  const handleSubmit = () => {
    const correct = questions.filter(q => answers[q.id] === q.correctIndex).length
    const percent = Math.round((correct / questions.length) * 100)
    setScore(percent)
    setSubmitted(true)
    onComplete?.(percent)
  }

  const handleRetry = () => {
    setAnswers({})
    setSubmitted(false)
    setScore(0)
  }

  if (questions.length === 0) {
    return <p className="text-sm text-gray-400 dark:text-slate-400">No quiz questions yet.</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold dark:text-slate-100">Quiz</h2>

      {questions.map((q, qi) => (
        <div key={q.id} className="border rounded p-4 space-y-2 dark:border-slate-700 dark:bg-slate-900/65">
          <p className="text-sm font-medium dark:text-slate-100">{qi + 1}. {q.question}</p>
          <div className="space-y-1">
            {q.options.map((opt, optionIndex) => (
              <button
                key={optionIndex}
                onClick={() => !submitted && setAnswers(a => ({ ...a, [q.id]: optionIndex }))}
                className={`w-full text-left text-sm border rounded px-3 py-2 ${
                  !submitted
                    ? answers[q.id] === optionIndex
                      ? 'border-blue-500 bg-blue-50 dark:border-cyan-500 dark:bg-cyan-950/60 dark:text-cyan-100'
                      : 'hover:bg-gray-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800/70'
                    : optionIndex === q.correctIndex
                      ? 'border-green-500 bg-green-50 text-green-800 dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-200'
                      : answers[q.id] === optionIndex
                        ? 'border-red-400 bg-red-50 text-red-700 dark:border-rose-500 dark:bg-rose-950/45 dark:text-rose-200'
                        : 'opacity-50 dark:text-slate-400'
                }`}
              >
                {String.fromCharCode(65 + optionIndex)}. {opt}
              </button>
            ))}
          </div>
          {submitted && <p className="text-xs text-gray-500 dark:text-slate-400">{q.explanation}</p>}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length}
          className="px-4 py-2 bg-black text-white text-sm rounded disabled:opacity-40 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 transition"
        >
          Submit
        </button>
      ) : (
        <div className="space-y-3">
          <div
            className={`rounded-lg border px-3 py-2 text-sm ${
              score >= passingScore
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200'
                : 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200'
            }`}
          >
            <p className="font-semibold">
              {score >= passingScore ? 'Passed' : 'Not passed yet'}: {score}%
            </p>
            <p className="text-xs">
              {questions.filter(q => answers[q.id] === q.correctIndex).length} / {questions.length} correct
              {score >= passingScore
                ? ' - Great work. You can move to the next module.'
                : ' - Review explanations and try again to reach 70%.'}
            </p>
          </div>

          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
