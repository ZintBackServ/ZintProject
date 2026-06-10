import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import { PiCertificate } from "react-icons/pi";
import {
  FiShare2, FiDownload, FiCheck, FiStar,
  FiClock, FiCalendar, FiMonitor, FiGlobe, FiChevronRight,
  FiArrowRight, FiPlayCircle, FiAward, FiBriefcase,
  FiX, FiUser, FiPhone, FiMail, FiBookOpen, FiLoader,
} from "react-icons/fi";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { MdOutlineVerified } from "react-icons/md";

/* ═══════════════════════════════════════════════════════
   ZINT COLOR SYSTEM
   Purple/Magenta  #B026B5  — primary brand identity
   Sky Blue        #38BDF8  — AI / tech / hover effects
   Green           #22C55E  — success / trust / achievement
   Off-White       #F8FAFC  — clean backgrounds
   Dark            #111827  — typography / dark sections
═══════════════════════════════════════════════════════ */

const TOOLS = [
  { name: "ChatGPT",       icon: "🤖", accent: "#B026B5" },
  { name: "Gemini",        icon: "✨", accent: "#38BDF8" },
  { name: "Canva",         icon: "🎨", accent: "#22C55E" },
  { name: "Analytics",     icon: "📊", accent: "#B026B5" },
  { name: "WordPress",     icon: "🌐", accent: "#38BDF8" },
  { name: "Meta Ads",      icon: "📣", accent: "#22C55E" },
  { name: "Adobe Firefly", icon: "🔥", accent: "#B026B5" },
];

const CAREER_ROADMAP = [
  { title: "Learn Fundamentals",    desc: "Build strong foundational concepts with beginner-friendly modules.", icon: "📘", state: "done",    side: "left"  },
  { title: "Hands-on Projects",     desc: "Work on real-world projects to gain practical experience.",          icon: "💻", state: "active",  side: "right" },
  { title: "Advanced Concepts",     desc: "Master industry-level tools, frameworks, and workflows.",            icon: "🚀", state: "pending", side: "left"  },
  { title: "Interview Preparation", desc: "Prepare for technical interviews, aptitude, and communication.",     icon: "🎯", state: "pending", side: "right" },
  { title: "Get Certified & Placed",desc: "Earn your certificate and get career support for placements.",       icon: "🏆", state: "pending", side: "left"  },
];

const FEATURES = [
  { icon: <MdOutlineVerified />,    color: "#B026B5", label: "ISO Certified",      sub: "International Trust"      },
  { icon: <HiOutlineAcademicCap />, color: "#38BDF8", label: "Expert Trainers",    sub: "Industry Professionals"   },
  { icon: <FiPlayCircle />,         color: "#22C55E", label: "Practical Training", sub: "Hands-on Projects"        },
  { icon: <FiBriefcase />,          color: "#B026B5", label: "Job Support",        sub: "Internships & Placements" },
];

const LEARN_POINTS = [
  "Industry-grade practical projects",
  "AI tools integration in real workflows",
  "Live doubt-clearing sessions",
  "Portfolio & resume building",
  "Freelancing & agency setup",
  "Placement assistance & mock interviews",
];

const TESTIMONIALS = [
  { name: "Anjali Sharma", role: "Marketing Lead at TechCorp", initials: "AS", avatarBg: "#B026B5",
    quote: "The AI modules completely changed how I look at digital marketing. I'm now doing in 2 hours what used to take me 2 days." },
  { name: "Rahul Verma",   role: "Freelance Developer",        initials: "RV", avatarBg: "#38BDF8",
    quote: "From zero technical knowledge to building my first React landing page. ZINT Institute's practical approach is unmatched." },
  { name: "Sneha Kapur",   role: "SEO Specialist",             initials: "SK", avatarBg: "#22C55E",
    quote: "The placement support team helped me land a job even before I finished my SEO Mastery course. Truly life-changing experience." },
];




