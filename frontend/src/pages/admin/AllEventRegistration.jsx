import { useState, useEffect } from "react";

const ALL_REG_URL   = "${import.meta.env.VITE_API_URL}/registration/all";
const EVENT_REG_URL = (id) => `${import.meta.env.VITE_API_URL}/registration/event/${id}`;
const DELETE_URL    = (id) => `${import.meta.env.VITE_API_URL}/registration/${id}`;
const ALL_EVENT_URL = `${import.meta.env.VITE_API_URL}/event/allEvent`;

// ── Mock data for preview ─────────────────────────────────────────────────────
const MOCK_SUMMARY = [
  { eventId:"m1", eventName:"ZintRojgar Fair 2026",  count:42 },
  { eventId:"m2", eventName:"Tech Summit India",     count:31 },
  { eventId:"m3", eventName:"Startup Pitch Night",   count:18 },
  { eventId:"m4", eventName:"Design Horizons",       count:25 },
];

const MOCK_REGS = [
  { _id:"r1", eventId:"m1", eventName:"ZintRojgar Fair 2026",  name:"Aarav Sharma",   email:"aarav@example.com",  phone:"9876543210", rollNo:"ITM2024001", createdAt:"2026-05-01T08:00:00Z" },
  { _id:"r2", eventId:"m1", eventName:"ZintRojgar Fair 2026",  name:"Priya Verma",    email:"priya@example.com",  phone:"9123456789", rollNo:"ITM2024002", createdAt:"2026-05-02T10:00:00Z" },
  { _id:"r3", eventId:"m2", eventName:"Tech Summit India",     name:"Rohit Kumar",    email:"rohit@example.com",  phone:"9001234567", rollNo:"ITM2024003", createdAt:"2026-05-03T09:00:00Z" },
  { _id:"r4", eventId:"m2", eventName:"Tech Summit India",     name:"Sneha Patel",    email:"sneha@example.com",  phone:"9988776655", rollNo:"ITM2024004", createdAt:"2026-05-03T11:00:00Z" },
  { _id:"r5", eventId:"m3", eventName:"Startup Pitch Night",   name:"Karan Singh",    email:"karan@example.com",  phone:"9871234560", rollNo:"ITM2024005", createdAt:"2026-05-04T14:00:00Z" },
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
}
function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }) {
  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-zinc-400 text-xs uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-white text-2xl font-black">{value}</p>
      </div>
    </div>
  );
}

