import { Search } from "lucide-react";
import { Lbl } from "./Shared";
import { useAppContext } from "../context/AppContext";

export default function SearchBar({ onSearch }) {
  const { lang, filters, setFilters } = useAppContext();
  const labels = {
    en: { search: "Search", location: "Location", price: "Price", beds: "Beds", btn: "Search", ph: "Search projects or locations…", allT: "All Types", anyP: "Any Price", anyR: "Any", allL: "All Locations" },
    ar: { search: "البحث", location: "الموقع", price: "السعر", beds: "الغرف", btn: "بحث", ph: "ابحث عن مشاريع أو مواقع…", allT: "كل الأنواع", anyP: "أي سعر", anyR: "الكل", allL: "كل المواقع" },
  };
  const t = labels[lang];
  const Sel = ({ val, fn, opts }) => (
    <select className="li" value={val} onChange={e => fn(e.target.value)} style={{ width: "100%", padding: "11px 13px", borderRadius: 4, fontSize: ".81rem", appearance: "none", cursor: "pointer" }}>
      {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
  return (
    <section style={{ padding: "0 5%", marginTop: -36, position: "relative", zIndex: 100 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", background: "rgba(255,255,255,.97)", borderRadius: 8, padding: "1.6rem", boxShadow: "0 18px 56px rgba(10,22,40,.13),0 0 0 1px rgba(201,168,76,.16)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto", gap: ".9rem", alignItems: "end" }}>
          <div>
            <Lbl>{t.search}</Lbl>
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--gray)" }} />
              <input className="li" style={{ width: "100%", padding: "11px 13px 11px 38px", borderRadius: 4, fontSize: ".81rem" }} placeholder={t.ph} value={filters.q} onChange={e => setFilters(f => ({ ...f, q: e.target.value }))} />
            </div>
          </div>
          <div><Lbl>Type</Lbl><Sel val={filters.type} fn={v => setFilters(f => ({ ...f, type: v }))} opts={[["", t.allT], ["Apartment", "Apartment"], ["Villa", "Villa"], ["Chalet", "Chalet"], ["Penthouse", "Penthouse"]]} /></div>
          <div><Lbl>{t.location}</Lbl><Sel val={filters.loc} fn={v => setFilters(f => ({ ...f, loc: v }))} opts={[["", t.allL], ["New Cairo", "New Cairo"], ["Sheikh Zayed", "Sheikh Zayed"], ["North Coast", "North Coast"], ["New Capital", "New Capital"], ["October City", "October City"]]} /></div>
          <div><Lbl>{t.price}</Lbl><Sel val={filters.price} fn={v => setFilters(f => ({ ...f, price: v }))} opts={[["", t.anyP], ["low", "< 5M EGP"], ["mid", "5–10M"], ["high", "> 10M"]]} /></div>
          <div><Lbl>{t.beds}</Lbl><Sel val={filters.rooms} fn={v => setFilters(f => ({ ...f, rooms: v }))} opts={[["", t.anyR], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4+"]]} /></div>
          <button className="btn-g" onClick={onSearch} style={{ borderRadius: 4, padding: "11px 22px", fontSize: ".81rem", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
            <Search size={13} />{t.btn}
          </button>
        </div>
      </div>
    </section>
  );
}