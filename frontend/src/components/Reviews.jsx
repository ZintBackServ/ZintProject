import { useState, useEffect, useRef, useCallback } from "react";

const reviews = [
  {
    id: 1, name: "Shanmuk Reddy", initials: "SR", rating: 4.5,
    course: "Real-Time Expert", date: "2 days ago",
    text: "I had an opportunity to learn multicloud DevOps under the guidance of Veera Sir and it was a great experience. His teaching style is clear and practical, making complex cloud concepts easy to understand.",
    gradient: "linear-gradient(135deg,#f472b6,#e879f9)",
  },
  {
    id: 2, name: "V Sai Krishna Teja", initials: "VK", rating: 5,
    course: "Real-Time Expert", date: "1 week ago",
    text: "I completed a data science course where Omkar Sir was my trainer. His teaching was excellent, focusing on real-world company problems, and I gained practical experience through internships.",
    gradient: "linear-gradient(135deg,#c026d3,#a855f7)",
  },
  {
    id: 3, name: "Priya Sharma", initials: "PS", rating: 5,
    course: "Full Stack Development", date: "3 days ago",
    text: "Best institute for full stack development. The curriculum is industry-aligned and the mentors are very supportive. Got placed in TCS within 2 months of completing the course!",
    gradient: "linear-gradient(135deg,#ec4899,#f43f5e)",
  },
  {
    id: 4, name: "Ravi Shankar", initials: "RS", rating: 4,
    course: "Java Backend", date: "5 days ago",
    text: "Good teaching staff especially the Java faculty. The hands-on projects really helped me understand core concepts deeply. Highly recommend for anyone looking to upskill in backend development.",
    gradient: "linear-gradient(135deg,#d946ef,#c026d3)",
  },
  {
    id: 5, name: "Anjali Mehta", initials: "AM", rating: 5,
    course: "Data Science", date: "2 weeks ago",
    text: "Outstanding learning experience. The data science program covers everything from Python basics to advanced ML algorithms. The placement support is exceptional — got 3 interview calls in the first week itself.",
    gradient: "linear-gradient(135deg,#f472b6,#c026d3)",
  },
  {
    id: 6, name: "Karthik Naidu", initials: "KN", rating: 4.5,
    course: "DevOps & Cloud", date: "1 month ago",
    text: "The DevOps course exceeded my expectations. Practical labs on AWS, Docker, and Kubernetes were top-notch. The trainer's industry experience really shows in the quality of content delivered.",
    gradient: "linear-gradient(135deg,#e879f9,#a855f7)",
  },
];

const TOTAL = reviews.length;

function StarRating({ rating }) {
  return (
    <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ fontSize: 14, color: rating >= i ? "#f472b6" : "#fce7f3" }}>★</span>
      ))}
    </div>
  );
}

function VerifiedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#c026d3" style={{ flexShrink: 0 }}>
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ReviewCard({ review }) {
  return (
    <div style={{
      background: "#fff",
      border: "0.5px solid #f0abcb",
      borderRadius: 16,
      padding: "22px 22px 18px",
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <StarRating rating={review.rating} />
        <span style={{ fontSize: 38, color: "#f9a8d4", lineHeight: 1, fontFamily: "Georgia, serif", marginTop: -6 }}>"</span>
      </div>

      <p style={{
        fontSize: 13, lineHeight: 1.65, color: "#4a2040", flex: 1, marginBottom: 16,
        display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {review.text}
      </p>

      <div style={{ height: "0.5px", background: "#fce7f3", marginBottom: 14 }} />

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: review.gradient,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 600, color: "#fff", flexShrink: 0,
        }}>
          {review.initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#2d1b30", display: "flex", alignItems: "center", gap: 4 }}>
            {review.name} <VerifiedIcon />
          </div>
          <div style={{ fontSize: 11, color: "#a855a1", marginTop: 1 }}>
            {review.course} · {review.date}
          </div>
        </div>
        <div style={{
          fontSize: 11, fontWeight: 600, color: "#a21caf",
          background: "#fdf4ff", border: "0.5px solid #e879f9",
          borderRadius: 7, padding: "2px 7px", flexShrink: 0,
        }}>
          {review.rating.toFixed(1)}
        </div>
      </div>
    </div>
  );
}

export default function ReviewSlider() {
  const [current, setCurrent] = useState(0);
  const [perPage, setPerPage] = useState(3);
  const vpRef = useRef(null);
  const touchSX = useRef(null);
  const autoRef = useRef(null);

  // Determine cards per page based on container width
  const updatePerPage = useCallback(() => {
    if (!vpRef.current) return;
    const w = vpRef.current.offsetWidth;
    if (w >= 900) setPerPage(3);
    else if (w >= 560) setPerPage(2);
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

  // Auto-advance
  useEffect(() => {
    autoRef.current = setInterval(() => {
      setCurrent(prev => {
        const next = prev + perPage;
        return next > maxIndex ? 0 : next;
      });
    }, 5000);
    return () => clearInterval(autoRef.current);
  }, [perPage, maxIndex]);

  const slideWidth = vpRef.current ? vpRef.current.offsetWidth / perPage : 0;

  const handleTouchStart = (e) => { touchSX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchSX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchSX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? current + perPage : current - perPage);
    touchSX.current = null;
    clearInterval(autoRef.current);
  };

  const activePage = Math.round(current / perPage);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: 1200 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "#fdf4ff", border: "0.5px solid #e879f9",
            borderRadius: 20, padding: "4px 14px",
            fontSize: 11, color: "#a21caf", fontWeight: 600,
            letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12,
          }}>
            ✦ Student success stories
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: "#2d1b30", margin: "0 0 6px" }}>
            What our students say
          </h1>
          <p style={{ fontSize: 14, color: "#a855a1", margin: 0 }}>
            Verified reviews from real students
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28, maxWidth: 600, margin: "0 auto 28px" }}>
          {[
            { val: "4.7", label: "Avg rating" },
            { val: "98%", label: "Recommend" },
            { val: "3,240", label: "Reviews" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "#fdf4ff", border: "0.5px solid #f0abcb",
              borderRadius: 12, padding: "12px", textAlign: "center",
            }}>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#a21caf", lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: "#9d4edd", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Slider viewport */}
        <div
          ref={vpRef}
          style={{ overflow: "hidden", position: "relative" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div style={{
            display: "flex",
            transition: "transform 0.42s cubic-bezier(0.4,0,0.2,1)",
            transform: `translateX(-${current * (slideWidth)}px)`,
          }}>
            {reviews.map((review) => (
              <div key={review.id} style={{ minWidth: `${100 / perPage}%`, padding: "0 6px", boxSizing: "border-box" }}>
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 20 }}>
          <button
            onClick={() => go(current - perPage)}
            aria-label="Previous"
            style={{
              width: 36, height: 36, borderRadius: "50%",
              border: "0.5px solid #f0abcb", background: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 18, color: "#c026d3",
            }}
          >‹</button>

          {/* Dots */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => go(i * perPage)}
                aria-label={`Page ${i + 1}`}
                style={{
                  height: 7,
                  width: i === activePage ? 20 : 7,
                  borderRadius: 4,
                  background: i === activePage ? "#c026d3" : "#f9a8d4",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.25s ease",
                }}
              />
            ))}
          </div>

          <button
            onClick={() => go(current + perPage)}
            aria-label="Next"
            style={{
              width: 36, height: 36, borderRadius: "50%",
              border: "0.5px solid #f0abcb", background: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 18, color: "#c026d3",
            }}
          >›</button>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <p style={{ fontSize: 13, color: "#9d4edd", marginBottom: 12 }}>
            Join <strong style={{ color: "#2d1b30" }}>5,000+</strong> students who transformed their careers
          </p>
          <button style={{
            padding: "12px 32px",
            background: "linear-gradient(135deg,#c026d3,#a855f7)",
            color: "#fff", border: "none", borderRadius: 12,
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>
            Start learning today
          </button>
        </div>

      </div>
    </div>
  );
}
