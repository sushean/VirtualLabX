import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PerformancePage() {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadPerformance = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/progress/performance', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPerformance(res.data);
      } catch (err) {
        console.error(err);
        setErrorDetails(err?.response?.data?.error || err?.response?.data?.msg || err.message || 'Unknown Network Error');
      } finally {
        setLoading(false);
      }
    };
    if (token) loadPerformance();
  }, [token]);

  if (loading) return <div className="pt-32 text-center text-white h-screen bg-[#05010a]">Crunching Student Metrics...</div>;
  if (!performance) return <div className="pt-32 text-center text-red-500 h-screen bg-[#05010a] font-mono whitespace-pre-wrap"><p className="text-xl font-bold mb-4">Error loading AI Mentor</p><p>Reason: {errorDetails}</p></div>;

  return (
    <div className="min-h-screen bg-[#05010a] text-white pt-24 pb-16 px-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-125 h-125 bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-125 h-125 bg-[#00e5ff]/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-white/10 pb-6">
           <div>
             <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-[#00e5ff]">
               AI Performance Mentor
             </h1>
             <p className="text-gray-400 text-lg">Your personalized automated academic profile evaluation.</p>
           </div>
           {performance.userMeta && (
             <div className="mt-4 md:mt-0 text-right">
                <p className="text-xl font-bold text-white">{performance.userMeta.name}</p>
                <div className="flex gap-4 text-sm text-gray-400 mt-1">
                   <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full"><span className="text-purple-400 font-bold">{performance.userMeta.overallProgress.labCompletions}/{performance.userMeta.overallProgress.totalLabsAttempted}</span> Labs Completed</span>
                   <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full"><span className="text-[#00e5ff] font-bold">{performance.userMeta.overallProgress.avgQuizAccuracy}%</span> Avg Accuracy</span>
                </div>
             </div>
           )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Scoring HUD */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><span className="text-2xl">⚡</span> Exam Probabilities</h2>
              <div className="space-y-4 mb-4">
                 {performance.examReadiness?.map((exam, idx) => (
                    <div key={idx} className="flex flex-col gap-2 relative">
                       <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-gray-300 truncate pr-4">{exam.examName}</span>
                          <span className={exam.probability > 75 ? 'text-green-400' : exam.probability > 50 ? 'text-yellow-400' : 'text-red-400'}>{exam.probability}%</span>
                       </div>
                       <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/5">
                          <div 
                             className={`h-full transition-all duration-1000 ease-out rounded-full ${exam.probability > 75 ? 'bg-green-500' : exam.probability > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                             style={{ width: `${Math.max(5, exam.probability)}%`, boxShadow: `0 0 10px ${exam.probability > 75 ? '#22c55e' : exam.probability > 50 ? '#eab308' : '#ef4444'}` }}
                          ></div>
                       </div>
                    </div>
                 ))}
                 {(!performance.examReadiness || performance.examReadiness.length === 0) && (
                    <p className="text-center text-sm text-gray-400 py-4">No exam targets generated yet.</p>
                 )}
              </div>
              <p className="text-center text-[11px] uppercase tracking-widest text-gray-500 font-bold border-t border-white/10 pt-4">Calculated via individualized neural pipeline.</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">🎯 Suggested Paths</h2>
              {performance.suggestedCertifications?.length > 0 ? (
                 <ul className="space-y-3">
                   {performance.suggestedCertifications.map((cert, idx) => (
                     <li key={idx} className="bg-purple-500/10 border border-purple-500/30 text-purple-300 p-3 rounded-lg text-sm font-bold flex items-center gap-3">
                       <span className="text-lg">🏆</span> {cert}
                     </li>
                   ))}
                 </ul>
              ) : (
                 <p className="text-gray-400 text-sm">Keep training to unlock AI path suggestions.</p>
              )}
            </div>
          </div>

          {/* Detailed Mentor Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-indigo-500/30 p-8 rounded-2xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-center">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full pointer-events-none"></div>
               <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><span className="text-indigo-400">🤖</span> Executive AI Summary</h2>
               {performance.userMeta && performance.userMeta.overallProgress.totalLabsAttempted === 0 ? (
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                     <p className="text-red-400 text-sm font-bold flex items-center gap-2 mb-1"><span>⚠️</span> Neural Engine Bypassed</p>
                     <p className="text-gray-300 text-sm leading-relaxed">You currently have 0 mapped laboratory progress. To protect token bandwidth and provide accurate analytics, the OpenAI engine will remain disconnected until you successfully attempt your first lab sequence. Until then, platform defaults are shown.</p>
                  </div>
               ) : (
                  <p className="text-gray-300 text-lg leading-relaxed font-light">{performance.summary}</p>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-green-500/5 border border-green-500/20 p-6 rounded-2xl">
                 <h2 className="font-bold text-green-400 mb-4 uppercase tracking-widest text-sm flex items-center gap-2">💪 Core Strengths</h2>
                 {performance.strengths && performance.strengths.length > 0 ? (
                   <ul className="space-y-3">
                     {performance.strengths.map((item, idx) => (
                       <li key={idx} className="flex gap-3 text-gray-300 text-sm items-start">
                          <span className="text-green-400 font-bold">✓</span> <span className="pt-0.5">{item}</span>
                       </li>
                     ))}
                   </ul>
                 ) : (
                   <p className="text-gray-400 text-sm italic">Keep pushing and completing labs to map out your core theoretical strengths!</p>
                 )}
               </div>
               
               <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl">
                 <h2 className="font-bold text-red-400 mb-4 uppercase tracking-widest text-sm flex items-center gap-2">⚠️ Weaknesses</h2>
                 <ul className="space-y-3">
                   {performance.weaknesses?.map((item, idx) => (
                     <li key={idx} className="flex gap-3 text-gray-300 text-sm items-start">
                        <span className="text-red-400 font-bold">✗</span> <span className="pt-0.5">{item}</span>
                     </li>
                   ))}
                 </ul>
               </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
               <h2 className="font-bold mb-4 uppercase tracking-widest text-sm flex items-center gap-2">📋 Recommended Actions</h2>
               <div className="space-y-4">
                 {performance.recommendations?.map((item, idx) => (
                   <div key={idx} className="flex gap-4 items-center bg-black/40 p-4 rounded-xl border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-[#00e5ff]/20 text-[#00e5ff] flex items-center justify-center font-bold shrink-0">{idx+1}</div>
                      <p className="text-gray-300 text-sm">{item}</p>
                   </div>
                 ))}
               </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
