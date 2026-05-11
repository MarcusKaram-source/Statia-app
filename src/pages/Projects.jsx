import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Building2, ArrowRight, BedDouble, Bath, Square, Star } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { apiFetch } from "../api";
import { fmtPrice } from "../assets/data";

export default function Projects() {
  const { lang, cur } = useAppContext();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/properties?status=Under+Construction&limit=50")
      .then(data => setProjects(data.properties || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const t = {
    en: {
      hero: "Our Projects",
      sub: "Pioneering developments shaping Egypt's future skyline",
      active: "Active Projects",
      underConst: "Under Construction",
      upcoming: "Upcoming",
      viewDetails: "View Project",
      viewAll: "Browse All Properties",
      noProjects: "No active projects at the moment",
      startingFrom: "Starting from",
      beds: "Beds",
      baths: "Baths",
      sqm: "sqm",
    },
    ar: {
      hero: "مشاريعنا",
      sub: "تطورات رائدة تشكّل أفق مصر المستقبلية",
      active: "مشاريع نشطة",
      underConst: "قيد الإنشاء",
      upcoming: "قادم",
      viewDetails: "عرض المشروع",
      viewAll: "تصفح كل العقارات",
      noProjects: "لا توجد مشاريع نشطة في الوقت الحالي",
      startingFrom: "يبدأ من",
      beds: "غرف",
      baths: "حمامات",
      sqm: "م²",
    },
  }[lang];

  return (
    <div style={{ paddingTop: 80, background: "var(--cream)", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,var(--navy),var(--navy2))", padding: "4.25rem 5% 6.25rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", right: "8%", width: 220, height: 220, border: "1px solid rgba(201,168,76,.08)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%", left: "5%", width: 140, height: 140, border: "1px solid rgba(201,168,76,.06)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginBottom: "1rem" }}>
            <div style={{ width: 36, height: 1, background: "var(--gold)" }} />
            <Building2 size={14} color="var(--gold)" />
            <div style={{ width: 36, height: 1, background: "var(--gold)" }} />
          </div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2rem,5vw,3rem)", color: "#fff", fontWeight: 300, marginBottom: ".45rem" }}>{t.hero}</h1>
          <p style={{ color: "rgba(255,255,255,.42)", fontSize: ".88rem", maxWidth: 480, margin: "0 auto" }}>{t.sub}</p>
          {!loading && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: "1.5rem", background: "rgba(201,168,76,.1)", border: "1px solid rgba(201,168,76,.25)", borderRadius: 24, padding: "6px 16px" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fcd34d", display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
              <span style={{ color: "var(--gold)", fontSize: ".76rem", letterSpacing: ".1em" }}>{projects.length} {t.active}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "3rem 5%", maxWidth: 1200, margin: "0 auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "5rem" }}>
            <LoadingSpinner style={{ margin: "0 auto" }} />
          </div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem", color: "var(--gray)" }}>
            <Building2 size={40} style={{ opacity: .22, marginBottom: "1rem" }} />
            <p style={{ fontFamily: "var(--serif)", fontSize: "1.45rem" }}>{t.noProjects}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2.25rem" }}>
            {projects.map((p, idx) => (
              <div
                key={p.id}
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  overflow: "hidden",
                  boxShadow: "0 4px 24px rgba(10,22,40,.08)",
                  border: "1px solid rgba(201,168,76,.1)",
                  display: "flex",
                  flexDirection: idx % 2 === 0 ? "row" : "row-reverse",
                  transition: "box-shadow .3s, transform .3s",
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(10,22,40,.14)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 24px rgba(10,22,40,.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {/* Image */}
                <div style={{ position: "relative", width: "45%", minHeight: 300, flexShrink: 0 }}>
                  <img
                    src={p.img || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80"}
                    alt={p.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 50%,rgba(10,22,40,.55))" }} />
                  {p.badge && (
                    <div style={{ position: "absolute", top: 16, left: 16, background: "var(--gold)", color: "var(--navy)", padding: "3px 10px", borderRadius: 2, fontSize: ".64rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>{p.badge}</div>
                  )}
                  <div style={{ position: "absolute", bottom: 16, left: 16, display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fcd34d", display: "inline-block" }} />
                    <span style={{ color: "#fcd34d", fontSize: ".68rem", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" }}>{t.underConst}</span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, padding: "2.5rem 2.25rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: "1rem" }}>
                    <MapPin size={12} color="var(--gold)" />
                    <span style={{ fontSize: ".74rem", color: "var(--gray)" }}>{lang === "ar" ? p.locationAr : p.location}</span>
                  </div>

                  <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.4rem,2.5vw,2rem)", color: "var(--navy)", fontWeight: 400, marginBottom: ".5rem", lineHeight: 1.2 }}>
                    {lang === "ar" ? p.nameAr : p.name}
                  </h2>

                  <div style={{ width: 40, height: 2, background: "var(--gold)", marginBottom: "1rem" }} />

                  {p.description && (
                    <p style={{ fontSize: ".84rem", color: "var(--gray)", lineHeight: 1.75, marginBottom: "1.4rem", maxWidth: 420 }}>
                      {p.description}
                    </p>
                  )}

                  <div style={{ display: "flex", gap: "1.4rem", marginBottom: "1.6rem" }}>
                    {[
                      [<BedDouble size={13} />, p.rooms, t.beds],
                      [<Bath size={13} />, p.baths, t.baths],
                      [<Square size={13} />, p.area, t.sqm],
                    ].map(([ic, v, label], i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ color: "var(--gold)" }}>{ic}</span>
                        <span style={{ fontSize: ".8rem", color: "var(--navy)", fontWeight: 600 }}>{v}</span>
                        <span style={{ fontSize: ".74rem", color: "var(--gray)" }}>{label}</span>
                      </div>
                    ))}
                    {p.rating && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
                        <Star size={12} fill="var(--gold)" color="var(--gold)" />
                        <span style={{ fontSize: ".8rem", fontWeight: 700, color: "var(--navy)" }}>{p.rating}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1.2rem", borderTop: "1px solid rgba(201,168,76,.12)" }}>
                    <div>
                      <div style={{ fontSize: ".6rem", color: "var(--gray)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 3 }}>{t.startingFrom}</div>
                      <div style={{ fontFamily: "var(--serif)", fontSize: "1.35rem", color: "var(--navy)", fontWeight: 700 }}>{fmtPrice(p, cur)}</div>
                    </div>
                    <button
                      className="btn-g"
                      onClick={() => navigate(`/properties/${p.id}`, { state: { property: p } })}
                      style={{ borderRadius: 4, padding: "10px 22px", fontSize: ".8rem", display: "flex", alignItems: "center", gap: 7 }}
                    >
                      {t.viewDetails} <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {!loading && (
          <div style={{ textAlign: "center", marginTop: "3.5rem", padding: "2.5rem", background: "linear-gradient(135deg,var(--navy),var(--navy2))", borderRadius: 10, border: "1px solid rgba(201,168,76,.18)" }}>
            <p style={{ color: "rgba(255,255,255,.5)", fontSize: ".84rem", marginBottom: "1rem" }}>
              {lang === "en" ? "Looking for a ready-to-move property?" : "تبحث عن عقار جاهز للسكن؟"}
            </p>
            <button
              className="btn-o"
              onClick={() => navigate("/properties")}
              style={{ borderRadius: 4, padding: "11px 30px", fontSize: ".82rem", display: "inline-flex", alignItems: "center", gap: 7 }}
            >
              {t.viewAll} <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
