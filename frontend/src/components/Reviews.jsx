import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Star, CheckCircle2, ChevronLeft, ChevronRight, Quote, MessageSquareQuote } from "lucide-react";

const reviews = [
  {
    id: 1, name: "Shivam Savita", initials: "SS", rating: 5,
    course: "MERN Stack Development", date: "2 days ago",
    text: "I learned multicloud DevOps and Full-Stack development at Zint Institute. The mentor's teaching style is clear and 100% practical, which made complex cloud and API concepts easy to implement in live projects.",
    gradient: "from-pink-500 to-purple-600",
  },
  {
    id: 2, name: "Rishi Chauhan", initials: "RC", rating: 5,
    course: "Data Science & AI", date: "1 week ago",
    text: "I completed the Python and Data Science course. The faculty focused heavily on real-world industrial datasets and machine learning algorithms. Gained hands-on experience through regular assignments.",
    gradient: "from-purple-600 to-indigo-600",
  },
  {
    id: 3, name: "Priya Sharma", initials: "PS", rating: 5,
    course: "Full Stack Web Dev", date: "3 days ago",
    text: "Best institute in Gwalior for software training. The syllabus is completely aligned with tech recruitment standards and the placement team helped me get placed within 2 months!",
    gradient: "from-fuchsia-500 to-pink-600",
  },
  {
    id: 4, name: "Anuj Dubey", initials: "AD", rating: 4.5,
    course: "Java Backend Engineering", date: "5 days ago",
    text: "Top-notch faculty for Java and Spring Boot. The practical project labs gave me deep confidence in building scalable REST APIs and handling database migrations.",
    gradient: "from-violet-600 to-purple-600",
  },
  {
    id: 5, name: "Anjali Mehta", initials: "AM", rating: 5,
    course: "Data Analytics & Tally", date: "2 weeks ago",
    text: "Outstanding learning atmosphere. The instructors guide you through every doubt patiently. The placement support is exceptional — received multiple interview calls right after course completion.",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    id: 6, name: "Satyam Purohit", initials: "SP", rating: 5,
    course: "Cloud & DevOps", date: "1 month ago",
    text: "The labs on Docker, Linux, and AWS exceeded my expectations. The mentors bring real industry experience, making every classroom session deeply valuable.",
    gradient: "from-purple-500 to-sky-500",
  },
];

const TOTAL = reviews.length;

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            rating >= i ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="h-full rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-md hover:shadow-xl hover:border-purple-200 transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-4">
          <StarRating rating={review.rating} />
          <Quote className="h-7 w-7 text-purple-200 group-hover:text-[#B11FA8]/30 transition-colors" />
        </div>

        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6 line-clamp-4">
          "{review.text}"
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${review.gradient} flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0`}>
            {review.initials}
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
              <span>{review.name}</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {review.course} · {review.date}
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-[#8E1387] border border-purple-100">
          {review.rating.toFixed(1)} ★
        </span>
      </div>
    </div>
  );
}

export default function ReviewSlider() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [perPage, setPerPage] = useState(3);
  const vpRef = useRef(null);
  const touchSX = useRef(null);

  const updatePerPage = useCallback(() => {
    if (!vpRef.current) return;
    const w = vpRef.current.offsetWidth;
    if (w >= 1024) setPerPage(3);
    else if (w >= 640) setPerPage(2);
    else setPerPage(1);
  }, []);

  useEffect(() => {
    updatePerPage();
    const ro = new ResizeObserver(updatePerPage);
    if (vpRef.current) ro.observe(vpRef.current);
    return () => ro.disconnect();
  }, [updatePerPage]);

  const maxIndex = Math.max(0, TOTAL - perPage);
  const totalPages = Math.ceil(TOTAL / perPage);

  const go = useCallback((n) => {
    const clamped = Math.max(0, Math.min(n, maxIndex));
    setCurrent(clamped);
  }, [maxIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => {
        const next = prev + 1;
        return next > maxIndex ? 0 : next;
      });
    }, 6000);
    return () => clearInterval(timer);
  }, [maxIndex]);

  const slideWidth = vpRef.current ? vpRef.current.offsetWidth / perPage : 0;

  const handleTouchStart = (e) => { touchSX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchSX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchSX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? current + 1 : current - 1);
    touchSX.current = null;
  };

  const activePage = Math.round(current / perPage);

  return (
    <section className="py-20 bg-[#FAF8FC] border-b border-purple-100/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 text-[#8E1387] border border-purple-200 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <MessageSquareQuote className="h-3.5 w-3.5 text-[#B11FA8]" />
            Student Testimonials
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight mb-4">
            Loved By Over <span className="bg-gradient-to-r from-[#8E1387] to-[#B11FA8] bg-clip-text text-transparent">5,000+ Students</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Read verified reviews and experiences from students who transformed their careers at Zint Institute.
          </p>
        </div>

        {/* ── Metrics Strip ── */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
          {[
            { val: "4.9 / 5.0", label: "Average Rating" },
            { val: "98%",       label: "Satisfaction Rate" },
            { val: "5,000+",    label: "Graduates" },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl bg-white border border-slate-200/80 p-4 text-center shadow-sm">
              <p className="text-xl sm:text-2xl font-black text-[#8E1387]">{s.val}</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Carousel Viewport ── */}
        <div
          ref={vpRef}
          className="overflow-hidden relative pb-4"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${current * slideWidth}px)` }}
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                style={{ minWidth: `${100 / perPage}%` }}
                className="px-3 box-border"
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Navigation Controls ── */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => go(current - 1)}
            disabled={current === 0}
            aria-label="Previous review"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 shadow-sm hover:border-[#B11FA8] hover:text-[#B11FA8] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => go(i * perPage)}
                aria-label={`Go to slide page ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activePage ? "w-7 bg-[#8E1387]" : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => go(current + 1)}
            disabled={current >= maxIndex}
            aria-label="Next review"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 shadow-sm hover:border-[#B11FA8] hover:text-[#B11FA8] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
