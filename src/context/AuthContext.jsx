import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for token on mount
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token by fetching user data
          const res = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Token verification failed", err.response?.data?.msg || err);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkToken();
  }, []);

  const login = async (token) => {
    localStorage.setItem('token', token);
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
