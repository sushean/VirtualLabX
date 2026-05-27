import React, { useState, useEffect } from 'react';

const QuantumSimulationHub = () => {
  // Simple 1-qubit simulation for intuitive learning
  // State represented as probabilities: P(|0>) and P(|1>)
  const [qubits, setQubits] = useState([
    { id: 0, p0: 1, p1: 0, measured: false, log: ['Initialized to |0⟩'] },
    { id: 1, p0: 1, p1: 0, measured: false, log: ['Initialized to |0⟩'] }
  ]);
  
  const [entangled, setEntangled] = useState(false);

  const applyGate = (qubitId, gate) => {
    setQubits(prev => prev.map(q => {
      if (q.id !== qubitId) return q;
      if (q.measured) return q; // Cannot apply gates after measurement

      let newP0 = q.p0;
      let newP1 = q.p1;
      let action = '';

      if (gate === 'H') {
        // Hadamard puts it in superposition (simplification for probabilities)
        if (q.p0 === 1 || q.p1 === 1) {
          newP0 = 0.5;
          newP1 = 0.5;
        } else {
          // Simplification: Applying H to superposition brings it back to |0>
          newP0 = 1;
          newP1 = 0;
        }
        action = 'Applied Hadamard (H) Gate';
      } else if (gate === 'X') {
        // Pauli-X is a NOT gate
        newP0 = q.p1;
        newP1 = q.p0;
        action = 'Applied Pauli-X (NOT) Gate';
      }

      return {
        ...q,
        p0: newP0,
        p1: newP1,
        log: [...q.log, action]
      };
    }));
  };

  const applyCNOT = () => {
    // Simplified CNOT: Qubit 0 is Control, Qubit 1 is Target
    setQubits(prev => {
      const q0 = prev[0];
      const q1 = prev[1];
      if (q0.measured || q1.measured) return prev;

      if (q0.p1 === 1) {
        // Control is definitely 1, so flip Target
        return [
          q0,
          { ...q1, p0: q1.p1, p1: q1.p0, log: [...q1.log, 'Flipped by CNOT'] }
        ];
      } else if (q0.p0 === 0.5 && q0.p1 === 0.5) {
        // Control is in superposition, so they become entangled
        setEntangled(true);
        return [
          { ...q0, log: [...q0.log, 'Entangled via CNOT'] },
          { ...q1, p0: 0.5, p1: 0.5, log: [...q1.log, 'Entangled via CNOT'] }
        ];
      }
      return prev;
    });
  };

  const measure = (qubitId) => {
    setQubits(prev => {
      const q = prev.find(x => x.id === qubitId);
      if (q.measured) return prev;

      const random = Math.random();
      const resultIsZero = random < q.p0;
      
      const newQubits = prev.map(x => {
        if (x.id === qubitId) {
          return {
            ...x,
            p0: resultIsZero ? 1 : 0,
            p1: resultIsZero ? 0 : 1,
            measured: true,
            log: [...x.log, `Measured: |${resultIsZero ? '0' : '1'}⟩`]
          };
        }
        return x;
      });

      // Handle Entanglement Collapse
      if (entangled) {
        // If they are entangled (Bell State), measuring one collapses the other to the same state
        const otherId = qubitId === 0 ? 1 : 0;
        const otherQ = newQubits[otherId];
        if (!otherQ.measured) {
          newQubits[otherId] = {
            ...otherQ,
            p0: resultIsZero ? 1 : 0,
            p1: resultIsZero ? 0 : 1,
            measured: true,
            log: [...otherQ.log, `Collapsed via Entanglement: |${resultIsZero ? '0' : '1'}⟩`]
          };
        }
      }
      return newQubits;
    });
  };

  const reset = () => {
    setQubits([
      { id: 0, p0: 1, p1: 0, measured: false, log: ['System Reset. Initialized to |0⟩'] },
      { id: 1, p0: 1, p1: 0, measured: false, log: ['System Reset. Initialized to |0⟩'] }
    ]);
    setEntangled(false);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-full text-[var(--page-text)] animate-fade-in">
      {/* Control Panel */}
      <div className="w-full xl:w-[350px] shrink-0 flex flex-col gap-6">
        <div className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] pointer-events-none"></div>
           <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
             <span className="text-purple-500">⚛️</span> Quantum Gates
           </h3>
           
           <div className="space-y-6 relative z-10">
             {qubits.map(q => (
               <div key={q.id} className="p-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl">
                 <div className="flex justify-between items-center mb-4">
                   <h4 className="font-bold text-[var(--accent-cyan)]">Qubit {q.id}</h4>
                   {q.measured && <span className="text-[10px] uppercase font-bold bg-red-500/20 text-red-400 px-2 py-1 rounded">Collapsed</span>}
                 </div>
                 <div className="grid grid-cols-3 gap-2">
                   <button 
                     disabled={q.measured}
                     onClick={() => applyGate(q.id, 'H')}
                     className="btn-secondary text-sm py-2 disabled:opacity-50"
                   >
                     H
                   </button>
                   <button 
                     disabled={q.measured}
                     onClick={() => applyGate(q.id, 'X')}
                     className="btn-secondary text-sm py-2 disabled:opacity-50"
                   >
                     X
                   </button>
                   <button 
                     disabled={q.measured}
                     onClick={() => measure(q.id)}
                     className="bg-red-500/20 text-red-400 hover:bg-red-500/40 border border-red-500/30 rounded font-bold transition-colors disabled:opacity-50"
                   >
                     M
                   </button>
                 </div>
               </div>
             ))}

             <div className="p-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-center">
               <h4 className="font-bold text-purple-400 mb-3">Multi-Qubit Operations</h4>
               <button 
                 disabled={qubits[0].measured || qubits[1].measured || entangled}
                 onClick={applyCNOT}
                 className="w-full btn-secondary py-2 disabled:opacity-50 border-purple-500/50 hover:border-purple-400"
               >
                 CNOT (Control: Q0, Target: Q1)
               </button>
             </div>

             <button onClick={reset} className="w-full py-3 rounded-xl font-bold bg-gray-500/20 text-[var(--muted-text)] hover:text-white hover:bg-gray-500/40 transition-colors">
               Reset System
             </button>
           </div>
        </div>
      </div>

      {/* Visualization Canvas */}
      <div className="flex-1 bg-[var(--panel-bg)] border border-[var(--glass-border)] rounded-2xl p-8 relative overflow-hidden flex flex-col justify-center shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black opacity-60"></div>
         
         {entangled && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-purple-500/20 text-purple-300 px-6 py-2 rounded-full border border-purple-500/50 font-bold tracking-widest text-sm animate-pulse z-20">
              ⚡ QUBITS ENTANGLED ⚡
            </div>
         )}

         <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl mx-auto">
            {qubits.map(q => (
              <div key={q.id} className="flex flex-col items-center">
                 <h2 className="text-2xl font-black mb-8 text-[var(--page-text)] drop-shadow-md">Qubit {q.id}</h2>
                 
                 {/* Probability Bars representing Bloch Sphere Z-axis */}
                 <div className="flex items-end gap-8 h-48 mb-8 w-full justify-center">
                    <div className="w-16 h-full bg-black/50 rounded-t-xl border-x border-t border-[var(--glass-border)] relative flex items-end">
                       <div 
                         className="w-full bg-linear-to-t from-blue-600 to-[var(--accent-cyan)] rounded-t-lg transition-all duration-700 ease-in-out relative group"
                         style={{ height: `${q.p0 * 100}%` }}
                       >
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                           {Math.round(q.p0 * 100)}%
                         </div>
                       </div>
                       <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-black text-xl">|0⟩</div>
                    </div>
                    <div className="w-16 h-full bg-black/50 rounded-t-xl border-x border-t border-[var(--glass-border)] relative flex items-end">
                       <div 
                         className="w-full bg-linear-to-t from-purple-800 to-purple-400 rounded-t-lg transition-all duration-700 ease-in-out relative group"
                         style={{ height: `${q.p1 * 100}%` }}
                       >
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                           {Math.round(q.p1 * 100)}%
                         </div>
                       </div>
                       <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-black text-xl">|1⟩</div>
                    </div>
                 </div>

                 {/* Operation Log */}
                 <div className="w-full mt-10 p-4 bg-black/40 border border-[var(--glass-border)] rounded-xl h-40 overflow-y-auto custom-scrollbar flex flex-col justify-end">
                    {q.log.map((entry, idx) => (
                      <div key={idx} className="text-xs font-mono text-[var(--muted-text)] border-l-2 border-purple-500 pl-2 mb-2 animate-fade-in">
                        &gt; {entry}
                      </div>
                    ))}
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default QuantumSimulationHub;
