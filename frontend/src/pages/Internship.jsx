import { useState, useEffect, useRef } from "react";

const technologies = [
  { name: "Artificial Intelligence", icon: "🤖", color: "from-violet-500 to-purple-600" },
  { name: "Generative AI", icon: "✨", color: "from-pink-500 to-rose-600" },
  { name: "Machine Learning", icon: "🧠", color: "from-blue-500 to-cyan-600" },
  { name: "MERN Stack", icon: "MERN", color: "from-green-300 to-indigo-400" },
  { name: "Data Analytics", icon: "📊", color: "from-emerald-500 to-teal-600" },
  { name: "Java FullStack", icon: "Java", color: "from-blue-300 to-red-300" },
  { name: "Python & EDA", icon: "🐍", color: "from-amber-500 to-orange-600" },
];

const benefits = [
  { icon: "🏛️", title: "Govt. Recognized", desc: "SSC NASSCOM certified certificate accepted nationwide" },
  { icon: "👨‍💼", title: "Industry Experts", desc: "Learn from working professionals with 10+ years experience" },
  { icon: "💼", title: "Live Projects", desc: "Hands-on experience with real-world industry projects" },
  { icon: "🎓", title: "Placement Support", desc: "Resume building, mock interviews & job referrals" },
  { icon: "🤝", title: "Mentorship", desc: "1-on-1 guidance from dedicated mentors throughout" },
  { icon: "📜", title: "Certificate", desc: "Verifiable digital certificate upon completion" },
];

const eligibility = ["School", "BE / B.Tech", "M.Tech", "BCA", "MCA", "BBA", "MBA","B.Com","B.Sc", "Others"];

const duration = ["30 Days", "45 Days", "60 Days", "90 Days"];

const stats = [
  { value: "5000+", label: "Alumni" },
  { value: "98%", label: "Satisfaction" },
  { value: "30", label: "Days" },
  { value: "500+", label: "Companies" },
];

function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const num = parseInt(target.replace(/\D/g, ""));
    let current = 0;
    const step = Math.ceil(num / 60);
    const timer = setInterval(() => {
      current += step;
      if (current >= num) { setCount(num); clearInterval(timer); }
      else setCount(current);
    }, 25);
    return () => clearInterval(timer);
  }, [started, target]);

  return <span ref={ref}>{count}{suffix || target.replace(/[0-9]/g, "")}</span>;
}

