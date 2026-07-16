import React, { useState } from 'react';
import { analyzeForestry } from '../services/api';

export default function Forestry() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    const lat = e.target.elements[0].value;
    const lon = e.target.elements[1].value;
    const crop = e.target.elements[2].value;
    const data = await analyzeForestry(lat, lon, crop);
    setAnalysis(data);
    setLoading(false);
  };

  return (
    <div className="app-container container pt-10 fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-gradient" style={{backgroundImage: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)'}}>Trees & Forestry AI Analysis</h2>
        <p className="text-xl opacity-80 max-w-2xl mx-auto">Analyze tree health, drought risks, and get AI-driven irrigation recommendations based on deep hyper-local weather data.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="glass-panel p-8">
          <h3 className="text-2xl font-bold mb-6">Select Coordinates</h3>
          <form onSubmit={handleAnalyze} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="auth-label">Latitude</label>
                <input type="text" className="auth-input pl-4" defaultValue="23.8103" />
              </div>
              <div>
                <label className="auth-label">Longitude</label>
                <input type="text" className="auth-input pl-4" defaultValue="90.4125" />
              </div>
            </div>
            <div>
              <label className="auth-label">Crop / Tree Type</label>
              <select className="auth-input pl-4 text-white/70">
                <option value="mango">Mango Trees</option>
                <option value="tea">Tea Plantation</option>
                <option value="timber">Timber/Teak</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-4 py-3 text-lg flex items-center justify-center gap-2" style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}>
              {loading ? <div className="spinner !w-6 !h-6 !border-2 !m-0"></div> : 'Run AI Analysis'}
            </button>
          </form>
        </div>

        {analysis ? (
          <div className="glass-panel p-8 fade-in flex flex-col justify-center border-2 border-success-color/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-success-color opacity-10 rounded-bl-full pointer-events-none"></div>
            
            <div className="flex items-end gap-4 mb-8">
              <h3 className="text-6xl font-bold text-success-color leading-none">{analysis.health_score}</h3>
              <p className="text-xl font-medium opacity-80 pb-1">/100 Health Score</p>
            </div>
            
            <div className="space-y-4">
              {/* Extra data we are now returning */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-xs opacity-60 mb-1 uppercase tracking-wider">Today's Rain</p>
                  <p className="font-bold text-xl text-[#38bdf8]">{analysis.precipitation_today}mm</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-xs opacity-60 mb-1 uppercase tracking-wider">Wind Speed</p>
                  <p className="font-bold text-xl text-white">{analysis.wind_kph} <span className="text-sm font-normal opacity-60">kph</span></p>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-sm opacity-70 mb-1">Drought Risk</p>
                <p className="font-bold text-lg text-success-color">{analysis.drought_risk}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-sm opacity-70 mb-1">Disease Risk</p>
                <p className="font-bold text-lg text-warning-color">{analysis.disease_risk}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-accent-color/30">
                <p className="text-sm text-accent-color font-bold mb-1">AI Recommendation</p>
                <p className="font-medium">{analysis.recommendation}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-8 flex flex-col items-center justify-center text-center opacity-50 border-dashed border-2 border-white/20">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
              <path d="M12 22v-8"></path>
              <path d="M12 14a4 4 0 0 0-4-4H6v4h2"></path>
              <path d="M12 14a4 4 0 0 1 4-4h2v4h-2"></path>
              <path d="M12 10V6"></path>
              <path d="M12 6a3 3 0 0 0-3-3H7v3h2"></path>
              <path d="M12 6a3 3 0 0 1 3-3h2v3h-2"></path>
            </svg>
            <p className="text-lg">Enter coordinates and run analysis to view AI insights here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
