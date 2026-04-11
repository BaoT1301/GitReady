// AI TUTOR — Sergio
// TODO: style message bubbles and loading indicator
// TODO: improve the chat UX (scroll to bottom, timestamps, etc.)
// The prompt sent to Gemini is built in the send() function below — adjust it as needed

import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { askGemini, GeminiError } from '../lib/gemini'

interface Props {
  lessonContext?: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AITutor({ lessonContext }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ref attached to an invisible div at the bottom of the message list
  const bottomRef = useRef<HTMLDivElement>(null)

  // scroll to bottom every time messages update to prevent user to manually scroll down to see ai responses
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const question = input.trim()
    if (!question || loading) return

    setInput('')
    setError(null)
    setMessages(m => [...m, { role: 'user', content: question, timestamp: new Date() }])
    setLoading(true)

    // Build a structured prompt so Gemini knows the lesson topic,
    // sees the conversation history, and gets a clear question to answer
    const history = messages
      .filter(m => m.content)
      .map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`)
      .join('\n')

    const prompt = [
      lessonContext && `Current lesson:\n${lessonContext}`,
      history && `Conversation so far:\n${history}`,
      `Student question: ${question}`,
    ].filter(Boolean).join('\n\n')

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
      setMessages(m => m[m.length - 1]?.content === '' ? m.slice(0, -1) : m)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border rounded">
      <div className="border-b px-4 py-2 flex items-center justify-between">
        <span className="text-sm font-medium">Ask AI Tutor</span>
        {/* only show clear button when there are messages in case user wants to start fresh or unclutter chat */}
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Clear chat
          </button>
        )}
      </div>

      {messages.length > 0 && (
        <div className="p-4 space-y-2 max-h-60 overflow-y-auto">
          {messages.map((msg, i) => (
            // align user messages to the right, assistant to the left (user = black, assistant = gray)
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <span className={`inline-block rounded-2xl px-4 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-black text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                }`}>
                  {msg.content || (loading
                    // animated bouncing dots while waiting for AI response, pretty cool cosmetic touch 
                    ? <span className="flex gap-1 items-center h-4">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                      </span>
                    : '')}
                </span>
                {/* timestamp shown below each bubble */}
                <span className="text-[10px] text-gray-400 mt-1 px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {/* invisible anchor div so we can scroll to the latest message */}
          <div ref={bottomRef} />
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
