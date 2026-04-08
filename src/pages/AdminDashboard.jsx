import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/exam/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExams(res.data);
      } catch (err) {
        console.error('Error fetching exams', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED': return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold">COMPLETED</span>;
      case 'DISQUALIFIED': return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold">DISQUALIFIED</span>;
      case 'IN_PROGRESS': return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-bold">IN PROGRESS</span>;
      default: return null;
    }
  };

  if (loading) return <div className="p-20 text-center text-white">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-purple-400">Proctor Dashboard</h1>
        
        <div className="flex gap-8">
          {/* List of Exams */}
          <div className="w-1/3 bg-gray-900 border border-gray-800 rounded-xl max-h-[80vh] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-800 sticky top-0">
                <tr>
                  <th className="p-4 font-semibold text-gray-300">Student</th>
                  <th className="p-4 font-semibold text-gray-300">Status</th>
                  <th className="p-4 font-semibold text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody>
                {exams.map(exam => (
                  <tr 
                    key={exam._id} 
                    className={`border-b border-gray-800 cursor-pointer hover:bg-gray-800/50 transition ${selectedExam?._id === exam._id ? 'bg-gray-800' : ''}`}
                    onClick={() => setSelectedExam(exam)}
                  >
                    <td className="p-4 text-sm">{exam.userId?.name || 'Unknown'}</td>
                    <td className="p-4">{getStatusBadge(exam.status)}</td>
                    <td className="p-4 text-xs text-gray-400">{new Date(exam.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {exams.length === 0 && (
                  <tr><td colSpan="3" className="p-4 text-center text-gray-500">No exams found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Details View */}
          <div className="w-2/3 bg-gray-900 border border-gray-800 rounded-xl p-6">
            {selectedExam ? (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedExam.title} - {selectedExam.userId?.name}</h2>
                <div className="grid grid-cols-4 gap-4 mb-6">
                   <div className="bg-gray-800 p-4 rounded-lg">
                     <p className="text-xs text-gray-400 mb-1">Score</p>
                     <p className="text-xl font-bold">{selectedExam.status === 'IN_PROGRESS' ? 'N/A' : `${selectedExam.answers.length * 10} / ${selectedExam.questions.length * 10}`}</p>
                   </div>
                   <div className="bg-gray-800 p-4 rounded-lg">
                     <p className="text-xs text-gray-400 mb-1">Cheating Score</p>
                     <p className={`text-xl font-bold ${selectedExam.cheatingScore >= 70 ? 'text-red-500' : 'text-green-500'}`}>{selectedExam.cheatingScore}</p>
                   </div>
                   <div className="bg-gray-800 p-4 rounded-lg">
                     <p className="text-xs text-gray-400 mb-1">Status</p>
                     <p className="text-sm font-bold mt-1">{getStatusBadge(selectedExam.status)}</p>
                   </div>
                   <div className="bg-gray-800 p-4 rounded-lg">
                     <p className="text-xs text-gray-400 mb-1">Questions Answered</p>
                     <p className="text-xl font-bold">{selectedExam.answers.length}</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-4 border-b border-gray-700 pb-2">Violation Breakdown</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between bg-gray-800/50 p-2 rounded">
                        <span className="text-gray-400">Tab Switches</span>
                        <span className="font-mono text-purple-400">{selectedExam.tabSwitches}</span>
                      </li>
                      <li className="flex justify-between bg-gray-800/50 p-2 rounded">
                        <span className="text-gray-400">No Face Detected</span>
                        <span className="font-mono text-purple-400">{selectedExam.faceFlags}</span>
                      </li>
                      <li className="flex justify-between bg-gray-800/50 p-2 rounded">
                        <span className="text-gray-400">Multiple Faces</span>
                        <span className="font-mono text-purple-400">{selectedExam.multipleFaceEvents}</span>
                      </li>
                      <li className="flex justify-between bg-gray-800/50 p-2 rounded">
                        <span className="text-gray-400">Looking Away (Eye Tracking)</span>
                        <span className="font-mono text-purple-400">{selectedExam.lookingAwayEvents}</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-4 border-b border-gray-700 pb-2">Violation Timeline Logs</h3>
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                       {selectedExam.violations.map((v, idx) => (
                         <div key={idx} className="bg-red-900/10 border border-red-900/50 p-2 rounded text-xs flex justify-between">
                           <span className="text-red-400 font-bold">{v.type}</span>
                           <span className="text-gray-500">{new Date(v.timestamp).toLocaleTimeString()}</span>
                         </div>
                       ))}
                       {selectedExam.violations.length === 0 && <p className="text-sm text-gray-500">No violations recorded.</p>}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-300 mb-4 border-b border-gray-700 pb-2">Snapshots Evidence</h3>
                  {selectedExam.snapshots.length > 0 ? (
                    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                      {selectedExam.snapshots.map((snap, idx) => (
                        <div key={idx} className="shrink-0 relative group">
                          <img src={snap.image} alt="Violation Snapshot" className="w-48 h-auto rounded-lg border border-gray-700 group-hover:border-purple-500 transition" />
                          <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 text-[10px] uppercase font-bold text-red-500 rounded">
                            {snap.violationType}
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 text-[10px] text-gray-300 rounded">
                            {new Date(snap.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No snapshot evidence recorded.</p>
                  )}
                </div>

              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Select an exam session to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
