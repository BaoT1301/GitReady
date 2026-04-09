// LANDING PAGE — Kerolos
// TODO: design the hero, feature highlights, module preview

import { Link } from 'react-router-dom'
import ModulePage from './ModulePage'
import Modules from './Modules'

export default function Landing() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center space-y-6">
      <h1 className="text-4xl font-bold">GitReady</h1>
      <p className="text-gray-500">
        Learn Git the hands-on way with interactive lessons, terminal practice, quizzes, 
        and AI-powered guidance built for beginners.
      </p>


      <Link
          to="/modules"
          className="inline-block rounded-lg bg-black text-white px-8 py-4 text-sm font-medium shadow hover:bg-gray-800 transition">
          Start Learning 
        </Link>

        <h4>         
        </h4>

        <Link
          to="/progress"
          className="inline-block rounded-lg bg-black text-white px-8 py-4 text-sm font-medium shadow hover:bg-gray-800 transition">
          See Progress 
        </Link>

      <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="text-2xl font-bold">Why GitReady?</h2>
            <p className="text-gray-600 mt-3">
              Everything beginners need to start learning Git with confidence.
            </p>
          </div>
      <div className="grid gap-6 md:grid-cols-2">

          

          <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-2">Interactive Lessons</h3>
            <p className="text-sm text-gray-600">
              Learn Git step by step with beginner-friendly lessons and guided practice.
            </p>
          </div>

          <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-2">Terminal Simulator</h3>
            <p className="text-sm text-gray-600">
              Practice real Git commands in a safe environment without breaking anything.
            </p>
          </div>

          <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-2">AI Tutor</h3>
            <p className="text-sm text-gray-600">
              Get helpful feedback and simple explanations when you make mistakes.
            </p>
          </div>

          <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
            <p className="text-sm text-gray-600">
              Keep track of completed modules and stay motivated as you improve.
            </p>
          </div>
          

      </div>
    </div>
  )
}
