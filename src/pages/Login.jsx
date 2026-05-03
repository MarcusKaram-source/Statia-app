import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ShieldCheck } from "lucide-react";
import { Lbl } from "../components/Shared";
import { useAppContext } from "../context/AppContext";
import { apiFetch } from "../api";

export default function Login() {
  const { login, setToast } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setErr("");
    if (!email || !pass) { setErr("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const data = await apiFetch('/api/auth/login', { method: 'POST', body: { email, password: pass } });
      login(data.user, data.token);
      setToast({ msg: `Welcome back, ${data.user.name}!`, type: "success" });
      navigate(data.user.role === 'ADMIN' ? '/admin' : '/');
    } catch (e) {
      setErr(e.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--navy)" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "3rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80')", backgroundSize: "cover", backgroundPosition: "center", opacity: .18 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(10,22,40,.95),rgba(15,32,68,.85))" }} />
        <div className="float" style={{ position: "absolute", top: "15%", left: "10%", width: 220, height: 220, border: "1px solid rgba(201,168,76,.08)", borderRadius: "50%", pointerEvents: "none" }} />
        <div className="float" style={{ position: "absolute", bottom: "20%", right: "8%", width: 140, height: 140, border: "1px solid rgba(201,168,76,.12)", borderRadius: "50%", pointerEvents: "none", animationDelay: "1.5s" }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 380 }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: "3.5rem", color: "#fff", fontStyle: "italic", fontWeight: 300, marginBottom: 4 }}>Statia</div>
          <div style={{ fontSize: ".6rem", color: "var(--gold)", letterSpacing: ".3em", textTransform: "uppercase", marginBottom: "2.5rem" }}>Luxury Real Estate</div>
          <div className="gline" style={{ marginBottom: "2rem" }} />
          <p style={{ color: "rgba(255,255,255,.45)", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.25rem", fontWeight: 300, lineHeight: 1.8 }}>"Where prestige meets property."</p>
          <p style={{ color: "rgba(255,255,255,.3)", fontSize: ".8rem", marginTop: "1rem" }}>Egypt's most exclusive real estate portfolio</p>
        </div>
      </div>

      <div style={{ width: "min(480px,100%)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "3rem 3.5rem", background: "rgba(6,15,30,.98)", borderLeft: "1px solid rgba(201,168,76,.1)" }}>
        <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "rgba(255,255,255,.35)", cursor: "pointer", fontSize: ".78rem", display: "flex", alignItems: "center", gap: 6, marginBottom: "2.5rem", fontFamily: "var(--sans)", transition: "color .2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.35)"}>
          ← Back to website
        </button>

        <div style={{ marginBottom: "2.25rem" }}>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "2.6rem", color: "#fff", fontWeight: 300, lineHeight: 1.1, marginBottom: ".5rem" }}>Welcome back</h1>
          <p style={{ color: "rgba(255,255,255,.38)", fontSize: ".88rem" }}>Sign in to your Statia account</p>
        </div>

        {err && (
          <div style={{ background: "rgba(248,113,113,.1)", border: "1px solid rgba(248,113,113,.3)", borderRadius: 6, padding: ".75rem 1rem", marginBottom: "1.1rem", display: "flex", alignItems: "center", gap: 8 }}>
            <AlertCircle size={15} color="#f87171" />
            <span style={{ color: "#f87171", fontSize: ".82rem" }}>{err}</span>
          </div>
        )}

        <div>
          <Lbl light>Email Address</Lbl>
          <div className="auth-input-wrap">
            <Mail size={15} className="auth-icon" />
            <input className="li-dark" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} placeholder="your@email.com" type="email" style={{ borderRadius: 6 }} />
          </div>

          <Lbl light>Password</Lbl>
          <div className="auth-input-wrap" style={{ marginBottom: ".5rem" }}>
            <Lock size={15} className="auth-icon" />
            <input className="li-dark" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} placeholder="•••••••" type={showPass ? "text" : "password"} style={{ borderRadius: 6, paddingRight: 42 }} />
            <button className="auth-eye" onClick={() => setShowPass(!showPass)}>{showPass ? <EyeOff size={15} /> : <Eye size={15} />}</button>
          </div>

          <div style={{ background: "rgba(201,168,76,.06)", border: "1px solid rgba(201,168,76,.15)", borderRadius: 6, padding: ".65rem 1rem", marginBottom: "1.5rem", display: "flex", gap: 9, alignItems: "flex-start" }}>
            <ShieldCheck size={14} color="var(--gold)" style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: ".74rem", color: "rgba(255,255,255,.5)", lineHeight: 1.6 }}>
              <span style={{ color: "var(--gold)", fontWeight: 600 }}>Admin:</span> admin@statia.com / admin<br />
              <span style={{ color: "var(--gold)", fontWeight: 600 }}>User:</span> user@statia.com / password
            </div>
          </div>

          <button className="btn-g" onClick={handle} disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: 6, fontSize: ".9rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {loading ? <div style={{ width: 18, height: 18, border: "2px solid rgba(10,22,40,.3)", borderTopColor: "var(--navy)", borderRadius: "50%", animation: "spin .7s linear infinite" }} /> : <><Lock size={15} />Sign In</>}
          </button>

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <span style={{ color: "rgba(255,255,255,.35)", fontSize: ".82rem" }}>Don't have an account? </span>
            <button onClick={() => navigate("/signup")} style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontSize: ".82rem", fontFamily: "var(--sans)", fontWeight: 600 }}>Create account</button>
          </div>
        </div>
      </div>
    </div>
  );
}