import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Briefcase, GraduationCap, Sparkles, Building2, TrendingUp } from "lucide-react";
import { toHttps } from "../utils/imgUrl";

export default function PlacedStudentsSlider() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/placedStudent/allPlacedStudent`);
        const data = await res.json();
        const list = data.placedStudents || data.data || (Array.isArray(data) ? data : []);
        setStudents(list);
      } catch (err) {
        console.error("Placement fetch error:", err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#0b0212] via-[#11041d] to-[#0b0212] relative overflow-hidden text-white border-b border-white/10">
      
      {/* Ambient background glow elements */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-purple-600/10 rounded-full blur-[150px]" />
      <div className="pointer-events-none absolute bottom-0 right-10 w-[450px] h-[300px] bg-[#53BFEA]/10 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 left-0 w-[400px] h-[300px] bg-[#B11FA8]/10 rounded-full blur-[130px]" />

      {/* Background Decorative Grid */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* ── Section Header ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center mb-8 sm:mb-10 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-purple-500/25 shadow-lg shadow-purple-900/10 mb-2.5 backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-[#53BFEA] animate-pulse" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] bg-gradient-to-r from-[#53BFEA] via-purple-300 to-[#45B51D] bg-clip-text text-transparent">
            Proven Career Success
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
          Our Proud Alumni Placed At{" "}
          <span className="bg-gradient-to-r from-[#45B51D] via-[#53BFEA] to-[#B11FA8] bg-clip-text text-transparent">
            Top Tech Companies
          </span>
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-lg mx-auto font-medium leading-relaxed">
          Over <span className="text-white font-bold underline decoration-purple-500/50">5,000+ graduates</span> launched their dream careers in Full Stack, Data Science, AI, and IT through Zint.
        </p>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-12 h-12 border-4 border-[#B11FA8] border-t-transparent rounded-full animate-spin shadow-lg shadow-purple-500/20" />
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 bg-white/[0.02] border border-white/10 rounded-2xl max-w-md mx-auto">
          <p className="text-slate-400 text-sm font-medium">No placement records found.</p>
        </div>
      ) : (
        <ScrollRow students={students} />
      )}
    </section>
  );
}

function ScrollRow({ students }) {
  const scrollRef = useRef(null);
  const rafRef = useRef(null);
  const isPausedRef = useRef(false);
  const resumeTimeoutRef = useRef(null);

  const loopData = [...students, ...students, ...students];
  const SPEED = 0.75;

  const tick = useCallback(() => {
    const el = scrollRef.current;
    if (el && !isPausedRef.current) {
      el.scrollLeft += SPEED;
      if (el.scrollLeft >= el.scrollWidth / 3) {
        el.scrollLeft -= el.scrollWidth / 3;
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resumeTimeoutRef.current);
    };
  }, [tick, students]);

  const pauseAutoScroll = () => {
    isPausedRef.current = true;
  };

  const resumeAutoScroll = (delay = 0) => {
    clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, delay);
  };

  const scrollByAmount = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    pauseAutoScroll();

    const cardWidth = el.firstElementChild?.getBoundingClientRect().width || 260;
    const delta = dir * (cardWidth + 24) * 2;

    el.scrollBy({ left: delta, behavior: "smooth" });
    resumeAutoScroll(1400);
  };

  return (
    <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Left button */}
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollByAmount(-1)}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md border border-white/20 shadow-2xl transition-all duration-300 hover:bg-[#B11FA8] hover:border-[#B11FA8] hover:scale-110 active:scale-95 cursor-pointer group"
      >
        <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-0.5" />
      </button>

      {/* Right button */}
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollByAmount(1)}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md border border-white/20 shadow-2xl transition-all duration-300 hover:bg-[#B11FA8] hover:border-[#B11FA8] hover:scale-110 active:scale-95 cursor-pointer group"
      >
        <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* Edge Soft Fade Gradients */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-20 sm:w-32 z-10 bg-gradient-to-r from-[#0b0212] via-[#0b0212]/80 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-20 sm:w-32 z-10 bg-gradient-to-l from-[#0b0212] via-[#0b0212]/80 to-transparent" />

      {/* Infinite Scroll Container */}
      <div
        ref={scrollRef}
        onMouseEnter={pauseAutoScroll}
        onMouseLeave={() => resumeAutoScroll(0)}
        className="flex gap-5 sm:gap-6 overflow-x-auto px-4 py-6 scroll-smooth scrollbar-hide"
      >
        {loopData.map((student, i) => (
          <StudentCard key={`${student._id || student.name}-${i}`} student={student} />
        ))}
      </div>
    </div>
  );
}

function StudentCard({ student }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="flex-none w-[175px] sm:w-[195px] rounded-2xl overflow-hidden bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-white/[0.01] border border-white/15 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-[#B11FA8]/70 hover:shadow-[0_12px_30px_rgba(177,31,168,0.25)] hover:-translate-y-1.5 group relative flex flex-col justify-between">
      
      {/* Top Subtle Color Accent Glow */}
      <div className="h-1 w-full bg-gradient-to-r from-[#B11FA8] via-[#53BFEA] to-[#45B51D]" />

      <div>
        {/* Student Photo Container */}
        <div className="relative w-full h-40 sm:h-44 overflow-hidden bg-gradient-to-b from-slate-900 to-[#120420]">
          {student.profileImage && !imgErr ? (
            <img
              src={toHttps(student.profileImage)}
              alt={`${student.name} - Placed student`}
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
              decoding="async"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl font-extrabold text-white bg-gradient-to-br from-[#8E1387] via-[#53BFEA] to-[#45B51D]">
              {(student.name || "S").charAt(0).toUpperCase()}
            </div>
          )}

          {/* Vignette Shadow Overlay for seamless image blending */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#120420] via-transparent to-transparent opacity-90" />

          {/* Salary Package Badge */}
          {student.package && (
            <div className="absolute top-2 right-2 z-10">
              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30 border border-emerald-300/40 backdrop-blur-md">
                <TrendingUp className="w-3 h-3" />
                {student.package} LPA
              </span>
            </div>
          )}
        </div>

        {/* Student Metadata Card Body */}
        <div className="p-3 relative z-10 -mt-1.5">
          {/* Student Name */}
          <h3 className="font-bold text-sm sm:text-base text-white truncate group-hover:text-[#53BFEA] transition-colors tracking-tight">
            {student.name || "Placed Student"}
          </h3>

          {/* Course */}
          {student.course && (
            <p className="text-[11px] font-medium text-slate-300 mt-1 flex items-center gap-1.5 truncate">
              <GraduationCap className="h-3.5 w-3.5 text-[#B11FA8] shrink-0" />
              <span className="truncate">{student.course}</span>
            </p>
          )}
        </div>
      </div>

      {/* Company Footer Badge */}
      {student.company && (
        <div className="px-3 pb-3 pt-0">
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/[0.05] border border-white/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all">
            <Building2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] font-bold text-emerald-300 truncate">{student.company}</span>
          </div>
        </div>
      )}

    </div>
  );
}
