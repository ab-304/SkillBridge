import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Rocket, Briefcase, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/20 via-indigo-600/20 to-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs font-semibold text-brand-600 dark:text-brand-400 mb-8 border border-brand-500/20 shadow-md"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>The #1 Opportunity Network for Tech Talent</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15]"
        >
          Bridge Your Skills To <br className="hidden sm:inline" />
          <span className="text-gradient">Real Opportunities.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          SkillBridge connects ambitious university students and developers directly with high-growth startups for paid internships, freelance gigs, and hackathons.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/student/dashboard?tab=opportunities"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl btn-gradient text-base font-bold flex items-center justify-center gap-2 group shadow-xl"
          >
            <span>Explore Opportunities</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-card text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-all border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2"
          >
            <Briefcase className="w-5 h-5 text-brand-500" />
            <span>Post a Project (Companies)</span>
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400"
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Verified Companies Only
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" /> 100% Paid Stipends
          </div>
          <div className="flex items-center gap-1.5">
            <Rocket className="w-4 h-4 text-brand-500" /> Fast-Track Applications
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
