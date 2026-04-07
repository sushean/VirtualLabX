import React from 'react';
import { useNavigate } from 'react-router-dom';
import linearRegressionImg from '../assets/linear_regression.png';
import nfaImg from '../assets/nfa_simulator.png';
import dfaImg from '../assets/dfa_simulator.png';
import WaveFooter from '../components/WaveFooter';

export default function AllLabsPage() {
  const navigate = useNavigate();

  const genericLabs = [
    { id: 'linear-regression', title: "Linear Regression", img: linearRegressionImg },
    { id: 'nfa', title: "NFA Simulator", img: nfaImg },
    { id: 'turing', title: "Turing Machine", img: dfaImg }, 
    { id: 'pda', title: "Pushdown Automata", img: nfaImg },
    { id: 'regex', title: "Regex Engine", img: dfaImg },
    { id: 'compiler', title: "Compiler Parser", img: nfaImg },
  ];

  return (
    <div className="min-h-screen text-white relative font-sans flex flex-col pt-32 animate-page-enter">
      
      {/* Page Header */}
      <div className="text-center px-4 max-w-5xl mx-auto mb-16 relative z-10 w-full">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#00e5ff]">All Labs</span>
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
          Access our complete library of interactive theoretical computer science simulators and start experimenting immediately.
        </p>
      </div>

      {/* Grid Layout identical to LabsSection but expanded */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 max-w-7xl mx-auto w-full mb-32 z-10 relative">
        {genericLabs.map((lab, idx) => (
          <div key={idx} className="glass-card flex flex-col p-0 overflow-hidden text-left border border-white/5 hover:border-purple-500/50 transition-colors group cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] bg-[#0a0510]/60">
            <div className="p-8 pb-2">
               <h3 className="text-2xl font-bold mb-2">{lab.title}</h3>
            </div>
            <div className="px-8 pb-6">
               <button 
                 onClick={() => navigate(`/labs/${lab.id}`)}
                 className="btn-primary text-sm px-6 hover:scale-105"
               >
                 Launch Lab
               </button>
            </div>
            <div className="relative h-64 bg-gradient-to-t from-black/80 to-black/20 mt-auto overflow-hidden">
               <img src={lab.img} alt={lab.title} className="w-full h-full object-cover mix-blend-screen opacity-70 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 pt-2" />
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0f0a20] to-transparent"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Push Footer to bottom if content is short */}
      <div className="mt-auto">
        <WaveFooter />
      </div>
    </div>
  );
}
