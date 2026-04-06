// AI TUTOR — Sergio
// TODO: style message bubbles and loading indicator
// TODO: improve the chat UX (scroll to bottom, timestamps, etc.)
// The prompt sent to Gemini is built in the send() function below — adjust it as needed

import { useState, KeyboardEvent } from 'react'
import { askGemini, GeminiError } from '../lib/gemini'

interface Props {
  lessonContext?: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AITutor({ lessonContext }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const send = async () => {
    const question = input.trim()
    if (!question || loading) return

    setInput('')
    setError(null)
    setMessages(m => [...m, { role: 'user', content: question }])
    setLoading(true)

    // TODO: adjust this prompt to give better context to Gemini
    const prompt = lessonContext
      ? `Lesson context:\n${lessonContext}\n\nQuestion: ${question}`
      : question

    setMessages(m => [...m, { role: 'assistant', content: '' }])

    try {
      await askGemini(prompt, chunk => {
        setMessages(m => {
          const last = m[m.length - 1]
          if (last?.role !== 'assistant') return m
          return [...m.slice(0, -1), { ...last, content: last.content + chunk }]
        })
      })
    } catch (err) {
      setError(err instanceof GeminiError ? err.message : 'Something went wrong.')
      setMessages(m => m[m.length - 1]?.content === '' ? m.slice(0, -1) : m)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border rounded">
      <div className="border-b px-4 py-2 text-sm font-medium">Ask AI Tutor</div>

      {messages.length > 0 && (
        <div className="p-4 space-y-2 max-h-60 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`text-sm ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block border rounded px-3 py-1.5 ${msg.role === 'user' ? 'bg-gray-100' : 'bg-white'}`}>
                {msg.content || (loading ? '...' : '')}
              </span>
            </div>
          ))}
        </div>
      )}

      {error && <p className="px-4 py-2 text-xs text-red-500">{error}</p>}

      <div className="border-t flex gap-2 p-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && send()}
          placeholder="Ask a question..."
          className="flex-1 border rounded px-3 py-1.5 text-sm outline-none"
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          className="px-3 py-1.5 bg-black text-white text-sm rounded disabled:opacity-40"
        >
          Ask
        </button>
      </div>
    </div>
  )
}
