import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Activity, 
  Lock, 
  User, 
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function Login({ setAuth }) {
  const [email, setEmail] = useState('doctor@cardio.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network latency
    setTimeout(() => {
      if (email.trim() === '' || password.trim() === '') {
        setError('Please fill in all clinical credentials.');
        setIsLoading(false);
        return;
      }
      
      // Simple mock credentials check
      if (email === 'doctor@cardio.com' && password === 'password123') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', 'Dr. Rajesh Patel');
        setAuth(true);
        navigate('/');
      } else {
        setError('Invalid clinical credentials. Try doctor@cardio.com / password123');
        setIsLoading(false);
      }
    }, 800);
  };

  const autofillCredentials = () => {
    setEmail('doctor@cardio.com');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#080c16] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      {/* Background Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-[0_0_30px_rgba(6,182,212,0.5)] mb-4">
          <Heart className="h-8 w-8 text-white fill-white animate-heart-pulse" />
        </div>
        
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          CardioShield AI
        </h2>
        <p className="mt-1 text-sm text-cyan-400/90 font-medium">
          Clinician Diagnostic Portal Access
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-2xl shadow-2xl border border-white/[0.08]">
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-3.5 flex items-start space-x-3 text-rose-200 text-xs shadow-md">
                <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Clinical Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input rounded-xl pl-10 pr-3.5 py-2.5 text-white text-sm focus:border-cyan-400"
                  placeholder="doctor@cardio.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input rounded-xl pl-10 pr-10 py-2.5 text-white text-sm focus:border-cyan-400 font-mono"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-900 border-white/[0.1]"
                />
                <span>Remember this device</span>
              </label>
              <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer">
                Forgot password?
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <Activity className="animate-spin h-4 w-4 text-white" />
                    <span>Authenticating Portal...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Secure Clinician Sign In</span>
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Quick Access Credential Helper */}
          <div className="mt-6 border-t border-white/[0.08] pt-5">
            <div className="rounded-xl bg-slate-950/70 p-3.5 border border-white/[0.06] text-xs text-slate-400 leading-relaxed flex items-center justify-between">
              <div>
                <strong className="text-white block text-[11px] uppercase tracking-wider mb-0.5">Quick Demo Access:</strong>
                <span><code className="text-cyan-300 font-mono">doctor@cardio.com</code> / <code className="text-cyan-300 font-mono">password123</code></span>
              </div>
              <button
                type="button"
                onClick={autofillCredentials}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold transition cursor-pointer flex items-center space-x-1"
              >
                <Sparkles className="h-3 w-3" />
                <span>Fill</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

