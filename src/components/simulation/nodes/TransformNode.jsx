import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function TransformNode({ data }) {
  const isRunning = data.status === 'running';
  const isComplete = data.status === 'success';

  let borderStyle = 'border-blue-500/30';
  let flowFx = '';

  if (isRunning) {
    borderStyle = 'border-[#3b82f6] shadow-[0_0_20px_rgba(59,130,246,0.6)]';
    flowFx = 'animate-pulse';
  } else if (isComplete) {
    borderStyle = 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]';
  }

  const op = data.config?.operation || 'map';
  const param = data.config?.param || 2;

  return (
    <div className={`bg-[#0a0510]/80 backdrop-blur-md rounded-xl p-4 w-48 border-2 transition-all duration-300 ${borderStyle} ${flowFx}`}>
       <Handle 
         type="target" 
         position={Position.Left} 
         className="w-3 h-3 bg-blue-500 border-2 border-white/20" 
       />

       <div className="flex justify-between items-center mb-2">
         <span className="text-xs uppercase tracking-widest font-bold text-gray-400">Data Pipeline</span>
         {isComplete && <span className="text-green-400 text-sm">✓</span>}
       </div>
       <div className="text-white font-bold text-sm mb-3 break-words">{data.label || 'Transform Array'}</div>
       
       <div className="bg-black/50 p-2 rounded-lg border border-white/10 flex flex-col items-center justify-center gap-1">
          <div className="text-blue-400 font-extrabold text-sm uppercase">[{op}()]</div>
          <div className="text-[10px] text-gray-400 font-bold uppercase">Param: {param}</div>
       </div>

       <Handle 
         type="source" 
         position={Position.Right} 
         className="w-3 h-3 bg-purple-500 border-2 border-white/20" 
       />
    </div>
  );
}
