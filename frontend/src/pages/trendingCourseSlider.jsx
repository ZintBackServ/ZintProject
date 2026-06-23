import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";


  const DarkPurple = "#8E1387";
  const PrimaryPurple = "#B11FA8";
  const BLUE = "#53BFEA";
  const GREEN = "#45B51D";

export default function CourseSlider() {
  const { data }    = useContext(DataContext);
  const navigate    = useNavigate();
  const trackRef    = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const courses = (data?.courses || []).filter((c) => c.trending === true);
  if (!courses.length) return null;

  const scrollToIndex = (index) => {
    const clamped = Math.max(0, Math.min(index, courses.length - 1));
    setActiveIndex(clamped);
    const card = trackRef.current?.children[clamped];
    if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  return (
    /* ── Section wrapper — off-white bg ── */
    <section className="w-full max-w-7xl mx-auto px-4 py-16">

      {/* ── Header ── */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-5xl font-bold text-gray-900 leading-tight">
              ⚡Trending <span style={{color: DarkPurple}}>Courses</span>
            </h1>
        </div>

        {/* Arrow buttons — sky-blue hover */}
        <div className="flex gap-3">
          {[
            { label: "‹", dir: -1, disabled: activeIndex === 0 },
            { label: "›", dir:  1, disabled: activeIndex >= courses.length - 1 },
          ].map(({ label, dir, disabled }) => (
            <button
              key={label}
              onClick={() => scrollToIndex(activeIndex + dir)}
              disabled={disabled}
              className="w-11 h-11 rounded-full text-xl font-bold flex items-center justify-center transition-all duration-200 border-2 disabled:opacity-25 disabled:cursor-not-allowed"
              style={{ borderColor: "#e5e7eb", color: "#6b7280", background: "white" }}
              onMouseEnter={e => {
                if (!disabled) {
                  e.currentTarget.style.borderColor = "#38BDF8";
                  e.currentTarget.style.color       = "#38BDF8";
                  e.currentTarget.style.boxShadow   = "0 4px 14px rgba(56,189,248,0.18)";
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.color       = "#6b7280";
                e.currentTarget.style.boxShadow   = "none";
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Slider Track ── */}
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {courses.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            onKnowMore={() => navigate(`/courses/${course._id}`)}
          />
        ))}
      </div>

      {/* ── Dot Indicators — purple active ── */}
      <div className="flex justify-center gap-2 mt-8">
        {courses.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width:      i === activeIndex ? "28px" : "8px",
              background: i === activeIndex ? "#B026B5" : "#d1d5db",
            }}
            onMouseEnter={e => { if (i !== activeIndex) e.currentTarget.style.background = "#38BDF8"; }}
            onMouseLeave={e => { if (i !== activeIndex) e.currentTarget.style.background = "#d1d5db"; }}
          />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   COURSE CARD
   — White bg + light gray border
   — Sky-blue top accent bar
   — Soft shadow, hover lift + sky-blue glow
   — Purple DarkPurple CTA
   — Green / Purple / Sky pill badges
═══════════════════════════════════════════════════════ */
function CourseCard({ course, onKnowMore }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex-none w-76 sm:w-100 snap-start rounded-2xl overflow-hidden flex flex-col transition-all duration-300 cursor-default"
      style={{
        background:   "white",
        border:       `1px solid ${hovered ? "#38BDF8" : "#e5e7eb"}`,
        boxShadow:    hovered
          ? "0 16px 48px rgba(56,189,248,0.14), 0 4px 16px rgba(0,0,0,0.06)"
          : "0 4px 20px rgba(0,0,0,0.06)",
        transform:    hovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Sky-blue → Purple top gradient accent bar */}
      <div className="h-1 w-full flex-shrink-0"
        style={{ background: "linear-gradient(90deg, #38BDF8, #B026B5)" }} />

      {/* ── Course Image ── */}
      <div className="relative w-full h-52 overflow-hidden">
        <img
          src={course.courseImage}
          alt={course.courseName}
          className="w-full h-full object-full transition-transform duration-500"
          style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}
          onError={e => { e.target.src = "https://placehold.co/400x240/111827/B026B5?text=Course"; }}
        />

        {/* Purple trending badge */}
        <h1 className="absolute style={{color:DarkPurple}} top-3 left-3 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
          ⚡ Trending
        </h1>

        {/* subtle gradient overlay */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(17,24,39,0.28) 0%, transparent 55%)" }} />
      </div>

      {/* ── Card Body ── */}
      <div className="flex flex-col flex-1 p-5 gap-3">

        {/* Course title — dark typography */}
        <h3 className="font-bold text-[15px] leading-snug line-clamp-2"
          style={{ color: "#111827" }}>
          {course.courseName}
        </h3>

        {/* Info pills */}
        <div className="flex flex-wrap gap-2">
          {course.duration && (
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full"
              style={{ background: "rgba(176,38,181,0.08)", color: "#B026B5" }}>
              ⏱ {course.duration} Months
            </span>
          )}
          {course.mode && (
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full"
              style={{ background: "rgba(56,189,248,0.10)", color: "#0ea5e9" }}>
              🖥 {course.mode}
            </span>
          )}
          {course.language && (
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full"
              style={{ background: "rgba(34,197,94,0.10)", color: "#16a34a" }}>
              🗣 {course.language}
            </span>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between pt-3 border-t"
          style={{ borderColor: "#f1f5f9" }}>

          {/* Fee — dark with green "50% off" */}
          {course.fee && (
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-sm" style={{ color: "#111827" }}>
                ₹{course.fee.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] font-semibold" style={{ color: "#22C55E" }}>
                35% OFF
              </span>
            </div>
          )}

          {/* DarkPurple CTA — Purple */}
          <KnowMoreBtn onClick={onKnowMore} />
        </div>
      </div>
    </div>
  );
}

/* ── Purple CTA button with darker-purple hover ── */
function KnowMoreBtn({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      className="text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-200"
      style={{
        background:  hov ? DarkPurple : PrimaryPurple,
        boxShadow:   hov
          ? "0 6px 20px rgba(176,38,181,0.35)"
          : "0 4px 14px rgba(176,38,181,0.22)",
        transform:   hov ? "scale(0.97)" : "scale(1)",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      Know More →
    </button>
  );
}
