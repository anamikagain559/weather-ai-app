import React from 'react';

const Forecast = ({ data }) => {
  if (!data || !data.forecast || !data.forecast.forecastday) return null;

  return (
    <div className="glass-panel p-6 fade-in" style={{ animationDelay: '0.2s' }}>
      <h3 className="text-xl font-bold mb-4">5-Day Forecast</h3>
      <div className="forecast-list">
        {data.forecast.forecastday.map((day, index) => {
          const dateObj = new Date(day.date);
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const dateFormatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          return (
            <div key={index} className="forecast-item">
              <div className="flex flex-col" style={{ width: '80px' }}>
                <span className="font-bold">{dayName}</span>
                <span className="text-xs text-muted">{dateFormatted}</span>
              </div>
              <div className="flex items-center gap-4 flex-1 justify-center">
                <img 
                  src={day.day.condition.icon} 
                  alt={day.day.condition.text} 
                  className="weather-icon-small"
                />
                <span className="text-sm font-medium hidden sm:block">{day.day.condition.text}</span>
              </div>
              <div className="flex flex-col text-right" style={{ width: '80px' }}>
                <span className="font-bold text-gradient">{day.day.maxtemp_c}°</span>
                <span className="text-xs text-muted">{day.day.mintemp_c}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forecast;
