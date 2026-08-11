import { useState, useEffect } from "react";

const BASE = `${import.meta.env.VITE_API_URL}/rating`;
const API = {
  addRating:          `${BASE}/addRating`,
  getRatingsByTarget: (name) => `${BASE}/target/${encodeURIComponent(name)}`,
  getAllRatings:       `${BASE}/all`,
  getStats:            `${BASE}/stats`,
  toggleVisibility:   (id) => `${BASE}/visibility/${id}`,
  blockUser:          (userId) => `${BASE}/block-user/${userId}`,
  deleteRating:       (id) => `${BASE}/delete/${id}`,
};

const TARGET_TYPES = ["event", "course", "mentor", "internship"];

function authFetchOpts() {
  return { credentials: "include" };
}

// ── Mock data fallbacks ────────────────────────────────────────────────────────
const MOCK_STATS = {
  totalRatings: 128,
  avgRating: 4.3,
  byType: { event: 52, course: 41, mentor: 22, internship: 13 },
  distribution: { 1: 4, 2: 8, 3: 18, 4: 45, 5: 53 },
  recent: [
    { _id:"r1", studentName:"Aarav Sharma",  targetName:"ZintRojgar Fair", targetType:"event",  rating:5, review:"Amazing event! Got placed.", createdAt:"2026-05-10T09:00:00Z", isVisible:true },
    { _id:"r2", studentName:"Priya Verma",   targetName:"Web Dev Course",  targetType:"course", rating:4, review:"Great content and mentor.",  createdAt:"2026-05-09T11:00:00Z", isVisible:true },
    { _id:"r3", studentName:"Rohit Kumar",   targetName:"Tech Summit",     targetType:"event",  rating:3, review:"Good but hall was crowded.", createdAt:"2026-05-08T14:00:00Z", isVisible:false },
  ],
};

const MOCK_ALL = {
  total: 128,
  summary: [
    { targetName:"ZintRojgar Fair", targetType:"event",  totalRatings:38, avgRating:4.5, distribution:{ 1:1,2:2,3:5,4:12,5:18 } },
    { targetName:"Web Dev Course",  targetType:"course", totalRatings:29, avgRating:4.2, distribution:{ 1:1,2:3,3:4,4:10,5:11 } },
    { targetName:"Tech Summit",     targetType:"event",  totalRatings:22, avgRating:3.8, distribution:{ 1:2,2:3,3:6,4:7,5:4  } },
    { targetName:"Python Basics",   targetType:"course", totalRatings:39, avgRating:4.7, distribution:{ 1:0,2:1,3:3,4:10,5:25 } },
  ],
  ratings: [
    { _id:"r1", studentName:"Aarav Sharma",  studentEmail:"aarav@x.com", targetName:"ZintRojgar Fair", targetType:"event",  rating:5, review:"Amazing event! Got placed on spot.",     createdAt:"2026-05-10T09:00:00Z", isVisible:true  },
    { _id:"r2", studentName:"Priya Verma",   studentEmail:"priya@x.com", targetName:"Web Dev Course",  targetType:"course", rating:4, review:"Great content, practical approach.",      createdAt:"2026-05-09T11:00:00Z", isVisible:true  },
    { _id:"r3", studentName:"Rohit Kumar",   studentEmail:"rohit@x.com", targetName:"Tech Summit",     targetType:"event",  rating:3, review:"Good but hall was very crowded.",         createdAt:"2026-05-08T14:00:00Z", isVisible:false },
  ],
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
}

function Stars({ value, size = "text-base" }) {
  return (
    <div className={`flex gap-0.5 ${size}`}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= value ? "text-amber-400" : "text-gray-200"}>★</span>
      ))}
    </div>
  );
}

function RatingBar({ label, count, total, color }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-500 text-xs w-4 shrink-0 font-bold">{label}★</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width:`${pct}%` }} />
      </div>
      <span className="text-gray-400 text-xs w-8 text-right font-medium">{count}</span>
    </div>
  );
}

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="flex gap-2 mb-1.5">
        {[1,2,3,4,5].map(i => (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(i)}
            className={`text-4xl transition-transform hover:scale-110 ${i <= (hover || value) ? "text-amber-400" : "text-gray-200"}`}
          >★</button>
        ))}
      </div>
      <p className="text-indigo-600 text-xs font-bold h-4">{labels[hover || value] || "Select a rating"}</p>
    </div>
  );
}

