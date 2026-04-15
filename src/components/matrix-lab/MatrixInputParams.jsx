import React from 'react';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function MatrixInputParams({ 
  simState, 
  isDisabled 
}) {
  const { 
    rowsA, colsA, rowsB, colsB, 
    changeDimensions, randomize, clear, errorMsg 
  } = simState;

  return (
    <div className="bg-[#0b0614] border border-white/5 shadow-2xl rounded-3xl p-6 lg:p-8 flex flex-col gap-6 z-10">
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-white/5 pb-4">
        <h3 className="text-xl font-bold text-white tracking-widest">Dimension Settings</h3>
        <div className="flex flex-wrap gap-2">
           <button 
             onClick={randomize} disabled={isDisabled}
             className="text-xs bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded uppercase tracking-widest font-bold hover:bg-purple-500/20 transition-all flex items-center gap-1 disabled:opacity-50 border border-purple-500/20"
           >
             <ShuffleIcon fontSize="small"/> Randomize
           </button>
           <button 
             onClick={clear} disabled={isDisabled}
             className="text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded uppercase tracking-widest font-bold hover:bg-red-500/20 transition-all flex items-center gap-1 disabled:opacity-50 border border-red-500/20"
           >
             <DeleteOutlineIcon fontSize="small"/> Clear
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Matrix A Dimensions */}
        <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/5">
          <h4 className="text-sm font-bold text-[#00e5ff] uppercase tracking-widest">Matrix A Limits</h4>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">Rows (m)</label>
              <input type="number" min="1" max="5" value={rowsA} disabled={isDisabled} onChange={(e) => changeDimensions('A', parseInt(e.target.value)||1, colsA)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white outline-none focus:border-[#00e5ff] shadow-inner font-mono text-center" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">Cols (n)</label>
              <input type="number" min="1" max="5" value={colsA} disabled={isDisabled} onChange={(e) => changeDimensions('A', rowsA, parseInt(e.target.value)||1)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white outline-none focus:border-[#00e5ff] shadow-inner font-mono text-center" />
            </div>
          </div>
        </div>

        {/* Matrix B Dimensions */}
        <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/5">
          <h4 className="text-sm font-bold text-[#6c2bd9] uppercase tracking-widest">Matrix B Limits</h4>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">Rows (n)</label>
              <input type="number" min="1" max="5" value={rowsB} disabled={isDisabled} onChange={(e) => changeDimensions('B', parseInt(e.target.value)||1, colsB)}
                className={`w-full bg-white/10 border rounded-lg px-3 py-2 text-white outline-none shadow-inner font-mono text-center transition-colors ${errorMsg ? 'border-red-500' : 'border-white/20 focus:border-[#6c2bd9]'}`} />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">Cols (p)</label>
              <input type="number" min="1" max="5" value={colsB} disabled={isDisabled} onChange={(e) => changeDimensions('B', rowsB, parseInt(e.target.value)||1)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white outline-none focus:border-[#6c2bd9] shadow-inner font-mono text-center" />
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-4 rounded-xl transition-all animate-fade-in text-center font-bold">
           ⚠️ {errorMsg}
        </div>
      )}
    </div>
  );
}
