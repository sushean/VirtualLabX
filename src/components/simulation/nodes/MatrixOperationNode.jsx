import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function MatrixOperationNode({ data }) {
  const isRunning = data.status === 'running';
  const isComplete = data.status === 'success';

  let borderStyle = 'border-rose-500/30';
  let flowFx = '';

  if (isRunning) {
    borderStyle = 'border-[#f43f5e] shadow-[0_0_20px_rgba(244,63,94,0.6)]';
    flowFx = 'animate-pulse';
  } else if (isComplete) {
    borderStyle = 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]';
  }

  const op = data.config?.operation || 'multiply';
  const opSymbol = op === 'multiply' ? '[ × ]' : op === 'transpose' ? 'Aᵀ' : op === 'determinant' ? '|A|' : 'Op';

  return (
    <div className={`bg-[#0a0510]/80 backdrop-blur-md rounded-xl p-4 w-48 border-2 transition-all duration-300 ${borderStyle} ${flowFx}`}>
       <Handle 
         type="target" 
         position={Position.Left} 
         className="w-3 h-3 bg-rose-500 border-2 border-white/20" 
       />

       <div className="flex justify-between items-center mb-2">
         <span className="text-xs uppercase tracking-widest font-bold text-gray-400">Tensor Math</span>
         {isComplete && <span className="text-green-400 text-sm">✓</span>}
       </div>
       <div className="text-white font-bold text-sm mb-3 wrap-break-word">{data.label || 'Matrix Alg'}</div>
       
       <div className="bg-black/50 p-3 rounded-lg border border-white/10 flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded bg-rose-500/20 flex shrink-0 items-center justify-center border border-rose-500/50 text-rose-400 font-extrabold text-sm shadow-[0_0_10px_rgba(244,63,94,0.5)]">
            {opSymbol}
          </div>
          <div className="flex-1 text-right">
             <div className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">Yield Type</div>
             <div className="text-white font-mono text-[10px] font-bold">
               {isComplete && data.result !== undefined ? (typeof data.result === 'number' ? 'SCALAR' : '2D_TENSOR') : '---'}
             </div>
          </div>
       </div>

       <Handle 
         type="source" 
         position={Position.Right} 
         className="w-3 h-3 bg-purple-500 border-2 border-white/20" 
       />
    </div>
  );
}
