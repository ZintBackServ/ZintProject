import { useState, useEffect } from "react";
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiLoader, FiInbox,
  FiSearch, FiMonitor, FiHome, FiTool,
  FiBriefcase, FiCalendar, FiBookOpen,
} from "react-icons/fi";

const GRAY          = "#6E6E6E";
const WHITE          = "#FFFFFF";
const DarkPurple    = "#8E1387";
const PrimaryPurple = "#B11FA8";
const BLUE          = "#53BFEA";
const GREEN          = "#45B51D";

const TIMETABLE_URL = `${import.meta.env.VITE_API_URL}/timeTable`;

const CATEGORIES = [
  "Online Training",
  "Classroom Training",
  "Workshops",
  "Internships",
  "Weekend Training",
  "Other Classes",
];

const categoryIcons = {
  "Online Training": FiMonitor,
  "Classroom Training": FiHome,
  "Workshops": FiTool,
  "Internships": FiBriefcase,
  "Weekend Training": FiCalendar,
  "Other Classes": FiBookOpen,
};

// ── Date/time helpers ────────────────────────────────────────────────────
// Convert an <input type="date"> value ("2026-05-25") into the display
// string the backend stores ("25 May 2026").
function formatDateForDisplay(isoDate) {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
}

// Build the display string the backend stores ("9:15 AM") from separate
// hour (1-12), minute (00-59), and period (AM/PM) values.
function formatTimeParts(hour, minute, period) {
  if (!hour || !minute || !period) return "";
  return `${hour}:${minute} ${period}`;
}

// Best-effort parse of a stored display date ("25 May 2026") back into the
// "YYYY-MM-DD" shape <input type="date"> needs. Falls back to "" if it
// can't be parsed (e.g. legacy free-text values).
function parseDateForInput(display) {
  if (!display) return "";
  const parsed = new Date(display);
  if (isNaN(parsed.getTime())) return "";
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Best-effort parse of a stored display time ("9:15 AM") back into
// separate hour/minute/period values for the hour/minute/AM-PM selects.
// Falls back to a sensible default (9:00 AM) if it can't be parsed.
function parseTimeParts(display) {
  const fallback = { hour: "9", minute: "00", period: "AM" };
  if (!display) return fallback;
  const match = display.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return fallback;
  let [, hours, minutes, period] = match;
  hours = parseInt(hours, 10);
  if (hours < 1 || hours > 12) hours = 9;
  return { hour: String(hours), minute: minutes.padStart(2, "0"), period: period ? period.toUpperCase() : "AM" };
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const PERIODS = ["AM", "PM"];

async function safeFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  });
  const raw = await res.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch {}
  if (!res.ok) throw new Error(data?.msg || `Request failed with status ${res.status}`);
  return data;
}

