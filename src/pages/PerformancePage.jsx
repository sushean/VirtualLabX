import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiZap, FiActivity, FiArrowRight } from 'react-icons/fi';

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
  return `${Math.floor(months / 12)} year${Math.floor(months / 12) !== 1 ? 's' : ''} ago`;
};





const nodeMetaInfo = {
  // Labs
  'linear-regression': {
    desc: 'Learn how to predict future trends (like sales or scores) by drawing a straight line through your data points.',
    tip: 'Click to start predicting patterns with interactive charts.'
  },
  'matrix-multiplication': {
    desc: 'See how AI calculates huge lists of numbers all at once using neat grids called matrices.',
    tip: 'Click to learn how computers handle massive batches of data.'
  },
  'sorting-algorithms': {
    desc: 'Discover how computers quickly organize messy lists into perfect order using smart sorting steps.',
    tip: 'Click to play with sorting speeds and see code steps in action.'
  },
  'quantum-computing': {
    desc: 'Explore the amazing world of quantum bits that can be both 0 and 1 at the same time to solve huge riddles.',
    tip: 'Click to manipulate quantum gates and see probability bars pulse.'
  },
  'blockchain-ledger': {
    desc: 'Learn how digital record books securely store transactions and keep information safe without needing a bank.',
    tip: 'Click to solve blockchain puzzles and hash digital blocks.'
  },
  'deep-learning-basics': {
    desc: 'Build and train a simple smart brain, styled after our own human brains, to recognize complex patterns.',
    tip: 'Click to watch artificial neurons learn and adapt in real time.'
  },
  'cloud-gaming': {
    desc: 'Stream high-end games instantly from the cloud, and understand how servers render, compress, and transmit video frames with ultra-low latency.',
    tip: 'Click to explore cloud-based rendering pipelines and network inputs.'
  },
  'video-compression': 'Compresses high-definition video frames into light packet streams for fast internet transit.',
  'network-latency': 'The round-trip delay that determines how responsive and crisp the remote game feels.',
  'gpu-virtualization': 'Splits a physical cloud graphics processor into multiple virtual machines to render many screens concurrently.',
  'input-streaming': 'Captures your keyboard and mouse clicks, sending them rapidly to the cloud to interact with the game engine.',

  // Satellites
  'gradient-descent': 'A smart helper that guides the AI downhill step-by-step until it finds the absolute best answers.',
  'loss-functions': 'A scoreboard that calculates exactly how far off the AI\'s guesses are so it can correct its mistakes.',
  'overfitting-regularization': 'A technique that keeps the AI from memorizing training data too closely, making sure it works on new inputs.',
  'supervised-learning': 'Teaching the AI using examples that already have the correct answers, like showing it labeled animal photos.',
  
  'linear-algebra': 'The math of moving and scaling arrows in grid spaces. Essential for positioning elements.',
  'matrix-inversion': 'An undo button for grid calculations that restores numbers to their original positions.',
  'eigenvalues-eigenvectors': 'Special lines that keep their direction when a grid is stretched or transformed.',
  'tensor-operations': 'Super-sized grids used by AI to process photos, videos, and multi-layered data arrays.',

  'big-o-notation': 'A speed-rating system that shows how fast a code script will run as the list size grows.',
  'divide-and-conquer': 'A strategy that splits a big messy problem into smaller pieces and merges them back in perfect order.',
  'quick-sort-vs-merge-sort': 'Comparing a method that shuffles list items in-place with a method that splits them into neat family trees.',
  'binary-search': 'Finding a book in a library instantly by repeatedly cutting the search area in half.',

  'qubits-superposition': 'Special quantum bits that can exist in multiple possibilities at once until we look at them.',
  'quantum-entanglement': 'A magical link that binds two quantum bits together so that whatever happens to one instantly changes the other.',
  'quantum-gates': 'Switches that turn and spin quantum states around to execute extremely fast calculations.',
  'shors-algorithm': 'A super quantum method that factors large numbers incredibly fast, proving the power of quantum computing.',

  'cryptographic-hash-functions': 'Locks private text into a unique digital fingerprint that cannot be reversed or tampered with.',
  'proof-of-work': 'A computational puzzle that miners must solve to securely add new pages of transactions to the shared book.',
  'smart-contracts': 'Digital rules written in code that automatically execute transaction agreements without middle brokers.',
  'consensus-algorithms': 'Rules that make sure all computers in a network agree on the exact same records.',

  'neural-networks': 'A web of artificial brain cells connected in layers to process information and make smart choices.',
  'backpropagation': 'How the AI learns from its mistakes by sending error grades backward to adjust brain connection weights.',
  'activation-functions': 'Introducing smart bends into calculations so the AI can understand complex, curved patterns.',
  'optimization-algorithms': 'Adding boosters and adaptive brakes to make the AI learn faster and more smoothly.'
};


