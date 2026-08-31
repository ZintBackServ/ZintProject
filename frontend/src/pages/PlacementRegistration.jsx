import PlacedStudent from "../components/PlacedStudentSlider"
import { useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../context/DataContext";
import placementImg from "../assets/placementImg2.webp"
import SampleCertificateImg from "../assets/SampleCertificate.webp"


/* ═══════════════════════════════════════════
   ZINT COLOR SYSTEM
   #B026B5  Purple  — primary brand / CTA
   #38BDF8  Sky     — highlights / hover
   #22C55E  Green   — success / trust
   #111827  Dark    — typography / dark sections
   #F8FAFC  Off-white — clean backgrounds
═══════════════════════════════════════════ */

const STATS = [
  { value: "5000+", label: "Students Placed",  color: "#B026B5" },
  { value: "98%",    label: "Placement Rate",    color: "#38BDF8" },
  { value: "500+",   label: "Hiring Partners",   color: "#22C55E" },
  { value: "₹3.6 LPA", label: "Avg. Package",      color: "#B026B5" },
];

const PERKS = [
  { icon: "🎯", title: "Industry-Aligned Curriculum",  desc: "Courses built around what top employers demand right now." },
  { icon: "🤖", title: "AI-Powered Skill Tracking",    desc: "Smart dashboards track your progress and highlight gaps." },
  { icon: "🏆", title: "Mock Interviews & Reviews",    desc: "HR simulations and expert feedback before the real deal." },
  { icon: "🌐", title: "Global Hiring Network",        desc: "Direct referrals to 500+ partner companies worldwide." },
];

/* 
   MAIN PAGE
 */
export default function PlacementPage() {
  const [placedStudents, setPlacedStudents] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [enrollOpen, setEnrollOpen]         = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res  = await fetch(`${import.meta.env.VITE_API_URL}/placedStudent/allPlacedStudent`);
        const data = await res.json();
        /* API shape: { placedStudents: [...] } */
        const list = data.placedStudents || data.data || (Array.isArray(data) ? data : []);
        setPlacedStudents(list);
      } catch (err) {
        console.error("Placement fetch error:", err);
        setPlacedStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen font-sans" style={{ background: "#F8FAFC" }}>
      <HeroSection onEnroll={() => setEnrollOpen(true)} />
      <StatsStrip />
      <PerksSection />
      <PlacedStudent/>
      <BottomCTA onEnroll={() => setEnrollOpen(true)} />
      {enrollOpen && <EnrollModal onClose={() => setEnrollOpen(false)} />}
    </div>
  );
}

/* 
   HERO SECTION
 */
