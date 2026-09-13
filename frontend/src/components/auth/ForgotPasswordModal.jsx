import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, KeyRound, Lock, X, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

const ForgotPasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const { addToast } = useToast();

  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [devOtpHint, setDevOtpHint] = useState('');

  if (!isOpen) return null;

  const handleResetState = () => {
    setStep(1);
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMessage('');
    setDevOtpHint('');
    onClose();
  };

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setDevOtpHint('');
    setLoading(true);

    try {
      const { data } = await API.post('/auth/forgot-password', { email });
      if (data.success) {
        addToast('6-digit OTP code sent to your email!', 'success');
        if (data.devOtp) {
          setDevOtpHint(data.devOtp);
        }
        setStep(2);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send OTP code.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const { data } = await API.post('/auth/verify-otp', { email, otp });
      if (data.success) {
        addToast('OTP verified successfully!', 'success');
        setStep(3);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired OTP.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const { data } = await API.post('/auth/reset-password', {
        email,
        otp,
        newPassword,
        confirmPassword,
      });

      if (data.success) {
        addToast('Password updated successfully. Please log in.', 'success');
        if (onSuccess) onSuccess(email);
        handleResetState();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="glass-card rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl space-y-6 relative overflow-hidden"
        >
          {/* Top header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                  Reset Password
                </h3>
                <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  Step {step} of 3
                </span>
              </div>
            </div>
            <button
              onClick={handleResetState}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-brand-600 dark:bg-brand-500' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Dev OTP Hint */}
          {devOtpHint && step === 2 && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold space-y-1">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
                <KeyRound className="w-3.5 h-3.5" /> Dev Mode OTP Code:
              </div>
              <div className="text-base font-black text-amber-500 tracking-widest">{devOtpHint}</div>
            </div>
          )}

          {/* STEP 1: ENTER EMAIL */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Registered Email Address *
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

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                We will check MongoDB for your email and dispatch a secure 6-digit OTP code valid for 10 minutes.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl btn-gradient font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <span>Checking Email...</span>
                ) : (
                  <>
                    <span>Send 6-Digit OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: ENTER OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Enter 6-Digit OTP Code *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-base font-bold tracking-widest text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Sent to: <span className="font-semibold text-brand-500">{email}</span></span>
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Resend OTP
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full py-3 rounded-xl btn-gradient font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <span>Verifying OTP...</span>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 3: NEW PASSWORD */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  New Password (Min 8 Characters) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl btn-gradient font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <span>Updating Password...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Password Reset</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ForgotPasswordModal;
