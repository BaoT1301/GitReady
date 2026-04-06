// TERMINAL SIMULATOR — Artigun
// TODO: style the terminal shell
// TODO: add arrow-key command history
// TODO: add any other UX improvements you want

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import type { TerminalCommand } from '../data/modules'

interface Props {
  commands?: TerminalCommand[]
  onCommand?: (input: string, recognized: boolean) => void
}

interface HistoryEntry {
  type: 'input' | 'output' | 'error'
  text: string
}

export default function Terminal({ commands = [], onCommand }: Props) {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', text: 'Type "help" to see available commands.' },
  ])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const runCommand = (raw: string) => {
    const cmd = raw.trim()
    if (!cmd) return

    setHistory(h => [...h, { type: 'input', text: cmd }])
    setInput('')

    if (cmd === 'clear') { setHistory([]); return }

    if (cmd === 'help') {
      const list = commands.length
        ? commands.map(c => `  ${c.input}`).join('\n')
        : '  (no commands for this lesson)'
      setHistory(h => [...h, { type: 'output', text: `Available:\n${list}` }])
      return
    }

    const match = commands.find(c => c.input === cmd)
    if (match) {
      if (match.output) setHistory(h => [...h, { type: 'output', text: match.output }])
      onCommand?.(cmd, true)
    } else {
      setHistory(h => [...h, { type: 'error', text: `command not found: ${cmd}` }])
      onCommand?.(cmd, false)
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') runCommand(input)
    // TODO: arrow up/down for history
  }

  return (
    <div className="border rounded font-mono text-sm bg-black text-white overflow-hidden">
      <div className="border-b border-gray-700 px-3 py-1 text-xs text-gray-400 bg-gray-900">
        terminal
      </div>
      <div className="h-44 overflow-y-auto p-3 space-y-1">
        {history.map((entry, i) => (
          <div key={i}>
            {entry.type === 'input' && <div><span className="text-green-400">$ </span>{entry.text}</div>}
            {entry.type === 'output' && <pre className="text-gray-300 whitespace-pre-wrap">{entry.text}</pre>}
            {entry.type === 'error' && <pre className="text-red-400 whitespace-pre-wrap">{entry.text}</pre>}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-gray-700 flex items-center px-3 py-1">
        <span className="text-green-400 mr-2">$</span>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-600"
          placeholder="type a command..."
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  )
}
