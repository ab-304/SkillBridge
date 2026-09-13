import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import StatsCard from '../components/dashboard/StatsCard';
import ProjectCard from '../components/project/ProjectCard';
import ProjectDetailModal from '../components/project/ProjectDetailModal';
import ApplyModal from '../components/project/ApplyModal';
import { CardSkeleton } from '../components/common/Skeleton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import projectApi from '../services/projectApi';
import {
  LayoutDashboard,
  Search as SearchIcon,
  Bookmark,
  Send,
  User,
  Settings as SettingsIcon,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  Sparkles,
  Award,
  FileText,
  Github,
  Linkedin,
  Globe,
  Plus,
  X,
  CalendarCheck,
  MapPin,
  Phone,
  Building,
  ExternalLink,
  ShieldCheck,
  Lock,
  Bell,
  Trash2,
} from 'lucide-react';

const SIDEBAR_ITEMS = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
  { id: 'opportunities', label: 'Opportunities', icon: SearchIcon, path: '/student/opportunities' },
  { id: 'joining', label: 'Upcoming Joining', icon: CalendarCheck, path: '/student/upcoming-joining' },
  { id: 'applications', label: 'My Applications', icon: Send, path: '/student/my-applications' },
  { id: 'saved', label: 'Saved Projects', icon: Bookmark, path: '/student/saved-projects' },
  { id: 'profile', label: 'My Profile', icon: User, path: '/student/profile' },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, path: '/student/settings' },
];

