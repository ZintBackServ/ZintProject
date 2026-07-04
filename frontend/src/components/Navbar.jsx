
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import zintLogo from "../assets/zintLogo.jpeg";

// ── Mobile accordion ──────────────────────────────────────────────────────────
function MobileAccordion({ label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
      >
        {label}
        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="bg-gray-50 px-5 pb-3">{children}</div>}
    </li>
  );
}

// ── Desktop dropdown wrapper ──────────────────────────────────────────────────
function DesktopDropdown({ label, to, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {to ? (
        <Link to={to}
          className="flex items-center gap-1 px-2 lg:px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors whitespace-nowrap">
          {label}
          <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </Link>
      ) : (
        <button className="flex items-center gap-1 px-2 lg:px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors whitespace-nowrap">
          {label}
          <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-lg rounded-t-none border-b-4 border-purple-700 shadow-lg z-50 w-52 max-w-[calc(100vw-1rem)]">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Courses dropdown (desktop) ────────────────────────────────────────────────
function CoursesDropdown() {
  const [open, setOpen]                     = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories]         = useState([]);
  const [courses, setCourses]               = useState([]);
  const [loading, setLoading]               = useState(false);
  const [fetched, setFetched]               = useState(false);
  const ref                                 = useRef(null);
  const navigate                            = useNavigate();

  const fetchData = async () => {
    if (fetched) return;
    setFetched(true);
    setLoading(true);
    try {
      const [catRes, courseRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/category/getAllCategories`),
        fetch(`${import.meta.env.VITE_API_URL}/course/getAllCourse`),
      ]);
      const catJson    = await catRes.json();
      const courseJson = await courseRes.json();
      const extract = (res, keys) => {
        for (const k of keys) if (Array.isArray(res[k])) return res[k];
        if (Array.isArray(res)) return res;
        return [];
      };
      const cats = extract(catJson,    ["categories", "Data", "data"]);
      const crss = extract(courseJson, ["courses",    "Data", "data"]);
      setCategories(cats);
      setCourses(crss);
      if (cats.length > 0) setActiveCategory(cats[0]._id);
    } catch (err) {
      console.error("Navbar fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredCourses = activeCategory
    ? courses.filter((c) => {
        const catId = typeof c.category === "object" ? c.category?._id : c.category;
        return String(catId) === String(activeCategory);
      })
    : [];

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => { setOpen(true); fetchData(); }}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger */}
      <button className="flex items-center gap-1 px-2 lg:px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors whitespace-nowrap">
        Courses
        <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Panel — width scales with viewport instead of a hard 600px so it never
          overflows on md/tablet widths, and height caps relative to viewport height */}
      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-xl rounded-t-none border-b-4 border-purple-700 shadow-2xl z-50 w-[600px] max-w-[calc(100vw-1.5rem)]"
        >
          {loading ? (
            <div className="flex items-center justify-center py-10 text-gray-400 text-sm gap-2">
              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              Loading courses…
            </div>
          ) : (
            <div className="flex divide-x divide-gray-100 h-[min(380px,70vh)]">

              {/* LEFT — Categories — wider, full name, wraps */}
              <div className="shrink-0 flex flex-col w-[38%] min-w-[180px] max-w-[300px]">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 pt-4 pb-2">
                  Categories
                </p>
                <div className="flex-1 overflow-y-auto px-2 pb-3 custom-scroll">
                  {categories.length === 0 ? (
                    <p className="text-gray-400 text-xs px-2 py-2">No categories</p>
                  ) : (
                    categories.map((cat) => (
                      <div
                        key={cat._id}
                        onMouseEnter={() => setActiveCategory(cat._id)}
                        className={`flex justify-between items-start gap-2 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-colors ${
                          activeCategory === cat._id
                            ? "bg-purple-50 text-purple-700"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <span className="leading-snug">{cat.categoryName}</span>
                        <span className="text-gray-300 shrink-0 mt-0.5">›</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* RIGHT — Courses — single column, full name */}
              <div className="flex-1 flex flex-col min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 pt-4 pb-2">
                  Courses
                  {filteredCourses.length > 0 && (
                    <span className="ml-1.5 text-purple-400">({filteredCourses.length})</span>
                  )}
                </p>
                <div className="flex-1 overflow-y-auto px-3 pb-3 custom-scroll">
                  {filteredCourses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-2">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <p className="text-xs">No courses in this category</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-0.5">
                      {filteredCourses.map((course) => (
                        <div
                          key={course._id}
                          onClick={() => { navigate(`/courses/${course._id}`); setOpen(false); }}
                          className="group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors"
                        >
                          <div className="w-7 h-7 rounded-md bg-purple-100 flex items-center justify-center shrink-0 group-hover:bg-purple-200 transition-colors">
                            <svg className="w-3.5 h-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 group-hover:text-purple-700 transition-colors leading-snug">
                              {course.courseName}
                            </p>
                            {course.duration && (
                              <p className="text-[10px] text-gray-400 mt-0.5">{course.duration} months</p>
                            )}
                          </div>
                          <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-purple-400 shrink-0 transition-colors"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between bg-gray-50 rounded-b-xl gap-2">
            <p className="text-xs text-gray-400 truncate">{courses.length} courses available</p>
            <button
              onClick={() => { navigate("/courses"); setOpen(false); }}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1 shrink-0"
            >
              View all courses
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Mobile Courses accordion ──────────────────────────────────────────────────
function MobileCoursesAccordion({ onNavigate }) {
  const [open, setOpen]                     = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories]         = useState([]);
  const [courses, setCourses]               = useState([]);
  const [loading, setLoading]               = useState(false);
  const [fetched, setFetched]               = useState(false);
  const navigate                            = useNavigate();

  const fetchData = async () => {
    if (fetched) return;
    setFetched(true);
    setLoading(true);
    try {
      const [catRes, courseRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/category/getAllCategories`),
        fetch(`${import.meta.env.VITE_API_URL}/course/getAllCourse`),
      ]);
      const catJson    = await catRes.json();
      const courseJson = await courseRes.json();
      const extract = (res, keys) => {
        for (const k of keys) if (Array.isArray(res[k])) return res[k];
        if (Array.isArray(res)) return res;
        return [];
      };
      const cats = extract(catJson,    ["categories", "Data", "data"]);
      const crss = extract(courseJson, ["courses",    "Data", "data"]);
      setCategories(cats);
      setCourses(crss);
      if (cats.length > 0) setActiveCategory(cats[0]._id);
    } catch (err) {
      console.error("Mobile courses fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    if (!open) fetchData();
    setOpen(!open);
  };

  const filteredCourses = activeCategory
    ? courses.filter((c) => {
        const catId = typeof c.category === "object" ? c.category?._id : c.category;
        return String(catId) === String(activeCategory);
      })
    : [];

  return (
    <li className="border-b border-gray-100 last:border-0">
      <button
        onClick={toggle}
        className="w-full flex justify-between items-center px-2 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
      >
        Courses
        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center py-6 gap-2 text-gray-400 text-sm">
              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              Loading…
            </div>
          ) : (
            <div className="flex min-h-[240px] max-h-[60vh]">

              <div className="w-28 sm:w-36 shrink-0 border-r border-gray-200 overflow-y-auto bg-white">
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => setActiveCategory(cat._id)}
                    className={`w-full text-left px-3 py-3 text-xs font-semibold border-b border-gray-100 transition-colors leading-snug ${
                      activeCategory === cat._id
                        ? "bg-purple-50 text-purple-700 border-l-2 border-l-purple-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {cat.categoryName}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto px-2 py-2 min-w-0">
                {filteredCourses.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center pt-6">No courses in this category</p>
                ) : (
                  filteredCourses.map((course) => (
                    <button
                      key={course._id}
                      onClick={() => { navigate(`/courses/${course._id}`); onNavigate(); }}
                      className="w-full text-left flex items-start gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:text-purple-700 hover:bg-white transition-colors border-b border-gray-100 last:border-0"
                    >
                      <div className="w-5 h-5 rounded bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="font-medium leading-snug">{course.courseName}</span>
                    </button>
                  ))
                )}
              </div>

            </div>
          )}

          <div className="border-t border-gray-200 px-4 py-2.5">
            <button
              onClick={() => { navigate("/courses"); onNavigate(); }}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1"
            >
              View all courses →
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

// ── Course Search (fully responsive — works on mobile, tablet, desktop) ───────
function CourseSearch({ onNavigate }) {
  const [query, setQuery]     = useState("");
  const [courses, setCourses] = useState([]);
  const [open, setOpen]       = useState(false);
  const ref                   = useRef(null);
  const navigate               = useNavigate();

  // Fetch all courses once on mount so search works instantly
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res  = await fetch(`${import.meta.env.VITE_API_URL}/course/getAllCourse`);
        const json = await res.json();
        const extract = (res, keys) => {
          for (const k of keys) if (Array.isArray(res[k])) return res[k];
          if (Array.isArray(res)) return res;
          return [];
        };
        setCourses(extract(json, ["courses", "Data", "data"]));
      } catch (err) {
        console.error("Course search fetch error:", err);
      }
    };
    fetchCourses();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const results = query.trim()
    ? courses.filter((c) =>
        c.courseName?.toLowerCase().includes(query.trim().toLowerCase())
      )
    : [];

  const handleSelect = (course) => {
    navigate(`/courses/${course._id}`);
    setQuery("");
    setOpen(false);
    onNavigate?.();
  };

  const clearQuery = () => {
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full min-w-0">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search courses..."
          className="w-full pl-9 pr-8 py-2 text-sm bg-gray-100 rounded-lg border border-transparent focus:border-purple-400 focus:bg-white outline-none transition-colors"
        />
        {query && (
          <button
            onClick={clearQuery}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {open && query.trim() && (
        <div className="absolute top-full left-0 mt-1 w-full sm:w-80 max-w-[calc(100vw-1rem)] bg-white rounded-lg shadow-lg border border-gray-100 z-50 max-h-72 overflow-y-auto custom-scroll">
          {results.length === 0 ? (
            <p className="text-xs text-gray-400 px-4 py-3">
              No courses found for "{query}"
            </p>
          ) : (
            results.map((course) => (
              <button
                key={course._id}
                onClick={() => handleSelect(course)}
                className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors border-b border-gray-50 last:border-0"
              >
                <svg className="w-3.5 h-3.5 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate">{course.courseName}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout }        = useAuth();
  const navigate                = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); setMenuOpen(false); };
  const closeMenu    = () => setMenuOpen(false);

  const navLink = "px-2 lg:px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors whitespace-nowrap";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">

      {/* ── TOP BAR ──
          Single flat flex row: logo, search, desktop-menu, hamburger.
          Equal horizontal margin comes from the symmetric px-3/sm:px-6/lg:px-5
          padding below, and equal internal spacing comes from `gap-*` on the
          row itself — no nested "justify-between" wrapper, which is what was
          pushing everything to the right on mobile/tablet before. */}
      <div className="max-w-screen-xl mx-auto px-3 sm:px-6 lg:px-5">
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 h-16">

          {/* Logo */}
          <Link to="/" className="shrink-0">
            <img src={zintLogo} alt="Zint Logo" className="h-8 sm:h-9 md:h-10 w-auto" />
          </Link>

          {/* Search — below lg this grows to fill all remaining space between
              logo and hamburger (so mobile AND tablet get the same even
              logo/search/hamburger layout). At lg, once the desktop menu
              appears, it's capped so it doesn't crowd the nav links. */}
          <div className="flex-1 min-w-0 lg:max-w-[320px] lg:ml-6">
            <CourseSearch onNavigate={closeMenu} />
          </div>

          {/* ── Desktop menu — only from lg (1024px) up, so tablets keep the
              mobile-style logo/search/hamburger bar instead of a squeezed
              full nav ── */}
          <div className="hidden lg:flex items-center gap-0.5 lg:gap-1 flex-wrap justify-end min-w-0">
            <Link to="/"      className={navLink}>Home</Link>
            <Link to="/About" className={navLink}>About</Link>

            <CoursesDropdown />

            <DesktopDropdown label="Placement" to="/PlacementRegistration">
              <div className="flex flex-col p-2">
                {[
                  { to: "/PlacedStudent",         label: "Placed Student" },
                  { to: "/PlacementRegistration", label: "Placement Registration" },
                  { to: "/Internship",            label: "Internship" },
                ].map(({ to, label }) => (
                  <Link key={to} to={to}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-black rounded-lg hover:bg-purple-50 hover:text-purple-800 transition-colors">
                    {label}
                  </Link>
                ))}
              </div>
            </DesktopDropdown>

            <DesktopDropdown label="Admission">
              <div className="flex flex-col p-2">
                {[
                  { to: "/OnlineAdmission",  label: "Online Admission" },
                  { to: "/OnlineTraining",   label: "Online Training" },
                  { to: "/ApplyCertificate", label: "Apply Certificate" },
                  { to: "/OnlineTest",       label: "Online Test" },
                  { to: "/Services",         label: "Services" },
                  { to: "/Blog",             label: "Blog" },
                ].map(({ to, label }) => (
                  <Link key={to} to={to}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-black rounded-lg hover:bg-purple-50 hover:text-purple-800 transition-colors">
                    {label}
                  </Link>
                ))}
              </div>
            </DesktopDropdown>

            <DesktopDropdown label="Events" to="/Events">
              <div className="flex flex-col p-2">
                {[
                  { to: "/Webinar",  label: "Webinar" },
                  { to: "/Workshop", label: "Workshop" },
                ].map(({ to, label }) => (
                  <Link key={to} to={to}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-black rounded-lg hover:bg-purple-50 hover:text-purple-800 transition-colors">
                    {label}
                  </Link>
                ))}
              </div>
            </DesktopDropdown>

            {/* Auth */}
            <div className="flex items-center gap-1.5 ml-1 pl-2 border-l border-gray-200 shrink-0">
              {user?.role === "user" && (
                <Link to="/user/dashboard"
                  className="px-2 lg:px-3 py-2 text-sm font-semibold bg-purple-500 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap">
                  Dashboard
                </Link>
              )}
              {user?.role === "admin" && (
                <Link to="/admin/dashboard"
                  className="px-2 lg:px-3 py-2 text-sm font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-800 transition-colors whitespace-nowrap">
                  Admin
                </Link>
              )}
              {user ? (
                <button onClick={handleLogout}
                  className="px-2 lg:px-3 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap">
                  Logout
                </button>
              ) : (
                <Link to="/Login"
                  className="px-2 lg:px-3 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap">
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Hamburger — visible on everything below lg (phones and tablets) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile/tablet drawer (below lg) ── */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg max-h-[85vh] overflow-y-auto">
          <ul className="flex flex-col divide-y divide-gray-100">

            {[
              { to: "/",               label: "Home" },
              { to: "/About",          label: "About" },
              { to: "/Internship",     label: "Internship" },
              { to: "/OnlineTraining", label: "Online Training" },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} onClick={closeMenu}
                  className="block px-5 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors">
                  {label}
                </Link>
              </li>
            ))}

            <MobileCoursesAccordion onNavigate={closeMenu} />

            <MobileAccordion label="Placement">
              {[
                { to: "/PlacedStudent",         label: "Placed Student" },
                { to: "/PlacementRegistration", label: "Placement Registration" },
              ].map(({ to, label }, i, arr) => (
                <Link key={to} to={to} onClick={closeMenu}
                  className={`flex items-center gap-2 py-2.5 px-2 text-sm text-gray-700 hover:text-purple-600 rounded-lg hover:bg-white transition-colors ${
                    i < arr.length - 1 ? "border-b border-gray-100" : ""
                  }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />{label}
                </Link>
              ))}
            </MobileAccordion>

            <MobileAccordion label="Admission">
              {[
                { to: "/OnlineAdmission",  label: "Online Admission" },
                { to: "/ApplyCertificate", label: "Apply Certificate" },
                { to: "/OnlineTest",       label: "Online Test" },
                { to: "/Services",         label: "Services" },
                { to: "/Blog",             label: "Blog" },
              ].map(({ to, label }, i, arr) => (
                <Link key={to} to={to} onClick={closeMenu}
                  className={`flex items-center gap-2 py-2.5 px-2 text-sm text-gray-700 hover:text-purple-600 rounded-lg hover:bg-white transition-colors ${
                    i < arr.length - 1 ? "border-b border-gray-100" : ""
                  }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />{label}
                </Link>
              ))}
            </MobileAccordion>

            <MobileAccordion label="Events">
              {[
                { to: "/Webinar",  label: "Webinar" },
                { to: "/Workshop", label: "Workshop" },
              ].map(({ to, label }, i, arr) => (
                <Link key={to} to={to} onClick={closeMenu}
                  className={`flex items-center gap-2 py-2.5 px-2 text-sm text-gray-700 hover:text-purple-600 rounded-lg hover:bg-white transition-colors ${
                    i < arr.length - 1 ? "border-b border-gray-100" : ""
                  }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />{label}
                </Link>
              ))}
            </MobileAccordion>

            {user?.role === "user" && (
              <li>
                <Link to="/user/dashboard" onClick={closeMenu}
                  className="block px-5 py-3.5 text-sm font-semibold text-purple-600 hover:bg-purple-50 transition-colors">
                  My Dashboard
                </Link>
              </li>
            )}
            {user?.role === "admin" && (
              <li>
                <Link to="/admin/dashboard" onClick={closeMenu}
                  className="block px-5 py-3.5 text-sm font-semibold text-purple-600 hover:bg-purple-50 transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            )}

            <li className="p-4">
              {user ? (
                <button onClick={handleLogout}
                  className="w-full py-2.5 text-sm font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
                  Logout
                </button>
              ) : (
                <Link to="/Login" onClick={closeMenu}
                  className="block w-full py-2.5 text-center text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
                  Login
                </Link>
              )}
            </li>

          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

// import React, { useState, useRef, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import zintLogo from "../assets/zintLogo.jpeg";

// // ── Mobile accordion ──────────────────────────────────────────────────────────
// function MobileAccordion({ label, children }) {
//   const [open, setOpen] = useState(false);
//   return (
//     <li className="border-b border-gray-100 last:border-0">
//       <button
//         onClick={() => setOpen(!open)}
//         className="w-full flex justify-between items-center px-5 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
//       >
//         {label}
//         <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
//           fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//           <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//         </svg>
//       </button>
//       {open && <div className="bg-gray-50 px-5 pb-3">{children}</div>}
//     </li>
//   );
// }

// // ── Desktop dropdown wrapper ──────────────────────────────────────────────────
// function DesktopDropdown({ label, to, children }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);

//   useEffect(() => {
//     const handler = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   return (
//     <div
//       ref={ref}
//       className="relative"
//       onMouseEnter={() => setOpen(true)}
//       onMouseLeave={() => setOpen(false)}
//     >
//       {to ? (
//         <Link to={to}
//           className="flex items-center gap-1 px-2 lg:px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors whitespace-nowrap">
//           {label}
//           <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
//             fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//           </svg>
//         </Link>
//       ) : (
//         <button className="flex items-center gap-1 px-2 lg:px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors whitespace-nowrap">
//           {label}
//           <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
//             fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//           </svg>
//         </button>
//       )}
//       {open && (
//         <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-lg rounded-t-none border-b-4 border-purple-700 shadow-lg z-50 w-52 max-w-[calc(100vw-1rem)]">
//           {children}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Courses dropdown (desktop) ────────────────────────────────────────────────
// function CoursesDropdown() {
//   const [open, setOpen]                     = useState(false);
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [categories, setCategories]         = useState([]);
//   const [courses, setCourses]               = useState([]);
//   const [loading, setLoading]               = useState(false);
//   const [fetched, setFetched]               = useState(false);
//   const ref                                 = useRef(null);
//   const navigate                            = useNavigate();

//   const fetchData = async () => {
//     if (fetched) return;
//     setFetched(true);
//     setLoading(true);
//     try {
//       const [catRes, courseRes] = await Promise.all([
//         fetch(`${import.meta.env.VITE_API_URL}/category/getAllCategories`),
//         fetch(`${import.meta.env.VITE_API_URL}/course/getAllCourse`),
//       ]);
//       const catJson    = await catRes.json();
//       const courseJson = await courseRes.json();
//       const extract = (res, keys) => {
//         for (const k of keys) if (Array.isArray(res[k])) return res[k];
//         if (Array.isArray(res)) return res;
//         return [];
//       };
//       const cats = extract(catJson,    ["categories", "Data", "data"]);
//       const crss = extract(courseJson, ["courses",    "Data", "data"]);
//       setCategories(cats);
//       setCourses(crss);
//       if (cats.length > 0) setActiveCategory(cats[0]._id);
//     } catch (err) {
//       console.error("Navbar fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const handler = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const filteredCourses = activeCategory
//     ? courses.filter((c) => {
//         const catId = typeof c.category === "object" ? c.category?._id : c.category;
//         return String(catId) === String(activeCategory);
//       })
//     : [];

//   return (
//     <div
//       ref={ref}
//       className="relative"
//       onMouseEnter={() => { setOpen(true); fetchData(); }}
//       onMouseLeave={() => setOpen(false)}
//     >
//       {/* Trigger */}
//       <button className="flex items-center gap-1 px-2 lg:px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors whitespace-nowrap">
//         Courses
//         <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
//           fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//           <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//         </svg>
//       </button>

//       {/* Panel — width scales with viewport instead of a hard 600px so it never
//           overflows on md/tablet widths, and height caps relative to viewport height */}
//       {open && (
//         <div
//           className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-xl rounded-t-none border-b-4 border-purple-700 shadow-2xl z-50 w-[600px] max-w-[calc(100vw-1.5rem)]"
//         >
//           {loading ? (
//             <div className="flex items-center justify-center py-10 text-gray-400 text-sm gap-2">
//               <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
//               Loading courses…
//             </div>
//           ) : (
//             <div className="flex divide-x divide-gray-100 h-[min(380px,70vh)]">

//               {/* LEFT — Categories — wider, full name, wraps */}
//               <div className="shrink-0 flex flex-col w-[38%] min-w-[180px] max-w-[300px]">
//                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 pt-4 pb-2">
//                   Categories
//                 </p>
//                 <div className="flex-1 overflow-y-auto px-2 pb-3 custom-scroll">
//                   {categories.length === 0 ? (
//                     <p className="text-gray-400 text-xs px-2 py-2">No categories</p>
//                   ) : (
//                     categories.map((cat) => (
//                       <div
//                         key={cat._id}
//                         onMouseEnter={() => setActiveCategory(cat._id)}
//                         className={`flex justify-between items-start gap-2 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-colors ${
//                           activeCategory === cat._id
//                             ? "bg-purple-50 text-purple-700"
//                             : "hover:bg-gray-50 text-gray-700"
//                         }`}
//                       >
//                         <span className="leading-snug">{cat.categoryName}</span>
//                         <span className="text-gray-300 shrink-0 mt-0.5">›</span>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>

//               {/* RIGHT — Courses — single column, full name */}
//               <div className="flex-1 flex flex-col min-w-0">
//                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 pt-4 pb-2">
//                   Courses
//                   {filteredCourses.length > 0 && (
//                     <span className="ml-1.5 text-purple-400">({filteredCourses.length})</span>
//                   )}
//                 </p>
//                 <div className="flex-1 overflow-y-auto px-3 pb-3 custom-scroll">
//                   {filteredCourses.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-2">
//                       <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
//                           d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//                       </svg>
//                       <p className="text-xs">No courses in this category</p>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col gap-0.5">
//                       {filteredCourses.map((course) => (
//                         <div
//                           key={course._id}
//                           onClick={() => { navigate(`/courses/${course._id}`); setOpen(false); }}
//                           className="group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors"
//                         >
//                           <div className="w-7 h-7 rounded-md bg-purple-100 flex items-center justify-center shrink-0 group-hover:bg-purple-200 transition-colors">
//                             <svg className="w-3.5 h-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                 d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                             </svg>
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="text-sm font-semibold text-gray-800 group-hover:text-purple-700 transition-colors leading-snug">
//                               {course.courseName}
//                             </p>
//                             {course.duration && (
//                               <p className="text-[10px] text-gray-400 mt-0.5">{course.duration} months</p>
//                             )}
//                           </div>
//                           <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-purple-400 shrink-0 transition-colors"
//                             fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                           </svg>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//             </div>
//           )}

//           {/* Footer */}
//           <div className="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between bg-gray-50 rounded-b-xl gap-2">
//             <p className="text-xs text-gray-400 truncate">{courses.length} courses available</p>
//             <button
//               onClick={() => { navigate("/courses"); setOpen(false); }}
//               className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1 shrink-0"
//             >
//               View all courses
//               <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Mobile Courses accordion ──────────────────────────────────────────────────
// function MobileCoursesAccordion({ onNavigate }) {
//   const [open, setOpen]                     = useState(false);
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [categories, setCategories]         = useState([]);
//   const [courses, setCourses]               = useState([]);
//   const [loading, setLoading]               = useState(false);
//   const [fetched, setFetched]               = useState(false);
//   const navigate                            = useNavigate();

//   const fetchData = async () => {
//     if (fetched) return;
//     setFetched(true);
//     setLoading(true);
//     try {
//       const [catRes, courseRes] = await Promise.all([
//         fetch(`${import.meta.env.VITE_API_URL}/category/getAllCategories`),
//         fetch(`${import.meta.env.VITE_API_URL}/course/getAllCourse`),
//       ]);
//       const catJson    = await catRes.json();
//       const courseJson = await courseRes.json();
//       const extract = (res, keys) => {
//         for (const k of keys) if (Array.isArray(res[k])) return res[k];
//         if (Array.isArray(res)) return res;
//         return [];
//       };
//       const cats = extract(catJson,    ["categories", "Data", "data"]);
//       const crss = extract(courseJson, ["courses",    "Data", "data"]);
//       setCategories(cats);
//       setCourses(crss);
//       if (cats.length > 0) setActiveCategory(cats[0]._id);
//     } catch (err) {
//       console.error("Mobile courses fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggle = () => {
//     if (!open) fetchData();
//     setOpen(!open);
//   };

//   const filteredCourses = activeCategory
//     ? courses.filter((c) => {
//         const catId = typeof c.category === "object" ? c.category?._id : c.category;
//         return String(catId) === String(activeCategory);
//       })
//     : [];

//   return (
//     <li className="border-b border-gray-100 last:border-0">
//       <button
//         onClick={toggle}
//         className="w-full flex justify-between items-center px-2 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
//       >
//         Courses
//         <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
//           fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//           <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//         </svg>
//       </button>

//       {open && (
//         <div className="bg-gray-50">
//           {loading ? (
//             <div className="flex items-center justify-center py-6 gap-2 text-gray-400 text-sm">
//               <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
//               Loading…
//             </div>
//           ) : (
//             <div className="flex min-h-[240px] max-h-[60vh]">

//               <div className="w-28 sm:w-36 shrink-0 border-r border-gray-200 overflow-y-auto bg-white">
//                 {categories.map((cat) => (
//                   <button
//                     key={cat._id}
//                     onClick={() => setActiveCategory(cat._id)}
//                     className={`w-full text-left px-3 py-3 text-xs font-semibold border-b border-gray-100 transition-colors leading-snug ${
//                       activeCategory === cat._id
//                         ? "bg-purple-50 text-purple-700 border-l-2 border-l-purple-600"
//                         : "text-gray-600 hover:bg-gray-50"
//                     }`}
//                   >
//                     {cat.categoryName}
//                   </button>
//                 ))}
//               </div>

//               <div className="flex-1 overflow-y-auto px-2 py-2 min-w-0">
//                 {filteredCourses.length === 0 ? (
//                   <p className="text-xs text-gray-400 text-center pt-6">No courses in this category</p>
//                 ) : (
//                   filteredCourses.map((course) => (
//                     <button
//                       key={course._id}
//                       onClick={() => { navigate(`/courses/${course._id}`); onNavigate(); }}
//                       className="w-full text-left flex items-start gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:text-purple-700 hover:bg-white transition-colors border-b border-gray-100 last:border-0"
//                     >
//                       <div className="w-5 h-5 rounded bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
//                         <svg className="w-3 h-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                             d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                         </svg>
//                       </div>
//                       <span className="font-medium leading-snug">{course.courseName}</span>
//                     </button>
//                   ))
//                 )}
//               </div>

//             </div>
//           )}

//           <div className="border-t border-gray-200 px-4 py-2.5">
//             <button
//               onClick={() => { navigate("/courses"); onNavigate(); }}
//               className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1"
//             >
//               View all courses →
//             </button>
//           </div>
//         </div>
//       )}
//     </li>
//   );
// }

// // ── Course Search (fully responsive — works on mobile, tablet, desktop) ───────
// function CourseSearch({ onNavigate }) {
//   const [query, setQuery]     = useState("");
//   const [courses, setCourses] = useState([]);
//   const [open, setOpen]       = useState(false);
//   const ref                   = useRef(null);
//   const navigate               = useNavigate();

//   // Fetch all courses once on mount so search works instantly
//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const res  = await fetch(`${import.meta.env.VITE_API_URL}/course/getAllCourse`);
//         const json = await res.json();
//         const extract = (res, keys) => {
//           for (const k of keys) if (Array.isArray(res[k])) return res[k];
//           if (Array.isArray(res)) return res;
//           return [];
//         };
//         setCourses(extract(json, ["courses", "Data", "data"]));
//       } catch (err) {
//         console.error("Course search fetch error:", err);
//       }
//     };
//     fetchCourses();
//   }, []);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handler = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const results = query.trim()
//     ? courses.filter((c) =>
//         c.courseName?.toLowerCase().includes(query.trim().toLowerCase())
//       )
//     : [];

//   const handleSelect = (course) => {
//     navigate(`/courses/${course._id}`);
//     setQuery("");
//     setOpen(false);
//     onNavigate?.();
//   };

//   const clearQuery = () => {
//     setQuery("");
//     setOpen(false);
//   };

//   return (
//     <div ref={ref} className="relative  w-full min-w-0">
//       <div className="relative">
//         <svg
//           className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
//           fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
//         </svg>
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
//           onFocus={() => setOpen(true)}
//           placeholder="Search courses..."
//           className="w-full pl-9 pr-8 py-2 text-sm bg-gray-100 rounded-lg border border-transparent focus:border-purple-400 focus:bg-white outline-none transition-colors"
//         />
//         {query && (
//           <button
//             onClick={clearQuery}
//             aria-label="Clear search"
//             className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//           >
//             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         )}
//       </div>

//       {open && query.trim() && (
//         <div className="absolute top-full left-0 mt-1 w-full sm:w-80 max-w-[calc(100vw-1rem)] bg-white rounded-lg shadow-lg border border-gray-100 z-50 max-h-72 overflow-y-auto custom-scroll">
//           {results.length === 0 ? (
//             <p className="text-xs text-gray-400 px-4 py-3">
//               No courses found for "{query}"
//             </p>
//           ) : (
//             results.map((course) => (
//               <button
//                 key={course._id}
//                 onClick={() => handleSelect(course)}
//                 className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors border-b border-gray-50 last:border-0"
//               >
//                 <svg className="w-3.5 h-3.5 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                     d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                 </svg>
//                 <span className="truncate">{course.courseName}</span>
//               </button>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Main Navbar ───────────────────────────────────────────────────────────────
// function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const { user, logout }        = useAuth();
//   const navigate                = useNavigate();

//   const handleLogout = () => { logout(); navigate("/login"); setMenuOpen(false); };
//   const closeMenu    = () => setMenuOpen(false);

//   const navLink = "px-2 lg:px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors whitespace-nowrap";

//   return (
//     <nav className="bg-white shadow-md sticky top-0 z-50">

//       {/* ── TOP BAR ── */}
//       <div className="max-w-screen-xl flex flex-row justify-evenly items-center mx-auto px-2 sm:px-6 lg:px-5">
//           {/* Logo */}
//          <div>
//             <Link to="/" className="shrink-0">
//              <img src={zintLogo} alt="Zint Logo" className="h-8 sm:h-10 w-auto" />
//             </Link>
//          </div>

//          <div className="flex items-center gap-2 sm:gap-3 md:gap-3  h-16">

//           {/* Search — flexes to fill space on every screen size, with a
//               sensible cap so it never crowds out the hamburger/logo on
//               very narrow phones */}
//           <div className="flex-1 min-w-0 max-w-[160px] xs:max-w-[220px] sm:max-w-[320px] md:max-w-[420px]">
//             <CourseSearch onNavigate={closeMenu} />
//           </div>

//           {/* ── Desktop menu ── */}
//           <div className="hidden md:flex items-center gap-0.5 lg:gap-1 shrink-0 flex-wrap justify-end">
//             <Link to="/"      className={navLink}>Home</Link>
//             <Link to="/About" className={navLink}>About</Link>

//             <CoursesDropdown />

//             <DesktopDropdown label="Placement" to="/PlacementRegistration">
//               <div className="flex flex-col p-2">
//                 {[
//                   { to: "/PlacedStudent",         label: "Placed Student" },
//                   { to: "/PlacementRegistration", label: "Placement Registration" },
//                   { to: "/Internship",            label: "Internship" },
//                 ].map(({ to, label }) => (
//                   <Link key={to} to={to}
//                     className="flex items-center gap-2 px-3 py-2 text-sm text-black rounded-lg hover:bg-purple-50 hover:text-purple-800 transition-colors">
//                     {label}
//                   </Link>
//                 ))}
//               </div>
//             </DesktopDropdown>

//             <DesktopDropdown label="Admission">
//               <div className="flex flex-col p-2">
//                 {[
//                   { to: "/OnlineAdmission",  label: "Online Admission" },
//                   { to: "/OnlineTraining",   label: "Online Training" },
//                   { to: "/ApplyCertificate", label: "Apply Certificate" },
//                   { to: "/OnlineTest",       label: "Online Test" },
//                   { to: "/Services",         label: "Services" },
//                   { to: "/Blog",             label: "Blog" },
//                 ].map(({ to, label }) => (
//                   <Link key={to} to={to}
//                     className="flex items-center gap-2 px-3 py-2 text-sm text-black rounded-lg hover:bg-purple-50 hover:text-purple-800 transition-colors">
//                     {label}
//                   </Link>
//                 ))}
//               </div>
//             </DesktopDropdown>

//             <DesktopDropdown label="Events" to="/Events">
//               <div className="flex flex-col p-2">
//                 {[
//                   { to: "/Webinar",  label: "Webinar" },
//                   { to: "/Workshop", label: "Workshop" },
//                 ].map(({ to, label }) => (
//                   <Link key={to} to={to}
//                     className="flex items-center gap-2 px-3 py-2 text-sm text-black rounded-lg hover:bg-purple-50 hover:text-purple-800 transition-colors">
//                     {label}
//                   </Link>
//                 ))}
//               </div>
//             </DesktopDropdown>

//             {/* Auth */}
//             <div className="flex items-center gap-1.5 ml-1 pl-2 border-l border-gray-200 shrink-0">
//               {user?.role === "user" && (
//                 <Link to="/user/dashboard"
//                   className="px-2 lg:px-3 py-2 text-sm font-semibold bg-purple-500 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap">
//                   Dashboard
//                 </Link>
//               )}
//               {user?.role === "admin" && (
//                 <Link to="/admin/dashboard"
//                   className="px-2 lg:px-3 py-2 text-sm font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-800 transition-colors whitespace-nowrap">
//                   Admin
//                 </Link>
//               )}
//               {user ? (
//                 <button onClick={handleLogout}
//                   className="px-2 lg:px-3 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap">
//                   Logout
//                 </button>
//               ) : (
//                 <Link to="/Login"
//                   className="px-2 lg:px-3 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap">
//                   Login
//                 </Link>
//               )}
//             </div>
//           </div>

//           {/* Hamburger */}
//           <button
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="md:hidden ml-15 shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
//             aria-label="Toggle menu"
//           >
//             {menuOpen ? (
//               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             ) : (
//               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* ── Mobile drawer ── */}
//       {menuOpen && (
//         <div className="md:hidden border-t border-gray-100 bg-white shadow-lg max-h-[85vh] overflow-y-auto">
//           <ul className="flex flex-col divide-y divide-gray-100">

//             {[
//               { to: "/",               label: "Home" },
//               { to: "/About",          label: "About" },
//               { to: "/Internship",     label: "Internship" },
//               { to: "/OnlineTraining", label: "Online Training" },
//             ].map(({ to, label }) => (
//               <li key={to}>
//                 <Link to={to} onClick={closeMenu}
//                   className="block px-5 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors">
//                   {label}
//                 </Link>
//               </li>
//             ))}

//             <MobileCoursesAccordion onNavigate={closeMenu} />

//             <MobileAccordion label="Placement">
//               {[
//                 { to: "/PlacedStudent",         label: "Placed Student" },
//                 { to: "/PlacementRegistration", label: "Placement Registration" },
//               ].map(({ to, label }, i, arr) => (
//                 <Link key={to} to={to} onClick={closeMenu}
//                   className={`flex items-center gap-2 py-2.5 px-2 text-sm text-gray-700 hover:text-purple-600 rounded-lg hover:bg-white transition-colors ${
//                     i < arr.length - 1 ? "border-b border-gray-100" : ""
//                   }`}>
//                   <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />{label}
//                 </Link>
//               ))}
//             </MobileAccordion>

//             <MobileAccordion label="Admission">
//               {[
//                 { to: "/OnlineAdmission",  label: "Online Admission" },
//                 { to: "/ApplyCertificate", label: "Apply Certificate" },
//                 { to: "/OnlineTest",       label: "Online Test" },
//                 { to: "/Services",         label: "Services" },
//                 { to: "/Blog",             label: "Blog" },
//               ].map(({ to, label }, i, arr) => (
//                 <Link key={to} to={to} onClick={closeMenu}
//                   className={`flex items-center gap-2 py-2.5 px-2 text-sm text-gray-700 hover:text-purple-600 rounded-lg hover:bg-white transition-colors ${
//                     i < arr.length - 1 ? "border-b border-gray-100" : ""
//                   }`}>
//                   <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />{label}
//                 </Link>
//               ))}
//             </MobileAccordion>

//             <MobileAccordion label="Events">
//               {[
//                 { to: "/Webinar",  label: "Webinar" },
//                 { to: "/Workshop", label: "Workshop" },
//               ].map(({ to, label }, i, arr) => (
//                 <Link key={to} to={to} onClick={closeMenu}
//                   className={`flex items-center gap-2 py-2.5 px-2 text-sm text-gray-700 hover:text-purple-600 rounded-lg hover:bg-white transition-colors ${
//                     i < arr.length - 1 ? "border-b border-gray-100" : ""
//                   }`}>
//                   <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />{label}
//                 </Link>
//               ))}
//             </MobileAccordion>

//             {user?.role === "user" && (
//               <li>
//                 <Link to="/user/dashboard" onClick={closeMenu}
//                   className="block px-5 py-3.5 text-sm font-semibold text-purple-600 hover:bg-purple-50 transition-colors">
//                   My Dashboard
//                 </Link>
//               </li>
//             )}
//             {user?.role === "admin" && (
//               <li>
//                 <Link to="/admin/dashboard" onClick={closeMenu}
//                   className="block px-5 py-3.5 text-sm font-semibold text-purple-600 hover:bg-purple-50 transition-colors">
//                   Admin Dashboard
//                 </Link>
//               </li>
//             )}

//             <li className="p-4">
//               {user ? (
//                 <button onClick={handleLogout}
//                   className="w-full py-2.5 text-sm font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
//                   Logout
//                 </button>
//               ) : (
//                 <Link to="/Login" onClick={closeMenu}
//                   className="block w-full py-2.5 text-center text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
//                   Login
//                 </Link>
//               )}
//             </li>

//           </ul>
//         </div>
//       )}
//     </nav>
//   );
// }

// export default Navbar;
