import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';

export default function InputNode({ data, id }) {
  const [val, setVal] = useState(data.value || 0);

  // Sync back to ReactFlow strictly during initialization if needed
  useEffect(() => {
    if (data.onChangeLocal) {
       data.onChangeLocal(id, val);
    }
  }, [val]);

  // Determine styles strictly dynamically by execution state tracking mapped natively down from FlowRenderer
  const isRunning = data.status === 'running';
  const isComplete = data.status === 'success';

  let borderStyle = 'border-purple-500/30';
  let flowFx = '';

  if (isRunning) {
    borderStyle = 'border-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.6)]';
    flowFx = 'animate-pulse';
  } else if (isComplete) {
    borderStyle = 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]';
  }

  return (
    <div className={`bg-[#0a0510]/80 backdrop-blur-md rounded-xl p-4 w-48 border-2 transition-all duration-300 ${borderStyle} ${flowFx}`}>
       <div className="flex justify-between items-center mb-2">
         <span className="text-xs uppercase tracking-widest font-bold text-gray-400">Input Node</span>
         {isComplete && <span className="text-green-400 text-sm">✓</span>}
       </div>
       <div className="text-white font-bold text-sm mb-3 break-words">{data.label || 'Default Input'}</div>
       
       <div className="bg-black/50 p-2 rounded-lg border border-white/10">
          <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Injection Value</label>
          <input 
            type="number" 
            value={val}
            onChange={(e) => setVal(Number(e.target.value))}
            className="nodrag w-full bg-transparent text-[#00e5ff] font-mono text-lg font-bold outline-none"
            disabled={isRunning || isComplete} // Lock input dynamically during execution!
          />
       </div>

       <Handle 
         type="source" 
         position={Position.Right} 
         className="w-3 h-3 bg-purple-500 border-2 border-white/20" 
       />
    </div>
  );
}
