import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { User, Building2, Mail, Lock, GraduationCap, Globe, UserCheck, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const [role, setRole] = useState('student');
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('');
  const [gradYear, setGradYear] = useState('2026');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');

  const { registerStudent, registerCompany } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (role === 'student') {
      const res = await registerStudent({
        name,
        email,
        password,
        college,
        degree,
        gradYear,
      });
      setSubmitting(false);
      if (res?.success) navigate('/student/dashboard');
    } else {
      const res = await registerCompany({
        companyName: name,
        email,
        password,
        industry,
        website,
      });
      setSubmitting(false);
      if (res?.success) navigate('/company/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19]">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl glass-card rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Create Your Account
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select your role and start connecting on SkillBridge.
            </p>

            {/* Role Switcher */}
            <div className="mt-6 inline-flex p-1.5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 w-full max-w-sm">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'student'
                    ? 'btn-gradient text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>I'm a Student</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('company')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'company'
                    ? 'btn-gradient text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>I'm a Company</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name / Company Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                {role === 'student' ? 'Full Name *' : 'Company Name *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'student' ? 'Alex Rivera' : 'TechPulse Innovations'}
                className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Role specific fields */}
            {role === 'student' ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      College / University
                    </label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="Stanford University"
                      className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Degree Program
                    </label>
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="B.S. Computer Science"
                      className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Graduation Year
                  </label>
                  <select
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="2025" className="dark:bg-slate-900">2025</option>
                    <option value="2026" className="dark:bg-slate-900">2026</option>
                    <option value="2027" className="dark:bg-slate-900">2027</option>
                    <option value="2028" className="dark:bg-slate-900">2028</option>
                  </select>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Industry / Sector
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Software & Cloud"
                    className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://company.io"
                    className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl btn-gradient font-bold text-sm flex items-center justify-center gap-2 shadow-lg mt-6"
            >
              {submitting ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Complete Registration</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;
