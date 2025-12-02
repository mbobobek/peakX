// App.jsx
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './app/router';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Global background migrated OUT of Navbar */}
        <div className="min-h-screen bg-gradient-to-b from-[#eef1ff] via-[#f3f5ff] to-[#f8f9ff]">
          <Navbar />
          <div className="pt-[92px] md:pt-[96px]">
            {/* Navbar offset to keep content fully clear */}
            <AppRouter />
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
