import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchMySubscription, cancelSubscription, fetchSubscriptionHistory } from '../services/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

// Upgraded Weather-condition glyphs
function ConditionIcon({ status }) {
  const stroke =
    status === 'active' ? '#34d399' :
      status === 'pending' ? '#fbbf24' :
        status === 'cancelled' ? '#f87171' : 'rgba(255,255,255,0.3)';

  if (status === 'active') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="4.5" fill={stroke} fillOpacity="0.2" />
        <circle cx="12" cy="12" r="4.5" />
        <path d="M12 2v2.5M12 19.5V22M22 12h-2.5M4.5 12H2M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8M19.1 19.1l-1.8-1.8M6.7 6.7 4.9 4.9" />
      </svg>
    );
  }
  if (status === 'pending') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 18h1.5" />
        <path d="M9.5 8.5A4.2 4.2 0 0 1 17 10.6h.3a3.2 3.2 0 0 1 .3 6.4H9a3.6 3.6 0 0 1-.6-7.1" fill={stroke} fillOpacity="0.15" />
        <path d="M9.5 8.5A4.2 4.2 0 0 1 17 10.6h.3a3.2 3.2 0 0 1 .3 6.4H9a3.6 3.6 0 0 1-.6-7.1" />
      </svg>
    );
  }
  if (status === 'cancelled') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 10.5A4 4 0 0 1 13.7 8h.5a3.3 3.3 0 0 1 .3 6.6H7.2a3.4 3.4 0 0 1-.7-6.7" fill={stroke} fillOpacity="0.1" />
        <path d="M6.5 10.5A4 4 0 0 1 13.7 8h.5a3.3 3.3 0 0 1 .3 6.6H7.2a3.4 3.4 0 0 1-.7-6.7" />
        <path d="M8 18.5l-1 2M12 18.5l-1 2M16 18.5l-1 2" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 9.5A4 4 0 0 1 13.7 7h.5a3.3 3.3 0 0 1 .3 6.6H7.2a3.4 3.4 0 0 1-.7-6.7" />
    </svg>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const token = localStorage.getItem('token');
    fetchSubscriptionHistory(token).then(data => {
      setHistory(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, [user, navigate]);

  const handleCancel = async (subscriptionId) => {
    const result = await Swal.fire({
      title: 'Halt this operation?',
      text: "Canceling this subscription cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Yes, cancel it',
      background: '#0f172a',
      color: '#f8fafc',
      customClass: {
        popup: 'border border-gray-800 rounded-2xl',
      }
    });

    if (!result.isConfirmed) return;

    setCancelingId(subscriptionId);
    const token = localStorage.getItem('token');
    try {
      await cancelSubscription(subscriptionId, token);
      toast.success("Subscription successfully cancelled");

      setHistory(prev => prev.map(sub =>
        sub._id === subscriptionId
          ? { ...sub, status: 'cancelled', autoRenew: false }
          : sub
      ));
    } catch (err) {
      toast.error(err.message || "Couldn't cancel — please try again");
    } finally {
      setCancelingId(null);
    }
  };

  if (!user) return null;

  const activeCount = history.filter(h => h.status === 'active').length;
  const hasActive = activeCount > 0;

  return (
    <div className="wx-page min-h-screen pt-12 pb-24 text-slate-200 relative selection:bg-sky-500/30">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-900/20 via-[#0b1120] to-[#0b1120] -z-10"></div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

        .wx-page { font-family: 'Inter', system-ui, sans-serif; }
        .wx-display { font-family: 'Space Grotesk', 'Inter', sans-serif; letter-spacing: -0.02em; }
        
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .wx-eyebrow {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(14, 165, 233, 0.7);
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .wx-radar {
          position: relative;
          width: 120px; height: 120px;
        }
        .wx-radar .ring {
          position: absolute; inset: 0;
          border-radius: 999px;
          border: 1px solid rgba(14,165,233,0.4);
          animation: wx-sweep 3.5s cubic-bezier(0.1, 0.7, 1, 0.1) infinite;
        }
        .wx-radar .ring:nth-child(2) { animation-delay: 1.2s; border-color: rgba(56,189,248,0.3); }
        .wx-radar .ring:nth-child(3) { animation-delay: 2.4s; border-color: rgba(2,132,199,0.2); }
        @keyframes wx-sweep {
          0% { transform: scale(0.7); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wx-radar .ring { animation: none; display: none; }
        }
      `}</style>

      <div className="container max-w-6xl mx-auto px-4 md:px-6 fade-in">

        {/* Header Section */}
        <div className="flex flex-col items-center mb-24 text-center">
          <span className="wx-eyebrow mb-5 bg-sky-950/40 px-5 py-2 rounded-full border border-sky-900/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
            Station report &middot; account overview
          </span>
          <h2 className="wx-display text-4xl md:text-5xl font-bold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            Account Settings
          </h2>
          <p className="text-slate-400 text-lg max-w-lg mt-2 mb-4">Manage your profile details and monitor active weather intelligence subscriptions.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: User Info Card */}
          <div className="lg:col-span-4 space-y-8">
            <div className="glass-panel rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col items-center text-center group">
              {/* Decorative top gradient */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-sky-500/10 to-transparent opacity-50 group-hover:opacity-70 transition-opacity"></div>

              <div className="wx-radar mb-6 relative z-10 flex items-center justify-center">
                <span className="ring"></span>
                <span className="ring"></span>
                <span className="ring"></span>
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_30px_rgba(14,165,233,0.3)] border-4 border-[#0f172a] wx-display z-10">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>

              <h3 className="wx-display text-2xl font-bold mb-2 relative z-10 text-white">{user.name}</h3>
              <p className="text-slate-400 mb-6 relative z-10 flex items-center gap-2 justify-center text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                {user.email}
              </p>

              <div className="flex flex-wrap gap-3 justify-center relative z-10 w-full border-t border-slate-700/50 pt-6">
                <span className="text-[10px] uppercase bg-slate-800/80 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700 tracking-widest font-bold">
                  Role: {user.role}
                </span>
                <span className="text-[10px] uppercase bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 tracking-widest font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]"></span>
                  Active status
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Subscription History */}
          <div className="lg:col-span-8">
            <div className="glass-panel rounded-[3rem] p-8 h-full flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-5 mb-6">
                <h3 className="wx-display text-2xl font-bold flex items-center gap-3 text-white">
                  <div className="w-10 h-10 rounded-[18px] bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--tw-colors-sky-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </div>
                  Billing & Subscriptions
                </h3>
              </div>

              {loading ? (
                <div className="flex-1 flex justify-center items-center min-h-[300px]">
                  <div className="w-10 h-10 border-4 border-slate-700 border-t-sky-500 rounded-full animate-spin"></div>
                </div>
              ) : history.length > 0 ? (
                <div className="space-y-4">
                  {history.map(sub => {
                    const isCanceling = cancelingId === sub._id;
                    const isActive = sub.status === 'active';
                    const isPending = sub.status === 'pending';
                    const canCancel = isActive || isPending;

                    const getStatusStyles = (status) => {
                      if (status === 'active') return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400', cardBg: 'bg-slate-900/40', iconBg: 'bg-emerald-500/10 text-emerald-400' };
                      if (status === 'pending') return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400', cardBg: 'bg-slate-900/40', iconBg: 'bg-amber-500/10 text-amber-400' };
                      if (status === 'cancelled') return { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', dot: 'bg-rose-400', cardBg: 'bg-slate-900/40', iconBg: 'bg-rose-500/10 text-rose-400' };
                      return { bg: 'bg-slate-800', border: 'border-slate-700', text: 'text-slate-400', dot: 'bg-slate-500', cardBg: 'bg-slate-900/40', iconBg: 'bg-slate-800/50 text-slate-400' };
                    };

                    const style = getStatusStyles(sub.status);

                    return (
                      <div key={sub._id} className={`group ${style.cardBg} border border-slate-700/50 p-6 sm:p-7 rounded-[2rem] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative transition-all duration-300 hover:bg-slate-800/40 hover:border-slate-600`}>
                        <div className="flex-1 w-full">
                          <div className="flex flex-wrap items-center gap-4 mb-4 border-b border-slate-800/60 pb-4">
                            <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-700/50 ${style.iconBg}`}>
                              <ConditionIcon status={sub.status} />
                            </span>
                            <h4 className="wx-display text-2xl font-bold capitalize text-white">
                              {sub.planId?.name || 'Unknown Plan'}
                            </h4>
                            <span className={`text-[11px] px-3 py-1 rounded-full border ${style.border} ${style.text} bg-transparent uppercase tracking-widest font-bold flex items-center gap-2 ml-auto sm:ml-0`}>
                              {sub.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm text-slate-400">
                            <div className="flex items-center gap-2.5 text-slate-300">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                              Started <span className="text-white font-semibold ml-1">{new Date(sub.startDate).toLocaleDateString()}</span>
                            </div>
                            <span className="hidden sm:block text-slate-700">|</span>
                            <div className="flex items-center gap-2.5 text-slate-300">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                              Ends <span className="text-white font-semibold ml-1">{new Date(sub.expiryDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        {canCancel && (
                          <div className="w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                            <button
                              onClick={() => handleCancel(sub._id)}
                              disabled={isCanceling}
                              className="w-full sm:w-auto px-5 py-2 rounded-xl text-sm font-semibold flex justify-center items-center gap-2 transition-all duration-200 bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isCanceling ? (
                                <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Halting...</>
                              ) : (
                                <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Cancel Plan</>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-slate-900/30 border border-slate-800/50 rounded-2xl mt-2">
                  <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <ConditionIcon status="none" />
                  </div>
                  <h4 className="wx-display text-2xl font-bold mb-3 text-white">Clear skies, nothing here yet</h4>
                  <p className="mb-8 text-slate-400 max-w-sm mx-auto">You don't have any plans on record. Subscribe to unlock premium Weather AI features.</p>
                  <button onClick={() => navigate('/subscription')} className="bg-sky-500 hover:bg-sky-400 text-white py-3 px-8 rounded-xl font-bold text-base wx-display transition-all hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:-translate-y-0.5 flex items-center gap-2">
                    View Premium Plans
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}