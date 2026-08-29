import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle, loginWithEmail, signupWithEmail } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) throw new Error('Please enter your full name');
        if (!email.trim() || !email.includes('@')) throw new Error('Please enter a valid email address');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');
        await signupWithEmail(name, email, password);
      } else {
        if (!email.trim()) throw new Error('Please enter your email');
        if (!password) throw new Error('Please enter your password');
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google sign in failed. Please try again or sign in with email.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdminDemo = async () => {
    await loginWithEmail('admin@theaestheticpalette.com', 'admin123');
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuthModal}
            className="fixed inset-0 bg-ink-sepia/50 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-linen-light rounded-organic-2xl p-6 sm:p-8 border border-linen-deep shadow-drawer z-10 space-y-6"
          >
            {/* Close Button */}
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 p-1.5 text-ink-muted hover:text-ink hover:bg-linen rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta bg-terracotta/10 px-2.5 py-0.5 rounded-full inline-block">
                Artisan Member Access
              </span>
              <h3 className="font-serif text-2xl text-ink font-semibold">
                {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
              </h3>
              <p className="text-xs text-ink-muted">
                {mode === 'login'
                  ? 'Sign in to track orders, save shipping info, and confirm Cash on Delivery.'
                  : 'Join our studio circle for slow-crafted updates and rapid 1-click checkout.'}
              </p>
            </div>

            {/* Google OAuth Button */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white border border-linen-dark hover:border-ink/40 rounded-organic text-xs font-semibold text-ink flex items-center justify-center gap-2.5 shadow-2xs hover:bg-linen-surface transition-all active:scale-98"
              >
                {/* SVG Google "G" Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-linen-deep w-full" />
                <span className="bg-linen-light px-3 text-[10px] uppercase font-bold text-ink-faint tracking-wider">
                  or with email
                </span>
                <div className="border-t border-linen-deep w-full" />
              </div>
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              {error && (
                <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-600 text-xs">
                  {error}
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="block font-medium text-ink mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full pl-9 pr-3 py-2 rounded-organic-sm border border-linen-dark bg-linen text-ink focus:outline-none focus:border-terracotta"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-medium text-ink mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full pl-9 pr-3 py-2 rounded-organic-sm border border-linen-dark bg-linen text-ink focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-ink mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-organic-sm border border-linen-dark bg-linen text-ink focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm mt-2"
              >
                <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Sign In & Continue' : 'Create Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Toggle Login / Signup Mode */}
            <div className="text-center text-xs text-ink-muted pt-1 space-y-2">
              {mode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setError('');
                    }}
                    className="font-semibold text-terracotta hover:underline"
                  >
                    Sign up now
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError('');
                    }}
                    className="font-semibold text-terracotta hover:underline"
                  >
                    Log in
                  </button>
                </p>
              )}

              {/* Quick Demo Switch */}
              <div className="pt-2 border-t border-linen-deep text-[11px] flex items-center justify-between text-ink-faint">
                <span>Testing Demo:</span>
                <button
                  type="button"
                  onClick={handleQuickAdminDemo}
                  className="text-terracotta font-semibold hover:underline"
                >
                  Quick Sign-in as Admin
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
