import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroVideo from '../assets/53613-475000662_medium.mp4';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center pt-48 pb-16 px-4 text-center overflow-hidden min-h-screen">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-x-0 top-0 w-full h-[110%] object-cover pointer-events-none -z-20 mix-blend-screen opacity-70"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Flawless Edge Blending Gradients matching new plum color #140d20 */}
      <div className="absolute inset-x-0 top-0 h-[150px] bg-linear-to-b from-[#140d20] to-transparent -z-10 pointer-events-none"></div>
      <div className="absolute inset-x-0 bottom-0 h-75 bg-gradient-to-t from-[#140d20] to-transparent -z-10 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
          Virtual Lab Platform
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-semibold text-[#00e5ff] mb-8 drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]">
          Learn by Doing, Not Just Reading
        </h2>
        
        <p className="text-gray-200 bg-black/40 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 max-w-2xl mb-12 text-base md:text-lg leading-relaxed drop-shadow-sm font-medium shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          Interactive simulations to master Theory of Computation concepts.
          Visualize complex automata like DFA, NFA, PDA, and Turing Machines effortlessly.
        </p>
        
        <button 
          onClick={() => navigate('/labs')}
          className="btn-primary text-xl px-10 py-4 rounded-xl shadow-[0_0_30px_rgba(108,43,217,0.5)] hover:shadow-[0_0_50px_rgba(108,43,217,0.8)] transition-all transform hover:-translate-y-1 font-bold border border-white/10"
        >
          Start Experimenting
        </button>
      </div>
    </div>
  );
}
