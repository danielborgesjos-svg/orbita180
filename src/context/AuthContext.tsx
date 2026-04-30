'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'startup_founder' | 'startup_member' | 'mentor' | 'institution';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  startupName?: string;
  institutionName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isLoading: true,
});

// Mock users database
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Daniel Borges',
    email: 'daniel@techinova.com',
    password: '123456',
    role: 'startup_founder',
    startupName: 'TechInova',
  },
  {
    id: '2',
    name: 'Administrador Órbita',
    email: 'admin@orbita180.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: '3',
    name: 'Prof. Carlos Mendes',
    email: 'carlos@ufpr.edu.br',
    password: '123456',
    role: 'mentor',
    institutionName: 'UFPR',
  },
  {
    id: '4',
    name: 'Aline Souza',
    email: 'aline@techinova.com',
    password: '123456',
    role: 'startup_member',
    startupName: 'TechInova',
  },
];

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

  const login = async (email: string, password: string): Promise<boolean> => {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userWithoutPassword } = found;
      setUser(userWithoutPassword);
      localStorage.setItem('orbita_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
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
