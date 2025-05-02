import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; // Importing LoginPage
import RegisterPage from './pages/RegisterPage'; // Importing RegisterPage
import UserDashboard from './pages/UserDashboard'; // Importing UserPage
import AdminDashboard from './pages/AdminDashboard'; // Importing AdminDashboard
import ProtectedRoute from './components/ProtectedRoute'; // Importing ProtectedRoute for role-based protection


import { AuthProvider } from './context/AuthContext'; // ✅ Import your AuthProvider

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/user"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
