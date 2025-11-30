import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  auth
} from '../../lib/firebaseClient';
import { useAuth } from '../../context/AuthContext';

export default function Confirm() {
  const navigate = useNavigate();
  const { handleActionCode } = useAuth();

  const [mode, setMode] = useState('');
  const [oobCode, setOobCode] = useState('');
  const [message, setMessage] = useState('Yuklanmoqda...');
  const [status, setStatus] = useState('loading');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const url = window.location.href;
    const params = new URLSearchParams(window.location.search);

    const m = params.get('mode');
    const code = params.get('oobCode');

    setMode(m || '');
    setOobCode(code || '');

    // 🔵 EMAIL LINK SIGN-IN (MAGIC LINK)
    if (!m && isSignInWithEmailLink(auth, url)) {
      const storedEmail = window.localStorage.getItem('authEmailForSignIn');
      const email = storedEmail || window.prompt('Emailingizni kiriting:');

      if (!email) {
        setStatus('error');
        setMessage('Email kiritilmagan.');
        return;
      }

      signInWithEmailLink(auth, email, url)
        .then(() => {
          window.localStorage.removeItem('authEmailForSignIn');
          setStatus('success');
          setMessage('Kirish yakunlandi. Dashboardga yo‘naltirilmoqda...');
          setTimeout(() => navigate('/dashboard', { replace: true }), 900);
        })
        .catch((err) => {
          setStatus('error');
          setMessage(err.message);
        });

      return;
    }

    // 🔵 VERIFY EMAIL yoki RESET PASSWORD uchun ACTION CODE BOSHLASH
    if (m === 'verifyEmail' && code) {
      handleActionCode('verifyEmail', code)
        .then(() => {
          setStatus('success');
          setMessage('Email muvaffaqiyatli tasdiqlandi. Kirish sahifasiga yo‘naltirilmoqda...');
          setTimeout(() => navigate('/auth/signin', { replace: true }), 900);
        })
        .catch((err) => {
          setStatus('error');
          setMessage(err.message);
        });
      return;
    }

    if (m === 'resetPassword' && code) {
      setStatus('idle'); // yangi parol formasi ko‘rinadi
      setMessage('Yangi parolni kiriting.');
      return;
    }

    // ❌ Agar hech biri mos kelmasa
    setStatus('error');
    setMessage('Noto‘g‘ri yoki eskirgan havola.');
  }, [navigate, handleActionCode]);

  // 🔵 RESET PASSWORD YAKUNLASH
  const handleResetPassword = (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('Parol yangilanmoqda...');

    handleActionCode('resetPassword', oobCode, newPassword)
      .then(() => {
        setStatus('success');
        setMessage('Parol muvaffaqiyatli yangilandi. Kirish sahifasiga yo‘naltirilmoqda...');
        setTimeout(() => navigate('/auth/signin', { replace: true }), 900);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message);
      });
  };

  const boxColor =
    status === 'success'
      ? 'border-green-200 bg-green-50 text-green-700'
      : status === 'error'
      ? 'border-red-200 bg-red-50 text-red-600'
      : 'border-slate-200 bg-white text-slate-700';

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl space-y-4">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">PeakX</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Tasdiqlash</h1>
        </div>

        <div className={`rounded-xl border px-4 py-4 text-sm ${boxColor}`}>
          {message}
        </div>

        {/* 🔵 RESET PASSWORD FORM */}
        {status === 'idle' && mode === 'resetPassword' && (
          <form className="space-y-3" onSubmit={handleResetPassword}>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="newPassword">
                Yangi parol
              </label>
              <input
                id="newPassword"
                type="password"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-500 px-4 py-3 text-white font-semibold shadow-md hover:bg-blue-600"
            >
              Parolni yangilash
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
