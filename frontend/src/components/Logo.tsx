import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl font-bold',
    lg: 'text-2xl font-extrabold',
    xl: 'text-3xl font-extrabold',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Modern Medical Cross + Vital Pulse Icon */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 via-sky-500 to-indigo-600 p-0.5 shadow-sm shadow-teal-500/20 ${iconSizes[size]}`}>
        <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1 relative overflow-hidden">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-xs"
          >
            {/* Medical Cross Base */}
            <path
              d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V9H20C20.5523 9 21 9.44772 21 10V14C21 14.5523 20.5523 15 20 15H15V20C15 20.5523 14.5523 21 14 21H10C9.44772 21 9 20.5523 9 20V15H4C3.44772 15 3 14.5523 3 14V10C3 9.44772 3.44772 9 4 9H9V4Z"
              fill="#0284C7"
              fillOpacity="0.18"
            />
            {/* Dynamic Vital Pulse Signal Line */}
            <path
              d="M2 12.5H6.5L8.5 7.5L12 17.5L14.5 10L16.5 13.5H22"
              stroke="#0D9488"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="17.5" r="1.5" fill="#0284C7" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className={`flex items-baseline tracking-tight ${textSizes[size]}`}>
            <span className="text-slate-900 font-extrabold font-['Outfit']">Med</span>
            <span className="text-teal-600 font-extrabold font-['Outfit']">doc</span>
            <span className="ml-1.5 px-1.5 py-0.2 text-[9px] font-bold rounded-md bg-teal-50 text-teal-700 uppercase tracking-wider border border-teal-200">AI</span>
          </div>
          {size === 'xl' && (
            <span className="text-[11px] font-medium text-slate-500">
              AI-Powered Pharmacy Spike Tracker & Health Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  );
};