function HeroSection({ onEnroll }) {
  return (
    <section className="relative overflow-hidden" style={{ background: "#F8FAFC" }}>
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.07]"
        style={{ background: "radial-gradient(circle, #B026B5, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #38BDF8, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT — image */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-1 rounded-3xl opacity-70"
              style={{ background: "linear-gradient(135deg, #B026B5, #38BDF8)", borderRadius: "24px" }} />
            <div className="relative rounded-3xl overflow-hidden"
              style={{ boxShadow: "0 24px 60px rgba(176,38,181,0.18)" }}>
              <div className="absolute top-0 left-0 right-0 h-1 z-10"
                style={{ background: "linear-gradient(90deg, #B026B5, #38BDF8)" }} />
              <img
                src={placementImg}
                alt="Placement success"
                className="w-full h-80 lg:h-[460px] object-full"
                onError={e => { e.target.src = "https://placehold.co/700x460/111827/B026B5?text=Placement+Success"; }}
              />
              <div className=" bottom-5 left-5 right-5 rounded-2xl px-5 py-4 backdrop-blur-sm "
                style={{ background: "rgba(17,24,39,0.82)", border: "1px solid rgba(56,189,248,0.25)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(34,197,94,0.2)" }}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#22C55E" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Placement Guarantee</p>
                    <p className="text-xs" style={{ color: "#22C55E" }}>98% of our students get placed within 3 months</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — copy */}
          <div className="order-1 lg:order-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-5 border"
              style={{ background: "rgba(176,38,181,0.08)", color: "#B026B5", borderColor: "rgba(176,38,181,0.22)" }}>
              🚀 Placement Registration Open
            </span>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-2"
              style={{ color: "#111827" }}>
              Placement
            </h1>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-5"
              style={{
                background: "linear-gradient(90deg, #B026B5, #38BDF8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
              Registration
            </h1>

            <h2 className="text-lg font-bold mb-4" style={{ color: "#111827" }}>
              Navigating Placement-Oriented IT Courses
            </h2>

            <div className="space-y-3 mb-8">
              {[
                "Embarking on a journey towards a successful IT career involves strategic skill development. We guide you through the most relevant and placement-oriented courses in the IT sector.",
                "Begin your journey by understanding the current requirements of the IT industry. Explore the in-demand skills and technologies that employers are seeking in prospective candidates.",
                "By completing these programmes, you'll have a comprehensive understanding of courses that align with the demands of the IT job market — enhancing your technical skills and employability.",
              ].map((p, i) => (
                <p key={i} className="text-sm leading-relaxed" style={{ color: "#4b5563" }}>{p}</p>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <PurpleBtn onClick={onEnroll} label="Enroll Now →" />
              <SkyBtn label="Make an Enquiry" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 
   STATS STRIP
 */
function StatsStrip() {
  return (
    <section style={{ background: "#111827" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          {STATS.map((s) => (
            <div key={s.label} className="text-center md:px-6">
              <p className="text-3xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs font-semibold mt-1 uppercase tracking-wide" style={{ color: "#9ca3af" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 
   PERKS SECTION
 */
function PerksSection() {
  return (
    <section className="py-16" style={{ background: "#F8FAFC" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#B026B5" }}>Why Choose Us</p>
          <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: "#111827" }}>
            Everything You Need to Get Placed
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PERKS.map((p, i) => <PerkCard key={i} perk={p} />)}
        </div>
      </div>
    </section>
  );
}

function PerkCard({ perk }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="rounded-2xl p-6 bg-white border transition-all duration-300"
      style={{
        borderColor: hov ? "#38BDF8" : "#e5e7eb",
        boxShadow: hov ? "0 12px 40px rgba(56,189,248,0.12)" : "0 4px 16px rgba(0,0,0,0.05)",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div className="text-3xl mb-4">{perk.icon}</div>
      <h3 className="font-bold text-sm mb-2" style={{ color: "#111827" }}>{perk.title}</h3>
      <p className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>{perk.desc}</p>
    </div>
  );
}

//SAMPLE CERTIFICATE

function SampleCertificate(){
  const [hov, setHov] = useState(false);

  return(
    <section className="relative overflow-hidden py-16" style={{ background: "#F8FAFC" }}>
      {/* decorative background blobs — consistent with HeroSection */}
      <div className="absolute -top-24 -left-24 w-80  h-80 rounded-full pointer-events-none opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #38BDF8, transparent 70%)" }} />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full pointer-events-none opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #B026B5, transparent 70%)" }} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-5 border"
          style={{ background: "rgba(176,38,181,0.08)", color: "#B026B5", borderColor: "rgba(176,38,181,0.22)" }}>
          🏅 Proof of Completion
        </span>

        <h2 className="text-2xl md:text-3xl font-extrabold mb-3" style={{ color: "#111827" }}>
          Earn Your Certificate
        </h2>
        <p className="text-sm md:text-base mb-10 max-w-xl mx-auto" style={{ color: "#6b7280" }}>
          Every student who completes the internship walks away with an industry-recognized certificate — proof of the skills you've built.
        </p>

        {/* image with gradient frame, matches HeroSection treatment */}
        <div className="relative max-w-xl mx-auto">
          <div className="absolute -inset-1 rounded-3xl transition-opacity duration-300"
            style={{
              background: "linear-gradient(135deg, #B026B5, #38BDF8)",
              opacity: hov ? 0.9 : 0.6,
            }} />
          <div className="relative rounded-3xl overflow-hidden transition-transform duration-300"
            style={{
              boxShadow: hov ? "0 28px 70px rgba(176,38,181,0.28)" : "0 20px 50px rgba(176,38,181,0.16)",
              transform: hov ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
            }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}>
            <div className="absolute top-0 left-0 right-0 h-1 z-10"
              style={{ background: "linear-gradient(90deg, #B026B5, #38BDF8)" }} />
            <img
              className="w-full h-auto block"
              src={SampleCertificateImg}
              alt="Sample Certificate"
              onError={e => { e.target.src = "https://placehold.co/700x460/111827/B026B5?text=Sample+Certificate"; }}
            />
            {/* success badge, echoes the HeroSection placement guarantee tag */}
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl px-5 py-3 backdrop-blur-sm"
              style={{ background: "rgba(17,24,39,0.82)", border: "1px solid rgba(34,197,94,0.25)" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(34,197,94,0.2)" }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#22C55E" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-white font-semibold text-xs text-left">
                  Verified &amp; shareable — add it straight to your LinkedIn profile
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Bottom CTA

function BottomCTA({ onEnroll }) {
  return (
    <section className="relative overflow-hidden py-20" style={{ background: "#111827" }}>
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.08]"
        style={{ background: "radial-gradient(circle, #B026B5, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #38BDF8, transparent 70%)" }} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-6 border"
          style={{ background: "rgba(176,38,181,0.15)", color: "#B026B5", borderColor: "rgba(176,38,181,0.35)" }}>
          🚀 Limited Seats Available
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
          Ready to Launch Your IT Career?
        </h2>
        <p className="text-sm md:text-base mb-8 max-w-xl mx-auto" style={{ color: "#9ca3af" }}>
          Join thousands of students who secured top placements with Zint. Register today and take the first step towards your dream job.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <PurpleBtn onClick={onEnroll} label="Enroll Now →" />
          <SkyBtn label="Talk to a Counsellor" />
        </div>
      </div>
    </section>
  );
}

const REGISTER_URL = `${import.meta.env.VITE_API_URL}/placementRegistration/addPlacementRegistration`;
const PROFILE_URL  = `${import.meta.env.VITE_API_URL}/user/me`;

async function safeFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      credentials: "include",
    },
  });
  const raw = await res.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { /* not JSON */ }
  if (!res.ok) throw new Error(data?.msg || `Request failed with status ${res.status}`);
  return data;
}

function EnrollModal({ onClose }) {
  const { data }            = useContext(DataContext);
  const courses             = data?.courses || [];
  const [search, setSearch] = useState("");
  const [selectedCourseName, setSelectedCourseName] = useState(null);
  const [dropOpen, setDropOpen] = useState(false);
  const [form, setForm]     = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]   = useState("");
  const dropRef = useRef(null);

  // ── Login/profile — autofill + lock ──
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
          if (!token) { setProfileLoading(false); return; }
      try {
        const res = await safeFetch(PROFILE_URL);
        const user = res?.data;
        if (user) {
          setIsLoggedIn(true);
          setForm(p => ({
            ...p,
            name: `${user.firstName} ${user.lastName || ""}`.trim(),
            email: user.email || "",
            phone: user.contactNo || "",
          }));
        }
      } catch {
        setIsLoggedIn(false);
      } finally {
        setProfileLoading(false);
      }
    })();
  }, []);

  const filtered = courses.filter(c =>
    c.courseName?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedCourseName) { setError("Please select a course."); return; }
    if (!isLoggedIn && (!form.name.trim() || !form.email.trim() || !form.phone.trim())) {
      setError("Full name, email and phone are required.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = isLoggedIn
        ? { course: selectedCourseName, message: form.message }
        : { course: selectedCourseName, fullName: form.name, email: form.email, phone: form.phone, message: form.message };

      await safeFetch(REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const lockedStyle = { borderColor: "#e5e7eb", color: "#9ca3af", background: "#f3f4f6", cursor: "not-allowed" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(17,24,39,0.75)", backdropFilter: "blur(6px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div className="w-full max-w-xl rounded-3xl overflow-hidden relative"
        style={{ background: "white", boxShadow: "0 32px 80px rgba(0,0,0,0.3)", maxHeight: "90vh", overflowY: "auto" }}>

        <div className="h-1" style={{ background: "linear-gradient(90deg, #B026B5, #38BDF8)" }} />

        <div className="px-7 pt-6 pb-4 flex items-start justify-between">
          <div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full mb-2 inline-block"
              style={{ background: "rgba(176,38,181,0.1)", color: "#B026B5" }}>
              🎓 Placement Programme
            </span>
            <h2 className="text-2xl font-extrabold mt-1" style={{ color: "#111827" }}>Enroll Now</h2>
            <p className="text-sm mt-0.5" style={{ color: "#6b7280" }}>Fill in your details and select a course to get started.</p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 hover:border-gray-400 text-gray-400 hover:text-gray-700 flex-shrink-0 mt-1 transition-all">
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="px-7 pb-10 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "rgba(34,197,94,0.12)" }}>
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="#22C55E" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-extrabold mb-2" style={{ color: "#111827" }}>You're Enrolled! 🎉</h3>
            <p className="text-sm mb-1" style={{ color: "#6b7280" }}>
              Thanks <strong style={{ color: "#111827" }}>{form.name}</strong>! Your registration for
            </p>
            <p className="font-bold text-base mb-4" style={{ color: "#B026B5" }}>{selectedCourseName}</p>
            <p className="text-sm" style={{ color: "#6b7280" }}>
              Our team will contact you on <strong style={{ color: "#111827" }}>{form.phone}</strong> within 24 hours.
            </p>
            <button onClick={onClose}
              className="mt-8 w-full font-bold py-3.5 rounded-xl text-sm text-white"
              style={{ background: "#B026B5" }}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-7 pb-8 space-y-4">

            {isLoggedIn && !profileLoading && (
              <div className="rounded-xl px-4 py-2.5 text-xs" style={{ background: "rgba(56,189,248,0.1)", color: "#0369a1", border: "1px solid rgba(56,189,248,0.3)" }}>
                You're logged in — your name, email and phone are filled in automatically and can't be edited here.
              </div>
            )}

            {/* Course search */}
            <div ref={dropRef}>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#111827" }}>
                Select Course <span style={{ color: "#B026B5" }}>*</span>
              </label>
              <div className="relative">
                <input type="text"
                  placeholder="Search or type a course name…"
                  value={selectedCourseName ? selectedCourseName : search}
                  onChange={e => { setSearch(e.target.value); setSelectedCourseName(null); setDropOpen(true); }}
                  onFocus={() => setDropOpen(true)}
                  className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all duration-200"
                  style={{
                    borderColor: dropOpen ? "#B026B5" : "#e5e7eb",
                    boxShadow: dropOpen ? "0 0 0 3px rgba(176,38,181,0.1)" : "none",
                    color: "#111827",
                  }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {dropOpen && (
                  <div className="absolute z-20 left-0 right-0 top-full mt-1 rounded-xl border border-gray-200 bg-white overflow-hidden"
                    style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.12)", maxHeight: "200px", overflowY: "auto" }}>
                    {filtered.length === 0 ? (
                      <p className="text-xs text-gray-400 px-4 py-3">No courses found for "{search}"</p>
                    ) : (
                      filtered.map(c => (
                        <button key={c._id} type="button"
                          className="w-full text-left px-4 py-2.5 text-sm border-b border-gray-50 last:border-0 transition-all duration-150"
                          style={{ color: "#111827" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(176,38,181,0.06)"; e.currentTarget.style.color = "#B026B5"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#111827"; }}
                          onClick={() => { setSelectedCourseName(c.courseName); setSearch(c.courseName); setDropOpen(false); }}>
                          <span className="font-semibold">{c.courseName}</span>
                          {c.duration && <span className="ml-2 text-xs text-gray-400">· {c.duration}</span>}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <FormField label="Full Name"      required placeholder="Enter your full name"
              value={form.name}    onChange={v => setForm(p => ({ ...p, name: v }))} disabled={isLoggedIn} disabledStyle={lockedStyle} />
            <FormField label="Email Address"  required type="email" placeholder="you@email.com"
              value={form.email}   onChange={v => setForm(p => ({ ...p, email: v }))} disabled={isLoggedIn} disabledStyle={lockedStyle} />
            <FormField label="Phone Number"   required type="tel"   placeholder="+91 98765 43210"
              value={form.phone}   onChange={v => setForm(p => ({ ...p, phone: v }))} disabled={isLoggedIn} disabledStyle={lockedStyle} />

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#111827" }}>
                Message <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <textarea rows={3} placeholder="Any specific queries or goals…"
                value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                className="w-full rounded-xl px-4 py-3 text-sm border outline-none resize-none transition-all duration-200"
                style={{ borderColor: "#e5e7eb", color: "#111827" }}
                onFocus={e => { e.target.style.borderColor = "#B026B5"; e.target.style.boxShadow = "0 0 0 3px rgba(176,38,181,0.1)"; }}
                onBlur={e  => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {error && <p className="text-sm font-medium" style={{ color: "#dc2626" }}>{error}</p>}

            <button type="submit" disabled={submitting}
              className="w-full font-bold py-4 rounded-xl text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
              style={{ background: submitting ? "#9ca3af" : "#B026B5", boxShadow: submitting ? "none" : "0 8px 24px rgba(176,38,181,0.28)" }}>
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" /> Submitting…</>
              ) : "Submit Registration →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ── Form Field ── */
function FormField({ label, required, type = "text", placeholder, value, onChange, disabled, disabledStyle }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#111827" }}>
        {label} {required && <span style={{ color: "#B026B5" }}>*</span>}
      </label>
      <input type={type} required={required} placeholder={placeholder}
        value={value} onChange={e => onChange(e.target.value)}
        disabled={disabled}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all duration-200"
        style={disabled ? disabledStyle : {
          borderColor: focused ? "#B026B5" : "#e5e7eb",
          boxShadow:   focused ? "0 0 0 3px rgba(176,38,181,0.1)" : "none",
          color: "#111827",
        }} />
    </div>
  );
}


// /* ── Form Field ── */
// function FormField({ label, required, type = "text", placeholder, value, onChange }) {
//   const [focused, setFocused] = useState(false);
//   return (
//     <div>
//       <label className="block text-xs font-semibold mb-1.5" style={{ color: "#111827" }}>
//         {label} {required && <span style={{ color: "#B026B5" }}>*</span>}
//       </label>
//       <input type={type} required={required} placeholder={placeholder}
//         value={value} onChange={e => onChange(e.target.value)}
//         onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
//         className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all duration-200"
//         style={{
//           borderColor: focused ? "#B026B5" : "#e5e7eb",
//           boxShadow:   focused ? "0 0 0 3px rgba(176,38,181,0.1)" : "none",
//           color: "#111827",
//         }} />
//     </div>
//   );
// }

/* ── Buttons ── */
function PurpleBtn({ onClick, label }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      className="font-bold px-7 py-3.5 rounded-xl text-sm text-white transition-all duration-200"
      style={{
        background: hov ? "#8f1e92" : "#B026B5",
        boxShadow:  hov ? "0 8px 28px rgba(176,38,181,0.38)" : "0 4px 16px rgba(176,38,181,0.22)",
        transform:  hov ? "translateY(-1px)" : "none",
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {label}
    </button>
  );
}

function SkyBtn({ label }) {
  const [hov, setHov] = useState(false);
  return (
    <button className="font-semibold px-7 py-3.5 rounded-xl text-sm border-2 transition-all duration-200"
      style={{
        color:       hov ? "white"   : "#38BDF8",
        borderColor: "#38BDF8",
        background:  hov ? "#38BDF8" : "white",
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {label}
    </button>
  );
}
