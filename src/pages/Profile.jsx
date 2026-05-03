import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Star, ShieldCheck, CheckCircle, AlertCircle, Lock, Eye, EyeOff } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { apiFetch } from "../api";

export default function Profile() {
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();

  // All hooks must be declared before any conditional return
  const [profile, setProfile] = useState({ name: user?.name || "", email: user?.email || "" });
  const [profileErr, setProfileErr] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [passForm, setPassForm] = useState({ current: "", next: "", confirm: "" });
  const [passErr, setPassErr] = useState("");
  const [passSaved, setPassSaved] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [showCur, setShowCur] = useState(false);
  const [showNxt, setShowNxt] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  if (!user) return null;

  const cardS = { background: "#fff", border: "1px solid rgba(201,168,76,.12)", borderRadius: 8, padding: "1.6rem", marginBottom: "1.25rem" };
  const fLabel = { fontSize: ".62rem", color: "var(--gray)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 5 };
  const fInput = { width: "100%", padding: "10px 13px", borderRadius: 5, background: "var(--cream)", border: "1px solid rgba(201,168,76,.22)", color: "var(--navy)", fontSize: ".84rem", fontFamily: "var(--sans)", outline: "none", boxSizing: "border-box" };

  const saveProfile = async () => {
    setProfileErr("");
    if (!profile.name || !profile.email) { setProfileErr("Name and email are required."); return; }
    setSavingProfile(true);
    try {
      const updated = await apiFetch('/api/auth/profile', { method: 'PATCH', body: { name: profile.name, email: profile.email } });
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2200);
    } catch (e) {
      setProfileErr(e.message || "Failed to save.");
    } finally {
      setSavingProfile(false);
    }
  };

  const savePass = async () => {
    setPassErr("");
    if (!passForm.current) { setPassErr("Enter your current password."); return; }
    if (passForm.next.length < 8) { setPassErr("New password must be at least 8 characters."); return; }
    if (passForm.next !== passForm.confirm) { setPassErr("Passwords do not match."); return; }
    setSavingPass(true);
    try {
      await apiFetch('/api/auth/password', { method: 'PATCH', body: { currentPassword: passForm.current, newPassword: passForm.next } });
      setPassSaved(true);
      setPassForm({ current: "", next: "", confirm: "" });
      setTimeout(() => setPassSaved(false), 2200);
    } catch (e) {
      setPassErr(e.message || "Failed to update password.");
    } finally {
      setSavingPass(false);
    }
  };

  const stats = user.role === "ADMIN"
    ? [["847+", "Properties Managed"], ["312", "Total Leads"], ["24", "Active Projects"]]
    : [["0", "Saved Properties"], ["0", "Enquiries Sent"], ["0", "Viewings Booked"]];

  return (
    <div style={{ paddingTop: 88, minHeight: "100vh", background: "var(--cream)" }}>
      <div style={{ background: "linear-gradient(135deg,var(--navy),var(--navy2))", padding: "3rem 5% 4.5rem" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "rgba(255,255,255,.4)", cursor: "pointer", fontSize: ".78rem", display: "flex", alignItems: "center", gap: 6, marginBottom: "1.5rem", fontFamily: "var(--sans)", transition: "color .2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.4)"}>← Back</button>
          <div style={{ display: "flex", alignItems: "center", gap: "1.6rem", flexWrap: "wrap" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,var(--gold),var(--gold2))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--navy)", fontWeight: 800, fontSize: "2rem", boxShadow: "0 0 0 4px rgba(201,168,76,.22)", flexShrink: 0 }}>{user.name[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: "2rem", color: "#fff", fontWeight: 300 }}>{user.name}</div>
              <div style={{ color: "var(--gold)", fontSize: ".66rem", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: ".25rem" }}>{user.role === "ADMIN" ? "⬡ Super Administrator" : "⬡ Member"}</div>
              <div style={{ color: "rgba(255,255,255,.38)", fontSize: ".78rem" }}>{user.email}</div>
            </div>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              {stats.map(([v, l], i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1.6rem", color: "var(--gold)", fontWeight: 700 }}>{v}</div>
                  <div style={{ color: "rgba(255,255,255,.38)", fontSize: ".66rem", letterSpacing: ".08em", textTransform: "uppercase" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "-2.5rem auto 0", padding: "0 5% 5rem", position: "relative", zIndex: 1 }}>

        {/* Edit Profile */}
        <div style={cardS}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.2rem" }}>
            <User size={15} color="var(--gold)" />
            <span style={{ color: "var(--navy)", fontSize: ".88rem", fontWeight: 700 }}>Edit Profile</span>
          </div>
          {profileErr && (
            <div style={{ background: "rgba(248,113,113,.08)", border: "1px solid rgba(248,113,113,.3)", borderRadius: 5, padding: ".55rem 1rem", marginBottom: ".9rem", color: "#dc2626", fontSize: ".78rem", display: "flex", gap: 7, alignItems: "center" }}>
              <AlertCircle size={13} />{profileErr}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".9rem" }}>
            <div><div style={fLabel}>Full Name</div><input style={fInput} value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} /></div>
            <div><div style={fLabel}>Email Address</div><input style={fInput} type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} /></div>
          </div>
          <div style={{ marginTop: "1.1rem", display: "flex", alignItems: "center", gap: ".9rem" }}>
            <button className="btn-g" onClick={saveProfile} disabled={savingProfile} style={{ borderRadius: 5, padding: "9px 22px", fontSize: ".8rem" }}>
              {savingProfile ? "Saving…" : "Save Changes"}
            </button>
            {profileSaved && <span style={{ color: "#16a34a", fontSize: ".78rem", display: "flex", alignItems: "center", gap: 5 }}><CheckCircle size={14} />Saved!</span>}
          </div>
        </div>

        {/* Change Password */}
        <div style={cardS}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.2rem" }}>
            <Lock size={15} color="var(--gold)" />
            <span style={{ color: "var(--navy)", fontSize: ".88rem", fontWeight: 700 }}>Change Password</span>
          </div>
          {passErr && (
            <div style={{ background: "rgba(248,113,113,.08)", border: "1px solid rgba(248,113,113,.3)", borderRadius: 5, padding: ".55rem 1rem", marginBottom: ".9rem", color: "#dc2626", fontSize: ".78rem", display: "flex", gap: 7, alignItems: "center" }}>
              <AlertCircle size={13} />{passErr}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".9rem" }}>
            <div>
              <div style={fLabel}>Current Password</div>
              <div style={{ position: "relative" }}>
                <input style={{ ...fInput, paddingRight: 36 }} type={showCur ? "text" : "password"} value={passForm.current} onChange={e => setPassForm(p => ({ ...p, current: e.target.value }))} placeholder="•••••••" />
                <button onClick={() => setShowCur(!showCur)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--gray)", cursor: "pointer" }}>{showCur ? <EyeOff size={13} /> : <Eye size={13} />}</button>
              </div>
            </div>
            <div>
              <div style={fLabel}>New Password</div>
              <div style={{ position: "relative" }}>
                <input style={{ ...fInput, paddingRight: 36 }} type={showNxt ? "text" : "password"} value={passForm.next} onChange={e => setPassForm(p => ({ ...p, next: e.target.value }))} placeholder="Min. 8 chars" />
                <button onClick={() => setShowNxt(!showNxt)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--gray)", cursor: "pointer" }}>{showNxt ? <EyeOff size={13} /> : <Eye size={13} />}</button>
              </div>
            </div>
            <div>
              <div style={fLabel}>Confirm New Password</div>
              <input style={fInput} type="password" value={passForm.confirm} onChange={e => setPassForm(p => ({ ...p, confirm: e.target.value }))} placeholder="Repeat password" />
            </div>
          </div>
          <div style={{ marginTop: "1.1rem", display: "flex", alignItems: "center", gap: ".9rem" }}>
            <button className="btn-g" onClick={savePass} disabled={savingPass} style={{ borderRadius: 5, padding: "9px 22px", fontSize: ".8rem" }}>
              {savingPass ? "Updating…" : "Update Password"}
            </button>
            {passSaved && <span style={{ color: "#16a34a", fontSize: ".78rem", display: "flex", alignItems: "center", gap: 5 }}><CheckCircle size={14} />Password updated!</span>}
          </div>
        </div>

        {/* Saved Properties placeholder */}
        <div style={cardS}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.2rem" }}>
            <Star size={15} color="var(--gold)" />
            <span style={{ color: "var(--navy)", fontSize: ".88rem", fontWeight: 700 }}>Saved Properties</span>
          </div>
          <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--gray)" }}>
            <Star size={32} style={{ opacity: .18, marginBottom: ".75rem" }} />
            <p style={{ fontSize: ".84rem" }}>No saved properties yet.</p>
            <button className="btn-o" onClick={() => navigate("/properties")} style={{ marginTop: ".9rem", borderRadius: 4, padding: "7px 18px", fontSize: ".78rem" }}>Browse Properties</button>
          </div>
        </div>

        {/* Account Info */}
        <div style={{ ...cardS, background: "linear-gradient(135deg,var(--navy),var(--navy2))", border: "1px solid rgba(201,168,76,.18)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.2rem" }}>
            <ShieldCheck size={15} color="var(--gold)" />
            <span style={{ color: "#fff", fontSize: ".88rem", fontWeight: 700 }}>Account Information</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: ".9rem" }}>
            {[
              ["Account Type", user.role === "ADMIN" ? "Administrator" : "Standard Member"],
              ["Account Status", "Active"],
              ["Email Verified", "Yes"],
            ].map(([l, v]) => (
              <div key={l} style={{ background: "rgba(255,255,255,.04)", borderRadius: 6, padding: ".9rem 1rem", border: "1px solid rgba(201,168,76,.1)" }}>
                <div style={{ color: "rgba(255,255,255,.36)", fontSize: ".62rem", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 3 }}>{l}</div>
                <div style={{ color: v === "Active" || v === "Yes" ? "#34d399" : "rgba(255,255,255,.8)", fontSize: ".82rem", fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}