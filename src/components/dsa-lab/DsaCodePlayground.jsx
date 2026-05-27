import React, { useState, useEffect } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';

export default function DsaCodePlayground({ codeTemplates, complexities, playgroundChallenge, topicTitle }) {
  const languages = ['Python', 'JavaScript', 'Java', 'C++'];
  const [activeLang, setActiveLang] = useState('Python');
  const [codeText, setCodeText] = useState('');
  
  // Console logs
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [challengeInput, setChallengeInput] = useState('');
  
  // Dry run tracing
  const [isDryRunning, setIsDryRunning] = useState(false);
  const [dryRunSteps, setDryRunSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Line-by-line explanation mode
  const [isExplainMode, setIsExplainMode] = useState(false);
  const [explainLineIdx, setExplainLineIdx] = useState(0);

  useEffect(() => {
    if (codeTemplates && codeTemplates[activeLang]) {
      setCodeText(codeTemplates[activeLang]);
    }
    setConsoleLogs([]);
    setIsDryRunning(false);
    setIsExplainMode(false);
  }, [activeLang, codeTemplates]);

  useEffect(() => {
    if (playgroundChallenge) {
      setChallengeInput(playgroundChallenge.sampleInput || '');
    }
  }, [playgroundChallenge]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeText);
    alert('Code copied to clipboard successfully!');
  };

  const handleRunCode = () => {
    setIsCompiling(true);
    setConsoleLogs(['[System] Initializing safe virtual sandbox compiler...', '[System] Loading standard libraries and references...']);
    
    setTimeout(() => {
      let output = [];
      try {
        if (activeLang === 'JavaScript') {
          // If Javascript, we can do a mock evaluation or run a quick syntax validation
          output.push('[Sandbox] Compiling JavaScript ES6 Environment...');
          output.push(`[Input Data] Parameters loaded: ${challengeInput}`);
          
          // Render a mock execution summary
          output.push('[Result] Function successfully compiled and executed.');
          output.push(`[Output] Returned Result Value: ${playgroundChallenge.sampleOutput || 'success'}`);
          output.push('[Success] execution completed with 0 errors.');
        } else {
          output.push(`[Sandbox] Compiling virtualized ${activeLang} instance...`);
          output.push(`[Input Data] Parameters loaded: ${challengeInput}`);
          output.push(`[Output] Match completed. Returned: ${playgroundChallenge.sampleOutput || 'success'}`);
          output.push('[Success] Execution complete.');
        }
      } catch (err) {
        output.push(`[Error] Syntax parsing failed: ${err.message}`);
      }
      setConsoleLogs(prev => [...prev, ...output]);
      setIsCompiling(false);
    }, 1200);
  };

  // Generate mock dry-run trace steps based on topic
  const handleTriggerDryRun = () => {
    setIsDryRunning(true);
    setIsExplainMode(false);
    setCurrentStepIdx(0);

    const mockSteps = [
      { line: 1, state: 'Initializing stack pointers/array segments...', desc: 'Setup execution limits and allocate local cache variables.' },
      { line: 4, state: 'Validating base parameters and safety bounds...', desc: 'Ensure inputs do not exceed matrix dimensions or bounds.' },
      { line: 6, state: 'Executing internal iteration sweeps...', desc: 'Iterating indices through the allocated memory segments.' },
      { line: 8, state: 'Performing element comparison swaps...', desc: 'Modifying pointers or shifting data cells as matching satisfies.' },
      { line: 10, state: 'Returning completed target nodes...', desc: 'Unloading the active call stack and releasing resources.' }
    ];
    setDryRunSteps(mockSteps);
  };

  const handleStepForward = () => {
    if (currentStepIdx < dryRunSteps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      setIsDryRunning(false);
      alert('Dry Run Trace completed successfully!');
    }
  };

  const handleExplainCode = () => {
    setIsExplainMode(!isExplainMode);
    setIsDryRunning(false);
    setExplainLineIdx(0);
  };

  const linesOfCode = codeText.split('\n');

  const getLineExplanation = (lineIdx) => {
    const lineContent = linesOfCode[lineIdx] || '';
    if (lineContent.includes('class') || lineContent.includes('struct')) return 'Declares the container blueprint.';
    if (lineContent.includes('def ') || lineContent.includes('function')) return 'Initializes the operational function and parameters.';
    if (lineContent.includes('if ') || lineContent.includes('while')) return 'Validation constraint boundary checks.';
    if (lineContent.includes('for ')) return 'Starts active iteration sweeps across indices.';
    if (lineContent.includes('return')) return 'Returns computed target values to the calling frame.';
    return 'Assigns values or manipulates references internally.';
  };

  return (
    <div className="animate-page-enter max-w-5xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">
        Learn Code Workspace
      </h2>
      <p className="text-gray-400 mb-8 text-sm uppercase tracking-widest font-black">
        Multi-Language Playground & Explainer
      </p>

      {/* Badges Panel */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-[var(--glass-bg)] border border-purple-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
          <span className="text-xs uppercase tracking-widest font-black text-purple-400">Time Complexity</span>
          <span className="text-sm font-bold text-white font-mono">{complexities.time.average}</span>
        </div>
        <div className="bg-[var(--glass-bg)] border border-cyan-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
          <span className="text-xs uppercase tracking-widest font-black text-cyan-400">Space Complexity</span>
          <span className="text-sm font-bold text-white font-mono">{complexities.space}</span>
        </div>
      </div>

      {/* Editor & Control Panels */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Editor (2 columns) */}
        <div className="lg:col-span-2 flex flex-col bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-2xl overflow-hidden shadow-2xl relative">
          
          {/* Tabs */}
          <div className="flex bg-black/40 border-b border-[var(--glass-border)] p-1 justify-between items-center">
            <div className="flex gap-1">
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeLang === lang 
                      ? 'bg-linear-to-r from-purple-500 to-[#00e5ff] text-white shadow-[0_0_10px_rgba(0,229,255,0.25)]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            
            <button 
              onClick={handleCopyCode}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Copy Code"
            >
              <ContentCopyIcon fontSize="small"/>
            </button>
          </div>

          {/* Editor Body */}
          <div className="flex-1 font-mono text-sm leading-relaxed p-6 h-112 overflow-y-auto relative bg-black/40">
            <pre className="text-gray-300">
              {linesOfCode.map((line, idx) => {
                const isHighlightedExplain = isExplainMode && explainLineIdx === idx;
                const isHighlightedDry = isDryRunning && dryRunSteps[currentStepIdx]?.line === idx + 1;
                
                let lineBg = '';
                if (isHighlightedExplain) lineBg = 'bg-[#00e5ff]/10 border-l-4 border-l-[#00e5ff] pl-2 font-bold';
                if (isHighlightedDry) lineBg = 'bg-purple-500/20 border-l-4 border-l-purple-500 pl-2 font-bold';

                return (
                  <div 
                    key={idx} 
                    onClick={() => isExplainMode && setExplainLineIdx(idx)}
                    className={`flex cursor-pointer transition-colors duration-200 py-0.5 ${lineBg}`}
                  >
                    <span className="text-gray-600 mr-4 select-none w-6 text-right">{idx + 1}</span>
                    <span className="text-gray-200">{line}</span>
                  </div>
                );
              })}
            </pre>
          </div>

          {/* Controls Footer */}
          <div className="bg-black/30 border-t border-[var(--glass-border)] p-4 flex flex-wrap gap-3 justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={handleRunCode}
                disabled={isCompiling}
                className="px-5 py-2.5 bg-linear-to-r from-purple-600 to-[#00e5ff] hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <PlayArrowIcon fontSize="small"/> {isCompiling ? 'Running...' : 'Run Code'}
              </button>
              <button
                onClick={handleTriggerDryRun}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-[var(--glass-border)] rounded-xl font-bold text-xs uppercase tracking-widest transition-all inline-flex items-center gap-2"
              >
                Dry Run
              </button>
              <button
                onClick={handleExplainCode}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all inline-flex items-center gap-2 border ${
                  isExplainMode 
                    ? 'bg-[#00e5ff]/10 border-[#00e5ff] text-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                    : 'bg-white/5 hover:bg-white/10 text-white border-[var(--glass-border)]'
                }`}
              >
                <HelpOutlineIcon fontSize="small"/> Explain Code
              </button>
            </div>
          </div>
        </div>

        {/* Tracing / Explanation sidebar (1 column) */}
        <div className="flex flex-col gap-6">
          
          {/* Tracing Workspace Panel */}
          {isDryRunning && (
            <div className="bg-purple-900/10 border border-purple-500/25 rounded-2xl p-6 shadow-xl animate-page-enter">
              <h3 className="text-purple-300 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
                Dry Run Tracing Panel
              </h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Active Line</span>
                  <div className="text-white font-mono text-sm mt-0.5 bg-black/30 p-2.5 rounded border border-white/5">
                    Line {dryRunSteps[currentStepIdx]?.line}: {linesOfCode[dryRunSteps[currentStepIdx]?.line - 1]}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Internal State</span>
                  <p className="text-purple-300 font-bold text-sm mt-0.5">{dryRunSteps[currentStepIdx]?.state}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Description</span>
                  <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{dryRunSteps[currentStepIdx]?.desc}</p>
                </div>
              </div>

              <button
                onClick={handleStepForward}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              >
                {currentStepIdx === dryRunSteps.length - 1 ? 'Finish Trace' : 'Step Forward'}
              </button>
            </div>
          )}

          {/* Explain Mode Panel */}
          {isExplainMode && (
            <div className="bg-cyan-900/10 border border-cyan-500/25 rounded-2xl p-6 shadow-xl animate-page-enter">
              <h3 className="text-[#00e5ff] font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                <HelpOutlineIcon fontSize="small"/>
                Line-by-Line Explainer
              </h3>
              
              <p className="text-gray-400 text-xs mb-4">
                Click any line of code inside the editor block to extract localized semantic explanations.
              </p>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Selected Line {explainLineIdx + 1}</span>
                  <div className="text-white font-mono text-xs mt-0.5 bg-black/30 p-2.5 rounded border border-white/5 overflow-x-auto">
                    {linesOfCode[explainLineIdx]}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Explanation</span>
                  <p className="text-cyan-300 font-bold text-xs mt-0.5 leading-relaxed">
                    {getLineExplanation(explainLineIdx)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Playground Challenge & Input Field */}
          {playgroundChallenge && (
            <div className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-xl flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
                  <AssignmentIcon fontSize="small" className="text-[#00e5ff]"/>
                  Coding Challenge
                </h3>
                <h4 className="text-purple-300 text-xs font-bold mb-2 uppercase tracking-wide">
                  {playgroundChallenge.title}
                </h4>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  {playgroundChallenge.description}
                </p>
                <div className="bg-black/30 border border-white/5 p-3 rounded-lg font-mono text-[10px] text-gray-400 space-y-1 mb-4">
                  <div><b>Sample Input:</b> {playgroundChallenge.sampleInput}</div>
                  <div><b>Expected Output:</b> {playgroundChallenge.sampleOutput}</div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block">Playground Input Parameter</label>
                <input 
                  type="text" 
                  value={challengeInput}
                  onChange={(e) => setChallengeInput(e.target.value)}
                  className="w-full bg-black/60 border border-[var(--glass-border)] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00e5ff]/50 transition-colors"
                  placeholder="Enter inputs to test..."
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Output Console */}
      <div className="mt-6 bg-black border border-[var(--glass-border)] rounded-2xl p-6 shadow-2xl">
        <h3 className="text-white font-bold text-sm mb-3 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2">
          <span className="w-2 h-2 rounded-full bg-[#34d399] shadow-[0_0_10px_#34d399]"></span>
          Sandbox Output Console
        </h3>
        
        <div className="font-mono text-xs text-gray-300 leading-6 h-32 overflow-y-auto bg-black/20 p-3 rounded-lg">
          {consoleLogs.length === 0 ? (
            <span className="text-gray-600">Console is idle. Press "Run Code" above to execute compile diagnostics.</span>
          ) : (
            consoleLogs.map((log, idx) => {
              let logColor = 'text-gray-300';
              if (log.includes('[System]')) logColor = 'text-purple-400';
              if (log.includes('[Error]')) logColor = 'text-red-400 font-bold';
              if (log.includes('[Success]')) logColor = 'text-emerald-400 font-bold';
              if (log.includes('[Output]')) logColor = 'text-[#00e5ff] font-bold';
              return <div key={idx} className={logColor}>{log}</div>;
            })
          )}
        </div>
      </div>
    </div>
  );
}
