import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

export default function Confirm() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Hisobni tasdiqlash...');

  useEffect(() => {
    const url = window.location.href;

    const finishAuth = async () => {
      try {
        await supabase.auth.exchangeCodeForSession(url);
        setStatus('success');
        setMessage('Tasdiqlandi! Dashboardga yo‘naltirilmoqda...');
        setTimeout(() => navigate('/dashboard', { replace: true }), 800);
      } catch (err) {
        setStatus('error');
        setMessage(err.message);
      }
    };

    finishAuth();
  }, [navigate]);

  const statusColors =
    status === 'success'
      ? 'border-green-100 bg-green-50 text-green-700'
      : status === 'error'
      ? 'border-red-100 bg-red-50 text-red-600'
      : 'border-slate-200 bg-white text-slate-700';

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">PeakX</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Tasdiqlash</h1>
        </div>
        <div className={`rounded-xl border px-4 py-4 text-sm font-medium ${statusColors}`}>
          {message}
        </div>
      </div>
    </div>
  );
}
