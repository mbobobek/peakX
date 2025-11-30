import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, applyActionCode, confirmPasswordReset } from '../../lib/firebaseClient';

export default function Confirm() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('');
  const [oobCode, setOobCode] = useState('');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Yuklanmoqda...');
  const [newPassword, setNewPassword] = useState('');

  const query = useMemo(() => new URLSearchParams(window.location.search), []);

  useEffect(() => {
    setMode(query.get('mode') || '');
    setOobCode(query.get('oobCode') || '');
  }, [query]);

  useEffect(() => {
    const handleVerifyEmail = async () => {
      try {
        await applyActionCode(auth, oobCode);
        setStatus('success');
        setMessage('Email tasdiqlandi. Endi tizimga kira olasiz.');
        setTimeout(() => navigate('/auth/signin', { replace: true }), 800);
      } catch (err) {
        setStatus('error');
        setMessage(err.message);
      }
    };

    const handleVerifyAndChangeEmail = async () => {
      try {
        await applyActionCode(auth, oobCode);
        setStatus('success');
        setMessage('Email tasdiqlandi. Yangi email bilan kiring.');
        setTimeout(() => navigate('/auth/signin', { replace: true }), 800);
      } catch (err) {
        setStatus('error');
        setMessage(err.message);
      }
    };

    if (mode === 'verifyEmail' && oobCode) {
      handleVerifyEmail();
    } else if (mode === 'verifyAndChangeEmail' && oobCode) {
      handleVerifyAndChangeEmail();
    } else if (mode === 'resetPassword' && oobCode) {
      setStatus('idle');
      setMessage('Yangi parolni kiriting.');
    } else {
      setStatus('error');
      setMessage('Noto‘g‘ri yoki eskirgan havola.');
    }
  }, [mode, oobCode, navigate]);

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('Parolni yangilash...');
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setStatus('success');
      setMessage('Parol yangilandi. Endi tizimga kiring.');
      setTimeout(() => navigate('/auth/signin', { replace: true }), 800);
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  const statusColors =
    status === 'success'
      ? 'border-green-100 bg-green-50 text-green-700'
      : status === 'error'
      ? 'border-red-100 bg-red-50 text-red-600'
      : 'border-slate-200 bg-white text-slate-700';

  const renderResetForm = mode === 'resetPassword' && oobCode && status !== 'error';

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl space-y-4">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">PeakX</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Tasdiqlash</h1>
        </div>
        <div className={`rounded-xl border px-4 py-4 text-sm font-medium ${statusColors}`}>
          {message}
        </div>
        {renderResetForm && (
          <form className="space-y-3" onSubmit={handleResetSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="newPassword">
                Yangi parol
              </label>
              <input
                id="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="********"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Parolni yangilash
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
