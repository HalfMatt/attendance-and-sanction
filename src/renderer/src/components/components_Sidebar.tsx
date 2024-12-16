import React, { useState, FC } from 'react'
import { NavLink } from 'react-router'
import { Home, FileText, Gavel, ChevronLeft, ChevronRight, SquareLibrary } from 'lucide-react'

const Sidebar: FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems: Array<{ name: string; icon: React.ElementType; path: string }> = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Record', icon: SquareLibrary, path: '/records' },
    { name: 'Excusal', icon: FileText, path: '/excusal' },
    { name: 'Sanctions', icon: Gavel, path: '/sanctions' }
  ]

  return (
    <div
      className={`h-screen bg-blue-800 text-white transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <button
        className="w-full p-4 text-white hover:bg-blue-900 transition-colors duration-200"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
      </button>
      <nav className="mt-8">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center p-2 cursor-pointer transition-colors duration-200 m-2
                  ${isActive ? 'bg-blue-950 text-white rounded-xl' : 'hover:bg-blue-700 rounded-md '}
                `}
              >
                <item.icon className={`w-6 h-6 ${isCollapsed ? 'mx-auto' : 'mr-4'}`} />
                {!isCollapsed && <span className="text-lg">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
