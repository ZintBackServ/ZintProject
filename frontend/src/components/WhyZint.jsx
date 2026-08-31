import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  GraduationCap,
  Rocket,
  Handshake,
  Laptop,
  Coins,
  Monitor,
  Clock,
  Star,
  Compass,
  Trophy,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Grid,
  Circle,
  ArrowRight,
} from "lucide-react";

// Icon mapping per card
const iconMap = {
  "01": Zap,
  "02": GraduationCap,
  "03": Rocket,
  "04": Handshake,
  "05": Laptop,
  "06": Coins,
  "07": Monitor,
  "08": Clock,
  "09": Star,
  "10": Compass,
  "11": Trophy,
  "12": Calendar,
};

const reasons = [
  {
    id: "01",
    icon: "⚡",
    title: "Industry-Oriented Practical Training",
    desc: "केवल theory नहीं — Live Projects और Practical Training पर ज्यादा focus किया जाता है।",
    tag: "Hands-on Learning",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    border: "border-amber-200/80",
    tagColor: "bg-amber-100/80 text-amber-800 border-amber-200",
  },
  {
    id: "02",
    icon: "🎓",
    title: "Experienced & Professional Faculty",
    desc: "Experienced trainers हर student पर personal attention देते हैं और concepts आसान तरीके से समझाते हैं।",
    tag: "Expert Mentors",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    border: "border-blue-200/80",
    tagColor: "bg-blue-100/80 text-blue-800 border-blue-200",
  },
  {
    id: "03",
    icon: "🚀",
    title: "Job-Oriented Courses",
    desc: "Current industry requirements के अनुसार designed courses — students job-ready बनते हैं।",
    tag: "Career Ready",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200/80",
    tagColor: "bg-emerald-100/80 text-emerald-800 border-emerald-200",
  },
  {
    id: "04",
    icon: "🤝",
    title: "Placement Assistance & Interview Prep",
    desc: "Resume Building, Mock Interviews, HR Guidance और Placement Support से career opportunities मिलती हैं।",
    tag: "100% Support",
    color: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
    border: "border-violet-200/80",
    tagColor: "bg-violet-100/80 text-violet-800 border-violet-200",
  },
  {
    id: "05",
    icon: "💻",
    title: "Latest Technology Courses",
    desc: "Full Stack Development, Data Analytics, AI & Machine Learning, Python, MERN Stack, Digital Marketing जैसे trending courses।",
    tag: "Cutting-Edge Tech",
    color: "from-rose-500 to-pink-500",
    bg: "bg-rose-50",
    border: "border-rose-200/80",
    tagColor: "bg-rose-100/80 text-rose-800 border-rose-200",
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
    border: "border-yellow-200/80",
    tagColor: "bg-yellow-100/80 text-yellow-800 border-yellow-200",
  },
  {
    id: "07",
    icon: "🖥️",
    title: "Smart Labs & Modern Facilities",
    desc: "High Configuration Systems, Smart Classrooms, AC Labs — practical environment learning को बेहतर बनाते हैं।",
    tag: "Modern Campus",
    color: "from-sky-500 to-blue-500",
    bg: "bg-sky-50",
    border: "border-sky-200/80",
    tagColor: "bg-sky-100/80 text-sky-800 border-sky-200",
  },
  {
    id: "08",
    icon: "🕐",
    title: "Flexible Batch Timings",
    desc: "Morning, Evening और Flexible batches — school, college और working students सभी join कर सकते हैं।",
    tag: "Flexible",
    color: "from-indigo-500 to-violet-500",
    bg: "bg-indigo-50",
    border: "border-indigo-200/80",
    tagColor: "bg-indigo-100/80 text-indigo-800 border-indigo-200",
  },
  {
    id: "09",
    icon: "⭐",
    title: "Positive Student Reviews & Trust",
    desc: "हजारों students के अच्छे feedback, successful placements और skill development से strong reputation बनी है।",
    tag: "Trusted",
    color: "from-orange-500 to-amber-500",
    bg: "bg-orange-50",
    border: "border-orange-200/80",
    tagColor: "bg-orange-100/80 text-orange-800 border-orange-200",
  },
  {
    id: "10",
    icon: "🧭",
    title: "Career Guidance & Student Support",
    desc: "सही course selection, career counseling और extra practice support — students का confidence बढ़ता है।",
    tag: "Mentorship",
    color: "from-teal-500 to-emerald-500",
    bg: "bg-teal-50",
    border: "border-teal-200/80",
    tagColor: "bg-teal-100/80 text-teal-800 border-teal-200",
  },
  {
    id: "11",
    icon: "🏆",
    title: "Expert-Level Training Environment",
    desc: "Industry-ready expert बनाने का practical और professional environment — skills और confidence दोनों तेजी से improve होते हैं।",
    tag: "Professional",
    color: "from-purple-500 to-indigo-500",
    bg: "bg-purple-50",
    border: "border-purple-200/80",
    tagColor: "bg-purple-100/80 text-purple-800 border-purple-200",
  },
  {
    id: "12",
    icon: "📅",
    title: "17 Years of Experience",
    desc: "Step-by-step practical training और full learning support — faculty हर topic को बार-बार समझाती है।",
    tag: "17+ Years Trust",
    color: "from-red-500 to-rose-500",
    bg: "bg-red-50",
    border: "border-red-200/80",
    tagColor: "bg-red-100/80 text-red-800 border-red-200",
  },
];

