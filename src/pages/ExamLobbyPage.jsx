import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useExam } from '../context/ExamContext';
import { AuthContext } from '../context/AuthContext';
import { FiCamera, FiAlertTriangle, FiCheckCircle, FiShield, FiMonitor, FiDatabase, FiAward, FiArrowRight } from 'react-icons/fi';

export default function ExamLobbyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { startExam } = useExam();
  const { isAuthenticated } = useContext(AuthContext);
  
  const topic = searchParams.get('topic') || 'Assessment';
  
  const [step, setStep] = useState(1);
  const [camStatus, setCamStatus] = useState('PENDING');
  const [audioStatus, setAudioStatus] = useState('PENDING');
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auth Guard
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Initialize camera and microphone permissions before launch.
  const initHardware = () => {
    setCamStatus('CHECKING');
    setAudioStatus('CHECKING');
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        const hasVideoTrack = stream.getVideoTracks().length > 0;
        const hasAudioTrack = stream.getAudioTracks().length > 0;

        setCamStatus(hasVideoTrack ? 'CONNECTED' : 'BLOCKED');
        setAudioStatus(hasAudioTrack ? 'CONNECTED' : 'BLOCKED');
        stream.getTracks().forEach(track => track.stop());
      })
      .catch(() => {
        setCamStatus('BLOCKED');
        setAudioStatus('BLOCKED');
      });
  };

  const handleLaunch = async () => {
    if (camStatus !== 'CONNECTED' || audioStatus !== 'CONNECTED' || !accepted) return;
    
    setLoading(true);
    try {
      const session = await startExam(topic);
      navigate(`/exam/${session.sessionId}`);
    } catch (err) {
      console.error(err);
      alert('Failed to initialize connection to secure exam servers.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-20 px-4 animate-page-enter relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6c2bd9] rounded-full blur-[200px] opacity-[0.1] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00e5ff] rounded-full blur-[200px] opacity-[0.1] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Main Wizard Card */}
        <div className="bg-[#0f0a1c] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          
          {/* Header & Step Tracker */}
          <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8">
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-[#6c2bd9] to-[#00e5ff] flex items-center justify-center text-white shadow-[0_0_15px_rgba(108,43,217,0.4)]">
              <FiShield className="text-3xl" />
            </div>
            <div className="w-full">
              <h1 className="text-3xl font-black text-white tracking-tight">Deployment Sequence</h1>
              <div className="flex items-center mt-2 w-full gap-2 opacity-80">
                 {/* Progress Bar UI */}
                 <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-[#00e5ff] shadow-[0_0_10px_#00e5ff]' : 'bg-gray-800'}`}></div>
                 <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-[#00e5ff] shadow-[0_0_10px_#00e5ff]' : 'bg-gray-800'}`}></div>
                 <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-[#00e5ff] shadow-[0_0_10px_#00e5ff]' : 'bg-gray-800'}`}></div>
              </div>
            </div>
          </div>

          {/* STEP 1: Overview */}
          {step === 1 && (
            <div className="animate-fade-in space-y-6">
               <h2 className="text-2xl font-bold text-white mb-6">Module Evaluation Targets</h2>
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                    <FiDatabase className="text-[#00e5ff] text-2xl mb-2" />
                    <h3 className="text-sm font-bold text-gray-500 uppercase">Assessment Scope</h3>
                    <p className="text-xl font-bold text-white mt-1">20 Logic Blocks</p>
                 </div>
                 <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                    <FiCheckCircle className="text-purple-400 text-2xl mb-2" />
                    <h3 className="text-sm font-bold text-gray-500 uppercase">Input Varieties</h3>
                    <p className="text-xl font-bold text-white mt-1">MCQ / MULTI / DATA</p>
                 </div>
                 <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                    <FiAward className="text-green-400 text-2xl mb-2" />
                    <h3 className="text-sm font-bold text-gray-500 uppercase">Passing Threshold</h3>
                    <p className="text-xl font-bold text-white mt-1">70% Accuracy</p>
                 </div>
                 <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                    <FiShield className="text-blue-400 text-2xl mb-2" />
                    <h3 className="text-sm font-bold text-gray-500 uppercase">Credential Status</h3>
                    <p className="text-xl font-bold text-white mt-1">UUID Verifiable</p>
                 </div>
               </div>
               
               <div className="flex justify-end pt-6">
                 <button onClick={() => setStep(2)} className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all border border-white/10">
                   Acknowledge Scope <FiArrowRight />
                 </button>
               </div>
            </div>
          )}

          {/* STEP 2: Rules & Agreement */}
          {step === 2 && (
            <div className="animate-fade-in space-y-6">
              <h2 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-2">
                <FiAlertTriangle /> Integrity Enforcement Rules
              </h2>
              
              <div className="space-y-4 bg-red-500/5 p-6 rounded-2xl border border-red-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                    <FiMonitor className="text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Strict Tab Locking</h3>
                    <p className="text-gray-400 text-sm mt-1">Opening a new tab or minimizing the browser will instantly raise a disqualification flag.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                    <FiAlertTriangle className="text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">No Hardware Peripherals</h3>
                    <p className="text-gray-400 text-sm mt-1">Keyboard shortcuts (Ctrl+C, Ctrl+V, F12 inspector) are natively disabled.</p>
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-4 bg-white/5 p-5 rounded-xl border border-white/10 cursor-pointer group mt-4">
                <input 
                  type="checkbox" 
                  checked={accepted} 
                  onChange={() => setAccepted(!accepted)}
                  className="w-6 h-6 rounded border-gray-600 appearance-none bg-black checked:bg-gradient-to-r checked:from-[#6c2bd9] checked:to-[#00e5ff] relative transition-colors focus:ring-0 after:content-[''] after:absolute after:inset-0 after:flex after:justify-center after:items-center checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold"
                />
                <span className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors leading-relaxed">
                  I agree to the strict evaluation parameters and understand that my behavioral footprint will be mathematically parsed.
                </span>
              </label>

              <div className="flex justify-between pt-6 border-t border-white/5 mt-8">
                 <button onClick={() => setStep(1)} className="px-6 py-4 text-gray-500 hover:text-white transition-colors font-bold text-sm uppercase">Go Back</button>
                 <button onClick={() => { setStep(3); initHardware(); }} disabled={!accepted} className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#6c2bd9] to-[#00e5ff] disabled:opacity-50 disabled:grayscale text-white rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(108,43,217,0.4)]">
                   Agree & Proceed <FiArrowRight />
                 </button>
               </div>
            </div>
          )}

          {/* STEP 3: Camera Setup */}
          {step === 3 && (
            <div className="animate-fade-in space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FiCamera /> Hardware Interfacing (Camera + Audio)
              </h2>
              
              <div className="bg-black/30 p-8 rounded-2xl border border-white/5 text-center">
                <div className="mb-6 flex justify-center">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${camStatus === 'CONNECTED' ? 'bg-green-500/20 border-green-500 text-green-400' : camStatus === 'BLOCKED' ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-yellow-500/20 border-yellow-500 text-yellow-500 animate-pulse'}`}>
                     <FiCamera className="text-4xl" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">Media Stream Diagnostic</h3>
                <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
                  Our proctoring engine requires both webcam and microphone streams.
                </p>

                <div className="space-y-3 w-full max-w-sm mx-auto">
                  <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-xl border border-white/10 w-full">
                    {camStatus === 'CHECKING' && <span className="text-yellow-500 font-bold uppercase tracking-widest text-sm">Camera: Checking...</span>}
                    {camStatus === 'CONNECTED' && <span className="text-green-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2"><FiCheckCircle /> Camera: Connected</span>}
                    {camStatus === 'BLOCKED' && <span className="text-red-500 font-bold uppercase tracking-widest text-sm">Camera: Access Denied</span>}
                    {camStatus === 'PENDING' && <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Camera: Pending</span>}
                  </div>
                  <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-xl border border-white/10 w-full">
                    {audioStatus === 'CHECKING' && <span className="text-yellow-500 font-bold uppercase tracking-widest text-sm">Microphone: Checking...</span>}
                    {audioStatus === 'CONNECTED' && <span className="text-green-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2"><FiCheckCircle /> Microphone: Connected</span>}
                    {audioStatus === 'BLOCKED' && <span className="text-red-500 font-bold uppercase tracking-widest text-sm">Microphone: Access Denied</span>}
                    {audioStatus === 'PENDING' && <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Microphone: Pending</span>}
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={initHardware}
                    disabled={camStatus === 'CHECKING' || audioStatus === 'CHECKING'}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 disabled:opacity-50 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-white transition-all"
                  >
                    {camStatus === 'CHECKING' || audioStatus === 'CHECKING' ? 'Rechecking...' : 'Retry Hardware Check'}
                  </button>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-white/5 mt-8">
                 <button onClick={() => setStep(2)} className="px-6 py-4 text-gray-500 hover:text-white transition-colors font-bold text-sm uppercase">Revise Agreement</button>
                 <button 
                   onClick={handleLaunch} 
                   disabled={camStatus !== 'CONNECTED' || audioStatus !== 'CONNECTED' || loading} 
                   className="px-10 py-4 bg-green-500 disabled:opacity-50 text-white rounded-xl font-black uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all hover:bg-green-400 transform active:scale-95"
                 >
                   {loading ? 'Compiling...' : 'Launch Final Assessment'}
                 </button>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
