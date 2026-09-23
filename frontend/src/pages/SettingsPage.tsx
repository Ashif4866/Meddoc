import React, { useState } from 'react';
import { Settings, ShieldCheck, Sliders, Bell, Database, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [contaminationRate, setContaminationRate] = useState(5);
  const [zScoreThreshold, setZScoreThreshold] = useState(2.2);
  const [forecastHorizon, setForecastHorizon] = useState(14);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
              System Settings & Model Sensitivity
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              Role: {user?.role || 'HEALTH_OFFICER'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure anomaly sensitivity thresholds, forecast horizon parameters, and notification preferences.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs font-semibold text-teal-700 dark:text-teal-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-500" />
          <span>Surveillance parameters and model sensitivities updated successfully!</span>
        </div>
      )}

      {/* Model Parameters Card */}
      <div className="glass-card p-6 rounded-3xl space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <Sliders className="w-5 h-5 text-teal-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
            AI Model Sensitivity & Threshold Tuning
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Isolation Forest Contamination Rate</span>
              <span className="text-teal-500 font-mono">{contaminationRate}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              value={contaminationRate}
              onChange={(e) => setContaminationRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
            <p className="text-[11px] text-slate-400">
              Expected proportion of anomalous consumption points in raw telemetry streams.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Critical Anomaly Z-Score Threshold</span>
              <span className="text-teal-500 font-mono">{zScoreThreshold} σ</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="4.0"
              step="0.1"
              value={zScoreThreshold}
              onChange={(e) => setZScoreThreshold(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
            <p className="text-[11px] text-slate-400">
              Number of standard deviations above 30-day baseline before marking an anomaly as Critical.
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-md transition-colors"
          >
            Save Parameter Configurations
          </button>
        </div>
      </div>
    </div>
  );
};
