import { useContext, useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import SpecularButton from "../components/SpecularButton";
import { toHttps } from "../utils/imgUrl";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Monitor,
  Globe,
  Sparkles,
  ArrowRight,
  Flame,
  Star,
} from "lucide-react";

const DRAG_TH = 55; // px swipe to trigger navigation

/* ── responsive card sizing helper ── */
function useCardSize() {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  // sm = 640, md = 768
  if (w < 640) return { cardW: 240, gap: 16, mobile: true  };
  if (w < 900) return { cardW: 230, gap: 24, mobile: false };
  return              { cardW: 268, gap: 36, mobile: false };
}

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export default function CourseSlider() {
  const { data }  = useContext(DataContext);
  const navigate  = useNavigate();

  const { cardW, gap, mobile } = useCardSize();
  const cardStep = cardW + gap;

  const [activeIndex, setActiveIndex] = useState(0);
  const hasMoved = useRef(false);
  const dragStart = useRef(0);
  const dragging  = useRef(false);

  const courses = (data?.courses || []).filter((c) => c.trending === true);

  /* ── navigation ── */
  const goTo = useCallback(
    (i) => setActiveIndex(Math.max(0, Math.min(i, courses.length - 1))),
    [courses.length]
  );
  const goPrev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);

  /* ── keyboard ── */
  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowLeft")  goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [goPrev, goNext]);

  /* ── drag / swipe ── */
  const onDown = (e) => {
    dragging.current  = true;
    hasMoved.current  = false;
    dragStart.current = e.touches ? e.touches[0].clientX : e.clientX;
  };
  const onMove = (e) => {
    if (!dragging.current) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    if (Math.abs(x - dragStart.current) > 8) hasMoved.current = true;
  };
  const onUp = (e) => {
    if (!dragging.current) return;
    dragging.current = false;
    const x     = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const delta = x - dragStart.current;
    if      (delta < -DRAG_TH) goNext();
    else if (delta >  DRAG_TH) goPrev();
  };

  if (!courses.length) return null;

  /* Pure-CSS centering — no JS width measurement needed */
  const trackOffset = activeIndex * cardStep + cardW / 2;

  return (
    <section className="relative w-full overflow-hidden border-b border-purple-100/50 bg-[#F8F7FC] py-14 sm:py-18 lg:py-20 select-none">
      {/* Subtle radial glow backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 65%, rgba(177,31,168,0.07) 0%, transparent 72%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── HEADER ── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {/* Badge */}
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-purple-200/70 bg-purple-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#8E1387]">
              <Sparkles className="h-3.5 w-3.5" />
              High Demand Skills
            </span>

            {/* Title — wraps on mobile, single line on sm+ */}
            <h2 className="text-2xl font-black leading-tight tracking-tight text-slate-900 sm:whitespace-nowrap sm:text-3xl lg:text-[2rem]">
              ⚡{" "}
              <span>Trending</span>{" "}
              <span className="bg-gradient-to-r from-[#8E1387] via-[#B11FA8] to-[#53BFEA] bg-clip-text text-transparent">
                Professional Courses
              </span>
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-[15px]">
              Curated by tech leaders — master job-ready skills with live hands-on projects.
            </p>
          </div>

          {/* Arrow buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <NavBtn onClick={goPrev} disabled={activeIndex === 0} aria-label="Previous">
              <ChevronLeft className="h-5 w-5" />
            </NavBtn>
            <NavBtn onClick={goNext} disabled={activeIndex >= courses.length - 1} aria-label="Next">
              <ChevronRight className="h-5 w-5" />
            </NavBtn>
          </div>
        </div>

        {/* ── 3-D COVERFLOW STAGE ── */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            height:            mobile ? "380px" : "470px",
            perspective:       "1300px",
            perspectiveOrigin: "50% 48%",
          }}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onTouchStart={onDown}
          onTouchMove={onMove}
          onTouchEnd={onUp}
        >
          {/* Left / right fade masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-28 z-20 bg-gradient-to-r from-[#F8F7FC] via-[#F8F7FC]/80 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-28 z-20 bg-gradient-to-l from-[#F8F7FC] via-[#F8F7FC]/80 to-transparent" />

          {/* Sliding flex track */}
          <div
            style={{
              position:   "absolute",
              left:       "50%",
              top:        0,
              bottom:     0,
              display:    "flex",
              alignItems: "center",
              gap:        `${gap}px`,
              transform:  `translateX(-${trackOffset}px)`,
              transition: "transform 580ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              willChange: "transform",
            }}
          >
            {courses.map((course, index) => (
              <CourseCard
                key={course._id}
                course={course}
                offset={index - activeIndex}
                isCenter={index === activeIndex}
                cardW={cardW}
                mobile={mobile}
                hasMoved={hasMoved}
                onSelect={() => {
                  if (hasMoved.current) return;
                  index !== activeIndex
                    ? goTo(index)
                    : navigate(`/courses/${course._id}`);
                }}
                onCTA={(e) => {
                  e.stopPropagation();
                  if (!hasMoved.current) navigate(`/courses/${course._id}`);
                }}
              />
            ))}
          </div>
        </div>

        {/* Mobile swipe hint */}
        {mobile && (
          <p className="mt-3 text-center text-[11px] text-slate-400">← Swipe to browse →</p>
        )}

        {/* ── DOTS ── */}
        {courses.length > 1 && (
          <div className="mt-5 flex justify-center items-center gap-2">
            {courses.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to course ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "w-7 bg-gradient-to-r from-[#8E1387] via-[#B11FA8] to-[#53BFEA] shadow shadow-purple-900/20"
                    : "w-2 bg-slate-300/70 hover:bg-slate-400/70"
                }`}
              />
            ))}
          </div>
        )}

        {/* ── EXPLORE CTA ── */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => navigate("/courses")}
            className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#8E1387] to-[#B11FA8] px-8 py-3.5 text-[13px] font-bold text-white shadow-lg shadow-purple-900/25 transition-all duration-300 hover:scale-[1.04] hover:shadow-purple-900/40 active:scale-95"
          >
            Explore Complete Course Catalog
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   NAV BUTTON
───────────────────────────────────────────────────────────────── */
function NavBtn({ children, onClick, disabled, ...rest }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...rest}
      className="
        flex h-11 w-11 items-center justify-center
        rounded-full border border-slate-200 bg-white
        text-slate-600 shadow-sm
        transition-all duration-200
        hover:border-[#B11FA8] hover:text-[#B11FA8] hover:shadow-md
        active:scale-95
        disabled:cursor-not-allowed disabled:opacity-25
      "
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────
   COURSE CARD — per-card perspective so no preserve-3d needed
   3D transforms: perspective() rotateY() translateZ() scale()
   All values are derived from `offset` (index - activeIndex).
───────────────────────────────────────────────────────────────── */
function CourseCard({ course, offset, isCenter, cardW, mobile, hasMoved, onSelect, onCTA }) {
  const [hovered, setHovered] = useState(false);

  const rating   = course.rating   != null && course.rating   !== "" ? course.rating   : null;
  const reviews  = course.reviews  != null && course.reviews  !== "" ? course.reviews  : null;
  const duration = course.duration != null && course.duration !== ""
    ? String(course.duration).replace(/m$/i, "")
    : null;

  /* ── 3-D math ─────────────────────────────────────────────
     5 cards rendered at a time:
       offset  0  → center hero card (full size, glowing)
       offset ±1  → flanking cards (smaller, rotated 36°)
       offset ±2  → outer cards (heavily receded, rotated 54°)
       offset ±3+ → invisible placeholders
  ─────────────────────────────────────────────────────────── */
  const absOff = Math.abs(offset);

  // Mobile: show center + ±1; Desktop: show up to ±2
  if (absOff > 2 || (mobile && absOff > 1)) {
    return <div aria-hidden style={{ width: cardW, flexShrink: 0, visibility: "hidden" }} />;
  }

  // rotateY per depth level
  const rotY =
    absOff === 0 ? 0 :
    absOff === 1 ? Math.sign(offset) * 36 :
                  Math.sign(offset) * 54;

  // translateZ per depth level
  const tz =
    isCenter     ? (hovered ? 82 : 68) :
    absOff === 1 ? -55 :
                   -160;

  // scale per depth level
  const scale =
    isCenter     ? (hovered ? 1.06 : 1.0) :
    absOff === 1 ? 0.80 :
                   0.62;

  // opacity per depth level
  const opacity =
    isCenter     ? 1    :
    absOff === 1 ? 0.78 :
                   0.52;

  // dark depth overlay per depth level
  const darkOverlay =
    isCenter     ? 0    :
    absOff === 1 ? 0.14 :
                   0.36;

  // z-index
  const zIndex = isCenter ? 50 : absOff === 1 ? 30 : 10;

  // subtle lift on center hover
  const translateY = isCenter && hovered ? -10 : 0;


  const shadow = isCenter
    ? hovered
      ? "0 36px 80px -10px rgba(177,31,168,0.42), 0 18px 40px -8px rgba(15,23,42,0.16)"
      : "0 26px 64px -10px rgba(177,31,168,0.30), 0 12px 30px -5px rgba(15,23,42,0.11)"
    : "0 8px 24px rgba(15,23,42,0.08)";

  return (
    <article
      style={{
        width:   cardW,
        flexShrink: 0,
        /* per-card perspective gives clean 3-D without preserve-3d issues */
        transform: `perspective(1300px) rotateY(${-rotY}deg) translateZ(${tz}px) scale(${scale}) translateY(${translateY}px)`,
        opacity,
        zIndex,
        boxShadow: shadow,
        transition:
          "transform 520ms cubic-bezier(0.25, 0.46, 0.45, 0.94), " +
          "opacity 400ms ease, " +
          "box-shadow 400ms ease",
        willChange: "transform, opacity",
        cursor: isCenter ? "default" : "pointer",
      }}
      className={`
        group relative overflow-hidden rounded-[18px] border bg-white
        ${isCenter
          ? "border-purple-300/60 ring-[3px] ring-purple-400/18"
          : "border-slate-200/60"
        }
      `}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ambient glow halo behind active card */}
      {isCenter && (
        <div
          className="pointer-events-none absolute -inset-5 rounded-[28px] blur-2xl"
          style={{
            background:
              "radial-gradient(ellipse, rgba(177,31,168,0.18) 0%, rgba(83,191,234,0.10) 55%, transparent 100%)",
            opacity: hovered ? 0.8 : 0.55,
            transition: "opacity 350ms ease",
          }}
        />
      )}

      {/* 3-D depth-shading overlay on side cards */}
      <div
        className="pointer-events-none absolute inset-0 z-30 rounded-[18px] bg-slate-900"
        style={{ opacity: darkOverlay, transition: "opacity 400ms ease" }}
      />

      {/* Top gradient accent bar */}
      <div className="h-[4px] w-full bg-gradient-to-r from-[#8E1387] via-[#B11FA8] to-[#53BFEA]" />

      {/* ── Course image ── */}
      <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-slate-100/80 bg-white">
        <img
          src={toHttps(course.courseImage)}
          alt={course.courseName || "Course"}
          width="268"
          height="151"
          loading="lazy"
          decoding="async"
          draggable="false"
          className="absolute inset-0 h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/course-placeholder.webp";
          }}
        />

        {/* Trending badge */}
        <div className="absolute left-2 top-2 z-10">
          <span className="inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-[#8E1387] to-[#B11FA8] px-2 py-0.5 text-[8px] font-bold text-white shadow-md shadow-purple-900/30">
            <Flame className="h-2.5 w-2.5 fill-current" />
            Trending
          </span>
        </div>

        {/* Rating badge */}
        {rating && (
          <div className="absolute right-2 top-2 z-10">
            <span className="inline-flex items-center gap-0.5 rounded-full bg-white/95 px-1.5 py-0.5 text-[8px] font-bold text-slate-700 shadow-md backdrop-blur-sm">
              <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
              {rating}
              {reviews != null && (
                <span className="ml-0.5 font-medium text-slate-400">({reviews})</span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* ── Card body ── */}
      <div className="flex min-h-[130px] flex-col p-4">
        {/* Course name */}
        <h3 className="line-clamp-2 text-[12.5px] font-extrabold leading-[1.3] tracking-[-0.01em] text-slate-900 transition-colors duration-200 group-hover:text-[#8E1387]">
          {course.courseName}
        </h3>

        {/* Meta chips */}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {duration && (
            <MetaChip icon={<Clock className="h-3 w-3" />} text={`${duration}M`} color="purple" />
          )}
          {course.mode && (
            <MetaChip icon={<Monitor className="h-3 w-3" />} text={course.mode} color="blue" />
          )}
          {course.language && (
            <MetaChip icon={<Globe className="h-3 w-3" />} text={course.language} color="green" />
          )}
        </div>

        <div className="flex-1" />
        <div className="my-3 h-px w-full bg-slate-100" />

        {/* CTA button */}
        <SpecularButton
          size="sm"
          radius={11}
          tint="#ffffff"
          tintOpacity={0}
          blur={0}
          textColor="#ffffff"
          lineColor="#bc05f3"
          baseColor="#8E1387"
          intensity={1}
          shineSize={30}
          shineFade={47}
          thickness={2}
          speed={0.35}
          followMouse
          proximity={300}
          autoAnimate={false}
          onClick={onCTA}
          className="w-full min-h-[36px] rounded-[11px] px-3 py-2 text-[10.5px] font-bold"
        >
          <span className="flex items-center justify-center gap-1">
            View Curriculum &amp; Fees
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </SpecularButton>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────────
   META CHIP
───────────────────────────────────────────────────────────────── */
function MetaChip({ icon, text, color }) {
  const cls = {
    purple: "border-purple-100 bg-purple-50/80 text-[#8E1387]",
    blue:   "border-sky-100   bg-sky-50/80   text-sky-700",
    green:  "border-emerald-100 bg-emerald-50/80 text-emerald-700",
  }[color];

  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-1.5 py-0.5 text-[9px] font-bold ${cls}`}>
      {icon}
      <span>{text}</span>
    </span>
  );
}
