
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
          className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors">
          {label}
          <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </Link>
      ) : (
        <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors">
          {label}
          <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-lg rounded-t-none border-b-4 border-purple-700 shadow-lg z-50 w-52">
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
      <button  className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors">
        Courses
        <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-xl rounded-t-none border-b-4 border-purple-700 shadow-2xl z-50"
          style={{ width: "600px" }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-10 text-gray-400 text-sm gap-2">
              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              Loading courses…
            </div>
          ) : (
            <div className="flex divide-x divide-gray-100" style={{ height: "380px" }}>

              {/* LEFT — Categories — wider, full name, wraps */}
              <div className="shrink-0 flex flex-col" style={{ width: "300px" }}>
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
                        {/* full name — no truncate, wraps naturally */}
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
                    /* single column — no grid */
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
                            {/* full course name — wraps if long */}
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
          <div className="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between bg-gray-50 rounded-b-xl">
            <p className="text-xs text-gray-400">{courses.length} courses available</p>
            <button
              onClick={() => { navigate("/courses"); setOpen(false); }}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1"
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
            <div className="flex" style={{ minHeight: "240px", maxHeight: "380px" }}>

              {/* Left — category tabs, full name */}
              <div className="w-36 shrink-0 border-r border-gray-200 overflow-y-auto bg-white">
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

              {/* Right — courses, single column, full name */}
              <div className="flex-1 overflow-y-auto px-2 py-2">
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
                      {/* full name — wraps onto next line if needed */}
                      <span className="font-medium leading-snug">{course.courseName}</span>
                    </button>
                  ))
                )}
              </div>

            </div>
          )}

          {/* Footer */}
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

