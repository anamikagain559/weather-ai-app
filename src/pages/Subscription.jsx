import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Subscription() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <div className="app-container container pb-12 fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-gradient">Choose Your Subscription</h2>
        <p className="text-xl opacity-80 max-w-2xl mx-auto mb-8">Unlock the full power of WeatherAI with our premium APIs including SMS alerts, webhooks, and Forestry AI analysis.</p>
        
        {/* Billing Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', padding: '4px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9999px' }}>
            <button 
              style={{
                padding: '8px 24px', 
                borderRadius: '9999px', 
                fontWeight: 500, 
                fontSize: '0.875rem', 
                transition: 'all 0.3s',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: billingCycle === 'monthly' ? 'var(--accent-color)' : 'transparent',
                color: billingCycle === 'monthly' ? '#fff' : 'rgba(255,255,255,0.7)',
                boxShadow: billingCycle === 'monthly' ? '0 10px 15px -3px rgba(56, 189, 248, 0.3)' : 'none'
              }}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button 
              style={{
                padding: '8px 24px', 
                borderRadius: '9999px', 
                fontWeight: 500, 
                fontSize: '0.875rem', 
                transition: 'all 0.3s',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: billingCycle === 'yearly' ? 'var(--accent-color)' : 'transparent',
                color: billingCycle === 'yearly' ? '#fff' : 'rgba(255,255,255,0.7)',
                boxShadow: billingCycle === 'yearly' ? '0 10px 15px -3px rgba(56, 189, 248, 0.3)' : 'none'
              }}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly <span style={{ padding: '2px 8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--success-color)', fontSize: '0.75rem', borderRadius: '9999px' }}>Save 20%</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto" style={{ alignItems: 'center' }}>
        
        {/* Starter Plan */}
        <div className="glass-panel p-8 flex flex-col relative" style={{ animationDelay: '0.1s', transition: 'transform 0.3s', minHeight: '480px' }}>
          <h3 className="text-2xl font-bold mb-2">Starter</h3>
          <p className="text-muted mb-6">Perfect for personal use</p>
          <div className="mb-8 flex items-end gap-1">
            <span style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1 }}>$0</span>
            <span className="text-muted mb-1">/month</span>
          </div>
          
          <ul className="flex-1 flex flex-col gap-4 mb-8">
            <li className="flex items-start gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Current Weather API</span>
            </li>
            <li className="flex items-start gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>5-Day Forecast API</span>
            </li>
            <li className="flex items-start gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Basic AI Summaries</span>
            </li>
            <li className="flex items-start gap-3 opacity-50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              <span>No SMS Alerts</span>
            </li>
          </ul>
          <Link to="/" className="btn w-full text-center" style={{ padding: '12px', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 700, textDecoration: 'none', color: '#fff', transition: 'background 0.3s' }}>Current Plan</Link>
        </div>

        {/* Pro Plan */}
        <div className="glass-panel p-8 flex flex-col relative border-2 border-accent-color" style={{ animationDelay: '0.2s', transform: 'scale(1.05)', boxShadow: '0 20px 40px rgba(56,189,248,0.15)', minHeight: '520px', zIndex: 10 }}>
          <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--accent-color)', color: '#fff', padding: '4px 16px', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 700, boxShadow: '0 4px 6px rgba(0,0,0,0.3)', whiteSpace: 'nowrap' }}>MOST POPULAR</div>
          
          <h3 className="text-2xl font-bold mb-2">Pro API</h3>
          <p className="text-muted mb-6">For developers and small businesses</p>
          <div className="mb-8 flex items-end gap-1">
            <span style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1 }}>{billingCycle === 'monthly' ? '$29' : '$23'}</span>
            <span className="text-muted mb-1">/month</span>
          </div>
          
          <ul className="flex-1 flex flex-col gap-4 mb-8">
            <li className="flex items-start gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span className="font-medium text-white">Everything in Starter, plus:</span>
            </li>
            <li className="flex items-start gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Hourly & 14-Day Extended API</span>
            </li>
            <li className="flex items-start gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>1,000 SMS Weather Alerts /mo</span>
            </li>
            <li className="flex items-start gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>5 Active Webhook Triggers</span>
            </li>
            <li className="flex items-start gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>100k API Requests /mo limit</span>
            </li>
          </ul>
          <Link to="/login" className="btn-primary w-full text-center" style={{ padding: '12px', borderRadius: '9999px', fontWeight: 700, textDecoration: 'none' }}>Subscribe to Pro</Link>
        </div>

        {/* Enterprise Plan */}
        <div className="glass-panel p-8 flex flex-col relative border-t-2 border-success-color" style={{ animationDelay: '0.3s', transition: 'transform 0.3s', minHeight: '480px' }}>
          <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
          <p className="text-muted mb-6">For agriculture and large scale</p>
          <div className="mb-8 flex items-end gap-1">
            <span style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1 }}>{billingCycle === 'monthly' ? '$99' : '$79'}</span>
            <span className="text-muted mb-1">/month</span>
          </div>
          
          <ul className="flex-1 flex flex-col gap-4 mb-8">
            <li className="flex items-start gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span className="font-medium text-white">Everything in Pro, plus:</span>
            </li>
            <li className="flex items-start gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span className="text-success-color font-bold">Forestry AI Analysis API</span>
            </li>
            <li className="flex items-start gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Unlimited SMS & Webhooks</span>
            </li>
            <li className="flex items-start gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Unlimited API Requests</span>
            </li>
            <li className="flex items-start gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Dedicated Support</span>
            </li>
          </ul>
          <Link to="/login" className="btn w-full text-center" style={{ padding: '12px', borderRadius: '9999px', border: '1px solid var(--success-color)', color: 'var(--success-color)', fontWeight: 700, textDecoration: 'none', transition: 'background 0.3s' }}>Contact Sales</Link>
        </div>

      </div>
    </div>
  );
}