const stats = [
  { numericValue: 17, suffix: "+", label: "Years of Excellence" },
  { numericValue: 15000, suffix: "+", label: "Students Trained" },
  { numericValue: 50, suffix: "+", label: "Courses Available" },
  { numericValue: 95, suffix: "%", label: "Placement Rate" },
];

/**
 * Lightweight CountUp component
 */
function CountUpNumber({ target, suffix, startAnim }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnim) return;
    let startTimestamp = null;
    const duration = 1800;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easedProgress * target));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [target, startAnim]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/**
 * React Bits Pro - Radial "Circle Gallery" Component
 * Cards arranged in a circular orbit that rotate with drag inertia & 3D transforms
 */
function CircleGalleryRadial({ items, activeIndex, setActiveIndex }) {
  const [rotation, setRotation] = useState(0); // in degrees
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const startRotationRef = useRef(0);
  const velocityRef = useRef(0);
  const lastAngleRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animFrameRef = useRef(null);
  const [radiusX, setRadiusX] = useState(260);
  const [radiusY, setRadiusY] = useState(110);

  const total = items.length;
  const angleStep = 360 / total;

  // Responsive orbit radii for a compact 3D Arc Fan Showcase
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setRadiusX(150);
        setRadiusY(65);
      } else if (width < 1024) {
        setRadiusX(210);
        setRadiusY(90);
      } else {
        setRadiusX(260);
        setRadiusY(110);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update active index based on rotation angle (top card at -90deg / 270deg)
  useEffect(() => {
    const topAngle = (-90 - rotation) % 360;
    const normalizedAngle = (topAngle + 360) % 360;
    const nearestIndex = Math.round(normalizedAngle / angleStep) % total;
    if (nearestIndex !== activeIndex) {
      setActiveIndex(nearestIndex);
    }
  }, [rotation, angleStep, total, activeIndex, setActiveIndex]);

  // Inertia momentum decay loop
  const applyInertia = () => {
    if (Math.abs(velocityRef.current) < 0.05) {
      return;
    }
    setRotation((prev) => prev + velocityRef.current);
    velocityRef.current *= 0.93; // Inertia damping
    animFrameRef.current = requestAnimationFrame(applyInertia);
  };

  // Pointer drag start
  const handlePointerDown = (clientX, clientY) => {
    setIsDragging(true);
    dragStartPos.current = { x: clientX, y: clientY };
    startRotationRef.current = rotation;
    lastAngleRef.current = rotation;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  };

  // Pointer drag move
  const handlePointerMove = (clientX, clientY) => {
    if (!isDragging) return;
    const now = performance.now();
    const dt = now - lastTimeRef.current;
    
    // Drag distance converts to rotational delta
    const deltaX = clientX - dragStartPos.current.x;
    const sensitivity = 0.35;
    const newRotation = startRotationRef.current + deltaX * sensitivity;

    if (dt > 0) {
      const dAngle = newRotation - lastAngleRef.current;
      velocityRef.current = (dAngle / dt) * 16;
    }

    lastAngleRef.current = newRotation;
    lastTimeRef.current = now;
    setRotation(newRotation);
  };

  // Pointer drag end
  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    animFrameRef.current = requestAnimationFrame(applyInertia);
  };

  // Rotate smoothly to specific item index
  const rotateToIndex = (idx) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const targetRotation = -idx * angleStep - 90;
    let diff = (targetRotation - rotation) % 360;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    setRotation((prev) => prev + diff);
  };

  return (
    <div className="relative w-full py-2 flex flex-col items-center select-none overflow-visible">
      
      {/* Top Controls Bar — counter only */}
      <div className="flex items-center justify-center w-full max-w-4xl px-4 mb-2 text-xs font-semibold text-slate-500">
        <span className="text-xs font-black text-purple-300 bg-slate-900 border border-slate-700 px-3 py-1 rounded-full">
          {activeIndex + 1} / {total}
        </span>
      </div>

      {/* Compact 3D Arc Stage Container */}
      <div
        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handlePointerUp}
        className={`relative w-full h-[350px] sm:h-[390px] lg:h-[420px] flex items-center justify-center cursor-${
          isDragging ? "grabbing" : "grab"
        } touch-pan-y`}
      >
        {/* Glow backdrop spotlight */}
        <div className="absolute w-[400px] h-[300px] sm:w-[500px] sm:h-[350px] rounded-full bg-gradient-to-tr from-[#B026B5]/15 via-purple-500/10 to-[#53BFEA]/15 blur-3xl pointer-events-none" />

        {/* ← Prev Button — absolute left side */}
        <button
          onClick={() => rotateToIndex((activeIndex - 1 + total) % total)}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-[150] p-2.5 rounded-full bg-slate-900/90 border border-slate-700 text-white hover:bg-[#B026B5] hover:border-purple-400 active:scale-95 transition-all shadow-lg cursor-pointer pointer-events-auto"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* → Next Button — absolute right side */}
        <button
          onClick={() => rotateToIndex((activeIndex + 1) % total)}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-[150] p-2.5 rounded-full bg-slate-900/90 border border-slate-700 text-white hover:bg-[#B026B5] hover:border-purple-400 active:scale-95 transition-all shadow-lg cursor-pointer pointer-events-auto"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Outer Circular Ring Outline */}
        <div 
          className="absolute rounded-full border border-dashed border-slate-300/40 pointer-events-none"
          style={{ width: radiusX * 2 + 160, height: radiusY * 2 + 160 }}
        />

        {/* Central Radial Stage */}
        <div className="relative w-full h-full flex items-center justify-center">
          {items.map((r, i) => {
            const IconComponent = iconMap[r.id] || Zap;

            // Responsive card dimensions based on orbit radius breakpoint
            const cardW = radiusX < 160 ? 170 : radiusX < 220 ? 200 : 225;
            const cardH = radiusX < 160 ? 265 : radiusX < 220 ? 285 : 300;
            
            // Calculate radial angle in degrees and radians
            const cardAngleDeg = i * angleStep + rotation;
            const rad = (cardAngleDeg * Math.PI) / 180;

            // X and Y positions along compact elliptical arc radius
            const x = radiusX * Math.cos(rad);
            const y = radiusY * Math.sin(rad);

            // Distance from top-center (-90deg position)
            const topDist = Math.abs(((cardAngleDeg + 90) % 360 + 540) % 360 - 180);
            const isTopActive = topDist < 18;

            // Scale & Depth Z-index based on proximity to top center
            const depthScale = isTopActive ? 1.12 : Math.max(0.72, 1 - topDist / 380);
            const zIndex = Math.round(100 - topDist);

            // Back cards smoothly fade out so bottom space remains completely clean
            const cardOpacity = isTopActive ? 1 : Math.max(0, 1 - topDist / 125);

            // Upright card orientation with smooth organic dynamic tilt
            const tiltAngle = isTopActive ? 0 : Math.sin(rad) * 6;

            // Hide cards completely if behind the arc to avoid overflow
            if (cardOpacity <= 0.05) return null;

            return (
              <div
                key={r.id}
                onClick={(e) => {
                  e.stopPropagation();
                  rotateToIndex(i);
                }}
                className={`absolute rounded-3xl bg-white border transition-all duration-200 shadow-xl overflow-hidden flex flex-col justify-between ${
                  isTopActive
                    ? "border-[#B026B5] ring-4 ring-[#B026B5]/30 shadow-2xl shadow-[#B026B5]/25 z-50 scale-105"
                    : r.border
                }`}
                style={{
                  width: `${cardW}px`,
                  height: `${cardH}px`,
                  transform: `translate3d(${x}px, ${y}px, 0px) rotate(${tiltAngle}deg) scale(${depthScale})`,
                  opacity: cardOpacity,
                  zIndex: zIndex,
                }}
              >
                {/* Top Accent Gradient Line */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${r.color}`} />

                {/* Number Watermark Badge at Top-Left */}
                <div className="absolute top-3 left-3 bg-slate-900/90 text-white font-mono text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-xs z-20">
                  {r.id}
                </div>

                <div className="relative z-10 p-4 pt-7 pb-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header Icon + Tag */}
                    <div className="flex items-center justify-between gap-1 mb-2.5">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${r.color} text-white shadow-sm`}>
                        <IconComponent className="w-4.5 h-4.5 stroke-[2.2]" />
                      </div>

                      <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${r.tagColor}`}>
                        {r.tag}
                      </span>
                    </div>

                    {/* Card Title */}
                    <h3 className="text-slate-900 font-extrabold text-xs leading-snug mb-1.5 line-clamp-2">
                      {r.title}
                    </h3>

                    {/* Card Description */}
                    <p className="text-slate-600 text-[10px] leading-relaxed font-normal line-clamp-3">
                      {r.desc}
                    </p>
                  </div>

                  {/* Tech Chips */}
                  {r.chips && (
                    <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-slate-100">
                      {r.chips.slice(0, 2).map((chip) => (
                        <span
                          key={chip}
                          className="bg-rose-50 border border-rose-200 text-rose-700 text-[8px] font-bold px-1.5 py-0.5 rounded-md"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTA Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); rotateToIndex(i); }}
                    className={`mt-3 w-full py-2 rounded-xl text-[11px] font-bold text-white bg-gradient-to-r ${r.color} hover:opacity-90 active:scale-95 transition-all duration-200 shadow-sm`}
                  >
                    Learn More →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ZintInstitute() {
  const [visible, setVisible] = useState([]);
  const [statsInView, setStatsInView] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [viewMode, setViewMode] = useState("3d"); // "3d" (Circle Gallery) or "grid"
  const statsRef = useRef(null);
  const navigate = useNavigate();

  // Font styling loaded globally via index.html

  // Staggered card animation on mount
  useEffect(() => {
    reasons.forEach((_, i) => {
      const timer = setTimeout(() => {
        setVisible((prev) => [...prev, i]);
      }, 80 * i);
      return () => clearTimeout(timer);
    });
  }, []);

  // Stats IntersectionObserver
  useEffect(() => {
    const node = statsRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsInView(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleEnquiryClick = () => {
    const enquiryElement = document.getElementById("enquiry-form") || document.getElementById("contact");
    if (enquiryElement) {
      enquiryElement.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/contact");
    }
  };

  const handleCoursesClick = () => {
    navigate("/courses");
  };

  const activeReason = reasons[activeCardIndex] || reasons[0];

  return (
    <div 
      className="min-h-screen select-none overflow-x-hidden font-sans"
    >
      <style>{`
        @keyframes cardFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-card-fade-up {
          animation: cardFadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes shimmerGlow {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-headline {
          background: linear-gradient(90deg, #B026B5, #D946EF, #F43F5E, #53BFEA, #D946EF, #B026B5);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerGlow 3.5s linear infinite;
        }

        .dot-matrix-overlay {
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
          background-size: 24px 24px;
        }

        .number-stroke-watermark {
          -webkit-text-stroke: 1.5px rgba(15, 23, 42, 0.08);
          color: transparent;
        }

        @media (prefers-reduced-motion: reduce) {
          .shimmer-headline { animation: none !important; }
          .animate-card-fade-up { animation: none !important; opacity: 1 !important; }
        }
      `}</style>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative overflow-hidden bg-[#0B0F19] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        {/* Faint Dotted Grid Overlay */}
        <div className="absolute inset-0 dot-matrix-overlay pointer-events-none opacity-60" />
        
        {/* Soft Ambient Radial Lighting (Brand Palette: Magenta + Cyan) */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#B026B5]/20 rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-[450px] h-[300px] bg-[#53BFEA]/15 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          
          {/* Eyebrow Chip */}
          <div className="inline-flex items-center gap-2 bg-[#B026B5]/15 border border-[#B026B5]/35 rounded-full px-4 py-1.5 backdrop-blur-md shadow-lg mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#53BFEA] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#53BFEA]" />
            </span>
            <span className="text-purple-200 text-xs font-extrabold tracking-wider uppercase">
              Gwalior's No. 1 IT Institute
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black leading-tight tracking-tight text-white mb-4">
            Gwalior में सबसे ज्यादा{" "}
            <span className="shimmer-headline font-black">
              Admission Zint
            </span>{" "}
            में क्यों होते हैं?
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-normal mb-10">
            12 powerful reasons जो Zint Institute को Gwalior का most preferred IT training centre बनाते हैं।
          </p>

          {/* Stats Row */}
          <div 
            ref={statsRef}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {stats.map((s, idx) => (
              <div
                key={idx}
                className="group relative bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#B026B5]/50 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col items-center justify-center text-center overflow-hidden"
              >
                {/* Top Accent Light Beam */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-gradient-to-r from-transparent via-[#B026B5] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-400 to-[#53BFEA] group-hover:from-purple-200 group-hover:to-cyan-300 transition-colors">
                  <CountUpNumber
                    target={s.numericValue}
                    suffix={s.suffix}
                    startAnim={statsInView}
                  />
                </div>
                <div className="text-slate-300 text-xs sm:text-sm font-semibold mt-1.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==================== REASONS SECTION (CIRCLE GALLERY CAROUSEL) ==================== */}
      <section className="bg-[#F8FAFC] py-10 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Switcher */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                12 Reasons Radial Showcase
              </span>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center bg-white border border-slate-200 p-1 rounded-full shadow-2xs">
              <button
                onClick={() => setViewMode("3d")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "3d"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Circle className="w-3.5 h-3.5" />
                <span>Circle Gallery</span>
              </button>

              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid View</span>
              </button>
            </div>
          </div>

          {/* Render Circle Gallery Component */}
          {viewMode === "3d" ? (
            <div className="space-y-3 sm:space-y-4">
              <CircleGalleryRadial
                items={reasons}
                activeIndex={activeCardIndex}
                setActiveIndex={setActiveCardIndex}
              />

              {/* Active Reason Highlight Drawer */}
              <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-purple-200/90 p-5 sm:p-6 shadow-xl shadow-purple-950/5 relative overflow-hidden transition-all duration-300">
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${activeReason.color}`} />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${activeReason.color} text-white shadow-md`}>
                      {React.createElement(iconMap[activeReason.id] || Zap, { className: "w-5.5 h-5.5 stroke-[2.2]" })}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Reason #{activeReason.id}
                      </span>
                      <h3 className="text-slate-900 font-extrabold text-base sm:text-lg leading-snug">
                        {activeReason.title}
                      </h3>
                    </div>
                  </div>

                  <span className={`text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${activeReason.tagColor}`}>
                    {activeReason.tag}
                  </span>
                </div>

                <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
                  {activeReason.desc}
                </p>

                {activeReason.chips && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100">
                    {activeReason.chips.map((chip) => (
                      <span
                        key={chip}
                        className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold px-3 py-1 rounded-full"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Traditional Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {reasons.map((r, i) => {
                const IconComponent = iconMap[r.id] || Zap;

                return (
                  <div
                    key={r.id}
                    className={`group relative bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                      visible.includes(i) ? "animate-card-fade-up" : "opacity-0"
                    }`}
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    {/* Top Gradient Accent Bar */}
                    <div className={`h-1.5 w-full bg-gradient-to-r ${r.color}`} />

                    {/* Faint Large Number Watermark */}
                    <div className="absolute bottom-2 right-3 font-display text-6xl sm:text-7xl font-black number-stroke-watermark pointer-events-none select-none">
                      {r.id}
                    </div>

                    <div className="relative z-10 p-5 sm:p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Icon Chip + Tag Badge */}
                        <div className="flex items-start justify-between gap-2 mb-4">
                          <div 
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${r.color} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}
                          >
                            <IconComponent className="w-5 h-5 stroke-[2.2]" />
                          </div>

                          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-2xs ${r.tagColor}`}>
                            {r.tag}
                          </span>
                        </div>

                        {/* Card Title */}
                        <h3 className="text-slate-900 font-bold text-sm sm:text-base leading-snug mb-2 group-hover:text-amber-600 transition-colors">
                          {r.title}
                        </h3>

                        {/* Card Description */}
                        <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed font-normal">
                          {r.desc}
                        </p>
                      </div>

                      {/* Tech Chips on Card 05 */}
                      {r.chips && (
                        <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-100">
                          {r.chips.map((chip) => (
                            <span
                              key={chip}
                              className="bg-rose-50 border border-rose-200/80 text-rose-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full hover:scale-105 transition-transform cursor-default"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ==================== BOTTOM CTA BANNER ==================== */}
          <div className="mt-14 sm:mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#B026B5] via-purple-500 to-[#53BFEA] p-[1.5px] shadow-2xl shadow-purple-950/30">
            <div className="bg-gradient-to-br from-[#0B0F19] via-[#1A0B2E] to-[#0B0F19] rounded-[23px] p-8 sm:p-12 lg:p-14 text-center relative overflow-hidden">
              
              {/* Background ambient lighting (Zint Brand Colors) */}
              <div className="absolute inset-0 dot-matrix-overlay opacity-25 pointer-events-none" />
              <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-40 bg-[#B026B5]/25 blur-3xl rounded-full" />
              <div className="pointer-events-none absolute -bottom-10 right-1/4 w-80 h-40 bg-[#53BFEA]/20 blur-3xl rounded-full" />

              <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                {/* Trophy Icon */}
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B026B5]/15 border border-[#B026B5]/35 text-purple-300 mb-5 shadow-lg shadow-purple-500/10 backdrop-blur-md">
                  <Trophy className="w-7 h-7" />
                </div>

                {/* Headline */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight mb-3">
                  आज ही अपना{" "}
                  <span className="bg-gradient-to-r from-[#B026B5] via-purple-300 to-[#53BFEA] bg-clip-text text-transparent">
                    Future Secure
                  </span>{" "}
                  करें
                </h2>

                {/* Subtext */}
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal max-w-xl mx-auto mb-8">
                  Zint Institute Gwalior — जहाँ 17+ वर्षों के अनुभव के साथ हर student को उसकी dream career मिलती है।
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 justify-center items-center">
                  <button
                    onClick={handleEnquiryClick}
                    className="bg-gradient-to-r from-[#B026B5] via-purple-600 to-[#53BFEA] text-white font-extrabold text-xs sm:text-sm px-8 py-3.5 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>Free Counselling लें</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleCoursesClick}
                    className="border border-purple-300/30 text-purple-100 bg-white/5 hover:bg-white/10 font-bold text-xs sm:text-sm px-8 py-3.5 rounded-full backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Our Courses
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
