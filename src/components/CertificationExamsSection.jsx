import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAward, FiShield, FiMonitor } from 'react-icons/fi';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CertificationExamsSection() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useGSAP(() => {
    // Header sequence
    gsap.fromTo('.cert-title', 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1, ease: "power4.out", scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
    );
    
    // Stagger cards
    gsap.fromTo(cardsRef.current, 
      { opacity: 0, x: -50, rotationY: -15 },
      { 
        opacity: 1, x: 0, rotationY: 0, duration: 1, stagger: 0.2, ease: "power3.out",
        scrollTrigger: { trigger: '.cert-cards-container', start: "top 85%" }
      }
    );

    // Button pulse
    gsap.to('.cert-btn', {
      boxShadow: "0px 0px 40px 10px rgba(108, 43, 217, 0.4)",
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: "sine.inOut"
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative py-32 bg-transparent">
      {/* Seamless radial blending transitions */}
      <div className="absolute top-0 right-0 w-full h-[100px] bg-linear-to-b from-transparent to-transparent z-10" />
      <div className="absolute bottom-0 left-0 w-full h-[100px] bg-gradient-to-t from-transparent to-transparent z-10" />

      {/* Internal Glows */}
      <div className="absolute top-[20%] right-[-10%] w-125 h-125 bg-[#6c2bd9] rounded-full blur-[200px] opacity-[0.15] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-125 h-125 bg-[#00e5ff] rounded-full blur-[200px] opacity-[0.1] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 z-20 relative">
        <div className="text-center mb-20 cert-title">
          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-blue-400 to-[#00e5ff] mb-6 tracking-tight drop-shadow-[0_0_15px_rgba(108,43,217,0.3)]">
            AI-Proctored Certifications
          </h2>
          <div className="w-32 h-1 bg-linear-to-r from-purple-500 to-[#00e5ff] mx-auto rounded-full mb-8" />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-medium">
            Validate your skills with our enterprise-grade, secure certification exams. Fully automated AI-driven visual tracking guarantees total credential integrity natively.
          </p>
        </div>

        <div className="cert-cards-container grid md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: <FiShield />, title: "Secure Environment", text: "Strict browser locking automatically flags and logs rapid tab switching or unauthorized execution environments.", color: "text-purple-400", bg: "bg-purple-900/20", glow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] border-purple-500/20" },
            { icon: <FiMonitor />, title: "Live Tracking", text: "Real-time Machine Learning models map user presence, flag obscure facial patterns, and continuously evaluate gaze vectors.", color: "text-[#00e5ff]", bg: "bg-[#00e5ff]/10", glow: "hover:shadow-[0_0_30px_rgba(0,229,255,0.3)] border-[#00e5ff]/20 md:-translate-y-6" },
            { icon: <FiAward />, title: "Vaulted Diplomas", text: "Store mathematically verifiable certificates using unforgeable UUID matrix identifiers inside your public credential block.", color: "text-green-400", bg: "bg-green-900/20", glow: "hover:shadow-[0_0_30px_rgba(74,222,128,0.2)] border-green-500/20" }
          ].map((item, i) => (
            <div 
              key={i} 
              ref={el => cardsRef.current[i] = el}
              className={`p-10 rounded-3xl border backdrop-blur-xl transition duration-500 ${item.bg} ${item.glow} group`}
            >
              <div className={`w-16 h-16 rounded-2xl mb-8 flex items-center justify-center text-3xl ${item.color} bg-black/40 border ${item.glow.split(' ')[1]} transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed font-medium">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center relative">
          <button 
            onClick={() => navigate('/certifications')}
            className="cert-btn relative px-12 py-5 bg-linear-to-r from-[#6c2bd9] to-[#00e5ff] rounded-2xl font-black uppercase tracking-widest text-white text-lg transition-transform hover:scale-[1.03] overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center justify-center gap-3">
              Access Exam Array
              <FiAward className="text-2xl group-hover:rotate-12 transition-transform" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
