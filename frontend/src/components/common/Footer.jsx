import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white">SkillBridge</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Bridge Your Skills To Real Opportunities. Connecting ambitious students with high-growth startups and tech leaders.
            </p>
            <div className="flex gap-4 pt-2 text-slate-400">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">For Students</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/student/dashboard?tab=opportunities" className="hover:text-brand-400 transition-colors">Browse Internships</Link></li>
              <li><Link to="/student/dashboard?tab=opportunities" className="hover:text-brand-400 transition-colors">Freelance Projects</Link></li>
              <li><Link to="/student/dashboard?tab=opportunities" className="hover:text-brand-400 transition-colors">Hackathons 2026</Link></li>
              <li><Link to="/register" className="hover:text-brand-400 transition-colors">Create Student Profile</Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">For Companies</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/register" className="hover:text-brand-400 transition-colors">Post an Opportunity</Link></li>
              <li><Link to="/company/dashboard" className="hover:text-brand-400 transition-colors">Recruiter Dashboard</Link></li>
              <li><Link to="/company/dashboard" className="hover:text-brand-400 transition-colors">Hire Top Talent</Link></li>
              <li><a href="#faq" className="hover:text-brand-400 transition-colors">Pricing & Plans</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Stay Updated</h4>
            <p className="text-sm text-slate-400">Get weekly opportunity alerts directly in your inbox.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  placeholder="Enter your college email"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
              <button className="w-full btn-gradient py-2 rounded-xl text-sm font-medium">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SkillBridge Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for Students & Startups globally.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
