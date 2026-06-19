import { useState, useEffect, useCallback, useRef } from "react";

const API = import.meta.env.VITE_API_URL;
const getToken = () => localStorage.getItem("token");

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

// ── Safely resolve populated-or-plain fields ──────────────────────────────────
const userName   = (u) => (typeof u === "object" && u !== null) ? (u.name  || u.email || u._id) : (u || "—");
const userEmail  = (u) => (typeof u === "object" && u !== null) ? (u.email || "")               : "";
const courseName = (c) => (typeof c === "object" && c !== null) ? (c.courseName || c.title || c._id) : (c || "—");

// ─── Badge maps ───────────────────────────────────────────────────────────────
const STATUS_BADGE = {
  active:    "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  completed: "bg-sky-100 text-sky-700 ring-1 ring-sky-200",
  pending:   "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  cancelled: "bg-red-100 text-red-700 ring-1 ring-red-200",
  expired:   "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
};

const PAYMENT_BADGE = {
  paid:     { cls: "bg-violet-100 text-violet-700 ring-1 ring-violet-200", label: "💳 Paid"     },
  free:     { cls: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200", label: "🎁 Free"  },
  pending:  { cls: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",    label: "⏳ Pending"  },
  failed:   { cls: "bg-red-100 text-red-700 ring-1 ring-red-200",          label: "✗ Failed"    },
  refunded: { cls: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",    label: "↩ Refunded" },
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
    red:    "text-red-500",
  };
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-1.5">{label}</div>
      <div className={`text-3xl font-bold tracking-tight ${colorMap[color]}`}>{value}</div>
    </div>
  );
}

// ─── Table rows ───────────────────────────────────────────────────────────────
function EnrollmentsTable({ enrollments, loading, onStatusClick, onRefund, onDelete }) {
  if (loading) return (
    <tr><td colSpan={7} className="text-center text-slate-400 py-12">Loading…</td></tr>
  );
  if (enrollments.length === 0) return (
    <tr><td colSpan={7} className="text-center text-slate-400 py-12">No enrollments found</td></tr>
  );

  return enrollments.map((e) => (
    <tr key={e._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-0">
      <td className="px-4 py-3">
        <div className="font-semibold text-slate-800">{userName(e.userId)}</div>
        <div className="text-[11px] text-slate-400">{userEmail(e.userId)}</div>
      </td>
      <td className="px-4 py-3 text-slate-700 font-medium">{courseName(e.courseId)}</td>
      <td className="px-4 py-3 text-slate-600">{e.amount ? inr(e.amount) : "—"}</td>
      <td className="px-4 py-3"><Badge status={e.paymentStatus} type="payment" /></td>
      <td className="px-4 py-3"><Badge status={e.status} /></td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-20"><ProgressBar value={e.progress || 0} /></div>
          <span className="text-[11px] text-slate-400">{e.progress || 0}%</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onStatusClick(e._id, e.status)}
            className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-300 hover:border-violet-400 text-slate-600 hover:text-violet-600 rounded-lg transition-colors shadow-sm"
          >
            Status
          </button>
          {e.paymentId && e.paymentStatus === "paid" && (
            <button
              onClick={() => onRefund(e._id)}
              className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-300 hover:border-amber-400 text-slate-600 hover:text-amber-600 rounded-lg transition-colors shadow-sm"
            >
              Refund
            </button>
          )}
          <button
            onClick={() => onDelete(e._id)}
            className="px-2.5 py-1 text-[11px] font-semibold bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  ));
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [statusModal, setStatusModal] = useState(null);
  const [newStatus, setNewStatus]     = useState("active");
  const [loading, setLoading]         = useState(false);
  const [toast, setToast]             = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/enrollments`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setEnrollments(data.success ? data.data : []);
    } catch {
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Stats
  const totalRevenue   = enrollments.filter((e) => e.paymentStatus === "paid").reduce((s, e) => s + (e.amount || 0), 0);
  const activeCount    = enrollments.filter((e) => e.status === "active").length;
  const completedCount = enrollments.filter((e) => e.status === "completed").length;
  const refundedCount  = enrollments.filter((e) => e.paymentStatus === "refunded").length;

  const openStatusModal = (id, current) => { setStatusModal({ id, current }); setNewStatus(current); };

  const updateStatus = async () => {
    try {
      const res  = await fetch(`${API}/api/enrollments/${statusModal.id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      showToast(data.message, data.success ? "success" : "error");
      if (data.success) { setStatusModal(null); load(); }
    } catch { showToast("Update failed", "error"); }
  };

  const handleRefund = async (id) => {
    if (!window.confirm("Initiate full refund?")) return;
    try {
      const res  = await fetch(`${API}/api/payments/refund/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Admin initiated refund" }),
      });
      const data = await res.json();
      showToast(data.message, data.success ? "success" : "error");
      if (data.success) load();
    } catch { showToast("Refund failed", "error"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this enrollment?")) return;
    try {
      const res  = await fetch(`${API}/api/enrollments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      showToast(data.message, data.success ? "success" : "error");
      if (data.success) load();
    } catch { showToast("Delete failed", "error"); }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="text-lg font-bold tracking-tight bg-gradient-to-r from-violet-600 to-sky-500 bg-clip-text text-transparent">
          CourseEnroll · Admin
        </div>
        <span className="text-xs text-slate-400 font-medium">⚙️ Admin Panel</span>
      </header>

      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Enrollment Management</h1>
            <p className="text-sm text-slate-500 mt-1">Manage all enrollments and payments across the platform</p>
          </div>
          <button
            onClick={load}
            className="px-4 py-2 text-sm font-semibold bg-white border border-slate-300 hover:border-violet-400 text-slate-600 hover:text-violet-600 rounded-lg transition-colors shadow-sm"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Stats row 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <StatCard label="Total Enrollments" value={enrollments.length} color="purple" />
          <StatCard label="Active"             value={activeCount}        color="cyan"   />
          <StatCard label="Completed"          value={completedCount}     color="green"  />
          <StatCard label="Revenue (INR)"      value={inr(totalRevenue)}  color="orange" />
        </div>

        {/* Stats row 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Refunded"         value={refundedCount}                                                           color="red"    />
          <StatCard label="Cancelled"        value={enrollments.filter((e) => e.status === "cancelled").length}              color="red"    />
          <StatCard label="Free Enrollments" value={enrollments.filter((e) => e.paymentStatus === "free").length}            color="cyan"   />
          <StatCard label="Paid Enrollments" value={enrollments.filter((e) => e.paymentStatus === "paid").length}            color="purple" />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["User", "Course", "Amount", "Payment", "Status", "Progress", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] uppercase tracking-widest text-slate-400 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <EnrollmentsTable
                enrollments={enrollments}
                loading={loading}
                onStatusClick={openStatusModal}
                onRefund={handleRefund}
                onDelete={handleDelete}
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* Status modal */}
      <Modal open={!!statusModal} onClose={() => setStatusModal(null)} title="Update Enrollment Status" subtitle="Change the enrollment status for this user.">
        <div className="mb-4">
          <label className="block text-xs text-slate-500 font-semibold mb-2">New Status</label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full bg-white border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 rounded-lg px-3 py-2.5 text-sm text-slate-700 outline-none transition-all"
          >
            {["active", "completed", "expired", "cancelled"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setStatusModal(null)} className="px-4 py-2 text-sm font-semibold bg-white border border-slate-300 text-slate-600 rounded-lg hover:border-violet-400 hover:text-violet-600 transition-colors">
            Cancel
          </button>
          <button onClick={updateStatus} className="px-4 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors shadow-sm">
            Update
          </button>
        </div>
      </Modal>

      <Toast toast={toast} />
    </div>
  );
}