// Admission.jsx — /OnlineAdmission route
// Comprehensive Online Admission Portal with Student Admission Form & Course Catalog

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import upiQR from "../assets/zint_upi_qr.jpg";

const API = import.meta.env.VITE_API_URL;
const inr = (n) => "₹ " + Number(n || 0).toLocaleString("en-IN");

const ONLINE_FEATURES = [
  { title: "Live Online Classes", desc: "Attend classes from anywhere via Zoom / Google Meet" },
  { title: "Recorded Sessions", desc: "Lifetime access to all recorded lectures" },
  { title: "Doubt Clearing Sessions", desc: "Weekly live Q&A with mentors" },
  { title: "Digital Study Material", desc: "PDFs, notes & assignments shared digitally" },
  { title: "Placement Support", desc: "Resume building, mock interviews & job referrals" },
  { title: "Certificate", desc: "Industry-recognised course completion certificate" },
];

const OFFLINE_FEATURES = [
  { title: "Physical Classroom", desc: "In-person sessions at our institute campus" },
  { title: "Recorded Backup", desc: "Access recordings if you miss a class" },
  { title: "Printed Study Material", desc: "Comprehensive printed notes & workbooks" },
  { title: "Doubt Clearing Sessions", desc: "Face-to-face doubt sessions with faculty" },
  { title: "Placement Support", desc: "Resume building, mock interviews & job referrals" },
  { title: "Certificate", desc: "Industry-recognised course completion certificate" },
];

// ─── Toast Component ──────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  const colorMap = {
    success: "border-emerald-400 text-emerald-700 bg-emerald-50",
    warning: "border-amber-400   text-amber-800   bg-amber-50 shadow-amber-100",
    error:   "border-red-400     text-red-700     bg-red-50",
    info:    "border-purple-400  text-purple-700  bg-purple-50",
  };
  return (
    <div
      className={`fixed bottom-7 right-7 z-[99999] max-w-xs border rounded-xl px-5 py-3.5 text-sm font-medium shadow-xl transition-all duration-300 ${colorMap[toast.type] || colorMap.info}`}
    >
      {toast.msg}
    </div>
  );
}

// ─── Plan Feature Tick Icon ───────────────────────────────────────────────────
function Tick() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
      <circle cx="8" cy="8" r="8" fill="#B026B5" opacity="0.15" />
      <path d="M4.5 8l2.5 2.5 4.5-5" stroke="#B026B5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Policy Modal Component ───────────────────────────────────────────────────
