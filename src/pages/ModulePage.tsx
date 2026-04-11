// LESSON PAGE - Artigun + Bao
// TODO: render lesson markdown properly instead of raw whitespace-pre
// TODO: polish the two-column layout (sidebar + content)
// TODO: add any transitions or UX improvements between lessons

import { useMemo, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { modules } from '../data/modules'
import { useProgress } from '../context/ProgressContext'
import Terminal, { TerminalCommandEvent } from '../components/Terminal'
import Quiz from '../components/Quiz'
import AITutor from '../components/AITutor'

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const module = modules.find(m => m.id === moduleId)

  const {
    markModuleComplete,
    markLessonComplete,
    setQuizScore,
    isLessonComplete,
    recordTerminalCommand,
    getLessonPractice,
  } = useProgress()
  const [activeLessonIndex, setActiveLessonIndex] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [recentTerminalEvents, setRecentTerminalEvents] = useState<TerminalCommandEvent[]>([])

  if (!module) return <Navigate to="/modules" replace />

  const lesson = module.lessons[activeLessonIndex]
  const lessonPractice = getLessonPractice(module.id, lesson.id)

  const handleNext = () => {
    markLessonComplete(module.id, lesson.id)
    if (activeLessonIndex < module.lessons.length - 1) {
      setActiveLessonIndex(i => i + 1)
      setRecentTerminalEvents([])
    } else {
      setShowQuiz(true)
    }
  }

  const handleQuizComplete = (score: number) => {
    setQuizScore(module.id, score)
    if (score >= 70) markModuleComplete(module.id)
  }

  const handleTerminalCommand = (event: TerminalCommandEvent) => {
    recordTerminalCommand(module.id, lesson.id, event.input, event.recognized)
    setRecentTerminalEvents(prev => [...prev.slice(-5), event])
  }

  const terminalContext = useMemo(() => {
    if (!lessonPractice.attempts && recentTerminalEvents.length === 0) return undefined

    const lines = recentTerminalEvents
      .slice(-4)
      .map((event, idx) => {
        const status = event.recognized ? 'recognized' : 'unrecognized'
        return `${idx + 1}. ${event.input} -> ${status}${event.hint ? ` (hint: ${event.hint})` : ''}`
      })

    const successRate =
      lessonPractice.attempts > 0
        ? Math.round((lessonPractice.recognized / lessonPractice.attempts) * 100)
        : 0

    return [
      `Terminal progress for this lesson: ${lessonPractice.recognized}/${lessonPractice.attempts} recognized (${successRate}%).`,
      lessonPractice.lastCommand ? `Last command entered: ${lessonPractice.lastCommand}` : '',
      lines.length ? `Recent terminal attempts:\n${lines.join('\n')}` : '',
    ]
      .filter(Boolean)
      .join('\n\n')
  }, [lessonPractice.attempts, lessonPractice.lastCommand, lessonPractice.recognized, recentTerminalEvents])

  const lastTerminalEvent = recentTerminalEvents[recentTerminalEvents.length - 1]

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-4 text-sm text-gray-500">
        <Link to="/modules" className="hover:underline">Modules</Link>
        {' / '}
        {module.title}
      </div>

      <div className="flex gap-8">
        <aside className="w-44 shrink-0 space-y-1 text-sm">
          {module.lessons.map((l, i) => (
            <button
              key={l.id}
              onClick={() => {
                setActiveLessonIndex(i)
                setShowQuiz(false)
                setRecentTerminalEvents([])
              }}
              className={`w-full text-left px-2 py-1.5 rounded ${
                !showQuiz && i === activeLessonIndex ? 'bg-gray-100 font-medium' : 'text-gray-500 hover:text-black'
              }`}
            >
              {isLessonComplete(module.id, l.id) ? '✓ ' : `${i + 1}. `}
              {l.title}
            </button>
          ))}
          <button
            onClick={() => setShowQuiz(true)}
            className={`w-full text-left px-2 py-1.5 rounded ${
              showQuiz ? 'bg-gray-100 font-medium' : 'text-gray-500 hover:text-black'
            }`}
          >
            Quiz
          </button>
        </aside>

        <div className="flex-1 space-y-6 min-w-0">
          {!showQuiz ? (
            <>
              <h1 className="text-xl font-bold">{lesson.title}</h1>

              <div className="text-sm text-gray-700 whitespace-pre-wrap border rounded p-4 bg-gray-50">
                {lesson.content}
              </div>

              {lesson.terminalCommands && lesson.terminalCommands.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Try it out</p>
                  <Terminal
                    key={`${module.id}/${lesson.id}`}
                    commands={lesson.terminalCommands}
                    onCommand={handleTerminalCommand}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Practice: {lessonPractice.recognized}/{lessonPractice.attempts} recognized
                  </p>
                  {lastTerminalEvent && !lastTerminalEvent.recognized && lastTerminalEvent.hint && (
                    <p className="mt-1 text-xs text-amber-700">Hint: {lastTerminalEvent.hint}</p>
                  )}
                </div>
              )}

              <AITutor lessonContext={lesson.content} terminalContext={terminalContext} />

              <div className="flex justify-end">
                <button onClick={handleNext} className="px-4 py-2 bg-black text-white text-sm rounded">
                  {activeLessonIndex < module.lessons.length - 1 ? 'Next ->' : 'Take Quiz ->'}
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold">Quiz - {module.title}</h1>
              <Quiz questions={module.quiz} onComplete={handleQuizComplete} />
              <Link to="/modules" className="text-sm text-gray-500 hover:underline">&lt;- Back to Modules</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
