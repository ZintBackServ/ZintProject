// Admission.jsx — /OnlineAdmission route
// Course catalog: View Course + Enroll Now.
// NO course fee on card. Fee is only displayed in the "Choose Your Plan" payment modal when clicking "Enroll Now".

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const API = import.meta.env.VITE_API_URL;
const inr = (n) => "₹ " + Number(n).toLocaleString("en-IN");

const ONLINE_FEATURES = [
  { title: "Live Online Classes",     desc: "Attend classes from anywhere via Zoom / Google Meet" },
  { title: "Recorded Sessions",       desc: "Lifetime access to all recorded lectures" },
  { title: "Doubt Clearing Sessions", desc: "Weekly live Q&A with mentors" },
  { title: "Digital Study Material",  desc: "PDFs, notes & assignments shared digitally" },
  { title: "Placement Support",       desc: "Resume building, mock interviews & job referrals" },
  { title: "Certificate",             desc: "Industry-recognised course completion certificate" },
];

const OFFLINE_FEATURES = [
  { title: "Physical Classroom",      desc: "In-person sessions at our institute campus" },
  { title: "Recorded Backup",         desc: "Access recordings if you miss a class" },
  { title: "Printed Study Material",  desc: "Comprehensive printed notes & workbooks" },
  { title: "Doubt Clearing Sessions", desc: "Face-to-face doubt sessions with faculty" },
  { title: "Placement Support",       desc: "Resume building, mock interviews & job referrals" },
  { title: "Certificate",             desc: "Industry-recognised course completion certificate" },
];

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  const colorMap = {
    success: "border-emerald-400 text-emerald-700 bg-emerald-50",
    error:   "border-red-400   text-red-700   bg-red-50",
    info:    "border-purple-400 text-purple-700 bg-purple-50",
  };
  return (
    <div
      className={`fixed bottom-7 right-7 z-50 max-w-xs border rounded-xl px-5 py-3.5 text-sm font-medium shadow-xl transition-all duration-300 ${colorMap[toast.type] || colorMap.info}`}
    >
      {toast.msg}
    </div>
  );
}

// ─── Plan Feature Tick ────────────────────────────────────────────────────────
function Tick() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
      <circle cx="8" cy="8" r="8" fill="#B026B5" opacity="0.15" />
      <path d="M4.5 8l2.5 2.5 4.5-5" stroke="#B026B5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Choose Your Plan Modal (Exact UI as in Course Pricing / Detail Page) ─────
function ChoosePlanModal({ course, onClose, onBuy, payLoading }) {
  if (!course) return null;

  const onlinePrice  = Number(course.online_fee ?? 0);
  const offlinePrice = Number(course.fee ?? 0);

  const hasOnline  = onlinePrice > 0;
  const hasOffline = offlinePrice > 0;
  const isFree     = !hasOnline && !hasOffline;
  const isBoth     = hasOnline && hasOffline;

  // Determine initial mode based on available prices
  const [selectedMode, setSelectedMode] = useState(() => {
    if (hasOffline && !hasOnline) return "Offline";
    return "Online";
  });

  const activePrice   = selectedMode === "Online" ? onlinePrice : offlinePrice;
  const originalPrice = Math.round(activePrice * 1.6);
  const features      = selectedMode === "Online" ? ONLINE_FEATURES : OFFLINE_FEATURES;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#f8f9fa] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative border border-slate-200 text-slate-800 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-purple-100 hover:text-purple-700 transition-colors text-xl font-bold z-10"
        >
          ✕
        </button>

        {/* ── Modal Header ── */}
        <div className="text-center mb-6 pr-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[#B026B5] mb-1">
            {course.courseName}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
            {isBoth ? "Choose Your Plan" : `${selectedMode} Enrollment`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isBoth
              ? "Select the learning mode that suits you best"
              : `This course is offered in ${selectedMode} mode`}
          </p>
        </div>

        {/* ── Mode Toggle Switch (Only show if both modes are available) ── */}
        {isBoth && (
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center p-1.5 rounded-full bg-slate-200/80 shadow-inner gap-1">
              <button
                type="button"
                onClick={() => setSelectedMode("Online")}
                className={`px-8 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                  selectedMode === "Online"
                    ? "bg-white text-[#B026B5] shadow-md"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Online
              </button>
              <button
                type="button"
                onClick={() => setSelectedMode("Offline")}
                className={`px-8 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                  selectedMode === "Offline"
                    ? "bg-white text-[#B026B5] shadow-md"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Offline
              </button>
            </div>
          </div>
        )}

        {/* ── Plan Card ── */}
        <div className="bg-white rounded-2xl p-6 border-2 border-[#B026B5] shadow-lg mb-6 relative">
          <div className="text-3xl mb-3">{selectedMode === "Online" ? "🌐" : "🏫"}</div>

          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-xl font-bold text-slate-900">{selectedMode} Mode</h3>
            {selectedMode === "Online" && (
              <span className="text-[11px] font-bold px-3 py-0.5 rounded-full text-white bg-[#7c3aed]">
                Recommended
              </span>
            )}
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-extrabold text-slate-900">
              {isFree ? "Free" : inr(activePrice)}
            </span>
            {!isFree && originalPrice > activePrice && (
              <span className="text-lg line-through text-slate-400 font-medium">
                {inr(originalPrice)}
              </span>
            )}
          </div>

          <p className="text-xs text-[#B026B5] font-semibold mb-6">
            {selectedMode === "Online" ? "Registrations close soon" : "Limited campus seats available"}
          </p>

          {/* Buy Now Button */}
          <button
            type="button"
            disabled={payLoading}
            onClick={() => onBuy(course, isFree ? "free" : selectedMode, activePrice)}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-[#B026B5] hover:bg-[#8f1e92] transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 mb-6"
          >
            {payLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing…
              </>
            ) : isFree ? (
              "Enroll for Free"
            ) : (
              "Buy now"
            )}
          </button>

          {/* Feature List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-slate-100">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <Tick />
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-snug">{f.title}</p>
                  <p className="text-[11px] text-slate-500 leading-tight">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Price Comparison Strip (Only show if both modes are available) ── */}
        {isBoth && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center mb-3">
              Price Comparison
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedMode("Online")}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  selectedMode === "Online"
                    ? "bg-purple-50/70 border-[#B026B5] text-[#B026B5]"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:border-purple-300"
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span>🌐</span> Online
                </div>
                <span className="text-sm font-extrabold">{inr(onlinePrice)}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode("Offline")}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  selectedMode === "Offline"
                    ? "bg-purple-50/70 border-[#B026B5] text-[#B026B5]"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:border-purple-300"
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span>🏫</span> Offline
                </div>
                <span className="text-sm font-extrabold">{inr(offlinePrice)}</span>
              </button>
            </div>
          </div>
        )}

        {/* ── Course Metadata Strip ── */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap gap-4 items-center justify-around text-center text-xs">
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Duration</p>
            <p className="font-bold text-slate-800">{course.duration ? `${course.duration} months` : "—"}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Language</p>
            <p className="font-bold text-slate-800">{course.language || "English / Hindi"}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Mode</p>
            <p className="font-bold text-slate-800">{course.mode || "Hybrid"}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Category</p>
            <p className="font-bold text-slate-800">{course.category?.categoryName || "Training"}</p>
          </div>
        </div>

        {/* Pending hint */}
        <p className="text-center text-[11px] text-slate-400 mt-4">
          If you close the payment window, your enrollment will be saved as{" "}
          <span className="text-amber-600 font-semibold">pending</span>.
        </p>
      </div>
    </div>
  );
}

