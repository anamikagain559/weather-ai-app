import React from 'react';

const CurrentWeather = ({ data }) => {
  if (!data) return null;

  const { location, current } = data;

  return (
    <div className="glass-panel p-6 fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">{location.name}</h2>
          <p className="text-muted">{location.country}</p>
        </div>
        <img 
          src={current.condition.icon} 
          alt={current.condition.text} 
          className="weather-icon-large"
        />
      </div>
      
      <div className="mt-4">
        <h1 className="text-4xl text-gradient">{current.temp_c}°C</h1>
        <p className="text-lg font-medium mt-2">{current.condition.text}</p>
        <p className="text-sm text-muted">Feels like {current.feelslike_c}°C</p>
      </div>

      <div className="grid-3 mt-6 pt-6" style={{ borderTop: '1px solid var(--glass-border)' }}>
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted font-bold text-uppercase">Humidity</span>
          <span className="font-medium text-lg">{current.humidity}%</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted font-bold text-uppercase">Wind</span>
          <span className="font-medium text-lg">{current.wind_kph} km/h</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted font-bold text-uppercase">UV Index</span>
          <span className="font-medium text-lg">{current.uv}</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
