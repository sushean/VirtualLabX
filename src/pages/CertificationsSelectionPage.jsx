import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExam } from '../context/ExamContext';
import { AuthContext } from '../context/AuthContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { FiCamera, FiLock, FiClock, FiStar, FiFileText } from 'react-icons/fi';

export default function CertificationsSelectionPage() {
  const navigate = useNavigate();
  const { startExam } = useExam();
  const { isAuthenticated } = React.useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState([]);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useGSAP(() => {
    // Header sequence
    gsap.fromTo(headerRef.current, 
      { opacity: 0, y: -30 }, 
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    // Stagger cards
    if (cardsRef.current.length > 0) {
      gsap.fromTo(cardsRef.current,
        { opacity: 0, scale: 0.9, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power4.out', delay: 0.2 }
      );
    }
  }, [collections]);

  React.useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/examCollections');
        if (res.ok) {
          const data = await res.json();
          setCollections(data);
        } else {
          setCollections([]);
        }
      } catch (err) {
        console.error('Failed to load collections', err);
        setCollections([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

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
    <div className="min-h-screen bg-[#0a0510] pt-32 pb-24 px-6 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#6c2bd9] rounded-full blur-[200px] opacity-[0.15] pointer-events-none" />
      <div className="absolute top-40 -left-60 w-[700px] h-[700px] bg-[#00e5ff] rounded-full blur-[250px] opacity-[0.1] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div ref={headerRef} className="text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-[#00e5ff] to-blue-500 drop-shadow-[0_0_25px_rgba(108,43,217,0.4)] tracking-tight">
            Certification Matrix
          </h1>
          <p className="text-gray-300 text-xl font-medium max-w-3xl mx-auto leading-relaxed">
            Provision and mount an enterprise-grade evaluation module. We deploy real-time ML monitoring and DOM sandboxing to mathematically verify academic integrity.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 relative">
          {collections.map((item, idx) => (
             item.status === 'ACTIVE' ? (
              <div 
                key={item._id}
                ref={el => cardsRef.current[idx] = el}
                className="group relative bg-[#0d071a] border border-[#6c2bd9]/30 rounded-3xl p-8 hover:-translate-y-4 transition-all duration-500 hover:shadow-[0_0_50px_rgba(108,43,217,0.3)] hover:border-[#00e5ff]/50 overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#6c2bd9] to-[#00e5ff] rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition duration-500 pointer-events-none" />
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="bg-gradient-to-r from-[#6c2bd9] to-[#00e5ff] p-[1px] rounded-full">
                    <div className="bg-black px-4 py-1.5 rounded-full">
                      <span className="text-xs font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-blue-400">
                        Live Status
                      </span>
                    </div>
                  </div>
                  <FiStar className="text-3xl text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                </div>

                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-colors relative z-10">
                  {item.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow relative z-10">
                  {item.description}
                </p>

                <div className="space-y-3 mb-10 relative z-10">
                  <div className="flex items-center text-sm font-medium text-gray-300 bg-white/5 rounded-xl p-3 border border-white/5">
                    <FiClock className="mr-3 text-[#00e5ff]" />
                    Flexible Pool
                  </div>
                  <div className="flex items-center text-sm font-medium text-gray-300 bg-white/5 rounded-xl p-3 border border-white/5">
                    <FiFileText className="mr-3 text-purple-400" />
                    MCQ / MULTI / NUMERICAL
                  </div>
                  <div className="flex items-center text-sm font-bold text-green-400 bg-green-900/10 rounded-xl p-3 border border-green-500/20">
                    <FiCamera className="mr-3 text-green-400" />
                    ML Face Array Required
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (!isAuthenticated) {
                      alert("Please login first to take a certification exam!");
                      navigate('/login');
                      return;
                    }
                    navigate(`/certifications/lobby?topic=${item.examType}`);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-[#6c2bd9] to-[#00e5ff] hover:from-[#5a20b8] hover:to-[#00cce5] rounded-xl font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(108,43,217,0.4)] transition-all duration-300 transform active:scale-95 relative z-10"
                >
                  Enter Secured Lobby
                </button>
              </div>
             ) : (
                <div 
                  key={item._id}
                  ref={el => cardsRef.current[idx] = el}
                  className="group relative bg-[#0a0510] border border-white/5 rounded-3xl p-8 opacity-60 hover:opacity-100 hover:border-gray-700 transition-all duration-500 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="bg-gray-900 border border-gray-800 px-4 py-1.5 rounded-full">
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                        Encrypted • UPCOMING
                      </span>
                    </div>
                    <FiLock className="text-2xl text-gray-600" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-300 mb-4">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">{item.description}</p>

                  <button disabled className="w-full py-4 bg-[#0d071a] border border-gray-800 text-gray-600 rounded-xl font-bold uppercase tracking-widest cursor-not-allowed">
                    Sub-routine Locked
                  </button>
                </div>
             )
          ))}
          {loading && (
             <div className="col-span-3 text-center text-gray-500 py-20 animate-pulse font-bold tracking-widest uppercase">Loading evaluation matrices...</div>
          )}
          {!loading && collections.length === 0 && (
             <div className="col-span-3 text-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
                <FiLock className="text-4xl text-gray-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-gray-300 mb-2">Systems Unprovisioned</h3>
                <p className="text-gray-500 max-w-lg mx-auto text-sm">Administrators have not yet integrated active examination containers into this deployment matrix. Await further network instructions.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
