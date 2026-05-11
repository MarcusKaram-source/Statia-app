import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toast } from "./components/Shared";
import LoadingSpinner from "./components/LoadingSpinner";
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
import VerifyEmail from "./pages/VerifyEmail";
import Projects from "./pages/Projects";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "2rem",
          background: "var(--navy)"
        }}>
          <h1 style={{
            fontFamily: "var(--serif)",
            fontSize: "2.5rem",
            color: "var(--gold)",
            marginBottom: "1rem"
          }}>Something went wrong</h1>
          <p style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "1rem",
            marginBottom: "2rem"
          }}>An unexpected error occurred. Please refresh the page or try again later.</p>
          <button
            onClick={() => window.location.href = "/"}
            style={{
              padding: "12px 24px",
              background: "var(--gold)",
              color: "var(--navy)",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 600
            }}
          >
            Go to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const NO_SHELL = ["/login", "/signup", "/admin"];

export default function App() {
  const { lang, toast, setToast, logout, sessionLoading } = useAppContext();
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

  if (sessionLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--navy)" }}>
        <LoadingSpinner size={36} />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div dir={lang === "ar" ? "rtl" : "ltr"}>
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        {!hideShell && <Header />}
        <main>
          <Routes>
            <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
            <Route path="/login" element={<ErrorBoundary><Login /></ErrorBoundary>} />
            <Route path="/signup" element={<ErrorBoundary><Signup /></ErrorBoundary>} />
            <Route path="/admin" element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
            <Route path="/properties" element={<ErrorBoundary><Properties /></ErrorBoundary>} />
            <Route path="/properties/:id" element={<ErrorBoundary><Detail /></ErrorBoundary>} />
            <Route path="/contact" element={<ErrorBoundary><ContactPage /></ErrorBoundary>} />
            <Route path="/profile" element={<ErrorBoundary><Profile /></ErrorBoundary>} />
            <Route path="/privacy" element={<ErrorBoundary><PrivacyPolicy /></ErrorBoundary>} />
            <Route path="/terms" element={<ErrorBoundary><TermsOfService /></ErrorBoundary>} />
            <Route path="/favorites" element={<ErrorBoundary><FavoritesPage /></ErrorBoundary>} />
            <Route path="/comparison" element={<ErrorBoundary><ComparisonPage /></ErrorBoundary>} />
            <Route path="/verify-email" element={<ErrorBoundary><VerifyEmail /></ErrorBoundary>} />
            <Route path="/projects" element={<ErrorBoundary><Projects /></ErrorBoundary>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        {!hideShell && !pathname.match(/^\/properties\/.+/) && <Footer />}
      </div>
    </ErrorBoundary>
  );
}
