import { Link } from 'react-router-dom'
import { modules } from '../data/modules'
import { useProgress } from '../context/ProgressContext'

export default function Landing() {
  const { isModuleComplete, isLessonComplete } = useProgress()
  const featuredModules = modules.slice(0, 3)
  const nextModule = modules.find(m => !isModuleComplete(m.id))
  const nextModuleLessonsDone = nextModule
    ? nextModule.lessons.filter(l => isLessonComplete(nextModule.id, l.id)).length
    : 0
  const nextModuleProgress = nextModule
    ? Math.round((nextModuleLessonsDone / nextModule.lessons.length) * 100)
    : 100

  return (
    <div className="relative mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
      <div className="pointer-events-none absolute -left-24 top-6 h-44 w-44 rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-500/20" />
      <div className="pointer-events-none absolute -right-20 top-24 h-44 w-44 rounded-full bg-amber-300/30 blur-3xl dark:bg-indigo-500/20" />

      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-[0_20px_60px_-35px_rgba(30,41,59,0.45)] backdrop-blur md:p-12 dark:border-slate-700/70 dark:bg-slate-900/65 dark:shadow-[0_24px_70px_-35px_rgba(8,47,73,0.75)]">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:border-cyan-700/70 dark:bg-cyan-950/60 dark:text-cyan-200">
          Interactive Git Learning Lab
        </div>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl dark:text-slate-100">
          Learn Git by shipping real workflows, not memorizing commands.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
          GitReady teaches beginners through step-by-step modules, live terminal practice, quizzes,
          and AI guidance that explains exactly what to run next.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/modules"
            className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
          >
            Start Learning
          </Link>
          <Link
            to="/progress"
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-700"
          >
            View Progress
          </Link>
        </div>

        {nextModule && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/80">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Continue where you left off
            </p>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {nextModule.icon} {nextModule.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {nextModuleLessonsDone}/{nextModule.lessons.length} lessons completed
                </p>
              </div>
              <Link
                to={`/modules/${nextModule.id}`}
                className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                Continue
              </Link>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-indigo-400"
                style={{ width: `${nextModuleProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/85">
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{modules.length}</p>
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Core modules</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/85">
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Hands-on</p>
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Terminal practice</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/85">
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">AI Coach</p>
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Context-aware help</p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Why GitReady</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Everything beginners need to learn Git with confidence.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: 'Interactive Lessons',
              desc: 'Follow beginner-friendly lessons with clear goals and practical command flow.',
              tone: 'from-cyan-100 to-cyan-50 border-cyan-200 dark:from-slate-800 dark:to-slate-900 dark:border-slate-700',
            },
            {
              title: 'Terminal Simulator',
              desc: 'Practice commands safely with instant feedback and command-level hints.',
              tone: 'from-amber-100 to-amber-50 border-amber-200 dark:from-slate-800 dark:to-slate-900 dark:border-slate-700',
            },
            {
              title: 'AI Tutor',
              desc: 'Ask questions and get concise, context-aware explanations from your current lesson.',
              tone: 'from-emerald-100 to-emerald-50 border-emerald-200 dark:from-slate-800 dark:to-slate-900 dark:border-slate-700',
            },
            {
              title: 'Progress Tracking',
              desc: 'Track completion and quiz scores so your team can see steady momentum.',
              tone: 'from-indigo-100 to-indigo-50 border-indigo-200 dark:from-slate-800 dark:to-slate-900 dark:border-slate-700',
            },
          ].map(item => (
            <article
              key={item.title}
              className={`rounded-2xl border bg-gradient-to-br p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${item.tone}`}
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/65">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Featured Modules</h2>
          <Link to="/modules" className="text-sm font-semibold text-blue-700 hover:text-blue-900 dark:text-cyan-300 dark:hover:text-cyan-200">
            See all modules
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {featuredModules.map(module => (
            <Link
              key={module.id}
              to={`/modules/${module.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-slate-600"
            >
              <div className="text-xl">{module.icon}</div>
              <h3 className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{module.title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{module.description}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {module.lessons.length} lessons
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
