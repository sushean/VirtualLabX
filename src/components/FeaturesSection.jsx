import React from 'react';

export default function FeaturesSection() {
  return (
    <div className="pt-8 pb-16 text-center px-4 max-w-5xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 relative inline-block">Key Features
        <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"></span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col text-left hover:-translate-y-2 transition-transform duration-300 border-t border-t-white/10">
           <h3 className="text-xl font-bold mb-3 text-white">Interactive Simulations</h3>
           <p className="text-sm text-gray-400 mb-8 flex-grow leading-relaxed">Engage with dynamic experiments and modify state machines in real time to observe the transitions.</p>
           <button className="btn-primary w-[120px] text-sm">Try Now</button>
        </div>
        
        <div className="glass-card p-6 flex flex-col text-left hover:-translate-y-2 transition-transform duration-300 border-t border-t-white/10">
           <h3 className="text-xl font-bold mb-3 text-white">Step-by-Step Guidance</h3>
           <p className="text-sm text-gray-400 mb-8 flex-grow leading-relaxed">Follow detailed, easy steps that guide you through complex algorithmic constructions and theorems.</p>
           <button className="btn-primary w-[120px] text-sm">Try Now</button>
        </div>
        
        <div className="glass-card p-6 flex flex-col text-left hover:-translate-y-2 transition-transform duration-300 border-t border-t-white/10">
           <h3 className="text-xl font-bold mb-3 text-white">Code Challenges</h3>
           <p className="text-sm text-gray-400 mb-8 flex-grow leading-relaxed">Practice coding exercises that allow you to implement theoretical concepts using modern languages.</p>
           <button className="btn-primary w-[120px] text-sm">Try Now</button>
        </div>
      </div>
    </div>
  );
}
