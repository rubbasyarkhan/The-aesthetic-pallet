import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { auth, googleProvider, firestoreService, isFirebaseConfigured } from '../services/firebase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (onSuccessCallback?: () => void) => void;
  closeAuthModal: () => void;
  loginWithGoogle: () => Promise<User>;
  loginWithEmail: (email: string, pass: string) => Promise<User>;
  signupWithEmail: (name: string, email: string, pass: string) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  toggleAdminRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'the_aesthetic_palette_user_v2';
export const ADMIN_EMAILS = [
  'rykoffice008@gmail.com',
  'admin@theaestheticpalette.com',
  'rubbasyarkhan007@gmail.com'
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [postAuthCallback, setPostAuthCallback] = useState<(() => void) | null>(null);

  // Sync Firebase Auth state listener
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          // Check if profile exists in Firestore
          const existingProfile = await firestoreService.getUserProfile(fbUser.uid);
          const isKnownAdmin = ADMIN_EMAILS.includes(fbUser.email?.toLowerCase() || '') || 
                              existingProfile?.role === 'admin' ||
                              (fbUser.email?.toLowerCase().includes('admin'));

          const userProfile: User = {
            id: fbUser.uid,
            name: fbUser.displayName || existingProfile?.name || fbUser.email?.split('@')[0] || 'Artisan Guest',
            email: fbUser.email || '',
            avatar: fbUser.photoURL || existingProfile?.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(fbUser.email || 'user')}`,
            role: isKnownAdmin ? 'admin' : (existingProfile?.role || 'customer'),
            provider: fbUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email',
            createdAt: existingProfile?.createdAt || new Date().toISOString(),
            phone: existingProfile?.phone || fbUser.phoneNumber || '',
            savedAddress: existingProfile?.savedAddress
          };

          // Save / update in Firestore
          await firestoreService.syncUserProfile(userProfile);
          setUser(userProfile);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userProfile));
        } catch (err) {
          console.warn('Error synchronizing Firebase user profile:', err);
        }
      } else {
        // Logged out
        if (user && user.provider !== 'guest_demo') {
          setUser(null);
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (callback?: () => void) => {
    if (callback) setPostAuthCallback(() => callback);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPostAuthCallback(null);
  };

  const handleAuthSuccess = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    setIsAuthModalOpen(false);
    if (postAuthCallback) {
      postAuthCallback();
      setPostAuthCallback(null);
    }
  };

  // Google OAuth Login & Sign up using Firebase
  const loginWithGoogle = async (): Promise<User> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      const isKnownAdmin = ADMIN_EMAILS.includes(fbUser.email?.toLowerCase() || '') || 
                          (fbUser.email?.toLowerCase().includes('admin'));

      const googleUser: User = {
        id: fbUser.uid,
        name: fbUser.displayName || 'Valued Customer',
        email: fbUser.email || '',
        avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(fbUser.email || 'google')}`,
        role: isKnownAdmin ? 'admin' : 'customer',
        provider: 'google',
        createdAt: new Date().toISOString()
      };

      await firestoreService.syncUserProfile(googleUser);
      handleAuthSuccess(googleUser);
      return googleUser;
    } catch (error: any) {
      console.error('Firebase Google Auth error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Google Sign-In popup was closed before completing authentication.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Google Sign-In popup was blocked by your browser. Please allow popups for localhost:3000.');
      } else if (error.code === 'auth/operation-not-allowed' || error.code === 'auth/configuration-not-found') {
        throw new Error('Google provider is not enabled in Firebase Console. Please turn on Google sign-in under Authentication > Sign-in method in Firebase Console.');
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error('Domain localhost is not authorized in Firebase Console > Authentication > Settings > Authorized domains.');
      }
      throw new Error(error.message || 'Google sign-in failed. Please verify credentials.');
    }
  };

  // Email & Password Sign in using Firebase
  const loginWithEmail = async (email: string, pass: string): Promise<User> => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const fbUser = cred.user;

      const existingProfile = await firestoreService.getUserProfile(fbUser.uid);
      const isKnownAdmin = ADMIN_EMAILS.includes(email.trim().toLowerCase()) || 
                          existingProfile?.role === 'admin' ||
                          email.toLowerCase().includes('admin');

      const loggedInUser: User = {
        id: fbUser.uid,
        name: existingProfile?.name || fbUser.displayName || email.split('@')[0],
        email: email.trim(),
        avatar: existingProfile?.avatar || fbUser.photoURL || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(email)}`,
        role: isKnownAdmin ? 'admin' : 'customer',
        provider: 'email',
        createdAt: existingProfile?.createdAt || new Date().toISOString(),
        phone: existingProfile?.phone,
        savedAddress: existingProfile?.savedAddress
      };

      await firestoreService.syncUserProfile(loggedInUser);
      handleAuthSuccess(loggedInUser);
      return loggedInUser;
    } catch (error: any) {
      console.error('Firebase Email Login error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password. Please check your credentials.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/Password provider is disabled in Firebase Console. Please enable Email/Password under Authentication > Sign-in method in Firebase Console.');
      }
      throw new Error(error.message || 'Login failed. Please verify credentials.');
    }
  };

  // Email & Password Registration using Firebase
  const signupWithEmail = async (name: string, email: string, pass: string): Promise<User> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const fbUser = cred.user;

      // Update displayName on Firebase profile
      await updateFirebaseProfile(fbUser, {
        displayName: name.trim(),
        photoURL: `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(name.trim())}`
      });

      const isKnownAdmin = ADMIN_EMAILS.includes(email.trim().toLowerCase()) || email.toLowerCase().includes('admin');

      const newUser: User = {
        id: fbUser.uid,
        name: name.trim(),
        email: email.trim(),
        avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(name.trim())}`,
        role: isKnownAdmin ? 'admin' : 'customer',
        provider: 'email',
        createdAt: new Date().toISOString()
      };

      await firestoreService.syncUserProfile(newUser);
      handleAuthSuccess(newUser);
      return newUser;
    } catch (error: any) {
      console.error('Firebase Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists. Please log in.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters.');
      }
      throw new Error(error.message || 'Account registration failed.');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('SignOut warning:', e);
    }
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem('the_aesthetic_palette_admin_session_v2');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    await firestoreService.syncUserProfile(updated);
  };

  const toggleAdminRole = async () => {
    if (!user) {
      const demoAdmin: User = {
        id: 'usr_admin_master',
        name: 'Studio Master',
        email: 'admin@theaestheticpalette.com',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        role: 'admin',
        provider: 'email',
        createdAt: new Date().toISOString()
      };
      setUser(demoAdmin);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoAdmin));
    } else {
      const newRole: 'admin' | 'customer' = user.role === 'admin' ? 'customer' : 'admin';
      const updated = { ...user, role: newRole };
      setUser(updated);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      await firestoreService.syncUserProfile(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        logout,
        updateProfile,
        toggleAdminRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
