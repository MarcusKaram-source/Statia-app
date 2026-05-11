import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Grid3X3, List } from "lucide-react";
import PCard from "../components/PCard";
import { useAppContext } from "../context/AppContext";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../api";
import AdvancedFilters from "../components/AdvancedFilters";

export default function Properties() {
  const { lang } = useAppContext();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 0 });
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentFilters, setCurrentFilters] = useState({});

  const fetchProperties = async (page = 1, filters = {}, sort = sortBy, order = sortOrder) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        sortBy: sort,
        sortOrder: order,
        ...filters
      });

      const response = await api.get(`/api/properties?${params.toString()}`);
      setProperties(response.properties);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleFilterChange = (filters) => {
    setCurrentFilters(filters);
    fetchProperties(1, filters, sortBy, sortOrder);
  };

  const handleSearch = (searchTerm) => {
    const filters = { ...currentFilters, search: searchTerm };
    setCurrentFilters(filters);
    fetchProperties(1, filters, sortBy, sortOrder);
  };

  const handleSortChange = (newSortBy) => {
    if (newSortBy === sortBy) {
      const newOrder = sortOrder === "asc" ? "desc" : "asc";
      setSortOrder(newOrder);
      fetchProperties(pagination.page, currentFilters, sortBy, newOrder);
    } else {
      setSortBy(newSortBy);
      fetchProperties(pagination.page, currentFilters, newSortBy, sortOrder);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setLoading(true);
      fetchProperties(newPage, currentFilters, sortBy, sortOrder).finally(() => {
        setLoading(false);
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const h1 = lang === "en" ? "Our Properties" : "عقاراتنا";
  const nf = lang === "en" ? "No properties found" : "لم يتم العثور على عقارات";

  return (
    <div style={{ paddingTop: 80, background: "var(--cream)", minHeight: "100vh" }}>
      <div style={{ background: "linear-gradient(135deg,var(--navy),var(--navy2))", padding: "4.25rem 5% 6.25rem", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2rem,5vw,3rem)", color: "#fff", fontWeight: 300, marginBottom: ".45rem" }}>{h1}</h1>
        <p style={{ color: "rgba(255,255,255,.42)", fontSize: ".88rem" }}>{pagination.total} {lang === "en" ? "exclusive listings" : "عقار حصري متاح"}</p>
      </div>
      
      <div style={{ padding: "2rem 5%", maxWidth: 1400, margin: "0 auto" }}>
        <AdvancedFilters onFilterChange={handleFilterChange} onSearch={handleSearch} />
        
        {/* Sort and View Controls */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16
        }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[["priceEGP", lang === "en" ? "Price" : "السعر"], ["area", lang === "en" ? "Area" : "المساحة"], ["rating", lang === "en" ? "Rating" : "التقييم"]].map(([key, label]) => (
              <button key={key} onClick={() => handleSortChange(key)} style={{ padding: "7px 13px", background: sortBy === key ? "var(--gold)" : "white", color: "var(--navy)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 6, cursor: "pointer", fontSize: ".82rem", transition: "all 0.3s ease", whiteSpace: "nowrap" }}>
                {label} {sortBy === key && (sortOrder === "asc" ? "↑" : "↓")}
              </button>
            ))}
          </div>
          
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                padding: "8px 12px",
                background: viewMode === "grid" ? "var(--gold)" : "white",
                color: viewMode === "grid" ? "var(--navy)" : "var(--navy)",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: 6,
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: "8px 12px",
                background: viewMode === "list" ? "var(--gold)" : "white",
                color: viewMode === "list" ? "var(--navy)" : "var(--navy)",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: 6,
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <LoadingSpinner style={{ margin: "0 auto" }} />
          </div>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--gray)" }}>
            <Search size={40} style={{ opacity: .22, marginBottom: "1rem" }} />
            <p style={{ fontFamily: "var(--serif)", fontSize: "1.45rem" }}>{nf}</p>
          </div>
        ) : (
          <>
            <div style={{
              display: viewMode === "grid" ? "grid" : "flex",
              gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(320px, 1fr))" : "column",
              flexDirection: "column",
              gap: "1.75rem"
            }}>
              {properties.map(p => (
                <PCard key={p.id} p={p} viewMode={viewMode} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 6,
                marginTop: 40,
                flexWrap: "wrap"
              }}>
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  style={{
                    padding: "8px 16px",
                    background: pagination.page === 1 ? "rgba(201,168,76,0.1)" : "var(--gold)",
                    color: pagination.page === 1 ? "rgba(201,168,76,0.3)" : "var(--navy)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    borderRadius: 6,
                    cursor: pagination.page === 1 ? "not-allowed" : "pointer",
                    fontSize: "0.9rem",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <ChevronLeft size={18} />
                  {lang === "en" ? "Previous" : "السابق"}
                </button>

                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  let pageNum;
                  if (pagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      style={{
                        padding: "8px 12px",
                        background: pagination.page === pageNum ? "var(--gold)" : "white",
                        color: pagination.page === pageNum ? "var(--navy)" : "var(--navy)",
                        border: "1px solid rgba(201,168,76,0.2)",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        transition: "all 0.3s ease",
                        minWidth: 40
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  style={{
                    padding: "8px 16px",
                    background: pagination.page === pagination.pages ? "rgba(201,168,76,0.1)" : "var(--gold)",
                    color: pagination.page === pagination.pages ? "rgba(201,168,76,0.3)" : "var(--navy)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    borderRadius: 6,
                    cursor: pagination.page === pagination.pages ? "not-allowed" : "pointer",
                    fontSize: "0.9rem",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  {lang === "en" ? "Next" : "التالي"}
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
