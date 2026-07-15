import React from 'react';

export default function AiSummaryCard({ data }) {
  if (!data) return null;

  return (
    <div className="glass-panel p-6 relative overflow-hidden fade-in" style={{ animationDelay: '0.2s', gridColumn: '1 / -1' }}>
      <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(to right, var(--accent-color), #a855f7)' }}></div>
      
      <div className="flex items-start gap-4">
        <div className="p-3 bg-white/5 rounded-full border border-white/10 shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-color">
            <path d="M12 2v4"></path>
            <path d="M12 18v4"></path>
            <path d="M4.93 4.93l2.83 2.83"></path>
            <path d="M16.24 16.24l2.83 2.83"></path>
            <path d="M2 12h4"></path>
            <path d="M18 12h4"></path>
            <path d="M4.93 19.07l2.83-2.83"></path>
            <path d="M16.24 7.76l2.83-2.83"></path>
          </svg>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            AI Weather Insights
            <span className="text-xs bg-accent-color text-white px-2 py-0.5 rounded-full font-medium tracking-wide">PREMIUM</span>
          </h3>
          <p className="text-lg opacity-90 leading-relaxed mb-4">{data.summary}</p>
          
          <div className="flex flex-wrap gap-2">
            {data.recommendations?.map((rec, idx) => (
              <span key={idx} className="text-sm px-3 py-1 bg-white/10 border border-white/20 rounded-full flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                {rec}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
