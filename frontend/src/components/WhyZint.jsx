import { useState, useEffect } from "react";

const reasons = [
  {
    id: "01",
    icon: "⚡",
    title: "Industry-Oriented Practical Training",
    desc: "केवल theory नहीं — Live Projects और Practical Training पर ज्यादा focus किया जाता है।",
    tag: "Hands-on Learning",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
    tagColor: "bg-amber-100 text-amber-700",
  },
  {
    id: "02",
    icon: "🎓",
    title: "Experienced & Professional Faculty",
    desc: "Experienced trainers हर student पर personal attention देते हैं और concepts आसान तरीके से समझाते हैं।",
    tag: "Expert Mentors",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    id: "03",
    icon: "🚀",
    title: "Job-Oriented Courses",
    desc: "Current industry requirements के अनुसार designed courses — students job-ready बनते हैं।",
    tag: "Career Ready",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    tagColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "04",
    icon: "🤝",
    title: "Placement Assistance & Interview Prep",
    desc: "Resume Building, Mock Interviews, HR Guidance और Placement Support से career opportunities मिलती हैं।",
    tag: "100% Support",
    color: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
    border: "border-violet-200",
    tagColor: "bg-violet-100 text-violet-700",
  },
  {
    id: "05",
    icon: "💻",
    title: "Latest Technology Courses",
    desc: "Full Stack Development, Data Analytics, AI & Machine Learning, Python, MERN Stack, Digital Marketing जैसे trending courses।",
    tag: "Cutting-Edge Tech",
    color: "from-rose-500 to-pink-500",
    bg: "bg-rose-50",
    border: "border-rose-200",
    tagColor: "bg-rose-100 text-rose-700",
    chips: ["AI & ML", "MERN Stack", "Python", "Digital Marketing", "Data Analytics"],
  },
  {
    id: "06",
    icon: "💰",
    title: "Affordable Fees with Quality Education",
    desc: "कम fees में quality education और practical exposure मिलने की वजह से students Zint को prefer करते हैं।",
    tag: "Value for Money",
    color: "from-amber-500 to-yellow-500",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    tagColor: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "07",
    icon: "🖥️",
    title: "Smart Labs & Modern Facilities",
    desc: "High Configuration Systems, Smart Classrooms, AC Labs — practical environment learning को बेहतर बनाते हैं।",
    tag: "Modern Campus",
    color: "from-sky-500 to-blue-500",
    bg: "bg-sky-50",
    border: "border-sky-200",
    tagColor: "bg-sky-100 text-sky-700",
  },
  {
    id: "08",
    icon: "🕐",
    title: "Flexible Batch Timings",
    desc: "Morning, Evening और Flexible batches — school, college और working students सभी join कर सकते हैं।",
    tag: "Flexible",
    color: "from-indigo-500 to-violet-500",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    tagColor: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "09",
    icon: "⭐",
    title: "Positive Student Reviews & Trust",
    desc: "हजारों students के अच्छे feedback, successful placements और skill development से strong reputation बनी है।",
    tag: "Trusted",
    color: "from-orange-500 to-amber-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
    tagColor: "bg-orange-100 text-orange-700",
  },
  {
    id: "10",
    icon: "🧭",
    title: "Career Guidance & Student Support",
    desc: "सही course selection, career counseling और extra practice support — students का confidence बढ़ता है।",
    tag: "Mentorship",
    color: "from-teal-500 to-emerald-500",
    bg: "bg-teal-50",
    border: "border-teal-200",
    tagColor: "bg-teal-100 text-teal-700",
  },
  {
    id: "11",
    icon: "🏆",
    title: "Expert-Level Training Environment",
    desc: "Industry-ready expert बनाने का practical और professional environment — skills और confidence दोनों तेजी से improve होते हैं।",
    tag: "Professional",
    color: "from-purple-500 to-indigo-500",
    bg: "bg-purple-50",
    border: "border-purple-200",
    tagColor: "bg-purple-100 text-purple-700",
  },
  {
    id: "12",
    icon: "📅",
    title: "17 Years of Experience",
    desc: "Step-by-step practical training और full learning support — faculty हर topic को बार-बार समझाती है।",
    tag: "17+ Years Trust",
    color: "from-red-500 to-rose-500",
    bg: "bg-red-50",
    border: "border-red-200",
    tagColor: "bg-red-100 text-red-700",
  },
];

