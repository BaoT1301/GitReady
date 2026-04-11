// QUIZ — Sergio

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
  const handleSubmit = () => { 
    const correct = questions.filter(q => answers[q.id] === q.correctIndex).length
    const percent = Math.round((correct / questions.length) * 100)
    setScore(percent)
    setSubmitted(true)
    onComplete?.(percent)
  }

  // Styling the retry button so users can see!
  const handleRetry = () => {
    setAnswers({}) // we set to empty list instead of resetting to initial state to avoid unnecessary re-renders if the user retries multiple times
    setSubmitted(false) // we set submitted to false to allow the user to submit again after retrying
    setScore(0) // all scores are reset to 0 until the user submits again
  }

  if (questions.length === 0) {
    return <p className="text-sm text-gray-400">No quiz questions yet.</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold">Quiz</h2>

      {questions.map((q, qi) => (
        <div key={q.id} className="border rounded p-4 space-y-2">
          <p className="text-sm font-medium">{qi + 1}. {q.question}</p>
          <div className="space-y-1">
            {q.options.map((opt, optionIndex) => (
              <button
                key={optionIndex}
                onClick={() => !submitted && setAnswers(a => ({ ...a, [q.id]: optionIndex }))}
                className={`w-full text-left text-sm border rounded px-3 py-2 ${
                  !submitted
                    ? answers[q.id] === optionIndex ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    : optionIndex === q.correctIndex ? 'border-green-500 bg-green-50 text-green-800'
                    : answers[q.id] === optionIndex ? 'border-red-400 bg-red-50 text-red-700'
                    : 'opacity-50'
                }`}
              >
                {String.fromCharCode(65 + optionIndex)}. {opt}
              </button>
            ))}
          </div>
          {submitted && <p className="text-xs text-gray-500">{q.explanation}</p>}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length}
          className="px-4 py-2 bg-black text-white text-sm rounded disabled:opacity-40"
        >
          Submit
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium">
            Score: {score}% ({questions.filter(q => answers[q.id] === q.correctIndex).length} / {questions.length} correct)
          </p>
          <button onClick={handleRetry} className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded">
            Try Again!
          </button>
        </div>
      )}
    </div>
  )
}
