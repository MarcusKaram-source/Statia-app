import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, MapPin, Home, Bath, Maximize2, Star } from "lucide-react";
import api from "../api";
import { useAppContext } from "../context/AppContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function FavoritesPage() {
  const { lang, user, setToast } = useAppContext();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const fetchFavorites = async () => {
      try {
        const response = await api.get("/api/favorites");
        setFavorites(response);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate, user]);

  const handleRemoveFavorite = async (propertyId) => {
    try {
      await api.delete(`/api/favorites/${propertyId}`);
      setFavorites(favorites.filter(fav => fav.projectId !== propertyId));
    } catch (error) {
      console.error("Error removing favorite:", error);
      setToast({ msg: "Failed to remove property from favorites", type: "error" });
    }
  };

  const content = {
    en: {
      title: "My Favorites",
      subtitle: "Your saved properties",
      back: "Back to Properties",
      noFavorites: "No favorites yet",
      startBrowsing: "Start browsing properties",
      remove: "Remove from Favorites",
      viewDetails: "View Details"
    },
    ar: {
      title: "المفضلة",
      subtitle: "العقارات المحفوظة",
      back: "العودة للعقارات",
      noFavorites: "لا توجد مفضلة بعد",
      startBrowsing: "ابدأ تصفح العقارات",
      remove: "إزالة من المفضلة",
      viewDetails: "عرض التفاصيل"
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

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", paddingTop: 100, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 5%" }}>
        <div style={{ marginBottom: 40, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.8rem,4vw,2.5rem)", color: "var(--navy)", fontWeight: 300, marginBottom: 8 }}>
              {t.title}
            </h1>
            <p style={{ color: "var(--gray)", fontSize: "1.1rem" }}>
              {t.subtitle} ({favorites.length})
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

        {favorites.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <Heart size={64} style={{ color: "var(--gold)", marginBottom: 24, opacity: 0.5 }} />
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.8rem", color: "var(--navy)", fontWeight: 400, marginBottom: 12 }}>
              {t.noFavorites}
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {favorites.map((fav) => (
              <div
                key={fav.id}
                style={{
                  background: "white",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                }}
                onClick={() => navigate(`/properties/${fav.projectId}`)}
              >
                <div style={{ position: "relative", height: 220 }}>
                  <img
                    src={fav.project.img}
                    alt={fav.project.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {fav.project.badge && (
                    <div style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      background: "var(--gold)",
                      color: "var(--navy)",
                      padding: "6px 12px",
                      borderRadius: 4,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      {fav.project.badge}
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFavorite(fav.projectId);
                    }}
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      width: 40,
                      height: 40,
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
                      e.currentTarget.style.transform = "scale(1.1)";
                      e.currentTarget.style.background = "#fee2e2";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.95)";
                    }}
                  >
                    <Heart size={20} fill="#ef4444" stroke="#ef4444" />
                  </button>
                </div>
                <div style={{ padding: 20 }}>
                  <h3 style={{
                    fontFamily: "var(--serif)",
                    fontSize: "1.4rem",
                    color: "var(--navy)",
                    fontWeight: 400,
                    marginBottom: 8
                  }}>
                    {lang === "ar" ? fav.project.nameAr : fav.project.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                    <MapPin size={14} style={{ color: "var(--gold)" }} />
                    <span style={{ color: "var(--gray)", fontSize: "0.9rem" }}>
                      {lang === "ar" ? fav.project.locationAr : fav.project.location}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Home size={14} style={{ color: "var(--gold)" }} />
                      <span style={{ color: "var(--gray)", fontSize: "0.9rem" }}>
                        {fav.project.rooms} {lang === "ar" ? "غرفة" : "Bed"}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Bath size={14} style={{ color: "var(--gold)" }} />
                      <span style={{ color: "var(--gray)", fontSize: "0.9rem" }}>
                        {fav.project.baths} {lang === "ar" ? "حمام" : "Bath"}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Maximize2 size={14} style={{ color: "var(--gold)" }} />
                      <span style={{ color: "var(--gray)", fontSize: "0.9rem" }}>
                        {fav.project.area} {lang === "ar" ? "م²" : "m²"}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                    <div>
                      <div style={{ fontSize: "1.3rem", color: "var(--navy)", fontWeight: 600 }}>
                        EGP {fav.project.priceEGP.toLocaleString()}
                      </div>
                      {fav.project.rating && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                          <Star size={12} fill="#fbbf24" stroke="#fbbf24" />
                          <span style={{ color: "var(--gray)", fontSize: "0.85rem" }}>
                            {fav.project.rating}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/properties/${fav.projectId}`);
                      }}
                      style={{
                        padding: "10px 20px",
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