const stats = [
  { value: "17+", label: "Years of Excellence" },
  { value: "15000+", label: "Students Trained" },
  { value: "50+", label: "Courses Available" },
  { value: "95%", label: "Placement Rate" },
];

export default function ZintInstitute() {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    reasons.forEach((_, i) => {
      setTimeout(() => {
        setVisible((prev) => [...prev, i]);
      }, 80 * i);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-body { font-family: 'Outfit', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.25); }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #f59e0b, #fbbf24, #f97316, #fbbf24, #f59e0b);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .grid-dot-bg {
          background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .number-stroke {
          -webkit-text-stroke: 1px rgba(255,255,255,0.07);
          color: transparent;
        }
      `}</style>

      {/* Hero */}
      <div className="relative overflow-hidden grid-dot-bg font-body">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-fuscia-400 animate-pulse" />
            <span className="text-amber-400 text-xs font-medium tracking-widest uppercase">Gwalior's No. 1 Institute</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            Gwalior में सबसे ज्यादा
            <br />
            <span className="text-purple-600 ">Admission Zint में</span>
            <br />
            क्यों होते हैं?
          </h1>

          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed mb-12">
            12 powerful reasons जो Zint Institute को Gwalior का most preferred IT training centre बनाते हैं।
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 "
              >
                <div className="font-display text-2xl font-bold text-fuchsia-600">{s.value}</div>
                <div className="text-slate-400 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-5xl mx-auto px-4 pb-20 -mt-2 font-body">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r, i) => (
            <div
              key={r.id}
              className={`relative group bg-white rounded-3xl border overflow-hidden card-hover ${r.border} ${
                visible.includes(i) ? "fade-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Background accent */}
              <div className={`absolute top-0 right-0 w-28 h-28 ${r.bg} rounded-bl-[80px] opacity-60`} />

              {/* Number watermark */}
              <div className="absolute bottom-3 right-4 font-display text-7xl font-extrabold number-stroke select-none pointer-events-none">
                {r.id}
              </div>

              <div className="relative z-10 p-6">
                {/* Icon + Tag */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {r.icon}
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${r.tagColor}`}>
                    {r.tag}
                  </span>
                </div>

                {/* Gradient line */}
                <div className={`h-0.5 w-10 rounded-full bg-gradient-to-r ${r.color} mb-4`} />

                <h3 className="text-slate-800 font-semibold text-[15px] leading-snug mb-2">
                  {r.title}
                </h3>
                <p className="text-slate-500 text-[13px] leading-relaxed">{r.desc}</p>

                {/* Tech chips for point 5 */}
                {r.chips && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {r.chips.map((c) => (
                      <span
                        key={c}
                        className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2.5 py-1 rounded-full"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-12 relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-[1px]">
          <div className="bg-slate-900 rounded-3xl px-8 py-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 grid-dot-bg opacity-30" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-24 bg-amber-500/10 blur-2xl rounded-full" />
            <div className="relative z-10">
              <div className="text-4xl mb-4">🏆</div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
                आज ही अपना Future{" "}
                <span className="shimmer-text">Secure करें</span>
              </h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                Zint Institute Gwalior — जहाँ हर student को उसकी dream career मिलती है।
                17+ वर्षों का अनुभव, हजारों successful students।
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm px-7 py-3 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-amber-500/30">
                  Free Counselling लें 
                </button>
                <button className="border border-white/20 text-white text-sm px-7 py-3 rounded-full hover:bg-white/10 transition-colors">
                 Our Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
