import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to check if the user is authenticated via the backend
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      
      try {
        // Hitting the backend is the ONLY way to check an HttpOnly cookie
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          // Crucial: Tells the browser to attach the HttpOnly cookie
          credentials: 'include', 
        });

        if (response.ok) {
          // Token was valid, backend sent the user data
          const userData = await response.json();
          setUser(userData); 
        } else {
          // Token was missing or invalid/expired (backend returned 401)
          setUser(null); 
        }
      } catch (error) {
        // Network error
        console.error("Auth check failed:", error);
        setUser(null);
      } finally {
        // State is now known, stop loading
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // Empty dependency array means this runs only once on mount

  const login = (userData) => {
    // You'll call this after a successful login API call
    setUser(userData);
  };

  const logout = () => {
    // Call your backend's logout API to clear the cookie, then set user to null
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    // Determines if the user is currently logged in
    isAuthenticated: !!user, 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};