// ── Main Navbar ───────────────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout }        = useAuth();
  const navigate                = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); setMenuOpen(false); };
  const closeMenu    = () => setMenuOpen(false);

  const navLink = "px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">

      {/* ── TOP BAR ── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="shrink-0">
            <img src={zintLogo} alt="Zint Logo" className="h-9 w-auto" />
          </Link>

          {/* ── Desktop menu ── */}
          <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
            <Link to="/"      className={navLink}>Home</Link>
            <Link to="/About" className={navLink}>About</Link>

            <CoursesDropdown />

            <Link to="/Internship"     className={`hidden lg:block ${navLink}`}>Internship</Link>
            <Link to="/OnlineTraining" className={`hidden lg:block ${navLink}`}>Online Training</Link>

            <DesktopDropdown label="Placement" to="/PlacementRegistration">
              <div className="flex flex-col p-2">
                {[
                  { to: "/PlacedStudent",         label: "Placed Student" },
                  { to: "/PlacementRegistration", label: "Placement Registration" },
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
            <div className="flex items-center gap-1.5 ml-1 pl-2 border-l border-gray-200">
              {user?.role === "user" && (
                <Link to="/user/dashboard"
                  className="px-3 py-2 text-sm font-semibold bg-purple-500 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Dashboard
                </Link>
              )}
              {user?.role === "admin" && (
                <Link to="/admin/dashboard"
                  className="px-3 py-2 text-sm font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-800 transition-colors">
                  Admin
                </Link>
              )}
              {user ? (
                <button onClick={handleLogout}
                  className="px-3 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  Logout
                </button>
              ) : (
                <Link to="/Login"
                  className="px-3 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
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

      {/* ── Tablet secondary row (md only) ── */}
      <div className="hidden md:flex lg:hidden border-t border-gray-100 px-6 py-1 gap-1 bg-gray-50 justify-center">
        <Link to="/Internship"     className={navLink}>Internship</Link>
        <Link to="/OnlineTraining" className={navLink}>Online Training</Link>
      </div>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg max-h-[85vh] overflow-y-auto">
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
//     <div ref={ref} className="relative"
//       onMouseEnter={() => setOpen(true)}
//       onMouseLeave={() => setOpen(false)}
//     >
//       {to ? (
//         <Link to={to}
//           className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors">
//           {label}
//           <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
//             fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//           </svg>
//         </Link>
//       ) : (
//         <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors">
//           {label}
//           <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
//             fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//           </svg>
//         </button>
//       )}
//       {open && (
//         <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-lg rounded-t-none border-b-4 border-purple-700 shadow-lg z-50 w-52">
//           {children}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Courses dropdown (desktop) ────────────────────────────────────────────────
// function CoursesDropdown() {
//   const [open, setOpen]                   = useState(false);
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [categories, setCategories]       = useState([]);
//   const [courses, setCourses]             = useState([]);
//   const [loading, setLoading]             = useState(false);
//   const [fetched, setFetched]             = useState(false);
//   const ref                               = useRef(null);
//   const navigate                          = useNavigate();

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
//     <div ref={ref} className="relative"
//       onMouseEnter={() => { setOpen(true); fetchData(); }}
//       onMouseLeave={() => setOpen(false)}
//     >
//       {/* Trigger */}
//       <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors">
//         Courses
//         <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
//           fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//           <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//         </svg>
//       </button>

//       {/* Panel — wider, fixed height with scroll */}
//       {open && (
//         <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-xl rounded-t-none border-b-4 border-purple-700 shadow-2xl z-50"
//           style={{ width: "640px" }}>
//           {loading ? (
//             <div className="flex items-center justify-center py-10 text-gray-400 text-sm gap-2">
//               <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
//               Loading courses…
//             </div>
//           ) : (
//             <div className="flex divide-x divide-gray-100" style={{ height: "360px" }}>

//               {/* LEFT — Categories (scrollable) */}
//               <div className="w-56 shrink-0 flex flex-col">
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
//                         className={`flex justify-between items-center px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-colors ${
//                           activeCategory === cat._id
//                             ? "bg-purple-50 text-purple-700"
//                             : "hover:bg-gray-50 text-gray-700"
//                         }`}
//                       >
//                         <span className="truncate pr-1">{cat.categoryName}</span>
//                         <span className="text-gray-300 shrink-0">›</span>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>

//               {/* RIGHT — Courses (scrollable grid) */}
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
//                     <div className="grid grid-cols-2 gap-1.5">
//                       {filteredCourses.map((course) => (
//                         <div
//                           key={course._id}
//                           onClick={() => { navigate(`/courses/${course._id}`); setOpen(false); }}
//                           className="group flex items-start gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors"
//                         >
//                           {/* Course icon placeholder */}
//                           <div className="w-7 h-7 rounded-md bg-purple-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-purple-200 transition-colors">
//                             <svg className="w-3.5 h-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                 d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                             </svg>
//                           </div>
//                           <div className="min-w-0">
//                             <p className="text-sm font-semibold text-gray-800 group-hover:text-purple-700 transition-colors leading-snug truncate">
//                               {course.courseName}
//                             </p>
//                             {course.duration && (
//                               <p className="text-[10px] text-gray-400 mt-0.5">{course.duration} months</p>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//             </div>
//           )}

//           {/* Footer */}
//           <div className="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between bg-gray-50 rounded-b-xl">
//             <p className="text-xs text-gray-400">{courses.length} courses available</p>
//             <button
//               onClick={() => { navigate("/courses"); setOpen(false); }}
//               className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1">
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
//   const [open, setOpen]               = useState(false);
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [categories, setCategories]   = useState([]);
//   const [courses, setCourses]         = useState([]);
//   const [loading, setLoading]         = useState(false);
//   const [fetched, setFetched]         = useState(false);
//   const navigate                      = useNavigate();

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
//       <button onClick={toggle}
//         className="w-full flex justify-between items-center px-5 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors">
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
//             <div className="flex" style={{ minHeight: "240px", maxHeight: "360px" }}>

//               {/* Left — category tabs */}
//               <div className="w-32 shrink-0 border-r border-gray-200 overflow-y-auto bg-white">
//                 {categories.map((cat) => (
//                   <button
//                     key={cat._id}
//                     onClick={() => setActiveCategory(cat._id)}
//                     className={`w-full text-left px-3 py-3 text-xs font-semibold border-b border-gray-100 transition-colors ${
//                       activeCategory === cat._id
//                         ? "bg-purple-50 text-purple-700 border-l-2 border-l-purple-600"
//                         : "text-gray-600 hover:bg-gray-50"
//                     }`}
//                   >
//                     {cat.categoryName}
//                   </button>
//                 ))}
//               </div>

//               {/* Right — courses */}
//               <div className="flex-1 overflow-y-auto px-2 py-2">
//                 {filteredCourses.length === 0 ? (
//                   <p className="text-xs text-gray-400 text-center pt-6">No courses in this category</p>
//                 ) : (
//                   filteredCourses.map((course) => (
//                     <button
//                       key={course._id}
//                       onClick={() => { navigate(`/courses/${course._id}`); onNavigate(); }}
//                       className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:text-purple-700 hover:bg-white transition-colors border-b border-gray-100 last:border-0"
//                     >
//                       <div className="w-5 h-5 rounded bg-purple-100 flex items-center justify-center shrink-0">
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

//           {/* Footer */}
//           <div className="border-t border-gray-200 px-4 py-2.5">
//             <button
//               onClick={() => { navigate("/courses"); onNavigate(); }}
//               className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1">
//               View all courses →
//             </button>
//           </div>
//         </div>
//       )}
//     </li>
//   );
// }

// // ── Main Navbar ───────────────────────────────────────────────────────────────
// function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const { user, logout }        = useAuth();
//   const navigate                = useNavigate();

//   const handleLogout = () => { logout(); navigate("/login"); setMenuOpen(false); };
//   const closeMenu    = () => setMenuOpen(false);

//   const navLink = "px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors";

//   return (
//     <nav className="bg-white shadow-md sticky top-0 z-50">

//       {/* ── TOP BAR ── */}
//       <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">

//           {/* Logo */}
//           <Link to="/" className="shrink-0">
//             <img src={zintLogo} alt="Zint Logo" className="h-9 w-auto" />
//           </Link>
           
           

//           {/* ── Desktop menu ── */}
//           <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
//             <Link to="/"      className={navLink}>Home</Link>
//             <Link to="/About" className={navLink}>About</Link>
            
//             <CoursesDropdown />

//             {/* Internship & Online Training — hidden on md, shown on lg */}
//             <Link to="/Internship"     className={`hidden lg:block ${navLink}`}>Internship</Link>
//             <Link to="/OnlineTraining" className={`hidden lg:block ${navLink}`}>Online Training</Link>

//             <DesktopDropdown label="Placement" to="/PlacementRegistration">
//               <div className="flex flex-col p-2">
//                 {[
//                   { to: "/PlacedStudent",         label: "Placed Student" },
//                   { to: "/PlacementRegistration", label: "Placement Registration" },
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
//             <div className="flex items-center gap-1.5 ml-1 pl-2 border-l border-gray-200">
//               {user?.role === "user" && (
//                 <Link to="/user/dashboard"
//                   className="px-3 py-2 text-sm font-semibold bg-purple-500 text-white rounded-lg hover:bg-purple-700 transition-colors">
//                   Dashboard
//                 </Link>
//               )}
//               {user?.role === "admin" && (
//                 <Link to="/admin/dashboard"
//                   className="px-3 py-2 text-sm font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-800 transition-colors">
//                   Admin
//                 </Link>
//               )}
//               {user ? (
//                 <button onClick={handleLogout}
//                   className="px-3 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
//                   Logout
//                 </button>
//               ) : (
//                 <Link to="/Login"
//                   className="px-3 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
//                   Login
//                 </Link>
//               )}
//             </div>
//           </div>

//           {/* Hamburger */}
//           <button
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
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

//       {/* ── Tablet secondary row (md only) ── */}
//       <div className="hidden md:flex lg:hidden border-t border-gray-100 px-6 py-1 gap-1 bg-gray-50 justify-center">
//         <Link to="/Internship"     className={navLink}>Internship</Link>
//         <Link to="/OnlineTraining" className={navLink}>Online Training</Link>
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


// // import React, { useState, useRef, useEffect } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import { useAuth } from "../context/AuthContext";
// // import zintLogo from "../assets/zintLogo.jpeg";

// // // ── Mobile accordion ──────────────────────────────────────────────────────────
// // function MobileAccordion({ label, children }) {
// //   const [open, setOpen] = useState(false);
// //   return (
// //     <li className="border-b border-gray-100 last:border-0">
// //       <button
// //         onClick={() => setOpen(!open)}
// //         className="w-full flex justify-between items-center px-5 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
// //       >
// //         {label}
// //         <svg
// //           className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
// //           fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
// //         >
// //           <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
// //         </svg>
// //       </button>
// //       {open && <div className="bg-gray-50 px-5 pb-3">{children}</div>}
// //     </li>
// //   );
// // }

// // // ── Desktop dropdown wrapper ──────────────────────────────────────────────────
// // function DesktopDropdown({ label, to, children }) {
// //   const [open, setOpen] = useState(false);
// //   const ref = useRef(null);

// //   useEffect(() => {
// //     const handler = (e) => {
// //       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
// //     };
// //     document.addEventListener("mousedown", handler);
// //     return () => document.removeEventListener("mousedown", handler);
// //   }, []);

// //   return (
// //     <div
// //       ref={ref}
// //       className="relative"
// //       onMouseEnter={() => setOpen(true)}
// //       onMouseLeave={() => setOpen(false)}
// //     >
// //       {to ? (
// //         <Link
// //           to={to}
// //           className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
// //         >
// //           {label}
// //           <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
// //             fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
// //             <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
// //           </svg>
// //         </Link>
// //       ) : (
// //         <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors">
// //           {label}
// //           <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
// //             fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
// //             <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
// //           </svg>
// //         </button>
// //       )}

// //       {open && (
// //         <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-lg rounded-t-none border-b-4 border-purple-700 shadow-lg z-50 w-52">
// //           {children}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // // ── Courses dropdown ──────────────────────────────────────────────────────────
// // function CoursesDropdown() {
// //   const [open, setOpen]               = useState(false);
// //   const [activeCategory, setActiveCategory] = useState(null);
// //   const [categories, setCategories]   = useState([]);
// //   const [courses, setCourses]         = useState([]);
// //   const [loading, setLoading]         = useState(false);
// //   const [fetched, setFetched]         = useState(false);   // fetch once on first hover
// //   const ref                           = useRef(null);
// //   const navigate                      = useNavigate();

// //   // ── fetch on first hover ──
// //   const fetchData = async () => {
// //     if (fetched) return;
// //     setFetched(true);
// //     setLoading(true);
// //     try {
// //       const [catRes, courseRes] = await Promise.all([
// //         fetch(`${import.meta.env.VITE_API_URL}/category/getAllCategories`),
// //         fetch(`${import.meta.env.VITE_API_URL}/course/getAllCourse`),
// //       ]);
// //       const catJson    = await catRes.json();
// //       const courseJson = await courseRes.json();

// //       const extractArray = (res) => {
// //         if (Array.isArray(res))            return res;
// //         if (Array.isArray(res.Data))       return res.Data;
// //         if (Array.isArray(res.data))       return res.data;
// //         if (Array.isArray(res.categories)) return res.categories;
// //         if (Array.isArray(res.courses))    return res.courses;
// //         return [];
// //       };

// //       const cats = extractArray(catJson);
// //       setCategories(cats);
// //       setCourses(extractArray(courseJson));
// //       if (cats.length > 0) setActiveCategory(cats[0]._id);   // auto-select first
// //     } catch (err) {
// //       console.error("Navbar fetch error:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     const handler = (e) => {
// //       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
// //     };
// //     document.addEventListener("mousedown", handler);
// //     return () => document.removeEventListener("mousedown", handler);
// //   }, []);

// //   const filteredCourses = activeCategory
// //     ? courses.filter((c) => {
// //         const catId = typeof c.category === "object" ? c.category?._id : c.category;
// //         return String(catId) === String(activeCategory);
// //       })
// //     : [];

// //   return (
// //     <div
// //       ref={ref}
// //       className="relative"
// //       onMouseEnter={() => { setOpen(true); fetchData(); }}
// //       onMouseLeave={() => setOpen(false)}
// //     >
// //       {/* Trigger */}
// //       <div
        
// //         className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
// //       >
// //         Courses
// //         <svg className={`w-4.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
// //           fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
// //           <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
// //         </svg>
// //       </div>

// //       {/* Panel */}
// //       {open && (
// //         <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-lg rounded-t-none border-b-4 border-purple-700 shadow-lg z-50 w-[460px]">
// //           {loading ? (
// //             <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
// //               Loading...
// //             </div>
// //           ) : (
// //             <div className="flex divide-x divide-gray-100 overflow-hidden rounded-lg">

// //               {/* LEFT — Categories */}
// //               <div className="w-[200px] p-3 shrink-0">
// //                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
// //                   Categories
// //                 </p>
// //                 {categories.length === 0 ? (
// //                   <p className="text-gray-400 text-xs px-2">No categories</p>
// //                 ) : (
// //                   categories.map((cat) => (
// //                     <div
// //                       key={cat._id}
// //                       onMouseEnter={() => setActiveCategory(cat._id)}
// //                       className={`flex justify-between items-center px-2 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors ${
// //                         activeCategory === cat._id
// //                           ? "bg-purple-50 text-purple-700"
// //                           : "hover:bg-gray-50 text-gray-700"
// //                       }`}
// //                     >
// //                       {cat.categoryName}
// //                       <span className="text-gray-300">›</span>
// //                     </div>
// //                   ))
// //                 )}
// //               </div>

// //               {/* RIGHT — Courses */}
// //               <div className="flex-1 p-3 min-w-0">
// //                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
// //                   Courses
// //                 </p>
// //                 {filteredCourses.length === 0 ? (
// //                   <p className="text-gray-400 text-xs px-2 mt-1">No courses found</p>
// //                 ) : (
// //                   filteredCourses.map((course) => (
// //                     <div
// //                       key={course._id}
// //                       onClick={() => { navigate(`/courses/${course._id}`); setOpen(false); }}
// //                       className="px-2 py-2 rounded-lg cursor-pointer text-sm font-semibold text-gray-800 hover:bg-purple-50 hover:text-purple-700 transition-colors truncate"
// //                     >
// //                       {course.courseName}
// //                     </div>
// //                   ))
// //                 )}
// //               </div>

// //             </div>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // // ── Mobile Courses accordion (fetches its own data) ───────────────────────────
// // function MobileCoursesAccordion({ onNavigate }) {
// //   const [open, setOpen]           = useState(false);
// //   const [categories, setCategories] = useState([]);
// //   const [courses, setCourses]     = useState([]);
// //   const [loading, setLoading]     = useState(false);
// //   const [fetched, setFetched]     = useState(false);
// //   const navigate                  = useNavigate();

// //   const fetchData = async () => {
// //     if (fetched) return;
// //     setFetched(true);
// //     setLoading(true);
// //     try {
// //       const [catRes, courseRes] = await Promise.all([
// //         fetch(`${import.meta.env.VITE_API_URL}/category/getAllCategories`),
// //         fetch(`${import.meta.env.VITE_API_URL}/course/getAllCourse`),
// //       ]);
// //       const catJson    = await catRes.json();
// //       const courseJson = await courseRes.json();

// //       const extractArray = (res) => {
// //         if (Array.isArray(res))            return res;
// //         if (Array.isArray(res.Data))       return res.Data;
// //         if (Array.isArray(res.data))       return res.data;
// //         if (Array.isArray(res.categories)) return res.categories;
// //         if (Array.isArray(res.courses))    return res.courses;
// //         return [];
// //       };

// //       setCategories(extractArray(catJson));
// //       setCourses(extractArray(courseJson));
// //     } catch (err) {
// //       console.error("Mobile courses fetch error:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const toggle = () => {
// //     if (!open) fetchData();
// //     setOpen(!open);
// //   };

// //   return (
// //     <li className="border-b border-gray-100 last:border-0">
// //       <button
// //         onClick={toggle}
// //         className="w-full flex justify-between items-center px-5 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
// //       >
// //         Courses
// //         <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
// //           fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //           <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
// //         </svg>
// //       </button>

// //       {open && (
// //         <div className="bg-gray-50 px-5 pb-3">
// //           {loading ? (
// //             <p className="text-gray-400 text-xs py-3">Loading...</p>
// //           ) : categories.length === 0 ? (
// //             <p className="text-gray-400 text-xs py-2">No categories available</p>
// //           ) : (
// //             categories.map((cat) => {
// //               const catCourses = courses.filter((c) => {
// //                 const catId = typeof c.category === "object" ? c.category?._id : c.category;
// //                 return String(catId) === String(cat._id);
// //               });
// //               if (catCourses.length === 0) return null;
// //               return (
// //                 <div key={cat._id} className="mt-2">
// //                   <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider px-2 mb-1">
// //                     {cat.categoryName}
// //                   </p>
// //                   {catCourses.map((course, i, arr) => (
// //                     <button
// //                       key={course._id}
// //                       onClick={() => { navigate(`/courses/${course._id}`); onNavigate(); }}
// //                       className={`text-left w-full py-2 px-2 text-sm text-gray-700 hover:text-purple-700 rounded-lg hover:bg-white transition-colors ${
// //                         i < arr.length - 1 ? "border-b border-gray-100" : ""
// //                       }`}
// //                     >
// //                       {course.courseName}
// //                     </button>
// //                   ))}
// //                 </div>
// //               );
// //             })
// //           )}
// //         </div>
// //       )}
// //     </li>
// //   );
// // }

// // // ── Main Navbar ───────────────────────────────────────────────────────────────
// // function Navbar() {
// //   const [menuOpen, setMenuOpen] = useState(false);
// //   const { user, logout }        = useAuth();
// //   const navigate                = useNavigate();

// //   const handleLogout = () => { logout(); navigate("/login"); setMenuOpen(false); };
// //   const closeMenu    = () => setMenuOpen(false);

// //   const navLink =
// //     "px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors";

// //   return (
// //     <nav className="bg-white shadow-md sticky top-0 z-50">

// //       {/* ── TOP BAR ── */}
// //       <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
// //         <div className="flex items-center justify-between h-16">

// //           <Link to="/" className="shrink-0">
// //             <img src={zintLogo} alt="Zint Logo" className="h-9 w-auto" />
// //           </Link>

// //           {/* Desktop menu */}
// //           <div className="hidden md:flex items-center gap-1 lg:gap-3">
// //             <Link to="/"      className={navLink}>Home</Link>
// //             <Link to="/About" className={navLink}>About</Link>

// //             <CoursesDropdown />

// //             <Link to="/Internship"     className={`hidden lg:block ${navLink}`}>Internship</Link>
// //             <Link to="/OnlineTraining" className={`hidden lg:block ${navLink}`}>Online Training</Link>

// //             <DesktopDropdown label="Placement" to="/PlacementRegistration">
// //               <div className="flex flex-col p-2">
// //                 {[
// //                   { to: "/PlacedStudent",         label: "Placed Student" },
// //                   { to: "/PlacementRegistration", label: "Placement Registration" },
// //                 ].map(({ to, label }) => (
// //                   <Link key={to} to={to}
// //                     className="flex items-center gap-2 px-3 py-2 text-sm text-black rounded-lg hover:bg-purple-50 hover:text-purple-800 transition-colors">
// //                     {label}
// //                   </Link>
// //                 ))}
// //               </div>
// //             </DesktopDropdown>

// //             <DesktopDropdown label="Admission">
// //               <div className="flex flex-col p-2">
// //                 {[
// //                   { to: "/OnlineAdmission",  label: "Online Admission" },
// //                   { to: "/ApplyCertificate", label: "Apply Certificate" },
// //                   { to: "/OnlineTest",       label: "Online Test" },
// //                   { to: "/Services",         label: "Services" },
// //                   { to: "/Blog",             label: "Blog" },
// //                 ].map(({ to, label }) => (
// //                   <Link key={to} to={to}
// //                     className="flex items-center gap-2 px-3 py-2 text-sm text-black rounded-lg hover:bg-purple-50 hover:text-purple-800 transition-colors">
// //                     {label}
// //                   </Link>
// //                 ))}
// //               </div>
// //             </DesktopDropdown>

// //             <DesktopDropdown label="Events" to="/Events">
// //               <div className="flex flex-col p-2">
// //                 {[
// //                   { to: "/Webinar",  label: "Webinar" },
// //                   { to: "/Workshop", label: "Workshop" },
// //                 ].map(({ to, label }) => (
// //                   <Link key={to} to={to}
// //                     className="flex items-center gap-2 px-3 py-2 text-sm text-black rounded-lg hover:bg-purple-50 hover:text-purple-800 transition-colors">
// //                     {label}
// //                   </Link>
// //                 ))}
// //               </div>
// //             </DesktopDropdown>

// //             {/* Auth */}
// //             <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
// //               {user?.role === "user" && (
// //                 <Link to="/user/dashboard"
// //                   className="px-3 py-2 text-sm font-semibold bg-purple-500 text-white rounded-lg hover:bg-purple-800 transition-colors">
// //                   Dashboard
// //                 </Link>
// //               )}
// //               {user?.role === "admin" && (
// //                 <Link to="/admin/dashboard"
// //                   className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium text-sm px-3 py-2 rounded-md leading-5">
// //                   Admin
// //                 </Link>
// //               )}
// //               {user ? (
// //                 <button onClick={handleLogout}
// //                   className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 font-medium text-sm px-3 py-2 rounded-md leading-5">
// //                   Logout
// //                 </button>
// //               ) : (
// //                 <Link to="/Login"
// //                   className="px-3 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
// //                   Login
// //                 </Link>
// //               )}
// //             </div>
// //           </div>

// //           {/* Hamburger */}
// //           <button
// //             onClick={() => setMenuOpen(!menuOpen)}
// //             className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
// //             aria-label="Toggle menu"
// //           >
// //             {menuOpen ? (
// //               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
// //               </svg>
// //             ) : (
// //               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //                 <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
// //               </svg>
// //             )}
// //           </button>
// //         </div>
// //       </div>

// //       {/* Tablet secondary row */}
// //       <div className="hidden md:flex lg:hidden border-t border-gray-100 px-6 py-1 gap-2 bg-gray-50">
// //         <Link to="/Internship"     className={navLink}>Internship</Link>
// //         <Link to="/OnlineTraining" className={navLink}>Online Training</Link>
// //       </div>

// //       {/* ── MOBILE DRAWER ── */}
// //       {menuOpen && (
// //         <div className="md:hidden border-t border-gray-100 bg-white shadow-lg max-h-[80vh] overflow-y-auto">
// //           <ul className="flex flex-col divide-y divide-gray-100">

// //             {[
// //               { to: "/",               label: "Home" },
// //               { to: "/About",          label: "About" },
// //               { to: "/Internship",     label: "Internship" },
// //               { to: "/OnlineTraining", label: "Online Training" },
// //             ].map(({ to, label }) => (
// //               <li key={to}>
// //                 <Link to={to} onClick={closeMenu}
// //                   className="block px-5 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors">
// //                   {label}
// //                 </Link>
// //               </li>
// //             ))}

// //             {/* Courses — fetches on open */}
// //             <MobileCoursesAccordion onNavigate={closeMenu} />

// //             <MobileAccordion label="Placement">
// //               {[
// //                 { to: "/PlacedStudent",         label: "Placed Student" },
// //                 { to: "/PlacementRegistration", label: "Placement Registration" },
// //               ].map(({ to, label }, i, arr) => (
// //                 <Link key={to} to={to} onClick={closeMenu}
// //                   className={`flex items-center gap-2 py-2.5 px-2 text-sm text-gray-700 hover:text-indigo-600 rounded-lg hover:bg-white transition-colors ${
// //                     i < arr.length - 1 ? "border-b border-gray-100" : ""
// //                   }`}>
// //                   <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />{label}
// //                 </Link>
// //               ))}
// //             </MobileAccordion>

// //             <MobileAccordion label="Admission">
// //               {[
// //                 { to: "/OnlineAdmission",  label: "Online Admission" },
// //                 { to: "/ApplyCertificate", label: "Apply Certificate" },
// //                 { to: "/OnlineTest",       label: "Online Test" },
// //                 { to: "/Services",         label: "Services" },
// //                 { to: "/Blog",             label: "Blog" },
// //               ].map(({ to, label }, i, arr) => (
// //                 <Link key={to} to={to} onClick={closeMenu}
// //                   className={`flex items-center gap-2 py-2.5 px-2 text-sm text-gray-700 hover:text-indigo-600 rounded-lg hover:bg-white transition-colors ${
// //                     i < arr.length - 1 ? "border-b border-gray-100" : ""
// //                   }`}>
// //                   <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />{label}
// //                 </Link>
// //               ))}
// //             </MobileAccordion>

// //             <MobileAccordion label="Events">
// //               {[
// //                 { to: "/Webinar",  label: "Webinar" },
// //                 { to: "/Workshop", label: "Workshop" },
// //               ].map(({ to, label }, i, arr) => (
// //                 <Link key={to} to={to} onClick={closeMenu}
// //                   className={`flex items-center gap-2 py-2.5 px-2 text-sm text-gray-700 hover:text-indigo-600 rounded-lg hover:bg-white transition-colors ${
// //                     i < arr.length - 1 ? "border-b border-gray-100" : ""
// //                   }`}>
// //                   <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />{label}
// //                 </Link>
// //               ))}
// //             </MobileAccordion>

// //             {user?.role === "user" && (
// //               <li>
// //                 <Link to="/user/dashboard" onClick={closeMenu}
// //                   className="block px-5 py-3.5 text-sm font-semibold text-purple-600 hover:bg-purple-50 transition-colors">
// //                   My Dashboard
// //                 </Link>
// //               </li>
// //             )}
// //             {user?.role === "admin" && (
// //               <li>
// //                 <Link to="/admin/dashboard" onClick={closeMenu}
// //                   className="block px-5 py-3.5 text-sm font-semibold text-purple-600 hover:bg-purple-50 transition-colors">
// //                   Admin Dashboard
// //                 </Link>
// //               </li>
// //             )}

// //             <li className="p-4">
// //               {user ? (
// //                 <button onClick={handleLogout}
// //                   className="w-full py-2.5 text-sm font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
// //                   Logout
// //                 </button>
// //               ) : (
// //                 <Link to="/Login" onClick={closeMenu}
// //                   className="block w-full py-2.5 text-center text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
// //                   Login
// //                 </Link>
// //               )}
// //             </li>

// //           </ul>
// //         </div>
// //       )}
// //     </nav>
// //   );
// // }

// // export default Navbar;