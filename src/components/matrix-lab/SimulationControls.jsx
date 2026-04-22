import React from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { STATUS } from './useMatrixSimulation';

export default function SimulationControls({ simState }) {
  const { 
     status, speedMs, setSpeedMs, errorMsg,
     play, pause, step, resetSimulation
  } = simState;

  const isIdle = status === STATUS.IDLE;
  const isRunning = status === STATUS.RUNNING;
  const isPaused = status === STATUS.PAUSED;
  const isFinished = status === STATUS.FINISHED;
  const hasError = status === STATUS.ERROR || errorMsg !== '';

  return (
    <div className="bg-[#0b0614] border border-white/5 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
       
       {/* Speed Slider */}
       <div className="w-full md:w-1/3 flex flex-col gap-2">
         <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span>Execution Speed</span>
            <span className="bg-white/10 px-2 py-1 rounded text-white font-mono">{speedMs}ms</span>
         </div>
         <input 
            type="range" min="100" max="2500" step="100" 
            value={speedMs} 
            onChange={(e) => setSpeedMs(Number(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00e5ff]"
         />
       </div>

       {/* Control Buttons */}
       <div className="flex gap-3 w-full md:w-auto">
          <button 
             onClick={resetSimulation}
             className="flex-1 md:flex-none border border-white/10 text-gray-400 bg-white/5 hover:bg-white/10 hover:text-white px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all flex justify-center items-center gap-2"
          >
             <RestartAltIcon fontSize="small"/> {isFinished ? "Retry" : "Reset"}
          </button>

          <button 
             onClick={step}
             disabled={isRunning || hasError}
             className="flex-1 md:flex-none border border-yellow-500/30 text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20 px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all flex justify-center items-center gap-1 disabled:opacity-30"
          >
             <SkipNextIcon fontSize="small"/> Step
          </button>

          {isRunning ? (
            <button 
               onClick={pause}
               className="flex-[2] md:flex-none bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] flex justify-center items-center gap-2"
            >
               <PauseIcon fontSize="small"/> Pause
            </button>
          ) : (
            <button 
               onClick={play}
               disabled={hasError}
               className="flex-[2] md:flex-none bg-linear-to-r from-[#6c2bd9] to-[#00e5ff] text-white border border-white/20 hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all flex justify-center items-center gap-2 disabled:opacity-40 disabled:hover:shadow-none"
            >
               <PlayArrowIcon fontSize="small"/> {isPaused ? "Resume" : "Train Model"}
            </button>
          )}
       </div>

    </div>
  );
}
