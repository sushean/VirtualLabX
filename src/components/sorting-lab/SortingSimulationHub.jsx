import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
    bubbleSort, selectionSort, insertionSort, 
    mergeSortWrapper, quickSortWrapper, heapSort, 
    countingSort, radixSort, shellSort 
} from './SortingAlgorithms';

const ALGORITHMS = {
    'Bubble Sort': bubbleSort,
    'Selection Sort': selectionSort,
    'Insertion Sort': insertionSort,
    'Merge Sort': mergeSortWrapper,
    'Quick Sort': quickSortWrapper,
    'Heap Sort': heapSort,
    'Counting Sort': countingSort,
    'Radix Sort': radixSort,
    'Shell Sort': shellSort
};

const generateRandomArray = (size, min = 10) => {
    let arr = Array.from({ length: size }, (_, i) => i + min);
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

const ArrayVisualizer = ({ array, comparing, swapping, sorted, pivot, isComplete }) => {
    const maxVal = Math.max(...array, 1);
    
    return (
        <div className="flex items-end justify-center h-64 w-full gap-[2px] bg-black/40 p-4 rounded-xl border border-[var(--glass-border)] shadow-inner overflow-hidden">
            {array.map((value, idx) => {
                let bgColor = 'bg-blue-500';
                if (isComplete) bgColor = 'bg-green-500';
                else if (sorted.includes(idx)) bgColor = 'bg-green-500';
                else if (swapping.includes(idx)) bgColor = 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] z-10';
                else if (comparing.includes(idx)) bgColor = 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)] z-10';
                else if (pivot === idx) bgColor = 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] z-10';

                return (
                    <div 
                        key={idx}
                        style={{ height: `${(value / maxVal) * 100}%`, width: `${100 / array.length}%` }}
                        className={`transition-all duration-100 ease-in-out rounded-t-sm ${bgColor}`}
                        title={`Value: ${value}`}
                    ></div>
                );
            })}
        </div>
    );
};

const NodeVisualizer = ({ array, comparing, swapping, sorted, pivot, isComplete }) => {
    return (
        <div className="flex flex-wrap items-center justify-center min-h-[16rem] w-full gap-3 bg-black/40 p-6 rounded-xl border border-[var(--glass-border)] shadow-inner overflow-hidden">
            {array.map((value, idx) => {
                let borderColor = 'border-blue-500/50';
                let textColor = 'text-blue-300';
                let bgColor = 'bg-blue-500/10';
                let shadow = 'shadow-[0_0_15px_rgba(59,130,246,0.1)]';
                let scale = 'scale-100';
                
                if (isComplete) { borderColor = 'border-green-500'; textColor = 'text-green-400'; bgColor = 'bg-green-500/20'; shadow = 'shadow-[0_0_15px_rgba(34,197,94,0.3)]'; }
                else if (sorted.includes(idx)) { borderColor = 'border-green-500'; textColor = 'text-green-400'; bgColor = 'bg-green-500/20'; shadow = 'shadow-[0_0_15px_rgba(34,197,94,0.3)]'; }
                else if (swapping.includes(idx)) { borderColor = 'border-red-500'; textColor = 'text-red-400'; bgColor = 'bg-red-500/20'; shadow = 'shadow-[0_0_20px_rgba(239,68,68,0.5)]'; scale = 'scale-110 z-10'; }
                else if (comparing.includes(idx)) { borderColor = 'border-yellow-400'; textColor = 'text-yellow-400'; bgColor = 'bg-yellow-400/20'; shadow = 'shadow-[0_0_20px_rgba(250,204,21,0.4)]'; scale = 'scale-105 z-10'; }
                else if (pivot === idx) { borderColor = 'border-purple-500'; textColor = 'text-purple-400'; bgColor = 'bg-purple-500/20'; shadow = 'shadow-[0_0_20px_rgba(168,85,247,0.4)]'; scale = 'scale-105 z-10'; }

                return (
                    <motion.div 
                        layout
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        key={value}
                        className={`transition-colors duration-300 ease-in-out flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold text-lg ${bgColor} ${borderColor} ${textColor} ${shadow} ${scale}`}
                        title={`Index: ${idx}`}
                    >
                        {value}
                    </motion.div>
                );
            })}
        </div>
    );
};

