
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminMe, adminLogin, clearToken, getToken, setToken } from "@/api/client";

const AuthContext = createContext({ admin: null, login: async () => {}, logout: () => {}, loading: true });

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    adminMe()
      .then((d) => setAdmin(d))
      .catch(() => {
        clearToken();
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (password) => {
    const res = await adminLogin(password);
    setToken(res.access_token);
    const me = await adminMe();
    setAdmin(me);
    return me;
  };

  const logout = () => {
    clearToken();
    setAdmin(null);
    navigate("/admin/login");
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AuthContext);
