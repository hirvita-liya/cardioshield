import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Heart, 
  Shield, 
  RefreshCw, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  User,
  Gauge,
  Sparkles,
  Printer,
  Cigarette,
  GlassWater,
  Flame
} from 'lucide-react';

export default function Predict() {
  // Form input state
  const [formData, setFormData] = useState({
    age: '45',
    gender: '2', // Default Male (matches standard default)
    height: '170',
    weight: '75',
    ap_hi: '120',
    ap_lo: '80',
    cholesterol: '1',
    gluc: '1',
    smoke: false,
    alco: false,
    active: true
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  // Handle inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Preset loaders for effortless clinician testing
  const loadPreset = (type) => {
    if (type === 'healthy') {
      setFormData({
        age: '32',
        gender: '1',
        height: '165',
        weight: '60',
        ap_hi: '115',
        ap_lo: '75',
        cholesterol: '1',
        gluc: '1',
        smoke: false,
        alco: false,
        active: true
      });
    } else if (type === 'high_risk') {
      setFormData({
        age: '62',
        gender: '2',
        height: '172',
        weight: '92',
        ap_hi: '158',
        ap_lo: '98',
        cholesterol: '3',
        gluc: '3',
        smoke: true,
        alco: false,
        active: false
      });
    } else if (type === 'borderline') {
      setFormData({
        age: '49',
        gender: '2',
        height: '170',
        weight: '79',
        ap_hi: '134',
        ap_lo: '86',
        cholesterol: '2',
        gluc: '1',
        smoke: false,
        alco: true,
        active: false
      });
    }
  };

  // Live real-time calculations for instant clinician feedback
  const liveHeightM = parseFloat(formData.height) / 100;
  const liveWeightKg = parseFloat(formData.weight);
  const liveBmi = (liveHeightM > 0 && liveWeightKg > 0) 
    ? (liveWeightKg / (liveHeightM * liveHeightM)).toFixed(1) 
    : null;

  const liveSys = parseInt(formData.ap_hi);
  const liveDia = parseInt(formData.ap_lo);

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    // Front-end validations
    const ageNum = parseFloat(formData.age);
    const genderNum = parseInt(formData.gender);
    const heightNum = parseFloat(formData.height);
    const weightNum = parseFloat(formData.weight);
    const ap_hiNum = parseInt(formData.ap_hi);
    const ap_loNum = parseInt(formData.ap_lo);
    const cholesterolNum = parseInt(formData.cholesterol);
    const glucNum = parseInt(formData.gluc);
    
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      showError("Please enter a valid age between 1 and 120.");
      return;
    }
    if (isNaN(genderNum)) {
      showError("Please select the patient's gender.");
      return;
    }
    if (isNaN(heightNum) || heightNum < 100 || heightNum > 220) {
      showError("Please enter height between 100 and 220 cm.");
      return;
    }
    if (isNaN(weightNum) || weightNum < 30 || weightNum > 200) {
      showError("Please enter weight between 30 and 200 kg.");
      return;
    }
    if (isNaN(ap_hiNum) || ap_hiNum < 80 || ap_hiNum > 220) {
      showError("Systolic Blood Pressure must be between 80 and 220 mmHg.");
      return;
    }
    if (isNaN(ap_loNum) || ap_loNum < 40 || ap_loNum > 140) {
      showError("Diastolic Blood Pressure must be between 40 and 140 mmHg.");
      return;
    }
    if (ap_hiNum <= ap_loNum) {
      showError("Systolic (top) blood pressure must be higher than Diastolic (bottom) blood pressure.");
      return;
    }
    if (isNaN(cholesterolNum)) {
      showError("Please select a cholesterol level.");
      return;
    }
    if (isNaN(glucNum)) {
      showError("Please select a glucose level.");
      return;
    }

    const payload = {
      age: ageNum,
      gender: genderNum,
      height: heightNum,
      weight: weightNum,
      ap_hi: ap_hiNum,
      ap_lo: ap_loNum,
      cholesterol: cholesterolNum,
      gluc: glucNum,
      smoke: formData.smoke ? 1 : 0,
      alco: formData.alco ? 1 : 0,
      active: formData.active ? 1 : 0
    };

    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.error || "An error occurred during prediction computation.");
        return;
      }

      setResult(data);
      
      // Save to local storage history
      saveToHistory(data, payload);

    } catch (err) {
      console.error(err);
      showError("Failed to connect to the backend server. Make sure your Flask API is running.");
    } finally {
      setLoading(false);
    }
  };

  const showError = (msg) => {
    setError(msg);
    setLoading(false);
  };

  // Save to history helper
  const saveToHistory = (predResult, inputs) => {
    const newRecord = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      age: inputs.age,
      gender: inputs.gender === 2 ? 'Male' : 'Female',
      ap_hi: inputs.ap_hi,
      ap_lo: inputs.ap_lo,
      risk_level: predResult.risk_level,
      risk_percentage: predResult.risk_percentage,
      cholesterol: inputs.cholesterol
    };

    const existingStr = localStorage.getItem('prediction_history');
    let history = [];
    if (existingStr) {
      try {
        history = JSON.parse(existingStr);
      } catch (e) {
        history = [];
      }
    }
    history.unshift(newRecord);
    // Limit to 20 records
    if (history.length > 20) {
      history = history.slice(0, 20);
    }
    localStorage.setItem('prediction_history', JSON.stringify(history));
  };

  // Animate the risk percentage counter
  useEffect(() => {
    if (result) {
      setAnimatedPercentage(0);
      const target = Math.round(result.risk_percentage);
      if (target === 0) return;
      
      let current = 0;
      const duration = 800; // ms
      const interval = Math.max(10, Math.floor(duration / target));
      
      const timer = setInterval(() => {
        current += 1;
        if (current >= target) {
          setAnimatedPercentage(target);
          clearInterval(timer);
        } else {
          setAnimatedPercentage(current);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [result]);

  // Color config based on risk level
  const getRiskColor = (level) => {
    if (level === 'High') return { 
      text: 'text-rose-400', 
      border: 'border-rose-500/40', 
      stroke: '#f43f5e', 
      bg: 'bg-rose-500/10',
      glow: 'shadow-[0_0_30px_rgba(244,63,94,0.3)]',
      gradient: 'from-rose-500/20 to-orange-500/10'
    };
    if (level === 'Moderate') return { 
      text: 'text-amber-300', 
      border: 'border-amber-500/40', 
      stroke: '#f59e0b', 
      bg: 'bg-amber-500/10',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]',
      gradient: 'from-amber-500/20 to-yellow-500/10'
    };
    return { 
      text: 'text-emerald-400', 
      border: 'border-emerald-500/40', 
      stroke: '#10b981', 
      bg: 'bg-emerald-500/10',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]',
      gradient: 'from-emerald-500/20 to-cyan-500/10'
    };
  };

  const riskColors = result ? getRiskColor(result.risk_level) : null;

  // Circular gauge config
  const radius = 42;
  const circumference = 2 * Math.PI * radius; // 263.89
  const strokeDashoffset = result 
    ? circumference - (result.risk_percentage / 100) * circumference
    : circumference;

  // Generate recommendations lists based on clinical rules
  const getClinicalFindings = () => {
    if (!result) return [];
    const findings = [];
    const sys = parseInt(formData.ap_hi);
    const dia = parseInt(formData.ap_lo);
    const bmi = parseFloat(result.bmi);
    const chol = parseInt(formData.cholesterol);
    const gluc = parseInt(formData.gluc);

    // 1. Overall Risk findings
    if (result.risk_level === "High") {
      findings.push({
        type: "danger",
        text: "Elevated Cardiovascular Risk Detected: Our predictive model computes a high probability of cardiovascular complications. Consultation with a cardiologist is strongly advised."
      });
    } else if (result.risk_level === "Moderate") {
      findings.push({
        type: "warning",
        text: "Moderate Cardiovascular Risk: Patient shows warning signs. Focused adjustments to habits and vitals can prevent complications."
      });
    } else {
      findings.push({
        type: "info",
        text: "Low Cardiovascular Risk: Current diagnostics indicate strong cardiovascular health. Maintain current habits."
      });
    }

    // 2. Blood Pressure findings
    if (sys >= 140 || dia >= 90) {
      findings.push({
        type: "danger",
        text: `Hypertension (Stage 2): BP of ${sys}/${dia} mmHg is high. Recommend dietary changes (sodium reduction) and clinical management.`
      });
    } else if (sys >= 130 || dia >= 80) {
      findings.push({
        type: "warning",
        text: `Hypertension (Stage 1): BP of ${sys}/${dia} mmHg is elevated. Monitor blood pressure weekly and optimize cardio exercise.`
      });
    } else if (sys >= 120) {
      findings.push({
        type: "info",
        text: `Pre-hypertension: Systolic BP of ${sys} mmHg is slightly elevated. Maintain physical activity.`
      });
    }

    // 3. BMI findings
    if (bmi >= 30.0) {
      findings.push({
        type: "danger",
        text: `Obesity Detected (BMI: ${bmi}): Excess weight increases heart workload. Advise nutritional counseling and a guided calorie-deficit program.`
      });
    } else if (bmi >= 25.0) {
      findings.push({
        type: "warning",
        text: `Overweight (BMI: ${bmi}): Mild weight management is recommended to reduce long-term stress on arteries.`
      });
    }

    // 4. Lab findings
    if (chol === 3) {
      findings.push({
        type: "danger",
        text: "Severe Hypercholesterolemia: High cholesterol levels directly contribute to arterial plaque. Fasting lipid panel advised."
      });
    } else if (chol === 2) {
      findings.push({
        type: "warning",
        text: "Elevated Cholesterol: Recommend replacement of saturated fats with healthy polyunsaturated fats (omega-3)."
      });
    }

    if (gluc === 3) {
      findings.push({
        type: "danger",
        text: "Severe Hyperglycemia: Very high glucose levels indicate prediabetes or diabetes. A1C test recommended."
      });
    } else if (gluc === 2) {
      findings.push({
        type: "warning",
        text: "Elevated Glucose: Recommend monitoring sugar intake and tracking carbohydrate consumption."
      });
    }

    // 5. Lifestyle findings
    if (formData.smoke) {
      findings.push({
        type: "danger",
        text: "Active Smoker: Tobacco chemicals damage blood vessels and double heart disease risk. Cessation programs are highly recommended."
      });
    }
    if (!formData.active) {
      findings.push({
        type: "warning",
        text: "Sedentary Lifestyle: Lack of exercise is a critical cardiovascular risk factor. Target 150 minutes of moderate activity weekly."
      });
    }
    if (formData.alco) {
      findings.push({
        type: "info",
        text: "Alcohol Intake: Advise moderation in alcohol consumption (under 1-2 drinks/day) to prevent blood pressure spikes."
      });
    }

    return findings;
  };

  const findings = getClinicalFindings();

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 font-sans text-slate-300">
      
      {/* Title & Preset Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-8 border-b border-white/[0.08] gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Activity className="h-3.5 w-3.5 animate-pulse" />
            <span>AI Risk Scoring Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cardiovascular Risk Prognosis
          </h1>
          <p className="text-slate-400 mt-1 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Enter the patient's demographics, vitals, and lifestyle parameters to analyze their statistical risk of cardiovascular disease using our trained ML model.
          </p>
        </div>

        {/* Quick-Fill Presets */}
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 mr-1" />
            Quick Presets:
          </span>
          <button
            type="button"
            onClick={() => loadPreset('healthy')}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition cursor-pointer"
          >
            Healthy Profile
          </button>
          <button
            type="button"
            onClick={() => loadPreset('borderline')}
            className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition cursor-pointer"
          >
            Borderline Case
          </button>
          <button
            type="button"
            onClick={() => loadPreset('high_risk')}
            className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition cursor-pointer"
          >
            High Risk Case
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Column span 7 */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 shadow-xl space-y-7">
          
          <div className="border-b border-white/[0.08] pb-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <User className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-white">Patient Clinical Attributes</h2>
            </div>
            
            <button
              type="button"
              onClick={() => setFormData({
                age: '45',
                gender: '2',
                height: '170',
                weight: '75',
                ap_hi: '120',
                ap_lo: '80',
                cholesterol: '1',
                gluc: '1',
                smoke: false,
                alco: false,
                active: true
              })}
              className="text-xs text-slate-400 hover:text-white flex items-center space-x-1.5 transition cursor-pointer px-2.5 py-1 rounded-lg bg-slate-900/60 border border-white/[0.06]"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset Values</span>
            </button>
          </div>

          {error && (
            <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-4 flex items-start space-x-3 text-rose-200 text-xs shadow-lg animate-pulse">
              <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Demographics */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-cyan-400 font-bold text-xs uppercase tracking-widest flex items-center">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] mr-2">1</span>
                Demographics & Body Metrics
              </h3>
              {liveBmi && (
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-900 border border-white/[0.08] text-slate-300">
                  Live BMI: <strong className="text-cyan-300 font-semibold">{liveBmi}</strong>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Age (Years)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-cyan-400"
                  required
                  min="1"
                  max="120"
                />
              </div>

              {/* Segmented Gender Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Biological Gender</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/80 rounded-xl border border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, gender: '1' }))}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                      formData.gender === '1'
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Female</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, gender: '2' }))}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                      formData.gender === '2'
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Male</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-cyan-400"
                  required
                  min="100"
                  max="220"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-cyan-400"
                  required
                  min="30"
                  max="200"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Vitals */}
          <div className="space-y-4 pt-5 border-t border-white/[0.08]">
            <div className="flex items-center justify-between">
              <h3 className="text-cyan-400 font-bold text-xs uppercase tracking-widest flex items-center">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] mr-2">2</span>
                Patient Vitals
              </h3>
              {liveSys > 0 && liveDia > 0 && (
                <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
                  liveSys >= 140 || liveDia >= 90
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    : liveSys >= 130 || liveDia >= 80
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                }`}>
                  {liveSys >= 140 || liveDia >= 90 ? 'Stage 2 HTN' : liveSys >= 130 || liveDia >= 80 ? 'Stage 1 HTN' : liveSys >= 120 ? 'Pre-HTN' : 'Normal BP'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Systolic Blood Pressure (mmHg)</label>
                <input
                  type="number"
                  name="ap_hi"
                  value={formData.ap_hi}
                  onChange={handleChange}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-cyan-400 font-mono"
                  required
                  min="80"
                  max="220"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Diastolic Blood Pressure (mmHg)</label>
                <input
                  type="number"
                  name="ap_lo"
                  value={formData.ap_lo}
                  onChange={handleChange}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-cyan-400 font-mono"
                  required
                  min="40"
                  max="140"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Lab Tests with Tiered Segmented Controls */}
          <div className="space-y-4 pt-5 border-t border-white/[0.08]">
            <h3 className="text-cyan-400 font-bold text-xs uppercase tracking-widest flex items-center">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] mr-2">3</span>
              Laboratory Test Biomarkers
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Cholesterol selector */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Cholesterol Level</label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-white/[0.08]">
                  {[
                    { val: '1', label: 'Normal (1)' },
                    { val: '2', label: 'Above (2)' },
                    { val: '3', label: 'Critical (3)' }
                  ].map((lvl) => (
                    <button
                      key={lvl.val}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, cholesterol: lvl.val }))}
                      className={`py-2 px-1 text-[11px] font-semibold rounded-lg transition cursor-pointer text-center ${
                        formData.cholesterol === lvl.val
                          ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Glucose selector */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Glucose Level</label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-white/[0.08]">
                  {[
                    { val: '1', label: 'Normal (1)' },
                    { val: '2', label: 'Above (2)' },
                    { val: '3', label: 'Critical (3)' }
                  ].map((lvl) => (
                    <button
                      key={lvl.val}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, gluc: lvl.val }))}
                      className={`py-2 px-1 text-[11px] font-semibold rounded-lg transition cursor-pointer text-center ${
                        formData.gluc === lvl.val
                          ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Section 4: Lifestyle Toggles */}
          <div className="space-y-4 pt-5 border-t border-white/[0.08]">
            <h3 className="text-cyan-400 font-bold text-xs uppercase tracking-widest flex items-center">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] mr-2">4</span>
              Lifestyle & Habits
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, smoke: !p.smoke }))}
                className={`p-3.5 rounded-xl border flex items-center space-x-3 transition cursor-pointer text-left ${
                  formData.smoke
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-200 shadow-sm'
                    : 'bg-slate-950/60 border-white/[0.08] text-slate-400 hover:border-white/[0.15]'
                }`}
              >
                <div className={`p-2 rounded-lg ${formData.smoke ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-900 text-slate-500'}`}>
                  <Cigarette className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-white">Active Smoker</span>
                  <span className="text-[10px] opacity-80">{formData.smoke ? 'Yes (+risk)' : 'No'}</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, alco: !p.alco }))}
                className={`p-3.5 rounded-xl border flex items-center space-x-3 transition cursor-pointer text-left ${
                  formData.alco
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-sm'
                    : 'bg-slate-950/60 border-white/[0.08] text-slate-400 hover:border-white/[0.15]'
                }`}
              >
                <div className={`p-2 rounded-lg ${formData.alco ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-900 text-slate-500'}`}>
                  <GlassWater className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-white">Alcohol Intake</span>
                  <span className="text-[10px] opacity-80">{formData.alco ? 'Regular intake' : 'None / Minor'}</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, active: !p.active }))}
                className={`p-3.5 rounded-xl border flex items-center space-x-3 transition cursor-pointer text-left ${
                  formData.active
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200 shadow-sm'
                    : 'bg-slate-950/60 border-white/[0.08] text-slate-400 hover:border-white/[0.15]'
                }`}
              >
                <div className={`p-2 rounded-lg ${formData.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 text-slate-500'}`}>
                  <Flame className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-white">Physical Activity</span>
                  <span className="text-[10px] opacity-80">{formData.active ? 'Regular Exercise' : 'Sedentary'}</span>
                </div>
              </button>

            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <Activity className="animate-spin h-5 w-5 text-white" />
                  <span>Computing Multi-Factor Prognosis...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Run Risk Evaluation</span>
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Right Panel: Results (Column span 5) */}
        <div className="lg:col-span-5 flex flex-col h-full">
          
          {/* Empty State */}
          {!result && !loading && (
            <div className="flex-1 glass-panel rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-xl min-h-[420px] relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="w-20 h-20 rounded-2xl bg-slate-900/80 border border-white/[0.08] flex items-center justify-center mb-5 text-cyan-400/50 shadow-inner">
                <Heart className="h-10 w-10 animate-heart-pulse" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Awaiting Parameters</h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-xs leading-relaxed">
                Complete the clinical variables on the left panel and click "Run Risk Evaluation" to compute the cardiovascular prognosis.
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex-1 glass-panel rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-xl min-h-[420px] relative overflow-hidden">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
                <Heart className="h-10 w-10 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Analyzing Clinical Record</h3>
              <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                Scaling features, parsing weights, and running prediction queries against the machine learning server...
              </p>
            </div>
          )}

          {/* Results State */}
          {result && !loading && (
            <div className="flex-1 glass-panel rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <h2 className="text-base font-bold text-white flex items-center">
                  <Gauge className="h-5 w-5 text-cyan-400 mr-2" />
                  Evaluation Results
                </h2>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-white/[0.08] transition cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Print Report</span>
                </button>
              </div>
              
              {/* Score visualizer Radial Card */}
              <div className={`rounded-2xl p-6 border ${riskColors?.border} bg-gradient-to-br ${riskColors?.gradient} shadow-lg flex flex-col sm:flex-row items-center justify-around gap-6 relative overflow-hidden`}>
                {/* SVG Circle Gauge */}
                <div className="relative h-32 w-32 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background Track */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      className="text-slate-900/80"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    {/* Fill */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke={riskColors?.stroke}
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  {/* Inner text */}
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className={`text-3xl font-extrabold ${riskColors?.text} font-mono tracking-tight`}>
                      {animatedPercentage}%
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">Probability</span>
                  </div>
                </div>

                <div className="text-center sm:text-left space-y-2.5">
                  <div className={`inline-flex px-3.5 py-1 rounded-full text-xs font-extrabold border ${riskColors?.border} ${riskColors?.bg} ${riskColors?.text} shadow-sm uppercase tracking-wider`}>
                    {result.risk_level} Risk
                  </div>
                  <div className="text-xs text-slate-300">
                    Calculated BMI: <span className="font-semibold text-white font-mono">{result.bmi}</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Prognosis State: <span className="font-semibold text-white">
                      {result.risk_label === 1 ? "Positive (Present)" : "Negative (Absent)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommendations list */}
              <div className="flex-1 space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-white/[0.08] pb-2 flex items-center justify-between">
                  <span>Clinical Findings & Advice</span>
                  <span className="text-[10px] text-cyan-400 font-mono">{findings.length} findings</span>
                </h3>
                <div className="space-y-3 overflow-y-auto max-h-[280px] pr-1.5">
                  {findings.map((item, idx) => {
                    let Icon = Info;
                    let cardBg = 'bg-slate-900/50 border-white/[0.08] text-slate-300';
                    let iconBg = 'text-sky-400 bg-sky-500/10 border border-sky-500/20';

                    if (item.type === 'danger') {
                      Icon = AlertCircle;
                      cardBg = 'bg-rose-950/20 border-rose-500/30 text-rose-200';
                      iconBg = 'text-rose-400 bg-rose-500/10 border border-rose-500/20';
                    } else if (item.type === 'warning') {
                      Icon = AlertTriangle;
                      cardBg = 'bg-amber-950/20 border-amber-500/30 text-amber-200';
                      iconBg = 'text-amber-400 bg-amber-500/10 border border-amber-500/20';
                    }

                    return (
                      <div key={idx} className={`p-3.5 rounded-xl border flex items-start space-x-3 text-xs leading-relaxed ${cardBg} shadow-sm`}>
                        <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${iconBg}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="flex-1">
                          {item.text.includes(':') ? (
                            <>
                              <strong className="text-white font-bold block mb-0.5">{item.text.split(':')[0]}</strong>
                              <span className="opacity-90">{item.text.split(':')[1]}</span>
                            </>
                          ) : (
                            item.text
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Patient Note Disclaimer */}
              <div className="border-t border-white/[0.08] pt-4 flex items-center space-x-2 text-[10px] text-slate-500 leading-normal">
                <Shield className="h-4 w-4 text-cyan-400/60 flex-shrink-0" />
                <span>Computed using model.joblib. This output is a clinical aid and does not constitute absolute diagnosis.</span>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

