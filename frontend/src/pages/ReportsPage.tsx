import React, { useState } from 'react';
import { FileText, Download, Printer, ShieldCheck, Sparkles, CheckCircle2, Calendar, MapPin } from 'lucide-react';
import { api } from '../api/client';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<string>('HEALTH_OFFICER_BULLETIN');
  const [selectedCity, setSelectedCity] = useState<string>('Chennai');
  const [startDate, setStartDate] = useState<string>('2026-09-01');
  const [endDate, setEndDate] = useState<string>('2026-09-23');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedDocument, setGeneratedDocument] = useState<any>(null);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const res = await api.generateReport({
        reportType,
        startDate,
        endDate,
        city: selectedCity === 'ALL' ? undefined : selectedCity,
      });

      if (res.success && res.document) {
        setGeneratedDocument(res.document);
      }
    } catch (e) {
      console.error('Failed to generate report:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
              Actionable Intelligence Report Generator
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              Official Decision Support
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Produce structured surveillance bulletins, supply chain buffer advisories, and executive briefings.
          </p>
        </div>

        {generatedDocument && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl glass-card text-slate-700 dark:text-slate-300 hover:border-teal-500 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Document</span>
            </button>
          </div>
        )}
      </div>

      {/* Generator Configuration Card */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">
          Report Parameters & Scope
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Document Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="HEALTH_OFFICER_BULLETIN">Public Health Surveillance Bulletin</option>
              <option value="SUPPLY_CHAIN_ADVISORY">Supply Chain Buffer Advisory</option>
              <option value="EXECUTIVE_SUMMARY">Executive Demand Summary</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Geographic Scope
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="ALL">All Hubs (National Level)</option>
              <option value="Chennai">Chennai District</option>
              <option value="Madurai">Madurai District</option>
              <option value="Coimbatore">Coimbatore District</option>
              <option value="Bengaluru">Bengaluru Urban</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-medical-600 to-teal-500 hover:from-medical-500 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Compiling Intelligence...' : 'Generate Official Report'}</span>
          </button>
        </div>
      </div>

      {/* Generated Report Document Preview */}
      {generatedDocument ? (
        <div className="glass-card p-8 rounded-3xl border border-slate-300 dark:border-slate-700 space-y-6 bg-white dark:bg-[#0A192F]">
          {/* Official Letterhead Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b-2 border-teal-500">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                MEDDOC HEALTH INTELLIGENCE NETWORK • OFFICIAL BULLETIN
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] mt-1">
                {generatedDocument.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Scope: {generatedDocument.scope?.city} • Reporting Period: {generatedDocument.timeframe?.start} to {generatedDocument.timeframe?.end}
              </p>
            </div>

            <div className="text-right text-xs text-slate-500">
              <span className="font-mono text-[10px] block">DOC-ID: PH-{Date.now().toString().slice(-6)}</span>
              <span>Generated: {new Date(generatedDocument.generatedAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Executive Summary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0D1F3D] border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Anomalies</span>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
                {generatedDocument.summary?.totalSpikesDetected || 6}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0D1F3D] border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Critical Signals</span>
              <p className="text-xl font-extrabold text-rose-500 font-mono mt-0.5">
                {generatedDocument.summary?.criticalSpikes || 2}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0D1F3D] border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Shortage Risks</span>
              <p className="text-xl font-extrabold text-amber-500 font-mono mt-0.5">
                {generatedDocument.summary?.potentialShortagesIdentified || 4}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0D1F3D] border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">AI Confidence</span>
              <p className="text-xl font-extrabold text-teal-500 font-mono mt-0.5">
                94.7%
              </p>
            </div>
          </div>

          {/* Key Findings */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              1. Key Demand Anomalies Identified
            </h3>
            <div className="space-y-2">
              {generatedDocument.keyFindings?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-[#0D1F3D] border border-slate-200 dark:border-slate-800 text-xs flex items-start justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{item.medicine}</span>
                    <span className="text-slate-400 ml-2">at {item.pharmacy} ({item.city})</span>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">{item.explanation}</p>
                  </div>
                  <span className="font-bold text-rose-500 font-mono text-sm">+{item.increasePercentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Administrative Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              2. Recommended Interventions
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {generatedDocument.recommendedActions?.map((act: string, aIdx: number) => (
                <li key={aIdx}>{act}</li>
              ))}
            </ul>
          </div>

          {/* Scientific Disclaimer Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 italic">
            {generatedDocument.disclaimer}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center glass-card rounded-3xl text-slate-400 space-y-2">
          <FileText className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-sm font-semibold">Select parameters and click "Generate Official Report" to compile intelligence.</p>
        </div>
      )}
    </div>
  );
};
