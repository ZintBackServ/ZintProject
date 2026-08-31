import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import { FaFacebook, FaPhoneAlt, FaInstagramSquare, FaWhatsapp, FaYoutube, FaLinkedin } from "react-icons/fa";
import { CiMail, CiLocationOn } from "react-icons/ci";
import { RiTelegram2Fill } from "react-icons/ri";

// ── Brand Palette ─────────────────────────────────
const DarkPurple = "#8E1387";
const PrimaryPurple = "#B11FA8";
const BLUE = "#53BFEA";
const GREEN = "#45B51D";

// Light tints (used for backgrounds / chips)
const PPL = "#FCE8FB";   // PrimaryPurple light
const DPL = "#F7EAF7";   // DarkPurple light
const BLL = "#E8F7FD";   // Blue light
const GRL = "#EBF8E4";   // Green light

// ── Static data ───────────────────────────────────
const COMPANY_LINKS = [
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
  // { label: "FAQ",             to: "/faq"     },
  { label: "Privacy Policy", to: "/PrivacyPolicy" },
  { label: "Refund Policy", to: "/RefundPolicy" },
  { label: "Terms & Conditions", to: "/TermsConditions" },
  { label: "Career Services", to: "/careers" },
];

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/zint-institute-05a4a12a8/", bg: "#0A66C2", icon: <FaLinkedin size={14} /> },
  { label: "YouTube", href: "https://youtube.com/@zintinstitute", bg: "#FF0000", icon: <FaYoutube size={14} /> },
  { label: "Facebook", href: "https://www.facebook.com/share/1Cwfquebni/", bg: "#1877F2", icon: <FaFacebook size={14} /> },
  { label: "Instagram", href: "https://www.instagram.com/zintinstitute/", bg: "#E1306C", icon: <FaInstagramSquare size={14} /> },
  { label: "Telegram", href: "https://t.me/zintinstitute", bg: "#26A5E4", icon: <RiTelegram2Fill size={14} /> },
  { label: "WhatsApp", href: "https://chat.whatsapp.com/BbUHk9fOxCa7Z5aEeNiYna", bg: "#25D366", icon: <FaWhatsapp size={14} /> },
];

// ── Column title ──────────────────────────────────
const ColTitle = ({ children }) => (
  <p style={{
    fontSize: 10, fontWeight: 700, textTransform: "uppercase",
    letterSpacing: "0.12em", color: DarkPurple,
    borderBottom: `2px solid ${PrimaryPurple}44`,
    paddingBottom: 8, marginBottom: 16, display: "inline-block",
  }}>
    {children}
  </p>
);

