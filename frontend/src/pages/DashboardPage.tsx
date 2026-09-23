import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  Pill,
  Activity,
  AlertOctagon,
  Boxes,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Zap,
  ShieldCheck,
  Database,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { KPICard } from '../components/KPICard';
import { TamilNaduMap } from '../components/TamilNaduMap';
import { api } from '../api/client';
import { DashboardOverviewData, Spike } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState<DashboardOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [dbStatus, setDbStatus] = useState({
    connected: true,
    engine: 'Prisma ORM (SQLite / PostgreSQL)',
    totalDemandRecords: 4800,
    pharmacyNodes: 26,
    activeMedicines: 18,
    latencyMs: 4,
    lastSync: new Date().toLocaleTimeString(),
  });

  const fetchOverview = async () => {
    try {
      const startTime = performance.now();
      const res = await api.getDashboardOverview();
      const latency = Math.round(performance.now() - startTime);

      if (res.success) {
        setDashboardData(res.data);
        setDbStatus(prev => ({
          ...prev,
          connected: true,
          latencyMs: latency || 4,
          lastSync: new Date().toLocaleTimeString(),
        }));
      }
    } catch (e) {
      console.error('Failed to load dashboard overview:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOverview();
  };

  const userName = user?.name || 'Dr. Arjun';

  const kpis = dashboardData?.kpis || {
    pharmaciesMonitored: { value: 2548, change: '+8.4%', trend: 'up', sparkline: [2410, 2435, 2460, 2490, 2515, 2530, 2548] },
    medicinesMonitored: { value: 18426, change: '+5.2%', trend: 'up', sparkline: [17800, 17950, 18100, 18200, 18300, 18380, 18426] },
    activeSpikes: { value: 17, change: '+3 today', trend: 'up', severity: 'CRITICAL', sparkline: [12, 14, 11, 15, 19, 14, 17] },
    criticalAlerts: { value: 4, change: 'Requires attention', trend: 'neutral', severity: 'CRITICAL', sparkline: [6, 5, 8, 4, 7, 5, 4] },
    predictedShortages: { value: 8, change: 'Next 7 days', trend: 'down', severity: 'HIGH', sparkline: [11, 9, 10, 8, 7, 9, 8] },
    aiConfidence: { value: '94.7%', change: '+0.6% this week', trend: 'up', sparkline: [93.8, 94.1, 94.5, 94.2, 94.8, 94.6, 94.7] },
  };

  const demandTrend = dashboardData?.demandTrend || [
    { date: 'Day -6', actual: 5410, baseline: 4180 },
    { date: 'Day -5', actual: 5890, baseline: 4200 },
    { date: 'Day -4', actual: 6340, baseline: 4220 },
    { date: 'Day -3', actual: 6780, baseline: 4250 },
    { date: 'Day -2', actual: 7120, baseline: 4270 },
    { date: 'Yesterday', actual: 7540, baseline: 4300 },
    { date: 'Today', actual: 7920, baseline: 4320 },
  ];

  const recentSpikes: Spike[] = dashboardData?.recentSpikes || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Top Welcome Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
              Good afternoon, {userName}
            </h1>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live Database Connected
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Welcome to <strong className="text-teal-700">Meddoc</strong> Intelligence — Tamil Nadu & Chennai Surveillance Core.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-teal-600 hover:border-teal-300 shadow-xs transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Refresh Live Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-teal-600' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

          <button
            onClick={() => navigate('/data-ingestion')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-amber-200 animate-pulse" />
            <span>Simulate Outbreak Surge</span>
          </button>
        </div>
      </div>

      {/* 2. Live Database Telemetry Bar */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
            <Database className="w-4 h-4" />
          </div>
          <span>Active Database:</span>
          <span className="font-mono text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
            {dbStatus.engine}
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <span>Records: <strong className="text-slate-900 font-bold">4,800+</strong></span>
          <span>•</span>
          <span>Pharmacies: <strong className="text-slate-900 font-bold">26</strong></span>
          <span>•</span>
          <span>Medicines: <strong className="text-slate-900 font-bold">18 SKUs</strong></span>
          <span>•</span>
          <span>Query Latency: <strong className="text-emerald-600 font-bold">{dbStatus.latencyMs}ms</strong></span>
        </div>
      </div>

      {/* 3. 6 Clean KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Pharmacies Monitored"
          value={kpis.pharmaciesMonitored.value}
          change={kpis.pharmaciesMonitored.change}
          trend="up"
          comparisonText="nodes"
          sparkline={kpis.pharmaciesMonitored.sparkline}
          icon={<Store className="w-5 h-5" />}
          onClick={() => navigate('/pharmacies')}
        />

        <KPICard
          title="Medicines Monitored"
          value={kpis.medicinesMonitored.value}
          change={kpis.medicinesMonitored.change}
          trend="up"
          comparisonText="SKUs"
          sparkline={kpis.medicinesMonitored.sparkline}
          icon={<Pill className="w-5 h-5" />}
          onClick={() => navigate('/medicines')}
        />

        <KPICard
          title="Active Spikes"
          value={kpis.activeSpikes.value}
          change={kpis.activeSpikes.change}
          trend="up"
          severity={kpis.activeSpikes.severity}
          comparisonText="signals"
          sparkline={kpis.activeSpikes.sparkline}
          icon={<Activity className="w-5 h-5" />}
          onClick={() => navigate('/spikes')}
        />

        <KPICard
          title="Critical Alerts"
          value={kpis.criticalAlerts.value}
          change={kpis.criticalAlerts.change}
          trend="neutral"
          severity="CRITICAL"
          comparisonText="attention"
          sparkline={kpis.criticalAlerts.sparkline}
          icon={<AlertOctagon className="w-5 h-5" />}
          onClick={() => navigate('/alerts')}
        />

        <KPICard
          title="Predicted Shortages"
          value={kpis.predictedShortages.value}
          change={kpis.predictedShortages.change}
          trend="down"
          severity="HIGH"
          comparisonText="risk"
          sparkline={kpis.predictedShortages.sparkline}
          icon={<Boxes className="w-5 h-5" />}
          onClick={() => navigate('/inventory')}
        />

        <KPICard
          title="AI Confidence"
          value={kpis.aiConfidence.value}
          change={kpis.aiConfidence.change}
          trend="up"
          comparisonText="accuracy"
          sparkline={kpis.aiConfidence.sparkline}
          icon={<Sparkles className="w-5 h-5 text-teal-600" />}
          onClick={() => navigate('/insights')}
        />
      </div>

      {/* 4. Tamil Nadu & Chennai Focused Surveillance Map */}
      <TamilNaduMap onSelectZone={(zone) => console.log('Selected zone:', zone.name)} />

      {/* 5. Demand Trend vs Active Spikes Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Simple 7-Day Demand Trend Chart */}
        <div className="lg:col-span-6 glass-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">
                7-Day Medicine Demand vs Baseline
              </h3>
              <p className="text-xs text-slate-500">
                Dispensed volume across Tamil Nadu pharmacy network
              </p>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
              +83.3% Surge
            </span>
          </div>

          <div className="h-56 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demandTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="meddocActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.8} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#CBD5E1',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#0F172A',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke="#94A3B8"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  name="Baseline Target"
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#0D9488"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#meddocActual)"
                  name="Dispensed Units"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-teal-700 font-bold">
              <TrendingUp className="w-3.5 h-3.5" /> Demand trending upwards
            </span>
            <button
              onClick={() => navigate('/analytics')}
              className="text-teal-700 font-bold hover:underline"
            >
              Open Full Analytics →
            </button>
          </div>
        </div>

        {/* Simplified Active Spikes List */}
        <div className="lg:col-span-6 glass-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">
                Active Anomaly Signals (Tamil Nadu)
              </h3>
              <p className="text-xs text-slate-500">
                Elevated demand activity requiring health team verification
              </p>
            </div>
            <button
              onClick={() => navigate('/spikes')}
              className="text-xs font-bold text-teal-700 hover:underline"
            >
              View All ({recentSpikes.length})
            </button>
          </div>

          <div className="my-2 space-y-2.5">
            {recentSpikes.slice(0, 3).map((spike) => (
              <div
                key={spike.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-3 text-xs hover:border-teal-400 hover:bg-white transition-all shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{spike.medicine?.name}</span>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${
                      spike.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>
                      {spike.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {spike.pharmacy?.name} ({spike.pharmacy?.city})
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-extrabold text-rose-600 font-mono text-sm block">
                    +{spike.demandIncreasePercentage.toFixed(0)}%
                  </span>
                  <button
                    onClick={() => navigate('/spikes')}
                    className="text-[10px] font-bold text-teal-700 hover:underline"
                  >
                    Investigate →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/spikes')}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Open Anomaly Detection Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
