import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentCancel() {
  const navigate = useNavigate();

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
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="glass-panel" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '56px 48px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        borderTop: '3px solid #ef4444',
      }}>
        <div style={{
          width: '88px',
          height: '88px',
          borderRadius: '50%',
          background: 'rgba(239,68,68,0.12)',
          border: '2px solid rgba(239,68,68,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 28px',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>Payment Cancelled</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: 1.6, marginBottom: '36px' }}>
          You cancelled the checkout. No charges were made. You can try again whenever you're ready.
        </p>

        <button
          onClick={() => navigate('/subscription')}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
            color: '#fff',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '12px',
          }}
        >
          View Plans Again
        </button>
        <button
          onClick={() => navigate('/')}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
