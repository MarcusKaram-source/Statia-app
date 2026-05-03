import { useState, useEffect } from "react";
import { GitCompare } from "lucide-react";
import api from "../api";

export default function CompareButton({ propertyId, style = {} }) {
  const [isCompared, setIsCompared] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkComparison = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await api.get(`/api/comparisons/check/${propertyId}`);
        setIsCompared(response.data.isCompared);
      } catch (error) {
        console.error("Error checking comparison:", error);
      }
    };

    checkComparison();
  }, [propertyId]);

  const toggleComparison = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add properties to comparison");
      return;
    }

    setLoading(true);
    try {
      if (isCompared) {
        await api.delete(`/api/comparisons/${propertyId}`);
        setIsCompared(false);
      } else {
        await api.post("/api/comparisons", { projectId: propertyId });
        setIsCompared(true);
      }
    } catch (error) {
      console.error("Error toggling comparison:", error);
      alert("Failed to update comparison. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleComparison}
      disabled={loading}
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
        cursor: loading ? "not-allowed" : "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        ...style
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.background = isCompared ? "#dbeafe" : "rgba(255,255,255,1)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.background = "rgba(255,255,255,0.95)";
      }}
    >
      <GitCompare
        size={20}
        stroke={isCompared ? "#2563eb" : "#666"}
        style={{ transition: "all 0.3s ease" }}
      />
    </button>
  );
}