import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const authType = localStorage.getItem('authType');

      if (token && authType === 'local') {
        try {
          const res = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Token verification failed:", err);
          localStorage.removeItem('token');
          localStorage.removeItem('authType');
        } finally {
          setLoading(false);
        }
        return;
      }

      if (!auth) {
        console.warn("Firebase Auth is not configured. Configure VITE_FIREBASE_* keys in your .env file.");
        setLoading(false);
        return;
      }

      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Synchronize/Login user in backend database
            const res = await axios.post('http://localhost:5000/api/auth/social-login', {
              email: firebaseUser.email,
              firstName: firebaseUser.displayName ? firebaseUser.displayName.split(' ')[0] : 'User',
              lastName: firebaseUser.displayName ? firebaseUser.displayName.split(' ').slice(1).join(' ') : '',
              photoURL: firebaseUser.photoURL || '',
              uid: firebaseUser.uid
            });

            const { token: dbToken, user: dbUser } = res.data;
            localStorage.setItem('token', dbToken);
            localStorage.setItem('authType', 'firebase');
            setUser(dbUser);
            setIsAuthenticated(true);
          } catch (err) {
            console.error("Firebase synchronization with backend failed:", err);
            if (err.response?.status === 403) {
              alert('Your account is suspended by administration.');
            }
            await signOut(auth);
            localStorage.removeItem('token');
            localStorage.removeItem('authType');
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          const currentAuthType = localStorage.getItem('authType');
          if (currentAuthType === 'firebase') {
            localStorage.removeItem('token');
            localStorage.removeItem('authType');
            setIsAuthenticated(false);
            setUser(null);
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, user: dbUser } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('authType', 'local');
      setUser(dbUser);
      setIsAuthenticated(true);
    } catch (err) {
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    const authType = localStorage.getItem('authType');
    if (authType === 'firebase' && auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error("Error signing out from Firebase:", err);
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('authType');
    setIsAuthenticated(false);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
