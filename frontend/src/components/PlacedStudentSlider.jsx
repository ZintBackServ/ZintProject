// components/PlacedStudentsSlider.jsx
// Fetches all placed students and renders a 2-row auto-scroll carousel.
// Shows: profileImage, name, course, package, logoImage (right of name — no text company name)

import { useEffect, useRef, useState } from "react";

  const DarkPurple = "#8E1387";
  const PrimaryPurple = "#B11FA8";
  const LightPurple = "#C94CC2";
  const BLUE = "#53BFEA";
  const GREEN = "#45B51D";

export default function PlacedStudentsSlider() {
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res  = await fetch(`${import.meta.env.VITE_API_URL}/placedStudent/allPlacedStudent`);
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

  const mid  = Math.ceil(students.length / 2);
  const row1 = students.slice(0, mid);
  const row2 = students.slice(mid);

  return (
    <section style={{ background: "#111827" }} className="py-16 overflow-hidden">
      {/* ── Header ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 text-center">
        <p className="text-xs text-fuchsia-200 font-bold uppercase tracking-widest mb-2">
          Our Alumni
        </p>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          Students Who Got{" "}
          <span style={{
            color: `${LightPurple}`,
          }}>
            Placed
          </span>
          {/* <span style={{ color: "#22C55E" }}>Placed</span> */}
        </h2>
        <p className="text-gray-400 text-sm mt-2">
          Join thousands of successful graduates working at top companies
        </p>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div
            className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: "#B026B5 #B026B5 #B026B5 transparent" }}
          />
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 text-sm">No placement records found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {row1.length > 0 && <ScrollRow students={row1} direction={1}  />}
          {row2.length > 0 && <ScrollRow students={row2} direction={-1} />}
        </div>
      )}
    </section>
  );
}

/* ── Scrolling row ─────────────────────────────────────────────────────────── */
function ScrollRow({ students, direction }) {
  const scrollRef   = useRef(null);
  const intervalRef = useRef(null);

  // Duplicate list for seamless infinite loop
  const loopData = [...students, ...students];

  const startScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    intervalRef.current = setInterval(() => {
      el.scrollLeft += direction;
      if (direction > 0) {
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth) el.scrollLeft = 0;
      } else {
        if (el.scrollLeft <= 0) el.scrollLeft = el.scrollWidth - el.clientWidth;
      }
    }, 20);
  };

  const stopScroll = () => clearInterval(intervalRef.current);

  useEffect(() => {
    startScroll();
    return () => clearInterval(intervalRef.current);
  }, [students]);

  return (
    <div
      ref={scrollRef}
      onMouseEnter={stopScroll}
      onMouseLeave={startScroll}
      className="flex gap-5 overflow-x-auto px-6 py-2"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {loopData.map((student, i) => (
        <StudentCard key={`${student._id || student.name}-${i}`} student={student} />
      ))}
    </div>
  );
}

/* ── Student Card ──────────────────────────────────────────────────────────── */
function StudentCard({ student }) {
  const [imgErr,  setImgErr]  = useState(false);
  const [logoErr, setLogoErr] = useState(false);

  return (
    <div
      className="flex-none w-56 sm:w-64 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 group"
      style={{
        background:  "#1f2937",
        border:      "1px solid #374151",
        boxShadow:   "0 4px 20px rgba(0,0,0,0.25)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "#38BDF8";
        e.currentTarget.style.boxShadow   = "0 8px 32px rgba(56,189,248,0.18)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "#374151";
        e.currentTarget.style.boxShadow   = "0 4px 20px rgba(0,0,0,0.25)";
      }}
    >
      {/* top gradient bar */}
      <div className="h-0.5" style={{ background: "linear-gradient(90deg, #B026B5, #38BDF8)" }} />

      {/* Profile photo */}
      <div className="relative w-full h-40 overflow-hidden bg-gray-800">
        {student.profileImage && !imgErr ? (
          <img
            src={student.profileImage}
            alt={student.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl font-extrabold text-white"
            style={{ background: "linear-gradient(135deg, #B026B5 0%, #38BDF8 100%)" }}
          >
            {(student.name || "S").charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Name row — company logo on the RIGHT, no company name text */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-white font-bold text-sm truncate flex-1">
            {student.name || "Student"}
          </h3>

          {/* Company logo — shown only if logoImage exists and hasn't errored */}
          {student.logoImage && !logoErr && (
            <img
              src={student.logoImage}
              alt="company"
              className="w-8 h-8 rounded-md object-contain flex-shrink-0"
              style={{ background: "white", padding: "2px" }}
              onError={() => setLogoErr(true)}
            />
          )}
        </div>

        {student.course && (
          <p className="text-xs mt-1 truncate" style={{ color: "#38BDF8" }}>
            {student.course}
          </p>
        )}

        {student.package && (
          <div className="mt-3">
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(34,197,94,0.15)", color: "#22C55E" }}
            >
              💰 {student.package}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
