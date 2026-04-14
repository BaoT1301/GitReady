import { CSSProperties, useState } from 'react'

function fade(visible: boolean): CSSProperties {
  return { opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease' }
}

function Nav({
  step, total, onBack, onNext, onJump,
}: {
  step: number; total: number
  onBack: () => void; onNext: () => void; onJump: (i: number) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onBack}
        disabled={step === 0}
        className="px-3 py-1.5 rounded text-xs bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ← Back
      </button>
      <div className="flex gap-2 flex-1 justify-center">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => onJump(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === step ? 'bg-white' : 'bg-gray-600 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
      <button
        onClick={onNext}
        disabled={step === total - 1}
        className="px-3 py-1.5 rounded text-xs bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Next →
      </button>
    </div>
  )
}

function Cmd({ command }: { command: string | null }) {
  return command ? (
    <div className="bg-gray-800 rounded-lg px-3 py-2 font-mono text-xs text-green-400 whitespace-pre leading-relaxed">
      {command.split('\n').map((line, i) => (
        <div key={i}>
          <span className="text-gray-500">$ </span>{line}
        </div>
      ))}
    </div>
  ) : (
    <div className="bg-gray-800 rounded-lg px-3 py-2 font-mono text-xs text-gray-500 italic">
      (no command yet — this is your starting state)
    </div>
  )
}

function VizHeader({ label, step, total }: { label: string; step: number; total: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        Git Visualizer — {label}
      </span>
      <span className="text-xs text-gray-500">Step {step + 1} / {total}</span>
    </div>
  )
}



export default function GitVisualizer({ moduleId }: { moduleId: string }) {
  switch (moduleId) {
    case 'what-is-git': return <SnapshotsViz />
    case 'commits':     return <StagingViz />
    case 'branching':   return <BranchingViz />
    case 'merging':     return <MergingViz />
    case 'push-pull':   return <PushPullViz />
    default:            return null
  }
}

// what is git

const SNAP_COMMITS = [
  { x: 120, label: 'C1', desc: 'App 📦' },
  { x: 220, label: 'C2', desc: 'Camera 📸' },
  { x: 320, label: 'C3', desc: 'Filters 🐶' },
]

const SNAP_STEPS = [
  {
    title: "Your project starts. The first commit saves a permanent snapshot 📦",
    command: 'git init\ngit commit -m "App foundation 📦"',
    count: 1, head: 0, rollback: false,
  },
  {
    title: "Camera feature done. Another snapshot — you can always return here 📸",
    command: 'git commit -m "Add camera 📸"',
    count: 2, head: 1, rollback: false,
  },
  {
    title: "Filters added — but they broke the camera 💥 Uh oh.",
    command: 'git commit -m "Add filters 🐶"\n# Camera is now broken!',
    count: 3, head: 2, rollback: false,
  },
  {
    title: "No panic — Git lets you jump back to any snapshot. History is never lost ✅",
    command: 'git checkout <C2-hash>\n# Camera is working again! 📸',
    count: 3, head: 1, rollback: true,
  },
]

function SnapshotsViz() {
  const [step, setStep] = useState(0)
  const s = SNAP_STEPS[step]
  const Y = 88; const R = 14

  return (
    <div className="border rounded-xl bg-gray-950 text-white p-4 space-y-4 select-none">
      <VizHeader label="Snapshots" step={step} total={SNAP_STEPS.length} />

      <svg viewBox="0 0 450 190" className="w-full rounded-lg bg-gray-900 px-2 py-1" style={{ fontFamily: 'monospace' }}>
        <text x="8" y={Y + 4} fill="#86efac" fontSize="11" fontWeight="bold">main</text>

        <line
          x1={SNAP_COMMITS[0].x} y1={Y}
          x2={SNAP_COMMITS[s.count - 1].x} y2={Y}
          stroke="#86efac" strokeWidth="2"
        />

        {SNAP_COMMITS.slice(0, s.count).map((c, i) => {
          const isHead = i === s.head
          const faded = s.rollback && i > s.head
          return (
            <g key={c.label} style={{ opacity: faded ? 0.2 : 1, transition: 'opacity 0.4s ease' }}>
              <circle cx={c.x} cy={Y} r={R}
                fill={isHead ? '#86efac' : '#1b2d1b'}
                stroke="#86efac" strokeWidth="2" />
              <text x={c.x} y={Y + 4} textAnchor="middle"
                fill={isHead ? '#052e16' : '#86efac'} fontSize="9" fontWeight="bold">
                {c.label}
              </text>
              <text x={c.x} y={Y - R - 8} textAnchor="middle" fill="#d1fae5" fontSize="10" fontWeight="bold">
                {c.label}
              </text>
              <text x={c.x} y={Y + R + 16} textAnchor="middle" fill="#6b7280" fontSize="10">
                {c.desc}
              </text>
            </g>
          )
        })}

        {SNAP_COMMITS.map((c, i) => (
          <circle key={`active-${i}`} cx={c.x} cy={Y} r={R + 5}
            fill="none" stroke="#86efac" strokeWidth="1.5" strokeDasharray="3 2"
            style={fade(i === s.head && i < s.count)} />
        ))}
      </svg>

      <p className="text-sm text-white leading-snug">{s.title}</p>
      <Cmd command={s.command} />
      <Nav step={step} total={SNAP_STEPS.length}
        onBack={() => setStep(s => Math.max(0, s - 1))}
        onNext={() => setStep(s => Math.min(SNAP_STEPS.length - 1, s + 1))}
        onJump={setStep} />
    </div>
  )
}

// staging area

const STAGING_STEPS = [
  {
    title: "You edit filters.txt on your machine. Git knows it changed but hasn't saved it yet.",
    command: null as string | null,
    zone: 0,
  },
  {
    title: "git add stages the file — you're selecting it for the next snapshot.",
    command: 'git add filters.txt',
    zone: 1,
  },
  {
    title: "git commit creates a permanent snapshot. The file is now saved in history forever.",
    command: 'git commit -m "Add filters 🐶"',
    zone: 2,
  },
]

const ZONES = [
  { x: 15,  label: 'Working Dir',  color: '#9ca3af' },
  { x: 195, label: 'Staging Area', color: '#fbbf24' },
  { x: 375, label: 'Repository',   color: '#86efac' },
]
const BOX_W = 145; const BOX_H = 118; const BOX_Y = 38

function StagingViz() {
  const [step, setStep] = useState(0)
  const s = STAGING_STEPS[step]
  const activeZone = ZONES[s.zone]

  return (
    <div className="border rounded-xl bg-gray-950 text-white p-4 space-y-4 select-none">
      <VizHeader label="Staging" step={step} total={STAGING_STEPS.length} />

      <svg viewBox="0 0 540 185" className="w-full rounded-lg bg-gray-900 px-2 py-1" style={{ fontFamily: 'monospace' }}>
        {ZONES.map((z, i) => (
          <g key={z.label}>
            <rect
              x={z.x} y={BOX_Y} width={BOX_W} height={BOX_H} rx={10}
              fill="none"
              stroke={s.zone === i ? z.color : '#374151'}
              strokeWidth={s.zone === i ? 2 : 1}
              style={{ transition: 'stroke 0.3s ease' }}
            />
            <text x={z.x + BOX_W / 2} y={BOX_Y + 18}
              textAnchor="middle" fontSize="10" fontWeight="bold" fill={z.color}>
              {z.label}
            </text>
          </g>
        ))}

        <text x={178} y={101} textAnchor="middle" fill="#4b5563" fontSize="20">→</text>
        <text x={178} y={114} textAnchor="middle" fill="#4b5563" fontSize="8">git add</text>
        <text x={358} y={101} textAnchor="middle" fill="#4b5563" fontSize="20">→</text>
        <text x={358} y={114} textAnchor="middle" fill="#4b5563" fontSize="8">git commit</text>

        {s.zone < 2 && (
          <g>
            <rect
              x={activeZone.x + 12} y={72} width={120} height={30} rx={7}
              fill={`${activeZone.color}22`}
              stroke={activeZone.color}
              strokeWidth="1.5"
            />
            <text x={activeZone.x + 72} y={90} textAnchor="middle"
              fill={activeZone.color} fontSize="11" fontWeight="bold">
              🐶 filters.txt
            </text>
          </g>
        )}

        <g style={fade(s.zone === 2)}>
          <circle cx={447} cy={84} r={22} fill="#86efac22" stroke="#86efac" strokeWidth="2" />
          <text x={447} y={88} textAnchor="middle" fill="#86efac" fontSize="16">🐶</text>
          <text x={447} y={114} textAnchor="middle" fill="#86efac" fontSize="9" fontWeight="bold">filters.txt</text>
          <text x={447} y={128} textAnchor="middle" fill="#6b7280" fontSize="9">committed</text>
        </g>
      </svg>

      <p className="text-sm text-white leading-snug">{s.title}</p>
      <Cmd command={s.command} />
      <Nav step={step} total={STAGING_STEPS.length}
        onBack={() => setStep(s => Math.max(0, s - 1))}
        onNext={() => setStep(s => Math.min(STAGING_STEPS.length - 1, s + 1))}
        onJump={setStep} />
    </div>
  )
}

// branching

const Y_MAIN_B    = 65
const Y_FEATURE_B = 145
const R_B         = 12

const BRANCH_MAIN = [
  { x: 95,  label: 'C1', desc: 'App 📦' },
  { x: 165, label: 'C2', desc: 'Camera 📸' },
  { x: 235, label: 'C3', desc: 'Messages 💬' },
]
const BRANCH_FEATURE = [
  { x: 295, label: 'F1', desc: 'Spotlight 🌟' },
  { x: 365, label: 'F2', desc: 'Video feed 📹' },
  { x: 435, label: 'F3', desc: 'Polish ✨' },
]

const BRANCHING_STEPS = [
  {
    title: "You're on main — app, camera and messages are working 👻",
    command: null as string | null,
    showFork: false,
    featureCount: 0,
  },
  {
    title: "You branch off so Spotlight work can't break main",
    command: 'git checkout -b feature-spotlight',
    showFork: true,
    featureCount: 0,
  },
  {
    title: "You commit Spotlight features safely on the branch. main is untouched 🎯",
    command: 'git add spotlight.txt\ngit commit -m "Add Spotlight 🌟"\ngit commit -m "Add video feed 📹"\ngit commit -m "Polish ✨"',
    showFork: true,
    featureCount: 3,
  },
]

function BranchingViz() {
  const [step, setStep] = useState(0)
  const s = BRANCHING_STEPS[step]

  return (
    <div className="border rounded-xl bg-gray-950 text-white p-4 space-y-4 select-none">
      <VizHeader label="Branching" step={step} total={BRANCHING_STEPS.length} />

      <svg viewBox="0 0 540 195" className="w-full rounded-lg bg-gray-900 px-2 py-1" style={{ fontFamily: 'monospace' }}>
        <text x="6" y={Y_MAIN_B + 4} fill="#86efac" fontSize="11" fontWeight="bold">main</text>
        <text x="6" y={Y_FEATURE_B + 4} fill="#93c5fd" fontSize="11" fontWeight="bold"
          style={fade(s.showFork)}>
          feature-spotlight
        </text>

        <line
          x1={BRANCH_MAIN[0].x} y1={Y_MAIN_B}
          x2={BRANCH_MAIN[2].x} y2={Y_MAIN_B}
          stroke="#86efac" strokeWidth="2"
        />

        <line
          x1={BRANCH_MAIN[2].x} y1={Y_MAIN_B}
          x2={BRANCH_FEATURE[0].x} y2={Y_FEATURE_B}
          stroke="#93c5fd" strokeWidth="2"
          style={fade(s.showFork)}
        />

        <line
          x1={BRANCH_FEATURE[0].x} y1={Y_FEATURE_B}
          x2={BRANCH_FEATURE[s.featureCount > 0 ? s.featureCount - 1 : 0].x} y2={Y_FEATURE_B}
          stroke="#93c5fd" strokeWidth="2"
          style={fade(s.featureCount > 0)}
        />

        {BRANCH_MAIN.map(c => (
          <g key={c.label}>
            <circle cx={c.x} cy={Y_MAIN_B} r={R_B} fill="#86efac" stroke="#111" strokeWidth="2" />
            <text x={c.x} y={Y_MAIN_B - R_B - 6} textAnchor="middle" fill="#d1fae5" fontSize="10" fontWeight="bold">{c.label}</text>
            <text x={c.x} y={Y_MAIN_B + R_B + 14} textAnchor="middle" fill="#6b7280" fontSize="9">{c.desc}</text>
          </g>
        ))}

        {BRANCH_FEATURE.map((c, i) => (
          <g key={c.label} style={fade(i < s.featureCount)}>
            <circle cx={c.x} cy={Y_FEATURE_B} r={R_B} fill="#93c5fd" stroke="#111" strokeWidth="2" />
            <text x={c.x} y={Y_FEATURE_B - R_B - 6} textAnchor="middle" fill="#dbeafe" fontSize="10" fontWeight="bold">{c.label}</text>
            <text x={c.x} y={Y_FEATURE_B + R_B + 14} textAnchor="middle" fill="#6b7280" fontSize="9">{c.desc}</text>
          </g>
        ))}
      </svg>

      <p className="text-sm text-white leading-snug">{s.title}</p>
      <Cmd command={s.command} />
      <Nav step={step} total={BRANCHING_STEPS.length}
        onBack={() => setStep(s => Math.max(0, s - 1))}
        onNext={() => setStep(s => Math.min(BRANCHING_STEPS.length - 1, s + 1))}
        onJump={setStep} />
    </div>
  )
}

// merging

const Y_MAIN    = 65
const Y_FEATURE = 145
const R         = 12

const MAIN_COMMITS = [
  { x: 95,  label: 'C1', desc: 'App 📦' },
  { x: 165, label: 'C2', desc: 'Camera 📸' },
  { x: 235, label: 'C3', desc: 'Messages 💬' },
]
const FEATURE_COMMITS = [
  { x: 295, label: 'F1', desc: 'Dog ears 🐶' },
  { x: 365, label: 'F2', desc: 'Funny face 🤪' },
  { x: 435, label: 'F3', desc: 'Fixed filters ✨' },
]
const MERGE_COMMIT = { x: 495, label: 'M', desc: 'Merge ✅' }

const MERGE_STEPS = [
  {
    title: "You're on main — camera and messages are working 👻",
    command: null as string | null,
    showFork: false,
    featureCount: 0,
    showMerge: false,
  },
  {
    title: "You branch off so filters don't risk breaking main",
    command: 'git checkout -b feature-filters',
    showFork: true,
    featureCount: 0,
    showMerge: false,
  },
  {
    title: "You commit filter work on the feature branch",
    command: 'git add filters.txt\ngit commit -m "Add dog ears 🐶"\ngit commit -m "Add funny faces 🤪"',
    showFork: true,
    featureCount: 3,
    showMerge: false,
  },
  {
    title: "Filters look great! You merge feature-filters into main 🎉",
    command: 'git checkout main\ngit merge feature-filters',
    showFork: true,
    featureCount: 3,
    showMerge: true,
  },
]

function MergingViz() {
  const [step, setStep] = useState(0)
  const s = MERGE_STEPS[step]

  return (
    <div className="border rounded-xl bg-gray-950 text-white p-4 space-y-4 select-none">
      <VizHeader label="Merge" step={step} total={MERGE_STEPS.length} />

      <svg viewBox="0 0 540 195" className="w-full rounded-lg bg-gray-900 px-2 py-1" style={{ fontFamily: 'monospace' }}>
        <text x="6" y={Y_MAIN + 4} fill="#86efac" fontSize="11" fontWeight="bold">main</text>
        <text x="6" y={Y_FEATURE + 4} fill="#93c5fd" fontSize="11" fontWeight="bold" style={fade(s.showFork)}>
          feature-filters
        </text>

        <line x1={MAIN_COMMITS[0].x} y1={Y_MAIN} x2={MAIN_COMMITS[2].x} y2={Y_MAIN}
          stroke="#86efac" strokeWidth="2" />

        <line x1={MAIN_COMMITS[2].x} y1={Y_MAIN} x2={MERGE_COMMIT.x} y2={Y_MAIN}
          stroke="#86efac" strokeWidth="2" strokeDasharray="6 3"
          style={fade(s.showMerge)} />

        <line
          x1={MAIN_COMMITS[2].x} y1={Y_MAIN}
          x2={FEATURE_COMMITS[0].x} y2={Y_FEATURE}
          stroke="#93c5fd" strokeWidth="2"
          style={fade(s.showFork)}
        />

        <line
          x1={FEATURE_COMMITS[0].x} y1={Y_FEATURE}
          x2={FEATURE_COMMITS[s.featureCount > 0 ? s.featureCount - 1 : 0].x} y2={Y_FEATURE}
          stroke="#93c5fd" strokeWidth="2"
          style={fade(s.featureCount > 0)}
        />

        <line
          x1={FEATURE_COMMITS[2].x} y1={Y_FEATURE}
          x2={MERGE_COMMIT.x} y2={Y_MAIN}
          stroke="#fbbf24" strokeWidth="2"
          style={fade(s.showMerge)}
        />

        {MAIN_COMMITS.map(c => (
          <g key={c.label}>
            <circle cx={c.x} cy={Y_MAIN} r={R} fill="#86efac" stroke="#111" strokeWidth="2" />
            <text x={c.x} y={Y_MAIN - R - 6} textAnchor="middle" fill="#d1fae5" fontSize="10" fontWeight="bold">{c.label}</text>
            <text x={c.x} y={Y_MAIN + R + 14} textAnchor="middle" fill="#6b7280" fontSize="9">{c.desc}</text>
          </g>
        ))}

        {FEATURE_COMMITS.map((c, i) => (
          <g key={c.label} style={fade(i < s.featureCount)}>
            <circle cx={c.x} cy={Y_FEATURE} r={R} fill="#93c5fd" stroke="#111" strokeWidth="2" />
            <text x={c.x} y={Y_FEATURE - R - 6} textAnchor="middle" fill="#dbeafe" fontSize="10" fontWeight="bold">{c.label}</text>
            <text x={c.x} y={Y_FEATURE + R + 14} textAnchor="middle" fill="#6b7280" fontSize="9">{c.desc}</text>
          </g>
        ))}

        <g style={fade(s.showMerge)}>
          <circle cx={MERGE_COMMIT.x} cy={Y_MAIN} r={R} fill="#fbbf24" stroke="#111" strokeWidth="2" />
          <text x={MERGE_COMMIT.x} y={Y_MAIN - R - 6} textAnchor="middle" fill="#fef3c7" fontSize="10" fontWeight="bold">{MERGE_COMMIT.label}</text>
          <text x={MERGE_COMMIT.x} y={Y_MAIN + R + 14} textAnchor="middle" fill="#6b7280" fontSize="9">{MERGE_COMMIT.desc}</text>
        </g>
      </svg>

      <p className="text-sm text-white leading-snug">{s.title}</p>
      <Cmd command={s.command} />
      <Nav step={step} total={MERGE_STEPS.length}
        onBack={() => setStep(s => Math.max(0, s - 1))}
        onNext={() => setStep(s => Math.min(MERGE_STEPS.length - 1, s + 1))}
        onJump={setStep} />
    </div>
  )
}

// push and pull

const ALL_COMMITS = [
  { label: 'C1', desc: '💬 Add messaging', color: '#86efac' },
  { label: 'C2', desc: '📸 Add camera',    color: '#86efac' },
  { label: 'C3', desc: '🌟 Add Spotlight', color: '#fbbf24' },
  { label: 'C4', desc: '🗺️ Add Snap Map',  color: '#f9a8d4' },
]

const PP_STEPS = [
  {
    title: "You committed Spotlight 🌟 locally. The remote hasn't seen it yet.",
    command: null as string | null,
    localCount: 3, remoteCount: 2,
    showPush: false, showPull: false,
  },
  {
    title: "git push sends your Spotlight commit up to GitHub. Your team can now see it 🌟",
    command: 'git push origin main',
    localCount: 3, remoteCount: 3,
    showPush: true, showPull: false,
  },
  {
    title: "Your teammate pushed Snap Map 🗺️ to the remote. You don't have it yet.",
    command: null,
    localCount: 3, remoteCount: 4,
    showPush: false, showPull: false,
  },
  {
    title: "git pull brings their Snap Map commit down to your machine 🗺️",
    command: 'git pull origin main',
    localCount: 4, remoteCount: 4,
    showPush: false, showPull: true,
  },
]

const CHIP_Y0 = 48; const CHIP_GAP = 27; const CHIP_W = 185; const CHIP_H = 21
const LOCAL_X = 18;  const REMOTE_X = 320
const BOX_PP_W = 205; const BOX_PP_H = 148; const BOX_PP_Y = 28

function PushPullViz() {
  const [step, setStep] = useState(0)
  const s = PP_STEPS[step]

  return (
    <div className="border rounded-xl bg-gray-950 text-white p-4 space-y-4 select-none">
      <VizHeader label="Push & Pull" step={step} total={PP_STEPS.length} />

      <svg viewBox="0 0 540 195" className="w-full rounded-lg bg-gray-900 px-2 py-1" style={{ fontFamily: 'monospace' }}>
        <rect x={LOCAL_X} y={BOX_PP_Y} width={BOX_PP_W} height={BOX_PP_H} rx={10}
          fill="none" stroke="#86efac55" strokeWidth="1.5" />
        <text x={LOCAL_X + BOX_PP_W / 2} y={BOX_PP_Y + 17} textAnchor="middle"
          fontSize="10" fontWeight="bold" fill="#86efac">
          💻 Local
        </text>

        <rect x={REMOTE_X} y={BOX_PP_Y} width={BOX_PP_W} height={BOX_PP_H} rx={10}
          fill="none" stroke="#93c5fd55" strokeWidth="1.5" />
        <text x={REMOTE_X + BOX_PP_W / 2} y={BOX_PP_Y + 17} textAnchor="middle"
          fontSize="10" fontWeight="bold" fill="#93c5fd">
          ☁️ Remote (GitHub)
        </text>

        {ALL_COMMITS.slice(0, s.localCount).map((c, i) => (
          <g key={`local-${c.label}`}>
            <rect x={LOCAL_X + 10} y={CHIP_Y0 + i * CHIP_GAP} width={CHIP_W} height={CHIP_H} rx={5}
              fill={`${c.color}18`} stroke={`${c.color}66`} strokeWidth="1" />
            <text x={LOCAL_X + 18} y={CHIP_Y0 + i * CHIP_GAP + 14}
              fontSize="10" fill={c.color}>
              {c.desc}
            </text>
          </g>
        ))}

        {ALL_COMMITS.slice(0, s.remoteCount).map((c, i) => (
          <g key={`remote-${c.label}`}>
            <rect x={REMOTE_X + 10} y={CHIP_Y0 + i * CHIP_GAP} width={CHIP_W} height={CHIP_H} rx={5}
              fill={`${c.color}18`} stroke={`${c.color}66`} strokeWidth="1" />
            <text x={REMOTE_X + 18} y={CHIP_Y0 + i * CHIP_GAP + 14}
              fontSize="10" fill={c.color}>
              {c.desc}
            </text>
          </g>
        ))}

        <g style={fade(s.showPush)}>
          <line x1={230} y1={100} x2={312} y2={100} stroke="#fbbf24" strokeWidth="2" />
          <polygon points="308,96 316,100 308,104" fill="#fbbf24" />
          <text x={271} y={93} textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="bold">git push</text>
        </g>

        <g style={fade(s.showPull)}>
          <line x1={312} y1={100} x2={230} y2={100} stroke="#f9a8d4" strokeWidth="2" />
          <polygon points="234,96 226,100 234,104" fill="#f9a8d4" />
          <text x={271} y={93} textAnchor="middle" fontSize="9" fill="#f9a8d4" fontWeight="bold">git pull</text>
        </g>

        <g style={fade(!s.showPush && !s.showPull)}>
          <text x={271} y={104} textAnchor="middle" fontSize="9" fill="#374151">⟷</text>
        </g>
      </svg>

      <p className="text-sm text-white leading-snug">{s.title}</p>
      <Cmd command={s.command} />
      <Nav step={step} total={PP_STEPS.length}
        onBack={() => setStep(s => Math.max(0, s - 1))}
        onNext={() => setStep(s => Math.min(PP_STEPS.length - 1, s + 1))}
        onJump={setStep} />
    </div>
  )
}
