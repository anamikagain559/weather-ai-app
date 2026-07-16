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
                  <div className="absolute right-0 mt-3 w-56 glass-panel border border-white/20 rounded-2xl overflow-hidden flex flex-col fade-in shadow-2xl shadow-black/80" style={{ zIndex: 100 }}>
                    <div className="px-4 py-4 border-b border-white/10 bg-black/20">
                      <p className="text-[15px] font-bold text-white truncate">{user.name}</p>
                      <p className="text-[12px] text-muted truncate mt-0.5">{user.email}</p>
                      <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-accent-color/30 bg-accent-color/10">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-color)', boxShadow: '0 0 5px var(--accent-color)' }}></span>
                        <span className="text-[10px] uppercase font-bold text-accent-color tracking-wider">{user.role}</span>
                      </div>
                    </div>
                    
                    <div className="p-2 space-y-1">
                      <Link 
                        to="/profile" 
                        onClick={() => setProfileOpen(false)}
                        className="group flex items-center gap-3 text-left px-3 py-2.5 text-[13px] font-semibold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                      >
                        <div className="text-white/60 group-hover:text-white transition-colors">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                        Profile Settings
                      </Link>
                      
                      <button 
                        onClick={() => { setProfileOpen(false); logout(); navigate('/'); }}
                        className="group flex items-center gap-3 w-full text-left px-3 py-2.5 text-[13px] font-semibold text-danger-color hover:text-white hover:bg-danger-color/20 rounded-xl transition-all"
                      >
                        <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        </div>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="bg-sky-500 hover:bg-sky-400 text-white font-bold transition-all px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:-translate-y-0.5 text-sm">Sign In</Link>
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
              <div className="flex items-center gap-3 bg-black/20 p-3.5 rounded-2xl border border-white/10">
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-white text-[15px] truncate">{user.name}</div>
                  <div className="text-[12px] text-muted truncate mt-0.5">{user.email}</div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <Link 
                  to="/profile" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="group flex items-center gap-3 py-2.5 px-4 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-semibold rounded-xl transition-all text-sm border border-transparent hover:border-white/10"
                >
                  <div className="text-white/60 group-hover:text-white transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  Profile Settings
                </Link>
                <button 
                  onClick={() => { setMobileMenuOpen(false); logout(); navigate('/'); }}
                  className="group flex items-center gap-3 py-2.5 px-4 bg-danger-color/5 hover:bg-danger-color/20 text-danger-color hover:text-white font-semibold rounded-xl transition-all text-sm text-left border border-transparent hover:border-danger-color/30"
                >
                  <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  </div>
                  Sign Out
                </button>
              </div>
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
