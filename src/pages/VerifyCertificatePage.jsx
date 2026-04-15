import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function VerifyCertificatePage() {
  const { hash } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchVerification = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/verify/${hash}`);
        setResult(res.data);
      } catch (err) {
        console.error('Error verifying certificate:', err);
        setResult({ valid: false });
      } finally {
        setLoading(false);
      }
    };
    fetchVerification();
  }, [hash]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0510] flex items-center justify-center text-white relative z-50">
        <div className="w-12 h-12 border-4 border-[#00e5ff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isValid = result && result.valid === true;

  return (
    <div className="min-h-screen bg-[#0a0510] pt-32 pb-12 px-6 flex items-center justify-center text-white relative overflow-hidden font-sans">
      {/* Background Visual Enhancements */}
      <div className={`absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none -z-10 ${isValid ? 'bg-[#00e5ff]/20' : 'bg-red-500/20'}`}></div>
      <div className={`absolute bottom-10 left-10 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none -z-10 ${isValid ? 'bg-[#6c2bd9]/20' : 'bg-red-900/20'}`}></div>

      <div className="w-full max-w-2xl bg-white/5 border border-white/10 backdrop-blur-3xl rounded-3xl p-10 md:p-14 shadow-2xl relative overflow-hidden text-center animate-fade-in">
        {isValid ? (
          <>
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#00e5ff] via-[#6c2bd9] to-[#00e5ff]"></div>
            
            <div className="w-24 h-24 mx-auto bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-white mb-2">
              Authentic Certificate
            </h1>
            <p className="text-gray-400 mb-8 font-medium">This credential has been verified in the VirtualLabX registry.</p>
            
            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 text-left space-y-4 shadow-inner mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Recipient</p>
                  <p className="text-xl font-bold text-white">{result.data.studentName}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Issue Date</p>
                  <p className="text-xl font-bold text-white">{new Date(result.data.issueDate).toLocaleDateString()}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Curriculum / Exam</p>
                  <p className="text-lg font-bold text-[#00e5ff]">{result.data.examName}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Registry ID</p>
                  <p className="font-mono text-sm text-gray-300 break-words bg-black/50 p-2 rounded border border-white/10">{result.data.certificateId}</p>
                </div>
              </div>
            </div>

            <div className="w-full aspect-[1.414/1] mb-8 border-2 border-[#00e5ff]/30 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,229,255,0.1)] bg-white/5 relative group">
              <div className="absolute inset-0 bg-black/20 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className="bg-black/80 text-white px-4 py-2 rounded-full font-bold text-sm backdrop-blur-sm shadow-xl">Original Document Attached</span>
              </div>
              <iframe 
                src={`http://localhost:5000/api/certificate/view/${result.data.certificateId}#view=FitH&toolbar=0&navpanes=0`}
                className="w-full h-full border-none pointer-events-auto"
                title="Certificate Preview"
              />
            </div>

            <button 
              onClick={() => window.open(`http://localhost:5000/api/certificate/download/${result.data.certificateId}`, '_blank')}
              className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 transition-all rounded-xl font-bold uppercase tracking-widest"
            >
              Download PDF Copy
            </button>
          </>
        ) : (
          <>
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-500 to-orange-500"></div>

            <div className="w-24 h-24 mx-auto bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-red-500 mb-2">
              Invalid Credential
            </h1>
            <p className="text-gray-400 mb-8 font-medium">This certificate hash does not exist in our secure registry.</p>
            
            <div className="bg-black/40 border border-red-500/20 rounded-2xl p-6 mb-6">
              <p className="text-sm text-red-200">The provided ID <b>{hash}</b> could not be validated. If you believe this is an error, please contact the support team or ensure that the URL is exact.</p>
            </div>

            <button 
              onClick={() => navigate('/')}
              className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 transition-all rounded-xl font-bold uppercase tracking-widest text-gray-300"
            >
              Return Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
