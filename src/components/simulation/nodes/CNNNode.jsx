import React from 'react';
import { Handle, Position } from '@xyflow/react';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';

export default function CNNNode({ data }) {
  const isRunning = data.status === 'running';
  const isComplete = data.status === 'success';

  let borderStyle = 'border-indigo-500/40';
  let flowFx = '';

  if (isRunning) {
    borderStyle = 'border-[#818cf8] shadow-[0_0_20px_rgba(129,140,248,0.6)]';
    flowFx = 'animate-pulse';
  } else if (isComplete) {
    borderStyle = 'border-[#4ade80] shadow-[0_0_15px_rgba(74,222,128,0.4)]';
  }

  const layerType = data.config?.layerType || 'Dense (Linear)';
  const nodeCount = data.config?.nodes || 32;

  return (
    <div className={`bg-[#0a0510]/80 backdrop-blur-md rounded-xl p-4 min-w-[220px] border-2 transition-all duration-300 ${borderStyle} ${flowFx}`}>
       <Handle 
         type="target" 
         position={Position.Left} 
         className="w-3 h-3 bg-indigo-500 border-2 border-white/20" 
       />

       <div className="flex justify-between items-center mb-2">
         <span className="text-xs uppercase tracking-widest font-bold text-indigo-400">AI / ML Layer</span>
         {isComplete && <span className="text-green-400 text-sm">✓</span>}
       </div>
       <div className="text-white font-bold text-lg mb-3 wrap-break-word leading-tight">{data.label || 'Network Layer'}</div>
       
       <div className="bg-black/60 p-3 rounded-lg border border-indigo-500/20 flex items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-1 opacity-10">
             <AutoAwesomeMosaicIcon style={{ fontSize: 60 }} />
          </div>
          <div className="z-10 w-full">
             <div className="flex justify-between items-center w-full mb-1 border-b border-indigo-500/20 pb-1">
                <span className="text-[10px] text-indigo-300/80 font-bold uppercase">Type</span>
                <span className="text-white font-mono text-xs font-bold">{layerType}</span>
             </div>
             <div className="flex justify-between items-center w-full">
                <span className="text-[10px] text-indigo-300/80 font-bold uppercase">Neurons</span>
                <span className="text-[#818cf8] font-mono text-xs font-bold">{nodeCount} params</span>
             </div>
          </div>
       </div>

       <Handle 
         type="source" 
         position={Position.Right} 
         className="w-3 h-3 bg-indigo-500 border-2 border-white/20" 
       />
    </div>
  );
}