const useSortingEngine = (initialArray, speedMs) => {
    const [array, setArray] = useState([...initialArray]);
    const [comparing, setComparing] = useState([]);
    const [swapping, setSwapping] = useState([]);
    const [sorted, setSorted] = useState([]);
    const [pivot, setPivot] = useState(null);
    const [isComplete, setIsComplete] = useState(false);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [algoName, setAlgoName] = useState('Bubble Sort');
    
    const [stats, setStats] = useState({ comparisons: 0, swaps: 0, timeElapsed: 0 });
    
    const generatorRef = useRef(null);
    const timeoutRef = useRef(null);
    const startTimeRef = useRef(null);

    const reset = (newArr) => {
        setArray([...newArr]);
        setComparing([]);
        setSwapping([]);
        setSorted([]);
        setPivot(null);
        setIsComplete(false);
        setIsPlaying(false);
        setStats({ comparisons: 0, swaps: 0, timeElapsed: 0 });
        generatorRef.current = null;
        if(timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const step = () => {
        if (isComplete) return;
        if (!generatorRef.current) {
            generatorRef.current = ALGORITHMS[algoName]([...array]);
            startTimeRef.current = Date.now() - stats.timeElapsed;
        }

        const result = generatorRef.current.next();
        
        if (!result.done && result.value) {
            const state = result.value;
            setArray(state.array || array);
            setComparing(state.comparing || []);
            setSwapping(state.swapping || []);
            setSorted(state.sorted || []);
            setPivot(state.pivot !== undefined ? state.pivot : null);
            
            setStats(prev => ({
                comparisons: prev.comparisons + (state.comparing?.length > 0 ? 1 : 0),
                swaps: prev.swaps + (state.swapping?.length > 0 ? 1 : 0),
                timeElapsed: Date.now() - startTimeRef.current
            }));

            if (state.isComplete) {
                setIsComplete(true);
                setIsPlaying(false);
            }
        } else {
            setIsComplete(true);
            setIsPlaying(false);
            setComparing([]);
            setSwapping([]);
            setPivot(null);
        }
    };

    useEffect(() => {
        if (isPlaying && !isComplete) {
            timeoutRef.current = setTimeout(() => {
                step();
            }, speedMs);
        }
        return () => clearTimeout(timeoutRef.current);
    }, [isPlaying, array, comparing, swapping]);

    return {
        array, comparing, swapping, sorted, pivot, isComplete,
        isPlaying, setIsPlaying, algoName, setAlgoName, reset, step, stats
    };
};

export default function SortingSimulationHub() {
    const [arraySize, setArraySize] = useState(30);
    const [baseArray, setBaseArray] = useState(() => generateRandomArray(30));
    const [speedMultiplier, setSpeedMultiplier] = useState(1);
    const [compareMode, setCompareMode] = useState(false);
    const [visualMode, setVisualMode] = useState('bars'); // 'bars' | 'nodes'

    const speedMs = 100 / speedMultiplier;

    const engine1 = useSortingEngine(baseArray, speedMs);
    const engine2 = useSortingEngine(baseArray, speedMs);

    const generateNewArray = (type = 'random') => {
        let newArr = [];
        if (type === 'random') newArr = generateRandomArray(arraySize);
        else if (type === 'nearly') {
            newArr = generateRandomArray(arraySize);
            newArr.sort((a,b) => a-b);
            for(let i=0; i<Math.floor(arraySize/10); i++) {
                let idx1 = Math.floor(Math.random()*arraySize);
                let idx2 = Math.floor(Math.random()*arraySize);
                [newArr[idx1], newArr[idx2]] = [newArr[idx2], newArr[idx1]];
            }
        } else if (type === 'reverse') {
            newArr = generateRandomArray(arraySize);
            newArr.sort((a,b) => b-a);
        }
        setBaseArray(newArr);
        engine1.reset(newArr);
        engine2.reset(newArr);
    };

    const handlePlayPause = () => {
        const newState = !engine1.isPlaying;
        engine1.setIsPlaying(newState);
        if (compareMode) engine2.setIsPlaying(newState);
    };

    const handleStep = () => {
        engine1.setIsPlaying(false);
        engine1.step();
        if (compareMode) {
            engine2.setIsPlaying(false);
            engine2.step();
        }
    };

    useEffect(() => {
        generateNewArray();
    }, [arraySize]);

    const isRunning = engine1.isPlaying || (compareMode && engine2.isPlaying);

    return (
        <div className="flex flex-col gap-6 animate-page-enter">
            
            {/* Control Panel */}
            <div className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-xl z-20 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* Data Controls */}
                    <div className="space-y-4 border-r border-[var(--glass-border)] pr-4">
                        <h3 className="text-[#00e5ff] font-bold text-sm uppercase tracking-widest flex items-center gap-2">Data Input</h3>
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Array Size: {arraySize}</label>
                            <input 
                                type="range" min="10" max="150" value={arraySize} 
                                onChange={(e) => setArraySize(Number(e.target.value))}
                                className="w-full accent-[#00e5ff]"
                                disabled={isRunning}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={()=>generateNewArray('random')} disabled={isRunning} className="text-[10px] bg-[var(--glass-bg)] hover:bg-white/10 px-2 py-1 rounded border border-[var(--glass-border)] transition-colors uppercase">Random</button>
                            <button onClick={()=>generateNewArray('nearly')} disabled={isRunning} className="text-[10px] bg-[var(--glass-bg)] hover:bg-white/10 px-2 py-1 rounded border border-[var(--glass-border)] transition-colors uppercase">Nearly Sorted</button>
                            <button onClick={()=>generateNewArray('reverse')} disabled={isRunning} className="text-[10px] bg-[var(--glass-bg)] hover:bg-white/10 px-2 py-1 rounded border border-[var(--glass-border)] transition-colors uppercase">Reversed</button>
                        </div>
                    </div>

                    {/* Simulation Controls */}
                    <div className="space-y-4 border-r border-[var(--glass-border)] px-4">
                        <h3 className="text-purple-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2">Controls</h3>
                        <div className="flex gap-2">
                            <button onClick={handlePlayPause} className={`flex-1 font-bold py-2 rounded-lg text-white shadow-lg transition-all uppercase tracking-widest text-xs ${isRunning ? 'bg-red-500 hover:bg-red-400 shadow-red-500/30' : 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/30'}`}>
                                {isRunning ? 'Pause' : 'Start'}
                            </button>
                            <button onClick={handleStep} disabled={isRunning} className="w-16 bg-[var(--glass-bg)] hover:bg-white/10 border border-[var(--glass-border)] rounded-lg flex items-center justify-center transition-colors text-xs font-bold uppercase tracking-widest" title="Step forward">Step</button>
                            <button onClick={()=>generateNewArray()} className="w-16 bg-[var(--glass-bg)] hover:bg-white/10 border border-[var(--glass-border)] rounded-lg flex items-center justify-center transition-colors text-xs font-bold uppercase tracking-widest" title="Reset array">Reset</button>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 mb-1 flex justify-between">
                                <span>Playback Speed: {speedMultiplier}x</span>
                            </label>
                            <div className="flex gap-1">
                                {[0.25, 0.5, 1, 2, 5, 10].map(s => (
                                    <button key={s} onClick={() => setSpeedMultiplier(s)} className={`flex-1 text-[10px] py-1 rounded border transition-colors ${speedMultiplier === s ? 'bg-[#00e5ff]/20 text-[#00e5ff] border-[#00e5ff]/50 font-bold' : 'bg-[var(--glass-bg)] text-gray-400 border-[var(--glass-border)] hover:bg-white/10'}`}>{s}x</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Algorithm Selection 1 */}
                    <div className={`space-y-4 ${compareMode ? 'border-r border-[var(--glass-border)] px-4' : 'px-4 col-span-2'}`}>
                        <div className="flex justify-between items-center">
                            <h3 className="text-yellow-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2">Engine 1</h3>
                            {!compareMode && (
                                <button onClick={() => setCompareMode(true)} className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full uppercase font-bold hover:bg-green-500/30 transition-colors">Compare Mode</button>
                            )}
                        </div>
                        <select 
                            value={engine1.algoName} 
                            onChange={(e) => { engine1.setAlgoName(e.target.value); generateNewArray(); }}
                            disabled={isRunning}
                            className="w-full bg-black/50 border border-[var(--glass-border)] rounded-lg p-2 text-white focus:border-[#00e5ff]/50 transition-colors cursor-pointer"
                        >
                            {Object.keys(ALGORITHMS).map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                        
                        <div className="bg-black/30 rounded-lg p-3 border border-[var(--glass-border)] text-xs font-mono grid grid-cols-2 gap-2">
                            <div className="text-gray-400">Comparisons: <span className="text-yellow-400 font-bold text-sm">{engine1.stats.comparisons}</span></div>
                            <div className="text-gray-400">Swaps: <span className="text-red-400 font-bold text-sm">{engine1.stats.swaps}</span></div>
                            <div className="text-gray-400 col-span-2">Time: <span className="text-white font-bold">{engine1.stats.timeElapsed}ms</span></div>
                        </div>
                    </div>

                    {/* Algorithm Selection 2 (Compare Mode) */}
                    {compareMode && (
                        <div className="space-y-4 px-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-pink-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2">Engine 2</h3>
                                <button onClick={() => setCompareMode(false)} className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full uppercase font-bold hover:bg-red-500/30 transition-colors">Disable</button>
                            </div>
                            <select 
                                value={engine2.algoName} 
                                onChange={(e) => { engine2.setAlgoName(e.target.value); generateNewArray(); }}
                                disabled={isRunning}
                                className="w-full bg-black/50 border border-[var(--glass-border)] rounded-lg p-2 text-white focus:border-pink-500/50 transition-colors cursor-pointer"
                            >
                                {Object.keys(ALGORITHMS).map(name => <option key={name} value={name}>{name}</option>)}
                            </select>
                            
                            <div className="bg-black/30 rounded-lg p-3 border border-[var(--glass-border)] text-xs font-mono grid grid-cols-2 gap-2">
                                <div className="text-gray-400">Comparisons: <span className="text-yellow-400 font-bold text-sm">{engine2.stats.comparisons}</span></div>
                                <div className="text-gray-400">Swaps: <span className="text-red-400 font-bold text-sm">{engine2.stats.swaps}</span></div>
                                <div className="text-gray-400 col-span-2">Time: <span className="text-white font-bold">{engine2.stats.timeElapsed}ms</span></div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Display Mode Toggle */}
            <div className="flex justify-center mb-2">
                <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] p-1 rounded-full flex gap-2 shadow-lg backdrop-blur-md">
                    <button 
                        onClick={() => setVisualMode('bars')}
                        className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${visualMode === 'bars' ? 'bg-[#00e5ff] text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'text-gray-400 hover:text-white'}`}
                    >
                        Bar Chart Mode
                    </button>
                    <button 
                        onClick={() => setVisualMode('nodes')}
                        className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${visualMode === 'nodes' ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'text-gray-400 hover:text-white'}`}
                    >
                        Node Graph Mode
                    </button>
                </div>
            </div>

            {/* Visualization Area */}
            <div className={`grid gap-6 ${compareMode ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                
                {/* Visualizer 1 */}
                <div className="glass-card p-6 border border-[var(--glass-border)] relative">
                    <div className="absolute top-4 left-4 flex gap-3">
                        <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold"><span className="w-2 h-2 rounded bg-yellow-400"></span> Compare</div>
                        <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold"><span className="w-2 h-2 rounded bg-red-500"></span> Swap</div>
                        <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold"><span className="w-2 h-2 rounded bg-green-500"></span> Sorted</div>
                    </div>
                    {engine1.isComplete && <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30 uppercase tracking-widest animate-pulse">Completed</div>}
                    <h3 className="text-center font-bold text-xl mb-4 mt-6 text-[#00e5ff]">{engine1.algoName}</h3>
                    {visualMode === 'bars' ? <ArrayVisualizer {...engine1} /> : <NodeVisualizer {...engine1} />}
                </div>

                {/* Visualizer 2 */}
                {compareMode && (
                    <div className="glass-card p-6 border border-[var(--glass-border)] relative">
                        {engine2.isComplete && <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30 uppercase tracking-widest animate-pulse">Completed</div>}
                        <h3 className="text-center font-bold text-xl mb-4 mt-6 text-pink-400">{engine2.algoName}</h3>
                        {visualMode === 'bars' ? <ArrayVisualizer {...engine2} /> : <NodeVisualizer {...engine2} />}
                    </div>
                )}

            </div>

        </div>
    );
}
