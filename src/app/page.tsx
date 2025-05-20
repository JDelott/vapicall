"use client";

import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";

import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <HeroSection />
      <CTASection />
      <HowItWorksSection />
      <FeaturesSection />

    </div>
  );
}
