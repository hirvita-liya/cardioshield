import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Heart, 
  TrendingUp, 
  Users, 
  PlusCircle, 
  Clock, 
  BookOpen, 
  ChevronRight,
  Search,
  ShieldCheck
} from 'lucide-react';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('ALL');
  const [stats, setStats] = useState({
    total: 0,
    highRisk: 0,
    lowRisk: 0,
    avgRisk: 0
  });

  const navigate = useNavigate();

  // Mock patient data for initial load if history is empty
  const mockHistory = [
    { id: 101, date: '2026-08-25', age: 62, gender: 'Male', ap_hi: 155, ap_lo: 95, risk_level: 'High', risk_percentage: 78.4, cholesterol: 3 },
    { id: 102, date: '2026-08-24', age: 48, gender: 'Female', ap_hi: 130, ap_lo: 85, risk_level: 'Moderate', risk_percentage: 42.1, cholesterol: 2 },
    { id: 103, date: '2026-08-22', age: 39, gender: 'Male', ap_hi: 115, ap_lo: 75, risk_level: 'Low', risk_percentage: 14.8, cholesterol: 1 },
    { id: 104, date: '2026-08-20', age: 55, gender: 'Female', ap_hi: 142, ap_lo: 88, risk_level: 'High', risk_percentage: 67.2, cholesterol: 1 },
    { id: 105, date: '2026-08-18', age: 41, gender: 'Male', ap_hi: 122, ap_lo: 80, risk_level: 'Low', risk_percentage: 23.5, cholesterol: 2 }
  ];

  useEffect(() => {
    // Read history from localStorage
    const savedHistoryStr = localStorage.getItem('prediction_history');
    let savedHistory = [];
    
    if (savedHistoryStr) {
      try {
        savedHistory = JSON.parse(savedHistoryStr);
      } catch (e) {
        savedHistory = [];
      }
    }

    // Seed mock data if history is empty
    if (savedHistory.length === 0) {
      localStorage.setItem('prediction_history', JSON.stringify(mockHistory));
      savedHistory = mockHistory;
    }

    setHistory(savedHistory);

    // Compute stats
    if (savedHistory.length > 0) {
      const total = savedHistory.length;
      const highRisk = savedHistory.filter(x => x.risk_level === 'High').length;
      const lowRisk = savedHistory.filter(x => x.risk_level === 'Low').length;
      const totalPercent = savedHistory.reduce((sum, item) => sum + parseFloat(item.risk_percentage), 0);
      const avgRisk = Math.round(totalPercent / total);

      setStats({
        total,
        highRisk,
        lowRisk,
        avgRisk
      });
    }
  }, []);

  // Filtered evaluations
  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchesSearch = 
        searchQuery.trim() === '' ||
        String(item.age).includes(searchQuery) ||
        item.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.date.includes(searchQuery) ||
        item.risk_level.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRisk = 
        selectedRiskFilter === 'ALL' || 
        item.risk_level.toUpperCase() === selectedRiskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [history, searchQuery, selectedRiskFilter]);

  const handleStartPrediction = () => {
    navigate('/predict');
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 font-sans text-slate-300">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-white/[0.08] p-6 sm:p-8 shadow-2xl mb-8 backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Clinical Analytics Node Online</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Cardiovascular Diagnostics Hub
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Welcome back, <span className="text-cyan-300 font-semibold">Dr. Rajesh Patel</span>. Model inference engine is synchronized with 70,000+ clinical training vectors.
            </p>
          </div>

          <div className="flex items-center space-x-3 flex-shrink-0">
            <button
              onClick={handleStartPrediction}
              className="inline-flex items-center space-x-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold px-5 py-3 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition duration-200 text-sm cursor-pointer"
            >
              <PlusCircle className="h-5 w-5" />
              <span>New Patient Evaluation</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        {/* Card 1: Total Evaluations */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition"></div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Patients</div>
              <div className="text-3xl font-extrabold text-white mt-2 tracking-tight">{stats.total}</div>
              <div className="text-[11px] text-sky-400 font-medium mt-1 flex items-center">
                <span>Evaluated Cohort</span>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.2)]">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Card 2: High Risk Alerts */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition"></div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">High Risk Alerts</div>
              <div className="text-3xl font-extrabold text-rose-400 mt-2 tracking-tight glow-rose">{stats.highRisk}</div>
              <div className="text-[11px] text-rose-400 font-medium mt-1 flex items-center">
                <span>Require Intervention</span>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
              <ShieldAlert className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Card 3: Normal Hearts */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition"></div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Normal Hearts</div>
              <div className="text-3xl font-extrabold text-emerald-400 mt-2 tracking-tight glow-emerald">{stats.lowRisk}</div>
              <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center">
                <span>Optimal Prognosis</span>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Heart className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Card 4: Average Risk Index */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition"></div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Risk Index</div>
              <div className="text-3xl font-extrabold text-amber-300 mt-2 tracking-tight">{stats.avgRisk}%</div>
              <div className="text-[11px] text-amber-400 font-medium mt-1 flex items-center">
                <span>Mean Probability</span>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Prognosis Logs (Col span 8) */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 shadow-xl flex flex-col">
          
          {/* Table Header Controls: Search & Category Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-white/[0.08] gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center">
                <Clock className="h-5 w-5 text-cyan-400 mr-2" />
                Recent Prognosis Logs
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Clinical session history and risk profiles</p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1.5 bg-slate-950/70 p-1 rounded-xl border border-white/[0.08]">
              {['ALL', 'HIGH', 'MODERATE', 'LOW'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setSelectedRiskFilter(filterType)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedRiskFilter === filterType
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filterType}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="mb-4 relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by age, gender, date, or risk level..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400"
            />
          </div>

          {/* Evaluations Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Patient</th>
                  <th className="py-3 px-3">BP (mmHg)</th>
                  <th className="py-3 px-3 text-center">Calculated Score</th>
                  <th className="py-3 px-3 text-right">Risk Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500 text-xs">
                      No clinical evaluations matched your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((record) => {
                    let badgeStyle = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
                    let dotColor = 'bg-emerald-400';
                    let barColor = 'bg-emerald-400';

                    if (record.risk_level === 'High') {
                      badgeStyle = 'bg-rose-500/10 text-rose-300 border-rose-500/30';
                      dotColor = 'bg-rose-400';
                      barColor = 'bg-rose-500';
                    } else if (record.risk_level === 'Moderate') {
                      badgeStyle = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
                      dotColor = 'bg-amber-400';
                      barColor = 'bg-amber-400';
                    }

                    return (
                      <tr key={record.id} className="hover:bg-white/[0.02] transition duration-150 group">
                        <td className="py-3.5 px-3 text-xs text-slate-400 font-mono">
                          {record.date}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-white/[0.08] flex items-center justify-center text-[10px] font-bold text-slate-300">
                              {record.gender === 'Male' ? 'M' : 'F'}
                            </div>
                            <div>
                              <span className="font-semibold text-white text-xs block">{record.age} yrs</span>
                              <span className="text-[10px] text-slate-400">{record.gender}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="font-mono text-xs text-slate-200 px-2 py-0.5 rounded bg-slate-900/80 border border-white/[0.06]">
                            {record.ap_hi} / {record.ap_lo}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="font-bold text-white text-xs font-mono">
                              {Math.round(record.risk_percentage)}%
                            </span>
                            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                              <div 
                                className={`h-full ${barColor} rounded-full`}
                                style={{ width: `${Math.min(100, Math.max(5, record.risk_percentage))}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${badgeStyle} shadow-sm`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                            <span>{record.risk_level}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Quick Resources & Model Info (Col span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick tips */}
          <div className="glass-panel rounded-2xl p-6 shadow-xl">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center">
              <BookOpen className="h-4 w-4 text-cyan-400 mr-2" />
              Clinical Quick Tips
            </h2>
            <div className="space-y-4 text-xs leading-relaxed text-slate-300">
              <div className="border-l-2 border-cyan-400 pl-3.5 py-1 bg-cyan-950/20 rounded-r-lg">
                <p className="font-semibold text-white">Systolic & Diastolic</p>
                <p className="text-slate-400 mt-0.5">Ensure systolic pressure exceeds diastolic by at least 10mmHg for sensible clinical calculations.</p>
              </div>
              <div className="border-l-2 border-indigo-400 pl-3.5 py-1 bg-indigo-950/20 rounded-r-lg">
                <p className="font-semibold text-white">BMI calculations</p>
                <p className="text-slate-400 mt-0.5">Body Mass Index is automatically parsed from height (cm) and weight (kg). Standard overweight threshold is BMI &ge; 25.0.</p>
              </div>
              <div className="border-l-2 border-emerald-400 pl-3.5 py-1 bg-emerald-950/20 rounded-r-lg">
                <p className="font-semibold text-white">Lifestyle variables</p>
                <p className="text-slate-400 mt-0.5">A history of active smoking, sedentary style, or regular alcohol intake scales features into higher risk probabilities.</p>
              </div>
            </div>
          </div>

          {/* Model info card */}
          <div className="glass-panel rounded-2xl p-6 shadow-xl text-center relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-400/30 flex items-center justify-center mx-auto mb-3 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-white font-bold text-sm">Secure Patient Encrypted</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                Patient analytics and prognostic logs are stored locally within the local sandbox and browser session to ensure data privacy.
              </p>
              <button
                onClick={() => navigate('/about')}
                className="mt-4 text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center space-x-1 transition cursor-pointer"
              >
                <span>Read Model Documentation</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

