export const ADMIN_ACCOUNT = { email: "admin@statia.com", password: "Statia@2025", role: "admin", name: "Admin" };
export const INIT_USERS = [{ id: 1, email: "user@statia.com", password: "User@2025", role: "user", name: "Demo User", joined: "2025-01-15" }];

export const DATA = {
  projects: [
    { id: "p1", name: "Azure Crown Residences", nameAr: "أبراج العزيز الملكية", location: "New Cairo, Egypt", locationAr: "القاهرة الجديدة", type: "Apartment", status: "Under Construction", priceEGP: 4500000, priceSAR: 285000, priceAED: 360000, rooms: 3, baths: 2, area: 180, badge: "New Launch", rating: 4.9, description: "Iconic tower offering premium living with panoramic city views and world-class amenities.", amenities: ["Pool", "Gym", "Concierge", "Parking"], img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80" },
    { id: "p2", name: "The Monarch Villas", nameAr: "فيلات الملك", location: "Sheikh Zayed, Egypt", locationAr: "الشيخ زايد", type: "Villa", status: "Ready to Move", priceEGP: 18000000, priceSAR: 1140000, priceAED: 1440000, rooms: 5, baths: 4, area: 540, badge: "Exclusive", rating: 5.0, description: "Regal private villas set within manicured gardens. The pinnacle of suburban luxury.", amenities: ["Private Pool", "Smart Home", "Garden", "Security"], img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=700&q=80" },
    { id: "p3", name: "Riviera Grand", nameAr: "ريفيرا جراند", location: "North Coast, Egypt", locationAr: "الساحل الشمالي", type: "Chalet", status: "Under Construction", priceEGP: 6200000, priceSAR: 393000, priceAED: 496000, rooms: 2, baths: 2, area: 120, badge: "Sea View", rating: 4.8, description: "Mediterranean-inspired chalets with direct beach access and resort-style facilities.", amenities: ["Beach Access", "Pool", "Restaurant", "Marina"], img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=700&q=80" },
    { id: "p4", name: "Capital Heights", nameAr: "العاصمة هايتس", location: "New Capital, Egypt", locationAr: "العاصمة الإدارية", type: "Penthouse", status: "Ready to Move", priceEGP: 12000000, priceSAR: 760000, priceAED: 960000, rooms: 4, baths: 3, area: 320, badge: "Prime Location", rating: 4.7, description: "Sky-high penthouses in Egypt's future capital.", amenities: ["Rooftop Terrace", "Concierge", "Smart Home", "Gym"], img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80" },
    { id: "p5", name: "Saffron Towers", nameAr: "أبراج الزعفران", location: "Heliopolis, Egypt", locationAr: "مصر الجديدة", type: "Apartment", status: "Under Construction", priceEGP: 3200000, priceSAR: 202000, priceAED: 256000, rooms: 2, baths: 1, area: 110, badge: "Hot Deal", rating: 4.6, description: "Contemporary urban living in the heart of historic Heliopolis.", amenities: ["Gym", "Co-working", "Café", "Parking"], img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80" },
    { id: "p6", name: "Palm Serenity Estate", nameAr: "إستيت النخيل", location: "October City, Egypt", locationAr: "مدينة أكتوبر", type: "Villa", status: "Ready to Move", priceEGP: 9500000, priceSAR: 602000, priceAED: 760000, rooms: 4, baths: 3, area: 380, badge: "Garden Villa", rating: 4.8, description: "Serene villa community surrounded by lush greenery.", amenities: ["Private Garden", "Pool", "Club House", "Security"], img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=700&q=80" },
  ],
  leads: [
    { id: 1, name: "Ahmed Al-Rashid", email: "ahmed@email.com", phone: "+20 100 123 4567", project: "Azure Crown", message: "Interested in 3BR unit", date: "2025-03-01", status: "New" },
    { id: 2, name: "Sarah Mitchell", email: "sarah@email.com", phone: "+971 50 987 6543", project: "Monarch Villas", message: "Requesting private viewing", date: "2025-03-02", status: "Contacted" },
    { id: 3, name: "Omar Khalid", email: "omar@email.com", phone: "+966 55 111 2233", project: "Riviera Grand", message: "Sea view unit available?", date: "2025-03-03", status: "New" },
    { id: 4, name: "Layla Hassan", email: "layla@email.com", phone: "+20 111 444 5566", project: "Capital Heights", message: "Penthouse floor plans needed", date: "2025-03-04", status: "Closed" },
  ],
};

export const BADGE = {
  "New Launch": { bg: "#0a1628", color: "#c9a84c", border: "rgba(201,168,76,.4)" },
  "Exclusive": { bg: "#c9a84c", color: "#0a1628", border: "transparent" },
  "Sea View": { bg: "#0d6e8a", color: "#fff", border: "transparent" },
  "Prime Location": { bg: "#1a1a2e", color: "#c9a84c", border: "rgba(201,168,76,.4)" },
  "Hot Deal": { bg: "#e8432d", color: "#fff", border: "transparent" },
  "Garden Villa": { bg: "#2d6a4f", color: "#d8f3dc", border: "transparent" },
};

export const fmtPrice = (p, cur) => {
  const m = { EGP: [p.priceEGP, "EGP"], SAR: [p.priceSAR, "SAR"], AED: [p.priceAED, "AED"] };
  const [v, s] = m[cur] || m.EGP;
  if (v == null) return `EGP ${p.priceEGP.toLocaleString()}`;
  return `${s} ${v.toLocaleString()}`;
};
