import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ role, children }) => {
  const { user, token } = useContext(AuthContext);

  // If not logged in, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but role doesn't match, redirect to correct dashboard or logout
  if (user?.role !== role) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user?.role === 'user') {
      return <Navigate to="/user" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  // Role matches — render the child component (page)
  return children;
};

export default ProtectedRoute;
// This component checks if the user is logged in and has the correct role before rendering the child component.