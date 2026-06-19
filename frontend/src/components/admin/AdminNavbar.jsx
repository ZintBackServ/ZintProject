// components/admin/AdminNavbar.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminNavbar({ onToggleSidebar }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // All nav links in one place — easy to maintain
  const navLinks = [
    { to: "/",                                          label: "View Site"},
    { to: "/admin/dashboard/AddCourse",                 label: "Add Course"},
    { to: "/admin/dashboard/AddMentor",                 label: "Add Mentor"},
    { to: "/admin/dashboard/UserAdminDashboard",        label: "Users"},
    { to: "/admin/dashboard/ShowAllCourse",             label: "All Courses" },
    { to: "/admin/dashboard/PlacedStudentAdminDashboard", label: "Placements"},
    { to: "/admin/dashboard/AllEventRegistration", label: "AllEventRegistration"},
    { to: "/admin/dashboard/Rating", label: "Rating"},
    { to: "/admin/dashboard/EnrolledStudent", label: "EnrolledStudent"},
    { to: "/admin/dashboard/Notification", label: "Notification"},
  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-700 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40">

      {/* LEFT — Hamburger + Logo */}
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-gray-300 hover:text-white p-1.5 rounded-lg hover:bg-gray-700 transition"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo */}
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="bg-orange-500 text-white font-bold px-2.5 py-1 rounded-lg text-sm">ZI</div>
          <span className="text-white font-semibold text-sm hidden sm:block">Admin Panel</span>
        </Link>
      </div>

      {/* CENTER — Quick links (desktop only) */}
      <div className="hidden md:flex items-center gap-5 text-sm text-gray-300">
        {navLinks.map((link) => (
          <Link key={link.to} to={link.to} className="hover:text-white transition whitespace-nowrap">
            {link.label}
          </Link>
        ))}
      </div>

      {/* RIGHT — Admin dropdown + Logout */}
      <div className="flex items-center gap-3">

        {/* Admin avatar dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 hover:bg-gray-700 px-2 py-1.5 rounded-lg transition"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">A</div>
            <span className="text-gray-300 text-sm hidden sm:block">Admin</span>
            <span className="text-gray-400 text-xs hidden sm:block">▾</span>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 w-52 z-50 overflow-hidden">
              {/* Show all links in dropdown on mobile */}
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-100" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>

        {/* Logout button — desktop */}
        <button
          onClick={handleLogout}
          className="hidden sm:block bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;
