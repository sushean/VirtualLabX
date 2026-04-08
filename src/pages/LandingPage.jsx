import React from 'react';
import HeroSection from '../components/HeroSection';
import ProblemSection from '../components/ProblemSection';
import SolutionSection from '../components/SolutionSection';
import FeaturesSection from '../components/FeaturesSection';
import LabsSection from '../components/LabsSection';
import HowItWorksSection from '../components/HowItWorksSection';
import CertificationExamsSection from '../components/CertificationExamsSection';
import WaveFooter from '../components/WaveFooter';

export default function LandingPage() {
  return (
    <div className="animate-page-enter">
      <main className="pb-0">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <LabsSection />
        <CertificationExamsSection />
        <HowItWorksSection />
      </main>
      <WaveFooter />
    </div>
  );
}
