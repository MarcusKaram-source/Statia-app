import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function TermsOfService() {
  const { lang } = useAppContext();
  const navigate = useNavigate();

  const content = {
    en: {
      title: "Terms of Service",
      lastUpdated: "Last Updated: January 15, 2025",
      sections: [
        {
          heading: "1. Acceptance of Terms",
          text: "By accessing and using Statia Luxury Real Estate, you accept and agree to be bound by terms and provisions of this agreement."
        },
        {
          heading: "2. Use License",
          text: "Permission is granted to temporarily download one copy of materials on Statia Luxury Real Estate for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title."
        },
        {
          heading: "3. User Accounts",
          text: "You are responsible for maintaining confidentiality of your account and password and for restricting access to your account. You agree to accept responsibility for all activities that occur under your account or password."
        },
        {
          heading: "4. Property Listings",
          text: "All property listings are provided for informational purposes only. While we strive to keep information accurate and up-to-date, we make no representations or warranties of any kind about the completeness, accuracy, reliability, or availability of information."
        },
        {
          heading: "5. Limitation of Liability",
          text: "In no event shall Statia Luxury Real Estate be liable for any damages arising out of or in connection with the use or inability to use the materials on our website, even if Statia Luxury Real Estate has been advised of the possibility of such damages."
        },
        {
          heading: "6. Governing Law",
          text: "These terms and conditions are governed by and construed in accordance with laws of Egypt and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location."
        }
      ]
    },
    ar: {
      title: "شروط الاستخدام",
      lastUpdated: "آخر تحديث: 15 يناير 2025",
      sections: [
        {
          heading: "1. قبول الشروط",
          text: "من خلال الوصول إلى استخدام ستاتيا للعقارات الفاخرة، فإنك تقبل وتوافق على الالتزام بشروط وأحكام هذا الاتفاق."
        },
        {
          heading: "2. رخصة الاستخدام",
          text: "يمنح الإذن مؤقتاً بتنزيل نسخة واحدة من المواد الموجودة على ستاتيا للعقارات الفاخرة للعرض الشخصي غير التجاري فقط. هذا منح رخصة، وليس نقل ملكية."
        },
        {
          heading: "3. حسابات المستخدمين",
          text: "أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور وتقييد الوصول إلى حسابك. توافق على قبول المسؤولية عن جميع الأنشطة التي تحدث تحت حسابك أو كلمة المرور الخاصة بك."
        },
        {
          heading: "4. قوائم العقارات",
          text: "جميع قوائم العقارات مقدمة لأغراض إعلامية فقط. بينما نسعى للحفاظ على دقة المعلومات وتحديثها، لا نقدم أي تمثيلات أو ضمانات من أي نوع حول اكتمال أو دقة أو موثوقية أو توفر المعلومات."
        },
        {
          heading: "5. تحديد المسؤولية",
          text: "في أي حال من الأحوال، لا تكون ستاتيا للعقارات الفاخرة مسؤولة عن أي أضرار تنشأ عن استخدام أو عدم القدرة على استخدام المواد على موقعنا الإلكتروني، حتى إذا تم إخطار ستاتيا للعقارات الفاخرة بإمكانية حدوث مثل هذه الأضرار."
        },
        {
          heading: "6. القانون الحاكم",
          text: "تخضع هذه الشروط والأحكام لقوانين مصر ويتم تفسيرها وفقاً لها، وتخضع بشكل لا رجعة فيه للسلطة القضائية الحصرية للمحاكم في تلك الدولة أو الموقع."
        }
      ]
    }
  };

  const t = content[lang];

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", paddingTop: 80 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 5%" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            color: "var(--gold)",
            cursor: "pointer",
            fontSize: ".9rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          ← {lang === "en" ? "Back to Home" : "العودة للرئيسية"}
        </button>

        <h1 style={{
          fontFamily: "var(--serif)",
          fontSize: "2.5rem",
          color: "var(--navy)",
          fontWeight: 300,
          marginBottom: "1rem"
        }}>
          {t.title}
        </h1>

        <p style={{
          color: "var(--gray)",
          fontSize: ".9rem",
          marginBottom: "2.5rem"
        }}>
          {t.lastUpdated}
        </p>

        {t.sections.map((section, index) => (
          <div key={index} style={{ marginBottom: "2rem" }}>
            <h2 style={{
              fontFamily: "var(--serif)",
              fontSize: "1.5rem",
              color: "var(--navy)",
              fontWeight: 400,
              marginBottom: "0.75rem"
            }}>
              {section.heading}
            </h2>
            <p style={{
              color: "var(--gray)",
              fontSize: "1rem",
              lineHeight: 1.8
            }}>
              {section.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}