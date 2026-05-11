import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, User } from "lucide-react";
import { Lbl } from "../components/Shared";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAppContext } from "../context/AppContext";
import { apiFetch } from "../api";

export default function Signup() {
  const { login, setToast } = useAppContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", pass: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validation, setValidation] = useState({ name: "", email: "", pass: "", confirm: "" });

  const validateField = (field, value) => {
    let error = "";
    
    if (field === "name") {
      if (!value.trim()) error = "Name is required";
      else if (value.length < 2) error = "Name must be at least 2 characters";
    }
    
    if (field === "email") {
      if (!value.trim()) error = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(value)) error = "Please enter a valid email";
    }
    
    if (field === "pass") {
      if (!value) error = "Password is required";
      else if (value.length < 8) error = "Password must be at least 8 characters";
    }
    
    if (field === "confirm") {
      if (!value) error = "Please confirm your password";
      else if (value !== form.pass) error = "Passwords do not match";
    }
    
    setValidation(prev => ({ ...prev, [field]: error }));
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
    setErr("");
  };

  const strength = (p) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const strColor = ["#f87171", "#fbbf24", "#fbbf24", "#34d399", "#34d399"];
  const strLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const s = strength(form.pass);

  const handle = async () => {
    setErr("");
    if (!form.name || !form.email || !form.pass || !form.confirm) { setErr("Please fill in all fields."); return; }
    if (!/\S+@\S+\.\S+/.test(form.email)) { setErr("Please enter a valid email."); return; }
    if (form.pass.length < 8) { setErr("Password must be at least 8 characters."); return; }
    if (form.pass !== form.confirm) { setErr("Passwords do not match."); return; }
    setLoading(true);
    try {
      await apiFetch('/api/auth/register', { method: 'POST', body: { name: form.name, email: form.email, password: form.pass } });
      setSuccess(true);
      const data = await apiFetch('/api/auth/login', { method: 'POST', body: { email: form.email, password: form.pass } });
      login(data.user);
      setTimeout(() => {
        setToast({ msg: `Welcome, ${data.user.name}! Please check your email to verify your account.`, type: "success" });
        navigate("/");
      }, 1400);
    } catch (e) {
      setLoading(false);
      setSuccess(false);
      setErr(e.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--navy)" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "3rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=80')", backgroundSize: "cover", backgroundPosition: "center", opacity: .18 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(10,22,40,.95),rgba(15,32,68,.85))" }} />
        <div className="float" style={{ position: "absolute", top: "20%", right: "12%", width: 200, height: 200, border: "1px solid rgba(201,168,76,.1)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 380 }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: "3.5rem", color: "#fff", fontStyle: "italic", fontWeight: 300, marginBottom: 4 }}>Statia</div>
          <div style={{ fontSize: ".6rem", color: "var(--gold)", letterSpacing: ".3em", textTransform: "uppercase", marginBottom: "2.5rem" }}>Luxury Real Estate</div>
          <div className="gline" style={{ marginBottom: "2rem" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {[["🏠", "Exclusive Listings", "Access 800+ premium properties"], ["💎", "Priority Viewings", "Book private tours instantly"], ["📊", "Market Insights", "Stay ahead with real-time data"]].map(([em, t, s2]) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: "1rem", textAlign: "left", background: "rgba(201,168,76,.05)", border: "1px solid rgba(201,168,76,.1)", borderRadius: 8, padding: ".9rem 1.1rem" }}>
                <span style={{ fontSize: "1.4rem" }}>{em}</span>
                <div>
                  <div style={{ color: "var(--gold)", fontSize: ".8rem", fontWeight: 600 }}>{t}</div>
                  <div style={{ color: "rgba(255,255,255,.35)", fontSize: ".74rem" }}>{s2}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ width: "min(500px,100%)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "2.5rem 3.5rem", background: "rgba(6,15,30,.98)", borderLeft: "1px solid rgba(201,168,76,.1)", overflowY: "auto" }}>
        <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "rgba(255,255,255,.35)", cursor: "pointer", fontSize: ".78rem", display: "flex", alignItems: "center", gap: 6, marginBottom: "2rem", fontFamily: "var(--sans)", transition: "color .2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.35)"}>
          ← Back to website
        </button>

        {success ? (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(52,211,153,.12)", border: "1px solid rgba(52,211,153,.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <CheckCircle size={32} color="#34d399" />
            </div>
            <h2 style={{ fontFamily: "var(--serif)", color: "#fff", fontSize: "2rem", fontWeight: 300, marginBottom: ".5rem" }}>Account Created!</h2>
            <p style={{ color: "rgba(255,255,255,.38)", fontSize: ".88rem", marginBottom: ".5rem" }}>A verification link has been sent to <strong style={{ color: "rgba(255,255,255,.7)" }}>{form.email}</strong>.</p>
            <p style={{ color: "rgba(255,255,255,.3)", fontSize: ".8rem" }}>Signing you in…</p>
            <LoadingSpinner size={40} trackColor="rgba(201,168,76,.2)" style={{ margin: "1.5rem auto 0" }} />
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontFamily: "var(--serif)", fontSize: "2.5rem", color: "#fff", fontWeight: 300, lineHeight: 1.1, marginBottom: ".5rem" }}>Create account</h1>
              <p style={{ color: "rgba(255,255,255,.38)", fontSize: ".88rem" }}>Join Statia's exclusive community</p>
            </div>

            {err && (
              <div style={{ background: "rgba(248,113,113,.1)", border: "1px solid rgba(248,113,113,.3)", borderRadius: 6, padding: ".7rem 1rem", marginBottom: "1rem", display: "flex", gap: 8, alignItems: "center" }}>
                <AlertCircle size={14} color="#f87171" />
                <span style={{ color: "#f87171", fontSize: ".8rem" }}>{err}</span>
              </div>
            )}

            <Lbl light>Full Name</Lbl>
            <div className="auth-input-wrap">
              <User size={15} className="auth-icon" />
              <input id="name" name="name" className="li-dark" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" style={{ borderRadius: 6 }} />
            </div>

            <Lbl light>Email Address</Lbl>
            <div className="auth-input-wrap">
              <Mail size={15} className="auth-icon" />
              <input id="email" name="email" className="li-dark" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" type="email" style={{ borderRadius: 6 }} />
            </div>

            <Lbl light>Password</Lbl>
            <div className="auth-input-wrap" style={{ marginBottom: ".5rem" }}>
              <Lock size={15} className="auth-icon" />
              <input id="password" name="password" className="li-dark" value={form.pass} onChange={e => setForm(f => ({ ...f, pass: e.target.value }))} placeholder="Min. 8 characters" type={showPass ? "text" : "password"} style={{ borderRadius: 6, paddingRight: 42 }} />
              <button className="auth-eye" onClick={() => setShowPass(!showPass)}>{showPass ? <EyeOff size={14} /> : <Eye size={14} />}</button>
            </div>
            {form.pass && (
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                  {[1, 2, 3, 4].map(i => <div key={i} className="strength-bar" style={{ flex: 1, background: i <= s ? strColor[s] : "rgba(255,255,255,.1)" }} />)}
                </div>
                <span style={{ fontSize: ".68rem", color: strColor[s] }}>{strLabel[s]}</span>
              </div>
            )}

            <Lbl light>Confirm Password</Lbl>
            <div className="auth-input-wrap">
              <Lock size={15} className="auth-icon" />
              <input id="confirm" name="confirm" className="li-dark" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} onKeyDown={e => e.key === "Enter" && handle()} placeholder="Repeat password" type={showConf ? "text" : "password"} style={{ borderRadius: 6, paddingRight: 42 }} />
              <button className="auth-eye" onClick={() => setShowConf(!showConf)}>{showConf ? <EyeOff size={14} /> : <Eye size={14} />}</button>
            </div>

            <button className="btn-g" onClick={handle} disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: 6, fontSize: ".9rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading ? <LoadingSpinner size={18} thickness={2} color="var(--navy)" trackColor="rgba(10,22,40,.3)" /> : <><User size={15} />Create Account</>}
            </button>

            <div style={{ textAlign: "center", marginTop: "1.4rem" }}>
              <span style={{ color: "rgba(255,255,255,.35)", fontSize: ".82rem" }}>Already have an account? </span>
              <button onClick={() => navigate("/login")} style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontSize: ".82rem", fontFamily: "var(--sans)", fontWeight: 600 }}>Sign in</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
