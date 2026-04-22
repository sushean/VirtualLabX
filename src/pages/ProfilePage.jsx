import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ProfilePage() {
  const { user, logout, isAuthenticated, loading, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    // If auth state dictates logout, kick to home
    if (!loading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      
      const fetchCertificates = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get('http://localhost:5000/api/certificates/my', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCertificates(res.data || []);
        } catch (err) {
          console.error('Error fetching certificates:', err);
        }
      };
      
      fetchCertificates();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5000/api/auth/me', 
        { firstName, lastName },
         { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      setIsEditing(false);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error updating profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center pt-24 font-sans">
        <div className="w-12 h-12 border-4 border-[#00e5ff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative font-sans flex items-center justify-center pt-32 pb-12 px-6 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#6c2bd9]/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-10 w-125 h-125 bg-[#00e5ff]/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      <div className="w-full max-w-2xl z-10 animate-page-enter">
        <div className="glass-card p-10 md:p-14 relative overflow-hidden backdrop-blur-2xl bg-[#0a0510]/80 border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.6)]">
          
          <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent"></div>

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
            <div className="w-28 h-28 rounded-full bg-linear-to-r from-[#6c2bd9] to-[#00e5ff] flex items-center justify-center text-5xl font-bold shadow-[0_0_30px_rgba(108,43,217,0.4)]">
              {user.firstName?.charAt(0).toUpperCase()}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{user.firstName} {user.lastName}</h1>
              <p className="text-[#00e5ff] font-medium">{user.email}</p>
              <p className="text-gray-500 text-sm mt-1">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {message && (
             <div className="mb-6 bg-green-500/10 border border-green-500/50 text-green-400 text-sm p-4 rounded-xl text-center shadow-inner">
               {message}
             </div>
          )}

          {/* Details & Edit Form */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold tracking-wide uppercase text-gray-300">Profile Details</h2>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm font-semibold text-[#00e5ff] hover:text-white transition-colors"
               >
                 {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                    <input 
                      type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-[#00e5ff]/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                    <input 
                      type="text" value={lastName} onChange={e => setLastName(e.target.value)} required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-[#00e5ff]/50 transition-all"
                    />
                  </div>
                </div>
                {/* Email is static */}
                <div className="space-y-2 opacity-50 cursor-not-allowed">
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email (Unchangeable)</label>
                   <input type="email" value={user.email} disabled className="w-full bg-transparent border border-white/5 rounded-xl px-5 py-3 text-white" />
                </div>
                <button 
                  type="submit" disabled={isSaving}
                  className="w-full bg-linear-to-r from-[#6c2bd9] to-[#00e5ff] py-3 rounded-xl font-bold mt-4 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50"
                 >
                   {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Full Name</p>
                  <p className="text-white text-lg">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Email Address</p>
                  <p className="text-white text-lg">{user.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Certificates Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
            <h2 className="text-lg font-bold tracking-wide uppercase text-gray-300 mb-6 border-b border-white/10 pb-2">My Certificates</h2>
            <div className="space-y-4">
              {certificates.length > 0 ? certificates.map(cert => (
                 <div key={cert._id} className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row justify-between md:items-center group hover:bg-white/5 transition">
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="text-white font-bold truncate">{cert.examName}</h3>
                      <p className="text-[10px] text-[#00e5ff] font-mono mt-1 break-all">ID: {cert.certificateId}</p>
                    </div>
                    <div className="md:text-right mt-4 md:mt-0 flex flex-col md:items-end shrink-0">
                      <p className="text-green-400 font-bold mb-2">{cert.score} / {cert.maxScore} <span className="text-xs text-gray-500 uppercase ml-1">Score</span></p>
                      <div className="flex flex-wrap gap-2 md:justify-end">
                        <button 
                          onClick={() => window.open(`http://localhost:5000/api/certificate/view/${cert.certificateId}`, '_blank')}
                          className="bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/30 text-xs px-3 py-1.5 rounded font-bold transition-all"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => window.open(`http://localhost:5000/api/certificate/download/${cert.certificateId}`, '_blank')}
                          className="bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/30 text-xs px-3 py-1.5 rounded font-bold transition-all"
                        >
                          PDF
                        </button>
                        <button 
                          onClick={() => navigate(`/verify/${cert.certificateId}`)}
                          className="bg-[#6c2bd9]/10 hover:bg-[#6c2bd9]/20 text-[#6c2bd9] border border-[#6c2bd9]/30 text-xs px-3 py-1.5 rounded font-bold transition-all"
                        >
                          Verify
                        </button>
                      </div>
                      <p className="text-gray-500 text-[10px] uppercase mt-2">Issued {new Date(cert.date).toLocaleDateString()}</p>
                    </div>
                 </div>
              )) : (
                 <p className="text-gray-500 text-sm italic text-center py-6">You have not securely earned any certificates yet. Take an exam to build your profile.</p>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-4 text-center md:text-right">
             {user?.role === 'ADMIN' && (
                <button 
                  onClick={() => navigate('/admin/exams')}
                  className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:border-purple-500/50 transition-all font-semibold py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                >
                  Enter Admin Dashboard
                </button>
             )}
             <button 
                onClick={handleLogout}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50 transition-all font-semibold py-3 px-8 rounded-xl"
             >
                Log Out
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
