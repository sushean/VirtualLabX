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
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
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

  const showWarning = (msg) => {
    setWarningMessage(msg);
    if (warningTimeout.current) clearTimeout(warningTimeout.current);
    warningTimeout.current = setTimeout(() => setWarningMessage(''), 5000);
  };

  const handleNext = async () => {
    if (!selectedOption) return;
    try {
      await submitAnswer(sessionId, currentQuestion.id, selectedOption);
      setSelectedOption('');
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!examSession && !examResult) {
    return <div className="p-10 text-center text-white">Loading exam...</div>;
  }

  if (examResult) {
    return (
      <div className="min-h-screen bg-black/90 p-8 flex flex-col items-center justify-center text-white relative z-[100]">
        <div className="bg-gray-900 border border-gray-700 p-8 rounded-xl max-w-lg w-full text-center shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">Exam Submitted</h2>
          <div className="space-y-4 text-lg text-gray-300">
            <p>Score: <span className="text-white font-bold">{examResult.score}/{examResult.maxScore}</span></p>
            <p>Cheating Score: <span className="text-red-400 font-bold">{examResult.cheatingScore}</span></p>
            <p>Status: <span className={`font-bold ${examResult.status === 'DISQUALIFIED' ? 'text-red-500' : 'text-green-500'}`}>{examResult.status}</span></p>
          </div>
          {examResult.certificate && (
             <div className="mt-8 p-4 border border-green-500/50 bg-green-500/10 rounded-lg">
               <h3 className="text-xl text-green-400 font-bold mb-2">Congratulations!</h3>
               <p>You passed the exam. Your Certificate ID is:</p>
               <p className="font-mono text-sm mt-2 font-bold select-all">{examResult.certificate.certificateId}</p>
             </div>
          )}
          <button 
            onClick={() => navigate('/')}
            className="mt-8 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/95 pt-20 pb-10 px-4 relative z-[100] font-sans user-select-none animate-page-enter">
      {/* Top Bar */}
      <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl p-4 flex justify-between items-center mb-6 shadow-lg">
        <h1 className="text-xl font-bold text-white shrink-0 tracking-wide">{examSession.title || 'Certification Exam'}</h1>
        
        {warningMessage && (
          <div className="animate-pulse bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded-lg text-sm font-semibold">
            {warningMessage}
          </div>
        )}

        <div className="flex items-center space-x-6 text-gray-300">
           <div className="text-sm font-semibold tracking-wider">
             QUESTION {currentQuestion ? currentQuestion.currentIndex + 1 : 0} / {currentQuestion?.totalQuestions || '?'}
           </div>
           <div className={`text-xl font-mono ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>
             {formatTime(timeLeft)}
           </div>
        </div>
      </div>

      {/* Main Question Area */}
      <div className="max-w-4xl mx-auto flex gap-6">
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          {currentQuestion ? (
            <>
              <h2 className="text-2xl font-light text-white mb-8 leading-relaxed">
                {currentQuestion.text}
              </h2>
              <div className="space-y-4">
                {currentQuestion.options.map((opt, idx) => (
                  <label 
                    key={idx} 
                    className={`block w-full p-4 rounded-xl border ${selectedOption === opt ? 'border-purple-500 bg-purple-500/20' : 'border-gray-700 hover:border-gray-500 bg-gray-800/50'} cursor-pointer transition-all duration-300 flex items-center group`}
                  >
                    <input 
                      type="radio" 
                      name="option" 
                      value={opt}
                      checked={selectedOption === opt}
                      onChange={() => setSelectedOption(opt)}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${selectedOption === opt ? 'border-purple-400' : 'border-gray-500 group-hover:border-gray-400'}`}>
                       {selectedOption === opt && <div className="w-2.5 h-2.5 bg-purple-400 rounded-full" />}
                    </div>
                    <span className="text-gray-200 group-hover:text-white align-middle">{opt}</span>
                  </label>
                ))}
              </div>
              
              <div className="mt-10 flex justify-end">
                <button 
                  onClick={handleNext}
                  disabled={!selectedOption}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-white shadow-lg transition-all"
                >
                  {currentQuestion.currentIndex === currentQuestion.totalQuestions - 1 ? 'Submit Exam' : 'Save & Next'}
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-400 animate-pulse">
              Loading Question...
            </div>
          )}
        </div>
      </div>
      
      {/* Render AI Proctoring Widget */}
      <ProctoringModule />

      {/* Global strict styles */}
      <style>{`
        .user-select-none {
          user-select: none;
          -webkit-user-select: none;
        }
      `}</style>
    </div>
  );
}
