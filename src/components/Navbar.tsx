import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="border-b px-6 py-3 flex items-center justify-between">
      <NavLink to="/" className="font-bold text-lg">GitReady</NavLink>
      <div className="flex gap-4 text-sm">
        <NavLink to="/modules" className={({ isActive }) => isActive ? 'underline' : 'text-gray-500 hover:text-black'}>
          Modules
        </NavLink>
        <NavLink to="/progress" className={({ isActive }) => isActive ? 'underline' : 'text-gray-500 hover:text-black'}>
          Progress
        </NavLink>
      </div>
    </nav>
  )
}
