import React, { useState } from 'react';
import { Search, MapPin, Filter, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const POPULAR_SKILLS = ['React', 'Node.js', 'Python', 'Tailwind CSS', 'UI/UX Design', 'AI / ML', 'Docker'];

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('All');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/student/dashboard?tab=opportunities&search=${encodeURIComponent(query)}&mode=${mode}`);
  };

  const handleSkillClick = (skill) => {
    navigate(`/student/dashboard?tab=opportunities&search=${encodeURIComponent(skill)}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 -mt-6 mb-16 relative z-20">
      <div className="glass-card rounded-3xl p-3 sm:p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xl bg-white/90 dark:bg-slate-900/90">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-3">
          {/* Main Search Input */}
          <div className="flex-1 flex items-center gap-3 w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-transparent focus-within:border-brand-500 transition-colors">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by skill, title, or company (e.g. React, Developer, TechPulse)..."
              className="w-full bg-transparent text-sm font-medium placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none text-slate-900 dark:text-white"
            />
          </div>

          {/* Mode Selector */}
          <div className="w-full md:w-auto flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-transparent">
            <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="dark:bg-slate-900">All Locations</option>
              <option value="Remote" className="dark:bg-slate-900">Remote</option>
              <option value="Hybrid" className="dark:bg-slate-900">Hybrid</option>
              <option value="Onsite" className="dark:bg-slate-900">Onsite</option>
            </select>
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full md:w-auto px-6 py-3.5 btn-gradient rounded-2xl text-sm font-bold shrink-0">
            Search Now
          </button>
        </form>

        {/* Popular Skills Pills */}
        <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-2 flex-wrap text-xs">
          <span className="font-semibold text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Trending:
          </span>
          {POPULAR_SKILLS.map((sk) => (
            <button
              key={sk}
              onClick={() => handleSkillClick(sk)}
              className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950 dark:hover:text-brand-400 transition-colors font-medium"
            >
              {sk}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
