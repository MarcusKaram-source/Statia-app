import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import api from "../api";
import { useAppContext } from "../context/AppContext";

export default function FavoriteButton({ propertyId, style = {} }) {
  const { user, setToast } = useAppContext();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const checkFavorite = async () => {
      try {
        const response = await api.get(`/api/favorites/check/${propertyId}`);
        setIsFavorite(response.isFavorite);
      } catch (error) {
        console.error("Error checking favorite:", error);
      }
    };

    checkFavorite();
  }, [propertyId, user]);

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    if (!user) {
      setToast({ msg: "Please login to add properties to favorites", type: "info" });
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/api/favorites/${propertyId}`);
        setIsFavorite(false);
      } else {
        await api.post("/api/favorites", { projectId: propertyId });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setToast({ msg: "Failed to update favorites. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.95)",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        ...style
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.background = isFavorite ? "#fee2e2" : "rgba(255,255,255,1)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.background = "rgba(255,255,255,0.95)";
      }}
    >
      <Heart
        size={20}
        fill={isFavorite ? "#ef4444" : "none"}
        stroke={isFavorite ? "#ef4444" : "#666"}
        style={{ transition: "all 0.3s ease" }}
      />
    </button>
  );
}
