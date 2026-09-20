import { useState, useEffect, useCallback } from "react";
import {
  User,
  Phone,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  Lock,
  IndianRupee,
  AlertCircle,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
  GraduationCap,
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

function formatTime(value) {
  const match = String(value || "").match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!match) return "";
  const hour = Number(match[1]);
  return `${hour % 12 || 12}:${match[2]} ${hour >= 12 ? "PM" : "AM"}`;
}

function formatBatchTiming(details) {
  const start = formatTime(details.batchStartTime);
  const end = formatTime(details.batchEndTime);
  return start && end ? `${start} - ${end}` : details.batchTime || "—";
}

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#B026B5] focus:ring-4 focus:ring-[#B026B5]/10";

export default function MyDetailsView({ user, onToast }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "",
    fatherName: "",
    whatsappNumber: user?.mobileNumber || user?.phone || "",
    course: "",
    mentor: "",
    courseStartDate: "",
    courseDuration: "",
    batchStartTime: "",
    batchEndTime: "",
    fee: "",
  });

  const loadDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/student-detail/my-details`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && data.data) {
        setDetails(data.data);
      } else {
        setDetails(null);
      }
    } catch {
      setDetails(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.fatherName.trim() ||
      !form.whatsappNumber.trim() ||
      !form.course.trim() ||
      !form.mentor.trim() ||
      !form.courseStartDate ||
      !form.batchStartTime ||
      !form.batchEndTime
    ) {
      if (onToast) onToast("Please fill all required fields", "error");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API}/student-detail/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        if (onToast) onToast("Details submitted successfully! Profile is now saved.", "success");
        setDetails(data.data);
      } else {
        if (onToast) onToast(data.message || "Failed to submit details", "error");
      }
    } catch {
      if (onToast) onToast("Network error submitting details", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-[#B026B5]" />
        <p className="mt-4 text-sm font-semibold text-slate-500">Loading your profile details...</p>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // STATE 1: DETAILS ALREADY SUBMITTED (Read-Only Student Profile)
  // ══════════════════════════════════════════════════════════════
  if (details) {
    return (
      <div className="space-y-6">
        {/* ── Top Header Banner ── */}
        <div className="bg-gradient-to-r from-[#8E1387] via-[#a81ba1] to-[#3a0855] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl font-black text-white shadow-inner shrink-0">
                {details.name?.[0]?.toUpperCase() || "S"}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight">{details.name}</h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-extrabold backdrop-blur-sm">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified Student
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-purple-100/90 font-medium mt-1">
                  Father: <strong className="text-white">{details.fatherName}</strong> · WhatsApp:{" "}
                  <strong className="text-white">{details.whatsappNumber}</strong>
                </p>
              </div>
            </div>

            {/* Read-Only Status Indicator */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-purple-100 self-start sm:self-auto shrink-0">
              <Lock className="h-4 w-4 text-amber-300" />
              <span>Admin Managed Profile</span>
            </div>
          </div>
        </div>

        {/* ── Fee Clearance / Due Notification Alert ── */}
        {details.isAllFeeSubmitted ? (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-3xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="h-10 w-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-emerald-950">
                    🎉 All Course Fees Cleared
                  </h3>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Your full course fee has been received and verified by administration. No further dues pending!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-xs">
                  ✓ Full Paid
                </span>
              </div>
            </div>
          </div>
        ) : details.nextFeeDate ? (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="h-10 w-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-amber-900">
                    Upcoming Fee Installment Due
                  </h3>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Your next fee submission is scheduled on{" "}
                    <strong>{formatDate(details.nextFeeDate)}</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-amber-700/80 block">
                    Next Due Amount
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-amber-900">
                    ₹{Number(details.nextFeeAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* ── Main Details Information Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Academic & Course Schedule */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-[#8E1387]">
              <BookOpen className="h-5 w-5 text-[#B026B5]" />
              <h2 className="text-base font-black text-slate-900">Course & Batch Details</h2>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Enrolled Course</span>
                <span className="font-extrabold text-slate-800 text-right">{details.course}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Assigned Mentor</span>
                <span className="font-bold text-[#8E1387]">{details.mentor}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Batch Timing</span>
                <span className="inline-flex items-center gap-1.5 font-extrabold text-slate-800 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-100">
                  <Clock className="h-3.5 w-3.5 text-[#B026B5]" />
                  {formatBatchTiming(details)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Course Start Date</span>
                <span className="font-bold text-slate-700">{formatDate(details.courseStartDate)}</span>
              </div>

              {details.courseDuration && (
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Duration</span>
                  <span className="font-bold text-slate-700">{details.courseDuration}</span>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Personal & Fee Information */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-[#8E1387]">
              <User className="h-5 w-5 text-[#B026B5]" />
              <h2 className="text-base font-black text-slate-900">Personal & Fee Details</h2>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Student Full Name</span>
                <span className="font-extrabold text-slate-800">{details.name}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Father's Name</span>
                <span className="font-bold text-slate-700">{details.fatherName}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-medium">WhatsApp Number</span>
                <span className="inline-flex items-center gap-1.5 font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
                  <Phone className="h-3.5 w-3.5" />
                  {details.whatsappNumber}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Total Course Fee</span>
                <span className="font-black text-slate-900 text-base">
                  ₹{Number(details.fee || 0).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Fee Status</span>
                {details.isAllFeeSubmitted ? (
                  <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5" /> All Fee Paid
                  </span>
                ) : (
                  <span className="font-bold text-amber-600">
                    {details.nextFeeDate
                      ? `Due: ${formatDate(details.nextFeeDate)}`
                      : "Pending Fee Schedule"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Admin Management Policy Box ── */}
        <div className="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50/60 to-white p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-purple-100 text-[#8E1387] flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">
                Profile is Managed by Zint Administration
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                As per institute policy, student batch timings, mentors, and fee records are verified
                and managed by administration. If you need any corrections, please contact the office.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/918889998184?text=${encodeURIComponent(
              `Hello Zint Institute, I am ${details.name} (Course: ${details.course}). I have a query regarding my student profile.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#00a884] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#009172] transition shrink-0"
          >
            <MessageCircle className="h-4 w-4" />
            Contact Office
          </a>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // STATE 2: INITIAL REGISTRATION FORM (Student Fills Details)
  // ══════════════════════════════════════════════════════════════
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-purple-100 text-[#8E1387] flex items-center justify-center font-bold">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">Student Profile & Details</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Please fill in your authentic student details. This connects your course, mentor, and batch schedule.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200/80 p-3.5 flex items-start gap-2.5 text-xs text-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Important Note:</strong> Please review your details before submitting. Once submitted,
            your profile is locked and can only be updated by the Zint Institute administration.
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Student Full Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Shivam Savita"
                className={inputClass}
              />
            </div>

            {/* Father's Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Father's Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="fatherName"
                value={form.fatherName}
                onChange={handleChange}
                placeholder="e.g. Shivam Savita"
                className={inputClass}
              />
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="tel"
                name="whatsappNumber"
                value={form.whatsappNumber}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className={inputClass}
              />
            </div>

            {/* Course Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Course Enrolled <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="course"
                value={form.course}
                onChange={handleChange}
                placeholder="e.g. Full Stack Web Development"
                className={inputClass}
              />
            </div>

            {/* Mentor Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Assigned Mentor / Faculty <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="mentor"
                value={form.mentor}
                onChange={handleChange}
                placeholder="e.g. Abhishek Sir"
                className={inputClass}
              />
            </div>

            {/* Course Start Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Course Start Date <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="date"
                name="courseStartDate"
                value={form.courseStartDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Batch Start Time */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Batch Start Time <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="time"
                name="batchStartTime"
                value={form.batchStartTime}
                onChange={handleChange}
                step="60"
                lang="en-US"
                className={inputClass}
              />
            </div>

            {/* Batch End Time */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Batch End Time <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="time"
                name="batchEndTime"
                value={form.batchEndTime}
                onChange={handleChange}
                step="60"
                lang="en-US"
                className={inputClass}
              />
            </div>

            {/* Course Duration (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Course Duration <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                name="courseDuration"
                value={form.courseDuration}
                onChange={handleChange}
                placeholder="e.g. 3 Months / 6 Months"
                className={inputClass}
              />
            </div>

            {/* Total Fee (Optional) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Course Fee (INR) <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="number"
                name="fee"
                value={form.fee}
                onChange={handleChange}
                placeholder="e.g. 15000"
                className={inputClass}
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8E1387] to-[#B026B5] text-white text-sm font-extrabold shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.01] hover:from-[#760e70] hover:to-[#9a1c9f] disabled:opacity-60 cursor-pointer"
            >
              {submitting ? "Saving Your Details..." : "Submit & Save My Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
