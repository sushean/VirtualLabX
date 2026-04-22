import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function ChartOutputNode({ data }) {
  const isRunning = data.status === 'running';
  const isComplete = data.status === 'success';

  let borderStyle = 'border-lime-500/30';
  let flowFx = '';

  if (isRunning) {
    borderStyle = 'border-[#84cc16] shadow-[0_0_20px_rgba(132,204,22,0.6)]';
    flowFx = 'animate-pulse';
  } else if (isComplete) {
    borderStyle = 'border-[#84cc16] shadow-[0_0_30px_rgba(132,204,22,0.8)] bg-[#84cc16]/10';
  }

  // Expect data.result to be an array of numbers
  const result = data.result;
  let chartData = [];
  if (Array.isArray(result)) {
    chartData = result.map(n => Number(n)).filter(n => !isNaN(n));
  }
  
  const maxVal = chartData.length > 0 ? Math.max(...chartData) : 1;

  return (
    <div className={`bg-[#0a0510]/80 backdrop-blur-md rounded-xl p-4 min-w-[240px] border-2 transition-all duration-300 ${borderStyle} ${flowFx}`}>
       <Handle 
         type="target" 
         position={Position.Left} 
         className="w-3 h-3 bg-lime-500 border-2 border-white/20" 
       />

       <div className="flex justify-between items-center mb-2">
         <span className="text-xs uppercase tracking-widest font-bold text-gray-400">Data Vis</span>
         {isComplete && <span className="text-lime-400 text-sm font-black">★</span>}
       </div>
       <div className="text-white font-bold text-sm mb-3 wrap-break-word">{data.label || 'Bar Chart Output'}</div>
       
       <div className="bg-black/80 p-3 rounded-lg border border-white/20 flex flex-col items-center justify-end min-h-[120px] pb-1">
          <div className="flex gap-1 items-end h-[80px] w-full justify-center">
             {!isComplete ? (
                <span className="text-[10px] text-gray-600 mb-auto mt-auto">Awaiting Array Array...</span>
             ) : chartData.length === 0 ? (
                <span className="text-[10px] text-red-500 mb-auto mt-auto">INVALID ARRAY</span>
             ) : (
                chartData.map((val, i) => {
                   const heightPct = maxVal === 0 ? 0 : Math.max(5, (val / maxVal) * 100);
                   return (
                     <div key={i} className="flex flex-col items-center justify-end group">
                        <div 
                          className="w-6 bg-lime-500/80 rounded-t hover:bg-lime-400 transition-colors" 
                          style={{ height: `${heightPct}%` }}
                          title={`Value: ${val}`}
                        ></div>
                        <span className="text-[8px] text-white mt-1 group-hover:text-lime-400">{val}</span>
                     </div>
                   )
                })
             )}
          </div>
       </div>
    </div>
  );
}
