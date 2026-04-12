import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

const TIER_COLORS: Record<string, string> = {
  free:    'text-gray-400 bg-gray-400/10',
  starter: 'text-blue-400 bg-blue-400/10',
  pro:     'text-purple-400 bg-purple-400/10',
  studio:  'text-[#D4A017] bg-[#D4A017]/10',
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white font-['Outfit']">
      {/* Sidebar */}
      <aside className="w-60 bg-[#111111] border-r border-[#2A2A2A] flex flex-col">
        <div className="p-5 border-b border-[#2A2A2A]">
          <h1 className="text-lg font-black tracking-tight">NANO<span className="text-[#D4A017]">STUDIO</span></h1>
          <p className="text-xs text-gray-600 mt-0.5">AI Website Builder</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                isActive
                  ? 'bg-[#D4A017]/10 text-[#D4A017] font-semibold border border-[#D4A017]/20'
                  : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
              }`
            }
          >
            <span>📊</span> Overview
          </NavLink>

          <NavLink
            to="/dashboard/cockpit"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                isActive
                  ? 'bg-[#D4A017]/10 text-[#D4A017] font-semibold border border-[#D4A017]/20'
                  : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
              }`
            }
          >
            <span>⚡</span> Cockpit
          </NavLink>
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-[#2A2A2A] space-y-3">
          {user && (
            <div className="space-y-1">
              <p className="text-xs text-white truncate">{user.email}</p>
              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${TIER_COLORS[user.tier] ?? TIER_COLORS.free}`}>
                {user.tier}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-left text-xs text-gray-500 hover:text-red-400 transition"
          >
            Sign out
          </button>
          <a href="mailto:support@captivate.icu" className="block text-xs text-[#D4A017]/60 hover:text-[#D4A017] transition">
            support@captivate.icu
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
