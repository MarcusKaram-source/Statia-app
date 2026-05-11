import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, Globe, Lock, LogOut, User, ShieldCheck, Heart, GitCompare } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import NotificationBell from "./NotificationBell";

export default function Header() {
  const { lang, setLang, cur, setCur, user, logout, setToast } = useAppContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [sc, setSc] = useState(false);
  const [mob, setMob] = useState(false);
  const [dd, setDd] = useState(false);

  useEffect(() => {
    const h = () => setSc(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navKeys = ["home", "properties", "projects", "contact"];
  const navLabels = {
    en: { home: "Home", properties: "Properties", projects: "Projects", contact: "Contact" },
    ar: { home: "الرئيسية", properties: "العقارات", projects: "المشاريع", contact: "تواصل" },
  };

  const navPaths = { home: "/", properties: "/properties", projects: "/projects", contact: "/contact" };

  const onLogout = () => {
    logout();
    setToast({ msg: "You have been signed out.", type: "info" });
    navigate("/");
  };

  const isDarkPage = pathname === "/properties" || pathname === "/projects";

  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: (sc || isDarkPage) ? "rgba(10,22,40,.97)" : "transparent", backdropFilter: (sc || isDarkPage) ? "blur(20px)" : "none", borderBottom: (sc || isDarkPage) ? "1px solid rgba(201,168,76,.15)" : "none", padding: "0 5%", transition: "all .4s" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 74, maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          <div style={{ fontFamily: "var(--serif)", fontSize: "1.85rem", fontWeight: 300, letterSpacing: ".18em", color: "#fff", fontStyle: "italic", lineHeight: 1 }}>Statia</div>
          <div style={{ fontSize: ".56rem", letterSpacing: ".26em", color: "var(--gold)", textTransform: "uppercase" }}>Luxury Real Estate</div>
        </div>

        <nav className="dNav" style={{ display: "flex", gap: "2.5rem" }}>
          {navKeys.map(k => (
            <button key={k} className="navlink" onClick={() => navigate(navPaths[k])}>{navLabels[lang][k]}</button>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: ".7rem" }}>
          <button onClick={() => setLang(lang === "en" ? "ar" : "en")} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(201,168,76,.1)", border: "1px solid rgba(201,168,76,.3)", borderRadius: 24, padding: "5px 12px", color: "var(--gold)", cursor: "pointer", fontSize: ".7rem", fontFamily: "var(--sans)" }}>
            <Globe size={12} />{lang === "en" ? "عربي" : "EN"}
          </button>

          <div style={{ position: "relative" }}>
            <select value={cur} onChange={e => setCur(e.target.value)} style={{ background: "rgba(201,168,76,.1)", border: "1px solid rgba(201,168,76,.3)", borderRadius: 24, padding: "5px 24px 5px 12px", color: "var(--gold)", cursor: "pointer", fontSize: ".7rem", appearance: "none", fontFamily: "var(--sans)", outline: "none" }}>
              {["EGP", "SAR", "AED"].map(c => <option key={c} value={c} style={{ background: "#0a1628" }}>{c}</option>)}
            </select>
            <ChevronDown size={9} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: "var(--gold)", pointerEvents: "none" }} />
          </div>

          {user ? (
            <>
              <div className="hd-ext" style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => navigate("/favorites")}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "rgba(201,168,76,0.1)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--gold)";
                    e.currentTarget.style.color = "var(--navy)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(201,168,76,0.1)";
                    e.currentTarget.style.color = "var(--gold)";
                  }}
                  title={lang === "ar" ? "المفضلة" : "Favorites"}
                >
                  <Heart size={20} color="var(--gold)" />
                </button>
                <button
                  onClick={() => navigate("/comparison")}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "rgba(201,168,76,0.1)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--gold)";
                    e.currentTarget.style.color = "var(--navy)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(201,168,76,0.1)";
                    e.currentTarget.style.color = "var(--gold)";
                  }}
                  title={lang === "ar" ? "المقارنة" : "Compare"}
                >
                  <GitCompare size={20} color="var(--gold)" />
                </button>
                <NotificationBell />
              </div>
              <div style={{ position: "relative" }}>
                <div className="user-avatar" onClick={() => setDd(!dd)} title={user.name}>
                  {user.name[0].toUpperCase()}
                </div>
                {dd && (
                  <div className="dropdown-menu" onClick={() => setDd(false)}>
                    <div style={{ padding: ".6rem 1.1rem .5rem", borderBottom: "1px solid rgba(255,255,255,.07)", marginBottom: ".3rem" }}>
                      <div style={{ color: "#fff", fontSize: ".84rem", fontWeight: 600 }}>{user.name}</div>
                      <div style={{ color: "rgba(255,255,255,.32)", fontSize: ".72rem" }}>{user.email}</div>
                      {user.role === "ADMIN" && <div style={{ color: "var(--gold)", fontSize: ".66rem", fontWeight: 700, letterSpacing: ".1em", marginTop: 3 }}>⬡ ADMIN</div>}
                    </div>
                    {user.role === "ADMIN" && (
                      <button className="dropdown-item" onClick={() => { setDd(false); navigate("/admin"); }}>
                        <ShieldCheck size={14} /> Admin Dashboard
                      </button>
                    )}
                    <button className="dropdown-item" onClick={() => { setDd(false); navigate("/profile"); }}>
                      <User size={14} /> My Profile
                    </button>
                    <div style={{ height: 1, background: "rgba(255,255,255,.07)", margin: ".3rem 0" }} />
                    <button className="dropdown-item danger" onClick={() => { setDd(false); onLogout(); }}>
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button className="btn-g" onClick={() => navigate("/login")} style={{ borderRadius: 4, padding: "7px 18px", fontSize: ".76rem", display: "flex", alignItems: "center", gap: 6 }}>
              <Lock size={13} />Log In
            </button>
          )}

          <button className="mBtn" style={{ display: "none", background: "none", border: "none", color: "#fff", cursor: "pointer" }} onClick={() => setMob(!mob)}>
            {mob ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {mob && (
        <div style={{ background: "rgba(10,22,40,.98)", backdropFilter: "blur(20px)", padding: "1.1rem 5%", borderTop: "1px solid rgba(201,168,76,.1)" }}>
          {navKeys.map(k => (
            <button key={k} className="navlink" onClick={() => { navigate(navPaths[k]); setMob(false); }} style={{ display: "block", padding: ".65rem 0", width: "100%", textAlign: lang === "ar" ? "right" : "left" }}>{navLabels[lang][k]}</button>
          ))}
          {user && (
            <>
              <div style={{ height: 1, background: "rgba(201,168,76,.12)", margin: ".55rem 0" }} />
              <button className="navlink" onClick={() => { navigate("/favorites"); setMob(false); }} style={{ display: "block", padding: ".65rem 0", width: "100%", textAlign: lang === "ar" ? "right" : "left" }}>{lang === "ar" ? "المفضلة" : "Favorites"}</button>
              <button className="navlink" onClick={() => { navigate("/comparison"); setMob(false); }} style={{ display: "block", padding: ".65rem 0", width: "100%", textAlign: lang === "ar" ? "right" : "left" }}>{lang === "ar" ? "المقارنة" : "Compare"}</button>
              <button className="navlink" onClick={() => { navigate("/profile"); setMob(false); }} style={{ display: "block", padding: ".65rem 0", width: "100%", textAlign: lang === "ar" ? "right" : "left" }}>{lang === "ar" ? "ملفي الشخصي" : "My Profile"}</button>
            </>
          )}
          {!user && <button className="btn-g" onClick={() => { navigate("/login"); setMob(false); }} style={{ marginTop: ".75rem", width: "100%", borderRadius: 4, padding: "10px", fontSize: ".82rem" }}>Log In</button>}
        </div>
      )}
    </header>
  );
}
