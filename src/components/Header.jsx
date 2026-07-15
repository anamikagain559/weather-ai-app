import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="navbar fade-in">
        <div className="container navbar-container" style={{ padding: '0 2rem' }}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" style={{textDecoration: 'none'}}>
            <div style={{ width: 40, height: 40, background: 'var(--accent-gradient)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.0147 19.9853 10 17.5 10C17.0664 10 16.647 10.0617 16.25 10.1764C15.4243 7.23412 12.7165 5 9.5 5C5.91015 5 3 7.91015 3 11.5C3 11.9681 3.04945 12.4246 3.14324 12.8643C1.88414 13.5683 1 14.9312 1 16.5C1 18.9853 3.01472 21 5.5 21H17.5Z"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ margin: 0, color: 'var(--text-primary)' }}>Weather<span className="text-gradient">AI</span></h1>
              <p className="text-xs text-muted" style={{ margin: 0, marginTop: '-2px' }}>Intelligence Dashboard</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="nav-links">
            <Link to="/" className={`auth-link text-sm uppercase tracking-wider ${isActive('/') ? 'text-white' : ''}`}>Dashboard</Link>
            <Link to="/sms" className={`auth-link text-sm uppercase tracking-wider ${isActive('/sms') ? 'text-white' : ''}`}>SMS Alerts</Link>
            <Link to="/forestry" className={`auth-link text-sm uppercase tracking-wider text-success-color hover:!text-success-color ${isActive('/forestry') ? 'opacity-100' : 'opacity-80'}`}>Forestry AI</Link>
            <Link to="/developer" className={`auth-link text-sm uppercase tracking-wider text-accent-color ${isActive('/developer') ? 'opacity-100' : 'opacity-80'}`}>Developer</Link>
            <Link to="/subscription" className={`auth-link text-sm uppercase tracking-wider text-warning-color hover:!text-warning-color ${isActive('/subscription') ? 'opacity-100' : 'opacity-80'}`}>Subscription</Link>
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }}></div>
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </button>
                
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass-panel border border-white/10 rounded-xl overflow-hidden flex flex-col fade-in" style={{ zIndex: 100, padding: '8px' }}>
                    <div className="px-3 py-2 border-b border-white/10 mb-2">
                      <p className="text-sm font-bold truncate">{user.name}</p>
                      <p className="text-xs text-muted truncate">{user.email}</p>
                      <span className="text-[10px] uppercase bg-warning-color/20 text-warning-color px-2 py-0.5 rounded-full mt-1 inline-block border border-warning-color/20">{user.role}</span>
                    </div>
                    <button 
                      onClick={() => { setProfileOpen(false); logout(); navigate('/'); }}
                      className="text-left px-3 py-2 text-sm text-danger-color hover:bg-danger-color/10 rounded transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.875rem' }}>Sign In</Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-nav">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}>Dashboard</Link>
          <Link to="/sms" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-link ${isActive('/sms') ? 'active' : ''}`}>SMS Alerts</Link>
          <Link to="/forestry" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-link`} style={{color: 'var(--success-color)'}}>Forestry AI</Link>
          <Link to="/developer" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-link`} style={{color: 'var(--accent-color)'}}>Developer</Link>
          <Link to="/subscription" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-link`} style={{color: 'var(--warning-color)'}}>Subscription</Link>
          
          {user ? (
            <div className="mobile-nav-link flex flex-col gap-2 border-t border-white/10 pt-4 mt-2">
              <div className="flex items-center gap-2">
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold">{user.name}</div>
                  <div className="text-xs text-muted">{user.email}</div>
                </div>
              </div>
              <button 
                onClick={() => { setMobileMenuOpen(false); logout(); navigate('/'); }}
                className="w-full text-left py-2 text-danger-color font-bold mt-2"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link border-t border-white/10 pt-4 mt-2" style={{fontWeight: 700, color: 'var(--accent-color)'}}>Sign In</Link>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
