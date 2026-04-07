import React, { useState, useEffect, useRef } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import {
  ComposedChart, LineChart, Line, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function LinearRegressionSimulation() {
  const defaultX = '50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150';
  const defaultY = '7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15';

  const [inputX, setInputX] = useState(defaultX);
  const [inputY, setInputY] = useState(defaultY);

  const [dataX, setDataX] = useState([]);
  const [dataY, setDataY] = useState([]);
  const [xStats, setXStats] = useState({ mean: 0, std: 1 });

  // Native Gradient Descent Model weights (on SCALED data)
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  // Hyperparameters
  const [learningRate, setLearningRate] = useState(0.1);
  const [isRunning, setIsRunning] = useState(false);
  
  // Tracking Stats
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(0);
  const [lossHistory, setLossHistory] = useState([]);

  const [bounds, setBounds] = useState({ minX: 30, maxX: 170, minY: 4, maxY: 18 });

  // Statistical Normalization
  const parseData = () => {
    const parsedX = inputX.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    const parsedY = inputY.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    
    if (parsedX.length > 0 && parsedY.length > 0 && parsedX.length === parsedY.length) {
      setDataX(parsedX);
      setDataY(parsedY);
      
      const paddingX = 20;
      const paddingY = Math.max(3, (Math.max(...parsedY) - Math.min(...parsedY)) * 0.2);
      setBounds({
        minX: Math.max(0, Math.min(...parsedX) - paddingX),
        maxX: Math.max(...parsedX) + paddingX,
        minY: Math.max(0, Math.min(...parsedY) - paddingY),
        maxY: Math.max(...parsedY) + paddingY,
      });

      // Z-Score Math for unexploding X
      const meanX = parsedX.reduce((sum, val) => sum + val, 0) / parsedX.length;
      const stdX = Math.sqrt(parsedX.reduce((sum, val) => sum + Math.pow(val - meanX, 2), 0) / parsedX.length) || 1;
      setXStats({ mean: meanX, std: stdX });
    }
  };

  useEffect(() => {
    parseData();
  }, [inputX, inputY]);

  const randomizeData = () => {
    const ptsX = [];
    const ptsY = [];
    const rndSlope = (Math.random() * 0.8) - 0.2; // random slope constraint
    const rndIntercept = Math.random() * 20;
    
    for(let i=10; i<=200; i+=15) {
       ptsX.push(i);
       const noise = (Math.random() - 0.5) * 15;
       let valY = Math.round((rndSlope * i + rndIntercept + noise) * 10) / 10;
       ptsY.push(Math.max(1, valY)); // ensure positive 
    }
    setIsRunning(false);
    setInputX(ptsX.join(', '));
    setInputY(ptsY.join(', '));
    initializeModel();
  };

  const trueA = a / xStats.std;
  const trueB = b - (a * xStats.mean / xStats.std);

  const calculateTrueLoss = (currentA, currentB) => {
    if (dataX.length === 0) return 0;
    let totalError = 0;
    for (let i = 0; i < dataX.length; i++) {
      const pred = currentA * dataX[i] + currentB;
      const err = pred - dataY[i];
      totalError += err * err;
    }
    return totalError / dataX.length;
  };

  const initializeModel = () => {
    setIsRunning(false);
    setA(0);
    
    // Set B intercept smartly to global mean of Y so it starts bounded visibly
    const startB = dataY.length > 0 ? dataY.reduce((s,v)=>s+v,0)/dataY.length : 0;
    setB(startB);
    
    setEpoch(0);
    setLossHistory([]);
    // Update raw loss tracker
    const initialTrueLoss = calculateTrueLoss(0, startB);
    setLoss(initialTrueLoss);
  };

  useEffect(() => {
     // Fire loss update if initialize wasn't directly called
     if(epoch === 0 && dataY.length > 0) {
        setLoss(calculateTrueLoss(trueA, trueB));
     }
  }, [dataX, dataY]);

  const toggleSimulation = () => {
    if(!isRunning && Number.isNaN(loss)) {
        initializeModel(); // recover from divergence explosion
    }
    setIsRunning(!isRunning);
  };

  // TRUE Physics Gradient Descent Loop
  useEffect(() => {
    let timeoutId;

    const trainBatch = () => {
      if (!isRunning || dataX.length === 0) return;

      const n = dataX.length;
      let gradA = 0;
      let gradB = 0;
      
      // Calculate scaled gradients
      for (let i = 0; i < n; i++) {
        const xScaled = (dataX[i] - xStats.mean) / xStats.std;
        const pred = a * xScaled + b;
        const err = pred - dataY[i];
        
        gradA += (2 / n) * xScaled * err;
        gradB += (2 / n) * err;
      }

      setEpoch(prev => {
         const currentEpoch = prev + 1;
         
         setA(prevA => {
             const newA = prevA - learningRate * gradA;
             setB(prevB => {
                 const newB = prevB - learningRate * gradB;
                 
                 // Calc physical true weights mapped back to real domain
                 const tA = newA / xStats.std;
                 const tB = newB - (newA * xStats.mean / xStats.std);
                 const currentLoss = calculateTrueLoss(tA, tB);
                 
                 setLoss(currentLoss);

                 // Append to live history selectively to prevent RAM explosion
                 if (currentEpoch % 3 === 0 || Number.isNaN(currentLoss)) {
                    setLossHistory(hist => {
                        const newHist = [...hist, { epoch: currentEpoch, err: currentLoss }];
                        if (newHist.length > 150) newHist.shift(); // keep graph dynamic looking window
                        return newHist;
                    });
                 }
                 
                 if (Number.isNaN(currentLoss) || currentLoss > 10000) {
                    setIsRunning(false); // Stop if they explode the physics engine
                 }
                 
                 return newB;
             });
             return newA;
         });
         return currentEpoch;
      });

      if (isRunning) {
        timeoutId = setTimeout(trainBatch, 50); // Slow down the simulation frame rate
      }
    };

    if (isRunning) {
      timeoutId = setTimeout(trainBatch, 50);
    }

    return () => clearTimeout(timeoutId);
  }, [isRunning, a, b, dataX, dataY, learningRate, xStats]);


  // Construct primary mathematical payload for Scatter Chart
  const mergedData = [];
  if (dataX.length > 0 && !Number.isNaN(trueA) && !Number.isNaN(trueB)) {
    mergedData.push({ x: bounds.minX, pointY: null, lineY: trueA * bounds.minX + trueB });
    for(let i=0; i<dataX.length; i++) {
       mergedData.push({ 
          x: dataX[i], 
          pointY: dataY[i], 
          lineY: trueA * dataX[i] + trueB 
       });
    }
    mergedData.push({ x: bounds.maxX, pointY: null, lineY: trueA * bounds.maxX + trueB });
    mergedData.sort((m1, m2) => m1.x - m2.x);
  }

  // Custom tooltips
  const CustomScatterTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#110b27] border border-white/10 p-4 rounded-xl shadow-2xl glass-card">
          <p className="text-gray-300 font-mono mb-2"><span className="text-[#00e5ff] font-bold">X:</span> {payload[0].payload.x.toFixed(2)}</p>
          {payload[0].payload.pointY !== null && (
             <p className="text-gray-300 font-mono"><span className="text-purple-400 font-bold">Y:</span> {payload[0].payload.pointY}</p>
          )}
          <p className="text-gray-300 font-mono mt-2 pt-2 border-t border-white/10">
             <span className="text-purple-500 font-bold">prediction:</span> {payload[0].payload.lineY.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLossTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-red-900/80 backdrop-blur-md border border-red-500/50 p-4 rounded-xl shadow-2xl">
          <p className="text-white font-mono"><span className="font-bold">Epoch:</span> {payload[0].payload.epoch}</p>
          <p className="text-red-200 font-mono mt-1"><span className="text-red-400 font-bold">MSE:</span> {payload[0].payload.err.toFixed(4)}</p>
        </div>
      );
    }
    return null;
  };

  const isExploded = Number.isNaN(loss) || loss > 9999;

  return (
    <div className="flex flex-col gap-6 animate-page-enter max-w-[1400px] mx-auto w-full px-2">
      
      {/* 1. Engineering Controls Top Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0b0612] p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
        
        {/* Dataset Controls (Col 8) */}
        <div className="lg:col-span-7 flex flex-col gap-4 z-10">
          <h3 className="text-xl font-bold text-[#00e5ff] flex items-center justify-between border-b border-white/5 pb-2">
             <span>Data Input Vector</span>
             <button 
               onClick={randomizeData}
               className="text-xs bg-[#00e5ff]/10 text-[#00e5ff] px-3 py-1.5 rounded uppercase tracking-widest font-bold hover:bg-[#00e5ff]/20 transition-all flex items-center gap-1"
             >
               <ShuffleIcon fontSize="small"/> Randomize
             </button>
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col xl:flex-row xl:items-center gap-3 w-full">
              <div className="w-12 text-center bg-black/60 px-2 py-2 rounded-lg font-mono text-[#00e5ff] font-bold border border-[#00e5ff]/20">X</div>
              <input 
                type="text" 
                value={inputX} 
                onChange={(e) => setInputX(e.target.value)}
                className="flex-1 w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-[#00e5ff]/50 transition-colors text-sm tracking-wide"
              />
            </div>
            <div className="flex flex-col xl:flex-row xl:items-center gap-3 w-full">
              <div className="w-12 text-center bg-black/60 px-2 py-2 rounded-lg font-mono text-purple-400 font-bold border border-purple-500/20">Y</div>
              <input 
                type="text" 
                value={inputY} 
                onChange={(e) => setInputY(e.target.value)}
                className="flex-1 w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-purple-500/50 transition-colors text-sm tracking-wide"
              />
            </div>
          </div>
        </div>

        {/* Hyperparameter Controls (Col 5) */}
        <div className="lg:col-span-5 flex flex-col gap-4 z-10 border-l border-white/5 lg:pl-6 pt-6 lg:pt-0 border-t lg:border-t-0">
          <h3 className="text-xl font-bold text-purple-400 border-b border-white/5 pb-2">Hyperparameters Optimizer</h3>
          
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex justify-between items-center text-gray-400 text-sm font-bold uppercase tracking-widest">
              <span>Learning Rate (α)</span>
              <span className="text-white font-mono bg-purple-900/30 px-2 py-1 rounded">{learningRate.toFixed(4)}</span>
            </div>
            <input 
              type="range" 
              min="0.005" 
              max="0.5" 
              step="0.005" 
              value={learningRate} 
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">High rates cause divergence & explosion</p>
          </div>

          <div className="flex gap-3 mt-auto pt-2 w-full">
            <button 
              onClick={initializeModel}
              className="flex-1 flex items-center justify-center gap-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-300 font-bold py-3 px-2 rounded-lg transition-all border border-purple-500/30 text-sm xl:text-base uppercase"
            >
              <RestartAltIcon fontSize="small"/> Reset
            </button>
            
            <button 
              onClick={toggleSimulation}
              className={`flex-[2] flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-lg transition-all shadow-lg uppercase tracking-wide text-sm xl:text-base ${
                isRunning 
                  ? 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30 animate-pulse' 
                  : 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/50 hover:bg-[#00e5ff]/30'
              }`}
            >
              {isRunning ? <><StopIcon fontSize="small"/> Pause Physics</> : <><PlayArrowIcon fontSize="small"/> Train Model</>}
            </button>
          </div>
        </div>
      </div>

      {/* Warning Alert if Exploded */}
      {isExploded && (
         <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-xl flex items-center gap-4 animate-page-enter">
            <div className="bg-red-500/20 p-2 rounded-full"><StopIcon className="text-red-500"/></div>
            <div>
              <h4 className="text-red-400 font-bold text-lg">Gradient Explosion Detected</h4>
              <p className="text-red-300/80 text-sm">Learning rate α was too high causing absolute divergence. Lower the learning rate and initialize the model.</p>
            </div>
         </div>
      )}

      {/* 2. Dual Plotting Dashboard */}
      <div className="flex flex-col gap-8 w-full items-stretch mt-4">
        
        {/* Primary Scatter Plane (Line Graph) */}
        <div className={`bg-[#0b0614] border rounded-2xl p-6 shadow-2xl flex flex-col relative transition-colors duration-[1s] w-full ${isExploded ? 'border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.2)]' : 'border-white/10'}`}>
           <h4 className="flex justify-between items-center w-full mb-6 z-10 text-sm font-bold tracking-widest uppercase border-b border-white/5 pb-3">
             <span className="text-gray-400">Target (Y)</span>
             <span className="text-white font-mono bg-black/40 px-3 py-1 rounded shadow-inner border border-white/5">
                y' = {Number.isNaN(trueA) ? 'NaN' : trueA.toFixed(3)}x {trueB >= 0 ? '+' : '-'} {Number.isNaN(trueB) ? 'NaN' : Math.abs(trueB).toFixed(3)}
             </span>
           </h4>

           <div className="w-full relative h-[450px]">
             <ResponsiveContainer width="100%" height="100%">
               <ComposedChart data={mergedData} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                 <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="5 5" />
                 <XAxis dataKey="x" type="number" domain={[bounds.minX, bounds.maxX]} stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 13}} tickMargin={10} allowDataOverflow={true}/>
                 <YAxis type="number" domain={[bounds.minY, bounds.maxY]} stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 13}} tickMargin={10} allowDataOverflow={true} tickFormatter={(tick) => tick.toFixed(1)}/>
                 <Tooltip content={<CustomScatterTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                 <Scatter dataKey="pointY" fill="#00e5ff" isAnimationActive={false} r={8}/>
                 {dataX.length > 0 && !isExploded && (
                   <Line 
                      type="linear" dataKey="lineY" stroke="#a855f7" strokeWidth={5} dot={false} isAnimationActive={false} activeDot={false}
                   />
                 )}
               </ComposedChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Live Loss Monitoring Plane */}
        <div className={`bg-[#0b0614] border rounded-2xl p-6 shadow-2xl flex flex-col relative transition-colors duration-[1s] w-full ${isExploded ? 'border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.2)]' : 'border-white/10'}`}>
           <h4 className="flex justify-between items-center w-full mb-6 z-10 text-sm font-bold tracking-widest uppercase border-b border-white/5 pb-3">
             <span className="text-gray-400">Live Loss Tracking</span>
             <div className="flex gap-4">
                <span className="text-gray-500">Epoch: <span className="text-white ml-1">{epoch}</span></span>
                <span className="text-gray-500">MSE: <span className={`ml-1 font-bold ${isExploded ? 'text-red-500' : 'text-green-400'}`}>{isExploded ? 'NaN' : loss.toFixed(4)}</span></span>
             </div>
           </h4>

           <div className="w-full relative h-[450px]">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={lossHistory} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                 <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />
                 <XAxis 
                    dataKey="epoch" 
                    type="number" 
                    domain={['dataMin', 'dataMax']} 
                    stroke="#4b5563" 
                    tick={{fontSize: 12, fill:"#6b7280"}}
                    tickFormatter={(tick) => tick.toFixed(0)}
                    label={{ value: 'Epoch Iterator', position: 'insideBottom', offset: -10, fill: '#6b7280', fontSize: 11 }}
                 />
                 <YAxis 
                    dataKey="err" 
                    type="number" 
                    scale="log" 
                    domain={['dataMin', 'auto']} 
                    stroke="#4b5563" 
                    tick={{fontSize: 12, fill:"#6b7280"}}
                    tickFormatter={(tick) => tick.toFixed(1)}
                    label={{ value: 'MSE (Error)', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 11 }}
                 />
                 <Tooltip content={<CustomLossTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                 <Line 
                    type="monotone" 
                    dataKey="err" 
                    stroke="#ef4444" 
                    strokeWidth={3} 
                    dot={false} 
                    isAnimationActive={false}
                    className="drop-shadow-md"
                 />
               </LineChart>
             </ResponsiveContainer>
           </div>
           
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10">
              <span className="text-8xl font-black text-red-500">MSE</span>
           </div>
        </div>

      </div>
    
    </div>
  );
}
