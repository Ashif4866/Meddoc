import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change: string;
  trend?: 'up' | 'down' | 'neutral';
  severity?: 'NORMAL' | 'WARNING' | 'HIGH' | 'CRITICAL' | string;
  sparkline?: number[];
  icon: React.ReactNode;
  comparisonText?: string;
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  trend = 'up',
  severity,
  sparkline = [],
  icon,
  comparisonText,
  onClick,
}) => {
  const getSparklineSvg = (data: number[]) => {
    if (!data.length) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 80;
    const height = 28;

    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    }).join(' ');

    const strokeColor = severity === 'CRITICAL' 
      ? '#E11D48' 
      : severity === 'HIGH' 
      ? '#EA580C' 
      : severity === 'WARNING' 
      ? '#D97706' 
      : '#0D9488';

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  const getSeverityBadge = () => {
    if (!severity) return null;
    if (severity === 'CRITICAL') {
      return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">Critical</span>;
    }
    if (severity === 'HIGH') {
      return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">High Priority</span>;
    }
    if (severity === 'WARNING') {
      return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Elevated</span>;
    }
    return null;
  };

  return (
    <div
      onClick={onClick}
      className={`glass-card p-5 rounded-2xl relative overflow-hidden transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-teal-500/50 hover:-translate-y-0.5 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-extrabold text-slate-900 font-['Outfit']">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {getSeverityBadge()}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 shrink-0 shadow-2xs">
          {icon}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-teal-600" />}
          {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-rose-600" />}
          {trend === 'neutral' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
          <span className={trend === 'up' ? 'text-teal-700' : trend === 'down' ? 'text-rose-600' : 'text-slate-600'}>
            {change}
          </span>
          {comparisonText && (
            <span className="text-slate-400 font-normal hidden sm:inline">
              {comparisonText}
            </span>
          )}
        </div>

        {sparkline.length > 0 && (
          <div className="opacity-95">
            {getSparklineSvg(sparkline)}
          </div>
        )}
      </div>
    </div>
  );
};
