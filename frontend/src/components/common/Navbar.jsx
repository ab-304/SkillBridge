import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';
import NotificationDropdown from './NotificationDropdown';
import {
  Sparkles,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Bookmark,
  ChevronDown,
  Send,
  PlusCircle,
  FolderKanban,
  Users,
  Building2,
  Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'student') return '/student/dashboard';
    if (user.role === 'company') return '/company/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    return '/';
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link to={user ? getDashboardPath() : '/'} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Skill<span className="text-brand-600 dark:text-brand-400">Bridge</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-slate-400">
                {user ? `${user.role} Hub` : 'Opportunities Hub'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            {!user ? (
              // PUBLIC NAVBAR
              <>
                <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Home
                </Link>
                <Link to="/register" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Projects
                </Link>
              </>
            ) : user.role === 'student' ? (
              // STUDENT NAVBAR
              <>
                <Link
                  to="/student/dashboard"
                  className={`hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1.5 font-semibold ${
                    location.pathname === '/student/dashboard' || location.search.includes('tab=overview')
                      ? 'text-brand-600 dark:text-brand-400 font-extrabold'
                      : ''
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-brand-500" /> Dashboard
                </Link>
                <Link
                  to="/student/opportunities"
                  className={`hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1.5 font-semibold ${
                    location.pathname === '/student/opportunities' || location.search.includes('tab=opportunities')
                      ? 'text-brand-600 dark:text-brand-400 font-extrabold'
                      : ''
                  }`}
                >
                  <Search className="w-4 h-4 text-brand-500" /> Opportunities
                </Link>
                <Link
                  to="/student/my-applications"
                  className={`hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1.5 font-semibold ${
                    location.pathname === '/student/my-applications' || location.pathname === '/student/applications' || location.search.includes('tab=applications')
                      ? 'text-brand-600 dark:text-brand-400 font-extrabold'
                      : ''
                  }`}
                >
                  <Send className="w-4 h-4 text-brand-500" /> My Applications
                </Link>
                <Link
                  to="/student/saved-projects"
                  className={`hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1.5 font-semibold ${
                    location.pathname === '/student/saved-projects' || location.pathname === '/student/saved' || location.search.includes('tab=saved')
                      ? 'text-brand-600 dark:text-brand-400 font-extrabold'
                      : ''
                  }`}
                >
                  <Bookmark className="w-4 h-4 text-brand-500" /> Saved Projects
                </Link>
              </>
            ) : user.role === 'company' ? (
              // COMPANY NAVBAR
              <>
                <Link
                  to="/company/dashboard"
                  className={`hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1.5 font-semibold ${
                    location.pathname === '/company/dashboard' || location.search.includes('tab=overview')
                      ? 'text-brand-600 dark:text-brand-400 font-extrabold'
                      : ''
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-brand-500" /> Dashboard
                </Link>
                <Link
                  to="/company/post-project"
                  className={`hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1.5 font-semibold ${
                    location.pathname === '/company/post-project' || location.pathname === '/company/post' || location.search.includes('tab=post')
                      ? 'text-brand-600 dark:text-brand-400 font-extrabold'
                      : ''
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-brand-500" /> Post Project
                </Link>
                <Link
                  to="/company/my-projects"
                  className={`hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1.5 font-semibold ${
                    location.pathname === '/company/my-projects' || location.pathname === '/company/projects' || location.search.includes('tab=projects')
                      ? 'text-brand-600 dark:text-brand-400 font-extrabold'
                      : ''
                  }`}
                >
                  <FolderKanban className="w-4 h-4 text-brand-500" /> My Projects
                </Link>
                <Link
                  to="/company/applicants"
                  className={`hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1.5 font-semibold ${
                    location.pathname === '/company/applicants' || location.search.includes('tab=applicants')
                      ? 'text-brand-600 dark:text-brand-400 font-extrabold'
                      : ''
                  }`}
                >
                  <Users className="w-4 h-4 text-brand-500" /> Applicants
                </Link>
              </>
            ) : (
              // ADMIN NAVBAR
              <Link
                to="/admin/dashboard"
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors font-semibold"
              >
                Admin Command Center
              </Link>
            )}
          </nav>

          {/* Actions & Profile */}
          <div className="hidden md:flex items-center gap-4">
            <DarkModeToggle />

            {user && <NotificationDropdown />}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                    {user.name ? user.name.slice(0, 2) : 'US'}
                  </div>
                  <div className="text-left text-xs">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</div>
                    <div className="text-slate-400 capitalize">{user.role}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onClick={() => setDropdownOpen(false)}
                      className="absolute right-0 mt-2 w-56 glass-card rounded-2xl p-2 shadow-2xl border border-slate-200 dark:border-slate-800 z-50 bg-white dark:bg-slate-900"
                    >
                      <button
                        onClick={() => navigate(getDashboardPath())}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-brand-500" />
                        Dashboard
                      </button>

                      {user.role === 'student' && (
                        <button
                          onClick={() => navigate('/student/dashboard?tab=profile')}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <User className="w-4 h-4 text-brand-500" />
                          My Profile
                        </button>
                      )}

                      {user.role === 'company' && (
                        <button
                          onClick={() => navigate('/company/dashboard?tab=profile')}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Building2 className="w-4 h-4 text-brand-500" />
                          Company Profile
                        </button>
                      )}

                      <div className="my-1 border-t border-slate-200 dark:border-slate-800" />

                      <button
                        onClick={() => {
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm btn-gradient shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <DarkModeToggle />
            {user && <NotificationDropdown />}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3"
          >
            {!user ? (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-base font-medium text-slate-700 dark:text-slate-200"
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-base font-medium text-slate-700 dark:text-slate-200"
                >
                  Projects
                </Link>
              </>
            ) : user.role === 'student' ? (
              <>
                <Link
                  to="/student/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-base font-semibold text-slate-900 dark:text-white"
                >
                  Dashboard
                </Link>
                <Link
                  to="/student/opportunities"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-base font-medium text-slate-700 dark:text-slate-200"
                >
                  Opportunities
                </Link>
                <Link
                  to="/student/my-applications"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-base font-medium text-slate-700 dark:text-slate-200"
                >
                  My Applications
                </Link>
                <Link
                  to="/student/saved-projects"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-base font-medium text-slate-700 dark:text-slate-200"
                >
                  Saved Projects
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/company/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-base font-semibold text-slate-900 dark:text-white"
                >
                  Dashboard
                </Link>
                <Link
                  to="/company/post-project"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-base font-medium text-slate-700 dark:text-slate-200"
                >
                  Post Project
                </Link>
                <Link
                  to="/company/my-projects"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-base font-medium text-slate-700 dark:text-slate-200"
                >
                  My Projects
                </Link>
                <Link
                  to="/company/applicants"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-base font-medium text-slate-700 dark:text-slate-200"
                >
                  Applicants
                </Link>
              </>
            )}

            {user ? (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left py-2 text-base font-medium text-rose-600"
                >
                  Logout ({user.name})
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 text-sm btn-gradient rounded-xl"
                >
                  Get Started
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
