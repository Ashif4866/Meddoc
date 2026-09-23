import React, { useState } from 'react';
import { MapPin, Activity, AlertTriangle, ShieldCheck, Layers, Eye, Navigation, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

export interface MapHub {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  x: number; // SVG projection x %
  y: number; // SVG projection y %
  pharmacyCount: number;
  activeSpikes: number;
  criticalSpikes: number;
  shortages: number;
  status: 'CRITICAL' | 'HIGH' | 'WARNING' | 'NORMAL';
  topMedicine?: string;
  surgePct?: number;
}

interface InteractiveIndiaMapProps {
  onSelectHub?: (hub: MapHub) => void;
  selectedCity?: string;
  className?: string;
}

export const InteractiveIndiaMap: React.FC<InteractiveIndiaMapProps> = ({
  onSelectHub,
  selectedCity,
  className = '',
}) => {
  // Coordinated hubs across India mapped to realistic projection coordinates
  const hubs: MapHub[] = [
    { id: 'che', name: 'Chennai Central Zone', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, x: 56, y: 72, pharmacyCount: 640, activeSpikes: 5, criticalSpikes: 2, shortages: 3, status: 'CRITICAL', topMedicine: 'Paracetamol 650mg', surgePct: 142.5 },
    { id: 'mdu', name: 'Madurai District Hub', city: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198, x: 52, y: 84, pharmacyCount: 320, activeSpikes: 4, criticalSpikes: 1, shortages: 4, status: 'CRITICAL', topMedicine: 'ORS Electrolyte', surgePct: 168.0 },
    { id: 'cbe', name: 'Coimbatore West Hub', city: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558, x: 48, y: 78, pharmacyCount: 410, activeSpikes: 2, criticalSpikes: 0, shortages: 1, status: 'WARNING', topMedicine: 'Amoxicillin 500mg', surgePct: 42.0 },
    { id: 'try', name: 'Tiruchirappalli Care Corridor', city: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.7905, lng: 78.7047, x: 53, y: 79, pharmacyCount: 230, activeSpikes: 2, criticalSpikes: 0, shortages: 0, status: 'WARNING', topMedicine: 'Cetirizine 10mg', surgePct: 38.0 },
    { id: 'slm', name: 'Salem Regional Depot', city: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.1460, x: 51, y: 75, pharmacyCount: 190, activeSpikes: 1, criticalSpikes: 0, shortages: 0, status: 'NORMAL', topMedicine: 'Ibuprofen 400mg', surgePct: 18.0 },
    { id: 'blr', name: 'Bengaluru Metro Core', city: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, x: 47, y: 69, pharmacyCount: 750, activeSpikes: 2, criticalSpikes: 0, shortages: 2, status: 'HIGH', topMedicine: 'Oseltamivir 75mg', surgePct: 54.0 },
    { id: 'hyd', name: 'Hyderabad Cyber Hub', city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, x: 50, y: 56, pharmacyCount: 520, activeSpikes: 1, criticalSpikes: 0, shortages: 1, status: 'NORMAL', topMedicine: 'Metformin 500mg', surgePct: 12.0 },
    { id: 'mum', name: 'Mumbai Coastal Grid', city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, x: 34, y: 52, pharmacyCount: 890, activeSpikes: 2, criticalSpikes: 0, shortages: 2, status: 'HIGH', topMedicine: 'Azithromycin 500mg', surgePct: 62.0 },
    { id: 'del', name: 'National Capital Region', city: 'Delhi', state: 'Delhi NCR', lat: 28.6139, lng: 77.2090, x: 44, y: 26, pharmacyCount: 940, activeSpikes: 2, criticalSpikes: 0, shortages: 1, status: 'NORMAL', topMedicine: 'Montelukast 10mg', surgePct: 24.0 },
    { id: 'kol', name: 'Kolkata East Depot', city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, x: 74, y: 44, pharmacyCount: 480, activeSpikes: 1, criticalSpikes: 0, shortages: 1, status: 'NORMAL', topMedicine: 'Pantoprazole 40mg', surgePct: 15.0 },
  ];

  const [activeHoverHub, setActiveHoverHub] = useState<MapHub | null>(null);
  const [activeSelected, setActiveSelected] = useState<MapHub>(
    hubs.find(h => h.city === selectedCity) || hubs[0]
  );
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredHubs = hubs.filter(h => {
    if (filterSeverity === 'ALL') return true;
    return h.status === filterSeverity;
  });

  const handleHubClick = (hub: MapHub) => {
    setActiveSelected(hub);
    onSelectHub?.(hub);
  };

  return (
    <div className={`glass-card rounded-2xl p-4 lg:p-6 flex flex-col ${className}`}>
      {/* Top Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
              Geographic Surge Intelligence
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center gap-1">
              <Activity className="w-3 h-3 animate-pulse" /> 10 Active Hubs
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time geospatial pharmacy demand & shortage surveillance
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
          {['ALL', 'CRITICAL', 'HIGH', 'WARNING', 'NORMAL'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterSeverity === sev
                  ? 'bg-white dark:bg-[#0A192F] text-teal-600 dark:text-teal-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map View & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-center">
        {/* SVG Interactive Geo Map Canvas */}
        <div className="lg:col-span-7 relative h-[420px] bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-800 p-2 flex items-center justify-center select-none shadow-inner">
          {/* Subtle Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:28px_28px] opacity-40"></div>

          {/* India Regional Outline Silhouette */}
          <svg
            viewBox="0 0 400 480"
            className="w-full h-full max-h-[390px] drop-shadow-lg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Simplified India Geo Contour */}
            <path
              d="M175 40 L195 48 L220 70 L210 95 L250 115 L280 110 L300 135 L330 145 L320 170 L280 180 L290 210 L320 225 L300 250 L270 240 L250 265 L240 310 L220 360 L200 410 L195 435 L180 400 L160 350 L145 300 L135 250 L110 240 L90 200 L100 170 L130 155 L145 125 L160 90 Z"
              fill="#0F2744"
              stroke="#1E3A5F"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            {/* Coastal & Regional detail lines */}
            <path
              d="M195 435 L190 445 L185 435 Z"
              fill="#0F2744"
              stroke="#38BDF8"
              strokeWidth="1.2"
            />

            {/* Hub Nodes with Pulsating Rings */}
            {filteredHubs.map((hub) => {
              const isSelected = activeSelected.id === hub.id;
              const isCritical = hub.status === 'CRITICAL';
              const isHigh = hub.status === 'HIGH';
              const isWarning = hub.status === 'WARNING';

              const ringColor = isCritical ? '#EF4444' : isHigh ? '#F97316' : isWarning ? '#F59E0B' : '#10B981';

              const px = (hub.x / 100) * 400;
              const py = (hub.y / 100) * 480;

              return (
                <g
                  key={hub.id}
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => handleHubClick(hub)}
                  onMouseEnter={() => setActiveHoverHub(hub)}
                  onMouseLeave={() => setActiveHoverHub(null)}
                >
                  {/* Outer Pulsating Ring for High/Critical */}
                  {(isCritical || isHigh) && (
                    <circle
                      cx={px}
                      cy={py}
                      r={isSelected ? "18" : "14"}
                      fill="none"
                      stroke={ringColor}
                      strokeWidth="1.5"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}

                  {/* Halo Glow */}
                  <circle
                    cx={px}
                    cy={py}
                    r={isSelected ? "12" : "8"}
                    fill={ringColor}
                    fillOpacity={isSelected ? "0.4" : "0.2"}
                  />

                  {/* Core Node Circle */}
                  <circle
                    cx={px}
                    cy={py}
                    r={isSelected ? "6" : "4.5"}
                    fill={ringColor}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? "2" : "1.2"}
                  />

                  {/* City Label */}
                  <text
                    x={px + 9}
                    y={py + 3}
                    fill="#E2E8F0"
                    fontSize={isSelected ? "11" : "9.5"}
                    fontWeight={isSelected ? "bold" : "600"}
                    className="select-none pointer-events-none drop-shadow"
                  >
                    {hub.city}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Floating Map Legend */}
          <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md p-2 rounded-xl border border-slate-800 text-[10px] space-y-1 text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-white mb-1">
              <span>Heatmap Severity</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Critical Surge (Z &gt; 2.5)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span> High Signal (+60%)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Elevated (+30%)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Baseline Stable
            </div>
          </div>
        </div>

        {/* Selected Hub Intelligence Card */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0D1F3D] border border-slate-200 dark:border-slate-700/80 relative overflow-hidden">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Selected Hub Telemetry
                </span>
                <h4 className="text-lg font-extrabold text-slate-900 dark:text-white font-['Outfit']">
                  {activeSelected.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeSelected.city}, {activeSelected.state}
                </p>
              </div>

              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                activeSelected.status === 'CRITICAL'
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                  : activeSelected.status === 'HIGH'
                  ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30'
                  : activeSelected.status === 'WARNING'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              }`}>
                {activeSelected.status}
              </span>
            </div>

            {/* Metric Counters */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800">
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Pharmacies</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{activeSelected.pharmacyCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Active Spikes</span>
                <p className="text-sm font-bold text-rose-500">{activeSelected.activeSpikes}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Stock Deficits</span>
                <p className="text-sm font-bold text-amber-500">{activeSelected.shortages}</p>
              </div>
            </div>

            {/* Elevated Medicine Signal Highlight */}
            {activeSelected.topMedicine && (
              <div className="mt-3 p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-300">
                <div className="flex items-center justify-between font-semibold">
                  <span>Surging SKU: {activeSelected.topMedicine}</span>
                  <span className="font-bold text-rose-500">+{activeSelected.surgePct}%</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  Demand velocity significantly exceeding baseline limits. Signal queued for public health audit.
                </p>
              </div>
            )}
          </div>

          {/* Quick Hub Switcher Bar */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0D1F3D] border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Direct City Hub Jump:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {hubs.map((h) => (
                <button
                  key={h.id}
                  onClick={() => handleHubClick(h)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                    activeSelected.id === h.id
                      ? 'bg-teal-500 text-white shadow-xs font-bold'
                      : 'bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-500'
                  }`}
                >
                  {h.city} {h.activeSpikes > 0 ? `(${h.activeSpikes})` : ''}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
