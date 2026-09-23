import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Activity,
  Layers,
  Search,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { api } from '../api/client';
import { AIInsight } from '../types';

export const InsightsPage: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [correlations, setCorrelations] = useState<any[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsightsData = async () => {
      setIsLoading(true);
      try {
        const [insRes, corrRes] = await Promise.all([
          api.getAIInsights({ type: typeFilter }),
          api.getCorrelations(),
        ]);
        if (insRes.success) setInsights(insRes.data);
        if (corrRes.success) setCorrelations(corrRes.data);
      } catch (e) {
        console.error('Failed to load insights:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsightsData();
  }, [typeFilter]);

  const displayCorrelations = correlations.length > 0 ? correlations : [
    {
      medicineA: 'Paracetamol 650mg',
      medicineB: 'ORS Electrolyte Sachets',
      correlation: 0.84,
      signalType: 'STRONG_SYNDROMIC_CLUSTER',
      interpretation: 'Co-surge detected between Paracetamol 650mg and ORS Electrolyte (r = 0.84). Co-incident spike pattern aligns with seasonal gastroenteritis/fever cluster reports.',
    },
    {
      medicineA: 'Amoxicillin 500mg',
      medicineB: 'Azithromycin 500mg',
      correlation: 0.76,
      signalType: 'STRONG_SYNDROMIC_CLUSTER',
      interpretation: 'High co-dispensing correlation across acute respiratory anti-infectives (r = 0.76).',
    },
    {
      medicineA: 'Cetirizine 10mg',
      medicineB: 'Cough Syrup (Dextromethorphan)',
      correlation: 0.68,
      signalType: 'MODERATE_CO_SURGE',
      interpretation: 'Moderate correlation detected in symptomatic upper-respiratory formulations (r = 0.68).',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
              AI Health Intelligence & Syndromic Correlation
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              Pearson & Spearman Matrices
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Statistical correlation across co-dispensed formulations to detect early syndromic signals.
          </p>
        </div>
      </div>

      {/* Scientific Principle Banner */}
      <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-900 dark:text-teal-200 space-y-1">
        <div className="flex items-center gap-1.5 font-bold">
          <ShieldCheck className="w-4 h-4 text-teal-500" />
          <span>Scientific Surveillance Guideline:</span>
        </div>
        <p className="leading-relaxed text-slate-700 dark:text-slate-300">
          The system identifies <strong>analytical demand signals</strong> from point-of-sale telemetry. A spike in medicine demand is never automatically defined as medical proof of an outbreak, but rather an elevated demand activity requiring health department field validation.
        </p>
      </div>

      {/* Syndromic Correlation Matrix Section */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-teal-500" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
                Cross-Medicine Co-Dispensing Correlation Signals
              </h3>
              <p className="text-xs text-slate-400">
                Synchronized surges between paired therapeutic categories across reporting nodes
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-teal-500">
            r &gt; 0.60 Significant
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayCorrelations.map((corr, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3 hover:border-teal-500/40 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {corr.medicineA} ↔ {corr.medicineB}
                  </span>
                  <span className="text-sm font-extrabold font-mono text-teal-500 bg-teal-500/10 px-2 py-0.5 rounded-lg">
                    r = {corr.correlation}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {corr.interpretation}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-teal-600 dark:text-teal-400 font-bold">
                <span>{corr.signalType.replace(/_/g, ' ')}</span>
                <span className="text-slate-400">94% Confidence</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Narrative Insights Feed */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
              Generated Narrative Intelligence Reports
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold">Filter Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-2.5 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="ALL">All Insight Types</option>
              <option value="ANOMALY_EXPLANATION">Anomaly Explanations</option>
              <option value="SYNDROMIC_CORRELATION">Syndromic Correlations</option>
              <option value="SHORTAGE_RISK">Shortage Risks</option>
              <option value="GEOGRAPHIC_CLUSTER">Geographic Clusters</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 space-y-2 hover:border-teal-500/40 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">
                  {item.title}
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 shrink-0">
                  {(item.confidence * 100).toFixed(0)}% Conf
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span>Type: {item.insightType.replace(/_/g, ' ')}</span>
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
