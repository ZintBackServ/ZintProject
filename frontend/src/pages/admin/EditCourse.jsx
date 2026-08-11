// pages/admin/EditCourse.jsx
import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiImage, FiFileText, FiX, FiCheck, FiAlertCircle,
  FiLoader, FiChevronDown, FiArrowLeft,
} from "react-icons/fi";
import { PiCertificate } from "react-icons/pi";

const API = import.meta.env.VITE_API_URL;
const MB  = 1024 * 1024;

function validateImage(file) {
  if (!file) return null;
  if (!file.type.startsWith("image/")) return "Only image files are allowed.";
  if (file.size > 5 * MB) return "Image must be under 5 MB.";
  return null;
}
function validatePDF(file) {
  if (!file) return null;
  if (file.type !== "application/pdf") return "Only PDF files are allowed.";
  if (file.size > 20 * MB) return "PDF must be under 20 MB.";
  return null;
}

/* ── shared style helpers ── */
const inputCls   = "w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-200 outline-none";
const inputStyle = (focused) => ({
  borderColor: focused ? "#B026B5" : "#e5e7eb",
  boxShadow:   focused ? "0 0 0 3px rgba(176,38,181,0.09)" : "none",
  background: "#fff", color: "#111827",
});

function Field({ label, required, children, error }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
        {label}{required && <span style={{ color: "#ef4444" }}> *</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 mt-1 text-xs" style={{ color: "#ef4444" }}>
          <FiAlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

function TextInput({ name, value, onChange, placeholder, required, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <input type={type} name={name} value={value ?? ""} onChange={onChange}
      placeholder={placeholder} required={required}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      className={inputCls} style={inputStyle(focused)} />
  );
}

function SelectInput({ name, value, onChange, required, children }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <select name={name} value={value ?? ""} onChange={onChange} required={required}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className={inputCls + " appearance-none pr-9"} style={inputStyle(focused)}>
        {children}
      </select>
      <FiChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
        style={{ color: "#9ca3af" }} />
    </div>
  );
}

function TextArea({ name, value, onChange, placeholder, required, rows = 4 }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea name={name} value={value ?? ""} onChange={onChange} placeholder={placeholder}
      required={required} rows={rows}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      className={inputCls + " resize-none"} style={inputStyle(focused)} />
  );
}

function Section({ title, color = "#B026B5", children }) {
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#f0f0f0" }}>
      <div className="px-5 py-3 flex items-center gap-2"
        style={{ background: `${color}09`, borderBottom: `1px solid ${color}22` }}>
        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{title}</p>
      </div>
      <div className="px-5 py-5 flex flex-col gap-4" style={{ background: "#fff" }}>
        {children}
      </div>
    </div>
  );
}

