import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import { useAuth } from "../hooks/useAuth";
import { PiCertificate } from "react-icons/pi";
import {
  FiShare2, FiDownload, FiCheck, FiStar,
  FiClock, FiCalendar, FiMonitor, FiGlobe, FiChevronRight,
  FiArrowRight, FiPlayCircle, FiAward, FiBriefcase,
  FiX, FiUser, FiLoader,
} from "react-icons/fi";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { MdOutlineVerified } from "react-icons/md";
import Loading from "../components/Loading";
import { toHttps } from "../utils/imgUrl";

/* ═══════════════════════════════════════════════════════
   ZINT COLOR SYSTEM  —  Pink / Magenta primary
═══════════════════════════════════════════════════════ */
const PRIMARY   = "#E91E8C";
const PRIMARY_H = "#C0176E";
const BLUE      = "#38BDF8";
const GREEN     = "#22C55E";
const DARK      = "#111827";
const BG        = "#FFF0F8";

const RATING_URL = `${import.meta.env.VITE_API_URL}/rating`;

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

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────── */
async function safeFetch(url, options) {
  const res = await fetch(url, options);
  const raw = await res.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { /* not JSON */ }
  if (!res.ok) throw new Error(data?.msg || `Request failed with status ${res.status}`);
  return data;
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0]?.toUpperCase())
    .join("");
}

const AVATAR_COLORS = [PRIMARY, BLUE, GREEN, "#9333EA", "#F59E0B"];

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
   AUTH GATE MODAL  (used for BOTH enroll + curriculum download)
