import React, { createContext, useContext, useEffect, useState } from 'react';
import API from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await API.get('/auth/me');
        if (data.success) {
          setUser(data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const loginUser = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        addToast(`Welcome back, ${data.user.name}!`, 'success');
        return { success: true, user: data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const registerStudent = async (studentData) => {
    try {
      const { data } = await API.post('/auth/register/student', studentData);
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        addToast('Student account created successfully!', 'success');
        return { success: true, user: data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const registerCompany = async (companyData) => {
    try {
      const { data } = await API.post('/auth/register/company', companyData);
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        addToast('Company account registered successfully!', 'success');
        return { success: true, user: data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    addToast('You have been logged out.', 'info');
  };

  const toggleBookmark = async (projectId) => {
    if (!user || user.role !== 'student') {
      addToast('Please log in as a student to bookmark projects.', 'info');
      return;
    }

    try {
      const { data } = await API.post('/student/save-project', { projectId });
      if (data.success) {
        setUser((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            savedProjects: data.savedProjects,
          },
        }));
        addToast(data.isSaved ? 'Opportunity bookmarked!' : 'Opportunity removed from bookmarks.', 'success');
      }
    } catch (err) {
      addToast('Failed to update bookmark.', 'error');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginUser,
        registerStudent,
        registerCompany,
        logout,
        toggleBookmark,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
