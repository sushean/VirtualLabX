import React from 'react';
import Navbar from '../components/Navbar';
import FeaturesSection from '../components/FeaturesSection';
import WaveFooter from '../components/WaveFooter';

export default function FeaturesPage() {
  return (
    <div className="animate-page-enter min-h-screen bg-transparent">
      <main className="pt-24 pb-0">
        <FeaturesSection />
      </main>
      <WaveFooter />
    </div>
  );
}
