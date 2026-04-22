import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data states
  const [exams, setExams] = useState([]);
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [certificates, setCertificates] = useState([]);
  
  const [collections, setCollections] = useState([]);
  const [newCollection, setNewCollection] = useState({ title: '', examType: '', description: '', status: 'ACTIVE' });
  const [adminLabs, setAdminLabs] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);
  
  // Questions states
  const [examTypeFilter, setExamTypeFilter] = useState('FULL_STACK');
  const [newQuestion, setNewQuestion] = useState({ questionType: 'MCQ', questionText: '', options: '', correctAnswer: '', difficulty: 'easy', topic: '' });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDashboardData();
  }, [examTypeFilter]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [examsRes, usersRes, certsRes, collectionsRes, labsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/exam/all', { headers }).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/auth/users', { headers }).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/certificates/all', { headers }).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/examCollections').catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/labs').catch(() => ({ data: [] }))
      ]);
      
      setExams(examsRes.data || []);
      setUsers(usersRes.data || []);
      setCertificates(certsRes.data || []);
      setCollections(collectionsRes.data || []);
      setAdminLabs(labsRes.data || []);
      
      await fetchQuestions();
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/questions?examType=${examTypeFilter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(res.data || []);
    } catch (err) {
      console.error('Error fetching questions', err);
    }
  };

  const promoteUser = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/api/auth/users/${userId}/promote`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('User promoted successfully');
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.msg || 'Error promoting user');
    }
  };

  const addCollection = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/examCollections', newCollection, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Collection added!');
      setNewCollection({ title: '', examType: '', description: '', status: 'ACTIVE' });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.msg || 'Error adding collection');
    }
  };

  const toggleCollectionStatus = async () => {
    const col = collections.find(c => c.examType === examTypeFilter);
    if (!col) return;
    try {
      const newStatus = col.status === 'ACTIVE' ? 'UPCOMING' : 'ACTIVE';
      await axios.put(`http://localhost:5000/api/examCollections/${col._id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDashboardData();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const deleteCollection = async () => {
    const col = collections.find(c => c.examType === examTypeFilter);
    if (!col) return;
    if (!window.confirm(`Are you sure you want to delete the ${col.title} collection?`)) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/examCollections/${col._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const newCollections = collections.filter(c => c._id !== col._id);
      if (newCollections.length > 0) {
        setExamTypeFilter(newCollections[0].examType);
      } else {
        setExamTypeFilter('');
      }
      fetchDashboardData();
    } catch (err) {
      alert('Error deleting collection');
    }
  };

  const submitQuestion = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newQuestion,
        examType: examTypeFilter,
        options: newQuestion.questionType === 'NUMERICAL' ? [] : newQuestion.options.split(',').map(s => s.trim()),
        correctAnswer: newQuestion.correctAnswer.split(',').map(s => s.trim())
      };
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/questions/${editQuestionId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Question updated!');
      } else {
        await axios.post('http://localhost:5000/api/questions', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Question added!');
      }
      setNewQuestion({ questionType: 'MCQ', questionText: '', options: '', correctAnswer: '', difficulty: 'easy', topic: '' });
      setIsEditMode(false);
      setEditQuestionId(null);
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data?.msg || 'Error saving question');
    }
  };

  const handleEditQuestion = (q) => {
    setNewQuestion({
      questionType: q.questionType,
      questionText: q.questionText,
      options: q.options ? q.options.join(', ') : '',
      correctAnswer: q.correctAnswer ? q.correctAnswer.join(', ') : '',
      difficulty: q.difficulty,
      topic: q.topic
    });
    setIsEditMode(true);
    setEditQuestionId(q._id);
  };

  const deleteQuestion = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/questions/${id}?examType=${examTypeFilter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchQuestions();
    } catch (err) {
      alert('Error deleting question');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED': return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold">COMPLETED</span>;
      case 'DISQUALIFIED': return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold">DISQUALIFIED</span>;
      case 'IN_PROGRESS': return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-bold">IN PROGRESS</span>;
      default: return null;
    }
  };

  // Stats calculation
  const totalExams = exams.length;
  const totalUsers = users.length;
  const completedExams = exams.filter(e => e.status === 'COMPLETED').length;
  const passRate = totalExams > 0 ? ((certificates.length / totalExams) * 100).toFixed(1) : 0;
  const disqualifications = exams.filter(e => e.status === 'DISQUALIFIED').length;
  const disRate = totalExams > 0 ? ((disqualifications / totalExams) * 100).toFixed(1) : 0;

  if (loading) return <div className="p-20 text-center text-white">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-[#0a0510] pt-24 pb-12 px-8 text-white font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#6c2bd9]">System Administration</h1>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-800 pb-2 overflow-x-auto custom-scrollbar">
          {['overview', 'sessions', 'users', 'questions', 'certificates', 'labs'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-t-xl font-bold capitalize transition-all ${activeTab === tab ? 'bg-gradient-to-r from-[#6c2bd9]/40 to-[#00e5ff]/40 text-white border-b-2 border-[#00e5ff]' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl">
              <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Total Users</p>
              <h2 className="text-4xl font-extrabold text-white">{totalUsers}</h2>
            </div>
            <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl">
              <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Total Exam Sessions</p>
              <h2 className="text-4xl font-extrabold text-white">{totalExams}</h2>
            </div>
            <div className="glass-card bg-white/5 border border-white/10 p-6 rounded-2xl">
              <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Certification Rate</p>
              <h2 className="text-4xl font-extrabold text-[#00e5ff]">{passRate}%</h2>
            </div>
            <div className="glass-card bg-white/5 border border-red-500/30 p-6 rounded-2xl">
              <p className="text-red-400/80 text-sm font-bold uppercase tracking-wider mb-2">Disqualification Rate</p>
              <h2 className="text-4xl font-extrabold text-red-500">{disRate}%</h2>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
            <div className="w-full lg:w-1/3 bg-white/5 border border-white/10 rounded-xl overflow-hidden max-h-[70vh] flex flex-col">
              <div className="bg-black/50 p-4 border-b border-white/10 font-bold text-gray-300">Exam Sessions</div>
              <div className="overflow-y-auto custom-scrollbar flex-1">
                {exams.map(exam => (
                  <div 
                    key={exam._id} 
                    className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-white/10 transition ${selectedExam?._id === exam._id ? 'bg-white/10 border-l-4 border-l-[#00e5ff]' : ''}`}
                    onClick={() => setSelectedExam(exam)}
                  >
                    <div className="flex justify-between items-center mb-2">
                       <span className="font-semibold">{exam.userId?.firstName} {exam.userId?.lastName}</span>
                       {getStatusBadge(exam.status)}
                    </div>
                    <div className="text-xs text-gray-400 flex justify-between">
                       <span>{exam.examType}</span>
                       <span>{new Date(exam.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-2/3 bg-white/5 border border-white/10 rounded-xl p-6 min-h-[500px]">
              {selectedExam ? (
                 <div className="animate-fade-in">
                   <h2 className="text-2xl font-bold mb-4">{selectedExam.title} Details</h2>
                   
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                     <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                        <p className="text-xs text-gray-400 mb-1">Final Score</p>
                        <p className="text-xl font-bold text-[#00e5ff]">{selectedExam.score} / {selectedExam.maxScore}</p>
                     </div>
                     <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                        <p className="text-xs text-gray-400 mb-1">Cheater Score</p>
                        <p className={`text-xl font-bold ${selectedExam.cheatingScore >= 70 ? 'text-red-500' : 'text-green-500'}`}>{selectedExam.cheatingScore}</p>
                     </div>
                     <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                        <p className="text-xs text-gray-400 mb-1">Status</p>
                        <p className="mt-1">{getStatusBadge(selectedExam.status)}</p>
                     </div>
                     <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                        <p className="text-xs text-gray-400 mb-1">Questions Assessed</p>
                        <p className="text-xl font-bold text-gray-300">{selectedExam.answers?.length || 0}</p>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Violations Log</h3>
                        <ul className="space-y-2 text-sm bg-black/20 p-4 rounded-xl border border-white/5">
                          <li className="flex justify-between"><span className="text-gray-400">Tab Switches</span> <span className="font-mono text-white">{selectedExam.tabSwitches}</span></li>
                          <li className="flex justify-between"><span className="text-gray-400">No Face Context</span> <span className="font-mono text-white">{selectedExam.faceFlags}</span></li>
                          <li className="flex justify-between"><span className="text-gray-400">Multiple Faces</span> <span className="font-mono text-white">{selectedExam.multipleFaceEvents}</span></li>
                          <li className="flex justify-between"><span className="text-gray-400">Looks Away</span> <span className="font-mono text-white">{selectedExam.lookingAwayEvents}</span></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Timeline</h3>
                        <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                           {selectedExam.violations?.map((v, i) => (
                             <div key={i} className="bg-red-500/10 border border-red-500/20 p-2 rounded text-xs flex justify-between">
                               <span className="text-red-400 font-bold">{v.type}</span>
                               <span className="text-gray-500">{new Date(v.timestamp).toLocaleTimeString()}</span>
                             </div>
                           )) || <p className="text-gray-500 text-sm">No recorded violations.</p>}
                        </div>
                      </div>
                   </div>
                   
                   <div>
                     <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Evidentiary Snapshots</h3>
                     <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                        {selectedExam.snapshots?.map((snap, idx) => (
                          <div key={idx} className="shrink-0 relative group border border-white/10 rounded-lg overflow-hidden">
                            <img src={snap.image} alt="Evidence" className="w-48 h-auto object-cover group-hover:opacity-75 transition" />
                            <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/80 to-transparent p-2">
                               <span className="text-[10px] font-bold text-red-400">{snap.violationType}</span>
                            </div>
                          </div>
                        )) || <p className="text-gray-500 text-sm">No snapshot captures found.</p>}
                     </div>
                   </div>
                 </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 italic">Select a session from the list to reveal context.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden animate-fade-in">
             <table className="w-full text-left border-collapse">
               <thead className="bg-black/50">
                 <tr>
                   <th className="p-4 font-semibold text-gray-300">Name</th>
                   <th className="p-4 font-semibold text-gray-300">Email</th>
                   <th className="p-4 font-semibold text-gray-300">Role</th>
                   <th className="p-4 font-semibold text-gray-300">Joined</th>
                   <th className="p-4 font-semibold text-gray-300">Action</th>
                 </tr>
               </thead>
               <tbody>
                 {users.map(u => (
                   <tr key={u._id} className="border-b border-gray-800 hover:bg-white/5 transition">
                     <td className="p-4 font-medium">{u.firstName} {u.lastName}</td>
                     <td className="p-4 text-gray-400">{u.email}</td>
                     <td className="p-4">
                       <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' : u.role === 'MODERATOR' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
                         {u.role}
                       </span>
                     </td>
                     <td className="p-4 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                     <td className="p-4">
                        {u.role === 'USER' && (
                          <button onClick={() => promoteUser(u._id)} className="text-xs bg-[#00e5ff]/20 text-[#00e5ff] hover:bg-[#00e5ff]/40 px-3 py-1.5 rounded transition font-bold">
                            Promote
                          </button>
                        )}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="animate-fade-in flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 space-y-6">
               <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                 <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">Filter Repository</h2>
                 <label className="block text-sm text-gray-400 mb-2">Active Exam Collection</label>
                 <select 
                   value={examTypeFilter}
                   onChange={(e) => setExamTypeFilter(e.target.value)}
                   className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-[#00e5ff] transition"
                 >
                   {collections.length === 0 && <option value="FULL_STACK">Full Stack Web Dev (Default)</option>}
                   {collections.map(col => (
                     <option key={col._id} value={col.examType}>{col.title}</option>
                   ))}
                 </select>
                 {collections.find(c => c.examType === examTypeFilter) && (
                   <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                     <button 
                       onClick={toggleCollectionStatus}
                       className="flex-1 text-[10px] uppercase font-bold tracking-widest py-2 rounded border border-white/10 hover:bg-white/5 transition text-gray-300"
                     >
                       {collections.find(c => c.examType === examTypeFilter).status === 'ACTIVE' ? 'Set as Upcoming' : 'Set as Active'}
                     </button>
                     <button 
                       onClick={deleteCollection}
                       className="flex-1 text-[10px] uppercase font-bold tracking-widest py-2 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                     >
                       Delete Exam
                     </button>
                   </div>
                 )}
               </div>
               
               <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                 <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2 flex justify-between items-center">
                    <span>{isEditMode ? 'Edit Question' : 'Add New Question'}</span>
                    {isEditMode && <button type="button" onClick={() => { setIsEditMode(false); setNewQuestion({ questionType: 'MCQ', questionText: '', options: '', correctAnswer: '', difficulty: 'easy', topic: '' }); }} className="text-xs text-gray-400 hover:text-white">Cancel</button>}
                 </h2>
                 <form onSubmit={submitQuestion} className="space-y-4">
                    <div>
                      <select required value={newQuestion.questionType} onChange={e => setNewQuestion({...newQuestion, questionType: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#00e5ff] outline-none">
                        <option value="MCQ">MCQ (Single)</option>
                        <option value="MULTI">MULTI (Multiple Select)</option>
                        <option value="NUMERICAL">NUMERICAL</option>
                      </select>
                    </div>
                    <div>
                      <textarea placeholder="Question Formulation" required value={newQuestion.questionText} onChange={e => setNewQuestion({...newQuestion, questionText: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#00e5ff] outline-none h-20 resize-none"></textarea>
                    </div>
                    {newQuestion.questionType !== 'NUMERICAL' && (
                      <div>
                        <input type="text" placeholder="Options (comma separated)" required value={newQuestion.options} onChange={e => setNewQuestion({...newQuestion, options: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#00e5ff] outline-none" />
                      </div>
                    )}
                    <div>
                      <input type="text" placeholder={newQuestion.questionType === 'NUMERICAL' ? "Exact Expected Value (e.g. 5000)" : "Correct Answer(s) (comma separated)"} required value={newQuestion.correctAnswer} onChange={e => setNewQuestion({...newQuestion, correctAnswer: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#00e5ff] outline-none" />
                    </div>
                    <div className="flex gap-2">
                      <select required value={newQuestion.difficulty} onChange={e => setNewQuestion({...newQuestion, difficulty: e.target.value})} className="w-1/2 bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#00e5ff] outline-none">
                        <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
                      </select>
                      <input type="text" placeholder="Topic Tag" required value={newQuestion.topic} onChange={e => setNewQuestion({...newQuestion, topic: e.target.value})} className="w-1/2 bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#00e5ff] outline-none" />
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-[#6c2bd9] to-[#00e5ff] py-2 rounded-lg font-bold text-sm hover:opacity-80 transition shadow-[0_0_15px_rgba(108,43,217,0.3)]">{isEditMode ? 'Update Resource' : 'Publish Resource'}</button>
                 </form>
               </div>

               {/* Add Collection Section */}
               <div className="bg-white/5 border border-white/10 p-6 rounded-xl mt-6">
                 <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">Add Exam Collection</h2>
                 <form onSubmit={addCollection} className="space-y-4">
                   <div>
                     <input type="text" placeholder="Title (e.g. AWS Certified)" required value={newCollection.title} onChange={e => setNewCollection({...newCollection, title: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#00e5ff] outline-none" />
                   </div>
                   <div>
                     <input type="text" placeholder="Exam Type (Unique Code e.g. AWS_CLOUD)" required value={newCollection.examType} onChange={e => setNewCollection({...newCollection, examType: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#00e5ff] outline-none" />
                   </div>
                   <div>
                     <textarea placeholder="Description" required value={newCollection.description} onChange={e => setNewCollection({...newCollection, description: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#00e5ff] outline-none h-16 resize-none"></textarea>
                   </div>
                   <div>
                      <select required value={newCollection.status} onChange={e => setNewCollection({...newCollection, status: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#00e5ff] outline-none">
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="UPCOMING">UPCOMING</option>
                      </select>
                   </div>
                   <button type="submit" className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg font-bold text-sm text-white transition">Create Collection</button>
                 </form>
               </div>
            </div>

            <div className="md:w-2/3 bg-white/5 border border-white/10 rounded-xl overflow-hidden max-h-[85vh] flex flex-col">
               <div className="bg-black/50 p-4 border-b border-white/10 font-bold flex justify-between items-center text-gray-300">
                 <span>Items linked to {examTypeFilter}</span>
                 <span className="text-[#00e5ff] bg-[#00e5ff]/10 px-2 rounded-full text-xs">{questions.length} entries</span>
               </div>
               <div className="overflow-y-auto custom-scrollbar p-4 space-y-4">
                 {questions.map((q, idx) => (
                   <div key={q._id} className="bg-black/40 border border-white/5 rounded-xl p-4 group">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-white pr-8"><span className="text-gray-500 mr-2">Q{idx+1}.</span>{q.questionText}</h4>
                        <div className="flex gap-2">
                           <button onClick={() => handleEditQuestion(q)} className="text-blue-500 opacity-0 group-hover:opacity-100 hover:bg-blue-500/20 px-2 py-1 rounded transition text-xs font-bold shrink-0">EDIT</button>
                           <button onClick={() => deleteQuestion(q._id)} className="text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 px-2 py-1 rounded transition text-xs font-bold shrink-0">DELETE</button>
                        </div>
                      </div>
                      {q.questionType === 'NUMERICAL' ? (
                          <div className="text-sm font-bold text-green-400 mb-3 block">
                             Correct Answer: {q.correctAnswer.join(', ')}
                          </div>
                      ) : (
                          <div className="flex flex-wrap gap-2 mb-3">
                             {q.options?.map((opt, i) => (
                               <span key={i} className={`text-xs px-2 py-1 rounded border ${q.correctAnswer.includes(opt) ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                                 {opt}
                               </span>
                             ))}
                          </div>
                      )}
                      <div className="flex gap-4 text-[10px] uppercase font-bold text-gray-500">
                        <span className="bg-gray-800 px-2 py-1 rounded">{q.questionType}</span>
                        <span className="bg-gray-800 px-2 py-1 rounded">{q.difficulty}</span>
                        <span className="bg-gray-800 px-2 py-1 rounded">{q.topic}</span>
                      </div>
                   </div>
                 ))}
                 {questions.length === 0 && <p className="text-center text-gray-500 italic py-10">No questions found in this collection.</p>}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden animate-fade-in max-h-[80vh] overflow-y-auto">
             <table className="w-full text-left border-collapse">
               <thead className="bg-black/50 sticky top-0">
                 <tr>
                   <th className="p-4 font-semibold text-gray-300">Hash ID / Badge</th>
                   <th className="p-4 font-semibold text-gray-300">Recipient</th>
                   <th className="p-4 font-semibold text-gray-300">Curriculum</th>
                   <th className="p-4 font-semibold text-gray-300">Yield</th>
                   <th className="p-4 font-semibold text-gray-300">Timestamp</th>
                   <th className="p-4 font-semibold text-gray-300">Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {certificates.map(cert => (
                   <tr key={cert._id} className="border-b border-gray-800 hover:bg-white/5 transition">
                     <td className="p-4">
                       <span className="font-mono text-xs text-[#00e5ff] break-words">{cert.certificateId}</span>
                     </td>
                     <td className="p-4 font-medium text-white">{cert.userId?.firstName} {cert.userId?.lastName}</td>
                     <td className="p-4 text-gray-400">{cert.examName}</td>
                     <td className="p-4">
                        <div className="font-bold text-green-400">{cert.score} / {cert.maxScore}</div>
                        <div className="text-[10px] text-gray-500 uppercase">Passed</div>
                     </td>
                     <td className="p-4 text-sm text-gray-500">{new Date(cert.date).toLocaleDateString()}</td>
                     <td className="p-4">
                        <div className="flex gap-2">
                           <button 
                             onClick={() => window.open(`http://localhost:5000/api/certificate/view/${cert.certificateId}`, '_blank')}
                             className="bg-white/10 hover:bg-[#00e5ff]/20 hover:text-[#00e5ff] px-2 py-1 rounded text-xs font-bold transition-all text-gray-300"
                           >
                             View
                           </button>
                           <button 
                             onClick={() => window.open(`http://localhost:5000/api/certificate/download/${cert.certificateId}`, '_blank')}
                             className="bg-white/10 hover:bg-[#00e5ff]/20 hover:text-[#00e5ff] px-2 py-1 rounded text-xs font-bold transition-all text-gray-300"
                           >
                             PDF
                           </button>
                           <button 
                             onClick={() => window.open(`/verify/${cert.certificateId}`, '_blank')}
                             className="bg-white/10 hover:bg-[#6c2bd9]/20 hover:text-[#6c2bd9] px-2 py-1 rounded text-xs font-bold transition-all text-gray-300"
                           >
                             Verify
                           </button>
                        </div>
                     </td>
                   </tr>
                 ))}
                 {certificates.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-500">No certificates successfully vaulted into history.</td></tr>}
               </tbody>
             </table>
          </div>
        )}

        {/* Labs Management Tab */}
        {activeTab === 'labs' && (
          <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center bg-[#110b27] p-6 rounded-2xl border border-white/5 shadow-lg">
              <div>
                 <h2 className="text-2xl font-bold">Labs Management</h2>
                 <p className="text-gray-400 text-sm mt-1">Configure metadata, toggle statuses, and jump into visual Flow Builders.</p>
              </div>
              <button onClick={() => window.location.href = '/admin/lab/create'} className="btn-primary flex items-center gap-2">
                 <span className="font-bold text-lg">+</span> Create New Lab
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminLabs.map(lab => (
                 <div key={lab._id} className="glass-card flex flex-col p-6 border border-white/10 hover:border-[#00e5ff]/50 transition-colors bg-[#0a0510]/80">
                    <div className="flex justify-between items-start mb-4">
                       <h3 className="text-xl font-bold text-white shrink-0 truncate max-w-[70%]">{lab.title}</h3>
                       <span className={`text-xs font-bold px-2 py-1 rounded tracking-widest uppercase ${lab.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : lab.status === 'UPCOMING' ? 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/30' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}>{lab.status}</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-6 flex-1">{lab.description || 'No description provided.'}</p>
                    
                    <div className="flex flex-col gap-3 mt-auto border-t border-white/10 pt-4">
                       <button onClick={() => window.location.href = `/admin/builder/${lab.slug}`} className="bg-gradient-to-r from-purple-600 to-[#00e5ff] text-white font-bold py-2 rounded text-sm hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all text-center">
                          Build Simulation Nodes
                       </button>
                       <button onClick={() => window.location.href = `/admin/lab/${lab.slug}/edit`} className="bg-white/5 hover:bg-white/10 text-white font-bold py-2 rounded text-sm transition-all text-center border border-white/10">
                          Edit Lab Content
                       </button>
                       <button onClick={async () => {
                          if (window.confirm(`Permanently delete lab ${lab.title}?`)) {
                             await axios.delete(`http://localhost:5000/api/labs/${lab._id}`, { headers: { Authorization: `Bearer ${token}` }});
                             fetchDashboardData();
                          }
                       }} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-2 rounded text-sm transition-all text-center border border-red-500/20 mt-2">
                          Delete Lab
                       </button>
                    </div>
                 </div>
              ))}
              {adminLabs.length === 0 && (
                 <div className="col-span-full py-10 text-center text-gray-500">No labs stored in database.</div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
