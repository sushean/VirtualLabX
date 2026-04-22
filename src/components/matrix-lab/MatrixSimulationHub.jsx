import React from 'react';
import useMatrixSimulation, { STATUS } from './useMatrixSimulation';
import MatrixGrid from './MatrixGrid';
import MatrixInputParams from './MatrixInputParams';
import SimulationControls from './SimulationControls';
import VisualizationPanel from './VisualizationPanel';

export default function MatrixSimulationHub() {
  const simState = useMatrixSimulation();
  
  const { 
    matrixA, matrixB, resultMatrix, updateCell, 
    activeI, activeJ, activeK, status 
  } = simState;

  const isRunning = status === STATUS.RUNNING || status === STATUS.PAUSED;

  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in relative z-10">
       
       <div className="flex flex-col xl:flex-row gap-8">
          
          {/* Controls & Math Visualizer (Left Column) */}
          <div className="w-full xl:w-2/5 flex flex-col gap-6">
             <MatrixInputParams simState={simState} isDisabled={isRunning || status === STATUS.FINISHED} />
             <div className="flex-1 min-h-[400px]">
                <VisualizationPanel simState={simState} />
             </div>
          </div>

          {/* Grids Sandbox (Right Column) */}
          <div className="w-full xl:w-3/5 bg-[#0b0614] border border-white/5 shadow-2xl rounded-3xl p-6 lg:p-10 flex flex-col relative overflow-hidden min-h-150 justify-between">
             
             {/* Decorative Background grid lines */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
             
             <h2 className="text-xl font-bold text-gray-300 uppercase tracking-widest mb-8 border-b border-white/5 pb-2 relative z-10">
               Matrix Sandbox Environment
             </h2>

             {/* Matrix A & B (Inputs) */}
             <div className="flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-12 mb-12 relative z-10">
                
                <MatrixGrid 
                   title="Matrix A" 
                   matrix={matrixA} 
                   isEditable={!isRunning && status !== STATUS.FINISHED} 
                   onChange={(r, c, val) => updateCell('A', r, c, val)}
                   activeRow={activeI} 
                   activeCellR={activeI} activeCellC={activeK}
                   themeColor="cyan"
                />
                
                <div className="text-gray-500 font-bold text-3xl">×</div>

                <MatrixGrid 
                   title="Matrix B" 
                   matrix={matrixB} 
                   isEditable={!isRunning && status !== STATUS.FINISHED} 
                   onChange={(r, c, val) => updateCell('B', r, c, val)}
                   activeCol={activeJ} 
                   activeCellR={activeK} activeCellC={activeJ}
                   themeColor="purple"
                />

             </div>

             {/* Output Result Matrix C */}
             <div className="flex flex-col items-center justify-center relative z-10 pb-8">
                <div className="text-gray-500 font-bold text-3xl mb-12">=</div>
                
                <MatrixGrid 
                   title="Result Matrix (C)" 
                   matrix={resultMatrix} 
                   isEditable={false} 
                   activeRow={activeI} activeCol={activeJ}
                   activeCellR={activeI} activeCellC={activeJ}
                   themeColor="green"
                />
             </div>

          </div>
       </div>

       {/* Simulation Tape Controls */}
       <div className="w-full relative z-10">
          <SimulationControls simState={simState} />
       </div>

    </div>
  );
}
