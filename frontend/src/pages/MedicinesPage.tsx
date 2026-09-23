import React, { useEffect, useState } from 'react';
import { Pill, Search, Filter, ShieldCheck, Activity, BarChart2, Layers } from 'lucide-react';
import { api } from '../api/client';
import { Medicine } from '../types';

export const MedicinesPage: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchMedicines = async () => {
    setIsLoading(true);
    try {
      const res = await api.getMedicines({ category: categoryFilter, search: searchQuery });
      if (res.success) setMedicines(res.data);
    } catch (e) {
      console.error('Failed to load medicines:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [categoryFilter, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
              Monitored Medicines & Formulations Catalog
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              18 Tracked Essential SKUs
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Essential antipyretics, antibiotics, rehydration salts, and respiratory therapeutics monitored for anomalies.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search brand, generic name, or manufacturer..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-2.5 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="ALL">All Therapeutic Categories</option>
              <option value="Antipyretic">Antipyretic</option>
              <option value="Rehydration">Rehydration</option>
              <option value="Antibiotic">Antibiotic</option>
              <option value="Antihistamine">Antihistamine</option>
              <option value="Respiratory">Respiratory</option>
              <option value="Gastrointestinal">Gastrointestinal</option>
              <option value="Antidiabetic">Antidiabetic</option>
            </select>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          {medicines.length} Medicines Monitored
        </span>
      </div>

      {/* Medicines Table */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="pb-2">Medicine Brand / Dosage</th>
                <th className="pb-2">Generic Formulation</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Primary Manufacturer</th>
                <th className="pb-2">Dispensing Unit</th>
                <th className="pb-2 text-right">Surveillance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {medicines.map((med) => (
                <tr key={med.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-500">
                      <Pill className="w-3.5 h-3.5" />
                    </div>
                    <span>{med.name}</span>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">
                    {med.genericName}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {med.category}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">
                    {med.manufacturer}
                  </td>
                  <td className="py-3 font-mono text-slate-400">
                    {med.unit}
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                      Active Telemetry
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
