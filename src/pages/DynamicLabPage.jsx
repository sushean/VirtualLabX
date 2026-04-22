import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WaveFooter from '../components/WaveFooter';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import QuizIcon from '@mui/icons-material/Quiz';
import GroupsIcon from '@mui/icons-material/Groups';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FeedbackIcon from '@mui/icons-material/Feedback';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CodeIcon from '@mui/icons-material/Code';
import SimulationRenderer from '../components/simulation/SimulationRenderer';
import DynamicLearnCode from '../components/simulation/DynamicLearnCode';
import DynamicQuiz from '../components/simulation/DynamicQuiz';

const GenericFeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  if (submitted) {
    return (
      <div className="animate-page-enter max-w-2xl mx-auto bg-green-500/10 border border-green-500/50 p-10 rounded-2xl text-center shadow-[0_0_30px_rgba(34,197,94,0.2)]">
        <h3 className="text-3xl font-bold text-green-400 mb-4">Feedback Received!</h3>
        <p className="text-gray-300 text-lg">Thank you for helping us improve this Virtual Lab. Your response has been securely logged.</p>
      </div>
    );
  }

  return (
    <div className="animate-page-enter max-w-3xl mx-auto">
      <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#00e5ff]">Experiment Feedback</h2>
      <div className="bg-[#110b27]/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl relative">
         <p className="text-gray-300 text-lg mb-8 text-center font-bold">How would you rate your experience with this simulation module?</p>
         <div className="flex gap-2 mb-10 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
               <button 
                 key={star} onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(rating)}
                 className={`text-6xl transition-all ${star <= (hover || rating) ? 'text-yellow-400 scale-110 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'text-gray-600 hover:text-gray-500'}`}
               >★</button>
            ))}
         </div>
         <div className="flex flex-col gap-4">
            <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#00e5ff]/50 h-32 resize-none" placeholder="Let us know what you think..." />
         </div>
         <button disabled={rating === 0} onClick={() => setSubmitted(true)} className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all ${rating === 0 ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-[#00e5ff] text-white hover:-translate-y-1'}`}>Submit Feedback</button>
      </div>
    </div>
  );
};

