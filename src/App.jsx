import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext'; // Importing AuthContext to manage authentication
import LoginPage from './pages/LoginPage'; // Importing LoginPage
import RegisterPage from './pages/RegisterPage'; // Importing RegisterPage
import UserDashboard from './pages/UserDashboard'; // Importing UserPage
import AdminDashboard from './pages/AdminDashboard'; // Importing AdminDashboard
import ProtectedRoute from './components/ProtectedRoute'; // Importing ProtectedRoute for role-based protection

const App = () => {
  // Using the AuthContext to check if the user is logged in
  const { user, token, checkRole } = useContext(AuthContext);

  // Effect to check the user's role after login
  useEffect(() => {
    if (token) {
      checkRole();
    }
  }, [token, checkRole]);

  return (
    <><h1 className="text-red-500 text-3xl font-bold">Hello Tailwind</h1>

    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect to login */}
        <Route path="/login" element={<LoginPage />} /> {/* Login page */}
        <Route path="/register" element={<RegisterPage />} /> {/* Register page */}

        {/* Protected Routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        /> {/* User Dashboard (Protected Route for User) */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        /> {/* Admin Dashboard (Protected Route for Admin) */}
        
      </Routes>
    </Router>
    </>
  );
};

export default App;
