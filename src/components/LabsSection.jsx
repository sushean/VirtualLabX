import React from 'react';
import { useNavigate } from 'react-router-dom';
import linearRegressionImg from '../assets/linear_regression.png';
import nfaImg from '../assets/nfa_simulator.png';
import exploreImg from '../assets/explore_all_labs.png';

export default function LabsSection() {
  const navigate = useNavigate();

  return (
    <div className="py-16 text-center px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-12">Explore Our Labs</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Card 1: Linear Regression */}
        <div className="glass-card flex flex-col p-0 overflow-hidden text-left hover:border-purple-500/50 transition-colors group cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]">
          <div className="p-8 pb-2">
             <h3 className="text-2xl font-bold mb-2">Linear Regression</h3>
          </div>
          <div className="px-8 pb-6">
             <button onClick={() => navigate('/labs/linear-regression')} className="btn-primary text-sm px-6">Try Now</button>
          </div>
          <div className="relative h-56 bg-gradient-to-t from-black/80 to-black/20 mt-auto overflow-hidden">
             <img src={linearRegressionImg} alt="Linear Regression" className="w-full h-full object-cover mix-blend-screen opacity-70 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 pt-2" />
             <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0f0a20] to-transparent"></div>
          </div>
        </div>
        
        {/* Card 2: NFA */}
        <div className="glass-card flex flex-col p-0 overflow-hidden text-left hover:border-blue-500/50 transition-colors group cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
          <div className="p-8 pb-2">
             <h3 className="text-2xl font-bold mb-2">NFA Simulator</h3>
          </div>
          <div className="px-8 pb-6">
             <button className="btn-primary text-sm px-6">Try Now</button>
          </div>
          <div className="relative h-56 bg-gradient-to-t from-black/80 to-black/20 mt-auto overflow-hidden">
             <img src={nfaImg} alt="NFA Simulator" className="w-full h-full object-cover mix-blend-screen opacity-70 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 pt-2" />
             <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0f0a20] to-transparent"></div>
          </div>
        </div>

        {/* Card 3: Explore All Labs */}
        <div 
          onClick={() => navigate('/labs')}
          className="glass-card flex flex-col p-0 overflow-hidden text-left border-white/10 hover:border-[#00e5ff]/50 transition-colors group cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(0,229,255,0.2)]"
        >
          <div className="p-8 pb-2">
             <h3 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">Explore All Labs</h3>
          </div>
          <div className="px-8 pb-6">
             <button className="bg-transparent border border-[#00e5ff]/50 text-[#00e5ff] hover:bg-[#00e5ff]/10 text-sm font-semibold py-2 px-6 rounded-full transition-all">View Gallery &rarr;</button>
          </div>
          <div className="relative h-56 bg-gradient-to-t from-black/80 to-black/20 mt-auto overflow-hidden">
             <img src={exploreImg} alt="Explore All Labs" className="w-full h-full object-cover mix-blend-screen opacity-70 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 pt-2" />
             <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0f0a20] to-transparent"></div>
          </div>
        </div>

      </div>
    </div>
  );
}
