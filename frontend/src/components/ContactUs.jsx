import { useState } from "react";
import {
  FiUser, FiMail, FiPhone, FiBookOpen,
  FiMonitor, FiMessageSquare, FiSend, FiCheck,
  FiArrowRight
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { MdSchool } from "react-icons/md";

const courses = [
  "Full Stack Development",
  "Data Science & ML",
  "DevOps & Cloud",
  "Java Backend",
  "Python Programming",
  "React & Frontend",
  "Cybersecurity",
  "UI/UX Design",
];

const modes = ["Online Live", "Offline Classroom", "Self-Paced", "Hybrid"];

const stats = [
  { value: "5000+", label: "Students Placed" },
  { value: "98%", label: "Recommend Us" },
  { value: "50+", label: "Courses" },
  { value: "17+", label: "Years Experience" },
];

const avatars = [
  { initials: "AR", color: "from-pink-400 to-rose-500" },
  { initials: "SK", color: "from-violet-400 to-purple-600" },
  { initials: "PM", color: "from-amber-400 to-orange-500" },
  { initials: "KN", color: "from-teal-400 to-emerald-500" },
  { initials: "VT", color: "from-blue-400 to-indigo-500" },
];

function InputField({ icon: Icon, label, type = "text", value, onChange, name }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative group">
      <div
        className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none
          ${focused ? "ring-2 ring-violet-500 ring-offset-0" : "ring-1 ring-gray-200 group-hover:ring-gray-300"}`}
      />
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200
        ${focused ? "text-violet-500" : "text-gray-400"}`}>
        <Icon size={17} />
      </div>
      <input
        type={type}
        name={name}
        placeholder={label}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none transition-all duration-200"
      />
    </div>
  );
}

function SelectField({ icon: Icon, label, options, value, onChange, name }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative group">
      <div
        className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none
          ${focused ? "ring-2 ring-violet-500" : "ring-1 ring-gray-200 group-hover:ring-gray-300"}`}
      />
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 pointer-events-none
        ${focused ? "text-violet-500" : "text-gray-400"}`}>
        <Icon size={17} />
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-gray-600 outline-none appearance-none cursor-pointer transition-all duration-200"
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▾</div>
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: "", email: "", mobile: "", course: "", mode: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f4f8] flex items-center justify-center px-4 py-14">

      {/* Outer card */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl shadow-violet-100/60 overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* ── LEFT PANEL ────────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-[#0f0e17] via-[#1c1540] to-[#130e2b] text-white p-10 lg:p-14 flex flex-col justify-between overflow-hidden">

          {/* BG blobs */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-violet-600 rounded-full opacity-10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-10 w-80 h-80 bg-pink-500 rounded-full opacity-10 blur-3xl pointer-events-none" />

          {/* Dot grid */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-violet-300 mb-8">
              <HiSparkles /> Enroll Today
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight mb-4">
              Enroll for a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-violet-400">
                Bright Career
              </span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-10">
              Take the first step toward your dream career. Our expert mentors are ready to guide you through industry-ready programs.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {stats.map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-pink-300">
                    {s.value}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: Avatar row + love note */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {avatars.map((a, i) => (
                  <div
                    key={i}
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${a.color} border-2 border-[#1c1540] flex items-center justify-center text-white text-[11px] font-bold shadow-md`}
                  >
                    {a.initials}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white text-xs font-bold">We love our students</p>
                <p className="text-gray-500 text-[11px]">Join 2801+ success stories</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: Form ─────────────────────────── */}
        <div className="p-10 lg:p-14 flex flex-col justify-center">
          {submitted ? (
            /* Success state */
            <div className="flex flex-col items-center justify-center text-center gap-5 py-12">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                <FiCheck size={36} className="text-emerald-500" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900">You're enrolled!</h2>
              <p className="text-gray-400 text-sm max-w-xs">
                Thanks for reaching out. Our team will contact you within 24 hours.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ fullName: "", email: "", mobile: "", course: "", mode: "", message: "" }); }}
                className="mt-2 px-6 py-2.5 rounded-xl bg-fuchsia-500 text-white text-sm font-semibold hover:bg-fuchsia-700 transition flex items-center gap-2"
              >
                Submit Another <FiArrowRight />
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                  <MdSchool className="text-fuchsia-500 text-xl" />
                  <span className="text-xs font-semibold text-fuchsia-500 uppercase tracking-widest">
                    Free Counselling
                  </span>
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  Get in <span className="text-fuchsia-600">Touch</span>
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Fill in the details and we'll get back to you shortly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField icon={FiUser} label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} />
                  <InputField icon={FiMail} label="Email Address" type="email" name="email" value={form.email} onChange={handleChange} />
                </div>

                {/* Row 2 */}
                <InputField icon={FiPhone} label="Mobile Number" type="tel" name="mobile" value={form.mobile} onChange={handleChange} />

                {/* Row 3 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField icon={FiBookOpen} label="Select Course" options={courses} name="course" value={form.course} onChange={handleChange} />
                  <SelectField icon={FiMonitor} label="Mode of Training" options={modes} name="mode" value={form.mode} onChange={handleChange} />
                </div>

                {/* Textarea */}
                <div className="relative group">
                  <div className="absolute inset-0 rounded-xl ring-1 ring-gray-200 group-hover:ring-gray-300 group-focus-within:ring-2 group-focus-within:ring-fuchsia-500 transition-all duration-300 pointer-events-none" />
                  <FiMessageSquare size={17} className="absolute left-4 top-4 text-gray-400 group-focus-within:text-fuchsia-500 transition-colors duration-200" />
                  <textarea
                    name="message"
                    placeholder="Describe your query or message here..."
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none resize-none transition-all duration-200"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 w-full py-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiSend size={15} /> Submit Enquiry
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-gray-400 mt-1">
                  By submitting you agree to our{" "}
                  <span className="text-fuchsia-500 cursor-pointer hover:underline">Terms</span> &{" "}
                  <span className="text-fuchsia-500 cursor-pointer hover:underline">Privacy Policy</span>
                </p>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
