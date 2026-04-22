import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminLabContentEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Settings');
  const [errorTabs, setErrorTabs] = useState([]);
  const [activeEmojiPicker, setActiveEmojiPicker] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const token = localStorage.getItem('token');
  
  const commonEmojis = ['📘', '🎓', '📚', '🧪', '⚛️', '🔬', '💻', '🧮', '📈', '🌐', '🚀', '💡', '📝', '🎬', '🎧', '🔧', '⚙️', '📂', '📱', '⭐', '🏆', '🧠', '📡', '🎯'];

  useEffect(() => {
    const fetchLab = async () => {
      if (!slug) {
         setLab({
           title: '',
           slug: '',
           description: '',
           category: 'Custom',
           difficulty: 'Beginner',
           simulationType: 'flow',
           status: 'UPCOMING',
           tabs: {
              introduction: [], prerequisites: [], objective: [], targetAudience: [],
              courseAlignment: { alignment: [], typicalPart: [] },
              resources: [], quiz: [], learnCode: { learnContent: [], testContent: [] },
              quizSettings: { timeLimit: 10 }
           }
         });
         setLoading(false);
         return;
      }

      try {
         const response = await fetch(`http://localhost:5000/api/labs/${slug}`);
         if (!response.ok) throw new Error('Lab not found');
         const data = await response.json();
         
         if (!data.tabs) data.tabs = {};
         if (!data.tabs.introduction) data.tabs.introduction = [];
         if (!data.tabs.prerequisites) data.tabs.prerequisites = [];
         if (!data.tabs.objective) data.tabs.objective = [];
         if (!data.tabs.targetAudience) data.tabs.targetAudience = [];
         if (!data.tabs.courseAlignment) data.tabs.courseAlignment = { alignment: [], typicalPart: [] };
         if (!data.tabs.resources) data.tabs.resources = [];
         if (!data.tabs.quiz) data.tabs.quiz = [];
         if (!data.tabs.learnCode) data.tabs.learnCode = { learnContent: [], testContent: [] };
         if (!data.tabs.quizSettings) data.tabs.quizSettings = { timeLimit: 10 };
         
         setLab(data);
      } catch (err) {
         console.error(err);
         alert("Could not load lab.");
      } finally {
         setLoading(false);
      }
    };
    fetchLab();
  }, [slug]);

  const saveLab = async () => {
    const invalidTabs = [];
    if (!lab.title || !lab.slug) invalidTabs.push('Settings');
    
    const introHasErr = (lab.tabs?.introduction || []).some(b => !b.type);
    if (introHasErr) invalidTabs.push('Introduction');

    const preReqHasErr = (lab.tabs?.prerequisites || []).some(p => !p.title);
    if (preReqHasErr) invalidTabs.push('Pre-Requisites');

    const quizHasErr = (lab.tabs?.quiz || []).some(q => !q.question || !q.answer || !q.options || q.options.length === 0);
    if (quizHasErr) invalidTabs.push('Quiz');

    const learnHasErr = (lab.tabs?.learnCode?.learnContent || []).some(l => !l.step || !l.code) || 
                        (lab.tabs?.learnCode?.testContent || []).some(t => !t.title || !t.expectedAnswer);
    if (learnHasErr) invalidTabs.push('Learn Code');

    if (invalidTabs.length > 0) {
       setErrorTabs(invalidTabs);
       alert(`Validation Error: Please fill all required fields in the highlighted tabs (${invalidTabs.join(', ')}).`);
       return;
    }
    setErrorTabs([]);

    try {
       const url = lab._id ? `http://localhost:5000/api/labs/${lab._id}` : 'http://localhost:5000/api/labs';
       const method = lab._id ? 'put' : 'post';
       const res = await axios({
         method,
         url,
         data: lab,
         headers: { Authorization: `Bearer ${token}` }
       });
       
       if (!lab._id && res.data && res.data.slug) {
          alert('Lab Created Successfully! You can now continue adding content or jump to the Builder.');
          navigate(`/admin/lab/${res.data.slug}/edit`);
       } else {
          alert('Lab Content Saved Successfully!');
       }
    } catch (err) {
       console.error(err);
       if (err.response && err.response.data && err.response.data.message) {
          alert('Error saving lab content: ' + err.response.data.message);
       } else {
          alert('Error saving lab content');
       }
    }
  };

  if (loading) return <div className="pt-32 text-center text-white h-screen bg-[#05010a]">Loading Editor...</div>;
  if (!lab) return <div className="pt-32 text-center text-red-500 h-screen bg-[#05010a]">Error loading lab.</div>;

  const tabsConfig = [
    'Settings', 'Introduction', 'Pre-Requisites', 'Objective', 'Target Audience', 'Course Alignment', 'Resources', 'Learn Code', 'Quiz'
  ];

  /* ---------------- HANDLERS ---------------- */
  // Update Lab Root Fields
  const updateLab = (field, value) => {
    let updates = { [field]: value };
    if (field === 'title' && !lab._id) {
       updates.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    setLab({ ...lab, ...updates });
  };

  // Update tabs fields
  const updateTab = (field, value) => {
    setLab({ ...lab, tabs: { ...lab.tabs, [field]: value } });
  };

  // Generic array update
  const updateArrayItem = (collection, idx, field, value) => {
    const newArr = [...lab.tabs[collection]];
    newArr[idx] = { ...newArr[idx], [field]: value };
    updateTab(collection, newArr);
  };
  const addArrayItem = (collection, defaultObj) => {
    updateTab(collection, [...lab.tabs[collection], defaultObj]);
  };
  const removeArrayItem = (collection, idx) => {
    const newArr = [...lab.tabs[collection]];
    newArr.splice(idx, 1);
    updateTab(collection, newArr);
  };

  // Introduction Rich Blocks Helper
  const introArr = Array.isArray(lab.tabs.introduction) ? lab.tabs.introduction : [];
  const updateIntroBlock = (idx, field, val) => {
    const newArr = [...introArr];
    newArr[idx] = { ...newArr[idx], [field]: val };
    updateTab('introduction', newArr);
  };
  const removeIntroBlock = (idx) => {
    const newArr = [...introArr];
    newArr.splice(idx, 1);
    updateTab('introduction', newArr);
  };
  const addIntroBlock = (type) => {
    updateTab('introduction', [...introArr, { type, text: '' }]);
  };

  const handleImageUpload = async (e, callback) => {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('image', file);
      
      setIsUploading(true);
      try {
          const res = await axios.post(`http://localhost:5000/api/upload`, formData, {
              headers: {
                 'Content-Type': 'multipart/form-data',
                 'Authorization': `Bearer ${token}`
              }
          });
          callback(res.data.url);
      } catch (err) {
          alert("Image Upload Failed: " + (err.response?.data?.msg || err.message));
      } finally {
          setIsUploading(false);
      }
  };

  const handleZipUpload = async (e) => {
     const file = e.target.files[0];
     if (!file) return;
     
     const formData = new FormData();
     formData.append('simulationZip', file);
     
     setIsUploading(true);
     try {
        const res = await axios.post(`http://localhost:5000/api/labs/upload-simulation`, formData, {
           headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
           },
           onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
           }
        });
        updateLab('simulationPath', res.data.simulationPath);
        alert('Simulation package uploaded, expanded, and uniquely mounted successfully!');
     } catch(err) {
        alert("ZIP Extraction Fault: " + (err.response?.data?.message || err.message));
     } finally {
        setIsUploading(false);
        setUploadProgress(0);
     }
  };

  /* ---------------- RENDERERS ---------------- */
  const renderSettings = () => (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">Global Lab Settings</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div>
           <label className="block text-xs font-bold text-[#00e5ff] mb-2 uppercase tracking-wide">Title</label>
           <input value={lab.title || ''} onChange={e => updateLab('title', e.target.value)} className="w-full bg-black/50 border border-white/10 focus:border-[#00e5ff] rounded-lg p-3 text-white transition-colors" />
         </div>
         <div>
           <label className="block text-xs font-bold text-[#00e5ff] mb-2 uppercase tracking-wide">URL Slug</label>
           <input value={lab.slug || ''} onChange={e => updateLab('slug', e.target.value)} className="w-full bg-black/50 border border-white/10 focus:border-[#00e5ff] rounded-lg p-3 text-white transition-colors" />
         </div>
         <div className="col-span-1 md:col-span-2">
           <label className="block text-xs font-bold text-yellow-400 mb-2 uppercase tracking-wide">Card Thumbnail / Cover Banner</label>
           <div className="flex gap-4 items-center bg-black/50 border border-white/10 focus-within:border-yellow-400 rounded-lg p-2 transition-colors">
              <label className={`cursor-pointer shrink-0 ${isUploading ? 'bg-yellow-600/50' : 'bg-yellow-600 hover:bg-yellow-500'} text-white font-bold py-2 px-4 rounded transition-colors text-sm`}>
                 {isUploading ? 'Uploading...' : 'Upload Cover Image'}
                 <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateLab('thumbnail', url))} disabled={isUploading} className="hidden" />
              </label>
              <input value={lab.thumbnail || ''} onChange={e => updateLab('thumbnail', e.target.value)} placeholder="/assets/default_lab_banner.jpg or Web URL" className="flex-1 bg-transparent border-none outline-none text-[#00e5ff] text-sm" />
              {lab.thumbnail && <img src={lab.thumbnail} className="h-10 w-16 object-cover rounded shadow border border-white/10 shrink-0" alt="Preview"/>}
           </div>
         </div>
         <div className="relative">
           <label className="block text-xs font-bold text-[#00e5ff] mb-2 uppercase tracking-wide">Lab Status</label>
           <select value={lab.status || 'ACTIVE'} onChange={e => updateLab('status', e.target.value)} className="w-full bg-black/50 border border-white/10 focus:border-[#00e5ff] rounded-lg p-3 text-white transition-colors appearance-none cursor-pointer">
              <option value="ACTIVE">🔓 ACTIVE (Public View)</option>
              <option value="LOCKED">🔒 LOCKED (Restricted View)</option>
              <option value="UPCOMING">⚡ UPCOMING (Coming Soon Highlight)</option>
           </select>
           <div className="absolute top-10 right-4 pointer-events-none text-white text-xs">▼</div>
         </div>
         <div>
           <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Lock / Coming Soon Message</label>
           <input value={lab.statusMessage || ''} onChange={e => updateLab('statusMessage', e.target.value)} placeholder="e.g. Requires Lifetime Pro" disabled={lab.status === 'ACTIVE'} className={`w-full bg-black/50 border rounded-lg p-3 text-white transition-colors ${lab.status === 'ACTIVE' ? 'border-transparent text-gray-600 opacity-50 cursor-not-allowed' : 'border-purple-500 focus:border-[#00e5ff]'}`} />
         </div>
         <div>
           <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Category</label>
           <input value={lab.category || ''} onChange={e => updateLab('category', e.target.value)} className="w-full bg-black/50 border border-white/10 focus:border-purple-500 rounded-lg p-3 text-white transition-colors" />
         </div>
         <div>
           <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Difficulty</label>
           <input value={lab.difficulty || ''} onChange={e => updateLab('difficulty', e.target.value)} className="w-full bg-black/50 border border-white/10 focus:border-purple-500 rounded-lg p-3 text-white transition-colors" />
         </div>
         <div>
           <label className="block text-xs font-bold text-purple-400 mb-2 uppercase tracking-wide">Simulation Engine Layout</label>
           <div className="relative">
             <select 
                value={lab.simulationType || 'flow'} 
                onChange={e => updateLab('simulationType', e.target.value)} 
                className="w-full bg-black/50 border border-white/10 focus:border-purple-500 rounded-lg p-3 text-white transition-colors appearance-none cursor-pointer"
             >
                <option value="flow">Flow Based Nodes (General)</option>
                <option value="iframe">External Pre-built Upload (IFrame)</option>
                <option value="matrix-multiplication">Legacy: Matrix Multiplication</option>
                <option value="linear-regression">Legacy: Linear Regression</option>
                <option value="cnn">CNN Visualizer</option>
             </select>
             <div className="absolute top-4 right-4 pointer-events-none text-white text-xs">▼</div>
           </div>
         </div>
       </div>
       
       {lab.simulationType === 'iframe' && (
         <div className="bg-white/5 border border-indigo-500/30 p-5 rounded-xl shadow-lg mt-4 animate-fade-in relative overflow-hidden">
            <h3 className="font-bold text-indigo-400 mb-2 uppercase text-xs tracking-widest flex items-center gap-2">
              <span className="text-xl">📦</span> Iframe Package Deployment
            </h3>
            <p className="text-gray-400 text-sm mb-4">Upload a zipped React build (dist.zip) containing an `index.html`. It will be securely mounted.</p>
            <div className="flex gap-4 items-center">
               <label className={`cursor-pointer ${isUploading ? 'bg-indigo-500/50' : 'bg-indigo-600 hover:bg-indigo-500'} text-white font-bold py-2 px-4 rounded transition-colors`}>
                  {isUploading ? `Extracting... ${uploadProgress}%` : 'Upload .ZIP Bundle'}
                  <input type="file" accept=".zip" onChange={handleZipUpload} disabled={isUploading} className="hidden" />
               </label>
               {lab.simulationPath && (
                 <span className="text-xs font-mono bg-black/50 px-3 py-2 rounded border border-green-500/30 text-green-400 flex items-center gap-2 max-w-[50%] overflow-hidden">
                    <span className="shrink-0">✓ Mounted:</span> 
                    <span className="truncate" title={lab.simulationPath}>{lab.simulationPath}</span>
                 </span>
               )}
            </div>
            {isUploading && (
               <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
            )}
         </div>
       )}

       <div>
         <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Description</label>
         <textarea value={lab.description || ''} onChange={e => updateLab('description', e.target.value)} className="w-full bg-black/50 border border-white/10 focus:border-purple-500 rounded-lg p-3 text-white h-24 resize-none transition-colors" />
       </div>
    </div>
  );

  const renderIntroductionBlocks = (blocksArray, updateBlockFn, removeBlockFn, indexPrefix = '') => {
    return blocksArray.map((block, idx) => (
       <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-xl relative group mb-4 shadow-sm">
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
             <button onClick={() => removeBlockFn(idx)} className="text-red-500 hover:text-red-400 bg-red-500/10 px-2 py-1 rounded text-xs font-bold border border-red-500/30">DELETE BLOCK</button>
          </div>
          <div className="mb-4">
             <span className="bg-[#00e5ff]/20 text-[#00e5ff] px-3 py-1 rounded-full text-xs font-bold uppercase border border-[#00e5ff]/30">{block.type}</span>
          </div>
          <div className="space-y-4">
             {['split-image', 'alert-red'].includes(block.type) && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Title</label>
                  <input value={block.title || ''} onChange={e => updateBlockFn(idx, 'title', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded pt-2 pb-2 px-3 text-sm text-white" />
                </div>
             )}
             <div>
               <label className="block text-xs font-bold text-gray-400 mb-1">Main Content / Text (HTML Allowed)</label>
               <textarea value={block.text || ''} onChange={e => updateBlockFn(idx, 'text', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded pt-2 pb-2 px-3 text-sm text-white h-20 resize-none custom-scrollbar font-mono" />
             </div>
             {['alert-red'].includes(block.type) && (
                <div>
                  <label className="block text-xs font-bold text-red-400 mb-1">Red Highlight Box Text</label>
                  <input value={block.highlight || ''} onChange={e => updateBlockFn(idx, 'highlight', e.target.value)} className="w-full bg-black/50 border border-red-500/30 rounded pt-2 pb-2 px-3 text-sm text-white focus:border-red-500" />
                </div>
             )}
             {['split-image', 'glass-box', 'alert-red'].includes(block.type) && (
                <div>
                  <label className="block text-xs font-bold text-[#00e5ff] mb-1">Image Block Upload</label>
                  <div className="flex gap-2 items-center">
                    <label className={`cursor-pointer ${isUploading ? 'bg-[#00e5ff]/50' : 'bg-[#00e5ff] hover:bg-cyan-400'} text-black font-bold py-1.5 px-4 rounded transition-colors text-xs shrink-0 tracking-wide`}>
                       {isUploading ? 'Uploading...' : 'Upload Local Image'}
                       <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateBlockFn(idx, 'imageUrl', url))} disabled={isUploading} className="hidden" />
                    </label>
                    <input value={block.imageUrl || ''} onChange={e => updateBlockFn(idx, 'imageUrl', e.target.value)} placeholder="/assets/img.png or Manual URL" className="w-full bg-black/50 border border-white/10 rounded pt-2 pb-2 px-3 text-sm text-[#00e5ff]" />
                  </div>
                </div>
             )}
             {['split-image'].includes(block.type) && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Code Snippet (Optional)</label>
                  <textarea value={block.codeSnippet || ''} onChange={e => updateBlockFn(idx, 'codeSnippet', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded pt-2 pb-2 px-3 text-sm text-purple-300 font-mono h-24 resize-none" />
                </div>
             )}
          </div>
       </div>
    ));
  };

  const renderIntroduction = () => (
    <div>
       <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">Introduction Builder</h2>
       {renderIntroductionBlocks(introArr, updateIntroBlock, removeIntroBlock)}
       <div className="bg-[#110b27] border border-dashed border-white/20 p-6 rounded-xl text-center mt-6">
          <p className="text-gray-400 mb-4 text-sm">Add dynamic block to section</p>
          <div className="flex flex-wrap justify-center gap-3">
             <button onClick={() => addIntroBlock('paragraph')} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold transition">Paragraph</button>
             <button onClick={() => addIntroBlock('header-cyan')} className="bg-white/10 hover:bg-[#00e5ff]/20 text-[#00e5ff] px-4 py-2 rounded-lg text-sm font-bold transition">Cyan Header</button>
             <button onClick={() => addIntroBlock('glass-box')} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold transition">Glass Box</button>
             <button onClick={() => addIntroBlock('alert-red')} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-bold transition">Red Alert Box</button>
             <button onClick={() => addIntroBlock('split-image')} className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg text-sm font-bold transition">Split Box</button>
          </div>
       </div>
    </div>
  );

  const renderPreRequisites = () => {
    const preReqArr = lab.tabs.prerequisites;
    return (
      <div>
         <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">Pre-Requisites Setup</h2>
         <p className="text-gray-400 mb-6 text-sm">Create expandable accordion items with a large side image and rich content body.</p>
         {preReqArr.map((item, idx) => (
           <div key={idx} className="bg-white/5 border border-[#00e5ff]/20 p-5 rounded-xl mb-6 shadow-lg shadow-[#00e5ff]/5">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#00e5ff] text-lg">Accordion Item #{idx+1}</h3>
                <button onClick={() => removeArrayItem('prerequisites', idx)} className="text-red-500 hover:text-red-400 bg-red-500/10 px-3 py-1.5 rounded text-xs font-bold border border-red-500/30 transition">Remove Accordion</button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                   <label className="block text-xs font-bold text-gray-400 mb-1">Accordion Title</label>
                   <input value={item.title || ''} onChange={e => updateArrayItem('prerequisites', idx, 'title', e.target.value)} placeholder="e.g. 1. Understanding Matrices" className="w-full bg-black/50 border border-white/10 rounded pt-2 pb-2 px-3 text-sm text-white" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-400 mb-1">Side Image Upload</label>
                   <div className="flex gap-2 items-center">
                      <label className={`cursor-pointer ${isUploading ? 'bg-purple-500/50' : 'bg-purple-600 hover:bg-purple-500'} text-white font-bold py-1.5 px-4 rounded transition-colors text-xs shrink-0 tracking-wide`}>
                         {isUploading ? 'Uploading...' : 'Upload Image'}
                         <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateArrayItem('prerequisites', idx, 'image', url))} disabled={isUploading} className="hidden" />
                      </label>
                      <input value={item.image || ''} onChange={e => updateArrayItem('prerequisites', idx, 'image', e.target.value)} placeholder="/assets/image_name.png or Manual URL" className="w-full bg-black/50 border border-white/10 rounded pt-2 pb-2 px-3 text-sm text-[#00e5ff]" />
                   </div>
                </div>
             </div>

             {/* Pre-requisite Body (Rich Blocks) */}
             <div className="bg-black/40 border border-white/5 p-4 rounded-xl mt-4">
                <label className="block text-xs font-bold text-purple-400 mb-4 uppercase tracking-widest">Body Content (Rich Blocks)</label>
                {renderIntroductionBlocks(item.body || [], 
                  (blockIdx, field, val) => {
                     const updatedBody = [...(item.body || [])];
                     updatedBody[blockIdx] = { ...updatedBody[blockIdx], [field]: val };
                     updateArrayItem('prerequisites', idx, 'body', updatedBody);
                  },
                  (blockIdx) => {
                     const updatedBody = [...(item.body || [])];
                     updatedBody.splice(blockIdx, 1);
                     updateArrayItem('prerequisites', idx, 'body', updatedBody);
                  }
                )}
                
                <div className="flex flex-wrap gap-2 mt-4">
                   <span className="text-xs text-gray-500 py-1 font-bold uppercase mr-2">Add Sub-Block:</span>
                   {['paragraph', 'glass-box', 'alert-red'].map(type => (
                     <button key={type} onClick={() => {
                        const updatedBody = [...(item.body || []), { type, text: '' }];
                        updateArrayItem('prerequisites', idx, 'body', updatedBody);
                     }} className="bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1 rounded text-xs font-bold transition">{type}</button>
                   ))}
                </div>
             </div>
           </div>
         ))}
         
         <button onClick={() => addArrayItem('prerequisites', { title: '', image: '', body: [] })} className="w-full py-4 border-2 border-dashed border-[#00e5ff]/30 text-[#00e5ff] rounded-xl hover:bg-[#00e5ff]/10 transition font-bold">
            + Add Pre-Requisite Accordion Component
         </button>
      </div>
    );
  };

  const renderObjective = () => (
    <div>
       <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">Lab Objectives Setup</h2>
       <p className="text-gray-400 mb-6 text-sm">Add bullet points. These render as styled glowing numbers in a glassmorphism card.</p>
       <div className="space-y-3 mb-6">
          {lab.tabs.objective.map((obj, idx) => (
             <div key={idx} className="flex gap-3">
                <span className="bg-[#00e5ff]/20 text-[#00e5ff] w-10 h-10 rounded flex items-center justify-center font-bold shrink-0">{idx+1}</span>
                <input value={obj} onChange={e => {
                  const newObj = [...lab.tabs.objective];
                  newObj[idx] = e.target.value;
                  updateTab('objective', newObj);
                }} className="flex-1 bg-black/50 border border-white/10 focus:border-[#00e5ff] rounded px-4 text-white" placeholder="Understanding X..." />
                <button onClick={() => {
                   const newObj = [...lab.tabs.objective];
                   newObj.splice(idx, 1);
                   updateTab('objective', newObj);
                }} className="bg-red-500/20 text-red-400 hover:bg-red-500/40 px-4 rounded font-bold transition">X</button>
             </div>
          ))}
       </div>
       <button onClick={() => updateTab('objective', [...lab.tabs.objective, ''])} className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition font-bold">
         + Add Objective Point
       </button>
    </div>
  );

  const renderTargetAudience = () => (
    <div>
       <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">Target Audience Setup</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {lab.tabs.targetAudience.map((aud, idx) => (
             <div key={idx} className="bg-[#110b27] border border-[#00e5ff]/20 p-5 rounded-xl relative group shadow-lg">
                <button onClick={() => removeArrayItem('targetAudience', idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">✕</button>
                <input value={aud.title || ''} onChange={e => updateArrayItem('targetAudience', idx, 'title', e.target.value)} placeholder="Title (e.g. Undergraduates)" className="w-full bg-black/50 border border-white/10 focus:border-[#00e5ff] rounded px-3 py-2 text-white font-bold mb-3" />
                <textarea value={aud.desc || ''} onChange={e => updateArrayItem('targetAudience', idx, 'desc', e.target.value)} placeholder="Description..." className="w-full bg-black/50 border border-white/10 focus:border-[#00e5ff] rounded px-3 py-2 text-gray-300 text-sm h-16 resize-none" />
             </div>
          ))}
       </div>
       <button onClick={() => addArrayItem('targetAudience', { title: '', desc: '' })} className="w-full py-4 border border-dashed border-[#00e5ff]/50 text-[#00e5ff] rounded-xl hover:bg-[#00e5ff]/10 transition font-bold">
         + Add Target Audience Card
       </button>
    </div>
  );

  const renderCourseAlignment = () => {
     const align = lab.tabs.courseAlignment;
     return (
      <div>
         <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">Course Alignment Setup</h2>
         
         <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-300 mb-4">Aligned Curriculum Concepts</h3>
            <div className="space-y-3 mb-4">
               {align.alignment?.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                     <input value={item} onChange={e => {
                        const newArr = [...align.alignment];
                        newArr[idx] = e.target.value;
                        updateTab('courseAlignment', { ...align, alignment: newArr});
                     }} className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-2 text-[#00e5ff] font-semibold focus:border-[#00e5ff]" />
                     <button onClick={() => {
                        const newArr = [...align.alignment];
                        newArr.splice(idx,1);
                        updateTab('courseAlignment', { ...align, alignment: newArr});
                     }} className="bg-red-500/20 text-red-500 px-4 rounded font-bold">✕</button>
                  </div>
               ))}
            </div>
            <button onClick={() => {
              updateTab('courseAlignment', { ...align, alignment: [...(align.alignment||[]), '']})
            }} className="py-2 px-4 bg-white/10 hover:bg-white/20 rounded text-sm text-white font-bold transition">+ Add Concept Alignment (Cyan Badge)</button>
         </div>

         <div className="bg-purple-900/10 border border-purple-500/30 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span className="text-2xl">🎓</span> Typical Part Of: (Degrees / Modules)</h3>
            <div className="space-y-3 mb-4">
               {align.typicalPart?.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                     <input value={item} onChange={e => {
                        const newArr = [...align.typicalPart];
                        newArr[idx] = e.target.value;
                        updateTab('courseAlignment', { ...align, typicalPart: newArr});
                     }} className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-2 text-purple-300 font-semibold focus:border-purple-500" />
                     <button onClick={() => {
                        const newArr = [...align.typicalPart];
                        newArr.splice(idx,1);
                        updateTab('courseAlignment', { ...align, typicalPart: newArr});
                     }} className="bg-red-500/20 text-red-500 px-4 rounded font-bold">✕</button>
                  </div>
               ))}
            </div>
            <button onClick={() => {
              updateTab('courseAlignment', { ...align, typicalPart: [...(align.typicalPart||[]), '']})
            }} className="py-2 px-4 bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 rounded text-sm font-bold transition">+ Add Typical Course Level String</button>
         </div>
      </div>
     );
  };

  const renderResources = () => (
    <div>
       <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">Resources Setup</h2>
       <p className="text-gray-400 mb-6 text-sm">Add related reading material, courses, tools, or references. Categorizes visually based on 'Type' or 'Icon Color'.</p>
       <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
          {lab.tabs.resources.map((res, idx) => (
             <div key={idx} className="bg-[#110b27] border border-white/10 p-5 rounded-xl flex flex-col gap-3 relative shadow-lg">
                <div className="flex justify-between items-center bg-black/50 p-2 rounded -mt-2 -mx-2 mb-2 border-b border-white/5">
                   <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Resource Box</span>
                   <button onClick={() => removeArrayItem('resources', idx)} className="text-red-500 px-2 rounded font-bold text-xs">Remove</button>
                </div>
                <div className="flex gap-3">
                   <div className="flex-1">
                      <label className="text-[10px] uppercase text-gray-500 font-bold">Badge Type</label>
                      <input value={res.type || ''} onChange={e => updateArrayItem('resources', idx, 'type', e.target.value)} placeholder="e.g. Course, Docs" className="w-full bg-black/50 border border-white/10 rounded px-3 py-1.5 text-xs text-white" />
                   </div>
                   <div className="flex-1 relative">
                      <label className="text-[10px] uppercase text-gray-500 font-bold">Icon Emoji</label>
                      <input 
                         value={res.icon || ''} 
                         onChange={e => updateArrayItem('resources', idx, 'icon', e.target.value)} 
                         onFocus={() => setActiveEmojiPicker(idx)}
                         placeholder="e.g. 📖, 💻" 
                         className="w-full bg-black/50 border border-white/10 rounded px-3 py-1.5 text-xs text-white" 
                      />
                      {activeEmojiPicker === idx && (
                         <div className="absolute top-full left-0 mt-2 bg-[#1a113d] border border-white/20 p-4 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 w-64 animate-page-enter">
                            <div className="flex justify-between items-center mb-3">
                               <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Select Emoji</span>
                               <button onClick={() => setActiveEmojiPicker(null)} className="text-red-400 font-bold text-xs bg-red-400/10 px-2 py-0.5 rounded hover:bg-red-400/20 transition">Close</button>
                            </div>
                            <div className="grid grid-cols-6 gap-2">
                               {commonEmojis.map(emoji => (
                                 <button 
                                    key={emoji} 
                                    onClick={() => { updateArrayItem('resources', idx, 'icon', emoji); setActiveEmojiPicker(null); }} 
                                    className="text-xl hover:bg-white/10 rounded p-1 transition hover:scale-110"
                                 >
                                   {emoji}
                                 </button>
                               ))}
                            </div>
                         </div>
                      )}
                   </div>
                   <div className="flex-1">
                      <label className="text-[10px] uppercase text-gray-500 font-bold">Color Code</label>
                      <select value={res.color || 'text-purple-400'} onChange={e => updateArrayItem('resources', idx, 'color', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-1.5 text-xs text-white outline-none">
                         <option value="text-purple-400">Purple</option>
                         <option value="text-[#00e5ff]">Cyan</option>
                         <option value="text-green-400">Green</option>
                         <option value="text-pink-400">Pink</option>
                         <option value="text-orange-400">Orange</option>
                         <option value="text-yellow-400">Yellow</option>
                      </select>
                   </div>
                </div>
                <div>
                   <label className="text-[10px] uppercase text-gray-500 font-bold">Title</label>
                   <input value={res.title || ''} onChange={e => updateArrayItem('resources', idx, 'title', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white font-bold" />
                </div>
                <div className="flex gap-3">
                   <div className="w-1/3">
                      <label className="text-[10px] uppercase text-gray-500 font-bold">Author</label>
                      <input value={res.author || ''} onChange={e => updateArrayItem('resources', idx, 'author', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-1.5 text-sm text-gray-300" />
                   </div>
                   <div className="w-2/3">
                      <label className="text-[10px] uppercase text-gray-500 font-bold">Link URL</label>
                      <input value={res.link || ''} onChange={e => updateArrayItem('resources', idx, 'link', e.target.value)} placeholder="https://..." className="w-full bg-black/50 border border-white/10 rounded px-3 py-1.5 text-sm text-[#00e5ff] font-mono" />
                   </div>
                </div>
             </div>
          ))}
       </div>
       <button onClick={() => addArrayItem('resources', { type: '', icon: '📘', title: '', author: '', link: '', color: 'text-purple-400' })} className="w-full py-4 border border-dashed border-[#00e5ff]/50 text-[#00e5ff] rounded-xl hover:bg-[#00e5ff]/10 transition font-bold">
         + Add External Resource Reference
       </button>
    </div>
  );

  const renderLearnCode = () => {
    const data = lab.tabs.learnCode || { learnContent: [], testContent: [] };
    
    return (
    <div>
       <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">Learn Code Setup (Dual Mode)</h2>
       <p className="text-gray-400 mb-6 text-sm">Design structured algorithmic walkthroughs (Learn Mode) and fill-in-the-blank snippets (Test Mode).</p>
       
       <div className="mb-10">
          <h3 className="text-xl font-bold text-[#00e5ff] mb-4">Learn Mode Sequence</h3>
          {data.learnContent?.map((step, idx) => (
             <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 relative">
                <button onClick={() => {
                   const newArr = [...data.learnContent];
                   newArr.splice(idx,1);
                   updateTab('learnCode', { ...data, learnContent: newArr});
                }} className="absolute top-2 right-2 text-red-500 px-2 py-1 rounded font-bold text-xs opacity-75 hover:opacity-100 bg-red-500/10">✕ Remove</button>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                   <div>
                      <label className="text-xs text-gray-400 font-bold">Step Title</label>
                      <input value={step.step || ''} onChange={e => {
                         const n = [...data.learnContent];
                         n[idx].step = e.target.value; updateTab('learnCode', {...data, learnContent: n});
                      }} className="w-full bg-black/50 border border-white/10 rounded px-3 py-1.5 text-white" />
                   </div>
                   <div>
                      <label className="text-xs text-gray-400 font-bold">Summary String</label>
                      <input value={step.summary || ''} onChange={e => {
                         const n = [...data.learnContent];
                         n[idx].summary = e.target.value; updateTab('learnCode', {...data, learnContent: n});
                      }} className="w-full bg-black/50 border border-[#00e5ff]/30 rounded px-3 py-1.5 text-[#00e5ff] italic text-sm" />
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-xs text-purple-400 font-bold">Code Block (Monospace)</label>
                      <textarea value={step.code || ''} onChange={e => {
                         const n = [...data.learnContent];
                         n[idx].code = e.target.value; updateTab('learnCode', {...data, learnContent: n});
                      }} className="w-full bg-black/80 border border-white/10 rounded px-3 py-2 text-purple-300 font-mono text-xs h-32 custom-scrollbar resize-none font-bold" />
                   </div>
                   <div>
                      <label className="text-xs text-green-400 font-bold">Explanation (Use "Term: definition" for bolding)</label>
                      <textarea value={step.explanation || ''} onChange={e => {
                         const n = [...data.learnContent];
                         n[idx].explanation = e.target.value; updateTab('learnCode', {...data, learnContent: n});
                      }} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-gray-300 text-xs h-32 custom-scrollbar resize-none" placeholder="Term : This explains what it does... \nNext Term : Another explanation..."/>
                   </div>
                </div>
             </div>
          ))}
          <button onClick={() => {
             updateTab('learnCode', { ...data, learnContent: [...(data.learnContent||[]), {step:'', code:'', explanation:'', summary:''}]})
          }} className="py-2 px-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition text-sm">+ Add Learn Sequence Step</button>
       </div>

       <div>
          <h3 className="text-xl font-bold text-yellow-500 mb-4">Test Mode Code Fill-in-the-blanks</h3>
          {data.testContent?.map((tItem, idx) => (
             <div key={idx} className="bg-[#110b27] border border-yellow-500/20 rounded-xl p-4 mb-4 flex flex-col gap-3 relative">
                <button onClick={() => {
                   const newArr = [...data.testContent];
                   newArr.splice(idx,1);
                   updateTab('learnCode', { ...data, testContent: newArr});
                }} className="absolute top-2 right-2 text-red-500 px-2 py-1 rounded font-bold text-xs opacity-75 hover:opacity-100 bg-red-500/10">✕</button>
                
                <div className="flex gap-4">
                   <div className="flex-1">
                      <label className="text-xs text-gray-400 font-bold">Question Title</label>
                      <input value={tItem.title || ''} onChange={e => {
                         const n = [...data.testContent]; n[idx].title = e.target.value; updateTab('learnCode', {...data, testContent: n});
                      }} className="w-full bg-black/50 border border-white/10 rounded px-3 py-1.5 text-[#00e5ff] font-bold" />
                   </div>
                   <div className="flex-1">
                      <label className="text-xs text-gray-400 font-bold">Expected Input Answer</label>
                      <input value={tItem.expectedAnswer || ''} onChange={e => {
                         const n = [...data.testContent]; n[idx].expectedAnswer = e.target.value; updateTab('learnCode', {...data, testContent: n});
                      }} className="w-full bg-black/50 border border-green-500/50 rounded px-3 py-1.5 text-green-400 font-mono font-bold" />
                   </div>
                </div>
                
                <div className="flex gap-2 items-center bg-black/50 p-2 rounded border border-white/5">
                   <input value={tItem.preCode || ''} onChange={e => {
                      const n = [...data.testContent]; n[idx].preCode = e.target.value; updateTab('learnCode', {...data, testContent: n});
                   }} placeholder="Prefix Code" className="w-1/3 bg-transparent text-gray-400 font-mono outline-none text-right placeholder:text-gray-700" />
                   <div className="w-1/6 border-b-2 border-yellow-500 text-center font-bold font-mono text-yellow-500">[{tItem.expectedAnswer}]</div>
                   <input value={tItem.postCode || ''} onChange={e => {
                      const n = [...data.testContent]; n[idx].postCode = e.target.value; updateTab('learnCode', {...data, testContent: n});
                   }} placeholder="Suffix Code" className="w-1/3 bg-transparent text-gray-400 font-mono outline-none placeholder:text-gray-700" />
                </div>
             </div>
          ))}
          <button onClick={() => {
             updateTab('learnCode', { ...data, testContent: [...(data.testContent||[]), {title:'', preCode:'', expectedAnswer:'', postCode:''}]})
          }} className="py-2 px-4 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 font-bold rounded-lg transition text-sm">+ Add Code Blank Layout</button>
       </div>
    </div>
  )};

  const renderQuiz = () => {
    const settings = lab.tabs.quizSettings || { timeLimit: 10 };
    return (
    <div>
       <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">Knowledge Quiz Setup</h2>
       <p className="text-gray-400 mb-6 text-sm">Standalone MCQ evaluations tied solely to the context of this specific lab.</p>
       
       {/* Global Quiz Settings */}
       <div className="bg-[#110b27] border border-white/10 p-6 rounded-2xl mb-8 flex gap-6 items-center shadow-lg">
          <div className="flex-1">
             <label className="text-xs text-[#00e5ff] font-bold uppercase tracking-widest block mb-2">Total Quiz Time (Minutes)</label>
             <input type="number" min="1" value={settings.timeLimit || 10} onChange={e => updateTab('quizSettings', { ...settings, timeLimit: parseInt(e.target.value) || 1 })} className="w-full max-w-50 bg-black/50 border border-white/10 focus:border-[#00e5ff] rounded p-2 text-white font-bold text-center outline-none" />
          </div>
       </div>

       <div className="space-y-6 mb-6">
          {lab.tabs.quiz?.map((q, idx) => (
             <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl relative group">
                <button onClick={() => removeArrayItem('quiz', idx)} className="absolute top-4 right-4 bg-red-500/10 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded text-xs font-bold transition">Delete Question</button>
                <div className="mb-6 pr-24">
                   <label className="text-xs text-[#00e5ff] font-bold uppercase block mb-2">Question {idx+1}</label>
                   <textarea value={q.question || ''} onChange={e => updateArrayItem('quiz', idx, 'question', e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg p-3 text-white focus:border-[#00e5ff] resize-none h-16 font-semibold shadow-inner" placeholder="E.g. What condition must be met..." />
                </div>
                
                <div className="mb-6 bg-black/40 border border-white/5 p-5 rounded-xl">
                   <label className="text-xs text-gray-400 font-bold uppercase block mb-4">Options (Select Radio Button for Correct Answer)</label>
                   <div className="space-y-3">
                     {(q.options || []).map((opt, optIdx) => (
                        <div key={optIdx} className="flex gap-3 items-center group">
                           <input type="radio" name={`correct-${idx}`} checked={(q.answer || '') === opt && opt !== ''} onChange={() => updateArrayItem('quiz', idx, 'answer', opt)} className="w-5 h-5 accent-green-500 cursor-pointer" />
                           <input value={opt} onChange={e => {
                              const newOpts = [...(q.options || [])];
                              newOpts[optIdx] = e.target.value;
                              const newAns = q.answer === opt ? e.target.value : q.answer;
                              const newQuizArr = [...lab.tabs.quiz];
                              newQuizArr[idx] = { ...q, options: newOpts, answer: newAns };
                              updateTab('quiz', newQuizArr);
                           }} className={`flex-1 bg-black/50 border outline-none ${q.answer === opt && opt !== '' ? 'border-green-500/50 text-green-400 font-bold shadow-[0_0_10px_rgba(34,197,94,0.1)]' : 'border-white/10 text-gray-300'} rounded-lg p-3 text-sm focus:border-white/30 transition-colors`} placeholder={`Option ${optIdx+1}`} />
                           <button onClick={() => {
                              const newOpts = [...(q.options || [])];
                              newOpts.splice(optIdx, 1);
                              const newAns = q.answer === opt ? '' : q.answer;
                              const newQuizArr = [...lab.tabs.quiz];
                              newQuizArr[idx] = { ...q, options: newOpts, answer: newAns };
                              updateTab('quiz', newQuizArr);
                           }} className="text-red-500/50 hover:text-red-500 font-bold text-xl px-2 transition-colors">✕</button>
                        </div>
                     ))}
                   </div>
                   <button onClick={() => {
                      const newOpts = [...(q.options || []), ''];
                      updateArrayItem('quiz', idx, 'options', newOpts);
                   }} className="mt-4 text-xs font-bold text-[#00e5ff] uppercase hover:underline transition-all">+ Add Option</button>
                </div>

                <div>
                   <label className="text-xs text-purple-400 font-bold uppercase block mb-2">Concept Explanation (Shown on Analysis Review Screen)</label>
                   <textarea value={q.explanation || ''} onChange={e => updateArrayItem('quiz', idx, 'explanation', e.target.value)} className="w-full bg-purple-900/10 border border-purple-500/20 rounded-lg p-3 text-gray-300 text-sm focus:border-purple-500/50 outline-none resize-none h-20 placeholder:text-gray-500" placeholder="Explain the concept underlying this exact question..." />
                </div>
             </div>
          ))}
       </div>
       <button onClick={() => addArrayItem('quiz', { question: '', options: ['Option A', 'Option B'], answer: '', explanation: '' })} className="w-full py-5 border-2 border-dashed border-[#00e5ff]/30 text-[#00e5ff] rounded-2xl hover:bg-[#00e5ff]/10 hover:border-[#00e5ff]/60 transition font-bold text-lg">
          + Draft New MCQ Question
       </button>
    </div>
  )};

  return (
    <div className="min-h-screen bg-[#05010a] text-white pt-24 pb-20 font-sans flex animate-page-enter">
       
       <div className="w-64 shrink-0 bg-[#0a0510] border-r border-white/10 h-[calc(100vh-6rem)] sticky top-24 flex flex-col pt-6 z-20">
          <div className="px-6 mb-6">
             <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">CMS Editor</h2>
             <p className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-widest">{lab.slug}</p>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
             {tabsConfig.map((tab) => {
                const hasError = errorTabs.includes(tab);
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-all relative ${
                      isActive 
                        ? (hasError ? 'bg-linear-to-r from-red-600 to-red-500 text-white shadow-[0_4px_15px_rgba(220,38,38,0.3)]' : 'bg-linear-to-r from-[#6c2bd9] to-[#00e5ff] text-white shadow-[0_4px_15px_rgba(108,43,217,0.3)]')
                        : (hasError ? 'text-red-400 hover:bg-red-500/10 border border-red-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5')
                    }`}
                  >
                    {tab}
                    {hasError && <span className="absolute right-3 top-3 text-red-300">⚠️</span>}
                  </button>
                );
             })}
          </div>

          <div className="p-4 border-t border-white/10 mt-auto bg-black/50">
             <button onClick={saveLab} className="w-full py-3 bg-white text-black font-extrabold rounded-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition hover:-translate-y-1">
               SAVE TO SERVER
             </button>
             <button onClick={() => navigate('/admin/exams')} className="w-full py-3 text-gray-500 text-xs font-bold uppercase tracking-widest mt-2 hover:text-white transition">
               ← Exit to Dashboard
             </button>
          </div>
       </div>

       <div className="flex-1 p-8 md:p-12 max-w-6xl w-full mx-auto">
          <div className="bg-[#0a0510]/80 backdrop-blur-md border border-white/5 p-8 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] min-h-[70vh]">
             {activeTab === 'Settings' && renderSettings()}
             {activeTab === 'Introduction' && renderIntroduction()}
             {activeTab === 'Pre-Requisites' && renderPreRequisites()}
             {activeTab === 'Objective' && renderObjective()}
             {activeTab === 'Target Audience' && renderTargetAudience()}
             {activeTab === 'Course Alignment' && renderCourseAlignment()}
             {activeTab === 'Resources' && renderResources()}
             {activeTab === 'Learn Code' && renderLearnCode()}
             {activeTab === 'Quiz' && renderQuiz()}
          </div>
       </div>

    </div>
  );
}
