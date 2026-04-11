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

When you are building something, especially during a hackathon or with a team, things can go wrong.

You might:
- add a new feature and break your code
- make a mistake you do not know how to undo
- have a teammate change something unexpectedly

Without a way to go back, you could lose hours of work or even have to start over.

---

📌 Imagine Building Snapchat 👻

Imagine you are building Snapchat at a hackathon step by step.

First, you create messaging 💬 and save it.

Then you add the camera 📸 and save again.

Next, you add filters like dog ears 🐶 and funny faces 🤪 and save again.

Then you add stories ⏰ and save again.

Each time you save, you are keeping a version of your app at that moment.

---

📌 What Could Go Wrong?

Now imagine you try to add a new filter, but it breaks everything and the camera stops working 😭

Without version control, you might not know how to fix it or return to the last working version.

But with Git, you can go back to an earlier version where everything was working and keep building from there.

---

📌 So What Is Version Control?

Version control is a way to track changes in your project over time.

Git helps you:
- save important versions of your code
- go back if something breaks
- work safely with teammates
- keep a history of what changed

---

📌 Why This Matters in Real Life

Git is used in real-world software projects every day.

When developers add new features, even a small mistake can break something important.

Git helps teams test changes safely and return to a working version if needed.

This is often part of a larger workflow where apps are tested before updates go live.

---

🧪 Try it in the terminal:

git --version   # check if Git is installed
git help        # explore Git commands

---

🎯 Goal

