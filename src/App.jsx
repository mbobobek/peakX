import { BrowserRouter, Link } from 'react-router-dom';
import AppRouter from './app/router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useTheme } from './hooks/useTheme';

function Navbar({ onToggleTheme, theme }) {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-10 mb-6 border-b border-muted/40 bg-white/80 backdrop-blur dark:bg-dark-surface/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="text-lg font-bold text-primary">PeakX</div>
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <Link to="/dashboard" className="hover:text-primary">
            Dashboard
          </Link>
          <Link to="/habits" className="hover:text-primary">
            Habits
          </Link>
          {user ? (
            <button onClick={logout} className="text-slate-700 hover:text-primary dark:text-slate-200">
              Logout
            </button>
          ) : (
            <Link to="/auth/signin" className="hover:text-primary">
              Sign In
            </Link>
          )}
          <button
            type="button"
            onClick={onToggleTheme}
            className="rounded-full border border-muted/50 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-primary hover:text-primary dark:text-slate-100"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className={`${isDark ? 'theme-dark' : 'theme-light'} min-h-screen`}>
          <Navbar onToggleTheme={toggleTheme} theme={theme} />
          <main className="mx-auto max-w-6xl px-4 pb-10">
            <AppRouter />
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
