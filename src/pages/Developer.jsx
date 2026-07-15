import React, { useState, useEffect } from 'react';
import { fetchUsageStats, fetchWebhooks } from '../services/api';

export default function Developer() {
  const [usage, setUsage] = useState(null);
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [uData, wData] = await Promise.all([fetchUsageStats(), fetchWebhooks()]);
      setUsage(uData);
      setWebhooks(wData);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="app-container container pt-10 fade-in">
      <h2 className="text-4xl font-bold mb-8 text-center">Developer & Account Hub</h2>
      
      {loading ? <div className="spinner"></div> : (
        <div className="grid md:grid-cols-2 gap-8">
          {/* API Usage */}
          <div className="glass-panel p-8">
            <h3 className="text-2xl font-bold mb-6">API Usage Tracker</h3>
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-white/10" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="currentColor" strokeWidth="3" fill="none" />
                  <path strokeDasharray={`${(usage.requests_today / usage.limit) * 100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="var(--accent-color)" strokeWidth="3" fill="none" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{usage.requests_today}</span>
                  <span className="text-sm opacity-70">/ {usage.limit}</span>
                </div>
              </div>
              <p className="text-lg opacity-80">Requests made today</p>
            </div>
          </div>

          {/* Webhooks Manager */}
          <div className="glass-panel p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Webhooks Manager</h3>
              <button className="btn-primary py-2 px-4 text-sm">+ Add Webhook</button>
            </div>
            
            <div className="space-y-4">
              {webhooks.map((wh) => (
                <div key={wh.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-accent-color">{wh.url}</p>
                    <p className="text-sm opacity-70 mt-1">Events: {wh.events.join(", ")}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-success-color/20 text-success-color text-xs rounded border border-success-color/30">Active</span>
                    <button className="text-danger-color hover:opacity-70">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