// ── Footer ────────────────────────────────────────
const Footer = () => {
  const navigate = useNavigate();
  const { data, loading } = useContext(DataContext);
  const courses = data?.courses || [];

  // All unique categories from course data
  const allCategories = [
    ...new Map(
      courses
        .filter((c) => c.category?.categoryName)
        .map((c) => [c.category._id, { id: c.category._id, name: c.category.categoryName, type: c.type }])
    ).values(),
  ];

  const handleCategoryClick = (catName, type) => {
    navigate("/courses", { state: { activeType: type, activeCategory: catName } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer style={{
      width: "100%",
      background: "#fff",
      color: "#4b4060",
      fontFamily: "'Poppins', sans-serif",
      borderTop: `3px solid ${PrimaryPurple}22`,
    }}>
      <style>{`
        .foot-link { color: #5c3559; font-size: 13px; text-decoration: none; transition: color 0.18s ease; display: inline-flex; align-items: center; gap: 5px; }
        .foot-link:hover { color: ${PrimaryPurple}; }
        .foot-cat-btn {
          text-align: left; font-size: 13px; color: #5c3559;
          background: #faf5fa; border: 1px solid ${PrimaryPurple}22;
          border-radius: 8px; padding: 7px 12px;
          cursor: pointer; transition: all 0.18s ease; width: 100%;
          font-family: 'Poppins', sans-serif;
        }
        .foot-cat-btn:hover { background: ${PPL}; border-color: ${PrimaryPurple}55; color: ${DarkPurple}; }
        .social-btn { display: flex; align-items: center; gap: 10px; text-decoration: none; transition: all 0.18s ease; }
        .social-btn:hover .social-label { color: ${DarkPurple}; }
        .social-btn:hover .social-icon { transform: scale(1.12); }
        .social-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; transition: transform 0.18s ease; }
        .social-label { font-size: 13px; color: #5c3559; transition: color 0.18s ease; }
        .skel { background: ${PPL}; border-radius: 8px; animation: skelPulse 1.4s ease-in-out infinite; }
        @keyframes skelPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
      `}</style>

      {/* ── TAGLINE BAND ── */}
      <div style={{
        borderBottom: `1px solid ${PrimaryPurple}18`,
        padding: "36px 24px",
        background: `linear-gradient(135deg, ${DPL} 0%, #fff 60%, ${BLL} 100%)`,
      }}>
        <div style={{ maxWidth: 1350, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: PrimaryPurple, marginBottom: 8 }}>
            Zint Institute
          </p>
          <h2 style={{
            fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: 600,
            color: "#1a0019", lineHeight: 1.4, maxWidth: 600, marginBottom: 8,
          }}>
            Where curiosity meets craft —{" "}
            <span style={{ color: PrimaryPurple, fontStyle: "italic" }}>build skills that outlast every trend.</span>
          </h2>
          <p style={{ fontSize: 13, color: "#9b7d99", fontWeight: 300 }}>
            Invest in knowledge today. The returns compound forever.
          </p>
        </div>
      </div>

      {/* ── MAIN GRID (Equal Visual Gap Between All Columns) ── */}
      <div style={{
        borderBottom: `1px solid ${PrimaryPurple}18`,
        padding: "26px 20px",
      }}>
        <div
          className="flex flex-col md:flex-row flex-wrap justify-between items-start gap-5"
          style={{ maxWidth: 1380, margin: "0 auto" }}
        >

          {/* Brand + Contact */}
          <div className="w-full sm:w-auto flex-1 min-w-[210px] max-w-[260px]">
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#1a0019", letterSpacing: "-0.01em" }}>
                Zint<span style={{ color: BLUE }}>Institute</span>
              </span>
            </div>

            {/* Contact */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a href="tel:+918965975222" className="foot-link">
                <FaPhoneAlt size={13} style={{ color: PrimaryPurple }} />
                +91 8965975222
              </a>
              <a href="tel:+918817872737" className="foot-link">
                <FaPhoneAlt size={13} style={{ color: PrimaryPurple }} />
                +91 8817872737
              </a>
              <a href="tel:+919754078816" className="foot-link">
                <FaPhoneAlt size={13} style={{ color: PrimaryPurple }} />
                +91 9754078816
              </a>
              <span className="foot-link" style={{ cursor: "default" }}>
                <CiLocationOn size={15} style={{ color: PrimaryPurple }} />
                Main Campus, Gwalior
              </span>
              <a href="mailto:info@zinstitute.in" className="foot-link">
                <CiMail size={15} style={{ color: PrimaryPurple }} />
                info@zinstitute.in
              </a>
            </div>

            {/* ISO badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginTop: 18,
              background: `${PrimaryPurple}0a`, border: `1px solid ${PrimaryPurple}22`,
              borderRadius: 10, padding: "8px 12px", fontSize: 11, color: "#9b7d99",
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: `linear-gradient(135deg, ${PrimaryPurple}, ${BLUE})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: 8,
              }}>ISO</div>
              ISO 9001:2015 Certified
            </div>
          </div>

          {/* Company Links */}
          <div className="w-full sm:w-auto flex-1 min-w-[150px] max-w-[190px]">
            <ColTitle>Company</ColTitle>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {COMPANY_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="foot-link">
                    <span style={{ color: `${PrimaryPurple}88`, fontWeight: 600 }}>›</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div className="w-full sm:w-auto flex-1 min-w-[150px] max-w-[190px]">
            <ColTitle>Follow Us</ColTitle>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {SOCIAL_LINKS.map(({ label, href, icon, bg }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="social-btn">
                    <span className="social-icon" style={{ background: bg }}>{icon}</span>
                    <span className="social-label">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Info */}
          <div className="w-full sm:w-auto flex-1 min-w-[180px] max-w-[220px]">
            <ColTitle>Quick Info</ColTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Batch Size", value: "≤ 20 students", color: PrimaryPurple, bg: PPL },
                { label: "Mode", value: "Online & Offline", color: BLUE, bg: BLL },
                { label: "Support", value: "6-month post-placement", color: GREEN, bg: GRL },
                { label: "Cert.", value: "SSC NASSCOM", color: DarkPurple, bg: DPL },
              ].map(({ label, value, color, bg }) => (
                <div key={label} style={{
                  background: bg, border: `1px solid ${color}22`,
                  borderRadius: 8, padding: "8px 12px",
                  borderLeft: `3px solid ${color}`,
                }}>
                  <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9b7d99", marginBottom: 2 }}>{label}</p>
                  <p style={{ fontSize: 12.5, fontWeight: 500, color: "#1a0019" }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Map — Find Us ── */}
          <div className="w-full sm:w-auto flex-1 min-w-[240px] max-w-[290px]">
            <p style={{
              fontSize: 10, fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.12em", color: DarkPurple,
              borderBottom: `2px solid ${PrimaryPurple}44`,
              paddingBottom: 8, marginBottom: 12, display: "inline-block",
            }}>Find Us</p>
            <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", border: `2px solid ${PrimaryPurple}22`, boxShadow: "0 4px 24px rgba(177,31,168,0.08)", height: 260 }}>
              {/* Live Tag */}
              <div style={{
                position: "absolute", top: 10, right: 10, zIndex: 10,
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)",
                borderRadius: 999, padding: "4px 10px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                fontSize: 11, fontWeight: 700, color: "#1a0019",
                border: `1px solid ${PrimaryPurple}22`,
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: PrimaryPurple, display: "inline-block",
                  boxShadow: `0 0 0 3px ${PrimaryPurple}33`,
                }} />
                Zint Institute, Gwalior
              </div>
              <iframe
                title="Zint Institute Campus Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.4530243343556!2d78.16774307509867!3d26.21446578974916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3976c69c7a4b2c63%3A0x444afa05bee254e7!2sZINT%20INSTITUTE!5e0!3m2!1sen!2sin!4v1779522543218!5m2!1sen!2sin"
                style={{ width: "100%", height: "100%", border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>
      </div>

      {/* ── COURSES SECTION ── */}
      <div style={{ padding: "32px 24px", borderBottom: `1px solid ${PrimaryPurple}18` }}>
        <div style={{ maxWidth: 1350, margin: "0 auto" }}>
          <ColTitle>Courses</ColTitle>

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skel" style={{ height: 36 }} />
              ))}
            </div>
          ) : allCategories.length === 0 ? (
            <p style={{ fontSize: 12, color: "#b097af", fontStyle: "italic" }}>No courses available yet.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
              {allCategories.map(({ id, name, type }) => (
                <button key={id} className="foot-cat-btn" onClick={() => handleCategoryClick(name, type)}>
                  <span style={{ color: PrimaryPurple, marginRight: 4, fontWeight: 600 }}>›</span>
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{
        padding: "16px 24px",
        background: `linear-gradient(90deg, ${DPL} 0%, #fff 50%, ${BLL} 100%)`,
      }}>
        <div style={{
          maxWidth: 1350, margin: "0 auto",
          display: "flex", flexWrap: "wrap", alignItems: "center",
          justifyContent: "space-between", gap: 10,
          fontSize: 12, color: "#b097af",
        }}>
          <span>© {new Date().getFullYear()} ZintSkills. All rights reserved.</span>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[["Privacy Policy", "/privacy"], ["Terms & Conditions", "/terms"], ["Refund Policy", "/refund"]].map(
              ([label, to]) => (
                <Link key={to} to={to} className="foot-link" style={{ fontSize: 12 }}>{label}</Link>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


