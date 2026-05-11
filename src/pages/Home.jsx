import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Award, Star, Building2, Globe, ChevronRight } from "lucide-react";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import PCard from "../components/PCard";
import Contact from "../components/Contact";
import { useAppContext } from "../context/AppContext";
import { apiFetch } from "../api";

export default function Home() {
  const { lang } = useAppContext();
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    apiFetch('/api/properties')
      .then(data => setFeatured(data.slice(0, 3)))
      .catch(console.error);
  }, []);

  const fl = lang === "en" ? "Featured Listings" : "العروض المميزة";
  const ep = lang === "en" ? "Exceptional Properties" : "عقارات استثنائية";
  const hp = lang === "en" ? "Hand-picked residences that redefine luxury living." : "مساكن مختارة بعناية.";
  const va = lang === "en" ? "View All Properties" : "عرض كل العقارات";
  const wc = lang === "en" ? "Why Choose Statia" : "لماذا تختار ستاتيا";

  return (
    <>
      <Hero />
      <SearchBar onSearch={() => navigate("/properties")} />
      <section style={{ padding: "5.25rem 5%", background: "var(--cream)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginBottom: ".85rem" }}>
              <div style={{ width: 36, height: 1, background: "var(--gold)" }} />
              <span style={{ color: "var(--gold)", fontSize: ".6rem", letterSpacing: ".26em", textTransform: "uppercase" }}>{fl}</span>
              <div style={{ width: 36, height: 1, background: "var(--gold)" }} />
            </div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.8rem,4vw,2.7rem)", color: "var(--navy)", fontWeight: 300, marginBottom: ".4rem" }}>{ep}</h2>
            <p style={{ color: "var(--gray)", fontSize: ".88rem" }}>{hp}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "1.75rem" }}>
            {featured.map(p => <PCard key={p.id} p={p} />)}
          </div>
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <button className="btn-o" onClick={() => navigate("/properties")} style={{ padding: "12px 36px", borderRadius: 4, fontSize: ".82rem", display: "inline-flex", alignItems: "center", gap: 7 }}>{va} <ChevronRight size={14} /></button>
          </div>
        </div>
      </section>
      <section style={{ background: "linear-gradient(135deg,var(--navy),var(--navy2))", padding: "5.25rem 5%" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.8rem,4vw,2.7rem)", color: "#fff", fontWeight: 300, marginBottom: ".45rem" }}>{wc}</h2>
          <div className="gline" style={{ width: 65, margin: "1.3rem auto 2.6rem" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1.6rem" }}>
            {[
              [<Award size={25} />, "Award Winning", "Recognized by Egypt's top real estate bodies."],
              [<Star size={25} />, "5-Star Service", "Dedicated advisors, available 24/7."],
              [<Building2 size={25} />, "Premium Portfolio", "Exclusive access to Egypt's finest developments."],
              [<Globe size={25} />, "International Reach", "Serving GCC clients in SAR & AED."],
            ].map(([ic, t, s], i) => (
              <div key={i} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(201,168,76,.12)", borderRadius: 8, padding: "2.1rem 1.6rem", transition: "border-color .3s,transform .3s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,.4)"; e.currentTarget.style.transform = "translateY(-4px)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,.12)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ color: "var(--gold)", marginBottom: ".9rem" }}>{ic}</div>
                <h3 style={{ fontFamily: "var(--serif)", color: "#fff", fontSize: "1.2rem", fontWeight: 400, marginBottom: ".6rem" }}>{t}</h3>
                <p style={{ color: "rgba(255,255,255,.38)", fontSize: ".8rem", lineHeight: 1.75 }}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Contact />
    </>
  );
}
