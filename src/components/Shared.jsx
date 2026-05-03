import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, ShieldCheck } from "lucide-react";

export function Lbl({ children, light }) {
  return (
    <div style={{ fontSize: ".64rem", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: light ? "rgba(255,255,255,.4)" : "var(--gray)", marginBottom: 6 }}>
      {children}
    </div>
  );
}

export function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  const colors = { success: "#34d399", error: "#f87171", info: "var(--gold)" };
  const icons = { success: <CheckCircle size={16} />, error: <AlertCircle size={16} />, info: <ShieldCheck size={16} /> };
  return (
    <div className="slideUp" style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9999, background: "rgba(10,22,40,.97)", border: `1px solid ${colors[type]}40`, borderRadius: 8, padding: ".9rem 1.25rem", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 12px 40px rgba(0,0,0,.4)", minWidth: 260 }}>
      <span style={{ color: colors[type] }}>{icons[type]}</span>
      <span style={{ color: "#fff", fontSize: ".84rem" }}>{msg}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,.35)", cursor: "pointer", marginLeft: "auto" }}><X size={13} /></button>
    </div>
  );
}