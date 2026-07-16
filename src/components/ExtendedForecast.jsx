import React from 'react';

const ExtendedForecast = ({ data }) => {
  if (!data || !data.forecast || !data.forecast.forecastday) return null;

  return (
    <div className="glass-panel p-6 sm:p-8 animate-fade-in w-full flex flex-col" style={{ animationDelay: '0.4s' }}>
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-xl font-extrabold text-whiteBright tracking-tight">14-Day Extended Forecast</h3>
        <span className="font-mono text-[10px] font-bold tracking-widest text-accent2 bg-accent2/10 border border-accent2/20 px-2 py-0.5 rounded-sm uppercase">PRO+</span>
      </div>

      {/* 14-Day Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto w-full pb-4 snap-x" style={{ scrollbarWidth: 'thin' }}>
        {data.forecast.forecastday.map((day, index) => {
          const dateObj = new Date(day.date);
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const dateNum = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          return (
            <div 
              key={index} 
              className="flex flex-col items-center min-w-[90px] p-4 bg-surface/40 hover:bg-surface/80 rounded-2xl transition-all duration-300 snap-start border border-borderTint hover:border-accent/30 group"
            >
              <div className="flex flex-col items-center mb-3">
                <span className="font-bold text-whiteBright text-sm tracking-wider uppercase">{dayName}</span>
                <span className="text-[10px] font-medium text-muted">{dateNum}</span>
              </div>
              
              {day.day.condition.icon && (
                day.day.condition.icon.startsWith('http') || day.day.condition.icon.startsWith('//') ? (
                  <img 
                    src={day.day.condition.icon} 
                    alt={day.day.condition.text} 
                    className="w-12 h-12 object-contain mb-3 drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <div className="text-4xl mb-3 drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] group-hover:scale-110 transition-transform" title={day.day.condition.text}>
                    {day.day.condition.icon}
                  </div>
                )
              )}
              
              <div className="flex flex-col items-center gap-1 w-full">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-bold text-xl text-whiteBright">{Math.round(day.day.maxtemp_c)}°</span>
                  <span className="text-xs font-medium text-muted">{Math.round(day.day.mintemp_c)}°</span>
                </div>
                
                {day.day.daily_chance_of_rain > 0 && (
                  <div className="flex items-center gap-1 mt-2 bg-blue-500/10 px-2 py-0.5 rounded-full">
                    <span className="text-[9px]">💧</span>
                    <span className="text-[10px] font-bold text-blue-400">{day.day.daily_chance_of_rain}%</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExtendedForecast;
