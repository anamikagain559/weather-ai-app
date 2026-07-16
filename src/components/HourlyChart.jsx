import React from 'react';

export default function HourlyChart({ data }) {
  if (!data || !data.hourly || data.hourly.length === 0) return null;

  return (
    <div className="glass-panel p-6 sm:p-8 animate-fade-in w-full h-full" style={{ animationDelay: '0.15s' }}>
      <h3 className="text-xl font-bold mb-6 text-whiteBright">Today's Hourly Forecast</h3>
      <div className="flex flex-row flex-wrap justify-center gap-3 pb-4">
        {data.hourly.map((h, i) => {
          const dateObj = new Date(h.time);
          const timeStr = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
          const isNow = i === 0;

          return (
            <div key={i} className={`flex flex-col items-center justify-between min-w-[75px] rounded-xl p-3 border transition-colors ${isNow ? 'bg-accent/10 border-accent/40 shadow-[0_0_15px_rgba(42,245,200,0.1)]' : 'bg-surface border-borderTint hover:bg-surface/80 hover:border-accent/30'}`}>
              <span className={`text-xs font-bold uppercase tracking-wider mb-3 ${isNow ? 'text-accent' : 'text-muted'}`}>{isNow ? 'Now' : timeStr}</span>
              <span className={`text-xl font-bold mb-3 ${isNow ? 'text-accent' : 'text-whiteBright'}`}>{h.temp}°</span>
              <div className="flex flex-col items-center mt-auto bg-black/20 w-full py-1.5 rounded-lg border border-white/5">
                <span style={{ fontSize: '12px' }}>💧</span>
                <span className="text-[10px] text-muted font-medium mt-1">{h.precipitation > 0 ? `${h.precipitation}mm` : '0mm'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
