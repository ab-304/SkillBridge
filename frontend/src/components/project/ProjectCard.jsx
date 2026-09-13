import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Clock, MapPin, DollarSign, ArrowUpRight, Users, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProjectCard = ({ project, onApply, onViewDetails }) => {
  const { user, toggleBookmark } = useAuth();

  const isSaved =
    user?.role === 'student' &&
    user?.profile?.savedProjects?.some(
      (pid) => (pid._id || pid).toString() === project._id.toString()
    );

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-all duration-300 relative group bg-white/90 dark:bg-slate-900/90 shadow-md"
    >
      {project.featured && (
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
          <Sparkles className="w-3 h-3" /> Featured
        </div>
      )}

      <div>
        {/* Header info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl shrink-0 shadow-sm">
            {project.companyLogo || '🏢'}
          </div>
          <div className="pr-12">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {project.companyName}
            </h4>
            <h3
              onClick={() => onViewDetails(project)}
              className="text-lg font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer line-clamp-1 mt-0.5"
            >
              {project.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold border border-brand-200 dark:border-brand-800">
            {project.category}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> {project.stipend}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" /> {project.mode}
          </span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.skills?.slice(0, 4).map((sk) => (
            <span
              key={sk}
              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 text-[11px] font-medium"
            >
              {sk}
            </span>
          ))}
          {project.skills?.length > 4 && (
            <span className="text-[11px] text-slate-400 font-medium py-0.5">
              +{project.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {project.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> {project.applicantsCount || 0} applicants
          </span>
        </div>

        <div className="flex items-center gap-2">
          {user?.role === 'student' && (
            <button
              onClick={() => toggleBookmark(project._id)}
              className={`p-2 rounded-xl border transition-colors ${
                isSaved
                  ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                  : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title={isSaved ? 'Bookmarked' : 'Save Opportunity'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
            </button>
          )}

          <button
            onClick={() => onApply(project)}
            className="px-4 py-2 rounded-xl btn-gradient text-xs font-bold flex items-center gap-1"
          >
            <span>Apply</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
