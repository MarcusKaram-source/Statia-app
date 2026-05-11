import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3, Building2, Users, Settings, Bell, Eye, EyeOff, Edit, Trash2, Plus,
  LogOut, ShieldCheck, AlertCircle, CheckCircle, Lock, User, X
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { apiFetch } from "../api";
import LoadingSpinner from "../components/LoadingSpinner";

/* ── Modal helpers ─────────────────────────────────────────── */
const MODAL_OVERLAY = { position: "fixed", inset: 0, background: "rgba(0,0,0,.72)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" };
const MODAL_BOX = { background: "#0a1628", border: "1px solid rgba(201,168,76,.2)", borderRadius: 10, padding: "2rem", width: "min(540px,95vw)", maxHeight: "90vh", overflowY: "auto", position: "relative" };
const MI = { width: "100%", padding: "10px 13px", borderRadius: 5, background: "rgba(255,255,255,.05)", border: "1px solid rgba(201,168,76,.18)", color: "#fff", fontSize: ".84rem", fontFamily: "var(--sans)", outline: "none", boxSizing: "border-box", marginBottom: ".9rem" };
const ML = { fontSize: ".62rem", color: "rgba(255,255,255,.38)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 };

function AddLeadModal({ onClose, onAdd, projects }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", projectId: projects[0]?.id || "", message: "" });
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const submit = () => {
    if (!f.name || !f.email) return;
    onAdd({ name: f.name, email: f.email, phone: f.phone, projectId: f.projectId || undefined, message: f.message });
    onClose();
  };
  return (
    <div style={MODAL_OVERLAY} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={MODAL_BOX}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "rgba(255,255,255,.35)", cursor: "pointer" }}><X size={16} /></button>
        <div style={{ fontFamily: "var(--serif)", color: "#fff", fontSize: "1.4rem", fontWeight: 300, marginBottom: ".3rem" }}>Add New Lead</div>
        <div style={{ height: 1, background: "linear-gradient(90deg,var(--gold),transparent)", marginBottom: "1.4rem" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 .9rem" }}>
          <div><div style={ML}>Full Name *</div><input style={MI} value={f.name} onChange={set("name")} placeholder="Ahmed Al-Rashid" /></div>
          <div><div style={ML}>Email *</div><input style={MI} type="email" value={f.email} onChange={set("email")} placeholder="client@email.com" /></div>
          <div><div style={ML}>Phone</div><input style={MI} value={f.phone} onChange={set("phone")} placeholder="+20 100 000 0000" /></div>
          <div><div style={ML}>Project</div>
            <select style={{ ...MI, cursor: "pointer", appearance: "none" }} value={f.projectId} onChange={set("projectId")}>
              <option value="">— No project —</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
        <div style={ML}>Message</div>
        <textarea style={{ ...MI, height: 80, resize: "vertical" }} value={f.message} onChange={set("message")} placeholder="Client's enquiry..." />
        <div style={{ display: "flex", gap: ".75rem", marginTop: ".5rem" }}>
          <button className="btn-g" onClick={submit} style={{ flex: 1, borderRadius: 5, padding: "11px", fontSize: ".84rem" }}>Add Lead</button>
          <button className="btn-o" onClick={onClose} style={{ borderRadius: 5, padding: "11px 18px", fontSize: ".84rem" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function AddPropertyModal({ onClose, onAdd }) {
  const [f, setF] = useState({ name: "", nameAr: "", location: "", type: "Apartment", status: "Under Construction", priceEGP: "", priceSAR: "", priceAED: "", rooms: 2, baths: 1, area: "", badge: "New Launch", description: "", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80" });
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const submit = () => {
    if (!f.name || !f.priceEGP) return;
    onAdd({ ...f, priceEGP: +f.priceEGP, priceSAR: +f.priceSAR || null, priceAED: +f.priceAED || null, rooms: +f.rooms, baths: +f.baths, area: +f.area || 0, amenities: ["Gym", "Parking"] });
    onClose();
  };
  const SI = { fontSize: ".84rem", ...MI, cursor: "pointer", appearance: "none" };
  return (
    <div style={MODAL_OVERLAY} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={MODAL_BOX}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "rgba(255,255,255,.35)", cursor: "pointer" }}><X size={16} /></button>
        <div style={{ fontFamily: "var(--serif)", color: "#fff", fontSize: "1.4rem", fontWeight: 300, marginBottom: ".3rem" }}>Add New Property</div>
        <div style={{ height: 1, background: "linear-gradient(90deg,var(--gold),transparent)", marginBottom: "1.4rem" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 .9rem" }}>
          <div><div style={ML}>Property Name (EN) *</div><input style={MI} value={f.name} onChange={set("name")} placeholder="Azure Crown Residences" /></div>
          <div><div style={ML}>Property Name (AR)</div><input style={MI} value={f.nameAr} onChange={set("nameAr")} placeholder="أبراج العزيز" /></div>
          <div><div style={ML}>Location</div><input style={MI} value={f.location} onChange={set("location")} placeholder="New Cairo, Egypt" /></div>
          <div><div style={ML}>Type</div><select style={SI} value={f.type} onChange={set("type")}>{["Apartment", "Villa", "Chalet", "Penthouse"].map(t => <option key={t}>{t}</option>)}</select></div>
          <div><div style={ML}>Status</div><select style={SI} value={f.status} onChange={set("status")}>{["Under Construction", "Ready to Move"].map(s => <option key={s}>{s}</option>)}</select></div>
          <div><div style={ML}>Badge</div><select style={SI} value={f.badge} onChange={set("badge")}>{["New Launch", "Exclusive", "Sea View", "Prime Location", "Hot Deal", "Garden Villa"].map(b => <option key={b}>{b}</option>)}</select></div>
          <div><div style={ML}>Price EGP *</div><input style={MI} type="number" value={f.priceEGP} onChange={set("priceEGP")} placeholder="4500000" /></div>
          <div><div style={ML}>Price SAR</div><input style={MI} type="number" value={f.priceSAR} onChange={set("priceSAR")} placeholder="285000" /></div>
          <div><div style={ML}>Price AED</div><input style={MI} type="number" value={f.priceAED} onChange={set("priceAED")} placeholder="360000" /></div>
          <div><div style={ML}>Area (sqm)</div><input style={MI} type="number" value={f.area} onChange={set("area")} placeholder="180" /></div>
          <div><div style={ML}>Bedrooms</div><input style={MI} type="number" min="1" value={f.rooms} onChange={set("rooms")} /></div>
          <div><div style={ML}>Bathrooms</div><input style={MI} type="number" min="1" value={f.baths} onChange={set("baths")} /></div>
        </div>
        <div style={ML}>Description</div>
        <textarea style={{ ...MI, height: 72, resize: "vertical" }} value={f.description} onChange={set("description")} placeholder="Property description..." />
        <div style={{ display: "flex", gap: ".75rem", marginTop: ".5rem" }}>
          <button className="btn-g" onClick={submit} style={{ flex: 1, borderRadius: 5, padding: "11px", fontSize: ".84rem" }}>Add Property</button>
          <button className="btn-o" onClick={onClose} style={{ borderRadius: 5, padding: "11px 18px", fontSize: ".84rem" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function EditPropertyModal({ property, onClose, onSave }) {
  const [f, setF] = useState({ name: property.name || "", nameAr: property.nameAr || "", location: property.location || "", type: property.type || "Apartment", status: property.status || "Under Construction", priceEGP: property.priceEGP || "", priceSAR: property.priceSAR || "", priceAED: property.priceAED || "", rooms: property.rooms || 2, baths: property.baths || 1, area: property.area || "", badge: property.badge || "New Launch", description: property.description || "", img: property.img || "" });
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const submit = () => {
    if (!f.name || !f.priceEGP) return;
    onSave(property.id, { ...f, priceEGP: +f.priceEGP, priceSAR: +f.priceSAR || null, priceAED: +f.priceAED || null, rooms: +f.rooms, baths: +f.baths, area: +f.area || 0 });
    onClose();
  };
  const SI = { fontSize: ".84rem", ...MI, cursor: "pointer", appearance: "none" };
  return (
    <div style={MODAL_OVERLAY} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={MODAL_BOX}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "rgba(255,255,255,.35)", cursor: "pointer" }}><X size={16} /></button>
        <div style={{ fontFamily: "var(--serif)", color: "#fff", fontSize: "1.4rem", fontWeight: 300, marginBottom: ".3rem" }}>Edit Property</div>
        <div style={{ height: 1, background: "linear-gradient(90deg,var(--gold),transparent)", marginBottom: "1.4rem" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 .9rem" }}>
          <div><div style={ML}>Property Name (EN) *</div><input style={MI} value={f.name} onChange={set("name")} /></div>
          <div><div style={ML}>Property Name (AR)</div><input style={MI} value={f.nameAr} onChange={set("nameAr")} /></div>
          <div><div style={ML}>Location</div><input style={MI} value={f.location} onChange={set("location")} /></div>
          <div><div style={ML}>Type</div><select style={SI} value={f.type} onChange={set("type")}>{["Apartment", "Villa", "Chalet", "Penthouse"].map(t => <option key={t}>{t}</option>)}</select></div>
          <div><div style={ML}>Status</div><select style={SI} value={f.status} onChange={set("status")}>{["Under Construction", "Ready to Move"].map(s => <option key={s}>{s}</option>)}</select></div>
          <div><div style={ML}>Badge</div><select style={SI} value={f.badge} onChange={set("badge")}>{["New Launch", "Exclusive", "Sea View", "Prime Location", "Hot Deal", "Garden Villa"].map(b => <option key={b}>{b}</option>)}</select></div>
          <div><div style={ML}>Price EGP *</div><input style={MI} type="number" value={f.priceEGP} onChange={set("priceEGP")} /></div>
          <div><div style={ML}>Price SAR</div><input style={MI} type="number" value={f.priceSAR} onChange={set("priceSAR")} /></div>
          <div><div style={ML}>Price AED</div><input style={MI} type="number" value={f.priceAED} onChange={set("priceAED")} /></div>
          <div><div style={ML}>Area (sqm)</div><input style={MI} type="number" value={f.area} onChange={set("area")} /></div>
          <div><div style={ML}>Bedrooms</div><input style={MI} type="number" min="1" value={f.rooms} onChange={set("rooms")} /></div>
          <div><div style={ML}>Bathrooms</div><input style={MI} type="number" min="1" value={f.baths} onChange={set("baths")} /></div>
        </div>
        <div style={ML}>Description</div>
        <textarea style={{ ...MI, height: 72, resize: "vertical" }} value={f.description} onChange={set("description")} />
        <div style={{ display: "flex", gap: ".75rem", marginTop: ".5rem" }}>
          <button className="btn-g" onClick={submit} style={{ flex: 1, borderRadius: 5, padding: "11px", fontSize: ".84rem" }}>Save Changes</button>
          <button className="btn-o" onClick={onClose} style={{ borderRadius: 5, padding: "11px 18px", fontSize: ".84rem" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ name, type, onConfirm, onClose }) {
  return (
    <div style={MODAL_OVERLAY} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...MODAL_BOX, width: "min(400px,95vw)", padding: "1.8rem" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "rgba(255,255,255,.35)", cursor: "pointer" }}><X size={16} /></button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(248,113,113,.12)", border: "1px solid rgba(248,113,113,.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Trash2 size={16} color="#f87171" />
          </div>
          <div style={{ fontFamily: "var(--serif)", color: "#fff", fontSize: "1.2rem", fontWeight: 300 }}>Confirm Delete</div>
        </div>
        <div style={{ height: 1, background: "linear-gradient(90deg,rgba(248,113,113,.4),transparent)", marginBottom: "1.2rem" }} />
        <p style={{ color: "rgba(255,255,255,.55)", fontSize: ".84rem", lineHeight: 1.6, marginBottom: "1.4rem" }}>
          Are you sure you want to delete the {type} <strong style={{ color: "#fff" }}>{name}</strong>? This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: ".75rem" }}>
          <button onClick={onConfirm} style={{ flex: 1, background: "rgba(248,113,113,.15)", border: "1px solid rgba(248,113,113,.4)", borderRadius: 5, padding: "10px", color: "#f87171", fontSize: ".84rem", cursor: "pointer", fontFamily: "var(--sans)", fontWeight: 600 }}>Delete</button>
          <button className="btn-o" onClick={onClose} style={{ borderRadius: 5, padding: "10px 18px", fontSize: ".84rem" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ── Admin Settings ─────────────────────────────────────────── */
function AdminSettings({ user }) {
  const [profile, setProfile] = useState({ name: user.name, email: user.email, phone: "+20 100 000 0000", title: "Super Administrator", department: "Management", location: "New Cairo, Egypt" });
  const [passForm, setPassForm] = useState({ current: "", next: "", confirm: "" });
  const [showCur, setShowCur] = useState(false);
  const [showNxt, setShowNxt] = useState(false);
  const [notifs, setNotifs] = useState({ newLead: true, propertyUpdate: true, weeklyReport: true, systemAlert: false, marketing: false });
  const { setUser } = useAppContext();
  const [saved, setSaved] = useState("");
  const [passErr, setPassErr] = useState("");
  const [profileErr, setProfileErr] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  const cardS = { background: "#060f1e", border: "1px solid rgba(201,168,76,.12)", borderRadius: 8, padding: "1.6rem", marginBottom: "1.3rem" };
  const secHead = { color: "rgba(255,255,255,.85)", fontSize: ".88rem", fontWeight: 700, marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: 8 };
  const row2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".9rem" };
  const fLabel = { fontSize: ".62rem", color: "rgba(255,255,255,.38)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 5 };
  const fInput = { width: "100%", padding: "10px 13px", borderRadius: 5, background: "rgba(255,255,255,.05)", border: "1px solid rgba(201,168,76,.18)", color: "#fff", fontSize: ".84rem", fontFamily: "var(--sans)", outline: "none", boxSizing: "border-box" };
  const fGroup = (label, val, key, type = "text") => (
    <div>
      <div style={fLabel}>{label}</div>
      <input style={fInput} type={type} value={val} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} />
    </div>
  );

  const saveProfile = async () => {
    setProfileErr("");
    if (!profile.name || !profile.email) { setProfileErr("Name and email are required."); return; }
    setSavingProfile(true);
    try {
      const updated = await apiFetch('/api/auth/profile', { method: 'PATCH', body: { name: profile.name, email: profile.email } });
      setUser(updated);
      setSaved("profile");
      setTimeout(() => setSaved(""), 2200);
    } catch (e) {
      setProfileErr(e.message || "Failed to save.");
    } finally {
      setSavingProfile(false);
    }
  };
  const savePass = async () => {
    setPassErr("");
    if (!passForm.current) { setPassErr("Enter current password."); return; }
    if (passForm.next.length < 8) { setPassErr("New password must be at least 8 characters."); return; }
    if (passForm.next !== passForm.confirm) { setPassErr("Passwords do not match."); return; }
    setSavingPass(true);
    try {
      await apiFetch('/api/auth/password', { method: 'PATCH', body: { currentPassword: passForm.current, newPassword: passForm.next } });
      setSaved("pass");
      setPassForm({ current: "", next: "", confirm: "" });
      setTimeout(() => setSaved(""), 2200);
    } catch (e) {
      setPassErr(e.message || "Failed to update password.");
    } finally {
      setSavingPass(false);
    }
  };

  const Toggle = ({ on, fn }) => (
    <div onClick={fn} style={{ width: 38, height: 20, borderRadius: 10, background: on ? "var(--gold)" : "rgba(255,255,255,.1)", cursor: "pointer", position: "relative", transition: "background .25s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: on ? 19 : 3, width: 14, height: 14, borderRadius: "50%", background: on ? "var(--navy)" : "rgba(255,255,255,.5)", transition: "left .25s" }} />
    </div>
  );


  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <div style={{ background: "linear-gradient(135deg,#0f2044,#0a1628)", border: "1px solid rgba(201,168,76,.18)", borderRadius: 10, padding: "2rem", marginBottom: "1.3rem", display: "flex", alignItems: "center", gap: "1.6rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", border: "1px solid rgba(201,168,76,.08)", pointerEvents: "none" }} />
        <div style={{ width: 76, height: 76, borderRadius: "50%", background: "linear-gradient(135deg,var(--gold),var(--gold2))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--navy)", fontWeight: 800, fontSize: "1.9rem", flexShrink: 0, boxShadow: "0 0 0 4px rgba(201,168,76,.2)" }}>{profile.name[0]}</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontFamily: "var(--serif)", fontSize: "1.5rem", fontWeight: 400 }}>{profile.name}</div>
          <div style={{ color: "var(--gold)", fontSize: ".68rem", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: ".3rem" }}>⬡ {profile.title}</div>
          <div style={{ color: "rgba(255,255,255,.36)", fontSize: ".76rem" }}>{profile.email} · {profile.department} · {profile.location}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ background: "rgba(52,211,153,.12)", border: "1px solid rgba(52,211,153,.25)", borderRadius: 20, padding: "4px 12px", color: "#34d399", fontSize: ".68rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399" }} /> Active
          </div>
          <div style={{ color: "rgba(255,255,255,.24)", fontSize: ".68rem", marginTop: ".4rem" }}>Since Jan 2025</div>
        </div>
      </div>

      <div style={cardS}>
        <div style={secHead}><User size={15} color="var(--gold)" />Profile Information</div>
        <div style={row2}>
          {fGroup("Full Name", profile.name, "name")}
          {fGroup("Job Title", profile.title, "title")}
          {fGroup("Email Address", profile.email, "email", "email")}
          {fGroup("Phone Number", profile.phone, "phone", "tel")}
          {fGroup("Department", profile.department, "department")}
          {fGroup("Location", profile.location, "location")}
        </div>
        {profileErr && <div style={{ background: "rgba(248,113,113,.1)", border: "1px solid rgba(248,113,113,.3)", borderRadius: 5, padding: ".6rem 1rem", marginBottom: ".9rem", color: "#f87171", fontSize: ".78rem", display: "flex", gap: 7, alignItems: "center" }}><AlertCircle size={13} />{profileErr}</div>}
        <div style={{ marginTop: "1.1rem", display: "flex", alignItems: "center", gap: ".9rem" }}>
          <button className="btn-g" onClick={saveProfile} disabled={savingProfile} style={{ borderRadius: 5, padding: "9px 22px", fontSize: ".8rem" }}>{savingProfile ? "Saving…" : "Save Changes"}</button>
          {saved === "profile" && <span style={{ color: "#34d399", fontSize: ".78rem", display: "flex", alignItems: "center", gap: 5 }}><CheckCircle size={14} />Saved!</span>}
        </div>
      </div>

      <div style={cardS}>
        <div style={secHead}><Lock size={15} color="var(--gold)" />Change Password</div>
        {passErr && <div style={{ background: "rgba(248,113,113,.1)", border: "1px solid rgba(248,113,113,.3)", borderRadius: 5, padding: ".6rem 1rem", marginBottom: ".9rem", color: "#f87171", fontSize: ".78rem", display: "flex", gap: 7, alignItems: "center" }}><AlertCircle size={13} />{passErr}</div>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".9rem" }}>
          <div>
            <div style={fLabel}>Current Password</div>
            <div style={{ position: "relative" }}>
              <input style={fInput} type={showCur ? "text" : "password"} value={passForm.current} onChange={e => setPassForm(p => ({ ...p, current: e.target.value }))} placeholder="••••••••" />
              <button onClick={() => setShowCur(!showCur)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,.35)", cursor: "pointer" }}>{showCur ? <EyeOff size={13} /> : <Eye size={13} />}</button>
            </div>
          </div>
          <div>
            <div style={fLabel}>New Password</div>
            <div style={{ position: "relative" }}>
              <input style={fInput} type={showNxt ? "text" : "password"} value={passForm.next} onChange={e => setPassForm(p => ({ ...p, next: e.target.value }))} placeholder="Min. 8 characters" />
              <button onClick={() => setShowNxt(!showNxt)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,.35)", cursor: "pointer" }}>{showNxt ? <EyeOff size={13} /> : <Eye size={13} />}</button>
            </div>
          </div>
          <div>
            <div style={fLabel}>Confirm New Password</div>
            <input style={fInput} type="password" value={passForm.confirm} onChange={e => setPassForm(p => ({ ...p, confirm: e.target.value }))} placeholder="Repeat password" />
          </div>
        </div>
        <div style={{ marginTop: "1.1rem", display: "flex", alignItems: "center", gap: ".9rem" }}>
          <button className="btn-g" onClick={savePass} disabled={savingPass} style={{ borderRadius: 5, padding: "9px 22px", fontSize: ".8rem" }}>{savingPass ? "Updating…" : "Update Password"}</button>
          {saved === "pass" && <span style={{ color: "#34d399", fontSize: ".78rem", display: "flex", alignItems: "center", gap: 5 }}><CheckCircle size={14} />Password updated!</span>}
        </div>
      </div>

      <div style={cardS}>
        <div style={secHead}><Bell size={15} color="var(--gold)" />Notification Preferences</div>
        <div style={{ display: "flex", flexDirection: "column", gap: ".9rem" }}>
          {[
            { k: "newLead", label: "New Lead Submitted", desc: "Get notified when a visitor submits an enquiry" },
            { k: "propertyUpdate", label: "Property Status Update", desc: "Alerts when a listing status changes" },
            { k: "weeklyReport", label: "Weekly Performance Report", desc: "Summary of traffic and leads every Monday" },
            { k: "systemAlert", label: "System Alerts", desc: "Server and uptime notifications" },
            { k: "marketing", label: "Marketing Updates", desc: "Campaign performance and A/B test results" },
          ].map(({ k, label, desc }) => (
            <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".75rem 1rem", background: "rgba(255,255,255,.03)", borderRadius: 6, border: "1px solid rgba(255,255,255,.05)" }}>
              <div>
                <div style={{ color: "rgba(255,255,255,.82)", fontSize: ".82rem", fontWeight: 500 }}>{label}</div>
                <div style={{ color: "rgba(255,255,255,.32)", fontSize: ".7rem", marginTop: 2 }}>{desc}</div>
              </div>
              <Toggle on={notifs[k]} fn={() => setNotifs(n => ({ ...n, [k]: !n[k] }))} />
            </div>
          ))}
        </div>
      </div>

      <div style={cardS}>
        <div style={secHead}><ShieldCheck size={15} color="var(--gold)" />Active Session</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: ".85rem 1rem", background: "rgba(255,255,255,.03)", borderRadius: 6, border: "1px solid rgba(201,168,76,.2)" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(201,168,76,.12)", border: "1px solid rgba(201,168,76,.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <User size={15} color="var(--gold)" />
          </div>
          <div>
            <div style={{ color: "#fff", fontSize: ".8rem", fontWeight: 600 }}>
              {user?.name}
              <span style={{ background: "rgba(201,168,76,.15)", color: "var(--gold)", fontSize: ".6rem", padding: "1px 7px", borderRadius: 10, marginLeft: 8 }}>This device</span>
            </div>
            <div style={{ color: "rgba(255,255,255,.3)", fontSize: ".7rem" }}>{user?.email} · Active now</div>
          </div>
        </div>
      </div>

      <div style={{ ...cardS, borderColor: "rgba(248,113,113,.2)" }}>
        <div style={{ color: "#f87171", fontSize: ".88rem", fontWeight: 700, marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: 8 }}><AlertCircle size={15} color="#f87171" />Danger Zone</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".9rem 1rem", background: "rgba(248,113,113,.04)", borderRadius: 6, border: "1px solid rgba(248,113,113,.12)" }}>
          <div>
            <div style={{ color: "rgba(255,255,255,.75)", fontSize: ".82rem", fontWeight: 500 }}>Reset All Settings</div>
            <div style={{ color: "rgba(255,255,255,.3)", fontSize: ".7rem", marginTop: 2 }}>Restore notification and profile settings to defaults.</div>
          </div>
          <button style={{ background: "rgba(248,113,113,.1)", border: "1px solid rgba(248,113,113,.35)", borderRadius: 4, padding: "7px 14px", color: "#f87171", fontSize: ".76rem", cursor: "pointer", fontFamily: "var(--sans)" }}>Reset</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Admin Dashboard ────────────────────────────────────── */
export default function AdminDashboard() {
  const { user, logout, setToast } = useAppContext();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [leads, setLeads] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState(null);
  const [editingProp, setEditingProp] = useState(null);
  const [confirmState, setConfirmState] = useState(null);
  const LEAD_LIMIT = 20;
  const [leadPage, setLeadPage] = useState(1);
  const [leadTotalPages, setLeadTotalPages] = useState(1);
  const [leadTotal, setLeadTotal] = useState(0);

  const fetchLeads = async (page = 1) => {
    const data = await apiFetch(`/api/leads?page=${page}&limit=${LEAD_LIMIT}`);
    setLeads(data.leads);
    setLeadPage(data.page);
    setLeadTotalPages(data.totalPages);
    setLeadTotal(data.total);
  };

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/login");
      return;
    }
    Promise.all([apiFetch(`/api/leads?page=1&limit=${LEAD_LIMIT}`), apiFetch('/api/properties')])
      .then(([leadsData, propsData]) => {
        setLeads(leadsData.leads);
        setLeadPage(leadsData.page);
        setLeadTotalPages(leadsData.totalPages);
        setLeadTotal(leadsData.total);
        setProjects(propsData.properties || []);
      })
      .catch(e => setToast({ msg: e.message || "Failed to load data.", type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  const nav = [["overview", <BarChart3 size={16} />, "Overview"], ["properties", <Building2 size={16} />, "Properties"], ["leads", <Users size={16} />, "Leads"], ["settings", <Settings size={16} />, "Settings"]];
  const metrics = [[<Building2 size={21} />, projects.length * 140 + "", "Total Units", "+12%", "#c9a84c"], [<BarChart3 size={21} />, projects.length, "Active Projects", "+3", "#60a5fa"], [<Users size={21} />, leadTotal, "Leads", "+28%", "#34d399"], [<Eye size={21} />, "18.5k", "Views", "+45%", "#f87171"]];
  const sC = { NEW: "rgba(52,211,153,.14)|#34d399", CONTACTED: "rgba(245,158,11,.14)|#fbbf24", CLOSED: "rgba(107,114,128,.14)|#9ca3af" };

  const addLead = async (formData) => {
    try {
      await apiFetch('/api/leads', { method: 'POST', body: formData });
      await fetchLeads(1);
      setToast({ msg: "Lead added successfully.", type: "success" });
    } catch (e) {
      setToast({ msg: e.message || "Failed to add lead.", type: "error" });
    }
  };

  const deleteLead = async (id) => {
    try {
      await apiFetch('/api/leads/' + id, { method: 'DELETE' });
      const nextPage = leads.length === 1 && leadPage > 1 ? leadPage - 1 : leadPage;
      await fetchLeads(nextPage);
      setToast({ msg: "Lead deleted.", type: "success" });
    } catch (e) {
      setToast({ msg: e.message || "Failed to delete lead.", type: "error" });
    }
  };

  const addProp = async (formData) => {
    try {
      const property = await apiFetch('/api/properties', { method: 'POST', body: formData });
      setProjects(prev => [property, ...prev]);
      setToast({ msg: "Property added successfully.", type: "success" });
    } catch (e) {
      setToast({ msg: e.message || "Failed to add property.", type: "error" });
    }
  };

  const deleteProp = async (id) => {
    try {
      await apiFetch('/api/properties/' + id, { method: 'DELETE' });
      setProjects(prev => prev.filter(p => p.id !== id));
      setToast({ msg: "Property deleted.", type: "success" });
    } catch (e) {
      setToast({ msg: e.message || "Failed to delete property.", type: "error" });
    }
  };

  const editProp = async (id, formData) => {
    try {
      const updated = await apiFetch('/api/properties/' + id, { method: 'PATCH', body: formData });
      setProjects(prev => prev.map(p => p.id === id ? updated : p));
      setToast({ msg: "Property updated.", type: "success" });
    } catch (e) {
      setToast({ msg: e.message || "Failed to update property.", type: "error" });
    }
  };

  const STATUS_CYCLE = { NEW: 'CONTACTED', CONTACTED: 'CLOSED', CLOSED: 'NEW' };
  const updateLeadStatus = async (id, currentStatus) => {
    const next = STATUS_CYCLE[currentStatus] || 'CONTACTED';
    try {
      const updated = await apiFetch('/api/leads/' + id, { method: 'PATCH', body: { status: next } });
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: updated.status } : l));
    } catch (e) {
      setToast({ msg: e.message || "Failed to update lead status.", type: "error" });
    }
  };

  const requestDelete = (type, id, name) => setConfirmState({ type, id, name });
  const handleConfirmDelete = async () => {
    const { type, id } = confirmState;
    setConfirmState(null);
    if (type === 'lead') await deleteLead(id);
    else await deleteProp(id);
  };

  function TH({ cols }) {
    return <thead><tr style={{ borderBottom: "1px solid rgba(201,168,76,.08)" }}>{cols.map(c => <th key={c} style={{ padding: ".75rem 1.1rem", textAlign: "left", fontSize: ".62rem", color: "rgba(255,255,255,.26)", fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase" }}>{c}</th>)}</tr></thead>;
  }
  function TB({ title, btn, onAdd, children }) {
    return (
      <div style={{ background: "#060f1e", border: "1px solid rgba(201,168,76,.1)", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ padding: "1.3rem 1.6rem", borderBottom: "1px solid rgba(201,168,76,.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ color: "#fff", fontSize: ".92rem", fontWeight: 600 }}>{title}</h2>
          <button className="btn-g" onClick={onAdd} style={{ borderRadius: 4, padding: "6px 14px", fontSize: ".72rem", display: "flex", alignItems: "center", gap: 5 }}><Plus size={12} />{btn}</button>
        </div>
        {children}
      </div>
    );
  }
  function ABs({ onEdit, onDelete }) {
    return (
      <div style={{ display: "flex", gap: 5 }}>
        {[[Edit, onEdit, false], [Eye, undefined, false], [Trash2, onDelete, true]].map(([Ic, fn, red], i) => (
          <button key={i} onClick={fn} style={{ background: "none", border: "1px solid rgba(255,255,255,.1)", borderRadius: 4, padding: 4, cursor: fn ? "pointer" : "default", color: red ? "#f87171" : "rgba(255,255,255,.32)", transition: "all .2s" }} onMouseEnter={fn ? e => { e.currentTarget.style.borderColor = red ? "#f87171" : "var(--gold)"; e.currentTarget.style.color = red ? "#f87171" : "var(--gold)"; } : undefined} onMouseLeave={fn ? e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.1)"; e.currentTarget.style.color = red ? "#f87171" : "rgba(255,255,255,.32)"; } : undefined}>
            <Ic size={12} />
          </button>
        ))}
      </div>
    );
  }

  const LeadRow = ({ l }) => {
    const status = l.status || 'NEW';
    const [sbg, sc] = (sC[status] || sC.NEW).split("|");
    return (
      <tr className="tr" style={{ borderBottom: "1px solid rgba(255,255,255,.04)" }}>
        <td style={{ padding: ".9rem 1.1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 29, height: 29, borderRadius: "50%", background: "linear-gradient(135deg,#0f2044,#152c5a)", border: "1px solid rgba(201,168,76,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", fontSize: ".74rem", fontWeight: 700, flexShrink: 0 }}>{l.name[0]}</div>
            <div><div style={{ color: "#fff", fontSize: ".8rem", fontWeight: 500 }}>{l.name}</div><div style={{ color: "rgba(255,255,255,.26)", fontSize: ".66rem" }}>{l.email}</div></div>
          </div>
        </td>
        <td style={{ padding: ".9rem 1.1rem", color: "rgba(255,255,255,.52)", fontSize: ".78rem" }}>{l.phone || '—'}</td>
        <td style={{ padding: ".9rem 1.1rem" }}><span style={{ background: "rgba(201,168,76,.1)", color: "var(--gold)", borderRadius: 4, padding: "2px 8px", fontSize: ".7rem" }}>{l.project?.name || '—'}</span></td>
        <td style={{ padding: ".9rem 1.1rem", color: "rgba(255,255,255,.42)", fontSize: ".76rem", maxWidth: 170 }}><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{l.message || '—'}</span></td>
        <td style={{ padding: ".9rem 1.1rem", color: "rgba(255,255,255,.32)", fontSize: ".76rem" }}>{new Date(l.createdAt).toLocaleDateString('en-GB')}</td>
        <td style={{ padding: ".9rem 1.1rem" }}>
          <span onClick={() => updateLeadStatus(l.id, status)} title="Click to advance status" style={{ background: sbg, color: sc, padding: "2px 8px", borderRadius: 4, fontSize: ".66rem", fontWeight: 600, cursor: "pointer", userSelect: "none" }}>{status}</span>
        </td>
        <td style={{ padding: ".9rem 1.1rem" }}><ABs onDelete={() => requestDelete('lead', l.id, l.name)} /></td>
      </tr>
    );
  };

  const modalEl = addModal === "lead"
    ? <AddLeadModal onClose={() => setAddModal(null)} onAdd={addLead} projects={projects} />
    : addModal === "property"
      ? <AddPropertyModal onClose={() => setAddModal(null)} onAdd={addProp} />
      : null;

  if (!user || user.role !== "ADMIN") return null;

  const Spinner = () => (
    <div style={{ padding: "4rem", display: "flex", justifyContent: "center" }}>
      <LoadingSpinner size={32} />
    </div>
  );

  const Pagination = () => leadTotalPages > 1 ? (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, padding: "1rem 1.1rem", borderTop: "1px solid rgba(201,168,76,.07)" }}>
      <button disabled={leadPage === 1} onClick={() => fetchLeads(leadPage - 1)} style={{ background: "none", border: "1px solid rgba(201,168,76,.2)", borderRadius: 4, padding: "5px 12px", color: leadPage === 1 ? "rgba(255,255,255,.2)" : "var(--gold)", fontSize: ".72rem", cursor: leadPage === 1 ? "default" : "pointer", fontFamily: "var(--sans)" }}>← Prev</button>
      <span style={{ color: "rgba(255,255,255,.38)", fontSize: ".74rem" }}>Page {leadPage} of {leadTotalPages}</span>
      <button disabled={leadPage === leadTotalPages} onClick={() => fetchLeads(leadPage + 1)} style={{ background: "none", border: "1px solid rgba(201,168,76,.2)", borderRadius: 4, padding: "5px 12px", color: leadPage === leadTotalPages ? "rgba(255,255,255,.2)" : "var(--gold)", fontSize: ".72rem", cursor: leadPage === leadTotalPages ? "default" : "pointer", fontFamily: "var(--sans)" }}>Next →</button>
    </div>
  ) : null;

  return (
    <>
      {modalEl}
      {editingProp && <EditPropertyModal property={editingProp} onClose={() => setEditingProp(null)} onSave={editProp} />}
      {confirmState && <ConfirmModal name={confirmState.name} type={confirmState.type} onConfirm={handleConfirmDelete} onClose={() => setConfirmState(null)} />}
      <div style={{ display: "flex", minHeight: "100vh", background: "#08111f", fontFamily: "var(--sans)", flexDirection: "row" }} className="admin-layout">
        <aside style={{ width: 244, background: "#060f1e", borderRight: "1px solid rgba(201,168,76,.1)", display: "flex", flexDirection: "column", flexShrink: 0 }} className="admin-sidebar">
          <div style={{ padding: "1.6rem 1.4rem", borderBottom: "1px solid rgba(201,168,76,.1)" }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: "1.7rem", color: "#fff", fontStyle: "italic", fontWeight: 300 }}>Statia</div>
            <div style={{ fontSize: ".54rem", color: "var(--gold)", letterSpacing: ".26em", textTransform: "uppercase" }}>Admin Portal</div>
          </div>
          <nav style={{ flex: 1, padding: "1.1rem 0" }}>
            {nav.map(([id, ic, lbl]) => (
              <button key={id} onClick={() => setTab(id)} className={`ai${tab === id ? " act" : ""}`} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 1.4rem", fontSize: ".83rem", textAlign: "left" }}>{ic}{lbl}</button>
            ))}
          </nav>
          <div style={{ padding: "1rem 1.4rem", borderTop: "1px solid rgba(201,168,76,.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: "1rem", padding: ".75rem", background: "rgba(201,168,76,.05)", borderRadius: 6, border: "1px solid rgba(201,168,76,.1)" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,var(--gold),var(--gold2))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--navy)", fontWeight: 700, fontSize: ".78rem" }}>{user.name[0]}</div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ color: "#fff", fontSize: ".78rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
                <div style={{ color: "var(--gold)", fontSize: ".62rem", letterSpacing: ".08em" }}>⬡ ADMIN</div>
              </div>
            </div>
            <button onClick={() => { logout(); navigate("/"); }} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "rgba(255,255,255,.28)", cursor: "pointer", fontSize: ".8rem", fontFamily: "var(--sans)", transition: "color .2s", padding: "5px 0", width: "100%" }} onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.28)"}><LogOut size={14} />Sign Out</button>
          </div>
        </aside>

        <main style={{ flex: 1, overflow: "auto" }}>
          <div style={{ background: "#060f1e", borderBottom: "1px solid rgba(201,168,76,.07)", padding: "1.1rem 1.75rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 600, marginBottom: 2 }}>{nav.find(n => n[0] === tab)?.[2]}</h1>
              <p style={{ color: "rgba(255,255,255,.26)", fontSize: ".7rem" }}>{new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: ".9rem" }}>
              <div style={{ position: "relative", width: 32, height: 32, borderRadius: "50%", background: "rgba(201,168,76,.1)", border: "1px solid rgba(201,168,76,.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Bell size={13} color="var(--gold)" />
                <div style={{ position: "absolute", top: -1, right: -1, width: 7, height: 7, background: "#ef4444", borderRadius: "50%", border: "2px solid #060f1e" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,var(--gold),var(--gold2))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--navy)", fontWeight: 700, fontSize: ".78rem" }}>{user.name[0]}</div>
                <div><div style={{ color: "#fff", fontSize: ".78rem", fontWeight: 600 }}>{user.name}</div><div style={{ color: "rgba(255,255,255,.26)", fontSize: ".66rem" }}>Super Admin</div></div>
              </div>
            </div>
          </div>

          <div style={{ padding: "1.6rem 1.75rem" }}>
            {tab === "overview" && (
              <>
                <div className="admin-metrics">
                  {metrics.map(([ic, val, lbl, chg, col], i) => (
                    <div key={i} className="mc" style={{ padding: "1.5rem" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: ".9rem" }}>
                        <div style={{ width: 42, height: 42, borderRadius: 8, background: `${col}18`, border: `1px solid ${col}28`, display: "flex", alignItems: "center", justifyContent: "center", color: col }}>{ic}</div>
                        <span style={{ background: "rgba(52,211,153,.12)", color: "#34d399", borderRadius: 4, padding: "2px 7px", fontSize: ".67rem", fontWeight: 600 }}>{chg}</span>
                      </div>
                      <div style={{ fontFamily: "var(--serif)", fontSize: "1.85rem", color: "#fff", fontWeight: 700, marginBottom: 2 }}>{val}</div>
                      <div style={{ fontSize: ".7rem", color: "rgba(255,255,255,.32)", textTransform: "uppercase", letterSpacing: ".08em" }}>{lbl}</div>
                    </div>
                  ))}
                </div>
                <TB title="Recent Leads" btn="Add Lead" onAdd={() => setAddModal("lead")}>
                  {loading ? <Spinner /> : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <TH cols={["Name", "Phone", "Project", "Message", "Date", "Status", "Actions"]} />
                      <tbody>{leads.slice(0, 5).map(l => <LeadRow key={l.id} l={l} />)}</tbody>
                    </table>
                  )}
                </TB>
              </>
            )}

            {tab === "properties" && (
              <TB title="Properties" btn="Add Property" onAdd={() => setAddModal("property")}>
                {loading ? <Spinner /> : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <TH cols={["Project", "Type", "Location", "Price (EGP)", "Status", "Actions"]} />
                    <tbody>
                      {projects.map(p => (
                        <tr key={p.id} className="tr" style={{ borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                          <td style={{ padding: ".85rem 1.1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <img src={p.img || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80'} alt="" style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 4, border: "1px solid rgba(201,168,76,.2)", flexShrink: 0 }} />
                              <span style={{ color: "#fff", fontSize: ".8rem", fontWeight: 500 }}>{p.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: ".85rem 1.1rem", color: "rgba(255,255,255,.46)", fontSize: ".78rem" }}>{p.type}</td>
                          <td style={{ padding: ".85rem 1.1rem", color: "rgba(255,255,255,.46)", fontSize: ".78rem" }}>{p.location}</td>
                          <td style={{ padding: ".85rem 1.1rem", color: "var(--gold)", fontSize: ".8rem", fontWeight: 600 }}>{p.priceEGP.toLocaleString()}</td>
                          <td style={{ padding: ".85rem 1.1rem" }}><span style={{ background: p.status === "Ready to Move" ? "rgba(52,211,153,.12)" : "rgba(251,191,36,.12)", color: p.status === "Ready to Move" ? "#34d399" : "#fbbf24", padding: "2px 8px", borderRadius: 4, fontSize: ".66rem", fontWeight: 600 }}>{p.status}</span></td>
                          <td style={{ padding: ".85rem 1.1rem" }}><ABs onEdit={() => setEditingProp(p)} onDelete={() => requestDelete('property', p.id, p.name)} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </TB>
            )}

            {tab === "leads" && (
              <TB title="All Leads" btn="Add Lead" onAdd={() => setAddModal("lead")}>
                {loading ? <Spinner /> : (
                  <>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <TH cols={["Name", "Phone", "Project", "Message", "Date", "Status", "Actions"]} />
                      <tbody>{leads.map(l => <LeadRow key={l.id} l={l} />)}</tbody>
                    </table>
                    <Pagination />
                  </>
                )}
              </TB>
            )}

            {tab === "settings" && <AdminSettings user={user} />}
          </div>
        </main>
      </div>
    </>
  );
}
