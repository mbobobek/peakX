import { BrowserRouter, Link } from 'react-router-dom';
import AppRouter from './app/router';
import { AuthProvider, useAuth } from './context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-10 mb-6 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="text-lg font-bold text-blue-600">PeakX</div>
        <div className="flex items-center gap-4 text-sm font-semibold text-slate-700">
          <Link to="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <Link to="/habits" className="hover:text-blue-600">
            Habits
          </Link>
          {user ? (
            <button onClick={logout} className="text-slate-700 hover:text-blue-600">
              Logout
            </button>
          ) : (
            <Link to="/auth/signin" className="hover:text-blue-600">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900">
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 pb-10">
            <AppRouter />
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
