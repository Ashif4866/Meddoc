import React from 'react';
import { X, Bell, AlertTriangle, AlertCircle, CheckCircle, Info, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts?: any[];
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  alerts = [],
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const defaultAlerts = [
    {
      id: 'alt-1',
      title: '⚡ Critical Surge: Paracetamol 650mg in Chennai',
      message: 'Sudden +142.5% demand surge detected at MedPulse Central. Statistical Z-score is 3.12 (Confidence 94.5%).',
      severity: 'CRITICAL',
      time: '12m ago',
      link: '/spikes',
    },
    {
      id: 'alt-2',
      title: '⚠️ Stockout Risk: ORS Electrolyte in Madurai',
      message: 'Inventory (18 sachets) will deplete in under 24 hours under +168% surge. Safety deficit: 62 units.',
      severity: 'CRITICAL',
      time: '45m ago',
      link: '/forecasting',
    },
    {
      id: 'alt-3',
      title: '🧬 Syndromic Co-Surge: Azithromycin + Paracetamol',
      message: 'Synchronized spike detected across 4 pharmacies in Central Chennai district (r = 0.84).',
      severity: 'HIGH',
      time: '2h ago',
      link: '/insights',
    },
    {
      id: 'alt-4',
      title: '📦 Low Stock Alert: Oseltamivir in Bengaluru',
      message: 'Stock fell below minimum reorder threshold (12 units vs 40 reorder level).',
      severity: 'WARNING',
      time: '4h ago',
      link: '/inventory',
    },
  ];

  const displayAlerts = alerts.length > 0 ? alerts : defaultAlerts;

  const getSeverityIcon = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case 'HIGH':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-teal-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-[#0A192F] h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-200">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0D1F3D]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">
                Live Intelligence Alerts
              </h3>
              <p className="text-xs text-slate-400">{displayAlerts.length} Unresolved Signals</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {displayAlerts.map((alt) => (
            <div
              key={alt.id}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0D1F3D] border border-slate-200 dark:border-slate-700/80 hover:border-teal-500/50 transition-all space-y-2"
            >
              <div className="flex items-start gap-2.5">
                <div className="shrink-0 mt-0.5">{getSeverityIcon(alt.severity)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {alt.title}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-2">{alt.time || 'Today'}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {alt.message}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    onClose();
                    navigate(alt.link || '/spikes');
                  }}
                  className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                >
                  <span>Investigate Signal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1F3D] text-center">
          <button
            onClick={() => {
              onClose();
              navigate('/alerts');
            }}
            className="w-full py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold transition-colors"
          >
            View All Alert Archives
          </button>
        </div>
      </div>
    </div>
  );
};
