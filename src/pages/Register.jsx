import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields', { style: { background: '#333', color: '#fff' }});
      return;
    }
    
    const toastId = toast.loading('Creating account...', { style: { background: '#333', color: '#fff' }});
    const result = await register(name, email, password);
    toast.dismiss(toastId);
    
    if (result.success) {
      Swal.fire({
        title: 'Welcome to WeatherAI!',
        text: 'Your premium account has been successfully created.',
        icon: 'success',
        background: '#1a1a2e',
        color: '#fff',
        confirmButtonColor: '#38bdf8'
      }).then(() => {
        navigate('/');
      });
    } else {
      toast.error(result.error || 'Registration failed', { style: { background: '#333', color: '#fff' }});
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in relative z-10">
      <div className="glass-panel w-full max-w-md p-8 sm:p-10 border border-borderTint">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-whiteBright mb-2 tracking-tight">Create Account</h2>
          <p className="text-muted text-sm">Join the premium weather intelligence platform</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-bold text-muted mb-2 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input 
                type="text" 
                className="w-full pl-12 pr-4 py-3 bg-surface border border-borderTint rounded-lg text-whiteBright text-base transition-all outline-none focus:border-accent focus:bg-white/5 focus:ring-2 focus:ring-accent/20" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          
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
          
          <div className="relative mb-6">
            <label className="block text-sm font-bold text-muted mb-2 uppercase tracking-wider">Password</label>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input 
                type="password" 
                className="w-full pl-12 pr-4 py-3 bg-surface border border-borderTint rounded-lg text-whiteBright text-base transition-all outline-none focus:border-accent focus:bg-white/5 focus:ring-2 focus:ring-accent/20" 
                placeholder="Create a password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full flex justify-center py-3.5 text-base shadow-[0_0_20px_rgba(42,245,200,0.2)]">Create Account</button>
        </form>
        
        <div className="mt-8 text-center text-sm text-muted">
          Already have an account? <Link to="/login" className="font-bold text-accent hover:text-accent2 transition-colors ml-1 no-underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

