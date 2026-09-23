import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Activity,
  Map,
  Sparkles,
  Bell,
  Boxes,
  Store,
  Pill,
  FileText,
  Settings,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Logo } from './Logo';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Demand Analytics', path: '/analytics', icon: TrendingUp },
    { label: 'Spike Detection', path: '/spikes', icon: Activity, badge: 'Live' },
    { label: 'Geographic Map', path: '/geographic', icon: Map },
    { label: 'AI Forecasting', path: '/forecasting', icon: Zap },
    { label: 'AI Insights', path: '/insights', icon: Sparkles },
    { label: 'Alerts', path: '/alerts', icon: Bell, badge: '4' },
    { label: 'Inventory', path: '/inventory', icon: Boxes },
    { label: 'Pharmacies', path: '/pharmacies', icon: Store },
    { label: 'Medicines Catalog', path: '/medicines', icon: Pill },
    { label: 'Intelligence Reports', path: '/reports', icon: FileText },
    { label: 'Data Ingestion / Sim', path: '/data-ingestion', icon: UploadCloud },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 flex flex-col bg-white border-r border-slate-200 shadow-xs ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
          <Logo size="md" showText={!isCollapsed} />
          
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 border border-teal-200/80 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110`} />
              
              {!isCollapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}

              {!isCollapsed && item.badge && (
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                  item.badge === 'Live'
                    ? 'bg-teal-100 text-teal-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {item.badge}
                </span>
              )}

              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </div>

        {/* Bottom Status Box */}
        <div className="p-3 border-t border-slate-200">
          <div className="rounded-xl p-2.5 bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping"></div>
            {!isCollapsed && (
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                  Meddoc Core <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Monitoring 2.5K nodes</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
