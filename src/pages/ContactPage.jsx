import Contact from "../components/Contact";
import { useAppContext } from "../context/AppContext";

export default function ContactPage() {
  const { lang } = useAppContext();
  return (
    <div style={{ paddingTop: 80 }}>
      <div style={{ background: "linear-gradient(135deg,var(--navy),var(--navy2))", padding: "4.25rem 5% 3rem", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "3rem", color: "#fff", fontWeight: 300 }}>
          {lang === "en" ? "Contact Us" : "تواصل معنا"}
        </h1>
      </div>
      <Contact />
    </div>
  );
}
