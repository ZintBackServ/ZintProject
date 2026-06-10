import { useState, useEffect } from "react";

const BASE =`${import.meta.env.VITE_API_URL}/rating`;
const API = {
  addRating:          `${BASE}/addRating`,
  getRatingsByTarget: (id) => `${BASE}/target/${Id}`,
  getAllRatings:       `${BASE}/all`,
  getStats:           `${BASE}/stats`,
  toggleVisibility:   (id) => `${BASE}/visibility/${id}`,
  deleteRating:       (id) => `${BASE}/delete/${id}`,
};

// ── Mock data ────────────────────────────────────────────────────────────────
const MOCK_STATS = {
  totalRatings: 128,
  avgRating: 4.3,
  byType: { event: 52, course: 41, mentor: 22, internship: 13 },
  distribution: { 1: 4, 2: 8, 3: 18, 4: 45, 5: 53 },
  recent: [
    { _id:"r1", studentName:"Aarav Sharma",  targetName:"ZintRojgar Fair", targetType:"event",  rating:5, review:"Amazing event! Got placed.", createdAt:"2026-05-10T09:00:00Z", isVisible:true },
    { _id:"r2", studentName:"Priya Verma",   targetName:"Web Dev Course",  targetType:"course", rating:4, review:"Great content and mentor.",  createdAt:"2026-05-09T11:00:00Z", isVisible:true },
    { _id:"r3", studentName:"Rohit Kumar",   targetName:"Tech Summit",     targetType:"event",  rating:3, review:"Good but hall was crowded.", createdAt:"2026-05-08T14:00:00Z", isVisible:false },
    { _id:"r4", studentName:"Sneha Patel",   targetName:"Python Basics",   targetType:"course", rating:5, review:"Best course I took!",         createdAt:"2026-05-07T08:00:00Z", isVisible:true },
    { _id:"r5", studentName:"Karan Singh",   targetName:"ZintRojgar Fair", targetType:"event",  rating:4, review:"Well organized.",             createdAt:"2026-05-06T10:00:00Z", isVisible:true },
  ],
};

const MOCK_ALL = {
  total: 128,
  summary: [
    { targetId:"t1", targetName:"ZintRojgar Fair", targetType:"event",  totalRatings:38, avgRating:4.5, distribution:{ 1:1,2:2,3:5,4:12,5:18 } },
    { targetId:"t2", targetName:"Web Dev Course",  targetType:"course", totalRatings:29, avgRating:4.2, distribution:{ 1:1,2:3,3:4,4:10,5:11 } },
    { targetId:"t3", targetName:"Tech Summit",     targetType:"event",  totalRatings:22, avgRating:3.8, distribution:{ 1:2,2:3,3:6,4:7,5:4  } },
    { targetId:"t4", targetName:"Python Basics",   targetType:"course", totalRatings:39, avgRating:4.7, distribution:{ 1:0,2:1,3:3,4:10,5:25 } },
  ],
  ratings: [
    { _id:"r1", studentName:"Aarav Sharma",  rollNo:"ITM001", studentEmail:"aarav@x.com", targetName:"ZintRojgar Fair", targetType:"event",  rating:5, review:"Amazing event! Got placed on spot.",     createdAt:"2026-05-10T09:00:00Z", isVisible:true  },
    { _id:"r2", studentName:"Priya Verma",   rollNo:"ITM002", studentEmail:"priya@x.com", targetName:"Web Dev Course",  targetType:"course", rating:4, review:"Great content, practical approach.",      createdAt:"2026-05-09T11:00:00Z", isVisible:true  },
    { _id:"r3", studentName:"Rohit Kumar",   rollNo:"ITM003", studentEmail:"rohit@x.com", targetName:"Tech Summit",     targetType:"event",  rating:3, review:"Good but hall was very crowded.",         createdAt:"2026-05-08T14:00:00Z", isVisible:false },
    { _id:"r4", studentName:"Sneha Patel",   rollNo:"ITM004", studentEmail:"sneha@x.com", targetName:"Python Basics",   targetType:"course", rating:5, review:"Best course I took this year!",           createdAt:"2026-05-07T08:00:00Z", isVisible:true  },
    { _id:"r5", studentName:"Karan Singh",   rollNo:"ITM005", studentEmail:"karan@x.com", targetName:"ZintRojgar Fair", targetType:"event",  rating:4, review:"Well organized, loved the recruiters.",   createdAt:"2026-05-06T10:00:00Z", isVisible:true  },
    { _id:"r6", studentName:"Meera Joshi",   rollNo:"ITM006", studentEmail:"meera@x.com", targetName:"Web Dev Course",  targetType:"course", rating:5, review:"Instructor was very helpful.",            createdAt:"2026-05-05T12:00:00Z", isVisible:true  },
    { _id:"r7", studentName:"Dev Malhotra",  rollNo:"ITM007", studentEmail:"dev@x.com",   targetName:"Python Basics",   targetType:"course", rating:4, review:"Good pace, clear explanations.",          createdAt:"2026-05-04T15:00:00Z", isVisible:true  },
  ],
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
}

