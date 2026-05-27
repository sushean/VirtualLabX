import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
import SortingLearnCodeComponent from '../components/sorting-lab/SortingLearnCodeComponent';

const GenericFeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  if (submitted) {
    return (
      <div className="animate-page-enter max-w-2xl mx-auto bg-green-500/10 border border-green-500/50 p-10 rounded-2xl text-center shadow-[0_0_30px_rgba(34,197,94,0.2)]">
        <h3 className="text-3xl font-bold text-green-400 mb-4">Feedback Received!</h3>
        <p className="text-[var(--muted-text)] text-lg">Thank you for helping us improve this Virtual Lab. Your response has been securely logged.</p>
      </div>
    );
  }

  return (
    <div className="animate-page-enter max-w-3xl mx-auto">
      <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[var(--accent-cyan)]">Experiment Feedback</h2>
      <div className="bg-[var(--panel-bg-strong)] backdrop-blur-md border border-[var(--glass-border)] rounded-3xl p-8 shadow-2xl relative">
         <p className="text-[var(--muted-text)] text-lg mb-8 text-center font-bold">How would you rate your experience with this simulation module?</p>
         <div className="flex gap-2 mb-10 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
               <button 
                 key={star} onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(rating)}
                 className={`text-6xl transition-all ${star <= (hover || rating) ? 'text-yellow-400 scale-110 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'text-[var(--muted-text)] hover:text-[var(--muted-text)]'}`}
               >★</button>
            ))}
         </div>
         <div className="flex flex-col gap-4">
            <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} className="w-full bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-xl p-4 text-[var(--page-text)] focus:outline-none focus:border-[var(--accent-cyan)]/50 h-32 resize-none" placeholder="Let us know what you think..." />
         </div>
         <button disabled={rating === 0} onClick={() => setSubmitted(true)} className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all ${rating === 0 ? 'bg-[var(--glass-bg)] text-[var(--muted-text)] cursor-not-allowed' : 'bg-linear-to-r from-purple-600 to-[var(--accent-cyan)] text-[var(--page-text)] hover:-translate-y-1'}`}>Submit Feedback</button>
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
  const [viewedTabs, setViewedTabs] = useState([]);

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

  // Telemetry Background Syncer
  useEffect(() => {
     if (lab && !viewedTabs.includes(activeTab)) {
        const nextViewed = [...viewedTabs, activeTab];
        setViewedTabs(nextViewed);
        
        const token = localStorage.getItem('token');
        if (token) {
           // We have exactly 10 master tab nodes globally handling lab scope
           const progressionRatio = Math.round((nextViewed.length / 10) * 100);
           axios.post('http://localhost:5000/api/progress/lab', 
               { labSlug: slug, progressPercentage: progressionRatio },
               { headers: { Authorization: `Bearer ${token}` } }
           ).catch(err => console.debug("Sync Warning", err));
        }
     }
  }, [activeTab, lab, slug, viewedTabs]);

  if (loading) return <div className="pt-32 text-center text-[var(--page-text)] h-screen">Compiling Lab Interface...</div>;
  if (!lab) {
    return (
      <div className="min-h-screen bg-[var(--background-start)] flex items-center justify-center p-6 animate-page-enter">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-125 h-125 bg-red-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-125 h-125 bg-purple-500/10 rounded-full blur-[120px]"></div>
        </div>
        <div className="bg-[var(--panel-bg-strong)] backdrop-blur-2xl border border-[var(--glass-border)] p-12 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-2xl w-full text-center relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-inner">
            <span className="text-5xl">🚧</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-linear-to-r from-red-400 to-purple-500">Module Unavailable</h1>
          <p className="text-[var(--muted-text)] text-lg mb-10 leading-relaxed">
            The laboratory module <span className="text-[var(--page-text)] font-mono bg-black/30 px-2 py-1 rounded">"{slug}"</span> you are trying to access is currently in development or restricted. Our engineers are actively calibrating this simulation.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
             <button onClick={() => navigate('/labs')} className="px-8 py-3.5 rounded-xl font-bold text-white bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:-translate-y-1 transition-all uppercase tracking-wide">
                Explore Available Labs
             </button>
             <button onClick={() => navigate('/performance')} className="px-8 py-3.5 rounded-xl font-bold text-[var(--page-text)] bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:bg-[var(--panel-bg-strong)] hover:border-purple-500/50 hover:-translate-y-1 transition-all uppercase tracking-wide">
                Return to Dashboard
             </button>
          </div>
        </div>
      </div>
    );
  }

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
       return <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl p-8 text-[var(--muted-text)] text-lg leading-relaxed whitespace-pre-wrap">{content}</div>;
    }
    
    if (Array.isArray(content)) {
       // Support raw string arrays (like legacy Objective list)
       if (content.length > 0 && typeof content[0] === 'string') {
          return (
            <div className="bg-[var(--panel-bg-strong)] backdrop-blur-md border border-[var(--glass-border)] rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-75 h-75 bg-[var(--accent-cyan)]/10 blur-[100px] rounded-full pointer-events-none"></div>
               <p className="text-xl font-semibold text-[var(--page-text)] mb-8 leading-relaxed">By the end of this experiment, students will be able to:</p>
               <ul className="space-y-6 relative z-10">
                 {content.map((str, idx) => (
                   <li key={idx} className="flex items-start gap-4">
                      <span className="shrink-0 w-8 h-8 rounded-full bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 flex items-center justify-center text-[var(--accent-cyan)] font-bold shadow-[0_0_15px_rgba(0,229,255,0.2)]">{idx + 1}</span>
                      <span className="text-lg text-[var(--muted-text)] pt-1 leading-snug font-medium">{str}</span>
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
                 <h3 key={idx} className="text-3xl font-bold text-[var(--page-text)] mt-10 mb-6 border-b border-[var(--glass-border)] pb-4 flex items-center gap-3">
                    <span className="w-2 h-8 bg-[var(--accent-cyan)] rounded-full inline-block shadow-[0_0_10px_#00e5ff]"></span>
                    {block.text}
                 </h3>
               );
             case 'header-purple':
               return (
                 <h3 key={idx} className="text-3xl font-bold text-[var(--page-text)] mt-10 mb-6 border-b border-[var(--glass-border)] pb-4 flex items-center gap-3">
                    <span className="w-2 h-8 bg-purple-500 rounded-full inline-block shadow-[0_0_10px_#a855f7]"></span>
                    {block.text}
                 </h3>
               );
             case 'paragraph':
               return <p key={idx} className="text-[var(--muted-text)] text-lg leading-relaxed mb-6" dangerouslySetInnerHTML={{__html: block.text}}></p>;
             case 'glass-box':
               return (
                  <div key={idx} className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] p-6 flex flex-col md:flex-row items-center gap-6 rounded-2xl mb-8 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                     <div className="flex-1 text-[var(--muted-text)]" dangerouslySetInnerHTML={{__html: block.text}}></div>
                     {block.imageUrl && <div className="w-full md:w-1/3 p-2 bg-white rounded-xl shadow-lg border border-[var(--glass-border)]"><img src={block.imageUrl} alt="Diagram" className="w-full h-auto object-contain rounded-lg" /></div>}
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
                      {block.text && <p className="text-[var(--muted-text)] font-semibold mb-4" dangerouslySetInnerHTML={{__html: block.text}}></p>}
                      {block.highlight && (
                         <p className="text-lg font-bold bg-[var(--panel-bg-strong)] p-4 border border-red-500/30 rounded-xl text-red-400">
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
                 <div key={idx} className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-shadow mb-8">
                   <div className="flex-1">
                     {block.title && <p className="mb-4 text-[var(--muted-text)]" dangerouslySetInnerHTML={{__html: block.title}}></p>}
                     {block.codeSnippet && (
                       <p className="mb-4 font-mono text-[var(--accent-cyan)] bg-[var(--panel-bg-strong)] p-4 rounded-xl border border-[var(--glass-border)] inline-block whitespace-pre-wrap">
                         {block.codeSnippet}
                       </p>
                     )}
                     {block.list && (
                       <ul className="text-sm space-y-2 text-[var(--muted-text)]">
                         {block.list.map((item, i) => (
                            <li key={i} dangerouslySetInnerHTML={{__html: item}} />
                         ))}
                       </ul>
                     )}
                     {block.subtext && <p className="mt-4 italic text-[var(--muted-text)]">{block.subtext}</p>}
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
        return <div className="min-h-[600px] h-full w-full"><SimulationRenderer lab={lab} /></div>;
      
      case 'Introduction':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto pb-12">
            <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[var(--accent-cyan)]">{lab.title}</h2>
            {renderRichBlocks(t.introduction || lab.description || 'Welcome to this interactive learning experience.')}
          </div>
        );
      
      case 'Pre-Requisites':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto pb-12">
            <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[var(--accent-cyan)]">Pre-Requisites</h2>
            <p className="text-[var(--muted-text)] mb-8 text-lg">Before executing the simulation, ensure you have a strong intuition of the fundamental concepts. Click any topic to explore further.</p>
            <div className="space-y-4">
              {t.prerequisites && t.prerequisites.length > 0 ? t.prerequisites.map((req, idx) => (
                <div key={idx} className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300 shadow-lg group">
                   <button 
                     onClick={() => setExpandedTopic(expandedTopic === idx ? null : idx)}
                     className="w-full flex items-center justify-between p-5 md:p-6 hover:bg-[var(--glass-bg)] transition-colors focus:outline-none"
                   >
                     <div className="flex items-center gap-4">
                       <span className="w-2 h-8 bg-[var(--accent-cyan)] rounded-full inline-block shadow-[0_0_10px_#00e5ff]"></span>
                       <span className="text-xl md:text-2xl font-bold text-[var(--page-text)] tracking-wide group-hover:text-[var(--accent-cyan)] transition-colors">{req.title}</span>
                     </div>
                     <span className={`text-[var(--accent-cyan)] text-2xl transition-transform duration-300 ${expandedTopic === idx ? 'rotate-180' : ''}`}>▼</span>
                   </button>
                   
                   <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedTopic === idx ? 'max-h-500 opacity-100 border-t border-[var(--glass-border)]' : 'max-h-0 opacity-0'}`}>
                     <div className="p-6 md:p-8 flex flex-col xl:flex-row gap-8 items-start bg-[var(--panel-bg)]">
                       {req.image && (
                         <div className="w-full xl:w-2/5 shrink-0 rounded-xl overflow-hidden border border-[var(--glass-border)] shadow-[0_0_30px_rgba(0,0,0,0.6)] group-hover:shadow-[0_0_30px_rgba(0,229,255,0.2)] transition-shadow duration-500">
                           <img src={req.image} alt={req.title} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                         </div>
                       )}
                       <div className="flex-1 w-full relative z-10">
                          {renderRichBlocks(req.body)}
                       </div>
                     </div>
                   </div>
                </div>
              )) : <p className="text-[var(--muted-text)]">No prerequisites specified. You are good to go!</p>}
            </div>
          </div>
        );
      
      case 'Objective':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[var(--accent-cyan)]">Lab Objective</h2>
            {renderRichBlocks(t.objective || ['Objectives dynamically compiling...'])}
          </div>
        );

      case 'Learn Code':
        if (lab.slug === 'sorting-algorithms') return <SortingLearnCodeComponent />;
        return <DynamicLearnCode data={t.learnCode} />;
      
      case 'Test your Knowledge':
        return <DynamicQuiz questions={t.quiz} category={lab.category} settings={t.quizSettings} />;
        
      case 'Target Audience':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto">
             <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[var(--accent-cyan)]">Target Audience</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {t.targetAudience && t.targetAudience.length > 0 ? t.targetAudience.map((aud, idx) => (
                 <div key={idx} className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-xl p-8 hover:bg-[var(--glass-bg)] transition-all cursor-default shadow-lg hover:-translate-y-1">
                    <h3 className="text-[var(--accent-cyan)] font-bold text-xl mb-3 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_10px_#00e5ff]"></span>
                      {aud.title}
                    </h3>
                    <p className="text-[var(--muted-text)] text-lg">{aud.desc}</p>
                 </div>
               )) : <p className="col-span-2 text-[var(--muted-text)]">Generally accessible.</p>}
             </div>
          </div>
        );

      case 'Course Alignment':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto">
             <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[var(--accent-cyan)]">Course Alignment</h2>
             <div className="bg-[var(--panel-bg-strong)] backdrop-blur-md border border-[var(--glass-border)] rounded-2xl p-8 md:p-12 shadow-2xl mb-8">
               <h3 className="text-xl font-bold text-[var(--page-text)] mb-6 border-b border-[var(--glass-border)] pb-4">This experiment aligns with:</h3>
               <div className="flex flex-wrap gap-4">
                 {t.courseAlignment?.alignment?.map((course, idx) => (
                   <span key={idx} className="bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/30 px-6 py-3 rounded-full font-semibold shadow-[0_0_15px_rgba(0,229,255,0.1)] hover:bg-[var(--accent-cyan)]/20 transition-colors">{course}</span>
                 )) || <span className="text-[var(--muted-text)]">Agnostic topics</span>}
               </div>
             </div>
             
             {t.courseAlignment?.typicalPart?.length > 0 && (
               <div className="border border-purple-500/30 bg-purple-900/10 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start gap-6 shadow-[0_0_30px_rgba(108,43,217,0.15)]">
                 <div className="w-16 h-16 bg-purple-500/20 rounded-full flex shrink-0 items-center justify-center border border-purple-500/50 shadow-[0_0_20px_rgba(108,43,217,0.3)]">
                   <span className="text-3xl">🎓</span>
                 </div>
                 <div>
                   <h4 className="text-2xl font-bold text-[var(--page-text)] mb-4">It is typically part of:</h4>
                   <ul className="list-disc pl-6 text-[var(--muted-text)] space-y-3 text-xl font-medium">
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
             <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[var(--accent-cyan)]">Learning Resources</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {t.resources && t.resources.length > 0 ? t.resources.map((res, idx) => (
                  <a href={res.link || '#'} target="_blank" rel="noreferrer" key={idx} className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] p-6 rounded-2xl hover:border-[var(--glass-border)] transition-all hover:-translate-y-1 block group shadow-lg">
                     <div className="flex justify-between items-start mb-4">
                        <span className="text-3xl">{res.icon || '📘'}</span>
                        <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 bg-[var(--glass-bg)] rounded shrink-0 ${res.color || 'text-[var(--accent-cyan)]'}`}>{res.type || 'Link'}</span>
                     </div>
                     <h3 className="text-xl font-bold text-[var(--page-text)] group-hover:text-[var(--accent-cyan)] transition-colors mb-2 leading-tight">{res.title}</h3>
                     <p className="text-[var(--muted-text)] text-sm">{res.author ? `By ${res.author}` : ''}</p>
                  </a>
                )) : <p className="col-span-full text-[var(--muted-text)]">No external resources mapped.</p>}
             </div>
          </div>
        );

      case 'Feedback':
        return <GenericFeedbackForm />;
        
      default:
        return <div className="text-[var(--muted-text)] italic">Work in progress...</div>;
    }
  };

  return (
    <div className="min-h-screen text-[var(--page-text)] relative font-sans flex flex-col pt-32 animate-page-enter">
      <div className="absolute top-0 right-0 w-125 h-125 bg-purple-900/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      <div className="px-8 max-w-7xl mx-auto mb-12 relative w-full border-b border-[var(--glass-border)] pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg">
          {lab.title} <span className="font-light text-[var(--muted-text)] opacity-60 ml-2">| Interactive Lab</span>
        </h1>
        {lab.status === 'UPCOMING' && <div className="mt-4 bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] inline-block px-4 py-1 rounded-full font-bold shadow-[0_0_15px_rgba(0,229,255,0.3)]">PROTOTYPE: THIS LAB IS IN ACTIVE DEVELOPMENT</div>}
      </div>

      <div className="flex flex-col md:flex-row gap-8 px-8 max-w-7xl mx-auto w-full mb-32 flex-1 z-10">
        <div className="w-full md:w-64 shrink-0 flex flex-col">
          <div className="sticky top-32 glass-card p-2 shadow-2xl overflow-hidden bg-[var(--panel-bg-strong)]">
            {tabsConfig.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-5 py-3.5 mb-1 rounded-lg transition-all duration-300 flex items-center gap-3 font-semibold text-sm ${
                    isActive ? 'bg-linear-to-r from-[#6c2bd9] to-[#4a1bb8] text-[var(--page-text)] shadow-[0_4px_20px_rgba(108,43,217,0.4)]' : 'text-[var(--muted-text)] hover:text-[var(--page-text)] hover:bg-[var(--glass-bg)]'
                  }`}
                >
                  <span className={`${isActive ? 'text-[var(--accent-cyan)]' : 'text-[var(--muted-text)]'}`}>{tab.icon}</span>
                  {tab.id}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 glass-card p-8 md:p-12 min-h-150 border border-[var(--glass-border)] bg-[var(--panel-bg)] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {renderContent()}
        </div>
      </div>
      <WaveFooter />
    </div>
  );
}
