import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen text-white relative font-sans flex items-center justify-center pt-48 pb-12 px-6 overflow-hidden">
      
      {/* Immersive Background Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      
      <div className="animate-page-enter w-full max-w-md z-10 transition-all duration-500">
        
        {/* Floating Glass Panel */}
        <div className="glass-card p-10 md:p-12 relative overflow-hidden backdrop-blur-2xl bg-[#0a0510]/80 border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.6)]">
          
          {/* Subtle top glare effect */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-400 text-sm">
              {isLogin ? 'Sign in to continue to VirtualLab' : 'Join VirtualLab'}
              <span className="text-[#00e5ff]">X</span>
            </p>
          </div>

          <form className="space-y-5 animate-page-enter" onSubmit={async (e) => {
             e.preventDefault();
             setErrorMsg('');
             setLoading(true);
             try {
                if(isLogin) {
                   const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
                   await login(res.data.token);
                   navigate('/');
                } else {
                   const res = await axios.post('http://localhost:5000/api/auth/signup', { firstName, lastName, email, password });
                   await login(res.data.token);
                   navigate('/');
                }
             } catch(err) {
                setErrorMsg(err.response?.data?.msg || 'An error occurred during authentication.');
             } finally {
                setLoading(false);
             }
          }}>
            
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl text-center shadow-inner">
                {errorMsg}
              </div>
            )}

            {/* Name Fields (Only for Sign Up) */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                  <input 
                    type="text" 
                    value={firstName} onChange={(e) => setFirstName(e.target.value)} required
                    placeholder="Alan"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#00e5ff]/50 focus:bg-white/10 transition-all font-medium placeholder:text-gray-600 shadow-inner hover:border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                  <input 
                    type="text" 
                    value={lastName} onChange={(e) => setLastName(e.target.value)} required
                    placeholder="Turing"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#00e5ff]/50 focus:bg-white/10 transition-all font-medium placeholder:text-gray-600 shadow-inner hover:border-white/20"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <input 
                  type="email" 
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#00e5ff]/50 focus:bg-white/10 transition-all font-medium placeholder:text-gray-600 shadow-inner group-hover:border-white/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                 {isLogin && <a href="#" className="text-xs text-[#00e5ff] hover:text-white transition-colors">Forgot Password?</a>}
              </div>
              <div className="relative group">
                <input 
                  type="password" 
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all font-medium placeholder:text-gray-600 shadow-inner group-hover:border-white/20"
                />
              </div>
            </div>

            {/* Sign In / Sign Up Button */}
            <button 
              type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-[#6c2bd9] to-[#00e5ff] text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(108,43,217,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transform hover:-translate-y-1 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Or continue with</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl transition-all">
              <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-sm font-semibold text-gray-300">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl transition-all group">
              <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">GitHub</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-10">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#00e5ff] hover:opacity-80 transition-opacity"
            >
              {isLogin ? "Create one now" : "Sign in instead"}
            </button>
          </p>

        </div>
      </div>
      
    </div>
  );
}
