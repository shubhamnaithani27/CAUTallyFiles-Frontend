import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null); // Will hold { username, role }

  // Function to handle login
  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });

      const jwtToken = response.data.token;

      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      await fetchUser(jwtToken); // Fetch user info immediately after login
      return true;
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      return false;
    }
  };

  // Function to fetch user data using token
  const fetchUser = async (jwtToken = token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user info:', error.response?.data || error.message);
      logout();
    }
  };

  // Check role manually (used in App.jsx useEffect)
  const checkRole = () => {
    if (token && !user) {
      fetchUser();
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  // Auto-fetch user info if token exists on initial load
  useEffect(() => {
    if (token && !user) {
      fetchUser();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        checkRole,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
