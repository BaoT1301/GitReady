import { useEffect, useMemo, useState } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { modules } from '../data/modules'
import { useProgress } from '../context/ProgressContext'
import Terminal, { TerminalCommandEvent } from '../components/Terminal'
import Quiz from '../components/Quiz'
import AITutor from '../components/AITutor'

const LAST_LESSON_STORAGE_KEY = 'gitready_last_lesson_by_module'

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const navigate = useNavigate()
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
  const [contentVisible, setContentVisible] = useState(true)

  useEffect(() => {
    if (!module) return

    try {
      const raw = localStorage.getItem(LAST_LESSON_STORAGE_KEY)
      const parsed = raw ? (JSON.parse(raw) as Record<string, number>) : {}
      const savedIndex = parsed[module.id]

      if (typeof savedIndex === 'number' && savedIndex >= 0 && savedIndex < module.lessons.length) {
        setActiveLessonIndex(savedIndex)
      } else {
        setActiveLessonIndex(0)
      }
    } catch {
      setActiveLessonIndex(0)
    }

    setShowQuiz(false)
    setRecentTerminalEvents([])
  }, [module?.id])

  useEffect(() => {
    if (!module) return

    try {
      const raw = localStorage.getItem(LAST_LESSON_STORAGE_KEY)
      const parsed = raw ? (JSON.parse(raw) as Record<string, number>) : {}
      parsed[module.id] = activeLessonIndex
      localStorage.setItem(LAST_LESSON_STORAGE_KEY, JSON.stringify(parsed))
    } catch {
      // ignore localStorage errors
    }
  }, [activeLessonIndex, module?.id])

  if (!module) return <Navigate to="/modules" replace />

  const lesson = module.lessons[activeLessonIndex]
  const lessonPractice = getLessonPractice(module.id, lesson.id)

  const switchLesson = (index: number) => {
    setContentVisible(false)

    window.setTimeout(() => {
      setActiveLessonIndex(index)
      setShowQuiz(false)
      setRecentTerminalEvents([])
      setContentVisible(true)
    }, 150)
  }

  const openQuiz = () => {
    setContentVisible(false)
    window.setTimeout(() => {
      setShowQuiz(true)
      setRecentTerminalEvents([])
      setContentVisible(true)
    }, 150)
  }

  const handleNext = () => {
    markLessonComplete(module.id, lesson.id)

    if (activeLessonIndex < module.lessons.length - 1) {
      switchLesson(activeLessonIndex + 1)
    } else {
      openQuiz()
    }
  }

  const handlePrevious = () => {
    if (activeLessonIndex > 0) {
      switchLesson(activeLessonIndex - 1)
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
  const completedLessons = module.lessons.filter(l => isLessonComplete(module.id, l.id)).length
  const progressPercent = Math.round((completedLessons / module.lessons.length) * 100)

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate('/modules')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-gray-500 dark:text-slate-400">
          <Link to="/modules" className="hover:underline">
            Modules
          </Link>
          {' / '}
          <span className="text-gray-700 dark:text-slate-200">{module.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Back
          </button>
          <Link
            to="/modules"
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Return to Modules
          </Link>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
              Module Progress
            </p>
            <h1 className="mt-1 text-2xl font-bold dark:text-slate-100">{module.title}</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
              {completedLessons} of {module.lessons.length} lessons completed
            </p>
          </div>

          <div className="w-full md:w-72">
            <div className="mb-2 flex justify-between text-xs text-gray-500 dark:text-slate-400">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-cyan-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="w-full lg:w-72 lg:shrink-0">
          <div className="rounded-2xl border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:sticky lg:top-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
              Lessons
            </p>

            <div className="space-y-2">
              {module.lessons.map((l, i) => {
                const active = !showQuiz && i === activeLessonIndex
                const complete = isLessonComplete(module.id, l.id)

                return (
                  <button
                    key={l.id}
                    onClick={() => switchLesson(i)}
                    className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                      active
                        ? 'border-cyan-500 bg-cyan-50 text-cyan-900 dark:border-cyan-400 dark:bg-cyan-500/10 dark:text-cyan-100'
                        : 'border-transparent bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-slate-400">Lesson {i + 1}</p>
                        <p className="text-sm font-medium">{l.title}</p>
                      </div>
                      <span className="text-xs">{complete ? 'Done' : ''}</span>
                    </div>
                  </button>
                )
              })}

              <button
                onClick={openQuiz}
                className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                  showQuiz
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-900 dark:border-cyan-400 dark:bg-cyan-500/10 dark:text-cyan-100'
                    : 'border-transparent bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700'
                }`}
              >
                <p className="text-xs text-gray-500 dark:text-slate-400">Final</p>
                <p className="text-sm font-medium">Quiz</p>
              </button>
            </div>
          </div>
        </aside>

        <main
          className={`min-w-0 flex-1 transition-all duration-200 ${
            contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}
        >
          {!showQuiz ? (
            <div className="space-y-6">
              <section className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
                  Lesson {activeLessonIndex + 1} of {module.lessons.length}
                </p>
                <h2 className="text-2xl font-bold dark:text-slate-100">{lesson.title}</h2>
              </section>

              <section className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="prose prose-sm max-w-none dark:prose-invert prose-pre:rounded-lg prose-pre:bg-slate-950 prose-code:before:content-[''] prose-code:after:content-['']">
                  <ReactMarkdown>{lesson.content}</ReactMarkdown>
                </div>
              </section>

              {lesson.terminalCommands && lesson.terminalCommands.length > 0 && (
                <section className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold dark:text-slate-100">Try it out</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Practice the command until it feels natural.
                    </p>
                  </div>

                  <Terminal
                    key={`${module.id}/${lesson.id}`}
                    commands={lesson.terminalCommands}
                    onCommand={handleTerminalCommand}
                  />

                  <p className="mt-3 text-xs text-gray-500 dark:text-slate-400">
                    Practice: {lessonPractice.recognized}/{lessonPractice.attempts} recognized
                  </p>

                  {lastTerminalEvent && !lastTerminalEvent.recognized && lastTerminalEvent.hint && (
                    <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                      Hint: {lastTerminalEvent.hint}
                    </p>
                  )}
                </section>
              )}

              <section className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <AITutor lessonContext={lesson.content} terminalContext={terminalContext} />
              </section>

              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {isLessonComplete(module.id, lesson.id) ? 'Completed' : 'In progress'}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={activeLessonIndex === 0}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    Previous lesson
                  </button>
                  <button
                    onClick={handleNext}
                    className="rounded-xl bg-black px-4 py-2 text-sm text-white transition hover:opacity-90 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                  >
                    {activeLessonIndex < module.lessons.length - 1 ? 'Next lesson ->' : 'Take quiz ->'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <section className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <h2 className="text-2xl font-bold dark:text-slate-100">Quiz - {module.title}</h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                  Score 70% or higher to complete the module.
                </p>
              </section>

              <section className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <Quiz questions={module.quiz} onComplete={handleQuizComplete} />
              </section>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => switchLesson(Math.max(0, module.lessons.length - 1))}
                  className="inline-block text-sm text-gray-500 hover:underline dark:text-slate-400"
                >
                  Back to last lesson
                </button>
                <Link
                  to="/modules"
                  className="inline-block text-sm text-gray-500 hover:underline dark:text-slate-400"
                >
                  Back to Modules
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
