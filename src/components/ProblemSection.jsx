import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import theoryImg from '../assets/theory_card.png';
import staticImg from '../assets/static_card.png';
import feedbackImg from '../assets/feedback_card.png';

// Safely register ScrollTrigger to prevent it from failing to bind
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProblemSection() {
  const container = useRef(null);

  useGSAP(() => {
    // Centralized timeline hooked directly to the scroll observer
    // Use robust dual-trigger zones to trigger strictly on entering from top AND from bottom
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%", // Animates in when scrolling down and top hits 80%
        end: "bottom 20%", // Animates out when scrolling down and bottom hits 20%
        // "play reverse play reverse" explicitly means:
        // enter->play, leave->reverse, enterBack->play, leaveBack->reverse
        toggleActions: "play reverse play reverse"
      }
    });

    // Using 100vw pushes them completely outside the viewport bounds
    tl.fromTo('.gsap-card-0', 
      { x: "-100vw", opacity: 0 },
      { x: 0, opacity: 1, duration: 2.2, ease: 'power2.out' }, 0
    )
    .fromTo('.gsap-card-1', 
      { y: "50vh", opacity: 0 },
      { y: 0, opacity: 1, duration: 2.2, ease: 'power2.out' }, 0.3
    )
    .fromTo('.gsap-card-2', 
      { x: "100vw", opacity: 0 },
      { x: 0, opacity: 1, duration: 2.2, ease: 'power2.out' }, 0.6
    );

  }, { scope: container });

  const problems = [
    {
      title: "Stuck in Theory",
      desc: "Textbook reference is great, but translating complex CS logic and algorithms directly into practical, working software without extensive visualization can lead to dense cognitive bottlenecks.",
      img: theoryImg
    },
    {
      title: "Static Concepts",
      desc: "Static code examples and diagrams are frozen. When learning complex algorithms or distributed systems, you cannot input variables, trace memory, or see real-time state changes, missing crucial execution logic.",
      img: staticImg
    },
    {
      title: "Missing Feedback",
      desc: "How do you know if your implementation works before you submit? Traditional labs have high instructor-to-student ratios, missing instant confirmation, making debugging a slow guessing game.",
      img: feedbackImg
    }
  ];

  return (
    <div ref={container} className="pt-24 pb-8 px-4 max-w-6xl mx-auto flex flex-col items-center z-10 relative">
      <h2 className="text-3xl md:text-5xl font-extrabold mb-16 text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
        Why Traditional Learning Falls Short
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full z-10 overflow-hidden py-4 px-2">
        {problems.map((prob, idx) => (
          <div key={idx} className={`gsap-card-${idx} h-full`}>
            <div className="glass-card p-6 flex flex-col items-center text-center group hover:bg-[#0f0a20]/80 transition-all border border-white/5 hover:border-[#00e5ff]/50 relative overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(0,229,255,0.2)] transform hover:-translate-y-2 duration-300 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00e5ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="mb-6 relative z-10 w-full h-[220px] flex justify-center items-center overflow-hidden rounded-xl bg-black/40 border border-white/5 shadow-inner">
                <img src={prob.img} alt={prob.title} className="w-full h-full object-cover group-hover:scale-[1.15] transition-transform duration-700 opacity-80 group-hover:opacity-100" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 relative z-10 group-hover:text-[#00e5ff] transition-colors">{prob.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed relative z-10 font-medium tracking-wide">
                {prob.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
