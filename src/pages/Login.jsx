import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields', { style: { background: '#333', color: '#fff' }});
      return;
    }
    
    const toastId = toast.loading('Signing in...', { style: { background: '#333', color: '#fff' }});
    const result = await login(email, password);
    toast.dismiss(toastId);
    
    if (result.success) {
      Swal.fire({
        title: 'Welcome Back!',
        text: 'Successfully logged in to WeatherAI.',
        icon: 'success',
        background: '#1a1a2e',
        color: '#fff',
        confirmButtonColor: '#38bdf8',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        navigate('/');
      });
    } else {
      toast.error(result.error || 'Login failed. Please check your credentials.', { style: { background: '#333', color: '#fff' }});
    }
  };

  return (
    <div className="auth-wrapper fade-in">
      <div className="glass-panel auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your premium account</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label className="auth-label">Email Address</label>
            <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <input 
              type="email" 
              className="auth-input" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="auth-input-group">
            <label className="auth-label">Password</label>
            <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input 
              type="password" 
              className="auth-input" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center gap-2 text-sm text-muted cursor-pointer hover:text-white transition-colors">
              <input type="checkbox" className="accent-accent-color" />
              Remember me
            </label>
            <a href="#" className="text-sm auth-link" style={{fontWeight: 400}}>Forgot password?</a>
          </div>

          <button type="submit" className="btn-primary auth-button">Sign In</button>
        </form>
        
        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

