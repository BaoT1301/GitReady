// STATE MANAGEMENT — Bao
// Tracks which modules/lessons the user has completed and quiz scores.
// Persisted to localStorage. Wrap the app in <ProgressProvider>.

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ProgressState {
  completedModules: string[]
  completedLessons: string[]   // format: "moduleId/lessonId"
  quizScores: Record<string, number>  // moduleId -> score 0-100
  terminalPractice: Record<string, {
    attempts: number
    recognized: number
    lastCommand: string
    updatedAt: number
  }> // key format: "moduleId/lessonId"
}

interface ProgressContextValue extends ProgressState {
  markModuleComplete: (moduleId: string) => void
  markLessonComplete: (moduleId: string, lessonId: string) => void
  setQuizScore: (moduleId: string, score: number) => void
  recordTerminalCommand: (
    moduleId: string,
    lessonId: string,
    input: string,
    recognized: boolean,
  ) => void
  getLessonPractice: (
    moduleId: string,
    lessonId: string,
  ) => { attempts: number; recognized: number; lastCommand: string; updatedAt: number }
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
  terminalPractice: {},
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return defaultState
      const parsed = JSON.parse(stored) as Partial<ProgressState>
      return {
        completedModules: Array.isArray(parsed.completedModules) ? parsed.completedModules : [],
        completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
        quizScores:
          parsed.quizScores && typeof parsed.quizScores === 'object'
            ? parsed.quizScores
            : {},
        terminalPractice:
          parsed.terminalPractice && typeof parsed.terminalPractice === 'object'
            ? parsed.terminalPractice
            : {},
      }
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

  const recordTerminalCommand = (
    moduleId: string,
    lessonId: string,
    input: string,
    recognized: boolean,
  ) => {
    const key = `${moduleId}/${lessonId}`
    setState(prev => {
      const existing = prev.terminalPractice[key] ?? {
        attempts: 0,
        recognized: 0,
        lastCommand: '',
        updatedAt: 0,
      }
      return {
        ...prev,
        terminalPractice: {
          ...prev.terminalPractice,
          [key]: {
            attempts: existing.attempts + 1,
            recognized: existing.recognized + (recognized ? 1 : 0),
            lastCommand: input,
            updatedAt: Date.now(),
          },
        },
      }
    })
  }

  const getLessonPractice = (moduleId: string, lessonId: string) => {
    const key = `${moduleId}/${lessonId}`
    return (
      state.terminalPractice[key] ?? {
        attempts: 0,
        recognized: 0,
        lastCommand: '',
        updatedAt: 0,
      }
    )
  }

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
        recordTerminalCommand,
        getLessonPractice,
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
