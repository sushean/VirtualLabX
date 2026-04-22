import React from 'react';

export default function NodePanel() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="p-4 bg-[#0a0510]/80 border-r border-white/10 flex flex-col h-full w-64 z-10 shadow-[2px_0_15px_rgba(0,0,0,0.5)]">
      <h2 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#00e5ff]">Node Palette</h2>
      <p className="text-xs text-gray-400 mb-4">Drag these nodes onto the canvas.</p>
      <div className="flex flex-col gap-4">
        <div 
          className="p-3 border border-purple-500/30 rounded cursor-grab bg-purple-900/20 hover:bg-purple-900/40 text-center text-sm font-semibold transition-all hover:scale-105"
          onDragStart={(event) => onDragStart(event, 'input')} 
          draggable
        >
          Input Node
        </div>
        <div 
          className="p-3 border border-blue-500/30 rounded cursor-grab bg-blue-900/20 hover:bg-blue-900/40 text-center text-sm font-semibold transition-all hover:scale-105"
          onDragStart={(event) => onDragStart(event, 'default')} 
          draggable
        >
          Process Node
        </div>
        <div 
          className="p-3 border border-green-500/30 rounded cursor-grab bg-green-900/20 hover:bg-green-900/40 text-center text-sm font-semibold transition-all hover:scale-105"
          onDragStart={(event) => onDragStart(event, 'output')} 
          draggable
        >
          Output Node
        </div>
        <div 
          className="p-3 border border-yellow-500/30 rounded cursor-grab bg-yellow-900/20 hover:bg-yellow-900/40 text-center text-sm font-semibold transition-all hover:scale-105"
          onDragStart={(event) => onDragStart(event, 'custom')} 
          draggable
        >
          Custom Operation
        </div>
      </div>
    </div>
  );
}
