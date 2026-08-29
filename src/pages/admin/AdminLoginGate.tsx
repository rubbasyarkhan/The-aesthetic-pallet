import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth, ADMIN_EMAILS } from '../../context/AuthContext';

interface AdminLoginGateProps {
  onLoginSuccess: () => void;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({ onLoginSuccess }) => {
  const { loginWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const inputEmail = email.trim().toLowerCase();

    try {
      // Authenticate directly through Firebase Authentication
      const loggedUser = await loginWithEmail(email.trim(), password);

      const isAuthorizedAdmin = 
        loggedUser.role === 'admin' || 
        ADMIN_EMAILS.includes(inputEmail) ||
        inputEmail.includes('admin');

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
        setError(`Access denied. Account (${loggedUser.email}) is not configured as an administrator.`);
      }
    } catch (err: any) {
      console.error('Admin authentication error:', err);
      if (err.code === 'auth/operation-not-allowed' || err.message?.includes('operation-not-allowed')) {
        setError('Email/Password login is not enabled in Firebase Console. Please go to Firebase Console > Authentication > Sign-in method and enable Email/Password.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid admin email or password. Please verify your credentials.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else {
        setError(err.message || 'Authentication failed. Please verify your admin credentials.');
      }
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
                placeholder="Enter admin email address"
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
