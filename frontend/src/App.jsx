import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  LayoutDashboard, 
  Activity, 
  Info, 
  LogOut, 
  Lock, 
  ShieldCheck 
} from 'lucide-react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Predict from './pages/Predict';
import About from './pages/About';
import Evaluation from './pages/Evaluation';
import './App.css';

// Protected Route Wrapper Component
function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  // Always starts unauthenticated so every visit requires login
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Purge session on initial load so user must log in each time
    sessionStorage.clear();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');

    setIsAuthenticated(false);
    setCheckingAuth(false);
  }, []);

  // Direct logout handler: wipes auth and immediately routes to /login
  const handleLogout = (e) => {
    e.preventDefault();
    sessionStorage.clear();
    localStorage.clear();
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#080c16] flex flex-col justify-center items-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
          <Heart className="h-7 w-7 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="mt-4 text-xs font-mono text-cyan-400 tracking-wider uppercase animate-pulse">
          Initializing CardioShield AI...
        </p>
      </div>
    );
  }

  // Header & footer hidden only on login page
  const isAuthPage = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#080c14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Background Ambient Glow Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px]"></div>
        <div className="absolute -bottom-20 left-1/3 w-[500px] h-[500px] bg-sky-600/5 rounded-full blur-[150px]"></div>
      </div>

      {!isAuthPage && (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#080c14]/80 border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-white to-cyan-400 w-24 animate-pulse-scan"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Brand Logo */}
            <Link to={isAuthenticated ? "/dashboard" : "/login"} className="flex items-center space-x-3 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition duration-300">
                <Heart className="h-5 w-5 text-white fill-white animate-heart-pulse" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#080c16] shadow-sm"></div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-white text-lg tracking-tight group-hover:text-cyan-300 transition">
                    CardioShield
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-400/30 text-cyan-300 rounded uppercase tracking-wider">
                    AI
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide -mt-0.5 hidden sm:inline">
                  Clinical Diagnostic Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1.5 bg-slate-900/60 p-1.5 rounded-xl border border-white/[0.08] shadow-inner backdrop-blur-md">
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                  }`
                }
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink 
                to="/predict" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                  }`
                }
              >
                <Activity className="h-4 w-4" />
                <span>Predict Risk</span>
              </NavLink>

              <NavLink 
                to="/evaluation" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-rose-500/20 to-cyan-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.25)]' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                  }`
                }
              >
                <i className="fa-solid fa-microchip text-sm"></i>
                <span>Model Evaluation</span>
              </NavLink>

              <NavLink 
                to="/about" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                  }`
                }
              >
                <Info className="h-4 w-4" />
                <span>About Model</span>
              </NavLink>
            </nav>

            {/* Right Side Doctor Auth Status */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden lg:flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-slate-900/70 border border-white/[0.08]">
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                        RP
                      </div>
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 rounded-full border border-slate-900"></span>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-semibold text-white leading-tight">Dr. Rajesh Patel</span>
                      <span className="text-[10px] text-cyan-400/90 font-mono">Cardiology Dept.</span>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 border border-rose-500/30 rounded-lg text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 hover:border-rose-500/50 transition duration-150 cursor-pointer shadow-sm"
                    title="End Session"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-lg text-xs font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:opacity-95 transition cursor-pointer"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Clinician Sign In</span>
                </Link>
              )}
            </div>
          </div>
          
          {/* Mobile Bottom Dock Header */}
          <div className="md:hidden bg-slate-950/95 border-t border-white/[0.08] px-3 py-2 flex justify-around text-xs">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `flex flex-col items-center py-1 px-2.5 rounded-lg transition ${
                  isActive ? 'text-cyan-400 font-bold' : 'text-slate-400'
                }`
              }
            >
              <LayoutDashboard className="h-4 w-4 mb-0.5" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink 
              to="/predict" 
              className={({ isActive }) => 
                `flex flex-col items-center py-1 px-2.5 rounded-lg transition ${
                  isActive ? 'text-cyan-400 font-bold' : 'text-slate-400'
                }`
              }
            >
              <Activity className="h-4 w-4 mb-0.5" />
              <span>Predict</span>
            </NavLink>
            <NavLink 
              to="/evaluation" 
              className={({ isActive }) => 
                `flex flex-col items-center py-1 px-2.5 rounded-lg transition ${
                  isActive ? 'text-rose-400 font-bold' : 'text-slate-400'
                }`
              }
            >
              <i className="fa-solid fa-microchip text-sm mb-0.5"></i>
              <span>Evaluation</span>
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                `flex flex-col items-center py-1 px-2.5 rounded-lg transition ${
                  isActive ? 'text-cyan-400 font-bold' : 'text-slate-400'
                }`
              }
            >
              <Info className="h-4 w-4 mb-0.5" />
              <span>About</span>
            </NavLink>
          </div>
        </header>
      )}

      {/* Main Content Viewport */}
      <main className="flex-grow relative z-10">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login setAuth={setIsAuthenticated} />} 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/predict" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Predict />
              </ProtectedRoute>
            } 
          />
          <Route path="/evaluation" element={<Evaluation />} />
          <Route path="/model-evaluation" element={<Navigate to="/evaluation" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      {!isAuthPage && (
        <footer className="relative z-10 bg-[#070a12]/90 border-t border-white/[0.08] text-slate-400 text-xs py-8 mt-12 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <span className="font-semibold text-slate-200">CardioShield AI System Sandbox</span>
                <span className="hidden sm:inline text-slate-500 ml-2">| HIPAA-Compliant Local Session</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-[11px] text-slate-500">
              <span>&copy; {new Date().getFullYear()} Clinical Decision Support.</span>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>System Operational</span>
              </span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}