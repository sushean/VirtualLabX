import React from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function WaveFooter() {
  const { isLight } = useTheme();
  const waveSvg = (color) => {
    const encodedColor = encodeURIComponent(color);
    // Perfectly seamless cubic bezier wave
    return `data:image/svg+xml;utf8,<svg viewBox="0 0 1000 100" fill="${encodedColor}" xmlns="http://www.w3.org/2000/svg"><path d="M 0 50 C 250 100 250 0 500 50 C 750 100 750 0 1000 50 L 1000 100 L 0 100 Z"/></svg>`;
  };

  return (
    <div className="w-full mt-24">
      <div className="relative w-full h-[80px] overflow-hidden leading-[0]">
        <div 
          className="wave opacity-50 z-10 bottom-0" 
          style={{ backgroundImage: `url('${waveSvg(isLight ? '#0284c7' : '#00e5ff')}')`, animationDuration: '20s', animationName: 'waveAnimation' }}
        ></div>
        <div 
          className="wave opacity-60 z-20 bottom-[-5px]" 
          style={{ backgroundImage: `url('${waveSvg(isLight ? '#38bdf8' : '#6c2bd9')}')`, animationDuration: '15s', animationName: 'waveAnimationReverse' }}
        ></div>
        <div 
          className="wave opacity-100 z-30 bottom-[-10px]" 
          style={{ backgroundImage: `url('${waveSvg(isLight ? '#ffffff' : '#05020a')}')`, animationDuration: '10s', animationName: 'waveAnimation' }}
        ></div>
      </div>
      
      <footer className={`pt-20 pb-12 text-sm text-[var(--muted-text)] relative z-40 ${isLight ? 'bg-[#ffffff]' : 'bg-[#05020a]'}`}>
        <div className="max-w-7xl mx-auto px-8 w-full">
          
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-left">
            
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <Link to="/" className="text-3xl font-extrabold tracking-tight text-[var(--page-text)] hover:opacity-80 transition-opacity mb-6 block">
                VirtualLab<span className="text-[var(--accent-cyan)]">X</span>
              </Link>
              <p className="mb-6 leading-relaxed">
                Revolutionizing computer science education with interactive, real-time algorithmic simulators and visual state machines.
              </p>
              <div className="flex gap-4 items-center">
                 <a href="#" className="w-10 h-10 rounded-full bg-[var(--glass-bg)] flex flex-col items-center justify-center hover:bg-[#1877f2] hover:text-[var(--page-text)] transition-all transform hover:-translate-y-1"><FacebookIcon fontSize="small"/></a>
                 <a href="#" className="w-10 h-10 rounded-full bg-[var(--glass-bg)] flex flex-col items-center justify-center hover:bg-[#00e5ff] hover:text-black transition-all transform hover:-translate-y-1"><TwitterIcon fontSize="small"/></a>
                 <a href="#" className="w-10 h-10 rounded-full bg-[var(--glass-bg)] flex flex-col items-center justify-center hover:bg-[#E1306C] hover:text-[var(--page-text)] transition-all transform hover:-translate-y-1"><InstagramIcon fontSize="small"/></a>
                 <a href="#" className="w-10 h-10 rounded-full bg-[var(--glass-bg)] flex flex-col items-center justify-center hover:bg-[#0A66C2] hover:text-[var(--page-text)] transition-all transform hover:-translate-y-1"><LinkedInIcon fontSize="small"/></a>
                 <a href="#" className="w-10 h-10 rounded-full bg-[var(--glass-bg)] flex flex-col items-center justify-center hover:bg-white hover:text-black transition-all transform hover:-translate-y-1"><GitHubIcon fontSize="small"/></a>
              </div>
            </div>

            {/* Links Column 1 */}
            <div>
              <h4 className="text-[var(--page-text)] font-bold text-lg mb-6">Explore</h4>
              <ul className="space-y-4">
                <li><Link to="/labs" className="hover:text-[var(--accent-cyan)] transition-colors">Lab Gallery</Link></li>
                <li><a href="#" className="hover:text-[var(--accent-cyan)] transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-[var(--accent-cyan)] transition-colors">Pricing Methods</a></li>
                <li><a href="#" className="hover:text-[var(--accent-cyan)] transition-colors">Open Source</a></li>
              </ul>
            </div>

            {/* Links Column 2 */}
            <div>
              <h4 className="text-[var(--page-text)] font-bold text-lg mb-6">Resources</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-[var(--accent-cyan)] transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-[var(--accent-cyan)] transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-[var(--accent-cyan)] transition-colors">Community Forum</a></li>
                <li><a href="#" className="hover:text-[var(--accent-cyan)] transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div>
              <h4 className="text-[var(--page-text)] font-bold text-lg mb-6">Stay Updated</h4>
              <p className="mb-4 text-sm">Join our newsletter to get updates on new labs, algorithms, and features.</p>
              <div className="flex bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-lg p-1">
                 <input type="email" placeholder="Enter your email" className="bg-transparent border-none outline-none text-[var(--page-text)] px-4 py-2 w-full text-sm" />
                 <button className="bg-[#6c2bd9] hover:bg-[#5c20e5] text-[var(--page-text)] px-4 py-2 rounded-md font-semibold text-sm transition-colors cursor-pointer">Subscribe</button>
              </div>
            </div>

          </div>

          {/* Copyright Bar */}
          <div className="pt-8 border-t border-[var(--glass-border)] flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
            <p>© 2026 VirtualLabX Education Sector. All rights reserved.</p>
            <div className="flex gap-6">
               <a href="#" className="hover:text-[var(--page-text)] transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-[var(--page-text)] transition-colors">Terms of Service</a>
               <a href="#" className="hover:text-[var(--page-text)] transition-colors">Cookie Policy</a>
            </div>
          </div>
          
        </div>
      </footer>
    </div>
  );
}
