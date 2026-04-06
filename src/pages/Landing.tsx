// LANDING PAGE — Kerolos
// TODO: design the hero, feature highlights, module preview

import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center space-y-6">
      <h1 className="text-4xl font-bold">GitReady</h1>
      <p className="text-gray-500">
        An interactive platform for learning Git and CS fundamentals.
        Hands-on lessons, terminal simulator, and AI-powered feedback.
      </p>
      <Link to="/modules" className="inline-block border rounded px-5 py-2 text-sm hover:bg-gray-50">
        Start Learning →
      </Link>

      {/* TODO: feature highlights, module list preview — Kerolos */}
    </div>
  )
}
