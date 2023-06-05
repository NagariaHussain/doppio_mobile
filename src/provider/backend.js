import React, { useContext, createContext, useState, useEffect } from "react";
import { FrappeApp } from "frappe-js-sdk";

const FrappeContext = createContext();

const FrappeProvider = ({ children, config }) => {

  useEffect(() => {
    if (config) {
      const app = new FrappeApp(config);
      setFrappe(app);
    }
  }, [config]);

  return (
    <FrappeContext.Provider value={frappe}>{children}</FrappeContext.Provider>
  );
};

const useFrappe = () => {
  const frappe = useContext(FrappeContext);
  return frappe;
};
