import React, { useState, useEffect, useRef } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import ReplayIcon from '@mui/icons-material/Replay';
import SpeedIcon from '@mui/icons-material/Speed';

export default function DsaSimulationEngine({ slug, topicTitle }) {
  // General Visualizer states
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 1x, 1.5x, 2x
  const [stepLogs, setStepLogs] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [inputIndex, setInputIndex] = useState('0');
  
  // Dynamic visualizer configuration states
  const [arrayType, setArrayType] = useState('static'); // 'static' or 'dynamic'
  const [vectorCapacity, setVectorCapacity] = useState(5);
  const [shiftingIndices, setShiftingIndices] = useState([]);
  const [animatingRealloc, setAnimatingRealloc] = useState(false);
  const [linkedListType, setLinkedListType] = useState('singly'); // 'singly', 'doubly', 'circular'

  // Perfect simulation upgrade selectors
  const [stackType, setStackType] = useState('array'); // 'array' | 'linked'
  const [queueType, setQueueType] = useState('linear'); // 'linear' | 'circular'
  const [hashType, setHashType] = useState('chaining'); // 'chaining' | 'probing'
  const [hashProbingTable, setHashProbingTable] = useState(Array(8).fill(null));
  const [sortType, setSortType] = useState('bubble'); // 'bubble' | 'selection' | 'insertion'
  const [searchType, setSearchType] = useState('binary'); // 'linear' | 'binary'
  const [graphType, setGraphType] = useState('bfs'); // 'bfs' | 'dfs' | 'dijkstra'
  const [dijkstraDistances, setDijkstraDistances] = useState({ A: 0, B: '∞', C: '∞', D: '∞' });

  // Dynamic binary search tree nodes (pre-populated)
  const [treeNodes, setTreeNodes] = useState([
    { val: 40, x: 250, y: 50, left: 20, right: 60, height: 2, bf: 0 },
    { val: 20, x: 150, y: 130, left: 10, right: 30, height: 1, bf: 0 },
    { val: 60, x: 350, y: 130, left: 50, right: 70, height: 1, bf: 0 },
    { val: 10, x: 90, y: 210, left: null, right: null, height: 0, bf: 0 },
    { val: 30, x: 210, y: 210, left: null, right: null, height: 0, bf: 0 },
    { val: 50, x: 290, y: 210, left: null, right: null, height: 0, bf: 0 },
    { val: 70, x: 410, y: 210, left: null, right: null, height: 0, bf: 0 }
  ]);

  const [treeTraversalType, setTreeTraversalType] = useState('inorder');
  const [traversalResult, setTraversalResult] = useState([]);
  const [treeActivePath, setTreeActivePath] = useState([]);
  const [avlWarning, setAvlWarning] = useState('');

  // Live Educational Tutoring State
  const [tutoringInfo, setTutoringInfo] = useState({
    goal: 'Select an operation to begin.',
    expectation: 'The algorithm will guide you step-by-step.',
    insight: 'All metrics, state transitions, and memory pointers will appear here.'
  });

  const [visualQueue, setVisualQueue] = useState([]);
  const [conflictLines, setConflictLines] = useState([]);
  const [heapArray, setHeapArray] = useState([45, 32, 20, 9, 12, 15, 8]);

  // Specific Visualizer datasets
  const [arrData, setArrData] = useState([12, 45, 8, 23, 56]);
  const [listData, setListData] = useState([10, 20, 30]);
  const [stackData, setStackData] = useState([15, 30, 45]);
  const [queueData, setQueueData] = useState([5, 10, 15, 20]);
  const [hashTable, setHashTable] = useState(Array(8).fill(null).map(() => []));
  const [sortingData, setSortingData] = useState([45, 12, 85, 32, 77, 19, 53, 9]);
  const [searchData, setSearchData] = useState([5, 12, 19, 23, 45, 53, 77, 85]);
  
  // Highlighting guides
  const [activeIndex, setActiveIndex] = useState(-1);
  const [activeCompare, setActiveCompare] = useState([]);
  const [activeBoundary, setActiveBoundary] = useState({ low: -1, high: -1, mid: -1 });

  // Chessboard for N-Queens
  const [queensBoard, setQueensBoard] = useState([
    ['.', '.', '.', '.'],
    ['.', '.', '.', '.'],
    ['.', '.', '.', '.'],
    ['.', '.', '.', '.']
  ]);
  
  // Graph Nodes
  const [graphNodes, setGraphNodes] = useState([
    { id: 0, x: 100, y: 150, name: 'A', state: 'idle' },
    { id: 1, x: 250, y: 70, name: 'B', state: 'idle' },
    { id: 2, x: 250, y: 230, name: 'C', state: 'idle' },
    { id: 3, x: 400, y: 150, name: 'D', state: 'idle' }
  ]);
  const [graphEdges, setGraphEdges] = useState([
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 2 },
    { from: 1, to: 3, weight: 3 },
    { from: 2, to: 3, weight: 1 },
    { from: 1, to: 2, weight: 5 }
  ]);

  // Trie Words
  const [trieWords, setTrieWords] = useState(['CAT', 'CAR']);

  // Call stack for Recursion
  const [callStack, setCallStack] = useState([]);

  // DP memoization grid
  const [dpGrid, setDpGrid] = useState(Array(8).fill(null));

  // Greedy Selected Coins
  const [greedyCoins, setGreedyCoins] = useState([]);
  
  const timerRef = useRef(null);

  useEffect(() => {
    resetSimulation();
  }, [slug]);

  const addLog = (msg) => {
    setStepLogs(prev => [`[Step ${prev.length + 1}] ${msg}`, ...prev]);
  };

  const resetSimulation = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setStepLogs([]);
    setActiveIndex(-1);
    setActiveCompare([]);
    setShiftingIndices([]);
    setAnimatingRealloc(false);
    setActiveBoundary({ low: -1, high: -1, mid: -1 });
    
    // Reset individual dataset baselines
    setArrData([12, 45, 8, 23, 56]);
    setVectorCapacity(5);
    setListData([10, 20, 30]);
    setStackData([15, 30, 45]);
    setQueueData([5, 10, 15, 20]);
    setHashTable(Array(8).fill(null).map((_, i) => i === 2 ? [{ k: 10, v: 'A' }] : []));
    setHashProbingTable([null, null, 23, null, null, 45, null, null]);
    setSortingData([45, 12, 85, 32, 77, 19, 53, 9]);
    setSearchData([5, 12, 19, 23, 45, 53, 77, 85]);
    setDijkstraDistances({ A: 0, B: '∞', C: '∞', D: '∞' });
    setQueensBoard([
      ['.', '.', '.', '.'],
      ['.', '.', '.', '.'],
      ['.', '.', '.', '.'],
      ['.', '.', '.', '.']
    ]);
    setGraphNodes([
      { id: 0, x: 100, y: 150, name: 'A', state: 'idle' },
      { id: 1, x: 250, y: 70, name: 'B', state: 'idle' },
      { id: 2, x: 250, y: 230, name: 'C', state: 'idle' },
      { id: 3, x: 400, y: 150, name: 'D', state: 'idle' }
    ]);
    setTrieWords(['CAT', 'CAR']);
    setTreeNodes([
      { val: 40, x: 250, y: 50, left: 20, right: 60, height: 2, bf: 0 },
      { val: 20, x: 150, y: 130, left: 10, right: 30, height: 1, bf: 0 },
      { val: 60, x: 350, y: 130, left: 50, right: 70, height: 1, bf: 0 },
      { val: 10, x: 90, y: 210, left: null, right: null, height: 0, bf: 0 },
      { val: 30, x: 210, y: 210, left: null, right: null, height: 0, bf: 0 },
      { val: 50, x: 290, y: 210, left: null, right: null, height: 0, bf: 0 },
      { val: 70, x: 410, y: 210, left: null, right: null, height: 0, bf: 0 }
    ]);
    setTraversalResult([]);
    setTreeActivePath([]);
    setAvlWarning('');
    setTutoringInfo({
      goal: 'Select an operation to begin.',
      expectation: 'The algorithm will guide you step-by-step.',
      insight: 'All metrics, state transitions, and memory pointers will appear here.'
    });
    setVisualQueue([]);
    setConflictLines([]);
    setHeapArray([45, 32, 20, 9, 12, 15, 8]);
    setCallStack([]);
    setDpGrid(Array(8).fill(null));
    setGreedyCoins([]);
    addLog(`Initialized ${topicTitle} simulation panel.`);
  };

  // Speed mapping
  const getIntervalTime = () => {
    if (speed === 1.5) return 800;
    if (speed === 2) return 500;
    return 1200;
  };

  // --- 1. ARRAY SIMULATIONS ---
  const runArrayInsert = () => {
    const val = parseInt(inputValue) || Math.floor(Math.random() * 90) + 10;
    const idx = parseInt(inputIndex) || 0;
    
    if (arrayType === 'static') {
      if (idx < 0 || idx > arrData.length || arrData.length >= 8) {
        alert('Static Array capacity (8) exceeded or index out of bounds!');
        return;
      }
    } else {
      if (idx < 0 || idx > arrData.length) {
        alert('Index out of bounds!');
        return;
      }
    }

    setIsPlaying(true);
    
    // Handle dynamic vector doubling
    if (arrayType === 'dynamic' && arrData.length >= vectorCapacity) {
      setAnimatingRealloc(true);
      addLog(`Capacity Limit (${vectorCapacity}) Reached! Doubling Dynamic Vector capacity to ${vectorCapacity * 2}...`);
      
      setTimeout(() => {
        setVectorCapacity(prev => prev * 2);
        setAnimatingRealloc(false);
        addLog(`Reallocation complete! Memory slots updated. Resuming insertion...`);
        proceedWithArrayInsert(val, idx);
      }, 1500);
    } else {
      proceedWithArrayInsert(val, idx);
    }
  };

  const proceedWithArrayInsert = (val, idx) => {
    addLog(`Initiating insertion of ${val} at index ${idx}.`);
    let tempArr = [...arrData, null];
    let currentIdx = tempArr.length - 1;
    
    timerRef.current = setInterval(() => {
      if (currentIdx > idx) {
        tempArr[currentIdx] = tempArr[currentIdx - 1];
        tempArr[currentIdx - 1] = null;
        setArrData([...tempArr]);
        setShiftingIndices([currentIdx, currentIdx - 1]);
        addLog(`Shifting element right: index ${currentIdx - 1} ➔ index ${currentIdx}`);
        currentIdx--;
      } else {
        tempArr[idx] = val;
        setArrData([...tempArr]);
        setActiveIndex(idx);
        setShiftingIndices([]);
        addLog(`Completed! Element ${val} placed at index ${idx}.`);
        setIsPlaying(false);
        clearInterval(timerRef.current);
      }
    }, getIntervalTime());
  };

  const runArrayDelete = () => {
    const idx = parseInt(inputIndex) || 0;
    if (idx < 0 || idx >= arrData.length) {
      alert('Index out of bounds!');
      return;
    }

    setIsPlaying(true);
    addLog(`Initiating deletion at index ${idx}.`);
    let tempArr = [...arrData];
    tempArr[idx] = null;
    setArrData([...tempArr]);
    setActiveIndex(idx);

    let currentIdx = idx;
    timerRef.current = setInterval(() => {
      if (currentIdx < tempArr.length - 1) {
        tempArr[currentIdx] = tempArr[currentIdx + 1];
        tempArr[currentIdx + 1] = null;
        setArrData([...tempArr]);
        setShiftingIndices([currentIdx, currentIdx + 1]);
        addLog(`Shifting element left: index ${currentIdx + 1} ➔ index ${currentIdx}`);
        currentIdx++;
      } else {
        tempArr.pop();
        setArrData([...tempArr]);
        setActiveIndex(-1);
        setShiftingIndices([]);
        addLog(`Completed! Shift complete, size updated to ${tempArr.length}.`);
        setIsPlaying(false);
        clearInterval(timerRef.current);
      }
    }, getIntervalTime());
  };

  // --- 2. LINKED LIST SIMULATIONS ---
  const runListInsert = () => {
    const val = parseInt(inputValue) || Math.floor(Math.random() * 90) + 10;
    setIsPlaying(true);
    addLog(`Spawning new node containing data: ${val}.`);
    
    setTimeout(() => {
      setListData([val, ...listData]);
      setActiveIndex(0);
      addLog(`Completed! Linked new node to current HEAD of the list.`);
      setIsPlaying(false);
    }, 1000);
  };

  // --- 3. STACK SIMULATIONS ---
  const runStackPush = () => {
    const val = parseInt(inputValue) || Math.floor(Math.random() * 90) + 10;
    if (stackType === 'array') {
      if (stackData.length >= 6) {
        addLog(`⚠️ STACK OVERFLOW! Stack capacity limit (6) exceeded.`);
        alert('Stack overflow threshold reached!');
        return;
      }
      setIsPlaying(true);
      addLog(`Pushing element ${val} onto top of Array-Based Stack (Index ${stackData.length}).`);
      setTimeout(() => {
        setStackData([...stackData, val]);
        setActiveIndex(stackData.length);
        setIsPlaying(false);
        addLog(`Success! Top index updated to: ${stackData.length + 1}`);
      }, 800);
    } else {
      // Linked Stack (Dynamic pushes to HEAD)
      setIsPlaying(true);
      addLog(`Spawning new stack node containing ${val}. Dynamic Heap allocation initialized.`);
      setTimeout(() => {
        setStackData([val, ...stackData]);
        setActiveIndex(0);
        setIsPlaying(false);
        addLog(`Success! Pushed node to top of Linked Stack. HEAD reference updated.`);
      }, 900);
    }
  };

  const runStackPop = () => {
    if (stackData.length === 0) {
      addLog(`⚠️ STACK UNDERFLOW! The stack is completely empty.`);
      alert('Stack underflow! Container is completely empty.');
      return;
    }
    setIsPlaying(true);
    if (stackType === 'array') {
      const popped = stackData[stackData.length - 1];
      addLog(`Popping topmost element: ${popped} from Array Stack index ${stackData.length - 1}.`);
      setTimeout(() => {
        setStackData(stackData.slice(0, -1));
        setActiveIndex(stackData.length - 2);
        setIsPlaying(false);
        addLog(`Success! Pop complete, element retrieved.`);
      }, 800);
    } else {
      const popped = stackData[0];
      addLog(`Popping dynamic HEAD node: ${popped} from Linked Stack.`);
      setTimeout(() => {
        setStackData(stackData.slice(1));
        setActiveIndex(-1);
        setIsPlaying(false);
        addLog(`Success! HEAD pointer updated to next linked node.`);
      }, 800);
    }
  };

  // --- 4. QUEUE SIMULATIONS ---
  const runQueueEnqueue = () => {
    const val = parseInt(inputValue) || Math.floor(Math.random() * 90) + 10;
    if (queueType === 'linear') {
      if (queueData.length >= 6) {
        addLog(`⚠️ QUEUE OVERFLOW! Linear Buffer limit (6) exceeded.`);
        alert('Queue buffer limit reached!');
        return;
      }
      setIsPlaying(true);
      addLog(`Enqueueing element ${val} at the REAR pointer (index ${queueData.length}).`);
      setTimeout(() => {
        setQueueData([...queueData, val]);
        setIsPlaying(false);
        addLog(`Success! Element stored, REAR pointer shifted.`);
      }, 800);
    } else {
      // Circular Queue
      if (queueData.length >= 6) {
        addLog(`⚠️ CIRCULAR QUEUE FULL! No empty modular slots remaining.`);
        alert('Circular Queue is completely full!');
        return;
      }
      setIsPlaying(true);
      const nextIndex = queueData.length;
      addLog(`Enqueueing ${val} in Circular Ring using modulo logic: (Rear + 1) % 6 = ${nextIndex}.`);
      setTimeout(() => {
        setQueueData([...queueData, val]);
        setIsPlaying(false);
        addLog(`Success! Stored element at circular slot ${nextIndex}.`);
      }, 800);
    }
  };

  const runQueueDequeue = () => {
    if (queueData.length === 0) {
      addLog(`⚠️ QUEUE UNDERFLOW! The queue buffer is empty.`);
      alert('Queue underflow! Buffer is empty.');
      return;
    }
    setIsPlaying(true);
    const val = queueData[0];
    if (queueType === 'linear') {
      addLog(`Dequeueing front element: ${val} from Linear FRONT pointer (index 0).`);
      setTimeout(() => {
        setQueueData(queueData.slice(1));
        setIsPlaying(false);
        addLog(`Success! Front element removed. Remaining elements shift left.`);
      }, 800);
    } else {
      // Circular Queue
      addLog(`Dequeueing from circular slot. Modular Front pointer wraps: (Front + 1) % 6.`);
      setTimeout(() => {
        setQueueData(queueData.slice(1));
        setIsPlaying(false);
        addLog(`Success! Dequeued element ${val} and updated circular Front address.`);
      }, 800);
    }
  };

  // --- 5. HASHING SIMULATIONS ---
  const runHashInsert = () => {
    const val = parseInt(inputValue) || Math.floor(Math.random() * 89) + 10;
    const hash = val % 8;
    setIsPlaying(true);
    
    if (hashType === 'chaining') {
      addLog(`Hashing key ${val} using modular arithmetic: ${val} % 8 = ${hash}.`);
      setTimeout(() => {
        let tempTable = [...hashTable];
        tempTable[hash] = [...tempTable[hash], { k: val, v: `Data-${val}` }];
        setHashTable(tempTable);
        setActiveIndex(hash);
        addLog(`Placed key ${val} inside index slot ${hash}. Chained list holds ${tempTable[hash].length} nodes.`);
        setIsPlaying(false);
      }, 1200);
    } else {
      // Linear Probing Open Addressing
      addLog(`Hashing key ${val} using modular: ${val} % 8 = ${hash}. Initiating collision probe...`);
      let probedIdx = hash;
      let collisionCount = 0;
      let tempProbing = [...hashProbingTable];

      timerRef.current = setInterval(() => {
        if (collisionCount >= 8) {
          addLog(`⚠️ HASH TABLE OVERFLOW! Open addressing probe failed: table is 100% full.`);
          alert('Probing overflow! Hash table is fully occupied.');
          setIsPlaying(false);
          clearInterval(timerRef.current);
          return;
        }

        setActiveIndex(probedIdx);
        if (tempProbing[probedIdx] === null) {
          tempProbing[probedIdx] = val;
          setHashProbingTable(tempProbing);
          addLog(`Success! Resolved collision at index ${probedIdx} after ${collisionCount} probes. Key inserted.`);
          setIsPlaying(false);
          clearInterval(timerRef.current);
        } else {
          collisionCount++;
          addLog(`Collision detected at slot ${probedIdx}! Probing next cell: (${hash} + ${collisionCount}) % 8 = ${(hash + collisionCount) % 8}`);
          probedIdx = (hash + collisionCount) % 8;
        }
      }, 800);
    }
  };

  // --- 6. SORTING SIMULATIONS ---
  const runBubbleSort = () => {
    setIsPlaying(true);
    let data = [...sortingData];
    
    if (sortType === 'bubble') {
      addLog('Starting Bubble Sort swaps loop...');
      let i = 0, j = 0;
      timerRef.current = setInterval(() => {
        if (i < data.length) {
          if (j < data.length - i - 1) {
            setActiveCompare([j, j + 1]);
            if (data[j] > data[j + 1]) {
              let temp = data[j];
              data[j] = data[j + 1];
              data[j + 1] = temp;
              setSortingData([...data]);
              addLog(`Swapping elements at ${j} and ${j+1} as ${data[j+1]} > ${data[j]}.`);
            }
            j++;
          } else {
            j = 0;
            i++;
          }
        } else {
          setIsPlaying(false);
          setActiveCompare([]);
          addLog('Completed! Array is now completely sorted in ascending order.');
          clearInterval(timerRef.current);
        }
      }, getIntervalTime());
    } else if (sortType === 'selection') {
      addLog('Starting Selection Sort loops...');
      let i = 0;
      timerRef.current = setInterval(() => {
        if (i < data.length - 1) {
          let minIdx = i;
          for (let j = i + 1; j < data.length; j++) {
            if (data[j] < data[minIdx]) {
              minIdx = j;
            }
          }
          setActiveCompare([i, minIdx]);
          if (minIdx !== i) {
            let temp = data[i];
            data[i] = data[minIdx];
            data[minIdx] = temp;
            setSortingData([...data]);
            addLog(`Selected minimum element ${data[i]} and swapped to sorted index ${i}.`);
          }
          i++;
        } else {
          setIsPlaying(false);
          setActiveCompare([]);
          addLog('Selection Sort finished fully.');
          clearInterval(timerRef.current);
        }
      }, getIntervalTime());
    } else {
      // Insertion Sort
      addLog('Starting Insertion Sort passes...');
      let i = 1;
      timerRef.current = setInterval(() => {
        if (i < data.length) {
          let key = data[i];
          let j = i - 1;
          setActiveCompare([i, j]);
          while (j >= 0 && data[j] > key) {
            data[j + 1] = data[j];
            j = j - 1;
          }
          data[j + 1] = key;
          setSortingData([...data]);
          addLog(`Inserted element ${key} at sorted position.`);
          i++;
        } else {
          setIsPlaying(false);
          setActiveCompare([]);
          addLog('Insertion Sort finished successfully.');
          clearInterval(timerRef.current);
        }
      }, getIntervalTime());
    }
  };

  // --- 7. SEARCHING SIMULATIONS ---
  const runBinarySearch = () => {
    const target = parseInt(inputValue) || 53;
    setIsPlaying(true);
    let low = 0;
    let high = searchData.length - 1;

    if (searchType === 'linear') {
      addLog(`Initiating Linear Search scanning for target value: ${target}.`);
      let currentIdx = 0;
      timerRef.current = setInterval(() => {
        if (currentIdx < searchData.length) {
          setActiveIndex(currentIdx);
          addLog(`Checking slot ${currentIdx}: value is ${searchData[currentIdx]}.`);
          if (searchData[currentIdx] === target) {
            addLog(`Success! Located target ${target} at index ${currentIdx}.`);
            setIsPlaying(false);
            clearInterval(timerRef.current);
          }
          currentIdx++;
        } else {
          addLog(`Exception! Target ${target} does not exist inside the array.`);
          setIsPlaying(false);
          clearInterval(timerRef.current);
        }
      }, getIntervalTime());
    } else {
      // Binary Search
      addLog(`Initiating Binary Search divide-and-conquer bounds for target value: ${target}.`);
      timerRef.current = setInterval(() => {
        if (low <= high) {
          let mid = Math.floor((low + high) / 2);
          setActiveBoundary({ low, high, mid });
          addLog(`Checking midpoint index: ${mid} (value: ${searchData[mid]}). low=${low}, high=${high}`);
          
          if (searchData[mid] === target) {
            addLog(`Success! Located target ${target} at index ${mid}.`);
            setIsPlaying(false);
            clearInterval(timerRef.current);
          } else if (searchData[mid] < target) {
            low = mid + 1;
            addLog(`Target ${target} is larger than mid ${searchData[mid]}. Shifting LOW boundary right to ${low}.`);
          } else {
            high = mid - 1;
            addLog(`Target ${target} is smaller than mid ${searchData[mid]}. Shifting HIGH boundary left to ${high}.`);
          }
        } else {
          addLog(`Exception! Target ${target} does not exist inside the array.`);
          setIsPlaying(false);
          clearInterval(timerRef.current);
        }
      }, getIntervalTime());
    }
  };

  // --- 8. GRAPH SIMULATIONS (BFS/DFS/DIJKSTRA) ---
  const runGraphBfs = () => {
    setIsPlaying(true);
    let nodesCopy = [...graphNodes];
    
    if (graphType === 'bfs') {
      addLog('Initializing Breadth-First Search (BFS) starting at Node A (0).');
      let queue = [0];
      let visited = new Set([0]);
      
      nodesCopy[0].state = 'visited';
      setGraphNodes([...nodesCopy]);
      setVisualQueue([0]);

      timerRef.current = setInterval(() => {
        if (queue.length > 0) {
          let curr = queue.shift();
          setVisualQueue([...queue]);
          addLog(`Visiting and dequeueing node: ${graphNodes[curr].name}.`);
          
          let neighbors = graphEdges
            .filter(e => e.from === curr || e.to === curr)
            .map(e => e.from === curr ? e.to : e.from);

          let discovered = [];
          neighbors.forEach(nb => {
            if (!visited.has(nb)) {
              visited.add(nb);
              queue.push(nb);
              nodesCopy[nb].state = 'frontier';
              discovered.push(graphNodes[nb].name);
              addLog(`Neighbor ${graphNodes[nb].name} discovered and pushed to Queue.`);
            }
          });
          
          setVisualQueue([...queue]);
          nodesCopy[curr].state = 'active';
          setGraphNodes([...nodesCopy]);

          setTutoringInfo({
            goal: `Traverse Graph using BFS (Breadth-First Search).`,
            expectation: `Explore closest neighbors of Node ${graphNodes[curr].name} level-by-level before going deeper.`,
            insight: `Dequeued Node ${graphNodes[curr].name}. Discovered adjacent neighbors: ${discovered.join(', ') || 'None (already visited)'}. Pushed them to the rear of the Queue. Current Queue: [${queue.map(n => graphNodes[n].name).join(', ')}]`
          });
        } else {
          addLog('Completed! BFS has successfully crossed all reachable network nodes.');
          setTutoringInfo({
            goal: `BFS Traversal Finished!`,
            expectation: `The Queue is now empty. All reachable nodes have been traversed.`,
            insight: `Successfully completed. Time Complexity: O(V + E), Space Complexity: O(V) for the Queue.`
          });
          setIsPlaying(false);
          clearInterval(timerRef.current);
        }
      }, getIntervalTime());
    } else if (graphType === 'dfs') {
      addLog('Initializing Depth-First Search (DFS) starting at Node A (0).');
      let stack = [0];
      let visited = new Set([0]);
      
      nodesCopy[0].state = 'visited';
      setGraphNodes([...nodesCopy]);
      setVisualQueue([0]);

      timerRef.current = setInterval(() => {
        if (stack.length > 0) {
          let curr = stack.pop();
          setVisualQueue([...stack]);
          addLog(`Visiting and popping node from call stack: ${graphNodes[curr].name}.`);
          
          let neighbors = graphEdges
            .filter(e => e.from === curr || e.to === curr)
            .map(e => e.from === curr ? e.to : e.from);

          let discovered = [];
          neighbors.forEach(nb => {
            if (!visited.has(nb)) {
              visited.add(nb);
              stack.push(nb);
              nodesCopy[nb].state = 'frontier';
              discovered.push(graphNodes[nb].name);
              addLog(`Neighbor ${graphNodes[nb].name} discovered and pushed to Stack.`);
            }
          });
          
          setVisualQueue([...stack]);
          nodesCopy[curr].state = 'active';
          setGraphNodes([...nodesCopy]);

          setTutoringInfo({
            goal: `Traverse Graph using DFS (Depth-First Search).`,
            expectation: `Pop the top Node ${graphNodes[curr].name} from LIFO Stack to explore deepest branch.`,
            insight: `Popped Node ${graphNodes[curr].name}. Discovered adjacent neighbors: ${discovered.join(', ') || 'None'}. Pushed them onto the top of the Stack. Current Stack: [${stack.map(n => graphNodes[n].name).join(', ')}]`
          });
        } else {
          addLog('Completed! DFS has successfully finished dynamic branch explorations.');
          setTutoringInfo({
            goal: `DFS Traversal Finished!`,
            expectation: `Stack is now empty. All branch explorations are complete.`,
            insight: `Successfully completed DFS. Deep paths were prioritized first. Time Complexity: O(V + E), Space: O(V).`
          });
          setIsPlaying(false);
          clearInterval(timerRef.current);
        }
      }, getIntervalTime());
    } else {
      // Dijkstra
      addLog("Initializing Dijkstra's Shortest Path algorithm starting at Node A.");
      setDijkstraDistances({ A: 0, B: '∞', C: '∞', D: '∞' });
      nodesCopy[0].state = 'active';
      setGraphNodes([...nodesCopy]);

      let step = 0;
      timerRef.current = setInterval(() => {
        if (step === 0) {
          addLog("Dijkstra Step 1: Relaxing edges connected to Node A. Tentative distances: B=4, C=2.");
          setDijkstraDistances({ A: 0, B: 4, C: 2, D: '∞' });
          nodesCopy[0].state = 'visited';
          nodesCopy[1].state = 'frontier';
          nodesCopy[2].state = 'frontier';
          setGraphNodes([...nodesCopy]);

          setTutoringInfo({
            goal: `Relax adjacent paths of Node A.`,
            expectation: `Tentative distances: dist[B] = min(∞, 0 + w(A,B)) = 4, dist[C] = min(∞, 0 + w(A,C)) = 2.`,
            insight: `Nodes B and C are discovered. C has the minimum tentative distance (2) among unvisited nodes, so it is selected next.`
          });
          step++;
        } else if (step === 1) {
          addLog("Dijkstra Step 2: Relaxing edges connected to Node C (dist=2). C-D weight is 1, total dist to D = 2 + 1 = 3.");
          setDijkstraDistances({ A: 0, B: 4, C: 2, D: 3 });
          nodesCopy[2].state = 'active';
          nodesCopy[3].state = 'frontier';
          setGraphNodes([...nodesCopy]);

          setTutoringInfo({
            goal: `Select Node C (smallest tentative distance 2) and relax neighbors.`,
            expectation: `Update Node D: dist[D] = min(∞, dist[C] + w(C,D)) = min(∞, 2 + 1) = 3.`,
            insight: `Path through C is highly optimal! Tentative shortest path to D updated to 3. Node D (3) is smaller than B (4), so it is selected next.`
          });
          step++;
        } else if (step === 2) {
          addLog("Dijkstra Step 3: Relaxing edges of Node B. Path weight A-B is 4. C-D is shorter! Dist D finalized.");
          nodesCopy[1].state = 'active';
          nodesCopy[3].state = 'active';
          setGraphNodes([...nodesCopy]);

          setTutoringInfo({
            goal: `Finalize remaining shortest paths.`,
            expectation: `Confirm shortest routes: A➔B (cost 4), A➔C➔D (cost 3).`,
            insight: `Dijkstra's Shortest Path algorithm successfully terminated with correct cost bounds! All paths finalized.`
          });
          addLog("Dijkstra complete! Shortest paths to all nodes verified.");
          setIsPlaying(false);
          clearInterval(timerRef.current);
        }
      }, getIntervalTime());
    }
  };

  // --- 9. RECURSION SIMULATIONS ---
  const runRecursionFactorial = () => {
    setIsPlaying(true);
    const n = parseInt(inputValue) || 4;
    addLog(`Running recursive factorial(${n}) calling sequence.`);
    
    let depth = 0;
    let stack = [];
    
    timerRef.current = setInterval(() => {
      if (depth <= n) {
        stack.push(`factorial(${n - depth})`);
        setCallStack([...stack]);
        addLog(`Stacking call frame: factorial(${n - depth})`);
        depth++;
      } else {
        addLog('Base case hit: factorial(0) = 1. Bubbling results back up...');
        setIsPlaying(false);
        clearInterval(timerRef.current);
      }
    }, 800);
  };

  // --- 10. BACKTRACKING (N-QUEENS) ---
  const runNQueensStep = () => {
    setIsPlaying(true);
    addLog('Initiating N-Queens (4x4) Backtracking sequence.');
    setConflictLines([]);

    let step = 0;
    let b = [
      ['.', '.', '.', '.'],
      ['.', '.', '.', '.'],
      ['.', '.', '.', '.'],
      ['.', '.', '.', '.']
    ];
    setQueensBoard(JSON.parse(JSON.stringify(b)));

    timerRef.current = setInterval(() => {
      if (step === 0) {
        addLog("Attempting Row 0: Placing Queen at (0, 0)...");
        b[0][0] = 'Q';
        setQueensBoard(JSON.parse(JSON.stringify(b)));
        setTutoringInfo({
          goal: "Place Queen 1 at Row 0, Column 0.",
          expectation: "Since this is the first queen, any slot is safe.",
          insight: "🟢 Placed at (0, 0). Row 0 completed. Initiating Row 1 search."
        });
        step++;
      } else if (step === 1) {
        addLog("Attempting Row 1: Testing Column 0 at (1, 0)...");
        b[1][0] = 'Q';
        setQueensBoard(JSON.parse(JSON.stringify(b)));
        setConflictLines([[0, 0, 1, 0]]);
        setTutoringInfo({
          goal: "Place Queen 2 on Row 1.",
          expectation: "Check Column 0 for vertical conflicts.",
          insight: "❌ Vertical Conflict detected! Row 1 Queen attacks Row 0 Queen at Column 0. Must shift column."
        });
        step++;
      } else if (step === 2) {
        addLog("Attempting Row 1: Testing Column 1 at (1, 1)...");
        b[1][0] = '.';
        b[1][1] = 'Q';
        setQueensBoard(JSON.parse(JSON.stringify(b)));
        setConflictLines([[0, 0, 1, 1]]);
        setTutoringInfo({
          goal: "Place Queen 2 at Row 1, Column 1.",
          expectation: "Check diagonal offsets.",
          insight: "❌ Diagonal Conflict detected! Slope |1-0| / |1-0| = 1. Attacks Row 0 Queen diagonally. Shift column."
        });
        step++;
      } else if (step === 3) {
        addLog("Attempting Row 1: Testing Column 2 at (1, 2)...");
        b[1][1] = '.';
        b[1][2] = 'Q';
        setQueensBoard(JSON.parse(JSON.stringify(b)));
        setConflictLines([]);
        setTutoringInfo({
          goal: "Place Queen 2 at Row 1, Column 2.",
          expectation: "Ensure no horizontal, vertical, or diagonal conflicts.",
          insight: "🟢 Safe position found! Queen 2 placed at (1, 2). Moving to search Row 2 options."
        });
        step++;
      } else if (step === 4) {
        addLog("Attempting Row 2: Testing Column 0 at (2, 0)...");
        b[2][0] = 'Q';
        setQueensBoard(JSON.parse(JSON.stringify(b)));
        setConflictLines([[0, 0, 2, 0]]);
        setTutoringInfo({
          goal: "Place Queen 3 on Row 2.",
          expectation: "Validate vertical conflict with Row 0.",
          insight: "❌ Column Conflict! Row 0 Queen attacks Column 0. Shift column."
        });
        step++;
      } else if (step === 5) {
        addLog("Attempting Row 2: Testing Column 1 at (2, 1)...");
        b[2][0] = '.';
        b[2][1] = 'Q';
        setQueensBoard(JSON.parse(JSON.stringify(b)));
        setConflictLines([[1, 2, 2, 1]]);
        setTutoringInfo({
          goal: "Place Queen 3 at Row 2, Column 1.",
          expectation: "Validate diagonal conflict with Row 1.",
          insight: "❌ Diagonal Conflict! Queen 2 at (1, 2) attacks Column 1 diagonally. Shift column."
        });
        step++;
      } else if (step === 6) {
        addLog("⚠️ No options left in Row 2! Backtracking to Row 1...");
        b[2][1] = '.';
        b[1][2] = '.'; // Backtrack Row 1 queen
        setQueensBoard(JSON.parse(JSON.stringify(b)));
        setConflictLines([]);
        setTutoringInfo({
          goal: "Backtrack to Row 1.",
          expectation: "Clear Row 2 attempts and move the Row 1 queen to the next column.",
          insight: "⚡ BACKTRACK TRIGGERED ⚡ No safe positions found on Row 2. Removing Queen from Row 2 and shifting Row 1 Queen from Col 2 to Col 3."
        });
        step++;
      } else if (step === 7) {
        addLog("Attempting Row 1: Shifting to Column 3 at (1, 3)...");
        b[1][3] = 'Q';
        setQueensBoard(JSON.parse(JSON.stringify(b)));
        setTutoringInfo({
          goal: "Place Queen 2 at Row 1, Column 3.",
          expectation: "Check safety against Row 0.",
          insight: "🟢 Safe position found! Queen 2 placed at (1, 3). Now resuming Row 2 search."
        });
        step++;
        addLog("Backtracking simulation frame completed successfully.");
        setIsPlaying(false);
        clearInterval(timerRef.current);
      }
    }, getIntervalTime());
  };

  // --- 11. DP SIMULATIONS ---
  const runDpFib = () => {
    setIsPlaying(true);
    addLog('Running DP Tabulation Fibonacci calculations.');
    let grid = [...dpGrid];
    grid[0] = 0;
    grid[1] = 1;
    setDpGrid([...grid]);
    
    let i = 2;
    timerRef.current = setInterval(() => {
      if (i < 8) {
        grid[i] = grid[i - 1] + grid[i - 2];
        setDpGrid([...grid]);
        setActiveIndex(i);
        setActiveCompare([i - 1, i - 2]);
        addLog(`Index ${i} computed: dp[${i-1}] + dp[${i-2}] = ${grid[i-1]} + ${grid[i-2]} = ${grid[i]}.`);

        setTutoringInfo({
          goal: `Compute Fibonacci(n) at Index ${i} using Tabulation.`,
          expectation: `Use overlapping subproblems from memory: dp[${i}] = dp[${i-1}] + dp[${i-2}].`,
          insight: `dp[${i}] = ${grid[i-1]} (purple) + ${grid[i-2]} (cyan) = ${grid[i]} (flashing yellow). Avoided recursive recomputations in O(1) time!`
        });

        i++;
      } else {
        setIsPlaying(false);
        setActiveCompare([]);
        setTutoringInfo({
          goal: `DP Tabulation Completed!`,
          expectation: `The whole array is populated bottom-up.`,
          insight: `Successfully cached all subsolutions. Fibonacci sum is computed in O(N) linear time instead of O(2^N) exponential recursion!`
        });
        addLog('DP memoization table loaded fully.');
        clearInterval(timerRef.current);
      }
    }, getIntervalTime());
  };

  // --- 12. GREEDY COINS ---
  const runGreedyCoins = () => {
    setIsPlaying(true);
    let initialAmount = parseInt(inputValue) || 43;
    let amount = initialAmount;
    addLog(`Initiating Greedy selection to build sum: ${amount}c.`);
    let coins = [25, 10, 5, 1];
    let selected = [];
    
    let i = 0;
    timerRef.current = setInterval(() => {
      if (amount > 0 && i < coins.length) {
        if (amount >= coins[i]) {
          const oldAmount = amount;
          amount -= coins[i];
          selected.push(coins[i]);
          setGreedyCoins([...selected]);
          addLog(`Greedy pick! Selected largest valid coin ${coins[i]}c. Remaining Amount: ${amount}c.`);

          setTutoringInfo({
            goal: `Form change for ${oldAmount}c.`,
            expectation: `Always select the largest possible denomination that fits.`,
            insight: `Selected ${coins[i]}c (fits into ${oldAmount}c). Remaining sum: ${oldAmount}c - ${coins[i]}c = ${amount}c.`
          });
        } else {
          addLog(`Coin ${coins[i]}c is larger than remaining amount ${amount}c. Skipping to smaller coin.`);
          i++;
        }
      } else {
        setIsPlaying(false);
        setTutoringInfo({
          goal: `Greedy Coins Formed!`,
          expectation: `Amount reached 0.`,
          insight: `Result coins: [${selected.join(', ')}]. Time complexity: O(N log N) for sorting, space is O(C) for the selection.`
        });
        addLog(`Completed! Selected coins: ${selected.join(', ')}.`);
        clearInterval(timerRef.current);
      }
    }, getIntervalTime());
  };

  // --- 13. HEAP & TRIE SIMULATIONS ---
  const runHeapInsert = () => {
    setIsPlaying(true);
    const val = parseInt(inputValue) || 50;
    addLog(`Inserting element ${val} to Binary Max-Heap.`);
    
    let currentHeap = [...heapArray];
    currentHeap.push(val);
    setHeapArray([...currentHeap]);

    let childIdx = currentHeap.length - 1;
    
    timerRef.current = setInterval(() => {
      if (childIdx > 0) {
        let parentIdx = Math.floor((childIdx - 1) / 2);
        setActiveCompare([childIdx, parentIdx]);
        
        addLog(`Heapify up: comparing child index ${childIdx} (${currentHeap[childIdx]}) with parent index ${parentIdx} (${currentHeap[parentIdx]}).`);
        
        setTutoringInfo({
          goal: `Heapify-Up: Insert ${val} and restore Max-Heap property.`,
          expectation: `If child (${currentHeap[childIdx]}) > parent (${currentHeap[parentIdx]}), swap them!`,
          insight: `Comparing indices ${childIdx} and ${parentIdx}. Parent calculation formula: parent = Math.floor((i-1)/2).`
        });

        if (currentHeap[childIdx] > currentHeap[parentIdx]) {
          addLog(`Violation detected! Child ${currentHeap[childIdx]} > Parent ${currentHeap[parentIdx]}. Swapping.`);
          let temp = currentHeap[childIdx];
          currentHeap[childIdx] = currentHeap[parentIdx];
          currentHeap[parentIdx] = temp;
          setHeapArray([...currentHeap]);
          childIdx = parentIdx;
        } else {
          addLog(`Max-Heap property satisfied! Bubble-up terminated.`);
          setIsPlaying(false);
          setActiveCompare([]);
          clearInterval(timerRef.current);
        }
      } else {
        addLog(`Reached root index 0. Insertion fully sorted.`);
        setIsPlaying(false);
        setActiveCompare([]);
        setTutoringInfo({
          goal: `Heapify-Up Completed!`,
          expectation: `Root is now maximum element.`,
          insight: `Max element resides at index 0. Time Complexity: O(log N) heights swaps max.`
        });
        clearInterval(timerRef.current);
      }
    }, getIntervalTime());
  };

  const runTrieSearch = () => {
    setIsPlaying(true);
    const word = (inputValue || 'CAT').toUpperCase();
    addLog(`Searching prefix string "${word}" in Trie structure.`);
    
    let chars = word.split('');
    let idx = 0;
    let path = [];
    
    timerRef.current = setInterval(() => {
      if (idx < chars.length) {
        const char = chars[idx];
        path.push(char);
        setTreeActivePath([...path]); // Representing character steps
        addLog(`Matching Trie branch: searching key "${char}" (Prefix: "${path.join('')}").`);

        setTutoringInfo({
          goal: `Trie lookup: Find character path for prefix "${word}".`,
          expectation: `Traverse character nodes root-to-leaf.`,
          insight: `Key matching: Found branch for character '${char}'. Moving pointer to child branch.`
        });
        idx++;
      } else {
        setIsPlaying(false);
        setTutoringInfo({
          goal: `Trie lookup Success!`,
          expectation: `Path fully verified.`,
          insight: `Trie holds word string successfully. Total lookup time is O(L) where L is string length, completely independent of total database size!`
        });
        addLog(`Prefix "${word}" exists inside the Trie prefix tree.`);
        clearInterval(timerRef.current);
      }
    }, getIntervalTime());
  };

  // --- 13. INTERACTIVE TREES & traversals ---
  const compileTreeTraversal = (nodes, order) => {
    // Find the root (node which has no parent)
    const root = nodes.find(n => !nodes.some(p => p.left === n.val || p.right === n.val));
    if (!root) return [];
    
    const result = [];
    const traverse = (nodeVal) => {
      const node = nodes.find(n => n.val === nodeVal);
      if (!node) return;
      if (order === 'preorder') result.push(node.val);
      if (node.left !== null) traverse(node.left);
      if (order === 'inorder') result.push(node.val);
      if (node.right !== null) traverse(node.right);
      if (order === 'postorder') result.push(node.val);
    };
    traverse(root.val);
    return result;
  };

  const calculateTreeHeights = (nodes) => {
    // Compute heights and balance factors dynamically
    const heightMap = {};
    const getNodeHeight = (val) => {
      if (val === null || val === undefined) return -1;
      if (heightMap[val] !== undefined) return heightMap[val];
      const node = nodes.find(n => n.val === val);
      if (!node) return -1;
      const leftH = getNodeHeight(node.left);
      const rightH = getNodeHeight(node.right);
      const h = 1 + Math.max(leftH, rightH);
      heightMap[val] = h;
      return h;
    };

    return nodes.map(node => {
      const leftH = getNodeHeight(node.left);
      const rightH = getNodeHeight(node.right);
      const bf = leftH - rightH;
      const height = 1 + Math.max(leftH, rightH);
      return { ...node, height, bf };
    });
  };

  const runTreeTraversal = () => {
    setIsPlaying(true);
    setTraversalResult([]);
    setTreeActivePath([]);
    setActiveIndex(-1);
    
    const traversalQueue = compileTreeTraversal(treeNodes, treeTraversalType);
    if (traversalQueue.length === 0) {
      addLog('Tree is empty. Insert nodes to traverse.');
      setIsPlaying(false);
      return;
    }

    addLog(`Initiating ${treeTraversalType.toUpperCase()} traversal flow.`);
    let idx = 0;
    
    timerRef.current = setInterval(() => {
      if (idx < traversalQueue.length) {
        const val = traversalQueue[idx];
        setActiveIndex(val);
        setTraversalResult(prev => [...prev, val]);
        setTreeActivePath(prev => [...prev, val]);
        addLog(`[Traversal Step] Visited Node ${val}.`);
        idx++;
      } else {
        addLog(`Completed! ${treeTraversalType.toUpperCase()} traversal complete: ${traversalQueue.join(' ➔ ')}`);
        setIsPlaying(false);
        setActiveIndex(-1);
        clearInterval(timerRef.current);
      }
    }, getIntervalTime());
  };

  const runTreeInsert = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) {
      alert('Please enter a valid numeric value.');
      return;
    }

    if (treeNodes.some(n => n.val === val)) {
      addLog(`Node ${val} already exists in the Tree.`);
      return;
    }

    if (treeNodes.length >= 12) {
      addLog('Maximum layout limit (12 nodes) reached. Clear or reset tree.');
      return;
    }

    setIsPlaying(true);
    setTreeActivePath([]);
    setAvlWarning('');
    
    // Animate search path insertion
    const root = treeNodes.find(n => !treeNodes.some(p => p.left === n.val || p.right === n.val));
    if (!root) {
      // Empty tree insert root
      const newRoot = { val, x: 250, y: 50, left: null, right: null, height: 0, bf: 0 };
      setTreeNodes([newRoot]);
      addLog(`Tree was empty. Inserted ${val} as Root Node.`);
      setIsPlaying(false);
      return;
    }

    addLog(`Searching binary search path to insert ${val}.`);
    let currVal = root.val;
    let path = [];
    
    timerRef.current = setInterval(() => {
      path.push(currVal);
      setTreeActivePath([...path]);
      setActiveIndex(currVal);
      
      const node = treeNodes.find(n => n.val === currVal);
      if (!node) {
        clearInterval(timerRef.current);
        setIsPlaying(false);
        return;
      }

      if (val < node.val) {
        if (node.left === null) {
          // Found insertion leaf slot!
          clearInterval(timerRef.current);
          addLog(`Found leaf node slot! ${val} < ${node.val}. Placing left child.`);
          
          let offset = node.y === 50 ? 100 : node.y === 130 ? 60 : 30;
          let newX = node.x - offset;
          let newY = node.y + 80;
          
          const newNode = { val, x: newX, y: newY, left: null, right: null, height: 0, bf: 0 };
          const updatedNodes = treeNodes.map(n => n.val === currVal ? { ...n, left: val } : n);
          updatedNodes.push(newNode);
          
          // Recompute heights
          const finalNodes = calculateTreeHeights(updatedNodes);
          setTreeNodes(finalNodes);
          
          // Check AVL balances
          if (slug === 'avl-trees') {
            const unbalancedNode = finalNodes.find(n => Math.abs(n.bf) > 1);
            if (unbalancedNode) {
              setAvlWarning(`⚡ UNBALANCED TREE ⚡ at node ${unbalancedNode.val} (BF: ${unbalancedNode.bf}). Rotation LL/RR required!`);
              addLog(`[AVL Alert] Node ${unbalancedNode.val} is unbalanced (BF: ${unbalancedNode.bf}). Auto-balancing...`);
            }
          }
          
          addLog(`Success! Node ${val} inserted successfully at coordinate (${newX}, ${newY}).`);
          setIsPlaying(false);
          setActiveIndex(-1);
          setTreeActivePath([]);
        } else {
          addLog(`${val} < ${node.val}: Searching left branch...`);
          currVal = node.left;
        }
      } else {
        if (node.right === null) {
          // Found insertion leaf slot!
          clearInterval(timerRef.current);
          addLog(`Found leaf node slot! ${val} > ${node.val}. Placing right child.`);
          
          let offset = node.y === 50 ? 100 : node.y === 130 ? 60 : 30;
          let newX = node.x + offset;
          let newY = node.y + 80;
          
          const newNode = { val, x: newX, y: newY, left: null, right: null, height: 0, bf: 0 };
          const updatedNodes = treeNodes.map(n => n.val === currVal ? { ...n, right: val } : n);
          updatedNodes.push(newNode);
          
          // Recompute heights
          const finalNodes = calculateTreeHeights(updatedNodes);
          setTreeNodes(finalNodes);
          
          // Check AVL balances
          if (slug === 'avl-trees') {
            const unbalancedNode = finalNodes.find(n => Math.abs(n.bf) > 1);
            if (unbalancedNode) {
              setAvlWarning(`⚡ UNBALANCED TREE ⚡ at node ${unbalancedNode.val} (BF: ${unbalancedNode.bf}). Rotation LL/RR required!`);
              addLog(`[AVL Alert] Node ${unbalancedNode.val} is unbalanced (BF: ${unbalancedNode.bf}). Auto-balancing...`);
            }
          }

          addLog(`Success! Node ${val} inserted successfully at coordinate (${newX}, ${newY}).`);
          setIsPlaying(false);
          setActiveIndex(-1);
          setTreeActivePath([]);
        } else {
          addLog(`${val} > ${node.val}: Searching right branch...`);
          currVal = node.right;
        }
      }
    }, getIntervalTime());
  };

  const runTreeDelete = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) {
      alert('Please enter a valid numeric value to delete.');
      return;
    }

    if (!treeNodes.some(n => n.val === val)) {
      addLog(`Node ${val} does not exist in the Tree.`);
      return;
    }

    setIsPlaying(true);
    addLog(`Initiating deletion sequence for Node ${val}.`);
    
    // Clear references from parent nodes
    let updatedNodes = treeNodes.map(node => {
      let left = node.left;
      let right = node.right;
      if (node.left === val) left = null;
      if (node.right === val) right = null;
      return { ...node, left, right };
    });

    // Remove the node itself
    updatedNodes = updatedNodes.filter(n => n.val !== val);

    // Recompute heights
    const finalNodes = calculateTreeHeights(updatedNodes);
    setTreeNodes(finalNodes);
    
    addLog(`Success! Node ${val} removed from memory hierarchy.`);
    setIsPlaying(false);
  };

  return (
    <div className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-3xl p-6 md:p-8 shadow-2xl relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#00e5ff] rounded-full inline-block"></span>
            {topicTitle} Simulation
          </h2>
          <p className="text-gray-400 text-xs mt-1">Control speed, play frames, or customize inputs dynamically below.</p>
        </div>

        {/* Action Controls panel */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-black/40 border border-white/5 p-1 rounded-xl">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <PauseIcon fontSize="small"/> : <PlayArrowIcon fontSize="small"/>}
            </button>
            <button 
              onClick={resetSimulation}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Reset"
            >
              <ReplayIcon fontSize="small"/>
            </button>
          </div>

          <div className="flex items-center gap-2 bg-black/40 border border-white/5 px-3 py-1.5 rounded-xl text-xs">
            <SpeedIcon fontSize="inherit" className="text-purple-400"/>
            <select 
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="1" className="bg-black">1.0x Speed</option>
              <option value="1.5" className="bg-black">1.5x Speed</option>
              <option value="2" className="bg-black">2.0x Speed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workspace Split Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Active Visualizer canvas (2 columns) */}
        <div className="lg:col-span-2 bg-black/40 border border-[var(--glass-border)] rounded-2xl p-6 min-h-100 flex flex-col justify-center items-center shadow-inner relative overflow-hidden">
          
          {/* Dynamic Render based on slug */}
          
          {/* A. ARRAY VISUALIZER */}
          {slug === 'arrays' && (
            <div className="flex flex-col items-center gap-6 w-full animate-page-enter">
              {/* Dynamic / Static Array type selector */}
              <div className="flex bg-black/50 border border-white/5 p-1 rounded-xl gap-1">
                {['static', 'dynamic'].map(type => (
                  <button
                    key={type}
                    disabled={isPlaying}
                    onClick={() => {
                      setArrayType(type);
                      resetSimulation();
                      addLog(`Switched array type to: ${type.toUpperCase()}`);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      isPlaying ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    } ${
                      arrayType === type 
                        ? 'bg-purple-600 text-white shadow-md' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {type === 'static' ? 'Static Array' : 'Dynamic Vector'}
                  </button>
                ))}
              </div>

              {/* Memory stats badge */}
              <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-wider">
                <div className="bg-black/60 px-3 py-1.5 rounded-lg border border-white/5 text-gray-400">
                  Size: <strong className="text-[#00e5ff]">{arrData.filter(x => x !== null).length}</strong>
                </div>
                <div className="bg-black/60 px-3 py-1.5 rounded-lg border border-white/5 text-gray-400">
                  Capacity: <strong className="text-purple-400">{arrayType === 'static' ? 8 : vectorCapacity}</strong>
                </div>
              </div>

              {/* Doubling overlay animation */}
              {animatingRealloc && (
                <div className="absolute inset-0 bg-purple-950/90 border border-purple-500/30 rounded-2xl flex flex-col items-center justify-center gap-2.5 z-10 animate-pulse backdrop-blur-xs">
                  <span className="text-[#00e5ff] text-base font-black tracking-widest animate-bounce">⚡ REALLOCATION TRIGGERED ⚡</span>
                  <p className="text-gray-300 text-xs font-mono text-center max-w-sm px-6 leading-relaxed">
                    Dynamic Vector capacity exceeded! Allocation of double-sized array memory block ({vectorCapacity * 2} cells) initialized. Copying elements to new address offsets...
                  </p>
                </div>
              )}

              {/* Grid cell nodes with distinct colors */}
              <div className="flex flex-wrap items-center gap-3 w-full justify-center">
                {Array(arrayType === 'static' ? 8 : vectorCapacity).fill(null).map((_, idx) => {
                  const val = arrData[idx] !== undefined ? arrData[idx] : null;
                  const isShifting = shiftingIndices.includes(idx);
                  const isNewlyInserted = idx === activeIndex && !isShifting && !animatingRealloc;
                  
                  let borderStyle = 'border-white/10 bg-black/50 text-gray-200';
                  if (isNewlyInserted) {
                    borderStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105';
                  } else if (isShifting) {
                    borderStyle = 'bg-yellow-500/20 border-yellow-500 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.4)]';
                  } else if (idx === activeIndex) {
                    borderStyle = 'bg-red-500/20 border-red-500 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.4)]';
                  } else if (val === null) {
                    borderStyle = 'border-dashed border-white/5 bg-black/10 text-gray-700';
                  }

                  return (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <div className={`w-14 h-14 rounded-xl border flex items-center justify-center font-bold text-sm transition-all duration-300 ${borderStyle}`}>
                        {val !== null ? val : '∅'}
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono font-bold">idx {idx}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* B. LINKED LIST VISUALIZER */}
          {slug === 'linked-lists' && (
            <div className="flex flex-col items-center gap-6 w-full animate-page-enter">
              {/* Type selector */}
              <div className="flex bg-black/50 border border-white/5 p-1 rounded-xl gap-1">
                {['singly', 'doubly', 'circular'].map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setLinkedListType(type);
                      addLog(`Switched linked list type to: ${type.toUpperCase()}`);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      linkedListType === type 
                        ? 'bg-purple-600 text-white shadow-md' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-y-8 gap-x-2 justify-center w-full min-h-32">
                {listData.map((val, idx) => (
                  <React.Fragment key={idx}>
                    {/* Node block */}
                    <div className="flex flex-col items-center">
                      <div className={`flex items-stretch border rounded-xl overflow-hidden shadow-lg transition-all duration-500 bg-black/40 ${
                        idx === activeIndex 
                          ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-105' 
                          : 'border-white/10 hover:border-white/20'
                      }`}>
                        {/* Prev pointer slot for Doubly */}
                        {linkedListType === 'doubly' && (
                          <div className="bg-purple-950/20 px-2 py-3 font-mono text-[9px] text-purple-400 border-r border-white/5 flex flex-col justify-center items-center">
                            <span className="opacity-60">prev</span>
                            <span className="text-purple-500 font-bold">➔</span>
                          </div>
                        )}
                        
                        {/* Data slot */}
                        <div className="bg-black/60 px-4 py-3 font-bold text-gray-200 border-r border-white/5 text-sm flex items-center">{val}</div>
                        
                        {/* Next pointer slot */}
                        <div className="bg-emerald-950/20 px-2 py-3 font-mono text-[9px] text-emerald-400 flex flex-col justify-center items-center">
                          <span className="opacity-60">next</span>
                          <span className="text-emerald-500 font-bold">➔</span>
                        </div>
                      </div>
                      <span className="text-[9px] text-gray-500 font-mono mt-1">Node {idx}</span>
                    </div>

                    {/* Dynamic Pointers Rendering */}
                    {idx < listData.length - 1 && (
                      <div className="flex flex-col justify-center items-center h-full px-1">
                        <span className="text-emerald-400 text-lg font-bold animate-pulse">➔</span>
                        {linkedListType === 'doubly' && (
                          <span className="text-purple-400 text-lg font-bold animate-pulse">⮨</span>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                ))}
                
                {/* Tail pointer mapping */}
                {linkedListType === 'circular' ? (
                  <div className="flex items-center ml-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-emerald-400 text-[10px] font-mono font-bold animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    ➔ BACK TO HEAD (Node 0)
                  </div>
                ) : (
                  <span className="text-gray-600 font-mono text-xs ml-2">➔ NULL</span>
                )}
              </div>
            </div>
          )}

          {/* C. STACK VISUALIZER */}
          {slug === 'stack' && (
            <div className="flex flex-col items-center gap-4 w-full animate-page-enter">
              {/* Stack type selector */}
              <div className="flex bg-black/50 border border-white/5 p-1 rounded-xl gap-1">
                {['array', 'linked'].map(type => (
                  <button
                    key={type}
                    disabled={isPlaying}
                    onClick={() => {
                      setStackType(type);
                      resetSimulation();
                      addLog(`Switched stack type to: ${type.toUpperCase()}`);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      stackType === type 
                        ? 'bg-purple-600 text-white shadow-md' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {type === 'array' ? 'Array-Based' : 'Linked Nodes'}
                  </button>
                ))}
              </div>

              {stackType === 'array' ? (
                <div className="flex items-center gap-6 w-full justify-center">
                  <div className="flex flex-col-reverse items-center border-b-4 border-x-2 border-white/20 w-44 h-80 rounded-b-2xl p-3 bg-black/20 relative shadow-inner">
                    {Array(6).fill(null).map((_, idx) => {
                      const val = stackData[idx];
                      const isTop = idx === stackData.length - 1;
                      return (
                        <div 
                          key={idx} 
                          className={`w-full py-3 mb-1 rounded-lg border font-bold text-center text-xs transition-all duration-300 relative ${
                            val !== undefined 
                              ? isTop 
                                ? 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)] scale-102' 
                                : 'bg-black/60 border-white/10 text-gray-300'
                              : 'border-dashed border-white/5 bg-black/5 text-transparent select-none'
                          }`}
                        >
                          {val !== undefined ? val : '∅'}
                          {isTop && (
                            <span className="absolute -right-20 top-2 px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-400 text-purple-300 font-mono text-[9px] uppercase tracking-wider animate-pulse">
                              Top ➔
                            </span>
                          )}
                        </div>
                      );
                    })}
                    {stackData.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-mono text-xs">Stack Empty</div>
                    )}
                  </div>
                </div>
              ) : (
                // Linked Stack vertical rendering
                <div className="flex flex-col items-center gap-3 py-4 min-h-64">
                  {stackData.map((val, idx) => (
                    <React.Fragment key={idx}>
                      <div className={`flex border rounded-xl overflow-hidden shadow-lg transition-all bg-black/40 ${
                        idx === 0 
                          ? 'border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.3)] scale-105' 
                          : 'border-white/10'
                      }`}>
                        <div className="bg-black/60 px-4 py-2 font-bold text-gray-200 border-r border-white/5 text-xs flex items-center">{val}</div>
                        <div className="bg-emerald-950/20 px-2 py-2 font-mono text-[8px] text-emerald-400 flex flex-col justify-center items-center">
                          <span className="opacity-60">next</span>
                          <span className="text-emerald-500 font-bold">➔</span>
                        </div>
                      </div>
                      <span className="text-emerald-400 text-sm font-bold">⬇</span>
                    </React.Fragment>
                  ))}
                  <span className="text-gray-600 font-mono text-xs">NULL</span>
                </div>
              )}
            </div>
          )}

          {/* D. QUEUE VISUALIZER */}
          {slug === 'queue' && (
            <div className="flex flex-col items-center gap-4 w-full animate-page-enter">
              {/* Queue type selector */}
              <div className="flex bg-black/50 border border-white/5 p-1 rounded-xl gap-1">
                {['linear', 'circular'].map(type => (
                  <button
                    key={type}
                    disabled={isPlaying}
                    onClick={() => {
                      setQueueType(type);
                      resetSimulation();
                      addLog(`Switched queue type to: ${type.toUpperCase()}`);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      queueType === type 
                        ? 'bg-purple-600 text-white shadow-md' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {type === 'linear' ? 'Linear Queue' : 'Circular Ring'}
                  </button>
                ))}
              </div>

              {queueType === 'linear' ? (
                <div className="flex flex-col items-center w-full gap-4">
                  <div className="flex items-center gap-2 border-y-2 border-white/20 w-full max-w-lg h-24 bg-black/20 rounded-lg p-3 justify-start relative overflow-x-auto shadow-inner">
                    {Array(6).fill(null).map((_, idx) => {
                      const val = queueData[idx];
                      const isFront = idx === 0;
                      const isRear = idx === queueData.length - 1 && queueData.length > 0;
                      return (
                        <div 
                          key={idx} 
                          className={`w-16 h-12 rounded-lg border font-bold flex flex-col items-center justify-center text-xs transition-all duration-300 relative ${
                            val !== undefined 
                              ? isFront 
                                ? 'bg-[#00e5ff]/20 border-[#00e5ff] text-white shadow-[0_0_12px_rgba(0,229,255,0.4)]' 
                                : 'bg-black/60 border-white/10 text-gray-300'
                              : 'border-dashed border-white/5 bg-black/5 text-gray-700'
                          }`}
                        >
                          <span>{val !== undefined ? val : '∅'}</span>
                          {isFront && <span className="text-[7px] text-[#00e5ff] font-mono absolute -top-5 uppercase animate-pulse">Front</span>}
                          {isRear && <span className="text-[7px] text-purple-400 font-mono absolute -bottom-5 uppercase animate-pulse">Rear</span>}
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-[9px] text-gray-500 font-mono italic">Linear queue shows empty rear indexes when elements dequeue.</span>
                </div>
              ) : (
                // Circular Queue
                <div className="flex flex-col items-center gap-4 w-full">
                  <span className="text-[10px] text-purple-400 font-mono font-bold tracking-widest uppercase">Rear wraps back to 0: idx = (Rear + 1) % 6</span>
                  <div className="flex items-center gap-3 justify-center flex-wrap">
                    {Array(6).fill(null).map((_, idx) => {
                      const val = queueData[idx];
                      const isFront = idx === 0;
                      const isRear = idx === queueData.length - 1 && queueData.length > 0;
                      return (
                        <div key={idx} className="flex flex-col items-center gap-1.5">
                          <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                            val !== undefined 
                              ? 'bg-purple-950/20 border-purple-500 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                              : 'border-dashed border-white/10 bg-black/40 text-gray-600'
                          }`}>
                            {val !== undefined ? val : '∅'}
                          </div>
                          <span className="text-[9px] font-mono text-gray-500">
                            {isFront && 'F | '}
                            {isRear && 'R | '}
                            idx {idx}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* E. HASHING VISUALIZER */}
          {slug === 'hashing' && (
            <div className="flex flex-col items-center gap-4 w-full animate-page-enter">
              {/* Hash selector */}
              <div className="flex bg-black/50 border border-white/5 p-1 rounded-xl gap-1">
                {['chaining', 'probing'].map(type => (
                  <button
                    key={type}
                    disabled={isPlaying}
                    onClick={() => {
                      setHashType(type);
                      resetSimulation();
                      addLog(`Switched hashing layout to: ${type.toUpperCase()}`);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      hashType === type 
                        ? 'bg-purple-600 text-white shadow-md' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {type === 'chaining' ? 'Separate Chaining' : 'Linear Probing'}
                  </button>
                ))}
              </div>

              {hashType === 'chaining' ? (
                <div className="flex flex-col gap-2.5 w-full max-w-md">
                  {hashTable.map((list, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-black/20 p-2 rounded-xl border border-white/5 hover:bg-black/40 transition-colors">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                        idx === activeIndex 
                          ? 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]' 
                          : 'bg-white/5 text-gray-500'
                      }`}>
                        {idx}
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto">
                        {list.map((item, i) => (
                          <div key={i} className="bg-black/80 border border-white/10 px-3 py-1 rounded-md text-[10px] text-purple-300 font-mono flex items-center gap-1.5 animate-page-enter">
                            <span className="text-gray-500">{item.k}:</span>
                            <span>{item.v}</span>
                          </div>
                        ))}
                        {list.length === 0 && <span className="text-gray-700 text-[10px] font-mono">Empty</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Linear Probing flat hashing array of size 8
                <div className="flex flex-col gap-3 w-full max-w-md">
                  <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest text-center">Flat Hashing Table (Capacity 8)</span>
                  <div className="grid grid-cols-4 gap-3">
                    {Array(8).fill(null).map((_, idx) => {
                      const val = hashProbingTable[idx];
                      const isActive = idx === activeIndex;
                      return (
                        <div 
                          key={idx} 
                          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                            isActive 
                              ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.4)] scale-102'
                              : val !== null 
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                                : 'border-dashed border-white/10 bg-black/20 text-gray-700'
                          }`}
                        >
                          <span className="text-xs font-bold font-mono">{val !== null ? val : '∅'}</span>
                          <span className="text-[8px] text-gray-500 font-mono">slot {idx}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* F. SORTING VISUALIZER */}
          {slug === 'sorting' && (
            <div className="flex flex-col items-center gap-4 w-full animate-page-enter">
              {/* Selector */}
              <div className="flex bg-black/50 border border-white/5 p-1 rounded-xl gap-1">
                {['bubble', 'selection', 'insertion'].map(type => (
                  <button
                    key={type}
                    disabled={isPlaying}
                    onClick={() => {
                      setSortType(type);
                      resetSimulation();
                      addLog(`Switched sorting method to: ${type.toUpperCase()}`);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      sortType === type 
                        ? 'bg-purple-600 text-white shadow-md' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {type} Sort
                  </button>
                ))}
              </div>

              <div className="flex items-end gap-3 h-60 justify-center w-full mt-4">
                {sortingData.map((val, idx) => {
                  const isComparing = activeCompare.includes(idx);
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <div 
                        className={`w-8 rounded-t-lg transition-all duration-300 ${
                          isComparing 
                            ? 'bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.6)]' 
                            : 'bg-purple-500/30 border-t-2 border-t-purple-400'
                        }`}
                        style={{ height: `${val * 1.8}px` }}
                      />
                      <span className="text-[9px] text-gray-400 font-mono">{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* G. SEARCHING VISUALIZER */}
          {slug === 'searching' && (
            <div className="flex flex-col items-center gap-4 w-full animate-page-enter">
              {/* Selector */}
              <div className="flex bg-black/50 border border-white/5 p-1 rounded-xl gap-1">
                {['linear', 'binary'].map(type => (
                  <button
                    key={type}
                    disabled={isPlaying}
                    onClick={() => {
                      setSearchType(type);
                      resetSimulation();
                      addLog(`Switched search algorithm to: ${type.toUpperCase()}`);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      searchType === type 
                        ? 'bg-purple-600 text-white shadow-md' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {type} Search
                  </button>
                ))}
              </div>

              <div className="flex items-end gap-3 h-60 justify-center w-full mt-4">
                {searchData.map((val, idx) => {
                  const isMid = idx === activeBoundary.mid;
                  const isLow = idx === activeBoundary.low;
                  const isHigh = idx === activeBoundary.high;
                  const inRange = idx >= activeBoundary.low && idx <= activeBoundary.high;
                  const isActiveScan = idx === activeIndex;
                  
                  let barColor = 'bg-white/10 opacity-30';
                  if (searchType === 'linear') {
                    barColor = isActiveScan 
                      ? 'bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.5)]' 
                      : 'bg-[#00e5ff]/20 border-t border-t-[#00e5ff]';
                  } else {
                    if (inRange) barColor = 'bg-[#00e5ff]/25 border-t border-t-[#00e5ff]';
                    if (isMid) barColor = 'bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.6)] scale-102';
                  }

                  return (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <div 
                        className={`w-8 rounded-t-lg transition-all duration-300 ${barColor}`}
                        style={{ height: `${val * 1.8}px` }}
                      />
                      <span className="text-[9px] text-gray-400 font-mono">{val}</span>
                      {searchType === 'binary' && (
                        <span className="text-[8px] font-mono font-bold text-purple-400">
                          {isLow && 'low'}
                          {isMid && 'mid'}
                          {isHigh && 'high'}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* H. GRAPH VISUALIZER */}
          {slug === 'graphs' && (
            <div className="flex flex-col items-center gap-4 w-full animate-page-enter">
              {/* Selector */}
              <div className="flex bg-black/50 border border-white/5 p-1 rounded-xl gap-1">
                {['bfs', 'dfs', 'dijkstra'].map(type => (
                  <button
                    key={type}
                    disabled={isPlaying}
                    onClick={() => {
                      setGraphType(type);
                      resetSimulation();
                      addLog(`Switched graph routing to: ${type.toUpperCase()}`);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      graphType === type 
                        ? 'bg-purple-600 text-white shadow-md' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>

              {graphType === 'dijkstra' && (
                <div className="bg-black/60 border border-white/5 rounded-xl p-3 flex gap-4 text-[10px] font-mono">
                  <div className="text-gray-400">Shortest distance offsets:</div>
                  <div className="text-yellow-400 font-bold">A: {dijkstraDistances.A} | B: {dijkstraDistances.B} | C: {dijkstraDistances.C} | D: {dijkstraDistances.D}</div>
                </div>
              )}

              <svg className="w-full h-72">
                {/* Edges */}
                {graphEdges.map((e, idx) => {
                  const fNode = graphNodes[e.from];
                  const tNode = graphNodes[e.to];
                  return (
                    <g key={idx}>
                      <line 
                        x1={fNode.x} y1={fNode.y} 
                        x2={tNode.x} y2={tNode.y} 
                        stroke="rgba(255,255,255,0.15)" 
                        strokeWidth="2.5"
                      />
                      <text 
                        x={(fNode.x + tNode.x) / 2} 
                        y={(fNode.y + tNode.y) / 2 - 5}
                        fill="#a855f7" fontSize="10" fontWeight="bold" textAnchor="middle"
                      >
                        {e.weight}
                      </text>
                    </g>
                  );
                })}

                {/* Vertices */}
                {graphNodes.map((node) => {
                  let nColor = 'fill-[#0d071a] stroke-white/20';
                  if (node.state === 'frontier') nColor = 'fill-purple-500/25 stroke-purple-500 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]';
                  if (node.state === 'visited') nColor = 'fill-emerald-500/25 stroke-emerald-500 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]';
                  if (node.state === 'active') nColor = 'fill-[#00e5ff]/25 stroke-[#00e5ff] filter drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]';

                  return (
                    <g key={node.id} className="cursor-pointer">
                      <circle cx={node.x} cy={node.y} r="20" className={`transition-all duration-500 ${nColor}`} strokeWidth="2.5"/>
                      <text x={node.x} y={node.y + 4} fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">
                        {node.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {/* I. RECURSION VISUALIZER */}
          {slug === 'recursion' && (
            <div className="flex flex-col-reverse items-center border border-white/10 w-64 h-80 rounded-2xl p-4 bg-black/20 justify-start relative">
              {callStack.map((frame, idx) => (
                <div 
                  key={idx} 
                  className="w-full py-3 mb-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-center font-mono text-xs text-purple-300 font-bold animate-page-enter"
                >
                  {frame}
                </div>
              ))}
              {callStack.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-mono text-xs">Recursion Stack Empty</div>
              )}
            </div>
          )}

          {/* J. BACKTRACKING VISUALIZER */}
          {slug === 'backtracking' && (
            <div className="grid grid-cols-4 border-4 border-white/20 w-64 h-64 bg-black/20">
              {queensBoard.map((row, rIdx) => 
                row.map((cell, cIdx) => {
                  const isBlackCell = (rIdx + cIdx) % 2 === 1;
                  return (
                    <div 
                      key={`${rIdx}-${cIdx}`}
                      className={`flex items-center justify-center font-bold text-xl transition-all duration-300 ${
                        isBlackCell ? 'bg-black/40' : 'bg-transparent'
                      } ${cell === 'Q' ? 'bg-[#00e5ff]/20 text-[#00e5ff] animate-pulse' : 'text-gray-600'}`}
                    >
                      {cell === 'Q' ? '👑' : ''}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* K. DP VISUALIZER */}
          {slug === 'dynamic-programming' && (
            <div className="flex flex-col gap-3 items-center w-full">
              <div className="flex gap-2">
                {dpGrid.map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div className={`w-12 h-12 rounded-lg border flex items-center justify-center font-bold font-mono text-xs transition-all duration-300 ${
                      idx === activeIndex 
                        ? 'bg-[#00e5ff]/20 border-[#00e5ff] text-white shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                        : val !== null 
                          ? 'bg-black/60 border-white/10 text-purple-300' 
                          : 'border-dashed border-gray-800 text-transparent'
                    }`}>
                      {val}
                    </div>
                    <span className="text-[9px] text-gray-500 font-mono">dp[{idx}]</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* L. GREEDY VISUALIZER */}
          {slug === 'greedy' && (
            <div className="flex flex-col gap-6 items-center">
              <div className="flex items-center gap-3">
                {greedyCoins.map((c, idx) => (
                  <div 
                    key={idx} 
                    className="w-14 h-14 rounded-full bg-yellow-500/20 border-2 border-yellow-500 flex items-center justify-center font-bold text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)] animate-page-enter"
                  >
                    {c}c
                  </div>
                ))}
                {greedyCoins.length === 0 && (
                  <div className="text-gray-600 font-mono text-sm">No coins selected yet.</div>
                )}
              </div>
            </div>
          )}
          {['trees', 'bst', 'avl-trees', 'heap', 'trie'].includes(slug) && (
            <div className="flex flex-col items-center gap-6 w-full h-full justify-center">
              
              {avlWarning && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-mono p-3 rounded-xl w-full text-center animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.15)] uppercase tracking-wider font-bold">
                  {avlWarning}
                </div>
              )}

              {/* DYNAMIC TRIE VIEW */}
              {slug === 'trie' ? (
                <div className="w-full flex flex-col items-center">
                  <svg className="w-full h-72">
                    {/* Trie character path links */}
                    {[
                      { from: 'Root', to: 'C', fx: 250, fy: 50, tx: 250, ty: 110 },
                      { from: 'C', to: 'A', fx: 250, fy: 110, tx: 250, ty: 170 },
                      { from: 'A', to: 'T', fx: 250, fy: 170, tx: 190, ty: 230 },
                      { from: 'A', to: 'R', fx: 250, fy: 170, tx: 310, ty: 230 }
                    ].map((edge, idx) => {
                      const isActive = treeActivePath.includes(edge.to);
                      return (
                        <line 
                          key={idx} 
                          x1={edge.fx} y1={edge.fy} 
                          x2={edge.tx} y2={edge.ty} 
                          stroke={isActive ? '#00e5ff' : 'rgba(255,255,255,0.15)'} 
                          strokeWidth={isActive ? '3.5' : '2'}
                          className="transition-all duration-300"
                        />
                      );
                    })}

                    {/* Trie nodes */}
                    {[
                      { val: 'Root', x: 250, y: 50 },
                      { val: 'C', x: 250, y: 110 },
                      { val: 'A', x: 250, y: 170 },
                      { val: 'T', x: 190, y: 230 },
                      { val: 'R', x: 310, y: 230 }
                    ].map((node, idx) => {
                      const isMatching = treeActivePath.includes(node.val) || node.val === 'Root';
                      const strokeC = isMatching ? 'stroke-[#00e5ff] fill-[#00e5ff]/20 filter drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]' : 'stroke-white/20 fill-black/60';
                      return (
                        <g key={idx} className="transition-all duration-300">
                          <circle cx={node.x} cy={node.y} r="18" className={strokeC} strokeWidth="2" />
                          <text x={node.x} y={node.y + 4} fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">
                            {node.val}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              ) : slug === 'heap' ? (
                <div className="w-full flex flex-col gap-6 items-center">
                  <svg className="w-full h-72">
                    {/* Dynamic Heap Tree Edges */}
                    {heapArray.map((val, idx) => {
                      let level = Math.floor(Math.log2(idx + 1));
                      let numInLevel = Math.pow(2, level);
                      let posInLevel = idx + 1 - numInLevel;
                      
                      let fx = 250;
                      if (level === 1) fx = posInLevel === 0 ? 150 : 350;
                      else if (level === 2) fx = 90 + posInLevel * 110;
                      else if (level === 3) fx = 50 + posInLevel * 60;
                      let fy = 50 + level * 70;

                      const leftIdx = 2 * idx + 1;
                      const rightIdx = 2 * idx + 2;
                      const edges = [];

                      if (leftIdx < heapArray.length) {
                        let lLevel = level + 1;
                        let lNum = Math.pow(2, lLevel);
                        let lPos = leftIdx + 1 - lNum;
                        let tx = 250;
                        if (lLevel === 1) tx = lPos === 0 ? 150 : 350;
                        else if (lLevel === 2) tx = 90 + lPos * 110;
                        else if (lLevel === 3) tx = 50 + lPos * 60;
                        let ty = 50 + lLevel * 70;

                        const isEdgeSwapping = activeCompare.includes(idx) && activeCompare.includes(leftIdx);
                        edges.push(
                          <line 
                            key={`he-l-${idx}`} 
                            x1={fx} y1={fy} 
                            x2={tx} y2={ty} 
                            stroke={isEdgeSwapping ? '#ea580c' : 'rgba(255,255,255,0.15)'} 
                            strokeWidth={isEdgeSwapping ? '3.5' : '2'}
                          />
                        );
                      }

                      if (rightIdx < heapArray.length) {
                        let rLevel = level + 1;
                        let rNum = Math.pow(2, rLevel);
                        let rPos = rightIdx + 1 - rNum;
                        let tx = 250;
                        if (rLevel === 1) tx = rPos === 0 ? 150 : 350;
                        else if (rLevel === 2) tx = 90 + rPos * 110;
                        else if (rLevel === 3) tx = 50 + rPos * 60;
                        let ty = 50 + rLevel * 70;

                        const isEdgeSwapping = activeCompare.includes(idx) && activeCompare.includes(rightIdx);
                        edges.push(
                          <line 
                            key={`he-r-${idx}`} 
                            x1={fx} y1={fy} 
                            x2={tx} y2={ty} 
                            stroke={isEdgeSwapping ? '#ea580c' : 'rgba(255,255,255,0.15)'} 
                            strokeWidth={isEdgeSwapping ? '3.5' : '2'}
                          />
                        );
                      }
                      return edges;
                    })}

                    {/* Dynamic Heap Tree Nodes */}
                    {heapArray.map((val, idx) => {
                      let level = Math.floor(Math.log2(idx + 1));
                      let numInLevel = Math.pow(2, level);
                      let posInLevel = idx + 1 - numInLevel;
                      
                      let x = 250;
                      if (level === 1) x = posInLevel === 0 ? 150 : 350;
                      else if (level === 2) x = 90 + posInLevel * 110;
                      else if (level === 3) x = 50 + posInLevel * 60;
                      let y = 50 + level * 70;

                      const isSwapping = activeCompare.includes(idx);
                      let nStyle = 'fill-[#0d071a] stroke-white/20';
                      if (isSwapping) {
                        nStyle = 'fill-yellow-500/25 stroke-yellow-400 filter drop-shadow-[0_0_12px_rgba(234,179,8,0.6)]';
                      }

                      return (
                        <g key={`hn-${idx}`} className="transition-all duration-300">
                          <circle cx={x} cy={y} r="18" className={nStyle} strokeWidth="2" />
                          <text x={x} y={y + 4} fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">
                            {val}
                          </text>
                          <text x={x} y={y - 22} fill="gray" fontSize="8" fontWeight="bold" textAnchor="middle">
                            idx: {idx}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Heap contiguous array buffer */}
                  <div className="w-full bg-black/45 border border-white/5 rounded-2xl p-4 animate-page-enter">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-2">Contiguous Heap Array Mapping</h4>
                    <div className="flex gap-2 items-center flex-wrap">
                      {heapArray.map((val, idx) => {
                        const isSwapping = activeCompare.includes(idx);
                        return (
                          <div key={idx} className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-lg border flex items-center justify-center font-bold font-mono text-xs transition-all duration-300 ${
                              isSwapping 
                                ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.3)] animate-pulse'
                                : 'bg-black/60 border-white/10 text-white'
                            }`}>
                              {val}
                            </div>
                            <span className="text-[8px] text-gray-500 font-mono mt-1">arr[{idx}]</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <svg className="w-full h-72">
                    {/* Dynamic Edge lines render */}
                    {treeNodes.map((node, i) => {
                      const renderedLines = [];
                      if (node.left !== null) {
                        const leftChild = treeNodes.find(n => n.val === node.left);
                        if (leftChild) {
                          const isActiveEdge = treeActivePath.includes(node.val) && treeActivePath.includes(leftChild.val);
                          renderedLines.push(
                            <line 
                              key={`l-${i}`} 
                              x1={node.x} y1={node.y} 
                              x2={leftChild.x} y2={leftChild.y} 
                              stroke={isActiveEdge ? "#00e5ff" : "rgba(255,255,255,0.15)"} 
                              strokeWidth={isActiveEdge ? "3" : "2.5"} 
                              className="transition-all duration-300"
                            />
                          );
                        }
                      }
                      if (node.right !== null) {
                        const rightChild = treeNodes.find(n => n.val === node.right);
                        if (rightChild) {
                          const isActiveEdge = treeActivePath.includes(node.val) && treeActivePath.includes(rightChild.val);
                          renderedLines.push(
                            <line 
                              key={`r-${i}`} 
                              x1={node.x} y1={node.y} 
                              x2={rightChild.x} y2={rightChild.y} 
                              stroke={isActiveEdge ? "#00e5ff" : "rgba(255,255,255,0.15)"} 
                              strokeWidth={isActiveEdge ? "3" : "2.5"} 
                              className="transition-all duration-300"
                            />
                          );
                        }
                      }
                      return renderedLines;
                    })}

                    {/* Nodes rendering with Height and Balance factors */}
                    {treeNodes.map((node, i) => {
                      const isActive = node.val === activeIndex;
                      const isPath = treeActivePath.includes(node.val);
                      const isTraversed = traversalResult.includes(node.val);
                      
                      let nStyle = 'fill-[#0d071a] stroke-white/20';
                      if (isActive) {
                        nStyle = 'fill-yellow-500/25 stroke-yellow-400 filter drop-shadow-[0_0_12px_rgba(234,179,8,0.6)]';
                      } else if (isTraversed) {
                        nStyle = 'fill-emerald-500/25 stroke-emerald-400 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]';
                      } else if (isPath) {
                        nStyle = 'fill-purple-500/25 stroke-purple-400 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]';
                      } else if (node.val === 40) {
                        nStyle = 'fill-purple-500/10 stroke-purple-500/40';
                      }

                      return (
                        <g key={`n-${i}`} className="transition-all duration-300 cursor-pointer">
                          <circle cx={node.x} cy={node.y} r="18" className={nStyle} strokeWidth="2" />
                          <text x={node.x} y={node.y + 4} fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">
                            {node.val}
                          </text>
                          {/* Height and Balance Factor details */}
                          <text x={node.x} y={node.y - 22} fill="gray" fontSize="8" fontWeight="bold" textAnchor="middle">
                            BF: {node.bf} (H: {node.height})
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Traversal Output Stream Ribbon */}
                  {traversalResult.length > 0 && (
                    <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 animate-page-enter">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-2">Traversal Output Stream</h4>
                      <div className="flex gap-2 items-center flex-wrap">
                        {traversalResult.map((val, idx) => (
                          <React.Fragment key={idx}>
                            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold shadow-[0_0_8px_rgba(16,185,129,0.2)] animate-scale-up">
                              {val}
                            </div>
                            {idx < traversalResult.length - 1 && <span className="text-gray-600 font-mono text-xs">➔</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

            </div>
          )}

          {/* LIVE EXPLANATORY TUTORING CARD */}
          <div className="w-full mt-6 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-2xl relative overflow-hidden animate-page-enter">
            {/* Decorative glowing border accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00e5ff] to-purple-600"></div>
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <h3 className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5ff] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e5ff]"></span>
                </span>
                Algorithms Explained Live
              </h3>
              <span className="px-2 py-0.5 text-[9px] font-black font-mono rounded bg-white/5 border border-white/10 text-gray-400 animate-pulse">
                Active Step Monitor
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
              <div>
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-1">Active Goal</span>
                <p className="text-xs text-white leading-relaxed font-semibold">{tutoringInfo.goal}</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-1">Expected Outcome</span>
                <p className="text-xs text-gray-300 leading-relaxed">{tutoringInfo.expectation}</p>
              </div>
              <div className="md:col-span-1">
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-1">CS Mathematical Insight</span>
                <p className="text-xs text-[#00e5ff] font-mono leading-relaxed bg-[#00e5ff]/5 border border-[#00e5ff]/10 p-2.5 rounded-xl">{tutoringInfo.insight}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Parameter Trigger sidebar (1 column) */}
        <div className="flex flex-col gap-6">
          
          {/* Parameter form inputs */}
          <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-widest border-b border-white/5 pb-2">
                Operations Panel
              </h3>

              <div className="space-y-4">
                {!['sorting', 'graphs', 'backtracking', 'dynamic-programming'].includes(slug) && (
                  <div>
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-1">
                      {slug === 'trie' ? 'Prefix Word Parameter' : slug === 'greedy' ? 'Target Change Amount' : 'Data / Key Parameter'}
                    </label>
                    <input 
                      type={slug === 'trie' ? 'text' : 'number'} 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-full bg-black/60 border border-[var(--glass-border)] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00e5ff]/50 transition-colors"
                      placeholder={
                        slug === 'trie' 
                          ? 'Enter search prefix (e.g. CAT)' 
                          : slug === 'greedy' 
                            ? 'Enter amount (e.g. 43)' 
                            : 'Enter value (e.g. 23)'
                      }
                    />
                  </div>
                )}

                {['arrays'].includes(slug) && (
                  <div>
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-1">Index Offset</label>
                    <input 
                      type="number" 
                      value={inputIndex}
                      onChange={(e) => setInputIndex(e.target.value)}
                      className="w-full bg-black/60 border border-[var(--glass-border)] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00e5ff]/50 transition-colors"
                      placeholder="Enter target index (0-7)"
                    />
                  </div>
                )}

                {['trees', 'bst', 'avl-trees', 'heap', 'trie'].includes(slug) && (
                  <div>
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-1">Traversal Order</label>
                    <select
                      value={treeTraversalType}
                      onChange={(e) => setTreeTraversalType(e.target.value)}
                      className="w-full bg-black/60 border border-[var(--glass-border)] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00e5ff]/50 transition-colors cursor-pointer"
                    >
                      <option value="inorder" className="bg-[#0f0a1c] text-white">Inorder (Left ➔ Root ➔ Right)</option>
                      <option value="preorder" className="bg-[#0f0a1c] text-white">Preorder (Root ➔ Left ➔ Right)</option>
                      <option value="postorder" className="bg-[#0f0a1c] text-white">Postorder (Left ➔ Right ➔ Root)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-2">
              {slug === 'arrays' && (
                <>
                  <button onClick={runArrayInsert} className="w-full py-3 bg-linear-to-r from-purple-600 to-[#00e5ff] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)]">Insert Element</button>
                  <button onClick={runArrayDelete} className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all">Delete Element</button>
                </>
              )}
              {slug === 'linked-lists' && (
                <button onClick={runListInsert} className="w-full py-3 bg-linear-to-r from-purple-600 to-[#00e5ff] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all">Insert Node</button>
              )}
              {slug === 'stack' && (
                <>
                  <button onClick={runStackPush} className="w-full py-3 bg-linear-to-r from-purple-600 to-[#00e5ff] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all">Push Item</button>
                  <button onClick={runStackPop} className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all">Pop Item</button>
                </>
              )}
              {slug === 'queue' && (
                <>
                  <button onClick={runQueueEnqueue} className="w-full py-3 bg-linear-to-r from-purple-600 to-[#00e5ff] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all">Enqueue Item</button>
                  <button onClick={runQueueDequeue} className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all">Dequeue Item</button>
                </>
              )}
              {slug === 'hashing' && (
                <button onClick={runHashInsert} className="w-full py-3 bg-linear-to-r from-purple-600 to-[#00e5ff] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all">Hash and Insert</button>
              )}
              {slug === 'sorting' && (
                <button onClick={runBubbleSort} className="w-full py-3 bg-linear-to-r from-purple-600 to-[#00e5ff] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all">Bubble Sort Array</button>
              )}
              {slug === 'searching' && (
                <button onClick={runBinarySearch} className="w-full py-3 bg-linear-to-r from-purple-600 to-[#00e5ff] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all">Binary Search</button>
              )}
              {slug === 'graphs' && (
                <button onClick={runGraphBfs} className="w-full py-3 bg-linear-to-r from-purple-600 to-[#00e5ff] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all">Run BFS Traversal</button>
              )}
              {slug === 'recursion' && (
                <button onClick={runRecursionFactorial} className="w-full py-3 bg-linear-to-r from-purple-600 to-[#00e5ff] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all">Run Factorial(n)</button>
              )}
              {slug === 'backtracking' && (
                <button onClick={runNQueensStep} className="w-full py-3 bg-linear-to-r from-purple-600 to-[#00e5ff] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all">Solve N-Queens Step</button>
              )}
              {slug === 'dynamic-programming' && (
                <button onClick={runDpFib} className="w-full py-3 bg-linear-to-r from-purple-600 to-[#00e5ff] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all">Compute Fibonacci DP</button>
              )}
              {slug === 'greedy' && (
                <button onClick={runGreedyCoins} className="w-full py-3 bg-linear-to-r from-purple-600 to-[#00e5ff] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all">Select Coins</button>
              )}
              {['trees', 'bst', 'avl-trees'].includes(slug) && (
                <>
                  <button onClick={runTreeInsert} className="w-full py-3 bg-linear-to-r from-purple-600 to-[#00e5ff] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)]">Insert Node (BST)</button>
                  <button onClick={runTreeDelete} className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all">Delete Node (BST)</button>
                  <button onClick={runTreeTraversal} className="w-full py-3 bg-purple-600/35 hover:bg-purple-600/50 border border-purple-500/30 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all">Run Tree Traversal</button>
                </>
              )}
              {slug === 'heap' && (
                <button onClick={runHeapInsert} className="w-full py-3 bg-linear-to-r from-purple-600 to-[#00e5ff] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)]">Insert Heap Element</button>
              )}
              {slug === 'trie' && (
                <button onClick={runTrieSearch} className="w-full py-3 bg-linear-to-r from-purple-600 to-[#00e5ff] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)]">Prefix Search (Trie)</button>
              )}
            </div>
          </div>
          
          {/* Step-by-Step chronological log outputs */}
          <div className="bg-black/60 border border-[var(--glass-border)] rounded-2xl p-6 h-52 flex flex-col justify-between shadow-2xl">
            <h3 className="text-white font-bold text-xs uppercase tracking-widest border-b border-white/5 pb-2 mb-2 flex items-center justify-between">
              <span>Execution Log</span>
              <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-ping"></span>
            </h3>
            
            <div className="flex-1 font-mono text-[10px] text-gray-400 space-y-2 overflow-y-auto pr-1">
              {stepLogs.length === 0 ? (
                <span className="text-gray-600">No steps executed. Trigger an operation to start tracking states.</span>
              ) : (
                stepLogs.map((log, idx) => (
                  <div key={idx} className={log.includes('Completed!') || log.includes('Success!') ? 'text-emerald-400 font-bold' : log.includes('Initiating') ? 'text-purple-400' : 'text-gray-300'}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
