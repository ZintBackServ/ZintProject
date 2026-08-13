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
function EnquiryDetailModal({ enquiry, onClose, onMarkContacted, onDelete, marking, deleting }) {
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
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
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
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</span>
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
              <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1">📞 Mobile</p>
              <p className="text-gray-900 text-xs font-semibold">{enquiry.mobile || enquiry.phone || "—"}</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
              <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1">📚 Course</p>
              <p className="text-indigo-600 text-xs font-semibold">{enquiry.course?.courseName || enquiry.course || "General Enquiry"}</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
              <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1">💻 Mode</p>
              <p className="text-gray-900 text-xs font-semibold">{enquiry.mode || "Online / Offline"}</p>
            </div>
          </div>

          {enquiry.message && (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1.5">💬 Message / Query</p>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">{enquiry.message}</p>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          {!enquiry.isContacted && (
            <button
              onClick={() => onMarkContacted(enquiry._id)}
              disabled={marking === enquiry._id}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition disabled:opacity-50 text-xs sm:text-sm shadow-sm"
            >
              {marking === enquiry._id ? "Updating..." : "✓ Mark as Contacted"}
            </button>
          )}
          <button
            onClick={() => onDelete(enquiry._id)}
            disabled={deleting === enquiry._id}
            className={`${enquiry.isContacted ? "flex-1" : ""} bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold py-2.5 px-4 rounded-xl transition disabled:opacity-50 text-xs sm:text-sm`}
          >
            {deleting === enquiry._id ? "Deleting..." : "🗑️ Delete Enquiry"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Admin Enquiry Page ── */
export default function AdminEnquiries() {
  const [enquiries, setEnquiries]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [searchQ, setSearchQ]           = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected]         = useState(null);
  const [marking, setMarking]           = useState(null);
  const [deleting, setDeleting]         = useState(null);
  const [toast, setToast]               = useState(null);

  const loadEnquiries = async () => {
    try {
      const data = await safeFetch(`${ENQUIRY_URL}/allEnquiries`);
      setEnquiries(data?.data || data?.enquiries || []);
    } catch (err) {
      console.log(err);
      setEnquiries([]);
    }
  };

  useEffect(() => {
    loadEnquiries().finally(() => setLoading(false));
  }, []);

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleMarkContacted = async (id) => {
    setMarking(id);
    try {
      await safeFetch(`${ENQUIRY_URL}/markEnquiryContacted/${id}`, { method: "PUT" });
      setEnquiries(prev => prev.map(e => (e._id === id ? { ...e, isContacted: true } : e)));
      setSelected(prev => (prev?._id === id ? { ...prev, isContacted: true } : prev));
      showToast("Marked as contacted! 🎉");
    } catch (err) {
      showToast(err.message || "Failed to update.", "error");
    } finally {
      setMarking(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this enquiry? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await safeFetch(`${ENQUIRY_URL}/deleteEnquiry/${id}`, { method: "DELETE" });
      setEnquiries(prev => prev.filter(e => e._id !== id));
      setSelected(null);
      showToast("Enquiry deleted.");
    } catch (err) {
      showToast(err.message || "Delete failed.", "error");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = enquiries.filter(e => {
    const matchStatus =
      statusFilter === "all" ? true :
      statusFilter === "contacted" ? e.isContacted :
      !e.isContacted;
    const q = searchQ.toLowerCase();
    const name = (e.fullName || e.name || "").toLowerCase();
    const email = (e.email || "").toLowerCase();
    const mobile = (e.mobile || e.phone || "").toLowerCase();
    const course = (e.course?.courseName || e.course || "").toLowerCase();
    const matchSearch = !q || name.includes(q) || email.includes(q) || mobile.includes(q) || course.includes(q);
    return matchStatus && matchSearch;
  });

  const total     = enquiries.length;
  const pending   = enquiries.filter(e => !e.isContacted).length;
  const contacted = enquiries.filter(e => e.isContacted).length;
  const thisMonth = enquiries.filter(e => e.createdAt && new Date(e.createdAt).getMonth() === new Date().getMonth()).length;

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm font-medium">Loading enquiries...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 pb-16">
      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200 ${
          toast.type === "error" ? "bg-rose-600" : "bg-emerald-600"
        }`}>
          <span>{toast.type === "error" ? "✕" : "✓"}</span>
          {toast.text}
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 md:px-8 py-5 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Admin Dashboard</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">💬 Student Enquiries</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Manage and respond to lead queries from potential students</p>
          </div>
          <button
            onClick={loadEnquiries}
            className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition self-start sm:self-auto"
          >
            🔄 Refresh List
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8 space-y-6">

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard label="Total Enquiries" value={total}     icon="📩" color="text-indigo-700" bg="bg-indigo-50" border="border-indigo-100" />
          <StatCard label="Pending"         value={pending}   icon="⏳" color="text-amber-700"  bg="bg-amber-50"  border="border-amber-100" />
          <StatCard label="Contacted"       value={contacted} icon="✅" color="text-emerald-700 font-bold" bg="bg-emerald-50" border="border-emerald-100" />
          <StatCard label="This Month"      value={thisMonth} icon="📈" color="text-sky-700"     bg="bg-sky-50"     border="border-sky-100" />
        </div>

        {/* ── SEARCH & FILTER BAR ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Search by name, email, phone or course..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition bg-slate-50/50"
            />
            {searchQ && (
              <button onClick={() => setSearchQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
                ✕
              </button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {[
              { key: "all", label: "All Enquiries", count: total },
              { key: "pending", label: "⏳ Pending", count: pending },
              { key: "contacted", label: "✅ Contacted", count: contacted },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                  statusFilter === f.key
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                }`}
              >
                <span>{f.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusFilter === f.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── TABLE CARD ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-sm sm:text-base">
              Enquiries List <span className="text-gray-400 font-normal text-xs ml-1">({filtered.length})</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  {["Name", "Contact Info", "Course Interested", "Mode", "Status", "Date", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-gray-400 font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(e => (
                  <tr
                    key={e._id}
                    className="hover:bg-indigo-50/30 transition-colors cursor-pointer"
                    onClick={() => setSelected(e)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center shrink-0">
                          {(e.fullName || e.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{e.fullName || e.name}</p>
                          <p className="text-[11px] text-gray-400">ID: {e._id?.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-600">
                      <p className="font-medium text-gray-900">{e.email || "—"}</p>
                      <p className="text-gray-400 mt-0.5">{e.mobile || e.phone || "—"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-block bg-violet-50 text-violet-700 border border-violet-100 text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap">
                        {e.course?.courseName || e.course || "General"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs whitespace-nowrap font-medium">
                      {e.mode?.toLowerCase() === "curriculum download" ? (
                        <span className="inline-block bg-purple-100 text-purple-800 border border-purple-200 text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                          📄 Curriculum Download
                        </span>
                      ) : (
                        <span className="text-gray-600">{e.mode || "—"}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full whitespace-nowrap ${
                        e.isContacted ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-amber-100 text-amber-700 border border-amber-200"
                      }`}>
                        {e.isContacted ? "✓ Contacted" : "⏳ Pending"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                      {formatDate(e.createdAt)}<br />
                      <span className="text-[10px] text-gray-300">{formatTime(e.createdAt)}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap" onClick={(ev) => ev.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelected(e)}
                          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition font-semibold"
                        >
                          View
                        </button>
                        {!e.isContacted && (
                          <button
                            onClick={() => handleMarkContacted(e._id)}
                            disabled={marking === e._id}
                            className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg transition font-semibold disabled:opacity-50"
                          >
                            {marking === e._id ? "..." : "Done"}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(e._id)}
                          disabled={deleting === e._id}
                          className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1.5 rounded-lg transition font-semibold disabled:opacity-50"
                        >
                          {deleting === e._id ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-3">📭</p>
              <p className="font-semibold text-gray-700 text-sm">No enquiries found</p>
              <p className="text-xs text-gray-400 mt-1">Try clearing your search query or status filter</p>
            </div>
          )}
        </div>

      </div>

      {/* Detail Modal */}
      {selected && (
        <EnquiryDetailModal
          enquiry={selected}
          onClose={() => setSelected(null)}
          onMarkContacted={handleMarkContacted}
          onDelete={handleDelete}
          marking={marking}
          deleting={deleting}
        />
      )}
    </div>
  );
}