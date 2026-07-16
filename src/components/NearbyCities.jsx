import React from 'react';

const NearbyCities = ({ citiesData }) => {
  if (!citiesData || citiesData.length === 0) return null;

  return (
    <div className="glass-panel p-6 sm:p-8 animate-fade-in w-full flex flex-col" style={{ animationDelay: '0.3s' }}>
      <div className="mb-6">
        <h3 className="text-xl font-extrabold text-whiteBright tracking-tight">Nearby Cities</h3>
        <p className="text-sm text-muted mt-1">Current conditions in other regions</p>
      </div>
      
      <div className="flex flex-col gap-4">
        {citiesData.map((cityData, index) => {
          if (!cityData || !cityData.current) return null;
          
          return (
            <div key={index} className="flex justify-between items-center p-4 rounded-xl bg-surface/50 border border-borderTint hover:bg-surface/80 hover:border-accent/30 transition-all duration-300 group cursor-pointer">
              <div className="flex flex-col">
                <span className="font-bold text-lg text-whiteBright group-hover:text-accent transition-colors">{cityData.location.name}</span>
                <span className="text-xs font-medium text-muted">{cityData.current.condition.text}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-black text-2xl text-whiteBright">{Math.round(cityData.current.temp_c)}°</span>
                {cityData.current.condition.icon && (
                  cityData.current.condition.icon.startsWith('http') || cityData.current.condition.icon.startsWith('//') ? (
                    <img 
                      src={cityData.current.condition.icon} 
                      alt={cityData.current.condition.text} 
                      className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                    />
                  ) : (
                    <div className="text-3xl drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" title={cityData.current.condition.text}>
                      {cityData.current.condition.icon}
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NearbyCities;
