import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Map, MapPin, Activity, AlertTriangle, ShieldCheck, Layers, Store, Building, Phone } from 'lucide-react';
import { InteractiveIndiaMap, MapHub } from '../components/InteractiveIndiaMap';
import { api } from '../api/client';

export const GeographicPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const cityParam = searchParams.get('city') || 'Chennai';

  const [selectedHub, setSelectedHub] = useState<MapHub | null>(null);
  const [pharmacyList, setPharmacyList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPharmaciesForCity = async () => {
      setIsLoading(true);
      try {
        const res = await api.getPharmacies({ city: selectedHub?.city || cityParam });
        if (res.success) {
          setPharmacyList(res.data);
        }
      } catch (e) {
        console.error('Failed to load pharmacies:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPharmaciesForCity();
  }, [selectedHub, cityParam]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
              Geographic Intelligence & Spatial Surveillance
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              Metropolitan & District Hubs
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Geospatial density of unusual medicine demand patterns, local cluster velocity, and node telemetry.
          </p>
        </div>
      </div>

      {/* Main Interactive Map */}
      <InteractiveIndiaMap
        selectedCity={selectedHub?.city || cityParam}
        onSelectHub={(hub) => setSelectedHub(hub)}
      />

      {/* City Pharmacies Drilldown Grid */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
              Reporting Pharmacies in {selectedHub?.city || cityParam}
            </h3>
            <p className="text-xs text-slate-400">
              Active telemetry nodes transmitting daily dispensed quantities and inventory status
            </p>
          </div>
          <span className="text-xs font-bold text-teal-500">
            {pharmacyList.length} Connected Nodes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pharmacyList.map((pharm) => (
            <div
              key={pharm.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 space-y-2 hover:border-teal-500/40 transition-all"
            >
              <div className="flex items-start justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">
                  {pharm.name}
                </h4>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  pharm.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' :
                  pharm.status === 'WARNING' ? 'bg-amber-500/10 text-amber-500' :
                  'bg-rose-500/10 text-rose-500'
                }`}>
                  {pharm.status}
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {pharm.address}, {pharm.district}
              </p>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {pharm.contactNumber}
                </span>
                <span className="font-mono text-[10px] text-teal-500">{pharm.registrationNumber}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
