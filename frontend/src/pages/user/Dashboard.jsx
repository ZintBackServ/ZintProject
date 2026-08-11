// Dashboard.jsx — User Dashboard
// Upgraded UI, User Info Banner at Top, Sidebar without "Browse & Enroll" (redirects to /OnlineAdmission).

import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const API = import.meta.env.VITE_API_URL;

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

const courseName = (c) =>
  typeof c === "object" && c !== null
    ? c.courseName || c.title || String(c._id)
    : c || "Unknown Course";

const courseImage = (c) =>
  typeof c === "object" && c !== null ? c.courseImage : null;

// ─── Badge Map ─────────────────────────────────────────────────────────────────
const STATUS_BADGE = {
  active:    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  completed: "bg-purple-50 text-purple-700 border border-purple-200",
  pending:   "bg-amber-50 text-amber-700 border border-amber-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
  expired:   "bg-slate-100 text-slate-500 border border-slate-200",
};

const PAYMENT_BADGE = {
  paid:     { cls: "bg-purple-50 text-purple-700 border border-purple-200", label: "💳 Paid" },
  free:     { cls: "bg-emerald-50 text-emerald-700 border border-emerald-200", label: "🎁 Free" },
  pending:  { cls: "bg-amber-50 text-amber-700 border border-amber-200", label: "⏳ Pending" },
  failed:   { cls: "bg-red-50 text-red-700 border border-red-200", label: "✗ Failed" },
  refunded: { cls: "bg-slate-100 text-slate-500 border border-slate-200", label: "↩ Refunded" },
};

function Badge({ status, type = "enrollment" }) {
  if (!status) return null;
  const map   = type === "payment" ? PAYMENT_BADGE : STATUS_BADGE;
  const entry = type === "payment" ? map[status] : { cls: map[status], label: status };
  if (!entry) return null;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${entry.cls}`}>
      {entry.label}
    </span>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#B026B5] to-purple-500 transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  const colorMap = {
    success: "border-emerald-400 text-emerald-700 bg-emerald-50",
    error:   "border-red-400 text-red-700 bg-red-50",
    info:    "border-purple-400 text-purple-700 bg-purple-50",
  };
  return (
    <div className={`fixed bottom-7 right-7 z-50 max-w-xs border rounded-xl px-5 py-3.5 text-sm font-medium shadow-xl transition-all duration-300 ${colorMap[toast.type] || colorMap.info}`}>
      {toast.msg}
    </div>
  );
}

function Modal({ open, onClose, title, subtitle, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white border border-slate-200 rounded-2xl p-7 w-full max-w-md shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mb-5">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, gradient }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-lg shadow-sm ${gradient}`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</div>
    </div>
  );
}

