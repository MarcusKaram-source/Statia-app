import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3, Building2, Users, Settings, Bell, Eye, EyeOff, Edit, Trash2, Plus,
  LogOut, ShieldCheck, AlertCircle, CheckCircle, Lock, User, X, FolderOpen, Search
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
  const [activeTab, setActiveTab] = useState("details");
  const [f, setF] = useState({
    name: "", priceEGP: "", location: "", projectName: "", developerName: "",
    locationLink: "", type: "Apartment", status: "Available", deliveryYear: "",
    area: "", rooms: "", baths: "", floorLevel: "",
    maintenanceDeposit: "", paymentMethod: "Cash", downPayment: "",
    installmentValue: "", paymentFrequency: "Quarterly", installmentDuration: "",
    description: "",
  });
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [photos, setPhotos] = useState([]);
  const [saving, setSaving] = useState(false);

  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const addNote = () => {
    if (!noteInput.trim()) return;
    setNotes(p => [...p, noteInput.trim()]);
    setNoteInput("");
  };

  const handlePhotoUpload = e => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setPhotos(p => [...p, ev.target.result]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const submit = async () => {
    if (!f.name || !f.priceEGP) return;
    setSaving(true);
    await onAdd({
      name: f.name, nameAr: "", location: f.location,
      projectName: f.projectName || undefined,
      developerName: f.developerName || undefined,
      locationLink: f.locationLink || undefined,
      type: f.type, status: f.status,
      deliveryYear: f.deliveryYear ? parseInt(f.deliveryYear) : undefined,
      priceEGP: parseFloat(f.priceEGP),
      rooms: parseInt(f.rooms) || 0,
      baths: parseInt(f.baths) || 0,
      area: parseFloat(f.area) || 0,
      floorLevel: f.floorLevel || undefined,
      maintenanceDeposit: f.maintenanceDeposit ? parseFloat(f.maintenanceDeposit) : undefined,
      paymentMethod: f.paymentMethod || undefined,
      downPayment: f.downPayment ? parseFloat(f.downPayment) : undefined,
      installmentValue: f.installmentValue ? parseFloat(f.installmentValue) : undefined,
      paymentFrequency: f.paymentFrequency || undefined,
      installmentDuration: f.installmentDuration ? parseInt(f.installmentDuration) : undefined,
      description: f.description || undefined,
      notes, photos, amenities: [],
    });
    setSaving(false);
    onClose();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear + i);
  const SI = { ...MI, cursor: "pointer", appearance: "none", marginBottom: 0 };
  const TABS = ["Details", "Notes", "Photos"];

  return (
    <div style={MODAL_OVERLAY} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...MODAL_BOX, width: "min(720px,96vw)", padding: 0, display: "flex", flexDirection: "column" }}>
        {/* Header + tabs */}
        <div style={{ padding: "1.4rem 1.8rem 0", borderBottom: "1px solid rgba(201,168,76,.12)", flexShrink: 0 }}>
          <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "rgba(255,255,255,.35)", cursor: "pointer" }}><X size={16} /></button>
          <div style={{ fontFamily: "var(--serif)", color: "#fff", fontSize: "1.35rem", fontWeight: 300, marginBottom: "1rem" }}>Add New Property</div>
          <div style={{ display: "flex" }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setActiveTab(t.toLowerCase())} style={{
                background: "none", border: "none", borderBottom: activeTab === t.toLowerCase() ? "2px solid var(--gold)" : "2px solid transparent",
                padding: "8px 22px", fontSize: ".84rem", cursor: "pointer", fontFamily: "var(--sans)",
                color: activeTab === t.toLowerCase() ? "var(--gold)" : "rgba(255,255,255,.42)", transition: "color .18s",
              }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ padding: "1.4rem 1.8rem", overflowY: "auto", flex: 1, maxHeight: "62vh" }}>

          {activeTab === "details" && (
            <>
              {/* Row 1 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem 1rem", marginBottom: ".75rem" }}>
                <div>
                  <div style={ML}>Title *</div>
                  <input style={MI} value={f.name} onChange={set("name")} placeholder="e.g. Luxury Villa" />
                </div>
                <div>
                  <div style={ML}>Price (EGP) *</div>
                  <input style={MI} type="number" value={f.priceEGP} onChange={set("priceEGP")} />
                </div>
                <div>
                  <div style={ML}>Location</div>
                  <input style={MI} value={f.location} onChange={set("location")} placeholder="Address / Area" />
                </div>
                <div>
                  <div style={ML}>Project Name <span style={{ color: "rgba(255,255,255,.32)", fontSize: ".75em", textTransform: "none", letterSpacing: 0 }}>(Optional)</span></div>
                  <input style={MI} value={f.projectName} onChange={set("projectName")} placeholder="e.g. Mivida" />
                </div>
                <div>
                  <div style={ML}>Developer Name <span style={{ color: "rgba(255,255,255,.32)", fontSize: ".75em", textTransform: "none", letterSpacing: 0 }}>(Optional)</span></div>
                  <input style={MI} value={f.developerName} onChange={set("developerName")} placeholder="e.g. Emaar" />
                </div>
                <div>
                  <div style={ML}>Location Link (Google Maps)</div>
                  <input style={MI} value={f.locationLink} onChange={set("locationLink")} placeholder="https://maps.google.com/..." />
                </div>
              </div>
              {/* Row 2: Type / Status / Delivery Year */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".75rem 1rem", marginBottom: ".75rem" }}>
                <div>
                  <div style={ML}>Type</div>
                  <select style={SI} value={f.type} onChange={set("type")}>
                    {["Apartment", "Villa", "Chalet", "Penthouse", "Duplex", "Studio"].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <div style={ML}>Status</div>
                  <select style={SI} value={f.status} onChange={set("status")}>
                    {["Available", "Under Construction", "Ready to Move", "Sold", "Reserved"].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <div style={ML}>Delivery Date (Year)</div>
                  <select style={SI} value={f.deliveryYear} onChange={set("deliveryYear")}>
                    <option value="">All Years</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              {/* Row 3: Area / Bedrooms / Bathrooms / Floor */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: ".75rem 1rem", marginBottom: ".5rem" }}>
                <div>
                  <div style={ML}>Area (m²)</div>
                  <input style={MI} type="number" value={f.area} onChange={set("area")} />
                </div>
                <div>
                  <div style={ML}>Bedrooms</div>
                  <input style={MI} type="number" value={f.rooms} onChange={set("rooms")} />
                </div>
                <div>
                  <div style={ML}>Bathrooms</div>
                  <input style={MI} type="number" value={f.baths} onChange={set("baths")} />
                </div>
                <div>
                  <div style={ML}>Floor Level</div>
                  <input style={MI} value={f.floorLevel} onChange={set("floorLevel")} />
                </div>
              </div>

              {/* Financial Details */}
              <div style={{ color: "var(--gold)", fontSize: ".9rem", fontWeight: 600, marginBottom: ".85rem", marginTop: ".4rem" }}>Financial Details</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem 1rem", marginBottom: ".75rem" }}>
                <div>
                  <div style={ML}>Maintenance Deposit</div>
                  <input style={MI} type="number" value={f.maintenanceDeposit} onChange={set("maintenanceDeposit")} placeholder="Amount" />
                </div>
                <div>
                  <div style={ML}>Payment Method</div>
                  <select style={SI} value={f.paymentMethod} onChange={set("paymentMethod")}>
                    {["Cash", "Installment", "Bank Loan"].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              {f.paymentMethod === "Installment" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem 1rem", marginBottom: ".75rem" }}>
                  <div>
                    <div style={ML}>Down Payment</div>
                    <input style={MI} type="number" value={f.downPayment} onChange={set("downPayment")} />
                  </div>
                  <div>
                    <div style={ML}>Installment Value</div>
                    <input style={MI} type="number" value={f.installmentValue} onChange={set("installmentValue")} />
                  </div>
                  <div>
                    <div style={ML}>Payment Frequency</div>
                    <select style={SI} value={f.paymentFrequency} onChange={set("paymentFrequency")}>
                      {["Monthly", "Quarterly", "Semi-Annual", "Annual"].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={ML}>Duration (Years)</div>
                    <input style={MI} type="number" value={f.installmentDuration} onChange={set("installmentDuration")} />
                  </div>
                </div>
              )}

              <div style={ML}>Description</div>
              <textarea style={{ ...MI, height: 90, resize: "vertical" }} value={f.description} onChange={set("description")} />
            </>
          )}

          {activeTab === "notes" && (
            <>
              <div style={{ display: "flex", gap: ".75rem", marginBottom: "1.2rem" }}>
                <input
                  style={{ ...MI, flex: 1, marginBottom: 0 }}
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  placeholder="Add a new note..."
                  onKeyDown={e => e.key === "Enter" && addNote()}
                />
                <button onClick={addNote} style={{ background: "var(--gold)", border: "none", borderRadius: 5, padding: "10px 18px", color: "var(--navy)", fontSize: ".84rem", fontWeight: 700, cursor: "pointer", fontFamily: "var(--sans)", flexShrink: 0 }}>Add Note</button>
              </div>
              {notes.length === 0 ? (
                <div style={{ textAlign: "center", color: "rgba(255,255,255,.28)", fontSize: ".84rem", padding: "3.5rem 0" }}>No notes added yet.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
                  {notes.map((note, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: ".75rem", background: "rgba(255,255,255,.04)", border: "1px solid rgba(201,168,76,.12)", borderRadius: 6, padding: ".75rem 1rem" }}>
                      <div style={{ flex: 1, color: "rgba(255,255,255,.75)", fontSize: ".83rem", lineHeight: 1.5 }}>{note}</div>
                      <button onClick={() => setNotes(p => p.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", color: "rgba(255,255,255,.25)", cursor: "pointer", padding: 2, flexShrink: 0 }}><X size={13} /></button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "photos" && (
            <>
              <label style={{ display: "block", border: "2px dashed rgba(201,168,76,.3)", borderRadius: 8, padding: "2.5rem 2rem", textAlign: "center", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,168,76,.6)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(201,168,76,.3)"}>
                <input type="file" accept="image/jpeg,image/png" multiple onChange={handlePhotoUpload} style={{ display: "none" }} />
                <div style={{ fontSize: "2rem", marginBottom: ".5rem" }}>📷</div>
                <div style={{ color: "var(--gold)", fontSize: ".9rem", marginBottom: ".3rem" }}>Click to upload photos</div>
                <div style={{ color: "rgba(255,255,255,.35)", fontSize: ".75rem" }}>Supported: JPG, PNG</div>
              </label>
              {photos.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: ".75rem", marginTop: "1rem" }}>
                  {photos.map((src, i) => (
                    <div key={i} style={{ position: "relative", borderRadius: 6, overflow: "hidden", aspectRatio: "1" }}>
                      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button onClick={() => setPhotos(p => p.filter((_, idx) => idx !== i))} style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,.7)", border: "none", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}><X size={11} /></button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "1rem 1.8rem", borderTop: "1px solid rgba(201,168,76,.1)", display: "flex", justifyContent: "flex-end", gap: ".75rem", flexShrink: 0 }}>
          <button className="btn-o" onClick={onClose} style={{ borderRadius: 5, padding: "10px 22px", fontSize: ".84rem" }}>Cancel</button>
          <button className="btn-g" onClick={submit} disabled={saving || !f.name || !f.priceEGP} style={{ borderRadius: 5, padding: "10px 26px", fontSize: ".84rem", opacity: (!f.name || !f.priceEGP) ? .5 : 1 }}>
            {saving ? "Saving…" : "Save"}
          </button>
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

/* ── Shared constants ───────────────────────────────────────── */
const LEAD_STATUS_STYLES = {
  NEW: ["rgba(52,211,153,.14)", "#34d399"],
  CONTACTED: ["rgba(245,158,11,.14)", "#fbbf24"],
  CLOSED: ["rgba(107,114,128,.14)", "#9ca3af"],
};

/* ── Lead Modals ─────────────────────────────────────────────── */
function ViewLeadModal({ lead, onClose, onEdit }) {
  const [sbg, sc] = LEAD_STATUS_STYLES[lead.status] || LEAD_STATUS_STYLES.NEW;
  return (
    <div style={MODAL_OVERLAY} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...MODAL_BOX, width: "min(480px,95vw)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "rgba(255,255,255,.35)", cursor: "pointer" }}><X size={16} /></button>
        <div style={{ fontFamily: "var(--serif)", color: "#fff", fontSize: "1.4rem", fontWeight: 300, marginBottom: ".3rem" }}>Lead Details</div>
        <div style={{ height: 1, background: "linear-gradient(90deg,var(--gold),transparent)", marginBottom: "1.4rem" }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem", padding: "1rem", background: "rgba(255,255,255,.03)", border: "1px solid rgba(201,168,76,.1)", borderRadius: 8 }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg,#0f2044,#152c5a)", border: "1px solid rgba(201,168,76,.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", fontWeight: 700, fontSize: "1.1rem", flexShrink: 0 }}>{lead.name[0]}</div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ color: "#fff", fontSize: ".9rem", fontWeight: 600 }}>{lead.name}</div>
            <div style={{ color: "rgba(255,255,255,.38)", fontSize: ".72rem", marginTop: 2 }}>{lead.email}</div>
          </div>
          <span style={{ background: sbg, color: sc, padding: "3px 10px", borderRadius: 4, fontSize: ".68rem", fontWeight: 600, flexShrink: 0 }}>{lead.status}</span>
        </div>

        {/* Fields grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".9rem", marginBottom: "1rem" }}>
          {[
            ["Phone", lead.phone || "—"],
            ["Project", lead.project?.name || "—"],
            ["Date Submitted", new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })],
            ["Status", lead.status],
          ].map(([label, value]) => (
            <div key={label}>
              <div style={ML}>{label}</div>
              <div style={{ color: label === "Project" ? "var(--gold)" : "#fff", fontSize: ".82rem", paddingTop: 2 }}>{value}</div>
            </div>
          ))}
        </div>

        {lead.message && (
          <>
            <div style={ML}>Message</div>
            <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(201,168,76,.1)", borderRadius: 6, padding: ".85rem 1rem", color: "rgba(255,255,255,.65)", fontSize: ".82rem", lineHeight: 1.65, marginBottom: "1rem" }}>{lead.message}</div>
          </>
        )}

        <div style={{ display: "flex", gap: ".75rem", marginTop: ".5rem" }}>
          <button className="btn-g" onClick={onEdit} style={{ flex: 1, borderRadius: 5, padding: "10px", fontSize: ".84rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Edit size={13} />Edit Lead
          </button>
          <button className="btn-o" onClick={onClose} style={{ borderRadius: 5, padding: "10px 18px", fontSize: ".84rem" }}>Close</button>
        </div>
      </div>
    </div>
  );
}

function EditLeadModal({ lead, onClose, onSave, projects }) {
  const [f, setF] = useState({
    name: lead.name || "", email: lead.email || "", phone: lead.phone || "",
    message: lead.message || "", projectId: lead.projectId || "", status: lead.status || "NEW",
  });
  const [saving, setSaving] = useState(false);
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const SI = { ...MI, cursor: "pointer", appearance: "none", marginBottom: 0 };

  const submit = async () => {
    if (!f.name || !f.email) return;
    setSaving(true);
    await onSave(lead.id, {
      name: f.name.trim(), email: f.email.trim(),
      phone: f.phone || undefined, message: f.message || undefined,
      projectId: f.projectId || undefined, status: f.status,
    });
    setSaving(false);
    onClose();
  };

  return (
    <div style={MODAL_OVERLAY} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...MODAL_BOX, width: "min(540px,96vw)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "rgba(255,255,255,.35)", cursor: "pointer" }}><X size={16} /></button>
        <div style={{ fontFamily: "var(--serif)", color: "#fff", fontSize: "1.4rem", fontWeight: 300, marginBottom: ".3rem" }}>Edit Lead</div>
        <div style={{ height: 1, background: "linear-gradient(90deg,var(--gold),transparent)", marginBottom: "1.4rem" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem 1rem" }}>
          <div>
            <div style={ML}>Full Name *</div>
            <input style={MI} value={f.name} onChange={set("name")} placeholder="Full name" />
          </div>
          <div>
            <div style={ML}>Email *</div>
            <input style={MI} type="email" value={f.email} onChange={set("email")} placeholder="email@example.com" />
          </div>
          <div>
            <div style={ML}>Phone</div>
            <input style={MI} value={f.phone} onChange={set("phone")} placeholder="+20 100 000 0000" />
          </div>
          <div>
            <div style={ML}>Status</div>
            <select style={SI} value={f.status} onChange={set("status")}>
              {["NEW", "CONTACTED", "CLOSED"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <div style={ML}>Project</div>
            <select style={{ ...SI, width: "100%" }} value={f.projectId} onChange={set("projectId")}>
              <option value="">— No project —</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div style={ML}>Message</div>
        <textarea style={{ ...MI, height: 80, resize: "vertical" }} value={f.message} onChange={set("message")} placeholder="Client's enquiry..." />

        <div style={{ display: "flex", gap: ".75rem", marginTop: ".5rem" }}>
          <button className="btn-g" onClick={submit} disabled={saving || !f.name || !f.email} style={{ flex: 1, borderRadius: 5, padding: "11px", fontSize: ".84rem", opacity: (!f.name || !f.email) ? .5 : 1 }}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button className="btn-o" onClick={onClose} style={{ borderRadius: 5, padding: "11px 18px", fontSize: ".84rem" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ── Project Modals ─────────────────────────────────────────── */
const PROJ_TYPES = ["Apartment", "Villa", "Chalet", "Penthouse", "Duplex", "Studio"];
const PROJ_STATUSES = ["Available", "Under Construction", "Ready to Move", "Sold", "Reserved"];

function AddProjectModal({ onClose, onAdd }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear + i);
  const [f, setF] = useState({ name: "", developerName: "", location: "", type: "Apartment", status: "Available", deliveryYear: "", priceEGP: "", img: "", description: "" });
  const [saving, setSaving] = useState(false);
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const SI = { ...MI, cursor: "pointer", appearance: "none", marginBottom: 0 };

  const submit = async () => {
    if (!f.name || !f.priceEGP) return;
    setSaving(true);
    await onAdd({
      name: f.name, nameAr: "", location: f.location || "",
      developerName: f.developerName || undefined,
      type: f.type, status: f.status,
      deliveryYear: f.deliveryYear ? parseInt(f.deliveryYear) : undefined,
      priceEGP: parseFloat(f.priceEGP),
      img: f.img || undefined,
      description: f.description || undefined,
      rooms: 0, baths: 0, area: 0, notes: [], photos: [], amenities: [],
    });
    setSaving(false);
    onClose();
  };

  return (
    <div style={MODAL_OVERLAY} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...MODAL_BOX, width: "min(600px,96vw)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "rgba(255,255,255,.35)", cursor: "pointer" }}><X size={16} /></button>
        <div style={{ fontFamily: "var(--serif)", color: "#fff", fontSize: "1.4rem", fontWeight: 300, marginBottom: ".3rem" }}>Add New Project</div>
        <div style={{ height: 1, background: "linear-gradient(90deg,var(--gold),transparent)", marginBottom: "1.4rem" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem 1rem" }}>
          <div>
            <div style={ML}>Project Name *</div>
            <input style={MI} value={f.name} onChange={set("name")} placeholder="e.g. Azure Crown Residences" />
          </div>
          <div>
            <div style={ML}>Developer Name</div>
            <input style={MI} value={f.developerName} onChange={set("developerName")} placeholder="e.g. Emaar" />
          </div>
          <div>
            <div style={ML}>Location</div>
            <input style={MI} value={f.location} onChange={set("location")} placeholder="Address / Area" />
          </div>
          <div>
            <div style={ML}>Price (EGP) *</div>
            <input style={MI} type="number" value={f.priceEGP} onChange={set("priceEGP")} placeholder="0" />
          </div>
          <div>
            <div style={ML}>Type</div>
            <select style={SI} value={f.type} onChange={set("type")}>
              {PROJ_TYPES.map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <div style={ML}>Status</div>
            <select style={SI} value={f.status} onChange={set("status")}>
              {PROJ_STATUSES.map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <div style={ML}>Delivery Year</div>
            <select style={SI} value={f.deliveryYear} onChange={set("deliveryYear")}>
              <option value="">— Select Year —</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <div style={ML}>Cover Image URL</div>
            <input style={MI} value={f.img} onChange={set("img")} placeholder="https://..." />
          </div>
        </div>

        <div style={ML}>Description</div>
        <textarea style={{ ...MI, height: 80, resize: "vertical" }} value={f.description} onChange={set("description")} placeholder="Brief project overview..." />

        <div style={{ display: "flex", gap: ".75rem", marginTop: ".5rem" }}>
          <button className="btn-g" onClick={submit} disabled={saving || !f.name || !f.priceEGP} style={{ flex: 1, borderRadius: 5, padding: "11px", fontSize: ".84rem", opacity: (!f.name || !f.priceEGP) ? .5 : 1 }}>
            {saving ? "Saving…" : "Add Project"}
          </button>
          <button className="btn-o" onClick={onClose} style={{ borderRadius: 5, padding: "11px 18px", fontSize: ".84rem" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function EditProjectModal({ project, onClose, onSave }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear + i);
  const [f, setF] = useState({
    name: project.name || "", developerName: project.developerName || "",
    location: project.location || "", type: project.type || "Apartment",
    status: project.status || "Available",
    deliveryYear: project.deliveryYear ? String(project.deliveryYear) : "",
    priceEGP: project.priceEGP || "", img: project.img || "",
    description: project.description || "",
  });
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const SI = { ...MI, cursor: "pointer", appearance: "none", marginBottom: 0 };

  const submit = () => {
    if (!f.name || !f.priceEGP) return;
    onSave(project.id, {
      name: f.name, developerName: f.developerName || undefined,
      location: f.location, type: f.type, status: f.status,
      deliveryYear: f.deliveryYear ? parseInt(f.deliveryYear) : null,
      priceEGP: parseFloat(f.priceEGP),
      img: f.img || undefined,
      description: f.description || undefined,
    });
    onClose();
  };

  return (
    <div style={MODAL_OVERLAY} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...MODAL_BOX, width: "min(600px,96vw)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "rgba(255,255,255,.35)", cursor: "pointer" }}><X size={16} /></button>
        <div style={{ fontFamily: "var(--serif)", color: "#fff", fontSize: "1.4rem", fontWeight: 300, marginBottom: ".3rem" }}>Edit Project</div>
        <div style={{ height: 1, background: "linear-gradient(90deg,var(--gold),transparent)", marginBottom: "1.4rem" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem 1rem" }}>
          <div>
            <div style={ML}>Project Name *</div>
            <input style={MI} value={f.name} onChange={set("name")} />
          </div>
          <div>
            <div style={ML}>Developer Name</div>
            <input style={MI} value={f.developerName} onChange={set("developerName")} />
          </div>
          <div>
            <div style={ML}>Location</div>
            <input style={MI} value={f.location} onChange={set("location")} />
          </div>
          <div>
            <div style={ML}>Price (EGP) *</div>
            <input style={MI} type="number" value={f.priceEGP} onChange={set("priceEGP")} />
          </div>
          <div>
            <div style={ML}>Type</div>
            <select style={SI} value={f.type} onChange={set("type")}>
              {PROJ_TYPES.map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <div style={ML}>Status</div>
            <select style={SI} value={f.status} onChange={set("status")}>
              {PROJ_STATUSES.map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <div style={ML}>Delivery Year</div>
            <select style={SI} value={f.deliveryYear} onChange={set("deliveryYear")}>
              <option value="">— Select Year —</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <div style={ML}>Cover Image URL</div>
            <input style={MI} value={f.img} onChange={set("img")} placeholder="https://..." />
          </div>
        </div>

        <div style={ML}>Description</div>
        <textarea style={{ ...MI, height: 80, resize: "vertical" }} value={f.description} onChange={set("description")} />

        <div style={{ display: "flex", gap: ".75rem", marginTop: ".5rem" }}>
          <button className="btn-g" onClick={submit} disabled={!f.name || !f.priceEGP} style={{ flex: 1, borderRadius: 5, padding: "11px", fontSize: ".84rem", opacity: (!f.name || !f.priceEGP) ? .5 : 1 }}>
            Save Changes
          </button>
          <button className="btn-o" onClick={onClose} style={{ borderRadius: 5, padding: "11px 18px", fontSize: ".84rem" }}>Cancel</button>
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
  const [editingProject, setEditingProject] = useState(null);
  const [editingLead, setEditingLead] = useState(null);
  const [viewingLead, setViewingLead] = useState(null);
  const [confirmState, setConfirmState] = useState(null);
  const [projSearch, setProjSearch] = useState("");
  const [projType, setProjType] = useState("all");
  const [projStatus, setProjStatus] = useState("all");
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

  const nav = [["overview", <BarChart3 size={16} />, "Overview"], ["properties", <Building2 size={16} />, "Properties"], ["projects", <FolderOpen size={16} />, "Projects"], ["leads", <Users size={16} />, "Leads"], ["settings", <Settings size={16} />, "Settings"]];
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

  const editLeadFull = async (id, data) => {
    try {
      const updated = await apiFetch('/api/leads/' + id, { method: 'PATCH', body: data });
      setLeads(prev => prev.map(l => l.id === id ? updated : l));
      setToast({ msg: "Lead updated.", type: "success" });
    } catch (e) {
      setToast({ msg: e.message || "Failed to update lead.", type: "error" });
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
  function ABs({ onEdit, onView, onDelete }) {
    return (
      <div style={{ display: "flex", gap: 5 }}>
        {[[Edit, onEdit, false], [Eye, onView, false], [Trash2, onDelete, true]].map(([Ic, fn, red], i) => (
          <button key={i} onClick={fn} style={{ background: "none", border: "1px solid rgba(255,255,255,.1)", borderRadius: 4, padding: 4, cursor: fn ? "pointer" : "default", color: red ? "#f87171" : "rgba(255,255,255,.32)", transition: "all .2s" }} onMouseEnter={fn ? e => { e.currentTarget.style.borderColor = red ? "#f87171" : "var(--gold)"; e.currentTarget.style.color = red ? "#f87171" : "var(--gold)"; } : undefined} onMouseLeave={fn ? e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.1)"; e.currentTarget.style.color = red ? "#f87171" : "rgba(255,255,255,.32)"; } : undefined}>
            <Ic size={12} />
          </button>
        ))}
      </div>
    );
  }

  const LeadRow = ({ l, onEdit, onView }) => {
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
        <td style={{ padding: ".9rem 1.1rem" }}><ABs onEdit={onEdit} onView={onView} onDelete={() => requestDelete('lead', l.id, l.name)} /></td>
      </tr>
    );
  };

  const modalEl = addModal === "lead"
    ? <AddLeadModal onClose={() => setAddModal(null)} onAdd={addLead} projects={projects} />
    : addModal === "property"
      ? <AddPropertyModal onClose={() => setAddModal(null)} onAdd={addProp} />
      : addModal === "project"
        ? <AddProjectModal onClose={() => setAddModal(null)} onAdd={addProp} />
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
      {editingProject && <EditProjectModal project={editingProject} onClose={() => setEditingProject(null)} onSave={editProp} />}
      {viewingLead && <ViewLeadModal lead={viewingLead} onClose={() => setViewingLead(null)} onEdit={() => { setEditingLead(viewingLead); setViewingLead(null); }} />}
      {editingLead && <EditLeadModal lead={editingLead} onClose={() => setEditingLead(null)} onSave={editLeadFull} projects={projects} />}
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
                      <tbody>{leads.slice(0, 5).map(l => <LeadRow key={l.id} l={l} onEdit={() => setEditingLead(l)} onView={() => setViewingLead(l)} />)}</tbody>
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
                          <td style={{ padding: ".85rem 1.1rem" }}><ABs onEdit={() => setEditingProp(p)} onView={() => window.open('/properties/' + p.id, '_blank')} onDelete={() => requestDelete('property', p.id, p.name)} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </TB>
            )}

            {tab === "projects" && (() => {
              const q = projSearch.toLowerCase();
              const filtered = projects.filter(p => {
                const matchSearch = !q || p.name.toLowerCase().includes(q) || (p.developerName || "").toLowerCase().includes(q) || (p.location || "").toLowerCase().includes(q);
                const matchType = projType === "all" || p.type === projType;
                const matchStatus = projStatus === "all" || p.status === projStatus;
                return matchSearch && matchType && matchStatus;
              });

              const projStatusColor = s => {
                if (s === "Available") return ["rgba(52,211,153,.12)", "#34d399"];
                if (s === "Under Construction") return ["rgba(251,191,36,.12)", "#fbbf24"];
                if (s === "Ready to Move") return ["rgba(96,165,250,.12)", "#60a5fa"];
                return ["rgba(107,114,128,.12)", "#9ca3af"];
              };

              return (
                <div>
                  {/* Toolbar */}
                  <div style={{ display: "flex", gap: ".75rem", marginBottom: "1.2rem", flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180 }}>
                      <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,.28)", pointerEvents: "none" }} />
                      <input
                        value={projSearch} onChange={e => setProjSearch(e.target.value)}
                        placeholder="Search by name, developer, location…"
                        style={{ ...MI, paddingLeft: 32, marginBottom: 0, width: "100%", boxSizing: "border-box" }}
                      />
                    </div>
                    <select value={projType} onChange={e => setProjType(e.target.value)} style={{ ...MI, marginBottom: 0, cursor: "pointer", appearance: "none", flex: "0 0 140px" }}>
                      <option value="all">All Types</option>
                      {PROJ_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select value={projStatus} onChange={e => setProjStatus(e.target.value)} style={{ ...MI, marginBottom: 0, cursor: "pointer", appearance: "none", flex: "0 0 170px" }}>
                      <option value="all">All Statuses</option>
                      {PROJ_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button className="btn-g" onClick={() => setAddModal("project")} style={{ borderRadius: 4, padding: "10px 16px", fontSize: ".78rem", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                      <Plus size={13} />Add Project
                    </button>
                  </div>

                  {/* Table */}
                  <div style={{ background: "#060f1e", border: "1px solid rgba(201,168,76,.1)", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ padding: "1.1rem 1.4rem", borderBottom: "1px solid rgba(201,168,76,.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <h2 style={{ color: "#fff", fontSize: ".92rem", fontWeight: 600 }}>
                        All Projects
                        <span style={{ marginLeft: 8, color: "rgba(255,255,255,.28)", fontSize: ".75rem", fontWeight: 400 }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
                      </h2>
                    </div>
                    {loading ? <Spinner /> : filtered.length === 0 ? (
                      <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
                        <FolderOpen size={36} color="rgba(201,168,76,.2)" style={{ marginBottom: "1rem" }} />
                        <div style={{ color: "rgba(255,255,255,.28)", fontSize: ".86rem" }}>
                          {projSearch || projType !== "all" || projStatus !== "all" ? "No projects match your filters." : "No projects yet. Click \"Add Project\" to create one."}
                        </div>
                      </div>
                    ) : (
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <TH cols={["Project", "Developer", "Location", "Type", "Delivery", "Price (EGP)", "Status", "Actions"]} />
                        <tbody>
                          {filtered.map(p => {
                            const [sbg, sc] = projStatusColor(p.status);
                            return (
                              <tr key={p.id} className="tr" style={{ borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                                <td style={{ padding: ".85rem 1.1rem" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                                    <img
                                      src={p.img || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80"}
                                      alt=""
                                      style={{ width: 38, height: 38, objectFit: "cover", borderRadius: 5, border: "1px solid rgba(201,168,76,.2)", flexShrink: 0 }}
                                    />
                                    <span style={{ color: "#fff", fontSize: ".8rem", fontWeight: 500 }}>{p.name}</span>
                                  </div>
                                </td>
                                <td style={{ padding: ".85rem 1.1rem", color: "rgba(255,255,255,.48)", fontSize: ".78rem" }}>{p.developerName || "—"}</td>
                                <td style={{ padding: ".85rem 1.1rem", color: "rgba(255,255,255,.48)", fontSize: ".78rem" }}>{p.location || "—"}</td>
                                <td style={{ padding: ".85rem 1.1rem", color: "rgba(255,255,255,.46)", fontSize: ".78rem" }}>{p.type}</td>
                                <td style={{ padding: ".85rem 1.1rem", color: "rgba(255,255,255,.38)", fontSize: ".78rem" }}>{p.deliveryYear || "—"}</td>
                                <td style={{ padding: ".85rem 1.1rem", color: "var(--gold)", fontSize: ".8rem", fontWeight: 600 }}>
                                  {p.priceEGP ? p.priceEGP.toLocaleString() : "—"}
                                </td>
                                <td style={{ padding: ".85rem 1.1rem" }}>
                                  <span style={{ background: sbg, color: sc, padding: "2px 8px", borderRadius: 4, fontSize: ".66rem", fontWeight: 600 }}>{p.status}</span>
                                </td>
                                <td style={{ padding: ".85rem 1.1rem" }}>
                                  <ABs onEdit={() => setEditingProject(p)} onView={() => window.open('/properties/' + p.id, '_blank')} onDelete={() => requestDelete("property", p.id, p.name)} />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              );
            })()}

            {tab === "leads" && (
              <TB title="All Leads" btn="Add Lead" onAdd={() => setAddModal("lead")}>
                {loading ? <Spinner /> : (
                  <>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <TH cols={["Name", "Phone", "Project", "Message", "Date", "Status", "Actions"]} />
                      <tbody>{leads.map(l => <LeadRow key={l.id} l={l} onEdit={() => setEditingLead(l)} onView={() => setViewingLead(l)} />)}</tbody>
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
