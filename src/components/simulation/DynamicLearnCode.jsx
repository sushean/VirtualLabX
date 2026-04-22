import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function DynamicLearnCode({ data }) {
  const { slug } = useParams();
  const [mode, setMode] = useState('learn');
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [synced, setSynced] = useState(false);

  const items = (data?.items?.length > 0) ? data.items : (data?.learnContent || []);
  const tests = (data?.tests?.length > 0) ? data.tests : (data?.testContent || []);
  
  useEffect(() => {
     if(tests.length > 0 && !synced) {
        const correctCount = tests.filter(t => feedback[t.inputKey] === 'correct').length;
        if(correctCount === tests.length && tests.length > 0) {
            setSynced(true);
            const token = localStorage.getItem('token');
            if (token && slug) {
               axios.post('http://localhost:5000/api/progress/code', {
                  labSlug: slug,
                  successRate: 100
               }, { headers: { Authorization: `Bearer ${token}` } }).catch(err => console.error(err));
            }
        }
     }
  }, [feedback, tests, synced, slug]);

  const checkAnswer = (qKey, expected, e) => {
    const val = answers[qKey] || '';
    if (val.trim().toLowerCase() === expected.toLowerCase()) {
      setFeedback({ ...feedback, [qKey]: 'correct' });
      if (e && e.target) {
        const rect = e.target.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        confetti({ particleCount: 60, spread: 70, origin: { x, y }, disableForReducedMotion: true, zIndex: 100 });
      }
    } else {
      setFeedback({ ...feedback, [qKey]: 'incorrect' });
    }
  };

  const revealAnswer = (qKey, expected) => {
    setAnswers({ ...answers, [qKey]: expected });
    setFeedback({ ...feedback, [qKey]: 'correct' });
  };

  const renderTestQuestion = (test, index) => {
    const { qNum, title, preCode, inputKey, postCode, expectedAnswer } = test;
    const isFilled = (answers[inputKey] || '').trim().length > 0;
    const isCorrect = feedback[inputKey] === 'correct';
    const isIncorrect = feedback[inputKey] === 'incorrect';

    return (
      <div key={inputKey} className="bg-[#110b27] border border-white/10 rounded-2xl p-6 mb-6 shadow-lg leading-relaxed">
        <h4 className="text-[#00e5ff] font-bold text-lg mb-4 flex items-center gap-2">
          <span className="bg-[#00e5ff]/10 text-[#00e5ff] w-8 h-8 rounded-full flex items-center justify-center border border-[#00e5ff]/30">Q{qNum || index + 1}</span>
          {title}
        </h4>
        <div className="bg-black/50 p-4 rounded-xl font-mono text-gray-300 border border-white/5 text-sm leading-8 mb-4 whitespace-pre-wrap">
           <span>{preCode}</span>
           <span className="relative inline-block mx-1">
             <input 
               type="text" 
               value={answers[inputKey] || ''}
               onChange={(e) => {
                 setAnswers({...answers, [inputKey]: e.target.value});
                 setFeedback({...feedback, [inputKey]: null});
               }}
               className={`bg-transparent border-b-2 outline-none text-center font-bold px-2 py-1 w-36 transition-colors border-[#00e5ff] text-white focus:border-purple-400`}
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
      <div className="flex bg-[#110b27] border border-white/10 p-1 rounded-xl mb-10 mx-auto w-fit shadow-lg shadow-purple-500/10">
        <button onClick={() => setMode('learn')} className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 ${mode === 'learn' ? 'bg-linear-to-r from-purple-500 to-[#00e5ff] text-white shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'text-gray-400 hover:text-white'}`}>LEARN MODE</button>
        <button onClick={() => setMode('test')} className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 ${mode === 'test' ? 'bg-linear-to-r from-purple-500 to-[#00e5ff] text-white shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'text-gray-400 hover:text-white'}`}>TEST MODE</button>
      </div>

      {mode === 'learn' && (
        <div className="space-y-8 animate-page-enter">
          {items.map((item, idx) => (
             <div key={idx} className="bg-[#110b27] border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_0_20px_rgba(108,43,217,0.2)] transition-shadow">
                <div className="bg-white/5 p-4 border-b border-white/10">
                   <h3 className="text-xl font-bold text-white flex items-center gap-3"><span className="w-2 h-6 bg-purple-500 rounded-full"></span>{item.step}</h3>
                </div>
                <div className="p-6 md:p-8 flex flex-col xl:flex-row gap-8">
                   <div className="flex-1 bg-black/60 rounded-xl p-4 border border-white/5 font-mono text-sm overflow-x-auto shadow-inner">
                      <pre className="text-green-400/80">
                        {item.code.split('\n').map((line, i) => (
                          <div key={i}><span className="text-gray-600 mr-4 select-none">{String(i+1).padStart(2, '0')}</span><span className="text-gray-300">{line}</span></div>
                        ))}
                      </pre>
                   </div>
                   <div className="flex-1 space-y-4">
                      <div className="bg-purple-900/10 border border-purple-500/20 p-4 rounded-xl">
                        <h4 className="text-purple-300 font-bold uppercase tracking-widest text-xs mb-3">Explanation</h4>
                        <ul className="text-gray-300 space-y-2 text-sm leading-relaxed">
                           {item.explanation.split('\n').map((line, i) => {
                             const firstColon = line.indexOf(':');
                             if(firstColon !== -1) {
                               const term = line.substring(0, firstColon).trim();
                               const rest = line.substring(firstColon + 1).trim();
                               return <li key={i}><strong className="text-white">{term}:</strong> <span className="text-gray-400">{rest}</span></li>;
                             }
                             return <li key={i}>{line}</li>;
                           })}
                        </ul>
                      </div>
                      <div className="bg-[#00e5ff]/5 border border-[#00e5ff]/20 p-4 rounded-xl flex items-start gap-3">
                        <span className="text-[#00e5ff] font-bold text-sm uppercase tracking-widest mt-0.5">Summary: </span>
                        <p className="text-[#00e5ff]/90 text-sm font-semibold">{item.summary}</p>
                      </div>
                   </div>
                </div>
             </div>
          ))}
          {items.length === 0 && <p className="text-gray-500 text-center">No code blocks defined for this lab yet.</p>}
        </div>
      )}

      {mode === 'test' && (
        <div className="animate-page-enter">
          <p className="text-gray-300 text-center mb-8 text-lg bg-white/5 py-4 rounded-xl border border-white/10">Fill in the blanks to complete the code snippets correctly.</p>
          <div className="max-w-3xl mx-auto">
            {tests.map((test, i) => renderTestQuestion(test, i))}
            {tests.length === 0 && <p className="text-gray-500 text-center">No interactive tests defined.</p>}
          </div>
          {tests.length > 0 && Object.values(feedback).filter(status => status === 'correct').length === tests.length && (
             <div className="mt-10 p-8 rounded-2xl bg-green-500/10 border border-green-500/30 text-center animate-page-enter shadow-[0_0_30px_rgba(34,197,94,0.2)]">
               <h3 className="text-2xl font-bold text-green-400 mb-2">Excellent Work!</h3>
               <p className="text-gray-300">You have successfully completed the code test.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
