import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginGateProps {
  onLoginSuccess: () => void;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({ onLoginSuccess }) => {
  const { loginWithEmail, loginWithGoogle, user, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await loginWithEmail(email.trim(), password);
      const isAuthorizedAdmin = loggedUser.role === 'admin' || 
                               email.toLowerCase() === 'rykoffice008@gmail.com' ||
                               email.toLowerCase() === 'rubbasyarkhan007@gmail.com' ||
                               email.toLowerCase().includes('admin');

      if (isAuthorizedAdmin) {
        localStorage.setItem(
          'the_aesthetic_palette_admin_session_v2',
          JSON.stringify({
            authenticated: true,
            email: loggedUser.email,
            id: loggedUser.id,
            loginTime: new Date().toISOString()
          })
        );
        onLoginSuccess();
      } else {
        setError('Your account does not have administrative privileges.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const loggedUser = await loginWithGoogle();
      const isAllowedAdmin = loggedUser.role === 'admin' ||
                             loggedUser.email.toLowerCase() === 'rykoffice008@gmail.com' ||
                             loggedUser.email.toLowerCase() === 'rubbasyarkhan007@gmail.com' ||
                             loggedUser.email.toLowerCase().includes('admin');

      if (isAllowedAdmin) {
        localStorage.setItem(
          'the_aesthetic_palette_admin_session_v2',
          JSON.stringify({
            authenticated: true,
            email: loggedUser.email,
            id: loggedUser.id,
            loginTime: new Date().toISOString()
          })
        );
        onLoginSuccess();
      } else {
        setError(`Account ${loggedUser.email} is not designated as an admin.`);
      }
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] text-[#1F2421] flex items-center justify-center p-4 antialiased">
      {/* Background Floral/Aesthetic Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#C06C4D_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E0D8] p-8 shadow-xl relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#F7F3EE] border border-[#E5E0D8] mx-auto flex items-center justify-center text-[#C06C4D] shadow-xs">
            <Lock className="w-7 h-7 text-[#C06C4D]" />
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#C06C4D]/10 border border-[#C06C4D]/25 text-[#C06C4D] text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>Firebase Security Protected</span>
          </div>

          <h1 className="font-serif text-2xl font-bold text-[#1F2421]">
            Studio Admin Portal
          </h1>
          <p className="text-xs text-[#6B7280]">
            Path: <code className="text-[#C06C4D] font-mono font-semibold">/peleteadmin10908</code> · Secure Gateway
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Admin Login */}
        <button
          type="button"
          onClick={handleAdminGoogleLogin}
          disabled={loading}
          className="w-full py-2.5 px-4 bg-white border border-[#D1D5DB] hover:border-[#1F2421] rounded-xl text-xs font-semibold text-[#1F2421] flex items-center justify-center gap-2.5 shadow-2xs hover:bg-[#FAF7F2] transition-all"
        >
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
          <span>Sign In as Admin with Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#E5E0D8] w-full" />
          <span className="bg-white px-3 text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider">
            or with credentials
          </span>
          <div className="border-t border-[#E5E0D8] w-full" />
        </div>

        <form onSubmit={handleAdminEmailLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#374151] mb-1.5">Admin Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter authorized admin email"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#D1D5DB] bg-[#FAFAFA] text-[#1F2421] focus:bg-white focus:outline-none focus:border-[#C06C4D] focus:ring-1 focus:ring-[#C06C4D]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#374151] mb-1.5">Admin Security Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#D1D5DB] bg-[#FAFAFA] text-[#1F2421] focus:bg-white focus:outline-none focus:border-[#C06C4D] focus:ring-1 focus:ring-[#C06C4D]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#C06C4D] hover:bg-[#A95A3E] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 disabled:opacity-75"
          >
            <span>{loading ? 'Authenticating with Firebase...' : 'Sign In to Studio Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 bg-[#F9F6F0] border border-[#E5E0D8] rounded-xl text-[11px] text-[#6B7280] text-center flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secured via Firebase Cloud Firestore & Auth.</span>
        </div>
      </div>
    </div>
  );
};
