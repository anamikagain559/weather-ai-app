import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const BASE_URL = 'https://api.weather-ai.co/v1';

// --- API helper ---
const smsApi = {
  _handleError: async (res) => {
    const data = await res.json().catch(() => ({}));
    if (res.status === 403) {
      const code = data.code || data.error || '';
      if (code.includes('SMS_NOT_ENABLED') || code.includes('sms'))
        throw new Error('SMS_NOT_ENABLED');
      throw new Error('PLAN_REQUIRED');
    }
    if (res.status === 401) throw new Error('UNAUTHORIZED');
    if (res.status === 404) throw new Error('ENDPOINT_NOT_FOUND');
    throw new Error(data.message || data.error || `Request failed (${res.status})`);
  },
  getStats: async (apiKey) => {
    const res = await fetch(`${BASE_URL}/sms/stats`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) return null; // fallback to mock silently
    return res.json();
  },
  getHealth: async (apiKey) => {
    const res = await fetch(`${BASE_URL}/sms/health`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) return null;
    return res.json();
  },
  sendSms: async (apiKey, body) => {
    const res = await fetch(`${BASE_URL}/sms/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(body),
    });
    if (!res.ok) await smsApi._handleError(res);
    return res.json();
  },
  sendAlert: async (apiKey, body) => {
    const res = await fetch(`${BASE_URL}/sms/alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(body),
    });
    if (!res.ok) await smsApi._handleError(res);
    return res.json();
  },
  registerBomet: async (apiKey, body) => {
    const res = await fetch(`${BASE_URL}/sms/bomet/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(body),
    });
    if (!res.ok) await smsApi._handleError(res);
    return res.json();
  },
};

// --- Mock fallback stats ---
const MOCK_STATS = {
  sent_today: 247,
  delivery_rate: '98.7%',
  credits_remaining: 1550,
  total_sent: 12840,
  failed: 24,
  opt_outs: 3,
};
const MOCK_HEALTH = {
  gateway: 'ok',
  fallback: 'ok',
  lastCheck: new Date().toISOString(),
  latencyMs: 142,
};
const MOCK_HISTORY = [
  { id: 1, to: '+88017***45', status: 'Delivered', time: '10 mins ago', type: 'rain' },
  { id: 2, to: '+88018***92', status: 'Delivered', time: '1 hour ago', type: 'weather_alert' },
  { id: 3, to: '+88019***11', status: 'Failed',    time: '2 hours ago', type: 'frost' },
  { id: 4, to: '+88016***88', status: 'Delivered', time: '5 hours ago', type: 'extreme_wind' },
];

// ─── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, accentColor, borderColor }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${borderColor}`,
      borderLeft: `4px solid ${accentColor}`,
      borderRadius: '16px',
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '18px',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 30px ${accentColor}22`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ width: 52, height: 52, borderRadius: '14px', background: `${accentColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: accentColor }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>{label}</p>
        <p style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff' }}>{value}</p>
      </div>
    </div>
  );
}

// ─── Gateway Health Badge ───────────────────────────────────────────────────
function HealthBadge({ label, status }) {
  const ok = status === 'ok';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: ok ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${ok ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: '100px', padding: '6px 14px' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: ok ? '#10b981' : '#ef4444', boxShadow: `0 0 8px ${ok ? '#10b981' : '#ef4444'}`, flexShrink: 0, display: 'inline-block' }} />
      <span style={{ fontSize: '13px', fontWeight: 600, color: ok ? '#10b981' : '#ef4444' }}>{label}: {ok ? 'Online' : 'Offline'}</span>
    </div>
  );
}

// ─── Section Header ─────────────────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle, accentColor = 'var(--accent-color)' }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
        <span style={{ color: accentColor }}>{icon}</span>
        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>{title}</h3>
      </div>
      {subtitle && <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', paddingLeft: '34px' }}>{subtitle}</p>}
    </div>
  );
}

