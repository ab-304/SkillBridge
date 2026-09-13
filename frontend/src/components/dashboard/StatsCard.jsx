import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, trend, color = 'from-brand-500 to-indigo-600' }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-md relative overflow-hidden flex items-center justify-between"
    >
      <div className="space-y-1 z-10">
        <p className="text-xs uppercase font-bold tracking-wider text-slate-400">{title}</p>
        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</h3>
        {trend && (
          <p className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
            <span>{trend}</span>
          </p>
        )}
      </div>

      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} text-white flex items-center justify-center shadow-lg shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
    </motion.div>
  );
};

export default StatsCard;
