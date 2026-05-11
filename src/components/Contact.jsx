import { useState } from "react";
import { MessageCircle, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { Lbl } from "./Shared";
import { useAppContext } from "../context/AppContext";
import LoadingSpinner from "./LoadingSpinner";
import { apiFetch } from "../api";

export default function Contact() {
  const { lang, setToast } = useAppContext();
  const labels = {
    en: { title: "Begin Your Journey", sub: "Our advisors are ready to guide you.", name: "Full Name", phone: "Phone", email: "Email Address", msg: "Your Message", send: "Send Enquiry", ok: "Message Received!", okSub: "Our team will contact you within 24 hours.", again: "Send Another" },
    ar: { title: "ابدأ رحلتك", sub: "مستشارونا جاهزون لإرشادك.", name: "الاسم الكامل", phone: "رقم الهاتف", email: "البريد الإلكتروني", msg: "رسالتك", send: "إرسال الاستفسار", ok: "تم استلام رسالتك!", okSub: "سيتواصل معك فريقنا خلال 24 ساعة.", again: "إرسال مجدداً" },
  };
  const t = labels[lang];
  const [form, setForm] = useState({ name: "", phone: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const iS = { width: "100%", padding: "12px 13px", borderRadius: 4, fontSize: ".86rem", fontFamily: "var(--sans)", marginBottom: ".9rem", display: "block" };

  const handleSend = async () => {
    if (!form.name || !form.email) return;
    setSending(true);
    try {
      await apiFetch('/api/leads', { method: 'POST', body: { name: form.name, email: form.email, phone: form.phone, message: form.msg } });
      setSent(true);
      // Reset form after successful submission
      setForm({ name: "", phone: "", email: "", msg: "" });
    } catch (e) {
      console.error("Error submitting contact form:", e);
      setToast({ msg: "Failed to send message. Please try again.", type: "error" });
    } finally {
      setSending(false);
    }
  };

  return (
    <section style={{ background: "linear-gradient(135deg,var(--navy),var(--navy2))", padding: "5rem 5%" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto" }} className="ct-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: "1.3rem" }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,transparent,var(--gold))" }} />
            <span style={{ color: "var(--gold)", fontSize: ".6rem", letterSpacing: ".26em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{lang === "en" ? "Get in Touch" : "تواصل معنا"}</span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,var(--gold),transparent)" }} />
          </div>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.9rem,4vw,2.7rem)", color: "#fff", fontWeight: 300, lineHeight: 1.1, marginBottom: ".9rem" }}>{t.title}</h2>
          <p style={{ color: "rgba(255,255,255,.48)", fontSize: ".9rem", lineHeight: 1.8, marginBottom: "2.25rem" }}>{t.sub}</p>
          {[[<MessageCircle size={18} />, "WhatsApp", "+20 100 000 0000", "#25D366", "rgba(37,211,102,.1)"], [<Phone size={18} />, lang === "en" ? "Phone" : "هاتف", "+20 2 1234 5678", "var(--gold)", "rgba(201,168,76,.1)"], [<Mail size={18} />, lang === "en" ? "Email" : "بريد", "info@statia.com", "var(--gold)", "rgba(201,168,76,.1)"], [<MapPin size={18} />, lang === "en" ? "Office" : "مكتب", "New Cairo, Egypt", "var(--gold)", "rgba(201,168,76,.1)"]].map(([ic, lbl, val, col, bg], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: ".9rem", marginBottom: "1.1rem", cursor: "pointer" }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: bg, border: `1px solid ${col}25`, display: "flex", alignItems: "center", justifyContent: "center", color: col, flexShrink: 0 }}>{ic}</div>
              <div>
                <div style={{ fontSize: ".6rem", color: "rgba(255,255,255,.32)", letterSpacing: ".14em", textTransform: "uppercase" }}>{lbl}</div>
                <div style={{ color: "rgba(255,255,255,.8)", fontSize: ".86rem" }}>{val}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(255,255,255,.04)", backdropFilter: "blur(18px)", border: "1px solid rgba(201,168,76,.15)", borderRadius: 10, padding: "2.5rem" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "2.75rem 0" }}>
              <div style={{ fontSize: "2.4rem", marginBottom: ".9rem" }}>✨</div>
              <h3 style={{ fontFamily: "var(--serif)", color: "var(--gold)", fontSize: "1.65rem", marginBottom: ".5rem" }}>{t.ok}</h3>
              <p style={{ color: "rgba(255,255,255,.42)", fontSize: ".86rem" }}>{t.okSub}</p>
              <button className="btn-o" onClick={() => { setSent(false); setForm({ name: "", phone: "", email: "", msg: "" }); }} style={{ marginTop: "1.6rem", padding: "9px 24px", borderRadius: 4, fontSize: ".81rem" }}>{t.again}</button>
            </div>
          ) : (
            <>
              <h3 style={{ fontFamily: "var(--serif)", color: "#fff", fontSize: "1.4rem", marginBottom: "1.6rem", fontWeight: 400 }}>{t.send}</h3>
              <div className="form-2col">
                {[[t.name, "name"], [t.phone, "phone"]].map(([lbl, k]) => (
                  <div key={k}><Lbl light>{lbl}</Lbl><input id={k} name={k} className="li-dark" style={{ ...iS }} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} /></div>
                ))}
              </div>
              <Lbl light>{t.email}</Lbl>
              <input id="email" name="email" type="email" className="li-dark" style={{ ...iS }} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              <Lbl light>{t.msg}</Lbl>
              <textarea id="msg" name="msg" className="li-dark" style={{ ...iS, height: 105, resize: "vertical" }} value={form.msg} onChange={e => setForm(f => ({ ...f, msg: e.target.value }))} />
              <button className="btn-g" onClick={handleSend} disabled={sending} style={{ borderRadius: 4, padding: 12, width: "100%", fontSize: ".86rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 }}>
                {sending ? <LoadingSpinner size={16} thickness={2} color="var(--navy)" trackColor="rgba(10,22,40,.3)" /> : <>{t.send} <ArrowRight size={14} /></>}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
