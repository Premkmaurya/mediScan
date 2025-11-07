import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import from the file we just created

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // 1. Show a loading screen while we wait for the backend check
  if (loading) {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            Loading user session...
        </div>
    ); 
  }

  // 2. If the user is authenticated, show the page content
  if (isAuthenticated) {
    return children;
  } 
  
  // 3. If NOT authenticated, redirect them to the login page
  else {
    // 'replace' prevents them from hitting the back button to get in
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;