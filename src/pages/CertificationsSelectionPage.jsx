import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExam } from '../context/ExamContext';
import { AuthContext } from '../context/AuthContext';

export default function CertificationsSelectionPage() {
  const navigate = useNavigate();
  const { startExam } = useExam();
  const { isAuthenticated } = React.useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleStartExam = async (topic) => {
    if (!isAuthenticated) {
      alert("Please login first to take a certification exam!");
      navigate('/login');
      return;
    }
    
    setLoading(true);
    try {
      const session = await startExam(topic);
      navigate(`/exam/${session.sessionId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to start exam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-28 pb-16 px-4 animate-page-enter">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-6">
            Available Certifications
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose from our highly vetted list of assessments. Your webcam will be monitored using AI, and strict browser controls will apply.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Sample Exam Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all group">
            <div className="bg-purple-900/30 text-purple-400 px-3 py-1 rounded w-max text-xs font-bold mb-4">
              NEW
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition">Sample Full-Stack Exam</h3>
            <p className="text-gray-400 text-sm mb-6 line-clamp-3">
              A comprehensive 10-question evaluation covering HTML, CSS, React, Express, MongoDB, and generalized web terminology.
            </p>
            <ul className="text-sm text-gray-500 mb-8 space-y-2">
              <li>⏱️ 10 Minutes</li>
              <li>❓ 10 Questions</li>
              <li>👁️ AI Proctoring Enabled</li>
            </ul>
            <button 
              onClick={() => handleStartExam('Sample Full-Stack Exam')}
              disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white rounded-lg font-bold transition shadow-lg"
            >
              {loading ? 'Starting...' : 'Start Assessment'}
            </button>
          </div>

          {/* Placeholder cards for future development */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 opacity-60">
            <div className="bg-gray-800 text-gray-400 px-3 py-1 rounded w-max text-xs font-bold mb-4">
              COMING SOON
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">Advanced Machine Learning</h3>
            <p className="text-gray-400 text-sm mb-6">Deep dive into Neural Networks, Gradient Descent, and AI tooling.</p>
            <button disabled className="w-full py-3 bg-gray-800 text-gray-500 rounded-lg font-bold cursor-not-allowed">
              Available Q4 2026
            </button>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 opacity-60">
             <div className="bg-gray-800 text-gray-400 px-3 py-1 rounded w-max text-xs font-bold mb-4">
              COMING SOON
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">DevOps Fundamentals</h3>
            <p className="text-gray-400 text-sm mb-6">Test your knowledge of Docker, Kubernetes, CI/CD, and AWS architecture.</p>
            <button disabled className="w-full py-3 bg-gray-800 text-gray-500 rounded-lg font-bold cursor-not-allowed">
              Available Q4 2026
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
