import React, { useRef } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AssessmentIcon from '@mui/icons-material/Assessment';
import QuizIcon from '@mui/icons-material/Quiz';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HowItWorksSection() {
  const container = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 75%",
        end: "bottom 20%",
        toggleActions: "play reverse play reverse"
      }
    });

    // Animate the connecting line drawing itself
    tl.fromTo('.hiw-line', 
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 1.5, ease: 'power3.inOut' }
    );

    // Pop the circles in one by one overlapping the line animation
    tl.fromTo('.hiw-step', 
      { scale: 0, opacity: 0, y: 50 },
      { scale: 1, opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'back.out(2)', clearProps: "transform" },
      "-=1.0"
    );

  }, { scope: container });

  const steps = [
    {
      num: "1",
      title: "Study\nTheory",
      icon: <PlayArrowIcon className="text-purple-400 group-hover:text-white transition-colors" fontSize="small"/>,
      desc: "Master the fundamental algorithms, data structures, and core principles before starting.",
      borderColor: "border-purple-500/30 group-hover:border-purple-400",
      shadowColor: "shadow-[0_0_30px_rgba(168,85,247,0.15)] group-hover:shadow-[0_0_50px_rgba(168,85,247,0.4)]",
      textColor: "text-purple-300"
    },
    {
      num: "2",
      title: "Initialize\nLab",
      icon: <AccountTreeIcon className="text-pink-400 group-hover:text-white transition-colors" fontSize="small"/>,
      desc: "Set up input parameters, configure topologies, or initialize variables for the experiment.",
      borderColor: "border-pink-500/30 group-hover:border-pink-400",
      shadowColor: "shadow-[0_0_30px_rgba(236,72,153,0.15)] group-hover:shadow-[0_0_50px_rgba(236,72,153,0.4)]",
      textColor: "text-pink-300"
    },
    {
      num: "3",
      title: "Execute\nSimulation",
      icon: <AutoFixHighIcon className="text-indigo-400 group-hover:text-white transition-colors" fontSize="small"/>,
      desc: "Run the interactive environment and observe algorithms execute live in real-time.",
      borderColor: "border-indigo-500/30 group-hover:border-indigo-400",
      shadowColor: "shadow-[0_0_30px_rgba(99,102,241,0.15)] group-hover:shadow-[0_0_50px_rgba(99,102,241,0.4)]",
      textColor: "text-indigo-300"
    },
    {
      num: "4",
      title: "Analyze\nMetrics",
      icon: <AssessmentIcon className="text-cyan-400 group-hover:text-white transition-colors" fontSize="small"/>,
      desc: "Evaluate performance bottlenecks, state changes, memory traces, and execution logs.",
      borderColor: "border-cyan-500/30 group-hover:border-cyan-400",
      shadowColor: "shadow-[0_0_30px_rgba(6,182,212,0.15)] group-hover:shadow-[0_0_50px_rgba(6,182,212,0.4)]",
      textColor: "text-cyan-300"
    },
    {
      num: "5",
      title: "Test\nMastery",
      icon: <QuizIcon className="text-blue-400 group-hover:text-white transition-colors" fontSize="small"/>,
      desc: "Prove your understanding by debugging deliberate edge-cases and solving challenges.",
      borderColor: "border-blue-500/30 group-hover:border-blue-400",
      shadowColor: "shadow-[0_0_30px_rgba(59,130,246,0.15)] group-hover:shadow-[0_0_50px_rgba(59,130,246,0.4)]",
      textColor: "text-blue-300"
    }
  ];

  return (
    <div ref={container} className="pt-8 pb-12 text-center px-4 max-w-7xl mx-auto relative z-10 w-full">
      
      <h2 className="text-4xl md:text-5xl font-extrabold mb-24 relative inline-block drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
        How It Works
        <span className="absolute -bottom-4 left-1/4 right-1/4 h-[2px] bg-linear-to-r from-transparent via-cyan-500 to-transparent"></span>
      </h2>
      
      <div className="flex flex-col md:flex-row justify-center items-start gap-12 md:gap-4 lg:gap-8 relative mt-10 w-full min-h-[220px]">
        {/* Connection line for desktop */}
        <div className="hiw-line hidden md:block absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-linear-to-r from-purple-500/80 via-indigo-500/80 to-blue-500/80 -z-10 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
        
        {steps.map((step, idx) => (
          <div key={idx} className="hiw-step group flex flex-col items-center flex-1 cursor-pointer">
            {/* Main Interactive Orb */}
             <div className={`w-[110px] h-[110px] md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px] rounded-full bg-[#110b27] border-[2px] ${step.borderColor} flex flex-col items-center justify-center mb-6 text-white ${step.shadowColor} relative transition-all duration-500 transform group-hover:-translate-y-4 group-hover:scale-110`}>
               
               {/* Pulse Ring */}
               <div className="absolute inset-0 rounded-full border border-white/10 group-hover:animate-ping opacity-0 group-hover:opacity-20 transition-all duration-500"></div>
               
               <span className="text-3xl lg:text-4xl font-black mb-0 lg:mb-1 text-white relative z-10">{step.num}</span>
               <span className={`text-[9px] lg:text-[10px] uppercase tracking-widest ${step.textColor} font-bold text-center leading-tight relative z-10 whitespace-pre-line`}>
                 {step.title}
               </span>
               <div className="absolute -bottom-4 rounded-full p-2 border border-white/20 bg-[#0f0a20] group-hover:bg-[#1a0f30] transition-colors duration-300 z-20 shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                  {step.icon}
               </div>
             </div>
             
             {/* Hidden Expanding Details on Hover */}
             <div className="mt-8 max-w-[180px] lg:max-w-50 text-[13px] lg:text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-center font-medium leading-relaxed pointer-events-none group-hover:pointer-events-auto">
                {step.desc}
             </div>
          </div>
        ))}
        
      </div>
    </div>
  );
}
