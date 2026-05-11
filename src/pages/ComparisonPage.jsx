import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GitCompare, ArrowLeft, Trash2, MapPin, Home, Bath, Maximize2, Check, X } from "lucide-react";
import api from "../api";
import { useAppContext } from "../context/AppContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ComparisonPage() {
  const { lang, user, setToast } = useAppContext();
  const navigate = useNavigate();
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const fetchComparisons = async () => {
      try {
        const response = await api.get("/api/comparisons");
        setComparisons(response);
      } catch (error) {
        console.error("Error fetching comparisons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisons();
  }, [navigate, user]);

  const handleRemoveComparison = async (propertyId) => {
    try {
      await api.delete(`/api/comparisons/${propertyId}`);
      setComparisons(comparisons.filter(comp => comp.projectId !== propertyId));
    } catch (error) {
      console.error("Error removing comparison:", error);
      setToast({ msg: "Failed to remove property from comparison", type: "error" });
    }
  };

  const content = {
    en: {
      title: "Property Comparison",
      subtitle: "Compare your selected properties",
      back: "Back to Properties",
      noComparisons: "No properties to compare",
      startBrowsing: "Start browsing properties",
      remove: "Remove",
      viewDetails: "View Details",
      details: [
        { key: "name", label: "Property Name" },
        { key: "location", label: "Location" },
        { key: "type", label: "Property Type" },
        { key: "status", label: "Status" },
        { key: "price", label: "Price (EGP)" },
        { key: "rooms", label: "Bedrooms" },
        { key: "baths", label: "Bathrooms" },
        { key: "area", label: "Area (m²)" },
        { key: "rating", label: "Rating" },
        { key: "amenities", label: "Amenities" }
      ]
    },
    ar: {
      title: "مقارنة العقارات",
      subtitle: "قارن بين العقارات المختارة",
      back: "العودة للعقارات",
      noComparisons: "لا توجد عقارات للمقارنة",
      startBrowsing: "ابدأ تصفح العقارات",
      remove: "إزالة",
      viewDetails: "عرض التفاصيل",
      details: [
        { key: "name", label: "اسم العقار" },
        { key: "location", label: "الموقع" },
        { key: "type", label: "نوع العقار" },
        { key: "status", label: "الحالة" },
        { key: "price", label: "السعر (جنيه مصري)" },
        { key: "rooms", label: "الغرف" },
        { key: "baths", label: "الحمامات" },
        { key: "area", label: "المساحة (م²)" },
        { key: "rating", label: "التقييم" },
        { key: "amenities", label: "المميزات" }
      ]
    }
  };

  const t = content[lang];

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--cream)", paddingTop: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (comparisons.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--cream)", paddingTop: 100, paddingBottom: 60 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 5%" }}>
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
        </div>
      </div>
    );
  }

  const getDetailValue = (detail, project) => {
    switch (detail.key) {
      case "name":
        return lang === "ar" ? project.nameAr : project.name;
      case "location":
        return lang === "ar" ? project.locationAr : project.location;
      case "price":
        return `EGP ${project.priceEGP.toLocaleString()}`;
      case "area":
        return `${project.area} ${lang === "ar" ? "م²" : "m²"}`;
      case "rating":
        return project.rating ? `${project.rating}/5` : "-";
      case "amenities":
        return project.amenities?.join(", ") || "-";
      default:
        return project[detail.key] || "-";
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", paddingTop: 100, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 5%" }}>
        <div style={{ marginBottom: 40, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "2.5rem", color: "var(--navy)", fontWeight: 300, marginBottom: 8 }}>
              {t.title}
            </h1>
            <p style={{ color: "var(--gray)", fontSize: "1.1rem" }}>
              {t.subtitle} ({comparisons.length})
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

        <div style={{ overflowX: "auto", background: "white", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <tbody>
              {t.details.map((detail) => (
                <tr key={detail.key} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <td style={{
                    padding: "16px 20px",
                    background: "rgba(201,168,76,0.05)",
                    fontWeight: 600,
                    color: "var(--navy)",
                    width: "200px",
                    position: "sticky",
                    left: 0
                  }}>
                    {detail.label}
                  </td>
                  {comparisons.map((comp) => (
                    <td key={comp.id} style={{ padding: "16px 20px", textAlign: "center", minWidth: 200 }}>
                      {getDetailValue(detail, comp.project)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: `repeat(auto-fit,minmax(min(280px,100%),1fr))`, gap: 24 }}>
          {comparisons.map((comp) => (
            <div
              key={comp.id}
              style={{
                background: "white",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease"
              }}
            >
              <div style={{ position: "relative", height: 180 }}>
                <img
                  src={comp.project.img}
                  alt={comp.project.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ padding: 20 }}>
                <h3 style={{
                  fontFamily: "var(--serif)",
                  fontSize: "1.2rem",
                  color: "var(--navy)",
                  fontWeight: 400,
                  marginBottom: 12
                }}>
                  {lang === "ar" ? comp.project.nameAr : comp.project.name}
                </h3>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => navigate(`/properties/${comp.projectId}`)}
                    style={{
                      flex: 1,
                      padding: "10px",
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
                    onClick={() => handleRemoveComparison(comp.projectId)}
                    style={{
                      padding: "10px 16px",
                      background: "#fee2e2",
                      color: "#ef4444",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fecaca";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fee2e2";
                    }}
                  >
                    <Trash2 size={16} />
                    {t.remove}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
