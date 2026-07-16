import React from 'react';

export default function AqiMeter({ data }) {
  if (!data) return null;

  // Determine color based on AQI value
  let statusColor = '#2af5c8'; // accent
  let textColorClass = 'text-accent';
  let bgColorClass = 'bg-accent/10';
  let borderColorClass = 'border-accent/20';

  if (data.aqi > 50) {
    statusColor = '#eab308'; // yellow-500
    textColorClass = 'text-yellow-500';
    bgColorClass = 'bg-yellow-500/10';
    borderColorClass = 'border-yellow-500/20';
  }
  if (data.aqi > 100) {
    statusColor = '#ef4444'; // red-500
    textColorClass = 'text-red-500';
    bgColorClass = 'bg-red-500/10';
    borderColorClass = 'border-red-500/20';
  }

  return (
    <div className="glass-panel p-6 sm:p-8 animate-fade-in w-full h-full flex flex-col justify-between" style={{ animationDelay: '0.2s' }}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-whiteBright m-0">Air Quality Index</h3>
        <div className={`px-4 py-1.5 rounded-full font-bold text-sm ${bgColorClass} ${textColorClass} ${borderColorClass} border`}>
          {data.status}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
        <div className="relative flex items-center justify-center w-28 h-28 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-white/10"
              strokeDasharray="100, 100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              stroke="currentColor" strokeWidth="3" fill="none"
            />
            <path
              strokeDasharray={`${Math.min(data.aqi, 100)}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              stroke={statusColor} strokeWidth="3" fill="none"
              style={{ transition: 'stroke-dasharray 1s ease-out' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-black text-whiteBright leading-none">{data.aqi}</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-1 text-center md:text-left">
          <p className="text-sm text-muted">Primary Pollutant</p>
          <p className="text-lg font-bold text-whiteBright">PM2.5</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto">
        <div className="bg-surface border border-borderTint p-4 rounded-xl hover:bg-surface/80 transition-colors">
          <div className="text-[11px] text-muted font-bold uppercase tracking-wider mb-1.5">PM2.5</div>
          <div className="font-bold text-lg text-whiteBright">{data.pm2_5} <span className="text-xs font-normal text-muted">µg/m³</span></div>
        </div>
        <div className="bg-surface border border-borderTint p-4 rounded-xl hover:bg-surface/80 transition-colors">
          <div className="text-[11px] text-muted font-bold uppercase tracking-wider mb-1.5">O3</div>
          <div className="font-bold text-lg text-whiteBright">{data.o3} <span className="text-xs font-normal text-muted">ppb</span></div>
        </div>
      </div>
    </div>
  );
}