/* ── image / PDF drop zone ── */
function DropZone({ label, hint, accept, icon, accentColor, preview, previewType, fileName, existingUrl, error, onChange, onClear }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onChange({ target: { files: [file] } });
  }, [onChange]);

  const hasContent = preview || fileName || existingUrl;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold" style={{ color: "#374151" }}>{label}</label>
        {hint && <span className="text-xs" style={{ color: "#9ca3af" }}>{hint}</span>}
      </div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className="relative rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden"
        style={{
          borderColor: error ? "#ef4444" : dragging ? accentColor : hasContent ? accentColor : "#d1d5db",
          background:  dragging ? `${accentColor}08` : "#fafafa",
          minHeight:   "110px",
        }}
      >
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={onChange} />

        {previewType === "image" && preview ? (
          /* New local preview */
          <div className="relative group">
            <img src={preview} alt="preview" className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-semibold">Click to replace</span>
            </div>
            <div className="absolute top-0 left-0 right-0 h-1"
              style={{ background: `linear-gradient(90deg, ${accentColor}, #38BDF8)` }} />
          </div>
        ) : previewType === "image" && existingUrl && !preview ? (
          /* Existing Cloudinary image */
          <div className="relative group">
            <img src={existingUrl} alt="current" className="w-full h-48 object-cover"
              onError={e => { e.target.style.display = "none"; }} />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-semibold">Click to replace</span>
            </div>
            <div className="absolute top-0 left-0 right-0 h-1 opacity-50"
              style={{ background: `linear-gradient(90deg, ${accentColor}, #38BDF8)` }} />
          </div>
        ) : previewType === "pdf" && (fileName || existingUrl) ? (
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${accentColor}15` }}>
              <FiFileText size={20} style={{ color: accentColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "#111827" }}>
                {fileName || "Existing PDF"}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#22C55E" }}>
                {fileName ? "✓ New PDF ready to upload" : "✓ Existing PDF (click to replace)"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-7 gap-2 px-4 text-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: `${accentColor}12` }}>
              {icon}
            </div>
            <p className="text-sm font-medium" style={{ color: "#6b7280" }}>
              Drag & drop or <span style={{ color: accentColor }}>browse</span>
            </p>
            <p className="text-xs" style={{ color: "#9ca3af" }}>{hint}</p>
          </div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1 mt-1.5 text-xs" style={{ color: "#ef4444" }}>
          <FiAlertCircle size={12} /> {error}
        </p>
      )}
      {(preview || fileName) && (
        <button type="button" onClick={e => { e.stopPropagation(); onClear(); }}
          className="mt-1.5 text-xs flex items-center gap-1 transition-colors"
          style={{ color: "#9ca3af" }}
          onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
          onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}>
          <FiX size={11} /> Remove new file (revert to existing)
        </button>
      )}
    </div>
  );
}

/* ════════════════════════════════════════ MAIN COMPONENT ═══ */
export default function EditCourse() {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const [pageLoading, setPageLoading] = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  /* ── categories ── */
  const [categories,  setCategories]  = useState([]);
  const [catLoading,  setCatLoading]  = useState(true);

  /* ── form state ── */
  const [formData, setFormData] = useState({
    courseName: "", duration: "", fee: "", online_fee: "", about: "",
    category: "", trending: "false", language: "Hinglish (English + Hindi)",
    mode: "", startDate: "",
  });

  /* ── existing asset URLs (from DB) ── */
  const [existingImage, setExistingImage]     = useState("");
  const [existingCert,  setExistingCert]      = useState("");
  const [existingPDF,   setExistingPDF]       = useState("");

  /* ── new file picks (only sent if admin replaces) ── */
  const [imageFile,      setImageFile]      = useState(null);
  const [imagePreview,   setImagePreview]   = useState(null);
  const [certFile,       setCertFile]       = useState(null);
  const [certPreview,    setCertPreview]    = useState(null);
  const [curriculumFile, setCurriculumFile] = useState(null);
  const [curriculumName, setCurriculumName] = useState("");

  /* ── 1. fetch categories ── */
  useEffect(() => {
    (async () => {
      setCatLoading(true);
      try {
        const res  = await fetch(`${API}/category/getAllCategories`, { credentials: "include" });
        const data = await res.json();
        setCategories(data.categories || []);
      } catch {
        // ignore
      } finally {
        setCatLoading(false);
      }
    })();
  }, []);

  /* ── 2. fetch existing course ── */
  useEffect(() => {
    if (!id) return;
    setPageLoading(true);
    (async () => {
      try {
        const res  = await fetch(`${API}/course/getCourseById/${id}`, { credentials: "include" });
        const data = await res.json();
        if (!res.ok) { setError(data.msg || "Course not found."); return; }

        const c = data.course;

        const categoryId =
          typeof c.category === "object" && c.category !== null
            ? String(c.category._id)
            : String(c.category || "");

        setFormData({
          courseName: c.courseName  || "",
          duration:   c.duration    || "",
          fee:        c.fee         != null ? String(c.fee)        : "",
          online_fee: c.online_fee  != null ? String(c.online_fee) : "",
          about:      c.about       || "",
          category:   categoryId,
          trending:   c.trending    === true ? "true" : "false",
          language:   c.language    || "Hinglish (English + Hindi)",
          mode:       c.mode        || "",
          startDate:  c.startDate   ? c.startDate.substring(0, 10) : "",
        });

        setExistingImage(c.courseImage        || "");
        setExistingCert (c.courseCertificate  || "");
        setExistingPDF  (c.courseCurriculum   || "");
      } catch {
        setError("Network error. Could not load course.");
      } finally {
        setPageLoading(false);
      }
    })();
  }, [id]);

  /* ── handlers ── */
  const handleChange = e =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = e => {
    const file = e.target.files?.[0]; if (!file) return;
    const err  = validateImage(file);
    if (err) { setFieldErrors(p => ({ ...p, image: err })); return; }
    setFieldErrors(p => ({ ...p, image: "" }));
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file); setImagePreview(URL.createObjectURL(file));
  };
  const handleCertChange = e => {
    const file = e.target.files?.[0]; if (!file) return;
    const err  = validateImage(file);
    if (err) { setFieldErrors(p => ({ ...p, cert: err })); return; }
    setFieldErrors(p => ({ ...p, cert: "" }));
    if (certPreview) URL.revokeObjectURL(certPreview);
    setCertFile(file); setCertPreview(URL.createObjectURL(file));
  };
  const handleCurriculumChange = e => {
    const file = e.target.files?.[0]; if (!file) return;
    const err  = validatePDF(file);
    if (err) { setFieldErrors(p => ({ ...p, curriculum: err })); return; }
    setFieldErrors(p => ({ ...p, curriculum: "" }));
    setCurriculumFile(file); setCurriculumName(file.name);
  };

  const clearImage      = () => { if (imagePreview) URL.revokeObjectURL(imagePreview); setImageFile(null); setImagePreview(null); };
  const clearCert       = () => { if (certPreview)  URL.revokeObjectURL(certPreview);  setCertFile(null);  setCertPreview(null);  };
  const clearCurriculum = () => { setCurriculumFile(null); setCurriculumName(""); };

  /* ── submit ── */
  const handleSubmit = async e => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!formData.courseName.trim()) { setError("Course name is required."); return; }
    if (!formData.mode)              { setError("Please select a mode.");     return; }
    if (!formData.category)          { setError("Please select a category."); return; }

    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => { if (v !== "") fd.append(k, v); });

      if (imageFile)      fd.append("courseImage",        imageFile);
      if (certFile)       fd.append("courseCertificate",  certFile);
      if (curriculumFile) fd.append("courseCurriculum",   curriculumFile);

      const res    = await fetch(`${API}/course/updateCourse/${id}`, {
        method:      "PUT",
        credentials: "include",
        body:        fd,
      });
      const result = await res.json();

      if (!res.ok) {
        setError(Array.isArray(result.msg) ? result.msg.join(", ") : result.msg || "Update failed.");
        window.scrollTo({ top: 0, behavior: "smooth" }); return;
      }

      setSuccess("Course updated successfully! Redirecting…");
      setTimeout(() => navigate("/admin/dashboard/ShowAllCourse"), 1800);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading course…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#F8FAFC" }}>
      <div className="max-w-2xl mx-auto">

        <button
          type="button"
          onClick={() => navigate("/admin/dashboard/ShowAllCourse")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition mb-5 font-medium"
        >
          <FiArrowLeft size={15} /> Back to All Courses
        </button>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3 border"
            style={{ background: "rgba(176,38,181,0.07)", color: "#B026B5", borderColor: "rgba(176,38,181,0.2)" }}>
            ✏️ Admin Panel
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "#111827" }}>Edit Course</h1>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>Update course details. Leave file fields unchanged to keep existing media.</p>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border px-4 py-3.5 mb-5 text-sm"
            style={{ background: "#fef2f2", borderColor: "#fecaca", color: "#dc2626" }}>
            <FiAlertCircle size={16} className="flex-shrink-0 mt-0.5" /><span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-start gap-3 rounded-xl border px-4 py-3.5 mb-5 text-sm"
            style={{ background: "#f0fdf4", borderColor: "#bbf7d0", color: "#16a34a" }}>
            <FiCheck size={16} className="flex-shrink-0 mt-0.5" /><span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Media */}
          <Section title="Media & Files" color="#B026B5">
            <DropZone
              label={<>Course Thumbnail <span style={{ color: "#ef4444" }}>*</span></>}
              hint="JPG / PNG / WEBP · Max 5 MB — leave blank to keep existing"
              accept="image/*" accentColor="#B026B5"
              previewType="image" preview={imagePreview} existingUrl={existingImage}
              error={fieldErrors.image}
              icon={<FiImage size={18} style={{ color: "#B026B5" }} />}
              onChange={handleImageChange} onClear={clearImage}
            />
            <DropZone
              label="Course Certificate Image"
              hint="Optional · JPG / PNG · Max 5 MB — leave blank to keep existing"
              accept="image/*" accentColor="#38BDF8"
              previewType="image" preview={certPreview} existingUrl={existingCert}
              error={fieldErrors.cert}
              icon={<PiCertificate size={20} style={{ color: "#38BDF8" }} />}
              onChange={handleCertChange} onClear={clearCert}
            />
            <DropZone
              label="Course Curriculum PDF"
              hint="Optional · PDF only · Max 20 MB — leave blank to keep existing"
              accept="application/pdf" accentColor="#22C55E"
              previewType="pdf" fileName={curriculumName} existingUrl={existingPDF}
              error={fieldErrors.curriculum}
              icon={<FiFileText size={18} style={{ color: "#22C55E" }} />}
              onChange={handleCurriculumChange} onClear={clearCurriculum}
            />
          </Section>

          {/* Course Details */}
          <Section title="Course Details" color="#38BDF8">
            <Field label="Course Name" required>
              <TextInput name="courseName" value={formData.courseName} onChange={handleChange}
                placeholder="e.g. MERN Stack Development" required />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Duration">
                <TextInput name="duration" value={formData.duration} onChange={handleChange}
                  placeholder="e.g. 6 months" />
              </Field>
              <Field label="Mode" required>
                <SelectInput name="mode" value={formData.mode} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Hybrid">Online/Offline</option>
                </SelectInput>
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Offline Fee (₹)">
                <TextInput name="fee" value={formData.fee} onChange={handleChange}
                  type="number" placeholder="e.g. 5999" />
              </Field>
              <Field label="Online Fee (₹)">
                <TextInput name="online_fee" value={formData.online_fee} onChange={handleChange}
                  type="number" placeholder="e.g. 5999" />
              </Field>
            </div>
            <Field label="About">
              <TextArea name="about" value={formData.about} onChange={handleChange}
                placeholder="Describe the course…" rows={5} />
            </Field>
          </Section>

          {/* Classification */}
          <Section title="Classification" color="#B026B5">
            <Field label="Category" required>
              {catLoading ? (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm"
                  style={{ borderColor: "#e5e7eb", color: "#9ca3af", background: "#f9fafb" }}>
                  <FiLoader size={13} className="animate-spin" /> Loading categories…
                </div>
              ) : (
                <SelectInput name="category" value={formData.category} onChange={handleChange} required>
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                  ))}
                </SelectInput>
              )}
              <button type="button"
                onClick={() => navigate("/admin/dashboard/AddCategory")}
                className="mt-1.5 text-xs flex items-center gap-1"
                style={{ color: "#B026B5" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                + Add new category
              </button>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Trending">
                <SelectInput name="trending" value={formData.trending} onChange={handleChange}>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </SelectInput>
              </Field>
              <Field label="Start Date">
                <TextInput name="startDate" value={formData.startDate} onChange={handleChange} type="date" />
              </Field>
              <Field label="Language">
                <TextInput name="language" value={formData.language} onChange={handleChange}
                  placeholder="e.g. Hinglish (English + Hindi)" />
              </Field>
            </div>
          </Section>

          {/* Actions */}
          <div className="flex gap-3">
            <button type="button"
              onClick={() => navigate("/admin/dashboard/ShowAllCourse")}
              className="flex-1 font-bold py-4 rounded-xl text-sm transition-all duration-200 border"
              style={{ color: "#374151", borderColor: "#e5e7eb", background: "#fff" }}>
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-[2] font-bold py-4 rounded-xl text-sm text-white transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                background: saving ? "#d1a3d3" : "#B026B5",
                boxShadow:  saving ? "none" : "0 8px 24px rgba(176,38,181,0.30)",
              }}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.background = "#8f1e92"; }}
              onMouseLeave={e => { if (!saving) e.currentTarget.style.background = "#B026B5"; }}>
              {saving
                ? <><FiLoader size={15} className="animate-spin" /> Saving Changes…</>
                : "Save Changes →"}
            </button>
          </div>
          <p className="text-center text-xs pb-4" style={{ color: "#9ca3af" }}>
            New files are uploaded to Cloudinary · Existing files are kept if no replacement is provided
          </p>
        </form>
      </div>
    </div>
  );
}
