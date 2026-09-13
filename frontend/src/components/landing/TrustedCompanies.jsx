import React, { useEffect, useState } from 'react';
import API from '../../services/api';

const TrustedCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await API.get('/companies');
        if (data.success) {
          setCompanies(data.companies || []);
        }
      } catch (err) {
        console.error('Failed to fetch registered companies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <section className="py-10 border-y border-slate-200 dark:border-slate-800/80 bg-slate-100/40 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-6">
          Trusted by High-Growth Startups & Industry Leaders
        </p>
        {loading ? (
          <div className="flex justify-center items-center gap-8 py-2">
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          </div>
        ) : companies.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No registered company profiles yet.</p>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-80 hover:opacity-100 transition-opacity">
            {companies.map((c) => (
              <div
                key={c._id || c.name}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-bold text-lg hover:text-brand-500 transition-colors"
              >
                <span className="text-2xl">{c.logo || '🏢'}</span>
                <span>{c.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrustedCompanies;
