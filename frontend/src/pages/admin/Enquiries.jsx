import { useState, useEffect } from "react";

const ENQUIRY_URL = `${import.meta.env.VITE_API_URL}/enquiry`;

async function safeFetch(url, options) {
  const res = await fetch(url, options);
  const raw = await res.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { /* not JSON */ }
  if (!res.ok) throw new Error(data?.msg || `Request failed with status ${res.status}`);
  return data;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg sm:text-xl shrink-0 ${color}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-zinc-400 text-[10px] sm:text-xs uppercase tracking-widest mb-0.5 truncate">{label}</p>
        <p className="text-white text-xl sm:text-2xl font-black">{value}</p>
      </div>
    </div>
  );
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function EnquiryDetailModal({ enquiry, onClose, onMarkContacted, onDelete, marking, deleting }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-[1000] p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-zinc-800 shrink-0">
          <h3 className="text-white font-bold text-base sm:text-lg">Enquiry Details</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-zinc-500 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="px-5 sm:px-6 py-5 overflow-y-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold text-base">{enquiry.fullName}</p>
              <p className="text-zinc-500 text-xs">{formatDate(enquiry.createdAt)} · {formatTime(enquiry.createdAt)}</p>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
              enquiry.isContacted ? "bg-green-500/10 text-green-400" : "bg-amber-400/10 text-amber-400"
            }`}>
              {enquiry.isContacted ? "CONTACTED" : "PENDING"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
              <p className="text-zinc-500 text-[10px] uppercase tracking-wide mb-1">Email</p>
              <p className="text-white text-xs break-all">{enquiry.email}</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
              <p className="text-zinc-500 text-[10px] uppercase tracking-wide mb-1">Mobile</p>
              <p className="text-white text-xs">{enquiry.mobile}</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
              <p className="text-zinc-500 text-[10px] uppercase tracking-wide mb-1">Course</p>
              <p className="text-white text-xs">{enquiry.course?.courseName || "—"}</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
              <p className="text-zinc-500 text-[10px] uppercase tracking-wide mb-1">Mode</p>
              <p className="text-white text-xs">{enquiry.mode}</p>
            </div>
          </div>

          {enquiry.message && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
              <p className="text-zinc-500 text-[10px] uppercase tracking-wide mb-1">Message</p>
              <p className="text-zinc-300 text-sm leading-relaxed">{enquiry.message}</p>
            </div>
          )}
        </div>

        <div className="px-5 sm:px-6 py-4 border-t border-zinc-800 shrink-0 flex gap-3">
          {!enquiry.isContacted && (
            <button
              onClick={() => onMarkContacted(enquiry._id)}
              disabled={marking === enquiry._id}
              className="flex-1 bg-amber-400 text-black font-bold py-2.5 rounded-xl hover:bg-amber-300 transition-colors disabled:opacity-50 text-sm"
            >
              {marking === enquiry._id ? "Updating..." : "Mark Contacted"}
            </button>
          )}
          <button
            onClick={() => onDelete(enquiry._id)}
            disabled={deleting === enquiry._id}
            className={`${enquiry.isContacted ? "flex-1" : ""} bg-red-500/10 text-red-400 font-bold py-2.5 px-4 rounded-xl hover:bg-red-500/20 transition-colors disabled:opacity-50 text-sm`}
          >
            {deleting === enquiry._id ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Enquiry Page ────────────────────────────────────────────────────
export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [searchQ, setSearchQ]     = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | pending | contacted
  const [selected, setSelected]   = useState(null);
  const [marking, setMarking]     = useState(null);
  const [deleting, setDeleting]   = useState(null);
  const [toast, setToast]         = useState(null);

  const loadEnquiries = async () => {
    try {
      const data = await safeFetch(`${ENQUIRY_URL}/allEnquiries`);
      setEnquiries(data?.data || []);
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
    setTimeout(() => setToast(null), 2500);
  };

  const handleMarkContacted = async (id) => {
    setMarking(id);
    try {
      const data = await safeFetch(`${ENQUIRY_URL}/markEnquiryContacted/${id}`, { method: "PUT" });
      setEnquiries(prev => prev.map(e => (e._id === id ? { ...e, isContacted: true } : e)));
      setSelected(prev => (prev?._id === id ? { ...prev, isContacted: true } : prev));
      showToast("Marked as contacted.");
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
    const matchSearch = !q ||
      e.fullName.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.mobile.includes(q) ||
      e.course?.courseName?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const total     = enquiries.length;
  const pending   = enquiries.filter(e => !e.isContacted).length;
  const contacted = enquiries.filter(e => e.isContacted).length;
  const thisMonth = enquiries.filter(e => new Date(e.createdAt).getMonth() === new Date().getMonth()).length;

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-zinc-500 text-sm">Loading enquiries...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* ── Top Nav ── */}
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-black font-black text-sm shrink-0">E</div>
            <p className="text-white font-bold text-xs sm:text-sm">Enquiries</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard label="Total Enquiries" value={total}     icon="📩" color="bg-amber-400/10 text-amber-400" />
          <StatCard label="Pending"         value={pending}   icon="⏳" color="bg-orange-500/10 text-orange-400" />
          <StatCard label="Contacted"       value={contacted} icon="✅" color="bg-green-500/10 text-green-400" />
          <StatCard label="This Month"      value={thisMonth} icon="📈" color="bg-blue-500/10 text-blue-400" />
        </div>

        {/* ── Filter bar ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2 flex-1 bg-zinc-900 border border-zinc-700 focus-within:border-amber-400 rounded-xl px-4 py-2.5 transition-colors">
            <svg className="w-4 h-4 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input
              type="text"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Search by name, email, mobile or course..."
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-zinc-600 min-w-0"
            />
            {searchQ && <button onClick={() => setSearchQ("")} className="text-zinc-500 hover:text-white text-xl shrink-0">×</button>}
          </div>

          <div className="flex gap-2">
            {[
              { key: "all", label: "All" },
              { key: "pending", label: "Pending" },
              { key: "contacted", label: "Contacted" },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  statusFilter === f.key ? "bg-amber-400 text-black" : "bg-zinc-900 border border-zinc-700 text-zinc-400 hover:border-zinc-500"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold">
            Enquiries <span className="text-zinc-500 font-normal text-sm ml-1">({filtered.length})</span>
          </h2>
        </div>

        {/* ── Table ── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-800">
                {["Name", "Contact", "Course", "Mode", "Status", "Received", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-zinc-400 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr
                  key={e._id}
                  className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 transition-colors cursor-pointer"
                  onClick={() => setSelected(e)}
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white">{e.fullName}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">
                    <p>{e.email}</p>
                    <p>{e.mobile}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-amber-400/10 text-amber-400 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                      {e.course?.courseName || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs whitespace-nowrap">{e.mode}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                      e.isContacted ? "bg-green-500/10 text-green-400" : "bg-amber-400/10 text-amber-400"
                    }`}>
                      {e.isContacted ? "CONTACTED" : "PENDING"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-xs whitespace-nowrap">
                    {formatDate(e.createdAt)}<br />{formatTime(e.createdAt)}
                  </td>
                  <td className="px-4 py-3" onClick={(ev) => ev.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      {!e.isContacted && (
                        <button
                          onClick={() => handleMarkContacted(e._id)}
                          disabled={marking === e._id}
                          className="text-amber-400 hover:text-amber-300 disabled:opacity-40 text-xs font-semibold transition-colors whitespace-nowrap"
                        >
                          {marking === e._id ? "..." : "Mark Done"}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(e._id)}
                        disabled={deleting === e._id}
                        className="text-red-500 hover:text-red-400 disabled:opacity-40 text-xs font-semibold transition-colors"
                      >
                        {deleting === e._id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-zinc-600">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-sm">No enquiries found</p>
            </div>
          )}
        </div>
      </div>

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

      {toast && (
        <div
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg z-[1100] ${
            toast.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-black"
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}