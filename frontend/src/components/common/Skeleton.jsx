import React from 'react';

export const CardSkeleton = () => (
  <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 animate-pulse space-y-4">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
      </div>
    </div>
    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
    <div className="flex gap-2 pt-2">
      <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg" />
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="animate-pulse border-b border-slate-200 dark:border-slate-800">
    <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32" /></td>
    <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" /></td>
    <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20" /></td>
    <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16" /></td>
  </tr>
);
