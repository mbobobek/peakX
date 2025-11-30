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

  return (
    <>
      <header className="sticky top-0 z-40">
        <div className="mx-auto mt-2 flex h-[70px] max-w-6xl items-center justify-between rounded-2xl border border-white/60 bg-gradient-to-r from-white/80 to-[#f6f4ff]/70 px-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-lg dark:border-slate-700/60 dark:from-dark-surface/80 dark:to-dark-bg/60">
          <div className="flex shrink-0 items-center gap-2 text-lg font-bold text-primary">PeakX</div>

          <nav className="hidden items-center gap-4 text-sm font-semibold text-[#1A1A33] transition-colors md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 transition-colors ${
                    isActive || location.pathname.startsWith(item.to)
                      ? 'text-[#6D5FFC]'
                      : 'text-[#1A1A33] hover:text-[#6D5FFC]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-muted/50 bg-white/70 text-[#1A1A33] shadow-sm transition hover:border-primary hover:text-primary dark:bg-dark-surface"
            >
              <BellIcon className="h-5 w-5" />
              {hasNotifications && (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_10px_#6D5FFC] animate-pulse" />
              )}
            </button>

            <div className="hidden items-center gap-2 rounded-full border border-muted/50 bg-white/70 px-3 py-2 shadow-sm dark:bg-dark-surface md:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {user?.email ? user.email.split('@')[0] : 'User'}
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleTheme}
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-muted/50 bg-white/70 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-primary hover:text-primary dark:bg-dark-surface md:flex"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-muted/50 bg-white/70 text-[#1A1A33] shadow-sm transition hover:border-primary hover:text-primary md:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
