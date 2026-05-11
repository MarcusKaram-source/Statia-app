import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { MapPin, BedDouble, Bath, Square, Home, Star, MessageCircle, X } from "lucide-react";
import { Lbl } from "../components/Shared";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAppContext } from "../context/AppContext";
import { fmtPrice } from "../assets/data";
import { apiFetch } from "../api";

function BookingModal({ property, onClose }) {
  const [f, setF] = useState({ name: "", email: "", phone: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const iS = { width: "100%", padding: "11px 13px", borderRadius: 5, background: "rgba(255,255,255,.05)", border: "1px solid rgba(201,168,76,.18)", color: "#fff", fontSize: ".84rem", fontFamily: "var(--sans)", outline: "none", boxSizing: "border-box", marginBottom: ".9rem" };
  const lS = { fontSize: ".62rem", color: "rgba(255,255,255,.38)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 };

  const submit = async () => {
    if (!f.name || !f.email) return;
    setSending(true);
    try {
      await apiFetch('/api/leads', {
        method: 'POST',
        body: { name: f.name, email: f.email, phone: f.phone, projectId: property.id, message: `Viewing request for ${property.name}` },
      });
      setSent(true);
    } catch (e) { console.error(e); }
    finally { setSending(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.72)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#0a1628", border: "1px solid rgba(201,168,76,.2)", borderRadius: 10, padding: "2rem", width: "min(460px,95vw)", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "rgba(255,255,255,.35)", cursor: "pointer" }}><X size={16} /></button>
        {sent ? (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <div style={{ fontSize: "2rem", marginBottom: ".75rem" }}>✨</div>
            <h3 style={{ fontFamily: "var(--serif)", color: "var(--gold)", fontSize: "1.4rem", marginBottom: ".4rem" }}>Request Sent!</h3>
            <p style={{ color: "rgba(255,255,255,.42)", fontSize: ".84rem" }}>Our team will contact you within 24 hours to confirm your viewing.</p>
            <button className="btn-g" onClick={onClose} style={{ marginTop: "1.2rem", borderRadius: 4, padding: "9px 22px", fontSize: ".82rem" }}>Done</button>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: "var(--serif)", color: "#fff", fontSize: "1.4rem", fontWeight: 300, marginBottom: ".25rem" }}>Book a Viewing</div>
            <div style={{ color: "rgba(255,255,255,.3)", fontSize: ".76rem", marginBottom: "1.4rem" }}>{property.name}</div>
            <div style={{ height: 1, background: "linear-gradient(90deg,var(--gold),transparent)", marginBottom: "1.4rem" }} />
            <div style={lS}>Full Name *</div>
            <input style={iS} value={f.name} onChange={set("name")} placeholder="Your full name" />
            <div style={lS}>Email Address *</div>
            <input style={{ ...iS }} type="email" value={f.email} onChange={set("email")} placeholder="your@email.com" />
            <div style={lS}>Phone Number</div>
            <input style={iS} type="tel" value={f.phone} onChange={set("phone")} placeholder="+20 100 000 0000" />
            <button className="btn-g" onClick={submit} disabled={sending} style={{ width: "100%", borderRadius: 4, padding: 12, fontSize: ".84rem", marginTop: ".4rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {sending
                ? <LoadingSpinner size={15} thickness={2} color="var(--navy)" trackColor="rgba(10,22,40,.3)" />
                : "Request Viewing"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function Detail() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { lang, cur } = useAppContext();

  const [p, setP] = useState(state?.property || null);
  const [loading, setLoading] = useState(!state?.property);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    if (!state?.property && id) {
      apiFetch('/api/properties/' + id)
        .then(data => { setP(data); setLoading(false); })
        .catch(() => navigate('/properties'));
    }
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: "100vh", paddingTop: 80, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cream)" }}>
      <LoadingSpinner size={40} trackColor="rgba(201,168,76,.2)" />
    </div>
  );

  if (!p) return null;

  const back = lang === "en" ? "← Back" : "→ العودة";
  const bp = lang === "en" ? "Starting Price" : "السعر يبدأ من";
  const bv = lang === "en" ? "Book a Viewing" : "احجز معاينة";
  const am = lang === "en" ? "Amenities" : "المرافق";

  return (
    <>
      {bookingOpen && <BookingModal property={p} onClose={() => setBookingOpen(false)} />}
      <div style={{ paddingTop: 80, background: "var(--cream)", minHeight: "100vh" }}>
        <div style={{ padding: "1.6rem 5%", maxWidth: 1400, margin: "0 auto" }}>
          <button onClick={() => navigate("/properties")} className="btn-o" style={{ borderRadius: 4, padding: "7px 17px", fontSize: ".76rem", display: "flex", alignItems: "center", gap: 5 }}>{back}</button>
        </div>
        <div style={{ padding: "0 5% 5rem", maxWidth: 1400, margin: "0 auto" }} className="dt-grid">
          <div>
            <div style={{ borderRadius: 8, overflow: "hidden", marginBottom: ".7rem", paddingTop: "62%", position: "relative" }}>
              <img src={p.img || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80'} alt={p.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: ".6rem" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ borderRadius: 4, overflow: "hidden", paddingTop: "62%", position: "relative", opacity: i === 0 ? 1 : .52, border: `2px solid ${i === 0 ? "var(--gold)" : "transparent"}`, cursor: "pointer" }}>
                  <img src={p.img || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80'} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: ".9rem" }}>
              <MapPin size={12} color="var(--gold)" /><span style={{ color: "var(--gray)", fontSize: ".8rem" }}>{lang === "ar" ? p.locationAr : p.location}</span>
            </div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.8rem,4vw,2.5rem)", color: "var(--navy)", fontWeight: 400, lineHeight: 1.1, marginBottom: ".45rem" }}>{lang === "ar" ? p.nameAr : p.name}</h1>
            <div style={{ display: "flex", gap: 4, marginBottom: "1.4rem" }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={13} fill={i < Math.floor(p.rating || 0) ? "var(--gold)" : "none"} color="var(--gold)" />)}
              <span style={{ color: "var(--gray)", fontSize: ".8rem" }}>{p.rating}</span>
            </div>
            <div className="gline" style={{ marginBottom: "1.3rem" }} />
            <p style={{ color: "var(--gray)", lineHeight: 1.85, marginBottom: "1.6rem", fontSize: ".9rem" }}>{p.description}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: ".8rem", marginBottom: "1.6rem" }}>
              {[
                [<BedDouble size={16} />, lang === "en" ? "Beds" : "غرف", p.rooms],
                [<Bath size={16} />, lang === "en" ? "Baths" : "حمامات", p.baths],
                [<Square size={16} />, lang === "en" ? "sqm" : "م²", p.area],
                [<Home size={16} />, "Type", p.type],
              ].map(([ic, lbl, val], i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid rgba(201,168,76,.1)", borderRadius: 6, padding: "1.1rem", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: "var(--gold)" }}>{ic}</span>
                  <div>
                    <div style={{ fontSize: ".63rem", color: "var(--gray)", textTransform: "uppercase", letterSpacing: ".1em" }}>{lbl}</div>
                    <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: ".92rem" }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
            {p.amenities?.length > 0 && (
              <div style={{ marginBottom: "1.6rem" }}>
                <Lbl>{am}</Lbl>
                <div style={{ display: "flex", flexWrap: "wrap", gap: ".45rem", marginTop: 7 }}>
                  {p.amenities.map((a, i) => <span key={i} style={{ background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.2)", color: "var(--navy)", borderRadius: 4, padding: "4px 12px", fontSize: ".76rem" }}>{a}</span>)}
                </div>
              </div>
            )}
            <div style={{ background: "linear-gradient(135deg,var(--navy),var(--navy2))", borderRadius: 8, padding: "1.6rem", border: "1px solid rgba(201,168,76,.2)" }}>
              <div style={{ fontSize: ".63rem", color: "rgba(255,255,255,.38)", letterSpacing: ".2em", textTransform: "uppercase", marginBottom: ".45rem" }}>{bp}</div>
              <div className="shimmer-text" style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", fontWeight: 700, marginBottom: "1.3rem" }}>{fmtPrice(p, cur)}</div>
              <div style={{ display: "flex", gap: ".65rem" }}>
                <button className="btn-g" onClick={() => setBookingOpen(true)} style={{ flex: 1, borderRadius: 4, padding: 12, fontSize: ".83rem" }}>{bv}</button>
                <a href="https://wa.me/201000000000" target="_blank" rel="noreferrer"
                  style={{ background: "rgba(37,211,102,.15)", border: "1px solid rgba(37,211,102,.3)", borderRadius: 4, padding: "12px 16px", color: "#25D366", display: "flex", alignItems: "center", gap: 5, fontSize: ".8rem", fontFamily: "var(--sans)", textDecoration: "none" }}>
                  <MessageCircle size={14} />WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
