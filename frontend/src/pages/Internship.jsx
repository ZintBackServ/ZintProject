import { useState, useEffect, useRef } from "react";
import { usePageMeta } from "../hooks/usePageMeta";
import SampleCertificateImg from "../assets/SampleCertificate.webp";

// ── Brand Colors ───────────────────────────────────
const DP  = "#8E1387";
const PP  = "#B11FA8";
const BL  = "#53BFEA";
const GR  = "#45B51D";
const PPL = "#FCE8FB";
const DPL = "#F7EAF7";
const BLL = "#E8F7FD";
const GRL = "#EBF8E4";

const technologies = [
  { name: "Artificial Intelligence", icon: "🤖", accent: PP, bg: PPL },
  { name: "Generative AI",           icon: "✨", accent: DP, bg: DPL },
  { name: "Machine Learning",        icon: "🧠", accent: BL, bg: BLL },
  { name: "MERN Stack",              icon: "🌐", accent: GR, bg: GRL },
  { name: "Data Analytics",          icon: "📊", accent: PP, bg: PPL },
  { name: "Java FullStack",          icon: "☕", accent: BL, bg: BLL },
  { name: "Python & EDA",            icon: "🐍", accent: GR, bg: GRL },
];

const benefits = [
  { icon: "🏛️", title: "Govt. Recognized",  desc: "SSC NASSCOM certified certificate accepted nationwide" },
  { icon: "👨‍💼", title: "Industry Experts",  desc: "Learn from working professionals with 10+ years experience" },
  { icon: "💼", title: "Live Projects",      desc: "Hands-on experience with real-world industry projects" },
  { icon: "🎓", title: "Placement Support", desc: "Resume building, mock interviews & job referrals" },
  { icon: "🤝", title: "Mentorship",         desc: "1-on-1 guidance from dedicated mentors throughout" },
  { icon: "📜", title: "Certificate",        desc: "Verifiable digital certificate upon completion" },
];

const DEGREES   = ["School","BE / B.Tech","M.Tech","BCA","MCA","BBA","MBA","B.Com","B.Sc","Others"];
const DURATIONS = ["30 Days","45 Days","60 Days","90 Days"];

const stats = [
  { value: "5000+", label: "Alumni" },
  { value: "98%",   label: "Satisfaction" },
  { value: "30",    label: "Days Min." },
  { value: "500+",  label: "Companies" },
];

const roadmap = [
  { day:"Day 1–5",    title:"Foundations",     desc:"Setup dev environment, Python basics, AI/ML fundamentals.", dot:BL },
  { day:"Day 6–12",   title:"Deep Dive",        desc:"Generative AI models, data pipelines, EDA & visualization.", dot:PP },
  { day:"Day 13–22",  title:"Project Build",    desc:"Hands-on real-world project with mentorship sessions.",      dot:DP },
  { day:"Day 23–28",  title:"Polish & Present", desc:"Code reviews, documentation, portfolio presentation.",       dot:BL },
  { day:"Day 29–30",  title:"Certification",    desc:"Final assessment & SSC NASSCOM certificate issuance.",       dot:GR },
];

const CATEGORY_URL = `${import.meta.env.VITE_API_URL}/category/getAllCategories`;
const REGISTER_URL = `${import.meta.env.VITE_API_URL}/internshipRegistration/addInternshipRegistration`;
const PROFILE_URL  = `${import.meta.env.VITE_API_URL}/user/me`;

const HERO_IMAGE = "https://images.unsplash.com/photo-1758270704689-2850704b7338?fm=jpg&q=80&w=1200&auto=format&fit=crop";

// ── Safe fetch helper (handles empty/non-JSON bodies safely) ─────
async function safeFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      credentials: "include",
    },
  });
  const raw = await res.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { /* not JSON */ }
  if (!res.ok) throw new Error(data?.msg || `Request failed with status ${res.status}`);
  return data;
}

// ── Animated counter ──────────────────────────────
function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const num  = parseInt(target.replace(/\D/g, ""));
    let cur    = 0;
    const step = Math.ceil(num / 60);
    const t    = setInterval(() => {
      cur += step;
      if (cur >= num) { setCount(num); clearInterval(t); } else setCount(cur);
    }, 25);
    return () => clearInterval(t);
  }, [started, target]);

  return <span ref={ref}>{count}{target.replace(/[0-9]/g, "")}</span>;
}

