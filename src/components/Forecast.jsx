import React from 'react';

const Forecast = ({ data, location, current }) => {
  if (!data || !data.forecast || !data.forecast.forecastday) return null;

  return (
    <div className="glass-panel p-6 sm:p-8 animate-fade-in w-full h-full flex flex-col justify-between" style={{ animationDelay: '0.2s' }}>
      
      {/* Top Section matching Tracked Cities card */}
      {location && current && (
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-extrabold text-whiteBright tracking-tight">Tracked Cities</h3>
            <p className="text-sm text-muted mt-1">5-day overview</p>
            <div className="mt-4">
              <span className="text-6xl font-bold tracking-tighter text-white">{Math.round(current.temp_c)}°</span>
            </div>
          </div>
          <div className="flex flex-col items-end text-right">
            {current.condition.icon && (
              current.condition.icon.startsWith('http') || current.condition.icon.startsWith('//') ? (
                <img src={current.condition.icon} alt={current.condition.text} className="w-16 h-16 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] mb-2" />
              ) : (
                <div className="text-5xl mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" title={current.condition.text}>{current.condition.icon}</div>
              )
            )}
            <span className="text-sm font-medium text-whiteBright">{current.condition.text}</span>
            <span className="text-xs text-muted mt-1">
              {location.name}, {location.country}
            </span>
          </div>
        </div>
      )}

      {/* 5-Day Horizontal Forecast */}
      <div className="flex justify-between items-center flex-1 gap-2 overflow-x-auto w-full px-2" style={{ scrollbarWidth: 'none' }}>
        {data.forecast.forecastday.map((day, index) => {
          const dateObj = new Date(day.date);
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

          return (
            <div key={index} className="flex flex-col items-center justify-between min-w-[70px] p-2 hover:bg-surface rounded-xl transition-colors snap-start border border-transparent hover:border-borderTint">
              <span className="font-bold text-muted text-sm tracking-wider uppercase mb-3">{dayName}</span>
              {day.day.condition.icon && (
                day.day.condition.icon.startsWith('http') || day.day.condition.icon.startsWith('//') ? (
                  <img 
                    src={day.day.condition.icon} 
                    alt={day.day.condition.text} 
                    className="w-10 h-10 object-contain mb-3 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                  />
                ) : (
                  <div className="text-3xl mb-3 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" title={day.day.condition.text}>
                    {day.day.condition.icon}
                  </div>
                )
              )}
              <div className="flex flex-col items-center gap-1">
                <span className="font-bold text-lg text-whiteBright">{Math.round(day.day.maxtemp_c)}°</span>
                <span className="text-xs font-medium text-muted">{Math.round(day.day.mintemp_c)}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forecast;
