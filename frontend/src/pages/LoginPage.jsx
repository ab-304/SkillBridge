import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';
import { Sparkles, Mail, Lock, LogIn, ArrowRight, UserCheck, Shield, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await loginUser(email, password);
    setSubmitting(false);

    if (res?.success) {
      const role = res.user.role;
      if (role === 'student') navigate('/student/dashboard');
      else if (role === 'company') navigate('/company/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    }
  };

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19]">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 shadow-2xl bg-white dark:bg-slate-900">
          {/* Left Hero Artwork */}
          <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-brand-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/20 blur-3xl rounded-full pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Connect. Excel. <br /> Launch Your Tech Career.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Join 12,000+ university developers accessing exclusive paid internships, freelance contracts, and hackathon awards.
              </p>
            </div>

            {/* Quick Demo Credentials */}
            <div className="relative z-10 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4" /> Quick Demo Auto-Fill:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo('student@skillbridge.com', 'password123')}
                  className="px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-[11px] font-bold text-white transition-colors"
                >
                  Student Demo
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('recruiter@techpulse.io', 'password123')}
                  className="px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-[11px] font-bold text-white transition-colors"
                >
                  Company Demo
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('admin@skillbridge.com', 'password123')}
                  className="px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-[11px] font-bold text-white transition-colors"
                >
                  Admin Demo
                </button>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="p-8 sm:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Welcome Back
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Enter your credentials to access your SkillBridge dashboard.
              </p>
            </div>

            {/* Mobile quick demo buttons */}
            <div className="md:hidden mb-6 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs space-y-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">Quick Demo Auto-Fill:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo('student@skillbridge.com', 'password123')}
                  className="px-2 py-1 rounded bg-brand-500 text-white font-semibold text-[10px]"
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('recruiter@techpulse.io', 'password123')}
                  className="px-2 py-1 rounded bg-indigo-600 text-white font-semibold text-[10px]"
                >
                  Company
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('admin@skillbridge.com', 'password123')}
                  className="px-2 py-1 rounded bg-slate-700 text-white font-semibold text-[10px]"
                >
                  Admin
                </button>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu"
                    className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl btn-gradient font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                {submitting ? (
                  <span>Logging in...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Log In</span>
                  </>
                )}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase">Or</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              {/* Google UI Button */}
              <button
                type="button"
                onClick={() => fillDemo('student@skillbridge.com', 'password123')}
                className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 font-semibold text-sm text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>

            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-8">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Forgot Password OTP Modal */}
      <ForgotPasswordModal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        onSuccess={(resetEmail) => {
          setEmail(resetEmail);
          setPassword('');
        }}
      />

      <Footer />
    </div>
  );
};

export default LoginPage;
