import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  BookOpen, 
  ShieldAlert, 
  Award, 
  Database, 
  Cpu, 
  Layers, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function About() {
  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 font-sans text-slate-300">
      
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-900/60 via-indigo-950/60 to-slate-900/80 border border-white/[0.08] p-8 md:p-12 shadow-2xl mb-10 text-white backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 -mb-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute right-6 bottom-4 opacity-5 pointer-events-none hidden md:block">
          <Heart className="h-64 w-64 fill-white" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Cpu className="h-3.5 w-3.5" />
            <span>Cardiovascular Machine Intelligence</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            About CardioShield AI
          </h1>
          
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            An advanced machine learning portal designed to help clinicians evaluate patient probability of cardiovascular disease using standard physiological metrics.
          </p>
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 2 Columns: Main Info (Span 8) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* How It Works */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-xl">
            <h2 className="text-lg font-bold text-white flex items-center mb-4">
              <BookOpen className="h-5 w-5 text-cyan-400 mr-2.5" />
              Machine Learning Model Methodology
            </h2>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>
                CardioShield AI leverages a classification model trained on a curated cohort of approximately <strong className="text-white font-semibold">70,000 patient records</strong> containing demographic details, clinical measurements, and lifestyle behaviors.
              </p>
              <p>
                The model parses eleven unique physiological input variables and projects a prediction of binary occurrence (cardiovascular disease present vs. absent) alongside a clinical risk percentage.
              </p>
              
              {/* Specs Box */}
              <div className="bg-slate-950/70 rounded-xl p-5 border border-white/[0.08] font-mono text-xs text-cyan-300 shadow-inner">
                <p className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-3 flex items-center">
                  <Layers className="h-4 w-4 text-cyan-400 mr-2" />
                  Model Specifications & Pipeline:
                </p>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                    <span>Classifier: <strong className="text-cyan-300">Random Forest / Gradient Boost Ensemble</strong></span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                    <span>Validation Metric: <strong className="text-cyan-300">Area Under ROC (0.80+)</strong></span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                    <span>Core Framework: <strong className="text-cyan-300">Scikit-Learn & Joblib Pipeline</strong></span>
                  </li>
                </ul>

                <div className="mt-4 pt-3 border-t border-white/[0.08] flex justify-end">
                  <Link 
                    to="/evaluation"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
                  >
                    <span>View Benchmark Leaderboard & Derivations</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Guidance Reference */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-xl">
            <h2 className="text-lg font-bold text-white flex items-center mb-6">
              <Award className="h-5 w-5 text-cyan-400 mr-2.5" />
              Clinical Benchmarks Reference
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">
                  Blood Pressure Classification (AHA Guidelines)
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs text-left text-slate-300 border-collapse">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                        <th className="py-2.5 pr-4">Category</th>
                        <th className="py-2.5 pr-4">Systolic (mmHg)</th>
                        <th className="py-2.5 pr-4">Diastolic (mmHg)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      <tr className="hover:bg-white/[0.02] transition">
                        <td className="py-2.5 font-semibold text-emerald-400">Normal</td>
                        <td className="py-2.5">&lt; 120</td>
                        <td className="py-2.5">and &lt; 80</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02] transition">
                        <td className="py-2.5 font-semibold text-amber-300">Elevated (Pre-HTN)</td>
                        <td className="py-2.5">120 – 129</td>
                        <td className="py-2.5">and &lt; 80</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02] transition">
                        <td className="py-2.5 font-semibold text-amber-500">Hypertension Stage 1</td>
                        <td className="py-2.5">130 – 139</td>
                        <td className="py-2.5">or 80 – 89</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02] transition">
                        <td className="py-2.5 font-semibold text-rose-400">Hypertension Stage 2</td>
                        <td className="py-2.5">&ge; 140</td>
                        <td className="py-2.5">or &ge; 90</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-5 border-t border-white/[0.08]">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">
                  Body Mass Index (BMI) Categories
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-white/[0.08] text-center">
                    <div className="text-slate-400 font-medium text-[11px]">Underweight</div>
                    <div className="text-white font-bold mt-1 font-mono">&lt; 18.5</div>
                  </div>
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-emerald-500/20 text-center">
                    <div className="text-emerald-400 font-medium text-[11px]">Normal Range</div>
                    <div className="text-white font-bold mt-1 font-mono">18.5 – 24.9</div>
                  </div>
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-amber-500/20 text-center">
                    <div className="text-amber-400 font-medium text-[11px]">Overweight</div>
                    <div className="text-white font-bold mt-1 font-mono">25.0 – 29.9</div>
                  </div>
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-rose-500/20 text-center">
                    <div className="text-rose-400 font-medium text-[11px]">Obese</div>
                    <div className="text-white font-bold mt-1 font-mono">&ge; 30.0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Dataset & Disclaimer (Span 4) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Dataset variables */}
          <div className="glass-panel rounded-2xl p-6 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center mb-4">
              <Database className="h-4 w-4 text-cyan-400 mr-2" />
              Dataset Attributes
            </h2>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex justify-between border-b border-white/[0.06] pb-2">
                <span className="font-semibold text-white">Age</span>
                <span className="text-slate-400">Converted from days to years</span>
              </li>
              <li className="flex justify-between border-b border-white/[0.06] pb-2">
                <span className="font-semibold text-white">Gender</span>
                <span className="text-slate-400">Male (2) / Female (1)</span>
              </li>
              <li className="flex justify-between border-b border-white/[0.06] pb-2">
                <span className="font-semibold text-white">Height & Weight</span>
                <span className="text-slate-400">Metric (cm / kg)</span>
              </li>
              <li className="flex justify-between border-b border-white/[0.06] pb-2">
                <span className="font-semibold text-white">Blood Pressure</span>
                <span className="text-slate-400">Systolic (ap_hi) / Diastolic (ap_lo)</span>
              </li>
              <li className="flex justify-between border-b border-white/[0.06] pb-2">
                <span className="font-semibold text-white">Cholesterol</span>
                <span className="text-slate-400">1: Normal, 2: High, 3: Critical</span>
              </li>
              <li className="flex justify-between border-b border-white/[0.06] pb-2">
                <span className="font-semibold text-white">Glucose</span>
                <span className="text-slate-400">1: Normal, 2: High, 3: Critical</span>
              </li>
              <li className="flex justify-between pb-0.5">
                <span className="font-semibold text-white">Lifestyle Toggles</span>
                <span className="text-slate-400">Smoking, Alcohol, Activity (0 or 1)</span>
              </li>
            </ul>
          </div>

          {/* Legal Disclaimer */}
          <div className="rounded-2xl p-6 border border-rose-500/30 bg-rose-950/20 shadow-xl">
            <h2 className="text-base font-bold text-rose-300 flex items-center mb-3">
              <ShieldAlert className="h-5 w-5 text-rose-400 mr-2" />
              Clinical Disclaimer
            </h2>
            <p className="text-xs text-rose-200/80 leading-relaxed">
              This application is an educational prototype and research tool based on the Cardio Train dataset. It is not approved by the FDA or equivalent agencies for medical diagnostic use. 
            </p>
            <p className="text-xs text-rose-200/80 leading-relaxed mt-2">
              Predictions and findings generated by this tool are for informational purposes only. Do not base direct patient diagnoses or pharmaceutical adjustments on the tool's predictions without professional medical validation.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

