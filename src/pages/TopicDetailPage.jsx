import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { 
  FiArrowLeft, 
  FiBookOpen, 
  FiCheckCircle, 
  FiPlayCircle, 
  FiFileText, 
  FiActivity, 
  FiAward, 
  FiCompass,
  FiZap,
  FiGlobe,
  FiExternalLink
} from 'react-icons/fi';

export default function TopicDetailPage() {
  const { topicName } = useParams();
  const navigate = useNavigate();
  const { isLight } = useTheme();
  
  const [topic, setTopic] = useState(null);
  const [covered, setCovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTopicData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch detailed topic information
        const res = await axios.get(`http://localhost:5000/api/progress/topic-info/${topicName}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTopic(res.data);
        
        // Fetch user progress to check if already marked covered
        const progressRes = await axios.get('http://localhost:5000/api/progress/performance', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const coveredList = progressRes.data.coveredTopics || [];
        setCovered(coveredList.includes(topicName.toLowerCase().trim()));
      } catch (err) {
        console.error('Failed to load topic detail page data:', err);
        setError('Failed to load this curriculum topic. Please make sure you are logged in and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopicData();
  }, [topicName, token]);

  const handleToggleCover = async () => {
    if (toggling) return;
    setToggling(true);
    const action = covered ? 'uncover' : 'cover';
    
    try {
      const res = await axios.post('http://localhost:5000/api/progress/topic/cover', 
        { topicName, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setCovered(action === 'cover');
      }
    } catch (err) {
      console.error('Failed to update cover status:', err);
      alert('Could not update topic completion progress. Please try again.');
    } finally {
      setToggling(false);
    }
  };

  const getResourceIcon = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('video') || t.includes('youtube')) return <FiPlayCircle className="text-red-400 text-2xl" />;
    if (t.includes('book') || t.includes('read')) return <FiBookOpen className="text-emerald-400 text-2xl" />;
    if (t.includes('article') || t.includes('post') || t.includes('blog')) return <FiFileText className="text-cyan-400 text-2xl" />;
    return <FiCompass className="text-purple-400 text-2xl" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06030d] pt-32 pb-24 px-6 relative flex flex-col items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-purple-900/10 to-transparent pointer-events-none" />
        <div className="absolute top-40 -left-60 bg-[#00e5ff] rounded-full blur-[250px] opacity-[0.1] pointer-events-none" style={{ width: '700px', height: '700px' }} />
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-400/10 border-b-cyan-400 rounded-full animate-spin animate-reverse"></div>
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm animate-pulse">
            AI Mentor Compiling Topic Analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-[#06030d] pt-32 pb-24 px-6 relative flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-[#0d071a] border border-red-500/20 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(239,68,68,0.1)]">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiActivity className="text-red-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Verification Exception</h2>
          <p className="text-gray-400 mb-8 text-sm leading-relaxed">{error || "The curriculum coordinator could not access this learning path."}</p>
          <button 
            onClick={() => navigate('/performance')}
            className="px-6 py-3 bg-linear-to-r from-[#6c2bd9] to-[#00e5ff] hover:from-[#5a20b8] hover:to-[#00cce5] rounded-xl font-bold text-white shadow-[0_0_20px_rgba(108,43,217,0.3)] transition-all duration-300 transform active:scale-95"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06030d] pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-125 bg-linear-to-b from-purple-900/10 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 bg-[#6c2bd9] rounded-full blur-[200px] opacity-[0.12] pointer-events-none" style={{ width: '600px', height: '600px' }} />
      <div className="absolute top-40 -left-60 bg-[#00e5ff] rounded-full blur-[250px] opacity-[0.08] pointer-events-none" style={{ width: '700px', height: '700px' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Navigation & Action Header */}
        <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-3xl p-6 md:p-8 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/performance')}
              className="w-12 h-12 rounded-2xl bg-black border border-[#6c2bd9]/30 flex items-center justify-center text-gray-300 hover:text-white hover:border-[#00e5ff]/50 transition-all duration-300"
            >
              <FiArrowLeft className="text-xl" />
            </button>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#00e5ff]">AI Curriculum Hub</span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                {topic.title}
              </h1>
            </div>
          </div>

          {/* Glowing Green covered topic status toggler button */}
          <button
            onClick={handleToggleCover}
            disabled={toggling}
            className={`flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-500 border ${
              covered
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.35)]'
                : 'bg-black text-gray-400 border-[#6c2bd9]/30 hover:border-[#00e5ff]/50 hover:text-white'
            }`}
          >
            {covered ? (
              <>
                <FiCheckCircle className="text-lg animate-bounce" />
                <span>Marked Covered</span>
              </>
            ) : (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-gray-400/50" />
                <span>Mark as Covered</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Left Columns - Overview, Deep Dive, Core Principles */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Overview / Introduction */}
            <div className="bg-[#0d071a] border border-[#6c2bd9]/30 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-[#6c2bd9]/10 to-[#00e5ff]/10 rounded-full blur-3xl pointer-events-none" />
              <h2 className="text-xl font-black uppercase tracking-widest text-[#00e5ff] mb-4 flex items-center gap-2">
                <FiBookOpen className="text-lg" />
                Overview
              </h2>
              <p className="text-gray-300 leading-relaxed text-base font-medium">
                {topic.introduction}
              </p>
            </div>

            {/* Core Principles Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-black uppercase tracking-widest text-purple-400 flex items-center gap-2">
                <FiZap className="text-lg" />
                Core Principles
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {topic.corePrinciples && topic.corePrinciples.map((principle, index) => (
                  <div 
                    key={index}
                    className="bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-purple-500/40 p-6 rounded-2xl relative group transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-xs font-black text-purple-400 mb-4 group-hover:bg-[#6c2bd9] group-hover:text-white transition-colors duration-300">
                      0{index + 1}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00e5ff] transition-colors">
                      {principle.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed font-medium">
                      {principle.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Scientific Deep Dive */}
            <div className="bg-black border border-[#6c2bd9]/30 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-purple-500 via-[#00e5ff] to-blue-500" />
              <h2 className="text-xl font-black uppercase tracking-widest text-[#00e5ff] mb-6 flex items-center gap-2">
                <FiAward className="text-lg" />
                AI Mentor Technical Deep Dive
              </h2>
              <div className="text-gray-300 leading-relaxed text-sm space-y-6 font-medium">
                {topic.deepDive.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="border-l-2 border-purple-500/30 pl-4 py-1 bg-purple-950/5 rounded-r-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column - Applications, Recommended Resources */}
          <div className="space-y-10">
            
            {/* Real World Applications */}
            <div className="bg-[#0d071a] border border-[#6c2bd9]/30 rounded-3xl p-8 relative overflow-hidden">
              <h2 className="text-xl font-black uppercase tracking-widest text-purple-400 mb-6 flex items-center gap-2">
                <FiGlobe className="text-lg" />
                Industry Applications
              </h2>
              <div className="space-y-6">
                {topic.applications && topic.applications.map((app, index) => (
                  <div key={index} className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-purple-500/5 rounded-full" />
                    <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]" />
                      {app.name}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed font-medium">
                      {app.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Curated Recommendations */}
            <div className="bg-black border border-[#6c2bd9]/30 rounded-3xl p-8 relative overflow-hidden">
              <h2 className="text-xl font-black uppercase tracking-widest text-[#00e5ff] mb-6 flex items-center gap-2">
                <FiCompass className="text-lg" />
                Curated Recommendations
              </h2>
              
              <div className="space-y-6">
                {topic.recommendations && topic.recommendations.map((rec, index) => (
                  <div 
                    key={index} 
                    className="border border-[#6c2bd9]/25 hover:border-[#00e5ff]/40 rounded-2xl p-5 bg-[#0a0515]/60 hover:bg-[#0c061a] transition-all duration-300 flex items-start gap-4"
                  >
                    <div className="bg-black border border-gray-800 rounded-xl p-3 flex items-center justify-center">
                      {getResourceIcon(rec.type)}
                    </div>
                    
                    <div className="grow space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#00e5ff] px-2 py-0.5 bg-black border border-[#6c2bd9]/20 rounded-md">
                        {rec.type || 'Resource'}
                      </span>
                      <h4 className="text-base font-bold text-white pt-1">
                        {rec.title}
                      </h4>
                      <p className="text-gray-400 text-xs leading-relaxed font-medium pb-3">
                        {rec.description}
                      </p>
                      
                      <a 
                        href={rec.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-950/50 hover:bg-purple-900 border border-purple-500/30 rounded-xl text-xs font-black uppercase tracking-wider text-purple-300 hover:text-white transition-colors duration-300"
                      >
                        Explore Resource
                        <FiExternalLink className="text-sm" />
                      </a>
                    </div>
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
