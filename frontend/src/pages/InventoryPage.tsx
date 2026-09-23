import React, { useEffect, useState } from 'react';
import {
  Boxes,
  ArrowRight,
  TrendingDown,
  RefreshCw,
  Search,
  Filter,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { api } from '../api/client';
import { InventoryItem } from '../types';

export const InventoryPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const [invRes, trfRes] = await Promise.all([
        api.getInventory({ status: statusFilter, category: categoryFilter, search: searchQuery }),
        api.getTransferRecommendations(),
      ]);

      if (invRes.success) setItems(invRes.data);
      if (trfRes.success) setTransfers(trfRes.recommendations);
    } catch (e) {
      console.error('Failed to load inventory:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [statusFilter, categoryFilter, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
              Pharmacy Inventory & Stock Balancing
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              Cross-Node Stock Allocation
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor decentralized pharmacy stocks, identify stockout risks, and optimize inter-pharmacy transfers.
          </p>
        </div>
      </div>

      {/* Inter-Pharmacy Reallocation Proposals */}
      {transfers.length > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-medical-900/40 via-teal-900/30 to-navy-900/40 border border-teal-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-['Outfit']">
                  AI Automated Stock Balancing Recommendations
                </h3>
                <p className="text-xs text-slate-300">
                  Surplus donor nodes identified to mitigate critical local deficits
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-teal-400 bg-teal-500/15 px-3 py-1 rounded-full border border-teal-500/30">
              {transfers.length} Active Transfer Proposals
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {transfers.map((trf) => (
              <div
                key={trf.id}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 flex flex-col justify-between space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-teal-300">{trf.medicineName}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      From: <span className="text-slate-200">{trf.fromPharmacy} ({trf.fromCity})</span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      To: <span className="text-rose-400">{trf.toPharmacy} ({trf.toCity})</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-extrabold text-teal-400">
                      +{trf.recommendedQuantity} units
                    </span>
                    <span className="text-[10px] text-slate-400 block">Est: ~{trf.estimatedDistanceKm} km</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-amber-400 font-semibold">Priority: {trf.priority}</span>
                  <button
                    onClick={() => alert(`Transfer order ${trf.id} authorized! Logistics dispatch notified.`)}
                    className="px-3 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold text-[11px] transition-colors"
                  >
                    Authorize Dispatch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Inventory Table */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SKU or pharmacy..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
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
                <option value="CRITICAL">Critical Stockout</option>
                <option value="LOW_STOCK">Low Stock</option>
                <option value="OPTIMAL">Optimal</option>
                <option value="OVERSTOCKED">Overstocked</option>
              </select>
            </div>
          </div>

          <span className="text-xs font-semibold text-slate-400">
            {items.length} Tracked Pharmacy Inventories
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="pb-2">Medicine SKU</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Pharmacy Node</th>
                <th className="pb-2">City</th>
                <th className="pb-2">Current Stock</th>
                <th className="pb-2">Reorder Point</th>
                <th className="pb-2">Days of Supply</th>
                <th className="pb-2 text-right">Stock Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">
                    {item.medicine?.name}
                  </td>
                  <td className="py-3 text-slate-400">
                    {item.medicine?.category}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">
                    {item.pharmacy?.name}
                  </td>
                  <td className="py-3 text-slate-400">
                    {item.pharmacy?.city}
                  </td>
                  <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">
                    {item.currentStock} {item.medicine?.unit}
                  </td>
                  <td className="py-3 font-mono text-slate-400">
                    {item.reorderLevel}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      (item.daysOfSupply || 10) <= 2 ? 'bg-rose-500/15 text-rose-500' :
                      (item.daysOfSupply || 10) <= 5 ? 'bg-amber-500/15 text-amber-500' :
                      'bg-emerald-500/15 text-emerald-500'
                    }`}>
                      {item.daysOfSupply || 8}d
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                      item.status === 'LOW_STOCK' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                      item.status === 'OVERSTOCKED' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                      'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    }`}>
                      {item.status}
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
