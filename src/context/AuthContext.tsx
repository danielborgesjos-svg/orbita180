'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

import { loginUser } from '@/lib/actions/auth';

export type UserRole = 'admin' | 'startup_founder' | 'startup_member' | 'mentor' | 'institution' | 'diretor_ies';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  startupId?: string;
  startupName?: string;
  institutionName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => ({ success: false, error: 'Not initialized' }),
  logout: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('orbita_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const res = await loginUser(email, password);
    if (res.success && res.user) {
      const userData = res.user as User;
      setUser(userData);
      localStorage.setItem('orbita_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: res.error || 'Falha no login.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('orbita_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
