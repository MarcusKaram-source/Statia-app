import { useNavigate } from "react-router-dom";
import { MapPin, BedDouble, Bath, Square, Star } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { BADGE, fmtPrice } from "../assets/data";

export default function PCard({ p, viewMode = "grid" }) {
  const { lang, cur } = useAppContext();
  const navigate = useNavigate();
  const vd = lang === "en" ? "View Details" : "عرض التفاصيل";
  const sf = lang === "en" ? "Starting from" : "يبدأ من";
  const bc = BADGE[p.badge] || BADGE["New Launch"];
  const specs = [
    [<BedDouble size={12} />, p.rooms, lang === "en" ? "Beds" : "غرف"],
    [<Bath size={12} />, p.baths, lang === "en" ? "Baths" : "حمامات"],
    [<Square size={12} />, p.area, lang === "en" ? "sqm" : "م²"],
  ];

  const handleClick = () => navigate(`/properties/${p.id}`, { state: { property: p } });

  const isListView = viewMode === "list";

  return (
    <div
      className="pcard"
      onClick={handleClick}
      style={{
        background: "#fff",
        borderRadius: 8,
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 4px 18px rgba(10,22,40,.07)",
        border: "1px solid rgba(201,168,76,.08)",
        display: isListView ? "flex" : "block",
        flexDirection: isListView ? "row" : "column",
        transition: "all 0.3s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(10,22,40,.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 18px rgba(10,22,40,.07)";
      }}
    >
      <div style={{
        position: "relative",
        paddingTop: isListView ? "0" : "62%",
        width: isListView ? "300px" : "100%",
        flexShrink: 0
      }}>
        <div className="ci" style={{ position: "absolute", inset: 0 }}>
          <img
            src={p.img || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80'}
            alt={p.name}
            style={{
              width: "100%",
              height: isListView ? "100%" : "100%",
              objectFit: "cover",
              minHeight: isListView ? "200px" : "auto"
            }}
          />
        </div>
        <div style={{ position: "absolute", top: 13, left: 13 }}>
          <span style={{ background: bc.bg, color: bc.color, border: `1px solid ${bc.border}`, padding: "3px 10px", borderRadius: 2, fontSize: ".64rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>{p.badge}</span>
        </div>
        <div style={{ position: "absolute", top: 13, right: 13, background: "rgba(10,22,40,.8)", backdropFilter: "blur(10px)", borderRadius: 4, padding: "3px 8px", display: "flex", alignItems: "center", gap: 3 }}>
          <Star size={10} fill="var(--gold)" color="var(--gold)" /><span style={{ color: "var(--gold)", fontSize: ".7rem", fontWeight: 700 }}>{p.rating}</span>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 13px 7px", background: "linear-gradient(to top,rgba(10,22,40,.8),transparent)" }}>
          <span style={{ color: p.status === "Ready to Move" ? "#86efac" : "#fcd34d", fontSize: ".64rem", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 600 }}>● {p.status}</span>
        </div>
      </div>
      <div style={{
        padding: isListView ? "1.5rem" : "1.3rem",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 7 }}>
          <MapPin size={11} color="var(--gold)" /><span style={{ fontSize: ".7rem", color: "var(--gray)" }}>{lang === "ar" ? p.locationAr : p.location}</span>
        </div>
        <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.2rem", fontWeight: 600, color: "var(--navy)", marginBottom: ".4rem", lineHeight: 1.2 }}>{lang === "ar" ? p.nameAr : p.name}</h3>
        <div style={{ width: 26, height: 1, background: "var(--gold)", marginBottom: ".9rem" }} />
        <div style={{ display: "flex", gap: "1.1rem", marginBottom: "1.1rem" }}>
          {specs.map(([ic, v, l], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ color: "var(--gold)" }}>{ic}</span>
              <span style={{ fontSize: ".76rem", color: "var(--navy)", fontWeight: 600 }}>{v}</span>
              <span style={{ fontSize: ".7rem", color: "var(--gray)" }}>{l}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: ".9rem", borderTop: "1px solid rgba(201,168,76,.1)" }}>
          <div>
            <div style={{ fontSize: ".6rem", color: "var(--gray)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 2 }}>{sf}</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: "1.12rem", color: "var(--navy)", fontWeight: 700 }}>{fmtPrice(p, cur)}</div>
          </div>
          <button className="btn-g" style={{ borderRadius: 4, padding: "7px 15px", fontSize: ".74rem" }}>{vd}</button>
        </div>
      </div>
    </div>
  );
}