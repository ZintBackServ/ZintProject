import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL;
const getToken = () => localStorage.getItem("token");

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

const courseName = (c) =>
  typeof c === "object" && c !== null
    ? c.courseName || c.title || String(c._id)
    : c || "Unknown Course";

const courseImage = (c) =>
  typeof c === "object" && c !== null ? c.courseImage : null;

// ─── Badge maps ───────────────────────────────────────────────────────────────
const STATUS_BADGE = {
  active:    "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  completed: "bg-sky-100 text-sky-700 ring-1 ring-sky-200",
  pending:   "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  cancelled: "bg-red-100 text-red-700 ring-1 ring-red-200",
  expired:   "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
};

const PAYMENT_BADGE = {
  paid:     { cls: "bg-violet-100 text-violet-700 ring-1 ring-violet-200",   label: "💳 Paid"    },
  free:     { cls: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200", label: "🎁 Free"   },
  pending:  { cls: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",       label: "⏳ Pending" },
  failed:   { cls: "bg-red-100 text-red-700 ring-1 ring-red-200",             label: "✗ Failed"   },
  refunded: { cls: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",       label: "↩ Refunded" },
};

// ─── Primitives ───────────────────────────────────────────────────────────────
function Badge({ status, type = "enrollment" }) {
  if (!status) return null;
  const map   = type === "payment" ? PAYMENT_BADGE : STATUS_BADGE;
  const entry = type === "payment" ? map[status] : { cls: map[status], label: status };
  if (!entry) return null;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${entry.cls}`}>
      {entry.label}
    </span>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky-400 transition-all duration-500"
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
    info:    "border-violet-400 text-violet-700 bg-violet-50",
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
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white border border-slate-200 rounded-2xl p-7 w-full max-w-md mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mb-5">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colorMap = {
    purple: "text-violet-600",
    cyan:   "text-sky-600",
    green:  "text-emerald-600",
    orange: "text-amber-600",
  };
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-1.5">{label}</div>
      <div className={`text-3xl font-bold tracking-tight ${colorMap[color]}`}>{value}</div>
    </div>
  );
}

// ─── Course card (enrolled) ───────────────────────────────────────────────────
function CourseCard({ enrollment, onProgress, onCancel }) {
  const title    = courseName(enrollment.courseId);
  const progress = enrollment.progress || 0;
  const thumb    = courseImage(enrollment.courseId);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-md transition-all duration-150 shadow-sm">
      <div className="h-36 flex items-center justify-center text-5xl bg-gradient-to-br from-violet-50 to-sky-50 overflow-hidden">
        {thumb ? <img src={thumb} alt={title} className="w-full h-full object-cover" /> : "📖"}
      </div>
      <div className="p-4">
        <div className="text-[15px] font-semibold text-slate-800 mb-2 leading-snug">{title}</div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge status={enrollment.status} />
          <Badge status={enrollment.paymentStatus} type="payment" />
          {enrollment.amount > 0 && (
            <span className="text-[11px] text-slate-400">{inr(enrollment.amount)}</span>
          )}
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
            <span>Progress</span><span>{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
        <div className="flex flex-wrap gap-2">
          {enrollment.status === "active" && (
            <>
              <button
                onClick={() => onProgress(enrollment._id, title, progress)}
                className="px-3 py-1.5 text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
              >
                Update Progress
              </button>
              <button
                onClick={() => onCancel(enrollment._id)}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:border-red-400 text-slate-600 hover:text-red-500 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </>
          )}
          {enrollment.status === "completed" && (
            <span className="text-xs text-emerald-600 font-semibold">✓ Completed</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Views ────────────────────────────────────────────────────────────────────
function Dashboard({ enrollments, onProgress, onCancel, onNavigate }) {
  const active     = enrollments.filter((e) => e.status === "active").length;
  const completed  = enrollments.filter((e) => e.status === "completed").length;
  const spent      = enrollments.filter((e) => e.paymentStatus === "paid").reduce((s, e) => s + (e.amount || 0), 0);
  const inProgress = enrollments.filter((e) => e.status === "active" && e.progress < 100);

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard 👋</h1>
          <p className="text-sm text-slate-500 mt-1">Track your learning progress and manage enrollments</p>
        </div>
        {/* "Explore Courses" links to the Admission/Browse page outside this dashboard */}
        <a
          href="/courses"
          className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          + Explore Courses
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Enrolled"    value={enrollments.length} color="purple" />
        <StatCard label="Active"      value={active}             color="cyan"   />
        <StatCard label="Completed"   value={completed}          color="green"  />
        <StatCard label="Spent (INR)" value={inr(spent)}         color="orange" />
      </div>

      <h2 className="text-base font-semibold text-slate-700 mb-4">Continue Learning</h2>

      {inProgress.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-3">📚</div>
          <h3 className="text-base font-semibold text-slate-600 mb-1">No active courses yet</h3>
          <p className="text-sm mb-4">Browse the catalog to get started</p>
          <a
            href="/courses"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Browse Courses
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {inProgress.map((e) => (
            <CourseCard key={e._id} enrollment={e} onProgress={onProgress} onCancel={onCancel} />
          ))}
        </div>
      )}
    </div>
  );
}

function MyCourses({ enrollments, onProgress, onCancel }) {
  const [filter, setFilter] = useState("all");
  const filters  = ["all", "active", "completed", "pending", "cancelled"];
  const filtered = filter === "all" ? enrollments : enrollments.filter((e) => e.status === filter);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">My Courses</h1>
        <p className="text-sm text-slate-500 mt-1">All your enrollments in one place</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter === f
                ? "bg-violet-600 border-violet-600 text-white shadow-sm"
                : "bg-white border-slate-300 text-slate-500 hover:border-violet-400 hover:text-violet-600"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-3">🎓</div>
          <h3 className="text-base font-semibold text-slate-600 mb-1">No courses here</h3>
          <p className="text-sm">
            {filter === "all"
              ? <><a href="/courses" className="text-violet-600 hover:underline">Browse courses</a> to get started</>
              : "Try a different filter"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((e) => (
            <CourseCard key={e._id} enrollment={e} onProgress={onProgress} onCancel={onCancel} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
// Only Dashboard + My Courses — Browse is its own Admission page
const NAV = [
  { id: "dashboard",  icon: "📊", label: "Dashboard"  },
  { id: "my-courses", icon: "🎓", label: "My Courses" },
];

export default function UserDashboard() {
  const { user } = useAuth();

  const [view, setView]                   = useState("dashboard");
  const [enrollments, setEnrollments]     = useState([]);
  const [toast, setToast]                 = useState(null);
  const [progressModal, setProgressModal] = useState(null);
  const [progressVal, setProgressVal]     = useState(50);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const loadEnrollments = useCallback(async () => {
    try {
      const res  = await fetch(`${API}/api/enrollments`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setEnrollments(data.success ? data.data : []);
    } catch {
      setEnrollments([]);
    }
  }, []);

  useEffect(() => { loadEnrollments(); }, [loadEnrollments]);

  const navigate = (v) => {
    setView(v);
    loadEnrollments();
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this enrollment?")) return;
    try {
      const res  = await fetch(`${API}/api/enrollments/${id}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      showToast(data.message, data.success ? "success" : "error");
      if (data.success)
        setEnrollments((prev) => prev.map((e) => e._id === id ? { ...e, status: "cancelled" } : e));
    } catch { showToast("Failed to cancel enrollment", "error"); }
  };

  const openProgress = (id, title, current) => { setProgressModal({ id, title, current }); setProgressVal(current); };

  const submitProgress = async () => {
    try {
      const res  = await fetch(`${API}/api/enrollments/${progressModal.id}/progress`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
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
    } catch { showToast("Failed to update progress", "error"); }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar */}
      <nav className="hidden md:flex w-60 flex-shrink-0 flex-col gap-1 bg-white border-r border-slate-200 px-4 py-7 shadow-sm">
        <div className="px-3 pb-6 text-lg font-bold tracking-tight bg-gradient-to-r from-violet-600 to-sky-500 bg-clip-text text-transparent">
          CourseEnroll
        </div>
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => navigate(n.id)}
            className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
              view === n.id
                ? "bg-violet-50 text-violet-700 font-semibold"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <span className="w-5 text-center text-base">{n.icon}</span>
            {n.label}
          </button>
        ))}

        {/* Divider + external link to course catalog */}
        <div className="mt-auto pt-4 border-t border-slate-100">
          <a
            href="/courses"
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-violet-50 hover:text-violet-700 transition-all"
          >
            <span className="w-5 text-center text-base">🛒</span>
            Browse Courses
          </a>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 flex">
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => navigate(n.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors ${
              view === n.id ? "text-violet-700" : "text-slate-400"
            }`}
          >
            <span className="text-xl">{n.icon}</span>
            {n.label}
          </button>
        ))}
        <a
          href="/courses"
          className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold text-slate-400"
        >
          <span className="text-xl">🛒</span>
          Browse
        </a>
      </nav>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto pb-20 md:pb-8">
        {view === "dashboard"  && <Dashboard enrollments={enrollments} onProgress={openProgress} onCancel={handleCancel} onNavigate={navigate} />}
        {view === "my-courses" && <MyCourses enrollments={enrollments} onProgress={openProgress} onCancel={handleCancel} />}
      </main>

      {/* Progress modal */}
      <Modal open={!!progressModal} onClose={() => setProgressModal(null)} title="Update Progress" subtitle={progressModal?.title}>
        <div className="mb-5">
          <div className="flex justify-between text-xs text-slate-500 font-semibold mb-2">
            <label>Progress</label>
            <strong className="text-violet-600">{progressVal}%</strong>
          </div>
          <input
            type="range" min={0} max={100} value={progressVal}
            onChange={(e) => setProgressVal(Number(e.target.value))}
            className="w-full accent-violet-600"
          />
          <div className="mt-2"><ProgressBar value={progressVal} /></div>
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setProgressModal(null)} className="px-4 py-2 text-sm font-semibold bg-white border border-slate-300 text-slate-600 rounded-lg hover:border-violet-400 hover:text-violet-600 transition-colors">
            Cancel
          </button>
          <button onClick={submitProgress} className="px-4 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors shadow-sm">
            Save Progress
          </button>
        </div>
      </Modal>

      <Toast toast={toast} />
    </div>
  );
}