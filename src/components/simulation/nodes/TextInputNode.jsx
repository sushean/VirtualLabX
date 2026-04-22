import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function TextInputNode({ data }) {
  const isRunning = data.status === 'running';
  const isComplete = data.status === 'success';

  let borderStyle = 'border-cyan-500/30';
  let flowFx = '';

  if (isRunning) {
    borderStyle = 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)]';
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
    <div className={`bg-[#0a0510]/80 backdrop-blur-md rounded-xl p-4 w-48 border-2 transition-all duration-300 ${borderStyle} ${flowFx}`}>
       
       <div className="flex justify-between items-center mb-2">
         <span className="text-xs uppercase tracking-widest font-bold text-cyan-400">String Gen</span>
         {isComplete && <span className="text-green-400 text-sm">✓</span>}
       </div>
       <div className="text-white font-bold text-sm mb-3 wrap-break-word">{data.label || 'Text String'}</div>
       
       <div className="flex items-center gap-2 mb-2">
          <input 
            className="nodrag bg-[#110b27] border border-cyan-500/20 rounded p-2 text-white w-full text-sm placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400 shadow-inner"
            value={data.value || ''}
            onChange={onChange}
            disabled={isRunning || isComplete}
            placeholder="Type value..."
          />
       </div>

       <Handle 
         type="source" 
         position={Position.Right} 
         className="w-3 h-3 bg-cyan-500 border-2 border-white/20" 
       />
    </div>
  );
}
