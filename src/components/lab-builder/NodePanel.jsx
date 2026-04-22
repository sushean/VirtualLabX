import React from 'react';
import { NodeRegistry } from '../simulation/registry/NodeRegistry';

export default function NodePanel() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const categories = [...new Set(Object.values(NodeRegistry).map(n => n.category))];

  return (
    <div className="w-64 bg-[#0a0510]/80 border-r border-white/10 p-4 flex flex-col h-full z-10 shadow-[2px_0_15px_rgba(0,0,0,0.5)] overflow-y-auto custom-scrollbar">
      <h2 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">Node Palette</h2>
      <p className="text-xs text-gray-400 mb-6 pb-4 border-b border-white/10">Drag these nodes onto the canvas.</p>

      <div className="flex flex-col gap-6">
        {categories.map(category => (
          <div key={category}>
             <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 pl-1">{category} Nodes</h3>
             <div className="flex flex-col gap-2">
                {Object.entries(NodeRegistry).filter(([_, def]) => def.category === category).map(([type, def]) => {
                   let borderColor = 'border-white/10 hover:border-purple-500';
                   if (def.category === 'input') borderColor = 'border-blue-500/30 hover:border-blue-400';
                   if (def.category === 'output') borderColor = 'border-green-500/30 hover:border-green-400';
                   if (def.category === 'control') borderColor = 'border-yellow-500/30 hover:border-yellow-400';
                   if (def.category === 'machine-learning') borderColor = 'border-indigo-500/40 hover:border-indigo-400';

                   return (
                     <div
                        key={type}
                        className={`bg-[#120a1f]/80 p-3 rounded-lg border ${borderColor} cursor-grab active:cursor-grabbing text-center text-sm font-bold text-gray-300 transition-all hover:bg-white/5 hover:shadow-lg shadow-[0_4px_10px_rgba(0,0,0,0.2)]`}
                        onDragStart={(event) => onDragStart(event, type)}
                        draggable
                     >
                        {def.label}
                     </div>
                   );
                })}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
