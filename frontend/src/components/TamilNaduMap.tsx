import React, { useState } from 'react';
import { MapPin, Activity, AlertTriangle, ShieldCheck, Database, Navigation, ZoomIn, Eye, Sparkles } from 'lucide-react';

export interface TNZone {
  id: string;
  name: string;
  district: string;
  category: 'state_hub' | 'chennai_zone';
  x: number; // SVG X coordinate %
  y: number; // SVG Y coordinate %
  pharmacyCount: number;
  activeSpikes: number;
  criticalSpikes: number;
  status: 'CRITICAL' | 'HIGH' | 'WARNING' | 'NORMAL';
  topMedicine: string;
  surgePct: number;
  description: string;
}

interface TamilNaduMapProps {
  onSelectZone?: (zone: TNZone) => void;
  className?: string;
}

export const TamilNaduMap: React.FC<TamilNaduMapProps> = ({ onSelectZone, className = '' }) => {
  const [viewMode, setViewMode] = useState<'TN_STATE' | 'CHENNAI_CITY'>('TN_STATE');

  // Tamil Nadu District Hubs
  const tnDistricts: TNZone[] = [
    { id: 'tn-che', name: 'Chennai Metropolitan', district: 'Chennai', category: 'state_hub', x: 82, y: 15, pharmacyCount: 640, activeSpikes: 5, criticalSpikes: 2, status: 'CRITICAL', topMedicine: 'Paracetamol 650mg', surgePct: 142.5, description: 'Elevated demand across antipyretics & acute respiratory formulations in urban zones.' },
    { id: 'tn-mdu', name: 'Madurai District Hub', district: 'Madurai', category: 'state_hub', x: 50, y: 72, pharmacyCount: 320, activeSpikes: 4, criticalSpikes: 1, status: 'CRITICAL', topMedicine: 'ORS Electrolyte Sachets', surgePct: 168.0, description: 'Acute enteric co-surge identified between ORS & Zinc Sulfate formulations.' },
    { id: 'tn-cbe', name: 'Coimbatore Industrial Core', district: 'Coimbatore', category: 'state_hub', x: 26, y: 52, pharmacyCount: 410, activeSpikes: 2, criticalSpikes: 0, status: 'WARNING', topMedicine: 'Amoxicillin 500mg', surgePct: 42.0, description: 'Mild demand surge in broad-spectrum antibiotics; inventory stock adequate.' },
    { id: 'tn-try', name: 'Tiruchirappalli Central Zone', district: 'Tiruchirappalli', category: 'state_hub', x: 55, y: 54, pharmacyCount: 230, activeSpikes: 2, criticalSpikes: 0, status: 'WARNING', topMedicine: 'Cetirizine 10mg', surgePct: 38.0, description: 'Standard seasonal upper respiratory antihistamine demand variation.' },
    { id: 'tn-slm', name: 'Salem Regional Depot', district: 'Salem', category: 'state_hub', x: 44, y: 38, pharmacyCount: 190, activeSpikes: 1, criticalSpikes: 0, status: 'NORMAL', topMedicine: 'Ibuprofen 400mg', surgePct: 18.0, description: 'Baseline consumption parameters within normal standard deviation limits.' },
    { id: 'tn-vel', name: 'Vellore Healthcare Hub', district: 'Vellore', category: 'state_hub', x: 68, y: 19, pharmacyCount: 160, activeSpikes: 1, criticalSpikes: 0, status: 'NORMAL', topMedicine: 'Pantoprazole 40mg', surgePct: 12.0, description: 'Normal baseline gastrointestinal dispensing activity.' },
    { id: 'tn-tin', name: 'Tirunelveli South Hub', district: 'Tirunelveli', category: 'state_hub', x: 42, y: 88, pharmacyCount: 140, activeSpikes: 1, criticalSpikes: 0, status: 'NORMAL', topMedicine: 'Metformin 500mg', surgePct: 9.0, description: 'Stable chronic metabolic medicine consumption patterns.' },
    { id: 'tn-thj', name: 'Thanjavur Delta Zone', district: 'Thanjavur', category: 'state_hub', x: 66, y: 58, pharmacyCount: 120, activeSpikes: 0, criticalSpikes: 0, status: 'NORMAL', topMedicine: 'Doxycycline 100mg', surgePct: 6.0, description: 'Optimal baseline inventory across all reporting nodes.' },
  ];

  // Chennai City Micro-Zones
  const chennaiZones: TNZone[] = [
    { id: 'che-tng', name: 'T. Nagar (MedPulse Central)', district: 'Chennai Central', category: 'chennai_zone', x: 50, y: 48, pharmacyCount: 145, activeSpikes: 2, criticalSpikes: 1, status: 'CRITICAL', topMedicine: 'Paracetamol 650mg', surgePct: 142.5, description: '42 Usman Road • Severe fever surge (+142.5%) above 30-day baseline.' },
    { id: 'che-ann', name: 'Anna Nagar (Metro Health Hub)', district: 'Chennai North', category: 'chennai_zone', x: 38, y: 32, pharmacyCount: 120, activeSpikes: 1, criticalSpikes: 1, status: 'CRITICAL', topMedicine: 'Azithromycin 500mg', surgePct: 88.4, description: '2nd Avenue • Elevated respiratory anti-infectives demand.' },
    { id: 'che-ady', name: 'Adyar (Apex Care Pharmacy)', district: 'Chennai South', category: 'chennai_zone', x: 62, y: 65, pharmacyCount: 95, activeSpikes: 1, criticalSpikes: 0, status: 'HIGH', topMedicine: 'Cough Syrup (Dextro)', surgePct: 74.2, description: 'Gandhi Nagar • Symptomatic cough and cold surge detected.' },
    { id: 'che-vel', name: 'Velachery (LifeLine Chemists)', district: 'Chennai South', category: 'chennai_zone', x: 56, y: 78, pharmacyCount: 110, activeSpikes: 1, criticalSpikes: 0, status: 'WARNING', topMedicine: 'Cetirizine 10mg', surgePct: 35.0, description: '100ft Bypass Road • Moderate antihistamine increase.' },
    { id: 'che-tam', name: 'Tambaram (Community Pharmacy)', district: 'Chengalpattu/South', category: 'chennai_zone', x: 34, y: 88, pharmacyCount: 170, activeSpikes: 0, criticalSpikes: 0, status: 'NORMAL', topMedicine: 'ORS Electrolyte', surgePct: 14.0, description: 'GST Road • Normal dispensing volume with adequate buffer.' },
  ];

  const currentList = viewMode === 'TN_STATE' ? tnDistricts : chennaiZones;
  const [selectedZone, setSelectedZone] = useState<TNZone>(currentList[0]);

  const handleSelect = (zone: TNZone) => {
    setSelectedZone(zone);
    onSelectZone?.(zone);
  };

  return (
    <div className={`glass-card rounded-2xl p-5 sm:p-6 flex flex-col space-y-4 ${className}`}>
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              {viewMode === 'TN_STATE' ? 'Tamil Nadu Regional Surveillance Map' : 'Chennai City Micro-Zone Hotspots'}
            </h3>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              Live Geo-Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {viewMode === 'TN_STATE'
              ? 'Real-time telemetry across 8 core healthcare hubs in Tamil Nadu'
              : 'Neighborhood dispensary monitoring in Chennai Metropolitan Area'}
          </p>
        </div>

        {/* View Mode Toggle Button */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold border border-slate-200">
          <button
            onClick={() => {
              setViewMode('TN_STATE');
              setSelectedZone(tnDistricts[0]);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'TN_STATE'
                ? 'bg-teal-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🗺️ Tamil Nadu State View
          </button>
          <button
            onClick={() => {
              setViewMode('CHENNAI_CITY');
              setSelectedZone(chennaiZones[0]);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'CHENNAI_CITY'
                ? 'bg-teal-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📍 Chennai City Zoom
          </button>
        </div>
      </div>

      {/* Map + Detail Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Map Container (Clean White / Light Blue Style) */}
        <div className="lg:col-span-7 relative h-[380px] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 p-3 flex items-center justify-center select-none shadow-inner">
          {/* Light Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] opacity-70"></div>

          {viewMode === 'TN_STATE' ? (
            /* Tamil Nadu State Outline SVG */
            <svg viewBox="0 0 380 420" className="w-full h-full max-h-[350px] drop-shadow-md" fill="none">
              {/* Land Polygon */}
              <path
                d="M 280 40 
                   L 320 60 
                   L 310 100 
                   L 260 160 
                   L 270 210 
                   L 250 250 
                   L 230 300 
                   L 170 380 
                   L 155 395 
                   L 140 370 
                   L 125 320 
                   L 100 270 
                   L 85 220 
                   L 120 180 
                   L 150 160 
                   L 175 120 
                   L 210 90 
                   L 250 70 Z"
                fill="#E0F2FE"
                stroke="#0284C7"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Bay of Bengal label */}
              <text x="250" y="320" fill="#0284C7" opacity="0.4" fontSize="12" fontWeight="800" letterSpacing="2">
                BAY OF BENGAL
              </text>

              {/* District Hotspot Nodes */}
              {tnDistricts.map((zone) => {
                const isSelected = selectedZone.id === zone.id;
                const isCrit = zone.status === 'CRITICAL';
                const isWarn = zone.status === 'WARNING';
                const color = isCrit ? '#E11D48' : isWarn ? '#D97706' : '#059669';

                const px = (zone.x / 100) * 380;
                const py = (zone.y / 100) * 420;

                return (
                  <g
                    key={zone.id}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => handleSelect(zone)}
                  >
                    {isCrit && (
                      <circle cx={px} cy={py} r={isSelected ? "18" : "13"} fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" className="animate-ping" />
                    )}
                    <circle cx={px} cy={py} r={isSelected ? "12" : "8"} fill={color} fillOpacity={isSelected ? "0.4" : "0.2"} />
                    <circle cx={px} cy={py} r={isSelected ? "6" : "4.5"} fill={color} stroke="#FFFFFF" strokeWidth={isSelected ? "2.5" : "1.5"} />
                    <text
                      x={px + 8}
                      y={py + 3}
                      fill="#0F172A"
                      fontSize={isSelected ? "11.5" : "10"}
                      fontWeight={isSelected ? "800" : "700"}
                      className="drop-shadow-xs select-none pointer-events-none"
                    >
                      {zone.district}
                    </text>
                  </g>
                );
              })}
            </svg>
          ) : (
            /* Chennai City Micro-Zone Zoom SVG */
            <svg viewBox="0 0 380 420" className="w-full h-full max-h-[350px] drop-shadow-md" fill="none">
              {/* Coastal Chennai Contour */}
              <path
                d="M 60 40 
                   L 260 40 
                   L 280 120 
                   L 290 200 
                   L 300 280 
                   L 280 370 
                   L 230 390 
                   L 90 380 
                   L 50 250 
                   L 55 120 Z"
                fill="#CCFBF1"
                stroke="#0D9488"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Marina Beach coastline */}
              <path d="M 260 40 L 280 120 L 290 200 L 300 280 L 280 370" stroke="#0284C7" strokeWidth="3.5" opacity="0.8" />
              <text x="210" y="240" fill="#0284C7" opacity="0.5" fontSize="10" fontWeight="bold" transform="rotate(75, 210, 240)">
                COROMANDEL COAST
              </text>

              {/* Chennai Zone Pins */}
              {chennaiZones.map((zone) => {
                const isSelected = selectedZone.id === zone.id;
                const isCrit = zone.status === 'CRITICAL';
                const isHigh = zone.status === 'HIGH';
                const isWarn = zone.status === 'WARNING';
                const color = isCrit ? '#E11D48' : isHigh ? '#EA580C' : isWarn ? '#D97706' : '#059669';

                const px = (zone.x / 100) * 380;
                const py = (zone.y / 100) * 420;

                return (
                  <g
                    key={zone.id}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => handleSelect(zone)}
                  >
                    {(isCrit || isHigh) && (
                      <circle cx={px} cy={py} r={isSelected ? "18" : "14"} fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" className="animate-ping" />
                    )}
                    <circle cx={px} cy={py} r={isSelected ? "12" : "8"} fill={color} fillOpacity={isSelected ? "0.4" : "0.2"} />
                    <circle cx={px} cy={py} r={isSelected ? "6.5" : "5"} fill={color} stroke="#FFFFFF" strokeWidth={isSelected ? "2.5" : "1.5"} />
                    <text
                      x={px + 8}
                      y={py + 3}
                      fill="#0F172A"
                      fontSize={isSelected ? "12" : "10.5"}
                      fontWeight={isSelected ? "800" : "700"}
                      className="drop-shadow-xs select-none pointer-events-none"
                    >
                      {zone.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}

          {/* Map Legend */}
          <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 text-[10px] space-y-1 text-slate-600 shadow-xs">
            <span className="font-bold text-slate-900 block mb-0.5">Surveillance Legend</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Critical Spike (+120%)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Warning (+30%)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Normal Baseline
            </div>
          </div>
        </div>

        {/* Selected District / Zone Details Card */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  {viewMode === 'TN_STATE' ? 'Selected District Telemetry' : 'Chennai Zone Node'}
                </span>
                <h4 className="text-base sm:text-lg font-extrabold text-slate-900 font-['Outfit']">
                  {selectedZone.name}
                </h4>
                <p className="text-xs text-slate-500">
                  {selectedZone.district}, Tamil Nadu
                </p>
              </div>

              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                selectedZone.status === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                selectedZone.status === 'HIGH' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                selectedZone.status === 'WARNING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {selectedZone.status}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedZone.description}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Surging SKU</span>
                <p className="text-xs font-bold text-slate-900 truncate">{selectedZone.topMedicine}</p>
                <span className="text-xs font-extrabold text-rose-600">+{selectedZone.surgePct}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Pharmacies</span>
                <p className="text-xs font-bold text-slate-900">{selectedZone.pharmacyCount} Monitored</p>
                <span className="text-[11px] font-bold text-teal-600">{selectedZone.activeSpikes} Active Signals</span>
              </div>
            </div>
          </div>

          {/* Quick Hub Navigation Pills */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Quick Select Location:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentList.map((z) => (
                <button
                  key={z.id}
                  onClick={() => handleSelect(z)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    selectedZone.id === z.id
                      ? 'bg-teal-600 text-white font-bold shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-teal-500 hover:text-teal-600'
                  }`}
                >
                  {z.name.split(' ')[0]} {z.activeSpikes > 0 ? `(${z.activeSpikes})` : ''}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
