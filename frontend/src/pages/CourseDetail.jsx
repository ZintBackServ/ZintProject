import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
   ZINT COLOR SYSTEM  —  Pink / Magenta primary
═══════════════════════════════════════════════════════ */
const PRIMARY   = "#E91E8C";
const PRIMARY_H = "#C0176E";
const BLUE      = "#38BDF8";
const GREEN     = "#22C55E";
const DARK      = "#111827";
const BG        = "#FFF0F8";

const TOOLS = [
  { name: "ChatGPT",       icon: "🤖", accent: PRIMARY  },
  { name: "Gemini",        icon: "✨", accent: BLUE     },
  { name: "Canva",         icon: "🎨", accent: GREEN    },
  { name: "Analytics",     icon: "📊", accent: PRIMARY  },
  { name: "WordPress",     icon: "🌐", accent: BLUE     },
  { name: "Meta Ads",      icon: "📣", accent: GREEN    },
  { name: "Adobe Firefly", icon: "🔥", accent: PRIMARY  },
];

const CAREER_ROADMAP = [
  { title: "Learn Fundamentals",     desc: "Build strong foundational concepts with beginner-friendly modules.", icon: "📘", state: "done",    side: "left"  },
  { title: "Hands-on Projects",      desc: "Work on real-world projects to gain practical experience.",          icon: "💻", state: "active",  side: "right" },
  { title: "Advanced Concepts",      desc: "Master industry-level tools, frameworks, and workflows.",            icon: "🚀", state: "pending", side: "left"  },
  { title: "Interview Preparation",  desc: "Prepare for technical interviews, aptitude, and communication.",     icon: "🎯", state: "pending", side: "right" },
  { title: "Get Certified & Placed", desc: "Earn your certificate and get career support for placements.",       icon: "🏆", state: "pending", side: "left"  },
];

const FEATURES = [
  { icon: <MdOutlineVerified />,    color: PRIMARY, label: "ISO Certified",      sub: "International Trust"      },
  { icon: <HiOutlineAcademicCap />, color: BLUE,    label: "Expert Trainers",    sub: "Industry Professionals"   },
  { icon: <FiPlayCircle />,         color: GREEN,   label: "Practical Training", sub: "Hands-on Projects"        },
  { icon: <FiBriefcase />,          color: PRIMARY, label: "Job Support",        sub: "Internships & Placements" },
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
  { name: "Anjali Sharma", role: "Marketing Lead at TechCorp", initials: "AS", avatarBg: PRIMARY,
    quote: "The AI modules completely changed how I look at digital marketing. I'm now doing in 2 hours what used to take me 2 days." },
  { name: "Rahul Verma",   role: "Freelance Developer",        initials: "RV", avatarBg: BLUE,
    quote: "From zero technical knowledge to building my first React landing page. ZINT Institute's practical approach is unmatched." },
  { name: "Sneha Kapur",   role: "SEO Specialist",             initials: "SK", avatarBg: GREEN,
    quote: "The placement support team helped me land a job even before I finished my SEO Mastery course. Truly life-changing experience." },
];

