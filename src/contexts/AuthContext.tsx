import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'student' | 'teacher') => void;
  logout: () => void;
  register: (name: string, email: string, password: string, role: 'student' | 'teacher') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, role: 'student' | 'teacher') => {
    // Simulate login
    const newUser: User = {
      id: '1',
      name: role === 'teacher' ? 'Dr. Sarah Johnson' : 'Alex Thompson',
      email,
      role,
      avatar: `https://images.pexels.com/photos/${role === 'teacher' ? '3184460' : '1239291'}/pexels-photo-${role === 'teacher' ? '3184460' : '1239291'}.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`
    };
    setUser(newUser);
  };

  const register = (name: string, email: string, password: string, role: 'student' | 'teacher') => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      avatar: `https://images.pexels.com/photos/${role === 'teacher' ? '3184460' : '1239291'}/pexels-photo-${role === 'teacher' ? '3184460' : '1239291'}.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};