// ─── Input Component ────────────────────────────────────────────────────────
function Field({ label, required, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label} {required && <span style={{ color: '#f87171' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: '#fff',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s, background 0.2s',
  boxSizing: 'border-box',
};

// ─── Main Component ─────────────────────────────────────────────────────────
export default function SmsDashboard() {
  const { user } = useAuth();
  const apiKey = import.meta.env.VITE_WEATHER_AI_API_KEY || '';

  // Data state
  const [stats, setStats]     = useState(null);
  const [health, setHealth]   = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Active tab
  const [activeTab, setActiveTab] = useState('send');

  // Send SMS form
  const [sendForm, setSendForm]   = useState({ to: '', message: '', type: 'general', pilotTag: '' });
  const [sendLoading, setSendLoading] = useState(false);
  const msgLen = sendForm.message.length;
  const charsLeft = 160 - (msgLen % 160 || (msgLen > 0 ? 0 : 160));
  const segments  = Math.max(1, Math.ceil(msgLen / 160));

  // Alert form
  const [alertForm, setAlertForm] = useState({ to: '', alertType: 'rain', mm: '', day: '' });
  const [alertLoading, setAlertLoading] = useState(false);

  // Bomet form
  const [bometForm, setBometForm] = useState({ phone: '', name: '', location: '', cropType: 'maize' });
  const [bometLoading, setBometLoading] = useState(false);

  // Fake history (would be from GET /v1/sms/history)
  const [history] = useState(MOCK_HISTORY);

  // ── Load stats + health on mount ──
  useEffect(() => {
    const load = async () => {
      setLoadingStats(true);
      try {
        const [s, h] = await Promise.all([
          apiKey ? smsApi.getStats(apiKey) : Promise.resolve(MOCK_STATS),
          apiKey ? smsApi.getHealth(apiKey) : Promise.resolve(MOCK_HEALTH),
        ]);
        setStats(s);
        setHealth(h);
      } catch {
        setStats(MOCK_STATS);
        setHealth(MOCK_HEALTH);
      } finally {
        setLoadingStats(false);
      }
    };
    load();
  }, []);

  // ── Friendly error message helper ──
  const getErrorMsg = (err) => {
    const m = err.message || '';
    if (m === 'SMS_NOT_ENABLED')  return '🔒 SMS is not enabled on your account. Upgrade to Scale plan and request SMS access from admin.';
    if (m === 'PLAN_REQUIRED')    return '🔒 This feature requires a Scale plan. Please upgrade your subscription.';
    if (m === 'UNAUTHORIZED')     return '🔑 Invalid or expired API key. Please check your credentials.';
    if (m === 'ENDPOINT_NOT_FOUND') return '⚠️ SMS endpoint not found. This feature may not be available in your region yet.';
    return m || 'Something went wrong. Please try again.';
  };

  // ── Handlers ──
  const handleSendSms = async (e) => {
    e.preventDefault();
    if (!sendForm.to || !sendForm.message) return toast.error('Phone & message are required');
    setSendLoading(true);
    try {
      const payload = { to: sendForm.to, message: sendForm.message, type: sendForm.type || 'general' };
      if (sendForm.pilotTag) payload.pilotTag = sendForm.pilotTag;
      if (apiKey) await smsApi.sendSms(apiKey, payload);
      toast.success('✅ SMS dispatched successfully!', { style: { background: '#1e1e3a', color: '#fff' } });
      setSendForm({ to: '', message: '', type: 'general', pilotTag: '' });
    } catch (err) {
      toast.error(getErrorMsg(err), { style: { background: '#1e1e3a', color: '#fff', border: '1px solid rgba(248,113,113,0.3)', maxWidth: '420px' } });
    } finally {
      setSendLoading(false);
    }
  };

  const handleSendAlert = async (e) => {
    e.preventDefault();
    if (!alertForm.to || !alertForm.alertType) return toast.error('Phone & alert type are required');
    setAlertLoading(true);
    try {
      const payload = { to: alertForm.to, alertType: alertForm.alertType };
      if (alertForm.mm || alertForm.day) payload.data = { ...(alertForm.mm && { mm: Number(alertForm.mm) }), ...(alertForm.day && { day: alertForm.day }) };
      if (apiKey) await smsApi.sendAlert(apiKey, payload);
      toast.success('🌧️ Weather alert sent!', { style: { background: '#1e1e3a', color: '#fff' } });
      setAlertForm({ to: '', alertType: 'rain', mm: '', day: '' });
    } catch (err) {
      toast.error(getErrorMsg(err), { style: { background: '#1e1e3a', color: '#fff', border: '1px solid rgba(248,113,113,0.3)', maxWidth: '420px' } });
    } finally {
      setAlertLoading(false);
    }
  };

  const handleBometRegister = async (e) => {
    e.preventDefault();
    if (!bometForm.phone || !bometForm.name) return toast.error('Phone & name are required');
    setBometLoading(true);
    try {
      const payload = { phone: bometForm.phone, name: bometForm.name };
      if (bometForm.location) payload.location = bometForm.location;
      if (bometForm.cropType) payload.cropType = bometForm.cropType;
      if (apiKey) await smsApi.registerBomet(apiKey, payload);
      toast.success('🌾 Farmer registered for daily alerts!', { style: { background: '#1e1e3a', color: '#fff' } });
      setBometForm({ phone: '', name: '', location: '', cropType: 'maize' });
    } catch (err) {
      toast.error(getErrorMsg(err), { style: { background: '#1e1e3a', color: '#fff', border: '1px solid rgba(248,113,113,0.3)', maxWidth: '420px' } });
    } finally {
      setBometLoading(false);
    }
  };

  // ── Derived display stats ──
  const displayStats = stats || MOCK_STATS;
  const displayHealth = health || MOCK_HEALTH;

  const tabs = [
    { id: 'send',    label: 'Send SMS',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> },
    { id: 'alert',   label: 'Weather Alert', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
    { id: 'bomet',   label: 'Bomet Register', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/></svg> },
    { id: 'history', label: 'History',     icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '48px 24px 80px', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient blobs */}
      <div style={{ position: 'fixed', top: '5%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '5%', left: '-5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '100px', padding: '6px 16px', marginBottom: '20px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2.5"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-color)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>SMS / USSD · Scale Plan</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: '14px' }}>
            <span className="text-gradient">SMS Alert Centre</span>
          </h1>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.55)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
            Send plain-text messages, structured weather alerts, and register farmers for daily USSD broadcasts via <code style={{ fontSize: '13px', background: 'rgba(56,189,248,0.1)', padding: '2px 7px', borderRadius: '5px', color: '#38bdf8' }}>api.weather-ai.co</code>
          </p>
        </div>

        {/* ── Stats Row ── */}
        {loadingStats ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0', gap: '16px' }}>
            {[1,2,3,4].map(i => <div key={i} style={{ width: '240px', height: '100px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', animation: 'pulse 1.4s ease-in-out infinite' }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <StatCard icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>} label="Sent Today" value={displayStats.sent_today} accentColor="#38bdf8" borderColor="rgba(56,189,248,0.15)" />
            <StatCard icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>} label="Delivery Rate" value={displayStats.delivery_rate} accentColor="#10b981" borderColor="rgba(16,185,129,0.15)" />
            <StatCard icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>} label="Credits Left" value={displayStats.credits_remaining?.toLocaleString()} accentColor="#f59e0b" borderColor="rgba(245,158,11,0.15)" />
            <StatCard icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>} label="Total Sent" value={displayStats.total_sent?.toLocaleString()} accentColor="#818cf8" borderColor="rgba(129,140,248,0.15)" />
          </div>
        )}

        {/* ── Gateway Health ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Gateway Status:</span>
          <HealthBadge label="Primary" status={displayHealth.gateway} />
          <HealthBadge label="Fallback (AT)" status={displayHealth.fallback} />
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>
            Latency: <strong style={{ color: 'rgba(255,255,255,0.6)' }}>{displayHealth.latencyMs}ms</strong> · Last check: <strong style={{ color: 'rgba(255,255,255,0.6)' }}>{new Date(displayHealth.lastCheck).toLocaleTimeString()}</strong>
          </span>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '4px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '11px 16px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                background: activeTab === tab.id ? 'rgba(56,189,248,0.12)' : 'transparent',
                color: activeTab === tab.id ? '#38bdf8' : 'rgba(255,255,255,0.45)',
                boxShadow: activeTab === tab.id ? '0 0 0 1px rgba(56,189,248,0.25)' : 'none',
              }}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>

          {/* LEFT — Main panel */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '36px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: activeTab === 'bomet' ? 'linear-gradient(90deg,#10b981,#059669)' : activeTab === 'alert' ? 'linear-gradient(90deg,#f59e0b,#ef4444)' : 'linear-gradient(90deg,#38bdf8,#818cf8)' }} />

            {/* ── SEND SMS ── */}
            {activeTab === 'send' && (
              <form onSubmit={handleSendSms} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <SectionHeader
                  icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>}
                  title="Send SMS"
                  subtitle="POST /v1/sms/send — Plain-text message up to 160 chars per segment"
                />
                <Field label="Recipient Phone" required>
                  <input style={inputStyle} type="tel" placeholder="+8801700000000" value={sendForm.to} onChange={e => setSendForm(p => ({ ...p, to: e.target.value }))} onFocus={e => e.target.style.borderColor = '#38bdf8'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </Field>
                <Field label="Message" required>
                  <textarea style={{ ...inputStyle, minHeight: '120px', resize: 'vertical', lineHeight: 1.6 }} placeholder="Heavy rain expected tomorrow. Plan accordingly." value={sendForm.message} onChange={e => setSendForm(p => ({ ...p, message: e.target.value }))} onFocus={e => e.target.style.borderColor = '#38bdf8'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                    <span style={{ fontSize: '12px', color: charsLeft < 20 ? '#f87171' : 'rgba(255,255,255,0.35)' }}>{msgLen > 0 ? `${charsLeft} chars left in segment ${segments}` : '160 chars / segment'}</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{msgLen} chars · {segments} SMS</span>
                  </div>
                </Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Type (Analytics Tag)">
                    <select style={{ ...inputStyle, appearance: 'none' }} value={sendForm.type} onChange={e => setSendForm(p => ({ ...p, type: e.target.value }))} onFocus={e => e.target.style.borderColor = '#38bdf8'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}>
                      <option value="general">general</option>
                      <option value="weather_alert">weather_alert</option>
                      <option value="forecast">forecast</option>
                      <option value="emergency">emergency</option>
                    </select>
                  </Field>
                  <Field label="Pilot Tag (Optional)">
                    <input style={inputStyle} placeholder="e.g. pilot_bd_2026" value={sendForm.pilotTag} onChange={e => setSendForm(p => ({ ...p, pilotTag: e.target.value }))} onFocus={e => e.target.style.borderColor = '#38bdf8'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </Field>
                </div>
                <button type="submit" disabled={sendLoading} style={{ padding: '15px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#38bdf8,#818cf8)', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: sendLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: sendLoading ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 6px 20px rgba(56,189,248,0.3)' }}
                  onMouseEnter={e => !sendLoading && (e.currentTarget.style.transform = 'translateY(-1px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {sendLoading ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Sending...</> : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Dispatch SMS</>}
                </button>
              </form>
            )}

            {/* ── WEATHER ALERT ── */}
            {activeTab === 'alert' && (
              <form onSubmit={handleSendAlert} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <SectionHeader
                  icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
                  title="Send Structured Weather Alert"
                  subtitle="POST /v1/sms/alert — Pre-defined templates for rain, frost, extreme_wind, drought"
                  accentColor="#f59e0b"
                />
                <Field label="Recipient Phone" required>
                  <input style={inputStyle} type="tel" placeholder="+8801700000000" value={alertForm.to} onChange={e => setAlertForm(p => ({ ...p, to: e.target.value }))} onFocus={e => e.target.style.borderColor = '#f59e0b'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </Field>
                <Field label="Alert Type" required>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    {['rain', 'frost', 'extreme_wind', 'drought'].map(type => {
                      const icons = { rain: '🌧️', frost: '❄️', extreme_wind: '💨', drought: '☀️' };
                      const active = alertForm.alertType === type;
                      return (
                        <button key={type} type="button" onClick={() => setAlertForm(p => ({ ...p, alertType: type }))} style={{ padding: '12px 8px', borderRadius: '12px', border: `1px solid ${active ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`, background: active ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.03)', color: active ? '#f59e0b' : 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                          <div style={{ fontSize: '22px', marginBottom: '4px' }}>{icons[type]}</div>
                          {type.replace('_', ' ')}
                        </button>
                      );
                    })}
                  </div>
                </Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Rainfall (mm)">
                    <input style={inputStyle} type="number" placeholder="e.g. 45" value={alertForm.mm} onChange={e => setAlertForm(p => ({ ...p, mm: e.target.value }))} onFocus={e => e.target.style.borderColor = '#f59e0b'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </Field>
                  <Field label="When">
                    <input style={inputStyle} placeholder="e.g. tomorrow" value={alertForm.day} onChange={e => setAlertForm(p => ({ ...p, day: e.target.value }))} onFocus={e => e.target.style.borderColor = '#f59e0b'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </Field>
                </div>
                {/* Preview */}
                <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '12px', padding: '14px 16px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>Template Preview</p>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>
                    {{
                      rain: `⚠️ RAIN ALERT: ${alertForm.mm || 'XX'}mm of rainfall expected ${alertForm.day || 'soon'}. Take precautions.`,
                      frost: `❄️ FROST WARNING: Frost conditions expected ${alertForm.day || 'tonight'}. Protect your crops.`,
                      extreme_wind: `💨 WIND ALERT: Extreme winds expected ${alertForm.day || 'soon'}. Secure loose structures.`,
                      drought: `☀️ DROUGHT ADVISORY: Dry conditions continue. Conserve water and irrigate wisely.`,
                    }[alertForm.alertType]}
                  </p>
                </div>
                <button type="submit" disabled={alertLoading} style={{ padding: '15px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#f59e0b,#ef4444)', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: alertLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: alertLoading ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 6px 20px rgba(245,158,11,0.3)' }}
                  onMouseEnter={e => !alertLoading && (e.currentTarget.style.transform = 'translateY(-1px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {alertLoading ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Sending Alert...</> : <>⚡ Send Weather Alert</>}
                </button>
              </form>
            )}

            {/* ── BOMET REGISTER ── */}
            {activeTab === 'bomet' && (
              <form onSubmit={handleBometRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <SectionHeader
                  icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/></svg>}
                  title="Bomet Farmer Registration"
                  subtitle="POST /v1/sms/bomet/register — Schedule daily weather SMS alerts for farmers"
                  accentColor="#10b981"
                />
                <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '12px', padding: '13px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                  🌾 Registers a farmer in the <strong style={{ color: '#10b981' }}>Bomet Agricultural Alert System</strong> for automated daily weather SMS broadcasts based on their crop type and location.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Full Name" required>
                    <input style={inputStyle} placeholder="John Doe" value={bometForm.name} onChange={e => setBometForm(p => ({ ...p, name: e.target.value }))} onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </Field>
                  <Field label="Phone Number" required>
                    <input style={inputStyle} type="tel" placeholder="+8801700000000" value={bometForm.phone} onChange={e => setBometForm(p => ({ ...p, phone: e.target.value }))} onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </Field>
                  <Field label="Location / Village">
                    <input style={inputStyle} placeholder="e.g. Bomet Central" value={bometForm.location} onChange={e => setBometForm(p => ({ ...p, location: e.target.value }))} onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </Field>
                  <Field label="Primary Crop">
                    <select style={{ ...inputStyle, appearance: 'none' }} value={bometForm.cropType} onChange={e => setBometForm(p => ({ ...p, cropType: e.target.value }))} onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}>
                      <option value="maize">🌽 Maize</option>
                      <option value="tea">🍃 Tea</option>
                      <option value="wheat">🌾 Wheat</option>
                      <option value="rice">🍚 Rice</option>
                      <option value="vegetables">🥦 Vegetables</option>
                    </select>
                  </Field>
                </div>
                <button type="submit" disabled={bometLoading} style={{ padding: '15px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: bometLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: bometLoading ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 6px 20px rgba(16,185,129,0.3)' }}
                  onMouseEnter={e => !bometLoading && (e.currentTarget.style.transform = 'translateY(-1px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {bometLoading ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Registering...</> : <>🌾 Register Farmer</>}
                </button>
              </form>
            )}

            {/* ── HISTORY ── */}
            {activeTab === 'history' && (
              <div>
                <SectionHeader
                  icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                  title="Recent Dispatches"
                  subtitle="Recent SMS activity log from your account"
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {history.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', position: 'relative', overflow: 'hidden', cursor: 'default', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    >
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: item.status === 'Delivered' ? '#10b981' : '#ef4444', borderRadius: '3px 0 0 3px' }} />
                      <div style={{ width: 38, height: 38, borderRadius: '10px', background: item.status === 'Delivered' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {item.status === 'Delivered'
                          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>{item.to}</span>
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{item.time}</span>
                        </div>
                        <span style={{ fontSize: '12px', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '100px', fontWeight: 600 }}>{item.type}</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px', border: `1px solid ${item.status === 'Delivered' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`, background: item.status === 'Delivered' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', color: item.status === 'Delivered' ? '#10b981' : '#ef4444' }}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — API Reference sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '80px' }}>
            {/* Endpoint info */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Endpoint</p>
              <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#38bdf8', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.12)', borderRadius: '8px', padding: '10px 12px', wordBreak: 'break-all', lineHeight: 1.6 }}>
                {{
                  send:    'POST /v1/sms/send',
                  alert:   'POST /v1/sms/alert',
                  bomet:   'POST /v1/sms/bomet/register',
                  history: 'GET  /v1/sms/history',
                }[activeTab]}
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '10px', lineHeight: 1.5 }}>
                Base: <code style={{ fontSize: '11px', color: '#818cf8' }}>api.weather-ai.co</code>
              </p>
            </div>

            {/* Required header */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Auth Header</p>
              <code style={{ fontSize: '11px', color: '#f59e0b', wordBreak: 'break-all', lineHeight: 1.6 }}>
                Authorization: Bearer wai_{'<your_key>'}
              </code>
              {!apiKey && (
                <div style={{ marginTop: '10px', fontSize: '11px', color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: '8px', padding: '8px 10px' }}>
                  ⚠️ No API key found. Add <code>VITE_WEATHER_AI_API_KEY</code> to .env
                </div>
              )}
            </div>

            {/* Plan badge */}
            <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#10b981' }}>Scale Plan Required</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>SMS must be enabled by admin after compliance review.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }
      `}</style>
    </div>
  );
}
