// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on refresh
  useEffect(() => {
    const user = localStorage.getItem('examEvalUser');
    if (user) setCurrentUser(JSON.parse(user));
    setLoading(false);
  }, []);

  const register = async (name, email, password, role) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        name,
        email,
        password,
        role,
      });
      const { data, token } = response.data;
      setCurrentUser(data);
      localStorage.setItem('examEvalUser', JSON.stringify(data));
      localStorage.setItem('examEvalToken', token);
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Registration failed');
    }
  };

  const login = async (email, password, role) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password,
        role,
      });
      const { data, token } = response.data;
      setCurrentUser(data);
      localStorage.setItem('examEvalUser', JSON.stringify(data));
      localStorage.setItem('examEvalToken', token);
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Login failed');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('examEvalUser');
    localStorage.removeItem('examEvalToken');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
