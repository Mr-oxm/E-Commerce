import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import routes from '../constants/routes';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get(routes.auth.getUserData);
      setUser(res.data.data);
      setNeedsOnboarding(res.data.needsOnboarding || false);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(routes.auth.login, { email, password });
      const newToken = res.data.token;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      await fetchUser();
      setNeedsOnboarding(res.data.needsOnboarding || false);
      return res.data.needsOnboarding;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (username, email, password) => {
    try {
      const res = await axios.post(routes.auth.signup, { username, email, password });
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      await fetchUser();
      setNeedsOnboarding(res.data.needsOnboarding || false);
      return res.data.needsOnboarding;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateUserProfile = async (userData) => {
    try {
      const res = await axios.post(routes.auth.updateUserData, userData);
      setUser(res.data.data);
      setNeedsOnboarding(res.data.needsOnboarding || false);
      return res.data.needsOnboarding;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      needsOnboarding, 
      token, 
      login, 
      signup, 
      logout, 
      updateUserProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
