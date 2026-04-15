import React, { useState, useEffect } from 'react';
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

import MatrixSimulationHub from '../components/matrix-lab/MatrixSimulationHub';
import MatrixQuizComponent from '../components/matrix-lab/MatrixQuizComponent';
import MatrixLearnCodeComponent from '../components/matrix-lab/MatrixLearnCodeComponent';
import mathBasicsImg from '../assets/math_basics.png';
import pythonProgImg from '../assets/python_prog.png';
import matrixIntro1 from '../assets/matrix_intro_1.png';
import matrixIntro2 from '../assets/matrix_intro_2.png';
import matrixIntro3 from '../assets/matrix_intro_3.png';
import matrixPrereqDimensionsImg from '../assets/matrix_prereq_dimensions.png';
import matrixPrereqCompatibilityImg from '../assets/matrix_prereq_compatibility.png';
import matrixPrereqDotproductImg from '../assets/matrix_prereq_dotproduct.png';

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  if (submitted) {
    return (
      <div className="animate-page-enter max-w-2xl mx-auto bg-green-500/10 border border-green-500/50 p-10 rounded-2xl text-center shadow-[0_0_30px_rgba(34,197,94,0.2)]">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
           <span className="text-4xl">🎉</span>
        </div>
        <h3 className="text-3xl font-bold text-green-400 mb-4">Feedback Received!</h3>
        <p className="text-gray-300 text-lg">Thank you for helping us improve the Virtual Labs experience. Your response has been securely logged.</p>
        <button onClick={() => setSubmitted(false)} className="mt-8 text-sm text-green-500 hover:text-green-400 underline font-bold uppercase tracking-widest">Submit another response</button>
      </div>
    );
  }

  return (
    <div className="animate-page-enter max-w-3xl mx-auto">
      <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#00e5ff]">Experiment Feedback</h2>
      <div className="bg-[#110b27]/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>
         <p className="text-gray-300 text-lg mb-8 relative z-10 text-center font-bold">How would you rate your experience with the Matrix Multiplication simulation?</p>
         
         <div className="flex gap-2 mb-10 justify-center relative z-10">
            {[1, 2, 3, 4, 5].map((star) => (
               <button 
                 key={star}
                 type="button"
                 onClick={() => setRating(star)}
                 onMouseEnter={() => setHover(star)}
                 onMouseLeave={() => setHover(rating)}
                 className={`text-6xl transition-all ${star <= (hover || rating) ? 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] scale-110' : 'text-gray-600 hover:text-gray-500'}`}
               >
                 ★
               </button>
            ))}
         </div>

         <div className="flex flex-col gap-4 relative z-10">
            <label className="text-gray-400 font-bold uppercase tracking-widest text-sm">Additional Comments (Optional)</label>
            <textarea 
               value={feedbackText}
               onChange={(e) => setFeedbackText(e.target.value)}
               className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#00e5ff]/50 transition-colors h-32 resize-none shadow-inner"
               placeholder="Tell us what you loved or what we could improve..."
            />
         </div>

         <button 
            disabled={rating === 0}
            onClick={() => setSubmitted(true)}
            className={`w-full relative z-10 mt-8 py-4 rounded-xl font-bold text-lg transition-all ${rating === 0 ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5' : 'bg-gradient-to-r from-purple-600 to-[#00e5ff] text-white shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] hover:-translate-y-1'}`}
         >
            Submit Feedback
         </button>
      </div>
    </div>
  );
};

