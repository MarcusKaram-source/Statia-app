import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function PrivacyPolicy() {
  const { lang } = useAppContext();
  const navigate = useNavigate();

  const content = {
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last Updated: January 15, 2025",
      sections: [
        {
          heading: "1. Information We Collect",
          text: "We collect information you provide directly to us, such as when you create an account, make an enquiry, or contact us. This may include your name, email address, phone number, and other information you choose to provide."
        },
        {
          heading: "2. How We Use Your Information",
          text: "We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to comply with legal obligations."
        },
        {
          heading: "3. Information Sharing",
          text: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law."
        },
        {
          heading: "4. Data Security",
          text: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
        },
        {
          heading: "5. Your Rights",
          text: "You have the right to access, correct, or delete your personal information. You may also opt out of certain communications from us."
        },
        {
          heading: "6. Contact Us",
          text: "If you have any questions about this Privacy Policy, please contact us at privacy@statia.com"
        }
      ]
    },
    ar: {
      title: "سياسة الخصوصية",
      lastUpdated: "آخر تحديث: 15 يناير 2025",
      sections: [
        {
          heading: "1. المعلومات التي نجمعها",
          text: "نجمع المعلومات التي تقدمها لنا مباشرة، مثل عند إنشاء حساب أو تقديم استفسار أو التواصل معنا. قد يشمل ذلك اسمك وعنوان بريدك الإلكتروني ورقم هاتفك والمعلومات الأخرى التي تختار تقديمها."
        },
        {
          heading: "2. كيف نستخدم معلوماتك",
          text: "نستخدم المعلومات التي نجمعها لتقديم وصيانة وتحسين خدماتنا، والتواصل معك، والامتثال للالتزامات القانونية."
        },
        {
          heading: "3. مشاركة المعلومات",
          text: "لا نبيع أو نتداول أو ننقل معلوماتك الشخصية إلى أطراف ثالثة دون موافقتك، إلا كما هو موضح في هذه السياسة أو كما يقتضي القانون."
        },
        {
          heading: "4. أمن البيانات",
          text: "ننفذ تدابير تقنية وتنظيمية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير."
        },
        {
          heading: "5. حقوقك",
          text: "لديك الحق في الوصول إلى معلوماتك الشخصية أو تصحيحها أو حذفها. يمكنك أيضاً إلغاء الاشتراك في بعض الاتصالات منا."
        },
        {
          heading: "6. اتصل بنا",
          text: "إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا على privacy@statia.com"
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
