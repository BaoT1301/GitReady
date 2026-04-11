// AI TUTOR - Sergio + Bao
// Prompt now includes live terminal context from the lesson page.

import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { askGemini, GeminiError } from '../lib/gemini'

interface Props {
  lessonContext?: string
  terminalContext?: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AITutor({ lessonContext, terminalContext }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (forcedQuestion?: string) => {
    const question = (forcedQuestion ?? input).trim()
    if (!question || loading) return

    if (!forcedQuestion) setInput('')
    setError(null)
    setMessages(m => [...m, { role: 'user', content: question, timestamp: new Date() }])
    setLoading(true)

    const history = messages
      .filter(m => m.content)
      .map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`)
      .join('\n')

    const prompt = [
      lessonContext && `Current lesson:\n${lessonContext}`,
      terminalContext && `Live terminal context:\n${terminalContext}`,
      history && `Conversation so far:\n${history}`,
      `Student question: ${question}`,
    ]
      .filter(Boolean)
      .join('\n\n')

    setMessages(m => [...m, { role: 'assistant', content: '', timestamp: new Date() }])

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
      setMessages(m => (m[m.length - 1]?.content === '' ? m.slice(0, -1) : m))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border rounded dark:border-slate-700 dark:bg-slate-900/65">
      <div className="border-b px-4 py-2 flex items-center justify-between dark:border-slate-700">
        <span className="text-sm font-medium dark:text-slate-100">Ask AI Tutor</span>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors dark:text-slate-400 dark:hover:text-rose-300"
          >
            Clear chat
          </button>
        )}
      </div>

      {terminalContext && (
        <div className="px-4 py-2 border-b bg-amber-50 text-xs text-amber-800 flex items-center justify-between gap-2 border-amber-100 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-200">
          <span>Terminal context is attached to AI answers.</span>
          <button
            onClick={() => send('Can you explain my latest terminal mistake and what command I should run next?')}
            disabled={loading}
            className="px-2 py-1 rounded border border-amber-200 bg-white hover:bg-amber-100 disabled:opacity-50 dark:border-amber-700 dark:bg-slate-900 dark:hover:bg-amber-900/30"
          >
            Diagnose latest command
          </button>
        </div>
      )}

      {messages.length > 0 && (
        <div className="p-4 space-y-2 max-h-60 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <span
                  className={`inline-block rounded-2xl px-4 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-black text-white rounded-br-sm dark:bg-cyan-500 dark:text-slate-950'
                      : 'bg-gray-100 text-gray-900 rounded-bl-sm dark:bg-slate-800 dark:text-slate-100'
                  }`}
                >
                  {msg.content ||
                    (loading ? (
                      <span className="flex gap-1 items-center h-4">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                      </span>
                    ) : (
                      ''
                    ))}
                </span>
                <span className="text-[10px] text-gray-400 mt-1 px-1 dark:text-slate-500">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      {error && <p className="px-4 py-2 text-xs text-red-500 dark:text-rose-300">{error}</p>}

      <div className="border-t flex gap-2 p-2 dark:border-slate-700">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && send()}
          placeholder="Ask a question..."
          className="flex-1 border rounded px-3 py-1.5 text-sm outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          className="px-3 py-1.5 bg-black text-white text-sm rounded disabled:opacity-40 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 transition"
        >
          Ask
        </button>
      </div>
    </div>
  )
}