// ── Event Row in summary ──────────────────────────────────────────────────────
function EventSummaryRow({ item, selected, onClick }) {
  const pct = Math.min(100, (item.count / 50) * 100);
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 rounded-xl transition-all border ${
        selected
          ? "bg-amber-400/10 border-amber-400/50 text-white"
          : "bg-zinc-900 border-zinc-800 hover:border-zinc-600 text-zinc-300"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-sm truncate pr-2">{item.eventName}</span>
        <span className={`text-sm font-black shrink-0 ${selected ? "text-amber-400" : "text-zinc-400"}`}>
          {item.count} registered
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${selected ? "bg-amber-400" : "bg-zinc-600"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </button>
  );
}

// ── Main Admin Dashboard ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [allRegs, setAllRegs]       = useState([]);
  const [summary, setSummary]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null); // eventId string
  const [searchQ, setSearchQ]       = useState("");
  const [deleting, setDeleting]     = useState(null);
  const [tab, setTab]               = useState("overview"); // overview | students

  // ── fetch ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(ALL_REG_URL)
      .then(r => r.json())
      .then(d => {
        const regs = d.registrations || [];
        const sum  = d.summary || [];
        if (regs.length) { setAllRegs(regs); setSummary(sum); }
        else             { setAllRegs(MOCK_REGS); setSummary(MOCK_SUMMARY); }
      })
      .catch(() => { setAllRegs(MOCK_REGS); setSummary(MOCK_SUMMARY); })
      .finally(() => setLoading(false));
  }, []);

  // ── delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Remove this registration?")) return;
    setDeleting(id);
    try {
      await fetch(DELETE_URL(id), { method:"DELETE" });
      setAllRegs(prev => prev.filter(r => r._id !== id));
      setSummary(prev =>
        prev.map(s => {
          const reg = allRegs.find(r => r._id === id);
          if (reg && s.eventId === String(reg.eventId))
            return { ...s, count: Math.max(0, s.count - 1) };
          return s;
        })
      );
    } catch { alert("Delete failed"); }
    setDeleting(null);
  };

  // ── derived data ────────────────────────────────────────────────────────────
  const displayRegs = allRegs.filter(r => {
    const matchEvent = !selectedEvent || String(r.eventId) === selectedEvent;
    const q = searchQ.toLowerCase();
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.rollNo?.toLowerCase().includes(q);
    return matchEvent && matchSearch;
  });

  const totalRegistrations = allRegs.length;
  const totalEvents        = summary.length;
  const topEvent           = summary.reduce((a, b) => (b.count > a.count ? b : a), summary[0] || {});

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-zinc-500 text-sm">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* ── Top Nav ── */}
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-black font-black text-sm">E</div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Event Registration Dashboard</p>
            </div>
          </div>
          <div className="flex gap-2">
            {["overview", "students"].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${tab===t ? "bg-amber-400 text-black" : "text-zinc-400 hover:text-white"}`}
              >{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Registrations" value={totalRegistrations} icon="🎟️" color="bg-amber-400/10 text-amber-400" />
          <StatCard label="Events"               value={totalEvents}        icon="📅" color="bg-blue-500/10 text-blue-400" />
          <StatCard label="Top Event"            value={topEvent?.count || 0} icon="⭐" color="bg-purple-500/10 text-purple-400" />
          <StatCard label="This Month"           value={allRegs.filter(r => new Date(r.createdAt).getMonth() === new Date().getMonth()).length} icon="📈" color="bg-green-500/10 text-green-400" />
        </div>

        {tab === "overview" && (
          <>
            {/* ── Events Summary ── */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Registrations by Event</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-3">
                {summary.map(item => (
                  <EventSummaryRow
                    key={item.eventId}
                    item={item}
                    selected={selectedEvent === item.eventId}
                    onClick={() => {
                      setSelectedEvent(prev => prev === item.eventId ? null : item.eventId);
                      setTab("students");
                    }}
                  />
                ))}
              </div>
              {summary.length === 0 && <p className="text-zinc-600 text-sm text-center py-10">No registrations yet.</p>}
            </div>

            {/* ── Recent Registrations ── */}
            <div>
              <h2 className="text-lg font-bold mb-4">Recent Registrations</h2>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left px-4 py-3 text-zinc-400 font-semibold text-xs uppercase tracking-wide">Student</th>
                      <th className="text-left px-4 py-3 text-zinc-400 font-semibold text-xs uppercase tracking-wide hidden sm:table-cell">Event</th>
                      <th className="text-left px-4 py-3 text-zinc-400 font-semibold text-xs uppercase tracking-wide hidden md:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allRegs.slice(0, 8).map((r, i) => (
                      <tr key={r._id} className={`border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 transition-colors ${i % 2 === 0 ? "" : "bg-zinc-900/50"}`}>
                        <td className="px-4 py-3">
                          <p className="font-medium text-white text-sm">{r.name}</p>
                          <p className="text-zinc-500 text-xs">{r.email}</p>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="bg-amber-400/10 text-amber-400 text-xs px-2.5 py-1 rounded-full font-medium">{r.eventName}</span>
                        </td>
                        <td className="px-4 py-3 text-zinc-400 text-xs hidden md:table-cell">{formatDate(r.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {allRegs.length === 0 && <p className="text-center text-zinc-600 py-10 text-sm">No registrations yet.</p>}
              </div>
            </div>
          </>
        )}

        {tab === "students" && (
          <div>
            {/* filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex items-center gap-2 flex-1 bg-zinc-900 border border-zinc-700 focus-within:border-amber-400 rounded-xl px-4 py-2.5 transition-colors">
                <svg className="w-4 h-4 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder="Search by name, email or roll no..."
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder-zinc-600"
                />
                {searchQ && <button onClick={() => setSearchQ("")} className="text-zinc-500 hover:text-white text-xl">×</button>}
              </div>

              {/* event filter pills */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${!selectedEvent ? "bg-amber-400 text-black" : "bg-zinc-900 border border-zinc-700 text-zinc-400"}`}
                >All Events</button>
                {summary.map(s => (
                  <button
                    key={s.eventId}
                    onClick={() => setSelectedEvent(prev => prev === s.eventId ? null : s.eventId)}
                    className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${selectedEvent===s.eventId ? "bg-amber-400 text-black" : "bg-zinc-900 border border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}
                  >{s.eventName} ({s.count})</button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">
                {selectedEvent ? summary.find(s => s.eventId===selectedEvent)?.eventName : "All Students"}
                <span className="text-zinc-500 font-normal text-sm ml-2">({displayRegs.length})</span>
              </h2>
              {selectedEvent && (
                <button onClick={() => setSelectedEvent(null)} className="text-zinc-500 hover:text-white text-xs underline transition-colors">Clear filter</button>
              )}
            </div>

            {/* table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {["#","Name","Roll No","Email","Phone","Event","Registered On",""].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-zinc-400 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayRegs.map((r, i) => (
                    <tr key={r._id} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 transition-colors">
                      <td className="px-4 py-3 text-zinc-500 text-xs">{i + 1}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-white">{r.name}</p>
                      </td>
                      <td className="px-4 py-3 text-zinc-400 text-xs font-mono">{r.rollNo || "—"}</td>
                      <td className="px-4 py-3 text-zinc-400 text-xs">{r.email}</td>
                      <td className="px-4 py-3 text-zinc-400 text-xs">{r.phone || "—"}</td>
                      <td className="px-4 py-3">
                        <span className="bg-amber-400/10 text-amber-400 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap">{r.eventName}</span>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 text-xs whitespace-nowrap">
                        {formatDate(r.createdAt)}<br />{formatTime(r.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(r._id)}
                          disabled={deleting === r._id}
                          className="text-red-500 hover:text-red-400 disabled:opacity-40 text-xs font-semibold transition-colors"
                        >{deleting === r._id ? "..." : "Remove"}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {displayRegs.length === 0 && (
                <div className="text-center py-16 text-zinc-600">
                  <p className="text-4xl mb-3">📭</p>
                  <p>No registrations found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
