import { BrowserRouter } from 'react-router-dom';
import AppRouter from './app/router';
import { AuthProvider } from './context/AuthContext';
import { useTheme } from './hooks/useTheme';
import Navbar from './components/Navbar';

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