export default function PerformancePage() {
  const [performance, setPerformance] = useState(null);
  const [dbLabs, setDbLabs] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hideTimeoutId, setHideTimeoutId] = useState(null);

  const showNodeInfo = (node) => {
    if (hideTimeoutId) {
      clearTimeout(hideTimeoutId);
      setHideTimeoutId(null);
    }
    setHoveredNode(node);
  };

  const hideNodeInfo = () => {
    const timeout = setTimeout(() => {
      setHoveredNode(null);
    }, 350); // 350ms grace period to let user move cursor into the card
    setHideTimeoutId(timeout);
  };

  useEffect(() => {
    return () => {
      if (hideTimeoutId) clearTimeout(hideTimeoutId);
    };
  }, [hideTimeoutId]);
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
        
        // Fetch all platform labs dynamically to draw dynamic map
        const labsRes = await axios.get('http://localhost:5000/api/labs');
        setDbLabs(labsRes.data || []);
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

  
  // Compile curriculum node map dynamically from fetched database records
  const activeDbLabs = dbLabs ? dbLabs.filter(lab => lab.status === 'ACTIVE') : [];
  const dynamicGraphData = (activeDbLabs && activeDbLabs.length > 0 ? activeDbLabs : [
    { slug: 'linear-regression', title: 'Linear Regression', description: 'Predict trends' },
    { slug: 'matrix-multiplication', title: 'Matrix Multiplication', description: 'Grid Operations' },
    { slug: 'sorting-algorithms', title: 'Sorting Algorithms', description: 'Organize Data' },
    { slug: 'advanced-quantum-computing', title: 'Quantum Computing', description: 'Quantum Lab' },
    { slug: 'blockchain-ledger', title: 'Blockchain Ledger', description: 'Digital Ledger' },
    { slug: 'deep-learning-basics', title: 'Deep Learning Basics', description: 'Neural Brains' }
  ]).map((lab, index) => {
    const knownMapping = {
      'linear-regression': {
        label: 'Linear Regression',
        satellites: [
          { id: 'gradient-descent', label: 'Gradient Descent', dx: -105, dy: -32 },
          { id: 'loss-functions', label: 'Loss Functions', dx: 105, dy: -32 },
          { id: 'overfitting-regularization', label: 'Overfitting & Reg', dx: -105, dy: 32 },
          { id: 'supervised-learning', label: 'Supervised Learning', dx: 105, dy: 32 }
        ]
      },
      'matrix-multiplication': {
        label: 'Matrix Multiplication',
        satellites: [
          { id: 'linear-algebra', label: 'Linear Algebra', dx: -105, dy: -32 },
          { id: 'matrix-inversion', label: 'Matrix Inversion', dx: 105, dy: -32 },
          { id: 'eigenvalues-eigenvectors', label: 'Eigenvalues & Vectors', dx: -105, dy: 32 },
          { id: 'tensor-operations', label: 'Tensor Operations', dx: 105, dy: 32 }
        ]
      },
      'sorting-algorithms': {
        label: 'Sorting Algorithms',
        satellites: [
          { id: 'big-o-notation', label: 'Big-O Notation', dx: -105, dy: -32 },
          { id: 'divide-and-conquer', label: 'Divide & Conquer', dx: 105, dy: -32 },
          { id: 'quick-sort-vs-merge-sort', label: 'Quick vs Merge Sort', dx: -105, dy: 32 },
          { id: 'binary-search', label: 'Binary Search', dx: 105, dy: 32 }
        ]
      },
      'advanced-quantum-computing': {
        label: 'Quantum Computing',
        satellites: [
          { id: 'qubits-superposition', label: 'Qubits & Superposition', dx: -105, dy: -32 },
          { id: 'quantum-entanglement', label: 'Quantum Entanglement', dx: 105, dy: -32 },
          { id: 'quantum-gates', label: 'Quantum Gates', dx: -105, dy: 32 },
          { id: 'shors-algorithm', label: 'Shor\'s Algorithm', dx: 105, dy: 32 }
        ]
      },
      'blockchain-ledger': {
        label: 'Blockchain Ledger',
        satellites: [
          { id: 'cryptographic-hash-functions', label: 'Cryptographic Hashing', dx: -105, dy: -32 },
          { id: 'proof-of-work', label: 'Proof of Work', dx: 105, dy: -32 },
          { id: 'smart-contracts', label: 'Smart Contracts', dx: -105, dy: 32 },
          { id: 'consensus-algorithms', label: 'Consensus Algorithms', dx: 105, dy: 32 }
        ]
      },
      'deep-learning-basics': {
        label: 'Deep Learning Basics',
        satellites: [
          { id: 'neural-networks', label: 'Neural Networks', dx: -105, dy: -32 },
          { id: 'backpropagation', label: 'Backpropagation', dx: 105, dy: -32 },
          { id: 'activation-functions', label: 'Activation Functions', dx: -105, dy: 32 },
          { id: 'optimization-algorithms', label: 'Optimization Algos', dx: 105, dy: 32 }
        ]
      },
      'cloud-gaming': {
        label: 'Cloud Gaming',
        satellites: [
          { id: 'video-compression', label: 'Video Compression', dx: -105, dy: -32 },
          { id: 'network-latency', label: 'Network Latency', dx: 105, dy: -32 },
          { id: 'gpu-virtualization', label: 'GPU Virtualization', dx: -105, dy: 32 },
          { id: 'input-streaming', label: 'Input Streaming', dx: 105, dy: 32 }
        ]
      }
    };

    const known = knownMapping[lab.slug];
    const cx = 320;
    const cy = 110 + index * 160;

    if (known) {
      return {
        id: lab.slug,
        slug: lab.slug,
        label: known.label,
        link: `/labs/${lab.slug}`,
        cx, cy,
        satellites: known.satellites
      };
    } else {
      const cleanTitle = lab.title || 'Dynamic Lab';
      const cleanTitleLower = cleanTitle.toLowerCase();
      const slugLower = (lab.slug || '').toLowerCase();
      
      // Auto-extract real subtopics from prerequisites if specified in MongoDB
      let extractedTopics = [];
      if (lab.tabs && Array.isArray(lab.tabs.prerequisites)) {
        extractedTopics = lab.tabs.prerequisites
          .map(p => p.title)
          .filter(t => typeof t === 'string' && t.trim() !== '');
      }

      // Fill remaining spots using our dynamic CS keyword resolution system
      const fallbackTopics = [
        { key: 'cloud', topics: ['Cloud Architecture', 'Virtualization', 'SaaS/PaaS Models', 'Serverless Compute'] },
        { key: 'network', topics: ['TCP/IP Protocols', 'Routing Algorithms', 'DNS Resolution', 'Sockets API'] },
        { key: 'sort', topics: ['Big-O Complexity', 'Divide & Conquer', 'Linear Search', 'Binary Search'] },
        { key: 'quantum', topics: ['Qubits & States', 'Superposition', 'Quantum Gates', 'Entanglement'] },
        { key: 'block', topics: ['Hash Functions', 'Proof of Work', 'Smart Contracts', 'Consensus Rules'] },
        { key: 'crypto', topics: ['Hash Functions', 'Proof of Work', 'Smart Contracts', 'Consensus Rules'] },
        { key: 'data', topics: ['Relational Schemas', 'Indexing & Keys', 'SQL Queries', 'ACID Transactions'] },
        { key: 'sql', topics: ['Relational Schemas', 'Indexing & Keys', 'SQL Queries', 'ACID Transactions'] },
        { key: 'security', topics: ['Symmetric Crypto', 'Public Key Auth', 'Firewalls & IPS', 'Penetration Testing'] },
        { key: 'cyber', topics: ['Symmetric Crypto', 'Public Key Auth', 'Firewalls & IPS', 'Penetration Testing'] },
        { key: 'os', topics: ['Process Scheduling', 'Memory Management', 'Thread Concurrency', 'File Systems'] },
        { key: 'operating', topics: ['Process Scheduling', 'Memory Management', 'Thread Concurrency', 'File Systems'] },
        { key: 'web', topics: ['Component Lifecycle', 'Virtual DOM', 'State Management', 'REST APIs'] },
        { key: 'react', topics: ['Component Lifecycle', 'Virtual DOM', 'State Management', 'REST APIs'] },
        { key: 'deep', topics: ['Supervised Learning', 'Loss Optimization', 'Neural Layers', 'Model Evaluation'] },
        { key: 'ai', topics: ['Supervised Learning', 'Loss Optimization', 'Neural Layers', 'Model Evaluation'] },
        { key: 'machine', topics: ['Supervised Learning', 'Loss Optimization', 'Neural Layers', 'Model Evaluation'] },
        { key: 'ml', topics: ['Supervised Learning', 'Loss Optimization', 'Neural Layers', 'Model Evaluation'] }
      ];

      let solvedTopics = [...extractedTopics];
      const match = fallbackTopics.find(f => cleanTitleLower.includes(f.key) || slugLower.includes(f.key));
      
      if (match) {
        match.topics.forEach(t => {
          if (solvedTopics.length < 4 && !solvedTopics.includes(t)) {
            solvedTopics.push(t);
          }
        });
      }

      // Final ultimate fallbacks if still less than 4
      const defaultSats = ['Core Concepts', 'Architecture', 'Deployment', 'Verification'];
      defaultSats.forEach(t => {
        if (solvedTopics.length < 4 && !solvedTopics.includes(t)) {
          solvedTopics.push(t);
        }
      });

      // Capitalize 'cloud' nicely to 'Cloud Computing' for premium layout
      const displayTitle = cleanTitleLower === 'cloud' ? 'Cloud Computing' : cleanTitle;

      return {
        id: lab.slug,
        slug: lab.slug,
        label: displayTitle,
        link: `/labs/${lab.slug}`,
        cx, cy,
        satellites: [
          { id: `${lab.slug}-sat-1`, label: solvedTopics[0], dx: -105, dy: -32 },
          { id: `${lab.slug}-sat-2`, label: solvedTopics[1], dx: 105, dy: -32 },
          { id: `${lab.slug}-sat-3`, label: solvedTopics[2], dx: -105, dy: 32 },
          { id: `${lab.slug}-sat-4`, label: solvedTopics[3], dx: 105, dy: 32 }
        ]
      };
    }
  });

  const svgCanvasHeight = Math.max(700, 110 + dynamicGraphData.length * 160 + 50);