/* ── STUDENT Rating Submission Form ── */
export function RatingForm({ targetType, targetName, onSuccess }) {
  const [form,    setForm]    = useState({ rating:0, review:"", studentName:"", studentEmail:"" });
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState("");

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
        body: JSON.stringify({ targetType, targetName, ...form }),
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
    <div className="text-center py-10 px-6 bg-white rounded-3xl border border-gray-100 shadow-xl max-w-md">
      <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl mx-auto mb-4">⭐</div>
      <h3 className="text-gray-900 text-xl font-extrabold mb-1">Thank you!</h3>
      <p className="text-gray-500 text-sm">Your rating for <span className="text-indigo-600 font-semibold">{targetName}</span> has been submitted.</p>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl">
      <h3 className="text-gray-900 font-extrabold text-xl mb-0.5">Rate & Review</h3>
      <p className="text-indigo-600 text-sm font-semibold mb-6">{targetName}</p>

      <StarPicker value={form.rating} onChange={i => setForm({ ...form, rating: i })} />

      <div className="space-y-3 mb-5">
        {[
          { key:"studentName",  label:"Full Name *",     type:"text",  ph:"Your name" },
          { key:"studentEmail", label:"Email Address *", type:"email", ph:"you@example.com" },
        ].map(({ key, label, type, ph }) => (
          <div key={key}>
            <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5">{label}</label>
            <input
              type={type}
              value={form[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              placeholder={ph}
              className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 text-gray-900 rounded-xl px-4 py-2.5 text-sm outline-none transition"
            />
          </div>
        ))}

        <div>
          <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5">Review (optional)</label>
          <textarea
            value={form.review}
            onChange={e => setForm({ ...form, review: e.target.value })}
            placeholder="Share your experience..."
            rows={3}
            maxLength={500}
            className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 text-gray-900 rounded-xl px-4 py-2.5 text-sm outline-none transition resize-none"
          />
          <p className="text-gray-400 text-xs text-right mt-1">{form.review.length}/500</p>
        </div>
      </div>

      {error && <p className="text-rose-600 text-xs mb-3 font-semibold">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition shadow-sm"
      >
        {loading ? "Submitting..." : "Submit Rating →"}
      </button>
    </div>
  );
}

/* ── ADMIN Add Review Modal ── */
function AdminAddReviewModal({ knownTargets, onClose, onCreated }) {
  const [form, setForm] = useState({
    targetType: "course",
    targetName: "",
    studentName: "",
    studentEmail: "",
    rating: 0,
    review: "",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const targetNameOptions = knownTargets
    .filter(t => t.targetType === form.targetType)
    .map(t => t.targetName);

  const handleSubmit = async () => {
    setError("");
    if (!form.targetName.trim()) { setError("Target name is required."); return; }
    if (!form.studentName.trim() || !form.studentEmail.trim()) { setError("Name and email are required."); return; }
    if (!form.rating) { setError("Please select a star rating."); return; }

    setLoading(true);
    try {
      const res = await fetch(API.addRating, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.msg || "Failed to add review");
      onCreated(d.rating);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 sm:p-7 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-gray-900 font-extrabold text-lg">➕ Add Rating & Review</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center">✕</button>
        </div>
        <p className="text-gray-400 text-xs mb-5">Manually log a student review</p>

        <StarPicker value={form.rating} onChange={i => setForm({ ...form, rating: i })} />

        <div className="space-y-3.5 mb-5">
          <div>
            <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5">Type *</label>
            <div className="flex gap-2 flex-wrap">
              {TARGET_TYPES.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, targetType: t })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                    form.targetType === t ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >{t}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5">Target Name *</label>
            <input
              type="text"
              list="admin-known-targets"
              value={form.targetName}
              onChange={e => setForm({ ...form, targetName: e.target.value })}
              placeholder="e.g. Web Dev Course"
              className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 text-gray-900 rounded-xl px-4 py-2.5 text-sm outline-none transition"
            />
            <datalist id="admin-known-targets">
              {targetNameOptions.map(name => <option key={name} value={name} />)}
            </datalist>
          </div>

          {[
            { key:"studentName",  label:"Student Name *",  type:"text",  ph:"Their name" },
            { key:"studentEmail", label:"Student Email *", type:"email", ph:"student@example.com" },
          ].map(({ key, label, type, ph }) => (
            <div key={key}>
              <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={ph}
                className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 text-gray-900 rounded-xl px-4 py-2.5 text-sm outline-none transition"
              />
            </div>
          ))}

          <div>
            <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5">Review (optional)</label>
            <textarea
              value={form.review}
              onChange={e => setForm({ ...form, review: e.target.value })}
              placeholder="Review text..."
              rows={3}
              maxLength={500}
              className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 text-gray-900 rounded-xl px-4 py-2.5 text-sm outline-none transition resize-none"
            />
          </div>
        </div>

        {error && <p className="text-rose-600 text-xs mb-3 font-semibold">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl text-sm transition hover:bg-gray-50"
          >Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition shadow-sm"
          >{loading ? "Adding..." : "Publish Review"}</button>
        </div>
      </div>
    </div>
  );
}

/* ── ADMIN Rating Dashboard ── */
export function AdminRatingDashboard() {
  const [stats,        setStats]        = useState(null);
  const [allData,      setAllData]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [tab,          setTab]          = useState("overview");
  const [filter,       setFilter]       = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search,       setSearch]       = useState("");
  const [deleting,     setDeleting]     = useState(null);
  const [toggling,     setToggling]     = useState(null);
  const [blocking,     setBlocking]     = useState(null);
  const [selected,     setSelected]     = useState(null);
  const [showAdd,      setShowAdd]      = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch(API.getStats,      authFetchOpts()).then(r => r.json()).catch(() => MOCK_STATS),
      fetch(API.getAllRatings, authFetchOpts()).then(r => r.json()).catch(() => MOCK_ALL),
    ]).then(([s, a]) => {
      setStats(s.totalRatings !== undefined ? s : MOCK_STATS);
      setAllData(a.total !== undefined ? a : MOCK_ALL);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this rating permanently?")) return;
    setDeleting(id);
    try {
      await fetch(API.deleteRating(id), { method: "DELETE", credentials: "include" });
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
      const res = await fetch(API.toggleVisibility(id), { method: "PATCH", credentials: "include" });
      const d   = await res.json();
      setAllData(prev => ({
        ...prev,
        ratings: prev.ratings.map(r => r._id === id ? { ...r, isVisible: d.rating?.isVisible ?? !r.isVisible } : r),
      }));
    } catch { alert("Failed"); }
    setToggling(null);
  };

  const handleBlockUser = async (userId, email) => {
    const actionText = `toggle review block status for user (${email})`;
    if (!window.confirm(`Are you sure you want to ${actionText}?`)) return;
    setBlocking(email);
    try {
      const targetId = userId || "by-email";
      const res = await fetch(API.blockUser(targetId), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.msg || "Failed to update block status");

      setAllData(prev => ({
        ...prev,
        ratings: prev.ratings.map(r =>
          (r.studentEmail === email || (userId && String(r.userId?._id) === String(userId)))
            ? { ...r, isUserBlocked: d.isReviewBlocked }
            : r
        ),
      }));
      alert(d.msg);
    } catch (err) {
      alert(err.message || "Failed to update block status");
    } finally {
      setBlocking(null);
    }
  };

  const handleCreated = () => {
    setShowAdd(false);
    loadData();
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm font-medium">Loading ratings...</p>
      </div>
    </div>
  );

  const ratings    = allData?.ratings || [];
  const summary    = allData?.summary || [];
  const typeColors = { event:"bg-indigo-100 text-indigo-700", course:"bg-violet-100 text-violet-700", mentor:"bg-emerald-100 text-emerald-700", internship:"bg-amber-100 text-amber-700" };
  const starColors = ["","bg-rose-500","bg-amber-500","bg-yellow-500","bg-emerald-400","bg-emerald-600"];

  const filteredRatings = ratings.filter(r => {
    const matchType   = filter === "all" || r.targetType === filter;
    const matchSel    = !selected || r.targetName === selected;
    const q           = search.toLowerCase().trim();
    const matchSearch = !q
      || (r.studentName || "").toLowerCase().includes(q)
      || (r.targetName || "").toLowerCase().includes(q)
      || (r.studentEmail || "").toLowerCase().includes(q);
    const matchStatus = statusFilter === "all"
      ? true
      : statusFilter === "pending"
      ? !r.isVisible
      : statusFilter === "approved"
      ? r.isVisible
      : statusFilter === "blocked"
      ? r.isUserBlocked
      : true;

    return matchType && matchSel && matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 pb-16">

      {showAdd && (
        <AdminAddReviewModal
          knownTargets={summary}
          onClose={() => setShowAdd(false)}
          onCreated={handleCreated}
        />
      )}

      {/* ── HEADER ── */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 md:px-8 py-5 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Admin Dashboard</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">⭐ Ratings & Reviews Control</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Approve submitted reviews, delete inappropriate entries, and block abusive accounts</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {["overview","reviews"].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                    tab === t ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5"
            >
              <span>➕ Add Review</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8 space-y-6">

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label:"Total Ratings",  value: ratings.length,                                icon:"🌟", color:"text-amber-700",   bg:"bg-amber-50",   border:"border-amber-100" },
            { label:"Average Rating", value: `${stats?.avgRating || (ratings.length ? (ratings.reduce((a,b)=>a+b.rating,0)/ratings.length).toFixed(1) : 0)} / 5`, icon:"📊", color:"text-indigo-700",  bg:"bg-indigo-50",  border:"border-indigo-100" },
            { label:"Events Rated",   value: ratings.filter(r => r.targetType === "event").length,   icon:"📅", color:"text-violet-700",  bg:"bg-violet-50",  border:"border-violet-100" },
            { label:"Courses Rated",  value: ratings.filter(r => r.targetType === "course").length,  icon:"📚", color:"text-emerald-700", bg:"bg-emerald-50", border:"border-emerald-100" },
          ].map(({ label, value, icon, color, bg, border }) => (
            <div key={label} className={`rounded-2xl border ${border} ${bg} p-4 sm:p-5 transition hover:shadow-md`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl sm:text-3xl">{icon}</span>
                <span className={`text-2xl sm:text-3xl font-extrabold ${color}`}>{value}</span>
              </div>
              <p className={`text-xs sm:text-sm font-semibold ${color}`}>{label}</p>
            </div>
          ))}
        </div>

        {tab === "overview" && (
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Star Distribution */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-gray-900 font-bold text-base mb-1">Rating Distribution</h3>
              <p className="text-gray-400 text-xs mb-6">Across all active reviews</p>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="text-center px-4">
                  <p className="text-5xl font-black text-amber-500">{stats?.avgRating}</p>
                  <div className="my-1 flex justify-center">
                    <Stars value={Math.round(stats?.avgRating || 0)} size="text-xl" />
                  </div>
                  <p className="text-gray-400 text-xs font-medium">{stats?.totalRatings} total reviews</p>
                </div>
                <div className="flex-1 w-full space-y-2.5">
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

            {/* Ratings By Category */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-gray-900 font-bold text-base mb-1">Ratings by Category</h3>
              <p className="text-gray-400 text-xs mb-6">Breakdown across modules</p>
              <div className="space-y-3">
                {Object.entries(stats?.byType || {}).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className={`text-xs px-3 py-1 rounded-full font-bold capitalize ${typeColors[type] || "bg-gray-100 text-gray-700"}`}>
                      {type}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-28 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width:`${(count/(stats?.totalRatings||1))*100}%` }} />
                      </div>
                      <span className="text-gray-900 font-extrabold text-sm w-6 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Per Event / Course Summary */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-gray-900 font-bold text-base">Entity Breakdown</h3>
                  <p className="text-gray-400 text-xs">Click a card to filter detailed reviews</p>
                </div>
                {selected && (
                  <button onClick={() => setSelected(null)} className="text-xs text-indigo-600 hover:underline font-semibold">
                    Clear Filter
                  </button>
                )}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {summary.map(item => (
                  <button
                    key={`${item.targetType}-${item.targetName}`}
                    onClick={() => { setSelected(s => s === item.targetName ? null : item.targetName); setTab("reviews"); }}
                    className={`text-left p-4 rounded-2xl border transition ${
                      selected === item.targetName ? "border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-100" : "border-gray-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0 pr-2">
                        <p className="text-gray-900 font-bold text-xs truncate">{item.targetName}</p>
                        <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full capitalize font-semibold ${typeColors[item.targetType] || "bg-gray-100 text-gray-700"}`}>
                          {item.targetType}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-amber-500 font-black text-lg">{item.avgRating}</p>
                      </div>
                    </div>
                    <p className="text-gray-400 text-[11px] font-medium mt-2">{item.totalRatings} total reviews</p>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {tab === "reviews" && (
          <div className="space-y-4">
            {/* Filters bar */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search student, email, or course..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition bg-slate-50/50"
                />
                {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">✕</button>}
              </div>

              <div className="flex gap-2 flex-wrap">
                {/* Approval Status Filters */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  {[
                    { id: "all", label: "All Status" },
                    { id: "pending", label: "⏳ Pending (Hidden)" },
                    { id: "approved", label: "✅ Live" },
                    { id: "blocked", label: "🚫 Blocked Users" },
                  ].map(sf => (
                    <button
                      key={sf.id}
                      onClick={() => setStatusFilter(sf.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        statusFilter === sf.id ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      {sf.label}
                    </button>
                  ))}
                </div>

                {/* Module Type Filters */}
                <div className="flex gap-1.5 overflow-x-auto">
                  {["all", ...TARGET_TYPES].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                      className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold capitalize border transition ${
                        filter === f ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900 text-sm sm:text-base">
                  Reviews Control List <span className="text-gray-400 font-normal text-xs ml-1">({filteredRatings.length})</span>
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[850px]">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                      {["#","Student","Target","Rating","Review","Date","Status","Actions"].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-gray-400 font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredRatings.map((r, i) => (
                      <tr key={r._id} className={`hover:bg-indigo-50/30 transition-colors ${!r.isVisible ? "bg-amber-50/30" : ""}`}>
                        <td className="px-5 py-4 text-gray-400 text-xs">{i+1}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <p className="text-gray-900 font-semibold">{r.studentName}</p>
                            {r.isUserBlocked && (
                              <span className="text-[10px] font-extrabold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                                🚫 Blocked
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-xs">{r.studentEmail || "—"}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-gray-900 font-semibold text-xs">{r.targetName}</p>
                          <span className={`inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded-full capitalize font-semibold ${typeColors[r.targetType] || "bg-gray-100 text-gray-700"}`}>
                            {r.targetType}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <Stars value={r.rating} size="text-sm" />
                          <p className="text-gray-400 text-[11px] font-bold mt-0.5">{r.rating} / 5</p>
                        </td>
                        <td className="px-5 py-4 max-w-xs">
                          <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">{r.review || <span className="text-gray-400 italic">No text provided</span>}</p>
                        </td>
                        <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">{formatDate(r.createdAt)}</td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          {r.isVisible ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              ✅ Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                              ⏳ Pending Admin
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {/* Toggle Approval (Visible/Hide) */}
                            <button
                              onClick={() => handleToggle(r._id)}
                              disabled={toggling === r._id}
                              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition border shadow-sm ${
                                r.isVisible
                                  ? "bg-slate-100 text-gray-600 border-gray-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200"
                                  : "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
                              }`}
                            >
                              {toggling === r._id ? "..." : r.isVisible ? "Hide" : "Approve ✓"}
                            </button>

                            {/* Block / Unblock User */}
                            <button
                              onClick={() => handleBlockUser(r.userId?._id, r.studentEmail)}
                              disabled={blocking === r.studentEmail}
                              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition border shadow-sm ${
                                r.isUserBlocked
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                  : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                              }`}
                            >
                              {blocking === r.studentEmail ? "..." : r.isUserBlocked ? "Unblock User" : "Block User"}
                            </button>

                            {/* Delete Review */}
                            <button
                              onClick={() => handleDelete(r._id)}
                              disabled={deleting === r._id}
                              className="text-xs bg-gray-100 hover:bg-rose-100 text-rose-600 border border-gray-200 px-3 py-1.5 rounded-xl transition font-semibold disabled:opacity-50"
                            >
                              {deleting === r._id ? "..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredRatings.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-5xl mb-3">⭐</p>
                  <p className="font-semibold text-gray-700 text-sm">No reviews found matching filters</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function RatingPage() {
  return <AdminRatingDashboard />;
}