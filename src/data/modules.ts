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
        content: `📌 Why Version Control 📌

Sometimes when you're building something, especially during a hackathon or working with a team, things can go wrong. You might add a new feature and accidentally break your code, or a teammate might make changes that don't work the way you expected. Without a way to go back, you could lose hours of work or have to start over.

Imagine you are building an app like Snapchat 👻 step by step. First, you create a simple version where users can send messages 💬 and save it. Then you add the camera feature 📸 and save again. Next, you add filters like dog ears 🐶 and funny faces 🤪 and save again. Then you add stories where people can post for 24 hours ⏰ and save again. Each time you save, you are keeping a version of your app at that moment.

Now imagine you try to add a new filter, but it breaks everything and the camera stops working 😭. Without version control, you might not know how to fix it or go back. But with Git, you can return to a version where everything was working, like when messages 💬 and filters 🐶 were working perfectly, and continue building from there.

Git is really important in real-world apps. When developers add new features, they have to be careful because even a small mistake can break everything. Git helps by saving versions so teams can safely test changes and go back if something goes wrong. This process is often part of something called a CI/CD pipeline, where apps are tested and updated automatically to make sure everything works before changes go live.

Now try it below in the terminal. Type "git --version" to check if Git is installed. If you see a version number, Git is ready to use. Then try "git help" to explore the commands Git provides. Don't worry about understanding all of them yet, we'll learn the important ones step by step.`,
        terminalCommands: [
          { input: 'git --version', output: 'git version 2.44.0' },
          {
            input: 'git help',
            output: `Common Git commands:

   init      Start a new project
   add       Prepare changes to save
   commit    Save your work
   status    Check what's going on

More commands exist, but we'll learn them step by step!`,
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What does Git track?',
        options: ['Only the latest version', 'Changes over time', 'File sizes', 'Nothing'],
        correctIndex: 1,
        explanation: 'Git tracks changes to files over time, letting you revisit any previous state of your project.',
      },
      {
        id: 'q2',
        question: 'Why is version control important?',
        options: [
          'It makes your computer faster',
          'It helps you save versions and go back if something breaks',
          'It deletes old files automatically',
          'It only saves the latest version',
        ],
        correctIndex: 1,
        explanation: 'Version control helps you save your work and return to earlier versions if something goes wrong.',
      },
      {
        id: 'q3',
        question: 'In the Snapchat example 👻, what does saving each step do?',
        options: [
          'Deletes previous versions',
          'Keeps a version of the app at that moment',
          'Only saves the final version',
          'Uploads the app online',
        ],
        correctIndex: 1,
        explanation: 'Each save keeps a version so you can go back to it later.',
      },
      {
        id: 'q4',
        question: 'What can you do if a new feature breaks your app?',
        options: [
          'Start over from scratch',
          'Ignore the problem',
          'Go back to a version that was working',
          'Delete the project',
        ],
        correctIndex: 2,
        explanation: 'Git allows you to return to a working version instead of starting over.',
      },
      {
        id: 'q5',
        question: 'What does the command "git --version" do?',
        options: [
          'Creates a new project',
          'Saves your work',
          'Checks if Git is installed',
          'Deletes files',
        ],
        correctIndex: 2,
        explanation: 'git --version shows if Git is installed and working on your computer.',
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
        content: `📌 The Staging Area 📌

When you're working on a project, you might make a lot of changes, but not all of them are ready to be saved. The staging area is where you choose what changes you want to include in your next save. Think of it like a "ready to save" zone.

Imagine you are building an app like Snapchat 👻. You update filters 🐶🤪 and also make changes to the camera 📸, but the camera is still broken. You probably don't want to save everything yet. Instead, you only choose to save the filters because they are working.

The staging area lets you do exactly that. It allows you to pick which changes are ready before saving them. This helps you stay organized and avoid saving broken or unfinished work.

Now try it below in the terminal.

Type:

git status

Then type:

git add filters.txt

Then type:

git status`,
        terminalCommands: [
          {
            input: 'git status',
            output: `On branch main

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        filters.txt   # 🐶🤪 filters
        camera.txt    # 📸 camera

nothing added to commit but untracked files present (use "git add" to track)`,
          },
          {
            input: 'git add filters.txt',
            output: ``,
          },
          {
            input: 'git status',
            output: `On branch main

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        new file:   filters.txt   # 🐶🤪 filters

Untracked files:
        camera.txt  # 📸 camera`,
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What is the staging area?',
        options: [
          'Where code is deleted',
          'A place to run programs',
          'A place where you choose changes to save',
          'Where files are stored forever',
        ],
        correctIndex: 2,
        explanation: 'The staging area is where you choose which changes are ready to be saved.',
      },
      {
        id: 'q2',
        question: 'Why would you use the staging area?',
        options: [
          'To save everything automatically',
          'To choose only the changes you want to save',
          'To delete files',
          'To run your app',
        ],
        correctIndex: 1,
        explanation: 'The staging area lets you pick only the changes that are ready to be saved.',
      },
      {
        id: 'q3',
        question: 'In the Snapchat example 👻, why do we only add filters 🐶🤪?',
        options: [
          'Because filters are broken',
          'Because filters are ready but the camera is not',
          'Because Git only allows one file',
          'Because filters are required',
        ],
        correctIndex: 1,
        explanation: 'We only add features that are ready, like filters, while leaving broken parts like the camera out.',
      },
      {
        id: 'q4',
        question: 'What does the command "git add filters.txt" do?',
        options: [
          'Deletes the file',
          'Saves the file forever',
          'Moves the file to the staging area',
          'Uploads the file online',
        ],
        correctIndex: 2,
        explanation: 'git add moves a file into the staging area so it is ready to be saved.',
      },
      {
        id: 'q5',
        question: 'After running "git add filters.txt", where does the file appear in git status?',
        options: [
          'Untracked files',
          'Deleted files',
          'Changes to be committed',
          'Hidden files',
        ],
        correctIndex: 2,
        explanation: 'After adding, the file moves to "Changes to be committed", meaning it is ready to be saved.',
      },
    ],
  },
  // TODO: add branching, merging, push/pull modules (Sergio)
]
