// DATA SCHEMA — Sergio
// Define lesson content, quiz questions, and scenario challenges here.
// Add more modules as needed. Keep the types in sync with how components consume them.

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface TerminalCommand {
  input: string       // the command the user types
  output: string      // what gets printed back
}

export interface ScenarioChallenge {
  id: string
  title: string
  description: string
  steps: string[]     // sequence of commands the user must run in order
}

export interface Lesson {
  id: string
  title: string
  content: string                        // markdown-ish lesson text
  terminalCommands?: TerminalCommand[]   // commands available in this lesson's terminal
  scenario?: ScenarioChallenge           // optional real-world challenge
}

export interface Module {
  id: string
  title: string
  description: string
  icon: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  lessons: Lesson[]
  quiz: QuizQuestion[]
}

// ---------------------------------------------------------------------------
// Starter modules — expand these and add more (Sergio)
// ---------------------------------------------------------------------------

export const modules: Module[] = [
  {
    id: 'what-is-git',
    title: 'What is Git?',
    description: 'Understand why version control exists and what Git does.',
    icon: '📦',
    difficulty: 'beginner',
    lessons: [
      {
        id: 'intro',
        title: 'The Problem Git Solves',
        content: `## Why Version Control?\n\nTODO: fill in lesson content (Sergio)`,
        terminalCommands: [
          { input: 'git --version', output: 'git version 2.44.0' },
          { input: 'git help', output: 'TODO: fill in help output' },
        ],
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What does Git track?',
        options: ['Only the latest version', 'Changes over time', 'File sizes', 'Nothing'],
        correctIndex: 1,
        explanation: 'Git tracks changes to files over time.',
      },
    ],
  },
  {
    id: 'commits',
    title: 'Making Commits',
    description: 'Learn how to stage changes and save snapshots of your work.',
    icon: '💾',
    difficulty: 'beginner',
    lessons: [
      {
        id: 'staging',
        title: 'The Staging Area',
        content: `## TODO: lesson content (Sergio)`,
        terminalCommands: [],
      },
    ],
    quiz: [],
  },
  // TODO: add branching, merging, push/pull modules (Sergio)
]