/* ─────────────────────────────────────────────
   CURRICULUM DOWNLOAD MODAL
   Shows login form if user is not logged in.
   If logged in, directly triggers download.
───────────────────────────────────────────────── */
function CurriculumModal({ course, onClose, isLoggedIn }) {
  const [form, setForm]       = useState({ name: "", phone: "", email: "", courseName: course.courseName });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter valid 10-digit phone";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter valid email";
    return e;
  };

  const triggerDownload = () => {
  if (!course.courseCurriculum) {
    alert("Curriculum not available for this course yet.");
    return;
  }
  const link = document.createElement("a");
  link.href = course.courseCurriculum;
  link.download = `${course.courseName}_Curriculum.pdf`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  // If already logged in → download immediately when modal mounts
  // We handle this outside (see handleDownloadClick)

 const handleSubmit = async () => {
  
  const e = validate();
  if (Object.keys(e).length) { setErrors(e); return; }
  setLoading(true);
  await new Promise(r => setTimeout(r, 900));
  setLoading(false);
  setSuccess(true);
  triggerDownload();           // ✅ no await needed
  setTimeout(onClose, 2000);
};


  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(17,24,39,0.72)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: "#fff", boxShadow: "0 32px 80px rgba(176,38,181,0.22)" }}
      >
        {/* Top gradient bar */}
        <div className="h-1" style={{ background: "linear-gradient(90deg, #B026B5, #38BDF8)" }} />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{ background: "#f3f4f6", color: "#6b7280" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#fee2fe"; e.currentTarget.style.color = "#B026B5"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#6b7280"; }}
        >
          <FiX size={16} />
        </button>

        <div className="px-7 py-7">
          {success ? (
            /* ── Success state ── */
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"
                style={{ background: "rgba(34,197,94,0.12)" }}>
                <FiCheck size={28} style={{ color: "#22C55E" }} />
              </div>
              <p className="text-xl font-extrabold mb-1" style={{ color: "#111827" }}>Download Started!</p>
              <p className="text-sm text-gray-500">Your curriculum is downloading. Check your downloads folder.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(176,38,181,0.1)" }}>
                  <FiDownload size={20} style={{ color: "#B026B5" }} />
                </div>
                <div>
                  <p className="font-extrabold text-lg leading-tight" style={{ color: "#111827" }}>
                    Download Curriculum
                  </p>
                  <p className="text-xs text-gray-400">{course.courseName}</p>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Please fill in your details to download the complete course curriculum. We'll also send it to your email.
              </p>

              {/* Form fields */}
              <div className="space-y-4">
                {/* Name */}
                <FormField
                  icon={<FiUser size={15} />}
                  label="Full Name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  error={errors.name}
                  onChange={v => setForm(f => ({ ...f, name: v }))}
                />
                {/* Phone */}
                <FormField
                  icon={<FiPhone size={15} />}
                  label="Phone Number"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  error={errors.phone}
                  onChange={v => setForm(f => ({ ...f, phone: v }))}
                />
                {/* Email */}
                <FormField
                  icon={<FiMail size={15} />}
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  error={errors.email}
                  onChange={v => setForm(f => ({ ...f, email: v }))}
                />
                {/* Course Name (pre-filled, read-only) */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
                    Course Name
                  </label>
                  <div className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 border text-sm"
                    style={{ background: "#f9fafb", borderColor: "#e5e7eb", color: "#9ca3af" }}>
                    <FiBookOpen size={15} style={{ color: "#B026B5", flexShrink: 0 }} />
                    <span style={{ color: "#374151", fontWeight: 500 }}>{course.courseName}</span>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-6 font-bold py-3.5 rounded-xl text-sm text-white flex items-center justify-center gap-2 transition-all duration-200"
                style={{ background: loading ? "#d1a3d3" : "#B026B5", boxShadow: loading ? "none" : "0 8px 24px rgba(176,38,181,0.28)" }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#8f1e92"; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#B026B5"; }}
              >
                {loading
                  ? <><FiLoader size={15} className="animate-spin" /> Processing…</>
                  : <><FiDownload size={15} /> Download Curriculum</>
                }
              </button>

              <p className="text-center text-xs text-gray-400 mt-3">
                🔒 Your data is safe and will never be shared.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FormField({ icon, label, type, placeholder, value, error, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>{label}</label>
      <div
        className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 border text-sm transition-all duration-200"
        style={{
          borderColor: error ? "#ef4444" : focused ? "#B026B5" : "#e5e7eb",
          boxShadow:   focused ? "0 0 0 3px rgba(176,38,181,0.1)" : "none",
          background:  "#fff",
        }}
      >
        <span style={{ color: error ? "#ef4444" : focused ? "#B026B5" : "#9ca3af", flexShrink: 0 }}>{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={e => onChange(e.target.value)}
          className="flex-1 outline-none bg-transparent text-sm"
          style={{ color: "#111827" }}
        />
      </div>
      {error && <p className="text-xs mt-1" style={{ color: "#ef4444" }}>{error}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────── */
export default function CourseDetail() {
  const { id }      = useParams();
  const { data }    = useContext(DataContext);
  const [activeTab, setActiveTab]           = useState("overview");
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);

  // ── Auth check ──
  // Replace this with your real auth logic (e.g. useContext(AuthContext) or check localStorage token)
  const isLoggedIn = !!localStorage.getItem("token");

  if (!data?.courses) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8FAFC" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: "#B026B5 #B026B5 #B026B5 transparent" }} />
          <p style={{ color: "#111827" }} className="font-medium">Loading course…</p>
        </div>
      </div>
    );
  }

  const course = data.courses.find((c) => String(c._id) === String(id));

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#F8FAFC" }}>
        <FiAward className="text-6xl" style={{ color: "#B026B5" }} />
        <p className="text-2xl font-bold" style={{ color: "#111827" }}>Course not found</p>
        <p className="text-gray-500">The course you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  const tabs         = ["overview"];   //"curriculum", "certificate", "reviews"
  const feeFormatted = course.fee?.toLocaleString("en-IN") ?? "—";

  // Shared blob-download helper (handles cross-origin Cloudinary PDFs)
 const downloadPDF = (url, filename) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.target = "_blank";       // opens in new tab if browser blocks download
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  // Download curriculum handler
  const handleDownloadClick = () => {
  if (!course.courseCurriculum) {
    alert("Curriculum not available for this course yet.");
    return;
  }
  if (isLoggedIn) {
    downloadPDF(course.courseCurriculum, `${course.courseName}_Curriculum.pdf`);
  } else {
    setShowCurriculumModal(true);
  }
};

  return (
    <div className="min-h-screen font-sans" style={{ background: "#F8FAFC" }}>

      {/* ── Curriculum Modal ── */}
      {showCurriculumModal && (
        <CurriculumModal
          course={course}
          isLoggedIn={isLoggedIn}
          onClose={() => setShowCurriculumModal(false)}
        />
      )}

      {/* ══════════════════════════
          HERO
      ══════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "#F8FAFC" }}>
        <div className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(176,38,181,0.07) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)" }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-10">

            {/* LEFT */}
            <div className="flex-1 order-2 md:order-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border"
                style={{ background: "rgba(176,38,181,0.08)", color: "#B026B5", borderColor: "rgba(176,38,181,0.22)" }}>
                ⚡ AI-Enhanced Learning Journey
              </span>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 tracking-tight"
                style={{ color: "#111827" }}>
                {course.courseName}
              </h1>

              <p className="text-sm md:text-base leading-relaxed mb-6 max-w-lg text-gray-500">
                {course.about
                  ? (course.about.length > 180 ? course.about.slice(0, 180) + "…" : course.about)
                  : `Master ${course.courseName} with industry-relevant skills and hands-on projects.`}
              </p>

              <div className="flex items-center gap-3 mb-7 flex-wrap">
                <div className="flex text-yellow-400 text-sm">
                  {[...Array(5)].map((_, i) => <FiStar key={i} className="fill-yellow-400" />)}
                </div>
                <span className="text-sm font-semibold" style={{ color: "#111827" }}>
                  {course.rating ?? "4.9"}
                </span>
                <span className="text-gray-400 text-sm">(2,400+ students)</span>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(34,197,94,0.1)", color: "#15803d", border: "1px solid rgba(34,197,94,0.2)" }}>
                  ✓ 95% Placement Rate
                </span>
              </div>

              {/* Desktop CTAs */}
              <div className="hidden md:flex items-center gap-3 flex-wrap">
                {/* Primary purple — Enroll Now */}
                <button
                  className="font-bold px-8 py-3.5 rounded-xl text-sm text-white transition-all duration-200 flex items-center gap-2"
                  style={{ background: "#B026B5", boxShadow: "0 8px 24px rgba(176,38,181,0.28)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#8f1e92"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#B026B5"; }}
                >
                  Enroll Now <FiArrowRight />
                </button>

                {/* Download Curriculum button */}
                <button
                  onClick={handleDownloadClick}
                  className="font-semibold px-5 py-3.5 rounded-xl text-sm transition-all duration-200 border-2 flex items-center gap-2"
                  style={{ color: "#B026B5", borderColor: "#B026B5", background: "white" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#B026B5"; e.currentTarget.style.color = "white"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "white";   e.currentTarget.style.color = "#B026B5"; }}
                >
                  <FiDownload /> Download Curriculum
                </button>

                {/* Share icon */}
                <button
                  className="p-3.5 rounded-xl transition-all duration-200 border"
                  style={{ color: "#9ca3af", borderColor: "#e5e7eb", background: "white" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#38BDF8"; e.currentTarget.style.color = "#38BDF8"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#9ca3af"; }}
                >
                  <FiShare2 />
                </button>
              </div>
            </div>

            {/* RIGHT card */}
            <div className="flex-shrink-0 w-full md:w-[500px] order-1 md:order-2">
              <div className="rounded-2xl overflow-hidden relative group"
                style={{ boxShadow: "0 20px 60px rgba(176,38,181,0.14)" }}>
                <div className="h-1" style={{ background: "linear-gradient(90deg, #B026B5, #38BDF8)" }} />
                <img
                  src={course.courseImage}
                  alt={course.courseName}
                  className="w-full h-56 md:h-72 object-full group-hover:scale-105 transition-transform duration-500"
                  onError={e => { e.target.src = "https://placehold.co/500x288/111827/B026B5?text=Course"; }}
                />
                <div className="absolute top-4 right-4 text-white text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: "#22C55E" }}>
                  ✓ 95% Placement
                </div>
              </div>

              {/* Mobile price chip */}
              <div className="mt-4 flex items-center justify-between md:hidden bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
                <div>
                  <p className="font-extrabold text-2xl" style={{ color: "#111827" }}>₹{feeFormatted}</p>
                  <p className="text-gray-400 text-xs line-through">₹{((course.fee ?? 0) * 2).toLocaleString("en-IN")}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(34,197,94,0.1)", color: "#15803d", border: "1px solid rgba(34,197,94,0.2)" }}>
                  50% OFF
                </span>
              </div>
            </div>
          </div>

          {/* Mobile CTAs */}
          <div className="flex flex-col gap-3 mt-6 md:hidden">
            <button
              onClick={handleDownloadClick}
              className="w-full font-semibold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 border-2"
              style={{ color: "#B026B5", borderColor: "#B026B5", background: "white" }}
            >
              <FiDownload /> Download Curriculum
            </button>
            <button
              className="w-full font-bold py-3.5 rounded-xl text-sm text-white"
              style={{ background: "#B026B5", boxShadow: "0 8px 24px rgba(176,38,181,0.28)" }}
            >
              Enroll Now →
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          INFO STRIP
      ══════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="hidden md:flex items-stretch divide-x divide-gray-100">
            <InfoItem icon={<FiCalendar style={{ color: "#B026B5" }} />} label="Date of Commencement" value={course.startDate || "28 Apr, 2026"} />
            <InfoItem icon={<FiClock   style={{ color: "#38BDF8" }} />} label="Duration"             value={course.duration ? `${course.duration} Months` : "N/A"} />
            <InfoItem icon={<FiStar    style={{ color: "#B026B5" }} />} label="Course Fee"           value={`₹${feeFormatted}/-`} />
            <InfoItem icon={<FiMonitor style={{ color: "#38BDF8" }} />} label="Delivery Mode"        value={course.mode || "Live"} />
            <InfoItem icon={<FiGlobe  style={{ color: "#22C55E" }} />} label="Language"             value={course.language || "Hinglish"} />
          </div>
          <div className="md:hidden grid grid-cols-2 gap-px bg-gray-100 rounded-xl overflow-hidden">
            {[
              { label: "Commencement", value: course.startDate || "28 Apr, 2026" },
              { label: "Duration",     value: course.duration ? `${course.duration} Months` : "N/A" },
              { label: "Fee",          value: `₹${feeFormatted}` },
              { label: "Mode",         value: course.mode || "Live" },
            ].map(item => (
              <div key={item.label} className="bg-white py-4 px-3 text-center">
                <p className="font-bold text-sm" style={{ color: "#111827" }}>{item.value}</p>
                <p className="text-gray-400 text-xs mt-0.5">{item.label}</p>
              </div>
            ))}
            <div className="bg-white col-span-2 py-4 text-center">
              <p className="font-bold text-sm" style={{ color: "#111827" }}>{course.language || "Hinglish"}</p>
              <p className="text-gray-400 text-xs mt-0.5">Language</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          FEATURES STRIP — dark
      ══════════════════════════ */}
      <section style={{ background: "#111827" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x"
            style={{ "--tw-divide-opacity": 1, borderColor: "rgba(255,255,255,0.07)" }}>
            {FEATURES.map((h) => (
              <div key={h.label}
                className="flex flex-col md:flex-row items-center md:justify-center gap-2 md:gap-3 md:px-6 py-4 text-center md:text-left">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xl"
                  style={{ background: `${h.color}18`, color: h.color }}>
                  {h.icon}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{h.label}</p>
                  <p className="text-gray-500 text-xs">{h.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          TABS
      ══════════════════════════ */}
      <nav className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex gap-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="px-5 py-4 text-sm font-semibold capitalize whitespace-nowrap border-b-2 transition-all duration-200"
                style={{
                  borderColor: activeTab === tab ? "#B026B5" : "transparent",
                  color:       activeTab === tab ? "#B026B5" : "#6b7280",
                }}
                onMouseEnter={e => { if (activeTab !== tab) e.currentTarget.style.color = "#38BDF8"; }}
                onMouseLeave={e => { if (activeTab !== tab) e.currentTarget.style.color = "#6b7280"; }}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ══════════════════════════
          ABOUT
      ══════════════════════════ */}
      {course.about && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <SectionHeader title="About This Course" />
          <p className="text-gray-500 leading-8 whitespace-pre-line max-w-3xl">{course.about}</p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl">
            {LEARN_POINTS.map(point => (
              <div key={point} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(34,197,94,0.12)" }}>
                  <FiCheck className="text-xs font-bold" style={{ color: "#22C55E" }} />
                </div>
                <span className="text-sm" style={{ color: "#111827" }}>{point}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════
          TOOLS
      ══════════════════════════ */}
      <section style={{ background: "#111827" }} className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#38BDF8" }}>
            Master 20+ AI Tools
          </p>
          <p className="text-gray-400 text-sm mb-8">Industry-standard software used by top marketing professionals</p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {TOOLS.map(tool => (
              <div key={tool.name}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 cursor-default transition-all duration-200 border"
                style={{ background: "#1f2937", borderColor: "#374151" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = tool.accent; e.currentTarget.style.background = `${tool.accent}18`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#374151";  e.currentTarget.style.background = "#1f2937"; }}>
                <span className="text-lg">{tool.icon}</span>
                <span className="text-gray-300 text-sm font-medium">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          CAREER ROADMAP
      ══════════════════════════ */}
      <section className="relative overflow-hidden py-20"
        style={{ background: "linear-gradient(135deg, #B026B5 0%, #7c3aed 45%, #0ea5e9 100%)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 20% 30%, rgba(255,255,255,0.07) 0%, transparent 70%)" }} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-10"
          style={{ background: "radial-gradient(circle, #38BDF8, transparent 70%)" }} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "rgba(255,255,255,0.55)" }}>
            Structured Learning Path
          </p>
          <h2 className="text-white text-3xl md:text-4xl font-extrabold mb-3">
            Your Path to Career Excellence
          </h2>
          <p className="text-white/65 text-sm md:text-base mb-14 max-w-xl mx-auto">
            A structured journey designed to take you from fundamentals to a high-paying job.
          </p>

          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-7 bottom-7 w-px hidden md:block"
              style={{ background: "rgba(255,255,255,0.18)" }} />

            <div className="flex flex-col gap-12">
              {CAREER_ROADMAP.map((item) => {
                const isLeft   = item.side === "left";
                const isDone   = item.state === "done";
                const isActive = item.state === "active";
                const nodeStyle = isDone
                  ? { background: "#22C55E", boxShadow: "0 0 0 4px rgba(34,197,94,0.25), 0 0 20px rgba(34,197,94,0.35)" }
                  : isActive
                  ? { background: "#38BDF8", boxShadow: "0 0 0 4px rgba(56,189,248,0.25), 0 0 20px rgba(56,189,248,0.35)" }
                  : { background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.35)" };

                return (
                  <div key={item.title}
                    className={`flex flex-col md:flex-row items-center gap-4 md:gap-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className={`flex-1 md:px-10 text-center ${isLeft ? "md:text-right" : "md:text-left"}`}>
                      <p className="text-white font-bold text-lg leading-snug mb-1 flex items-center justify-center gap-2 flex-wrap"
                        style={{ justifyContent: isLeft ? "flex-end" : "flex-start" }}>
                        {item.title}
                        {isDone   && <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(34,197,94,0.22)", color: "#86efac" }}>✓ Complete</span>}
                        {isActive && <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(56,189,248,0.22)", color: "#7dd3fc" }}>In Progress</span>}
                      </p>
                      <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
                        style={nodeStyle}>
                        <span className="text-xl">{item.icon}</span>
                      </div>
                    </div>
                    <div className="flex-1 hidden md:block" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          CERTIFICATE
          Only shown if courseCertificate exists
      ══════════════════════════ */}
      {course.courseCertificate ? (
        <section className="py-16" style={{ background: "#F8FAFC" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="inline-flex items-center gap-3 mb-6">
                  <PiCertificate className="text-5xl" style={{ color: "#B026B5" }} />
                  <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: "#111827" }}>Get Certified</h2>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>{course.courseName} Course Certificate</h3>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  Earn an industry-recognised certificate upon successful completion. Showcase your skills to employers and clients worldwide.
                </p>
                <ul className="space-y-3">
                  {[
                    { text: "Globally recognised & verifiable",   color: "#38BDF8", icon: "🌐" },
                    { text: "Shareable on LinkedIn & GitHub",     color: "#B026B5", icon: "🔗" },
                    { text: "Endorsed by industry professionals", color: "#22C55E", icon: "✓"  },
                  ].map(p => (
                    <li key={p.text} className="flex items-center gap-2.5 text-sm" style={{ color: "#111827" }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: `${p.color}18`, color: p.color }}>
                        {p.icon}
                      </div>
                      {p.text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex-shrink-0 w-full md:w-96">
                <div className="rounded-2xl overflow-hidden relative group"
                  style={{ boxShadow: "0 20px 50px rgba(56,189,248,0.13)" }}>
                  <div className="h-1" style={{ background: "linear-gradient(90deg, #B026B5, #38BDF8)" }} />
                  <img
                    src={course.courseCertificate}
                    alt={`${course.courseName} Certificate`}
                    className="w-full h-72 md:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.src = "https://placehold.co/400x320/111827/B026B5?text=Certificate"; }}
                  />

                  <div className="absolute top-5 left-4 bg-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md"
                    style={{ color: "#111827" }}>
                    🏅 Industry Certified
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Placeholder when no certificate image exists */
        <section className="py-16" style={{ background: "#F8FAFC" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="inline-flex items-center gap-3 mb-6">
                  <PiCertificate className="text-5xl" style={{ color: "#B026B5" }} />
                  <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: "#111827" }}>Get Certified</h2>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>{course.courseName} Course Certificate</h3>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  Earn an industry-recognised certificate upon successful completion. Showcase your skills to employers and clients worldwide.
                </p>
                <ul className="space-y-3">
                  {[
                    { text: "Globally recognised & verifiable",   color: "#38BDF8", icon: "🌐" },
                    { text: "Shareable on LinkedIn & GitHub",     color: "#B026B5", icon: "🔗" },
                    { text: "Endorsed by industry professionals", color: "#22C55E", icon: "✓"  },
                  ].map(p => (
                    <li key={p.text} className="flex items-center gap-2.5 text-sm" style={{ color: "#111827" }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: `${p.color}18`, color: p.color }}>
                        {p.icon}
                      </div>
                      {p.text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Certificate placeholder box */}
              <div className="flex-shrink-0 w-full md:w-96">
                <div className="rounded-2xl overflow-hidden relative"
                  style={{ boxShadow: "0 20px 50px rgba(56,189,248,0.10)" }}>
                  <div className="h-1" style={{ background: "linear-gradient(90deg, #B026B5, #38BDF8)" }} />
                  <div
                    className="w-full h-72 md:h-96 flex flex-col items-center justify-center gap-4"
                    style={{ background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)" }}
                  >
                    <PiCertificate className="text-6xl" style={{ color: "#B026B5", opacity: 0.6 }} />
                    <p className="text-white font-bold text-lg">{course.courseName}</p>
                    <p className="text-gray-400 text-sm text-center px-6">
                      Certificate will be awarded upon successful course completion.
                    </p>
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
                      style={{ background: "rgba(176,38,181,0.18)", color: "#e879f9" }}>
                      🏅 Industry Certified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════
          TESTIMONIALS
      ══════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
            <div>
              <SectionHeader title="Student Success Stories" />
              <p className="text-gray-500 text-sm max-w-md">
                Hear directly from ZINT graduates who have successfully transformed their careers.
              </p>
            </div>
            <button className="text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 self-start md:self-auto"
              style={{ color: "#B026B5" }}
              onMouseEnter={e => e.currentTarget.style.color = "#38BDF8"}
              onMouseLeave={e => e.currentTarget.style.color = "#B026B5"}>
              View all stories <FiChevronRight />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name}
                className="rounded-2xl p-6 border transition-all duration-300 relative overflow-hidden"
                style={{
                  background: "rgba(248,250,252,0.85)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#38BDF8"; e.currentTarget.style.boxShadow = "0 8px 40px rgba(56,189,248,0.13)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)"; }}>
                <div className="text-5xl font-serif leading-none mb-3 select-none" style={{ color: "#B026B5", opacity: 0.28 }}>"</div>
                <div className="flex text-yellow-400 text-xs mb-3">
                  {[...Array(5)].map((_, i) => <FiStar key={i} className="fill-yellow-400" />)}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: t.avatarBg }}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: "#111827" }}>{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          CTA BANNER
      ══════════════════════════ */}
      <section className="py-16 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #B026B5 0%, #7c3aed 55%, #38BDF8 100%)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 65%)" }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-white text-3xl md:text-4xl font-extrabold mb-3">
            Ready to Start Your Journey?
          </h2>
          <p className="mb-8 text-sm md:text-base" style={{ color: "rgba(255,255,255,0.72)" }}>
            Join 2,400+ students who've already transformed their careers. Limited seats available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white font-bold px-10 py-4 rounded-xl text-sm transition-all duration-200"
              style={{ color: "#B026B5", boxShadow: "0 10px 30px rgba(0,0,0,0.18)" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f3e8ff"}
              onMouseLeave={e => e.currentTarget.style.background = "white"}>
              Enroll Now – ₹{feeFormatted}
            </button>
            <button
              onClick={handleDownloadClick}
              className="font-bold px-8 py-4 rounded-xl text-sm text-white border-2 border-white transition-all duration-200 flex items-center justify-center gap-2"
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <FiDownload size={15} /> Download Curriculum
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

/* ── Sub-components ── */
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex-1 text-center px-4 py-1">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        {icon}
        <p className="font-bold text-sm" style={{ color: "#111827" }}>{value}</p>
      </div>
      <p className="text-gray-400 text-xs">{label}</p>
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <h2 className="text-2xl md:text-3xl font-extrabold mb-3 tracking-tight" style={{ color: "#111827" }}>
      {title}
    </h2>
  );
}