export default function ZInstituteInternship() {
  const [hoveredTech, setHoveredTech] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", degree: "", tech: "" });
  const formRef = useRef(null);

  const scrollToForm = () => {
    setFormOpen(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.phone) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#C94CC2] text-white font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .display { font-family: 'Syne', sans-serif; }
        .glow { box-shadow: 0 0 40px rgba(99,102,241,0.4), 0 0 80px rgba(99,102,241,0.15); }
        .glow-pink { box-shadow: 0 0 40px rgba(236,72,153,0.4); }
        .card-glow:hover { box-shadow: 0 0 30px rgba(99,102,241,0.3); transform: translateY(-4px); }
        .shimmer { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent); background-size: 200% 100%; animation: shimmer 2.5s infinite; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .float { animation: float 6s ease-in-out infinite; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .pulse-ring { animation: pulseRing 2s ease-out infinite; }
        @keyframes pulseRing { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.6);opacity:0} }
        .orbit { animation: orbit 20s linear infinite; }
        @keyframes orbit { from{transform:rotate(0deg) translateX(120px) rotate(0deg)} to{transform:rotate(360deg) translateX(120px) rotate(-360deg)} }
        .orbit2 { animation: orbit 14s linear infinite reverse; }
        @keyframes orbit2 { from{transform:rotate(0deg) translateX(80px) rotate(0deg)} to{transform:rotate(360deg) translateX(80px) rotate(-360deg)} }
        .tag-pill { transition: all 0.25s; }
        .tag-pill:hover { transform: scale(1.08); }
        .btn-main { background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899); position: relative; overflow: hidden; }
        .btn-main::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,#818cf8,#c084fc,#f472b6); opacity:0; transition:opacity 0.3s; }
        .btn-main:hover::before { opacity:1; }
        .btn-main span { position: relative; z-index:1; }
        .noise { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"); }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Background mesh */}
        <div className="absolute inset-0 noise pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-pink-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute top-20 left-10 w-[300px] h-[300px] rounded-full bg-violet-600/8 blur-[80px] pointer-events-none" />

        {/* Orbital elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 pointer-events-none hidden lg:block">
          <div className="orbit w-3 h-3 bg-indigo-400/50 rounded-full blur-sm" />
          <div className="orbit2 w-2 h-2 bg-pink-400/50 rounded-full blur-sm" style={{animationDelay:'-5s'}} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto pt-20">
      
          <h1 className="display text-5xl sm:text-6xl lg:text-8xl font-800 leading-none tracking-tight mb-6">
            <span className="block text-white">Launch Your</span>
            <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">Tech Career</span>
            <span className="block text-white text-4xl sm:text-5xl lg:text-6xl font-600 mt-2">in 30 Days</span>
          </h1>

          <p className="text-white/50 text-lg sm:text-xl max-w-2xl mx-auto mb-10 font-300 leading-relaxed">
            India's most immersive training & project-based internship program. Work on real AI projects, get industry mentorship, and land your dream job.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={scrollToForm}
              className="btn-main text-white font-600 text-lg px-10 py-4 rounded-2xl transition-all duration-300 hover:scale-105 glow"
            >
              <span className="flex items-center gap-2">🚀 Register for Internship</span>
            </button>
            <div className="text-white/40 text-sm">No cost to apply · Results in 24h</div>
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
            {stats.map((s) => (
              <div key={s.label} className="bg-[#050510]/80 px-6 py-5 text-center">
                <div className="display text-3xl font-800 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                  <AnimatedCounter target={s.value} />
                </div>
                <div className="text-white/40 text-xs mt-1 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 text-xs float">
          <span>Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-400 text-sm uppercase tracking-widest font-500 mb-3">What You'll Master</p>
            <h2 className="display text-4xl sm:text-5xl font-800 text-white">
              Cutting-Edge <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Technologies</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {technologies.map((tech, i) => (
              <div
                key={tech.name}
                className="group relative bg-white/[0.03] border border-white/8 rounded-2xl p-6 cursor-pointer card-glow transition-all duration-300"
                style={{animationDelay:`${i*0.1}s`}}
                onMouseEnter={() => setHoveredTech(i)}
                onMouseLeave={() => setHoveredTech(null)}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-[0.07] transition-opacity duration-300`} />
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                  {tech.icon}
                </div>
                <h3 className="display text-xl font-700 text-white mb-2">{tech.name}</h3>
                <div className={`h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${tech.color} rounded-full transition-all duration-500`} />
                <p className="text-white/40 text-sm mt-3">
                  Industry-aligned curriculum with hands-on project work and expert-led sessions.
                </p>
              </div>
            ))}
            {/* Extra CTA card */}
            <div className="bg-gradient-to-br from-indigo-600/20 to-pink-600/20 border border-indigo-500/20 rounded-2xl p-6 flex flex-col justify-between lg:col-span-1 sm:col-span-2 lg:col-span-0">
              <div>
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="display text-xl font-700 text-white mb-2">Your Pick</h3>
                <p className="text-white/50 text-sm">Choose the track that aligns with your career goals.</p>
              </div>
              <button onClick={scrollToForm} className="mt-6 btn-main text-white text-sm font-600 px-5 py-2.5 rounded-xl w-full">
                <span>Explore All Tracks →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-pink-400 text-sm uppercase tracking-widest font-500 mb-3">Why Zint Institute</p>
            <h2 className="display text-4xl sm:text-5xl font-800 text-white">
              Everything You <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Need to Succeed</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div key={b.title} className="group bg-white/[0.03] border border-white/8 rounded-2xl p-6 card-glow transition-all duration-300 hover:border-white/15">
                <div className="text-3xl mb-4">{b.icon}</div>
                <h3 className="display text-lg font-700 text-white mb-2">{b.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility + Duration Banner */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-indigo-900/40 to-violet-900/30 border border-indigo-500/20 rounded-3xl p-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/10 rounded-full blur-[60px]" />
            <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start lg:items-center justify-between">
              <div>
                <p className="text-indigo-300 text-sm uppercase tracking-widest font-500 mb-4">Exclusively for</p>
                <div className="flex flex-wrap gap-2">
                  {eligibility.map((e) => (
                    <span key={e} className="tag-pill bg-white/8 border border-white/12 text-white/80 text-sm px-4 py-1.5 rounded-full">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 text-center lg:text-right">
                <div className="display text-7xl font-800 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">30</div>
                <div className="text-white/50 text-lg font-300 tracking-widest uppercase -mt-1">Days</div>
                <div className="text-white/30 text-xs mt-1">Intensive Program</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline / Process */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 text-sm uppercase tracking-widest font-500 mb-3">Your Journey</p>
            <h2 className="display text-4xl sm:text-5xl font-800 text-white">
              30-Day <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Roadmap</span>
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-violet-500 to-pink-500 opacity-30" />
            {[
              { day: "Day 1–5", title: "Foundations", desc: "Setup dev environment, Python basics, AI/ML fundamentals and core concepts.", color: "bg-indigo-500" },
              { day: "Day 6–12", title: "Deep Dive", desc: "Generative AI models, Data pipelines, EDA techniques and visualization.", color: "bg-violet-500" },
              { day: "Day 13–22", title: "Project Build", desc: "Hands-on real-world project with live industry data and mentorship sessions.", color: "bg-pink-500" },
              { day: "Day 23–28", title: "Polish & Present", desc: "Code reviews, documentation, portfolio building and project presentation.", color: "bg-rose-500" },
              { day: "Day 29–30", title: "Certification", desc: "Final assessment, SSC NASSCOM certificate issuance and placement guidance.", color: "bg-amber-500" },
            ].map((step, i) => (
              <div key={step.day} className="relative flex gap-6 mb-8 pl-14">
                <div className={`absolute left-3.5 top-2 w-5 h-5 rounded-full ${step.color} -translate-x-1/2 flex items-center justify-center`}>
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <div className="flex-1 bg-white/[0.03] border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all duration-300">
                  <span className="text-xs text-white/35 uppercase tracking-widest">{step.day}</span>
                  <h3 className="display text-lg font-700 text-white mt-1 mb-1">{step.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section ref={formRef} className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/25 text-pink-300 text-xs font-medium px-4 py-2 rounded-full mb-6">
              <span>🎯</span> Limited Seats Available
            </div>
            <h2 className="display text-4xl sm:text-5xl font-800 text-white mb-4">
              Start Your <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">Journey</span>
            </h2>
            <p className="text-white/40 text-base">Fill in your details and our team will contact you within 24 hours.</p>
          </div>

          {!submitted ? (
            <div className="bg-white/[0.04] border border-white/8 rounded-3xl p-8 backdrop-blur-sm">
              <div className="space-y-5">
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/25 rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500/60 transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Email Address *</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/25 rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500/60 transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/25 rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500/60 transition-colors duration-200"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-white/60 text-sm mb-2 block">Degree</label>
                    <select
                      value={form.degree}
                      onChange={e => setForm({...form, degree: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 text-white/70 rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500/60 transition-colors duration-200"
                    >
                      <option value="" className="bg-gray-900">Select Degree</option>
                      {eligibility.map(e => <option key={e} value={e} className="bg-gray-900">{e}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-2 block">Technology</label>
                    <select
                      value={form.tech}
                      onChange={e => setForm({...form, tech: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 text-white/70 rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500/60 transition-colors duration-200"
                    >
                      <option value="" className="bg-gray-900">Select Tech</option>
                      {technologies.map(t => <option key={t.name} value={t.name} className="bg-gray-900">{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-2 block">Duration</label>
                    <select
                      value={form.duration}
                      onChange={e => setForm({...form, duration: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 text-white/70 rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500/60 transition-colors duration-200"
                    >
                      <option value="" className="bg-gray-900">Select Duration</option>
                      {duration.map(e => <option key={e} value={e} className="bg-gray-900">{e}</option>)}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="btn-main w-full text-white font-600 text-lg py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] glow mt-2"
                >
                  <span className="flex items-center justify-center gap-2">
                    🚀 Register for Internship
                  </span>
                </button>

                <p className="text-white/25 text-xs text-center">
                  By registering, you agree to our Terms of Service. No spam, ever.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/20 border border-emerald-500/25 rounded-3xl p-12 text-center">
              <div className="text-6xl mb-4 float">🎉</div>
              <h3 className="display text-3xl font-800 text-white mb-3">You're In!</h3>
              <p className="text-white/55 text-base mb-2">Thanks, <strong className="text-white">{form.name}</strong>! Your application has been received.</p>
              <p className="text-white/40 text-sm">Our team will reach out to <span className="text-emerald-400">{form.email}</span> within 24 hours.</p>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-pink-600 opacity-90" />
            <div className="absolute inset-0 noise pointer-events-none" />
            <div className="relative z-10 text-center py-16 px-8">
              <p className="text-white/70 text-sm uppercase tracking-widest mb-3">Don't Miss Out</p>
              <h2 className="display text-4xl sm:text-5xl font-800 text-white mb-4">
                Next Batch Starting Soon
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
                Seats fill up fast. Register today and secure your spot in the most sought-after tech internship program.
              </p>
              <button
                onClick={scrollToForm}
                className="bg-white text-indigo-700 font-700 text-lg px-10 py-4 rounded-2xl hover:scale-105 transition-transform duration-300 display"
              >
                Register Now — It's Free to Apply
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <div className="display text-xl font-800 mb-2">
          <span className="text-white">Zint</span>
          <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">Institute</span>
        </div>
        <p className="text-white/25 text-sm">© 2026 Zint Institute. Shaping the next generation of tech leaders.</p>
      </footer>
    </div>
  );
}
