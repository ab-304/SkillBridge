import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const REVIEWS = [
  {
    name: 'Alex Rivera',
    role: 'Full-Stack Developer Intern @ TechPulse',
    college: 'Stanford University',
    avatar: '👨‍💻',
    quote:
      'SkillBridge landed me my first paid remote internship within 1 week of setting up my profile. The 1-click apply feature saved me countless hours!',
    rating: 5,
  },
  {
    name: 'Sophia Patel',
    role: 'AI Apprentice @ CloudScale AI',
    college: 'MIT',
    avatar: '👩‍🔬',
    quote:
      'Finding real-world PyTorch opportunities was difficult on standard job boards. SkillBridge connected me directly with engineering founders.',
    rating: 5,
  },
  {
    name: 'David Chen',
    role: 'Head of Engineering @ PixelCraft Studios',
    college: 'Recruiter Partner',
    avatar: '👨‍💼',
    quote:
      'We hired two stellar student developers for our mobile UI revamp through SkillBridge. The quality of applicants and verified skills is top-tier.',
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-slate-100/50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-bold tracking-widest text-brand-600 dark:text-brand-400 mb-3">
            Real Impact & Results
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Loved by Students & Recruiter Teams
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((rev, idx) => (
            <motion.div
              key={rev.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-brand-500/20 mb-2" />
                <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed mb-6">
                  "{rev.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
                <div className="w-11 h-11 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-xl shrink-0">
                  {rev.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rev.name}</h4>
                  <p className="text-xs text-brand-600 dark:text-brand-400 font-medium">{rev.role}</p>
                  <p className="text-[11px] text-slate-400">{rev.college}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
