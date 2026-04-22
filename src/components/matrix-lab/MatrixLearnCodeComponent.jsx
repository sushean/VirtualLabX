import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function MatrixLearnCodeComponent() {
  const [mode, setMode] = useState('learn'); // 'learn' or 'test'
  
  // Test answers state
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: ''
  });
  const [feedback, setFeedback] = useState({});

  const checkAnswer = (qKey, expected, e) => {
    if (answers[qKey].trim().toLowerCase() === expected.toLowerCase()) {
      setFeedback({ ...feedback, [qKey]: 'correct' });
      if (e && e.target) {
        const rect = e.target.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { x, y },
          disableForReducedMotion: true,
          zIndex: 100
        });
      }
    } else {
      setFeedback({ ...feedback, [qKey]: 'incorrect' });
    }
  };

  const revealAnswer = (qKey, expected) => {
    setAnswers({ ...answers, [qKey]: expected });
    setFeedback({ ...feedback, [qKey]: 'correct' });
  };

  const learnContent = [
    {
      step: "1. Importing Libraries",
      code: "import numpy as np",
      explanation: "numpy → a powerful Python library used for numerical computations\nBuilt-in support → provides optimized tools for matrices and fast operations",
      summary: "Using NumPy simplifies matrix operations and significantly improves mathematical performance."
    },
    {
      step: "2. Creating Matrices",
      code: "A = np.array([[1, 2, 3],\n              [4, 5, 6]])\n\nB = np.array([[7, 8],\n              [9, 10],\n              [11, 12]])",
      explanation: "A (2 × 3) → Represents two rows and three columns\nB (3 × 2) → Represents three rows and two columns\nThese matrices gracefully satisfy the strict multiplication condition constraints.",
      summary: "Matrices must be strictly defined with proper geometric dimensions before multiplication."
    },
    {
      step: "3. Checking Compatibility",
      code: "if A.shape[1] == B.shape[0]:\n    print(\"Multiplication is possible\")\nelse:\n    print(\"Multiplication not possible\")",
      explanation: "A.shape[1] → extracts the number of columns in A\nB.shape[0] → extracts the number of rows in B\nIf they match exactly, we proceed. Otherwise, it structurally fails.",
      summary: "Always defensively validate dimensional pairings before performing mathematical multiplication."
    },
    {
      step: "4. Performing Matrix Multiplication (NumPy)",
      code: "C = np.dot(A, B)\nprint(C)",
      explanation: "np.dot() → natively performs intensive matrix multiplication computations under the hood\nIt efficiently applies the deep C/C++ row × column mapping rule",
      summary: "NumPy provides blazing-fast optimized functions for matrix multiplication avoiding manual loops."
    },
    {
      step: "5. Manual Implementation (Core Logic)",
      code: "def multiply(A, B):\n    result = [[0 for _ in range(len(B[0]))] for _ in range(len(A))]\n\n    for i in range(len(A)):\n        for j in range(len(B[0])):\n            for k in range(len(B)):\n                result[i][j] += A[i][k] * B[k][j]\n\n    return result\n\nC = multiply(A.tolist(), B.tolist())\nprint(C)",
      explanation: "i → loops vertically down the rows of A\nj → loops horizontally across the columns of B\nk → sweeps corresponding paired cells creating dot product iteration traces",
      summary: "This is the naked algorithmic core physics logic running sequentially behind matrix multiplication."
    },
    {
      step: "6. Understanding the Formula",
      code: "C[i][j] = Σ (k=1 to n) ( A[i][k] ⋅ B[k][j] )",
      explanation: "Fix row i from A → freezes the current row extraction\nFix column j from B → freezes the matched column extraction\nMultiply paired elements iteratively, then summate across index lengths.",
      summary: "Each isolated element embedded in the result grid is simply a self-contained 1D dot product."
    },
    {
      step: "7. Step-by-Step Example (Visualization Logic)",
      code: "# Example calculation for C[0][0]\n(1*7) + (2*9) + (3*11) = 58",
      explanation: "Take first row of A → [1, 2, 3]\nTake first column of B → [7, 9, 11]\nMultiply individually and sum into final scalar integer.",
      summary: "Matrix multiplication involves rapidly repeating dot product operations across a mapped grid plane."
    },
    {
      step: "8. JavaScript Implementation (For Your Frontend)",
      code: "function multiply(A, B) {\n  let result = Array(A.length)\n    .fill(0)\n    .map(() => Array(B[0].length).fill(0));\n\n  for (let i = 0; i < A.length; i++) {\n    for (let j = 0; j < B[0].length; j++) {\n      for (let k = 0; k < B.length; k++) {\n        result[i][j] += A[i][k] * B[k][j];\n      }\n    }\n  }\n  return result;\n}",
      explanation: "Same exact physical logic mapped into JavaScript array structures.\nUses Array().fill() mapping techniques → to instantiate a 2-dimensional grid matrix.",
      summary: "This is the active logic physically powering the interactive React simulation you saw earlier."
    },
    {
      step: "9. Complexity Analysis",
      code: "Time Complexity = O(n³)\nSpace Complexity = O(n²)",
      explanation: "3 nested loop blocks → causes cubic time scaling impacts heavily on performance\nResult grid → takes up squared 2-D memory mapping requirements",
      summary: "Traditional matrix multiplication formulas are structurally correct but computationally expensive."
    },
    {
      step: "10. Advanced (Optional Enhancement)",
      code: "# Faster Python 3 multiplication using NumPy\nC = A @ B",
      explanation: "@ operator → acts as direct syntactic sugar specifically mapped for matrix multiplication\nUnderground → drops logic into highly optimized C and Fortran linear algebra libraries (BLAS).",
      summary: "Modern machine learning frameworks utilize extreme optimization logic natively internally."
    }
  ];

  const renderTestQuestion = (qNum, title, preCode, inputKey, postCode, expectedAnswer) => {
    const isFilled = answers[inputKey].trim().length > 0;
    const isCorrect = feedback[inputKey] === 'correct';
    const isIncorrect = feedback[inputKey] === 'incorrect';

    return (
      <div className="bg-[#110b27] border border-white/10 rounded-2xl p-6 mb-6 shadow-lg">
        <h4 className="text-[#00e5ff] font-bold text-lg mb-4 flex items-center gap-2">
          <span className="bg-[#00e5ff]/10 text-[#00e5ff] w-8 h-8 rounded-full flex items-center justify-center border border-[#00e5ff]/30">Q{qNum}</span>
          {title}
        </h4>
        <div className="bg-black/50 p-4 rounded-xl font-mono text-gray-300 border border-white/5 text-sm leading-8 mb-4 whitespace-pre-wrap">
           <span>{preCode}</span>
           <span className="relative inline-block mx-1">
             <input 
               type="text" 
               value={answers[inputKey]}
               onChange={(e) => {
                 setAnswers({...answers, [inputKey]: e.target.value});
                 setFeedback({...feedback, [inputKey]: null});
               }}
               className={`bg-transparent border-b-2 outline-none text-center font-bold px-2 py-1 w-24 transition-colors border-[#00e5ff] text-white focus:border-purple-400`}
             />
           </span>
           <span>{postCode}</span>
        </div>
        <div className="flex justify-end items-center gap-4">
           {isCorrect && <span className="text-green-500 font-bold uppercase tracking-widest text-sm">Correct</span>}
           {isIncorrect && <span className="text-red-500 font-bold uppercase tracking-widest text-sm">Incorrect</span>}
           <button 
             onClick={(e) => isFilled ? checkAnswer(inputKey, expectedAnswer, e) : revealAnswer(inputKey, expectedAnswer)}
             className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${isCorrect ? 'bg-green-500/20 text-green-400 border border-green-500/50 cursor-default' : 'bg-linear-to-r from-purple-600 to-[#00e5ff] text-white hover:shadow-[0_0_15px_rgba(0,229,255,0.4)]'}`}
             disabled={isCorrect}
           >
             {isCorrect ? 'Solved' : isFilled ? 'Check Answer' : 'Reveal Answer'}
           </button>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-page-enter max-w-4xl mx-auto pb-12">
      <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">Learn Code</h2>
      
      {/* Mode Toggle */}
      <div className="flex bg-[#110b27] border border-white/10 p-1 rounded-xl mb-10 mx-auto w-fit shadow-lg shadow-purple-500/10">
        <button 
          onClick={() => setMode('learn')}
          className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 ${mode === 'learn' ? 'bg-linear-to-r from-purple-500 to-[#00e5ff] text-white shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'text-gray-400 hover:text-white'}`}
        >
          LEARN MODE
        </button>
        <button 
          onClick={() => setMode('test')}
          className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 ${mode === 'test' ? 'bg-linear-to-r from-purple-500 to-[#00e5ff] text-white shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'text-gray-400 hover:text-white'}`}
        >
          TEST MODE
        </button>
      </div>

      {mode === 'learn' && (
        <div className="space-y-8 animate-page-enter">
          {learnContent.map((item, idx) => (
             <div key={idx} className="bg-[#110b27] border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_0_20px_rgba(108,43,217,0.2)] transition-shadow">
                <div className="bg-white/5 p-4 border-b border-white/10">
                   <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <span className="w-2 h-6 bg-[#00e5ff] rounded-full"></span>
                      {item.step}
                   </h3>
                </div>
                <div className="p-6 md:p-8 flex flex-col xl:flex-row gap-8">
                   {/* Code Section */}
                   <div className="flex-1 bg-black/60 rounded-xl p-4 border border-white/5 font-mono text-sm overflow-x-auto shadow-inner">
                      <pre className="text-purple-300/90 leading-loose">
                        {item.code.split('\n').map((line, i) => (
                          <div key={i}><span className="text-gray-600 mr-4 select-none">{String(i+1).padStart(2, '0')}</span><span className="text-gray-300">{line}</span></div>
                        ))}
                      </pre>
                   </div>
                   
                   {/* Explanation Section */}
                   <div className="flex-1 space-y-4">
                      <div className="bg-purple-900/10 border border-purple-500/20 p-4 rounded-xl h-full flex flex-col justify-between">
                        <div>
                          <h4 className="text-purple-300 font-bold uppercase tracking-widest text-xs mb-3">Explanation</h4>
                          <ul className="text-gray-300 space-y-3 text-sm leading-relaxed mb-6">
                             {item.explanation.split('\n').map((line, i) => {
                               const parts = line.split('→');
                               if(parts.length > 1) return <li key={i}><strong className="text-white text-base bg-white/5 px-2 rounded py-1">{parts[0]}</strong> <br/><span className="text-purple-300 mt-2 block">{parts[1]}</span></li>;
                               return <li key={i}>{line}</li>;
                             })}
                          </ul>
                        </div>
                        <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-start flex-col gap-2">
                          <span className="text-[#00e5ff] font-bold text-xs uppercase tracking-widest mt-0.5">Summary</span>
                          <p className="text-[#00e5ff] text-sm italic">{item.summary}</p>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          ))}
        </div>
      )}

      {mode === 'test' && (
        <div className="animate-page-enter">
          <p className="text-gray-300 text-center mb-8 text-lg bg-white/5 py-4 rounded-xl border border-white/10">
            Fill in the blanks to complete the algorithm correctly. You can check your answer or reveal it if stuck.
          </p>
          
          <div className="max-w-3xl mx-auto">
            {renderTestQuestion(1, "Import Numpy", "import ", "q1", " as np", "numpy")}
            
            {renderTestQuestion(2, "Dimensional Array", "A = np.", "q2", "([[1, 2], [3, 4]])", "array")}
            
            {renderTestQuestion(3, "Validation Check", "if A.shape[1] == B.", "q3", "[0]:", "shape")}
            
            {renderTestQuestion(4, "Algorithm Execution", "C =", "q4", "(A, B)", "np.dot")}
            
            {renderTestQuestion(5, "Internal Iteration mapping", "result[i][j] += A[i][", "q5", "] * B[k][j]", "k")}
            
          </div>

          {Object.values(feedback).filter(status => status === 'correct').length === 5 && (
             <div className="mt-10 p-8 rounded-2xl bg-green-500/10 border border-green-500/30 text-center animate-page-enter shadow-[0_0_30px_rgba(34,197,94,0.2)]">
               <h3 className="text-2xl font-bold text-green-400 mb-2">Excellent Work!</h3>
               <p className="text-gray-300">You have successfully mastered the matrix dot-product code formulation.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
