import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import API from '../../services/api';
import { FileText, Link as LinkIcon, Send, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ApplyModal = ({ isOpen, onClose, project }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [resume, setResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.profile) {
      setResume(user.profile.resume || '');
      setPortfolio(user.profile.portfolio || '');
    }
  }, [user]);

  if (!project) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      addToast('Please log in as a student to apply.', 'info');
      onClose();
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      addToast('Only student accounts can submit applications.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await API.post('/student/apply', {
        projectId: project._id,
        resume,
        coverLetter,
        portfolio,
      });

      if (data.success) {
        addToast('Application submitted successfully! Track status in your Dashboard.', 'success');
        onClose();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application.';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply to ${project.companyName}`} maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Role overview header */}
        <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs">
          <div className="font-bold text-slate-900 dark:text-white text-sm">{project.title}</div>
          <div className="text-brand-600 dark:text-brand-400 font-medium mt-0.5">
            Stipend: {project.stipend} • Mode: {project.mode}
          </div>
        </div>

        {/* Resume link field */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Resume / CV Link *
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="url"
              required
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="https://drive.google.com/your-resume.pdf"
              className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Portfolio link */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Portfolio / GitHub Link
          </label>
          <div className="relative">
            <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="url"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              placeholder="https://github.com/username or portfolio.dev"
              className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Cover Letter */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Cover Letter / Why You're a Fit
          </label>
          <textarea
            rows={4}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Share relevant projects, technical experience, and your availability..."
            className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-xl btn-gradient font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
        >
          {submitting ? (
            <span>Submitting Application...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Application</span>
            </>
          )}
        </button>
      </form>
    </Modal>
  );
};

export default ApplyModal;
