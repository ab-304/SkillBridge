import React, { useEffect, useState } from 'react';
import projectApi from '../../services/projectApi';
import ProjectCard from '../project/ProjectCard';
import ProjectDetailModal from '../project/ProjectDetailModal';
import ApplyModal from '../project/ApplyModal';
import { CardSkeleton } from '../common/Skeleton';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [applyProject, setApplyProject] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await projectApi.getFeaturedProjects();
        if (data.success) {
          setProjects(data.projects || []);
        }
      } catch (err) {
        console.error('Failed to fetch featured projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> High-Impact Roles
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Featured Opportunities
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-base">
            Hand-picked internships and projects from top hiring startups.
          </p>
        </div>

        <Link
          to="/student/dashboard?tab=opportunities"
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors"
        >
          <span>View All Opportunities</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 glass-card rounded-2xl">
          <p className="text-slate-500">No featured opportunities right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((pr) => (
            <ProjectCard
              key={pr._id}
              project={pr}
              onApply={(p) => setApplyProject(p)}
              onViewDetails={(p) => setSelectedProject(p)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ProjectDetailModal
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
        onApply={(p) => {
          setSelectedProject(null);
          setApplyProject(p);
        }}
      />

      <ApplyModal
        isOpen={Boolean(applyProject)}
        onClose={() => setApplyProject(null)}
        project={applyProject}
      />
    </section>
  );
};

export default FeaturedProjects;
