import React, { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";

// Create Auth Context
export const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to handle login
  const login = (userData) => {
    setUser(userData); // Save user data to state
    localStorage.setItem("user", JSON.stringify(userData)); // Persist to localStorage
    const credentials = btoa(`${userData.email}:${userData.password}`);
    localStorage.setItem("token",credentials)
  };

  // Function to handle logout
  const logout = () => {
    setUser(null); // Clear user data from state
    localStorage.removeItem("user"); // Clear from localStorage
    localStorage.removeItem("token")
  };
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  // Provide values to children
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// PropTypes for validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
// Hook to use Loader Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
};
