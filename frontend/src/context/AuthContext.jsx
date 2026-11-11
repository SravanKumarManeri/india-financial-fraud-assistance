import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fraudassist_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [tokens, setTokens] = useState(() => {
    const saved = localStorage.getItem('fraudassist_tokens');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (tokens?.access) {
        try {
          const res = await authAPI.me();
          setUser(res.data);
          localStorage.setItem('fraudassist_user', JSON.stringify(res.data));
        } catch (e) {
          console.error('Session expired or invalid', e);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { user: userData, tokens: tokenData } = res.data;
    setUser(userData);
    setTokens(tokenData);
    localStorage.setItem('fraudassist_user', JSON.stringify(userData));
    localStorage.setItem('fraudassist_tokens', JSON.stringify(tokenData));
    return userData;
  };

  const register = async (formData) => {
    const res = await authAPI.register(formData);
    const { user: userData, tokens: tokenData } = res.data;
    setUser(userData);
    setTokens(tokenData);
    localStorage.setItem('fraudassist_user', JSON.stringify(userData));
    localStorage.setItem('fraudassist_tokens', JSON.stringify(tokenData));
    return userData;
  };

  const logout = async () => {
    try {
      if (tokens?.refresh) {
        await authAPI.logout(tokens.refresh);
      }
    } catch (e) {
      // Ignore logout errors
    } finally {
      setUser(null);
      setTokens(null);
      localStorage.removeItem('fraudassist_user');
      localStorage.removeItem('fraudassist_tokens');
    }
  };

  return (
    <AuthContext.Provider value={{ user, tokens, login, register, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
