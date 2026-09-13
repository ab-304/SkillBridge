import React, { useState } from 'react';
import { UserCheck, Search, Send, Building2, FilePlus, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const STUDENT_STEPS = [
  {
    step: '01',
    icon: UserCheck,
    title: 'Create Your Profile',
    desc: 'Sign up, add your college details, tech stack, GitHub, portfolio, and resume in under 2 minutes.',
  },
  {
    step: '02',
    icon: Search,
    title: 'Explore Opportunities',
    desc: 'Filter verified paid internships, freelance gigs, and hackathons matching your precise skills.',
  },
  {
    step: '03',
    icon: Send,
    title: 'Apply & Get Hired',
    desc: 'Submit 1-click applications, track review status live, and start building real-world projects.',
  },
];

const COMPANY_STEPS = [
  {
    step: '01',
    icon: Building2,
    title: 'Register Company',
    desc: 'Create your recruiter profile and showcase your company brand, engineering tech stack, and location.',
  },
  {
    step: '02',
    icon: FilePlus,
    title: 'Post Opportunities',
    desc: 'Publish internships or hackathons with custom stipend, required skills, and duration parameters.',
  },
  {
    step: '03',
    icon: CheckCircle2,
    title: 'Shortlist & Onboard',
    desc: 'Review candidate portfolios, shortlist top talent, and communicate directly with applicants.',
  },
];

const HowItWorks = () => {
  const [tab, setTab] = useState('student');
  const steps = tab === 'student' ? STUDENT_STEPS : COMPANY_STEPS;

  return (
    <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-xs uppercase font-bold tracking-widest text-brand-600 dark:text-brand-400 mb-3">
          Simple & Seamless Process
        </h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How SkillBridge Works
        </h3>

        {/* Tab Switcher */}
        <div className="mt-8 inline-flex p-1.5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80">
          <button
            onClick={() => setTab('student')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === 'student'
                ? 'btn-gradient text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            For Students
          </button>
          <button
            onClick={() => setTab('company')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === 'company'
                ? 'btn-gradient text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            For Companies
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((st, idx) => {
          const Icon = st.icon;
          return (
            <motion.div
              key={st.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 relative bg-white dark:bg-slate-900 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-3xl font-black text-slate-300 dark:text-slate-800">
                    {st.step}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {st.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default HowItWorks;
