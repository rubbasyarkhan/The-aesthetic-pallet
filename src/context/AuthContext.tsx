import React, { createContext, useContext, useState, useEffect } from 'react';
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
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  toggleAdminRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'the_aesthetic_palette_user_v1';

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

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save user session', e);
    }
  }, [user]);

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
    setIsAuthModalOpen(false);
    if (postAuthCallback) {
      postAuthCallback();
      setPostAuthCallback(null);
    }
  };

  const loginWithGoogle = async (): Promise<User> => {
    // Simulate real Google OAuth login with high-fidelity profile
    const googleUser: User = {
      id: 'usr_g_' + Math.random().toString(36).substring(2, 9),
      name: 'Emma Sterling',
      email: 'emma.sterling@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role: 'customer',
      provider: 'google',
      createdAt: new Date().toISOString(),
      phone: '+1 (555) 342-9988',
      savedAddress: {
        streetAddress: '742 Evergreen Terrace',
        apartmentSuite: 'Apt 4B',
        city: 'Portland',
        postalCode: '97201'
      }
    };
    handleAuthSuccess(googleUser);
    return googleUser;
  };

  const loginWithEmail = async (email: string): Promise<User> => {
    const existingName = email.split('@')[0];
    const capitalizedName = existingName.charAt(0).toUpperCase() + existingName.slice(1);
    
    // If logging in as admin email
    const isAdminUser = email.toLowerCase().includes('admin');

    const emailUser: User = {
      id: 'usr_e_' + Math.random().toString(36).substring(2, 9),
      name: capitalizedName,
      email: email,
      avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(email)}`,
      role: isAdminUser ? 'admin' : 'customer',
      provider: 'email',
      createdAt: new Date().toISOString()
    };

    handleAuthSuccess(emailUser);
    return emailUser;
  };

  const signupWithEmail = async (name: string, email: string): Promise<User> => {
    const newUser: User = {
      id: 'usr_e_' + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      email: email.trim(),
      avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(name)}`,
      role: 'customer',
      provider: 'email',
      createdAt: new Date().toISOString()
    };

    handleAuthSuccess(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  const toggleAdminRole = () => {
    if (!user) {
      // Create admin user
      const adminUser: User = {
        id: 'usr_admin_master',
        name: 'Studio Master',
        email: 'admin@theaestheticpalette.com',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        role: 'admin',
        provider: 'email',
        createdAt: new Date().toISOString()
      };
      setUser(adminUser);
    } else {
      setUser({
        ...user,
        role: user.role === 'admin' ? 'customer' : 'admin'
      });
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
