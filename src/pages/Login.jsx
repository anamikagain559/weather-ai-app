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
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in relative z-10">
      <div className="glass-panel w-full max-w-md p-8 sm:p-10 border border-borderTint">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-whiteBright mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-muted text-sm">Sign in to your premium account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-bold text-muted mb-2 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <input 
                type="email" 
                className="w-full pl-12 pr-4 py-3 bg-surface border border-borderTint rounded-lg text-whiteBright text-base transition-all outline-none focus:border-accent focus:bg-white/5 focus:ring-2 focus:ring-accent/20" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="relative">
            <label className="block text-sm font-bold text-muted mb-2 uppercase tracking-wider">Password</label>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input 
                type="password" 
                className="w-full pl-12 pr-4 py-3 bg-surface border border-borderTint rounded-lg text-whiteBright text-base transition-all outline-none focus:border-accent focus:bg-white/5 focus:ring-2 focus:ring-accent/20" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center gap-2 text-sm text-muted cursor-pointer hover:text-whiteBright transition-colors">
              <input type="checkbox" className="accent-accent" />
              Remember me
            </label>
            <a href="#" className="text-sm font-medium text-accent hover:text-accent2 transition-colors no-underline">Forgot password?</a>
          </div>

          <button type="submit" className="btn-primary w-full flex justify-center py-3.5 text-base shadow-[0_0_20px_rgba(42,245,200,0.2)]">Sign In</button>
        </form>
        
        <div className="mt-8 text-center text-sm text-muted">
          Don't have an account? <Link to="/register" className="font-bold text-accent hover:text-accent2 transition-colors ml-1 no-underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