// ── Reveal on scroll ──────────────────────────────
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

// ── Reusable input focus handlers ─────────────────
const onFocus = (e) => { e.target.style.borderColor = PP; e.target.style.boxShadow = `0 0 0 3px ${PP}1c`; };
const onBlur  = (e) => { e.target.style.borderColor = "#e8d8e7"; e.target.style.boxShadow = "none"; };

const arrow = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%231a0019' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 14px center",
  paddingRight: 38,
  appearance: "none",
  cursor: "pointer",
};

// ── Main component ────────────────────────────────
export default function ZInstituteInternship() {
  usePageMeta(
    "Internship",
    "Apply for internships at Zint Computer Education Institute, Gwalior. AI, ML, MERN Stack, Data Analytics, Java & Python internship programs with certificate."
  );
  const [form, setForm]         = useState({ name:"", email:"", phone:"", degree:"", courseCategory:"", course:"", duration:"" });
  const [submitted, setSubmitted]   = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadCats]  = useState(true);
  const [catError, setCatError]     = useState("");
  const [submitError, setSubErr]    = useState("");
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);

  // ── Login/profile state — for autofill + lock ──
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // Fetch logged-in user's profile (if any) and autofill locked fields
  useEffect(() => {
    (async () => {
          if (!token) { setProfileLoading(false); return; }
      try {
        const data = await safeFetch(PROFILE_URL);
        const user = data?.data;
        if (user) {
          setIsLoggedIn(true);
          setForm(p => ({
            ...p,
            name: `${user.firstName} ${user.lastName || ""}`.trim(),
            email: user.email || "",
            phone: user.contactNo || "",
          }));
        }
      } catch {
        setIsLoggedIn(false);
      } finally {
        setProfileLoading(false);
      }
    })();
  }, []);

  // Fetch categories (embedded courses array)
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(CATEGORY_URL);
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : data.categories || data.data || []);
      } catch (err) {
        console.error(err);
        setCatError("Could not load categories. Please refresh.");
      } finally {
        setLoadCats(false);
      }
    })();
  }, []);

  const selectedCat      = categories.find(c => c._id === form.courseCategory);
  const coursesForCat    = selectedCat?.courses || [];

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setSubErr(""); };
  const changeCat = v  => { setForm(p => ({ ...p, courseCategory: v, course: "" })); setSubErr(""); };

  const scrollToForm = () =>
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);

  const handleSubmit = async () => {
    const { name, email, phone, degree, courseCategory, course, duration } = form;
    if (!isLoggedIn && (!name || !email || !phone)) { setSubErr("Full name, email, and phone are required."); return; }
    if (!courseCategory || !course || !duration) { setSubErr("Course Category, Course, and Duration are mandatory."); return; }

    setSubmitting(true); setSubErr("");
    try {
      // When logged in, identity fields are enforced server-side from the
      // account anyway — we still send what's on screen, but the backend
      // ignores it and uses req.user's real data instead.
      const payload = isLoggedIn
        ? { degree, category: courseCategory, course, duration }
        : { fullName: name, email, phone, degree, category: courseCategory, course, duration };

      await safeFetch(REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch (err) {
      setSubErr(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const lockedInputStyle = {
    background: "#f3eef3",
    color: "#8a7288",
    cursor: "not-allowed",
    borderColor: "#e8d8e7",
  };

  return (
    <>
      <style>{`
        @keyframes zp-fadeDown { from{opacity:0;transform:translateY(-14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes zp-float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes zp-pulse    { 0%,100%{box-shadow:0 0 0 0 ${PP}55} 50%{box-shadow:0 0 0 10px ${PP}00} }
        @keyframes zp-spin     { to{transform:rotate(360deg)} }
        @keyframes zp-slideUp  { from{opacity:0;transform:translateY(28px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

        .zint-page {
          font-family: 'Poppins', sans-serif;
          background: #ffffff;
          color: #1a0019;
          overflow-x: hidden;
          box-sizing: border-box;
        }
        .zint-page *, .zint-page *::before, .zint-page *::after {
          box-sizing: inherit;
        }

        .zint-page section { padding: 90px 24px; }
        @media (max-width: 640px) { .zint-page section { padding: 56px 16px; } }

        .zint-page .zp-fade-down  { animation: zp-fadeDown 0.6s ease both; }
        .zint-page .zp-float      { animation: zp-float 5s ease-in-out infinite; }
        .zint-page .zp-pulse      { animation: zp-pulse 2s ease-in-out infinite; }
        .zint-page .zp-slide-up   { animation: zp-slideUp 0.45s ease both; }

        .zint-page .btn-pri {
          background: linear-gradient(135deg, ${DP}, ${PP});
          color: #fff; border: none; cursor: pointer;
          font-family: 'Poppins', sans-serif; font-weight: 600;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .zint-page .btn-pri:hover   { transform: translateY(-2px); box-shadow: 0 10px 28px ${PP}44; }
        .zint-page .btn-pri:active  { transform: translateY(0); }
        .zint-page .btn-pri:disabled{ cursor: not-allowed; opacity: 0.7; transform: none; }

        .zint-page .btn-out {
          background: #fff; color: ${PP};
          border: 1.5px solid ${PP}55; cursor: pointer;
          font-family: 'Poppins', sans-serif; font-weight: 500;
          transition: all 0.2s ease;
        }
        .zint-page .btn-out:hover { border-color: ${PP}; background: ${PPL}; transform: translateY(-2px); }

        .zint-page .zcard {
          background: #fff; border: 1px solid ${PP}18;
          border-radius: 16px; transition: all 0.3s ease;
        }
        .zint-page .zcard:hover { box-shadow: 0 10px 32px ${PP}1c; transform: translateY(-4px); border-color: ${PP}44; }

        .zint-page input, .zint-page select {
          font-family: 'Poppins', sans-serif;
          background: #faf5fa; border: 1.5px solid #e8d8e7;
          border-radius: 10px; padding: 12px 14px;
          width: 100%; font-size: 14px; color: #1a0019;
          outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .zint-page input:focus, .zint-page select:focus {
          border-color: ${PP}; box-shadow: 0 0 0 3px ${PP}1c; background: #fff;
        }
        .zint-page input::placeholder { color: #b097af; }
        .zint-page select:disabled, .zint-page input:disabled { opacity: 0.8; cursor: not-allowed; }
        .zint-page label {
          font-size: 13px; color: #7a4e77; font-weight: 500;
          display: block; margin-bottom: 6px;
        }

        .zint-page .ztag {
          display: inline-block; padding: 6px 14px; border-radius: 999px;
          background: ${PPL}; color: ${DP}; font-size: 13px; font-weight: 500;
          border: 1px solid ${PP}33; transition: all 0.2s ease; cursor: default;
        }
        .zint-page .ztag:hover { background: ${PP}; color: #fff; transform: scale(1.05); }

        .zint-page .zpill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 14px; border-radius: 999px;
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.04em; text-transform: uppercase;
        }

        .zint-page .zdivider { width: 40px; height: 3px; border-radius: 2px; background: ${PP}; margin: 14px auto 0; }

        .zint-page .err-box {
          background: #fef2f2; border: 1px solid #fecaca; color: #dc2626;
          border-radius: 10px; padding: 10px 14px; font-size: 13px; margin-bottom: 16px;
        }
        .zint-page .info-box {
          background: ${PPL}; border: 1px solid ${PP}33; color: ${DP};
          border-radius: 10px; padding: 10px 14px; font-size: 12.5px; margin-bottom: 16px;
        }

        .zint-page .zspinner {
          width: 16px; height: 16px;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: #fff; border-radius: 50%;
          animation: zp-spin 0.7s linear infinite;
          display: inline-block; flex-shrink: 0;
        }

        /* Hero split layout */
        .zhero-grid {
          display: grid;
          grid-template-columns: 1fr 1.05fr;
          gap: 56px;
          align-items: center;
          max-width: 1180px;
          width: 100%;
          margin: 0 auto;
        }
        @media (max-width: 900px) {
          .zhero-grid { grid-template-columns: 1fr; gap: 40px; }
          .zhero-img-wrap { order: -1; max-width: 420px; margin: 0 auto; }
        }
      `}</style>

      <div className="zint-page">

        {/* ── HERO (two-column: photo left, content right) ── */}
        <section style={{
          minHeight: "88vh", display: "flex", alignItems: "center", justifyContent: "center",
          background: `linear-gradient(180deg, #fafafa 0%, #fff 100%)`,
          paddingTop: 60,
        }}>
          <div className="zhero-grid">

            {/* Left — photo */}
            <div className="zhero-img-wrap zp-fade-down" style={{ position: "relative" }}>
              <div style={{
                position: "absolute", inset: "-14px -14px auto auto", width: "70%", height: "70%",
                background: `linear-gradient(135deg, ${PP}22, ${BL}22)`, borderRadius: 24, zIndex: 0,
              }} />
              <div style={{
                position: "relative", zIndex: 1, borderRadius: 24, overflow: "hidden",
                boxShadow: `0 24px 60px ${PP}22`, border: "6px solid #fff",
              }}>
                <img
                  src={HERO_IMAGE}
                  alt="Students from Zint Institute smiling together on campus"
                  style={{ width: "100%", height: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }}
                />
              </div>
              <div style={{
                position: "absolute", bottom: -18, left: -18, zIndex: 2,
                background: "#fff", borderRadius: 16, padding: "14px 18px",
                boxShadow: `0 12px 32px ${PP}22`, border: `1px solid ${PP}18`,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{ fontSize: 24 }}>🎓</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1a0019" }}>5000+</div>
                  <div style={{ fontSize: 10.5, color: "#b097af", textTransform: "uppercase", letterSpacing: "0.06em" }}>Happy Alumni</div>
                </div>
              </div>
            </div>

            {/* Right — content */}
            <div style={{ textAlign: "left" }}>
              <span className="zpill zp-fade-down" style={{ background: PPL, color: DP, border: `1px solid ${PP}44`, marginBottom: 24 }}>
                🚀 Cohort 2026 – Applications Open
              </span>

              <h1 className="zp-fade-down" style={{
                fontSize: "clamp(34px,4.6vw,58px)", fontWeight: 700, lineHeight: 1.08,
                letterSpacing: "-0.02em", color: "#1a0019", margin: "0 0 18px",
                animationDelay: "0.1s",
              }}>
                Launch Your<br />
                <span style={{ color: PP }}>Tech Career</span><br />
                <span style={{ fontSize: "clamp(22px,3vw,36px)", color: "#7a4e77", fontWeight: 500 }}>in 30 Days.</span>
              </h1>

              <p className="zp-fade-down" style={{ fontSize: 16.5, color: "#7a4e77", maxWidth: 480, lineHeight: 1.65, marginBottom: 30, fontWeight: 300, animationDelay: "0.2s" }}>
                India's most immersive training & project-based internship program. Real AI projects, real mentors, real results.
              </p>

              <div className="zp-fade-down" style={{ display: "flex", gap: 12, flexWrap: "wrap", animationDelay: "0.3s" }}>
                <button onClick={scrollToForm} className="btn-pri zp-pulse" style={{ fontSize: 15.5, padding: "14px 30px", borderRadius: 12 }}>
                  Register for Internship
                </button>
                <button onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })} className="btn-out" style={{ fontSize: 14.5, padding: "13px 22px", borderRadius: 12 }}>
                  View Curriculum ↓
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP (moved below hero for the split layout) ── */}
        <section style={{ padding: "0 24px 70px", background: "#fff" }}>
          <div className="zp-fade-down" style={{
            display: "grid", gridTemplateColumns: "repeat(4,1fr)", margin: "0 auto",
            maxWidth: 780, width: "100%", border: `1px solid ${PP}22`, borderRadius: 16,
            overflow: "hidden",
          }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{ padding: "22px 14px", textAlign: "center", borderLeft: i > 0 ? `1px solid ${PP}1a` : "none" }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: PP, letterSpacing: "-0.02em" }}>
                  <AnimatedCounter target={s.value} />
                </div>
                <div style={{ fontSize: 11, color: "#b097af", textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TECHNOLOGIES ── */}
        <section style={{ background: "#fafafa" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Reveal>
              <div style={{ textAlign: "center", marginBottom: 52 }}>
                <span className="zpill" style={{ background: BLL, color: "#1477a0", border: `1px solid ${BL}44`, marginBottom: 14 }}>What You'll Master</span>
                <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, letterSpacing: "-0.02em", color: "#1a0019" }}>Cutting-Edge Technologies</h2>
                <div className="zdivider" />
              </div>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 16 }}>
              {technologies.map((tech, i) => (
                <Reveal key={tech.name} delay={i * 0.05}>
                  <div className="zcard" style={{ padding: 24, height: "100%" }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: tech.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14, border: `1px solid ${tech.accent}33` }}>
                      {tech.icon}
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1a0019", marginBottom: 8 }}>{tech.name}</h3>
                    <div style={{ height: 2, width: 32, background: tech.accent, borderRadius: 2, marginBottom: 12 }} />
                    <p style={{ fontSize: 13, color: "#7a4e77", lineHeight: 1.6, fontWeight: 300 }}>
                      Industry-aligned curriculum with hands-on project work and expert-led sessions.
                    </p>
                  </div>
                </Reveal>
              ))}
              <Reveal delay={0.35}>
                <div className="zcard zp-float" style={{ padding: 24, background: `linear-gradient(135deg,${DP},${PP})`, border: "none", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 30, marginBottom: 10 }}>🎯</div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 8 }}>Your Pick</h3>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, fontWeight: 300 }}>Choose the track that aligns with your career goals.</p>
                  </div>
                  <button onClick={scrollToForm}
                    style={{ marginTop: 20, background: "#fff", color: PP, border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "transform 0.2s", fontFamily: "Poppins, sans-serif" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                    Explore All Tracks →
                  </button>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <section style={{ background: "#fff" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Reveal>
              <div style={{ textAlign: "center", marginBottom: 52 }}>
                <span className="zpill" style={{ background: GRL, color: "#2d7a10", border: `1px solid ${GR}44`, marginBottom: 14 }}>Why Zint Institute</span>
                <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, letterSpacing: "-0.02em", color: "#1a0019" }}>Everything You Need to Succeed</h2>
                <div className="zdivider" style={{ background: GR }} />
              </div>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 16 }}>
              {benefits.map((b, i) => (
                <Reveal key={b.title} delay={i * 0.05}>
                  <div className="zcard" style={{ padding: 26 }}>
                    <div style={{ fontSize: 28, marginBottom: 14 }}>{b.icon}</div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1a0019", marginBottom: 8 }}>{b.title}</h3>
                    <p style={{ fontSize: 13, color: "#7a4e77", lineHeight: 1.6, fontWeight: 300 }}>{b.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── ELIGIBILITY ── */}
        <section style={{ background: "#fafafa" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <Reveal>
              <div className="zcard" style={{ padding: "44px 36px", display: "flex", flexWrap: "wrap", gap: 36, alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.09em", color: "#9ca3af", marginBottom: 18 }}>Open To</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {DEGREES.map(e => <span key={e} className="ztag">{e}</span>)}
                  </div>
                </div>
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.04em", color: PP, lineHeight: 1 }}>30</div>
                  <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.09em", color: "#9ca3af", marginTop: 4 }}>Days Intensive</div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── ROADMAP ── */}
        <section style={{ background: "#fff" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <Reveal>
              <div style={{ textAlign: "center", marginBottom: 52 }}>
                <span className="zpill" style={{ background: GRL, color: "#2d7a10", border: `1px solid ${GR}44`, marginBottom: 14 }}>Your Journey</span>
                <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, letterSpacing: "-0.02em", color: "#1a0019" }}>30-Day Roadmap</h2>
                <div className="zdivider" />
              </div>
            </Reveal>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 19, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom,${BL},${PP},${GR})` }} />
              {roadmap.map((step, i) => (
                <Reveal key={step.day} delay={i * 0.08}>
                  <div style={{ display: "flex", gap: 24, marginBottom: 18, paddingLeft: 52, position: "relative" }}>
                    <div style={{ position: "absolute", left: 11, top: 20, width: 17, height: 17, borderRadius: "50%", background: step.dot, border: "3px solid #fff", boxShadow: `0 0 0 2px ${step.dot}44` }} />
                    <div className="zcard" style={{ flex: 1, padding: "20px 24px" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9ca3af" }}>{step.day}</span>
                      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1a0019", margin: "5px 0" }}>{step.title}</h3>
                      <p style={{ fontSize: 13, color: "#7a4e77", lineHeight: 1.6, fontWeight: 300 }}>{step.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── REGISTRATION FORM ── */}
        <section ref={formRef} style={{ background: "#fafafa" }}>
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <Reveal>
              <div style={{ textAlign: "center", marginBottom: 44 }}>
                <span className="zpill" style={{ background: "#fff1f2", color: "#be123c", border: "1px solid #fecdd3", marginBottom: 14 }}>🎯 Limited Seats Available</span>
                <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, letterSpacing: "-0.02em", color: "#1a0019", marginBottom: 10 }}>Start Your Journey</h2>
                <p style={{ fontSize: 14, color: "#7a4e77", fontWeight: 300 }}>Our team will reach out within 24 hours.</p>
              </div>
            </Reveal>

            {!submitted ? (
              <Reveal>
                <div className="zcard zp-slide-up" style={{ padding: "36px 32px" }}>
                  {catError    && <div className="err-box">{catError}</div>}
                  {submitError && <div className="err-box">{submitError}</div>}
                  {isLoggedIn  && !profileLoading && (
                    <div className="info-box">
                      You're logged in — your name, email and phone are filled in automatically from your account and can't be edited here.
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Text inputs — locked when logged in */}
                    {[
                      { label:"Full Name *",    key:"name",  type:"text",  placeholder:"Your full name" },
                      { label:"Email Address *",key:"email", type:"email", placeholder:"your@email.com" },
                      { label:"Phone Number *", key:"phone", type:"tel",   placeholder:"+91 98765 43210" },
                    ].map(({ label, key, type, placeholder }) => (
                      <div key={key}>
                        <label>{label}</label>
                        <input
                          type={type}
                          placeholder={profileLoading ? "Loading…" : placeholder}
                          value={form[key]}
                          disabled={isLoggedIn}
                          onChange={e => set(key, e.target.value)}
                          onFocus={isLoggedIn ? undefined : onFocus}
                          onBlur={isLoggedIn ? undefined : onBlur}
                          style={isLoggedIn ? lockedInputStyle : undefined}
                        />
                      </div>
                    ))}

                    {/* Degree */}
                    <div>
                      <label>Degree</label>
                      <select value={form.degree} onChange={e => set("degree", e.target.value)}
                        style={arrow} onFocus={onFocus} onBlur={onBlur}>
                        <option value="">Select Degree</option>
                        {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>

                    {/* Course Category */}
                    <div>
                      <label>Course Category <span style={{ color: PP }}>*</span></label>
                      <select value={form.courseCategory}
                        onChange={e => changeCat(e.target.value)}
                        style={{ ...arrow, opacity: loadingCats ? 0.6 : 1 }}
                        disabled={loadingCats} onFocus={onFocus} onBlur={onBlur}>
                        <option value="">{loadingCats ? "Loading categories…" : "Select Category"}</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.categoryName}</option>)}
                      </select>
                    </div>

                    {/* Course */}
                    <div>
                      <label>Course <span style={{ color: PP }}>*</span></label>
                      <select value={form.course} onChange={e => set("course", e.target.value)}
                        style={{ ...arrow, opacity: form.courseCategory ? 1 : 0.6 }}
                        disabled={!form.courseCategory} onFocus={onFocus} onBlur={onBlur}>
                        <option value="">
                          {!form.courseCategory ? "Select a category first" : coursesForCat.length === 0 ? "No courses in this category" : "Select Course"}
                        </option>
                        {coursesForCat.map(c => <option key={c._id} value={c._id}>{c.courseName}</option>)}
                      </select>
                    </div>

                    {/* Duration */}
                    <div>
                      <label>Duration <span style={{ color: PP }}>*</span></label>
                      <select value={form.duration} onChange={e => set("duration", e.target.value)}
                        style={arrow} onFocus={onFocus} onBlur={onBlur}>
                        <option value="">Select Duration</option>
                        {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>

                    <button onClick={handleSubmit} disabled={submitting} className="btn-pri" style={{ padding: "14px", borderRadius: 12, fontSize: 15, marginTop: 2, width: "100%" }}>
                      {submitting
                        ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                            <span className="zspinner" /> Submitting…
                          </span>
                        : "Register for Internship →"}
                    </button>
                    <p style={{ fontSize: 12, color: "#b097af", textAlign: "center", fontWeight: 300 }}>
                      No spam, ever. By registering you agree to our Terms.
                    </p>
                  </div>
                </div>
              </Reveal>
            ) : (
              <div className="zp-slide-up zcard" style={{ padding: "52px 40px", textAlign: "center", border: `1px solid ${GR}55` }}>
                <div style={{ fontSize: 52, marginBottom: 14 }} className="zp-float">🎉</div>
                <h3 style={{ fontSize: 24, fontWeight: 700, color: "#1a0019", marginBottom: 8 }}>You're In!</h3>
                <p style={{ fontSize: 14, color: "#7a4e77", marginBottom: 6, fontWeight: 300 }}>
                  Thanks, <strong style={{ color: "#1a0019" }}>{form.name}</strong>! Your application is received.
                </p>
                <p style={{ fontSize: 12.5, color: "#b097af", fontWeight: 300 }}>
                  We'll reach out to <span style={{ color: PP }}>{form.email}</span> within 24 hours.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── CERTIFICATE SECTION ── */}
        <section style={{ background: "#fcf8fd", padding: "64px 24px" }} className="relative overflow-hidden border-t border-purple-100">
          <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
            <Reveal>
              <span className="zpill" style={{ background: `${PPL}`, color: PP, border: `1px solid ${PP}33`, marginBottom: 16 }}>
                🏅 Proof of Completion
              </span>
              <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 800, color: "#111827", marginBottom: 12 }}>
                Earn Your Certificate
              </h2>
              <p style={{ fontSize: 15, color: "#6b7280", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.6 }}>
                Every student who completes the internship walks away with an industry-recognized certificate — proof of the skills you've built.
              </p>

              <div style={{ maxWidth: 640, margin: "0 auto", position: "relative" }} className="group">
                <div style={{
                  borderRadius: 24,
                  overflow: "hidden",
                  boxShadow: "0 20px 50px rgba(176,38,181,0.18)",
                  border: `1px solid ${PP}30`,
                  background: "#fff",
                  position: "relative"
                }}>
                  <div style={{ height: 4, background: `linear-gradient(90deg, ${PP}, ${BL})` }} />
                  <img
                    src={SampleCertificateImg}
                    alt="Zint Internship Sample Certificate"
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                  <div style={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    right: 16,
                    borderRadius: 16,
                    padding: "12px 18px",
                    background: "rgba(17,24,39,0.85)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(34,197,94,0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600
                  }}>
                    <span style={{ color: GR, fontSize: 16 }}>✓</span> Verified &amp; shareable — add it straight to your LinkedIn profile
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section style={{ background: "#fff" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <Reveal>
              <div style={{ background: `linear-gradient(135deg,${DP} 0%,${PP} 60%,#c93ec0 100%)`, borderRadius: 24, padding: "68px 44px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, background: `radial-gradient(circle,${BL}44 0%,transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -40, left: -40, width: 200, height: 200, background: `radial-gradient(circle,${GR}33 0%,transparent 70%)`, pointerEvents: "none" }} />
                <span className="zpill" style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.18)", marginBottom: 22, position: "relative" }}>
                  Don't Miss Out
                </span>
                <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, letterSpacing: "-0.02em", color: "#fff", marginBottom: 14, position: "relative" }}>
                  Next Batch Starting Soon
                </h2>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", maxWidth: 460, margin: "0 auto 32px", lineHeight: 1.6, fontWeight: 300, position: "relative" }}>
                  Seats fill up fast. Register today and secure your spot in the most sought-after tech internship program.
                </p>
                <button onClick={scrollToForm}
                  style={{ background: "#fff", color: DP, border: "none", borderRadius: 12, padding: "14px 34px", fontWeight: 700, fontSize: 14.5, cursor: "pointer", transition: "all 0.22s", position: "relative", fontFamily: "Poppins, sans-serif" }}
                  onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 14px 32px rgba(0,0,0,0.2)"; }}
                  onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                  Register Now — Free to Apply
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: `1px solid ${PP}1a`, padding: "30px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.02em", color: DP, marginBottom: 8 }}>
            Zint<span style={{ color: BL }}>Institute</span>
          </div>
          <p style={{ fontSize: 12.5, color: "#b097af", fontWeight: 300 }}>© 2026 Zint Institute. Shaping the next generation of tech leaders.</p>
        </footer>

      </div>
    </>
  );
}