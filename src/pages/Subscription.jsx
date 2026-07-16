import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { subscribeToPlan, fetchPlans } from '../services/api';

const CheckIcon = ({ color = 'var(--success-color)' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.3 }}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Subscription() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [plans, setPlans] = useState([]);
  const [loadingPlanId, setLoadingPlanId] = useState(null);

  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans().then(data => setPlans(Array.isArray(data) ? data : []));
  }, []);

  const handleSubscribe = async (planName) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Try multiple name formats to find the plan
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const targetPlanName = `${planName} ${capitalize(billingCycle)}`;
    
    const plan = plans.find(p => p.name.toLowerCase() === targetPlanName.toLowerCase());

    if (!plan) {
      toast.error(`Plan "${targetPlanName}" not found. Please refresh the page.`, { style: { background: '#1e1e3a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } });
      return;
    }

    setLoadingPlanId(plan._id);
    const toastId = toast.loading('Connecting to secure checkout...', { style: { background: '#1e1e3a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } });
    try {
      const response = await subscribeToPlan(plan._id, token);
      toast.dismiss(toastId);
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (err) {
      toast.dismiss(toastId);
      // Handle JWT expired / 401 — logout and redirect to login
      const msg = err.message || '';
      if (msg.toLowerCase().includes('jwt') || msg.toLowerCase().includes('expired') || msg.toLowerCase().includes('session')) {
        logout();
        toast.error('Your session has expired. Please log in again.', { style: { background: '#1e1e3a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } });
        navigate('/login');
        return;
      }
      toast.error(msg || 'Failed to initiate checkout', { style: { background: '#1e1e3a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } });
    } finally {
      setLoadingPlanId(null);
    }
  };

  const getTargetPlan = (planName) => {
    const targetPlanName = `${planName} ${billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)}`;
    return plans.find(p => p.name === targetPlanName);
  };

  return (
    <div className="animate-fade-in relative overflow-hidden min-h-screen py-16 px-6 lg:px-12 text-textPrimary">

      {/* Ambient Background Blobs */}
      <div className="fixed top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(42,245,200,0.07)_0%,transparent_70%)] pointer-events-none z-0"></div>
      <div className="fixed bottom-[10%] -right-[5%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(58,142,255,0.06)_0%,transparent_70%)] pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span className="text-[12px] font-bold text-accent tracking-widest uppercase">Premium Plans</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight mb-4">
            <span className="text-gradient">Unlock Full Power</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Get real-time weather intelligence, AI-powered alerts, and enterprise-grade APIs.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-surface/50 border border-borderTint rounded-full p-1.5">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-panel border border-borderTint text-whiteBright' : 'text-muted hover:text-whiteBright bg-transparent border border-transparent'}`}
            >Monthly</button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-panel border border-borderTint text-whiteBright' : 'text-muted hover:text-whiteBright bg-transparent border border-transparent'}`}
            >
              Yearly
              <span className="bg-gradient-to-r from-accent to-accent2 text-ink text-[10px] font-extrabold px-2 py-0.5 rounded-full tracking-wider">SAVE 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

          {/* Free Plan */}
          <div className="glass-panel p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-borderTint"></div>
            <p className="text-xs font-bold text-muted tracking-widest uppercase mb-3">Starter</p>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-5xl font-extrabold leading-none tracking-tight text-whiteBright">$0</span>
              <span className="text-muted text-sm pb-1">/month</span>
            </div>
            <p className="text-sm text-muted mb-8">Perfect for personal use</p>
            <ul className="flex flex-col gap-4 mb-8">
              {['Current Weather API', '5-Day Forecast API', 'Basic AI Summaries'].map(f => (
                <li key={f} className="flex items-center gap-3 text-sm font-medium text-whiteBright"><CheckIcon color="#2af5c8" />{f}</li>
              ))}
              <li className="flex items-center gap-3 text-sm font-medium text-muted opacity-50"><XIcon />SMS Alerts</li>
              <li className="flex items-center gap-3 text-sm font-medium text-muted opacity-50"><XIcon />Webhooks</li>
            </ul>
            <button disabled className="w-full py-3.5 rounded-xl border border-borderTint bg-transparent text-muted text-sm font-bold cursor-not-allowed">
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="relative p-1 rounded-[24px] bg-hero-gradient bg-[length:200%_200%] md:-mt-4">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 bg-hero-gradient text-ink px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase whitespace-nowrap shadow-[0_4px_15px_rgba(42,245,200,0.4)]">
              ⭐ Most Popular
            </div>
            <div className="bg-panel rounded-[20px] p-8 relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle,rgba(42,245,200,0.12)_0%,transparent_70%)] pointer-events-none"></div>
              <p className="text-xs font-bold text-accent tracking-widest uppercase mb-3">Pro API</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-5xl font-extrabold leading-none tracking-tight text-whiteBright">
                  {billingCycle === 'monthly' ? '$29' : '$23'}
                </span>
                <span className="text-muted text-sm pb-1">/month</span>
              </div>
              {billingCycle === 'yearly' && <p className="text-accent text-xs font-bold mb-0">$276 billed annually</p>}
              <p className={`text-sm text-muted mb-8 ${billingCycle === 'yearly' ? 'mt-1' : ''}`}>For developers & businesses</p>
              
              <ul className="flex flex-col gap-4 mb-8">
                {[
                  { text: 'Everything in Starter', bold: true },
                  { text: 'Hourly & 14-Day Forecast API' },
                  { text: '1,000 SMS Alerts /mo' },
                  { text: '5 Active Webhook Triggers' },
                  { text: '100k API Requests /mo' },
                ].map(f => (
                  <li key={f.text} className={`flex items-center gap-3 text-sm ${f.bold ? 'font-bold text-whiteBright' : 'font-medium text-textPrimary'}`}>
                    <CheckIcon color="#2af5c8" />{f.text}
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSubscribe('Pro')}
                disabled={!!loadingPlanId}
                className={`w-full py-3.5 rounded-xl border-none bg-accent text-ink text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${!loadingPlanId ? 'hover:-translate-y-0.5 shadow-[0_8px_25px_rgba(42,245,200,0.35)] hover:shadow-[0_12px_30px_rgba(42,245,200,0.5)] cursor-pointer' : 'opacity-70 cursor-not-allowed'}`}
              >
                {loadingPlanId === getTargetPlan('Pro')?._id ? (
                  <><div className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" /> Processing...</>
                ) : (
                  <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Get Pro Access</>
                )}
              </button>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="glass-panel p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-accent3"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-[radial-gradient(circle,rgba(255,107,53,0.1)_0%,transparent_70%)] pointer-events-none"></div>
            <p className="text-xs font-bold text-accent3 tracking-widest uppercase mb-3">Enterprise</p>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-5xl font-extrabold leading-none tracking-tight text-whiteBright">
                {billingCycle === 'monthly' ? '$99' : '$79'}
              </span>
              <span className="text-muted text-sm pb-1">/month</span>
            </div>
            {billingCycle === 'yearly' && <p className="text-accent3 text-xs font-bold mb-0">$948 billed annually</p>}
            <p className={`text-sm text-muted mb-8 ${billingCycle === 'yearly' ? 'mt-1' : ''}`}>For agriculture & large scale</p>
            
            <ul className="flex flex-col gap-4 mb-8">
              {[
                { text: 'Everything in Pro', bold: true },
                { text: 'Forestry AI Analysis API', highlight: true },
                { text: 'Unlimited SMS & Webhooks' },
                { text: 'Unlimited API Requests' },
                { text: 'Priority Support & SLA' },
              ].map(f => (
                <li key={f.text} className={`flex items-center gap-3 text-sm ${f.bold ? 'font-bold text-whiteBright' : 'font-medium'} ${f.highlight ? 'text-accent3' : 'text-textPrimary'}`}>
                  <CheckIcon color="#ff6b35" />{f.text}
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => handleSubscribe('Enterprise')}
              disabled={!!loadingPlanId}
              className={`w-full py-3.5 rounded-xl border border-accent3 bg-accent3/10 text-accent3 text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${!loadingPlanId ? 'hover:bg-accent3/20 hover:shadow-[0_8px_25px_rgba(255,107,53,0.25)] cursor-pointer' : 'opacity-70 cursor-not-allowed'}`}
            >
              {loadingPlanId === getTargetPlan('Enterprise')?._id ? (
                <><div className="w-4 h-4 border-2 border-accent3/30 border-t-accent3 rounded-full animate-spin" /> Processing...</>
              ) : (
                <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> Get Enterprise Access</>
              )}
            </button>
          </div>

        </div>

        {/* Features Comparison Row */}
        <div className="mt-20 text-center">
          <p className="text-xs font-bold text-muted uppercase tracking-widest mb-8">All plans include</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['SSL Encryption', '99.9% Uptime SLA', 'GDPR Compliant', '24/7 API Monitoring', 'OpenAPI Docs', 'SDK Libraries'].map(f => (
              <span key={f} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm font-medium text-textPrimary">
                <CheckIcon color="#2af5c8" />
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Stripe Badge */}
        <div className="mt-12 text-center flex items-center justify-center gap-2 opacity-40">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span className="text-sm font-medium">Secure payments powered by Stripe</span>
        </div>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
