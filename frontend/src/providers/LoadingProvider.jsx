import React, { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

// Create Loader Context
const LoaderContext = createContext();

// LoaderProvider Component
export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // Start loader
  const showLoader = () => setLoading(true);

  // Stop loader
  const hideLoader = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
    </LoaderContext.Provider>
  );
};

// PropTypes validation
LoaderProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook to use Loader Context
export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
};
