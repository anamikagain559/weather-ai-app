import React, { useState, useEffect } from 'react';
import { fetchSmsStats } from '../services/api';

export default function SmsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSmsStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  const recentAlerts = [
    { id: 1, to: '+88017***45', status: 'Delivered', time: '10 mins ago', type: 'Cyclone Warning' },
    { id: 2, to: '+88018***92', status: 'Delivered', time: '1 hour ago', type: 'Daily Forecast' },
    { id: 3, to: '+88019***11', status: 'Failed', time: '2 hours ago', type: 'Flash Flood' },
    { id: 4, to: '+88016***88', status: 'Delivered', time: '5 hours ago', type: 'Heatwave Alert' },
  ];

  return (
    <div className="app-container container pb-12 fade-in">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold mb-4 text-gradient">SMS & USSD Alerts</h2>
        <p className="text-xl opacity-80 max-w-2xl mx-auto">Manage offline weather alerts and rural broadcasting systems directly from your dashboard.</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20"><div className="spinner border-t-accent-color w-12 h-12"></div></div>
      ) : (
        <>
          {/* Stats Row */}
          <div className="grid md:grid-cols-3 gap-6 mb-8 w-full max-w-6xl mx-auto">
            <div className="glass-panel p-6 border-l-4 border-l-accent-color flex items-center gap-4 transition-transform hover:-translate-y-1">
              <div className="p-4 rounded-full" style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-color)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"></path><path d="M22 2L15 22L11 13L2 9L22 2z"></path></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-white/60 mb-1 uppercase tracking-wider">Sent Today</p>
                <p className="text-3xl font-bold">{stats.sent_today}</p>
              </div>
            </div>
            
            <div className="glass-panel p-6 border-l-4 border-l-success-color flex items-center gap-4 transition-transform hover:-translate-y-1">
              <div className="p-4 rounded-full" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-white/60 mb-1 uppercase tracking-wider">Delivery Rate</p>
                <p className="text-3xl font-bold">{stats.delivery_rate}</p>
              </div>
            </div>
            
            <div className="glass-panel p-6 border-l-4 border-l-warning-color flex items-center gap-4 transition-transform hover:-translate-y-1">
              <div className="p-4 rounded-full" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-white/60 mb-1 uppercase tracking-wider">Credits</p>
                <p className="text-3xl font-bold">{stats.credits_remaining}</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
            {/* Forms Column */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div className="glass-panel p-8 relative overflow-hidden">
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--accent-gradient)' }}></div>
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  Send Custom Alert
                </h3>
                <p className="opacity-70 mb-6 text-sm">Dispatch an emergency SMS manually to any registered network number.</p>
                
                <form className="flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Recipient Number</label>
                    <input type="tel" className="auth-input bg-black/20" placeholder="+880 1700-000000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Message Content</label>
                    <textarea className="auth-input bg-black/20 min-h-[120px]" placeholder="Type your critical alert here..."></textarea>
                    <div className="text-right mt-1 text-xs text-white/50">160 characters remaining</div>
                  </div>
                  <button type="button" className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    Dispatch SMS
                  </button>
                </form>
              </div>

              <div className="glass-panel p-8 relative overflow-hidden">
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--success-color)' }}></div>
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5c-2.2 0-4 1.8-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                  BOMET Rural Registration
                </h3>
                <p className="opacity-70 mb-6 text-sm">Register a user to automatically receive SMS weather alerts based on their region.</p>
                
                <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-white/80 mb-2">Phone Number</label>
                    <input type="tel" className="auth-input bg-black/20" placeholder="+880" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Language</label>
                    <select className="auth-input bg-black/20 text-white/80 appearance-none">
                      <option value="bn">Bengali (bn)</option>
                      <option value="en">English (en)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Region</label>
                    <select className="auth-input bg-black/20 text-white/80 appearance-none">
                      <option value="dhaka">Dhaka</option>
                      <option value="chittagong">Chittagong</option>
                      <option value="sylhet">Sylhet</option>
                      <option value="khulna">Khulna</option>
                    </select>
                  </div>
                  <button type="button" className="btn w-full md:col-span-2 py-4 text-lg font-bold" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', border: '1px solid var(--success-color)' }}>
                    Add to Database
                  </button>
                </form>
              </div>
            </div>

            {/* Recent Logs Column */}
            <div className="glass-panel p-6 flex flex-col h-full">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Recent Dispatches
              </h3>
              
              <div className="flex-1 flex flex-col gap-4">
                {recentAlerts.map(alert => (
                  <div key={alert.id} className="p-4 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden group hover:bg-white/10 transition-colors cursor-pointer">
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: alert.status === 'Delivered' ? 'var(--success-color)' : 'var(--danger-color)' }}></div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-sm tracking-wider">{alert.to}</span>
                      <span className="text-xs opacity-50">{alert.time}</span>
                    </div>
                    <div className="text-sm font-medium mb-3">{alert.type}</div>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-xs px-2 py-1 rounded border" style={{ 
                        color: alert.status === 'Delivered' ? 'var(--success-color)' : 'var(--danger-color)',
                        borderColor: alert.status === 'Delivered' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)',
                        background: alert.status === 'Delivered' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'
                      }}>
                        {alert.status}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-30 group-hover:opacity-100 transition-opacity"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full py-3 mt-6 text-sm font-bold text-white/70 hover:text-white border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
                View Full Logs
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
