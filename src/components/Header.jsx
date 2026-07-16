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
      <header className="w-full sticky top-0 z-50 bg-ink/90 backdrop-blur-2xl border-b border-borderTint py-4 transition-all animate-fade-in">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-7 h-7 rounded-md bg-hero-gradient flex items-center justify-center shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/20"></div>
            </div>
            <div className="text-whiteBright font-extrabold text-xl tracking-tight">
              Weather<em className="not-italic text-accent">AI</em>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            <Link to="/" className={`text-sm tracking-wide no-underline transition-colors relative group ${isActive('/') ? 'text-whiteBright' : 'text-muted hover:text-whiteBright'}`}>
              Dashboard
              <span className={`absolute -bottom-1 left-0 h-px bg-accent transition-all duration-300 ${isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/sms" className={`text-sm tracking-wide no-underline transition-colors relative group ${isActive('/sms') ? 'text-whiteBright' : 'text-muted hover:text-whiteBright'}`}>
              SMS Alerts
              <span className={`absolute -bottom-1 left-0 h-px bg-accent transition-all duration-300 ${isActive('/sms') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/forestry" className={`text-sm tracking-wide no-underline transition-colors relative group ${isActive('/forestry') ? 'text-whiteBright' : 'text-muted hover:text-whiteBright'}`}>
              Forestry AI
              <span className={`absolute -bottom-1 left-0 h-px bg-accent transition-all duration-300 ${isActive('/forestry') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/developer" className={`text-sm tracking-wide no-underline transition-colors relative group ${isActive('/developer') ? 'text-whiteBright' : 'text-muted hover:text-whiteBright'}`}>
              Developer
              <span className={`absolute -bottom-1 left-0 h-px bg-accent transition-all duration-300 ${isActive('/developer') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/subscription" className={`text-sm tracking-wide no-underline transition-colors relative group ${isActive('/subscription') ? 'text-whiteBright' : 'text-muted hover:text-whiteBright'}`}>
              Pricing
              <span className={`absolute -bottom-1 left-0 h-px bg-accent transition-all duration-300 ${isActive('/subscription') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity bg-white/5 py-1.5 px-3 rounded-full border border-borderTint ml-4"
                >
                  <div className="w-6 h-6 rounded-full bg-hero-gradient flex items-center justify-center text-xs font-bold text-ink">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-textPrimary">{user.name}</span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-4 bg-panel border border-borderTint rounded-xl shadow-2xl animate-fade-in min-w-[280px] z-50 overflow-hidden">
                    <div className="p-5 border-b border-borderTint bg-surface">
                      <p className="text-whiteBright text-base font-bold m-0 truncate">{user.name}</p>
                      <p className="text-muted text-xs mt-1 truncate">{user.email}</p>

                      <div className="mt-3 inline-flex items-center gap-2 bg-accent/10 border border-accent/20 py-1 px-2.5 rounded-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_#2af5c8]"></span>
                        <span className="text-[10px] uppercase font-bold text-accent tracking-widest">{user.role}</span>
                      </div>
                    </div>

                    <div style={{ padding: '8px' }}>
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: 'var(--btn-radius)', color: 'var(--text-primary)', textDecoration: 'none', transition: 'all 0.2s ease', fontSize: '14px', fontWeight: '500' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--glass-highlight)'; e.currentTarget.style.color = 'var(--accent-color)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-primary)' }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        Profile Settings
                      </Link>

                      <button
                        onClick={() => { setProfileOpen(false); logout(); navigate('/'); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: 'var(--btn-radius)', color: 'var(--danger-color)', textDecoration: 'none', transition: 'all 0.2s ease', fontSize: '14px', fontWeight: '500', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary ml-4">
                Sign In
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden block bg-transparent border-none text-white cursor-pointer p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-20 left-4 right-4 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-4 z-40 shadow-2xl animate-slide-down md:hidden">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`text-lg font-medium py-2 border-b border-white/5 no-underline ${isActive('/') ? 'text-accent' : 'text-white'}`}>Dashboard</Link>
          <Link to="/sms" onClick={() => setMobileMenuOpen(false)} className={`text-lg font-medium py-2 border-b border-white/5 no-underline ${isActive('/sms') ? 'text-accent' : 'text-white'}`}>SMS Service</Link>
          <Link to="/forestry" onClick={() => setMobileMenuOpen(false)} className={`text-lg font-medium py-2 border-b border-white/5 no-underline ${isActive('/forestry') ? 'text-accent' : 'text-white'}`}>Forestry</Link>
          <Link to="/subscription" onClick={() => setMobileMenuOpen(false)} className={`text-lg font-medium py-2 border-b border-white/5 no-underline ${isActive('/subscription') ? 'text-accent' : 'text-white'}`}>Subscription</Link>

          {user ? (
            <div className="flex flex-col gap-2 border-t border-white/10 pt-4 mt-2">
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
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold py-2 border-t border-white/10 pt-4 mt-2 text-accent no-underline">Sign In</Link>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