// ── Add/Edit Modal ──────────────────────────────────────────────────────────
function ClassFormModal({ mode, initialData, onClose, onSaved }) {
  const isEdit = mode === "edit";
  const initialTimeParts = parseTimeParts(initialData?.time);
  const [form, setForm] = useState({
    category: initialData?.category || "Online Training",
    course: initialData?.course || "",
    faculty: initialData?.faculty || "",
    date: initialData?.date || "",
    time: initialData?.time || formatTimeParts(initialTimeParts.hour, initialTimeParts.minute, initialTimeParts.period),
    meetingLink: initialData?.meetingLink || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [datePicker, setDatePicker] = useState(parseDateForInput(initialData?.date));
  const [hourPicker, setHourPicker] = useState(initialTimeParts.hour);
  const [minutePicker, setMinutePicker] = useState(initialTimeParts.minute);
  const [periodPicker, setPeriodPicker] = useState(initialTimeParts.period);

  const handleDateChange = (e) => {
    const value = e.target.value;
    setDatePicker(value);
    setForm(prev => ({ ...prev, date: formatDateForDisplay(value) }));
  };

  const handleHourChange = (e) => {
    const value = e.target.value;
    setHourPicker(value);
    setForm(prev => ({ ...prev, time: formatTimeParts(value, minutePicker, periodPicker) }));
  };

  const handleMinuteChange = (e) => {
    const value = e.target.value;
    setMinutePicker(value);
    setForm(prev => ({ ...prev, time: formatTimeParts(hourPicker, value, periodPicker) }));
  };

  const handlePeriodChange = (e) => {
    const value = e.target.value;
    setPeriodPicker(value);
    setForm(prev => ({ ...prev, time: formatTimeParts(hourPicker, minutePicker, value) }));
  };

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.course.trim() || !form.faculty.trim() || !form.date.trim() || !form.time.trim() || !form.meetingLink.trim()) {
      setError("All fields are required.");
      return;
    }

    setSubmitting(true);
    try {
      const url = isEdit
        ? `${TIMETABLE_URL}/updateTimetable/${initialData._id}`
        : `${TIMETABLE_URL}/addTimetable`;
      const data = await safeFetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      onSaved(data?.data);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save class.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-[1000] p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-xl"
        style={{ background: WHITE, border: `1px solid ${PrimaryPurple}20` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b shrink-0" style={{ borderColor: `${PrimaryPurple}20` }}>
          <h3 className="font-bold text-base sm:text-lg" style={{ color: "#1a1a1a" }}>
            {isEdit ? "Edit Class" : "Add New Class"}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style={{ color: GRAY, background: "transparent" }}
            onMouseEnter={e => e.currentTarget.style.background = `${PrimaryPurple}10`}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <FiX />
          </button>
        </div>

        <form id="class-form" onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 sm:px-6 py-5 overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: GRAY }}>Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border rounded-xl px-3.5 py-2.5 text-sm outline-none"
              style={{ borderColor: `${PrimaryPurple}40`, color: "#1a1a1a", background: WHITE }}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: GRAY }}>Course Name</label>
            <input
              name="course"
              value={form.course}
              onChange={handleChange}
              placeholder="e.g. Full Stack .Net Core 10 with AI"
              className="border rounded-xl px-3.5 py-2.5 text-sm outline-none placeholder-gray-400"
              style={{ borderColor: `${PrimaryPurple}40`, color: "#1a1a1a", background: WHITE }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: GRAY }}>Faculty</label>
            <input
              name="faculty"
              value={form.faculty}
              onChange={handleChange}
              placeholder="e.g. Mr. Bangar Raju"
              className="border rounded-xl px-3.5 py-2.5 text-sm outline-none placeholder-gray-400"
              style={{ borderColor: `${PrimaryPurple}40`, color: "#1a1a1a", background: WHITE }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: GRAY }}>Date</label>
              <input
                name="date"
                type="date"
                value={datePicker}
                onChange={handleDateChange}
                className="border rounded-xl px-3.5 py-2.5 text-sm outline-none"
                style={{ borderColor: `${PrimaryPurple}40`, color: "#1a1a1a", background: WHITE, colorScheme: "light" }}
              />
              {form.date && <p className="text-xs" style={{ color: GRAY }}>{form.date}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: GRAY }}>Time</label>
              <div className="flex gap-2">
                <select
                  name="hour"
                  value={hourPicker}
                  onChange={handleHourChange}
                  className="border rounded-xl px-2 py-2.5 text-sm outline-none flex-1"
                  style={{ borderColor: `${PrimaryPurple}40`, color: "#1a1a1a", background: WHITE }}
                >
                  {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <select
                  name="minute"
                  value={minutePicker}
                  onChange={handleMinuteChange}
                  className="border rounded-xl px-2 py-2.5 text-sm outline-none flex-1"
                  style={{ borderColor: `${PrimaryPurple}40`, color: "#1a1a1a", background: WHITE }}
                >
                  {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select
                  name="period"
                  value={periodPicker}
                  onChange={handlePeriodChange}
                  className="border rounded-xl px-2 py-2.5 text-sm outline-none flex-1"
                  style={{ borderColor: `${PrimaryPurple}40`, color: "#1a1a1a", background: WHITE }}
                >
                  {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              {form.time && <p className="text-xs" style={{ color: GRAY }}>{form.time}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: GRAY }}>Meeting Link</label>
            <input
              name="meetingLink"
              value={form.meetingLink}
              onChange={handleChange}
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              className="border rounded-xl px-3.5 py-2.5 text-sm outline-none placeholder-gray-400"
              style={{ borderColor: `${PrimaryPurple}40`, color: "#1a1a1a", background: WHITE }}
            />
          </div>

          {error && <p className="text-xs font-medium" style={{ color: "#dc2626" }}>{error}</p>}
        </form>

        <div className="px-5 sm:px-6 py-4 border-t shrink-0" style={{ borderColor: `${PrimaryPurple}20` }}>
          <button
            type="submit"
            form="class-form"
            disabled={submitting}
            className="w-full font-bold py-2.5 sm:py-3 rounded-xl text-sm text-white transition-colors disabled:opacity-50"
            style={{ background: `linear-gradient(135deg, ${DarkPurple}, ${PrimaryPurple})` }}
          >
            {submitting ? "Saving..." : isEdit ? "Save Changes" : "Add Class"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Page ──────────────────────────────────────────────────────
export default function AdminTimetable() {
  const [classes, setClasses]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState(null); // { mode: "add"|"edit", data }
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast]       = useState(null);

  const loadClasses = async () => {
    try {
      const data = await safeFetch(`${TIMETABLE_URL}/allTimetable`);
      setClasses(data?.data || []);
    } catch (err) {
      console.log(err);
      setClasses([]);
    }
  };

  useEffect(() => {
    loadClasses().finally(() => setLoading(false));
  }, []);

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this class? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await safeFetch(`${TIMETABLE_URL}/deleteTimetable/${id}`, { method: "DELETE" });
      setClasses(prev => prev.filter(c => c._id !== id));
      showToast("Class deleted.");
    } catch (err) {
      showToast(err.message || "Delete failed.", "error");
    } finally {
      setDeleting(null);
    }
  };

  const handleSaved = (saved) => {
    if (!saved) { loadClasses(); showToast("Saved."); return; }
    setClasses(prev => {
      const exists = prev.some(c => c._id === saved._id);
      return exists ? prev.map(c => (c._id === saved._id ? saved : c)) : [saved, ...prev];
    });
    showToast(modal?.mode === "edit" ? "Class updated." : "Class added.");
  };

  const filtered = classes.filter(c => {
    const matchCategory = categoryFilter === "all" || c.category === categoryFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || c.course.toLowerCase().includes(q) || c.faculty.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: WHITE }}>
      <div className="flex items-center gap-2" style={{ color: PrimaryPurple }}>
        <FiLoader className="animate-spin" /> Loading classes...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans" style={{ background: WHITE }}>
      {/* Header */}
      <div className="px-6 pt-8 pb-4 border-b" style={{ borderColor: `${PrimaryPurple}15` }}>
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#1a1a1a" }}>Manage Timetable</h1>
            <p className="text-sm" style={{ color: GRAY }}>Add, edit, or remove classes across all categories.</p>
          </div>
          <button
            onClick={() => setModal({ mode: "add", data: null })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-transform hover:scale-[1.02]"
            style={{ background: `linear-gradient(135deg, ${DarkPurple}, ${PrimaryPurple})` }}
          >
            <FiPlus /> Add Class
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">

        {/* Stats */}
        <div className="mb-6">
          <div className="rounded-2xl p-4 border max-w-[220px]" style={{ background: WHITE, borderColor: `${PrimaryPurple}25` }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: GRAY }}>Total Classes</p>
            <p className="text-2xl font-black" style={{ color: "#1a1a1a" }}>{classes.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" size={14} style={{ color: BLUE }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search course or faculty..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: WHITE, border: `1px solid ${PrimaryPurple}30`, color: "#1a1a1a" }}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setCategoryFilter("all")}
              className="shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={categoryFilter === "all"
                ? { background: `linear-gradient(135deg, ${DarkPurple}, ${PrimaryPurple})`, color: WHITE }
                : { background: WHITE, border: `1px solid ${PrimaryPurple}30`, color: GRAY }}
            >
              All
            </button>
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className="shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
                style={categoryFilter === c
                  ? { background: `linear-gradient(135deg, ${DarkPurple}, ${PrimaryPurple})`, color: WHITE }
                  : { background: WHITE, border: `1px solid ${PrimaryPurple}30`, color: GRAY }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden" style={{ background: WHITE, border: `1px solid ${PrimaryPurple}20` }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr style={{ background: `${PrimaryPurple}0d`, borderBottom: `1px solid ${PrimaryPurple}20` }}>
                  {["Course", "Faculty", "Category", "Date / Time", ""].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-semibold uppercase text-xs tracking-wide" style={{ color: GRAY }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => {
                  const Icon = categoryIcons[c.category] || FiMonitor;
                  return (
                    <tr key={c._id} style={{ borderBottom: `1px solid ${PrimaryPurple}0d`, background: i % 2 === 0 ? WHITE : `${PrimaryPurple}05` }}>
                      <td className="px-5 py-3 font-medium" style={{ color: "#1a1a1a" }}>{c.course}</td>
                      <td className="px-5 py-3" style={{ color: GRAY }}>{c.faculty}</td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: `${PrimaryPurple}12`, color: PrimaryPurple }}>
                          <Icon size={11} /> {c.category}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs" style={{ color: GRAY }}>{c.date} · {c.time}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setModal({ mode: "edit", data: c })}
                            className="transition-colors"
                            style={{ color: BLUE }}
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(c._id)}
                            disabled={deleting === c._id}
                            className="transition-colors disabled:opacity-40"
                            style={{ color: "#dc2626" }}
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-16" style={{ color: PrimaryPurple }}>
              <FiInbox size={28} />
              <span className="text-sm">No classes found</span>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <ClassFormModal
          mode={modal.mode}
          initialData={modal.data}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      {toast && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg z-[1100] text-white"
          style={{ background: toast.type === "error" ? "#dc2626" : GREEN }}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}