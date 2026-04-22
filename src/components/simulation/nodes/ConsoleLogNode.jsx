import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function ConsoleLogNode({ data }) {
  const isRunning = data.status === 'running';
  const isComplete = data.status === 'success';

  let borderStyle = 'border-gray-500/30';
  let flowFx = '';

  if (isRunning) {
    borderStyle = 'border-white shadow-[0_0_20px_rgba(255,255,255,0.6)]';
    flowFx = 'animate-pulse';
  } else if (isComplete) {
    borderStyle = 'border-yellow-500/80 shadow-[0_0_15px_rgba(234,179,8,0.3)]';
  }

  const logMessage = data.config?.prefix || 'LOG:';

  return (
    <div className={`bg-[#0a0510]/80 backdrop-blur-md rounded-xl p-4 w-56 border-2 transition-all duration-300 ${borderStyle} ${flowFx}`}>
       <Handle 
         type="target" 
         position={Position.Left} 
         className="w-3 h-3 bg-gray-400 border-2 border-white/20" 
       />

       <div className="flex justify-between items-center mb-2">
         <span className="text-xs uppercase tracking-widest font-bold text-gray-500">System Log</span>
       </div>
       <div className="text-gray-300 font-bold text-sm mb-3 break-words">{data.label || 'Console Print'}</div>
       
       <div className="bg-black/90 p-3 rounded-lg border border-gray-700/50 flex flex-col justify-center min-h-[60px] custom-scrollbar">
          <div className="text-[10px] text-yellow-500/80 font-bold uppercase mb-1">STDOUT</div>
          <div className="text-green-400 font-mono text-[11px] break-all leading-tight">
             <span className="text-blue-400">{logMessage}</span>{' '}
             {isComplete && data.result !== undefined ? JSON.stringify(data.result) : '...'}
          </div>
       </div>

       <Handle 
         type="source" 
         position={Position.Right} 
         className="w-3 h-3 bg-gray-500 border-2 border-white/20" 
       />
    </div>
  );
}
