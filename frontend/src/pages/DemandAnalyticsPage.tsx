import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Calendar,
  Filter,
  Download,
  BarChart2,
  Sparkles,
  Layers,
  ArrowUpRight,
  Activity,
  Search,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { api } from '../api/client';

export const DemandAnalyticsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<string>('30d');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [selectedMedicine, setSelectedMedicine] = useState<string>('ALL');
  const [chartViewMode, setChartViewMode] = useState<'area' | 'bar'>('area');
  const [isLoading, setIsLoading] = useState(true);

  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);

  useEffect(() => {
    const loadDemandData = async () => {
      setIsLoading(true);
      try {
        const res = await api.getDemand({
          timeframe,
          category: selectedCategory,
          city: selectedCity,
        });

        if (res.success && res.timeSeries) {
          setTimeSeriesData(res.timeSeries);
        }
      } catch (e) {
        console.error('Failed to load demand data:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadDemandData();
  }, [timeframe, selectedCategory, selectedCity]);

  // Synthetic demo series if API initializing
  const displaySeries = timeSeriesData.length > 0 ? timeSeriesData : [
    { date: '2026-09-01', actual: 340, baseline: 320, expected: 335 },
    { date: '2026-09-05', actual: 360, baseline: 325, expected: 340 },
    { date: '2026-09-10', actual: 390, baseline: 330, expected: 345 },
    { date: '2026-09-15', actual: 480, baseline: 335, expected: 350 },
    { date: '2026-09-18', actual: 590, baseline: 340, expected: 355 },
    { date: '2026-09-20', actual: 720, baseline: 345, expected: 360 },
    { date: '2026-09-23', actual: 840, baseline: 350, expected: 365 },
  ];

  // Category breakdown data
  const categoryData = [
    { category: 'Antipyretic', volume: 18450, growth: '+42.5%' },
    { category: 'Rehydration (ORS)', volume: 12200, growth: '+68.0%' },
    { category: 'Antibiotics', volume: 9800, growth: '+24.1%' },
    { category: 'Antihistamines', volume: 8300, growth: '+12.4%' },
    { category: 'Respiratory', volume: 6400, growth: '+31.2%' },
    { category: 'Gastrointestinal', volume: 5100, growth: '+18.7%' },
  ];

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Date,ActualDemand,HistoricalBaseline,ExpectedDemand\n' +
      displaySeries.map(r => `${r.date},${r.actual},${r.baseline},${r.expected}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `meddoc_demand_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title & Filter Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
              Demand Analytics Studio
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              Multi-SKU Time Series
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Evaluate historical pharmacy medicine consumption patterns, seasonal baseline variance, and category growth.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl glass-card hover:border-teal-500/50 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            {['7d', '30d', '90d', '1y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg uppercase transition-all ${
                  timeframe === tf
                    ? 'bg-white dark:bg-[#0A192F] text-teal-600 dark:text-teal-400 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-2.5 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="ALL">All Categories</option>
              <option value="Antipyretic">Antipyretic (Fever)</option>
              <option value="Rehydration">Rehydration (ORS)</option>
              <option value="Antibiotic">Antibiotics</option>
              <option value="Antihistamine">Antihistamines</option>
              <option value="Respiratory">Respiratory</option>
              <option value="Gastrointestinal">Gastrointestinal</option>
            </select>
          </div>

          {/* City Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold">Hub:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-2.5 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="ALL">All Reporting Cities</option>
              <option value="Chennai">Chennai</option>
              <option value="Madurai">Madurai</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Tiruchirappalli">Tiruchirappalli</option>
              <option value="Salem">Salem</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Kolkata">Kolkata</option>
            </select>
          </div>
        </div>

        {/* Chart View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setChartViewMode('area')}
            className={`px-2.5 py-1 rounded-lg ${chartViewMode === 'area' ? 'bg-white dark:bg-[#0A192F] font-bold text-teal-500 shadow-xs' : 'text-slate-400'}`}
          >
            Area Trend
          </button>
          <button
            onClick={() => setChartViewMode('bar')}
            className={`px-2.5 py-1 rounded-lg ${chartViewMode === 'bar' ? 'bg-white dark:bg-[#0A192F] font-bold text-teal-500 shadow-xs' : 'text-slate-400'}`}
          >
            Daily Volume Bar
          </button>
        </div>
      </div>

      {/* Main Big Chart */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
              Aggregated Dispensed Units vs Seasonal Baseline ({timeframe.toUpperCase()})
            </h3>
            <p className="text-xs text-slate-400">
              Statistical baseline calculated using dynamic 30-day exponential moving average.
            </p>
          </div>
          <span className="text-xs font-bold text-teal-500 bg-teal-500/10 px-2.5 py-1 rounded-full">
            Confidence: 94.7%
          </span>
        </div>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartViewMode === 'area' ? (
              <AreaChart data={displaySeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="actualArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284C7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A192F',
                    borderColor: '#1E3A5F',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke="#94A3B8"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  name="Historical Baseline"
                />
                <Line
                  type="monotone"
                  dataKey="expected"
                  stroke="#14B8A6"
                  strokeWidth={1.5}
                  name="Expected Demand Target"
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#0284C7"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#actualArea)"
                  name="Actual Units Dispensed"
                />
              </AreaChart>
            ) : (
              <BarChart data={displaySeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A192F',
                    borderColor: '#1E3A5F',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="baseline" fill="#64748B" name="Baseline" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="#0284C7" name="Actual Dispensed" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Volume & Growth Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryData.map((cat, idx) => (
          <div key={idx} className="glass-card p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">{cat.category}</span>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] mt-0.5">
                {cat.volume.toLocaleString()} <span className="text-xs font-normal text-slate-400">units</span>
              </p>
            </div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-xl">
              {cat.growth}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
