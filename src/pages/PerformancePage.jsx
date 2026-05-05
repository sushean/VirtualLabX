import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { useTheme } from '../context/ThemeContext';

export default function PerformancePage() {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState('');
  const [activeTooltip, setActiveTooltip] = useState(null);
  const { isLight } = useTheme();
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

  if (loading) return <div className="pt-32 text-center h-screen bg-[var(--background-start)]">Compiling deep analytics...</div>;
  if (!performance) return <div className="pt-32 text-center text-red-500 h-screen bg-[var(--background-start)] font-mono whitespace-pre-wrap"><p className="text-xl font-bold mb-4">Analytics Engine Offline</p><p>Reason: {errorDetails}</p></div>;

  const isLocked = performance.status === "INSUFFICIENT_DATA";

  // Mock Radar Data if topicStats is empty
  const defaultRadarData = [
    { subject: 'Algorithms', A: 80, fullMark: 100 },
    { subject: 'Data Structures', A: 90, fullMark: 100 },
    { subject: 'System Design', A: 45, fullMark: 100 },
    { subject: 'Networking', A: 60, fullMark: 100 },
    { subject: 'Databases', A: 75, fullMark: 100 },
  ];

  const radarData = performance.subDimensions && !isLocked
    ? [
        { subject: 'Conceptual', A: performance.subDimensions.conceptualUnderstanding, fullMark: 100 },
        { subject: 'Problem Solving', A: performance.subDimensions.problemSolving, fullMark: 100 },
        { subject: 'Consistency', A: performance.subDimensions.consistency, fullMark: 100 },
        { subject: 'Retention', A: performance.subDimensions.retention, fullMark: 100 },
        { subject: 'Speed', A: performance.subDimensions.speed, fullMark: 100 },
      ]
    : defaultRadarData;

  // Mock Timeline Data
  const timelineData = performance.topicStats?.[0]?.trend?.map((t, idx) => ({ name: `T${idx+1}`, score: t.score })) 
    || [{name:'W1', score:40}, {name:'W2', score:35}, {name:'W3', score:50}, {name:'W4', score:55}, {name:'W5', score:75}, {name:'W6', score:70}, {name:'W7', score:90}];

  return (
    <div className="min-h-screen bg-[var(--background-start)] pt-24 pb-16 px-6 relative overflow-hidden animate-page-enter">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-125 h-125 bg-[#6c2bd9]/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-125 h-125 bg-[var(--accent-cyan)]/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header HUD */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-[var(--glass-border)] pb-6">
           <div>
             <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-linear-to-r from-purple-500 to-[var(--accent-cyan)]">
               Adaptive Intelligence Dashboard
             </h1>
             <p className="text-[var(--muted-text)] text-lg font-medium">Evidence-based learning analytics and real-time mentor insights.</p>
           </div>
           {performance.userMeta && (
             <div className="mt-4 md:mt-0 text-right">
                <p className="text-xl font-bold">{performance.userMeta.name}</p>
                <div className="flex gap-4 text-sm text-[var(--muted-text)] mt-2">
                   <span className="bg-[var(--glass-bg)] border border-[var(--glass-border)] px-4 py-1.5 rounded-full shadow-sm"><span className="text-purple-500 font-black">{performance.userMeta.overallProgress.labCompletions}/{performance.userMeta.overallProgress.totalPlatformLabs || performance.userMeta.overallProgress.totalLabsAttempted}</span> Labs Executed</span>
                   <span className="bg-[var(--glass-bg)] border border-[var(--glass-border)] px-4 py-1.5 rounded-full shadow-sm"><span className="text-[var(--accent-cyan)] font-black">{performance.userMeta.overallProgress.avgQuizAccuracy}%</span> Z-Score Accuracy</span>
                </div>
             </div>
           )}
        </div>

        <div className="relative">
          {/* Locked Overlay */}
          {isLocked && (
            <div className="absolute inset-0 z-50 flex items-center justify-center">
              <div className="bg-[var(--panel-bg-strong)]/90 backdrop-blur-2xl border border-purple-500/30 p-10 rounded-3xl shadow-[0_0_50px_rgba(108,43,217,0.3)] max-w-xl text-center flex flex-col items-center">
                 <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl">🔒</span>
                 </div>
                 <h2 className="text-2xl font-black mb-3">Intelligence Locked</h2>
                 <p className="text-[var(--page-text)] text-sm mb-8 leading-relaxed font-medium">
                   {performance.message}
                 </p>
                 <div className="w-full bg-black/40 border border-[var(--glass-border)] rounded-full p-2 flex items-center">
                    <div className="flex-1 bg-[var(--glass-bg)] h-4 rounded-full overflow-hidden mx-3 relative">
                       <div className="absolute top-0 left-0 h-full bg-purple-500 transition-all duration-1000" style={{ width: `${((5 - performance.labsRemaining) / 5) * 100}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-purple-400 pr-3 whitespace-nowrap">{5 - performance.labsRemaining} / 5 Labs</span>
                 </div>
              </div>
            </div>
          )}

          <div className={`transition-all duration-500 ${isLocked ? 'blur-md opacity-40 pointer-events-none select-none' : ''}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Skill Radar Graph */}
          <div className="glass-card p-6 flex flex-col items-center shadow-lg hover:shadow-[0_0_30px_rgba(108,43,217,0.15)] transition-all">
             <h2 className="text-xl font-bold mb-2 self-start w-full border-b border-[var(--glass-border)] pb-4 flex items-center gap-2">
               <span className="text-purple-500">🕸️</span> Skill Radar
             </h2>
             <div className="w-full h-72">
               <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                   <PolarGrid stroke="var(--glass-border)" />
                   <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-text)', fontSize: 12 }} />
                   <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                   <Radar name="Mastery" dataKey="A" stroke="var(--accent-cyan)" fill="var(--accent-cyan)" fillOpacity={0.4} />
                 </RadarChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Detailed Evidence Mentor Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[var(--panel-bg-strong)] border border-[var(--accent-cyan)]/30 p-8 rounded-2xl shadow-[0_0_20px_rgba(0,229,255,0.1)] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-cyan)]/10 rounded-bl-full pointer-events-none"></div>
               <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] flex items-center justify-center text-sm">AI</span> 
                  Evidence-Based Insight
               </h2>
               <p className="text-[var(--page-text)] text-lg leading-relaxed font-medium mb-6">{performance.summary}</p>
               
               {/* Evidence Factors */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-500/5 border border-green-500/20 p-5 rounded-xl">
                    <h3 className="text-green-500 font-bold uppercase tracking-widest text-xs mb-3">Validated Strengths</h3>
                    <ul className="space-y-2">
                      {performance.strengths?.map((s, i) => <li key={i} className="text-sm font-medium text-[var(--muted-text)] flex gap-2"><span className="text-green-500">↑</span> {s}</li>)}
                    </ul>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-xl">
                    <h3 className="text-red-500 font-bold uppercase tracking-widest text-xs mb-3">Identified Risk Factors</h3>
                    <ul className="space-y-2">
                      {performance.riskFactors?.length > 0 ? performance.riskFactors.map((r, i) => <li key={i} className="text-sm font-medium text-[var(--muted-text)] flex gap-2"><span className="text-red-500">⚠</span> {r}</li>) : 
                      performance.weaknesses?.map((w, i) => <li key={i} className="text-sm font-medium text-[var(--muted-text)] flex gap-2"><span className="text-red-500">↓</span> {w}</li>)}
                    </ul>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Exam Readiness & Confidence Visualization */}
          <div className="lg:col-span-2 glass-card p-8">
             <h2 className="text-2xl font-bold mb-6 border-b border-[var(--glass-border)] pb-4 flex items-center gap-2">
               <span className="text-yellow-500">⚡</span> Readiness Predictions
             </h2>
             <div className="space-y-8">
                {performance.examReadiness?.map((exam, idx) => (
                   <div key={idx} className="flex flex-col gap-3">
                      <div className="flex justify-between items-end">
                         <div>
                           <div className="flex items-center gap-3">
                             <h3 className="font-bold text-lg">{exam.examName}</h3>
                             <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${exam.reliability === 'HIGH' ? 'bg-green-500/20 text-green-500 border border-green-500/30' : exam.reliability === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}>
                               {exam.reliability || 'LOW'} RELIABILITY
                             </span>
                             <button onClick={() => setActiveTooltip(activeTooltip === exam.examName ? null : exam.examName)} className="w-6 h-6 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-xs text-[var(--muted-text)] hover:text-[var(--page-text)] transition-colors shadow-lg hover:bg-[var(--panel-bg-strong)]">ⓘ</button>
                           </div>
                           <p className="text-xs text-[var(--muted-text)] mt-1">
                             Confidence Score: <span className="font-mono text-[var(--page-text)] bg-[var(--glass-bg)] px-2 py-0.5 rounded border border-[var(--glass-border)]">{((exam.confidence || 0) * 100).toFixed(1)}%</span>
                           </p>
                         </div>
                         <div className="text-right">
                           <span className={`text-2xl font-black ${exam.prediction > 75 ? 'text-green-500' : exam.prediction > 50 ? 'text-yellow-500' : 'text-red-500'}`}>{exam.prediction}%</span>
                         </div>
                      </div>
                      
                      {/* Prediction Bar */}
                      <div className="relative w-full h-3 bg-[var(--panel-bg-strong)] rounded-full overflow-hidden border border-[var(--glass-border)]">
                         <div 
                            className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${exam.prediction > 75 ? 'bg-green-500' : exam.prediction > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.max(5, exam.prediction)}%`, opacity: exam.confidence || 1 }}
                         ></div>
                         {/* Uncertainty Pattern Overlay if confidence is low */}
                         {exam.confidence < 0.6 && (
                            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.1) 5px, rgba(255,255,255,0.1) 10px)' }}></div>
                         )}
                      </div>

                      {/* XAI Tooltip Overlay */}
                      {activeTooltip === exam.examName && (
                         <div className="mt-4 p-5 rounded-xl bg-black/40 backdrop-blur-xl border border-purple-500/30 animate-fade-in relative z-10 overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full pointer-events-none"></div>
                            
                            <div className="flex justify-between items-center mb-4">
                               <h4 className="text-sm font-bold uppercase tracking-widest text-purple-400 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span> Telemetry Trace</h4>
                               <div className="text-[10px] bg-black/30 px-2 py-1 rounded text-[var(--muted-text)] border border-[var(--glass-border)]">Coverage: {exam.evidenceCoverage}%</div>
                            </div>

                            <div className="space-y-4">
                               <div>
                                  <p className="text-xs font-bold text-green-500 mb-2">Positive Signals</p>
                                  {exam.positiveSignals?.map((sig, i) => (
                                     <div key={i} className="mb-2 text-xs flex justify-between bg-green-500/5 p-2 rounded border border-green-500/10">
                                        <div><span className="font-bold">{sig.factor}</span><br/><span className="text-[var(--muted-text)]">{sig.evidence}</span></div>
                                        <span className="text-green-500 font-bold whitespace-nowrap">{sig.impact}</span>
                                     </div>
                                  ))}
                               </div>
                               <div>
                                  <p className="text-xs font-bold text-red-500 mb-2">Risk Factors</p>
                                  {exam.negativeSignals?.map((sig, i) => (
                                     <div key={i} className="mb-2 text-xs flex justify-between bg-red-500/5 p-2 rounded border border-red-500/10">
                                        <div><span className="font-bold">{sig.factor}</span><br/><span className="text-[var(--muted-text)]">{sig.evidence}</span></div>
                                        <span className="text-red-500 font-bold whitespace-nowrap">{sig.impact}</span>
                                     </div>
                                  ))}
                               </div>
                            </div>
                            
                            {exam.improvementSuggestions && exam.improvementSuggestions.length > 0 && (
                               <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
                                  <p className="text-xs font-bold mb-2">Simulation Roadmap</p>
                                  {exam.improvementSuggestions.map((sug, i) => (
                                     <div key={i} className="text-xs flex gap-2 items-center bg-[var(--glass-bg)] p-2 rounded mb-1 border border-[var(--glass-border)]">
                                        <span className="text-yellow-500">→</span> <span className="flex-1">{sug.action}</span>
                                        <span className="text-[var(--accent-cyan)] font-black">{sug.estimatedImpact}</span>
                                     </div>
                                  ))}
                               </div>
                            )}
                         </div>
                      )}
                   </div>
                ))}
             </div>
          </div>

          {/* Learning Timeline Area Chart */}
          <div className="glass-card p-6 flex flex-col">
             <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-4 flex items-center gap-2">
               <span className="text-blue-500">📈</span> Velocity Trend
             </h2>
             <div className="flex-1 w-full min-h-[200px]">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0.1}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="name" stroke="var(--glass-border)" tick={{fill: 'var(--muted-text)', fontSize: 12}} />
                   <Tooltip 
                     contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--glass-border)', borderRadius: '8px' }} 
                     itemStyle={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}
                   />
                   <Area 
                     type="monotone" 
                     dataKey="score" 
                     stroke="var(--accent-cyan)" 
                     strokeWidth={3}
                     fillOpacity={1} 
                     fill="url(#colorScore)" 
                     activeDot={{ r: 8, fill: 'var(--accent-cyan)', stroke: '#fff', strokeWidth: 2 }}
                     dot={{ r: 4, fill: 'var(--panel-bg)', stroke: 'var(--accent-cyan)', strokeWidth: 2 }}
                   />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
             
             {/* Adaptive Action Plan */}
             {performance.examReadiness?.[0]?.improvementSuggestions?.length > 0 && (
                <div className="mt-6 pt-4 border-t border-[var(--glass-border)]">
                   <h3 className="font-bold text-sm uppercase tracking-widest mb-3">Adaptive Action Plan</h3>
                   <div className="space-y-3">
                     {performance.examReadiness[0].improvementSuggestions.map((item, idx) => (
                       <div key={idx} className="flex gap-3 items-center bg-[var(--button-neutral-bg)] p-3 rounded-lg border border-[var(--glass-border)]">
                          <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center font-bold shrink-0 text-xs">{idx+1}</div>
                          <p className="text-[var(--page-text)] text-xs font-medium leading-tight flex-1">{item.action}</p>
                          <span className="text-[var(--accent-cyan)] font-black text-xs">{item.estimatedImpact}</span>
                       </div>
                     ))}
                   </div>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
