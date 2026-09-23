import React, { useState } from 'react';
import { UploadCloud, Zap, FileText, CheckCircle2, AlertOctagon, Sparkles, RefreshCw, Activity } from 'lucide-react';
import { api } from '../api/client';
import confetti from 'canvas-confetti';

export const DataIngestionPage: React.FC = () => {
  const [csvText, setCsvText] = useState<string>(
    'date,quantitySold,quantityRequested,historicalAverage\n' +
    '2026-09-21,180,210,75\n' +
    '2026-09-22,210,245,75\n' +
    '2026-09-23,245,280,75'
  );
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestResult, setIngestResult] = useState<string | null>(null);

  // Live Simulator state
  const [simCity, setSimCity] = useState('Chennai');
  const [simMedicine, setSimMedicine] = useState('Paracetamol 650mg');
  const [simSurgeMagnitude, setSimSurgeMagnitude] = useState(175);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState<any | null>(null);

  const handleIngestCSV = async () => {
    setIsIngesting(true);
    setIngestResult(null);
    try {
      const res = await api.ingestCSV(csvText);
      setIngestResult(`Successfully ingested ${res.count || 3} transaction records into active baseline!`);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } catch (e: any) {
      setIngestResult(e.message || 'Failed to parse CSV records');
    } finally {
      setIsIngesting(false);
    }
  };

  const handleSimulateSurge = async () => {
    setIsSimulating(true);
    setSimResult(null);
    try {
      const res = await api.simulateSurge({
        city: simCity,
        medicineName: simMedicine,
        surgeMagnitude: simSurgeMagnitude,
      });

      if (res.success) {
        setSimResult(res.data);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } catch (e: any) {
      console.error('Surge simulation failed:', e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
              Data Ingestion & Live Surge Simulator
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              Real-Time Pipeline Testing
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Test the anomaly detection and forecasting pipeline via CSV upload or interactive outbreak surge injection.
          </p>
        </div>
      </div>

      {/* 1. Live Outbreak Simulator Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-medical-900/50 via-navy-900/60 to-teal-900/50 border-2 border-teal-500/40 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/40">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white font-['Outfit']">
                ⚡ 1-Click Live Outbreak Surge Simulator
              </h2>
              <p className="text-xs text-slate-300">
                Inject a sudden synthetic demand surge to watch anomaly detection, spike creation, and alerts trigger live!
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block text-xs font-bold text-teal-400 bg-teal-500/20 px-3 py-1 rounded-full border border-teal-500/30">
            SIH Demonstration Tool
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
              Target City Hub
            </label>
            <select
              value={simCity}
              onChange={(e) => setSimCity(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="Chennai">Chennai Hub</option>
              <option value="Madurai">Madurai Hub</option>
              <option value="Coimbatore">Coimbatore Hub</option>
              <option value="Bengaluru">Bengaluru Hub</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
              Surging Medicine SKU
            </label>
            <select
              value={simMedicine}
              onChange={(e) => setSimMedicine(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="Paracetamol 650mg">Paracetamol 650mg (Antipyretic)</option>
              <option value="ORS Electrolyte">ORS Electrolyte Sachets (Rehydration)</option>
              <option value="Azithromycin 500mg">Azithromycin 500mg (Antibiotic)</option>
              <option value="Oseltamivir 75mg">Oseltamivir 75mg (Antiviral)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
              Surge Magnitude: <span className="text-teal-400 font-bold">+{simSurgeMagnitude}%</span>
            </label>
            <input
              type="range"
              min="50"
              max="300"
              step="25"
              value={simSurgeMagnitude}
              onChange={(e) => setSimSurgeMagnitude(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500 mt-2"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSimulateSurge}
            disabled={isSimulating}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-teal-500/30 transition-all flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            <span>{isSimulating ? 'Injecting Surge...' : 'Inject Surge & Run AI Pipeline'}</span>
          </button>
        </div>

        {/* Live Simulation Response Telemetry */}
        {simResult && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-teal-500/50 space-y-3 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Surge Injected! AI Pipeline Executed: 4 Actions Triggered Live</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400">1. Spike Created</span>
                <p className="font-bold text-rose-400 mt-1">
                  +{simResult.spike?.demandIncreasePercentage}% (Severity: {simResult.spike?.severity})
                </p>
                <p className="text-[11px] text-slate-300 mt-1">{simResult.spike?.explanation}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400">2. Alert Dispatched</span>
                <p className="font-bold text-amber-400 mt-1">{simResult.alert?.title}</p>
                <p className="text-[11px] text-slate-300 mt-1">{simResult.alert?.message}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400">3. AI Insight Synthesized</span>
                <p className="font-bold text-teal-300 mt-1">{simResult.insight?.title}</p>
                <p className="text-[11px] text-slate-300 mt-1">{simResult.insight?.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. CSV Data Ingestion Section */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-teal-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
            Batch Pharmacy POS CSV Log Ingestion
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Paste CSV rows containing <code className="text-teal-400">date,quantitySold,quantityRequested,historicalAverage</code>:
        </p>

        <textarea
          rows={5}
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          className="w-full p-3 font-mono text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          {ingestResult && (
            <span className="text-xs font-semibold text-teal-500">{ingestResult}</span>
          )}
          <div className="ml-auto">
            <button
              onClick={handleIngestCSV}
              disabled={isIngesting}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold transition-colors"
            >
              {isIngesting ? 'Ingesting...' : 'Ingest CSV Records'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
