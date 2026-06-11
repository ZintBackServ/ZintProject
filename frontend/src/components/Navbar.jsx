import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { DataContext } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import zintLogo from "../assets/zintLogo.jpeg";

// ── Reusable mobile accordion item ──────────────────────────────────────────
function MobileAccordion({ label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
      >
        {label}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="bg-gray-50 px-5 pb-3">{children}</div>}
    </li>
  );
}

// ── Desktop dropdown wrapper ─────────────────────────────────────────────────
function DesktopDropdown({ label, to, children, wide = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link
        to={to}
        className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
      >
        {label}
        <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </Link>
      {open && (
        <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-lg rounded-t-none border-b-5 border-purple-700 z-50 ${wide ? "w-[720px]" : "w-52"}`}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── Main Navbar ──────────────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeType, setActiveType] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);

  const { data, loading, error } = useContext(DataContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const courses = data?.courses || [];
  const uniqueTypes = [...new Set(courses.map((c) => c.type).filter(Boolean))];
  const uniqueCategories = activeType
    ? [...new Set(courses.filter((c) => c.type === activeType).map((c) => c.category).filter(Boolean))]
    : [];
  const uniqueSubCategories = activeCategory
    ? [...new Set(courses.filter((c) => c.type === activeType && c.category === activeCategory).map((c) => c.subCategory).filter(Boolean))]
    : [];
  const filteredCourses = activeSubCategory
    ? courses.filter((c) => c.type === activeType && c.subCategory === activeSubCategory)
    : [];

  const handleLogout = () => { logout(); navigate("/login"); setMenuOpen(false); };
  const closeMenu = () => setMenuOpen(false);

  if (loading) return <Loading />;
  if (error) return <h1>{error}</h1>;

  // ── shared link style
  const navLink = "px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">

      {/* ═══════════════════════════════════════════════
          TOP BAR  (logo + hamburger + desktop menu)
      ═══════════════════════════════════════════════ */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="shrink-0">
            <img src={zintLogo} alt="Zint Logo" className="h-9 w-auto" />
          </Link>

          {/* ── TABLET (md) + DESKTOP (lg) menu ── */}
          {/* On tablet we show a condensed icon row; on desktop full labels */}
          <div className="hidden md:flex items-center gap-1 lg:gap-3">

            <Link to="/" className={navLink}>Home</Link>
            <Link to="/About" className={navLink}>About</Link>

            {/* Courses mega-menu */}
            <DesktopDropdown label="Courses" to="/Courses" wide>
              <div className="flex divide-x divide-gray-100 rounded-xl  overflow-hidden">
                {/* Types */}
                <div className="w-1/4 p-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Types</p>
                  {uniqueTypes.map((type) => (
                    <div key={type}
                      onMouseEnter={() => { setActiveType(type); setActiveCategory(null); setActiveSubCategory(null); }}
                      className={`flex justify-between items-center px-2 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors ${activeType === type ? "bg-purple-50 text-purple-700" : "hover:bg-gray-50 text-gray-700"}`}
                    >
                      {type} <span className="text-gray-300">›</span>
                    </div>
                  ))}
                </div>
                {/* Categories */}
                <div className="w-1/4 p-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Categories</p>
                  {uniqueCategories.length === 0
                    ? <p className="text-gray-400 text-xs px-2 mt-1">Select a type</p>
                    : uniqueCategories.map((cat) => (
                      <div key={cat}
                        onMouseEnter={() => { setActiveCategory(cat); setActiveSubCategory(null); }}
                        className={`flex justify-between items-center px-2 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors ${activeCategory === cat ? "bg-purple-50 text-purple-700" : "hover:bg-gray-50 text-gray-700"}`}
                      >
                        {cat} <span className="text-gray-300">›</span>
                      </div>
                    ))}
                </div>
                {/* Sub-categories */}
                <div className="w-1/4 p-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Sub Categories</p>
                  {uniqueSubCategories.length === 0
                    ? <p className="text-gray-400 text-xs px-2 mt-1">Select a category</p>
                    : uniqueSubCategories.map((sub) => (
                      <div key={sub}
                        onMouseEnter={() => setActiveSubCategory(sub)}
                        className={`flex justify-between items-center px-2 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors ${activeSubCategory === sub ? "bg-purple-50 text-purple-700" : "hover:bg-gray-50 text-gray-700"}`}
                      >
                        {sub} <span className="text-gray-300">›</span>
                      </div>
                    ))}
                </div>
                {/* Courses */}
                <div className="w-1/4 p-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Courses</p>
                  {filteredCourses.length === 0
                    ? <p className="text-gray-400 text-xs px-2 mt-1">Select sub category</p>
                    : filteredCourses.map((course) => (
                      <div key={course._id} onClick={() => navigate(`/courses/${course._id}`)}
                        className="px-2 py-2 rounded-lg cursor-pointer text-sm font-semibold text-gray-800 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                        {course.courseName}
                      </div>
                    ))}
                </div>
              </div>
            </DesktopDropdown>

            {/* Hide some items on md, show on lg */}
            <Link to="/Internship" className={`hidden lg:block ${navLink}`}>Internship</Link>
            <Link to="/OnlineTraining" className={`hidden lg:block ${navLink}`}>Online Training</Link>

            {/* Placement */}
            <DesktopDropdown label="Placement" to="/PlacementRegistration">
              <div className="flex flex-col p-2">
                {[
                  { to: "/PlacedStudent", label: "Placed Student" },
                  { to: "/PlacementRegistration", label: "Placement Registration" },
                ].map(({ to, label }) => (
                  <Link key={to} to={to}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-black rounded-lg hover:bg-purple-50 hover:text-purple-800 transition-colors">
                    {label}
                  </Link>
                ))}
              </div>
            </DesktopDropdown>

            {/* Admission */}
            <DesktopDropdown label="Admission" to="/Admission">
              <div className="flex flex-col p-2">
                {[
                  { to: "/OnlineAdmission", label: "Online Admission" },
                  { to: "/ApplyCertificate", label: "Apply Certificate" },
                  { to: "/OnlineTest", label: "Online Test" },
                  { to: "/Services", label: "Services" },
                  { to: "/Blog", label: "Blog" },
                ].map(({ to, label }) => (
                  <Link key={to} to={to}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-black rounded-lg hover:bg-purple-50 hover:text-purple-800 transition-colors">
                    {label}
                  </Link>
                ))}
              </div>
            </DesktopDropdown>

            {/* Events */}
            <DesktopDropdown label="Events" to="/Events">
              <div className="flex flex-col p-2">
                {[
                  { to: "/Webinar", label: "Webinar" },
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
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
              {user?.role === "user" && (
                <Link to="/user/dashboard" className="px-3 py-2 text-sm font-semibold bg-purple-500 text-white rounded-lg hover:bg-purple-800 transition-colors">
                  Dashboard
                </Link>
              )}
              {user?.role === "admin" && (
                <Link to="/admin/dashboard" className="px-3 py-2 text-sm font-semibold bg-purple-500 text-white rounded-lg hover:bg-purple-800 transition-colors">
                  Admin
                </Link>
              )}
              {user ? (
                <button onClick={handleLogout} className="px-3 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  Logout
                </button>
              ) : (
                <Link to="/Login" className="px-3 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* ── HAMBURGER (mobile only) ── */}
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

      {/* ═══════════════════════════════════════════════
          TABLET SECONDARY ROW  (md only — hidden on lg)
          Shows Internship + Online Training that couldn't
          fit in the primary row at tablet width
      ═══════════════════════════════════════════════ */}
      <div className="hidden md:flex lg:hidden border-t border-gray-100 px-6 py-1 gap-2 bg-gray-50">
        <Link to="/Internship" className={navLink}>Internship</Link>
        <Link to="/OnlineTraining" className={navLink}>Online Training</Link>
      </div>

      {/* ═══════════════════════════════════════════════
          MOBILE DRAWER
      ═══════════════════════════════════════════════ */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg max-h-[80vh] overflow-y-auto">
          <ul className="flex flex-col divide-y divide-gray-100">

            {/* Simple links */}
            {[
              { to: "/", label: "Home" },
              { to: "/About", label: "About" },
              { to: "/Internship", label: "Internship" },
              { to: "/OnlineTraining", label: "Online Training" },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} onClick={closeMenu}
                  className="block px-5 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors">
                  {label}
                </Link>
              </li>
            ))}

            {/* Courses accordion */}
            <MobileAccordion label="Courses">
              <div className="flex flex-col gap-0.5 pt-1">
                {courses.map((course) => (
                  <button key={course._id}
                    onClick={() => { navigate(`/courses/${course._id}`); closeMenu(); }}
                    className="text-left w-full py-2 px-2 text-sm text-gray-700 hover:text-indigo-600 rounded-lg hover:bg-white transition-colors border-b border-gray-100 last:border-0">
                    {course.courseName}
                  </button>
                ))}
              </div>
            </MobileAccordion>

            {/* Placement accordion */}
            <MobileAccordion label="Placement">
              {[
                { to: "/PlacedStudent", label: "Placed Student" },
                { to: "/PlacementRegistration", label: "Placement Registration" },
              ].map(({ to, label }, i, arr) => (
                <Link key={to} to={to} onClick={closeMenu}
                  className={`flex items-center gap-2 py-2.5 px-2 text-sm text-gray-700 hover:text-indigo-600 rounded-lg hover:bg-white transition-colors ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />{label}
                </Link>
              ))}
            </MobileAccordion>

            {/* Admission accordion */}
            <MobileAccordion label="Admission">
              {[
                { to: "/OnlineAdmission", label: "Online Admission" },
                { to: "/ApplyCertificate", label: "Apply Certificate" },
                { to: "/OnlineTest", label: "Online Test" },
                { to: "/Services", label: "Services" },
                { to: "/Blog", label: "Blog" },
              ].map(({ to, label }, i, arr) => (
                <Link key={to} to={to} onClick={closeMenu}
                  className={`flex items-center gap-2 py-2.5 px-2 text-sm text-gray-700 hover:text-indigo-600 rounded-lg hover:bg-white transition-colors ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />{label}
                </Link>
              ))}
            </MobileAccordion>

            {/* Events accordion */}
            <MobileAccordion label="Events">
              {[
                { to: "/Webinar", label: "Webinar" },
                { to: "/Workshop", label: "Workshop" },
              ].map(({ to, label }, i, arr) => (
                <Link key={to} to={to} onClick={closeMenu}
                  className={`flex items-center gap-2 py-2.5 px-2 text-sm text-gray-700 hover:text-indigo-600 rounded-lg hover:bg-white transition-colors ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />{label}
                </Link>
              ))}
            </MobileAccordion>

            {/* Dashboard */}
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

            {/* Auth */}
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