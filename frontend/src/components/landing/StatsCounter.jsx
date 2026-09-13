import React, { useEffect, useState } from 'react';
import API from '../../services/api';

const StatsCounter = () => {
  const [stats, setStats] = useState({
    studentsCount: 0,
    companiesCount: 0,
    projectsCount: 0,
    applicationsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/stats');
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Failed to fetch platform stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const items = [
    { label: 'Active Students', value: stats.studentsCount },
    { label: 'Verified Startups', value: stats.companiesCount },
    { label: 'Live Opportunities', value: stats.projectsCount },
    { label: 'Applications Sent', value: stats.applicationsCount },
  ];

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="glass-card rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-brand-900/90 via-indigo-950/90 to-slate-900/90 text-white shadow-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {items.map((s) => (
            <div key={s.label} className="space-y-2">
              <div className="text-3xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-200 to-indigo-300">
                {loading ? (
                  <span className="opacity-50 animate-pulse">...</span>
                ) : (
                  s.value
                )}
              </div>
              <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
