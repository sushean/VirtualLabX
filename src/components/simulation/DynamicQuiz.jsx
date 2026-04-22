import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TimerIcon from '@mui/icons-material/Timer';
import QuizIcon from '@mui/icons-material/Quiz';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function DynamicQuiz({ questions = [], category = 'General', settings = { timeLimit: 10 } }) {
  const { slug } = useParams();
  const [quizState, setQuizState] = useState('intro'); // 'intro', 'active', 'finished', 'review'
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState((settings.timeLimit || 10) * 60);
  const [score, setScore] = useState(0);

  // Timer Hook
  useEffect(() => {
    let timer;
    if (quizState === 'active' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (quizState === 'active' && timeLeft === 0) {
      submitQuiz(); // Auto-submit when time runs out
    }
    return () => clearInterval(timer);
  }, [quizState, timeLeft]);

  const startQuiz = () => {
    setQuizState('active');
    setTimeLeft((settings.timeLimit || 10) * 60);
    setAnswers({});
    setScore(0);
  };

  // Scroll to top instantly without animation on tab/state change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [quizState]);

  const handleSelect = (qIndex, option) => {
    setAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const submitQuiz = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      // In dynamic quiz, correct answer is an exact string match since we updated the UI
      if (answers[idx] === q.answer) {
        correctCount += 1;
      }
    });
    const finalScore = Math.round((correctCount / Math.max(1, questions.length)) * 100);
    setScore(finalScore);
    setQuizState('finished');

    const token = localStorage.getItem('token');
    if (token && slug) {
       axios.post('http://localhost:5000/api/progress/quiz', {
          labSlug: slug,
          score: correctCount,
          total: questions.length,
          accuracy: finalScore
       }, { headers: { Authorization: `Bearer ${token}` } }).catch(err => console.error("Telemetry Sync Error:", err));
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!questions || questions.length === 0) {
     return <div className="text-center pt-10 text-gray-500 font-bold">No quiz questions currently drafted for this lab.</div>;
  }

  // --- RENDERING VIEWS ---

  if (quizState === 'intro') {
    return (
      <div className="animate-page-enter max-w-3xl mx-auto flex flex-col items-center justify-center text-center mt-8">
        <div className="bg-[#110b27] border border-white/10 p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden w-full">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#00e5ff]/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
           
           <div className="w-20 h-20 bg-linear-to-br from-purple-500 to-[#00e5ff] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#00e5ff]/30">
             <QuizIcon className="text-white" style={{ fontSize: 40 }} />
           </div>
           
           <h2 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">Knowledge Assessment</h2>
           <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">Validate your understanding of the concepts covered in this lab before concluding.</p>
           
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10 w-full">
             <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center">
               <span className="text-2xl font-bold text-[#00e5ff] mb-1">{questions.length}</span>
               <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Questions</span>
             </div>
             <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center">
               <span className="text-2xl font-bold text-purple-400 mb-1">{settings.timeLimit || 10}:00</span>
               <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Minutes</span>
             </div>
             <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center col-span-2 md:col-span-1">
               <span className="text-lg font-bold text-green-400 mb-1 leading-tight mt-1 truncate max-w-full px-2" title={category}>{category || 'General'}</span>
               <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Category</span>
             </div>
           </div>

           <button 
             onClick={startQuiz}
             className="w-full md:w-auto px-12 py-4 bg-linear-to-r from-purple-600 to-[#00e5ff] text-white font-bold text-lg rounded-full shadow-[0_0_30px_rgba(0,229,255,0.3)] hover:shadow-[0_0_40px_rgba(0,229,255,0.5)] hover:-translate-y-1 transition-all duration-300"
           >
             Start the Quiz
           </button>
        </div>
      </div>
    );
  }

  if (quizState === 'active') {
    return (
      <div className="animate-page-enter max-w-4xl mx-auto flex flex-col pt-4 relative">
        {/* Sticky Timer Header */}
        <div className="sticky top-20 z-50 bg-[#140d20]/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-8 flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
           <div className="flex items-center gap-4">
             <div className="bg-white/5 p-2 rounded-lg border border-white/10">
               <QuizIcon className="text-[#00e5ff]"/>
             </div>
             <div>
               <h3 className="font-bold text-white leading-tight">Test Your Knowledge</h3>
               <p className="text-xs text-gray-400">Answer all questions to proceed.</p>
             </div>
           </div>
           
           <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xl font-bold border transition-colors ${timeLeft <= 60 ? 'bg-red-500/20 text-red-500 border-red-500/50 animate-pulse' : 'bg-[#00e5ff]/10 text-[#00e5ff] border-[#00e5ff]/30'}`}>
             <TimerIcon />
             {formatTime(timeLeft)}
           </div>
        </div>

        {/* Questions Loop */}
        <div className="flex flex-col gap-8 pb-10">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
               <h4 className="text-xl font-bold text-white mb-6 pr-8 leading-relaxed">
                 <span className="text-[#00e5ff] mr-2">Q{qIndex + 1}.</span> {q.question || q.questionText}
               </h4>
               
               <div className="flex flex-col gap-3">
                 {q.options?.map((opt, optIndex) => {
                   const isSelected = answers[qIndex] === opt;
                   
                   let bgClass = "bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/5 text-gray-400";
                   let ringClass = "border-gray-500 bg-transparent";
                   let innerNode = null;
                   
                   if (isSelected) {
                        bgClass = "bg-[#00e5ff]/10 border-[#00e5ff]/50 shadow-[0_0_15px_rgba(0,229,255,0.1)] text-white font-medium";
                        ringClass = "border-[#00e5ff]";
                        innerNode = <div className="w-2.5 h-2.5 bg-[#00e5ff] rounded-full"></div>;
                   }

                   return (
                     <button
                       key={optIndex}
                       onClick={() => handleSelect(qIndex, opt)}
                       className={`flex items-center text-left gap-4 w-full p-4 rounded-xl border transition-all duration-200 ${bgClass}`}
                     >
                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${ringClass}`}>
                          {innerNode}
                       </div>
                       <span dangerouslySetInnerHTML={{ __html: opt }}></span>
                     </button>
                   );
                 })}
               </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pb-20">
           <button 
             onClick={submitQuiz}
             className="px-12 py-4 bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30 hover:-translate-y-1 shadow-[0_0_30px_rgba(34,197,94,0.2)] font-bold text-lg rounded-full transition-all duration-300 flex items-center gap-2"
           >
             <CheckCircleIcon /> Submit Answers
           </button>
        </div>
      </div>
    );
  }

  if (quizState === 'finished') {
    return (
      <div className="animate-page-enter max-w-3xl mx-auto flex flex-col items-center justify-center text-center mt-8 relative">
        <Confetti 
           width={typeof window !== 'undefined' ? window.innerWidth : 1000} 
           height={typeof window !== 'undefined' ? window.innerHeight : 1000} 
           recycle={false} 
           numberOfPieces={400}
           gravity={0.15}
        />
        
        <div className="bg-[#110b27] border border-white/10 p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full flex flex-col items-center">
           <h2 className="text-3xl font-bold text-white mb-2">Quiz Completed!</h2>
           <p className="text-gray-400 mb-10">Here is your final performance metric.</p>
           
           <div className="relative w-48 h-48 mb-10 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="90" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                <circle 
                  cx="96" cy="96" r="90" fill="transparent" 
                  stroke={score >= 70 ? "#00e5ff" : score >= 40 ? "#eab308" : "#ef4444"} 
                  strokeWidth="12" 
                  strokeDasharray="565.48" 
                  strokeDashoffset={565.48 - (565.48 * score) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="flex flex-col items-center">
                <span className="text-5xl font-black text-white">{score}</span>
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Out of 100</span>
              </div>
           </div>

           <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
              <button 
                onClick={startQuiz}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all"
              >
                Retake Quiz
              </button>
              <button 
                onClick={() => setQuizState('review')}
                className="px-8 py-3 bg-linear-to-r from-[#6c2bd9] to-[#00e5ff] text-white font-bold rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transition-all flex items-center justify-center gap-2"
              >
                <AnalyticsIcon /> Analyze Performance
              </button>
           </div>
        </div>
      </div>
    );
  }

  if (quizState === 'review') {
    return (
      <div className="animate-page-enter max-w-4xl mx-auto flex flex-col pt-4 relative pb-20">
        
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
           <div>
             <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">Performance Analysis</h2>
             <p className="text-gray-400 mt-1">Review your selections and learn from the correct logical explanations.</p>
           </div>
           
           <div className="bg-[#110b27] border border-white/10 rounded-full w-20 h-20 flex items-center justify-center flex-col shadow-inner shrink-0">
             <span className="text-2xl font-black text-white leading-none">{score}</span>
             <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Score</span>
           </div>
        </div>

        <div className="flex flex-col gap-8">
          {questions.map((q, qIndex) => {
            const userAns = answers[qIndex];
            const isCorrect = userAns === q.answer;

            return (
              <div key={qIndex} className={`bg-white/5 border rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all ${isCorrect ? 'border-green-500/30' : 'border-red-500/30'}`}>
                 
                 <div className="absolute top-6 right-6 flex items-center">
                    {isCorrect ? (
                      <span className="bg-green-500/20 text-green-400 border border-green-500/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1"><CheckCircleIcon fontSize="small"/> Correct</span>
                    ) : (
                      <span className="bg-red-500/20 text-red-500 border border-red-500/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1"><CancelIcon fontSize="small"/> Incorrect</span>
                    )}
                 </div>

                 <h4 className="text-xl font-bold text-white mb-6 pr-32 leading-relaxed">
                   <span className="text-gray-500 mr-2">Q{qIndex + 1}.</span> {q.question || q.questionText}
                 </h4>
                 
                 <div className="flex flex-col gap-2 mb-6">
                   {q.options?.map((opt, optIndex) => {
                     const isThisCorrect = opt === q.answer;
                     const isThisSelected = userAns === opt;
                     
                     let bgClass = "bg-black/40 border-white/5";
                     let textClass = "text-gray-500";
                     let icon = null;

                     if (isThisCorrect) {
                        bgClass = "bg-green-500/10 border-green-500/50";
                        textClass = "text-green-400 font-bold";
                        icon = <CheckCircleIcon className="text-green-500"/>;
                     } else if (isThisSelected && !isThisCorrect) {
                        bgClass = "bg-red-500/10 border-red-500/50";
                        textClass = "text-red-500 font-bold";
                        icon = <CancelIcon className="text-red-500"/>;
                     }

                     return (
                       <div key={optIndex} className={`flex items-center justify-between text-left gap-4 w-full p-4 rounded-xl border ${bgClass}`}>
                         <span className={textClass} dangerouslySetInnerHTML={{ __html: opt }}></span>
                         {icon && <span>{icon}</span>}
                       </div>
                     );
                   })}
                 </div>

                 {/* Explanation Box */}
                 {q.explanation && (
                    <div className="bg-[#110b27] border border-white/5 p-5 rounded-xl border-l-4 border-l-[#00e5ff] shadow-inner mt-4">
                      <p className="text-xs text-[#00e5ff] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                        <AnalyticsIcon fontSize="small"/> Concept Explanation
                      </p>
                      <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">{q.explanation}</p>
                    </div>
                 )}
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-center mt-10">
           <button 
             onClick={startQuiz}
             className="px-10 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all flex items-center gap-2"
           >
             <RestartAltIcon /> Retake Assessment
           </button>
        </div>

      </div>
    );
  }

  return null;
}
