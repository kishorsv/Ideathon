import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DEMO_USERS } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (role: UserRole) => void;
  register: (data: Partial<User> & { password?: string }) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'mysuru_em_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse stored auth user', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, _password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400)); // smooth simulated network latency
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check demo users
    const matchedUser = DEMO_USERS.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (matchedUser) {
      setUser(matchedUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matchedUser));
      setIsLoading(false);
      return { success: true };
    }

    // If new valid email, generate custom user
    if (normalizedEmail.includes('@')) {
      const customUser: User = {
        id: `usr-${Date.now()}`,
        email: normalizedEmail,
        name: normalizedEmail.split('@')[0].toUpperCase(),
        role: 'DISPATCHER',
        department: 'Mysuru Emergency Operations Center',
        phone: '+91 821 242 0112',
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${normalizedEmail}`,
      };
      setUser(customUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(customUser));
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: 'Please enter a valid email address.' };
  };

  const loginAsDemo = (role: UserRole) => {
    const matched = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    setUser(matched);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matched));
  };

  const register = async (data: Partial<User> & { password?: string }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    if (!data.email || !data.email.includes('@')) {
      setIsLoading(false);
      return { success: false, error: 'Please provide a valid email.' };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: data.email,
      name: data.name || data.email.split('@')[0],
      role: data.role || 'CITIZEN',
      department: data.department || (data.role === 'DOCTOR' ? 'KR Hospital Trauma Center' : 'Mysuru Emergency Center'),
      phone: data.phone || '+91 98450 00000',
      badgeNumber: data.badgeNumber,
      avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${data.email}`,
    };

    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsDemo,
        register,
        updateProfile,
        logout,
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
