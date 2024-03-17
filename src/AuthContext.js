import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check the localStorage for an existing authenticated state on initial load
    const isAuth = localStorage.getItem('isAuthenticated');
    return isAuth === 'true'; // Convert string back to boolean
  });

  const logout = () => {
    setIsAuthenticated(false); // Update state to not authenticated
    localStorage.removeItem('isAuthenticated'); // Clear the authentication flag from storage
  };

  // Effect to update localStorage when isAuthenticated changes
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString()); // Make sure to store the string representation
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
