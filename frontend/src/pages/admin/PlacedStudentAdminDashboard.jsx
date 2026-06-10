// pages/admin/PlacedStudentAdminDashboard.jsx
// API routes from placedStudentRoute.js:
//   POST   /addPlacedStudent           (multipart — profileImage, logoImage)
//   GET    /allPlacedStudent
//   DELETE /deletePlacedStudent/:id
//   GET    /getPlacedStudentById/:id

import { useState, useEffect, useCallback, useRef } from "react";

const BASE       = `${import.meta.env.VITE_API_URL}/PlacedStudent`;
const getToken   = () => localStorage.getItem("token");
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const colors = { success: "bg-emerald-500", error: "bg-red-500", info: "bg-blue-500" };
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-white text-sm font-semibold ${colors[type] || colors.info}`}>
      <span>{type === "success" ? "✓" : "✕"}</span> {message}
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100 text-xs">✕</button>
    </div>
  );
}

function Spinner() {
  return <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block shrink-0" />;
}

// ── Reusable form field ───────────────────────────────────────────────────────
function FormField({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        name={name} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm text-gray-800 transition"
      />
    </div>
  );
}

// ── Image Upload Box ──────────────────────────────────────────────────────────
// Self-contained: own ref + own preview state — no shared preview bug
function ImageUploadBox({ label, required = false, onFileSelect, hint }) {
  const fileRef = useRef();
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setPreview(URL.createObjectURL(f));
    onFileSelect(f);   // lift selected file up to parent
  };

  return (
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </p>
      <div
        onClick={() => fileRef.current.click()}
        className="flex flex-col items-center justify-center gap-3 h-36 rounded-2xl border-2 border-dashed border-gray-200 hover:border-emerald-400 bg-gray-50 cursor-pointer transition overflow-hidden relative"
      >
        {preview ? (
          <>
            <img src={preview} alt="preview" className="absolute inset-0 w-full h-full object-cover opacity-80" />
            <span className="relative z-10 bg-black/50 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
              Change {label}
            </span>
          </>
        ) : (
          <>
            <span className="text-3xl">📸</span>
            <p className="text-xs text-gray-400">{hint || `Click to upload ${label}`}</p>
          </>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
    </div>
  );
}

// ── Add Student Modal ─────────────────────────────────────────────────────────
function AddStudentModal({ onClose, onAdded, showToast }) {
  const [form,        setForm]        = useState({ name: "", course: "", company: "", package: "" });
  const [profileFile, setProfileFile] = useState(null);   // → field: profileImage
  const [logoFile,    setLogoFile]    = useState(null);   // → field: logoImage
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim())   return setError("Student name is required.");
    if (!form.course.trim()) return setError("Course is required.");
    if (!profileFile)        return setError("Profile photo is required.");

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name",         form.name);
      fd.append("course",       form.course);
      fd.append("company",      form.company);
      fd.append("package",      form.package);
      fd.append("profileImage", profileFile);           // required in model
      if (logoFile) fd.append("logoImage", logoFile);  // optional in model

      const res  = await fetch(`${BASE}/addPlacedStudent`, { method: "POST", headers: authHeader(), body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.msg || "Failed to add student");
      showToast("Student added successfully 🎉", "success");
      onAdded();
      onClose();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Add Placed Student</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">

          {/* Each box is fully isolated — changing one preview won't affect the other */}
          <ImageUploadBox
            label="Profile Photo"
            required
            onFileSelect={setProfileFile}
            hint="Click to upload student photo"
          />
          <ImageUploadBox
            label="Company Logo"
            onFileSelect={setLogoFile}
            hint="Click to upload company logo (optional)"
          />

          <FormField label="Student Name *" name="name"     value={form.name}     onChange={handleChange} placeholder="e.g. Priya Sharma" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Course *" name="course"  value={form.course}  onChange={handleChange} placeholder="e.g. MERN Stack" />
            <FormField label="Company"  name="company" value={form.company} onChange={handleChange} placeholder="e.g. Google" />
          </div>
          <FormField label="Package (LPA)" name="package" value={form.package} onChange={handleChange} placeholder="e.g. 12 LPA" />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-bold transition flex items-center justify-center gap-2">
              {loading && <Spinner />} {loading ? "Adding..." : "Add Student 🎉"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Student Card ──────────────────────────────────────────────────────────────
function StudentCard({ student, onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group">
      <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
      <div className="p-5">
        <div className="flex items-center gap-4 mb-3">
          <img
            src={student.profileImage}
            alt={student.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-gray-100 shrink-0"
            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=059669&color=fff&bold=true`; }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate">{student.name}</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5 truncate">{student.course}</p>
          </div>
          <span className="text-xl shrink-0">🏆</span>
        </div>

        <div className="space-y-2 mb-4">
          {/* Company row: show logoImage if available, otherwise emoji fallback */}
          {student.company && (
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
              {student.logoImage ? (
                <img
                  src={student.logoImage}
                  alt={`${student.company} logo`}
                  className="w-5 h-5 rounded object-contain shrink-0"
                  onError={e => { e.target.style.display = "none"; }}
                />
              ) : (
                <span className="text-sm shrink-0">🏢</span>
              )}
              <span className="text-sm font-semibold text-gray-800 truncate">{student.company}</span>
            </div>
          )}
          {student.package && (
            <div className="flex items-center gap-2 bg-emerald-50 rounded-xl px-3 py-2 border border-emerald-100">
              <span className="text-sm">💰</span>
              <span className="text-sm font-black text-emerald-600">{student.package}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => onDelete(student)}
          className="w-full py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold transition opacity-0 group-hover:opacity-100"
        >
          🗑️ Remove
        </button>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function PlacedStudentAdminDashboard() {
  const [students,      setStudents]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [showAddModal,  setShowAddModal]  = useState(false);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast,         setToast]         = useState(null);
  const [search,        setSearch]        = useState("");
  const [filterCourse,  setFilterCourse]  = useState("All");

  // Find by ID
  const [findId,       setFindId]       = useState("");
  const [foundStudent, setFoundStudent] = useState(null);
  const [findLoading,  setFindLoading]  = useState(false);
  const [findError,    setFindError]    = useState("");

  const showToast = useCallback((message, type = "success") => setToast({ message, type }), []);

  // ── GET /allPlacedStudent ──
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/allPlacedStudent`, { headers: authHeader() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.msg);
      setStudents(json.placedStudents || []);
    } catch (err) { showToast(err.message || "Failed to load", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  // ── DELETE /deletePlacedStudent/:id ──
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res  = await fetch(`${BASE}/deletePlacedStudent/${deleteTarget._id}`, { method: "DELETE", headers: authHeader() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.msg);
      showToast("Student removed successfully");
      fetchStudents();
    } catch (err) { showToast(err.message, "error"); }
    finally { setDeleteLoading(false); setDeleteTarget(null); }
  };

  // ── GET /getPlacedStudentById/:id ──
  const handleFindById = async (e) => {
    e.preventDefault();
    if (!findId.trim()) return;
    setFindError(""); setFoundStudent(null); setFindLoading(true);
    try {
      const res  = await fetch(`${BASE}/getPlacedStudentById/${findId.trim()}`, { headers: authHeader() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.msg || "Not found");
      setFoundStudent(json.placedStudent);
    } catch (err) { setFindError(err.message); }
    finally { setFindLoading(false); }
  };

  // Derived data
  const uniqueCourses = ["All", ...new Set(students.map(s => s.course).filter(Boolean))];
  const filtered = students.filter(s => {
    const matchSearch = `${s.name} ${s.company} ${s.course}`.toLowerCase().includes(search.toLowerCase());
    const matchCourse = filterCourse === "All" || s.course === filterCourse;
    return matchSearch && matchCourse;
  });
  const topPackage = students.reduce((max, s) => Math.max(max, parseFloat(s.package) || 0), 0);
  const companies  = new Set(students.map(s => s.company).filter(Boolean)).size;

  return (
    <>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {showAddModal && (
        <AddStudentModal onClose={() => setShowAddModal(false)} onAdded={fetchStudents} showToast={showToast} />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🗑️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Remove Student?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Remove <strong>{deleteTarget.name}</strong> from placed students list?
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleteLoading}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-semibold transition flex items-center justify-center gap-2">
                  {deleteLoading && <Spinner />} Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Placements</h1>
            <p className="text-gray-400 text-sm mt-0.5">{students.length} placed students</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchStudents}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition">
              ↻ Refresh
            </button>
            <button onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
              + Add Student
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Placed", value: students.length  },
            { label: "Companies",    value: companies         },
            { label: "Top Package",  value: topPackage ? `${topPackage} LPA` : "—" },
            { label: "Courses",      value: uniqueCourses.length - 1 },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Find by ID */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">🔎 Find Student by ID</h2>
          <form onSubmit={handleFindById} className="flex gap-3 flex-wrap">
            <input
              value={findId}
              onChange={e => { setFindId(e.target.value); setFoundStudent(null); setFindError(""); }}
              placeholder="Paste student ObjectId..."
              className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm text-gray-700 transition"
            />
            <button type="submit" disabled={findLoading || !findId.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold transition flex items-center gap-2">
              {findLoading ? <Spinner /> : "Search"}
            </button>
            {findId && (
              <button type="button" onClick={() => { setFindId(""); setFoundStudent(null); setFindError(""); }}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition">
                Clear
              </button>
            )}
          </form>

          {findError && (
            <div className="mt-3 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{findError}</div>
          )}

          {foundStudent && (
            <div className="mt-4 flex items-center gap-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
              <img
                src={foundStudent.profileImage} alt={foundStudent.name}
                className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-200 shrink-0"
                onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(foundStudent.name)}&background=10b981&color=fff`; }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900">{foundStudent.name}</p>
                <p className="text-xs text-emerald-600 font-semibold">{foundStudent.course}</p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  {foundStudent.company && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      {foundStudent.logoImage && (
                        <img src={foundStudent.logoImage} alt="" className="w-4 h-4 object-contain rounded" onError={e => { e.target.style.display = "none"; }} />
                      )}
                      🏢 {foundStudent.company}
                    </span>
                  )}
                  {foundStudent.package && <span className="text-xs text-emerald-600 font-bold">💰 {foundStudent.package}</span>}
                </div>
              </div>
              <button onClick={() => setDeleteTarget(foundStudent)}
                className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition border border-red-100 shrink-0">
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, company, course..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm text-gray-700 transition"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs transition">✕</button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {uniqueCourses.map(c => (
              <button key={c} onClick={() => setFilterCourse(c)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                  filterCourse === c
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "border-gray-200 text-gray-500 hover:border-emerald-300 bg-white"
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="flex gap-3 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-10 bg-gray-100 rounded-xl mb-2" />
                <div className="h-10 bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-5xl mb-4">{search ? "🔍" : "🏅"}</p>
            <p className="text-lg font-bold text-gray-700">{search ? "No matches found" : "No placed students yet"}</p>
            <p className="text-sm text-gray-400 mt-1">
              {search ? `No student matches "${search}"` : "Click 'Add Student' to add your first placement!"}
            </p>
            {!search && filterCourse === "All" && (
              <button onClick={() => setShowAddModal(true)}
                className="mt-5 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition">
                + Add First Student
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((student) => (
              <StudentCard key={student._id} student={student} onDelete={setDeleteTarget} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
