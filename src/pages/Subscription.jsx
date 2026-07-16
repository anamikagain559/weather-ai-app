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
    <div className="fade-in" style={{ minHeight: '100vh', padding: '60px 24px 80px', position: 'relative', overflow: 'hidden' }}>

      {/* Ambient Background Blobs */}
      <div style={{ position: 'fixed', top: '10%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '-5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '100px', padding: '6px 16px', marginBottom: '20px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-color)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Premium Plans</span>
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: '16px' }}>
            <span className="text-gradient">Unlock Full Power</span>
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.6, maxWidth: '560px', margin: '0 auto 36px', lineHeight: 1.6 }}>
            Get real-time weather intelligence, AI-powered alerts, and enterprise-grade APIs.
          </p>

          {/* Billing Toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', padding: '4px' }}>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{ padding: '8px 20px', borderRadius: '100px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', background: billingCycle === 'monthly' ? 'rgba(255,255,255,0.12)' : 'transparent', color: billingCycle === 'monthly' ? '#fff' : 'rgba(255,255,255,0.45)' }}
            >Monthly</button>
            <button
              onClick={() => setBillingCycle('yearly')}
              style={{ padding: '8px 20px', borderRadius: '100px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', background: billingCycle === 'yearly' ? 'rgba(255,255,255,0.12)' : 'transparent', color: billingCycle === 'yearly' ? '#fff' : 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              Yearly
              <span style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '100px', letterSpacing: '0.3px' }}>SAVE 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>

          {/* Free Plan */}
          <div className="glass-panel" style={{ padding: '36px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.1)' }} />
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>Starter</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', marginBottom: '6px' }}>
              <span style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1, letterSpacing: '-2px' }}>$0</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '6px', fontSize: '15px' }}>/month</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px' }}>Perfect for personal use</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {['Current Weather API', '5-Day Forecast API', 'Basic AI Summaries'].map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 500 }}><CheckIcon />{f}</li>
              ))}
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 500, opacity: 0.3 }}><XIcon />SMS Alerts</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 500, opacity: 0.3 }}><XIcon />Webhooks</li>
            </ul>
            <button disabled style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.3)', fontSize: '15px', fontWeight: 600, cursor: 'not-allowed' }}>
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div style={{ position: 'relative', padding: '3px', borderRadius: '24px', background: 'linear-gradient(135deg, #38bdf8, #818cf8, #38bdf8)', backgroundSize: '200% 200%' }}>
            <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, background: 'linear-gradient(90deg, #38bdf8, #818cf8)', color: '#fff', padding: '5px 16px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap', boxShadow: '0 4px 15px rgba(56,189,248,0.4)' }}>
              ⭐ Most Popular
            </div>
            <div style={{ background: 'var(--card-bg, #0f172a)', borderRadius: '22px', padding: '36px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-color)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>Pro API</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', marginBottom: '6px' }}>
                <span style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1, letterSpacing: '-2px', color: '#fff' }}>
                  {billingCycle === 'monthly' ? '$29' : '$23'}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '6px', fontSize: '15px' }}>/month</span>
              </div>
              {billingCycle === 'yearly' && <p style={{ color: 'var(--accent-color)', fontSize: '13px', marginBottom: '0', fontWeight: 600 }}>$276 billed annually</p>}
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px', marginTop: billingCycle === 'yearly' ? '4px' : '0' }}>For developers & businesses</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { text: 'Everything in Starter', bold: true },
                  { text: 'Hourly & 14-Day Forecast API' },
                  { text: '1,000 SMS Alerts /mo' },
                  { text: '5 Active Webhook Triggers' },
                  { text: '100k API Requests /mo' },
                ].map(f => (
                  <li key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: f.bold ? 700 : 500, color: '#fff' }}>
                    <CheckIcon color="var(--accent-color)" />{f.text}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe('Pro')}
                disabled={!!loadingPlanId}
                style={{ width: '100%', padding: '15px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: loadingPlanId ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 25px rgba(56,189,248,0.35)', opacity: loadingPlanId ? 0.7 : 1 }}
                onMouseOver={e => !loadingPlanId && (e.currentTarget.style.transform = 'translateY(-1px)', e.currentTarget.style.boxShadow = '0 12px 30px rgba(56,189,248,0.5)')}
                onMouseOut={e => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 8px 25px rgba(56,189,248,0.35)')}
              >
                {loadingPlanId === getTargetPlan('Pro')?._id ? (
                  <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Processing...</>
                ) : (
                  <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Get Pro Access</>
                )}
              </button>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="glass-panel" style={{ padding: '36px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10b981, #059669)' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>Enterprise</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', marginBottom: '6px' }}>
              <span style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1, letterSpacing: '-2px' }}>
                {billingCycle === 'monthly' ? '$99' : '$79'}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '6px', fontSize: '15px' }}>/month</span>
            </div>
            {billingCycle === 'yearly' && <p style={{ color: '#10b981', fontSize: '13px', marginBottom: '0', fontWeight: 600 }}>$948 billed annually</p>}
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px', marginTop: billingCycle === 'yearly' ? '4px' : '0' }}>For agriculture & large scale</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { text: 'Everything in Pro', bold: true },
                { text: 'Forestry AI Analysis API', highlight: true },
                { text: 'Unlimited SMS & Webhooks' },
                { text: 'Unlimited API Requests' },
                { text: 'Priority Support & SLA' },
              ].map(f => (
                <li key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: f.bold ? 700 : 500, color: f.highlight ? '#10b981' : '#fff' }}>
                  <CheckIcon color="#10b981" />{f.text}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe('Enterprise')}
              disabled={!!loadingPlanId}
              style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #10b981', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: '15px', fontWeight: 700, cursor: loadingPlanId ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loadingPlanId ? 0.7 : 1 }}
              onMouseOver={e => !loadingPlanId && (e.currentTarget.style.background = 'rgba(16,185,129,0.2)', e.currentTarget.style.boxShadow = '0 8px 25px rgba(16,185,129,0.25)')}
              onMouseOut={e => (e.currentTarget.style.background = 'rgba(16,185,129,0.1)', e.currentTarget.style.boxShadow = 'none')}
            >
              {loadingPlanId === getTargetPlan('Enterprise')?._id ? (
                <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(16,185,129,0.3)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Processing...</>
              ) : (
                <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> Get Enterprise Access</>
              )}
            </button>
          </div>

        </div>

        {/* Features Comparison Row */}
        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginBottom: '32px', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 600 }}>All plans include</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
            {['SSL Encryption', '99.9% Uptime SLA', 'GDPR Compliant', '24/7 API Monitoring', 'OpenAPI Docs', 'SDK Libraries'].map(f => (
              <span key={f} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '100px', padding: '8px 16px', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>
                <CheckIcon color="#10b981" />
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Stripe Badge */}
        <div style={{ marginTop: '48px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: 0.35 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span style={{ fontSize: '13px', fontWeight: 500 }}>Secure payments powered by Stripe</span>
        </div>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
