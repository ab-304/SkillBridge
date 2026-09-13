import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import StatsCard from '../components/dashboard/StatsCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import projectApi from '../services/projectApi';
import SelectionModal from '../components/company/SelectionModal';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  Users,
  Building2,
  BarChart3,
  Settings as SettingsIcon,
  CheckCircle2,
  XCircle,
  UserCheck,
  FileText,
  Trash2,
  Edit,
  ExternalLink,
  DollarSign,
  Clock,
  MapPin,
  Sparkles,
  Lock,
  Bell,
  User,
  Globe,
  Github,
  Linkedin,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';

const SIDEBAR_ITEMS = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, path: '/company/dashboard' },
  { id: 'post', label: 'Post Opportunity', icon: PlusCircle, path: '/company/post-project' },
  { id: 'projects', label: 'My Opportunities', icon: FolderKanban, path: '/company/my-projects' },
  { id: 'applicants', label: 'Candidate Reviewer', icon: Users, path: '/company/applicants' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/company/analytics' },
  { id: 'profile', label: 'Company Profile', icon: Building2, path: '/company/profile' },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, path: '/company/settings' },
];

const COLORS = ['#2563EB', '#4F46E5', '#10B981', '#F59E0B', '#EC4899'];

const CompanyDashboard = ({ initialTab: propTab }) => {
  const { user, setUser, logout } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const searchTab = queryParams.get('tab');

  const getTabFromLocation = () => {
    const path = location.pathname;
    if (path.includes('/post-project') || path.includes('/post')) return 'post';
    if (path.includes('/my-projects') || path.includes('/projects')) return 'projects';
    if (path.includes('/applicants')) return 'applicants';
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/settings')) return 'settings';
    return searchTab || propTab || 'overview';
  };

  const [activeTab, setActiveTab] = useState(getTabFromLocation());

  useEffect(() => {
    setActiveTab(getTabFromLocation());
  }, [location.pathname, location.search, propTab]);

  // State data
  const [projects, setProjects] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Candidate detail modal state
  const [viewCandidate, setViewCandidate] = useState(null);

  // Post form state
  const [postForm, setPostForm] = useState({
    title: '',
    description: '',
    category: 'Internship',
    skills: 'React, Node.js',
    stipend: '$2,000 / month',
    mode: 'Remote',
    location: 'Remote',
    duration: '3 Months',
    deadline: '2026-11-30',
    openings: 2,
    experienceLevel: 'Intermediate',
  });

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    companyName: user?.name || '',
    industry: 'Software & Tech',
    website: 'https://company.io',
    about: 'Leading innovative technology team.',
    location: 'San Francisco, CA',
    companySize: '10-50 Employees',
    hrEmail: user?.email || 'hr@company.com',
    phone: '+1 (555) 019-2831',
    foundedYear: '2021',
    linkedin: 'https://linkedin.com/company/techpulse',
    github: 'https://github.com/techpulse-org',
    logo: '',
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailAlerts: true,
    candidateAlerts: true,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, appRes, profRes] = await Promise.all([
        API.get('/company/projects'),
        API.get('/company/applicants'),
        API.get('/company/profile'),
      ]);
      if (projRes.data.success) setProjects(projRes.data.projects);
      if (appRes.data.success) setApplicants(appRes.data.applications);
      if (profRes.data.success && profRes.data.profile) {
        const p = profRes.data.profile;
        setProfileForm({
          companyName: p.companyName || user?.name || '',
          industry: p.industry || 'Software & Tech',
          website: p.website || '',
          about: p.about || '',
          location: p.location || 'San Francisco, CA',
          companySize: p.companySize || p.employees || '10-50 Employees',
          hrEmail: p.hrEmail || user?.email || '',
          phone: p.phone || '',
          foundedYear: p.foundedYear || '2021',
          linkedin: p.linkedin || '',
          github: p.github || '',
          logo: p.logo || '',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await projectApi.createProject({
        ...postForm,
        skills: typeof postForm.skills === 'string' ? postForm.skills.split(',').map((s) => s.trim()) : postForm.skills,
      });
      if (data.success) {
        addToast('New opportunity published successfully!', 'success');
        setProjects([data.project, ...projects]);
        navigate('/company/my-projects');
      }
    } catch (err) {
      addToast('Failed to publish opportunity.', 'error');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put('/company/profile', profileForm);
      if (data.success) {
        setUser((prev) => ({
          ...prev,
          name: profileForm.companyName || prev.name,
          profile: data.profile,
        }));
        addToast('Company Profile updated successfully!', 'success');
      }
    } catch (err) {
      addToast('Failed to update company profile.', 'error');
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
        addToast('Password updated successfully!', 'success');
        setSettingsForm((prev) => ({ ...prev, oldPassword: '', newPassword: '', confirmPassword: '' }));
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update password.', 'error');
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put('/auth/preferences', {
        emailAlerts: settingsForm.emailAlerts,
        candidateAlerts: settingsForm.candidateAlerts,
      });
      if (data.success) {
        addToast('Company notification settings saved!', 'success');
      }
    } catch (err) {
      addToast('Failed to save settings.', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to permanently delete your company recruiter account and all listed opportunities?')) {
      return;
    }
    try {
      const { data } = await API.delete('/auth/account');
      if (data.success) {
        addToast('Company account deleted.', 'info');
        logout();
        navigate('/');
      }
    } catch (err) {
      addToast('Failed to delete account.', 'error');
    }
  };

  // Selection Modal state
  const [selectedApplicantForOffer, setSelectedApplicantForOffer] = useState(null);
  const [applicantStatusFilter, setApplicantStatusFilter] = useState('All');

  const handleStatusChange = async (applicationId, status) => {
    if (status === 'Selected') {
      const targetApp = applicants.find((a) => a._id === applicationId);
      if (targetApp) {
        setSelectedApplicantForOffer(targetApp);
        return;
      }
    }

    try {
      const { data } = await API.put(`/company/applicants/${applicationId}/status`, { status });
      if (data.success) {
        addToast(`Candidate marked as ${status}!`, 'success');
        setApplicants((prev) =>
          prev.map((a) => (a._id === applicationId ? { ...a, status } : a))
        );
      }
    } catch (err) {
      addToast('Failed to update candidate status.', 'error');
    }
  };

  const handleConfirmSelect = async (applicationId, joiningDetails) => {
    try {
      const { data } = await API.put(`/company/applicants/${applicationId}/status`, {
        status: 'Selected',
        joiningDetails,
      });
      if (data.success) {
        addToast('🎉 Candidate selected & joining offer sent successfully!', 'success');
        setApplicants((prev) =>
          prev.map((a) => (a._id === applicationId ? { ...a, status: 'Selected', joiningDetails } : a))
        );
      }
    } catch (err) {
      addToast('Failed to complete candidate selection.', 'error');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this opportunity?')) return;
    try {
      const data = await projectApi.deleteProject(id);
      if (data.success) {
        addToast('Opportunity deleted.', 'info');
        setProjects((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      addToast('Failed to delete project.', 'error');
    }
  };

  // Chart data calculation
  const chartData = projects.map((p) => ({
    name: p.title.slice(0, 15) + '...',
    applicants: p.applicantsCount || 0,
  }));

  const pieData = [
    { name: 'Shortlisted', value: applicants.filter((a) => a.status === 'Shortlisted').length },
    { name: 'Accepted', value: applicants.filter((a) => a.status === 'Accepted' || a.status === 'Selected').length },
    { name: 'Under Review', value: applicants.filter((a) => a.status === 'Under Review' || a.status === 'Applied').length },
    { name: 'Rejected', value: applicants.filter((a) => a.status === 'Rejected').length },
  ];

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

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Banner */}
                <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-brand-900 to-slate-900 text-white shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-widest text-indigo-300">
                      Recruiter Hub
                    </span>
                    <h2 className="text-3xl font-extrabold tracking-tight mt-1">
                      {user?.name} Portal 🏢
                    </h2>
                    <p className="text-sm text-slate-300 mt-2 max-w-xl">
                      Manage active job postings, review top student applicants, and track candidate pipeline.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/company/post-project')}
                    className="px-6 py-3 rounded-2xl btn-gradient text-sm font-bold shrink-0 shadow-lg flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post New Role</span>
                  </button>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard
                    title="Active Postings"
                    value={projects.length}
                    icon={FolderKanban}
                    color="from-brand-500 to-brand-700"
                  />
                  <StatsCard
                    title="Total Applications"
                    value={applicants.length}
                    icon={Users}
                    color="from-indigo-500 to-indigo-700"
                  />
                  <StatsCard
                    title="Shortlisted Candidates"
                    value={applicants.filter((a) => a.status === 'Shortlisted').length}
                    icon={UserCheck}
                    color="from-amber-500 to-amber-700"
                  />
                  <StatsCard
                    title="Selected Offers"
                    value={applicants.filter((a) => a.status === 'Selected' || a.status === 'Accepted').length}
                    icon={CheckCircle2}
                    color="from-emerald-500 to-emerald-700"
                  />
                </div>

                {/* Recharts Bar Chart */}
                <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-md">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-4">
                    Applications per Opportunity Posting
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }}
                        />
                        <Bar dataKey="applicants" fill="#2563EB" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* POST OPPORTUNITY TAB */}
            {activeTab === 'post' && (
              <div className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    Post New Opportunity
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Fill out the multi-section form below to list an internship, freelance contract, or hackathon.
                  </p>
                </div>

                <form onSubmit={handlePostSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Opportunity Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={postForm.title}
                        onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                        placeholder="Full Stack React Developer Intern"
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Category *
                      </label>
                      <select
                        value={postForm.category}
                        onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      >
                        <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Hackathon">Hackathon</option>
                        <option value="Apprenticeship">Apprenticeship</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Stipend / Pay *
                      </label>
                      <input
                        type="text"
                        required
                        value={postForm.stipend}
                        onChange={(e) => setPostForm({ ...postForm, stipend: e.target.value })}
                        placeholder="$2,500 / month"
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Work Mode
                      </label>
                      <select
                        value={postForm.mode}
                        onChange={(e) => setPostForm({ ...postForm, mode: e.target.value })}
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      >
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Onsite">Onsite</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={postForm.duration}
                        onChange={(e) => setPostForm({ ...postForm, duration: e.target.value })}
                        placeholder="3 Months"
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Required Skills (Comma Separated)
                    </label>
                    <input
                      type="text"
                      required
                      value={postForm.skills}
                      onChange={(e) => setPostForm({ ...postForm, skills: e.target.value })}
                      placeholder="React, Node.js, MongoDB, Tailwind CSS"
                      className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Description & Scope *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={postForm.description}
                      onChange={(e) => setPostForm({ ...postForm, description: e.target.value })}
                      placeholder="Describe the role responsibilities, tech stack, and what the student will learn..."
                      className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-xl btn-gradient font-bold text-sm shadow-lg flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Publish Opportunity</span>
                  </button>
                </form>
              </div>
            )}

            {/* MY PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Manage Posted Opportunities ({projects.length})
                </h3>

                {projects.length === 0 ? (
                  <div className="text-center py-16 glass-card rounded-2xl">
                    <FolderKanban className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">You have not posted any opportunities yet.</p>
                    <button
                      onClick={() => navigate('/company/post-project')}
                      className="mt-4 px-5 py-2.5 rounded-xl btn-gradient text-xs font-bold shadow-md"
                    >
                      Post Your First Opportunity
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((pr) => (
                      <div
                        key={pr._id}
                        className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 flex flex-col justify-between shadow-md space-y-4"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-500 text-xs font-bold">
                              {pr.category}
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">
                              {pr.applicantsCount || 0} Applicants
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-lg">{pr.title}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                            {pr.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-500">{pr.stipend}</span>
                          <button
                            onClick={() => handleDeleteProject(pr._id)}
                            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* APPLICANTS TAB */}
            {activeTab === 'applicants' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    Candidate Applicants Board ({applicants.length})
                  </h3>

                  {/* Status Filter Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'].map((st) => {
                      const count = st === 'All' ? applicants.length : applicants.filter((a) => a.status === st).length;
                      return (
                        <button
                          key={st}
                          onClick={() => setApplicantStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            applicantStatusFilter === st
                              ? 'bg-brand-600 text-white shadow-md'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {st} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {applicants.length === 0 ? (
                  <div className="text-center py-16 glass-card rounded-2xl">
                    <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No candidates have applied to your postings yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applicants
                      .filter((a) => applicantStatusFilter === 'All' || a.status === applicantStatusFilter)
                      .map((app) => (
                        <div
                          key={app._id}
                          className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-md space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                                {app.studentName ? app.studentName.slice(0, 2).toUpperCase() : 'ST'}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-base">{app.studentName}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {app.college || 'University'} • Applied for: <span className="font-semibold text-brand-500">{app.projectId?.title}</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => setViewCandidate(app)}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
                              >
                                <User className="w-3.5 h-3.5" /> View Profile
                              </button>

                              <span
                                className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
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
                          </div>

                          {/* Skills pill array */}
                          {app.skills && app.skills.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {(Array.isArray(app.skills) ? app.skills : String(app.skills).split(',')).map((sk, i) => (
                                <span key={i} className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold">
                                  {sk.trim()}
                                </span>
                              ))}
                            </div>
                          )}

                          {app.coverLetter && (
                            <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-slate-100 dark:bg-slate-800/60 p-3 rounded-xl">
                              "{app.coverLetter}"
                            </p>
                          )}

                          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3">
                              {app.resume && (
                                <a
                                  href={app.resume}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1 hover:bg-slate-200"
                                >
                                  <FileText className="w-3.5 h-3.5" /> Resume
                                </a>
                              )}
                              {app.portfolio && (
                                <a
                                  href={app.portfolio}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1 hover:bg-slate-200"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" /> Portfolio
                                </a>
                              )}
                            </div>

                            {/* Stage Action Buttons */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <button
                                onClick={() => handleStatusChange(app._id, 'Under Review')}
                                className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-500/20"
                              >
                                Under Review
                              </button>
                              <button
                                onClick={() => handleStatusChange(app._id, 'Shortlisted')}
                                className="px-2.5 py-1.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold hover:bg-brand-500/20"
                              >
                                Shortlist
                              </button>
                              <button
                                onClick={() => handleStatusChange(app._id, 'Interview Scheduled')}
                                className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold hover:bg-amber-500/20"
                              >
                                Schedule Interview
                              </button>
                              <button
                                onClick={() => handleStatusChange(app._id, 'Selected')}
                                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black hover:brightness-110 shadow-sm"
                              >
                                🎉 Select Candidate
                              </button>
                              <button
                                onClick={() => handleStatusChange(app._id, 'Rejected')}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-500/20"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Recruiting Funnel Analytics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-md">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base mb-4">
                      Candidate Breakdown
                    </h4>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* COMPANY PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    Company Profile Details
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Manage public company info, recruiter contacts, and organization branding.
                  </p>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.companyName}
                        onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Company Logo Link / Image URL
                      </label>
                      <input
                        type="url"
                        value={profileForm.logo}
                        onChange={(e) => setProfileForm({ ...profileForm, logo: e.target.value })}
                        placeholder="https://example.com/logo.png"
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Industry / Sector
                      </label>
                      <input
                        type="text"
                        value={profileForm.industry}
                        onChange={(e) => setProfileForm({ ...profileForm, industry: e.target.value })}
                        placeholder="Software / Fintech / HealthTech"
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Company Size
                      </label>
                      <input
                        type="text"
                        value={profileForm.companySize}
                        onChange={(e) => setProfileForm({ ...profileForm, companySize: e.target.value })}
                        placeholder="10-50 Employees"
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Founded Year
                      </label>
                      <input
                        type="text"
                        value={profileForm.foundedYear}
                        onChange={(e) => setProfileForm({ ...profileForm, foundedYear: e.target.value })}
                        placeholder="2021"
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        HR Contact Email
                      </label>
                      <input
                        type="email"
                        value={profileForm.hrEmail}
                        onChange={(e) => setProfileForm({ ...profileForm, hrEmail: e.target.value })}
                        placeholder="hr@company.com"
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="+1 (555) 019-2831"
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Headquarters Location
                      </label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        placeholder="San Francisco, CA / Remote"
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Company Description & Culture
                    </label>
                    <textarea
                      rows={4}
                      value={profileForm.about}
                      onChange={(e) => setProfileForm({ ...profileForm, about: e.target.value })}
                      placeholder="Brief summary of company mission, tech stack, and workplace culture..."
                      className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Official Website URL
                      </label>
                      <input
                        type="url"
                        value={profileForm.website}
                        onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                        placeholder="https://company.io"
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        LinkedIn Page URL
                      </label>
                      <input
                        type="url"
                        value={profileForm.linkedin}
                        onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/company/name"
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        GitHub / Org URL
                      </label>
                      <input
                        type="url"
                        value={profileForm.github}
                        onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                        placeholder="https://github.com/company-org"
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl btn-gradient font-bold text-sm shadow-lg"
                  >
                    Save Company Profile
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
                        Update your company recruiter login credentials.
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

                {/* Notifications & Recruiter Settings */}
                <div className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Recruiter Notification Settings
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Manage applicant alerts and email digest settings.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSavePreferences} className="space-y-4 max-w-md">
                    <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 cursor-pointer">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm block">New Application Email Alerts</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block">Instant notification when a student submits an application</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settingsForm.candidateAlerts}
                        onChange={(e) => setSettingsForm({ ...settingsForm, candidateAlerts: e.target.checked })}
                        className="w-5 h-5 accent-brand-600 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 cursor-pointer">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm block">Weekly Recruiting Digest</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block">Summary report of posting views and candidate conversion</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settingsForm.emailAlerts}
                        onChange={(e) => setSettingsForm({ ...settingsForm, emailAlerts: e.target.checked })}
                        className="w-5 h-5 accent-brand-600 rounded"
                      />
                    </label>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 text-white font-bold text-xs shadow-md"
                    >
                      Save Recruiter Settings
                    </button>
                  </form>
                </div>

                {/* Danger Zone */}
                <div className="glass-card rounded-3xl p-8 border border-rose-500/20 bg-rose-500/5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                        <Trash2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-rose-600 dark:text-rose-400">
                          Danger Zone
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Permanently delete your company account and listed opportunities.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleDeleteAccount}
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    Delete Company Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Candidate Profile Modal */}
      {viewCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="glass-card rounded-3xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {viewCandidate.studentName ? viewCandidate.studentName.slice(0, 2).toUpperCase() : 'ST'}
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">{viewCandidate.studentName}</h4>
                  <p className="text-xs text-slate-500">{viewCandidate.studentEmail}</p>
                </div>
              </div>
              <button
                onClick={() => setViewCandidate(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">University / College</span>
                  <span className="font-bold text-slate-900 dark:text-white">{viewCandidate.college || 'N/A'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Application Status</span>
                  <span className="font-bold text-brand-500">{viewCandidate.status}</span>
                </div>
              </div>

              {viewCandidate.skills && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1.5">Candidate Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(viewCandidate.skills) ? viewCandidate.skills : String(viewCandidate.skills).split(',')).map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold text-xs">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {viewCandidate.coverLetter && (
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 italic text-slate-700 dark:text-slate-300">
                  "{viewCandidate.coverLetter}"
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                {viewCandidate.resume && (
                  <a
                    href={viewCandidate.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-2.5 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" /> View Resume PDF
                  </a>
                )}
                {viewCandidate.portfolio && (
                  <a
                    href={viewCandidate.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-4 h-4" /> Portfolio
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <SelectionModal
        isOpen={Boolean(selectedApplicantForOffer)}
        onClose={() => setSelectedApplicantForOffer(null)}
        applicant={selectedApplicantForOffer}
        onConfirmSelect={handleConfirmSelect}
      />

      <Footer />
    </div>
  );
};

export default CompanyDashboard;
