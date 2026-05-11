import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, AlertCircle } from "lucide-react";
import { apiFetch } from "../api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAppContext } from "../context/AppContext";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, user } = useAppContext();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) { setStatus("invalid"); return; }

    apiFetch(`/api/auth/verify-email/${token}`, { method: 'GET' })
      .then(() => {
        if (user) setUser(prev => ({ ...prev, isEmailVerified: true }));
        setStatus("success");
      })
      .catch(() => setStatus("invalid"));
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--navy)", padding: "2rem" }}>
      <div style={{ background: "rgba(6,15,30,.98)", border: "1px solid rgba(201,168,76,.15)", borderRadius: 12, padding: "3rem", width: "min(460px,100%)", textAlign: "center" }}>
        {status === "loading" && (
          <>
            <LoadingSpinner size={44} style={{ margin: "0 auto 1.5rem" }} />
            <p style={{ color: "rgba(255,255,255,.5)", fontSize: ".9rem" }}>Verifying your email…</p>
          </>
        )}
        {status === "success" && (
          <>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(52,211,153,.12)", border: "1px solid rgba(52,211,153,.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <CheckCircle size={28} color="#34d399" />
            </div>
            <h1 style={{ fontFamily: "var(--serif)", color: "#fff", fontSize: "2rem", fontWeight: 300, marginBottom: ".5rem" }}>Email Verified</h1>
            <p style={{ color: "rgba(255,255,255,.45)", fontSize: ".88rem", marginBottom: "2rem" }}>Your email address has been confirmed. You now have full access to Statia.</p>
            <button onClick={() => navigate("/")} style={{ background: "var(--gold)", color: "var(--navy)", border: "none", borderRadius: 6, padding: "11px 28px", fontSize: ".88rem", fontWeight: 700, cursor: "pointer", fontFamily: "var(--sans)" }}>Go to Home</button>
          </>
        )}
        {status === "invalid" && (
          <>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(248,113,113,.1)", border: "1px solid rgba(248,113,113,.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <AlertCircle size={28} color="#f87171" />
            </div>
            <h1 style={{ fontFamily: "var(--serif)", color: "#fff", fontSize: "2rem", fontWeight: 300, marginBottom: ".5rem" }}>Invalid Link</h1>
            <p style={{ color: "rgba(255,255,255,.45)", fontSize: ".88rem", marginBottom: "2rem" }}>This verification link is invalid or has already been used.</p>
            <button onClick={() => navigate("/")} style={{ background: "rgba(255,255,255,.06)", color: "rgba(255,255,255,.6)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 6, padding: "11px 28px", fontSize: ".88rem", cursor: "pointer", fontFamily: "var(--sans)" }}>Go to Home</button>
          </>
        )}
      </div>
    </div>
  );
}
