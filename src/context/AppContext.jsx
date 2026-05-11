import { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [lang, setLangState] = useState("en");
  const [cur, setCur] = useState("EGP");
  const [user, setUser] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({ q: "", type: "", loc: "", price: "", rooms: "" });

  // Restore session from httpOnly cookie on app load
  useEffect(() => {
    apiFetch('/api/auth/me', { method: 'GET' })
      .then(data => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setSessionLoading(false));
  }, []);

  const setLang = (l) => {
    setLangState(l);
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  };

  // Token is now managed server-side via httpOnly cookie — no localStorage needed
  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    apiFetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ lang, setLang, cur, setCur, user, setUser, login, logout, toast, setToast, filters, setFilters, sessionLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
