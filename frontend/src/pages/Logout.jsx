import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Activity } from 'lucide-react';

export default function Logout({ setAuth }) {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Purge all stored session credentials
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');

    // 2. Clear application auth state
    setAuth(false);

    // 3. Gracefully redirect back to login
    const timer = setTimeout(() => {
      navigate('/login', { replace: true });
    }, 800);

    return () => clearTimeout(timer);
  }, [setAuth, navigate]);

  return (
    <div className="min-h-screen bg-[#080c16] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-center relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="glass-panel p-8 sm:p-10 rounded-2xl shadow-2xl border border-white/[0.08] max-w-sm w-full flex flex-col items-center relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
          <LogOut className="h-8 w-8" />
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Terminating Session</h2>
        <p className="text-slate-400 text-xs mb-6 leading-relaxed">
          Ending your secure clinician session and clearing temporary memory logs...
        </p>

        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
          <Activity className="h-4 w-4 animate-spin" />
          <span>Securing Portal Access...</span>
        </div>
      </div>
    </div>
  );
}