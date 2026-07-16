import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const [count, setCount] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          clearInterval(interval);
          navigate('/');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glows */}
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '10%', left: '20%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="glass-panel" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '56px 48px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        borderTop: '3px solid #10b981',
      }}>
        {/* Animated checkmark */}
        <div style={{
          width: '88px',
          height: '88px',
          borderRadius: '50%',
          background: 'rgba(16,185,129,0.15)',
          border: '2px solid rgba(16,185,129,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 28px',
          animation: 'successPulse 2s ease-in-out infinite',
        }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'checkDraw 0.5s ease forwards' }}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '100px', padding: '4px 12px', marginBottom: '20px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', animation: 'blink 1s ease infinite' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Payment Confirmed</span>
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px', lineHeight: 1.2 }}>
          Welcome to <span style={{ color: '#10b981' }}>Pro! 🚀</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '16px', lineHeight: 1.6, marginBottom: '36px' }}>
          Your subscription is now active. You now have access to all premium features including SMS alerts, webhooks, and extended forecasts.
        </p>

        {sessionId && (
          <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px 16px', marginBottom: '32px', textAlign: 'left' }}>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Session ID</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', wordBreak: 'break-all', margin: 0 }}>{sessionId}</p>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          style={{
            width: '100%',
            padding: '15px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 8px 25px rgba(16,185,129,0.35)',
            marginBottom: '16px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Go to Dashboard
        </button>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
          Redirecting automatically in <strong style={{ color: 'rgba(255,255,255,0.6)' }}>{count}s</strong>
        </p>
      </div>

      <style>{`
        @keyframes successPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.3); }
          50% { box-shadow: 0 0 0 16px rgba(16,185,129,0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
