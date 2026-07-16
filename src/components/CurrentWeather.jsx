import React from 'react';

const CurrentWeather = ({ data, forecast }) => {
  if (!data) return null;

  const { location, current } = data;
  
  // Extract high/low from forecast if available
  let high = '--';
  let low = '--';
  if (forecast && forecast.forecast && forecast.forecast.forecastday && forecast.forecast.forecastday.length > 0) {
    const today = forecast.forecast.forecastday[0].day;
    if (today) {
      high = today.maxtemp_c || '--';
      low = today.mintemp_c || '--';
    }
  }

  return (
    <div className="glass-panel py-10 sm:py-16 px-6 sm:px-10 animate-fade-in relative overflow-hidden flex flex-wrap xl:flex-col 2xl:flex-row justify-between items-center gap-10 w-full min-h-[400px]" style={{ animationDelay: '0.1s' }}>
      
      {/* Left side: Hero Weather */}
      <div className="flex items-center gap-6 sm:gap-10 w-full xl:w-auto">
        {current.condition.icon ? (
          current.condition.icon.startsWith('http') || current.condition.icon.startsWith('//') ? (
            <img 
              src={current.condition.icon} 
              alt={current.condition.text} 
              className="w-32 h-32 sm:w-48 sm:h-48 object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]" 
            />
          ) : (
            <div className="text-8xl sm:text-9xl drop-shadow-[0_0_30px_rgba(42,245,200,0.15)]" title={current.condition.text}>
              {current.condition.icon}
            </div>
          )
        ) : (
          <div className="text-8xl sm:text-9xl">🌤️</div>
        )}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <h1 className="text-8xl sm:text-9xl font-black tracking-tighter text-whiteBright leading-none">{Math.round(current.temp_c)}°</h1>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-whiteBright mt-3 tracking-tight">
            {location.name} <span className="text-xl font-normal text-muted ml-2">{location.country}</span>
          </h2>
          <p className="text-muted mt-2 text-base sm:text-lg font-medium">
            {current.condition.text} <span className="mx-2 opacity-50">•</span> Feels like {Math.round(current.feelslike_c)}° <span className="mx-2 opacity-50">•</span> H {Math.round(high)}° / L {Math.round(low)}°
          </p>
        </div>
      </div>

      {/* Right side: 6-block Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full 2xl:w-auto flex-1 max-w-[600px]">
        <div className="bg-surface/50 border border-borderTint p-5 rounded-2xl hover:bg-surface/80 hover:border-accent/40 transition-all duration-300 group">
          <div className="text-xs text-muted font-bold tracking-widest uppercase mb-2 group-hover:text-accent/80 transition-colors">Humidity</div>
          <div className="text-2xl font-extrabold text-whiteBright">{current.humidity}%</div>
        </div>
        <div className="bg-surface/50 border border-borderTint p-5 rounded-2xl hover:bg-surface/80 hover:border-accent/40 transition-all duration-300 group">
          <div className="text-xs text-muted font-bold tracking-widest uppercase mb-2 group-hover:text-accent/80 transition-colors">Wind</div>
          <div className="text-2xl font-extrabold text-whiteBright">{current.wind_kph} km/h</div>
        </div>
        <div className="bg-surface/50 border border-borderTint p-5 rounded-2xl hover:bg-surface/80 hover:border-accent/40 transition-all duration-300 group">
          <div className="text-xs text-muted font-bold tracking-widest uppercase mb-2 group-hover:text-accent/80 transition-colors">UV Index</div>
          <div className="text-2xl font-extrabold text-whiteBright">{current.uv}</div>
        </div>
        <div className="bg-surface/50 border border-borderTint p-5 rounded-2xl hover:bg-surface/80 hover:border-accent/40 transition-all duration-300 group">
          <div className="text-xs text-muted font-bold tracking-widest uppercase mb-2 group-hover:text-accent/80 transition-colors">Precip</div>
          <div className="text-2xl font-extrabold text-whiteBright">{current.precip_mm || 0} mm</div>
        </div>
        <div className="bg-surface/50 border border-borderTint p-5 rounded-2xl hover:bg-surface/80 hover:border-accent/40 transition-all duration-300 group">
          <div className="text-xs text-muted font-bold tracking-widest uppercase mb-2 group-hover:text-accent/80 transition-colors">Sunrise</div>
          <div className="text-2xl font-extrabold text-whiteBright">6:02 AM</div>
        </div>
        <div className="bg-surface/50 border border-borderTint p-5 rounded-2xl hover:bg-surface/80 hover:border-accent/40 transition-all duration-300 group">
          <div className="text-xs text-muted font-bold tracking-widest uppercase mb-2 group-hover:text-accent/80 transition-colors">Sunset</div>
          <div className="text-2xl font-extrabold text-whiteBright">7:31 PM</div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
