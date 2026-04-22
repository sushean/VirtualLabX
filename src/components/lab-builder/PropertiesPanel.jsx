import { NodeRegistry } from '../simulation/registry/NodeRegistry';

export default function PropertiesPanel({ selectedNode, setNodes, setEdges }) {
  if (!selectedNode) {
    return (
      <div className="p-4 bg-[#0a0510]/80 border-l border-white/10 flex flex-col h-full w-72 z-10 shadow-[-2px_0_15px_rgba(0,0,0,0.5)]">
        <h2 className="text-xl font-bold mb-4 text-gray-300">Properties</h2>
        <p className="text-xs text-gray-500 mb-6">Select a node to configure its properties.</p>
        
        <div className="bg-black/50 p-3 rounded border border-white/5 text-xs text-gray-400">
           <span className="font-bold text-[#00e5ff] uppercase block mb-1">Keyboard Shortucts:</span>
           Click any node or connection line (edge) and press <kbd className="bg-white/10 px-1 rounded mx-1">Backspace</kbd> or <kbd className="bg-white/10 px-1 rounded mx-1">Delete</kbd> to remove it immediately natively!
        </div>
      </div>
    );
  }

  const onChangeLabel = (e) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === selectedNode.id) {
          n.data = { ...n.data, label: e.target.value };
        }
        return n;
      })
    );
  };

  const updateConfig = (key, value) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === selectedNode.id) {
          n.data = { 
            ...n.data, 
            config: { ...(n.data.config || {}), [key]: value } 
          };
        }
        return n;
      })
    );
  };

  const schema = NodeRegistry[selectedNode.type]?.configSchema || [];

  return (
    <div className="p-4 bg-[#0a0510]/80 border-l border-white/10 flex flex-col h-full w-72 z-10 shadow-[-2px_0_15px_rgba(0,0,0,0.5)]">
      <h2 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Node Config</h2>
      
      <div className="mb-4">
        <label className="block text-xs text-gray-400 mb-1">Node ID</label>
        <input 
          disabled
          value={selectedNode.id}
          className="w-full bg-black/50 border border-white/10 p-2 rounded text-xs text-gray-500"
        />
      </div>

      <div className="mb-4 text-xs font-bold text-gray-500 uppercase tracking-widest pb-2 border-b border-white/10">Type: {selectedNode.type}</div>

      <div className="mb-6">
        <label className="block text-xs text-gray-400 mb-1">Label</label>
        <input 
          value={selectedNode.data?.label || ''}
          onChange={onChangeLabel}
          className="w-full bg-[#110b27] border border-white/20 p-2 rounded text-sm text-white focus:outline-none focus:border-purple-500"
        />
      </div>

      {schema.map((field) => {
        const val = selectedNode.data?.config?.[field.key] ?? field.defaultValue ?? '';
        
        return (
          <div key={field.key} className="mb-6">
            <label className="block text-xs text-[#00e5ff] font-bold uppercase mb-2">{field.label}</label>
            {field.type === 'select' ? (
              <select 
                value={val}
                onChange={(e) => updateConfig(field.key, e.target.value)}
                className="w-full bg-[#110b27] border border-white/20 p-2 rounded text-sm text-white focus:outline-none focus:border-[#00e5ff] appearance-none cursor-pointer"
              >
                {field.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : field.type === 'number' ? (
              <input 
                type="number"
                value={val}
                onChange={(e) => updateConfig(field.key, Number(e.target.value))}
                className="w-full bg-[#110b27] border border-white/20 p-2 rounded text-sm text-white focus:outline-none focus:border-[#00e5ff]"
              />
            ) : (
              <input 
                value={val}
                onChange={(e) => updateConfig(field.key, e.target.value)}
                className="w-full bg-[#110b27] border border-white/20 p-2 rounded text-sm text-white focus:outline-none focus:border-[#00e5ff]"
              />
            )}
          </div>
        );
      })}

      <div className="mt-8 pt-4 border-t border-white/10">
         <button 
           onClick={() => {
              setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
              if (setEdges) setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
           }} 
           className="w-full bg-red-500/10 hover:bg-red-500/30 text-red-500 border border-red-500/50 py-2 rounded font-bold text-sm transition transition-all hover:shadow-[0_0_10px_rgba(239,68,68,0.3)] hover:scale-105 uppercase tracking-widest"
         >
            Delete Node
         </button>
      </div>

      <div className="mt-auto p-3 bg-black/40 rounded border border-white/5">
        <p className="text-[10px] text-gray-500 font-mono break-all">
          {JSON.stringify(selectedNode.data, null, 2)}
        </p>
      </div>
    </div>
  );
}
