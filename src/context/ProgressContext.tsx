// STATE MANAGEMENT — Bao
// Tracks which modules/lessons the user has completed and quiz scores.
// Persisted to localStorage. Wrap the app in <ProgressProvider>.

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ProgressState {
  completedModules: string[]
  completedLessons: string[]   // format: "moduleId/lessonId"
  quizScores: Record<string, number>  // moduleId -> score 0-100
}

interface ProgressContextValue extends ProgressState {
  markModuleComplete: (moduleId: string) => void
  markLessonComplete: (moduleId: string, lessonId: string) => void
  setQuizScore: (moduleId: string, score: number) => void
  isModuleComplete: (moduleId: string) => boolean
  isLessonComplete: (moduleId: string, lessonId: string) => boolean
  resetProgress: () => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

const STORAGE_KEY = 'gitready_progress'

const defaultState: ProgressState = {
  completedModules: [],
  completedLessons: [],
  quizScores: {},
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : defaultState
    } catch {
      return defaultState
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const markModuleComplete = (moduleId: string) =>
    setState(prev => ({
      ...prev,
      completedModules: prev.completedModules.includes(moduleId)
        ? prev.completedModules
        : [...prev.completedModules, moduleId],
    }))

  const markLessonComplete = (moduleId: string, lessonId: string) => {
    const key = `${moduleId}/${lessonId}`
    setState(prev => ({
      ...prev,
      completedLessons: prev.completedLessons.includes(key)
        ? prev.completedLessons
        : [...prev.completedLessons, key],
    }))
  }

  const setQuizScore = (moduleId: string, score: number) =>
    setState(prev => ({
      ...prev,
      quizScores: { ...prev.quizScores, [moduleId]: score },
    }))

  const isModuleComplete = (moduleId: string) =>
    state.completedModules.includes(moduleId)

  const isLessonComplete = (moduleId: string, lessonId: string) =>
    state.completedLessons.includes(`${moduleId}/${lessonId}`)

  const resetProgress = () => setState(defaultState)

  return (
    <ProgressContext.Provider
      value={{
        ...state,
        markModuleComplete,
        markLessonComplete,
        setQuizScore,
        isModuleComplete,
        isLessonComplete,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
