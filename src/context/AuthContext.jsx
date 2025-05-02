
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const login = async (username, password) => {
  
    // console.log(`${process.env.VITE_Backend_URL}`)
    try {

      const response = await axios.post("https://cautallyfiles-backend.onrender.com/api/auth/login", 
        { username, password },
        { withCredentials: true }
      );

      const userRole = response.data.role;


      localStorage.setItem('user', JSON.stringify({ role: userRole }));
      setUser({ role: userRole });


      return true;
    } catch (error) {

      return false;
    }
  };


  const logout = async () => {
    try {
      await axios.post(

        'https://cautallyfiles-backend.onrender.com/api/auth/logout',
        {},
        { withCredentials: true } // ✅ Make sure to include credentials
      );
    } catch {
      console.log('Something went wrong, unable to logout.');
    }


    localStorage.removeItem('user');
    setUser(null);
  };


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
