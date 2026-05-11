import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export default function Hero() {
  const { lang } = useAppContext();
  const navigate = useNavigate();
  const lines = {
    en: ["Where Prestige", "Meets Property", "Discover Egypt's most exclusive residences, curated for the discerning few.", "Explore Properties", "Schedule a Viewing"],
    ar: ["حيث الرقي", "يلتقي بالعقار", "اكتشف أرقى المساكن في مصر، المنتقاة لأصحاب الذوق الرفيع.", "استعرض العقارات", "احجز معاينة"],
  };
  const [l1, l2, sub, cta1, cta2] = lines[lang];
  return (
    <section style={{ position: "relative", height: "100svh", minHeight: "min(660px,100vh)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=90')", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(10,22,40,.93) 0%,rgba(15,32,68,.72) 55%,rgba(10,22,40,.55) 100%)" }} />
      <div className="float hero-circle" style={{ top: "18%", right: "7%", width: 260, height: 260, border: "1px solid rgba(201,168,76,.1)" }} />
      <div className="float hero-circle" style={{ top: "24%", right: "10.5%", width: 165, height: 165, border: "1px solid rgba(201,168,76,.16)", animationDelay: "1.2s" }} />
      <div style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "74px 8% 2rem", maxWidth: 1400, margin: "0 auto" }}>
        <div className="fadeUp d1" style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: "1.3rem" }}>
          <div style={{ width: 34, height: 1, background: "var(--gold)" }} />
          <span style={{ color: "var(--gold)", fontSize: ".7rem", letterSpacing: ".26em", textTransform: "uppercase" }}>Premium Collection 2025</span>
        </div>
        <h1 className="fadeUp d2" style={{ fontFamily: "var(--serif)", fontSize: "clamp(3rem,7vw,6.5rem)", fontWeight: 300, lineHeight: 1.05, color: "#fff" }}>{l1}</h1>
        <h1 className="fadeUp d3 shimmer-text" style={{ fontFamily: "var(--serif)", fontSize: "clamp(3rem,7vw,6.5rem)", fontWeight: 600, lineHeight: 1.05, fontStyle: "italic", marginBottom: "1.6rem" }}>{l2}</h1>
        <p className="fadeUp d4" style={{ color: "rgba(255,255,255,.6)", fontSize: "1rem", maxWidth: 440, lineHeight: 1.78, marginBottom: "2.4rem", fontWeight: 300 }}>{sub}</p>
        <div className="fadeUp d5" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button className="btn-g" onClick={() => navigate("/properties")} style={{ borderRadius: 4, padding: "14px 34px", fontSize: ".86rem", display: "flex", alignItems: "center", gap: 8 }}>{cta1} <ArrowRight size={15} /></button>
          <button className="btn-o" onClick={() => navigate("/contact")} style={{ borderRadius: 4, padding: "14px 34px", fontSize: ".86rem" }}>{cta2}</button>
        </div>
        <div className="fadeUp d6" style={{ display: "flex", gap: "2.25rem", marginTop: "3.25rem", flexWrap: "wrap" }}>
          {[["847+", lang === "en" ? "Premium Units" : "وحدة فاخرة"], ["24", lang === "en" ? "Active Projects" : "مشروع نشط"], ["99%", lang === "en" ? "Satisfaction" : "رضا العملاء"]].map(([n, l], i) => (
            <div key={i} style={{ borderLeft: "2px solid rgba(201,168,76,.4)", paddingLeft: "1rem" }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: "1.85rem", color: "var(--gold)", fontWeight: 600 }}>{n}</div>
              <div style={{ fontSize: ".68rem", color: "rgba(255,255,255,.42)", letterSpacing: ".1em", textTransform: "uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ color: "rgba(255,255,255,.3)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase" }}>Scroll</span>
        <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom,rgba(201,168,76,.8),transparent)", animation: "floatY 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}
