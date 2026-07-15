import React from 'react';

const Header = () => {
  return (
    <header className="flex items-center justify-between py-6 mb-4 fade-in">
      <div className="flex items-center gap-2">
        <div style={{ width: 40, height: 40, background: 'var(--accent-gradient)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.0147 19.9853 10 17.5 10C17.0664 10 16.647 10.0617 16.25 10.1764C15.4243 7.23412 12.7165 5 9.5 5C5.91015 5 3 7.91015 3 11.5C3 11.9681 3.04945 12.4246 3.14324 12.8643C1.88414 13.5683 1 14.9312 1 16.5C1 18.9853 3.01472 21 5.5 21H17.5Z"></path>
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ margin: 0 }}>Weather<span className="text-gradient">AI</span></h1>
          <p className="text-xs text-muted" style={{ margin: 0, marginTop: '-2px' }}>Intelligence Dashboard</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
