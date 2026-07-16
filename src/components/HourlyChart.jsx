import React from 'react';

export default function HourlyChart({ data }) {
  if (!data || !data.hourly || data.hourly.length === 0) return null;

  return (
    <div className="glass-panel p-6 fade-in" style={{ animationDelay: '0.15s' }}>
      <h3 className="text-xl font-bold mb-4">Today's Hourly Forecast</h3>
      <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}>
        {data.hourly.map((h, i) => {
          const dateObj = new Date(h.time);
          const timeStr = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
          const isNow = i === 0;

          return (
            <div key={i} className="flex flex-col items-center min-w-[64px] bg-white/5 rounded-xl p-3 border" style={{ borderColor: isNow ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)' }}>
              <span className="text-xs font-medium mb-2" style={{ color: isNow ? 'var(--accent-color)' : 'rgba(255,255,255,0.5)' }}>{isNow ? 'Now' : timeStr}</span>
              <span className="text-lg font-bold mb-1">{h.temp}°</span>
              <div className="flex flex-col items-center mt-1">
                <span style={{ fontSize: '14px' }}>💧</span>
                <span className="text-[10px] opacity-70 mt-1">{h.precipitation > 0 ? `${h.precipitation}mm` : '0mm'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