───────────────────────────────────────────────── */
function AuthGateModal({ title, message, onClose, onGoSignUp, onGoSignIn }) {
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
          <h2 className="text-xl font-extrabold mb-2" style={{ color: DARK }}>{title}</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">{message}</p>
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
   ADD REVIEW MODAL
───────────────────────────────────────────────── */
function AddReviewModal({ courseName, ratingForm, setRatingForm, onSubmit, onClose, submitting, error, success }) {
  const [hoverRating, setHoverRating] = useState(0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(17,24,39,0.75)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden bg-white p-6 sm:p-8"
        style={{ boxShadow: `0 32px 80px ${PRIMARY}38` }}>
        <div className="h-1 absolute top-0 left-0 right-0" style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${BLUE})` }} />
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all bg-gray-100 text-gray-500 hover:bg-pink-100 hover:text-pink-600">
          <FiX size={16} />
        </button>

        <div className="text-center mb-5">
          <span className="text-2xl">⭐</span>
          <h3 className="text-xl font-extrabold mt-1" style={{ color: DARK }}>Rate & Review Course</h3>
          <p className="text-xs text-pink-600 font-semibold">{courseName}</p>
        </div>

        {success ? (
          <div className="text-center py-6 px-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="text-3xl mb-2">🎉</div>
            <p className="text-emerald-800 font-bold text-sm mb-1">{success}</p>
            <p className="text-emerald-600 text-xs">Your review helps future learners make informed decisions.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="flex flex-col items-center">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Select Your Rating *</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRatingForm({ ...ratingForm, rating: star })}
                    className="text-3xl transition-transform hover:scale-110 focus:outline-none"
                    style={{ color: star <= (hoverRating || ratingForm.rating) ? "#F59E0B" : "#E5E7EB" }}
                  >
                    ★
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold mt-1 text-pink-600">
                {["", "1 - Poor", "2 - Fair", "3 - Good", "4 - Very Good", "5 - Excellent"][hoverRating || ratingForm.rating]}
              </span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Your Account Details</label>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">🔒 Verified Account</span>
              </div>
              <input
                type="text"
                readOnly
                disabled
                value={ratingForm.studentName || "Logged in User"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-100 text-gray-700 cursor-not-allowed font-medium mb-2"
              />
              <input
                type="email"
                readOnly
                disabled
                value={ratingForm.studentEmail || ""}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-100 text-gray-700 cursor-not-allowed font-medium"
              />
              <p className="text-[10px] text-gray-400 mt-1">Name and email are linked directly to your user account.</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Review (Optional)</label>
                <span className="text-[10px] text-gray-400">{ratingForm.review.length}/500</span>
              </div>
              <textarea
                rows={3}
                maxLength={500}
                value={ratingForm.review}
                onChange={e => setRatingForm({ ...ratingForm, review: e.target.value })}
                placeholder="Share your experience, trainer feedback, projects completed..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-500 bg-gray-50 resize-none text-gray-900"
              />
            </div>

            {error && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full font-bold py-3 rounded-xl text-sm text-white transition-all duration-200 flex items-center justify-center gap-2"
              style={{ background: PRIMARY, boxShadow: `0 8px 24px ${PRIMARY}44` }}
            >
              {submitting ? <><FiLoader className="animate-spin" /> Submitting...</> : "Submit Review →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ── Curriculum Download Lead Modal ── */
function CurriculumDownloadModal({
  courseName,
  curriculumForm,
  setCurriculumForm,
  onSubmit,
  onClose,
  submitting,
  error,
  success,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm transition"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center text-2xl text-pink-600">
            📄
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-gray-900 leading-tight">Download Curriculum</h3>
            <p className="text-xs text-gray-500">{courseName}</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          Please enter your details below to download the complete syllabus & course structure for <strong className="text-pink-600">{courseName}</strong>.
        </p>

        {success ? (
          <div className="text-center py-6 px-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="text-3xl mb-2">🎉</div>
            <p className="text-emerald-800 font-bold text-sm mb-1">{success}</p>
            <p className="text-emerald-600 text-xs">Your curriculum PDF is downloading automatically.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={curriculumForm.fullName}
                onChange={(e) => setCurriculumForm({ ...curriculumForm, fullName: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-500 bg-gray-50 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={curriculumForm.email}
                onChange={(e) => setCurriculumForm({ ...curriculumForm, email: e.target.value })}
                placeholder="e.g. rahul@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-500 bg-gray-50 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                WhatsApp Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={curriculumForm.mobile}
                onChange={(e) => setCurriculumForm({ ...curriculumForm, mobile: e.target.value })}
                placeholder="e.g. +91 9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-500 bg-gray-50 text-gray-900"
              />
            </div>

            {error && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full font-bold py-3 rounded-xl text-sm text-white transition-all duration-200 flex items-center justify-center gap-2"
              style={{ background: PRIMARY, boxShadow: `0 8px 24px ${PRIMARY}44` }}
            >
              {submitting ? (
                <>
                  <FiLoader className="animate-spin" /> Submitting & Downloading...
                </>
              ) : (
                "Submit & Download PDF 📥"
              )}
            </button>
          </form>
        )}
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
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [activeTab, setActiveTab]               = useState("overview");
  const [authGate, setAuthGate]                 = useState(null); // { title, message } | null
  const [downloading, setDownloading]           = useState(false);

  const [reviews, setReviews]                   = useState([]);
  const [ratingStats, setRatingStats]           = useState({ avgRating: 0, totalRatings: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
  const [reviewsLoading, setReviewsLoading]     = useState(true);

  const [showReviewModal, setShowReviewModal]   = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingForm, setRatingForm]             = useState({ rating: 5, review: "", studentName: "", studentEmail: "" });
  const [ratingError, setRatingError]           = useState("");
  const [ratingSuccess, setRatingSuccess]       = useState("");

  // ── Curriculum Lead Form Modal State ──
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [curriculumForm, setCurriculumForm]           = useState({ fullName: "", email: "", mobile: "" });
  const [submittingCurriculum, setSubmittingCurriculum] = useState(false);
  const [curriculumError, setCurriculumError]         = useState("");
  const [curriculumSuccess, setCurriculumSuccess]     = useState("");

  // Resolve course before any effects that depend on it.
  const course = data?.courses?.find(c => String(c._id) === String(id));

  // Populate user data into rating & curriculum form when logged in
  useEffect(() => {
    if (user) {
      setRatingForm(prev => ({
        ...prev,
        studentName: user.name || prev.studentName,
        studentEmail: user.email || prev.studentEmail,
      }));
      setCurriculumForm(prev => ({
        ...prev,
        fullName: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : (user.name || prev.fullName),
        email: user.email || prev.email,
        mobile: user.contactNo || prev.mobile,
      }));
    }
  }, [user]);

  // Fetch real reviews & stats for this course
  const fetchReviews = async () => {
    if (!course?.courseName) return;
    setReviewsLoading(true);
    try {
      const res = await safeFetch(`${RATING_URL}/target/${encodeURIComponent(course.courseName)}?targetType=course`);
      const list = res?.ratings || res?.data || [];
      const visibleList = list.filter(r => r.isVisible !== false);
      setReviews(visibleList);

      const total = visibleList.length;
      const computedAvg = total
        ? parseFloat((visibleList.reduce((sum, r) => sum + (r.rating || 0), 0) / total).toFixed(1))
        : 0;

      const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      visibleList.forEach(r => {
        if (r.rating >= 1 && r.rating <= 5) dist[r.rating]++;
      });

      setRatingStats({
        avgRating: res?.avgRating || computedAvg,
        totalRatings: res?.totalRatings ?? total,
        distribution: res?.distribution || dist,
      });
    } catch (err) {
      console.log("Error fetching ratings:", err);
      setReviews([]);
      setRatingStats({ avgRating: 0, totalRatings: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [course?.courseName]);

  const handleOpenReviewModal = () => {
    if (!isLoggedIn) {
      setAuthGate({
        title: "Login Required",
        message: "Please sign in or create an account to submit a review.",
      });
      return;
    }
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setRatingError("");
    setRatingSuccess("");

    if (!isLoggedIn) {
      setAuthGate({
        title: "Login Required",
        message: "Please sign in to submit a review.",
      });
      return;
    }

    if (!ratingForm.rating || ratingForm.rating < 1 || ratingForm.rating > 5) {
      setRatingError("Please select a valid star rating (1-5).");
      return;
    }

    setSubmittingRating(true);
    try {
      const res = await safeFetch(`${RATING_URL}/addRating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          targetType: "course",
          targetName: course.courseName,
          rating: Number(ratingForm.rating),
          review: ratingForm.review.trim(),
        }),
      });

      setRatingSuccess(res?.msg || "Review submitted successfully! It will be published after admin approval.");
      setRatingForm(prev => ({ ...prev, rating: 5, review: "" }));
      await fetchReviews();
      setTimeout(() => {
        setShowReviewModal(false);
        setRatingSuccess("");
      }, 2200);
    } catch (err) {
      setRatingError(err.message || "Failed to submit review. Please try again.");
    } finally {
      setSubmittingRating(false);
    }
  };

  // ── Navigation helpers ──
  const goToSignIn = () => {
    navigate(`/login?redirect=${encodeURIComponent(`/courses/${id}`)}`);
    setAuthGate(null);
  };

  const goToSignUp = () => {
    navigate(`/signup?redirect=/courses/${id}`);
    setAuthGate(null);
  };

  // ── ENROLL handler ──
  const handleEnroll = () => {
    if (!isLoggedIn) {
      setAuthGate({
        title: "Login Required",
        message: "Please sign in or create an account to enroll in this course.",
      });
      return;
    }
    navigate(`/courses/${id}/fee`);
  };

  // ── DOWNLOAD CURRICULUM handler — opens lead popup (no login required) ──
  const handleDownloadClick = () => {
    if (!course?.courseCurriculum) {
      alert("Curriculum not available for this course yet.");
      return;
    }
    setCurriculumError("");
    setCurriculumSuccess("");
    setShowCurriculumModal(true);
  };

  const handleCurriculumSubmit = async (e) => {
    e.preventDefault();
    setCurriculumError("");
    setCurriculumSuccess("");

    if (!curriculumForm.fullName.trim() || !curriculumForm.email.trim() || !curriculumForm.mobile.trim()) {
      setCurriculumError("Please fill in all fields (Name, Email, WhatsApp Mobile Number).");
      return;
    }

    setSubmittingCurriculum(true);
    try {
      const ENQUIRY_URL = `${import.meta.env.VITE_API_URL}/enquiry`;
      await safeFetch(`${ENQUIRY_URL}/addEnquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: curriculumForm.fullName.trim(),
          email: curriculumForm.email.trim(),
          mobile: curriculumForm.mobile.trim(),
          course: course._id,
          mode: "Curriculum Download",
          message: `Curriculum downloaded for ${course.courseName}`,
        }),
      });

      setCurriculumSuccess("Thank you! PDF sent to your Email & downloading now...");

      // Trigger PDF download
      setDownloading(true);
      await blobDownload(course.courseCurriculum, `${course.courseName}_Curriculum.pdf`);

      setTimeout(() => {
        setShowCurriculumModal(false);
        setCurriculumSuccess("");
      }, 1500);
    } catch (err) {
      console.error("Curriculum submission error:", err);
      // Fallback: try direct download if API call fails
      try {
        await blobDownload(course.courseCurriculum, `${course.courseName}_Curriculum.pdf`);
        setShowCurriculumModal(false);
      } catch {
        setCurriculumError(err.message || "Failed to process request. Please try again.");
      }
    } finally {
      setSubmittingCurriculum(false);
      setDownloading(false);
    }
  };

  // ── Loading / not-found guards (kept AFTER all hooks so hook order stays stable) ──
  if (!data?.courses) {
    return <Loading />;
  }

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

  const tabs   = ["overview", "roadmap", "certificate", "reviews"];
  const isFree = !course.fee || course.fee === 0;
  const feeFormatted = isFree ? "Free" : `₹${course.fee.toLocaleString("en-IN")}`;
  const feeStruck     = isFree ? null : `₹${((course.fee ?? 0) * 2).toLocaleString("en-IN")}`;

  // ── review stats ──
  const displayAvgRating = ratingStats.totalRatings > 0
    ? ratingStats.avgRating
    : (course.rating ?? "4.9");
  const displayReviewCount = ratingStats.totalRatings > 0
    ? `${ratingStats.totalRatings} rating${ratingStats.totalRatings > 1 ? "s" : ""}`
    : "2,400+ students";

  return (
    <div className="min-h-screen font-sans" style={{ background: BG }}>

      {/* ── Modals ── */}
      {authGate && (
        <AuthGateModal
          title={authGate.title}
          message={authGate.message}
          onClose={() => setAuthGate(null)}
          onGoSignIn={goToSignIn}
          onGoSignUp={goToSignUp}
        />
      )}
      {downloading && (
        <DownloadingOverlay courseName={course.courseName} />
      )}
      {showReviewModal && (
        <AddReviewModal
          courseName={course.courseName}
          ratingForm={ratingForm}
          setRatingForm={setRatingForm}
          onSubmit={handleReviewSubmit}
          onClose={() => { setShowReviewModal(false); setRatingError(""); setRatingSuccess(""); }}
          submitting={submittingRating}
          error={ratingError}
          success={ratingSuccess}
        />
      )}
      {showCurriculumModal && (
        <CurriculumDownloadModal
          courseName={course.courseName}
          curriculumForm={curriculumForm}
          setCurriculumForm={setCurriculumForm}
          onSubmit={handleCurriculumSubmit}
          onClose={() => { setShowCurriculumModal(false); setCurriculumError(""); setCurriculumSuccess(""); }}
          submitting={submittingCurriculum}
          error={curriculumError}
          success={curriculumSuccess}
        />
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
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={i < Math.round(Number(displayAvgRating)) ? "fill-yellow-400" : ""}
                      style={{ opacity: i < Math.round(Number(displayAvgRating)) ? 1 : 0.3 }}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold" style={{ color: DARK }}>{displayAvgRating}</span>
                <span className="text-gray-400 text-sm">
                  ({displayReviewCount})
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${GREEN}18`, color: "#15803d", border: `1px solid ${GREEN}33` }}>
                  ✓ 95% Placement Rate
                </span>
              </div>

              {/* Desktop CTAs */}
              <div className="hidden md:flex items-center gap-3 flex-wrap">
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
                  src={toHttps(course.courseImage)}
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
                  <p className="font-extrabold text-2xl" style={{ color: isFree ? GREEN : DARK }}>{feeFormatted}</p>
                  {feeStruck && <p className="text-gray-400 text-xs line-through">{feeStruck}</p>}
                </div>
                {!isFree && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: `${GREEN}18`, color: "#15803d", border: `1px solid ${GREEN}33` }}>
                    50% OFF
                  </span>
                )}
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
              Enroll Now → {feeFormatted}
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ INFO STRIP ══════════════════════════ */}
      <section className="bg-white border-b border-pink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="hidden md:flex items-stretch divide-x divide-pink-100">
            <InfoItem icon={<FiCalendar style={{ color: PRIMARY }} />} label="Date of Commencement" value={course.startDate || "28 Apr, 2026"} />
            <InfoItem icon={<FiClock   style={{ color: BLUE    }} />} label="Duration"             value={course.duration || "N/A"} />
            <InfoItem icon={<FiStar    style={{ color: PRIMARY }} />} label="Course Fee"           value={feeFormatted} valueColor={isFree ? GREEN : DARK} />
            <InfoItem icon={<FiMonitor style={{ color: BLUE    }} />} label="Delivery Mode"        value={course.mode || "Live"} />
            <InfoItem icon={<FiGlobe  style={{ color: GREEN   }} />} label="Language"             value={course.language || "Hinglish"} />
          </div>
          <div className="md:hidden grid grid-cols-2 gap-px bg-pink-50 rounded-xl overflow-hidden">
            {[
              { label: "Commencement", value: course.startDate || "28 Apr, 2026" },
              { label: "Duration",     value: course.duration || "N/A" },
              { label: "Fee",          value: feeFormatted, color: isFree ? GREEN : DARK },
              { label: "Mode",         value: course.mode || "Live" },
            ].map(item => (
              <div key={item.label} className="bg-white py-4 px-3 text-center">
                <p className="font-bold text-sm" style={{ color: item.color || DARK }}>{item.value}</p>
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
              <button key={tab} onClick={() => {
                setActiveTab(tab);
                if (tab === "reviews") {
                  document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
                } else if (tab === "roadmap") {
                  document.getElementById("roadmap-section")?.scrollIntoView({ behavior: "smooth" });
                } else if (tab === "certificate") {
                  document.getElementById("certificate-section")?.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
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
      <section id="roadmap-section" className="relative overflow-hidden py-20"
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
      <section id="certificate-section" className="py-16" style={{ background: BG }}>
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

      {/* ══════════════════════════ REVIEWS (real data) ══════════════════════════ */}
      <section id="reviews-section" className="py-16 bg-white border-t border-pink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <SectionHeader title="Student Success Stories" />
              <p className="text-gray-500 text-sm max-w-md">Real reviews and ratings from ZINT students enrolled in this course.</p>
            </div>
            <button
              onClick={handleOpenReviewModal}
              className="font-bold px-5 py-3 rounded-xl text-sm text-white transition-all duration-200 flex items-center gap-2 self-start sm:self-auto"
              style={{ background: PRIMARY, boxShadow: `0 8px 24px ${PRIMARY}44` }}
            >
              <span>⭐ Rate & Review Course</span>
            </button>
          </div>

          {/* Rating Breakdown Summary Bar */}
          {ratingStats.totalRatings > 0 && (
            <div className="rounded-2xl p-6 mb-10 border flex flex-col md:flex-row items-center gap-8"
              style={{ background: "linear-gradient(135deg, #FFF0F8 0%, #FDF4FF 100%)", borderColor: "#FCE7F3" }}>
              <div className="text-center md:border-r border-pink-200 md:pr-10 flex-shrink-0">
                <p className="text-5xl font-black" style={{ color: DARK }}>{ratingStats.avgRating}</p>
                <div className="flex text-yellow-400 justify-center my-2 text-2xl gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <span key={idx}>{idx < Math.round(Number(ratingStats.avgRating)) ? "★" : "☆"}</span>
                  ))}
                </div>
                <p className="text-xs font-semibold text-gray-500">{ratingStats.totalRatings} verified student review{ratingStats.totalRatings > 1 ? "s" : ""}</p>
              </div>

              <div className="flex-1 w-full space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingStats.distribution[star] || 0;
                  const pct = ratingStats.totalRatings ? Math.round((count / ratingStats.totalRatings) * 100) : 0;
                  return (
                    <div key={star} className="flex items-center gap-3 text-xs">
                      <span className="w-8 font-bold text-gray-600">{star} ★</span>
                      <div className="flex-1 h-2.5 rounded-full overflow-hidden bg-white/80 border border-pink-100">
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: PRIMARY }} />
                      </div>
                      <span className="w-12 text-right text-gray-500 font-medium">{count} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {reviewsLoading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-gray-400 text-sm">
              <FiLoader className="animate-spin text-pink-600" /> Loading reviews…
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-14 px-6 rounded-2xl border border-dashed border-pink-200 bg-pink-50/50">
              <span className="text-4xl mb-3 inline-block">💬</span>
              <p className="text-gray-700 font-extrabold text-base mb-1">No reviews yet for this course</p>
              <p className="text-gray-400 text-sm mb-5">Be the first student to rate and share your experience with {course.courseName}!</p>
              <button
                onClick={() => setShowReviewModal(true)}
                className="font-bold px-6 py-3 rounded-xl text-sm text-white transition-all"
                style={{ background: PRIMARY }}
              >
                Write the First Review →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((r) => {
                const avatarColor = AVATAR_COLORS[
                  Math.abs(
                    (r.studentName || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0)
                  ) % AVATAR_COLORS.length
                ];
                const starCount = Math.round(r.rating || 5);
                return (
                  <div key={r._id} className="rounded-2xl p-6 border transition-all duration-300"
                    style={{ background: "#fff8fb", border: "1px solid #fce7f3", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${BLUE}60`; e.currentTarget.style.boxShadow = `0 8px 40px ${BLUE}20`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#fce7f3";   e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.03)"; }}>
                    <div className="text-5xl font-serif leading-none mb-3 select-none" style={{ color: PRIMARY, opacity: 0.28 }}>"</div>
                    <div className="flex text-yellow-400 text-xl gap-1 mb-3">
                      {[...Array(5)].map((_, idx) => (
                        <FiStar key={idx} className={idx < starCount ? "fill-yellow-400" : ""} style={{ opacity: idx < starCount ? 1 : 0.3 }} />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
                      "{r.review || "Great learning experience!"}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ background: avatarColor }}>
                        {getInitials(r.studentName)}
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: DARK }}>{r.studentName}</p>
                        <p className="text-gray-400 text-xs">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "Verified Student"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════ CTA BANNER ══════════════════════════ */}
      <section
        className="py-16 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #9d174d 55%, ${BLUE} 100%)` }}
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
              Enroll Now – {feeFormatted}
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
function InfoItem({ icon, label, value, valueColor }) {
  return (
    <div className="flex-1 text-center px-4 py-1">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        {icon}
        <p className="font-bold text-sm" style={{ color: valueColor || DARK }}>{value}</p>
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
