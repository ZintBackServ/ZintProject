import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ENQUIRY_URL = `${import.meta.env.VITE_API_URL}/enquiry`;

async function safeFetch(url, options = {}) {
  const res = await fetch(url, { credentials: "include", ...options });
  const raw = await res.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { /* not JSON */ }
  if (!res.ok) throw new Error(data?.msg || `Request failed with status ${res.status}`);
  return data;
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function formatTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

/* ── Stat Card Component ── */
function StatCard({ label, value, icon, color, bg, border }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border ${border} ${bg} p-4 sm:p-5 transition hover:shadow-lg hover:-translate-y-0.5 duration-200`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl sm:text-3xl">{icon}</span>
        <span className={`text-2xl sm:text-3xl font-extrabold ${color}`}>{value}</span>
      </div>
      <p className={`text-xs sm:text-sm font-semibold ${color}`}>{label}</p>
    </div>
  );
}

/* ── Detail Modal ── */
function LeadDetailModal({ enquiry, onClose, onMarkContacted, onDelete, marking, deleting }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg">
              {(enquiry.fullName || enquiry.name || "?").charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-base sm:text-lg">{enquiry.fullName || enquiry.name}</h3>
              <p className="text-gray-400 text-xs">{formatDate(enquiry.createdAt)} at {formatTime(enquiry.createdAt)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-lg transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Follow-up Status</span>
            <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
              enquiry.isContacted ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-amber-100 text-amber-700 border border-amber-200"
            }`}>
              {enquiry.isContacted ? "✓ Contacted" : "⏳ Pending Follow-up"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
              <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1">📧 Email</p>
              <p className="text-gray-900 text-xs font-semibold break-all">{enquiry.email || "—"}</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
              <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1">📱 WhatsApp Mobile</p>
              <p className="text-gray-900 text-xs font-semibold">{enquiry.mobile || enquiry.phone || "—"}</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 col-span-2">
              <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1">📚 Course Curriculum Downloaded</p>
              <p className="text-purple-700 text-sm font-bold">{enquiry.course?.courseName || enquiry.course || "Course Curriculum"}</p>
            </div>
          </div>

          {enquiry.message && (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1.5">📝 Action Details</p>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">{enquiry.message}</p>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-wrap gap-2 justify-end">
          {!enquiry.isContacted && (
            <button
              onClick={() => onMarkContacted(enquiry._id)}
              disabled={marking === enquiry._id}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl transition text-xs sm:text-sm flex-1 disabled:opacity-50"
            >
              {marking === enquiry._id ? "Updating..." : "✓ Mark as Contacted"}
            </button>
          )}
          <button
            onClick={() => onDelete(enquiry._id)}
            disabled={deleting === enquiry._id}
            className={`${enquiry.isContacted ? "flex-1" : ""} bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold py-2.5 px-4 rounded-xl transition disabled:opacity-50 text-xs sm:text-sm`}
          >
            {deleting === enquiry._id ? "Deleting..." : "🗑️ Delete Record"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Admin Curriculum Downloads Page ── */
export default function AdminCurriculumDownloads() {
  const [downloads, setDownloads]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'pending' | 'contacted'
  const [selectedLead, setSelectedLead] = useState(null);
  const [marking, setMarking]           = useState(null);
  const [deleting, setDeleting]         = useState(null);
  const [toast, setToast]               = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    try {
      setError(null);
      const data = await safeFetch(`${ENQUIRY_URL}/allEnquiries`);
      const all = data?.data || data?.enquiries || [];
      // Filter for Curriculum Download registrations
      const filtered = all.filter(e => e.mode?.toLowerCase() === "curriculum download");
      setDownloads(filtered);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load curriculum download requests.");
      setDownloads([]);
    }
  };

  useEffect(() => {
    loadData().finally(() => setLoading(false));
  }, []);

  const handleMarkContacted = async (id) => {
    setMarking(id);
    try {
      await safeFetch(`${ENQUIRY_URL}/markEnquiryContacted/${id}`, { method: "PUT" });
      setDownloads(prev => prev.map(e => (e._id === id ? { ...e, isContacted: true } : e)));
      if (selectedLead?._id === id) {
        setSelectedLead(prev => (prev ? { ...prev, isContacted: true } : null));
      }
      showToast("Marked lead as contacted.");
    } catch (err) {
      showToast(err.message || "Failed to update status", "error");
    } finally {
      setMarking(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this curriculum download record?")) return;
    setDeleting(id);
    try {
      await safeFetch(`${ENQUIRY_URL}/deleteEnquiry/${id}`, { method: "DELETE" });
      setDownloads(prev => prev.filter(e => e._id !== id));
      if (selectedLead?._id === id) setSelectedLead(null);
      showToast("Record deleted.");
    } catch (err) {
      showToast(err.message || "Failed to delete", "error");
    } finally {
      setDeleting(null);
    }
  };

  // Filtered list
  const filteredDownloads = downloads.filter(item => {
    const name    = (item.fullName || item.name || "").toLowerCase();
    const email   = (item.email || "").toLowerCase();
    const mobile  = (item.mobile || item.phone || "").toLowerCase();
    const course  = (item.course?.courseName || item.course || "").toLowerCase();
    const q       = search.toLowerCase().trim();

    const matchesSearch = !q || name.includes(q) || email.includes(q) || mobile.includes(q) || course.includes(q);

    if (statusFilter === "pending")   return matchesSearch && !item.isContacted;
    if (statusFilter === "contacted") return matchesSearch && item.isContacted;
    return matchesSearch;
  });

  const totalCount     = downloads.length;
  const pendingCount   = downloads.filter(e => !e.isContacted).length;
  const contactedCount = downloads.filter(e => e.isContacted).length;

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold animate-in slide-in-from-top-2 duration-200 ${
          toast.type === "error" ? "bg-rose-600 text-white border-rose-500" : "bg-emerald-600 text-white border-emerald-500"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          enquiry={selectedLead}
          onClose={() => setSelectedLead(null)}
          onMarkContacted={handleMarkContacted}
          onDelete={handleDelete}
          marking={marking}
          deleting={deleting}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📄</span>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Curriculum Downloads</h1>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Track students who downloaded course curriculums & follow up on WhatsApp.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/dashboard/Enquiries"
            className="text-xs font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3.5 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5"
          >
            💬 General Enquiries
          </Link>
          <button
            onClick={() => { setLoading(true); loadData().finally(() => setLoading(false)); }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 border border-indigo-100 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Downloads"
          value={totalCount}
          icon="📄"
          color="text-purple-700"
          bg="bg-purple-50/50"
          border="border-purple-200"
        />
        <StatCard
          label="Pending Follow-up"
          value={pendingCount}
          icon="⏳"
          color="text-amber-700"
          bg="bg-amber-50/50"
          border="border-amber-200"
        />
        <StatCard
          label="Contacted Students"
          value={contactedCount}
          icon="✓"
          color="text-emerald-700"
          bg="bg-emerald-50/50"
          border="border-emerald-200"
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 text-sm pointer-events-none">🔍</span>
          <input
            type="text"
            placeholder="Search student, email, course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-purple-500 text-gray-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["all", "pending", "contacted"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`flex-1 sm:flex-none text-xs font-extrabold px-3.5 py-2 rounded-xl border transition capitalize ${
                statusFilter === st
                  ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {st === "all" ? "All" : st === "pending" ? "⏳ Pending" : "✓ Contacted"}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table / Cards */}
      {loading ? (
        <div className="py-16 text-center text-gray-400 font-medium text-sm flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          Loading curriculum download leads...
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-700 text-sm">
          ⚠️ {error}
        </div>
      ) : filteredDownloads.length === 0 ? (
        <div className="bg-white border border-gray-200/80 rounded-2xl py-12 text-center text-gray-400 text-sm shadow-sm">
          📄 No curriculum downloads found.
        </div>
      ) : (
        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 sm:px-6">Student</th>
                  <th className="py-3.5 px-4 sm:px-6">Contact Info</th>
                  <th className="py-3.5 px-4 sm:px-6">Downloaded Course</th>
                  <th className="py-3.5 px-4 sm:px-6">Requested At</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDownloads.map((item) => (
                  <tr key={item._id} className="hover:bg-purple-50/20 transition">
                    <td className="py-4 px-4 sm:px-6 font-bold text-gray-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                          {(item.fullName || item.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <span>{item.fullName || item.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-gray-600">
                      <p className="font-semibold text-gray-900">{item.email}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        📱 {item.mobile || item.phone}
                      </p>
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-bold text-purple-700">
                      {item.course?.courseName || item.course || "Course Curriculum"}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-gray-500 text-xs">
                      {formatDate(item.createdAt)}
                      <p className="text-[10px] text-gray-400">{formatTime(item.createdAt)}</p>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full ${
                        item.isContacted ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {item.isContacted ? "✓ Contacted" : "⏳ Pending"}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedLead(item)}
                          className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition"
                          title="View Details"
                        >
                          👁️ View
                        </button>
                        {!item.isContacted && (
                          <button
                            onClick={() => handleMarkContacted(item._id)}
                            disabled={marking === item._id}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs transition disabled:opacity-50"
                            title="Mark as Contacted"
                          >
                            ✓
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={deleting === item._id}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs transition disabled:opacity-50"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
