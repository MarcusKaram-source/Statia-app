import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GitCompare, ArrowLeft, Home, Bath, Maximize2, Star, Trash2 } from "lucide-react";
import api from "../api";
import { useAppContext } from "../context/AppContext";

export default function ComparisonPage() {
  const { lang } = useAppContext();
  const navigate = useNavigate();
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComparisons = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/api/comparisons");
        setComparisons(response.data || []);
      } catch (error) {
        console.error("Error fetching comparisons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisons();
  }, [navigate]);

  const handleRemove = async (propertyId) => {
    try {
      await api.delete(`/api/comparisons/${propertyId}`);
      setComparisons(comparisons.filter(c => c.projectId !== propertyId));
    } catch (error) {
      console.error("Error removing comparison:", error);
      alert("Failed to remove property from comparisons");
    }
  };

  const content = {
    en: {
      title: "Property Comparison",
      subtitle: "Compare up to 4 properties side by side",
      back: "Back to Properties",
      noComparisons: "No properties to compare yet",
      startBrowsing: "Start browsing properties",
      remove: "Remove from Comparison",
      viewDetails: "View Details",
      rooms: lang === "en" ? "Bedrooms" : "غرف",
      baths: lang === "en" ? "Bathrooms" : "حمامات",
      area: lang === "en" ? "Area" : "المساحة",
      price: lang === "en" ? "Price" : "السعر"
    },
    ar: {
      title: "مقارنة العقارات",
      subtitle: "قارن حتى 4 عقارات جنباً إلى جنب",
      back: "العودة للعقارات",
      noComparisons: "لا توجد عقارات للمقارنة",
      startBrowsing: "ابدأ تصفح العقارات",
      remove: "إزالة من المقارنة",
      viewDetails: "عرض التفاصيل",
      rooms: "غرف",
      baths: "حمامات",
      area: "المساحة",
      price: "السعر"
    }
  };

  const t = content[lang];

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--cream)", paddingTop: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid rgba(201,168,76,0.3)", borderTopColor: "var(--gold)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", paddingTop: 100, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 5%" }}>
        <div style={{ marginBottom: 40, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "2.5rem", color: "var(--navy)", fontWeight: 300, marginBottom: 8 }}>
              {t.title}
            </h1>
            <p style={{ color: "var(--gray)", fontSize: "1.1rem" }}>
              {t.subtitle} ({comparisons.length}/4)
            </p>
          </div>
          <button
            onClick={() => navigate("/properties")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              background: "var(--navy)",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: "0.95rem",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--gold)";
              e.currentTarget.style.color = "var(--navy)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--navy)";
              e.currentTarget.style.color = "white";
            }}
          >
            <ArrowLeft size={18} />
            {t.back}
          </button>
        </div>

        {comparisons.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <GitCompare size={64} style={{ color: "var(--gold)", marginBottom: 24, opacity: 0.5 }} />
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.8rem", color: "var(--navy)", fontWeight: 400, marginBottom: 12 }}>
              {t.noComparisons}
            </h2>
            <p style={{ color: "var(--gray)", fontSize: "1.1rem", marginBottom: 32 }}>
              {t.startBrowsing}
            </p>
            <button
              onClick={() => navigate("/properties")}
              style={{
                padding: "14px 32px",
                background: "var(--gold)",
                color: "var(--navy)",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: 500,
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--navy)";
                e.currentTarget.style.color = "var(--gold)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--gold)";
                e.currentTarget.style.color = "var(--navy)";
              }}
            >
              {t.startBrowsing}
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(comparisons.length, 4)}, 1fr)`, gap: 24 }}>
            {comparisons.map((comp) => (
              <div
                key={comp.projectId}
                style={{
                  background: "white",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                }}
              >
                <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                  <img
                    src={comp.project.img}
                    alt={comp.project.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <button
                    onClick={() => handleRemove(comp.projectId)}
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.95)",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fee2e2";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.95)";
                    }}
                  >
                    <Trash2 size={16} color="#f87171" />
                  </button>
                </div>
                <div style={{ padding: 20 }}>
                  <h3 style={{
                    fontFamily: "var(--serif)",
                    fontSize: "1.4rem",
                    color: "var(--navy)",
                    fontWeight: 400,
                    marginBottom: 12
                  }}>
                    {lang === "ar" ? comp.project.nameAr : comp.project.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                    <span style={{ color: "var(--gray)", fontSize: "0.9rem" }}>
                      {comp.project.rating}
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Home size={14} style={{ color: "var(--gold)" }} />
                      <span style={{ color: "var(--gray)", fontSize: "0.9rem" }}>
                        {comp.project.rooms} {lang === "ar" ? "غرفة" : "Bed"}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Bath size={14} style={{ color: "var(--gold)" }} />
                      <span style={{ color: "var(--gray)", fontSize: "0.9rem" }}>
                        {comp.project.baths} {lang === "ar" ? "حمام" : "Bath"}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Maximize2 size={14} style={{ color: "var(--gold)" }} />
                      <span style={{ color: "var(--gray)", fontSize: "0.9rem" }}>
                        {comp.project.area} {lang === "ar" ? "م²" : "m²"}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ fontSize: "1.2rem", color: "var(--gold)", fontWeight: 600 }}>
                        {comp.project.priceEGP.toLocaleString()}
                      </div>
                      <span style={{ color: "var(--gray)", fontSize: "0.9rem" }}>
                        EGP
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                    <button
                      onClick={() => navigate(`/properties/${comp.projectId}`)}
                      style={{
                        flex: 1,
                        padding: "10px 16px",
                        background: "var(--navy)",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--gold)";
                        e.currentTarget.style.color = "var(--navy)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "var(--navy)";
                        e.currentTarget.style.color = "white";
                      }}
                    >
                      {t.viewDetails}
                    </button>
                    <button
                      onClick={() => handleRemove(comp.projectId)}
                      style={{
                        padding: "10px 16px",
                        background: "transparent",
                        color: "var(--gray)",
                        border: "1px solid rgba(0,0,0,0.1)",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--gold)";
                        e.currentTarget.style.color = "var(--navy)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
                        e.currentTarget.style.color = "var(--gray)";
                      }}
                    >
                      {t.remove}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}