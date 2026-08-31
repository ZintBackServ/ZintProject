import { useEffect, useRef } from "react";
import PlacedStudent from "../components/PlacedStudentSlider";
import WhyZint from "../components/WhyZint";
import Mentor from "../pages/Mentor";
import { FaIndustry } from "react-icons/fa";
import { FaComputer } from "react-icons/fa6";
import { SiCodementor } from "react-icons/si";
import { usePageMeta } from "../hooks/usePageMeta";
import { Eye, Target, ShieldCheck, Star, Lightbulb } from "lucide-react";
import aboutPoster from "../assets/aboutposter.png";

/* ── CSS keyframes injected once ── */
const KEYFRAMES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideLeft {
    from { opacity: 0; transform: translateX(-36px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideRight {
    from { opacity: 0; transform: translateX(36px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes gradLine {
    from { width: 0; opacity: 0; }
    to   { width: 72px; opacity: 1; }
  }
  .abt-reveal { opacity: 0; }
  .abt-reveal.visible { animation: fadeUp 0.6s ease forwards; }
  .abt-slide-l { opacity: 0; }
  .abt-slide-l.visible { animation: slideLeft 0.65s ease forwards; }
  .abt-slide-r { opacity: 0; }
  .abt-slide-r.visible { animation: slideRight 0.65s ease forwards; }
  @media (prefers-reduced-motion: reduce) {
    .abt-reveal, .abt-slide-l, .abt-slide-r {
      opacity: 1 !important; animation: none !important;
    }
  }
`;

/* ── Intersection Observer hook ── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

/* ── Reusable section header ── */
function SectionHeader({ eyebrow, title, accent, subtitle }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="abt-reveal text-center mb-10 md:mb-14">
      {eyebrow && (
        <span className="inline-block text-[11px] font-black uppercase tracking-[0.18em] text-fuchsia-600 bg-fuchsia-50 border border-fuchsia-200/70 px-3.5 py-1 rounded-full mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
        {title}{" "}
        {accent && (
          <span className="bg-gradient-to-r from-pink-600 to-fuchsia-600 bg-clip-text text-transparent">
            {accent}
          </span>
        )}
      </h2>
      {subtitle && (
        <p className="mt-2.5 text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      {/* Animated gradient underline */}
      <div className="mt-3 mx-auto h-1 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 abt-grad-line" style={{ width: 72, opacity: 1 }} />
    </div>
  );
}

/* ── Value / Why card ── */
function FeatureCard({ icon: Icon, iconBg, title, body, delay = 0, className = "" }) {
  const ref = useReveal(0.1);
  return (
    <div
      ref={ref}
      className={`abt-reveal group bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-3 ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBg} mb-1 transition-transform duration-300 group-hover:scale-110`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-fuchsia-700 transition-colors">
        {title}
      </h3>
      <p className="text-slate-600 text-sm leading-relaxed">
        {body}
      </p>
    </div>
  );
}

/* ── Main About component ── */
function About() {
  usePageMeta(
    "About Us",
    "Learn about Zint Computer Education Institute — ISO 9001:2015 Certified institute in Gwalior. Our vision, mission, expert mentors and placement success story."
  );

  const visRef = useReveal();
  const missRef = useReveal();

  const coreValues = [
    {
      icon: ShieldCheck,
      iconBg: "bg-gradient-to-br from-pink-500 to-fuchsia-600",
      title: "Integrity",
      body: "We follow strong ethical principles, promoting honesty, transparency, and responsibility in learning and professional behaviour.",
    },
    {
      icon: Star,
      iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
      title: "Excellence",
      body: "We strive to achieve the highest standards in education, fostering intellectual focus, precision, and a steadfast commitment in all academic and professional endeavours.",
    },
    {
      icon: Lightbulb,
      iconBg: "bg-gradient-to-br from-amber-400 to-orange-500",
      title: "Innovation",
      body: "We support creative thinking and flexible approaches, helping students solve problems effectively and contribute new ideas in a changing world.",
    },
  ];

  const whyCards = [
    {
      icon: SiCodementor,
      iconBg: "bg-gradient-to-br from-pink-500 to-fuchsia-600",
      title: "Personalised Mentorship",
      body: "Every student receives one-on-one guidance from dedicated mentors who track progress and provide customised learning paths.",
    },
    {
      icon: FaIndustry,
      iconBg: "bg-gradient-to-br from-blue-500 to-sky-600",
      title: "Industry-Verified Curriculum",
      body: "Our curriculum is designed in collaboration with industry experts to ensure students learn skills that are relevant and in demand.",
    },
    {
      icon: FaComputer,
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
      title: "State-of-the-Art Labs",
      body: "Students get hands-on access to modern labs and tools, enabling practical learning that goes beyond theory and textbooks.",
    },
  ];

  return (
    <>
      {/* Inject keyframes once */}
      <style>{KEYFRAMES}</style>

      <div className="w-full overflow-x-hidden bg-[#FAFAFA]">

        {/* ═══════════════ ABOUT POSTER BANNER ═══════════════ */}
        <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-2 max-w-7xl mx-auto">
          <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl shadow-fuchsia-100/60">
            <img
              src={aboutPoster}
              alt="About Zint Computer Education Institute"
              className="w-full h-auto object-cover block"
              loading="eager"
            />
          </div>
        </div>

        {/* ═══════════════ VISION & MISSION ═══════════════ */}
        <section className="py-10 md:py-14 px-4 sm:px-6 max-w-7xl mx-auto">
          <SectionHeader eyebrow="Our Foundation" title="Vision &" accent="Mission" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
            {/* Vision Card */}
            <div
              ref={visRef}
              className="abt-slide-l group relative bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-fuchsia-500 rounded-t-3xl" />
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-fuchsia-600 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">Our Vision</h3>
              </div>
              <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed">
                The Zint Institute envisions becoming a premier centre of excellence in education, dedicated to nurturing sagacious, skilled and confident individuals. Our vision is to create a dynamic learning environment that inspires innovation, leadership, and lifelong learning, enabling students to achieve academic success and make meaningful contributions to a global society.
              </p>
            </div>

            {/* Mission Card */}
            <div
              ref={missRef}
              className="abt-slide-r group relative bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600 rounded-t-3xl" />
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">Our Mission</h3>
              </div>
              <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed">
                Zint Institute is committed to cultivating knowledgeable and versatile learners by providing exemplary education that combines intellectual precision with practical proficiency. Our mission is to empower learners to transcend conventional boundaries, develop articulate expression, and embody professionalism — preparing them to excel in competitive arenas and contribute with integrity and purpose. We also guide every student toward successful placement through our landmark <span className="font-bold text-fuchsia-700">"Rozgar Mission"</span>, which achieved remarkable success on 10 January 2026.
              </p>
            </div>
          </div>
        </section>

        {/* Thin gradient section divider */}
        <div className="mx-auto max-w-4xl h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent my-2" />

        {/* ═══════════════ PLACED STUDENTS ═══════════════ */}
        <section className="py-8 md:py-10 w-full">
          <PlacedStudent />
        </section>

        {/* Thin gradient section divider */}
        <div className="mx-auto max-w-4xl h-px bg-gradient-to-r from-transparent via-fuchsia-200 to-transparent my-2" />

        {/* ═══════════════ CORE VALUES ═══════════════ */}
        <section className="py-10 md:py-14 px-4 sm:px-6 max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Our Foundation"
            title="Core"
            accent="Values"
            subtitle="The principles that guide everything we do at Zint Institute."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
            {coreValues.map((v, i) => (
              <FeatureCard key={v.title} {...v} delay={i * 100} />
            ))}
          </div>
        </section>

        {/* Thin gradient section divider */}
        <div className="mx-auto max-w-4xl h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent my-2" />

        {/* ═══════════════ WHY CHOOSE ZINT ═══════════════ */}
        <section className="py-10 md:py-14 px-4 sm:px-6 max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Our Advantage"
            title="Why Choose"
            accent="Zint?"
            subtitle="What sets us apart from the rest and makes Zint the smarter choice for your career."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
            {whyCards.map((c, i) => (
              <FeatureCard key={c.title} {...c} delay={i * 100} />
            ))}
          </div>
        </section>

        {/* ═══════════════ MENTORS ═══════════════ */}
        <section className="py-4">
          <Mentor />
        </section>

        {/* ═══════════════ WHY ZINT COMPONENT ═══════════════ */}
        <section className="py-2">
          <WhyZint />
        </section>

      </div>
    </>
  );
}

export default About;