const StudentDashboard = ({ initialTab: propTab }) => {
  const { user, setUser, logout } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const searchTab = queryParams.get('tab');
  const initialSearch = queryParams.get('search') || '';
  const initialMode = queryParams.get('mode') || 'All';

  const getTabFromLocation = () => {
    const path = location.pathname;
    if (path.includes('/opportunities')) return 'opportunities';
    if (path.includes('/my-applications') || path.includes('/applications')) return 'applications';
    if (path.includes('/saved-projects') || path.includes('/saved')) return 'saved';
    if (path.includes('/upcoming-joining') || path.includes('/joining')) return 'joining';
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/settings')) return 'settings';
    return searchTab || propTab || 'overview';
  };

  const [activeTab, setActiveTab] = useState(getTabFromLocation());

  useEffect(() => {
    setActiveTab(getTabFromLocation());
  }, [location.pathname, location.search, propTab]);

  // Opportunities & Filters
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [modeFilter, setModeFilter] = useState(initialMode);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortOption, setSortOption] = useState('latest');

  // Modals
  const [selectedProject, setSelectedProject] = useState(null);
  const [applyProject, setApplyProject] = useState(null);

  // Applications
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    photo: '',
    college: '',
    degree: 'MCA',
    semester: 'Semester 4',
    gradYear: '2026',
    skills: '',
    bio: '',
    resume: '',
    github: '',
    linkedin: '',
    portfolio: '',
    preferredLocation: 'Remote / Hybrid',
    preferredMode: 'Remote',
  });

  // Settings State
  const [settingsForm, setSettingsForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    applicationAlerts: true,
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        photo: user.profile?.photo || '',
        college: user.profile?.college || '',
        degree: user.profile?.degree || 'MCA',
        semester: user.profile?.semester || 'Semester 4',
        gradYear: user.profile?.gradYear || '2026',
        skills: Array.isArray(user.profile?.skills) ? user.profile.skills.join(', ') : '',
        bio: user.profile?.bio || '',
        resume: user.profile?.resume || '',
        github: user.profile?.github || '',
        linkedin: user.profile?.linkedin || '',
        portfolio: user.profile?.portfolio || '',
        preferredLocation: user.profile?.preferredLocation || 'Remote',
        preferredMode: user.profile?.preferredMode || 'Remote',
      });
    }
  }, [user]);

  // Fetch Opportunities
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const data = await projectApi.getAllProjects({
        search,
        mode: modeFilter,
        category: categoryFilter,
        sort: sortOption,
      });
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Fetch Applications
  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      const { data } = await API.get('/student/applications');
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchApplications();
  }, [search, modeFilter, categoryFilter, sortOption]);

  // Profile completion calculation
  const calculateCompletion = () => {
    if (!user?.profile) return 30;
    let score = 20;
    if (user.profile.college) score += 15;
    if (user.profile.degree) score += 15;
    if (user.profile.skills && user.profile.skills.length > 0) score += 20;
    if (user.profile.resume) score += 15;
    if (user.profile.github || user.profile.portfolio) score += 15;
    return Math.min(score, 100);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put('/student/profile', profileForm);
      if (data.success) {
        setUser((prev) => ({
          ...prev,
          name: profileForm.name || prev.name,
          profile: data.profile,
        }));
        addToast('Student profile updated successfully!', 'success');
      }
    } catch (err) {
      addToast('Failed to update profile.', 'error');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (settingsForm.newPassword !== settingsForm.confirmPassword) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    try {
      const { data } = await API.put('/auth/change-password', {
        oldPassword: settingsForm.oldPassword,
        newPassword: settingsForm.newPassword,
      });
      if (data.success) {
        addToast('Password changed successfully!', 'success');
        setSettingsForm((prev) => ({ ...prev, oldPassword: '', newPassword: '', confirmPassword: '' }));
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to change password.', 'error');
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put('/auth/preferences', {
        emailNotifications: settingsForm.emailNotifications,
        applicationAlerts: settingsForm.applicationAlerts,
      });
      if (data.success) {
        addToast('Notification preferences updated!', 'success');
      }
    } catch (err) {
      addToast('Failed to save preferences.', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to permanently delete your student account? This action cannot be undone.')) {
      return;
    }
    try {
      const { data } = await API.delete('/auth/account');
      if (data.success) {
        addToast('Account deleted successfully.', 'info');
        logout();
        navigate('/');
      }
    } catch (err) {
      addToast('Failed to delete account.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19]">
      <Navbar />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <DashboardSidebar
            items={SIDEBAR_ITEMS}
            activeTab={activeTab}
            onSelectTab={(tabId) => {
              const targetItem = SIDEBAR_ITEMS.find((i) => i.id === tabId);
              if (targetItem?.path) {
                navigate(targetItem.path);
              } else {
                setActiveTab(tabId);
              }
            }}
          />

          {/* Main Dashboard Content */}
          <div className="flex-1 space-y-8">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Header Welcome */}
                <div className="p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-widest text-brand-300">
                      Student Workspace
                    </span>
                    <h2 className="text-3xl font-extrabold tracking-tight mt-1">
                      Welcome back, {user?.name}! 👋
                    </h2>
                    <p className="text-sm text-slate-300 mt-2 max-w-xl">
                      Here is what is happening with your opportunity applications and recommended projects today.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/student/opportunities')}
                    className="px-6 py-3 rounded-2xl btn-gradient text-sm font-bold shrink-0 shadow-lg"
                  >
                    Browse Opportunities
                  </button>
                </div>

                {/* UPCOMING JOINING BANNER IF SELECTED */}
                {applications.filter((a) => a.status === 'Selected' || a.status === 'Accepted').length > 0 && (
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl border border-emerald-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
                            🎉 Offer Confirmed & Selected
                          </span>
                          <h3 className="text-xl font-black">Upcoming Joining Confirmed!</h3>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/student/upcoming-joining')}
                        className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-md hover:bg-emerald-400 transition-colors"
                      >
                        View Full Joining Details →
                      </button>
                    </div>
                  </div>
                )}

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard
                    title="Applications Sent"
                    value={applications.length}
                    icon={Send}
                    color="from-brand-500 to-brand-700"
                  />
                  <StatsCard
                    title="Selected & Joining"
                    value={applications.filter((a) => a.status === 'Selected' || a.status === 'Accepted').length}
                    icon={CalendarCheck}
                    color="from-emerald-500 to-emerald-700"
                  />
                  <StatsCard
                    title="Shortlisted"
                    value={applications.filter((a) => a.status === 'Shortlisted').length}
                    icon={CheckCircle2}
                    color="from-amber-500 to-amber-700"
                  />
                  <StatsCard
                    title="Profile Score"
                    value={`${calculateCompletion()}%`}
                    icon={Award}
                    color="from-indigo-500 to-indigo-700"
                  />
                </div>

                {/* Profile Completion Widget */}
                <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Profile Completion Progress
                    </h3>
                    <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400">
                      {calculateCompletion()}% Completed
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-brand-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${calculateCompletion()}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                    Tip: Complete your skills array and upload your resume link to double your recruiter response rate.
                  </p>
                </div>

                {/* Recommended Opportunities */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" /> Recommended For You
                  </h3>
                  {loadingProjects ? (
                    <CardSkeleton />
                  ) : projects.filter((p) => !applications.some((a) => (a.projectId?._id || a.projectId) === p._id)).length === 0 ? (
                    <div className="text-center py-10 glass-card rounded-2xl">
                      <p className="text-xs text-slate-500">You have applied to all available opportunities! Check back soon for new postings.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {projects
                        .filter((p) => !applications.some((a) => (a.projectId?._id || a.projectId) === p._id))
                        .slice(0, 4)
                        .map((pr) => (
                          <ProjectCard
                            key={pr._id}
                            project={pr}
                            onApply={(p) => setApplyProject(p)}
                            onViewDetails={(p) => setSelectedProject(p)}
                          />
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* OPPORTUNITIES TAB */}
            {activeTab === 'opportunities' && (
              <div className="space-y-6">
                {/* Search & Filters Controls Header */}
                <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-md space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by title, company, or skill (e.g. React, Developer)..."
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <select
                        value={modeFilter}
                        onChange={(e) => setModeFilter(e.target.value)}
                        className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200"
                      >
                        <option value="All">All Modes</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Onsite">Onsite</option>
                      </select>

                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200"
                      >
                        <option value="All">All Types</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Hackathon">Hackathon</option>
                        <option value="Apprenticeship">Apprenticeship</option>
                      </select>

                      <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200"
                      >
                        <option value="latest">Sort: Latest</option>
                        <option value="highestStipend">Highest Stipend</option>
                        <option value="deadline">Upcoming Deadline</option>
                        <option value="popular">Most Popular</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Project List */}
                {loadingProjects ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CardSkeleton />
                    <CardSkeleton />
                  </div>
                ) : projects.filter((p) => !applications.some((a) => (a.projectId?._id || a.projectId) === p._id)).length === 0 ? (
                  <div className="text-center py-16 glass-card rounded-2xl">
                    <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300">No new opportunities found</h4>
                    <p className="text-sm text-slate-500 mt-1">You have applied to all available opportunities matching your filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects
                      .filter((p) => !applications.some((a) => (a.projectId?._id || a.projectId) === p._id))
                      .map((pr) => (
                        <ProjectCard
                          key={pr._id}
                          project={pr}
                          onApply={(p) => setApplyProject(p)}
                          onViewDetails={(p) => setSelectedProject(p)}
                        />
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* UPCOMING JOINING TAB */}
            {activeTab === 'joining' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarCheck className="w-6 h-6 text-emerald-500" /> Upcoming Joining Portal
                </h3>

                {applications.filter((a) => a.status === 'Selected' || a.status === 'Accepted').length === 0 ? (
                  <div className="text-center py-16 glass-card rounded-2xl">
                    <CalendarCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No confirmed upcoming joining offers yet.</p>
                    <p className="text-xs text-slate-400 mt-1">When a corporate recruiter marks you as Selected, your full onboarding & HR schedule will appear here!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {applications
                      .filter((a) => a.status === 'Selected' || a.status === 'Accepted')
                      .map((app) => (
                        <div
                          key={app._id}
                          className="glass-card rounded-3xl p-8 border border-emerald-500/30 bg-gradient-to-br from-white via-emerald-50/20 to-slate-900/10 dark:from-slate-900 dark:via-emerald-950/20 dark:to-slate-950 shadow-2xl space-y-6"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                            <div>
                              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-500/20">
                                🎉 OFFER CONFIRMED & SELECTED
                              </span>
                              <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                                {app.projectId?.title || 'Opportunity'}
                              </h4>
                              <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                                {app.projectId?.companyName || 'Corporate Partner'}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 space-y-1">
                              <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-emerald-500" /> Joining Date & Time
                              </span>
                              <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                                {app.joiningDetails?.joiningDate || 'TBD'}
                              </div>
                              <div className="text-slate-500 font-medium">
                                {app.joiningDetails?.joiningTime || '09:30 AM'}
                              </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 space-y-1">
                              <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                                <Briefcase className="w-3.5 h-3.5 text-brand-500" /> Work Mode & Duration
                              </span>
                              <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                                {app.joiningDetails?.workMode || app.projectId?.mode || 'Remote'}
                              </div>
                              <div className="text-slate-500 font-medium">
                                {app.projectId?.duration || '3 Months'}
                              </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 space-y-1 col-span-1 sm:col-span-2">
                              <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-rose-500" /> Reporting Location / Onboarding Link
                              </span>
                              <div className="font-bold text-slate-900 dark:text-white text-xs leading-relaxed">
                                {app.joiningDetails?.reportingAddress || 'Remote Onboarding (Check Welcome Message)'}
                              </div>
                            </div>
                          </div>

                          {/* HR Contact Box */}
                          <div className="p-5 rounded-2xl bg-brand-500/5 border border-brand-500/20 space-y-3">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
                              <User className="w-4 h-4" /> Assigned Reporting Manager & HR Contact
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                              <div>
                                <span className="text-slate-400 block text-[10px]">Reporting Manager:</span>
                                <span className="font-bold text-slate-900 dark:text-white">{app.joiningDetails?.hrName || 'Talent Acquisition Team'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px]">HR Contact Email:</span>
                                <a href={`mailto:${app.joiningDetails?.hrEmail}`} className="font-bold text-brand-500 hover:underline">{app.joiningDetails?.hrEmail || 'hr@company.com'}</a>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px]">HR Phone:</span>
                                <span className="font-bold text-slate-900 dark:text-white">{app.joiningDetails?.hrPhone || '+1 (555) 000-0000'}</span>
                              </div>
                            </div>
                          </div>

                          {app.joiningDetails?.welcomeMessage && (
                            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 text-xs italic text-slate-700 dark:text-slate-300">
                              "{app.joiningDetails.welcomeMessage}"
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* SAVED PROJECTS TAB */}
            {activeTab === 'saved' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Your Bookmarked Opportunities
                </h3>
                {user?.profile?.savedProjects?.length === 0 ? (
                  <div className="text-center py-16 glass-card rounded-2xl">
                    <Bookmark className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No saved projects yet. Click the bookmark icon on any opportunity card!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(user?.profile?.savedProjects || []).map((pr) => (
                      <ProjectCard
                        key={pr._id || pr}
                        project={pr.title ? pr : projects.find((p) => p._id === pr) || pr}
                        onApply={(p) => setApplyProject(p)}
                        onViewDetails={(p) => setSelectedProject(p)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* APPLICATIONS TAB */}
            {activeTab === 'applications' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Submitted Applications Tracker ({applications.length})
                </h3>
                {applications.length === 0 ? (
                  <div className="text-center py-16 glass-card rounded-2xl">
                    <Send className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">You haven't submitted any applications yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {applications.map((app) => {
                      const stages = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected'];
                      const currentStageIdx = app.status === 'Rejected' ? 4 : Math.max(0, stages.indexOf(app.status));

                      return (
                        <div
                          key={app._id}
                          className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-md space-y-5"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-extrabold text-slate-900 dark:text-white text-lg">
                                  {app.projectId?.title || 'Opportunity'}
                                </h4>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${
                                    app.status === 'Selected'
                                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                                      : app.status === 'Interview Scheduled'
                                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                                      : app.status === 'Shortlisted'
                                      ? 'bg-brand-500/10 text-brand-500 border-brand-500/30'
                                      : app.status === 'Under Review'
                                      ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30'
                                      : app.status === 'Rejected'
                                      ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                                      : 'bg-sky-500/10 text-sky-500 border-sky-500/30'
                                  }`}
                                >
                                  {app.status}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Applied on: {new Date(app.appliedDate || app.createdAt).toLocaleDateString()}
                              </p>
                            </div>

                            {app.resume && (
                              <a
                                href={app.resume}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors flex items-center gap-1.5 shrink-0"
                              >
                                <FileText className="w-3.5 h-3.5" /> View Resume
                              </a>
                            )}
                          </div>

                          {/* Stage Progress Bar */}
                          <div className="pt-2">
                            <div className="relative flex items-center justify-between">
                              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
                              <div
                                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-500 -translate-y-1/2 transition-all duration-500 z-0"
                                style={{
                                  width: `${(currentStageIdx / (stages.length - 1)) * 100}%`,
                                }}
                              />

                              {stages.map((stg, i) => {
                                const isPassed = i <= currentStageIdx && app.status !== 'Rejected';
                                const isCurrent = stages[i] === app.status;

                                return (
                                  <div key={stg} className="relative z-10 flex flex-col items-center">
                                    <div
                                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                                        app.status === 'Rejected' && i === currentStageIdx
                                          ? 'bg-rose-500 text-white ring-4 ring-rose-500/20'
                                          : isCurrent
                                          ? 'bg-brand-600 text-white ring-4 ring-brand-500/30 scale-110'
                                          : isPassed
                                          ? 'bg-emerald-500 text-slate-950 font-extrabold'
                                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                                      }`}
                                    >
                                      {isPassed ? '✓' : i + 1}
                                    </div>
                                    <span
                                      className={`text-[10px] font-semibold mt-1.5 text-center ${
                                        isCurrent
                                          ? 'text-brand-600 dark:text-brand-400 font-extrabold'
                                          : 'text-slate-400'
                                      }`}
                                    >
                                      {stg}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    Edit Student Profile
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Update your full profile details to help corporate recruiters review your background.
                  </p>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Profile Photo Link / Avatar URL
                      </label>
                      <input
                        type="url"
                        value={profileForm.photo}
                        onChange={(e) => setProfileForm({ ...profileForm, photo: e.target.value })}
                        placeholder="https://example.com/photo.jpg"
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        College / University
                      </label>
                      <input
                        type="text"
                        value={profileForm.college}
                        onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                        placeholder="Stanford / MIT / Tech University"
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Course / Degree (e.g. MCA, B.Tech)
                      </label>
                      <input
                        type="text"
                        value={profileForm.degree}
                        onChange={(e) => setProfileForm({ ...profileForm, degree: e.target.value })}
                        placeholder="MCA / B.Tech Computer Science"
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Current Semester
                      </label>
                      <input
                        type="text"
                        value={profileForm.semester}
                        onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value })}
                        placeholder="Semester 4"
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Graduation Year
                      </label>
                      <input
                        type="text"
                        value={profileForm.gradYear}
                        onChange={(e) => setProfileForm({ ...profileForm, gradYear: e.target.value })}
                        placeholder="2026"
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Preferred Work Mode
                      </label>
                      <select
                        value={profileForm.preferredMode}
                        onChange={(e) => setProfileForm({ ...profileForm, preferredMode: e.target.value })}
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      >
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Onsite">Onsite</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Preferred Location
                      </label>
                      <input
                        type="text"
                        value={profileForm.preferredLocation}
                        onChange={(e) => setProfileForm({ ...profileForm, preferredLocation: e.target.value })}
                        placeholder="San Francisco, CA / Remote"
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Skills (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={profileForm.skills}
                      onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                      placeholder="React, Node.js, MongoDB, Python, Tailwind CSS"
                      className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      About / Bio Summary
                    </label>
                    <textarea
                      rows={3}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="Passionate full stack developer interested in web platforms and scalable cloud systems..."
                      className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Resume / CV Link *
                      </label>
                      <input
                        type="url"
                        value={profileForm.resume}
                        onChange={(e) => setProfileForm({ ...profileForm, resume: e.target.value })}
                        placeholder="https://drive.google.com/resume.pdf"
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        GitHub Profile Link
                      </label>
                      <input
                        type="url"
                        value={profileForm.github}
                        onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                        placeholder="https://github.com/username"
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        LinkedIn Profile Link
                      </label>
                      <input
                        type="url"
                        value={profileForm.linkedin}
                        onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Portfolio / Personal Website
                    </label>
                    <input
                      type="url"
                      value={profileForm.portfolio}
                      onChange={(e) => setProfileForm({ ...profileForm, portfolio: e.target.value })}
                      placeholder="https://alexrivera.dev"
                      className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl btn-gradient font-bold text-sm shadow-lg"
                  >
                    Save Profile Changes
                  </button>
                </form>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Security Settings */}
                <div className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Change Password
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Update your account authentication credentials.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={settingsForm.oldPassword}
                        onChange={(e) => setSettingsForm({ ...settingsForm, oldPassword: e.target.value })}
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        New Password
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={settingsForm.newPassword}
                        onChange={(e) => setSettingsForm({ ...settingsForm, newPassword: e.target.value })}
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={settingsForm.confirmPassword}
                        onChange={(e) => setSettingsForm({ ...settingsForm, confirmPassword: e.target.value })}
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl btn-gradient font-bold text-xs shadow-md"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

                {/* Email Preferences */}
                <div className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Notification Preferences
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Choose how and when SkillBridge alerts you about new opportunities.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSavePreferences} className="space-y-4 max-w-md">
                    <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 cursor-pointer">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm block">Email Notifications</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block">Receive emails when recruiters review your application</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settingsForm.emailNotifications}
                        onChange={(e) => setSettingsForm({ ...settingsForm, emailNotifications: e.target.checked })}
                        className="w-5 h-5 accent-brand-600 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 cursor-pointer">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm block">Application Status Alerts</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block">Instant alerts on interview scheduling and offer selection</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settingsForm.applicationAlerts}
                        onChange={(e) => setSettingsForm({ ...settingsForm, applicationAlerts: e.target.checked })}
                        className="w-5 h-5 accent-brand-600 rounded"
                      />
                    </label>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 text-white font-bold text-xs shadow-md"
                    >
                      Save Notification Settings
                    </button>
                  </form>
                </div>

                {/* Account Actions & Danger Zone */}
                <div className="glass-card rounded-3xl p-8 border border-rose-500/20 bg-rose-500/5 shadow-xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                      <Trash2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-rose-600 dark:text-rose-400">
                        Danger Zone
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Permanently erase your student account profile and data.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleDeleteAccount}
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    Delete Student Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

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
      <Footer />
    </div>
  );
};

export default StudentDashboard;
