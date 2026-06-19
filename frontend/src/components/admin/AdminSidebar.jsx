// components/admin/AdminSidebar.jsx
import { Link, useLocation } from "react-router-dom";

// All sidebar links — add new pages here only
const links = [
  { path: "/admin/dashboard",                              label: "🏠 Dashboard"    },
  { path: "/admin/dashboard/AddCourse",                    label: "➕ Add Course"   },
  { path: "/admin/dashboard/ShowAllCourse",                label: "📚 All Courses"  },
  { path: "/admin/dashboard/AddMentor",                    label: "👨‍🏫 Add Mentor"   },
  { path: "/admin/dashboard/UserAdminDashboard",           label: "👥 Users"        },
  { path: "/admin/dashboard/PlacedStudentAdminDashboard",  label: "🏆 Placements"   },
  { path: "/admin/dashboard/AllEventRegistration",         label: "AllEventRegistration"   },
  { path: "/admin/dashboard/Rating",                       label: "Rating"   },
  { path: "/admin/dashboard/EnrolledStudent",              label: "EnrolledStudent"   },
  { path: "/admin/dashboard/Notification",              label: "Notification"   },
];

function AdminSidebar({ onClose }) {
  const location = useLocation();

  return (
    <aside className="w-56 bg-gray-900 text-white flex flex-col gap-1 p-4 min-h-screen pt-4">
      <p className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">
        Navigation
      </p>

      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          onClick={onClose} // close sidebar on mobile after click
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition
            ${location.pathname === link.path
              ? "bg-indigo-600 text-white"
              : "text-gray-300 hover:bg-gray-700"
            }`}
        >
          {link.label}
        </Link>
      ))}
    </aside>
  );
}

export default AdminSidebar;
