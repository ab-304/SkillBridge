import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    q: 'Is SkillBridge free for students?',
    a: 'Yes! SkillBridge is 100% free for all students. You can create your profile, browse opportunities, bookmark projects, and submit unlimited applications without any cost.',
  },
  {
    q: 'What types of opportunities are listed on SkillBridge?',
    a: 'We list verified paid internships, freelance contracts, hackathons, apprenticeships, and entry-level developer positions across software, AI, mobile development, UI/UX, and data science.',
  },
  {
    q: 'How do companies verify their listings?',
    a: 'Every company registration undergoes manual review by our team to confirm official domain emails, company website details, and legitimate paid stipend offerings.',
  },
  {
    q: 'Can non-US or international students apply?',
    a: 'Absolutely! Many of our listed opportunities specify "Remote (Global)" and welcome students from universities worldwide.',
  },
  {
    q: 'How do recruiters select candidates?',
    a: 'Recruiters review your submitted profile, cover letter, GitHub repository, portfolio link, and uploaded resume directly inside the Recruiter Applicants Dashboard.',
  },
];

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-3">
          <HelpCircle className="w-3.5 h-3.5" /> FAQ
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-4">
        {FAQS.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={item.q}
              className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white/90 dark:bg-slate-900/90"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left font-bold text-slate-900 dark:text-white text-base hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-brand-500' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-4"
                  >
                    {item.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;