// ─── Course Card (No fee displayed) ───────────────────────────────────────────
function CourseCard({ course, enrolled, onViewCourse, onEnroll }) {
  const [hovered, setHovered] = useState(false);
  const title = course.courseName || course.title;
  const thumb = course.courseImage;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-200"
      style={{
        border:    `1px solid ${hovered ? "#B026B5" : "#e2e8f0"}`,
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 12px 32px rgba(176,38,181,0.14), 0 2px 8px rgba(0,0,0,0.06)"
          : "0 2px 8px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        {thumb ? (
          <img
            src={thumb}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">📚</div>
        )}

        {/* Enrolled badge */}
        {enrolled && (
          <span className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-md">
            ✓ Enrolled
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-base font-bold text-slate-900 leading-snug mb-1 line-clamp-2">
          {title}
        </h3>

        <p className="text-xs text-slate-500 mb-4">
          {course?.category?.categoryName || "General"}
          {course.duration ? ` · ${course.duration} Months` : ""}
          {course.mode ? ` · ${course.mode}` : ""}
        </p>

        {/* Action Buttons — View Course & Enroll Now */}
        <div className="mt-auto flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => onViewCourse(course._id)}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:border-purple-400 hover:text-purple-700 bg-white transition-all"
          >
            View Course
          </button>
          <button
            type="button"
            onClick={() => onEnroll(course)}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm"
            style={{
              background: enrolled
                ? "linear-gradient(135deg,#10b981,#059669)"
                : "linear-gradient(135deg,#B026B5,#8E1387)",
            }}
          >
            {enrolled ? "Enrolled ✓" : "Enroll Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function Admission() {
  const { user, authLoading } = useAuth();
  const navigate              = useNavigate();

  const [courses,     setCourses]     = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [search,      setSearch]      = useState("");
  const [toast,       setToast]       = useState(null);
  const [modalCourse, setModalCourse] = useState(null);
  const [payLoading,  setPayLoading]  = useState(false);
  const toastTimer = useRef(null);

  // ── Redirect guest to login ──
  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate("/login?redirect=/OnlineAdmission", { replace: true });
  }, [user, authLoading, navigate]);

  // ── Toast helper ──
  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Fetch courses & user enrollments ──
  useEffect(() => {
    // Don't fetch until auth has fully resolved and user is confirmed logged in
    if (authLoading || !user) return;
    (async () => {
      try {
        const [courseRes, enrollRes] = await Promise.all([
          fetch(`${API}/course/getAllCourse`),
          fetch(`${API}/api/enrollments`, { credentials: "include" }),
        ]);
        const cj = await courseRes.json();
        const ej = await enrollRes.json();
        setCourses(cj.courses || cj.data || []);
        // Silently handle 401 — just set empty enrollments (user not logged in properly)
        setEnrollments(ej.success ? ej.data : []);
      } catch {
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user, authLoading]);

  // ── Enrolled course IDs set ──
  const enrolledIds = useMemo(() => {
    const s = new Set();
    enrollments.forEach((e) => {
      if (["active", "completed"].includes(e.status)) {
        s.add(e.courseId?._id || e.courseId);
      }
    });
    return s;
  }, [enrollments]);

  // ── Razorpay Integration ──
  const openRazorpay = useCallback(({ order, key, courseTitle }) => {
    const options = {
      key,
      amount:      order.amount,
      currency:    order.currency,
      name:        "Zint Institute",
      description: courseTitle,
      order_id:    order.id,
      handler: async (response) => {
        showToast("Verifying payment…", "info");
        try {
          const res  = await fetch(`${API}/api/payments/verify`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            }),
          });
          const data = await res.json();
          if (data.success) {
            showToast("Payment successful! You are enrolled 🎉", "success");
            setModalCourse(null);
            // Refresh enrollments
            const r = await fetch(`${API}/api/enrollments`, { credentials: "include" });
            const d = await r.json();
            setEnrollments(d.success ? d.data : []);
          } else {
            showToast(data.message || "Payment verification failed", "error");
          }
        } catch {
          showToast("Verification failed", "error");
        } finally {
          setPayLoading(false);
        }
      },
      theme: { color: "#B026B5" },
      modal: {
        ondismiss: () => {
          showToast("Payment cancelled. Your enrollment is saved as pending.", "info");
          setPayLoading(false);
        },
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (r) => {
      showToast("Payment failed: " + (r.error?.description || "Unknown error"), "error");
      setPayLoading(false);
    });
    rzp.open();
  }, [showToast]);

  // ── Handle "Buy now" inside Modal ──
  const handleBuyPlan = async (course, mode, price) => {
    if (mode === "free") {
      setPayLoading(true);
      showToast("Enrolling in free course…", "info");
      try {
        const res  = await fetch(`${API}/api/payments/enroll-free`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ courseId: course._id }),
        });
        const data = await res.json();
        showToast(data.message, data.success ? "success" : "error");
        if (data.success) {
          setEnrollments((prev) => [...prev, data.data]);
          setModalCourse(null);
        }
      } catch {
        showToast("Enrollment failed", "error");
      } finally {
        setPayLoading(false);
      }
      return;
    }

    setPayLoading(true);
    showToast("Creating order…", "info");
    try {
      const res  = await fetch(`${API}/api/payments/create-order`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ courseId: course._id, mode, amount: price }),
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.message || "Could not create order.", "error");
        setPayLoading(false);
        return;
      }
      openRazorpay({ order: data.order, key: data.key, courseTitle: course.courseName });
    } catch {
      showToast("Could not initiate payment", "error");
      setPayLoading(false);
    }
  };

  // ── Search filter ──
  const filtered = useMemo(() => {
    if (!search.trim()) return courses;
    const q = search.toLowerCase();
    return courses.filter(
      (c) =>
        (c.courseName || "").toLowerCase().includes(q) ||
        (c.category?.categoryName || "").toLowerCase().includes(q)
    );
  }, [courses, search]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center text-slate-400">
          <div className="text-4xl mb-3 animate-spin">⏳</div>
          <p className="text-sm">Redirecting…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                🎓 Online Admission
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Explore available courses and enroll online — {courses.length} courses listed
              </p>
            </div>

            {/* User Badge */}
            {user && (
              <div className="flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-xl px-4 py-2.5 shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#B026B5] text-white flex items-center justify-center font-bold text-sm">
                  {user.firstName?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">{user.firstName} {user.lastName}</div>
                  <div className="text-[10px] text-slate-500">{user.email}</div>
                </div>
              </div>
            )}
          </div>

          {/* Search box */}
          <div className="mt-5 relative max-w-md">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses…"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
        </div>
      </div>

      {/* ── Main Catalog Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
            <div className="w-10 h-10 border-4 border-[#B026B5] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Loading courses…</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="text-5xl">⚠️</div>
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 text-sm font-semibold bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
            <div className="text-5xl">📭</div>
            <p className="text-sm">
              {search ? `No courses matching "${search}"` : "No courses available"}
            </p>
            {search && (
              <button onClick={() => setSearch("")} className="text-[#B026B5] text-xs font-semibold hover:underline">
                Clear search
              </button>
            )}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <CourseCard
                key={c._id}
                course={c}
                enrolled={enrolledIds.has(c._id)}
                onViewCourse={(id) => navigate(`/courses/${id}`)}
                onEnroll={(course) => setModalCourse(course)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Choose Your Plan Payment Modal ── */}
      {modalCourse && (
        <ChoosePlanModal
          course={modalCourse}
          onClose={() => setModalCourse(null)}
          onBuy={handleBuyPlan}
          payLoading={payLoading}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
