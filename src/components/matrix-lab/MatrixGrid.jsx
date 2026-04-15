import React from 'react';

export default function MatrixGrid({
  title, 
  matrix, 
  isEditable = false, 
  onChange, 
  activeRow = -1, 
  activeCol = -1, 
  activeCellR = -1, 
  activeCellC = -1,
  themeColor = "cyan"
}) {
  
  const getThemeClasses = (r, c) => {
    let classes = "w-12 h-12 flex items-center justify-center text-center font-mono font-bold rounded-lg transition-all duration-300 border ";
    
    const isCellActive = (r === activeCellR && c === activeCellC);
    const isRowActive = r === activeRow;
    const isColActive = c === activeCol;
    
    // Base style
    classes += "bg-[#0a0510]/50 text-white border-white/10 ";

    if (themeColor === 'cyan') {
      if (isCellActive) classes += "bg-[#00e5ff] text-black border-[#00e5ff] shadow-[0_0_20px_#00e5ff] scale-110 z-10 ";
      else if (isRowActive) classes += "bg-[#00e5ff]/20 border-[#00e5ff]/50 ";
    } 
    else if (themeColor === 'purple') {
      if (isCellActive) classes += "bg-[#6c2bd9] text-white border-[#6c2bd9] shadow-[0_0_20px_#6c2bd9] scale-110 z-10 ";
      else if (isColActive) classes += "bg-[#6c2bd9]/20 border-[#6c2bd9]/50 ";
    }
    else if (themeColor === 'green') {
      if (isCellActive) classes += "bg-[#4ade80] text-black border-[#4ade80] shadow-[0_0_20px_#4ade80] scale-110 z-10 ";
      else if (isRowActive && isColActive) classes += "bg-[#4ade80]/20 border-[#4ade80]/50 ";
      else if (matrix[r][c] !== 0 && matrix[r][c] !== undefined && (activeRow !== -1 || activeCol !== -1)) {
        // If it's a finished populated cell in result matrix during trace
        classes += "text-[#4ade80] border-[#4ade80]/30 ";
      }
    }

    return classes;
  };

  const getContainerGlow = () => {
     if (themeColor === 'cyan' && activeRow !== -1) return "shadow-[0_0_30px_rgba(0,229,255,0.15)] border-[#00e5ff]/30";
     if (themeColor === 'purple' && activeCol !== -1) return "shadow-[0_0_30px_rgba(108,43,217,0.15)] border-[#6c2bd9]/30";
     if (themeColor === 'green' && activeRow !== -1 && activeCol !== -1) return "shadow-[0_0_30px_rgba(74,222,128,0.15)] border-[#4ade80]/30";
     return "border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.4)]";
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-gray-400 font-bold tracking-widest uppercase mb-3 text-sm">{title}</h3>
      <div className={`p-6 rounded-2xl bg-black/40 border transition-all duration-500 backdrop-blur-md relative ${getContainerGlow()}`}>
        
        {/* Draw abstract matrix brackets using borders */}
        <div className="absolute top-4 bottom-4 left-4 w-3 border-l-4 border-t-4 border-b-4 border-white/20 rounded-l"></div>
        <div className="absolute top-4 bottom-4 right-4 w-3 border-r-4 border-t-4 border-b-4 border-white/20 rounded-r"></div>

        <div className="flex flex-col gap-2 relative z-10 px-4 py-2">
          {matrix.map((rowArr, r) => (
            <div key={r} className="flex gap-2">
              {rowArr.map((val, c) => (
                isEditable ? (
                  <input
                    key={c}
                    type="text"
                    value={val === 0 && document.activeElement !== document.getElementById(`${title}-${r}-${c}`) ? '0' : val}
                    id={`${title}-${r}-${c}`}
                    onChange={(e) => onChange(r, c, e.target.value)}
                    className={`${getThemeClasses(r, c)} focus:outline-none placeholder-gray-600`}
                    placeholder="0"
                  />
                ) : (
                  <div key={c} className={getThemeClasses(r, c)}>
                    {val}
                  </div>
                )
              ))}
            </div>
          ))}
        </div>
        
        {/* Matrix Dimension Label */}
        <div className="absolute -bottom-6 right-0 text-[10px] uppercase font-bold tracking-widest text-gray-500">
           {matrix.length} × {matrix[0]?.length || 0}
        </div>
      </div>
    </div>
  );
}
