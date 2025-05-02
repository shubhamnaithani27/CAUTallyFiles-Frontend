import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ role, children }) => {

  const { user, isAuthenticated } = useContext(AuthContext);

// Not logged in → redirect to login
if (!isAuthenticated) {
  return <Navigate to="/login" replace />;
}

// Logged in but role mismatch → redirect
if (user?.role !== role) {
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else if (user?.role === 'user') {
    return <Navigate to="/user" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
}
return children;

};

export default ProtectedRoute;
// This component checks if the user is logged in and has the correct role before rendering the child component.