import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

function readStorage(key, parse = false) {
  try {
    const v = localStorage.getItem(key);
    return parse ? JSON.parse(v) : v;
  } catch {
    return null;
  }
}

export function AppProvider({ children }) {
  const [lang, setLangState] = useState("en");
  const [cur, setCur] = useState("EGP");
  const [user, setUser] = useState(() => readStorage('user', true));
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({ q: "", type: "", loc: "", price: "", rooms: "" });
  const [socialLinks, setSocialLinks] = useState(() => readStorage('socialLinks', true) || {
    facebook: 'https://facebook.com/statia',
    instagram: 'https://instagram.com/statia',
    twitter: 'https://twitter.com/statia',
    linkedin: 'https://linkedin.com/company/statia',
    youtube: 'https://youtube.com/@statia'
  });

  const setLang = (l) => {
    setLangState(l);
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  };

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AppContext.Provider value={{ lang, setLang, cur, setCur, user, setUser, login, logout, toast, setToast, filters, setFilters, socialLinks, setSocialLinks }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);