function Stars({ value, size = "text-lg" }) {
  return (
    <div className={`flex gap-0.5 ${size}`}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= value ? "text-amber-400" : "text-zinc-700"}>★</span>
      ))}
    </div>
  );
}

function RatingBar({ label, count, total, color }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-zinc-400 text-xs w-4 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width:`${pct}%` }} />
      </div>
      <span className="text-zinc-500 text-xs w-8 text-right">{count}</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STUDENT — Rating Submission Form
// ══════════════════════════════════════════════════════════════════════════════
export function RatingForm({ targetId, targetType, targetName, onSuccess }) {
  const [hover,    setHover]   = useState(0);
  const [form,     setForm]    = useState({ rating:0, review:"", studentName:"", studentEmail:""});
  const [loading,  setLoading] = useState(false);
  const [done,     setDone]    = useState(false);
  const [error,    setError]   = useState("");

  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  const handleSubmit = async () => {
    setError("");
    if (!form.studentName.trim() || !form.studentEmail.trim()) {
      setError("Name and email are required."); return;
    }
    if (!form.rating) {
      setError("Please select a star rating."); return;
    }
    setLoading(true);
    try {
      const res = await fetch(API.addRating, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId, targetType, targetName, ...form }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.msg || "Failed");
      setDone(true);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="text-center py-10 px-6">
      <div className="w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-3xl mx-auto mb-4">⭐</div>
      <h3 className="text-white text-lg font-bold mb-1">Thank you!</h3>
      <p className="text-zinc-400 text-sm">Your rating for <span className="text-amber-400 font-semibold">{targetName}</span> has been submitted.</p>
    </div>
  );

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md">
      <h3 className="text-white font-bold text-lg mb-0.5">Rate & Review</h3>
      <p className="text-amber-400 text-sm font-medium mb-6">{targetName}</p>

      {/* Star selector */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex gap-2 mb-2">
          {[1,2,3,4,5].map(i => (
            <button
              key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setForm({ ...form, rating: i })}
              className={`text-4xl transition-transform hover:scale-110 ${i <= (hover || form.rating) ? "text-amber-400" : "text-zinc-700"}`}
            >★</button>
          ))}
        </div>
        <p className="text-zinc-400 text-sm h-5">
          {labels[hover || form.rating] || "Select a rating"}
        </p>
      </div>

      {/* Fields */}
      <div className="space-y-3 mb-4">
        {[
          { key:"studentName",  label:"Full Name *",     type:"text",  ph:"Your name" },
           { key:"targetType",  label:"Type *",     type:"text",  ph:"'event','course', 'mentor','internship'" },
          { key:"targetName",       label:"Name",    type:"text",  ph:"e.g. Rojgar Event" },
          { key:"studentEmail", label:"Email Address *", type:"email", ph:"you@example.com" },
        ].map(({ key, label, type, ph }) => (
          <div key={key}>
            <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-1.5">{label}</label>
            <input
              type={type}
              value={form[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              placeholder={ph}
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-400 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-colors placeholder-zinc-600"
            />
          </div>
        ))}

        <div>
          <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-1.5">Review (optional)</label>
          <textarea
            value={form.review}
            onChange={e => setForm({ ...form, review: e.target.value })}
            placeholder="Share your experience..."
            rows={3}
            maxLength={500}
            className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-400 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-colors placeholder-zinc-600 resize-none"
          />
          <p className="text-zinc-600 text-xs text-right mt-1">{form.review.length}/500</p>
        </div>
      </div>

      {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-bold py-3 rounded-xl text-sm transition-colors"
      >
        {loading ? "Submitting..." : "Submit Rating →"}
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN — Rating Dashboard
// ══════════════════════════════════════════════════════════════════════════════
export function AdminRatingDashboard() {
  const [stats,     setStats]     = useState(null);
  const [allData,   setAllData]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState("overview");
  const [filter,    setFilter]    = useState("all");
  const [search,    setSearch]    = useState("");
  const [deleting,  setDeleting]  = useState(null);
  const [toggling,  setToggling]  = useState(null);
  const [selected,  setSelected]  = useState(null); // selected summary item

  useEffect(() => {
    Promise.all([
      fetch(API.getStats).then(r => r.json()).catch(() => MOCK_STATS),
      fetch(API.getAllRatings).then(r => r.json()).catch(() => MOCK_ALL),
    ]).then(([s, a]) => {
      setStats(s.totalRatings !== undefined ? s : MOCK_STATS);
      setAllData(a.total !== undefined ? a : MOCK_ALL);
    }).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this rating permanently?")) return;
    setDeleting(id);
    try {
      await fetch(API.deleteRating(id), { method:"DELETE" });
      setAllData(prev => ({
        ...prev,
        ratings: prev.ratings.filter(r => r._id !== id),
        total: prev.total - 1,
      }));
    } catch { alert("Delete failed"); }
    setDeleting(null);
  };

  const handleToggle = async (id) => {
    setToggling(id);
    try {
      const res = await fetch(API.toggleVisibility(id), { method:"PATCH" });
      const d   = await res.json();
      setAllData(prev => ({
        ...prev,
        ratings: prev.ratings.map(r => r._id === id ? { ...r, isVisible: d.rating?.isVisible ?? !r.isVisible } : r),
      }));
    } catch { alert("Failed"); }
    setToggling(null);
  };

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
    </div>
  );

  const ratings    = allData?.ratings || [];
  const summary    = allData?.summary || [];
  const typeColors = { event:"bg-blue-500/10 text-blue-400", course:"bg-green-500/10 text-green-400", mentor:"bg-purple-500/10 text-purple-400", internship:"bg-orange-500/10 text-orange-400" };
  const starColors = ["","bg-red-500","bg-orange-500","bg-yellow-500","bg-lime-500","bg-green-500"];

  const filteredRatings = ratings.filter(r => {
    const matchType   = filter === "all" || r.targetType === filter;
    const matchSel    = !selected || r.targetName === selected;
    const q           = search.toLowerCase();
    const matchSearch = !q || r.studentName.toLowerCase().includes(q) || r.targetName.toLowerCase().includes(q) || r.studentEmail.toLowerCase().includes(q);
    return matchType && matchSel && matchSearch;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* ── Nav ── */}
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-black font-black text-sm">★</div>
            <div>
              <p className="text-white font-bold text-sm">Ratings & Reviews</p>
              <p className="text-zinc-500 text-xs">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex gap-2">
            {["overview","reviews"].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${tab===t ? "bg-amber-400 text-black" : "text-zinc-400 hover:text-white"}`}
              >{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label:"Total Ratings",  value: stats?.totalRatings || 0,                        icon:"🌟", color:"bg-amber-400/10 text-amber-400" },
            { label:"Average Rating", value: `${stats?.avgRating || 0} / 5`,                   icon:"📊", color:"bg-blue-500/10 text-blue-400" },
            { label:"Events Rated",   value: stats?.byType?.event || 0,                         icon:"📅", color:"bg-purple-500/10 text-purple-400" },
            { label:"Courses Rated",  value: stats?.byType?.course || 0,                        icon:"📚", color:"bg-green-500/10 text-green-400" },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
              <div>
                <p className="text-zinc-400 text-xs uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-white text-2xl font-black">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {tab === "overview" && (
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Star distribution */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-1">Rating Distribution</h3>
              <p className="text-zinc-500 text-xs mb-5">Across all reviews</p>
              <div className="flex items-center gap-6 mb-6">
                <div className="text-center">
                  <p className="text-5xl font-black text-amber-400">{stats?.avgRating}</p>
                  <Stars value={Math.round(stats?.avgRating || 0)} size="text-xl" />
                  <p className="text-zinc-500 text-xs mt-1">{stats?.totalRatings} reviews</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[5,4,3,2,1].map(star => (
                    <RatingBar
                      key={star}
                      label={star}
                      count={stats?.distribution?.[star] || 0}
                      total={stats?.totalRatings || 1}
                      color={starColors[star]}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* By type */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-1">Ratings by Type</h3>
              <p className="text-zinc-500 text-xs mb-5">Breakdown by category</p>
              <div className="space-y-3">
                {Object.entries(stats?.byType || {}).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${typeColors[type] || "bg-zinc-700 text-zinc-300"}`}>{type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-24 bg-zinc-700 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width:`${(count/(stats?.totalRatings||1))*100}%` }} />
                      </div>
                      <span className="text-white font-bold text-sm w-6 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary per target */}
            <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-1">Per Event / Course Summary</h3>
              <p className="text-zinc-500 text-xs mb-5">Click a row to filter reviews</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {summary.map(item => (
                  <button
                    key={item.targetId}
                    onClick={() => { setSelected(s => s === item.targetName ? null : item.targetName); setTab("reviews"); }}
                    className={`text-left p-4 rounded-xl border transition-all ${selected===item.targetName ? "border-amber-400/60 bg-amber-400/5" : "border-zinc-800 bg-zinc-800/30 hover:border-zinc-600"}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white font-semibold text-sm">{item.targetName}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${typeColors[item.targetType] || "bg-zinc-700 text-zinc-300"}`}>{item.targetType}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-amber-400 font-black text-xl">{item.avgRating}</p>
                        <Stars value={Math.round(item.avgRating)} size="text-xs" />
                      </div>
                    </div>
                    <div className="flex gap-1 mt-3">
                      {[5,4,3,2,1].map(s => (
                        <div key={s} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-zinc-700 rounded-sm overflow-hidden" style={{ height:24 }}>
                            <div
                              className={`w-full rounded-sm ${starColors[s]}`}
                              style={{ height: item.totalRatings ? `${(item.distribution[s]/item.totalRatings)*100}%` : "0%", marginTop:"auto" }}
                            />
                          </div>
                          <span className="text-zinc-600 text-xs">{s}★</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-zinc-500 text-xs mt-2">{item.totalRatings} total reviews</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent reviews */}
            <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-5">Recent Reviews</h3>
              <div className="space-y-3">
                {(stats?.recent || []).map(r => (
                  <div key={r._id} className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${r.isVisible ? "border-zinc-800 bg-zinc-800/30" : "border-zinc-800 bg-zinc-900 opacity-50"}`}>
                    <div className="w-9 h-9 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
                      {r.studentName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-white font-semibold text-sm">{r.studentName}</p>
                        <Stars value={r.rating} size="text-sm" />
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${typeColors[r.targetType] || "bg-zinc-700 text-zinc-300"}`}>{r.targetType}</span>
                      </div>
                      <p className="text-amber-400/70 text-xs mb-1">{r.targetName}</p>
                      {r.review && <p className="text-zinc-400 text-xs leading-relaxed">{r.review}</p>}
                    </div>
                    <p className="text-zinc-600 text-xs shrink-0">{formatDate(r.createdAt)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "reviews" && (
          <div>
            {/* filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="flex items-center gap-2 flex-1 bg-zinc-900 border border-zinc-700 focus-within:border-amber-400 rounded-xl px-4 py-2.5 transition-colors">
                <svg className="w-4 h-4 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by student, email or target..."
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder-zinc-600"
                />
                {search && <button onClick={() => setSearch("")} className="text-zinc-500 hover:text-white text-xl">×</button>}
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {["all","event","course","mentor","internship"].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${filter===f ? "bg-amber-400 text-black" : "bg-zinc-900 border border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}
                  >{f}</button>
                ))}
                {selected && (
                  <button onClick={() => setSelected(null)} className="shrink-0 px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-800 border border-amber-400/40 text-amber-400">
                    {selected} ×
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <p className="text-zinc-400 text-sm">{filteredRatings.length} reviews</p>
            </div>

            {/* table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden overflow-x-auto">
              <table className="w-full text-sm min-w-[750px]">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {["#","Student","Target","Rating","Review","Date","Visible",""].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-zinc-400 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRatings.map((r, i) => (
                    <tr key={r._id} className={`border-b border-zinc-800/50 last:border-0 transition-colors hover:bg-zinc-800/20 ${!r.isVisible ? "opacity-50" : ""}`}>
                      <td className="px-4 py-3 text-zinc-500 text-xs">{i+1}</td>
                      <td className="px-4 py-3">
                        <p className="text-white font-semibold text-sm">{r.studentName}</p>
                        <p className="text-zinc-500 text-xs">{r.rollNo || r.studentEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-white text-sm">{r.targetName}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${typeColors[r.targetType] || "bg-zinc-700 text-zinc-300"}`}>{r.targetType}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Stars value={r.rating} size="text-base" />
                        <p className="text-zinc-500 text-xs mt-0.5">{r.rating} / 5</p>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">{r.review || <span className="text-zinc-600 italic">No review</span>}</p>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 text-xs whitespace-nowrap">{formatDate(r.createdAt)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggle(r._id)}
                          disabled={toggling === r._id}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${r.isVisible ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"}`}
                        >
                          {toggling === r._id ? "..." : r.isVisible ? "Visible" : "Hidden"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(r._id)}
                          disabled={deleting === r._id}
                          className="text-red-500 hover:text-red-400 disabled:opacity-40 text-xs font-semibold transition-colors"
                        >{deleting === r._id ? "..." : "Delete"}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredRatings.length === 0 && (
                <div className="text-center py-16 text-zinc-600">
                  <p className="text-4xl mb-3">⭐</p>
                  <p>No reviews found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORT — Demo page showing both components
// ══════════════════════════════════════════════════════════════════════════════
export default function RatingPage() {
  const [view, setView] = useState("form"); // "form" | "admin"

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* toggle for demo */}
      <div className="flex justify-center gap-3 pt-8 pb-4">
        <button onClick={() => setView("form")}  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${view==="form"  ? "bg-amber-400 text-black" : "border border-zinc-700 text-zinc-400"}`}>Student Form</button>
        <button onClick={() => setView("admin")} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${view==="admin" ? "bg-amber-400 text-black" : "border border-zinc-700 text-zinc-400"}`}>Admin View</button>
      </div>

      {view === "form" ? (
        <div className="flex justify-center px-4 py-8">
          <RatingForm
            targetId="m1"
            targetType="event"
            targetName="ZintRojgar Fair 2026"
          />
        </div>
      ) : (
        <AdminRatingDashboard />
      )}
    </div>
  );
}
