import React from 'react';

export default function AlertsBanner({ alertsData }) {
  if (!alertsData || !alertsData.alerts || alertsData.alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 w-full mb-6 fade-in">
      {alertsData.alerts.map((alert, idx) => (
        <div key={idx} className="p-4 rounded-xl border flex items-start gap-4" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', backdropFilter: 'blur(10px)' }}>
          <div className="p-2 rounded-full shrink-0 text-danger-color" style={{ background: 'rgba(239, 68, 68, 0.2)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-danger-color">{alert.event}</h4>
              <span className="text-xs px-2 py-0.5 text-danger-color rounded border" style={{ background: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>{alert.severity}</span>
            </div>
            <p className="font-medium text-sm mb-1">{alert.headline}</p>
            <p className="text-xs opacity-80">{alert.instruction}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
