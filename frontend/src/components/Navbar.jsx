import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { DataContext } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import zintLogo from "../assets/zintLogo.jpeg"

function Navbar() {
  const [menuOpen, setMenuOpen]         = useState(false);
  const [courseOpen, setCourseOpen]     = useState(false);
  const [admissionOpen, setAdmissionOpen] = useState(false);
  const [placementOpen, setPlacementOpen] = useState(false);

  // desktop course mega-menu
  const [activeType, setActiveType]               = useState(null);
  const [activeCategory, setActiveCategory]       = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);

  const { data, loading, error } = useContext(DataContext);
  const { user, logout }         = useAuth();
  const navigate                 = useNavigate();

  const courses           = data?.courses || [];
  const uniqueTypes       = [...new Set(courses.map(c => c.type).filter(Boolean))];
  const uniqueCategories  = activeType
    ? [...new Set(courses.filter(c => c.type === activeType).map(c => c.category).filter(Boolean))]
    : [];
  const uniqueSubCategories = activeCategory
    ? [...new Set(courses.filter(c => c.type === activeType && c.category === activeCategory).map(c => c.subCategory).filter(Boolean))]
    : [];
  const filteredCourses = activeSubCategory
    ? courses.filter(c => c.type === activeType && c.subCategory === activeSubCategory)
    : [];

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  if (loading) return <Loading />;
  if (error)   return <h1>{error}</h1>;

  return (
    <nav className="bg-white shadow-xl sticky top-0 z-50 px-4 py-3">

      {/* ── TOP BAR ── */}
      <div className="flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className=" text-white rounded-full font-semibold">
           <div className="display  tracking-tight">    
              <img className="h-10 w-30" src={zintLogo} alt="Loading..." />          
          </div>
        </Link>

        {/* Hamburger */}
        <button
          className="md:hidden text-2xl px-2 py-1 rounded-xl hover:bg-black hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* ── DESKTOP MENU ── */}
        <ul className="hidden md:flex gap-6 font-bold items-center">

          <li><Link to="/" className="px-2 py-1 hover:bg-black hover:text-white rounded-xl">Home</Link></li>
          <li><Link to="/About" className="px-2 py-1 hover:bg-black hover:text-white rounded-xl">About</Link></li>

          {/* Courses dropdown */}
          <div className="relative group">
            <li className="px-2 py-1 hover:bg-black hover:text-white rounded-xl cursor-pointer">
              <Link to="/Courses">Courses</Link>
            </li>
            <div className="hidden group-hover:flex absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-white w-[700px] shadow-lg rounded-lg z-50">
              <div className="w-1/4 border-r p-3">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2 px-2">Types</p>
                {uniqueTypes.map(type => (
                  <div key={type} onMouseEnter={() => { setActiveType(type); setActiveCategory(null); setActiveSubCategory(null); }}
                    className={`p-2 rounded cursor-pointer text-sm font-medium flex justify-between items-center ${activeType === type ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}>
                    {type} <span className="text-gray-400">›</span>
                  </div>
                ))}
              </div>
              <div className="w-1/4 border-r p-3">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2 px-2">Categories</p>
                {uniqueCategories.length === 0 ? <p className="text-gray-400 text-sm px-2">Select Type</p> :
                  uniqueCategories.map(cat => (
                    <div key={cat} onMouseEnter={() => { setActiveCategory(cat); setActiveSubCategory(null); }}
                      className={`p-2 rounded cursor-pointer text-sm font-medium flex justify-between items-center ${activeCategory === cat ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}>
                      {cat} <span className="text-gray-400">›</span>
                    </div>
                  ))
                }
              </div>
              <div className="w-1/4 border-r p-3">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2 px-2">Sub Categories</p>
                {uniqueSubCategories.length === 0 ? <p className="text-gray-400 text-sm px-2">Select Category</p> :
                  uniqueSubCategories.map(sub => (
                    <div key={sub} onMouseEnter={() => setActiveSubCategory(sub)}
                      className={`p-2 rounded cursor-pointer text-sm font-medium flex justify-between items-center ${activeSubCategory === sub ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}>
                      {sub} <span className="text-gray-400">›</span>
                    </div>
                  ))
                }
              </div>
              <div className="w-1/4 p-3">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2 px-2">Courses</p>
                {filteredCourses.length === 0 ? <p className="text-gray-400 text-sm px-2">Select Sub Category</p> :
                  filteredCourses.map(course => (
                    <div key={course._id} onClick={() => navigate(`/courses/${course._id}`)}
                      className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{course.courseName}</p>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          <li><Link to="/Internship" className="px-2 py-1 hover:bg-black hover:text-white rounded-xl">Internship</Link></li>

          <li><Link to="/OnlineTraining" className="px-2 py-1 hover:bg-black hover:text-white rounded-xl">Online Training</Link></li>

          {/* Placement dropdown */}
          <div className="relative group">
            <li className="px-2 py-1 hover:bg-black hover:text-white rounded-xl cursor-pointer">
              <Link to="/PlacementRegistration">Placement</Link>
            </li>
            <div className="hidden group-hover:flex absolute top-full mt-1 bg-gray-100 w-55 shadow-lg rounded-lg z-50">
              <div className="flex flex-col p-2 w-full">
                <Link 
                 to="/PlacedStudent"  className="flex items-center gap-2 px-1  text-md text-gray-700 hover:text-black hover:bg-gray-300 hover:rounded-xl"
                >  
                  <span className="text-lg">›</span>
                  Placed Student
                </Link>
                <Link 
                  to="/PlacementRegistration" className="flex items-center gap-2 px-1  text-md text-gray-700 hover:text-black hover:bg-gray-300 hover:rounded-xl"
                > 
                  <span className="text-lg">›</span>
                  Placement Registration
                </Link>
              </div>
            </div>
          </div>

          {/* Admission dropdown */}
          <div className="relative group">
            <li className="px-2 py-1 hover:bg-black hover:text-white rounded-xl cursor-pointer">
              <Link to="/Admission">Admission</Link>
            </li>
            <div className="hidden group-hover:flex absolute top-full mt-1 bg-gray-100 w-55 shadow-lg rounded-lg z-50">
              <div className="flex flex-col p-2 w-full">
                <Link 
                    to="/OnlineAdmission" className="flex items-center gap-2 px-1  text-md text-gray-700 hover:text-black hover:bg-gray-300 hover:rounded-xl"
                  >
                    <span className="text-lg">›</span>
                     Online Admission
                  </Link>
                <Link
                  to="/ApplyCertificate"  className="flex items-center gap-2 px-1  text-md text-gray-700 hover:text-black hover:bg-gray-300 hover:rounded-xl"
                >
                   <span className="text-lg">›</span>
                   Apply Certificate
                </Link>
                <Link 
                  to="/OnlineTest" className="flex items-center gap-2 px-1  text-md text-gray-700 hover:text-black hover:bg-gray-300 hover:rounded-xl"
                > 
                   <span className="text-lg">›</span>
                   Online Test
                </Link>
                <Link 
                  to="/Services" className="flex items-center gap-2 px-1  text-md text-gray-700 hover:text-black hover:bg-gray-300 hover:rounded-xl"
                >
                   <span className="text-lg">›</span>
                   Services</Link>
                <Link
                  to="/Blog" className="flex items-center gap-2 px-1  text-md text-gray-700 hover:text-black hover:bg-gray-300 hover:rounded-xl"
                >
                   <span className="text-lg">›</span>
                   Blog
                </Link>
              </div>
            </div>
          </div>


          {/* Event dropdown */}
          <div className="relative group">
            <li className="px-2 py-1 hover:bg-black hover:text-white rounded-xl cursor-pointer">
              <Link to="/Events">Events</Link>
            </li>
            <div className="hidden group-hover:flex absolute top-full mt-1 bg-gray-100 w-40 shadow-lg rounded-lg z-50">
              <div className="flex flex-col p-2 w-full">
                <Link 
                 to="/Webinar"  className="flex items-center gap-2 px-1  text-md text-gray-700 hover:text-black hover:bg-gray-300 hover:rounded-xl"
                >  
                  <span className="text-lg">›</span>
                  Webinar
                </Link>
                <Link 
                  to="/Workshop" className="flex items-center gap-2 px-1  text-md text-gray-700 hover:text-black hover:bg-gray-300 hover:rounded-xl"
                > 
                  <span className="text-lg">›</span>
                  Workshop
                </Link>
              </div>
            </div>
          </div>

          {user?.role === "user" && (
            <li>
              <Link to="/user/dashboard" className="px-2 py-1 bg-purple-600 text-white rounded-xl hover:bg-purple-800 transition-colors">
                MyDashboard
              </Link>
            </li>
          )}

          {user?.role === "admin" && (
            <li>
              <Link to="/admin/dashboard" className="px-2 py-1 bg-purple-600 text-white rounded-xl hover:bg-purple-800 transition-colors">
                Admin
              </Link>
            </li>
          )}

          {user ? (
            <li>
              <button onClick={handleLogout} className="px-4 py-1 bg-red-500 text-white rounded-xl hover:bg-red-700 transition-colors">
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link to="/Login" className="px-4 py-1 bg-indigo-600 text-white rounded-xl hover:bg-indigo-900 transition-colors">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* ── MOBILE MENU ── */}
      {menuOpen && (
        <div className="md:hidden mt-3 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <ul className="flex flex-col font-semibold divide-y divide-gray-100">

            <li>
              <Link to="/" onClick={closeMenu} className="block px-5 py-3 hover:bg-gray-50 transition-colors">
                Home
              </Link>
            </li>

            <li>
              <Link to="/About" onClick={closeMenu} className="block px-5 py-3 hover:bg-gray-50 transition-colors">
                About
              </Link>
            </li>

            {/* Mobile Courses */}
            <li>
              <button
                onClick={() => setCourseOpen(!courseOpen)}
                className="w-full flex justify-between items-center px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <span>Courses</span>
                <span className="text-gray-400 text-sm">{courseOpen ? "▲" : "▼"}</span>
              </button>
              {courseOpen && (
                <div className="bg-gray-50 px-5 pb-3 flex flex-col gap-1">
                  {courses.map(course => (
                    <p
                      key={course._id}
                      onClick={() => { navigate(`/courses/${course._id}`); closeMenu(); }}
                      className="text-sm py-1.5 text-gray-700 hover:text-blue-600 cursor-pointer border-b border-gray-200 last:border-0"
                    >
                      {course.courseName}
                    </p>
                  ))}
                </div>
              )}
            </li>

            <li>
              <Link to="/Internship" onClick={closeMenu} className="block px-5 py-3 hover:bg-gray-50 transition-colors">
                Internship
              </Link>
            </li>

            {/* Mobile Placement dropdown */}
            <li>
              <button
                onClick={() => setPlacementOpen(!placementOpen)}
                className="w-full flex justify-between items-center px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <span>Placement</span>
                <span className="text-gray-400 text-sm">{placementOpen ? "▲" : "▼"}</span>
              </button>
              {placementOpen && (
                <div className="bg-gray-50 px-5 pb-3 flex flex-col gap-1">
                  <Link
                    to="/Placement"
                    onClick={closeMenu}
                    className="flex items-center gap-2 py-2.5 text-sm text-gray-700 hover:text-black border-b border-gray-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                    Placed Student
                  </Link>
                  <Link
                    to="/PlacementRegistration"
                    onClick={closeMenu}
                    className="flex items-center gap-2 py-2.5 text-sm text-gray-700 hover:text-black"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                    Placement Registration
                  </Link>
                </div>
              )}
            </li>

            {/* Mobile Admission dropdown */}
            <li>
              <button
                onClick={() => setAdmissionOpen(!admissionOpen)}
                className="w-full flex justify-between items-center px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <span>Admission</span>
                <span className="text-gray-400 text-sm">{admissionOpen ? "▲" : "▼"}</span>
              </button>
              {admissionOpen && (
                <div className="bg-gray-50 px-5 pb-3 flex flex-col gap-1">
                  {[
                    { to: "/OnlineAdmission",  label: "Online Admission" },
                    { to: "/ApplyCertificate", label: "Apply Certificate" },
                    { to: "/OnlineTest",       label: "Online Test" },
                    { to: "/Services",         label: "Services" },
                    { to: "/Blog",             label: "Blog" },
                  ].map(({ to, label }, i, arr) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={closeMenu}
                      className={`flex items-center gap-2 py-2.5 text-sm text-gray-700 hover:text-black ${i < arr.length - 1 ? "border-b border-gray-200" : ""}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            <li>
              <Link to="/Events" onClick={closeMenu} className="block px-5 py-3 hover:bg-gray-50 transition-colors">
                Events
              </Link>
            </li>

            {user?.role === "admin" && (
              <li>
                <Link to="/admin/dashboard" onClick={closeMenu} className="block px-5 py-3 text-purple-600 hover:bg-purple-50 transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            )}

            {user ? (
              <li>
                <button onClick={handleLogout} className="w-full text-left px-5 py-3 text-red-500 hover:bg-red-50 transition-colors">
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <Link to="/Login" onClick={closeMenu} className="block px-5 py-3 text-indigo-600 hover:bg-indigo-50 transition-colors">
                  Login
                </Link>
              </li>
            )}

          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