// ─── Enrolled Course Card ─────────────────────────────────────────────────────
function CourseCard({ enrollment, onProgress, onCancel, onPayNow }) {
  const title     = courseName(enrollment.courseId);
  const progress  = enrollment.progress || 0;
  const thumb     = courseImage(enrollment.courseId);
  const isPending = enrollment.paymentStatus === "pending" && enrollment.status === "pending";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-purple-300 hover:shadow-lg transition-all duration-200 flex flex-col">
      <div className="h-40 bg-slate-100 relative overflow-hidden flex items-center justify-center">
        {thumb ? (
          <img src={thumb} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-5xl">📖</div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h4 className="text-base font-bold text-slate-900 leading-snug mb-2 line-clamp-2">{title}</h4>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge status={enrollment.status} />
          <Badge status={enrollment.paymentStatus} type="payment" />
          {enrollment.amount > 0 && (
            <span className="text-xs font-semibold text-slate-500 ml-auto">{inr(enrollment.amount)}</span>
          )}
        </div>

        {isPending ? (
          <div className="mt-auto pt-2">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
              <p className="text-xs text-amber-700 font-medium leading-relaxed">
                ⏳ Payment pending. Click &quot;Pay Now&quot; to complete your enrollment.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onPayNow(enrollment._id, enrollment.amount, title)}
              className="w-full py-2.5 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-all shadow-sm"
            >
              Pay Now ⏳
            </button>
          </div>
        ) : (
          <div className="mt-auto pt-2">
            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-500 font-medium mb-1.5">
                <span>Progress</span>
                <span className="font-bold text-[#B026B5]">{progress}%</span>
              </div>
              <ProgressBar value={progress} />
            </div>

            <div className="flex gap-2">
              {enrollment.status === "active" && (
                <>
                  <button
                    type="button"
                    onClick={() => onProgress(enrollment._id, title, progress)}
                    className="flex-1 py-2 text-xs font-bold text-white bg-[#B026B5] hover:bg-[#8f1e92] rounded-xl transition-all shadow-sm"
                  >
                    Update Progress
                  </button>
                  <button
                    type="button"
                    onClick={() => onCancel(enrollment._id)}
                    className="py-2 px-3 text-xs font-bold border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </>
              )}
              {enrollment.status === "completed" && (
                <span className="w-full py-2 text-center text-xs font-bold text-emerald-600 bg-emerald-50 rounded-xl border border-emerald-200">
                  ✓ Course Completed
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard View ────────────────────────────────────────────────────────────
function DashboardView({ enrollments, onProgress, onCancel, onPayNow, navigateToAdmission, user }) {
  const active     = enrollments.filter((e) => e.status === "active").length;
  const completed  = enrollments.filter((e) => e.status === "completed").length;
  const spent      = enrollments.filter((e) => e.paymentStatus === "paid").reduce((s, e) => s + (e.amount || 0), 0);
  const inProgress = enrollments.filter((e) => e.status === "active");

  return (
    <div>
      {/* ── User Header Banner ── */}
      <div className="bg-gradient-to-r from-[#B026B5] via-purple-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl font-extrabold text-white shadow-inner shrink-0">
              {user?.firstName?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Welcome back, {user?.firstName || "Student"}! 👋
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-purple-100 font-medium">
                {user?.email || "Manage your courses and learning progress"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={navigateToAdmission}
            className="px-5 py-3 rounded-2xl bg-white text-[#B026B5] hover:bg-purple-50 text-xs sm:text-sm font-extrabold shadow-lg transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 shrink-0"
          >
            <span>+</span> Enroll in a Course
          </button>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Enrolled" value={enrollments.length} icon="📚" gradient="bg-gradient-to-br from-purple-500 to-indigo-600" />
        <StatCard label="Active" value={active} icon="⚡" gradient="bg-gradient-to-br from-sky-400 to-blue-600" />
        <StatCard label="Completed" value={completed} icon="🏆" gradient="bg-gradient-to-br from-emerald-400 to-teal-600" />
        <StatCard label="Spent (INR)" value={inr(spent)} icon="💳" gradient="bg-gradient-to-br from-amber-400 to-orange-500" />
      </div>

      {/* ── Active Courses ── */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-slate-900">Continue Learning</h2>
        <span className="text-xs text-slate-400 font-semibold">{inProgress.length} course(s) active</span>
      </div>

      {inProgress.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-sm">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No active courses yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-sm mx-auto">
            Explore our course catalog to find the right training for your career goals.
          </p>
          <button
            type="button"
            onClick={navigateToAdmission}
            className="px-6 py-3 bg-[#B026B5] hover:bg-[#8f1e92] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all duration-200"
          >
            Browse &amp; Enroll
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {inProgress.map((e) => (
            <CourseCard key={e._id} enrollment={e} onProgress={onProgress} onCancel={onCancel} onPayNow={onPayNow} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── My Courses View ──────────────────────────────────────────────────────────
function MyCoursesView({ enrollments, onProgress, onCancel, onPayNow, navigateToAdmission }) {
  const [filter, setFilter] = useState("all");
  const filters  = ["all", "active", "completed", "pending", "cancelled"];

  const filtered = filter === "all"
    ? enrollments
    : enrollments.filter((e) => e.status === filter || e.paymentStatus === filter);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Courses</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">All your course enrollments and progress in one place</p>
        </div>
        <button
          type="button"
          onClick={navigateToAdmission}
          className="px-4 py-2.5 bg-[#B026B5] hover:bg-[#8f1e92] text-white text-xs font-bold rounded-xl transition-all shadow-sm self-start sm:self-auto"
        >
          + Find More Courses
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
              filter === f
                ? "bg-[#B026B5] border-[#B026B5] text-white shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:border-purple-300 hover:text-purple-700"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400 shadow-sm">
          <div className="text-5xl mb-3">🎓</div>
          <h3 className="text-base font-bold text-slate-700 mb-1">No courses found</h3>
          <p className="text-xs text-slate-500">No enrollments match the selected filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((e) => (
            <CourseCard key={e._id} enrollment={e} onProgress={onProgress} onCancel={onCancel} onPayNow={onPayNow} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Left Sidebar Navigation Items ─────────────────────────────────────────────
const NAV = [
  { id: "dashboard",  icon: "📊", label: "Dashboard"  },
  { id: "my-courses", icon: "🎓", label: "My Courses" },
];

// ─── Main Root Component ───────────────────────────────────────────────────────
export default function UserDashboard() {
  const { user }    = useAuth();
  const navigate    = useNavigate();

  const [view,          setView]          = useState("dashboard");
  const [enrollments,   setEnrollments]   = useState([]);
  const [toast,         setToast]         = useState(null);
  const [progressModal, setProgressModal] = useState(null);
  const [progressVal,   setProgressVal]   = useState(50);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  const loadEnrollments = useCallback(async () => {
    try {
      const res  = await fetch(`${API}/api/enrollments`, { credentials: "include" });
      const data = await res.json();
      setEnrollments(data.success ? data.data : []);
    } catch {
      setEnrollments([]);
    }
  }, []);

  useEffect(() => {
    loadEnrollments();
  }, [loadEnrollments]);

  const handleNavClick = (v) => {
    setView(v);
    loadEnrollments();
  };

  const navigateToAdmission = () => {
    navigate("/OnlineAdmission");
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this enrollment?")) return;
    try {
      const res  = await fetch(`${API}/api/enrollments/${id}/cancel`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();
      showToast(data.message, data.success ? "success" : "error");
      if (data.success) {
        setEnrollments((prev) => prev.map((e) => e._id === id ? { ...e, status: "cancelled" } : e));
      }
    } catch {
      showToast("Failed to cancel enrollment", "error");
    }
  };

  const openProgress = (id, title, current) => {
    setProgressModal({ id, title, current });
    setProgressVal(current);
  };

  const submitProgress = async () => {
    try {
      const res  = await fetch(`${API}/api/enrollments/${progressModal.id}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ progress: progressVal }),
      });
      const data = await res.json();
      showToast(data.message, data.success ? "success" : "error");
      if (data.success) {
        setEnrollments((prev) =>
          prev.map((e) => e._id === progressModal.id ? { ...e, progress: progressVal, status: data.data.status } : e)
        );
        setProgressModal(null);
      }
    } catch {
      showToast("Failed to update progress", "error");
    }
  };

  const openRazorpay = useCallback(({ order, key, courseTitle, enrollmentId }) => {
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
          const verifyRes  = await fetch(`${API}/api/payments/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            showToast("Payment successful! 🎉", "success");
            await loadEnrollments();
            setView("my-courses");
          } else {
            showToast(verifyData.message || "Payment verification failed", "error");
          }
        } catch {
          showToast("Verification failed", "error");
        }
      },
      theme: { color: "#B026B5" },
      modal: { ondismiss: () => showToast("Payment cancelled", "info") },
    };
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (r) =>
      showToast("Payment failed: " + (r.error?.description || "Unknown error"), "error")
    );
    rzp.open();
  }, [loadEnrollments, showToast]);

  const handlePayNow = async (enrollmentId, amount, courseTitle) => {
    showToast("Resuming payment…", "info");
    const enrollment = enrollments.find((e) => e._id === enrollmentId);
    if (!enrollment) {
      showToast("Enrollment not found", "error");
      return;
    }
    const courseId = enrollment.courseId?._id || enrollment.courseId;
    try {
      const res  = await fetch(`${API}/api/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ courseId, mode: enrollment.mode || "offline" }),
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.message, "error");
        return;
      }
      openRazorpay({ order: data.order, key: data.key, courseTitle, enrollmentId });
    } catch {
      showToast("Could not initiate payment", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">

      {/* ── Left Sidebar Nav ── */}
      <nav className="hidden md:flex w-64 flex-shrink-0 flex-col gap-1 bg-white border-r border-slate-200 px-4 py-8 shadow-sm">
        <div className="px-3 pb-6 border-b border-slate-100 mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Student Portal
          </div>
          <div className="text-xl font-extrabold tracking-tight text-[#B026B5]">
            My Learning
          </div>
        </div>

        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => handleNavClick(n.id)}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left ${
              view === n.id
                ? "bg-purple-50 text-[#B026B5] shadow-sm border border-purple-100"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <span className="text-lg">{n.icon}</span>
            {n.label}
          </button>
        ))}

        {/* User Card at bottom of sidebar */}
        {user && (
          <div className="mt-auto pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="w-9 h-9 rounded-full bg-[#B026B5] text-white flex items-center justify-center font-bold text-sm shrink-0">
                {user.firstName?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-800 truncate">{user.firstName} {user.lastName}</div>
                <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 flex">
        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => handleNavClick(n.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-3 text-[11px] font-bold transition-colors ${
              view === n.id ? "text-[#B026B5]" : "text-slate-400"
            }`}
          >
            <span className="text-xl">{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>

      {/* ── Main Content Area ── */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto pb-24 md:pb-8">
        {view === "dashboard" && (
          <DashboardView
            enrollments={enrollments}
            onProgress={openProgress}
            onCancel={handleCancel}
            onPayNow={handlePayNow}
            navigateToAdmission={navigateToAdmission}
            user={user}
          />
        )}
        {view === "my-courses" && (
          <MyCoursesView
            enrollments={enrollments}
            onProgress={openProgress}
            onCancel={handleCancel}
            onPayNow={handlePayNow}
            navigateToAdmission={navigateToAdmission}
          />
        )}
      </main>

      {/* Progress Modal */}
      <Modal open={!!progressModal} onClose={() => setProgressModal(null)} title="Update Progress" subtitle={progressModal?.title}>
        <div className="mb-6">
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
            <span>Progress Percentage</span>
            <strong className="text-[#B026B5]">{progressVal}%</strong>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={progressVal}
            onChange={(e) => setProgressVal(Number(e.target.value))}
            className="w-full accent-[#B026B5] cursor-pointer"
          />
          <div className="mt-3"><ProgressBar value={progressVal} /></div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => setProgressModal(null)}
            className="px-4 py-2.5 text-xs font-bold bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submitProgress}
            className="px-5 py-2.5 text-xs font-bold bg-[#B026B5] hover:bg-[#8f1e92] text-white rounded-xl transition-all shadow-sm"
          >
            Save Progress
          </button>
        </div>
      </Modal>

      <Toast toast={toast} />
    </div>
  );
}