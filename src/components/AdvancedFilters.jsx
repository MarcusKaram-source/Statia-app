import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import LoadingSpinner from "./LoadingSpinner";

export default function AdvancedFilters({ onFilterChange, onSearch, loading }) {
  const { lang } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    minRooms: "",
    maxRooms: "",
    minBaths: "",
    maxBaths: "",
    location: "",
    amenities: []
  });

  const content = {
    en: {
      title: "Advanced Filters",
      searchPlaceholder: "Search properties...",
      type: "Property Type",
      status: "Status",
      priceRange: "Price Range (EGP)",
      areaRange: "Area Range (m²)",
      rooms: "Bedrooms",
      baths: "Bathrooms",
      location: "Location",
      amenities: "Amenities",
      apply: "Apply Filters",
      clear: "Clear All",
      min: "Min",
      max: "Max",
      types: ["Apartment", "Villa", "Chalet", "Penthouse"],
      statuses: ["Under Construction", "Ready to Move"],
      amenityOptions: ["Pool", "Gym", "Concierge", "Parking", "Private Pool", "Smart Home", "Garden", "Security", "Beach Access", "Restaurant", "Marina", "Rooftop Terrace", "Co-working", "Café"]
    },
    ar: {
      title: "فلاتر متقدمة",
      searchPlaceholder: "ابحث عن العقارات...",
      type: "نوع العقار",
      status: "الحالة",
      priceRange: "نطاق السعر (جنيه مصري)",
      areaRange: "نطاق المساحة (م²)",
      rooms: "الغرف",
      baths: "الحمامات",
      location: "الموقع",
      amenities: "المميزات",
      apply: "تطبيق الفلاتر",
      clear: "مسح الكل",
      min: "الأدنى",
      max: "الأقصى",
      types: ["شقة", "فيلا", "شاليه", "بنتهاوس"],
      statuses: ["قيد الإنشاء", "جاهز للسكن"],
      amenityOptions: ["مسبح", "جيم", "كونسيرج", "موقف سيارات", "مسبح خاص", "منزل ذكي", "حديقة", "أمان", "شاطئ خاص", "مطعم", "مارينا", "سطح علوي", "عمل مشترك", "مقهى"]
    }
  };

  const t = content[lang];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleAmenityToggle = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    handleFilterChange("amenities", newAmenities);
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      type: "",
      status: "",
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
      minRooms: "",
      maxRooms: "",
      minBaths: "",
      maxBaths: "",
      location: "",
      amenities: []
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
    setIsOpen(false);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      onSearch(e.target.value);
    }
  };

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Search Bar */}
      <div style={{
        display: "flex",
        gap: 12,
        marginBottom: 20
      }}>
        <div style={{
          flex: 1,
          position: "relative"
        }}>
          <Search
            size={20}
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--gold)"
            }}
          />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            onKeyDown={handleSearch}
            style={{
              width: "100%",
              padding: "14px 16px 14px 48px",
              borderRadius: 8,
              border: "1px solid rgba(201,168,76,0.2)",
              background: "white",
              fontSize: "1rem",
              outline: "none",
              transition: "all 0.3s ease"
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--gold)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: "14px 24px",
            background: isOpen ? "var(--navy)" : "var(--gold)",
            color: isOpen ? "var(--gold)" : "var(--navy)",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: "0.95rem",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <SlidersHorizontal size={18} />
          {t.title}
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Advanced Filters Panel */}
      {isOpen && (
        <div style={{
          background: "white",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          animation: "slideDown 0.3s ease"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
            marginBottom: 24
          }}>
            {/* Property Type */}
            <div>
              <label style={{
                display: "block",
                marginBottom: 8,
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--navy)"
              }}>
                {t.type}
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid rgba(0,0,0,0.1)",
                  background: "white",
                  fontSize: "0.9rem",
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                <option value="">{lang === "ar" ? "الكل" : "All"}</option>
                {t.types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label style={{
                display: "block",
                marginBottom: 8,
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--navy)"
              }}>
                {t.status}
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid rgba(0,0,0,0.1)",
                  background: "white",
                  fontSize: "0.9rem",
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                <option value="">{lang === "ar" ? "الكل" : "All"}</option>
                {t.statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label style={{
                display: "block",
                marginBottom: 8,
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--navy)"
              }}>
                {t.location}
              </label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                placeholder={lang === "ar" ? "ابحث عن موقع" : "Search location"}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid rgba(0,0,0,0.1)",
                  background: "white",
                  fontSize: "0.9rem",
                  outline: "none"
                }}
              />
            </div>
          </div>

          {/* Price Range */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: "block",
              marginBottom: 8,
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--navy)"
            }}>
              {t.priceRange}
            </label>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  placeholder={`${t.min} EGP`}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 6,
                    border: "1px solid rgba(0,0,0,0.1)",
                    background: "white",
                    fontSize: "0.9rem",
                    outline: "none"
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  placeholder={`${t.max} EGP`}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 6,
                    border: "1px solid rgba(0,0,0,0.1)",
                    background: "white",
                    fontSize: "0.9rem",
                    outline: "none"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Area Range */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: "block",
              marginBottom: 8,
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--navy)"
            }}>
              {t.areaRange}
            </label>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <input
                  type="number"
                  value={filters.minArea}
                  onChange={(e) => handleFilterChange("minArea", e.target.value)}
                  placeholder={`${t.min} m²`}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 6,
                    border: "1px solid rgba(0,0,0,0.1)",
                    background: "white",
                    fontSize: "0.9rem",
                    outline: "none"
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="number"
                  value={filters.maxArea}
                  onChange={(e) => handleFilterChange("maxArea", e.target.value)}
                  placeholder={`${t.max} m²`}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 6,
                    border: "1px solid rgba(0,0,0,0.1)",
                    background: "white",
                    fontSize: "0.9rem",
                    outline: "none"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Rooms and Baths */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
            marginBottom: 20
          }}>
            <div>
              <label style={{
                display: "block",
                marginBottom: 8,
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--navy)"
              }}>
                {t.rooms}
              </label>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="number"
                    value={filters.minRooms}
                    onChange={(e) => handleFilterChange("minRooms", e.target.value)}
                    placeholder={t.min}
                    min="1"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 6,
                      border: "1px solid rgba(0,0,0,0.1)",
                      background: "white",
                      fontSize: "0.9rem",
                      outline: "none"
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    type="number"
                    value={filters.maxRooms}
                    onChange={(e) => handleFilterChange("maxRooms", e.target.value)}
                    placeholder={t.max}
                    min="1"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 6,
                      border: "1px solid rgba(0,0,0,0.1)",
                      background: "white",
                      fontSize: "0.9rem",
                      outline: "none"
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label style={{
                display: "block",
                marginBottom: 8,
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--navy)"
              }}>
                {t.baths}
              </label>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="number"
                    value={filters.minBaths}
                    onChange={(e) => handleFilterChange("minBaths", e.target.value)}
                    placeholder={t.min}
                    min="1"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 6,
                      border: "1px solid rgba(0,0,0,0.1)",
                      background: "white",
                      fontSize: "0.9rem",
                      outline: "none"
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    type="number"
                    value={filters.maxBaths}
                    onChange={(e) => handleFilterChange("maxBaths", e.target.value)}
                    placeholder={t.max}
                    min="1"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 6,
                      border: "1px solid rgba(0,0,0,0.1)",
                      background: "white",
                      fontSize: "0.9rem",
                      outline: "none"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: "block",
              marginBottom: 12,
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--navy)"
            }}>
              {t.amenities}
            </label>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8
            }}>
              {t.amenityOptions.map(amenity => (
                <button
                  key={amenity}
                  onClick={() => handleAmenityToggle(amenity)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 20,
                    border: filters.amenities.includes(amenity)
                      ? "2px solid var(--gold)"
                      : "1px solid rgba(0,0,0,0.1)",
                    background: filters.amenities.includes(amenity)
                      ? "rgba(201,168,76,0.1)"
                      : "white",
                    color: filters.amenities.includes(amenity)
                      ? "var(--navy)"
                      : "var(--gray)",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    transition: "all 0.3s ease",
                    fontWeight: filters.amenities.includes(amenity) ? 600 : 400
                  }}
                  onMouseEnter={(e) => {
                    if (!filters.amenities.includes(amenity)) {
                      e.currentTarget.style.borderColor = "var(--gold)";
                      e.currentTarget.style.background = "rgba(201,168,76,0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!filters.amenities.includes(amenity)) {
                      e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
                      e.currentTarget.style.background = "white";
                    }
                  }}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: "flex",
            gap: 12,
            justifyContent: "flex-end"
          }}>
            <button
              onClick={handleClearFilters}
              style={{
                padding: "12px 24px",
                background: "transparent",
                color: "var(--gray)",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--gray)";
                e.currentTarget.style.background = "rgba(0,0,0,0.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <X size={16} />
              {t.clear}
            </button>
            <button
              onClick={handleApplyFilters}
              disabled={loading}
              style={{
                padding: "12px 24px",
                background: loading ? "rgba(201,168,76,0.5)" : "var(--gold)",
                color: "var(--navy)",
                border: "none",
                borderRadius: 6,
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "0.95rem",
                fontWeight: 600,
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = "var(--navy)";
                  e.currentTarget.style.color = "var(--gold)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = "var(--gold)";
                  e.currentTarget.style.color = "var(--navy)";
                }
              }}
            >
              {loading ? <LoadingSpinner size={16} thickness={2} trackColor="rgba(10,22,40,.3)" /> : t.apply}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
