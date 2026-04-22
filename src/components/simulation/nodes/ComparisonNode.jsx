import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function ComparisonNode({ data }) {
  const isRunning = data.status === 'running';
  const isComplete = data.status === 'success';

  let borderStyle = 'border-orange-500/30';
  let flowFx = '';

  if (isRunning) {
    borderStyle = 'border-[#f97316] shadow-[0_0_20px_rgba(249,115,22,0.6)]';
    flowFx = 'animate-pulse';
  } else if (isComplete) {
    borderStyle = 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]';
  }

  const op = data.config?.operation || '>';

  return (
    <div className={`bg-[#0a0510]/80 backdrop-blur-md rounded-xl p-4 w-48 border-2 transition-all duration-300 ${borderStyle} ${flowFx}`}>
       <Handle 
         type="target" 
         position={Position.Left} 
         className="w-3 h-3 bg-orange-500 border-2 border-white/20" 
       />

       <div className="flex justify-between items-center mb-2">
         <span className="text-xs uppercase tracking-widest font-bold text-gray-400">Comparison</span>
         {isComplete && <span className="text-green-400 text-sm">✓</span>}
       </div>
       <div className="text-white font-bold text-sm mb-3 break-words">{data.label || 'Equation Test'}</div>
       
       <div className="bg-black/50 p-3 rounded-lg border border-white/10 flex items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-500/20 flex flex-shrink-0 items-center justify-center border border-orange-500/50 text-orange-400 font-extrabold text-xl shadow-[0_0_10px_rgba(249,115,22,0.5)]">
            {op}
          </div>
          <div className="flex-1 text-right">
             <div className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">Condition</div>
             <div className="text-white font-mono text-sm font-bold">
               {isComplete && data.result !== undefined ? (data.result ? 'TRUE' : 'FALSE') : '---'}
             </div>
          </div>
       </div>

       <Handle 
         type="source" 
         position={Position.Right} 
         className="w-3 h-3 bg-[#00e5ff] border-2 border-white/20" 
       />
    </div>
  );
}
