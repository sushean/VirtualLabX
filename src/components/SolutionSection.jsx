import React, { useRef } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CodeIcon from '@mui/icons-material/Code';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SolutionSection() {
  const container = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play reverse play reverse"
      }
    });

    tl.fromTo('.sol-card', 
      { y: 50, opacity: 0, scale: 0.8 },
      { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.15, ease: 'back.out(1.5)', clearProps: "transform" }
    );

  }, { scope: container });

  const solutions = [
    {
      title: "Visual Simulations",
      desc: "Watch abstract algorithms unfold in real-time. Trace variable paths and physically see how complex theoretical sequences execute step-by-step.",
      icon: <VisibilityIcon sx={{ fontSize: 50 }} />,
      colorStart: "from-purple-600/10",
      colorBorder: "hover:border-purple-400/50",
      colorGlow: "group-hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]",
      iconColor: "text-purple-400 text-shadow-glow"
    },
    {
      title: "Guided Learning",
      desc: "Get instantaneous feedback as you interact. The platform acts as a digital mentor, catching and analyzing theoretical mistakes instantly.",
      icon: <AccountTreeIcon sx={{ fontSize: 50 }} />,
      colorStart: "from-blue-600/10",
      colorBorder: "hover:border-blue-400/50",
      colorGlow: "group-hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]",
      iconColor: "text-blue-400 text-shadow-glow"
    },
    {
      title: "Hands-On Assignments",
      desc: "Stop reading and start building. Construct your own graphs, state machines, and protocols in a dynamic sandbox environment that enforces correctness.",
      icon: <CodeIcon sx={{ fontSize: 50 }} />,
      colorStart: "from-[#00e5ff]/10",
      colorBorder: "hover:border-[#00e5ff]/50",
      colorGlow: "group-hover:shadow-[0_0_40px_rgba(0,229,255,0.3)]",
      iconColor: "text-[#00e5ff] text-shadow-glow"
    }
  ];

  return (
    <div ref={container} className="pt-8 pb-16 text-center px-4 max-w-6xl mx-auto relative z-10">
      
      {/* Premium Header */}
      <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
        The Solution: Experience It <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">Virtually</span>
      </h2>
      <p className="text-gray-300 mb-20 max-w-2xl mx-auto text-lg leading-relaxed">
        Bridging the gap between dense textbook theory and practical software engineering through live, dynamic sandbox environments.
      </p>
      
      {/* Bento-style Interactive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {solutions.map((sol, index) => (
          <div key={index} className="sol-card-wrapper h-full">
            <div className={`sol-card glass-card p-8 flex flex-col items-center text-center group transition-all duration-300 border border-white/5 relative overflow-hidden bg-linear-to-b ${sol.colorStart} to-[#0a0510]/60 ${sol.colorBorder} ${sol.colorGlow} transform hover:-translate-y-2 h-full`}>
              
              {/* Top Edge Shine for Premium Glassmorphism Look */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
              
              {/* Floating Orbiting Background Flare */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500"></div>

              {/* Elevated Icon Container */}
              <div className={`w-24 h-24 rounded-full glass-card flex items-center justify-center mb-8 ${sol.iconColor} border border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 relative z-10`}>
                {sol.icon}
              </div>
              
              {/* Card Typography */}
              <h3 className="font-bold text-2xl text-white mb-4 group-hover:text-white transition-colors relative z-10 tracking-wide">
                {sol.title}
              </h3>
              
              <p className="text-gray-400 text-sm leading-relaxed font-medium relative z-10">
                {sol.desc}
              </p>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
