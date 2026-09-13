import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Hero from '../components/landing/Hero';
import SearchBar from '../components/landing/SearchBar';
import TrustedCompanies from '../components/landing/TrustedCompanies';
import FeaturedProjects from '../components/landing/FeaturedProjects';
import WhySkillBridge from '../components/landing/WhySkillBridge';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonials from '../components/landing/Testimonials';
import StatsCounter from '../components/landing/StatsCounter';
import FAQ from '../components/landing/FAQ';
import BackToTop from '../components/common/BackToTop';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <SearchBar />
        <TrustedCompanies />
        <FeaturedProjects />
        <WhySkillBridge />
        <HowItWorks />
        <Testimonials />
        <StatsCounter />
        <FAQ />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default LandingPage;
