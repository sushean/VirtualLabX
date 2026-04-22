import React, { useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';

export default function MatrixInputNode({ data }) {
  const isRunning = data.status === 'running';
  const isComplete = data.status === 'success';

  let borderStyle = 'border-pink-500/30';
  let flowFx = '';

  if (isRunning) {
    borderStyle = 'border-[#ec4899] shadow-[0_0_20px_rgba(236,72,153,0.6)]';
    flowFx = 'animate-pulse';
  } else if (isComplete) {
    borderStyle = 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]';
  }

  const rows = data.config?.rows || 2;
  const cols = data.config?.columns || 2;

  // Initialize Matrix data if null
  useEffect(() => {
     if (!data.value || !Array.isArray(data.value)) {
         const newMatrix = Array.from({ length: rows }, () => Array(cols).fill(0));
         if (data.onChangeLocal) data.onChangeLocal(data.id, newMatrix);
     }
  }, [rows, cols, data.value, data.onChangeLocal, data.id]);

  const updateCell = (r, c, val) => {
     const newMatrix = Array.isArray(data.value) ? [...data.value.map(row => [...row])] : Array.from({ length: rows }, () => Array(cols).fill(0));
     // Ensure boundaries
     while (newMatrix.length < rows) newMatrix.push(Array(cols).fill(0));
     newMatrix.forEach(row => { while(row.length < cols) row.push(0); });
     
     newMatrix[r][c] = Number(val);
     if (data.onChangeLocal) data.onChangeLocal(data.id, newMatrix);
  };

  const matrix = Array.isArray(data.value) ? data.value : [];

  return (
    <div className={`bg-[#0a0510]/80 backdrop-blur-md rounded-xl p-4 min-w-[200px] border-2 transition-all duration-300 ${borderStyle} ${flowFx}`}>
       
       <div className="flex justify-between items-center mb-2">
         <span className="text-xs uppercase tracking-widest font-bold text-pink-400">Matrix Source</span>
         {isComplete && <span className="text-green-400 text-sm">✓</span>}
       </div>
       <div className="text-white font-bold text-sm mb-3 break-words">{data.label || '2D Tensor'}</div>
       
       <div className="bg-black/50 p-3 rounded-lg border border-pink-500/20 flex flex-col items-center justify-center relative">
          <div className="text-[10px] text-gray-400 font-bold uppercase mb-2">Configure {rows}×{cols}</div>
          
          <div className="flex flex-col gap-1 w-full justify-center items-center">
             {Array.from({ length: rows }).map((_, r) => (
                <div key={`r-${r}`} className="flex gap-1">
                   {Array.from({ length: cols }).map((_, c) => (
                      <input 
                        key={`c-${c}`}
                        type="number"
                        disabled={isRunning || isComplete}
                        value={matrix[r]?.[c] ?? 0}
                        onChange={e => updateCell(r, c, e.target.value)}
                        className="nodrag w-12 h-10 bg-[#110b27] border border-white/10 rounded text-center text-[#ff79c6] font-mono text-sm focus:border-pink-500 focus:outline-none transition-colors"
                      />
                   ))}
                </div>
             ))}
          </div>
       </div>

       <Handle 
         type="source" 
         position={Position.Right} 
         className="w-3 h-3 bg-pink-500 border-2 border-white/20" 
       />
    </div>
  );
}
