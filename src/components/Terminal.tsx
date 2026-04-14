// TERMINAL SIMULATOR - Artigun + Bao
// Includes command validation and stateful behavior for core Git workflows.

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import type { TerminalCommand } from '../data/modules'

export interface TerminalCommandEvent {
  input: string
  recognized: boolean
  output: string
  hint?: string
}

interface Props {
  commands?: TerminalCommand[]
  onCommand?: (event: TerminalCommandEvent) => void
}

interface HistoryEntry {
  type: 'input' | 'output' | 'error'
  text: string
}

const DEFAULT_HINT = 'Type "help" to see available commands for this lesson.'

function deriveInitialBranches(commands: TerminalCommand[]): string[] {
  const names = new Set<string>(['main'])

  for (const cmd of commands) {
    const checkoutCreate = cmd.input.match(/^git checkout -b\s+(.+)$/)
    if (checkoutCreate?.[1]) names.add(checkoutCreate[1].trim())

    const checkoutExisting = cmd.input.match(/^git checkout\s+(.+)$/)
    if (checkoutExisting?.[1]) names.add(checkoutExisting[1].trim())

    const mergeTarget = cmd.input.match(/^git merge\s+(.+)$/)
    if (mergeTarget?.[1]) names.add(mergeTarget[1].trim())
  }

  return Array.from(names)
}