const MatrixPrerequisitesContent = () => {
  const [expandedTopic, setExpandedTopic] = useState(null);

  const topics = [
    { 
      id: "understanding", title: "1. Understanding Matrices", image: mathBasicsImg,
      body: (
        <div className="space-y-4">
           <p className="text-gray-300 text-lg">A matrix is a rectangular arrangement of numbers organized into rows and columns.</p>
           <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-[#00e5ff] inline-block">
              A = [ 2 &nbsp;5 &nbsp;7 ]<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;[ 1 &nbsp;3 &nbsp;4 ]
           </div>
           <ul className="text-gray-300 space-y-2 mt-4 text-lg">
             <li><strong className="text-purple-400">Rows</strong> → Horizontal elements (2, 5, 7)</li>
             <li><strong className="text-[#00e5ff]">Columns</strong> → Vertical elements (2, 1)</li>
           </ul>
           <h4 className="text-white font-bold uppercase tracking-widest mt-6 text-sm border-b border-white/10 pb-2">📌 Key Terms</h4>
           <ul className="text-gray-400 space-y-2">
             <li><b className="text-white">Element:</b> Each value inside the matrix (e.g., 2, 5, 7)</li>
             <li><b className="text-white">Row index (i):</b> Position of a row</li>
             <li><b className="text-white">Column index (j):</b> Position of a column</li>
           </ul>
        </div>
      )
    },
    { 
      id: "dimensions", title: "2. Matrix Dimensions", image: matrixPrereqDimensionsImg,
      body: (
        <div className="space-y-4">
           <p className="text-gray-300 text-lg">Every matrix has a defined size expressed mathematically as: <span className="font-bold text-white tracking-widest text-2xl bg-white/5 px-2 py-1 rounded">m × n</span></p>
           <ul className="text-gray-300 space-y-2 mt-4 text-lg bg-black/40 p-4 rounded-xl border border-white/5">
             <li><strong className="text-purple-400">m</strong> = number of rows</li>
             <li><strong className="text-[#00e5ff]">n</strong> = number of columns</li>
           </ul>
           <h4 className="text-white font-bold uppercase tracking-widest mt-6 text-sm border-b border-white/10 pb-2">📌 Example</h4>
           <p className="text-xl font-bold bg-[#110b27] border border-purple-500/30 p-4 rounded inline-block text-purple-300 shadow-lg">A = 2 × 3 matrix</p>
           <p className="text-gray-300 font-semibold mt-4">👉 This means it contains <b className="text-purple-400">2 rows</b> and <b className="text-[#00e5ff]">3 columns</b>.</p>
        </div>
      )
    },
    { 
      id: "compatibility", title: "3. Compatibility Condition", image: matrixPrereqCompatibilityImg,
      body: (
        <div className="space-y-4">
           <p className="text-gray-300 text-lg">Matrix multiplication is <b>not</b> always possible. It follows a highly strict validation boundary.</p>
           <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl mt-4">
             <p className="text-white font-semibold">👉 It is only valid when:</p>
             <p className="text-2xl font-bold text-red-500 mt-2 text-center drop-shadow-md">Cols of A <span className="text-white mx-2">=</span> Rows of B</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl shadow-inner">
                <h5 className="text-green-400 font-bold mb-2">✔ Valid Example:</h5>
                <p className="font-mono text-gray-300">A = <span className="text-white">2</span> × <b className="text-green-400 text-xl">3</b><br/>B = <b className="text-green-400 text-xl">3</b> × <span className="text-white">2</span></p>
                <p className="mt-3 text-sm text-green-300 font-bold uppercase">Multiplication Possible!</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl shadow-inner">
                <h5 className="text-red-400 font-bold mb-2">❌ Invalid Example:</h5>
                <p className="font-mono text-gray-300">A = <span className="text-white">2</span> × <b className="text-red-400 text-xl">3</b><br/>B = <b className="text-red-400 text-xl">2</b> × <span className="text-white">3</span></p>
                <p className="mt-3 text-sm text-red-300 font-bold uppercase">Multiplication Impossible!</p>
              </div>
           </div>

           <h4 className="text-white font-bold mt-6 text-xl border-b border-white/10 pb-2">🧠 Why this condition?</h4>
           <p className="text-gray-400">Because matrix multiplication pairs the <b className="text-purple-400">Rows of A</b> with the <b className="text-[#00e5ff]">Columns of B</b>. If their physical lengths don't match exactly, the elements run out, and pairing becomes impossible.</p>
        </div>
      )
    },
    { 
      id: "result", title: "4. Resultant Matrix Size", image: pythonProgImg,
      body: (
        <div className="space-y-4">
           <p className="text-gray-300 text-lg">If multiplication is mathematically valid, you can instantly predict the dimensions of the final output matrix!</p>
           <div className="bg-black/50 p-6 rounded-xl border border-white/10 mt-4 text-center font-mono text-xl shadow-[0_0_20px_rgba(0,0,0,0.5)]">
             <span className="text-purple-400">A (<b>m</b> × n)</span> <span className="text-gray-500 text-sm align-middle mx-4">MULTIPLIED BY</span> <span className="text-[#00e5ff]">B (n × <b>p</b>)</span>
           </div>
           <p className="text-center text-white mt-4 font-bold text-lg">👉 Result:</p>
           <div className="text-center">
             <span className="bg-gradient-to-r from-purple-500 to-[#00e5ff] text-transparent bg-clip-text font-extrabold text-5xl drop-shadow-lg">C (m × p)</span>
           </div>
           <h4 className="text-white font-bold uppercase tracking-widest mt-6 text-sm border-b border-white/10 pb-2">📌 Example</h4>
           <ul className="text-gray-400 space-y-1 font-mono text-lg bg-[#110b27] p-4 rounded">
             <li>A = <b className="text-white">2</b> × <span className="text-gray-600 line-through">3</span></li>
             <li>B = <span className="text-gray-600 line-through">3</span> × <b className="text-white">4</b></li>
             <li className="mt-2 text-[#00e5ff] font-bold">👉 Result = 2 × 4</li>
           </ul>
        </div>
      )
    },
    { 
      id: "dotproduct", title: "5. Dot Product (Core Concept)", image: matrixPrereqDotproductImg,
      body: (
        <div className="space-y-4">
           <p className="text-gray-300 text-lg">Matrix multiplication relies entirely on completing <b>dot products</b> iteratively across matrices.</p>
           <h4 className="text-white font-bold uppercase tracking-widest mt-6 text-sm border-b border-white/10 pb-2">📌 Definition</h4>
           <p className="text-gray-400">The dot product multiplies corresponding spatial elements in parallel vectors and adds them together into a single scalar value.</p>
           
           <div className="bg-black/60 border border-white/10 p-6 rounded-2xl overflow-x-auto shadow-inner my-6">
              <div className="font-mono text-lg text-white whitespace-nowrap min-w-max flex flex-col items-center gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-purple-400">[a₁ a₂ a₃]</span>
                  <span className="text-gray-500 text-xl font-bold">•</span>
                  <span className="text-[#00e5ff]">[b₁ b₂ b₃]ᵀ</span>
                </div>
                <span className="text-yellow-400 font-bold text-2xl">=</span>
                <span className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl tracking-widest font-bold">
                  (a₁<span className="text-gray-500">×</span>b₁) <span className="text-[#00e5ff]">+</span> (a₂<span className="text-gray-500">×</span>b₂) <span className="text-[#00e5ff]">+</span> (a₃<span className="text-gray-500">×</span>b₃)
                </span>
              </div>
           </div>

           <h4 className="text-white font-bold uppercase tracking-widest mt-6 text-sm border-b border-white/10 pb-2">📌 Example</h4>
           <div className="bg-[#110b27] border border-white/5 p-4 rounded-xl font-mono text-gray-300 text-lg">
             <p>[1 &nbsp;2 &nbsp;3] • [4 &nbsp;5 &nbsp;6]</p>
             <p className="mt-2 text-gray-500">= (1×4) + (2×5) + (3×6)</p>
             <p className="text-gray-500">= 4 + 10 + 18</p>
             <p className="mt-2 text-2xl text-[#00e5ff] font-bold">= 32</p>
           </div>
        </div>
      )
    }
  ];

  return (
    <div className="animate-page-enter max-w-4xl mx-auto pb-12">
      <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#00e5ff]">Pre-Requisites</h2>
      <p className="text-gray-300 mb-8 text-lg">Before executing the interactive multiplication simulation, ensure you have a strong intuitive grasp of spatial mapping and dimension rules. Click any topic to explore further.</p>
      
      <div className="space-y-4">
        {topics.map((topic) => (
          <div key={topic.id} className="bg-[#110b27] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300 shadow-lg group">
            <button 
              onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
              className="w-full flex items-center justify-between p-5 md:p-6 hover:bg-white/5 transition-colors focus:outline-none"
            >
              <div className="flex items-center gap-4">
                <span className="w-2 h-8 bg-[#00e5ff] rounded-full inline-block shadow-[0_0_10px_#00e5ff]"></span>
                <span className="text-xl md:text-2xl font-bold text-white tracking-wide group-hover:text-[#00e5ff] transition-colors">{topic.title}</span>
              </div>
              <span className={`text-[#00e5ff] text-2xl transition-transform duration-300 ${expandedTopic === topic.id ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedTopic === topic.id ? 'max-h-[1500px] opacity-100 border-t border-white/10' : 'max-h-0 opacity-0'}`}>
              <div className="p-6 md:p-8 flex flex-col xl:flex-row gap-8 items-start bg-black/40">
                <div className="w-full xl:w-2/5 shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.6)] group-hover:shadow-[0_0_30px_rgba(0,229,255,0.2)] transition-shadow duration-500">
                  <img src={topic.image} alt={topic.title} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex-1 w-full">
                  {topic.body}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function MatrixMultiplicationLabPage() {
  const [activeTab, setActiveTab] = useState('Introduction');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  const tabs = [
    { id: 'Introduction', icon: <PlayArrowIcon fontSize="small"/> },
    { id: 'Pre-Requisites', icon: <AssignmentIcon fontSize="small"/> },
    { id: 'Objective', icon: <HelpOutlineIcon fontSize="small"/> },
    { id: 'Simulation', icon: <AutoFixHighIcon fontSize="small"/> },
    { id: 'Test your Knowledge', icon: <QuizIcon fontSize="small"/> },
    { id: 'Learn Code', icon: <CodeIcon fontSize="small"/> },
    { id: 'Target Audience', icon: <GroupsIcon fontSize="small"/> },
    { id: 'Course Alignment', icon: <AccountTreeIcon fontSize="small"/> },
    { id: 'Resources', icon: <LibraryBooksIcon fontSize="small"/> },
    { id: 'Feedback', icon: <FeedbackIcon fontSize="small"/> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Introduction':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto pb-12">
            <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#00e5ff]">Matrix Multiplication</h2>
            
            <div className="space-y-8 text-gray-300 leading-relaxed text-lg">
              <p>
                Matrix multiplication is one of the most fundamental operations in linear algebra, forming the backbone of modern fields such as data science, artificial intelligence, computer graphics, and scientific computing. Unlike simple arithmetic multiplication, matrix multiplication follows a structured and rule-based process that combines rows and columns to produce meaningful results.
              </p>
              
              <h3 className="text-3xl font-bold text-white mt-10 border-b border-white/10 pb-4 flex items-center gap-3">
                 <span className="w-2 h-8 bg-purple-500 rounded-full inline-block"></span>
                 🔍 What is a Matrix?
              </h3>
              
              <div className="bg-[#110b27] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-shadow">
                <div className="flex-1">
                  <p className="mb-4">
                    A matrix is a rectangular arrangement of numbers organized into <b>rows</b> and <b>columns</b>. It is commonly used to represent structured data or mathematical relationships.
                  </p>
                  <p className="mb-4 font-mono text-[#00e5ff] bg-black/50 p-4 rounded-xl border border-white/5 inline-block">
                    A = [ 1  2 ]<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;[ 3  4 ]
                  </p>
                  <ul className="text-sm space-y-2">
                    <li><b className="text-purple-400">Rows</b> run horizontally (e.g., 1 2)</li>
                    <li><b className="text-purple-400">Columns</b> run vertically (e.g., 1, 3)</li>
                  </ul>
                  <p className="mt-4 italic">Matrices allow us to represent complex systems in a compact and efficient form.</p>
                </div>
                <div className="w-full md:w-1/2 p-2 relative bg-white rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                   <img src={matrixIntro2} alt="Matrix Example" className="w-full h-auto object-contain rounded-lg" />
                </div>
              </div>

              <h3 className="text-3xl font-bold text-white mt-10 border-b border-white/10 pb-4 flex items-center gap-3">
                 <span className="w-2 h-8 bg-[#00e5ff] rounded-full inline-block"></span>
                 🔍 What is Matrix Multiplication?
              </h3>

              <div className="bg-[#110b27] border border-white/10 py-10 px-6 rounded-2xl my-8 text-center flex flex-col xl:flex-row items-center shadow-2xl relative overflow-hidden gap-8">
                 <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#00e5ff]/5 blur-[70px] rounded-full pointer-events-none"></div>
                 <div className="flex-1 text-left z-10">
                   <p className="mb-6">
                     Matrix multiplication is a method of combining two matrices to produce a third matrix. However, it is not performed element-wise. Instead, it follows a specific rule:
                   </p>
                   <p className="font-bold text-xl text-[#00e5ff] bg-[#00e5ff]/5 border border-[#00e5ff]/20 p-6 rounded-xl uppercase tracking-widest leading-relaxed shadow-lg">
                     Each element of the resulting matrix is calculated by taking the <span className="text-white">dot product</span> of a row from the first matrix and a column from the second matrix.
                   </p>
                 </div>
                 <div className="w-full xl:w-2/3 shrink-0 rounded-2xl overflow-hidden bg-white shadow-[0_0_30px_rgba(0,229,255,0.2)] p-2">
                   <img src={matrixIntro1} alt="Matrix Multiplication Math" className="w-full h-auto object-contain rounded-xl" />
                 </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.15)] flex flex-col md:flex-row gap-8 items-center mt-10">
                 <div className="flex-1">
                   <h4 className="text-2xl font-bold text-red-500 mb-4 flex items-center gap-2">
                     <span className="text-3xl">⚠️</span> Key Rule (Very Important)
                   </h4>
                   <p className="text-gray-300 font-semibold mb-4">Matrix multiplication is only possible when:</p>
                   <p className="text-lg font-bold bg-black/60 p-4 border border-red-500/30 rounded-xl text-red-400">
                     👉 Number of columns in Matrix A = Number of rows in Matrix B
                   </p>
                   <p className="text-sm mt-4 text-gray-400">If this condition is not satisfied, multiplication cannot be performed.</p>
                 </div>
                 <div className="w-full md:w-1/2 p-2 bg-white rounded-xl shadow-lg border border-red-500/20">
                   <img src={matrixIntro3} alt="Matrix Dimensions Example" className="w-full h-auto object-contain rounded-lg" />
                 </div>
              </div>

              <h3 className="text-3xl font-bold text-white mt-12 mb-6 border-b border-white/10 pb-4">🧠 Intuition Behind Matrix Multiplication</h3>
              <p>Matrix multiplication can be understood as a process of transforming data.</p>
              <ul className="mb-6 space-y-4">
                 <li className="flex gap-4 items-center"><span className="text-xl bg-purple-500 w-8 h-8 rounded flex items-center justify-center font-bold">A</span> <span>represents <b>input values</b> or features</span></li>
                 <li className="flex gap-4 items-center"><span className="text-xl bg-[#00e5ff] text-black w-8 h-8 rounded flex items-center justify-center font-bold">B</span> <span>represents <b>rules, weights, or transformations</b></span></li>
              </ul>
              <p className="bg-white/5 border border-white/10 p-6 rounded-xl font-bold text-[#00e5ff] text-xl text-center shadow-inner">
                 👉 The result (A × B) represents the final transformed output
              </p>
              <p className="mt-4 italic text-sm text-gray-400 text-center">This is why matrix multiplication is heavily used in systems where inputs are processed through a set of rules.</p>

              <h3 className="text-3xl font-bold text-white mt-12 mb-8 border-b border-white/10 pb-4">🌍 Real-World Applications</h3>
              <p className="mb-6">Matrix multiplication is not just theoretical—it powers many real-world systems:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-[#110b27] border border-white/5 p-6 rounded-2xl hover:-translate-y-1 transition-transform border-l-4 border-l-[#00e5ff]">
                    <h4 className="text-xl font-bold text-white mb-2">🤖 AI & Machine Learning</h4>
                    <p className="text-gray-400 text-sm">Used to compute outputs in neural networks (input × weights)</p>
                 </div>
                 <div className="bg-[#110b27] border border-white/5 p-6 rounded-2xl hover:-translate-y-1 transition-transform border-l-4 border-l-purple-500">
                    <h4 className="text-xl font-bold text-white mb-2">🎮 Computer Graphics</h4>
                    <p className="text-gray-400 text-sm">Used for rotating, scaling, and transforming 2D/3D objects</p>
                 </div>
                 <div className="bg-[#110b27] border border-white/5 p-6 rounded-2xl hover:-translate-y-1 transition-transform border-l-4 border-l-green-400">
                    <h4 className="text-xl font-bold text-white mb-2">📊 Data Science</h4>
                    <p className="text-gray-400 text-sm">Used in feature transformations and data manipulation</p>
                 </div>
                 <div className="bg-[#110b27] border border-white/5 p-6 rounded-2xl hover:-translate-y-1 transition-transform border-l-4 border-l-yellow-400">
                    <h4 className="text-xl font-bold text-white mb-2">📡 Engineering & Physics</h4>
                    <p className="text-gray-400 text-sm">Used to model systems, signals, and mathematical transformations</p>
                 </div>
              </div>

              <h3 className="text-3xl font-bold text-white mt-16 mb-8 border-b border-white/10 pb-4">🧩 Why This Lab is Important</h3>
              <p className="mb-6 text-xl">
                 Understanding matrix multiplication conceptually is often challenging because students only see the final result, not the process.
              </p>
              <p className="mb-6 font-bold text-[#00e5ff]">This interactive lab is designed to:</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                 {[
                   'Break down matrix multiplication into clear, visual steps',
                   'Help you understand how each element is calculated',
                   'Allow you to experiment with different matrices',
                   'Build strong intuition through step-by-step simulation'
                 ].map((pt, i) => (
                    <li key={i} className="flex gap-3 items-center bg-white/5 p-4 rounded-xl border border-white/5">
                       <span className="text-[#00e5ff]">✦</span>
                       <span className="font-semibold text-gray-300">{pt}</span>
                    </li>
                 ))}
              </ul>

              <div className="bg-gradient-to-r from-purple-900/40 to-[#00e5ff]/20 border border-white/20 p-8 rounded-3xl mt-12 shadow-[0_0_30px_rgba(108,43,217,0.3)]">
                 <h4 className="text-2xl font-bold text-white mb-6">What You Will Experience in This Lab</h4>
                 <ul className="space-y-4">
                    {[
                      'Input your own matrices of different sizes',
                      'Validate whether multiplication is possible',
                      'Visualize how rows and columns interact',
                      'See each multiplication and addition step in real time',
                      'Observe how the final result matrix is constructed'
                    ].map((exp, i) => (
                       <li key={i} className="flex gap-4 items-start">
                          <span className="w-6 h-6 shrink-0 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm mt-0.5">{i+1}</span>
                          <span className="text-lg text-gray-200 font-medium">{exp}</span>
                       </li>
                    ))}
                 </ul>
              </div>

            </div>
          </div>
        );
      case 'Pre-Requisites':
        return <MatrixPrerequisitesContent />;
      case 'Objective':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#00e5ff]">Lab Objective</h2>
            
            <div className="bg-[#110b27]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
               {/* Decorative Gradient Blob */}
               <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#00e5ff]/10 blur-[100px] rounded-full pointer-events-none"></div>

               <p className="text-xl font-semibold text-white mb-8 leading-relaxed">
                  By the end of this experiment, students will be able to:
               </p>

               <ul className="space-y-6">
                  {['Understand how rows of one matrix interact with columns of another',
                    'Learn the compatibility condition: Columns of A must equal rows of B',
                    'Predict accurately whether a matrix multiplication operation is valid',
                    'Break down mathematical calculations into sequential element selections',
                    'Observe dot product summation operations in real-time visual simulation',
                    'Translate nested loops (i, j, k) logic linearly into programmatic functions'
                  ].map((objective, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                       <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 flex items-center justify-center text-[#00e5ff] font-bold shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                         {idx + 1}
                       </span>
                       <span className="text-lg text-gray-300 pt-1 leading-snug font-medium">
                         {objective}
                       </span>
                    </li>
                  ))}
               </ul>
            </div>
          </div>
        );
      case 'Simulation':
        return <MatrixSimulationHub />;
      case 'Test your Knowledge':
        return <MatrixQuizComponent />;
      case 'Learn Code':
        return <MatrixLearnCodeComponent />;
      case 'Target Audience':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#00e5ff]">Target Audience</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Undergraduate Students', desc: '(Computer Science, Mathematics, Physics)' },
                { title: 'Algorithm Enthusiasts', desc: 'Those learning complex O(n³) nested iteration mapping.' },
                { title: 'Graphics Developers', desc: 'Designers building 3D spatial grid transformations.' },
                { title: 'Data Scientists', desc: 'Engineers working with deep neural network input weights.' }
              ].map((audience, idx) => (
                 <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all cursor-default shadow-lg hover:-translate-y-1">
                    <h3 className="text-[#00e5ff] font-bold text-xl mb-3 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#00e5ff] shadow-[0_0_10px_#00e5ff]"></span>
                      {audience.title}
                    </h3>
                    <p className="text-gray-400 text-lg">{audience.desc}</p>
                 </div>
              ))}
            </div>
          </div>
        );
      case 'Course Alignment':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#00e5ff]">Course Alignment</h2>
            
            <div className="bg-[#110b27]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl mb-8">
              <h3 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">This experiment aligns with:</h3>
              <div className="flex flex-wrap gap-4">
                {['Linear Algebra Fundamentals', 'Data Structures & Algorithms', 'Machine Learning Foundations', 'Computer Graphics Math'].map((course, idx) => (
                  <span key={idx} className="bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30 px-6 py-3 rounded-full font-semibold shadow-[0_0_15px_rgba(0,229,255,0.1)] hover:bg-[#00e5ff]/20 transition-colors">
                    {course}
                  </span>
                ))}
              </div>
            </div>

            <div className="border border-purple-500/30 bg-purple-900/10 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start gap-6 shadow-[0_0_30px_rgba(108,43,217,0.15)]">
               <div className="w-16 h-16 bg-purple-500/20 rounded-full flex flex-shrink-0 items-center justify-center border border-purple-500/50 shadow-[0_0_20px_rgba(108,43,217,0.3)]">
                 <span className="text-3xl">🎓</span>
               </div>
               <div>
                 <h4 className="text-2xl font-bold text-white mb-4">It is typically part of:</h4>
                 <ul className="list-disc pl-6 text-gray-300 space-y-3 text-xl font-medium">
                   <li>1st / 2nd year Engineering Mathematics curriculum</li>
                   <li>Core Introductory CS Algorithm Modules</li>
                 </ul>
               </div>
            </div>
          </div>
        );
      case 'Resources':
        return (
          <div className="animate-page-enter max-w-5xl mx-auto pb-12">
            <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#00e5ff]">Learning Resources</h2>
            
            <div className="bg-[#110b27]/80 border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl mb-10">
               <p className="text-gray-300 text-lg leading-relaxed mb-4">
                 The curriculum content for this lab is mapped directly to the mathematical foundational syllabus of linear algebra. The learning experience is further enhanced through interactive simulation using the matrix renderer, enabling step-by-step visualization of matrix operations.
               </p>
               <p className="text-[#00e5ff] font-semibold text-lg">
                 To deepen understanding, the following curated resources are recommended:
               </p>
            </div>

            {/* 1. Conceptual Learning */}
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-3 mt-12">
              <span className="w-2 h-8 bg-purple-500 rounded-full inline-block"></span>1. Conceptual Learning (Mathematics)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {[
                 { type: 'Course', title: 'Matrix Multiplication', author: 'Khan Academy', link: 'https://www.khanacademy.org/math/linear-algebra/matrix-transformations/matrix-multiplication', icon: '📖', color: 'text-purple-400' },
                 { type: 'Lectures', title: 'Linear Algebra Lectures', author: 'MIT OpenCourseWare', link: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/', icon: '📖', color: 'text-blue-400' },
                 { type: 'Notes', title: 'Matrices Notes', author: 'Paul\'s Online Math Notes', link: 'https://tutorial.math.lamar.edu/Classes/Alg/Matrices.aspx', icon: '📖', color: 'text-green-400' }
              ].map((res, idx) => (
                 <a href={res.link} target="_blank" rel="noopener noreferrer" key={idx} className="bg-[#110b27] border border-white/5 p-6 rounded-2xl hover:border-white/20 transition-all hover:-translate-y-1 block group shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                       <span className="text-3xl">{res.icon}</span>
                       <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 bg-white/5 rounded flex-shrink-0 ${res.color}`}>{res.type}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#00e5ff] transition-colors mb-2 leading-tight">{res.title}</h3>
                    <p className="text-gray-400 text-sm">{res.author}</p>
                 </a>
              ))}
            </div>

            {/* 2. Programming & Implementation */}
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-3 mt-12">
              <span className="w-2 h-8 bg-[#00e5ff] rounded-full inline-block"></span>2. Programming & Implementation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {[
                 { type: 'Docs', title: 'NumPy Documentation', author: 'numpy.dot', link: 'https://numpy.org/doc/stable/reference/generated/numpy.dot.html', icon: '💻', color: 'text-[#00e5ff]' },
                 { type: 'Tutorial', title: 'Matrix Multiplication in Python', author: 'GeeksforGeeks', link: 'https://www.geeksforgeeks.org/python-program-multiply-two-matrices/', icon: '💻', color: 'text-green-400' },
                 { type: 'Guide', title: 'NumPy Matrices', author: 'W3Schools', link: 'https://www.w3schools.com/python/numpy/numpy_matrices.asp', icon: '💻', color: 'text-yellow-400' }
              ].map((res, idx) => (
                 <a href={res.link} target="_blank" rel="noopener noreferrer" key={idx} className="bg-[#110b27] border border-white/5 p-6 rounded-2xl hover:border-white/20 transition-all hover:-translate-y-1 block group shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                       <span className="text-3xl">{res.icon}</span>
                       <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 bg-white/5 rounded flex-shrink-0 ${res.color}`}>{res.type}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#00e5ff] transition-colors mb-2 leading-tight">{res.title}</h3>
                    <p className="text-gray-400 text-sm">{res.author}</p>
                 </a>
              ))}
            </div>

            {/* 3. Visualization & Interactive Tools */}
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-3 mt-12">
              <span className="w-2 h-8 bg-pink-500 rounded-full inline-block"></span>3. Visualization & Interactive Tools
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {[
                 { type: 'Tool', title: 'Matrix Calculator', author: 'Desmos', link: 'https://www.desmos.com/matrix', icon: '🎯', color: 'text-pink-400' },
                 { type: 'Tool', title: 'Linear Algebra Tools', author: 'GeoGebra', link: 'https://www.geogebra.org/matrix', icon: '🎯', color: 'text-purple-400' }
              ].map((res, idx) => (
                 <a href={res.link} target="_blank" rel="noopener noreferrer" key={idx} className="bg-[#110b27] border border-white/5 p-6 rounded-2xl hover:border-white/20 transition-all hover:-translate-y-1 block group shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                       <span className="text-3xl">{res.icon}</span>
                       <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 bg-white/5 rounded flex-shrink-0 ${res.color}`}>{res.type}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#00e5ff] transition-colors mb-2 leading-tight">{res.title}</h3>
                    <p className="text-gray-400 text-sm">{res.author}</p>
                 </a>
              ))}
            </div>

            {/* 4. Real-World Applications */}
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-3 mt-12">
              <span className="w-2 h-8 bg-orange-500 rounded-full inline-block"></span>4. Real-World Applications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {[
                 { type: 'Course', title: 'Machine Learning Courses', author: 'Coursera', link: 'https://www.coursera.org/learn/machine-learning', icon: '🤖', color: 'text-orange-400' },
                 { type: 'Graphics', title: 'Transformations', author: 'LearnOpenGL', link: 'https://learnopengl.com/Getting-started/Transformations', icon: '🎮', color: 'text-red-400' }
              ].map((res, idx) => (
                 <a href={res.link} target="_blank" rel="noopener noreferrer" key={idx} className="bg-[#110b27] border border-white/5 p-6 rounded-2xl hover:border-white/20 transition-all hover:-translate-y-1 block group shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                       <span className="text-3xl">{res.icon}</span>
                       <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 bg-white/5 rounded flex-shrink-0 ${res.color}`}>{res.type}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#00e5ff] transition-colors mb-2 leading-tight">{res.title}</h3>
                    <p className="text-gray-400 text-sm">{res.author}</p>
                 </a>
              ))}
            </div>

            {/* 5. Reference Books */}
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-3 mt-12">
              <span className="w-2 h-8 bg-green-500 rounded-full inline-block"></span>5. Reference Books
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              {[
                 { type: 'Book', title: 'Introduction to Linear Algebra', author: 'Gilbert Strang', link: '#', icon: '📘', color: 'text-green-400' },
                 { type: 'Book', title: 'Linear Algebra and Its Applications', author: 'David C. Lay', link: '#', icon: '📘', color: 'text-green-400' }
              ].map((res, idx) => (
                 <div key={idx} className="bg-[#110b27] border border-white/5 p-6 rounded-2xl shadow-lg flex items-center gap-6">
                    <span className="text-5xl">{res.icon}</span>
                    <div>
                       <span className={`text-xs font-bold uppercase tracking-widest ${res.color} mb-1 block`}>{res.type}</span>
                       <h3 className="text-xl font-bold text-white leading-tight">{res.title}</h3>
                    </div>
                 </div>
              ))}
            </div>
            
            <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-sm">
               <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Want to practice code?</h3>
                  <p className="text-gray-400">Join our open source community discord to collaborate on algorithms.</p>
               </div>
               <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all whitespace-nowrap border border-white/10 hover:border-white/30">
                  Join Discord Community
               </button>
            </div>
          </div>
        );
      case 'Feedback':
        return <FeedbackForm />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-white relative font-sans flex flex-col pt-32 animate-page-enter">
      
      {/* Background ambient glow matching Matrix schema */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6c2bd9]/20 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#00e5ff]/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>

      {/* Page Header */}
      <div className="px-8 max-w-[1500px] mx-auto mb-12 relative w-full border-b border-white/5 pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg flex items-center">
          Matrix Multiplication <span className="font-light text-gray-400 opacity-60 ml-3 text-3xl">| Interactive Lab</span>
        </h1>
      </div>

      {/* Content Layout */}
      <div className="flex flex-col md:flex-row gap-8 px-4 lg:px-8 max-w-[1500px] mx-auto w-full mb-32 flex-1 z-10">
        
        {/* Sticky Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0 flex flex-col">
          <div className="sticky top-32 glass-card p-2 shadow-2xl overflow-hidden bg-[#110b27] border-white/5 border">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-5 py-3.5 mb-1 rounded-lg transition-all duration-300 flex items-center gap-3 font-semibold text-sm ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#6c2bd9] to-[#00e5ff] text-white shadow-[0_4px_20px_rgba(0,229,255,0.3)]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={`${isActive ? 'text-white' : 'text-gray-500'} transition-colors`}>{tab.icon}</span>
                  {tab.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Content Area (No padding enforced wrapper if it's the simulation to maximize space) */}
        <div className={`flex-1 glass-card border border-white/5 bg-[#0a0510]/80 shadow-[0_0_50px_rgba(0,0,0,0.5)] ${activeTab === 'Simulation' ? 'p-0 pb-16 border-none bg-transparent shadow-none' : 'p-8 md:p-12 min-h-[600px]'}`}>
          {renderContent()}
        </div>

      </div>

      <WaveFooter />
    </div>
  );
}
