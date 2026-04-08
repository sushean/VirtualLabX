import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useExam } from '../context/ExamContext';
import ProctoringModule from '../components/ProctoringModule';

export default function ExamPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { 
    examSession, 
    currentQuestion, 
    examResult, 
    fetchQuestion, 
    submitAnswer, 
    logViolation, 
    submitExam 
  } = useExam();

  const [selectedOption, setSelectedOption] = useState('');
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [warningMessage, setWarningMessage] = useState('');
  const warningTimeout = useRef(null);
  
  // Tab Switch Handling
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && examSession?.status === 'IN_PROGRESS') {
        logViolation(sessionId, 'TAB_SWITCH', { url: window.location.href });
        showWarning("Warning: Switching tabs is not allowed!");
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [examSession, sessionId, logViolation]);

  // Strict Browser Controls
  useEffect(() => {
    if (examResult) return;

    const preventContext = (e) => e.preventDefault();
    const preventShortcuts = (e) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+C, Ctrl+V, Ctrl+P
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
        (e.ctrlKey && ['c', 'v', 'p', 'x'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        showWarning("Warning: Keyboard shortcuts are disabled during the exam.");
      }
    };

    document.addEventListener('contextmenu', preventContext);
    document.addEventListener('keydown', preventShortcuts);

    return () => {
      document.removeEventListener('contextmenu', preventContext);
      document.removeEventListener('keydown', preventShortcuts);
    };
  }, [examResult]);

  // Timer
  useEffect(() => {
    if (!examSession || examResult || examSession.status !== 'IN_PROGRESS') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examSession, examResult]);

  const handleTimeUp = async () => {
    await submitExam(sessionId);
  };

  useEffect(() => {
    if (examSession && examSession.status === 'IN_PROGRESS' && !currentQuestion && !examResult) {
      fetchQuestion(sessionId);
    }
  }, [examSession, sessionId, currentQuestion, examResult, fetchQuestion]);

  // Handle Question Type specific state overrides
  useEffect(() => {
    if (currentQuestion) {
      if (currentQuestion.questionType === 'MULTI') {
        setSelectedOption([]);
      } else {
        setSelectedOption('');
      }
    }
  }, [currentQuestion]);

  const showWarning = (msg) => {
    setWarningMessage(msg);
    if (warningTimeout.current) clearTimeout(warningTimeout.current);
    warningTimeout.current = setTimeout(() => setWarningMessage(''), 5000);
  };

  const isAnswerValid = () => {
    if (!currentQuestion) return false;
    if (currentQuestion.questionType === 'MULTI') return Array.isArray(selectedOption) && selectedOption.length > 0;
    return selectedOption !== '' && selectedOption !== null && selectedOption !== undefined;
  };

  const handleNext = async () => {
    if (!isAnswerValid()) return;
    try {
      await submitAnswer(sessionId, currentQuestion.id, selectedOption);
      // Reset is handled by the useEffect watching currentQuestion change organically
    } catch (err) {
      console.error(err);
    }
  };

  const toggleMultiOption = (opt) => {
    setSelectedOption(prev => {
      if (!Array.isArray(prev)) return [opt];
      return prev.includes(opt) ? prev.filter(v => v !== opt) : [...prev, opt];
    });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!examSession && !examResult) {
    return (
      <div className="min-h-screen bg-[#0a0510] pt-24 pb-12 text-white flex items-center justify-center">
         <div className="w-12 h-12 border-4 border-[#00e5ff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (examResult) {
    return (
      <div className="min-h-screen bg-[#0a0510] p-8 flex flex-col items-center justify-center text-white relative z-[100]">
        <div className="bg-white/5 border border-white/10 p-10 rounded-3xl max-w-lg w-full text-center shadow-[0_0_50px_rgba(108,43,217,0.15)] backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e5ff] rounded-full blur-[80px] opacity-20 transform translate-x-12 -translate-y-12"></div>
          
          <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#6c2bd9]">Exam Submitted</h2>
          <div className="space-y-4 text-lg text-gray-300 font-medium">
            <div className="flex justify-between border-b border-white/10 pb-2"><p>Final Score</p> <span className="text-white font-black">{examResult.score} <span className="text-sm font-bold text-gray-500">/ {examResult.maxScore}</span></span></div>
            <div className="flex justify-between border-b border-white/10 pb-2"><p>Proctor Flags</p> <span className="text-red-400 font-bold tracking-widest">{examResult.cheatingScore}</span></div>
            <div className="flex justify-between items-center pb-2"><p>Certification Status</p> <span className={`px-4 py-1 rounded-full text-xs uppercase tracking-widest font-black ${examResult.status === 'DISQUALIFIED' ? 'bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.3)] text-red-400' : 'bg-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.3)] text-green-300'}`}>{examResult.status}</span></div>
          </div>

          {examResult.certificate && (
             <div className="mt-10 p-6 border border-[#00e5ff]/30 bg-[#00e5ff]/5 rounded-xl block">
               <h3 className="text-xl text-[#00e5ff] font-bold mb-2">Verification Complete</h3>
               <p className="text-sm text-gray-400 mb-3">Your credentials have successfully entered the vault.</p>
               <p className="font-mono text-xs mt-2 font-bold text-gray-200 select-all border border-white/10 bg-black/40 p-2 rounded break-words">{examResult.certificate.certificateId}</p>
             </div>
          )}
          <button 
            onClick={() => navigate('/profile')}
            className="w-full mt-10 px-6 py-4 bg-gradient-to-r from-[#6c2bd9] to-[#00e5ff] hover:opacity-90 rounded-xl font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(108,43,217,0.3)]"
          >
            Review Diploma Log
          </button>
        </div>
      </div>
    );
  }

  // Active UI View
  return (
    <div className="min-h-screen bg-[#0a0510] pt-24 pb-12 px-6 relative z-[100] font-sans user-select-none animate-fade-in overflow-hidden">
      
      {/* Background Visual Enhancements */}
      <div className="absolute top-[20%] left-[-10%] w-96 h-96 bg-[#6c2bd9] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#00e5ff] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

      {/* Top Bar Navigation */}
      <div className="max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 flex justify-between items-center mb-8 shadow-xl backdrop-blur-md relative overflow-visible z-10">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#00e5ff] to-[#6c2bd9] rounded-2xl opacity-[0.1] -z-10 blur-sm"></div>
        <h1 className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 tracking-wide uppercase shrink-0 truncate">
          {examSession.title || 'Certification Node'}
        </h1>
        
        {warningMessage && (
          <div className="animate-pulse bg-red-900/60 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] text-red-200 px-6 py-2 rounded-xl text-sm font-bold absolute left-1/2 -translate-x-1/2 top-[-20px] z-50">
            {warningMessage}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-8 text-gray-300">
           <div className="flex flex-col text-right md:text-left">
             <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Progress</span>
             <span className="text-sm font-bold text-white tracking-widest">
               BLK {currentQuestion ? currentQuestion.currentIndex + 1 : 0} <span className="text-[#00e5ff]">/</span> {currentQuestion?.totalQuestions || '?'}
             </span>
           </div>
           
           <div className="w-[1px] h-8 bg-white/10 hidden md:block"></div>

           <div className="flex flex-col text-right">
             <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">TTL</span>
             <span className={`text-2xl font-black font-mono leading-none tracking-tighter ${timeLeft < 60 ? 'text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : timeLeft < 180 ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.3)]'}`}>
               {formatTime(timeLeft)}
             </span>
           </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto flex gap-6 relative z-10">
        
        {/* Working Space */}
        <div className="flex-1 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl relative flex flex-col min-h-[500px]">
          
          {currentQuestion ? (
            <div className="animate-fade-in flex flex-col flex-1 h-full">
              
              <div className="mb-10">
                 <div className="flex gap-2 items-center mb-6">
                    <span className={`px-3 py-1 rounded text-[10px] uppercase tracking-widest font-black border ${currentQuestion.questionType === 'MCQ' ? 'border-[#00e5ff]/30 text-[#00e5ff] bg-[#00e5ff]/10' : currentQuestion.questionType === 'MULTI' ? 'border-purple-500/30 text-purple-400 bg-purple-500/10' : 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10'}`}>
                      {currentQuestion.questionType === 'MCQ' ? 'SINGLE RESPONSE' : currentQuestion.questionType === 'MULTI' ? 'MULTIPLE SELECTION' : 'DATA ENTRY'}
                    </span>
                 </div>
                 <h2 className="text-3xl md:text-3xl font-bold text-white mb-2 leading-snug tracking-wide">
                   {currentQuestion.text}
                 </h2>
                 {currentQuestion.questionType === 'MULTI' && (
                   <p className="text-purple-400 text-sm font-bold italic opacity-80 mt-2">Select all formulations that strictly map correctly to this thesis.</p>
                 )}
                 {currentQuestion.questionType === 'NUMERICAL' && (
                   <p className="text-yellow-500 text-sm font-bold italic opacity-80 mt-2">Supply an exact numerical/string matching format directly beneath.</p>
                 )}
              </div>
              
              <div className="flex-1">
                {/* MCQ Mode - Radio Selection */}
                {currentQuestion.questionType === 'MCQ' && (
                  <div className="space-y-4">
                    {currentQuestion.options.map((opt, idx) => (
                      <label 
                        key={idx} 
                        className={`block w-full p-5 rounded-2xl border backdrop-blur-md ${selectedOption === opt ? 'border-[#00e5ff] bg-[#00e5ff]/10 shadow-[0_0_15px_rgba(0,229,255,0.15)] transform scale-[1.01]' : 'border-white/10 hover:border-white/30 hover:bg-white/5'} cursor-pointer transition-all duration-300 flex items-center group`}
                      >
                        <input 
                          type="radio" 
                          name="option" 
                          value={opt}
                          checked={selectedOption === opt}
                          onChange={() => setSelectedOption(opt)}
                          className="hidden"
                        />
                        <div className={`w-6 h-6 rounded-full border-[3px] mr-5 flex items-center justify-center flex-shrink-0 transition-colors ${selectedOption === opt ? 'border-[#00e5ff]' : 'border-gray-600 group-hover:border-gray-400'}`}>
                           <div className={`w-2.5 h-2.5 bg-[#00e5ff] rounded-full transform transition-transform ${selectedOption === opt ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
                        </div>
                        <span className={`font-semibold align-middle transition-colors ${selectedOption === opt ? 'text-white' : 'text-gray-300 group-hover:text-gray-100'}`}>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* MULTI Mode - Checkbox Selection */}
                {currentQuestion.questionType === 'MULTI' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((opt, idx) => {
                      const isChecked = Array.isArray(selectedOption) && selectedOption.includes(opt);
                      return (
                        <label 
                          key={idx} 
                          className={`block w-full p-5 rounded-2xl border backdrop-blur-md ${isChecked ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.15)] transform scale-[1.01]' : 'border-white/10 hover:border-white/30 hover:bg-white/5'} cursor-pointer transition-all duration-300 flex items-center group`}
                        >
                          <input 
                            type="checkbox" 
                            name="option_multi" 
                            value={opt}
                            checked={isChecked}
                            onChange={() => toggleMultiOption(opt)}
                            className="hidden"
                          />
                          <div className={`w-6 h-6 rounded-md border-[3px] mr-4 flex items-center justify-center flex-shrink-0 transition-colors ${isChecked ? 'border-purple-500 bg-purple-500/20' : 'border-gray-600 group-hover:border-gray-400'}`}>
                             {isChecked && (
                               <svg className="w-3 h-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                               </svg>
                             )}
                          </div>
                          <span className={`font-semibold align-middle transition-colors ${isChecked ? 'text-white' : 'text-gray-300 group-hover:text-gray-100'}`}>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* NUMERICAL Mode - Standard Input Block */}
                {currentQuestion.questionType === 'NUMERICAL' && (
                  <div className="flex justify-center items-center h-full pb-10">
                    <div className="w-full max-w-sm relative group">
                       <div className="absolute -inset-[2px] bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl opacity-20 blur-sm group-focus-within:opacity-50 transition-opacity pointer-events-none"></div>
                       <input 
                         type="text" 
                         value={selectedOption}
                         onChange={(e) => setSelectedOption(e.target.value)}
                         placeholder="Enter exact matched value..."
                         className="w-full bg-[#0a0510] text-center text-3xl font-mono text-white p-6 border-2 border-white/10 focus:border-yellow-500 rounded-2xl outline-none placeholder:text-gray-700 placeholder:text-xl transition-all relative z-10"
                       />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Action Ribbon */}
              <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-gray-500 text-xs font-bold uppercase tracking-widest hidden md:block">
                   Encryption Validating • Realtime Protection ON
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                   <button 
                     onClick={() => submitAnswer(sessionId, currentQuestion.id, 'SKIPPED')}
                     className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold uppercase text-sm tracking-widest text-gray-400 hover:text-white transition-all duration-300 w-full md:w-auto"
                   >
                     Skip Question
                   </button>
                   <button 
                     onClick={handleNext}
                     disabled={!isAnswerValid()}
                     className="px-10 py-4 w-full md:w-auto bg-gradient-to-r from-[#6c2bd9] to-[#00e5ff] disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-600 rounded-xl font-black uppercase text-sm tracking-widest text-white shadow-[0_0_20px_rgba(108,43,217,0.3)] disabled:shadow-none transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
                   >
                     {currentQuestion.currentIndex === currentQuestion.totalQuestions - 1 ? 'Final Commit' : 'Sync & Next Block'}
                   </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-full text-white/50 animate-pulse">
              <div className="w-8 h-8 border-4 border-[#00e5ff]/50 border-t-transparent rounded-full animate-spin mb-4"></div>
              <span className="tracking-widest uppercase text-xs font-bold">Assembling Data Structure</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Dynamic Native Proctor Loader rendering on bottom right naturally via Context */}
      <ProctoringModule />

      <style>{`
        .user-select-none {
           user-select: none;
           -webkit-user-select: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
           width: 6px;
           height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
           background: rgba(255, 255, 255, 0.02);
           border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
           background: rgba(255, 255, 255, 0.1);
           border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
           background: rgba(0, 229, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
