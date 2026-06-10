
import { useState, useEffect, useRef } from "react";

const BASE = `${import.meta.env.VITE_API_URL}/mentor`;

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = { success: "bg-emerald-500", error: "bg-red-500", info: "bg-blue-500" };

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-white text-sm font-medium ${colors[type]}`}>
      <span>{type === "success" ? "✓" : "✕"}</span>
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">✕</button>
    </div>
  );
}

// ── Confirm Delete Modal ─────────────────────────────────────────────────────
function ConfirmModal({ mentor, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🗑️</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Mentor?</h3>
          <p className="text-gray-500 text-sm mb-6">
            Are you sure you want to delete <strong>{mentor?.mentorName}</strong>? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={onCancel}  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition">Cancel</button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Add / Edit Modal ─────────────────────────────────────────────────────────
function MentorModal({ editData, onClose, onSaved }) {
  const isEdit = !!editData;
  const fileRef = useRef();

  const [form, setForm] = useState({
    mentorName: editData?.mentorName || "",
    expertise:  editData?.expertise  || "",
    experience: editData?.experience || "",
    bio:        editData?.bio        || "",
  });
  const [preview, setPreview] = useState(editData?.profileImage || null);
  const [file,    setFile]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.mentorName.trim()) return setError("Mentor name is required.");
    if (!form.expertise.trim())  return setError("Expertise is required.");
    if (!isEdit && !file)        return setError("Profile image is required.");

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("profileImage", file);

      // Routes: POST /addmentor | PUT /UpdateMentor/:id
      const url    = isEdit ? `${BASE}/UpdateMentor/${editData._id}` : `${BASE}/addmentor`;
      const method = isEdit ? "PUT" : "POST";

      const res  = await fetch(url, { method, body: fd });
      const json = await res.json();

      if (!res.ok) throw new Error(json.msg || "Request failed");
      onSaved(json.msg || (isEdit ? "Mentor updated!" : "Mentor added!"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{isEdit ? "Edit Mentor" : "Add New Mentor"}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{isEdit ? "Update mentor details" : "Fill in the details to add a mentor"}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">

          {/* Photo upload */}
          <div className="flex items-center gap-5">
            <div
              onClick={() => fileRef.current.click()}
              className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 hover:border-indigo-400 flex items-center justify-center cursor-pointer overflow-hidden transition bg-gray-50"
            >
              {preview
                ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                : <span className="text-3xl">📷</span>
              }
            </div>
            <div>
              <button type="button" onClick={() => fileRef.current.click()}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition">
                {preview ? "Change Photo" : "Upload Photo"}
              </button>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG — max 5 MB</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </div>

          {/* Fields */}
          <Field label="Mentor Name *" name="mentorName" value={form.mentorName} onChange={handleChange} placeholder="e.g. Ravi Kumar" />
          <Field label="Expertise *"   name="expertise"  value={form.expertise}  onChange={handleChange} placeholder="e.g. Data Science" />
          <Field label="Experience"    name="experience" value={form.experience} onChange={handleChange} placeholder="e.g. 5 years" />

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bio</label>
            <textarea
              name="bio" value={form.bio} onChange={handleChange} rows={3}
              placeholder="Short introduction about the mentor..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-gray-800 resize-none transition"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition text-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold transition text-sm flex items-center justify-center gap-2">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              {loading ? "Saving..." : isEdit ? "Update Mentor" : "Add Mentor"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// ── Mentor Card ──────────────────────────────────────────────────────────────
function MentorCard({ mentor, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group">
      <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 border-gray-100">
            {mentor.profileImage
              ? <img src={mentor.profileImage} alt={mentor.mentorName} className="w-full h-full object-cover" />
              : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  {mentor.mentorName?.charAt(0).toUpperCase()}
                </div>
              )
            }
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate">{mentor.mentorName}</h3>
            <p className="text-xs text-indigo-600 font-semibold mt-0.5 truncate">{mentor.expertise}</p>
            {mentor.experience && (
              <span className="inline-block mt-1.5 text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                🏆 {mentor.experience}
              </span>
            )}
          </div>
        </div>

        {mentor.bio && (
          <p className="text-xs text-gray-400 mt-3 leading-relaxed line-clamp-2">{mentor.bio}</p>
        )}

        <div className="flex gap-2 mt-4">
          <button onClick={() => onEdit(mentor)}
            className="flex-1 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-semibold transition flex items-center justify-center gap-1.5">
            ✏️ Edit
          </button>
          <button onClick={() => onDelete(mentor)}
            className="flex-1 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold transition flex items-center justify-center gap-1.5">
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function AddMentor() {
  const [mentors,      setMentors]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [showModal,    setShowModal]    = useState(false);
  const [editData,     setEditData]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast,        setToast]        = useState(null);

  // ── Fetch all mentors — GET /allMentor ──
  const fetchMentors = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/allMentor`);
      const json = await res.json();
      setMentors(json.mentors || []);
    } catch {
      showToast("Failed to load mentors", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMentors(); }, []);

  const showToast = (message, type = "success") => setToast({ message, type });

  // ── Delete — DELETE /deleteMentor/:id ──
  const handleDelete = async () => {
    try {
      const res  = await fetch(`${BASE}/deleteMentor/${deleteTarget._id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.msg);
      showToast("Mentor deleted successfully");
      fetchMentors();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSaved = (msg) => {
    setShowModal(false);
    setEditData(null);
    showToast(msg);
    fetchMentors();
  };

  const filtered = mentors.filter((m) =>
    m.mentorName?.toLowerCase().includes(search.toLowerCase()) ||
    m.expertise?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {toast        && <Toast {...toast} onClose={() => setToast(null)} />}
      {deleteTarget && <ConfirmModal mentor={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
      {showModal    && (
        <MentorModal
          editData={editData}
          onClose={() => { setShowModal(false); setEditData(null); }}
          onSaved={handleSaved}
        />
      )}

      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mentor Management</h1>
            <p className="text-gray-400 text-sm mt-0.5">{mentors.length} mentor{mentors.length !== 1 ? "s" : ""} total</p>
          </div>
          <button
            onClick={() => { setEditData(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
          >
            + Add Mentor
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total",      value: mentors.length },
            { label: "Showing",    value: filtered.length },
            { label: "With Bio",   value: mentors.filter(m => m.bio).length },
            { label: "With Photo", value: mentors.filter(m => m.profileImage).length },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or expertise..."
            className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-gray-700 w-full transition"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition text-xs">✕</button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="flex gap-3 mb-3">
                  <div className="w-14 h-14 rounded-xl bg-gray-100" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="flex-1 h-8 bg-gray-100 rounded-xl" />
                  <div className="flex-1 h-8 bg-gray-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-5xl mb-4">{search ? "🔍" : "👥"}</p>
            <p className="text-lg font-bold text-gray-700">{search ? "No results found" : "No mentors yet"}</p>
            <p className="text-sm text-gray-400 mt-1">
              {search ? `No mentor matches "${search}"` : "Click 'Add Mentor' to get started"}
            </p>
            {!search && (
              <button
                onClick={() => { setEditData(null); setShowModal(true); }}
                className="mt-5 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
              >
                + Add First Mentor
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((mentor) => (
              <MentorCard
                key={mentor._id}
                mentor={mentor}
                onEdit={(m)   => { setEditData(m); setShowModal(true); }}
                onDelete={(m) => setDeleteTarget(m)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ── Reusable input field ─────────────────────────────────────────────────────
function Field({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        name={name} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-gray-800 transition"
      />
    </div>
  );
}
