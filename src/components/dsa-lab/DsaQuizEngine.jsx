import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ReplayIcon from '@mui/icons-material/Replay';

export default function DsaQuizEngine({ quizData, topicTitle }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleSelectOption = (qIdx, optIdx) => {
    if (submitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [qIdx]: optIdx
    });
  };

  const handleSubmit = (e) => {
    if (submitted || Object.keys(selectedAnswers).length < quizData.length) return;
    
    let currentScore = 0;
    quizData.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        currentScore++;
      }
    });

    setScore(currentScore);
    setSubmitted(true);
    setShowResults(true);

    // Canvas confetti trigger for scoring high or 100%
    if (currentScore === quizData.length) {
      const rect = e.target.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { x, y: y - 0.1 },
        colors: ['#00e5ff', '#6c2bd9', '#34d399', '#f43f5e'],
        zIndex: 200
      });
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
    setShowResults(false);
  };

  const isAllAnswered = Object.keys(selectedAnswers).length === quizData.length;

  return (
    <div className="animate-page-enter max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">
        Test Your Knowledge
      </h2>
      <p className="text-gray-400 mb-8 text-sm uppercase tracking-widest font-black">
        {topicTitle} Assessment
      </p>

      {showResults && (
        <div className="bg-black/40 border border-[var(--glass-border)] rounded-3xl p-8 text-center mb-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none"></div>
          
          <h3 className="text-2xl font-bold text-white mb-2">Quiz Results</h3>
          <div className="text-5xl font-black mb-4">
            <span className={score === quizData.length ? "text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]" : "text-[#00e5ff]"}>
              {score}
            </span>
            <span className="text-gray-500 text-3xl"> / {quizData.length}</span>
          </div>
          <p className="text-gray-300 max-w-md mx-auto mb-6 text-sm">
            {score === quizData.length 
              ? "🏆 Perfect score! You have completely mastered this topic's conceptual frameworks."
              : "Keep studying! Review the theoretical notes and try again to secure a perfect score."}
          </p>
          <button 
            onClick={handleReset}
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-[var(--glass-border)] rounded-xl font-bold text-xs uppercase tracking-widest transition-all inline-flex items-center gap-2"
          >
            <ReplayIcon fontSize="small"/> Retake Quiz
          </button>
        </div>
      )}

      <div className="space-y-6">
        {quizData.map((item, qIdx) => {
          const isSelected = selectedAnswers[qIdx] !== undefined;
          return (
            <div 
              key={qIdx} 
              className={`border rounded-2xl p-6 transition-all duration-300 ${
                submitted 
                  ? selectedAnswers[qIdx] === item.answer 
                    ? 'border-emerald-500/30 bg-emerald-500/5' 
                    : 'border-red-500/30 bg-red-500/5'
                  : 'border-[var(--glass-border)] bg-[var(--panel-bg-strong)]/40 hover:border-purple-500/30 shadow-lg'
              }`}
            >
              <h4 className="text-white font-bold text-base mb-4 flex items-start gap-3">
                <span className="bg-white/10 text-[#00e5ff] w-7 h-7 rounded-full flex items-center justify-center shrink-0 border border-white/10 text-sm font-black">
                  {qIdx + 1}
                </span>
                <span className="pt-0.5 leading-relaxed">{item.question}</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {item.options.map((opt, optIdx) => {
                  const isOptSelected = selectedAnswers[qIdx] === optIdx;
                  const isCorrectAnswer = item.answer === optIdx;
                  
                  let optStyle = 'bg-black/30 border-white/5 text-gray-300 hover:bg-white/5 hover:border-white/20';
                  
                  if (isOptSelected) {
                    optStyle = 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]';
                  }

                  if (submitted) {
                    if (isCorrectAnswer) {
                      optStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                    } else if (isOptSelected) {
                      optStyle = 'bg-red-500/20 border-red-500 text-red-300';
                    } else {
                      optStyle = 'bg-black/20 border-white/5 text-gray-500 opacity-60 pointer-events-none';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={submitted}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      className={`w-full text-left p-4 rounded-xl border text-sm transition-all duration-200 flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {submitted && isCorrectAnswer && <CheckCircleIcon fontSize="small" className="text-emerald-400" />}
                      {submitted && isOptSelected && !isCorrectAnswer && <CancelIcon fontSize="small" className="text-red-400" />}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-300 flex items-start gap-2.5 animate-page-enter">
                  <HelpOutlineIcon fontSize="small" className="text-purple-400 shrink-0 mt-0.5"/>
                  <div>
                    <span className="font-bold text-white uppercase tracking-widest text-[10px] block mb-1">Explanation</span>
                    <p className="leading-relaxed">{item.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!isAllAnswered}
          className={`w-full mt-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center ${
            isAllAnswered 
              ? 'bg-linear-to-r from-purple-600 to-[#00e5ff] text-white shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_35px_rgba(0,229,255,0.5)] active:scale-[0.99] cursor-pointer' 
              : 'bg-white/5 text-gray-500 border border-[var(--glass-border)] cursor-not-allowed'
          }`}
        >
          {isAllAnswered ? 'Submit Answers' : 'Select answers for all questions to submit'}
        </button>
      )}
    </div>
  );
}
