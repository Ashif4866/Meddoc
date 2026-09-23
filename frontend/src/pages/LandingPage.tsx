import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Sparkles,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Bell,
  ArrowRight,
  Boxes,
  FileSpreadsheet,
  CheckCircle2,
  ChevronRight,
  Play,
  Layers,
  BarChart3,
  Zap,
  Globe2,
  ArrowUpRight,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { demoLogin } = useAuth();
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState(2); // Step 3 active by default

  const handleQuickDemo = async (role: any = 'HEALTH_OFFICER') => {
    await demoLogin(role);
    navigate('/dashboard');
  };

  const workflowSteps = [
    { num: '01', title: 'Collect Pharmacy Data', desc: 'Ingest daily POS transaction feeds, dispensed volumes, and prescription requests from networked pharmacy nodes across cities.' },
    { num: '02', title: 'Analyze Historical Demand', desc: 'Compute 30/60/90-day rolling baselines, eliminate day-of-week seasonality, and normalize variances.' },
    { num: '03', title: 'Detect Anomalies', desc: 'Run unsupervised Isolation Forests and statistical rolling Z-score models to identify significant demand deviations.' },
    { num: '04', title: 'Forecast Future Demand', desc: 'Apply Holt-Winters exponential smoothing to extrapolate forward demand for 7, 14, and 30 days with 95% confidence intervals.' },
    { num: '05', title: 'Identify Inventory Risk', desc: 'Cross-reference forward consumption rates with real-time pharmacy stock to estimate Days of Supply (DoS) and stockout timelines.' },
    { num: '06', title: 'Generate Alerts', desc: 'Deliver actionable, severity-graded notifications to public health and supply chain stakeholders without diagnostic assertions.' },
    { num: '07', title: 'Support Decision-Making', desc: 'Enable proactive inter-pharmacy inventory balancing and targeted field epidemiological investigations.' },
  ];

  const capabilities = [
    { title: 'AI Anomaly Detection', desc: 'Rolling Z-score and Isolation Forest algorithms flagging unusual demand spikes.', icon: Activity },
    { title: 'Demand Forecasting', desc: '7, 14, and 30-day projection models with 95% upper and lower confidence bounds.', icon: TrendingUp },
    { title: 'Medicine Trend Analysis', desc: 'Multi-SKU comparative analytics across therapeutic categories and formulations.', icon: BarChart3 },
    { title: 'Geographic Heatmaps', desc: 'City and district-level geospatial surge maps with cluster radius telemetry.', icon: Globe2 },
    { title: 'Inventory Monitoring', desc: 'Network-wide stock visibility with automated reorder threshold triggers.', icon: Boxes },
    { title: 'Shortage Prediction', desc: 'Days of Supply (DoS) depletion countdowns identifying critical stockout risks.', icon: Zap },
    { title: 'Automated Smart Alerts', desc: 'Multi-tier notifications for public health and supply chain authorities.', icon: Bell },
    { title: 'AI Explanations', desc: 'Natural language analytical interpretations distinguishing signals from diagnoses.', icon: Sparkles },
    { title: 'Report Generation', desc: 'Automated generation of Public Health Bulletins and Supply Allocation Advisories.', icon: FileSpreadsheet },
    { title: 'CSV Data Ingestion', desc: 'One-click batch sales log upload with immediate anomaly pipeline processing.', icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-6 lg:px-12 h-18 flex items-center justify-between shadow-xs">
        <Logo size="lg" />

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
          <a href="#preview" className="hover:text-teal-600 transition-colors">Platform</a>
          <a href="#why" className="hover:text-teal-600 transition-colors">Why Meddoc</a>
          <a href="#workflow" className="hover:text-teal-600 transition-colors">How It Works</a>
          <a href="#capabilities" className="hover:text-teal-600 transition-colors">Capabilities</a>
          <a href="#metrics" className="hover:text-teal-600 transition-colors">Metrics</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-bold px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => handleQuickDemo('HEALTH_OFFICER')}
            className="text-xs font-extrabold px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5 group"
          >
            <span>Live Prototype</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-6 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping"></span>
          <span>Meddoc AI Health Core • Smart India Hackathon Prototype</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl font-['Outfit'] leading-[1.15]">
          Detect Pharmacy Demand Spikes Before They Become <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-sky-600 to-indigo-600">Health Crises.</span>
        </h1>

        {/* Hero Description */}
        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
          <strong className="text-teal-700">Meddoc</strong> uses AI-powered demand analytics to detect unusual medicine consumption patterns, forecast future demand, identify inventory risks, and provide actionable health-intelligence signals.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => handleQuickDemo('HEALTH_OFFICER')}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-bold text-sm shadow-xl shadow-teal-600/20 transition-all flex items-center gap-2 group"
          >
            <span>Explore Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#workflow"
            className="px-6 py-3.5 rounded-2xl bg-white border border-slate-300 hover:border-teal-500 text-slate-800 font-bold text-sm shadow-xs transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 text-teal-600" />
            <span>See How It Works</span>
          </a>
        </div>

        {/* Interactive Dashboard Preview Card */}
        <div id="preview" className="mt-14 w-full max-w-6xl rounded-3xl bg-white border border-slate-200/90 p-4 lg:p-6 shadow-xl relative overflow-hidden text-left">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-bold text-slate-600 ml-2 font-mono">
                Meddoc Telemetry Console • Live Feed (Chennai / Madurai / Coimbatore)
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" /> AI Confidence: 94.7%
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
            <div className="lg:col-span-8 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Demand Analytics</span>
                  <h4 className="text-sm font-bold text-slate-900">
                    Paracetamol 650mg — 14-Day Demand vs 30-Day Historical Baseline
                  </h4>
                </div>
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  +142.5% Spike
                </span>
              </div>

              {/* Mini SVG Chart Preview */}
              <div className="my-4 h-44 w-full relative">
                <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
                  <path
                    d="M 0 110 Q 120 105 240 100 T 360 70 T 480 30 L 480 60 L 360 100 L 240 125 L 0 130 Z"
                    fill="rgba(13, 148, 136, 0.15)"
                  />
                  <path
                    d="M 0 120 Q 120 115 240 112 T 360 110 T 500 108"
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M 0 120 Q 120 118 240 110 L 320 90 L 380 50 L 440 28 L 500 20"
                    fill="none"
                    stroke="#0D9488"
                    strokeWidth="3.2"
                  />
                  <circle cx="380" cy="50" r="6" fill="#E11D48" stroke="#FFFFFF" strokeWidth="2" className="animate-pulse" />
                  <circle cx="440" cy="28" r="6" fill="#E11D48" stroke="#FFFFFF" strokeWidth="2" className="animate-pulse" />
                </svg>

                <div className="absolute top-4 right-14 bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md">
                  AI Anomaly (Z = 3.12)
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span> Actual Sales</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-slate-400"></span> 30-Day Baseline</span>
                </div>
                <span className="font-bold text-teal-700">Forecast: +18.4% Next 7d</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">Smart Alert Trigger</span>
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                  <div className="flex items-center justify-between font-bold">
                    <span>⚡ Critical Demand Signal</span>
                    <span>Just Now</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed">
                    Paracetamol surge in Chennai T. Nagar (+142.5%). Inventory buffer: 3.2 days remaining.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">Syndromic Signal Correlation</span>
                <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800">
                  <div className="flex items-center justify-between font-bold">
                    <span>🧬 Enteric Co-Surge (Madurai)</span>
                    <span className="text-teal-700 font-mono font-extrabold">r = 0.86</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed">
                    ORS Sachets & Zinc Sulfate co-elevated in 4 reporting nodes.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleQuickDemo('HEALTH_OFFICER')}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Launch Meddoc Core</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Why Meddoc (4 Feature Cards) */}
      <section id="why" className="py-20 px-6 lg:px-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Core Value Proposition</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit'] mt-2">
              Transforming Pharmacy Telemetry into Early Public Health Intelligence
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Traditional healthcare data arrives weeks after hospital admissions. Meddoc detects the earliest signal when citizens first seek symptom relief at neighborhood pharmacies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-teal-400">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                AI Spike Detection
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Detect unusual medicine-demand patterns using historical baselines, rolling Z-score deviation, and Isolation Forest anomaly analysis.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-sky-400">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                Demand Forecasting
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Estimate future demand 7 to 30 days ahead with 95% confidence intervals to anticipate medicine consumption velocity and inventory pressure.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-indigo-400">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                Geographic Intelligence
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Visualize medicine-demand activity and cluster anomalies across Tamil Nadu districts and Chennai urban zones with interactive heatmaps.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-amber-400">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                Smart Alerts
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Notify public health and supply chain stakeholders when significant anomalies or inventory depletion risks are statistically verified.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: How It Works (7-Step Workflow) */}
      <section id="workflow" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">End-to-End Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit'] mt-2">
            How Meddoc Operates
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            A continuous closed-loop intelligence architecture from point-of-sale data collection to strategic administrative action.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-2.5">
            {workflowSteps.map((step, idx) => (
              <button
                key={step.num}
                onClick={() => setSelectedWorkflowStep(idx)}
                className={`w-full p-4 rounded-2xl text-left transition-all flex items-center gap-4 ${
                  selectedWorkflowStep === idx
                    ? 'bg-teal-50 border-2 border-teal-600 shadow-xs text-slate-900'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className={`text-base font-extrabold font-mono px-2.5 py-1 rounded-xl ${
                  selectedWorkflowStep === idx ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {step.num}
                </span>
                <div className="flex-1">
                  <h4 className="text-sm font-bold font-['Outfit']">{step.title}</h4>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedWorkflowStep === idx ? 'translate-x-1 text-teal-600' : 'text-slate-400'}`} />
              </button>
            ))}
          </div>

          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-teal-200 shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-extrabold font-mono text-teal-600">
                {workflowSteps[selectedWorkflowStep].num}
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
                {workflowSteps[selectedWorkflowStep].title}
              </h3>
            </div>

            <p className="text-base text-slate-700 leading-relaxed">
              {workflowSteps[selectedWorkflowStep].desc}
            </p>

            <div className="mt-8 p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-900 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Scientific Integrity Standard:</span>
              </div>
              <p className="leading-relaxed text-slate-700">
                Spikes are classified strictly as <strong>analytical signals</strong> (e.g. <em>"Elevated demand activity requiring further investigation"</em>) to avoid unsubstantiated medical conclusions prior to epidemiological verification.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => handleQuickDemo('HEALTH_OFFICER')}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>Experience In Live Prototype</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Platform Capabilities Grid */}
      <section id="capabilities" className="py-20 px-6 lg:px-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Enterprise Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit'] mt-2">
              Engineered for Public Health Surveillance & Supply Chains
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {capabilities.map((cap, cIdx) => (
              <div key={cIdx} className="glass-card p-5 rounded-2xl flex flex-col justify-between hover:border-teal-400">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                    <cap.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 font-['Outfit']">
                    {cap.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Demo Metrics Banner */}
      <section id="metrics" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto text-center">
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
          <span>⚠️ Demo Environment — Simulated Data</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit'] max-w-2xl mx-auto">
          Scale & Simulation Parameters
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          <div className="glass-card p-6 rounded-2xl text-center">
            <span className="text-3xl lg:text-4xl font-extrabold text-teal-600 font-['Outfit']">2,500+</span>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-2">Pharmacies Monitored</p>
          </div>
          <div className="glass-card p-6 rounded-2xl text-center">
            <span className="text-3xl lg:text-4xl font-extrabold text-sky-600 font-['Outfit']">18K+</span>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-2">Medicine Records</p>
          </div>
          <div className="glass-card p-6 rounded-2xl text-center">
            <span className="text-3xl lg:text-4xl font-extrabold text-indigo-600 font-['Outfit']">94.7%</span>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-2">Demo AI Confidence</p>
          </div>
          <div className="glass-card p-6 rounded-2xl text-center">
            <span className="text-3xl lg:text-4xl font-extrabold text-emerald-600 font-['Outfit']">24/7</span>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-2">Demand Monitoring</p>
          </div>
        </div>

        {/* Live Simulator CTA */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-teal-700 via-sky-800 to-indigo-900 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mx-auto text-center relative z-10 space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-['Outfit']">
              Ready to Explore Meddoc?
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Experience the full working dashboard, interactive Tamil Nadu & Chennai geospatial radar, and live outbreak surge injector.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => handleQuickDemo('HEALTH_OFFICER')}
                className="px-6 py-3 rounded-xl bg-white text-teal-900 font-extrabold text-sm shadow-md transition-all hover:bg-slate-100"
              >
                Log In as Health Officer
              </button>
              <button
                onClick={() => handleQuickDemo('SUPPLY_CHAIN_MANAGER')}
                className="px-6 py-3 rounded-xl bg-teal-800/60 hover:bg-teal-800 text-white font-semibold text-sm border border-teal-400/40 transition-all"
              >
                Log In as Supply Chain Manager
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-6 lg:px-12 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4 bg-white">
        <Logo size="sm" />
        <p>Meddoc — AI-Powered Pharmacy Spike Tracker • Smart India Hackathon (SIH) Prototype</p>
        <p className="text-[11px] text-slate-400">From Pharmacy Data to Early Health Intelligence.</p>
      </footer>
    </div>
  );
};
