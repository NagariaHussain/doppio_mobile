import React, { useContext, createContext, useState, useEffect } from "react";
import { FrappeApp } from "frappe-js-sdk";
import { AuthContext } from "./auth";
import { BASE_URI } from "../data/constants";

const FrappeContext = createContext();

const FrappeProvider = ({ children }) => {
  const { accessToken, isAuthenticated } = useContext(AuthContext);
  const [db, setDb] = useState(null);
  const [call, setCall] = useState(null);
  const [auth, setAuth] = useState(null);


  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const frappe = new FrappeApp(BASE_URI, {
      useToken: true,
      type: "Bearer",
      token: () => accessToken,
    });

    setDb(frappe.db());
    setCall(frappe.call());
    setAuth(frappe.auth());
  }, [accessToken]);

  return (
    <FrappeContext.Provider value={{
      db,
      auth,
      call
    }}>{children}</FrappeContext.Provider>
  );
};

export const useFrappe = () => {
  const frappe = useContext(FrappeContext);
  return frappe;
};

export { FrappeContext, FrappeProvider };