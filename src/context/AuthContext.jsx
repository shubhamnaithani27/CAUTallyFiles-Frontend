import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    console.log('[AuthContext] Loaded user from localStorage:', savedUser);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (username, password) => {
    console.log('[AuthContext] Login attempt with:', username);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { username, password },
        { withCredentials: true }
      );

      const userRole = response.data.role;
      console.log('[AuthContext] Login successful, role:', userRole);

      localStorage.setItem('user', JSON.stringify({ role: userRole }));
      setUser({ role: userRole });

      console.log('[AuthContext] User state after login:', { role: userRole });
      return true;
    } catch (error) {
      console.error(
        '[AuthContext] Login failed:',
        error.response?.data || error.message
      );
      return false;
    }
  };

  const logout = () => {
    console.log('[AuthContext] Logging out...');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Debug: watch user changes
  useEffect(() => {
    console.log('[AuthContext] Current user state:', user);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
