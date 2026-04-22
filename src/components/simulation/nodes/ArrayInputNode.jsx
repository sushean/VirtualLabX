import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function ArrayInputNode({ data }) {
  const isRunning = data.status === 'running';
  const isComplete = data.status === 'success';

  let borderStyle = 'border-amber-500/30';
  let flowFx = '';

  if (isRunning) {
    borderStyle = 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.6)]';
    flowFx = 'animate-pulse';
  } else if (isComplete) {
    borderStyle = 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]';
  }

  const onChange = (evt) => {
    if (data.onChangeLocal) {
       data.onChangeLocal(data.id, evt.target.value);
    }
  };

  return (
    <div className={`bg-[#0a0510]/80 backdrop-blur-md rounded-xl p-4 w-56 border-2 transition-all duration-300 ${borderStyle} ${flowFx}`}>
       
       <div className="flex justify-between items-center mb-2">
         <span className="text-xs uppercase tracking-widest font-bold text-amber-500">Array Block</span>
         {isComplete && <span className="text-green-400 text-sm">✓</span>}
       </div>
       <div className="text-white font-bold text-sm mb-3 break-words">{data.label || '1D List Sequence'}</div>
       
       <div className="bg-black/50 p-2 rounded-lg border border-amber-500/20 mb-2">
          <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Comma Formatted</div>
          <input 
            className="nodrag bg-[#110b27] border border-amber-500/20 rounded p-2 text-white w-full text-sm placeholder-amber-500/30 focus:outline-none focus:border-amber-400 shadow-inner"
            value={data.value || ''}
            onChange={onChange}
            disabled={isRunning || isComplete}
            placeholder="1, 2, 3, 4"
          />
       </div>

       <Handle 
         type="source" 
         position={Position.Right} 
         className="w-3 h-3 bg-amber-500 border-2 border-white/20" 
       />
    </div>
  );
}
