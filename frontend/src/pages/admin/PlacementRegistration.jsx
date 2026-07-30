import { useState, useEffect } from "react";

const PP = "#B026B5";
const BL = "#38BDF8";
const GR = "#22C55E";
const DARK = "#111827";

const PLACEMENT_URL = `${import.meta.env.VITE_API_URL}/placementRegistration`;

async function safeFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      credentials: "include",
    },
  });
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
    <div className="rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 bg-white border" style={{ borderColor: `${color}33` }}>
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg sm:text-xl shrink-0" style={{ background: `${color}15`, color }}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] sm:text-xs uppercase tracking-widest mb-0.5 truncate" style={{ color: "#9ca3af" }}>{label}</p>
        <p className="text-xl sm:text-2xl font-black" style={{ color: DARK }}>{value}</p>
      </div>
    </div>
  );
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function RegistrationDetailModal({ reg, onClose, onMarkContacted, onDelete, marking, deleting }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-[1000] p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b shrink-0" style={{ borderColor: "#e5e7eb" }}>
          <h3 className="font-bold text-base sm:text-lg" style={{ color: DARK }}>Registration Details</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full transition-colors text-gray-400 hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        <div className="px-5 sm:px-6 py-5 overflow-y-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-base" style={{ color: DARK }}>{reg.fullName}</p>
              <p className="text-xs text-gray-400">{formatDate(reg.createdAt)} · {formatTime(reg.createdAt)}</p>
            </div>
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={reg.isContacted
                ? { background: `${GR}18`, color: "#15803d" }
                : { background: `${PP}15`, color: PP }}
            >
              {reg.isContacted ? "CONTACTED" : "PENDING"}
            </span>
          </div>

          {reg.user && (
            <div className="rounded-xl px-3.5 py-2.5 text-xs" style={{ background: `${BL}12`, color: "#0369a1", border: `1px solid ${BL}30` }}>
              Registered while logged in as a verified user
              {reg.user.email ? ` (${reg.user.email})` : ""}.
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl p-3 bg-gray-50 border border-gray-100">
              <p className="text-[10px] uppercase tracking-wide mb-1 text-gray-400">Email</p>
              <p className="text-xs break-all" style={{ color: DARK }}>{reg.email}</p>
            </div>
            <div className="rounded-xl p-3 bg-gray-50 border border-gray-100">
              <p className="text-[10px] uppercase tracking-wide mb-1 text-gray-400">Phone</p>
              <p className="text-xs" style={{ color: DARK }}>{reg.phone}</p>
            </div>
            <div className="rounded-xl p-3 col-span-2 bg-gray-50 border border-gray-100">
              <p className="text-[10px] uppercase tracking-wide mb-1 text-gray-400">Course</p>
              <p className="text-xs font-semibold" style={{ color: PP }}>{reg.course}</p>
            </div>
            {reg.message && (
              <div className="rounded-xl p-3 col-span-2 bg-gray-50 border border-gray-100">
                <p className="text-[10px] uppercase tracking-wide mb-1 text-gray-400">Message</p>
                <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>{reg.message}</p>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 sm:px-6 py-4 border-t shrink-0 flex gap-3" style={{ borderColor: "#e5e7eb" }}>
          {!reg.isContacted && (
            <button
              onClick={() => onMarkContacted(reg._id)}
              disabled={marking === reg._id}
              className="flex-1 font-bold py-2.5 rounded-xl text-sm text-white transition-colors disabled:opacity-50"
              style={{ background: PP }}
            >
              {marking === reg._id ? "Updating..." : "Mark Contacted"}
            </button>
          )}
          <button
            onClick={() => onDelete(reg._id)}
            disabled={deleting === reg._id}
            className={`${reg.isContacted ? "flex-1" : ""} font-bold py-2.5 px-4 rounded-xl text-sm transition-colors disabled:opacity-50`}
            style={{ background: "#fef2f2", color: "#dc2626" }}
          >
            {deleting === reg._id ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Page ────────────────────────────────────────────────────────────
export default function AdminPlacementRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [searchName, setSearchName] = useState(""); // search by NAME only, per request
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected]   = useState(null);
  const [marking, setMarking]     = useState(null);
  const [deleting, setDeleting]   = useState(null);
  const [toast, setToast]         = useState(null);

  const loadRegistrations = async () => {
    try {
      const data = await safeFetch(`${PLACEMENT_URL}/allPlacementRegistrations`);
      setRegistrations(data?.data || []);
    } catch (err) {
      console.log(err);
      setRegistrations([]);
    }
  };

  useEffect(() => {
    loadRegistrations().finally(() => setLoading(false));
  }, []);

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleMarkContacted = async (id) => {
    setMarking(id);
    try {
      await safeFetch(`${PLACEMENT_URL}/markPlacementContacted/${id}`, { method: "PUT" });
      setRegistrations(prev => prev.map(r => (r._id === id ? { ...r, isContacted: true } : r)));
      setSelected(prev => (prev?._id === id ? { ...prev, isContacted: true } : prev));
      showToast("Marked as contacted.");
    } catch (err) {
      showToast(err.message || "Failed to update.", "error");
    } finally {
      setMarking(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this registration? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await safeFetch(`${PLACEMENT_URL}/deletePlacementRegistration/${id}`, { method: "DELETE" });
      setRegistrations(prev => prev.filter(r => r._id !== id));
      setSelected(null);
      showToast("Registration deleted.");
    } catch (err) {
      showToast(err.message || "Delete failed.", "error");
    } finally {
      setDeleting(null);
    }
  };

  // ── Search by NAME only ──
  const filtered = registrations.filter(r => {
    const matchStatus =
      statusFilter === "all" ? true :
      statusFilter === "contacted" ? r.isContacted :
      !r.isContacted;
    const matchName = !searchName.trim() ||
      r.fullName?.toLowerCase().includes(searchName.trim().toLowerCase());
    return matchStatus && matchName;
  });

  const total     = registrations.length;
  const pending   = registrations.filter(r => !r.isContacted).length;
  const contacted = registrations.filter(r => r.isContacted).length;
  const thisMonth = registrations.filter(r => new Date(r.createdAt).getMonth() === new Date().getMonth()).length;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8FAFC" }}>
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3" style={{ borderColor: `${PP} ${PP} ${PP} transparent` }} />
        <p className="text-sm text-gray-400">Loading registrations...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans" style={{ background: "#F8FAFC" }}>
      {/* ── Top Nav ── */}
      <div className="bg-white border-b sticky top-0 z-10" style={{ borderColor: "#e5e7eb" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm shrink-0" style={{ background: `linear-gradient(135deg, ${PP}, ${BL})` }}>P</div>
            <p className="font-bold text-xs sm:text-sm" style={{ color: DARK }}>Placement Registrations</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard label="Total Registrations" value={total}     icon="📋" color={PP} />
          <StatCard label="Pending"             value={pending}   icon="⏳" color="#f59e0b" />
          <StatCard label="Contacted"           value={contacted} icon="✅" color={GR} />
          <StatCard label="This Month"          value={thisMonth} icon="📈" color={BL} />
        </div>

        {/* ── Search bar (by name) + status filter ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2 flex-1 bg-white rounded-xl px-4 py-2.5 border transition-colors" style={{ borderColor: "#e5e7eb" }}>
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke={PP} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input
              type="text"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              placeholder="Search by name..."
              className="flex-1 bg-transparent text-sm outline-none min-w-0"
              style={{ color: DARK }}
            />
            {searchName && <button onClick={() => setSearchName("")} className="text-xl shrink-0 text-gray-400">×</button>}
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
                className="shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                style={statusFilter === f.key
                  ? { background: `linear-gradient(135deg, ${PP}, ${BL})`, color: "#fff" }
                  : { background: "#fff", border: "1px solid #e5e7eb", color: "#6b7280" }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold" style={{ color: DARK }}>
            Registrations <span className="font-normal text-sm ml-1 text-gray-400">({filtered.length})</span>
          </h2>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl overflow-hidden overflow-x-auto border" style={{ borderColor: "#e5e7eb" }}>
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr style={{ background: `${PP}08`, borderBottom: "1px solid #e5e7eb" }}>
                {["Name", "Contact", "Course", "Status", "Received", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide whitespace-nowrap" style={{ color: "#6b7280" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr
                  key={r._id}
                  className="border-b last:border-0 cursor-pointer transition-colors"
                  style={{ borderColor: "#f3f4f6" }}
                  onClick={() => setSelected(r)}
                  onMouseEnter={e => e.currentTarget.style.background = `${PP}05`}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold" style={{ color: DARK }}>{r.fullName}</p>
                    {r.user && <p className="text-[10px] font-medium" style={{ color: BL }}>Verified user</p>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    <p>{r.email}</p>
                    <p>{r.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap" style={{ background: `${PP}12`, color: PP }}>
                      {r.course}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap"
                      style={r.isContacted
                        ? { background: `${GR}18`, color: "#15803d" }
                        : { background: `${PP}15`, color: PP }}
                    >
                      {r.isContacted ? "CONTACTED" : "PENDING"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap text-gray-400">
                    {formatDate(r.createdAt)}<br />{formatTime(r.createdAt)}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      {!r.isContacted && (
                        <button
                          onClick={() => handleMarkContacted(r._id)}
                          disabled={marking === r._id}
                          className="text-xs font-semibold transition-colors disabled:opacity-40 whitespace-nowrap"
                          style={{ color: PP }}
                        >
                          {marking === r._id ? "..." : "Mark Done"}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(r._id)}
                        disabled={deleting === r._id}
                        className="text-xs font-semibold transition-colors disabled:opacity-40"
                        style={{ color: "#dc2626" }}
                      >
                        {deleting === r._id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-300">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-sm">No registrations found</p>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <RegistrationDetailModal
          reg={selected}
          onClose={() => setSelected(null)}
          onMarkContacted={handleMarkContacted}
          onDelete={handleDelete}
          marking={marking}
          deleting={deleting}
        />
      )}

      {toast && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg z-[1100] text-white"
          style={{ background: toast.type === "error" ? "#dc2626" : GR }}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}