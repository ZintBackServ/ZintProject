

// function Blog(){
// return(
//     <div></div>
// )
// }

// export default Blog


import { useState, useEffect } from "react";

// ── Brand Colors ─────────────────────────────────
const DP = "#8E1387";  // DarkPurple
const PP = "#B11FA8";  // PrimaryPurple

const CATEGORY_URL = `${import.meta.env.VITE_API_URL}/category/getAllCategories`;
const COURSE_URL   = `${import.meta.env.VITE_API_URL}/course/getAllCourse`;
const REGISTER_URL = `${import.meta.env.VITE_API_URL}/registration/add`;


const DEGREES = [
  "School", "BE / B.Tech", "M.Tech", "BCA", "MCA",
  "BBA", "MBA", "B.Com", "B.Sc", "Others",
];

const DURATIONS = ["30 Days", "45 Days", "60 Days", "90 Days"];

const inputStyle = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: 12,
  fontSize: 15,
  color: "#1a0019",
  background: "#faf5fa",
  border: "1.5px solid #e8d8e7",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  appearance: "none",
};

const selectArrow = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%231a0019' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 16px center",
  paddingRight: 40,
  cursor: "pointer",
};

export default function InternshipRegistration() {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses]       = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    degree: "", courseCategory: "", course: "", duration: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [done, setDone]       = useState(false);

  // ── Fetch categories once on mount ──────────────
  useEffect(() => {
    const loadMeta = async () => {
      try {
        const catRes = await fetch(CATEGORY_URL);
        console.log(catRes);
        const catData = await catRes.json();
        setCategories(Array.isArray(catData) ? catData : catData.data || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoadingMeta(false);
      }
    };
    loadMeta();
  }, []);

  // ── Fetch all courses once, filter client-side by category ──
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res  = await fetch(COURSE_URL);
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Failed to load courses:", err);
      }
    };
    loadCourses();
  }, []);

  const coursesForCategory = courses.filter(
    (c) => String(c.category?._id || c.category) === String(form.courseCategory)
  );

  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const handleCategoryChange = (value) => {
    setForm((prev) => ({ ...prev, courseCategory: value, course: "" }));
    setError("");
  };

  const handleSubmit = async () => {
    const { name, email, phone, degree, courseCategory, course, duration } = form;

    if (!name || !email || !phone) {
      setError("Full name, email, and phone are required.");
      return;
    }
    if (!degree || !courseCategory || !course || !duration) {
      setError("Please complete all dropdown selections.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "internship",
          name,
          email,
          phone,
          degree,
          courseCategory,
          course,
          duration,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.msg || "Registration failed");
      }

      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const focusBorder = (e) => {
    e.target.style.borderColor = PP;
    e.target.style.boxShadow = `0 0 0 3px ${PP}1c`;
  };
  const blurBorder = (e) => {
    e.target.style.borderColor = "#e8d8e7";
    e.target.style.boxShadow = "none";
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#fafafa", padding: "40px 16px", fontFamily: "'Poppins', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
      `}</style>

      <div style={{
        width: "100%", maxWidth: 600, background: "#fff",
        border: `1px solid ${PP}1a`, borderRadius: 24,
        padding: "40px 36px", boxShadow: `0 8px 40px ${DP}0d`,
        animation: "slideUp 0.5s ease both",
      }}>
        {!done ? (
          <>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1a0019", marginBottom: 6 }}>
                Internship Registration
              </h2>
              <p style={{ fontSize: 13.5, color: "#7a4e77", fontWeight: 300 }}>
                Fill in your details to apply for the program.
              </p>
            </div>

            {error && (
              <div style={{
                background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626",
                borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 18,
                animation: "fadeIn 0.2s ease",
              }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {/* Full Name */}
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: DP, marginBottom: 8 }}>
                  Full Name <span style={{ color: PP }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  style={inputStyle}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: DP, marginBottom: 8 }}>
                  Email Address <span style={{ color: PP }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  style={inputStyle}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
              </div>

              {/* Phone */}
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: DP, marginBottom: 8 }}>
                  Phone Number <span style={{ color: PP }}>*</span>
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  style={inputStyle}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
              </div>

              {/* Degree */}
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: DP, marginBottom: 8 }}>
                  Degree
                </label>
                <select
                  value={form.degree}
                  onChange={(e) => set("degree", e.target.value)}
                  style={{ ...inputStyle, ...selectArrow }}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                >
                  <option value="">Select Degree</option>
                  {DEGREES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Course Category */}
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: DP, marginBottom: 8 }}>
                  Course Category
                </label>
                <select
                  value={form.courseCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  style={{ ...inputStyle, ...selectArrow, opacity: loadingMeta ? 0.6 : 1 }}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                  disabled={loadingMeta}
                >
                  <option value="">{loadingMeta ? "Loading categories…" : "Select Category"}</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Course */}
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: DP, marginBottom: 8 }}>
                  Course
                </label>
                <select
                  value={form.course}
                  onChange={(e) => set("course", e.target.value)}
                  style={{ ...inputStyle, ...selectArrow, opacity: form.courseCategory ? 1 : 0.6 }}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                  disabled={!form.courseCategory}
                >
                  <option value="">
                    {form.courseCategory ? "Select Course" : "Select a category first"}
                  </option>
                  {coursesForCategory.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: DP, marginBottom: 8 }}>
                  Duration
                </label>
                <select
                  value={form.duration}
                  onChange={(e) => set("duration", e.target.value)}
                  style={{ ...inputStyle, ...selectArrow }}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                >
                  <option value="">Select Duration</option>
                  {DURATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: "100%", padding: "16px", borderRadius: 14, border: "none",
                  background: loading ? `${PP}88` : `linear-gradient(135deg, ${DP}, ${PP})`,
                  color: "#fff", fontWeight: 700, fontSize: 16, cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : `0 8px 24px ${PP}40`,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  marginTop: 4,
                }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    <span style={{
                      width: 16, height: 16, border: "2.5px solid rgba(255,255,255,0.4)",
                      borderTopColor: "#fff", borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                    }} />
                    Submitting…
                  </span>
                ) : "Register for Internship →"}
              </button>

              <p style={{ textAlign: "center", fontSize: 12.5, color: "#b097af", fontWeight: 300 }}>
                No spam, ever. By registering you agree to our Terms.
              </p>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "32px 0", animation: "fadeIn 0.4s ease" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontSize: 24, fontWeight: 700, color: "#1a0019", marginBottom: 10 }}>
              You're In!
            </h3>
            <p style={{ fontSize: 14, color: "#7a4e77", marginBottom: 6, fontWeight: 300 }}>
              Thanks, <strong style={{ color: "#1a0019" }}>{form.name}</strong>! Your application has been received.
            </p>
            <p style={{ fontSize: 13, color: "#b097af", fontWeight: 300 }}>
              We'll reach out to <span style={{ color: PP }}>{form.email}</span> within 24 hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}