You should see that Git is installed and start getting familiar with the tool you will use throughout these lessons.`,
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

When you're working on a project, you might make a lot of changes, but not all of them are ready to be saved.

The staging area is where you choose what changes you want to include in your next save.

Think of it like a "ready to save" zone.

---

📌 Example

Imagine you are building an app like Snapchat 👻.

You update filters 🐶🤪 and also make changes to the camera 📸, but the camera is still broken.

You probably do not want to save everything yet.

Instead, you only choose to save the filters because they are working.

---

📌 Why this matters

The staging area lets you:
- pick what is ready
- avoid saving broken work
- stay organized

---

🧪 Try it in the terminal:

git status              # see what files have changed
git add filters.txt     # stage only the filters changes
git status              # confirm filters.txt is staged

---

🎯 Goal

You should see that only the changes you selected are staged and ready to be saved.`,
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
  {
    id: 'branching',
    title: 'Branching',
    description: 'Create separate lines of development so you can build features without breaking the main app.',
    icon: '🌿',
    difficulty: 'intermediate',
    lessons: [
      {
        id: 'creating-branches',
        title: 'Creating a Branch',
        content: `📌 What is a Branch? 📌

Imagine you and your team are building Snapchat 👻.

The main version of the app has:
- messaging 💬
- filters 🐶🤪
- stories ⏰

Everything works perfectly.

---

📌 The Problem

Now your boss says:
"Let's add a new Spotlight feature 🌟 where users can share short videos."

If you start building Spotlight directly on the main app and something breaks 😭,
you could ruin messaging, filters, and everything else.

That would be a disaster.

---

📌 The Solution: Branches

A branch is like making a copy of the app into a safe workspace.

You can:
- build new features
- test things
- experiment freely

All without touching the main app.

Your teammates can also work on their own features in their own branches,
so nobody gets in each other's way.

---

📌 How it works

- The main branch = your stable, working app
- A new branch (spotlight) = where you build your feature

You can switch between branches anytime.

---

🧪 Try it in the terminal:

git branch                 # see all branches (you should see main)
git checkout -b spotlight  # create a new branch + switch to it
git branch                 # confirm you are now on spotlight

---

🎯 Goal

You should now be working on the spotlight branch instead of main.`,
        terminalCommands: [
          {
            input: 'git branch',
            output: `* main`,
          },
          {
            input: 'git checkout -b spotlight',
            output: `Switched to a new branch 'spotlight'
  main
* spotlight`,
          },
          {
            input: 'git branch',
            output: `  main
* spotlight`,
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What is a branch in Git?',
        options: [
          'A deleted version of your code',
          'A separate workspace to work on features safely',
          'A backup stored online',
          'A file that lists your commits',
        ],
        correctIndex: 1,
        explanation: 'A branch is a separate workspace where you can make changes without affecting the main version of your code.',
      },
      {
        id: 'q2',
        question: 'In the Snapchat example 👻, why do we create a branch for Spotlight 🌟?',
        options: [
          'Because branches are faster',
          'So we can work on Spotlight without breaking messaging and filters',
          'Because you can only have one branch',
          'Because branches delete old commits',
        ],
        correctIndex: 1,
        explanation: 'A branch lets you build a new feature in isolation so the rest of the working app stays safe.',
      },
      {
        id: 'q3',
        question: 'What does "git checkout -b spotlight" do?',
        options: [
          'Deletes the spotlight branch',
          'Switches to main',
          'Creates a new branch called spotlight and switches to it',
          'Merges spotlight into main',
        ],
        correctIndex: 2,
        explanation: 'git checkout -b creates a new branch and immediately switches you to it.',
      },
      {
        id: 'q4',
        question: 'How do you see all your branches?',
        options: [
          'git status',
          'git log',
          'git branch',
          'git add',
        ],
        correctIndex: 2,
        explanation: 'git branch lists all branches in your repo. The one with * is the branch you are currently on.',
      },
      {
        id: 'q5',
        question: 'What does the * next to a branch name in "git branch" mean?',
        options: [
          'That branch is broken',
          'That branch is the oldest',
          'That branch is currently active (you are on it)',
          'That branch is protected',
        ],
        correctIndex: 2,
        explanation: 'The * marks the branch you are currently working on.',
      },
    ],
  },
  {
    id: 'merging',
    title: 'Merging Branches',
    description: 'Combine finished feature branches back into the main app.',
    icon: '🔀',
    difficulty: 'intermediate',
    lessons: [
      {
        id: 'merging-branches',
        title: 'Bringing It All Together',
        content: `📌 What is Merging? 📌

Remember the Snapchat 👻 Spotlight 🌟 feature you built on its own branch?

You worked on it separately, tested it, and made sure everything runs smoothly. Now it is ready to be part of the real app.

Merging is how you bring those changes into the main branch.

Think of it like building a feature in a separate studio, then officially launching it in the app for everyone to use.

Your main branch is your stable Snapchat app with:
- messaging 💬
- filters 🐶🤪
- stories ⏰

When you merge Spotlight 🌟, the main branch now includes everything plus your new feature.

---

📌 How merging works

1. Switch to the branch you want to merge INTO (main)
2. Merge the feature branch (spotlight)

---

🧪 Try it in the terminal:

git checkout main        # switch to main branch (where changes will go)
git merge spotlight      # bring changes from spotlight into main

---

📌 Viewing your history

git log --oneline        # show a simple list of commits (one line each)

---

⚠️ What is a merge conflict?

Sometimes two people change the same part of the code.

Git cannot decide which version to keep, so it asks you to choose. This is called a merge conflict.

It does not happen all the time, and teams usually communicate to avoid it.

---

🎯 Goal

After merging, your main branch should now include the Spotlight 🌟 feature.`,
        terminalCommands: [
          {
            input: 'git checkout main',
            output: `Switched to branch 'main'`,
          },
          {
            input: 'git merge spotlight',
            output: `Updating 3f2a1b4..9c8d7e6
Fast-forward
 spotlight.txt | 12 ++++++++++++
 1 file changed, 12 insertions(+)
 create mode 100644 spotlight.txt`,
          },
          {
            input: 'git log --oneline',
            output: `9c8d7e6 Add Spotlight 🌟 short video feed
3f2a1b4 Add Stories ⏰ feature
1a2b3c4 Add filters 🐶🤪
0d1e2f3 Add messaging 💬`,
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What does merging do in Git?',
        options: [
          'Deletes a branch permanently',
          'Combines changes from one branch into another',
          'Creates a new branch',
          'Undoes your last commit',
        ],
        correctIndex: 1,
        explanation: 'Merging takes the changes from one branch and brings them into another, like adding a finished feature into the main app.',
      },
      {
        id: 'q2',
        question: 'In the Snapchat example 👻, when do you merge Spotlight 🌟 into main?',
        options: [
          'As soon as you start building it',
          'Before testing it',
          'After it is finished and tested',
          'Only when something breaks',
        ],
        correctIndex: 2,
        explanation: 'You merge a branch once the feature is complete and working so the main app stays stable.',
      },
      {
        id: 'q3',
        question: 'Which branch should you be on when you run git merge spotlight?',
        options: [
          'The spotlight branch',
          'Any branch',
          'The main branch (where you want changes to land)',
          'A new empty branch',
        ],
        correctIndex: 2,
        explanation: 'You merge INTO the branch you are currently on, so switch to main first before merging.',
      },
      {
        id: 'q4',
        question: 'What is a merge conflict?',
        options: [
          'When two branches have the same name',
          'When Git cannot automatically combine changes because two people edited the same code',
          'When a branch is deleted',
          'When you forget to commit',
        ],
        correctIndex: 1,
        explanation: 'A merge conflict happens when two branches changed the same lines and Git needs you to decide which version to keep.',
      },
      {
        id: 'q5',
        question: 'What does "git log --oneline" show after merging?',
        options: [
          'Only commits from the feature branch',
          'Only deleted commits',
          'A short summary of all commits including the merged ones',
          'Nothing — log only shows current files',
        ],
        correctIndex: 2,
        explanation: 'git log --oneline shows a compact history of all commits, so you can confirm the merge was successful.',
      },
    ],
  },
  {
    id: 'push-pull',
    title: 'Push & Pull',
    description: 'Share your work with teammates and keep your local code up to date.',
    icon: '☁️',
    difficulty: 'intermediate',
    lessons: [
      {
        id: 'remote-basics',
        title: 'Working with a Remote',
        content: `📌 Push, Pull, and Working as a Team 📌

So far, all your Git work has been on your own computer.

But Snapchat 👻 is built by a whole team of engineers, not just one person.

How do they all work on the same code without constantly stepping on each other?

---

📌 The Solution: Remote Repository

The answer is a remote repository.

Think of it like a shared cloud 🌐 version of the project that everyone on the team can access.

- You push your work → teammates can see it
- Teammates push their work → you can pull it

This keeps everyone in sync.

---

📌 Push vs Pull

- git push → sends your changes to the remote (like uploading your work)
- git pull → brings down the latest changes from the remote

---

📌 Real Team Workflow

Here is how building Snapchat 👻 works as a team:

1. You build and commit the Spotlight 🌟 feature on your computer
2. You push it to the remote (GitHub)
3. Your teammate working on Snap Map 🗺️ pulls your changes
4. Now both features exist together in the shared project

---

📌 Why this matters

This is how professional apps are built.

Hundreds of engineers push and pull all day to a shared remote.

Platforms like GitHub or GitLab host the remote repository and let teams review each other's code before merging.

---

⚠️ Staying Up to Date

If your teammate pushed changes and you do not pull yet, your code is behind.

Git will warn you when that happens so you know to pull before pushing again.

---

🧪 Try it in the terminal:

git push origin main   # send your changes to the remote
git pull origin main   # get the latest changes from the remote
git status             # check if your branch is up to date

---

🎯 Goal

Your branch should now be up to date with the remote repository.`,
        terminalCommands: [
          {
            input: 'git push origin main',
            output: `Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Writing objects: 100% (3/3), 312 bytes | 312.00 KiB/s, done.
To https://github.com/snapchat-team/app.git
   3f2a1b4..9c8d7e6  main -> main`,
          },
          {
            input: 'git pull origin main',
            output: `From https://github.com/snapchat-team/app
 * branch            main       -> FETCH_HEAD
   9c8d7e6..b4f1c2a  main       -> origin/main
remote: Enumerating objects: 4, done.
remote: Counting objects: 100% (4/4), done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 3 (delta 1), reused 0 (delta 0), pack-reused 0
Receiving objects: 100% (3/3), 284 bytes | 284.00 KiB/s, done.
Resolving deltas: 100% (1/1), done.
Updating 9c8d7e6..b4f1c2a
Fast-forward
 snapmap.txt | 8 ++++++++
 1 file changed, 8 insertions(+)
 create mode 100644 snapmap.txt   # 🗺️ Snap Map from your teammate!`,
          },
          {
            input: 'git status',
            output: `On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean`,
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What is a remote repository?',
        options: [
          'A branch on your computer',
          'A shared cloud version of the project that the whole team can access',
          'A deleted version of your code',
          'A file that stores commit messages',
        ],
        correctIndex: 1,
        explanation: 'A remote repository is a shared version of the project hosted online (like on GitHub) that all teammates can push to and pull from.',
      },
      {
        id: 'q2',
        question: 'What does "git push" do?',
        options: [
          'Downloads your teammates changes',
          'Creates a new branch',
          'Sends your local commits up to the remote repository',
          'Deletes old commits',
        ],
        correctIndex: 2,
        explanation: 'git push uploads your committed changes to the remote so teammates can see and use your work.',
      },
      {
        id: 'q3',
        question: 'What does "git pull" do?',
        options: [
          'Sends your changes to teammates',
          'Downloads the latest changes from the remote to your local computer',
          'Creates a new remote repository',
          'Stages your files',
        ],
        correctIndex: 1,
        explanation: 'git pull fetches and merges the latest changes from the remote into your local branch.',
      },
      {
        id: 'q4',
        question: 'In the Snapchat example 👻, why does your teammate run "git pull"?',
        options: [
          'To delete the Spotlight 🌟 feature',
          'To get your latest Spotlight 🌟 changes onto their computer',
          'To create a new branch',
          'To reset to an older version',
        ],
        correctIndex: 1,
        explanation: 'Your teammate pulls so their local code is up to date with what you pushed, including the new Spotlight feature.',
      },
      {
        id: 'q5',
        question: 'What does "Your branch is up to date with origin/main" mean in git status?',
        options: [
          'You have unpushed commits',
          'Your local branch matches the remote — nothing to push or pull',
          'Your branch was deleted from the remote',
          'There is a merge conflict',
        ],
        correctIndex: 1,
        explanation: 'This message means your local code matches the remote exactly. You are fully in sync with your team.',
      },
    ],
  },
]
