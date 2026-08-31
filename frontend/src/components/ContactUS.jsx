import { useState, useEffect, useRef } from "react";
import {
  User, Mail, Phone, BookOpen,
  Monitor, MessageSquare, Send, CheckCircle2,
  Sparkles, GraduationCap, ArrowRight, CreditCard,
  Upload, X, QrCode, Copy, Check
} from "lucide-react";
import upiQR from "../assets/zint_upi_qr.jpg";

const COURSE_URL  = `${import.meta.env.VITE_API_URL}/course/getAllCourse`;
const ENQUIRY_URL = `${import.meta.env.VITE_API_URL}/enquiry/addEnquiry`;

const modes = ["Online Live", "Offline Classroom", "Self-Paced", "Hybrid (Online + Offline)"];

const stats = [
  { value: "5,000+", label: "Students Placed" },
  { value: "98%",    label: "Recommend Us" },
  { value: "50+",    label: "Industry Courses" },
  { value: "15+",    label: "Years Experience" },
];

// Tabs
const TABS = [
  { id: "enquiry", label: "Free Enquiry",  icon: MessageSquare },
  { id: "email",   label: "Email Us",      icon: Mail },
  { id: "payment", label: "Fee Payment",   icon: CreditCard },
];

async function safeFetch(url, options) {
  const res = await fetch(url, options);
  const raw = await res.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { /* not JSON */ }
  if (!res.ok) throw new Error(data?.msg || `Request failed with status ${res.status}`);
  return data;
}