const completedLabs = new Set();
  if (performance && performance.activityLog) {
    performance.activityLog.forEach(act => {
      if (act.type === 'LAB' && act.completed) {
        const normalizedTitle = act.title.toLowerCase();
        if (normalizedTitle.includes('linear regression')) completedLabs.add('linear-regression');
        if (normalizedTitle.includes('matrix multiplication') || normalizedTitle.includes('matrix operations')) completedLabs.add('matrix-multiplication');
        if (normalizedTitle.includes('sorting')) completedLabs.add('sorting-algorithms');
        if (normalizedTitle.includes('quantum')) completedLabs.add('advanced-quantum-computing');
        if (normalizedTitle.includes('blockchain')) completedLabs.add('blockchain-ledger');
        if (normalizedTitle.includes('deep learning')) completedLabs.add('deep-learning-basics');
      }
    });
  }
  const coveredTopics = new Set(
    (performance && performance.coveredTopics) 
      ? performance.coveredTopics.map(t => t.toLowerCase().trim()) 
      : []
  );

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
                <div className="p-6 bg-cyan-950/20 border border-[var(--accent-cyan)]/20 rounded-xl relative overflow-hidden">
                  <p className="text-[var(--page-text)] text-base leading-relaxed font-medium text-gray-200">
                    {performance.summary}
                  </p>
                </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Exam Readiness & Confidence Visualization */}
          {/* Next-Gen Personalized Interactive Curriculum Node Graph Map */}
          <div className="lg:col-span-2 glass-card p-6 md:p-8 relative overflow-hidden group">
             <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-all duration-700 pointer-events-none"></div>
             
             <div className="flex justify-between items-center mb-6 border-b border-[var(--glass-border)] pb-4 relative z-10">
               <h2 className="text-2xl font-bold flex items-center gap-3">
                 <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-[var(--accent-cyan)] text-white flex items-center justify-center shadow-lg">🎯</span> 
                 Dynamic Curriculum Map
               </h2>
               <div className="flex items-center gap-4">
                 <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                   Green = Covered
                 </span>
                 <span className="text-[10px] font-black uppercase tracking-widest bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] px-3 py-1 rounded-full border border-[var(--accent-cyan)]/30 animate-pulse">
                   Auto-Calibrated
                 </span>
               </div>
             </div>

             <div className="relative w-full overflow-x-auto custom-scrollbar mt-4 z-10" style={{ minHeight: `${svgCanvasHeight}px` }}>
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes dataFlow {
                    to {
                      stroke-dashoffset: -30;
                    }
                  }
                  @keyframes rotateDash {
                    to {
                      stroke-dashoffset: 40;
                    }
                  }
                  @keyframes pulseGlowGreen {
                    0% {
                      filter: drop-shadow(0 0 3px rgba(16, 185, 129, 0.4));
                    }
                    50% {
                      filter: drop-shadow(0 0 14px rgba(16, 185, 129, 0.8));
                    }
                    100% {
                      filter: drop-shadow(0 0 3px rgba(16, 185, 129, 0.4));
                    }
                  }
                  @keyframes pulseGlowPurple {
                    0% {
                      filter: drop-shadow(0 0 3px rgba(168, 85, 247, 0.3));
                    }
                    50% {
                      filter: drop-shadow(0 0 12px rgba(168, 85, 247, 0.6));
                    }
                    100% {
                      filter: drop-shadow(0 0 3px rgba(168, 85, 247, 0.3));
                    }
                  }
                  .flowing-line-active {
                    animation: dataFlow 1.5s linear infinite;
                  }
                  .pulse-glow-green {
                    animation: pulseGlowGreen 2s infinite ease-in-out;
                  }
                  .pulse-glow-purple {
                    animation: pulseGlowPurple 2.5s infinite ease-in-out;
                  }
                  .spinning-ring {
                    animation: rotateDash 12s linear infinite;
                  }
                `}} />

                <svg viewBox={`0 0 640 ${svgCanvasHeight}`} width="100%" height={svgCanvasHeight} className="mx-auto block bg-black/15 rounded-2xl border border-[var(--glass-border)] shadow-2xl">
                  <defs>
                    {/* Glowing gradients */}
                    <radialGradient id="greenGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
                      <stop offset="100%" stopColor="#047857" stopOpacity="0.8" />
                    </radialGradient>
                    <radialGradient id="purpleGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="1" />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.8" />
                    </radialGradient>
                    <radialGradient id="cyanGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#00e5ff" stopOpacity="1" />
                      <stop offset="100%" stopColor="#00b4d8" stopOpacity="0.8" />
                    </radialGradient>
                    <radialGradient id="darkNodeGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#1e1b4b" stopOpacity="1" />
                      <stop offset="100%" stopColor="#0f0b29" stopOpacity="0.9" />
                    </radialGradient>
                  </defs>

                  {/* Central Spine Path linking core lab reactor cores */}
                  <line 
                    x1="320" 
                    y1="110" 
                    x2="320" 
                    y2={110 + (dynamicGraphData.length - 1) * 160} 
                    stroke="rgba(168, 85, 247, 0.25)" 
                    strokeWidth="2.5" 
                    strokeDasharray="6, 6" 
                  />

                  {/* Render Curved Pipelines */}
                  {dynamicGraphData.map((lab) => {
                    const isLabCompleted = completedLabs.has(lab.slug);
                    return lab.satellites.map((sat) => {
                      const isSatCovered = coveredTopics.has(sat.id.toLowerCase());
                      const isPathActive = isLabCompleted || isSatCovered;
                      
                      // Create dynamic curved quadratic Bezier path anchor coords
                      const startX = lab.cx;
                      const startY = lab.cy;
                      const endX = lab.cx + sat.dx;
                      const endY = lab.cy + sat.dy;
                      // Interpolate middle control points to make curved routes
                      const cpX = lab.cx + sat.dx * 0.3;
                      const cpY = lab.cy + sat.dy * 0.7;

                      return (
                        <g key={`${lab.id}-${sat.id}`}>
                          <path 
                            d={`M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`}
                            fill="transparent"
                            stroke={isPathActive ? '#10b981' : 'rgba(108, 43, 217, 0.2)'} 
                            strokeWidth={isPathActive ? '2' : '1.2'}
                            strokeDasharray="4, 4"
                            className={isPathActive ? "flowing-line-active" : ""}
                            opacity={isPathActive ? 0.9 : 0.4}
                          />
                        </g>
                      );
                    });
                  })}

                  {/* Render Core Lab Hubs & Orbiting Satellites */}
                  {dynamicGraphData.map((lab) => {
                    const isLabCompleted = completedLabs.has(lab.slug);
                    const metaLab = nodeMetaInfo[lab.slug] || {};
                    return (
                      <g key={lab.id} className="cursor-pointer group/lab">
                        {/* Outer satellite nodes rendering */}
                        {lab.satellites.map((sat) => {
                          const isSatCovered = coveredTopics.has(sat.id.toLowerCase());
                          const satDesc = nodeMetaInfo[sat.id] || `Explore the core lessons and fundamental guidelines behind this topic.`;
                          
                          // Dynamic layout coordinates to avoid ALL text overlaps
                          let labelX = lab.cx + sat.dx;
                          let labelY = lab.cy + sat.dy + 20; // Default: below
                          let labelAnchor = "middle";

                          if (sat.dx < 0) {
                            // Left-side satellite -> text flows leftwards
                            labelX = lab.cx + sat.dx - 16;
                            labelY = lab.cy + sat.dy + 4;
                            labelAnchor = "end";
                          } else {
                            // Right-side satellite -> text flows rightwards
                            labelX = lab.cx + sat.dx + 16;
                            labelY = lab.cy + sat.dy + 4;
                            labelAnchor = "start";
                          }

                          return (
                            <g 
                              key={sat.id} 
                              className="cursor-pointer group/sat"
                              onMouseEnter={() => showNodeInfo({
                                   type: 'satellite',
                                   label: sat.label,
                                   id: sat.id,
                                   completed: isSatCovered,
                                   description: satDesc,
                                   recommendation: 'Click study notes to explore simple explanations and examples.',
                                   link: `/topic/${sat.id}`,
                                   x: lab.cx + sat.dx,
                                   y: lab.cy + sat.dy
                                 })}
                              onMouseLeave={hideNodeInfo}
                            >
                              <Link to={`/topic/${sat.id}`}>
                                {/* Halo glowing circle behind satellite nodes */}
                                <circle 
                                  cx={lab.cx + sat.dx} 
                                  cy={lab.cy + sat.dy} 
                                  r={hoveredNode && hoveredNode.id === sat.id ? 20 : 16} 
                                  fill="transparent"
                                  stroke={isSatCovered ? 'rgba(16, 185, 129, 0.2)' : 'transparent'}
                                  strokeWidth="2.5"
                                  className="animate-pulse"
                                />
                                <circle 
                                  cx={lab.cx + sat.dx} 
                                  cy={lab.cy + sat.dy} 
                                  r={hoveredNode && hoveredNode.id === sat.id ? 13 : 10} 
                                  fill={isSatCovered ? 'url(#greenGlow)' : 'url(#darkNodeGlow)'} 
                                  stroke={hoveredNode && hoveredNode.id === sat.id ? '#00e5ff' : (isSatCovered ? '#34d399' : 'rgba(0, 229, 255, 0.4)')} 
                                  strokeWidth="2"
                                  className={isSatCovered ? 'pulse-glow-green' : ''}
                                />
                                <text 
                                  x={labelX} 
                                  y={labelY} 
                                  textAnchor={labelAnchor} 
                                  fill={isSatCovered ? '#34d399' : '#9ca3af'}
                                  fontSize="9.5" 
                                  fontWeight="black"
                                  className="pointer-events-none select-none transition-all duration-300 group-hover/sat:fill-white font-sans tracking-wide"
                                >
                                  {sat.label}
                                </text>
                              </Link>
                            </g>
                          );
                        })}

                        {/* Central Hub Node clickable Link to Lab */}
                        <g
                          onMouseEnter={() => showNodeInfo({
                            type: 'lab',
                            label: lab.label,
                            slug: lab.slug,
                            completed: isLabCompleted,
                            description: metaLab.desc || 'Launch virtual learning simulator.',
                            recommendation: metaLab.tip || 'Friendly, hands-on visual environment.',
                            link: lab.link,
                            x: lab.cx,
                            y: lab.cy
                          })}
                          onMouseLeave={hideNodeInfo}
                        >
                          <Link to={lab.link}>
                            {/* Pulsing Spinning HUD Ring */}
                            <circle 
                              cx={lab.cx} 
                              cy={lab.cy} 
                              r="36" 
                              fill="transparent" 
                              stroke={isLabCompleted ? '#10b981' : 'rgba(168, 85, 247, 0.3)'} 
                              strokeWidth="1.5" 
                              strokeDasharray="6, 4" 
                              className="spinning-ring"
                              opacity={isLabCompleted ? 0.9 : 0.4}
                            />
                            {/* Central Hub Base Node Circles */}
                            <circle 
                              cx={lab.cx} 
                              cy={lab.cy} 
                              r="28" 
                              fill="transparent" 
                              stroke={isLabCompleted ? 'rgba(16,185,129,0.2)' : 'rgba(108,43,217,0.15)'} 
                              strokeWidth="3" 
                              className={isLabCompleted ? "pulse-glow-green" : "pulse-glow-purple"}
                            />
                            <circle 
                              cx={lab.cx} 
                              cy={lab.cy} 
                              r={hoveredNode && hoveredNode.slug === lab.slug ? 25 : 22} 
                              fill={isLabCompleted ? 'url(#greenGlow)' : 'url(#purpleGlow)'} 
                              stroke={hoveredNode && hoveredNode.slug === lab.slug ? '#00e5ff' : (isLabCompleted ? '#34d399' : '#c084fc')} 
                              strokeWidth="2"
                            />
                            {/* Human readable indicator (first letters or index) */}
                            <text 
                              x={lab.cx} 
                              y={lab.cy + 4} 
                              textAnchor="middle" 
                              fill="#ffffff" 
                              fontSize="12" 
                              fontWeight="black" 
                              className="pointer-events-none select-none font-sans"
                            >
                              🧪
                            </text>
                            {/* Core Lab Label beneath the node */}
                            <text 
                              x={lab.cx} 
                              y={lab.cy + 48} 
                              textAnchor="middle" 
                              fill={isLabCompleted ? '#34d399' : '#e9d5ff'}
                              fontSize="10" 
                              fontWeight="black"
                              className="pointer-events-none select-none transition-all duration-300 group-hover/lab:fill-white font-sans tracking-wider"
                            >
                              {lab.label}
                            </text>
                          </Link>
                        </g>
                      </g>
                    );
                  })}
                </svg>
                {/* Sleek Floating Info Tooltip - Floating precisely next to the active hovered node */}
                {hoveredNode && (
                  <div 
                    onMouseEnter={() => {
                       if (hideTimeoutId) {
                          clearTimeout(hideTimeoutId);
                          setHideTimeoutId(null);
                       }
                    }}
                    onMouseLeave={hideNodeInfo}
                    className="absolute bg-black/95 backdrop-blur-md border border-purple-500/45 rounded-2xl p-5 shadow-[0_0_35px_rgba(168,85,247,0.4)] animate-fade-in z-30 transition-all duration-300"
                    style={{
                      left: hoveredNode.x <= 320 
                        ? `calc(${(hoveredNode.x / 640) * 100}% + 25px)` 
                        : `calc(${(hoveredNode.x / 640) * 100}% - 305px)`,
                      top: `calc(${(hoveredNode.y / svgCanvasHeight) * 100}% - 85px)`, 
                      width: '280px',
                      pointerEvents: 'auto'
                    }}
                  >
                     <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                          hoveredNode.type === 'lab' 
                            ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' 
                            : 'bg-cyan-500/15 text-[var(--accent-cyan)] border-[var(--accent-cyan)]/30'
                        }`}>
                          {hoveredNode.type === 'lab' ? '🧪 Virtual Lab' : '📖 Lesson Concept'}
                        </span>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                          hoveredNode.completed 
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                            : 'bg-zinc-800/15 text-zinc-400 border-zinc-700/30'
                        }`}>
                          {hoveredNode.completed ? 'Completed' : 'Not Started'}
                        </span>
                     </div>
                     
                     <h3 className="text-base font-black text-white mb-2 tracking-wide">
                        {hoveredNode.label}
                     </h3>
                     
                     <p className="text-xs text-gray-300 leading-relaxed font-semibold mb-4">
                        {hoveredNode.description}
                     </p>

                     {hoveredNode.recommendation && (
                       <div className="mb-4 p-2.5 bg-zinc-950/40 border border-zinc-900/60 rounded-lg text-[11px] text-[var(--muted-text)] font-semibold leading-relaxed">
                         <span className="text-purple-400 font-bold uppercase tracking-wider block mb-0.5 text-[9px]">Mentor Guide</span>
                         {hoveredNode.recommendation}
                       </div>
                     )}
                     
                     <Link 
                       to={hoveredNode.link}
                       className="inline-flex items-center gap-2 text-xs font-black text-[var(--accent-cyan)] hover:text-cyan-300 transition-colors uppercase tracking-wider"
                     >
                       {hoveredNode.type === 'lab' ? 'Enter Simulation' : 'Read Lesson Notes'} <FiArrowRight className="text-sm" />
                     </Link>
                  </div>
                )}
              
             
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

        {/* Activity Log */}
        <div className="mt-8 glass-card p-8 shadow-lg hover:shadow-[0_0_30px_rgba(108,43,217,0.15)] transition-all">
           <h2 className="text-2xl font-bold mb-6 border-b border-[var(--glass-border)] pb-4 flex items-center gap-2">
             <span className="text-green-500">🕒</span> Activity Log
           </h2>
           
           <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
             {performance.activityLog && performance.activityLog.length > 0 ? (
               performance.activityLog.reduce((acc, curr) => {
                 // Deduplicate by type and title, keeping only the most recent (since it's pre-sorted by date)
                 if (!acc.find(item => item.type === curr.type && item.title === curr.title)) {
                   acc.push(curr);
                 }
                 return acc;
               }, []).map((activity) => (
                 <div key={activity.id} className="group flex items-center justify-between bg-[var(--panel-bg-strong)] p-5 rounded-xl border border-[var(--glass-border)] hover:border-[var(--accent-cyan)]/30 hover:shadow-[0_0_20px_rgba(0,229,255,0.05)] transition-all transform hover:-translate-y-0.5">
                   <div className="flex items-center gap-5">
                     <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-inner ${
                       activity.type === 'LAB' ? 'bg-blue-500/20 text-blue-500' :
                       activity.type === 'QUIZ' ? 'bg-yellow-500/20 text-yellow-500' :
                       activity.type === 'CODE' ? 'bg-purple-500/20 text-purple-500' :
                       'bg-red-500/20 text-red-500'
                     }`}>
                       {activity.type === 'LAB' ? '🧪' : activity.type === 'QUIZ' ? '📝' : activity.type === 'CODE' ? '💻' : '🏆'}
                     </div>
                     <div>
                       <h3 className="font-bold text-md text-[var(--page-text)] group-hover:text-[var(--accent-cyan)] transition-colors">{activity.title}</h3>
                       <p className="text-xs text-[var(--muted-text)] flex gap-2 items-center mt-1">
                         <span className="bg-black/30 px-2 py-0.5 rounded text-[10px] font-mono border border-white/5">{formatTimeAgo(activity.date)}</span>
                         •
                         <span className="uppercase tracking-widest text-[10px] font-black">{activity.type}</span>
                       </p>
                     </div>
                   </div>
                   <div className="text-right flex flex-col items-end gap-1">
                     <div className="text-lg font-black text-[var(--accent-cyan)]">{Math.round(activity.score)}%</div>
                     {activity.type === 'EXAM' ? (
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${activity.passed ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                         {activity.passed ? 'Passed' : 'Failed'}
                       </span>
                     ) : activity.type !== 'QUIZ' ? (
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${activity.completed ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                         {activity.completed ? 'Completed' : 'In Progress'}
                       </span>
                     ) : null}
                   </div>
                 </div>
               ))
             ) : (
               <div className="text-center p-8 text-[var(--muted-text)] font-medium">No activity recorded yet. Time to hit the labs!</div>
             )}
           </div>
        </div>

      </div>
    </div>
  </div>
</div>
  );
}
