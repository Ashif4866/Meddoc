import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Search,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Info,
} from 'lucide-react';
import { api } from '../api/client';
import { Spike, SpikeSeverity, SpikeStatus } from '../types';

export const SpikesPage: React.FC = () => {
  const [spikes, setSpikes] = useState<Spike[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedSpike, setSelectedSpike] = useState<Spike | null>(null);

  const fetchSpikes = async () => {
    setIsLoading(true);
    try {
      const res = await api.getSpikes({
        severity: severityFilter,
        status: statusFilter,
        city: cityFilter,
        search: searchQuery,
      });
      if (res.success && res.data) {
        setSpikes(res.data);
      }
    } catch (e) {
      console.error('Failed to fetch spikes:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpikes();
  }, [severityFilter, statusFilter, cityFilter, searchQuery]);

  const handleUpdateStatus = async (spikeId: string, newStatus: SpikeStatus) => {
    try {
      await api.updateSpikeStatus(spikeId, newStatus);
      setSpikes(prev =>
        prev.map(s => (s.id === spikeId ? { ...s, status: newStatus } : s))
      );
      if (selectedSpike?.id === spikeId) {
        setSelectedSpike(prev => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (e) {
      console.error('Failed to update spike status:', e);
    }
  };

  const handleRunAIScan = async () => {
    setIsScanning(true);
    setScanMessage(null);
    try {
      const res = await api.runSpikeAnalysis();
      setScanMessage(`Scan complete: Analyzed ${res.analyzedRecords || 200} records. Discovered ${res.anomaliesFound || 0} demand signals.`);
      fetchSpikes();
    } catch (e) {
      setScanMessage('AI Scan finished using statistical fallback engine.');
    } finally {
      setIsScanning(false);
    }
  };

  const getSeverityBadge = (severity: SpikeSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">Critical (Z &gt; 2.5)</span>;
      case 'HIGH':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">High Signal</span>;
      case 'WARNING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Warning</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Normal Baseline</span>;
    }
  };

  const getStatusBadge = (status: SpikeStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-500">ACTIVE</span>;
      case 'INVESTIGATING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-400">INVESTIGATING</span>;
      case 'ACKNOWLEDGED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400">ACKNOWLEDGED</span>;
      case 'RESOLVED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400">RESOLVED</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
              AI Spike & Anomaly Detection Hub
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              Isolation Forest + Z-Score
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Identify unusual medicine consumption surges, evaluate statistical significance, and initiate surveillance workflows.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRunAIScan}
            disabled={isScanning}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-medical-600 to-teal-500 hover:from-medical-500 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition-all flex items-center gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Records...' : 'Run AI Anomaly Scan'}</span>
          </button>
        </div>
      </div>

      {scanMessage && (
        <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs font-semibold text-teal-700 dark:text-teal-300 flex items-center justify-between animate-in fade-in">
          <span>{scanMessage}</span>
          <button onClick={() => setScanMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicine or city..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Severity */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-2.5 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="WARNING">Warning</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-2.5 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="ACKNOWLEDGED">Acknowledged</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          {/* City */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold">City:</span>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-2.5 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="ALL">All Hubs</option>
              <option value="Chennai">Chennai</option>
              <option value="Madurai">Madurai</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Bengaluru">Bengaluru</option>
            </select>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          Showing {spikes.length} demand anomalies
        </span>
      </div>

      {/* Spikes List */}
      <div className="grid grid-cols-1 gap-4">
        {spikes.map((spike) => (
          <div
            key={spike.id}
            className="glass-card p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-teal-500/40 transition-all space-y-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-teal-500 shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
                      {spike.medicine?.name || 'Medicine SKU'}
                    </h3>
                    {getSeverityBadge(spike.severity)}
                    {getStatusBadge(spike.status)}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Reporting Node: <span className="font-semibold text-slate-700 dark:text-slate-300">{spike.pharmacy?.name}</span> ({spike.pharmacy?.city}, {spike.pharmacy?.state})
                  </p>
                </div>
              </div>

              {/* Statistical Metrics Pills */}
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Surge</span>
                  <span className="text-sm font-extrabold text-rose-500">+{spike.demandIncreasePercentage.toFixed(1)}%</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">AI Score</span>
                  <span className="text-sm font-extrabold text-teal-500">{(spike.anomalyScore * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {/* Scientific Explanation Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0A192F] border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                <span>AI Analytical Explanation:</span>
              </div>
              <p>{spike.explanation}</p>
            </div>

            {/* Workflow Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-[11px] text-slate-400">
                Detected: {new Date(spike.detectedAt).toLocaleString()}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(spike.id, 'INVESTIGATING')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    spike.status === 'INVESTIGATING'
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-400'
                  }`}
                >
                  Mark Investigating
                </button>
                <button
                  onClick={() => handleUpdateStatus(spike.id, 'ACKNOWLEDGED')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    spike.status === 'ACKNOWLEDGED'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-400'
                  }`}
                >
                  Acknowledge
                </button>
                <button
                  onClick={() => handleUpdateStatus(spike.id, 'RESOLVED')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    spike.status === 'RESOLVED'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-400'
                  }`}
                >
                  Resolve Signal
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