export default function DynamicLabPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Introduction');
  const [expandedTopic, setExpandedTopic] = useState(null);

  useEffect(() => {
    const fetchLab = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/labs/${slug}`);
        if (!response.ok) throw new Error('Failed to load lab.');
        const data = await response.json();
        if (data.status === 'LOCKED') navigate('/labs');
        setLab(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLab();
  }, [slug, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  if (loading) return <div className="pt-32 text-center text-white h-screen">Compiling Lab Interface...</div>;
  if (!lab) return <div className="pt-32 text-center text-red-500 h-screen">Lab could not be found or access is restricted.</div>;

  const tabsConfig = [
    { id: 'Introduction', icon: <PlayArrowIcon fontSize="small"/> },
    { id: 'Pre-Requisites', icon: <AssignmentIcon fontSize="small"/> },
    { id: 'Objective', icon: <HelpOutlineIcon fontSize="small"/> },
    { id: 'Simulation', icon: <AutoFixHighIcon fontSize="small"/> },
    { id: 'Test your Knowledge', icon: <QuizIcon fontSize="small"/> },
    { id: 'Learn Code', icon: <CodeIcon fontSize="small"/> },
    { id: 'Target Audience', icon: <GroupsIcon fontSize="small"/> },
    { id: 'Course Alignment', icon: <AccountTreeIcon fontSize="small"/> },
    { id: 'Resources', icon: <LibraryBooksIcon fontSize="small"/> },
    { id: 'Feedback', icon: <FeedbackIcon fontSize="small"/> }
  ];

  const renderRichBlocks = (content) => {
    if (!content) return null;
    
    if (typeof content === 'string') {
       return <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">{content}</div>;
    }
    
    if (Array.isArray(content)) {
       // Support raw string arrays (like legacy Objective list)
       if (content.length > 0 && typeof content[0] === 'string') {
          return (
            <div className="bg-[#110b27]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#00e5ff]/10 blur-[100px] rounded-full pointer-events-none"></div>
               <p className="text-xl font-semibold text-white mb-8 leading-relaxed">By the end of this experiment, students will be able to:</p>
               <ul className="space-y-6 relative z-10">
                 {content.map((str, idx) => (
                   <li key={idx} className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 flex items-center justify-center text-[#00e5ff] font-bold shadow-[0_0_15px_rgba(0,229,255,0.2)]">{idx + 1}</span>
                      <span className="text-lg text-gray-300 pt-1 leading-snug font-medium">{str}</span>
                   </li>
                 ))}
               </ul>
            </div>
          );
       }

       return content.map((block, idx) => {
          switch(block.type) {
             case 'header-cyan':
               return (
                 <h3 key={idx} className="text-3xl font-bold text-white mt-10 mb-6 border-b border-white/10 pb-4 flex items-center gap-3">
                    <span className="w-2 h-8 bg-[#00e5ff] rounded-full inline-block shadow-[0_0_10px_#00e5ff]"></span>
                    {block.text}
                 </h3>
               );
             case 'header-purple':
               return (
                 <h3 key={idx} className="text-3xl font-bold text-white mt-10 mb-6 border-b border-white/10 pb-4 flex items-center gap-3">
                    <span className="w-2 h-8 bg-purple-500 rounded-full inline-block shadow-[0_0_10px_#a855f7]"></span>
                    {block.text}
                 </h3>
               );
             case 'paragraph':
               return <p key={idx} className="text-gray-300 text-lg leading-relaxed mb-6" dangerouslySetInnerHTML={{__html: block.text}}></p>;
             case 'glass-box':
               return (
                  <div key={idx} className="bg-[#110b27] border border-white/10 p-6 flex flex-col md:flex-row items-center gap-6 rounded-2xl mb-8 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                     <div className="flex-1 text-gray-300" dangerouslySetInnerHTML={{__html: block.text}}></div>
                     {block.imageUrl && <div className="w-full md:w-1/3 p-2 bg-white rounded-xl shadow-lg border border-white/20"><img src={block.imageUrl} alt="Diagram" className="w-full h-auto object-contain rounded-lg" /></div>}
                  </div>
               );
             case 'alert-red':
               return (
                 <div key={idx} className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.15)] flex flex-col md:flex-row gap-8 items-center mt-10 mb-8">
                    <div className="flex-1">
                      {block.title && (
                         <h4 className="text-2xl font-bold text-red-500 mb-4 flex items-center gap-2">
                           <span className="text-3xl">⚠️</span> {block.title}
                         </h4>
                      )}
                      {block.text && <p className="text-gray-300 font-semibold mb-4" dangerouslySetInnerHTML={{__html: block.text}}></p>}
                      {block.highlight && (
                         <p className="text-lg font-bold bg-black/60 p-4 border border-red-500/30 rounded-xl text-red-400">
                           👉 {block.highlight}
                         </p>
                      )}
                    </div>
                    {block.imageUrl && (
                      <div className="w-full md:w-1/2 p-2 bg-white rounded-xl shadow-lg border border-red-500/20">
                        <img src={block.imageUrl} alt="Alert graphic" className="w-full h-auto object-contain rounded-lg" />
                      </div>
                    )}
                 </div>
               );
             case 'split-image':
               return (
                 <div key={idx} className="bg-[#110b27] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-shadow mb-8">
                   <div className="flex-1">
                     {block.title && <p className="mb-4 text-gray-300" dangerouslySetInnerHTML={{__html: block.title}}></p>}
                     {block.codeSnippet && (
                       <p className="mb-4 font-mono text-[#00e5ff] bg-black/50 p-4 rounded-xl border border-white/5 inline-block whitespace-pre-wrap">
                         {block.codeSnippet}
                       </p>
                     )}
                     {block.list && (
                       <ul className="text-sm space-y-2 text-gray-300">
                         {block.list.map((item, i) => (
                            <li key={i} dangerouslySetInnerHTML={{__html: item}} />
                         ))}
                       </ul>
                     )}
                     {block.subtext && <p className="mt-4 italic text-gray-400">{block.subtext}</p>}
                   </div>
                   {block.imageUrl && (
                     <div className="w-full md:w-1/2 p-2 relative bg-white rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        <img src={block.imageUrl} alt="Split Diagram" className="w-full h-auto object-contain rounded-lg" />
                     </div>
                   )}
                 </div>
               );
             case 'raw-html':
               return <div key={idx} dangerouslySetInnerHTML={{ __html: block.html }} className="mb-6" />;
             default:
               return null;
          }
       });
    }
    return null;
  };

  const renderContent = () => {
    const t = lab.tabs || {};
    
    switch (activeTab) {
      case 'Simulation':
        return <div className="h-[600px] w-full"><SimulationRenderer lab={lab} /></div>;
      
      case 'Introduction':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto pb-12">
            <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#00e5ff]">{lab.title}</h2>
            {renderRichBlocks(t.introduction || lab.description || 'Welcome to this interactive learning experience.')}
          </div>
        );
      
      case 'Pre-Requisites':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto pb-12">
            <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#00e5ff]">Pre-Requisites</h2>
            <p className="text-gray-300 mb-8 text-lg">Before executing the simulation, ensure you have a strong intuition of the fundamental concepts. Click any topic to explore further.</p>
            <div className="space-y-4">
              {t.prerequisites && t.prerequisites.length > 0 ? t.prerequisites.map((req, idx) => (
                <div key={idx} className="bg-[#110b27] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300 shadow-lg group">
                   <button 
                     onClick={() => setExpandedTopic(expandedTopic === idx ? null : idx)}
                     className="w-full flex items-center justify-between p-5 md:p-6 hover:bg-white/5 transition-colors focus:outline-none"
                   >
                     <div className="flex items-center gap-4">
                       <span className="w-2 h-8 bg-[#00e5ff] rounded-full inline-block shadow-[0_0_10px_#00e5ff]"></span>
                       <span className="text-xl md:text-2xl font-bold text-white tracking-wide group-hover:text-[#00e5ff] transition-colors">{req.title}</span>
                     </div>
                     <span className={`text-[#00e5ff] text-2xl transition-transform duration-300 ${expandedTopic === idx ? 'rotate-180' : ''}`}>▼</span>
                   </button>
                   
                   <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedTopic === idx ? 'max-h-[2000px] opacity-100 border-t border-white/10' : 'max-h-0 opacity-0'}`}>
                     <div className="p-6 md:p-8 flex flex-col xl:flex-row gap-8 items-start bg-black/40">
                       {req.image && (
                         <div className="w-full xl:w-2/5 shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.6)] group-hover:shadow-[0_0_30px_rgba(0,229,255,0.2)] transition-shadow duration-500">
                           <img src={req.image} alt={req.title} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                         </div>
                       )}
                       <div className="flex-1 w-full relative z-10">
                          {renderRichBlocks(req.body)}
                       </div>
                     </div>
                   </div>
                </div>
              )) : <p className="text-gray-500">No prerequisites specified. You are good to go!</p>}
            </div>
          </div>
        );
      
      case 'Objective':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#00e5ff]">Lab Objective</h2>
            {renderRichBlocks(t.objective || ['Objectives dynamically compiling...'])}
          </div>
        );

      case 'Learn Code':
        return <DynamicLearnCode data={t.learnCode} />;
      
      case 'Test your Knowledge':
        return <DynamicQuiz questions={t.quiz} category={lab.category} settings={t.quizSettings} />;
        
      case 'Target Audience':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto">
             <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#00e5ff]">Target Audience</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {t.targetAudience && t.targetAudience.length > 0 ? t.targetAudience.map((aud, idx) => (
                 <div key={idx} className="bg-[#110b27] border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all cursor-default shadow-lg hover:-translate-y-1">
                    <h3 className="text-[#00e5ff] font-bold text-xl mb-3 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#00e5ff] shadow-[0_0_10px_#00e5ff]"></span>
                      {aud.title}
                    </h3>
                    <p className="text-gray-400 text-lg">{aud.desc}</p>
                 </div>
               )) : <p className="col-span-2 text-gray-500">Generally accessible.</p>}
             </div>
          </div>
        );

      case 'Course Alignment':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto">
             <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#00e5ff]">Course Alignment</h2>
             <div className="bg-[#110b27]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl mb-8">
               <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">This experiment aligns with:</h3>
               <div className="flex flex-wrap gap-4">
                 {t.courseAlignment?.alignment?.map((course, idx) => (
                   <span key={idx} className="bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30 px-6 py-3 rounded-full font-semibold shadow-[0_0_15px_rgba(0,229,255,0.1)] hover:bg-[#00e5ff]/20 transition-colors">{course}</span>
                 )) || <span className="text-gray-500">Agnostic topics</span>}
               </div>
             </div>
             
             {t.courseAlignment?.typicalPart?.length > 0 && (
               <div className="border border-purple-500/30 bg-purple-900/10 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start gap-6 shadow-[0_0_30px_rgba(108,43,217,0.15)]">
                 <div className="w-16 h-16 bg-purple-500/20 rounded-full flex flex-shrink-0 items-center justify-center border border-purple-500/50 shadow-[0_0_20px_rgba(108,43,217,0.3)]">
                   <span className="text-3xl">🎓</span>
                 </div>
                 <div>
                   <h4 className="text-2xl font-bold text-white mb-4">It is typically part of:</h4>
                   <ul className="list-disc pl-6 text-gray-300 space-y-3 text-xl font-medium">
                     {t.courseAlignment.typicalPart.map((part, i) => <li key={i}>{part}</li>)}
                   </ul>
                 </div>
               </div>
             )}
          </div>
        );
      
      case 'Resources':
        return (
          <div className="animate-page-enter max-w-5xl mx-auto pb-12">
             <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#00e5ff]">Learning Resources</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {t.resources && t.resources.length > 0 ? t.resources.map((res, idx) => (
                  <a href={res.link || '#'} target="_blank" rel="noreferrer" key={idx} className="bg-[#110b27] border border-white/5 p-6 rounded-2xl hover:border-white/20 transition-all hover:-translate-y-1 block group shadow-lg">
                     <div className="flex justify-between items-start mb-4">
                        <span className="text-3xl">{res.icon || '📘'}</span>
                        <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 bg-white/5 rounded flex-shrink-0 ${res.color || 'text-[#00e5ff]'}`}>{res.type || 'Link'}</span>
                     </div>
                     <h3 className="text-xl font-bold text-white group-hover:text-[#00e5ff] transition-colors mb-2 leading-tight">{res.title}</h3>
                     <p className="text-gray-400 text-sm">{res.author ? `By ${res.author}` : ''}</p>
                  </a>
                )) : <p className="col-span-full text-gray-500">No external resources mapped.</p>}
             </div>
          </div>
        );

      case 'Feedback':
        return <GenericFeedbackForm />;
        
      default:
        return <div className="text-gray-400 italic">Work in progress...</div>;
    }
  };

  return (
    <div className="min-h-screen text-white relative font-sans flex flex-col pt-32 animate-page-enter">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      <div className="px-8 max-w-7xl mx-auto mb-12 relative w-full border-b border-white/5 pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg">
          {lab.title} <span className="font-light text-gray-400 opacity-60 ml-2">| Interactive Lab</span>
        </h1>
        {lab.status === 'UPCOMING' && <div className="mt-4 bg-[#00e5ff]/20 text-[#00e5ff] inline-block px-4 py-1 rounded-full font-bold shadow-[0_0_15px_rgba(0,229,255,0.3)]">PROTOTYPE: THIS LAB IS IN ACTIVE DEVELOPMENT</div>}
      </div>

      <div className="flex flex-col md:flex-row gap-8 px-8 max-w-7xl mx-auto w-full mb-32 flex-1 z-10">
        <div className="w-full md:w-64 shrink-0 flex flex-col">
          <div className="sticky top-32 glass-card p-2 shadow-2xl overflow-hidden bg-[#110b27]">
            {tabsConfig.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-5 py-3.5 mb-1 rounded-lg transition-all duration-300 flex items-center gap-3 font-semibold text-sm ${
                    isActive ? 'bg-gradient-to-r from-[#6c2bd9] to-[#4a1bb8] text-white shadow-[0_4px_20px_rgba(108,43,217,0.4)]' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={`${isActive ? 'text-[#00e5ff]' : 'text-gray-500'}`}>{tab.icon}</span>
                  {tab.id}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 glass-card p-8 md:p-12 min-h-[600px] border border-white/5 bg-[#0a0510]/80 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {renderContent()}
        </div>
      </div>
      <WaveFooter />
    </div>
  );
}
