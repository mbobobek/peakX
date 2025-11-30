import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/habits', label: 'Habits' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/goals', label: 'Goals' },
  { to: '/community', label: 'Community' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/profile', label: 'Profile' },
  { to: '/auth/signin', label: 'Logout' },
];

export default function MobileMenu({ open, onClose }) {
  const location = useLocation();

  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            className="absolute right-0 top-0 h-full w-4/5 max-w-sm rounded-l-2xl bg-white/90 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-semibold text-primary">PeakX</span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-muted/50 px-3 py-1 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary"
              >
                Close
              </button>
            </div>
            <nav className="flex flex-col gap-3">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `w-full rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                      isActive ? 'bg-primary/10 text-primary' : 'bg-surface text-slate-900'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