export default function Terminal({ commands = [], onCommand }: Props) {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', text: 'Type "help" to see available commands.' },
  ])
  const [input, setInput] = useState('')
  const [staged, setStaged] = useState<string[]>([])
  const [branches, setBranches] = useState<string[]>(() => deriveInitialBranches(commands))
  const [currentBranch, setCurrentBranch] = useState('main')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number | null>(null)
  const [repoInitialized, setRepoInitialized] = useState(true)
  const [hasRemote, setHasRemote] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const emit = (event: TerminalCommandEvent) => {
    onCommand?.(event)
  }

  const append = (type: HistoryEntry['type'], text: string) => {
    if (!text) return
    setHistory(h => [...h, { type, text }])
  }

  const lessonHint = () => {
    if (!commands.length) return DEFAULT_HINT
    const sample = commands
      .slice(0, 4)
      .map(c => c.input)
      .join(', ')
    return `Try: ${sample}${commands.length > 4 ? ', ...' : ''}`
  }

  const runCommand = (raw: string) => {
    const cmd = raw.trim()
    if (!cmd) return

    setHistory(h => [...h, { type: 'input', text: cmd }])
    setInput('')
    setCommandHistory(prev => [...prev, cmd])
    setHistoryIndex(null)

    if (cmd === 'clear') {
      setHistory([])
      emit({ input: cmd, recognized: true, output: 'Terminal cleared.' })
      return
    }

    if (cmd === 'help') {
      const list = commands.length
        ? commands.map(c => `  ${c.input}`).join('\n')
        : '  (no commands for this lesson)'
      const output = `Available:\n${list}`
      append('output', output)
      emit({ input: cmd, recognized: true, output })
      return
    }

    if (cmd === 'git init') {
      const output = repoInitialized
        ? 'Reinitialized existing Git repository in ./'
        : 'Initialized empty Git repository in ./'
      setRepoInitialized(true)
      append('output', output)
      emit({ input: cmd, recognized: true, output })
      return
    }

    if (cmd.startsWith('git clone')) {
      const url = cmd.slice('git clone'.length).trim()
      if (!url) {
        const output = 'fatal: You must specify a repository to clone.'
        const hint = 'Example: git clone https://github.com/org/repo.git'
        append('error', output)
        emit({ input: cmd, recognized: false, output, hint })
        return
      }
      setRepoInitialized(true)
      setHasRemote(true)
      const output = `Cloning into '${url.split('/').pop()?.replace(/\\.git$/, '') || 'repo'}'...\nDone.`
      append('output', output)
      emit({ input: cmd, recognized: true, output })
      return
    }

    if (cmd.startsWith('git add')) {
      const file = cmd.slice('git add'.length).trim()
      if (!file) {
        const output = 'Nothing specified, nothing added.'
        const hint = 'Add a file name, for example: git add README.md'
        append('error', output)
        emit({ input: cmd, recognized: false, output, hint })
        return
      }
      setStaged(s => (s.includes(file) ? s : [...s, file]))
      emit({ input: cmd, recognized: true, output: '' })
      return
    }

    if (cmd.startsWith('git commit')) {
      if (!repoInitialized) {
        const output = 'fatal: not a git repository (or any of the parent directories): .git'
        const hint = 'Run git init first.'
        append('error', output)
        emit({ input: cmd, recognized: false, output, hint })
        return
      }

      if (staged.length === 0) {
        const output = 'nothing to commit, working tree clean'
        const hint = 'Stage files first, for example: git add <file>'
        append('error', output)
        emit({ input: cmd, recognized: false, output, hint })
        return
      }

      const msgMatch = cmd.match(/^git commit -m\s+["'](.+)["']$/)
      if (!msgMatch) {
        const output = 'Aborting commit due to empty commit message.'
        const hint = 'Use: git commit -m "your message"'
        append('error', output)
        emit({ input: cmd, recognized: false, output, hint })
        return
      }

      const message = msgMatch[1]
      const output = `[${currentBranch} abc1234] ${message}\n ${staged.length} file(s) changed`
      setStaged([])
      append('output', output)
      emit({ input: cmd, recognized: true, output })
      return
    }

    if (cmd.startsWith('git checkout -b ')) {
      const newBranch = cmd.slice('git checkout -b '.length).trim()
      if (!newBranch) {
        const output = 'fatal: invalid branch name'
        append('error', output)
        emit({ input: cmd, recognized: false, output, hint: 'Use: git checkout -b <branch-name>' })
        return
      }
      const alreadyExists = branches.includes(newBranch)
      setBranches(prev => (alreadyExists ? prev : [...prev, newBranch]))
      setCurrentBranch(newBranch)
      const branchList = alreadyExists ? branches : [...branches, newBranch]
      const output = alreadyExists
        ? `Switched to branch '${newBranch}'`
        : `Switched to a new branch '${newBranch}'\n${branchList
            .map(b => (b === newBranch ? `* ${b}` : `  ${b}`))
            .join('\n')}`
      append('output', output)
      emit({ input: cmd, recognized: true, output })
      return
    }

    if (cmd.startsWith('git checkout ')) {
      const target = cmd.slice('git checkout '.length).trim()
      if (branches.includes(target)) {
        setCurrentBranch(target)
        const output = `Switched to branch '${target}'`
        append('output', output)
        emit({ input: cmd, recognized: true, output })
      } else {
        const output = `error: pathspec '${target}' did not match any branch`
        append('error', output)
        emit({
          input: cmd,
          recognized: false,
          output,
          hint: 'Run git branch to see available branches.',
        })
      }
      return
    }

    if (cmd === 'git branch') {
      const output = branches.map(b => (b === currentBranch ? `* ${b}` : `  ${b}`)).join('\n')
      append('output', output)
      emit({ input: cmd, recognized: true, output })
      return
    }

    if (cmd.startsWith('git merge')) {
      const target = cmd.slice('git merge'.length).trim()
      const scripted = commands.find(c => c.input === cmd)
      if (!target) {
        const output = 'merge: missing branch name'
        append('error', output)
        emit({ input: cmd, recognized: false, output, hint: 'Use: git merge <branch-name>' })
        return
      }
      if (!branches.includes(target)) {
        const output = `merge: ${target} - not something we can merge`
        append('error', output)
        emit({ input: cmd, recognized: false, output, hint: 'Check branch names with git branch.' })
        return
      }
      if (target === currentBranch) {
        const output = 'Already up to date.'
        append('output', output)
        emit({ input: cmd, recognized: true, output })
        return
      }

      if (scripted?.output) {
        append('output', scripted.output)
        emit({ input: cmd, recognized: true, output: scripted.output })
        return
      }

      const output = `Updating abc1111..abc2222\nFast-forward\nMerged '${target}' into '${currentBranch}'.`
      append('output', output)
      emit({ input: cmd, recognized: true, output })
      return
    }

    const match =
      cmd === 'git status'
        ? (() => {
            const statuses = commands.filter(c => c.input === 'git status')
            if (statuses.length === 0) return undefined
            if (staged.length > 0 && statuses[1]) return statuses[1]
            return statuses[0]
          })()
        : commands.find(c => c.input === cmd)

    if (cmd === 'git status' && !match) {
      const output =
        staged.length > 0
          ? `On branch ${currentBranch}\nChanges to be committed:\n  ${staged.join('\n  ')}`
          : `On branch ${currentBranch}\nnothing to commit, working tree clean`
      append('output', output)
      emit({ input: cmd, recognized: true, output })
      return
    }

    if (cmd.startsWith('git push')) {
      if (!hasRemote) {
        const output = "fatal: 'origin' does not appear to be a git repository"
        append('error', output)
        emit({ input: cmd, recognized: false, output, hint: 'Set a remote first: git remote add origin <url>' })
        return
      }
      const output = match?.output || 'Everything up-to-date'
      append('output', output)
      emit({ input: cmd, recognized: true, output })
      return
    }

    if (cmd.startsWith('git pull')) {
      if (!hasRemote) {
        const output = 'There is no tracking information for the current branch.'
        append('error', output)
        emit({ input: cmd, recognized: false, output, hint: 'Set a remote first: git remote add origin <url>' })
        return
      }
      const output = match?.output || 'Already up to date.'
      append('output', output)
      emit({ input: cmd, recognized: true, output })
      return
    }

    if (match) {
      if (match.output) append('output', match.output)
      emit({ input: cmd, recognized: true, output: match.output || '' })
      return
    }

    if (cmd.startsWith('git ')) {
      const output = `Unknown or unsupported git command: ${cmd}`
      const hint = lessonHint()
      append('error', output)
      emit({ input: cmd, recognized: false, output, hint })
      return
    }

    const output = `command not found: ${cmd}`
    append('error', output)
    emit({ input: cmd, recognized: false, output, hint: lessonHint() })
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(input)
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!commandHistory.length) return
      setHistoryIndex(prev => {
        const next = prev === null ? commandHistory.length - 1 : Math.max(0, prev - 1)
        setInput(commandHistory[next])
        return next
      })
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!commandHistory.length) return
      setHistoryIndex(prev => {
        if (prev === null) return null
        const next = prev + 1
        if (next >= commandHistory.length) {
          setInput('')
          return null
        }
        setInput(commandHistory[next])
        return next
      })
    }
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
          onChange={e => {
            setInput(e.target.value)
            setHistoryIndex(null)
          }}
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
