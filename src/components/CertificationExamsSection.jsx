import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAward, FiShield, FiMonitor } from 'react-icons/fi';

export default function CertificationExamsSection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 bg-gradient-to-br from-black to-gray-900 border-t border-gray-800 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-900/30 rounded-full filter blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/30 rounded-full filter blur-[100px]" />
      
      <div className="max-w-7xl mx-auto px-4 z-10 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4 tracking-tight pb-2">
            AI-Proctored Certifications
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Validate your skills with our enterprise-grade, secure certification exams. Fully automated AI-driven proctoring to guarantee the integrity of your results.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 bg-gray-800/40 rounded-2xl border border-gray-700/50 backdrop-blur-md">
            <FiShield className="text-4xl text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Secure Environment</h3>
            <p className="text-gray-400">Strict browser locking prevents tab switching, right-clicking, and unauthorized shortcuts.</p>
          </div>
          <div className="p-8 bg-gray-800/40 rounded-2xl border border-gray-700/50 backdrop-blur-md transform md:-translate-y-4">
            <FiMonitor className="text-4xl text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">AI Face & Gaze Tracking</h3>
            <p className="text-gray-400">Real-time facial detection continuously tracks presence and gaze to flag suspicious behavior instantly.</p>
          </div>
          <div className="p-8 bg-gray-800/40 rounded-2xl border border-gray-700/50 backdrop-blur-md">
            <FiAward className="text-4xl text-green-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Verified Credentials</h3>
            <p className="text-gray-400">Earn verifiable digital certificates with unforgeable UUIDs upon successful completion of exams.</p>
          </div>
        </div>

        <div className="text-center">
          <button 
            onClick={() => navigate('/certifications')}
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-full font-bold text-white text-lg shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all hover:scale-105"
          >
            Explore Certifications
            <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
