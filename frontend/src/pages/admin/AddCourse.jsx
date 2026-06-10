// pages/admin/AddCourse.jsx
import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUploadCloud, FiImage, FiFileText, FiAward,
  FiX, FiCheck, FiAlertCircle, FiLoader,
  FiChevronDown,
} from "react-icons/fi";
import { PiCertificate } from "react-icons/pi";

/* ═══════════════════════ ZINT ADMIN PALETTE ═══════════════════════
   Same brand system as the rest of the admin / course pages
   Purple  #B026B5 | Sky #38BDF8 | Green #22C55E | Dark #111827
════════════════════════════════════════════════════════════════════ */

/* ─── tiny helpers ─── */
const MB = 1024 * 1024;

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

/* ═══════════════════════════════════════════════
   DROP-ZONE COMPONENT
   Handles click-to-browse + drag-and-drop
═══════════════════════════════════════════════ */
function DropZone({ label, hint, accept, icon, accentColor, preview, previewType, fileName, error, onChange, onClear }) {
  const inputRef  = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onChange({ target: { files: [file] } });
  }, [onChange]);

  return (
    <div>
      {/* Label row */}
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold" style={{ color: "#374151" }}>{label}</label>
        {hint && <span className="text-xs" style={{ color: "#9ca3af" }}>{hint}</span>}
      </div>

      {/* Drop target */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className="relative rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden"
        style={{
          borderColor: error ? "#ef4444" : dragging ? accentColor : (preview || fileName) ? accentColor : "#d1d5db",
          background:  dragging ? `${accentColor}08` : "#fafafa",
          minHeight:   "110px",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onChange}
        />

        {/* ── Image preview ── */}
        {previewType === "image" && preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt="preview"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-semibold">Click to replace</span>
            </div>
            {/* Top gradient bar matching accent */}
            <div className="absolute top-0 left-0 right-0 h-1"
              style={{ background: `linear-gradient(90deg, ${accentColor}, #38BDF8)` }} />
          </div>
        ) : previewType === "pdf" && fileName ? (
          /* ── PDF preview ── */
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${accentColor}15` }}>
              <FiFileText size={20} style={{ color: accentColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "#111827" }}>{fileName}</p>
              <p className="text-xs mt-0.5" style={{ color: "#22C55E" }}>✓ PDF ready to upload</p>
            </div>
          </div>
        ) : (
          /* ── Empty state ── */
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

      {/* Error */}
      {error && (
        <p className="flex items-center gap-1 mt-1.5 text-xs" style={{ color: "#ef4444" }}>
          <FiAlertCircle size={12} /> {error}
        </p>
      )}

      {/* Clear button — only if file selected */}
      {(preview || fileName) && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClear(); }}
          className="mt-1.5 text-xs flex items-center gap-1 transition-colors"
          style={{ color: "#9ca3af" }}
          onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
          onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}
        >
          <FiX size={11} /> Remove file
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   FIELD COMPONENTS
═══════════════════════════════════════════════ */
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

const inputCls = "w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-200 outline-none";
const inputStyle = (focused) => ({
  borderColor: focused ? "#B026B5" : "#e5e7eb",
  boxShadow:   focused ? "0 0 0 3px rgba(176,38,181,0.09)" : "none",
  background:  "#fff",
  color: "#111827",
});

function TextInput({ name, value, onChange, placeholder, required, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={inputCls}
      style={inputStyle(focused)}
    />
  );
}

function SelectInput({ name, value, onChange, required, children }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={inputCls + " appearance-none pr-9"}
        style={inputStyle(focused)}
      >
        {children}
      </select>
      <FiChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
        style={{ color: "#9ca3af" }}
      />
    </div>
  );
}

function TextArea({ name, value, onChange, placeholder, required, rows = 4 }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={inputCls + " resize-none"}
      style={inputStyle(focused)}
    />
  );
}

/* ═══════════════════════════════════════════════
   SECTION DIVIDER
═══════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function AddCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    courseName:  "",
    duration:    "",
    fee:         "",
    about:       "",
    type:        "",
    category:    "",
    subCategory: "",
    trending:    "",
    language:    "",
    mode:        "",
    startDate:   "",
  });

  // ── File states ──
  const [imageFile,      setImageFile]      = useState(null);
  const [imagePreview,   setImagePreview]   = useState(null);

  const [certFile,       setCertFile]       = useState(null);
  const [certPreview,    setCertPreview]    = useState(null);

  const [curriculumFile, setCurriculumFile] = useState(null);
  const [curriculumName, setCurriculumName] = useState("");

  // ── Text field handler ──
  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // ── File handlers with validation ──
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateImage(file);
    if (err) { setFieldErrors(prev => ({ ...prev, image: err })); return; }
    setFieldErrors(prev => ({ ...prev, image: "" }));
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCertChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateImage(file);
    if (err) { setFieldErrors(prev => ({ ...prev, cert: err })); return; }
    setFieldErrors(prev => ({ ...prev, cert: "" }));
    if (certPreview) URL.revokeObjectURL(certPreview);
    setCertFile(file);
    setCertPreview(URL.createObjectURL(file));
  };

  const handleCurriculumChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validatePDF(file);
    if (err) { setFieldErrors(prev => ({ ...prev, curriculum: err })); return; }
    setFieldErrors(prev => ({ ...prev, curriculum: "" }));
    setCurriculumFile(file);
    setCurriculumName(file.name);
  };

  // ── Clear handlers ──
  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null); setImagePreview(null);
  };
  const clearCert = () => {
    if (certPreview) URL.revokeObjectURL(certPreview);
    setCertFile(null); setCertPreview(null);
  };
  const clearCurriculum = () => {
    setCurriculumFile(null); setCurriculumName("");
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Client-side guard: image is required
    if (!imageFile) {
      setFieldErrors(prev => ({ ...prev, image: "Course thumbnail is required." }));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);
    try {
      /**
       * FormData — field names MUST match multer's expected field names exactly:
       *   courseImage        → required
       *   courseCertificate  → optional
       *   courseCurriculum   → optional
       */
      const data = new FormData();

      // Text fields
      Object.entries(formData).forEach(([key, val]) => {
        if (val !== "") data.append(key, val);
      });

      // File fields — append only if a file was actually selected
      data.append("courseImage", imageFile);                          // required
      if (certFile)       data.append("courseCertificate", certFile);  // optional
      if (curriculumFile) data.append("courseCurriculum",  curriculumFile); // optional

      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/course/addCourse`, {
        method: "POST",
        headers: {
          // ✅ NEVER set Content-Type manually for FormData —
          //    the browser adds multipart/form-data + boundary automatically
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        setError(
          Array.isArray(result.msg)
            ? result.msg.join(", ")
            : result.msg || "Failed to add course. Please try again."
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      setSuccess("Course added successfully! Redirecting…");
      setTimeout(() => navigate("/admin/dashboard/ShowAllCourse"), 1800);

    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#F8FAFC" }}>
      <div className="max-w-2xl mx-auto">

        {/* ── Page header ── */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3 border"
            style={{ background: "rgba(176,38,181,0.07)", color: "#B026B5", borderColor: "rgba(176,38,181,0.2)" }}>
            ⚡ Admin Panel
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "#111827" }}>
            Add New Course
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
            Fill in the details below to publish a course on ZINT Institute.
          </p>
        </div>

        {/* ── Global alerts ── */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border px-4 py-3.5 mb-5 text-sm"
            style={{ background: "#fef2f2", borderColor: "#fecaca", color: "#dc2626" }}>
            <FiAlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-start gap-3 rounded-xl border px-4 py-3.5 mb-5 text-sm"
            style={{ background: "#f0fdf4", borderColor: "#bbf7d0", color: "#16a34a" }}>
            <FiCheck size={16} className="flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* ══ SECTION 1: Media Uploads ══ */}
          <Section title="Media & Files" color="#B026B5">

            {/* Course Thumbnail — REQUIRED */}
            <DropZone
              label={<>Course Thumbnail <span style={{ color: "#ef4444" }}>*</span></>}
              hint="JPG / PNG / WEBP · Max 5 MB"
              accept="image/*"
              accentColor="#B026B5"
              previewType="image"
              preview={imagePreview}
              error={fieldErrors.image}
              icon={<FiImage size={18} style={{ color: "#B026B5" }} />}
              onChange={handleImageChange}
              onClear={clearImage}
            />

            {/* Certificate Image — optional */}
            <DropZone
              label="Course Certificate Image"
              hint="Optional · JPG / PNG · Max 5 MB"
              accept="image/*"
              accentColor="#38BDF8"
              previewType="image"
              preview={certPreview}
              error={fieldErrors.cert}
              icon={<PiCertificate size={20} style={{ color: "#38BDF8" }} />}
              onChange={handleCertChange}
              onClear={clearCert}
            />

            {/* Curriculum PDF — optional */}
            <DropZone
              label="Course Curriculum PDF"
              hint="Optional · PDF only · Max 20 MB"
              accept="application/pdf"
              accentColor="#22C55E"
              previewType="pdf"
              fileName={curriculumName}
              error={fieldErrors.curriculum}
              icon={<FiFileText size={18} style={{ color: "#22C55E" }} />}
              onChange={handleCurriculumChange}
              onClear={clearCurriculum}
            />
          </Section>

          {/* ══ SECTION 2: Course Info ══ */}
          <Section title="Course Details" color="#38BDF8">

            <Field label="Course Name" required>
              <TextInput
                name="courseName" value={formData.courseName} onChange={handleChange}
                placeholder="e.g. MERN Stack Development" required
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Duration" required>
                <TextInput
                  name="duration" value={formData.duration} onChange={handleChange}
                  placeholder="e.g. 6" required
                />
              </Field>
              <Field label="Fee (₹)" required>
                <TextInput
                  name="fee" value={formData.fee} onChange={handleChange}
                  type="number" placeholder="e.g. 5999" required
                />
              </Field>
              <Field label="Mode" required>
                <SelectInput name="mode" value={formData.mode} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Hybrid">Hybrid</option>
                </SelectInput>
              </Field>
            </div>

            <Field label="About" required>
              <TextArea
                name="about" value={formData.about} onChange={handleChange}
                placeholder="Describe the course — what students will learn, prerequisites, outcomes…"
                rows={5} required
              />
            </Field>

          </Section>

          {/* ══ SECTION 3: Classification ══ */}
          <Section title="Classification" color="#B026B5">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Type" required>
                <SelectInput name="type" value={formData.type} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Tech">Tech</option>
                  <option value="Non-Tech">Non-Tech</option>
                </SelectInput>
              </Field>
              <Field label="Category" required>
                <TextInput
                  name="category" value={formData.category} onChange={handleChange}
                  placeholder="e.g. Web Development" required
                />
              </Field>
              <Field label="Sub Category" required>
                <TextInput
                  name="subCategory" value={formData.subCategory} onChange={handleChange}
                  placeholder="e.g. MERN Stack" required
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Trending" required>
                <SelectInput name="trending" value={formData.trending} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </SelectInput>
              </Field>
              <Field label="Start Date">
                <TextInput
                  name="startDate" value={formData.startDate} onChange={handleChange}
                  type="date"
                />
              </Field>
              <Field label="Language">
                <TextInput
                  name="language" value={formData.language} onChange={handleChange}
                  placeholder="e.g. Hinglish"
                />
              </Field>
            </div>

          </Section>

          {/* ══ SUBMIT ══ */}
          <button
            type="submit"
            disabled={loading}
            className="w-full font-bold py-4 rounded-xl text-sm text-white transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background: loading ? "#d1a3d3" : "#B026B5",
              boxShadow:  loading ? "none" : "0 8px 24px rgba(176,38,181,0.30)",
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#8f1e92"; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#B026B5"; }}
          >
            {loading
              ? <><FiLoader size={15} className="animate-spin" /> Uploading &amp; Adding Course…</>
              : "Publish Course →"
            }
          </button>

          <p className="text-center text-xs pb-4" style={{ color: "#9ca3af" }}>
            Images are uploaded to Cloudinary · PDFs are stored securely
          </p>

        </form>
      </div>
    </div>
  );
}
