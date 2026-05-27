import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SpotifyContext } from '../context/SpotifyContext';
import { useTheme } from '../context/ThemeContext';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function Navbar() {
  const location = useLocation();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { isPlaying, isWidgetOpen, setIsWidgetOpen } = useContext(SpotifyContext);
  const { isLight, toggleTheme } = useTheme();

  return (
    <div className="absolute top-0 w-full flex justify-center pt-8 px-4 pointer-events-none" style={{ zIndex: 100 }}>
      <nav
        className="pointer-events-auto flex items-center justify-between w-full max-w-4xl px-8 py-3 backdrop-blur-xl border rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.18)] transition-all duration-300"
        style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--glass-border)' }}
      >
        
        {/* Logo Area */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-[var(--page-text)] hover:opacity-80 transition-opacity">
            VirtualLab<span className="text-[var(--accent-cyan)]">X</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-10">
          <Link to="/" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">Home</Link>
          <Link to="/features" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">Features</Link>
          <Link to="/labs" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">Labs</Link>
          {isAuthenticated && (
            <Link to="/performance" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">AI Mentor</Link>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsWidgetOpen(!isWidgetOpen)}
            className={`relative group w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 border hover:scale-110 active:scale-95 ${
              isPlaying && !isWidgetOpen
                ? 'bg-black/60 border-[#1db954] shadow-[0_0_20px_rgba(29,185,84,0.6),inset_0_0_15px_rgba(29,185,84,0.3)]'
                : isWidgetOpen 
                ? 'bg-[#1db954] border-[#1db954] shadow-[0_0_30px_rgba(29,185,84,0.8)]'
                : 'bg-[var(--glass-bg)] border-[var(--glass-border)] hover:bg-[#1db954]/10 hover:border-[#1db954]/40 hover:shadow-[0_0_15px_rgba(29,185,84,0.2)]'
            }`}
          >
            {/* Fluid fluid glow when playing */}
            {isPlaying && !isWidgetOpen && (
              <>
                <div className="absolute inset-0 rounded-full border border-[#1db954] animate-ping opacity-30 pointer-events-none"></div>
                <div className="absolute -inset-1.5 bg-[#1db954]/20 rounded-full blur-lg animate-pulse pointer-events-none"></div>
              </>
            )}
            <MusicNoteIcon className={`relative z-10 transition-colors duration-500 ${isPlaying && !isWidgetOpen ? 'text-[#1db954] drop-shadow-[0_0_10px_#1db954]' : isWidgetOpen ? 'text-black' : 'text-gray-300 group-hover:text-[#1db954]'}`} />
          </button>
          <button
            onClick={toggleTheme}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 border bg-[var(--glass-bg)] hover:bg-white/10 border-[var(--glass-border)] hover:border-white/20 text-gray-200 hover:text-white hover:scale-110 active:scale-95"
            aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {isLight ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
          </button>
          {isAuthenticated ? (
            <Link to="/profile">
               <button className="flex items-center gap-2 bg-[var(--glass-bg)] hover:bg-white/10 text-white text-sm font-semibold py-2 px-4 rounded-full transition-all border border-[var(--glass-border)] hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                 {user?.photoURL ? (
                   <img 
                     src={user.photoURL} 
                     alt="Avatar" 
                     className="w-6 h-6 rounded-full object-cover border border-white/20"
                     referrerPolicy="no-referrer"
                   />
                 ) : (
                   <div className="w-6 h-6 rounded-full bg-linear-to-r from-purple-500 to-[var(--accent-cyan)] flex items-center justify-center text-xs text-white font-bold">
                     {user?.firstName?.charAt(0) || 'U'}
                   </div>
                 )}
                 <span>Profile</span>
               </button>
            </Link>
          ) : (
            <Link to="/login">
              <button className="bg-linear-to-r from-[#6c2bd9] to-[#4a1bb8] hover:from-[#813df0] hover:to-[#5c20e5] text-white text-sm font-semibold py-2.5 px-7 rounded-full transition-all border border-[var(--glass-border)] hover:shadow-[0_0_20px_rgba(108,43,217,0.5)] transform hover:-translate-y-0.5">
                Sign In
              </button>
            </Link>
          )}
        </div>

      </nav>
    </div>
  );
}
