import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiAward, FiCpu, FiSettings, FiDatabase, FiArrowRight } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesSection() {
  const navigate = useNavigate();
  const sectionRef = useRef();
  const cardsRef = useRef([]);

  useGSAP(() => {
    // Fade in Header
    gsap.fromTo('.features-header', 
      { opacity: 0, y: -30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      }
    );

    // Stagger in Cards
    gsap.fromTo(cardsRef.current,
      { opacity: 0, y: 80, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 85%',
        }
      }
    );
  }, { scope: sectionRef });

  const features = [
    {
      title: "Interactive ML Labs",
      description: "Engage with dynamic experiments. Modify state machines and tune regression networks in real-time.",
      icon: <FiCpu />,
      path: "/labs",
      color: "from-blue-500 to-indigo-500",
      glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
    },
    {
      title: "AI-Driven Certifications",
      description: "Validate skills under strict AI proctoring environments. Realtime tracking preserves exam integrity natively.",
      icon: <FiAward />,
      path: "/certifications",
      color: "from-purple-500 to-[#6c2bd9]",
      glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
    },
    {
      title: "Performance Analytics Dashboard",
      description: "Global dashboard parsing your academic progression. Review your execution metrics and optimize weak algorithmic areas.",
      icon: <FiSettings />,
      path: "/profile",
      color: "from-[#00e5ff] to-blue-500",
      glow: "group-hover:shadow-[0_0_30px_rgba(0,229,255,0.3)]"
    },
    {
      title: "Encrypted Credential Vault",
      description: "Store, access, and verify heavily encrypted certificates mapped eternally to unforgeable platform UUIDs.",
      icon: <FiDatabase />,
      path: "/profile",
      color: "from-pink-500 to-purple-500",
      glow: "group-hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]"
    }
  ];

  return (
    <section ref={sectionRef} className="relative py-28 bg-transparent">
      {/* Abstract Animated Glows */}
      <div className="absolute top-[10%] left-[-10%] w-125 h-125 bg-[#6c2bd9] rounded-full blur-[150px] opacity-[0.15] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-150 bg-[#00e5ff] rounded-full blur-[180px] opacity-[0.1] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-20 features-header relative">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-transparent bg-clip-text bg-linear-to-r from-white via-gray-200 to-gray-500 tracking-tight">
            Ecosystem Core Capabilities
          </h2>
          <div className="absolute left-1/2 -bottom-4 -translate-x-1/2 w-24 h-1.5 bg-linear-to-r from-[#00e5ff] to-[#6c2bd9] rounded-full blur-[2px]"></div>
          <div className="absolute left-1/2 -bottom-4 -translate-x-1/2 w-24 h-1.5 bg-linear-to-r from-[#00e5ff] to-[#6c2bd9] rounded-full"></div>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mt-8">
            Our architecture is split into heavily specialized operational nodes, completely interlinked to orchestrate your educational ascension natively.
          </p>
        </div>
        
        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              ref={el => cardsRef.current[idx] = el}
              onClick={() => navigate(feature.path)}
              className={`group flex flex-col p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md cursor-pointer hover:-translate-y-3 transition-all duration-500 ${feature.glow} h-full relative overflow-hidden`}
            >
              {/* Internal Accent Glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${feature.color} rounded-full blur-[70px] opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`} />

              <div className={`w-14 h-14 mb-6 rounded-2xl flex items-center justify-center text-3xl text-white bg-linear-to-br ${feature.color} shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-white group-hover:to-gray-400 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 text-sm leading-relaxed grow mb-8 group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>
              
              <div className="mt-auto flex items-center text-sm font-bold tracking-widest uppercase transition-colors text-white/50 group-hover:text-[#00e5ff]">
                <span>Access Node</span>
                <FiArrowRight className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300 text-lg" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
