// components/admin/AdminSidebar.jsx
import { Link, useLocation } from "react-router-dom";

// All sidebar links — add new pages here only
const links = [
  { path: "/admin/dashboard",                        label: "🏠 Dashboard"    },
  { path: "/admin/dashboard/AddCourse",               label: "➕ Add Course"   },
  { path: "/admin/dashboard/ShowAllCourse",           label: "📚 All Courses"  },
  { path: "/admin/dashboard/AddMentor",               label: "👨‍🏫 Add Mentor"   },
  { path: "/admin/dashboard/UserAdminDashboard",      label: "👥 Users"        },
  { path: "/admin/dashboard/PlacedStudentDashboard",  label: "🏆 Placements"   },
  { path: "/admin/dashboard/AllEventRegistration",    label: "All Event Registration" },
  { path: "/admin/dashboard/Rating",                  label: "Rating" },
  { path: "/admin/dashboard/EnrolledStudent",         label: "Enrolled Student" },
  { path: "/admin/dashboard/OnlineAdmissions",        label: "🎓 Online Admissions" },
  { path: "/admin/dashboard/Notification",            label: "Notification" },
  { path: "/admin/dashboard/AddCategory",             label: "Add Category" },
  { path: "/admin/dashboard/AddLatestUpdate",         label: "Add Latest Update" },
  { path: "/admin/dashboard/Enquiries",               label: "Enquiries" },
  { path: "/admin/dashboard/CurriculumDownloads",     label: "📄 Curriculum Downloads" },
  { path: "/admin/dashboard/TimeTable",               label: "Time Table" },
  { path: "/admin/dashboard/InternshipRegistration",  label: "Internship Registrations" },
  { path: "/admin/dashboard/PlacementRegistration",  label: "Placement Registration" },
];

function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Backdrop — mobile/tablet only, shown while the drawer is open */}
      {isOpen && (
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 sm:w-72 bg-gray-900 text-white
          flex flex-col gap-1 p-4 overflow-y-auto z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:w-56 lg:z-30 lg:flex-shrink-0
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Navigation
          </p>
          {/* Close button — mobile/tablet only */}
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="lg:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={onClose} // close sidebar on mobile after click
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap
              ${location.pathname === link.path
                ? "bg-indigo-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
              }`}
          >
            {link.label}
          </Link>
        ))}
      </aside>
    </>
  );
}

export default AdminSidebar;


// // components/admin/AdminSidebar.jsx
// import { Link, useLocation } from "react-router-dom";

// // All sidebar links — add new pages here only
// const links = [
//   { path: "/admin/dashboard",                              label: "🏠 Dashboard"    },
//   { path: "/admin/dashboard/AddCourse",                    label: "➕ Add Course"   },
//   { path: "/admin/dashboard/ShowAllCourse",                label: "📚 All Courses"  },
//   { path: "/admin/dashboard/AddMentor",                    label: "👨‍🏫 Add Mentor"   },
//   { path: "/admin/dashboard/UserAdminDashboard",           label: "👥 Users"        },
//   { path: "/admin/dashboard/PlacedStudentDashboard",  label: "🏆 Placements"   },
//   { path: "/admin/dashboard/AllEventRegistration",         label: "All Event Registration"   },
//   { path: "/admin/dashboard/Rating",                       label: "Rating"   },
//   { path: "/admin/dashboard/EnrolledStudent",              label: "Enrolled Student"   },
//   { path: "/admin/dashboard/Notification",                 label: "Notification"   },
//   { path: "/admin/dashboard/AddCategory",                 label: "Add Category"   },
//   { path: "/admin/dashboard/AddLatestUpdate",                 label: "Add Latest Update"   },
//   { path: "/admin/dashboard/Enquiries",                 label: "Enquiries"   },
//   { path: "/admin/dashboard/TimeTable",                 label: "Time Table"   },
//   { path: "/admin/dashboard/InternshipRegistration",                 label: "Internship Registrations"   },
// ];

// function AdminSidebar({ onClose }) {
//   const location = useLocation();

//   return (
//     <aside className="w-56 bg-gray-900 text-white flex flex-col gap-1 p-4 min-h-screen pt-4">
//       <p className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">
//         Navigation
//       </p>

//       {links.map((link) => (
//         <Link
//           key={link.path}
//           to={link.path}
//           onClick={onClose} // close sidebar on mobile after click
//           className={`px-4 py-2.5 rounded-lg text-sm font-medium transition
//             ${location.pathname === link.path
//               ? "bg-indigo-600 text-white"
//               : "text-gray-300 hover:bg-gray-700"
//             }`}
//         >
//           {link.label}
//         </Link>
//       ))}
//     </aside>
//   );
// }

// export default AdminSidebar;
