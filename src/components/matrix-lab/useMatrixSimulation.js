import { useState, useEffect, useRef, useCallback } from 'react';

export const STATUS = {
  IDLE: 'IDLE',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  FINISHED: 'FINISHED',
  ERROR: 'ERROR',
};

export default function useMatrixSimulation() {
  // Matrix Definitions
  const [rowsA, setRowsA] = useState(2);
  const [colsA, setColsA] = useState(2);
  const [rowsB, setRowsB] = useState(2);
  const [colsB, setColsB] = useState(2);

  const generateEmptyMatrix = (r, c) => Array(r).fill().map(() => Array(c).fill(0));
  
  const [matrixA, setMatrixA] = useState([[1, 2], [3, 4]]);
  const [matrixB, setMatrixB] = useState([[5, 6], [7, 8]]);
  const [resultMatrix, setResultMatrix] = useState(generateEmptyMatrix(2, 2));

  // Visual indices
  const [activeI, setActiveI] = useState(-1); // Row of A
  const [activeJ, setActiveJ] = useState(-1); // Col of B
  const [activeK, setActiveK] = useState(-1); // Traversing index
  const [runningSum, setRunningSum] = useState(0); // Sum accumulator

  // Core controls
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errorMsg, setErrorMsg] = useState('');
  const [speedMs, setSpeedMs] = useState(1000);

  // References to avoid stale closures in setTimeout
  const stateRef = useRef({ i: 0, j: 0, k: 0, sum: 0, matrix: [] });
  const timerRef = useRef(null);

  // Validation
  useEffect(() => {
    if (colsA !== rowsB) {
      setErrorMsg(`Invalid: Matrix A columns (${colsA}) must equal Matrix B rows (${rowsB}).`);
      setStatus(STATUS.ERROR);
    } else {
      setErrorMsg('');
      if (status === STATUS.ERROR) setStatus(STATUS.IDLE);
    }
  }, [colsA, rowsB, status]);

  // Dimension Handlers
  const changeDimensions = (which, r, c) => {
    if (r < 1 || c < 1 || r > 5 || c > 5) return;
    if (which === 'A') {
      setRowsA(r); setColsA(c);
      const newA = generateEmptyMatrix(r, c);
      for(let i=0; i<Math.min(r, matrixA.length); i++) {
        for(let j=0; j<Math.min(c, matrixA[0].length); j++) {
           newA[i][j] = matrixA[i][j];
        }
      }
      setMatrixA(newA);
    } else {
      setRowsB(r); setColsB(c);
      const newB = generateEmptyMatrix(r, c);
      for(let i=0; i<Math.min(r, matrixB.length); i++) {
        for(let j=0; j<Math.min(c, matrixB[0].length); j++) {
           newB[i][j] = matrixB[i][j];
        }
      }
      setMatrixB(newB);
    }
    resetSimulation();
  };

  const updateCell = (which, r, c, val) => {
    const num = val === '' ? 0 : Number(val);
    if (Number.isNaN(num)) return;
    if (which === 'A') {
      const copy = [...matrixA];
      copy[r][c] = num;
      setMatrixA(copy);
    } else {
      const copy = [...matrixB];
      copy[r][c] = num;
      setMatrixB(copy);
    }
  };

  const randomize = () => {
    const rA = matrixA.map(row => row.map(() => Math.floor(Math.random() * 10)));
    const rB = matrixB.map(row => row.map(() => Math.floor(Math.random() * 10)));
    setMatrixA(rA);
    setMatrixB(rB);
    resetSimulation();
  };

  const clear = () => {
    setMatrixA(generateEmptyMatrix(rowsA, colsA));
    setMatrixB(generateEmptyMatrix(rowsB, colsB));
    resetSimulation();
  };

  // Main Loop Tick Logic
  const tick = useCallback(() => {
    const { i, j, k, sum, matrix } = stateRef.current;
    
    // We are at the end
    if (i >= rowsA) {
      setStatus(STATUS.FINISHED);
      setActiveI(-1); setActiveJ(-1); setActiveK(-1);
      return;
    }

    // Process current cell calculation
    const valA = matrixA[i][k] || 0;
    const valB = matrixB[k][j] || 0;
    const product = valA * valB;
    const newSum = sum + product;

    // Update visuals
    setActiveI(i);
    setActiveJ(j);
    setActiveK(k);
    setRunningSum(newSum);

    let nextI = i;
    let nextJ = j;
    let nextK = k + 1;
    let nextSum = newSum;
    let nextMatrix = matrix.map(row => [...row]);

    if (nextK >= colsA) {
      // Completed dot product for C[i][j]
      nextMatrix[i][j] = nextSum;
      setResultMatrix(nextMatrix);
      
      // Move to next column
      nextK = 0;
      nextSum = 0;
      nextJ++;
      
      if (nextJ >= colsB) {
        // Move to next row
        nextJ = 0;
        nextI++;
      }
    }

    stateRef.current = { i: nextI, j: nextJ, k: nextK, sum: nextSum, matrix: nextMatrix };

  }, [matrixA, matrixB, rowsA, colsA, colsB]);

  // Player execution flow
  useEffect(() => {
    if (status === STATUS.RUNNING) {
      timerRef.current = setInterval(() => {
        tick();
      }, speedMs);
    }
    return () => clearInterval(timerRef.current);
  }, [status, speedMs, tick]);

  const play = () => {
    if (colsA !== rowsB) return;
    if (status === STATUS.IDLE) {
      stateRef.current = { i: 0, j: 0, k: 0, sum: 0, matrix: generateEmptyMatrix(rowsA, colsB) };
      setResultMatrix(stateRef.current.matrix);
    }
    if (status === STATUS.FINISHED) {
      resetSimulation();
      return setTimeout(play, 100);
    }
    setStatus(STATUS.RUNNING);
  };

  const pause = () => setStatus(STATUS.PAUSED);

  const step = () => {
    if (colsA !== rowsB) return;
    if (status === STATUS.IDLE || status === STATUS.FINISHED) {
      stateRef.current = { i: 0, j: 0, k: 0, sum: 0, matrix: generateEmptyMatrix(rowsA, colsB) };
      setResultMatrix(stateRef.current.matrix);
    }
    setStatus(STATUS.PAUSED);
    tick();
  };

  const resetSimulation = () => {
    clearTimeout(timerRef.current);
    setStatus(colsA === rowsB ? STATUS.IDLE : STATUS.ERROR);
    setActiveI(-1); setActiveJ(-1); setActiveK(-1);
    setRunningSum(0);
    setResultMatrix(generateEmptyMatrix(rowsA, colsB));
    stateRef.current = { i: 0, j: 0, k: 0, sum: 0, matrix: generateEmptyMatrix(rowsA, colsB) };
  };

  return {
    matrixA, matrixB, resultMatrix,
    rowsA, colsA, rowsB, colsB,
    changeDimensions, updateCell, randomize, clear,
    activeI, activeJ, activeK, runningSum,
    status, errorMsg, speedMs, setSpeedMs,
    play, pause, step, resetSimulation
  };
}
