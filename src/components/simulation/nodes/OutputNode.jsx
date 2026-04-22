import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function OutputNode({ data }) {
  const isRunning = data.status === 'running';
  const isComplete = data.status === 'success';

  let borderStyle = 'border-green-500/30';
  let flowFx = '';

  if (isRunning) {
    borderStyle = 'border-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.6)]';
    flowFx = 'animate-pulse';
  } else if (isComplete) {
    borderStyle = 'border-[#00e5ff] shadow-[0_0_30px_rgba(0,229,255,0.8)] bg-[#00e5ff]/10'; // Extra glow for final output
  }

  return (
    <div className={`bg-[#0a0510]/80 backdrop-blur-md rounded-xl p-4 w-48 border-2 transition-all duration-300 ${borderStyle} ${flowFx}`}>
       <Handle 
         type="target" 
         position={Position.Left} 
         className="w-3 h-3 bg-green-500 border-2 border-white/20" 
       />

       <div className="flex justify-between items-center mb-2">
         <span className="text-xs uppercase tracking-widest font-bold text-gray-400">Yield Output</span>
         {isComplete && <span className="text-[#00e5ff] text-sm font-black">★</span>}
       </div>
       <div className="text-white font-bold text-sm mb-3 wrap-break-word">{data.label || 'Final Result'}</div>
       
       <div className="bg-black/80 p-3 rounded-lg border border-white/20 flex flex-col items-center justify-center min-h-[64px]">
          <div className="text-[10px] text-gray-500 font-bold uppercase mb-1 w-full text-center">Engine Result</div>
          <div className={`font-mono text-xl font-black ${isComplete ? 'text-[#00e5ff] drop-shadow-[0_0_10px_rgba(0,229,255,1)]' : 'text-gray-600'}`}>
             {isComplete && data.result !== undefined 
                ? (typeof data.result === 'number' ? parseFloat(data.result.toFixed(4)) : String(data.result).toUpperCase()) 
                : '---'}
          </div>
       </div>
    </div>
  );
}
