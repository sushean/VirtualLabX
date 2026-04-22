import React from 'react';
import { useNavigate } from 'react-router-dom';
import linearRegressionImg from '../assets/linear_regression.png';
import nfaImg from '../assets/nfa_simulator.png';
import dfaImg from '../assets/dfa_simulator.png';
import mathBasicsImg from '../assets/math_basics.png';
import WaveFooter from '../components/WaveFooter';

export default function AllLabsPage() {
  const navigate = useNavigate();
  const [labs, setLabs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Fetch dynamic labs from the new API
    const fetchLabs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/labs');
        if (!response.ok) throw new Error('Failed to fetch labs');
        const data = await response.json();
        setLabs(data);
      } catch (error) {
        console.error("Error loading labs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLabs();
  }, []);

  // Helper to map lab slugs to specific asset images if preferred, or a default
  const getLabImage = (slug) => {
    switch (slug) {
      case 'linear-regression': return linearRegressionImg;
      case 'matrix-multiplication': return mathBasicsImg;
      default: return dfaImg; // using dfaImg as a placeholder for dynamic ones
    }
  };

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

      {/* Dynamic Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 max-w-7xl mx-auto w-full mb-32 z-10 relative">
        {loading ? (
          <div className="col-span-full text-center text-gray-400">Loading labs...</div>
        ) : labs.length === 0 ? (
          <div className="col-span-full text-center text-gray-400">No labs currently available.</div>
        ) : (
          labs.map((lab) => {
            const isLocked = lab.status === 'LOCKED';
            const isUpcoming = lab.status === 'UPCOMING';
            
            return (
            <div key={lab._id || lab.slug} className={`glass-card flex flex-col p-0 overflow-hidden text-left border ${isUpcoming ? 'border-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.2)]' : 'border-white/5'} ${isLocked ? 'opacity-60 cursor-not-allowed grayscale-[50%]' : 'hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] cursor-pointer'} transition-all group bg-[#0a0510]/60 relative`}>
              
              {isLocked && <div className="absolute top-4 right-4 bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 z-20 backdrop-blur-sm shadow-[0_0_10px_rgba(239,68,68,0.3)]">🔒 {lab.statusMessage || 'LOCKED'}</div>}
              {isUpcoming && <div className="absolute top-4 right-4 bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/50 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 z-20 backdrop-blur-sm shadow-[0_0_10px_rgba(0,229,255,0.3)]">⚡ {lab.statusMessage || 'COMING SOON'}</div>}

              <div className="p-8 pb-2">
                 <h3 className="text-2xl font-bold mb-2">{lab.title}</h3>
                 {lab.category && <span className="text-xs text-purple-400 font-semibold mb-2 block">{lab.category}</span>}
              </div>
              <div className="px-8 pb-6 text-sm text-gray-300 flex-grow">
                 <p>{lab.description || 'Interactive simulation and learning lab.'}</p>
              </div>
              <div className="px-8 pb-6 relative z-30">
                 <button 
                   onClick={() => {
                      if (!isLocked) navigate(`/labs/${lab.slug}`);
                   }}
                   disabled={isLocked}
                   className={`text-sm px-6 font-bold shadow-lg transition-transform ${isLocked ? 'bg-black/80 text-gray-500 border border-white/10 py-2 rounded pointer-events-none' : 'btn-primary hover:scale-105'}`}
                 >
                   {isLocked ? 'Unavailable' : isUpcoming ? 'Preview Prototype' : 'Launch Lab'}
                 </button>
              </div>
              <div className="relative h-64 bg-gradient-to-t from-black/80 to-black/20 mt-auto overflow-hidden pointer-events-none">
                 <img src={getLabImage(lab.slug)} alt={lab.title} className={`w-full h-full object-cover mix-blend-screen opacity-70 group-hover:scale-105 ${!isLocked && 'group-hover:opacity-100'} transition-all duration-700 pt-2`} />
                 <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0f0a20] to-transparent"></div>
              </div>
            </div>
          )})
        )}
      </div>

      {/* Push Footer to bottom if content is short */}
      <div className="mt-auto">
        <WaveFooter />
      </div>
    </div>
  );
}
