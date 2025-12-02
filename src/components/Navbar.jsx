import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BellIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import MobileMenu from './MobileMenu';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/habits', label: 'Habits' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/goals', label: 'Goals' },
  { to: '/community', label: 'Community' },
];

export default function Navbar({ onToggleTheme, theme }) {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const hasNotifications = true;
  const currentTheme = theme || 'light';
  const handleToggleTheme = () => {
    if (onToggleTheme) onToggleTheme();
  };

  return (
    <>
      <header className="fixed top-8 left-0 right-0 z-40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6">
          <div className="w-full flex h-[72px] items-center justify-between rounded-2xl bg-white/20 border border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.08)] px-6">
            <div className="flex shrink-0 items-center gap-2 text-lg font-bold bg-gradient-to-r from-[#7b8bff] via-[#9b5eff] to-[#7b9dff] bg-clip-text text-transparent">
              PeakX
            </div>

            <nav className="hidden items-center gap-5 text-sm font-semibold text-[#1A1A33] transition md:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-full px-3 py-2 transition ${
                      isActive || location.pathname.startsWith(item.to)
                        ? 'bg-gradient-to-r from-[#9b5eff] to-[#7b9dff] bg-clip-text text-transparent'
                        : 'text-[#1A1A33] hover:text-[#9b5eff]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/70 text-[#1A1A33] shadow-sm transition hover:border-[#9b5eff]"
              >
                <BellIcon className="h-5 w-5" />
                {hasNotifications && (
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#9b5eff] shadow-[0_0_10px_#6D5FFC] animate-pulse" />
                )}
              </button>

              <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-gradient-to-r from-[#9b5eff]/20 to-[#7b9dff]/20 text-sm font-semibold text-[#9b5eff] shadow-inner md:flex">
                {user ? 'M' : 'U'}
              </div>

              <button
                type="button"
                onClick={handleToggleTheme}
                className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/70 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#9b5eff] hover:text-[#9b5eff] md:flex"
              >
                {currentTheme === 'dark' ? '🌙' : '☀️'}
              </button>

              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/70 text-[#1A1A33] shadow-sm transition hover:border-[#9b5eff] hover:text-[#9b5eff] md:hidden"
                onClick={() => setMenuOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
