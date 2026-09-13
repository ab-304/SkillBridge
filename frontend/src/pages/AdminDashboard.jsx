import React, { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import StatsCard from '../components/dashboard/StatsCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import projectApi from '../services/projectApi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  ShieldAlert,
  Users,
  Building2,
  FolderKanban,
  Send,
  Trash2,
  Search,
  BarChart3,
  Settings,
  AlertTriangle,
} from 'lucide-react';

const SIDEBAR_ITEMS = [
  { id: 'overview', label: 'Platform Metrics', icon: ShieldAlert },
  { id: 'users', label: 'Manage Users', icon: Users },
  { id: 'projects', label: 'Manage Opportunities', icon: FolderKanban },
  { id: 'analytics', label: 'Platform Analytics', icon: BarChart3 },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');

  const [metrics, setMetrics] = useState({ students: 0, companies: 0, projects: 0, applications: 0 });
  const [usersList, setUsersList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [userSearch, setUserSearch] = useState('');

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, projData, analyticsRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users'),
        projectApi.getAllProjects(),
        API.get('/admin/analytics'),
      ]);

      if (statsRes.data.success) setMetrics(statsRes.data.metrics);
      if (usersRes.data.success) setUsersList(usersRes.data.users);
      if (projData.success) setProjectsList(projData.projects || []);
      if (analyticsRes.data.success) setAnalytics(analyticsRes.data.analytics);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user account?')) return;
    try {
      const { data } = await API.delete(`/admin/users/${id}`);
      if (data.success) {
        addToast('User deleted successfully.', 'info');
        setUsersList((prev) => prev.filter((u) => u._id !== id));
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete user.', 'error');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this opportunity?')) return;
    try {
      const data = await projectApi.deleteProject(id);
      if (data.success) {
        addToast('Opportunity removed.', 'info');
        setProjectsList((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      addToast('Failed to delete opportunity.', 'error');
    }
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19]">
      <Navbar />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <DashboardSidebar items={SIDEBAR_ITEMS} activeTab={activeTab} onSelectTab={setActiveTab} />

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-950 text-white shadow-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-widest text-rose-400">
                      System Administration
                    </span>
                    <h2 className="text-3xl font-extrabold tracking-tight mt-1">
                      SkillBridge Admin Command Center
                    </h2>
                    <p className="text-sm text-slate-300 mt-2">
                      Monitor total platform users, opportunity compliance, and systemic growth analytics.
                    </p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard title="Total Students" value={metrics.students} icon={Users} color="from-brand-600 to-indigo-600" />
                  <StatsCard title="Companies Registered" value={metrics.companies} icon={Building2} color="from-indigo-600 to-purple-600" />
                  <StatsCard title="Live Opportunities" value={metrics.projects} icon={FolderKanban} color="from-emerald-600 to-teal-600" />
                  <StatsCard title="Applications Processed" value={metrics.applications} icon={Send} color="from-amber-600 to-orange-600" />
                </div>

                {/* Growth Chart */}
                {analytics?.registrations && (
                  <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-md">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-4">
                      Platform User Growth Trajectory
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.registrations}>
                          <XAxis dataKey="month" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }} />
                          <Line type="monotone" dataKey="students" stroke="#2563EB" strokeWidth={3} />
                          <Line type="monotone" dataKey="companies" stroke="#10B981" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    Manage Platform Accounts ({usersList.length})
                  </h3>
                  <div className="relative w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search users..."
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold">
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {filteredUsers.map((u) => (
                        <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-extrabold uppercase text-[10px] ${
                                u.role === 'admin'
                                  ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                  : u.role === 'company'
                                  ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                                  : 'bg-brand-500/10 text-brand-500 border border-brand-500/20'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4">
                            {u.role !== 'admin' && (
                              <button
                                onClick={() => handleDeleteUser(u._id)}
                                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Moderate Opportunities ({projectsList.length})
                </h3>

                <div className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold">
                        <th className="p-4">Title</th>
                        <th className="p-4">Company</th>
                        <th className="p-4">Stipend</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {projectsList.map((pr) => (
                        <tr key={pr._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-4 font-bold text-slate-900 dark:text-white">{pr.title}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-300">{pr.companyName}</td>
                          <td className="p-4 font-semibold text-emerald-500">{pr.stipend}</td>
                          <td className="p-4 font-semibold text-brand-500">{pr.category}</td>
                          <td className="p-4">
                            <button
                              onClick={() => handleDeleteProject(pr._id)}
                              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Skill Demand & Placement Analytics
                </h3>
                {analytics?.topSkills && (
                  <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-md">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base mb-4">
                      Most Demanded Skills on SkillBridge
                    </h4>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.topSkills}>
                          <XAxis dataKey="skill" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }} />
                          <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