// ── Copy-to-clipboard helper ─────────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      title="Copy"
      className="ml-2 p-1 rounded-lg hover:bg-purple-100 transition-colors text-slate-400 hover:text-[#B026B5]"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState("enquiry");

  // ── Enquiry Form state ──
  const [form, setForm] = useState({
    fullName: "", email: "", mobile: "", course: "", mode: "", message: "",
  });
  const [courses, setCourses]               = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [submitted, setSubmitted]           = useState(false);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState(null);

  // ── Payment Form state ──
  const [paymentForm, setPaymentForm] = useState({
    studentName: "", studentEmail: "", studentMobile: "",
    courseName: "", amount: "",
    transactionId: "", utrNumber: "",
  });
  const [screenshotFile,    setScreenshotFile]    = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [paySubmitted,      setPaySubmitted]      = useState(false);
  const [payLoading,        setPayLoading]        = useState(false);
  const [payError,          setPayError]          = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await safeFetch(COURSE_URL);
        const list = data?.courses || data?.data || [];
        setCourses(list.map(c => ({ value: c._id, label: c.courseName })));
      } catch (err) {
        console.error("Failed to load courses:", err);
        setCourses([]);
      } finally {
        setCoursesLoading(false);
      }
    })();
  }, []);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await safeFetch(ENQUIRY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Screenshot upload ──
  const handleScreenshot = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setPayError("Screenshot must be less than 10 MB.");
      return;
    }
    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setScreenshotPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    setPayError(null);
    if (!screenshotFile) { setPayError("Please upload your payment screenshot."); return; }
    if (!paymentForm.transactionId.trim()) { setPayError("Please enter Transaction ID."); return; }
    if (!paymentForm.utrNumber.trim()) { setPayError("Please enter UTR Number."); return; }
    setPayLoading(true);
    // Simulate submission (replace with actual API call)
    await new Promise(r => setTimeout(r, 1200));
    setPayLoading(false);
    setPaySubmitted(true);
  };

  const UPI_ID = "zinstitute@upi";
  const ADMIN_EMAIL = "info@zinstitute.in";

  return (
    <section className="bg-[#F7F5FA] py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-center">

      {/* Outer Card */}
      <div className="w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12">

        {/* ── LEFT PANEL (5 cols) ── */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#180324] via-[#2a063d] to-[#12021c] text-white p-6 sm:p-7 lg:p-8 flex flex-col justify-between relative overflow-hidden">

          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 bg-[#B11FA8]/20 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 w-64 h-64 bg-[#53BFEA]/15 rounded-full blur-3xl" />

          <div className="relative z-10">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold uppercase tracking-wider text-purple-200 mb-3 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-pink-400" />
              <span>Admissions Open</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black leading-tight tracking-tight mb-2">
              Take The First Step Toward Your{" "}
              <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-[#53BFEA] bg-clip-text text-transparent">
                Dream Tech Career
              </span>
            </h2>

            <p className="text-slate-300 text-xs leading-relaxed mb-4">
              Speak with our senior academic counselors to choose the right technology program tailored to your goals and background.
            </p>

            {/* Quick Highlights Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {stats.map((s, idx) => (
                <div key={idx} className="rounded-xl bg-white/[0.05] border border-white/10 p-2.5 backdrop-blur-sm">
                  <p className="text-base font-black text-white">{s.value}</p>
                  <p className="text-[10px] font-medium text-purple-200 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Contact Info Chips */}
            <div className="flex flex-col gap-2 mt-2">
              <a href="mailto:info@zinstitute.in" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.07] border border-white/10 hover:bg-white/10 transition-colors group">
                <Mail className="h-3.5 w-3.5 text-[#53BFEA] shrink-0" />
                <span className="text-xs text-purple-100 group-hover:text-white transition-colors truncate">info@zinstitute.in</span>
              </a>
              <a href="tel:+918965975222" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.07] border border-white/10 hover:bg-white/10 transition-colors group">
                <Phone className="h-3.5 w-3.5 text-[#53BFEA] shrink-0" />
                <span className="text-xs text-purple-100 group-hover:text-white transition-colors">+91 89659 75222</span>
              </a>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.07] border border-white/10">
                <QrCode className="h-3.5 w-3.5 text-[#53BFEA] shrink-0" />
                <span className="text-xs text-purple-100">UPI: {UPI_ID}</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/10 mt-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["AR", "SK", "PM", "VT"].map((init, i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#8E1387] to-[#53BFEA] border-2 border-[#180324] flex items-center justify-center text-[10px] font-bold text-white shadow"
                  >
                    {init}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold text-white">Join 5,000+ Enrolled Students</p>
                <p className="text-[11px] text-purple-300">100% Placement &amp; Internship Support</p>
              </div>
            </div>
          </div>

        </div>

        {/* ── RIGHT PANEL (7 cols) ── */}
        <div className="lg:col-span-7 flex flex-col bg-white">

          {/* Tab Switcher */}
          <div className="flex border-b border-slate-100">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-[11px] sm:text-xs font-bold transition-all border-b-2 ${
                    active
                      ? "border-[#B026B5] text-[#B026B5] bg-purple-50/50"
                      : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden sm:block">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-5 sm:p-6 lg:p-7 flex-1 flex flex-col justify-center">

            {/* ═══════════════════════════════════
                TAB 1 — Free Enquiry Form
            ═══════════════════════════════════ */}
            {activeTab === "enquiry" && (
              submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-9 w-9 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Enquiry Submitted!</h3>
                  <p className="text-slate-600 text-sm max-w-sm mb-6">
                    Our academic counselor will reach out to you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ fullName: "", email: "", mobile: "", course: "", mode: "", message: "" }); }}
                    className="px-6 py-2.5 rounded-full bg-[#8E1387] text-white text-xs font-bold shadow hover:bg-[#B11FA8] transition-colors flex items-center gap-2"
                  >
                    Submit Another <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <GraduationCap className="h-4 w-4 text-[#8E1387]" />
                      <span className="text-[11px] font-bold text-[#8E1387] uppercase tracking-wider">Free Consultation</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Book A Free Demo &amp; Counseling
                    </h3>
                    <p className="text-slate-500 text-xs mt-0.5">Fill in your details and our team will get back to you promptly.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><User className="h-4 w-4" /></div>
                        <input id="contactFullName" type="text" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} autoComplete="name" required className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#B11FA8] focus:ring-2 focus:ring-[#B11FA8]/20 transition-all" />
                      </div>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Mail className="h-4 w-4" /></div>
                        <input id="contactEmail" type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} autoComplete="email" required className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#B11FA8] focus:ring-2 focus:ring-[#B11FA8]/20 transition-all" />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Phone className="h-4 w-4" /></div>
                      <input id="contactMobile" type="tel" name="mobile" placeholder="Phone Number (e.g. +91 9876543210)" value={form.mobile} onChange={handleChange} autoComplete="tel" required className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#B11FA8] focus:ring-2 focus:ring-[#B11FA8]/20 transition-all" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><BookOpen className="h-4 w-4" /></div>
                        <select id="contactCourse" name="course" aria-label="Select Course" value={form.course} onChange={handleChange} required className="w-full pl-10 pr-8 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:border-[#B11FA8] focus:ring-2 focus:ring-[#B11FA8]/20 appearance-none cursor-pointer transition-all">
                          <option value="">{coursesLoading ? "Loading courses..." : "Select Course"}</option>
                          {courses.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                      </div>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Monitor className="h-4 w-4" /></div>
                        <select id="contactMode" name="mode" aria-label="Preferred Mode" value={form.mode} onChange={handleChange} required className="w-full pl-10 pr-8 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:border-[#B11FA8] focus:ring-2 focus:ring-[#B11FA8]/20 appearance-none cursor-pointer transition-all">
                          <option value="">Preferred Mode</option>
                          {modes.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none"><MessageSquare className="h-4 w-4" /></div>
                      <textarea name="message" rows={3} placeholder="Any specific queries or background details..." value={form.message} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#B11FA8] focus:ring-2 focus:ring-[#B11FA8]/20 resize-none transition-all" />
                    </div>

                    {error && <p className="text-rose-600 text-xs font-semibold text-center">{error}</p>}

                    <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#8E1387] to-[#B11FA8] shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                      {loading ? (
                        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Submitting...</span></>
                      ) : (
                        <><Send className="h-4 w-4" /><span>Submit Free Application</span></>
                      )}
                    </button>

                    <p className="text-center text-[11px] text-slate-400">🔒 Your information is confidential and will never be shared.</p>
                  </form>
                </>
              )
            )}

            {/* ═══════════════════════════════════
                TAB 2 — Email Us
            ═══════════════════════════════════ */}
            {activeTab === "email" && (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Mail className="h-4 w-4 text-[#8E1387]" />
                    <span className="text-[11px] font-bold text-[#8E1387] uppercase tracking-wider">Direct Email Contact</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Reach Us By Email
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">We respond to all emails within 4–8 business hours.</p>
                </div>

                {/* Primary Email */}
                <div className="bg-gradient-to-r from-purple-50 to-[#53BFEA]/10 border border-purple-200/60 rounded-2xl p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Primary Contact</p>
                  <div className="flex items-center">
                    <a href="mailto:info@zinstitute.in" className="text-lg sm:text-xl font-black text-[#B026B5] hover:underline tracking-tight">
                      info@zinstitute.in
                    </a>
                    <CopyButton text={ADMIN_EMAIL} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">For admissions, courses, and general queries</p>
                </div>

                {/* Email Purposes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: "🎓", label: "Admissions",        desc: "Course enrollment & fee info",        email: "info@zinstitute.in" },
                    { icon: "💳", label: "Fee Payment",       desc: "Payment confirmation & receipts",     email: "info@zinstitute.in" },
                    { icon: "📋", label: "Placement Support", desc: "Internship & job queries",            email: "info@zinstitute.in" },
                    { icon: "🛠️", label: "Technical Issues",  desc: "Portal access & technical help",     email: "info@zinstitute.in" },
                  ].map(item => (
                    <a key={item.label} href={`mailto:${item.email}?subject=${encodeURIComponent(item.label + " - Query")}`}
                      className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-[#B026B5]/40 hover:bg-purple-50/40 transition-all group"
                    >
                      <span className="text-xl leading-none mt-0.5">{item.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-[#B026B5] transition-colors">{item.label}</p>
                        <p className="text-[11px] text-slate-400 truncate">{item.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Direct Compose Button */}
                <a
                  href="mailto:info@zinstitute.in?subject=Inquiry from Website"
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#8E1387] to-[#B11FA8] shadow-lg hover:shadow-purple-900/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Open Email Composer
                </a>

                <p className="text-center text-[11px] text-slate-400">
                  📬 Expected reply time: Within 4–8 hours (Mon–Sat, 9AM–7PM)
                </p>
              </div>
            )}

            {/* ═══════════════════════════════════
                TAB 3 — Fee Payment
            ═══════════════════════════════════ */}
            {activeTab === "payment" && (
              paySubmitted ? (
                <div className="flex flex-col items-center justify-center text-center py-8 gap-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="h-9 w-9 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Payment Details Submitted!</h3>
                  <p className="text-slate-500 text-sm max-w-sm">
                    Our team will verify your payment within 24 hours and confirm your enrollment via email or phone.
                  </p>
                  <button
                    onClick={() => { setPaySubmitted(false); setPaymentForm({ studentName:"",studentEmail:"",studentMobile:"",courseName:"",amount:"",transactionId:"",utrNumber:"" }); removeScreenshot(); }}
                    className="px-6 py-2.5 rounded-full bg-[#8E1387] text-white text-xs font-bold shadow hover:bg-[#B11FA8] transition-colors flex items-center gap-2"
                  >
                    Submit Another <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <CreditCard className="h-4 w-4 text-[#8E1387]" />
                      <span className="text-[11px] font-bold text-[#8E1387] uppercase tracking-wider">Secure Fee Payment</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Pay Fee via UPI & Submit Proof</h3>
                    <p className="text-slate-500 text-xs mt-0.5">Scan the QR below, pay, then fill the form with your transaction details.</p>
                  </div>

                  {/* QR Code + UPI ID */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    {/* QR Image */}
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="rounded-2xl border-2 border-[#B026B5]/30 shadow-lg shadow-purple-200/40 overflow-hidden w-36 h-36 sm:w-40 sm:h-40">
                        <img src={upiQR} alt="Zint Institute UPI QR Code" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Scan to Pay</p>
                    </div>

                    {/* Payment options */}
                    <div className="flex-1 space-y-2.5">
                      {/* UPI ID */}
                      <div className="bg-purple-50/70 border border-purple-200/60 rounded-xl p-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">UPI ID</p>
                        <div className="flex items-center">
                          <span className="text-sm font-black text-[#B026B5]">{UPI_ID}</span>
                          <CopyButton text={UPI_ID} />
                        </div>
                      </div>

                      {/* Accepted Apps */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Accepted via</p>
                        <div className="flex flex-wrap gap-1.5">
                          {["📱 PhonePe", "💳 GPay", "🟦 Paytm", "🔵 BHIM", "🏦 Net Banking"].map(app => (
                            <span key={app} className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] font-semibold text-slate-600">{app}</span>
                          ))}
                        </div>
                      </div>

                      {/* Important note */}
                      <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-2.5">
                        <p className="text-[11px] text-amber-700 font-semibold">
                          ⚠️ After payment, upload the screenshot below with <strong>Transaction ID</strong> and <strong>UTR Number</strong> clearly visible.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details Form */}
                  <form onSubmit={handlePaySubmit} className="space-y-2.5 pt-2 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Step 2 — Submit Payment Proof</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><User className="h-4 w-4" /></div>
                        <input id="paymentStudentName" name="studentName" type="text" placeholder="Student Full Name" value={paymentForm.studentName} onChange={e => setPaymentForm(p=>({...p, studentName: e.target.value}))} autoComplete="name" required className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#B11FA8] focus:ring-2 focus:ring-[#B11FA8]/20 transition-all" />
                      </div>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Phone className="h-4 w-4" /></div>
                        <input id="paymentStudentMobile" name="studentMobile" type="tel" placeholder="Mobile Number" value={paymentForm.studentMobile} onChange={e => setPaymentForm(p=>({...p, studentMobile: e.target.value}))} autoComplete="tel" required className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#B11FA8] focus:ring-2 focus:ring-[#B11FA8]/20 transition-all" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Mail className="h-4 w-4" /></div>
                        <input id="paymentStudentEmail" name="studentEmail" type="email" placeholder="Email Address" value={paymentForm.studentEmail} onChange={e => setPaymentForm(p=>({...p, studentEmail: e.target.value}))} autoComplete="email" required className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#B11FA8] focus:ring-2 focus:ring-[#B11FA8]/20 transition-all" />
                      </div>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><BookOpen className="h-4 w-4" /></div>
                        <input id="paymentCourseName" name="courseName" type="text" placeholder="Course Name" value={paymentForm.courseName} onChange={e => setPaymentForm(p=>({...p, courseName: e.target.value}))} required className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#B11FA8] focus:ring-2 focus:ring-[#B11FA8]/20 transition-all" />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><span className="text-sm font-black">₹</span></div>
                      <input id="paymentAmount" name="amount" type="number" placeholder="Amount Paid (₹)" value={paymentForm.amount} onChange={e => setPaymentForm(p=>({...p, amount: e.target.value}))} required className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#B11FA8] focus:ring-2 focus:ring-[#B11FA8]/20 transition-all" />
                    </div>

                    {/* Transaction ID & UTR */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label htmlFor="paymentTransactionId" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">
                          Transaction ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="paymentTransactionId"
                          name="transactionId"
                          type="text"
                          placeholder="e.g. T2408271234ABCD"
                          value={paymentForm.transactionId}
                          onChange={e => setPaymentForm(p=>({...p, transactionId: e.target.value}))}
                          required
                          className="w-full px-4 py-2.5 rounded-xl border-2 border-[#B026B5]/30 bg-purple-50/30 text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#B026B5] focus:ring-2 focus:ring-[#B026B5]/20 transition-all"
                        />
                        <p className="text-[10px] text-slate-400 mt-0.5 ml-1">Found in your payment app after transaction</p>
                      </div>
                      <div>
                        <label htmlFor="paymentUtrNumber" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">
                          UTR Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="paymentUtrNumber"
                          name="utrNumber"
                          type="text"
                          placeholder="e.g. 427812345678"
                          value={paymentForm.utrNumber}
                          onChange={e => setPaymentForm(p=>({...p, utrNumber: e.target.value}))}
                          required
                          className="w-full px-4 py-2.5 rounded-xl border-2 border-[#53BFEA]/40 bg-sky-50/30 text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#53BFEA] focus:ring-2 focus:ring-[#53BFEA]/20 transition-all"
                        />
                        <p className="text-[10px] text-slate-400 mt-0.5 ml-1">Unique Transaction Reference from your bank</p>
                      </div>
                    </div>

                    {/* Screenshot Upload */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                        Payment Screenshot <span className="text-red-500">*</span>
                        <span className="text-slate-400 normal-case font-normal ml-1">(Must clearly show Transaction ID & UTR)</span>
                      </label>

                      {screenshotPreview ? (
                        <div className="relative rounded-2xl border-2 border-emerald-400/50 bg-emerald-50/30 overflow-hidden">
                          <img
                            src={screenshotPreview}
                            alt="Payment screenshot"
                            className="w-full max-h-52 object-contain bg-white"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end justify-between p-3">
                            <div>
                              <span className="text-[10px] font-bold text-white bg-emerald-600/80 px-2 py-0.5 rounded-full">✓ Screenshot uploaded</span>
                              <p className="text-[10px] text-white/80 mt-0.5">{screenshotFile?.name}</p>
                            </div>
                            <button
                              type="button"
                              onClick={removeScreenshot}
                              className="p-1.5 rounded-full bg-white/90 hover:bg-red-100 text-slate-600 hover:text-red-600 transition-colors shadow"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-300 hover:border-[#B026B5] rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-purple-50/30 transition-all group">
                          <Upload className="h-6 w-6 text-slate-400 group-hover:text-[#B026B5] transition-colors mb-1.5" />
                          <span className="text-xs font-bold text-slate-600 group-hover:text-[#B026B5] transition-colors">Click to Upload Payment Screenshot</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WebP — max 10MB</span>
                          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleScreenshot} className="hidden" />
                        </label>
                      )}
                    </div>

                    {payError && <p className="text-rose-600 text-xs font-semibold text-center">{payError}</p>}

                    <button
                      type="submit"
                      disabled={payLoading}
                      className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#8E1387] to-[#B11FA8] shadow-lg hover:shadow-purple-900/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {payLoading ? (
                        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Submitting...</span></>
                      ) : (
                        <><Send className="h-4 w-4" /><span>Submit Payment Proof</span></>
                      )}
                    </button>

                    <p className="text-center text-[11px] text-slate-400">
                      🔒 Your payment details are encrypted and secure. Enrollment confirmed within 24 hours.
                    </p>
                  </form>
                </div>
              )
            )}

          </div>
        </div>

      </div>
    </section>
  );
}