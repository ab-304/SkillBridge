import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Sparkles } from 'lucide-react';

const DashboardSidebar = ({ items, activeTab, onSelectTab }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-full md:w-64 glass-card rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-xl shrink-0 h-fit">
      {/* Profile summary */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-brand-900/40 via-indigo-950/40 to-slate-900/40 border border-slate-200/40 dark:border-slate-800 mb-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 mx-auto flex items-center justify-center text-white text-lg font-extrabold shadow-md mb-2">
          {user?.name ? user.name.slice(0, 2).toUpperCase() : 'SB'}
        </div>
        <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{user?.name}</h4>
        <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 inline-block mt-1">
          {user?.role} Account
        </span>
      </div>

      {/* Nav items */}
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
