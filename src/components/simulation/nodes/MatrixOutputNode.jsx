import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function MatrixOutputNode({ data }) {
  const isRunning = data.status === 'running';
  const isComplete = data.status === 'success';

  let borderStyle = 'border-teal-500/30';
  let flowFx = '';

  if (isRunning) {
    borderStyle = 'border-[#2dd4bf] shadow-[0_0_20px_rgba(45,212,191,0.6)]';
    flowFx = 'animate-pulse';
  } else if (isComplete) {
    borderStyle = 'border-[#2dd4bf] shadow-[0_0_30px_rgba(45,212,191,0.8)] bg-[#2dd4bf]/10'; // Extra glow for final output
  }

  const result = data.result;
  const isMatrix = Array.isArray(result) && Array.isArray(result[0]);

  return (
    <div className={`bg-[#0a0510]/80 backdrop-blur-md rounded-xl p-4 min-w-[200px] border-2 transition-all duration-300 ${borderStyle} ${flowFx}`}>
       <Handle 
         type="target" 
         position={Position.Left} 
         className="w-3 h-3 bg-teal-500 border-2 border-white/20" 
       />

       <div className="flex justify-between items-center mb-2">
         <span className="text-xs uppercase tracking-widest font-bold text-gray-400">Yield Matrix</span>
         {isComplete && <span className="text-[#2dd4bf] text-sm font-black">★</span>}
       </div>
       <div className="text-white font-bold text-sm mb-3 wrap-break-word">{data.label || 'Final Array'}</div>
       
       <div className="bg-black/80 p-3 rounded-lg border border-white/20 flex flex-col items-center justify-center min-h-[64px]">
          <div className="text-[10px] text-gray-500 font-bold uppercase mb-2 w-full text-center">Calculated Tensor</div>
          
          <div className={`font-mono text-xl font-black ${isComplete ? 'text-[#2dd4bf] drop-shadow-[0_0_10px_rgba(45,212,191,1)]' : 'text-gray-600'}`}>
             {!isComplete ? '---' : !isMatrix ? 'INVALID_TENSOR' : (
                <div className="flex flex-col gap-1 items-center">
                   {result.map((row, r) => (
                      <div key={r} className="flex gap-2">
                         <span className="text-white/30">[</span>
                         {row.map((cell, c) => (
                            <span key={c} className="w-8 text-center">{parseFloat(Number(cell).toFixed(3))}</span>
                         ))}
                         <span className="text-white/30">]</span>
                      </div>
                   ))}
                </div>
             )}
          </div>
       </div>
    </div>
  );
}