function PolicyModal({ type, onClose }) {
  if (!type) return null;

  const contentMap = {
    privacy: {
      title: "Privacy Policy",
      icon: "🔒",
      content: [
        "Zint Institute is committed to protecting your personal information and privacy.",
        "The personal and guardian details, photographs, and contact information collected during online admission are strictly used for academic registration, batch allocation, and student record management.",
        "We do not sell, rent, or trade student data to third-party marketing companies.",
        "Your payment details, Transaction ID, and UTR numbers are securely processed and encrypted for verification purposes only.",
        "Students have the right to request updates or corrections to their recorded personal information by contacting our administrative office."
      ]
    },
    refund: {
      title: "Refund & Payment Policy",
      icon: "💳",
      content: [
        "Fee payments made online via UPI or bank transfer are subject to manual verification against bank UTR numbers within 24 business hours.",
        "Registration fees or initial installment fees paid for course enrollment are non-refundable once the batch orientation or class sessions commence.",
        "If an admission application is rejected or cancelled before batch start due to administrative reasons, a full refund will be processed to the original payment source within 7-10 business days.",
        "Batch transfer or shift changes are allowed once without extra charge upon written request at least 3 days prior to batch commencement.",
        "Receipts will be generated and issued to the student's registered email address upon successful verification."
      ]
    },
    terms: {
      title: "Terms & Conditions",
      icon: "📜",
      content: [
        "By applying for admission at Zint Institute, the student agrees to abide by all academic guidelines, code of conduct, and batch schedules.",
        "A minimum of 75% attendance is required to be eligible for course completion certificates and placement assistance.",
        "Study materials, recorded videos, and class assignments are proprietary content of Zint Institute and must not be redistributed or shared publicly.",
        "Zint Institute reserves the right to modify batch timings or instructors in case of unforeseen technical or administrative necessities.",
        "Placement support is offered to eligible students who successfully clear internal assessments, projects, and mock technical interviews."
      ]
    }
  };

  const item = contentMap[type] || contentMap.terms;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative border border-slate-200 my-auto" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center font-bold text-sm"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 text-[#B026B5] flex items-center justify-center text-xl shadow-xs">
            {item.icon}
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{item.title}</h3>
            <p className="text-xs text-slate-400">Zint Institute Official Policy Document</p>
          </div>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-2 text-xs text-slate-600 leading-relaxed border-t border-b border-slate-100 py-4 my-2">
          {item.content.map((p, idx) => (
            <p key={idx} className="flex items-start gap-2">
              <span className="text-[#B026B5] font-bold">•</span>
              <span>{p}</span>
            </p>
          ))}
        </div>

        <div className="pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#B026B5] text-white text-xs font-bold shadow hover:bg-[#8E1387] transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 4-Step Online Admission Form Component with Review & Agreement ────────────
function OnlineAdmissionForm({ courses, user, onSubmitSuccess, showToast }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Helper to format/extract batch start date from course API
  const getBatchStartDate = useCallback((course) => {
    const rawDate = course?.startDate || course?.batchStartDate || course?.start_date;
    if (!rawDate) {
      return "we will update you on watsapp and gmail";
    }
    try {
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return "we will update you on watsapp and gmail";
      return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return "we will update you on watsapp and gmail";
    }
  }, []);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const [formData, setFormData] = useState({
    studentName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
    fatherName: "",
    email: user?.email || "",
    mobileNumber: user?.mobile || "",
    fatherMobile: "",
    category: "General",
    gender: "Male",
    address: "",
    courseMode: "Online",
    courseId: "",
    dob: "",
    admissionDate: todayStr,
    totalFee: 0,
    batchTime: "Morning Batch (09:00 AM - 11:00 AM)",
    batchStartDate: "",
    courseDuration: "",
    photo: "",
    paymentScreenshot: "",
    transactionId: "",
    utrNumber: "",
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [activePolicyModal, setActivePolicyModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Filter available courses based on selected courseMode ("Online" or "Offline") using `mode` in course schema
  const availableCourses = useMemo(() => {
    if (!formData.courseMode) return courses;
    return courses.filter((c) => {
      if (!c.mode) return true;
      const modeStr = String(c.mode).toLowerCase();
      const selMode = formData.courseMode.toLowerCase();
      return modeStr === selMode || modeStr === "hybrid";
    });
  }, [courses, formData.courseMode]);

  // Handle Course Mode Change (Online vs Offline)
  const handleModeChange = (newMode) => {
    const matchingCourses = courses.filter((c) => {
      if (!c.mode) return true;
      const modeStr = String(c.mode).toLowerCase();
      const selMode = newMode.toLowerCase();
      return modeStr === selMode || modeStr === "hybrid";
    });

    const first = matchingCourses[0];
    const fee = first
      ? newMode === "Online"
        ? (first.online_fee ?? first.fee ?? 0)
        : (first.fee ?? first.online_fee ?? 0)
      : 0;

    setFormData((prev) => ({
      ...prev,
      courseMode: newMode,
      courseId: first ? first._id : "",
      totalFee: fee,
      courseDuration: first?.duration ? `${first.duration} Months` : "",
      batchStartDate: first ? getBatchStartDate(first) : "",
    }));
  };

  // Auto-select first matching course when courses load asynchronously
  useEffect(() => {
    if (courses.length > 0 && !formData.courseId) {
      const mode = formData.courseMode || "Online";
      const matching = courses.filter((c) => {
        if (!c.mode) return true;
        const modeStr = String(c.mode).toLowerCase();
        return modeStr === mode.toLowerCase() || modeStr === "hybrid";
      });
      const first = matching[0] || courses[0];
      if (first) {
        const fee = mode === "Online"
          ? (first.online_fee ?? first.fee ?? 0)
          : (first.fee ?? first.online_fee ?? 0);
        setFormData((prev) => ({
          ...prev,
          courseMode: mode,
          courseId: first._id,
          totalFee: fee,
          courseDuration: first.duration ? `${first.duration} Months` : prev.courseDuration,
          batchStartDate: getBatchStartDate(first),
        }));
      }
    }
  }, [courses, formData.courseId, formData.courseMode, getBatchStartDate]);

  // Selected course object for preview
  const selectedCourseObj = useMemo(() => {
    return courses.find((c) => c._id === formData.courseId) || availableCourses[0] || {};
  }, [courses, availableCourses, formData.courseId]);

  // Handle course dropdown change & auto-populate course details & fee
  const handleCourseSelect = (e) => {
    const selectedId = e.target.value;
    const selectedCourse = courses.find((c) => c._id === selectedId);
    const fee = selectedCourse
      ? formData.courseMode === "Online"
        ? (selectedCourse.online_fee ?? selectedCourse.fee ?? 0)
        : (selectedCourse.fee ?? selectedCourse.online_fee ?? 0)
      : 0;

    setFormData((prev) => ({
      ...prev,
      courseId: selectedId,
      totalFee: fee,
      courseDuration: selectedCourse?.duration ? `${selectedCourse.duration} Months` : prev.courseDuration,
      batchStartDate: selectedCourse ? getBatchStartDate(selectedCourse) : "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Character limits
    const charLimits = {
      studentName:   50,
      fatherName:    50,
      mobileNumber:  10,
      fatherMobile:  10,
      address:       200,
      transactionId: 30,
      utrNumber:     30,
    };

    // Alphanumeric-only fields
    const alphanumericFields = ["transactionId", "utrNumber"];

    let sanitized = value;

    if (alphanumericFields.includes(name)) {
      sanitized = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    }

    if (charLimits[name] !== undefined && sanitized.length > charLimits[name]) {
      sanitized = sanitized.slice(0, charLimits[name]);
    }

    setFormData((prev) => ({ ...prev, [name]: sanitized }));
  };

  // Handle Photo Upload with Preview (10MB limit with warning)
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast("⚠️ Warning: Photo size exceeds 10MB limit. Please select an image under 10MB.", "warning");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
      setFormData((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setFormData((prev) => ({ ...prev, photo: "" }));
  };

  // Handle Payment Screenshot Upload with Preview (10MB limit with warning)
  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast("⚠️ Warning: Payment screenshot size exceeds 10MB limit. Please select an image under 10MB.", "warning");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result);
      setFormData((prev) => ({ ...prev, paymentScreenshot: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const removeScreenshot = () => {
    setScreenshotPreview(null);
    setFormData((prev) => ({ ...prev, paymentScreenshot: "" }));
  };

  // Step Validation
  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.studentName.trim()) { showToast("Please enter Student Name", "error"); return false; }
      if (!formData.fatherName.trim()) { showToast("Please enter Father Name", "error"); return false; }
      if (!formData.email.trim()) { showToast("Please enter Student Email", "error"); return false; }
      if (!formData.mobileNumber.trim()) { showToast("Please enter Mobile Number", "error"); return false; }
      if (formData.mobileNumber.trim().length !== 10) { showToast("⚠️ Warning: Mobile Number must be exactly 10 digits", "warning"); return false; }
      if (formData.fatherMobile.trim() && formData.fatherMobile.trim().length !== 10) { showToast("⚠️ Warning: Father Mobile Number must be 10 digits", "warning"); return false; }
      if (!formData.dob) { showToast("Please select Date of Birth", "error"); return false; }
      return true;
    }
    if (step === 2) {
      if (!formData.address.trim()) { showToast("Please enter Full Residential Address", "error"); return false; }
      return true;
    }
    if (step === 3) {
      if (!formData.courseId) { showToast("Please select a Course", "error"); return false; }
      if (!formData.totalFee) { showToast("Course fee is invalid", "error"); return false; }
      return true;
    }
    if (step === 4) {
      if (!formData.paymentScreenshot) { showToast("Please upload payment screenshot", "error"); return false; }
      if (!formData.transactionId.trim()) { showToast("Please enter Transaction ID", "error"); return false; }
      if (!formData.utrNumber.trim()) { showToast("Please enter UTR Number", "error"); return false; }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 150, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      showToast("Please agree to the terms & conditions of Zint Institute to submit.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API}/admission/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Online Admission Form & Payment Proof submitted successfully! 🎉 Redirecting to User Dashboard...", "success");
        if (onSubmitSuccess) onSubmitSuccess(data.data);
        setTimeout(() => {
          navigate("/Dashboard");
        }, 1500);
      } else {
        showToast(data.msg || "Failed to submit admission form", "error");
      }
    } catch {
      showToast("Network error. Please check backend connection.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const STEPS_CONFIG = [
    { num: 1, label: "Personal Details", short: "Personal" },
    { num: 2, label: "Address & Photo", short: "Address" },
    { num: 3, label: "Course & Batch", short: "Course" },
    { num: 4, label: "Fee Payment Proof", short: "Payment" },
    { num: 5, label: "Review & Terms", short: "Review" },
  ];

  return (
    <div
      className="bg-white rounded-3xl border border-slate-200 shadow-xl p-5 sm:p-8 lg:p-10 max-w-4xl mx-auto space-y-8"
    >

      {/* ── Form Header ── */}
      <div className="border-b border-slate-100 pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-bold text-[#B026B5] mb-2">
          <span>🎓 Zint Institute Online Admission Portal</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Admission Application
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete the 4 application steps below and review your application before submission.
        </p>
      </div>

      {/* ── 4-Step Stepper Progress Bar ── */}
      <div className="py-2">
        <div className="flex items-center justify-between relative">
          {/* Background Line */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-slate-100 rounded-full z-0" />
          {/* Active Progress Line */}
          <div
            className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-gradient-to-r from-[#B026B5] to-[#53BFEA] rounded-full z-0 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (STEPS_CONFIG.length - 1)) * 100}%` }}
          />

          {STEPS_CONFIG.map((step) => {
            const isCompleted = currentStep > step.num;
            const isActive = currentStep === step.num;
            return (
              <div
                key={step.num}
                onClick={() => {
                  if (isCompleted || step.num < currentStep) setCurrentStep(step.num);
                }}
                className={`relative z-10 flex flex-col items-center cursor-pointer transition-all ${isCompleted || isActive ? "opacity-100" : "opacity-60"
                  }`}
              >
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-extrabold text-xs sm:text-sm shadow-sm transition-all duration-300 ${isCompleted
                      ? "bg-[#B026B5] text-white shadow-purple-200"
                      : isActive
                        ? "bg-[#180324] text-white ring-4 ring-[#B026B5]/20 shadow-md scale-110"
                        : "bg-white text-slate-400 border border-slate-300"
                    }`}
                >
                  {isCompleted ? "✓" : step.num}
                </div>
                <span className="mt-2 text-[10px] sm:text-xs font-bold text-center text-slate-700 hidden sm:block">
                  {step.label}
                </span>
                <span className="mt-1 text-[9px] font-bold text-center text-slate-700 sm:hidden">
                  {step.short}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ════════════════════════════════════════════════════════════════════
            STEP 1: Personal & Guardian Details
        ════════════════════════════════════════════════════════════════════ */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 border-b border-purple-100 pb-3">
              <span className="w-8 h-8 rounded-xl bg-purple-50 text-[#B026B5] font-extrabold flex items-center justify-center text-sm border border-purple-200">1</span>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Personal &amp; Guardian Details</h3>
                <p className="text-xs text-slate-400">Enter student basic identity and contact info</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Row 1 Left: Student Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="Enter full student name"
                  maxLength={50}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B026B5]/40 transition-all font-medium"
                />
                <p className="text-[10px] text-slate-400 mt-0.5 text-right">{formData.studentName.length}/50 characters</p>
              </div>

              {/* Row 1 Right: Father Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Father Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  placeholder="Enter father's full name"
                  maxLength={50}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B026B5]/40 transition-all font-medium"
                />
                <p className="text-[10px] text-slate-400 mt-0.5 text-right">{formData.fatherName.length}/50 characters</p>
              </div>

              {/* Row 2 Left: Student Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  inputMode="numeric"
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B026B5]/40 transition-all font-medium"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">Exactly 10 digits required — {formData.mobileNumber.length}/10</p>
              </div>

              {/* Row 2 Right: Father Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Father Mobile Number
                </label>
                <input
                  type="tel"
                  name="fatherMobile"
                  value={formData.fatherMobile}
                  onChange={handleChange}
                  placeholder="Father's contact number"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  inputMode="numeric"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B026B5]/40 transition-all font-medium"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">10 digits (optional) — {formData.fatherMobile.length}/10</p>
              </div>

              {/* Row 3 Left: Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter student email address"
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B026B5]/40 transition-all font-medium"
                />
              </div>



              {/* Row 4 Left: Gender */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-5 py-2.5 px-3 bg-slate-50/50 rounded-xl border border-slate-200">
                  {["Male", "Female", "Other"].map((g) => (
                    <label key={g} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={handleChange}
                        className="accent-[#B026B5] w-4 h-4"
                      />
                      {g}
                    </label>
                  ))}
                </div>
              </div>

              {/* Row 4 Right: Date of Birth */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B026B5]/40 transition-all font-medium"
                />
              </div>

              {/* Row 4 Right side: Application Date (beside Date of Birth) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Admission Application Date</span>
                  <span className="text-[10px] text-purple-600 bg-purple-100/70 px-2 py-0.5 rounded-full font-bold">📅 Form Date</span>
                </label>
                <input
                  type="date"
                  name="admissionDate"
                  value={formData.admissionDate}
                  readOnly
                  tabIndex={-1}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-100/80 text-slate-800 font-bold focus:outline-none cursor-not-allowed select-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-[#B026B5] to-[#8E1387] hover:opacity-95 shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Step 2: Address &amp; Photo</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STEP 2: Address & Student Photograph
        ════════════════════════════════════════════════════════════════════ */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 border-b border-purple-100 pb-3">
              <span className="w-8 h-8 rounded-xl bg-purple-50 text-[#B026B5] font-extrabold flex items-center justify-center text-sm border border-purple-200">2</span>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Address &amp; Student Photograph</h3>
                <p className="text-xs text-slate-400">Provide complete residential address and upload passport-style photo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">
              {/* Full Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Residential Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={5}
                  maxLength={200}
                  placeholder="Enter complete address with flat/house no., street, city, state & pincode"
                  required
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B026B5]/40 transition-all font-medium resize-none"
                />
                <p className="text-[10px] text-slate-400 mt-0.5 text-right">{formData.address.length}/200 characters</p>
              </div>

              {/* Upload Photo */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Student Photograph
                </label>
                {photoPreview ? (
                  <div className="relative w-36 h-40 rounded-2xl overflow-hidden border-2 border-[#B026B5] shadow-md group">
                    <img src={photoPreview} alt="Student Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold shadow hover:bg-red-700 transition-colors"
                    >
                      ✕
                    </button>
                    <span className="absolute bottom-1 left-1.5 text-[9px] font-bold text-white bg-black/60 px-2 py-0.5 rounded-full">
                      ✓ Uploaded
                    </span>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 hover:border-[#B026B5] rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-purple-50/30 transition-all">
                    <div className="text-3xl mb-1">📷</div>
                    <span className="text-xs font-bold text-slate-600">Upload Photo</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG (Max 10MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2.5 rounded-2xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-[#B026B5] to-[#8E1387] hover:opacity-95 shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Step 3: Course &amp; Batch</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STEP 3: Course & Batch Information
        ════════════════════════════════════════════════════════════════════ */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 border-b border-purple-100 pb-3">
              <span className="w-8 h-8 rounded-xl bg-purple-50 text-[#B026B5] font-extrabold flex items-center justify-center text-sm border border-purple-200">3</span>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Course &amp; Batch Information</h3>
                <p className="text-xs text-slate-400">Select course mode, technology program, fee structure, and preferred batch timing</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Course Mode Selection (Online vs Offline) */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Course Mode <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleModeChange("Online")}
                    className={`py-3 px-4 rounded-xl border text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      formData.courseMode === "Online"
                        ? "border-[#B026B5] bg-purple-50 text-[#B026B5] shadow-sm ring-2 ring-[#B026B5]/20"
                        : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>🌐</span>
                    <span>Online Course</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange("Offline")}
                    className={`py-3 px-4 rounded-xl border text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      formData.courseMode === "Offline"
                        ? "border-[#B026B5] bg-purple-50 text-[#B026B5] shadow-sm ring-2 ring-[#B026B5]/20"
                        : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>🏫</span>
                    <span>Offline Course</span>
                  </button>
                </div>
              </div>

              {/* Option 2: Select Course (Filtered by selected mode) */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Course <span className="text-red-500">*</span>
                </label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleCourseSelect}
                  required
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B026B5]/40 transition-all font-bold text-slate-800 cursor-pointer"
                >
                  <option value="" disabled>Select a course…</option>
                  {availableCourses.map((c) => {
                    const price = formData.courseMode === "Online"
                      ? (c.online_fee ?? c.fee ?? 0)
                      : (c.fee ?? c.online_fee ?? 0);
                    return (
                      <option key={c._id} value={c._id}>
                        {c.courseName} ({c.category?.categoryName || "General"}) — {inr(price)}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Option 3: Price & Course Details - Shown after Course is selected */}
              {formData.courseId ? (
                <>
                  {/* Total Fee (LOCKED / READONLY) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                      <span>Total Fee (₹) <span className="text-red-500">*</span></span>
                      <span className="text-[10px] text-purple-600 bg-purple-100/70 px-2 py-0.5 rounded-full font-bold">🔒 Fixed Fee</span>
                    </label>
                    <input
                      type="text"
                      name="totalFee"
                      value={inr(formData.totalFee)}
                      readOnly
                      tabIndex={-1}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-100/80 text-[#B026B5] font-extrabold focus:outline-none cursor-not-allowed select-none"
                    />
                  </div>

                  {/* Course Duration (LOCKED / READONLY) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                      <span>Course Duration</span>
                      <span className="text-[10px] text-purple-600 bg-purple-100/70 px-2 py-0.5 rounded-full font-bold">🔒 Fixed</span>
                    </label>
                    <input
                      type="text"
                      name="courseDuration"
                      value={formData.courseDuration}
                      readOnly
                      tabIndex={-1}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-100/80 text-slate-700 font-bold focus:outline-none cursor-not-allowed select-none"
                    />
                  </div>

                  {/* Batch Shift/Time */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Batch Shift / Time
                    </label>
                    <select
                      name="batchTime"
                      value={formData.batchTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B026B5]/40 transition-all font-medium cursor-pointer"
                    >
                      <option value="Morning Batch (09:00 AM - 11:00 AM)">Morning Batch (09:00 AM - 11:00 AM)</option>
                      <option value="Mid-Day Batch (11:30 AM - 01:30 PM)">Mid-Day Batch (11:30 AM - 01:30 PM)</option>
                      <option value="Afternoon Batch (02:00 PM - 04:00 PM)">Afternoon Batch (02:00 PM - 04:00 PM)</option>
                      <option value="Evening Batch (05:00 PM - 07:00 PM)">Evening Batch (05:00 PM - 07:00 PM)</option>
                      <option value="Flexible / Weekend">Flexible / Weekend</option>
                    </select>
                  </div>

                  {/* Batch Start Date */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                      <span>Batch Start Date</span>
                      <span className="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded font-semibold">API</span>
                    </label>
                    <input
                      type="text"
                      name="batchStartDate"
                      value={formData.batchStartDate}
                      readOnly
                      tabIndex={-1}
                      title={formData.batchStartDate}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-100/80 text-[#B026B5] font-bold focus:outline-none cursor-not-allowed select-none"
                    />
                  </div>
                </>
              ) : null}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2.5 rounded-2xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-[#B026B5] to-[#8E1387] hover:opacity-95 shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Step 4: Fee Payment</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STEP 4: Fee Payment & Transaction Verification
        ════════════════════════════════════════════════════════════════════ */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 border-b border-purple-100 pb-3">
              <span className="w-8 h-8 rounded-xl bg-purple-50 text-[#B026B5] font-extrabold flex items-center justify-center text-sm border border-purple-200">4</span>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Fee Payment &amp; Transaction Verification</h3>
                <p className="text-xs text-slate-400">Scan UPI QR code, pay fee, and upload payment proof with Transaction ID &amp; UTR</p>
              </div>
            </div>

            {/* QR Code Banner (Bigger, prominent QR code) */}
            <div className="bg-gradient-to-br from-purple-50/80 via-slate-50 to-purple-50/80 border-2 border-purple-200/80 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-sm">
              {/* QR Code */}
              <div className="md:col-span-5 flex flex-col items-center text-center">
                <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-4 border-[#B026B5] shadow-xl bg-white p-2.5 mb-3 transform hover:scale-[1.02] transition-transform">
                  <img src={upiQR} alt="Zint Institute UPI QR Code" className="w-full h-full object-contain rounded-2xl" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#B026B5]/10 border border-[#B026B5]/30">
                  <span className="text-xs font-extrabold text-[#B026B5]">UPI ID: 9111118941@ptsbi</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 mt-1">Scan this QR code using PhonePe, Google Pay, Paytm, BHIM, or any other UPI app to make your payment.</span>
              </div>

              {/* Payment Instructions */}
              <div className="md:col-span-7 space-y-3">
                <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>💳 Payment Steps</span>
                </h4>
                <ol className="text-xs text-slate-600 space-y-2 list-decimal pl-4 leading-relaxed font-medium">
                  <li>Scan the large QR code or use UPI ID <strong className="text-[#B026B5]">9111118941@ptsbi</strong> to pay fee amount of <strong className="text-[#B026B5]">{inr(formData.totalFee)}</strong>.</li>
                  <li>Take a clear screenshot of the completed payment receipt on your mobile app.</li>
                  <li>Upload the screenshot below and enter the <strong>Transaction ID</strong> &amp; <strong>UTR Number</strong>.</li>
                </ol>
              </div>
            </div>

            {/* Upload Payment Screenshot */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Upload Payment Screenshot <span className="text-red-500">*</span>
              </label>
              {screenshotPreview ? (
                <div className="relative max-w-sm h-48 rounded-2xl overflow-hidden border-2 border-[#B026B5] shadow-md group bg-slate-900 flex items-center justify-center">
                  <img src={screenshotPreview} alt="Payment Screenshot Preview" className="max-h-full max-w-full object-contain" />
                  <button
                    type="button"
                    onClick={removeScreenshot}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold shadow hover:bg-red-700 transition-colors"
                  >
                    ✕
                  </button>
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/60 px-2.5 py-0.5 rounded-full">
                    ✓ Screenshot Uploaded
                  </span>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 hover:border-[#B026B5] rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-purple-50/30 transition-all">
                  <div className="text-3xl mb-1">📲</div>
                  <span className="text-xs font-bold text-slate-600">Click to Upload Payment Screenshot</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG (Max 10MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Transaction ID & UTR Number Inputs (Just below upload payment screenshot) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Transaction ID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Transaction ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleChange}
                  placeholder="e.g. T2408271234ABCD"
                  maxLength={30}
                  required
                  className="w-full px-4 py-2.5 text-sm font-mono rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B026B5]/40 transition-all font-bold text-slate-800 tracking-wider"
                />
                <p className="text-[10px] text-slate-400 mt-1 flex justify-between"><span>Alphanumeric only — auto uppercase</span><span>{formData.transactionId.length}/30</span></p>
              </div>

              {/* UTR Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  UTR Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="utrNumber"
                  value={formData.utrNumber}
                  onChange={handleChange}
                  placeholder="e.g. 427812345678"
                  maxLength={30}
                  required
                  className="w-full px-4 py-2.5 text-sm font-mono rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B026B5]/40 transition-all font-bold text-slate-800 tracking-wider"
                />
                <p className="text-[10px] text-slate-400 mt-1 flex justify-between"><span>Alphanumeric only — auto uppercase</span><span>{formData.utrNumber.length}/30</span></p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
              <span>ℹ️</span>
              <span>Please ensure payment screenshot clearly shows both <strong>Transaction ID</strong> and <strong>UTR Number</strong>.</span>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2.5 rounded-2xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-[#B026B5] to-[#8E1387] hover:opacity-95 shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Step 5: Review &amp; Submit</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STEP 5: Review Application & Terms Agreement
        ════════════════════════════════════════════════════════════════════ */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 border-b border-purple-100 pb-3">
              <span className="w-8 h-8 rounded-xl bg-purple-50 text-[#B026B5] font-extrabold flex items-center justify-center text-sm border border-purple-200">5</span>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Review Admission Application</h3>
                <p className="text-xs text-slate-400">Please review all submitted details below before final agreement and submission</p>
              </div>
            </div>

            {/* Review Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Card 1: Personal Details */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 relative">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-xs font-extrabold text-[#B026B5] uppercase tracking-wider">👤 Personal Details</span>
                  <button type="button" onClick={() => setCurrentStep(1)} className="text-[11px] font-bold text-[#B026B5] hover:underline">Edit ✎</button>
                </div>
                <div className="text-xs space-y-1 text-slate-700">
                  <p><strong className="text-slate-900">Application Date:</strong> {formData.admissionDate}</p>
                  <p><strong className="text-slate-900">Student Name:</strong> {formData.studentName}</p>
                  <p><strong className="text-slate-900">Father Name:</strong> {formData.fatherName}</p>
                  <p><strong className="text-slate-900">Email:</strong> {formData.email}</p>
                  <p><strong className="text-slate-900">Mobile:</strong> {formData.mobileNumber} {formData.fatherMobile ? `(Father: ${formData.fatherMobile})` : ""}</p>
                  <p><strong className="text-slate-900">Category &amp; Gender:</strong> {formData.category} · {formData.gender}</p>
                  <p><strong className="text-slate-900">DOB:</strong> {formData.dob}</p>
                </div>
              </div>

              {/* Card 2: Address & Photo */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 relative">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-xs font-extrabold text-[#B026B5] uppercase tracking-wider">🏠 Address &amp; Photo</span>
                  <button type="button" onClick={() => setCurrentStep(2)} className="text-[11px] font-bold text-[#B026B5] hover:underline">Edit ✎</button>
                </div>
                <div className="flex gap-3 text-xs text-slate-700 items-start">
                  <div className="flex-1 space-y-1">
                    <p><strong className="text-slate-900">Full Address:</strong></p>
                    <p className="text-slate-600 bg-white p-2 rounded-xl border border-slate-200 leading-relaxed text-[11px]">{formData.address}</p>
                  </div>
                  {photoPreview && (
                    <div className="w-28 h-36 rounded-xl overflow-hidden border border-purple-300 shrink-0 bg-slate-900 flex items-center justify-center">
                      <img src={photoPreview} alt="Student" className="max-h-full max-w-full object-contain" />
                    </div>
                  )}
                </div>
              </div>

              {/* Card 3: Course & Batch Details */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 relative">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-xs font-extrabold text-[#B026B5] uppercase tracking-wider">📚 Course &amp; Batch</span>
                  <button type="button" onClick={() => setCurrentStep(3)} className="text-[11px] font-bold text-[#B026B5] hover:underline">Edit ✎</button>
                </div>
                <div className="text-xs space-y-1 text-slate-700">
                  <p><strong className="text-slate-900">Course Mode:</strong> <span className="font-bold text-[#B026B5]">{formData.courseMode} Course</span></p>
                  <p><strong className="text-slate-900">Selected Course:</strong> {selectedCourseObj.courseName || "Custom Course"}</p>
                  <p><strong className="text-slate-900">Total Fee:</strong> <span className="font-extrabold text-[#B026B5]">{inr(formData.totalFee)}</span></p>
                  <p><strong className="text-slate-900">Duration:</strong> {formData.courseDuration}</p>
                  <p><strong className="text-slate-900">Batch Shift:</strong> {formData.batchTime}</p>
                  <p><strong className="text-slate-900">Batch Start Date:</strong> <span className="font-bold text-[#B026B5]">{formData.batchStartDate}</span></p>
                </div>
              </div>

              {/* Card 4: Payment Verification */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 relative">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-xs font-extrabold text-[#B026B5] uppercase tracking-wider">💳 Fee Payment Proof</span>
                  <button type="button" onClick={() => setCurrentStep(4)} className="text-[11px] font-bold text-[#B026B5] hover:underline">Edit ✎</button>
                </div>
                <div className="flex gap-3 text-xs text-slate-700 items-start">
                  <div className="flex-1 space-y-1">
                    <p><strong className="text-slate-900">Transaction ID:</strong> <span className="font-mono text-[#B026B5] font-bold">{formData.transactionId}</span></p>
                    <p><strong className="text-slate-900">UTR Number:</strong> <span className="font-mono text-[#53BFEA] font-bold">{formData.utrNumber}</span></p>
                    <p className="text-[10px] text-slate-400">UPI ID: zinstitute@upi</p>
                  </div>
                  {screenshotPreview && (
                    <div className="w-28 h-36 rounded-xl overflow-hidden border border-purple-300 shrink-0 bg-slate-900 flex items-center justify-center">
                      <img src={screenshotPreview} alt="Screenshot" className="max-h-full max-w-full object-contain" />
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* ── Policy Links & Agreement Toggle ── */}
            <div className="bg-gradient-to-r from-purple-50/70 via-slate-50 to-purple-50/70 border-2 border-purple-200/80 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Institute Policies &amp; Agreement
              </h4>

              {/* Policy Badges/Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActivePolicyModal("privacy")}
                  className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 hover:border-[#B026B5] text-xs font-bold text-slate-700 hover:text-[#B026B5] shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🔒 Privacy Policy</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePolicyModal("refund")}
                  className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 hover:border-[#B026B5] text-xs font-bold text-slate-700 hover:text-[#B026B5] shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>💳 Refund &amp; Payment Policy</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePolicyModal("terms")}
                  className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 hover:border-[#B026B5] text-xs font-bold text-slate-700 hover:text-[#B026B5] shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>📜 Terms &amp; Conditions</span>
                </button>
              </div>

              {/* Toggle / Agreement Checkbox */}
              <div className="pt-2 border-t border-purple-100 flex items-start gap-3">
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B026B5]" />
                </label>
                <span
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className="text-xs font-bold text-slate-800 cursor-pointer select-none leading-relaxed"
                >
                  I have read policy and I agree to terms and condition of Zint Institute
                </span>
              </div>
            </div>

            {/* Navigation & Final Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="w-full sm:w-auto px-6 py-2.5 rounded-2xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                ← Edit Payment Details
              </button>

              <button
                type="submit"
                disabled={submitting || !agreedToTerms}
                className={`w-full sm:w-auto px-10 py-3.5 rounded-2xl text-sm font-extrabold text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${agreedToTerms && !submitting
                    ? "bg-gradient-to-r from-[#B026B5] to-[#8E1387] hover:opacity-95 shadow-purple-500/30 hover:scale-[1.01] cursor-pointer"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                  }`}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting Application…
                  </>
                ) : (
                  <>
                    <span>Submit Admission Application</span>
                    <span>🎉</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Render Policy Modal when clicked */}
      {activePolicyModal && (
        <PolicyModal
          type={activePolicyModal}
          onClose={() => setActivePolicyModal(null)}
        />
      )}
    </div>
  );
}

// ─── Choose Your Plan Modal (Exact UI for Course Pricing) ──────────────────────
function ChoosePlanModal({ course, onClose, onBuy, payLoading }) {
  if (!course) return null;

  const onlinePrice = Number(course.online_fee ?? 0);
  const offlinePrice = Number(course.fee ?? 0);

  const hasOnline = onlinePrice > 0;
  const hasOffline = offlinePrice > 0;
  const isFree = !hasOnline && !hasOffline;
  const isBoth = hasOnline && hasOffline;

  const [selectedMode, setSelectedMode] = useState(() => {
    if (hasOffline && !hasOnline) return "Offline";
    return "Online";
  });

  const activePrice = selectedMode === "Online" ? onlinePrice : offlinePrice;
  const originalPrice = Math.round(activePrice * 1.6);
  const features = selectedMode === "Online" ? ONLINE_FEATURES : OFFLINE_FEATURES;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#f8f9fa] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative border border-slate-200 text-slate-800 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-purple-100 hover:text-purple-700 transition-colors text-xl font-bold z-10"
        >
          ✕
        </button>

        <div className="text-center mb-6 pr-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[#B026B5] mb-1">
            {course.courseName}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
            {isBoth ? "Choose Your Plan" : `${selectedMode} Enrollment`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isBoth
              ? "Select the learning mode that suits you best"
              : `This course is offered in ${selectedMode} mode`}
          </p>
        </div>

        {isBoth && (
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center p-1.5 rounded-full bg-slate-200/80 shadow-inner gap-1">
              <button
                type="button"
                onClick={() => setSelectedMode("Online")}
                className={`px-8 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${selectedMode === "Online"
                    ? "bg-white text-[#B026B5] shadow-md"
                    : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                Online
              </button>
              <button
                type="button"
                onClick={() => setSelectedMode("Offline")}
                className={`px-8 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${selectedMode === "Offline"
                    ? "bg-white text-[#B026B5] shadow-md"
                    : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                Offline
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 border-2 border-[#B026B5] shadow-lg mb-6 relative">
          <div className="text-3xl mb-3">{selectedMode === "Online" ? "🌐" : "🏫"}</div>

          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-xl font-bold text-slate-900">{selectedMode} Mode</h3>
            {selectedMode === "Online" && (
              <span className="text-[11px] font-bold px-3 py-0.5 rounded-full text-white bg-[#7c3aed]">
                Recommended
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-extrabold text-slate-900">
              {isFree ? "Free" : inr(activePrice)}
            </span>
            {!isFree && originalPrice > activePrice && (
              <span className="text-lg line-through text-slate-400 font-medium">
                {inr(originalPrice)}
              </span>
            )}
          </div>

          <p className="text-xs text-[#B026B5] font-semibold mb-6">
            {selectedMode === "Online" ? "Registrations close soon" : "Limited campus seats available"}
          </p>

          <button
            type="button"
            disabled={payLoading}
            onClick={() => onBuy(course, isFree ? "free" : selectedMode, activePrice)}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-[#B026B5] hover:bg-[#8f1e92] transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 mb-6"
          >
            {payLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing…
              </>
            ) : isFree ? (
              "Enroll for Free"
            ) : (
              "Buy now"
            )}
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-slate-100">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <Tick />
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-snug">{f.title}</p>
                  <p className="text-[11px] text-slate-500 leading-tight">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isBoth && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center mb-3">
              Price Comparison
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedMode("Online")}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${selectedMode === "Online"
                    ? "bg-purple-50/70 border-[#B026B5] text-[#B026B5]"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:border-purple-300"
                  }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span>🌐</span> Online
                </div>
                <span className="text-sm font-extrabold">{inr(onlinePrice)}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode("Offline")}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${selectedMode === "Offline"
                    ? "bg-purple-50/70 border-[#B026B5] text-[#B026B5]"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:border-purple-300"
                  }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span>🏫</span> Offline
                </div>
                <span className="text-sm font-extrabold">{inr(offlinePrice)}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Course Card Component ───────────────────────────────────────────────────
function CourseCard({ course, enrolled, onViewCourse, onEnroll }) {
  const [hovered, setHovered] = useState(false);
  const title = course.courseName || course.title;
  const thumb = course.courseImage;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-200"
      style={{
        border: `1px solid ${hovered ? "#B026B5" : "#e2e8f0"}`,
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 12px 32px rgba(176,38,181,0.14), 0 2px 8px rgba(0,0,0,0.06)"
          : "0 2px 8px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative h-48 overflow-hidden bg-slate-100">
        {thumb ? (
          <img
            src={thumb}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">📚</div>
        )}

        {enrolled && (
          <span className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-md">
            ✓ Enrolled
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-base font-bold text-slate-900 leading-snug mb-1 line-clamp-2">
          {title}
        </h3>

        <p className="text-xs text-slate-500 mb-4">
          {course?.category?.categoryName || "General"}
          {course.duration ? ` · ${course.duration} Months` : ""}
          {course.mode ? ` · ${course.mode}` : ""}
        </p>

        <div className="mt-auto flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => onViewCourse(course._id)}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:border-purple-400 hover:text-purple-700 bg-white transition-all"
          >
            View Course
          </button>
          <button
            type="button"
            onClick={() => onEnroll(course)}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm"
            style={{
              background: enrolled
                ? "linear-gradient(135deg,#10b981,#059669)"
                : "linear-gradient(135deg,#B026B5,#8E1387)",
            }}
          >
            {enrolled ? "Enrolled ✓" : "Enroll Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function Admission() {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("form"); // "form" | "catalog"
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [modalCourse, setModalCourse] = useState(null);
  const [payLoading, setPayLoading] = useState(false);
  const toastTimer = useRef(null);

  // Redirect guest to login page
  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate("/login?redirect=/OnlineAdmission", { replace: true });
  }, [user, authLoading, navigate]);

  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  // Fetch courses & user enrollments resiliently
  useEffect(() => {
    if (authLoading || !user) return;
    let isMounted = true;

    (async () => {
      setLoading(true);

      // 1. Fetch Courses independently
      let loadedCourses = [];
      try {
        const res = await fetch(`${API}/course/getAllCourse`);
        if (res.ok) {
          const cj = await res.json();
          loadedCourses = cj.courses || cj.data || cj.result || [];
        }
      } catch (err) {
        console.warn("Primary course API fetch failed:", err);
      }

      // Fallback: try alternate endpoint if primary returned empty
      if (loadedCourses.length === 0) {
        try {
          const resAlt = await fetch(`${API}/course`);
          if (resAlt.ok) {
            const cjAlt = await resAlt.json();
            loadedCourses = cjAlt.courses || cjAlt.data || [];
          }
        } catch (e) {
          console.warn("Alternate course API fetch failed:", e);
        }
      }

      if (isMounted) {
        setCourses(loadedCourses);
        setLoading(false);
      }

      // 2. Fetch User Enrollments independently (non-blocking)
      try {
        const enrollRes = await fetch(`${API}/api/enrollments`, { credentials: "include" });
        if (enrollRes.ok) {
          const ej = await enrollRes.json();
          if (isMounted && ej.success) {
            setEnrollments(ej.data || []);
          }
        }
      } catch (err) {
        console.warn("Enrollments fetch failed (non-critical):", err);
      }
    })();

    return () => { isMounted = false; };
  }, [user, authLoading]);

  const enrolledIds = useMemo(() => {
    const s = new Set();
    enrollments.forEach((e) => {
      if (["active", "completed"].includes(e.status)) {
        s.add(e.courseId?._id || e.courseId);
      }
    });
    return s;
  }, [enrollments]);

  // Razorpay Integration
  const openRazorpay = useCallback(({ order, key, courseTitle }) => {
    const options = {
      key,
      amount: order.amount,
      currency: order.currency,
      name: "Zint Institute",
      description: courseTitle,
      order_id: order.id,
      handler: async (response) => {
        showToast("Verifying payment…", "info");
        try {
          const res = await fetch(`${API}/api/payments/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const data = await res.json();
          if (data.success) {
            showToast("Payment successful! You are enrolled 🎉", "success");
            setModalCourse(null);
            const r = await fetch(`${API}/api/enrollments`, { credentials: "include" });
            const d = await r.json();
            setEnrollments(d.success ? d.data : []);
          } else {
            showToast(data.message || "Payment verification failed", "error");
          }
        } catch {
          showToast("Verification failed", "error");
        } finally {
          setPayLoading(false);
        }
      },
      theme: { color: "#B026B5" },
      modal: {
        ondismiss: () => {
          showToast("Payment cancelled. Your enrollment is saved as pending.", "info");
          setPayLoading(false);
        },
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (r) => {
      showToast("Payment failed: " + (r.error?.description || "Unknown error"), "error");
      setPayLoading(false);
    });
    rzp.open();
  }, [showToast]);

  const handleBuyPlan = async (course, mode, price) => {
    if (mode === "free") {
      setPayLoading(true);
      showToast("Enrolling in free course…", "info");
      try {
        const res = await fetch(`${API}/api/payments/enroll-free`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ courseId: course._id }),
        });
        const data = await res.json();
        showToast(data.message, data.success ? "success" : "error");
        if (data.success) {
          setEnrollments((prev) => [...prev, data.data]);
          setModalCourse(null);
        }
      } catch {
        showToast("Enrollment failed", "error");
      } finally {
        setPayLoading(false);
      }
      return;
    }

    setPayLoading(true);
    showToast("Creating order…", "info");
    try {
      const res = await fetch(`${API}/api/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ courseId: course._id, mode, amount: price }),
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.message || "Could not create order.", "error");
        setPayLoading(false);
        return;
      }
      openRazorpay({ order: data.order, key: data.key, courseTitle: course.courseName });
    } catch {
      showToast("Could not initiate payment", "error");
      setPayLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return courses;
    const q = search.toLowerCase();
    return courses.filter(
      (c) =>
        (c.courseName || "").toLowerCase().includes(q) ||
        (c.category?.categoryName || "").toLowerCase().includes(q)
    );
  }, [courses, search]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center text-slate-400">
          <div className="text-4xl mb-3 animate-spin">⏳</div>
          <p className="text-sm">Redirecting…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-bold text-[#B026B5] mb-2">
                <span>🎓 Official Zint Institute Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Online Admission Portal
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Fill in your student details to apply online or browse available courses.
              </p>
            </div>

            {/* User Profile Badge */}
            {user && (
              <div className="flex items-center gap-3 bg-purple-50/70 border border-purple-200/80 rounded-2xl px-4 py-2.5 shrink-0 shadow-xs">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B026B5] to-[#8E1387] text-white flex items-center justify-center font-extrabold text-base shadow-sm">
                  {user.firstName?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-800">{user.firstName} {user.lastName}</div>
                  <div className="text-[11px] text-slate-500">{user.email}</div>
                </div>
              </div>
            )}
          </div>

          {/* Tab Switcher: Online Admission Form vs Course Catalog */}
          <div className="flex items-center gap-2 mt-6 border-b border-slate-200">
            <button
              onClick={() => setActiveTab("form")}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === "form"
                  ? "border-[#B026B5] text-[#B026B5]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
            >
              <span>📝 Online Admission Form</span>
            </button>

            <button
              onClick={() => setActiveTab("catalog")}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === "catalog"
                  ? "border-[#B026B5] text-[#B026B5]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
            >
              <span>📚 Course Catalog & Pricing ({courses.length})</span>
            </button>
          </div>

        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* TAB 1: Online Admission Form */}
        {activeTab === "form" && (
          <OnlineAdmissionForm
            courses={courses}
            user={user}
            onSubmitSuccess={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            showToast={showToast}
          />
        )}

        {/* TAB 2: Course Catalog */}
        {activeTab === "catalog" && (
          <div>
            {/* Search box */}
            <div className="mb-6 relative max-w-md">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses…"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              />
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
                <div className="w-10 h-10 border-4 border-[#B026B5] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-semibold">Loading courses…</p>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="text-5xl">⚠️</div>
                <p className="text-sm text-red-500 font-semibold">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-5 py-2 text-sm font-semibold bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
                <div className="text-5xl">📭</div>
                <p className="text-sm font-medium">
                  {search ? `No courses matching "${search}"` : "No courses available"}
                </p>
                {search && (
                  <button onClick={() => setSearch("")} className="text-[#B026B5] text-xs font-semibold hover:underline">
                    Clear search
                  </button>
                )}
              </div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((c) => (
                  <CourseCard
                    key={c._id}
                    course={c}
                    enrolled={enrolledIds.has(c._id)}
                    onViewCourse={(id) => navigate(`/courses/${id}`)}
                    onEnroll={(course) => setModalCourse(course)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Choose Your Plan Payment Modal */}
      {modalCourse && (
        <ChoosePlanModal
          course={modalCourse}
          onClose={() => setModalCourse(null)}
          onBuy={handleBuyPlan}
          payLoading={payLoading}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
