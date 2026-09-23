import React, { useState } from 'react';
import { Search, Bell, Sparkles, Moon, Sun, Menu, User as UserIcon, LogOut, Shield, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Logo } from './Logo';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenCopilot: () => void;
  onOpenNotifications: () => void;
  unreadAlertCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onOpenCopilot,
  onOpenNotifications,
  unreadAlertCount = 4,
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'HEALTH_OFFICER':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'PHARMACY_MANAGER':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'SUPPLY_CHAIN_MANAGER':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 lg:px-6 flex items-center justify-between gap-4 shadow-xs">
      {/* Left: Mobile Menu & Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="lg:hidden">
          <Logo size="sm" showText={true} />
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center relative w-72 lg:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicines, pharmacies, cities, spikes..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:bg-white transition-all font-medium"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Meddoc AI Copilot Trigger */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 text-xs font-bold shadow-xs transition-all group"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
          <span className="hidden sm:inline">Meddoc Copilot</span>
          <span className="w-2 h-2 rounded-full bg-teal-500 group-hover:scale-125 transition-transform"></span>
        </button>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center animate-pulse">
              {unreadAlertCount}
            </span>
          )}
        </button>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(prev => !prev)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-sky-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
              {user?.name ? user.name.charAt(0) : 'D'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                {user?.name || 'Dr. Arjun'}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md border w-fit ${getRoleBadge(user?.role)}`}>
                {user?.role?.replace(/_/g, ' ') || 'HEALTH OFFICER'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {showProfileMenu && (
            <div
              className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
              onMouseLeave={() => setShowProfileMenu(false)}
            >
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                <p className="text-[10px] text-teal-600 font-semibold mt-0.5">{user?.organization}</p>
              </div>

              <div className="px-2 py-1.5">
                <div className="px-2.5 py-1.5 text-xs text-slate-600 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-teal-600" />
                  <span>Role: {user?.role}</span>
                </div>
                <div className="px-2.5 py-1.5 text-xs text-slate-600 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Meddoc Health Core</span>
                </div>
              </div>

              <div className="border-t border-slate-100 px-2 pt-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
