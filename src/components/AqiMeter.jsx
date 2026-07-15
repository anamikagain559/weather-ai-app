import React from 'react';

export default function AqiMeter({ data }) {
  if (!data) return null;

  // Determine color based on AQI value
  let statusColor = 'var(--success-color)';
  if (data.aqi > 50) statusColor = 'var(--warning-color)';
  if (data.aqi > 100) statusColor = 'var(--danger-color)';

  return (
    <div className="glass-panel p-6 fade-in" style={{ animationDelay: '0.3s' }}>
      <h3 className="text-lg font-bold mb-4 flex items-center justify-between">
        Air Quality
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
          <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
        </svg>
      </h3>
      
      <div className="flex items-center gap-6 mb-6">
        <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
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
            <span className="text-2xl font-bold leading-none">{data.aqi}</span>
          </div>
        </div>
        
        <div>
          <p className="text-xl font-bold" style={{ color: statusColor }}>{data.status}</p>
          <p className="text-sm opacity-70">Primary pollutant: PM2.5</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2 pt-4 border-t border-white/10">
        <div>
          <p className="text-xs opacity-70 mb-1">PM2.5</p>
          <p className="font-medium">{data.pm2_5} <span className="text-xs opacity-50">µg/m³</span></p>
        </div>
        <div>
          <p className="text-xs opacity-70 mb-1">O3</p>
          <p className="font-medium">{data.o3} <span className="text-xs opacity-50">ppb</span></p>
        </div>
      </div>
    </div>
  );
}