/* ─────────────────────────────────────────────
   BLOB DOWNLOAD
───────────────────────────────────────────────── */
async function blobDownload(url, filename) {
  try {
    const res  = await fetch(url, { mode: "cors" });
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(href);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

/* ─────────────────────────────────────────────
   INLINE FORM FIELD
───────────────────────────────────────────────── */
function FormField({ icon, label, type, placeholder, value, error, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>{label}</label>
      <div
        className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 border text-sm transition-all duration-200"
        style={{
          borderColor: error ? "#ef4444" : focused ? PRIMARY : "#e5e7eb",
          boxShadow:   focused ? `0 0 0 3px ${PRIMARY}22` : "none",
          background:  "#fff",
        }}
      >
        <span style={{ color: error ? "#ef4444" : focused ? PRIMARY : "#9ca3af", flexShrink: 0 }}>{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={e => onChange(e.target.value)}
          className="flex-1 outline-none bg-transparent text-sm"
          style={{ color: DARK }}
        />
      </div>
      {error && <p className="text-xs mt-1 text-red-500">{error}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CURRICULUM MODAL  (guests only)
───────────────────────────────────────────────── */
function CurriculumModal({ course, onClose }) {
  const [form, setForm]       = useState({ name: "", phone: "", email: "", courseName: course.courseName });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())                               e.name  = "Name is required";
    if (!/^\d{10}$/.test(form.phone))                   e.phone = "Enter valid 10-digit phone";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter valid email";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSuccess(true);
    blobDownload(course.courseCurriculum, `${course.courseName}_Curriculum.pdf`);
    setTimeout(onClose, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(17,24,39,0.72)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: "#fff", boxShadow: `0 32px 80px ${PRIMARY}38` }}>
        <div className="h-1" style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${BLUE})` }} />
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{ background: "#f3f4f6", color: "#6b7280" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#fce7f3"; e.currentTarget.style.color = PRIMARY; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#6b7280"; }}>
          <FiX size={16} />
        </button>
        <div className="px-7 py-7">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"
                style={{ background: "rgba(34,197,94,0.12)" }}>
                <FiCheck size={28} style={{ color: GREEN }} />
              </div>
              <p className="text-xl font-extrabold mb-1" style={{ color: DARK }}>Download Started!</p>
              <p className="text-sm text-gray-500">Your curriculum is downloading. Check your downloads folder.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${PRIMARY}18` }}>
                  <FiDownload size={20} style={{ color: PRIMARY }} />
                </div>
                <div>
                  <p className="font-extrabold text-lg leading-tight" style={{ color: DARK }}>Download Curriculum</p>
                  <p className="text-xs text-gray-400">{course.courseName}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Fill in your details to download the complete course curriculum.
              </p>
              <div className="space-y-4">
                <FormField icon={<FiUser size={15} />}  label="Full Name"     type="text"  placeholder="Enter your full name"   value={form.name}  error={errors.name}  onChange={v => setForm(f => ({ ...f, name: v }))} />
                <FormField icon={<FiPhone size={15} />} label="Phone Number"  type="tel"   placeholder="10-digit mobile number" value={form.phone} error={errors.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} />
                <FormField icon={<FiMail size={15} />}  label="Email Address" type="email" placeholder="you@example.com"        value={form.email} error={errors.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>Course Name</label>
                  <div className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 border text-sm"
                    style={{ background: "#f9fafb", borderColor: "#e5e7eb" }}>
                    <FiBookOpen size={15} style={{ color: PRIMARY, flexShrink: 0 }} />
                    <span style={{ color: "#374151", fontWeight: 500 }}>{course.courseName}</span>
                  </div>
                </div>
              </div>
              <button onClick={handleSubmit} disabled={loading}
                className="w-full mt-6 font-bold py-3.5 rounded-xl text-sm text-white flex items-center justify-center gap-2 transition-all duration-200"
                style={{ background: loading ? "#f9a8d4" : PRIMARY, boxShadow: loading ? "none" : `0 8px 24px ${PRIMARY}44` }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = PRIMARY_H; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = PRIMARY; }}>
                {loading ? <><FiLoader size={15} className="animate-spin" /> Processing…</> : <><FiDownload size={15} /> Download Curriculum</>}
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">🔒 Your data is safe and will never be shared.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   AUTH GATE MODAL
───────────────────────────────────────────────── */
function AuthGateModal({ onClose, onGoSignUp, onGoSignIn }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(17,24,39,0.72)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-sm rounded-2xl overflow-hidden text-center"
        style={{ background: "#fff", boxShadow: `0 32px 80px ${PRIMARY}38` }}>
        <div className="h-1" style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${BLUE})` }} />
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{ background: "#f3f4f6", color: "#6b7280" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#fce7f3"; e.currentTarget.style.color = PRIMARY; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#6b7280"; }}>
          <FiX size={16} />
        </button>
        <div className="px-8 py-8">
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-5"
            style={{ background: `${PRIMARY}12` }}>
            <FiUser size={28} style={{ color: PRIMARY }} />
          </div>
          <h2 className="text-xl font-extrabold mb-2" style={{ color: DARK }}>Login Required</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Please sign in or create an account to enroll in this course.
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={onGoSignIn}
              className="w-full font-bold py-3 rounded-xl text-sm text-white transition-all duration-200"
              style={{ background: PRIMARY, boxShadow: `0 8px 24px ${PRIMARY}44` }}
              onMouseEnter={e => e.currentTarget.style.background = PRIMARY_H}
              onMouseLeave={e => e.currentTarget.style.background = PRIMARY}>
              Sign In
            </button>
            <button onClick={onGoSignUp}
              className="w-full font-semibold py-3 rounded-xl text-sm border-2 transition-all duration-200"
              style={{ color: PRIMARY, borderColor: PRIMARY, background: "white" }}
              onMouseEnter={e => { e.currentTarget.style.background = PRIMARY; e.currentTarget.style.color = "white"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "white";  e.currentTarget.style.color = PRIMARY; }}>
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DOWNLOAD SPINNER OVERLAY
───────────────────────────────────────────────── */
function DownloadingOverlay({ courseName }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(17,24,39,0.72)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-xs rounded-2xl overflow-hidden text-center"
        style={{ background: "#fff", boxShadow: `0 32px 80px ${PRIMARY}38` }}>
        <div className="h-1" style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${BLUE})` }} />
        <div className="px-7 py-8">
          <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-4 animate-pulse"
            style={{ background: `${PRIMARY}12` }}>
            <FiDownload size={24} style={{ color: PRIMARY }} />
          </div>
          <p className="font-extrabold text-base mb-1" style={{ color: DARK }}>Preparing Download</p>
          <p className="text-xs text-gray-400 mb-4">{courseName} Curriculum</p>
          <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ background: "#fce7f3" }}>
            <div className="h-full rounded-full animate-pulse" style={{ background: PRIMARY, width: "60%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────── */
export default function CourseDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { data } = useContext(DataContext);

  const [activeTab, setActiveTab]                     = useState("overview");
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [showAuthGate, setShowAuthGate]               = useState(false);
  const [downloading, setDownloading]                 = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  // ── Navigation helpers ──
  const goToSignIn = () => {
    navigate(`/login?redirect=${encodeURIComponent(`/courses/${id}`)}`);
    setShowAuthGate(false);
  };

  const goToSignUp = () => {
    navigate(`/signup?redirect=/courses/${id}`);
    setShowAuthGate(false);
  };

  // ── ENROLL handler ──
  // Selects this course and navigates directly to the payment/admission page
  const handleEnroll = () => {
    if (!isLoggedIn) {
      setShowAuthGate(true);
      return;
    }
    // Pass courseId as query param so the payment page can pre-fill it
    navigate(`/OnlineAdmission?courseId=${id}`);
  };

  // ── DOWNLOAD CURRICULUM handler ──
  const handleDownloadClick = () => {
    if (!course.courseCurriculum) {
      alert("Curriculum not available for this course yet.");
      return;
    }
    if (!isLoggedIn) {
      setShowCurriculumModal(true);
    } else {
      setDownloading(true);
      blobDownload(course.courseCurriculum, `${course.courseName}_Curriculum.pdf`)
        .finally(() => setDownloading(false));
    }
  };

  // ── Loading / not-found guards ──
  if (!data?.courses) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: `${PRIMARY} ${PRIMARY} ${PRIMARY} transparent` }} />
          <p style={{ color: DARK }} className="font-medium">Loading course…</p>
        </div>
      </div>
    );
  }

  const course = data.courses.find(c => String(c._id) === String(id));

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: BG }}>
        <FiAward className="text-6xl" style={{ color: PRIMARY }} />
        <p className="text-2xl font-bold" style={{ color: DARK }}>Course not found</p>
        <p className="text-gray-500">The course you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate("/courses")}
          className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
          style={{ background: PRIMARY }}>
          Browse Courses
        </button>
      </div>
    );
  }

  const tabs         = ["overview"];
  const feeFormatted = course.fee?.toLocaleString("en-IN") ?? "—";

  return (
    <div className="min-h-screen font-sans" style={{ background: BG }}>

      {/* ── Modals ── */}
      {showCurriculumModal && (
        <CurriculumModal course={course} onClose={() => setShowCurriculumModal(false)} />
      )}
      {showAuthGate && (
        <AuthGateModal onClose={() => setShowAuthGate(false)} onGoSignIn={goToSignIn} onGoSignUp={goToSignUp} />
      )}
      {downloading && (
        <DownloadingOverlay courseName={course.courseName} onDone={() => setDownloading(false)} />
      )}

      {/* ══════════════════════════ HERO ══════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: BG }}>
        <div className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${PRIMARY}12 0%, transparent 70%)` }} />
        <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${BLUE}10 0%, transparent 70%)` }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-10">

            {/* LEFT */}
            <div className="flex-1 order-2 md:order-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border"
                style={{ background: `${PRIMARY}10`, color: PRIMARY, borderColor: `${PRIMARY}30` }}>
                ⚡ AI-Enhanced Learning Journey
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 tracking-tight"
                style={{ color: DARK }}>
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
                <span className="text-sm font-semibold" style={{ color: DARK }}>{course.rating ?? "4.9"}</span>
                <span className="text-gray-400 text-sm">(2,400+ students)</span>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${GREEN}18`, color: "#15803d", border: `1px solid ${GREEN}33` }}>
                  ✓ 95% Placement Rate
                </span>
              </div>

              {/* Desktop CTAs */}
              <div className="hidden md:flex items-center gap-3 flex-wrap">
                {/* PRIMARY CTA — Enroll Now → goes directly to payment page */}
                <button
                  onClick={handleEnroll}
                  className="font-bold px-8 py-3.5 rounded-xl text-sm text-white transition-all duration-200 flex items-center gap-2"
                  style={{ background: PRIMARY, boxShadow: `0 8px 24px ${PRIMARY}44` }}
                  onMouseEnter={e => e.currentTarget.style.background = PRIMARY_H}
                  onMouseLeave={e => e.currentTarget.style.background = PRIMARY}
                >
                  Enroll Now <FiArrowRight />
                </button>

                <button
                  onClick={handleDownloadClick}
                  className="font-semibold px-5 py-3.5 rounded-xl text-sm transition-all duration-200 border-2 flex items-center gap-2"
                  style={{ color: PRIMARY, borderColor: PRIMARY, background: "white" }}
                  onMouseEnter={e => { e.currentTarget.style.background = PRIMARY; e.currentTarget.style.color = "white"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "white";  e.currentTarget.style.color = PRIMARY; }}
                >
                  <FiDownload /> Download Curriculum
                </button>

                <button
                  className="p-3.5 rounded-xl transition-all duration-200 border"
                  style={{ color: "#9ca3af", borderColor: "#e5e7eb", background: "white" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.color = BLUE; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#9ca3af"; }}
                >
                  <FiShare2 />
                </button>
              </div>
            </div>

            {/* RIGHT card */}
            <div className="flex-shrink-0 w-full md:w-[500px] order-1 md:order-2">
              <div className="rounded-2xl overflow-hidden relative group"
                style={{ boxShadow: `0 20px 60px ${PRIMARY}22` }}>
                <div className="h-1" style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${BLUE})` }} />
                <img
                  src={course.courseImage}
                  alt={course.courseName}
                  className="w-full h-56 md:h-72 object-full group-hover:scale-105 transition-transform duration-500"
                  onError={e => { e.target.src = `https://placehold.co/500x288/111827/${PRIMARY.slice(1)}?text=Course`; }}
                />
                <div className="absolute top-4 right-4 text-white text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: GREEN }}>
                  ✓ 95% Placement
                </div>
              </div>

              {/* Mobile price chip */}
              <div className="mt-4 flex items-center justify-between md:hidden bg-white rounded-xl px-4 py-3 border border-pink-100 shadow-sm">
                <div>
                  <p className="font-extrabold text-2xl" style={{ color: DARK }}>₹{feeFormatted}</p>
                  <p className="text-gray-400 text-xs line-through">₹{((course.fee ?? 0) * 2).toLocaleString("en-IN")}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${GREEN}18`, color: "#15803d", border: `1px solid ${GREEN}33` }}>
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
              style={{ color: PRIMARY, borderColor: PRIMARY, background: "white" }}
            >
              <FiDownload /> Download Curriculum
            </button>
            <button
              onClick={handleEnroll}
              className="w-full font-bold py-3.5 rounded-xl text-sm text-white flex items-center justify-center gap-2"
              style={{ background: PRIMARY, boxShadow: `0 8px 24px ${PRIMARY}44` }}
            >
              Enroll Now → ₹{feeFormatted}
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ INFO STRIP ══════════════════════════ */}
      <section className="bg-white border-b border-pink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="hidden md:flex items-stretch divide-x divide-pink-100">
            <InfoItem icon={<FiCalendar style={{ color: PRIMARY }} />} label="Date of Commencement" value={course.startDate || "28 Apr, 2026"} />
            <InfoItem icon={<FiClock   style={{ color: BLUE    }} />} label="Duration"             value={course.duration ? `${course.duration} Months` : "N/A"} />
            <InfoItem icon={<FiStar    style={{ color: PRIMARY }} />} label="Course Fee"           value={`₹${feeFormatted}/-`} />
            <InfoItem icon={<FiMonitor style={{ color: BLUE    }} />} label="Delivery Mode"        value={course.mode || "Live"} />
            <InfoItem icon={<FiGlobe  style={{ color: GREEN   }} />} label="Language"             value={course.language || "Hinglish"} />
          </div>
          <div className="md:hidden grid grid-cols-2 gap-px bg-pink-50 rounded-xl overflow-hidden">
            {[
              { label: "Commencement", value: course.startDate || "28 Apr, 2026" },
              { label: "Duration",     value: course.duration ? `${course.duration} Months` : "N/A" },
              { label: "Fee",          value: `₹${feeFormatted}` },
              { label: "Mode",         value: course.mode || "Live" },
            ].map(item => (
              <div key={item.label} className="bg-white py-4 px-3 text-center">
                <p className="font-bold text-sm" style={{ color: DARK }}>{item.value}</p>
                <p className="text-gray-400 text-xs mt-0.5">{item.label}</p>
              </div>
            ))}
            <div className="bg-white col-span-2 py-4 text-center">
              <p className="font-bold text-sm" style={{ color: DARK }}>{course.language || "Hinglish"}</p>
              <p className="text-gray-400 text-xs mt-0.5">Language</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ FEATURES ══════════════════════════ */}
      <section style={{ background: DARK }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {FEATURES.map(h => (
              <div key={h.label}
                className="flex flex-col md:flex-row items-center md:justify-center gap-2 md:gap-3 md:px-6 py-4 text-center md:text-left border-r border-white/5 last:border-r-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xl"
                  style={{ background: `${h.color}20`, color: h.color }}>
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

      {/* ══════════════════════════ TABS ══════════════════════════ */}
      <nav className="sticky top-0 z-30 bg-white border-b border-pink-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex gap-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="px-5 py-4 text-sm font-semibold capitalize whitespace-nowrap border-b-2 transition-all duration-200"
                style={{
                  borderColor: activeTab === tab ? PRIMARY : "transparent",
                  color:       activeTab === tab ? PRIMARY : "#6b7280",
                }}
                onMouseEnter={e => { if (activeTab !== tab) e.currentTarget.style.color = BLUE; }}
                onMouseLeave={e => { if (activeTab !== tab) e.currentTarget.style.color = "#6b7280"; }}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ══════════════════════════ ABOUT ══════════════════════════ */}
      {course.about && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <SectionHeader title="About This Course" />
          <p className="text-gray-500 leading-8 whitespace-pre-line max-w-3xl">{course.about}</p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl">
            {LEARN_POINTS.map(point => (
              <div key={point} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${GREEN}20` }}>
                  <FiCheck className="text-xs font-bold" style={{ color: GREEN }} />
                </div>
                <span className="text-sm" style={{ color: DARK }}>{point}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════ TOOLS ══════════════════════════ */}
      <section style={{ background: DARK }} className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: BLUE }}>Master 20+ AI Tools</p>
          <p className="text-gray-400 text-sm mb-8">Industry-standard software used by top marketing professionals</p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {TOOLS.map(tool => (
              <div key={tool.name}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 cursor-default transition-all duration-200 border"
                style={{ background: "#1f2937", borderColor: "#374151" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = tool.accent; e.currentTarget.style.background = `${tool.accent}20`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#374151";   e.currentTarget.style.background = "#1f2937"; }}>
                <span className="text-lg">{tool.icon}</span>
                <span className="text-gray-300 text-sm font-medium">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ CAREER ROADMAP ══════════════════════════ */}
      <section className="relative overflow-hidden py-20"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #9d174d 45%, ${BLUE} 100%)` }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 20% 30%, rgba(255,255,255,0.07) 0%, transparent 70%)" }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>
            Structured Learning Path
          </p>
          <h2 className="text-white text-3xl md:text-4xl font-extrabold mb-3">Your Path to Career Excellence</h2>
          <p className="text-white/65 text-sm md:text-base mb-14 max-w-xl mx-auto">
            A structured journey designed to take you from fundamentals to a high-paying job.
          </p>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-7 bottom-7 w-px hidden md:block"
              style={{ background: "rgba(255,255,255,0.18)" }} />
            <div className="flex flex-col gap-12">
              {CAREER_ROADMAP.map(item => {
                const isDone   = item.state === "done";
                const isActive = item.state === "active";
                const isLeft   = item.side === "left";
                const nodeStyle = isDone
                  ? { background: GREEN,   boxShadow: `0 0 0 4px ${GREEN}40, 0 0 20px ${GREEN}58` }
                  : isActive
                  ? { background: BLUE,    boxShadow: `0 0 0 4px ${BLUE}40, 0 0 20px ${BLUE}58` }
                  : { background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.35)" };
                return (
                  <div key={item.title}
                    className={`flex flex-col md:flex-row items-center gap-4 md:gap-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className={`flex-1 md:px-10 text-center ${isLeft ? "md:text-right" : "md:text-left"}`}>
                      <p className="text-white font-bold text-lg leading-snug mb-1 flex items-center justify-center gap-2 flex-wrap"
                        style={{ justifyContent: isLeft ? "flex-end" : "flex-start" }}>
                        {item.title}
                        {isDone   && <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${GREEN}30`, color: "#86efac" }}>✓ Complete</span>}
                        {isActive && <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${BLUE}30`,  color: "#7dd3fc" }}>In Progress</span>}
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

      {/* ══════════════════════════ CERTIFICATE ══════════════════════════ */}
      <section className="py-16" style={{ background: BG }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-3 mb-6">
                <PiCertificate className="text-5xl" style={{ color: PRIMARY }} />
                <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: DARK }}>Get Certified</h2>
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: DARK }}>{course.courseName} Course Certificate</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Earn an industry-recognised certificate upon successful completion.
              </p>
              <ul className="space-y-3">
                {[
                  { text: "Globally recognised & verifiable",   color: BLUE,    icon: "🌐" },
                  { text: "Shareable on LinkedIn & GitHub",     color: PRIMARY, icon: "🔗" },
                  { text: "Endorsed by industry professionals", color: GREEN,   icon: "✓"  },
                ].map(p => (
                  <li key={p.text} className="flex items-center gap-2.5 text-sm" style={{ color: DARK }}>
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
                style={{ boxShadow: `0 20px 50px ${BLUE}20` }}>
                <div className="h-1" style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${BLUE})` }} />
                {course.courseCertificate ? (
                  <img src={course.courseCertificate} alt={`${course.courseName} Certificate`}
                    className="w-full h-72 md:h-100 object-full group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.src = `https://placehold.co/400x320/111827/${PRIMARY.slice(1)}?text=Certificate`; }} />
                ) : (
                  <div className="w-full h-72 md:h-96 flex flex-col items-center justify-center gap-4"
                    style={{ background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)" }}>
                    <PiCertificate className="text-6xl" style={{ color: PRIMARY, opacity: 0.6 }} />
                    <p className="text-white font-bold text-lg">{course.courseName}</p>
                    <p className="text-gray-400 text-sm text-center px-6">
                      Certificate will be awarded upon successful course completion.
                    </p>
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
                      style={{ background: `${PRIMARY}28`, color: "#f9a8d4" }}>
                      🏅 Industry Certified
                    </span>
                  </div>
                )}
                <div className="absolute top-5 left-4 bg-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md"
                  style={{ color: DARK }}>
                  🏅 Industry Certified
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ TESTIMONIALS ══════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
            <div>
              <SectionHeader title="Student Success Stories" />
              <p className="text-gray-500 text-sm max-w-md">Hear directly from ZINT graduates who have transformed their careers.</p>
            </div>
            <button className="text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 self-start md:self-auto"
              style={{ color: PRIMARY }}
              onMouseEnter={e => e.currentTarget.style.color = BLUE}
              onMouseLeave={e => e.currentTarget.style.color = PRIMARY}>
              View all stories <FiChevronRight />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="rounded-2xl p-6 border transition-all duration-300"
                style={{ background: "#fff8fb", border: "1px solid #fce7f3", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${BLUE}60`; e.currentTarget.style.boxShadow = `0 8px 40px ${BLUE}20`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#fce7f3";   e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.03)"; }}>
                <div className="text-5xl font-serif leading-none mb-3 select-none" style={{ color: PRIMARY, opacity: 0.28 }}>"</div>
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
                    <p className="font-bold text-sm" style={{ color: DARK }}>{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ CTA BANNER ══════════════════════════ */}
      <section
  className="py-16 relative overflow-hidden"
  style={{
    background: `linear-gradient(135deg, ${PRIMARY} 0%, #9d174d 55%, ${BLUE} 100%)`
  }}
>
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      background:
        "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 65%)"
    }}
  ></div>

  <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
    <h2 className="text-white text-3xl md:text-4xl font-extrabold mb-3">
      Ready to Start Your Journey?
    </h2>

    <p
      className="mb-8 text-sm md:text-base"
      style={{ color: "rgba(255,255,255,0.72)" }}
    >
      Join 2,400+ students who've already transformed their careers.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onClick={handleEnroll}
        className="bg-white font-bold px-10 py-4 rounded-xl text-sm transition-all duration-200"
        style={{ color: PRIMARY, boxShadow: "0 10px 30px rgba(0,0,0,0.18)" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "#fce7f3")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "white")
        }
      >
        Enroll Now – ₹{feeFormatted}
      </button>

      <button
        onClick={handleDownloadClick}
        className="font-bold px-8 py-4 rounded-xl text-sm text-white border-2 border-white transition-all duration-200 flex items-center justify-center gap-2"
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.14)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "transparent")
        }
      >
        <span>Download Curriculum</span>
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
        <p className="font-bold text-sm" style={{ color: DARK }}>{value}</p>
      </div>
      <p className="text-gray-400 text-xs">{label}</p>
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <h2 className="text-2xl md:text-3xl font-extrabold mb-3 tracking-tight" style={{ color: DARK }}>
      {title}
    </h2>
  );
}