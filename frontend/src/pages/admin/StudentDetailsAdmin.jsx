import { useState, useEffect, useCallback } from "react";
import {
  Search,
  User,
  Phone,
  BookOpen,
  Calendar,
  Clock,
  Edit,
  Trash2,
  CheckCircle2,
  Lock,
  MessageCircle,
  FileText,
  AlertCircle,
  X,
  Send,
  Sparkles,
  Users,
  IndianRupee,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateForInput(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

function formatTime(value) {
  const match = String(value || "").match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!match) return "";
  const hour = Number(match[1]);
  return `${hour % 12 || 12}:${match[2]} ${hour >= 12 ? "PM" : "AM"}`;
}

function legacyTimeToInput(value) {
  const match = String(value || "").trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "";
  let hour = Number(match[1]);
  if (hour < 1 || hour > 12 || Number(match[2]) > 59) return "";
  if (/pm/i.test(match[3]) && hour !== 12) hour += 12;
  if (/am/i.test(match[3]) && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${match[2]}`;
}

function getBatchTimes(student) {
  if (student.batchStartTime && student.batchEndTime) {
    return { start: student.batchStartTime, end: student.batchEndTime };
  }
  const [start = "", end = ""] = String(student.batchTime || "").split(/\s*[-–]\s*/);
  return { start: legacyTimeToInput(start), end: legacyTimeToInput(end) };
}

function formatBatchTiming(student) {
  const { start, end } = getBatchTimes(student);
  const formattedStart = formatTime(start);
  const formattedEnd = formatTime(end);
  return formattedStart && formattedEnd ? `${formattedStart} - ${formattedEnd}` : student.batchTime || "—";
}

// ── Toast Notification ──
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: "bg-emerald-600",
    error: "bg-red-600",
    info: "bg-purple-600",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-white text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-bottom-3 ${
        colors[type] || colors.info
      }`}
    >
      <span>{type === "success" ? "✓" : "ℹ"}</span> {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 text-xs">
        ✕
      </button>
    </div>
  );
}

// ── Edit Student Modal ──
function EditStudentModal({ student, onClose, onUpdated, showToast }) {
  const batchTimes = getBatchTimes(student);
  const [form, setForm] = useState({
    name: student.name || "",
    fatherName: student.fatherName || "",
    whatsappNumber: student.whatsappNumber || "",
    course: student.course || "",
    mentor: student.mentor || "",
    courseStartDate: formatDateForInput(student.courseStartDate),
    courseDuration: student.courseDuration || "",
    batchStartTime: batchTimes.start,
    batchEndTime: batchTimes.end,
    fee: student.fee || 0,
    notes: student.notes || "",
    nextFeeDate: formatDateForInput(student.nextFeeDate),
    nextFeeAmount: student.nextFeeAmount || 0,
    isAllFeeSubmitted: student.isAllFeeSubmitted ?? false,
    isLockedForStudent: student.isLockedForStudent ?? true,
    isVerifiedByAdmin: student.isVerifiedByAdmin ?? false,
  });

  const [saving, setSaving] = useState(false);
  const [sendingReminder, setSendingReminder] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API}/student-detail/admin/${student._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update student");

      showToast("Student details updated successfully!", "success");
      onUpdated();
      onClose();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSendReminder = async (type) => {
    setSendingReminder(true);
    try {
      const res = await fetch(
        `${API}/student-detail/admin/${student._id}/send-manual-reminder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ type }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send reminder");

      showToast(data.message || "WhatsApp reminder dispatched!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSendingReminder(false);
    }
  };

  const inputStyle =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none transition focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
              Admin Student Management
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
              Edit Details for {student.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-6 space-y-6">
          {/* Section 1: Personal & Course Details */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
              1. Student & Course Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Name</label>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Father's Name</label>
                <input
                  required
                  name="fatherName"
                  value={form.fatherName}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number</label>
                <input
                  required
                  name="whatsappNumber"
                  value={form.whatsappNumber}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Name</label>
                <input
                  required
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Mentor</label>
                <input
                  required
                  name="mentor"
                  value={form.mentor}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Batch Start Time</label>
                <input
                  required
                  type="time"
                  name="batchStartTime"
                  value={form.batchStartTime}
                  onChange={handleChange}
                  step="60"
                  lang="en-US"
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Batch End Time</label>
                <input
                  required
                  type="time"
                  name="batchEndTime"
                  value={form.batchEndTime}
                  onChange={handleChange}
                  step="60"
                  lang="en-US"
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="courseStartDate"
                  value={form.courseStartDate}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                <input
                  name="courseDuration"
                  value={form.courseDuration}
                  onChange={handleChange}
                  placeholder="e.g. 3 Months"
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Fee (₹)</label>
                <input
                  type="number"
                  name="fee"
                  value={form.fee}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Fee Clearance Toggle & Next Fee Schedule */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200/80">
              <div className="flex items-center gap-2 text-slate-900">
                <IndianRupee className="h-4 w-4 text-emerald-600" />
                <h3 className="text-xs font-black uppercase tracking-wider">
                  2. Fee Clearance & Next Schedule
                </h3>
              </div>

              {/* All Fee Submitted Toggle in Modal */}
              <label className="inline-flex items-center gap-2.5 cursor-pointer bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-500 transition">
                <input
                  type="checkbox"
                  name="isAllFeeSubmitted"
                  checked={form.isAllFeeSubmitted}
                  onChange={handleChange}
                  className="accent-emerald-600 h-4 w-4 rounded"
                />
                <span className={`text-xs font-extrabold ${form.isAllFeeSubmitted ? "text-emerald-700" : "text-slate-600"}`}>
                  {form.isAllFeeSubmitted ? "✅ All Fee Submitted (Paid Full)" : "⏳ Fee Pending"}
                </span>
              </label>
            </div>

            <p className="text-[11px] text-slate-600">
              Enter the next fee due date discussed with the student. A WhatsApp reminder will be sent
              automatically <strong>1 day before</strong> this date to both the student and Zint Institute.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Next Fee Due Date
                </label>
                <input
                  type="date"
                  name="nextFeeDate"
                  value={form.nextFeeDate}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Next Due Amount (₹)
                </label>
                <input
                  type="number"
                  name="nextFeeAmount"
                  value={form.nextFeeAmount}
                  onChange={handleChange}
                  placeholder="e.g. 5000"
                  className={inputStyle}
                />
              </div>
            </div>

            {/* Manual WhatsApp Triggers */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={sendingReminder || !form.nextFeeDate}
                onClick={() => handleSendReminder("fee")}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                Send Instant Fee Reminder WhatsApp
              </button>

              <button
                type="button"
                disabled={sendingReminder}
                onClick={() => handleSendReminder("batch")}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 transition disabled:opacity-50"
              >
                <Clock className="h-3.5 w-3.5" />
                Send Instant Class Time Reminder
              </button>
            </div>
          </div>

          {/* Section 3: Admin Notes (No Word Limit) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                3. Admin Notes & Remarks <span className="text-slate-400 font-normal">(No word limit)</span>
              </label>
            </div>
            <textarea
              rows="4"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Write any discussion points, fee agreements, student progress notes, or special instructions..."
              className={`${inputStyle} resize-y font-normal`}
            />
          </div>

          {/* Section 4: Profile Controls */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                name="isVerifiedByAdmin"
                checked={form.isVerifiedByAdmin}
                onChange={handleChange}
                className="accent-purple-700 h-4 w-4"
              />
              Mark as Verified Student
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                name="isLockedForStudent"
                checked={form.isLockedForStudent}
                onChange={handleChange}
                className="accent-purple-700 h-4 w-4"
              />
              Lock Profile from Student Editing
            </label>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 transition shadow-md shadow-purple-500/20 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Admin Student Details Component ──
export default function StudentDetailsAdmin() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [courseStartDateFilter, setCourseStartDateFilter] = useState("");
  const [filterFee, setFilterFee] = useState("all"); // 'all' | 'pending' | 'paid'
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [editModalStudent, setEditModalStudent] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
  }, []);

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (courseStartDateFilter) params.set("courseStartDate", courseStartDateFilter);
      const queryString = params.toString();
      const url = `${API}/student-detail/admin/all${queryString ? `?${queryString}` : ""}`;

      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setStudents(data.data || []);
      } else {
        setStudents([]);
      }
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [search, courseStartDateFilter]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // ── Instant Toggle "All Fee Submitted" ──
  const handleToggleFeeStatus = async (student) => {
    const newStatus = !student.isAllFeeSubmitted;
    setTogglingId(student._id);

    // Optimistic state update
    setStudents((prev) =>
      prev.map((s) => (s._id === student._id ? { ...s, isAllFeeSubmitted: newStatus } : s))
    );

    try {
      const res = await fetch(`${API}/student-detail/admin/${student._id}/toggle-fee-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isAllFeeSubmitted: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update fee status");

      showToast(
        newStatus
          ? `Marked "${student.name}" as All Fee Submitted ✅`
          : `Marked "${student.name}" as Fee Pending ⏳`,
        "success"
      );
    } catch (err) {
      // Revert optimistic update
      setStudents((prev) =>
        prev.map((s) => (s._id === student._id ? { ...s, isAllFeeSubmitted: !newStatus } : s))
      );
      showToast(err.message, "error");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete student record for "${name}"?`)) return;

    try {
      const res = await fetch(`${API}/student-detail/admin/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");

      showToast("Student record deleted successfully", "success");
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Stats
  const paidCount = students.filter((s) => s.isAllFeeSubmitted).length;
  const pendingCount = students.filter((s) => !s.isAllFeeSubmitted).length;

  // Filtered list
  const filteredStudents = students.filter((s) => {
    if (filterFee === "paid") return s.isAllFeeSubmitted;
    if (filterFee === "pending") return !s.isAllFeeSubmitted;
    return true;
  });

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
            Student Management
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Enrolled Student Details
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Toggle fee clearance status, edit notes without limit, set next fee schedules, and manage WhatsApp alerts.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="rounded-2xl bg-purple-50 px-4 py-2.5 border border-purple-100 text-center">
            <span className="text-[10px] font-bold text-purple-600 uppercase block">Total Students</span>
            <span className="text-lg font-black text-purple-900">{students.length}</span>
          </div>

          <div className="rounded-2xl bg-emerald-50 px-4 py-2.5 border border-emerald-100 text-center">
            <span className="text-[10px] font-bold text-emerald-600 uppercase block">All Fee Paid</span>
            <span className="text-lg font-black text-emerald-900">{paidCount}</span>
          </div>

          <div className="rounded-2xl bg-amber-50 px-4 py-2.5 border border-amber-100 text-center">
            <span className="text-[10px] font-bold text-amber-600 uppercase block">Fee Pending</span>
            <span className="text-lg font-black text-amber-900">{pendingCount}</span>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, course, mentor, or batch time..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 shadow-xs"
          />
        </div>

        {/* Exact Course Start Date Filter */}
        <label className="relative flex items-center shrink-0">
          <Calendar className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="date"
            value={courseStartDateFilter}
            onChange={(e) => setCourseStartDateFilter(e.target.value)}
            aria-label="Filter by course start date"
            title="Filter by course start date"
            className="w-full lg:w-44 rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-xs sm:text-sm text-slate-800 outline-none transition focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 shadow-xs"
          />
        </label>

        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 shrink-0">
          <button
            onClick={() => setFilterFee("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filterFee === "all"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({students.length})
          </button>
          <button
            onClick={() => setFilterFee("pending")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filterFee === "pending"
                ? "bg-amber-500 text-white shadow-2xs"
                : "text-slate-600 hover:text-amber-700"
            }`}
          >
            ⏳ Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterFee("paid")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filterFee === "paid"
                ? "bg-emerald-600 text-white shadow-2xs"
                : "text-slate-600 hover:text-emerald-700"
            }`}
          >
            ✅ Paid Full ({paidCount})
          </button>
        </div>
      </div>

      {/* ── Students Data Table ── */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs">
        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-700" />
            <p className="mt-3 text-xs font-semibold text-slate-400">Loading student records...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl mb-3">
              👥
            </div>
            <h3 className="text-base font-bold text-slate-800">No student records found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {search.trim() || filterFee !== "all"
                ? "Try adjusting your search or fee filter options."
                : "Students fill their details in the Student Portal > My Details tab, which will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="p-4">Student & Father</th>
                  <th className="p-4">WhatsApp</th>
                  <th className="p-4">Course & Mentor</th>
                  <th className="p-4">Batch Timing</th>
                  <th className="p-4">Total Fee</th>
                  <th className="p-4 text-center">All Fee Submitted?</th>
                  <th className="p-4">Next Fee Due</th>
                  <th className="p-4">Admin Notes</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const isPaid = Boolean(student.isAllFeeSubmitted);
                  const isToggling = togglingId === student._id;

                  return (
                    <tr
                      key={student._id}
                      className={`transition ${
                        isPaid ? "bg-emerald-50/20 hover:bg-emerald-50/40" : "hover:bg-purple-50/30"
                      }`}
                    >
                      {/* Name & Father */}
                      <td className="p-4">
                        <div className="font-extrabold text-slate-900">{student.name}</div>
                        <div className="text-[11px] text-slate-400">S/o {student.fatherName}</div>
                        {student.isVerifiedByAdmin && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-0.5">
                            ✓ Verified
                          </span>
                        )}
                      </td>

                      {/* WhatsApp */}
                      <td className="p-4 font-mono font-bold text-emerald-700 whitespace-nowrap">
                        {student.whatsappNumber}
                      </td>

                      {/* Course & Mentor */}
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{student.course}</div>
                        <div className="text-[11px] text-[#8E1387] font-semibold">
                          Mentor: {student.mentor}
                        </div>
                      </td>

                      {/* Batch Timing */}
                      <td className="p-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-800 px-2.5 py-1 rounded-xl text-xs font-bold border border-purple-100">
                          <Clock className="h-3 w-3" />
                          {formatBatchTiming(student)}
                        </span>
                      </td>

                      {/* Total Fee */}
                      <td className="p-4 font-black text-slate-800 whitespace-nowrap">
                        ₹{Number(student.fee || 0).toLocaleString("en-IN")}
                      </td>

                      {/* ── ALL FEE SUBMITTED TOGGLE BUTTON ── */}
                      <td className="p-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleFeeStatus(student)}
                          disabled={isToggling}
                          title={isPaid ? "Click to mark Fee as Pending" : "Click to mark All Fee as Submitted"}
                          className={`group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs font-black transition-all shadow-2xs hover:scale-102 active:scale-98 disabled:opacity-50 ${
                            isPaid
                              ? "bg-emerald-500 border-emerald-600 text-white shadow-emerald-500/20"
                              : "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100"
                          }`}
                        >
                          {/* Toggle Switch Visual Track */}
                          <div
                            className={`w-7 h-4 rounded-full flex items-center transition-colors px-0.5 ${
                              isPaid ? "bg-white/40 justify-end" : "bg-amber-200 justify-start"
                            }`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full shadow-xs transition-transform ${
                                isPaid ? "bg-white" : "bg-amber-600"
                              }`}
                            />
                          </div>
                          <span>{isPaid ? "Paid in Full" : "Pending"}</span>
                        </button>
                      </td>

                      {/* Next Fee Due */}
                      <td className="p-4 whitespace-nowrap">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/80">
                            <CheckCircle2 className="h-3 w-3" /> No Dues
                          </span>
                        ) : student.nextFeeDate ? (
                          <div>
                            <div className="font-extrabold text-amber-700">
                              {formatDate(student.nextFeeDate)}
                            </div>
                            <div className="text-[11px] font-bold text-slate-500">
                              Due: ₹{Number(student.nextFeeAmount || 0).toLocaleString("en-IN")}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Admin Notes */}
                      <td className="p-4 max-w-[200px]">
                        {student.notes ? (
                          <p className="text-xs text-slate-600 line-clamp-2" title={student.notes}>
                            {student.notes}
                          </p>
                        ) : (
                          <span className="text-slate-300 italic">No notes</span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditModalStudent(student)}
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
                            title="Edit Student Details & Notes"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(student._id, student.name)}
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
                            title="Delete Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {editModalStudent && (
        <EditStudentModal
          student={editModalStudent}
          onClose={() => setEditModalStudent(null)}
          onUpdated={loadStudents}
          showToast={showToast}
        />
      )}
    </div>
  );
}
