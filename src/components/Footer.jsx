import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export default function Footer() {
  const { lang } = useAppContext();
  const tag = lang === "en" ? "The art of exceptional living." : "فن الحياة الاستثنائية.";
  return (
    <footer style={{ background: "#060f1e", borderTop: "1px solid rgba(201,168,76,.08)", padding: "3.25rem 5% 1.6rem" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div className="ft-grid">
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: "2.1rem", color: "#fff", fontStyle: "italic", fontWeight: 300, marginBottom: 3 }}>Statia</div>
            <div style={{ fontSize: ".54rem", color: "var(--gold)", letterSpacing: ".26em", textTransform: "uppercase", marginBottom: "1.1rem" }}>Luxury Real Estate</div>
            <p style={{ color: "rgba(255,255,255,.28)", fontSize: ".8rem", lineHeight: 1.88, maxWidth: 250 }}>{tag}<br />Cairo · North Coast · New Capital</p>
          </div>
          {["Properties", "Company", "Support"].map((col, ci) => (
            <div key={ci}>
              <h4 style={{ color: "var(--gold)", fontSize: ".62rem", letterSpacing: ".2em", textTransform: "uppercase", marginBottom: "1rem" }}>{col}</h4>
              {[["Apartments", "Villas", "Chalets", "Penthouses"], ["About Us", "Our Team", "Careers", "Press"], [["Contact", "/contact"], ["FAQs", "#"], ["Privacy", "/privacy"], ["Terms", "/terms"]]][ci].map(lnk => (
                <div key={Array.isArray(lnk) ? lnk[0] : lnk} style={{ marginBottom: ".6rem" }}>
                  <a href={Array.isArray(lnk) ? lnk[1] : "#"} style={{ color: "rgba(255,255,255,.32)", fontSize: ".78rem", textDecoration: "none", transition: "color .2s" }} onMouseEnter={e => e.target.style.color = "var(--gold)"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.32)"}>{Array.isArray(lnk) ? lnk[0] : lnk}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="gline" style={{ marginBottom: "1.6rem" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ color: "rgba(255,255,255,.2)", fontSize: ".72rem" }}>© 2025 Statia Luxury Real Estate. All rights reserved.</p>
          <div style={{ display: "flex", gap: ".65rem" }}>
            {[MessageCircle, Phone, Mail, MapPin].map((Ic, i) => (
              <button key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", cursor: "pointer", transition: "all .3s" }} onMouseEnter={e => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "var(--navy)"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,168,76,.08)"; e.currentTarget.style.color = "var(--gold)"; }}>
                <Ic size={12} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
