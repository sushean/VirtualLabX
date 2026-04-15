import React from 'react';
import { STATUS } from './useMatrixSimulation';

export default function VisualizationPanel({ simState }) {
  const { activeI, activeJ, activeK, matrixA, matrixB, runningSum, status } = simState;

  if (status === STATUS.IDLE || activeI === -1) {
    return (
      <div className="bg-[#0b0614] border border-white/5 rounded-3xl p-8 shadow-2xl h-full flex flex-col justify-center items-center text-center">
        <div className="w-16 h-16 mb-4 rounded-full border border-white/10 flex items-center justify-center text-gray-600 bg-white/5">
           <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <p className="text-gray-500 uppercase tracking-widest font-bold text-sm">Engine Idle</p>
        <p className="text-gray-600 text-xs mt-2">Adjust dimensions and press Train Model to begin trace sequence.</p>
      </div>
    );
  }

  if (status === STATUS.FINISHED) {
    return (
      <div className="bg-[#0b0614] border border-[#4ade80]/30 rounded-3xl p-8 shadow-[0_0_30px_rgba(74,222,128,0.1)] h-full flex flex-col justify-center items-center text-center">
        <div className="w-16 h-16 mb-4 rounded-full border border-[#4ade80]/50 flex items-center justify-center text-[#4ade80] bg-[#4ade80]/10 shadow-[0_0_20px_#4ade80]">
           <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <p className="text-[#4ade80] uppercase tracking-widest font-bold text-lg mb-2">Simulation Complete</p>
        <p className="text-gray-400 text-sm">Matrix multiplication successfully yielded the result matrix C.</p>
      </div>
    );
  }

  const valA = matrixA[activeI] && matrixA[activeI][activeK] !== undefined ? matrixA[activeI][activeK] : 0;
  const valB = matrixB[activeK] && matrixB[activeK][activeJ] !== undefined ? matrixB[activeK][activeJ] : 0;
  const prod = valA * valB;

  return (
    <div className="bg-[#0b0614] border border-white/5 rounded-3xl p-6 lg:p-8 shadow-2xl h-full flex flex-col relative overflow-hidden">
       {/* Background structural glow */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-[#00e5ff]/5 rounded-full blur-[80px] pointer-events-none"></div>

       <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-6 border-b border-white/5 pb-2">Live Execution Trace</h3>
       
       {/* Loop Trackers */}
       <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5 mb-6 shadow-inner">
          <div className="text-center flex-1 border-r border-white/5">
            <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Target Cell</span>
            <span className="text-[#4ade80] font-mono font-bold">C[{activeI}][{activeJ}]</span>
          </div>
          <div className="text-center flex-1 border-r border-white/5">
            <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Row (i)</span>
            <span className="text-[#00e5ff] font-mono font-bold tracking-widest">{activeI}</span>
          </div>
          <div className="text-center flex-1 border-r border-white/5">
            <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Col (j)</span>
            <span className="text-[#6c2bd9] font-mono font-bold tracking-widest">{activeJ}</span>
          </div>
          <div className="text-center flex-1">
            <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Iterator (k)</span>
            <span className="text-yellow-400 font-mono font-bold tracking-widest">{activeK}</span>
          </div>
       </div>

       {/* Math Panel */}
       <div className="flex-1 flex flex-col justify-center items-center gap-6 mt-4 z-10">
          
          {/* Formula Line */}
          <div className="text-center">
             <div className="text-sm text-gray-500 uppercase font-bold tracking-widest mb-2">Evaluating Product Function</div>
             <div className="flex items-center gap-4 text-3xl font-mono">
                <div className="px-4 py-2 bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30 rounded-xl shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                  {valA}
                </div>
                <span className="text-gray-600">×</span>
                <div className="px-4 py-2 bg-[#6c2bd9]/10 text-[#6c2bd9] border border-[#6c2bd9]/30 rounded-xl shadow-[0_0_15px_rgba(108,43,217,0.2)]">
                  {valB}
                </div>
                <span className="text-gray-600">=</span>
                <div className="text-white font-bold">{prod}</div>
             </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2"></div>

          {/* Summation Line */}
          <div className="text-center">
             <div className="text-sm text-gray-500 uppercase font-bold tracking-widest mb-2">Running Target Vector Sum</div>
             <div className="flex items-center gap-4 text-2xl font-mono text-gray-300">
                <span className="text-gray-500">Σ </span>
                <span>{runningSum - prod}</span>
                <span className="text-gray-600">+</span>
                <span className="text-[#4ade80]">{prod}</span>
                <span className="text-gray-600">=</span>
                <div className="px-5 py-2 bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/30 rounded-xl shadow-[0_0_20px_rgba(74,222,128,0.2)] font-bold text-4xl">
                  {runningSum}
                </div>
             </div>
          </div>

       </div>
    </div>
  );
}
