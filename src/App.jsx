import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toast } from "./components/Shared";
import { useAppContext } from "./context/AppContext";
import { setUnauthorizedHandler } from "./api";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import Properties from "./pages/Properties";
import Detail from "./pages/Detail";
import ContactPage from "./pages/ContactPage";
import Profile from "./pages/Profile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import FavoritesPage from "./pages/FavoritesPage";
import ComparisonPage from "./pages/ComparisonPage";

const NO_SHELL = ["/login", "/signup", "/admin"];

export default function App() {
  const { lang, toast, setToast, logout } = useAppContext();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const hideShell = NO_SHELL.includes(pathname);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
      setToast({ msg: "Session expired. Please sign in again.", type: "error" });
      if (window.location.pathname !== "/login") navigate("/login");
    });
  }, [logout, setToast, navigate]);

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {!hideShell && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<Detail />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/comparison" element={<ComparisonPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideShell && !pathname.match(/^\/properties\/.+/) && <Footer />}
    </div>
  );
}