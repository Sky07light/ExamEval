import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (email, password, role) => {
    const newUser = {
      id: '1',
      name: role === 'teacher' ? 'Dr. Sarah Johnson' : 'Alex Thompson',
      email,
      role,
      avatar: `https://images.pexels.com/photos/${role === 'teacher' ? '3184460' : '1239291'}/pexels-photo-${role === 'teacher' ? '3184460' : '1239291'}.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`
    };
    setUser(newUser);
  };

  const register = (name, email, password, role) => {
    const newUser = {
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
