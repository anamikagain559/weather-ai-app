import React from 'react';

export default function AiSummaryCard({ data }) {
  if (!data) return null;

  return (
    <div className="glass-panel p-6 sm:p-8 animate-fade-in relative overflow-hidden" style={{ animationDelay: '0.3s', gridColumn: '1 / -1' }}>
      {/* Decorative gradient orb */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/20 rounded-full blur-[50px] pointer-events-none"></div>
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-surface border border-borderTint flex items-center justify-center shadow-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <h3 className="text-xl font-bold text-whiteBright m-0">AI Weather Summary</h3>
      </div>
      
      <div className="relative z-10 bg-surface/50 border border-borderTint rounded-xl p-5 sm:p-6 mb-5 backdrop-blur-sm">
        <p className="text-whiteBright leading-relaxed m-0 text-[15px] sm:text-base">
          {data.summary}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 relative z-10">
        <span className="text-[10px] uppercase tracking-wider font-bold text-accent bg-accent/10 border border-accent/20 py-1.5 px-3 rounded-full">
          Powered by Gemini
        </span>
        <span className="text-[10px] uppercase tracking-wider font-bold text-muted bg-surface border border-borderTint py-1.5 px-3 rounded-full flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
          Live Analysis
        </span>
      </div>
    </div>
  );
}
