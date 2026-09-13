import React from 'react';
import Modal from '../common/Modal';
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Briefcase,
  Share2,
  Bookmark,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ProjectDetailModal = ({ isOpen, onClose, project, onApply }) => {
  const { user, toggleBookmark } = useAuth();
  const { addToast } = useToast();

  if (!project) return null;

  const isSaved =
    user?.role === 'student' &&
    user?.profile?.savedProjects?.some(
      (pid) => (pid._id || pid).toString() === project._id.toString()
    );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Opportunity link copied to clipboard!', 'success');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project.title} maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Banner Strip */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl shrink-0">
              {project.companyLogo || '🏢'}
            </div>
            <div>
              <h3 className="text-xl font-bold">{project.title}</h3>
              <p className="text-sm text-brand-200">{project.companyName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user?.role === 'student' && (
              <button
                onClick={() => toggleBookmark(project._id)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isSaved
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
              </button>
            )}
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onApply(project)}
              className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold shadow-lg flex items-center gap-1.5"
            >
              <span>Apply Now</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
          <div>
            <div className="text-slate-400 font-medium flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Stipend
            </div>
            <div className="font-bold text-slate-900 dark:text-white mt-1">{project.stipend}</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-500" /> Mode & Location
            </div>
            <div className="font-bold text-slate-900 dark:text-white mt-1">{project.mode} ({project.location})</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-500" /> Duration
            </div>
            <div className="font-bold text-slate-900 dark:text-white mt-1">{project.duration}</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-rose-500" /> Deadline
            </div>
            <div className="font-bold text-slate-900 dark:text-white mt-1">{project.deadline}</div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">About The Opportunity</h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </div>

        {/* Responsibilities */}
        {project.responsibilities && project.responsibilities.length > 0 && (
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Key Responsibilities</h4>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {project.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Requirements */}
        {project.requirements && project.requirements.length > 0 && (
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Requirements & Qualifications</h4>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {project.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills Required */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Skills Needed</h4>
          <div className="flex flex-wrap gap-2">
            {project.skills?.map((sk) => (
              <span
                key={sk}
                className="px-3 py-1 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold border border-brand-200 dark:border-brand-800"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProjectDetailModal;
