import React from 'react';
import { ShieldCheck, Zap, Award, Target, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Verified Startup Listings',
    desc: 'Every company profile and opportunity is manually reviewed to eliminate spam and guarantee 100% genuine paid roles.',
    color: 'text-brand-500 bg-brand-500/10 border-brand-500/20',
  },
  {
    icon: Zap,
    title: '1-Click Application Flow',
    desc: 'Apply effortlessly with your auto-generated SkillBridge resume, GitHub, and portfolio link without redundant form filling.',
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  },
  {
    icon: Award,
    title: 'Skills Certification & Badges',
    desc: 'Showcase verified proficiency in React, Node, Python, and UI/UX design directly on your student profile card.',
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    icon: Target,
    title: 'Direct Recruiter Access',
    desc: 'Bypass generic job portals. Get discovered by hiring managers and engineering founders looking for active student talent.',
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
];

const WhySkillBridge = () => {
  return (
    <section className="py-20 bg-slate-100/50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-bold tracking-widest text-brand-600 dark:text-brand-400 mb-3">
            Built for Modern Careers
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why Students & Companies Choose SkillBridge
          </h3>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base">
            Everything you need to showcase your real-world capabilities and launch your software career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((f, idx) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-lg"
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-6 ${f.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{f.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhySkillBridge;
