import React, { useState, useEffect } from 'react';
import { fetchUsageStats } from '../services/api';

const API_KEY = import.meta.env.VITE_WEATHER_AI_API_KEY;

const PLAN_COLORS = {
  free:       { color: '#94a3b8', label: 'Free',       bg: 'rgba(148,163,184,0.1)',  border: 'rgba(148,163,184,0.2)'  },
  pro:        { color: '#38bdf8', label: 'Pro',        bg: 'rgba(56,189,248,0.1)',   border: 'rgba(56,189,248,0.2)'   },
  enterprise: { color: '#10b981', label: 'Enterprise', bg: 'rgba(16,185,129,0.1)',   border: 'rgba(16,185,129,0.2)'   },
  scale:      { color: '#a78bfa', label: 'Scale',      bg: 'rgba(167,139,250,0.1)',  border: 'rgba(167,139,250,0.2)'  },
};

function UsageRing({ used, limit, unlimited }) {
  const pct  = unlimited ? 100 : Math.min((used / limit) * 100, 100);
  const dash = `${pct.toFixed(1)}, 100`;
  const color = pct > 90 ? '#ef4444' : pct > 70 ? '#f59e0b' : '#38bdf8';

  return (
    <div style={{ position: 'relative', width: 180, height: 180, margin: '0 auto' }}>
      <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3"
        />
        {/* Fill */}
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={unlimited ? '100, 100' : dash}
          style={{ transition: 'stroke-dasharray 0.8s ease', strokeLinecap: 'round' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
        <span style={{ fontSize: '32px', fontWeight: 800, color, letterSpacing: '-1px' }}>
          {unlimited ? '∞' : used}
        </span>
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
          {unlimited ? 'unlimited' : `/ ${limit.toLocaleString()}`}
        </span>
      </div>
    </div>
  );
}

function StatPill({ label, value, color = '#38bdf8' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px' }}>
      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: '14px', fontWeight: 700, color }}>{value}</span>
    </div>
  );
}

export default function Developer() {
  const [usage,   setUsage]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  useEffect(() => {
    fetchUsageStats()
      .then(data => { setUsage(data); setLoading(false); })
      .catch(()  => setLoading(false));
  }, []);

  const plan      = usage?.plan || 'free';
  const planMeta  = PLAN_COLORS[plan] || PLAN_COLORS.free;
  const pct       = usage ? Math.min((usage.requests_today / usage.limit) * 100, 100) : 0;
  const pctColor  = pct > 90 ? '#ef4444' : pct > 70 ? '#f59e0b' : '#38bdf8';

  const maskedKey = API_KEY
    ? `${API_KEY.slice(0, 12)}${'•'.repeat(20)}${API_KEY.slice(-4)}`
    : 'No API key configured';

  const handleCopyKey = () => {
    if (API_KEY) {
      navigator.clipboard.writeText(API_KEY);
      setApiKeyCopied(true);
      setTimeout(() => setApiKeyCopied(false), 2000);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '48px 24px 80px', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient */}
      <div style={{ position: 'fixed', top: '10%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '10%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(129,140,248,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '100px', padding: '6px 16px', marginBottom: '20px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-color)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Developer Hub</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 50px)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: '14px' }}>
            <span className="text-gradient">API Dashboard</span>
          </h1>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.5)', maxWidth: '520px', margin: '0 auto' }}>
            Real-time usage from <code style={{ fontSize: '13px', background: 'rgba(56,189,248,0.1)', padding: '2px 7px', borderRadius: '5px', color: '#38bdf8' }}>GET /v1/usage</code>
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(56,189,248,0.2)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

            {/* ── API Usage Card ── */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '36px', position: 'relative', overflow: 'hidden', gridColumn: '1 / -1' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#38bdf8,#818cf8)' }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>API Usage</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Live data from weather-ai.co · Updates on each request</p>
                </div>
                {/* Plan Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: planMeta.bg, border: `1px solid ${planMeta.border}`, borderRadius: '100px', padding: '8px 18px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: planMeta.color, boxShadow: `0 0 8px ${planMeta.color}`, display: 'inline-block' }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: planMeta.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{planMeta.label} Plan</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '40px', alignItems: 'center' }}>
                <UsageRing used={usage?.requests_today ?? 0} limit={usage?.limit ?? 1000} unlimited={usage?.unlimited} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <StatPill label="Requests Used" value={(usage?.requests_today ?? 0).toLocaleString()} color="#38bdf8" />
                  <StatPill label="Remaining" value={usage?.unlimited ? 'Unlimited' : (usage?.remaining ?? 0).toLocaleString()} color="#10b981" />
                  <StatPill label="Monthly Limit" value={usage?.unlimited ? '∞' : (usage?.limit ?? 1000).toLocaleString()} color="#f59e0b" />
                  <StatPill label="Usage %" value={usage?.unlimited ? '—' : `${pct.toFixed(1)}%`} color={pctColor} />

                  {/* Progress bar */}
                  {!usage?.unlimited && (
                    <div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.07)', borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, #38bdf8, ${pctColor})`, borderRadius: '100px', transition: 'width 0.8s ease' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                        <span>0</span>
                        <span>{(usage?.limit ?? 1000).toLocaleString()} requests / month</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── API Key Card ── */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#f59e0b,#ef4444)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fff' }}>API Key</h3>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '14px 16px', fontFamily: 'monospace', fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px', wordBreak: 'break-all', letterSpacing: '0.03em' }}>
                {maskedKey}
              </div>
              <button
                onClick={handleCopyKey}
                style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid rgba(245,158,11,0.3)', background: apiKeyCopied ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.08)', color: apiKeyCopied ? '#10b981' : '#f59e0b', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}
              >
                {apiKeyCopied
                  ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
                  : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy to Clipboard</>}
              </button>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '10px', textAlign: 'center' }}>
                ⚠️ Never share your API key publicly
              </p>
            </div>

            {/* ── Endpoints Reference ── */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#818cf8,#38bdf8)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(129,140,248,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fff' }}>Active Endpoints</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { method: 'GET', path: '/v1/current',  label: 'Current Weather',    status: 'live', color: '#38bdf8' },
                  { method: 'GET', path: '/v1/forecast', label: '5-Day Forecast',     status: 'live', color: '#38bdf8' },
                  { method: 'GET', path: '/v1/usage',    label: 'API Usage Stats',    status: 'live', color: '#38bdf8' },
                  { method: 'GET', path: '/v1/insights', label: 'AI Insights',        status: 'pro+', color: '#818cf8' },
                  { method: 'GET', path: '/v1/forecast14', label: '14-Day Forecast',  status: 'pro+', color: '#818cf8' },
                  { method: 'POST','/v1/webhooks': '/v1/webhooks', path: '/v1/webhooks', label: 'Webhooks',  status: 'pro+', color: '#818cf8' },
                ].map((ep, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'monospace', padding: '2px 7px', borderRadius: '5px', background: ep.method === 'GET' ? 'rgba(16,185,129,0.15)' : 'rgba(56,189,248,0.15)', color: ep.method === 'GET' ? '#10b981' : '#38bdf8', flexShrink: 0 }}>{ep.method}</span>
                    <code style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', flex: 1 }}>{ep.path}</code>
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', background: ep.status === 'live' ? 'rgba(16,185,129,0.12)' : 'rgba(129,140,248,0.12)', border: `1px solid ${ep.status === 'live' ? 'rgba(16,185,129,0.25)' : 'rgba(129,140,248,0.25)'}`, color: ep.status === 'live' ? '#10b981' : '#818cf8' }}>
                      {ep.status === 'live' ? '● LIVE' : 'PRO+'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
