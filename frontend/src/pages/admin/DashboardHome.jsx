import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";

function DashboardHome() {
  const { data } = useContext(DataContext);
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Good morning");
  const [currentTime, setCurrentTime] = useState(new Date());

  const courses  = data?.courses  || [];
  const mentors  = data?.mentors  || [];
  const students = data?.students || [];
  const placed   = data?.placedStudents || [];

  // Dynamic greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12)      setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else                setGreeting("Good evening");

    // update clock every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      title: "Total Courses",
      value: courses.length || 0,
      icon: "📚",
      color: "bg-indigo-50 border-indigo-100 text-indigo-600",
      bar: "bg-indigo-500",
      link: "/admin/dashboard/AddCourse",
      linkLabel: "Add Course",
    },
    {
      title: "Total Mentors",
      value: mentors.length || 0,
      icon: "👨‍🏫",
      color: "bg-emerald-50 border-emerald-100 text-emerald-600",
      bar: "bg-emerald-500",
      link: "/admin/dashboard/AddMentor",
      linkLabel: "Add Mentor",
    },
    {
      title: "Total Students",
      value: students.length || 120,
      icon: "👥",
      color: "bg-blue-50 border-blue-100 text-blue-600",
      bar: "bg-blue-500",
      link: "/admin/dashboard/Students",
      linkLabel: "View Students",
    },
    {
      title: "Placed Students",
      value: placed.length || 0,
      icon: "🏆",
      color: "bg-amber-50 border-amber-100 text-amber-600",
      bar: "bg-amber-500",
      link: "/admin/dashboard/Placements",
      linkLabel: "View Placements",
    },
  ];

  const quickActions = [
    { label: "Add Course",     icon: "➕", path: "/admin/dashboard/AddCourse",   color: "bg-indigo-600 hover:bg-indigo-700" },
    { label: "Add Mentor",     icon: "👨‍🏫", path: "/admin/dashboard/AddMentor",   color: "bg-emerald-600 hover:bg-emerald-700" },
    { label: "Add Placement",  icon: "🏆", path: "/admin/dashboard/AddPlacement", color: "bg-amber-600 hover:bg-amber-700" },
    { label: "View Site",      icon: "🌐", path: "/",  color: "bg-gray-700 hover:bg-gray-800" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

      {/* ── HEADER ── */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 md:px-8 py-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">{greeting} 👋</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {currentTime.toLocaleDateString("en-IN", {
                weekday: "long", year: "numeric", month: "long", day: "numeric"
              })}
            </p>
          </div>

          {/* Quick add button */}
          <Link
            to="/admin/dashboard/AddCourse"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm self-start sm:self-auto"
          >
            <span className="text-base">➕</span> Add New Course
          </Link>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8">

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className={`rounded-2xl border p-5 ${stat.color} transition hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{stat.icon}</span>
                <span className="text-3xl font-bold">{stat.value}</span>
              </div>
              <p className="text-sm font-semibold mb-3">{stat.title}</p>
              {/* Progress bar — visual indicator */}
              <div className="w-full bg-white bg-opacity-60 rounded-full h-1.5 mb-3">
                <div
                  className={`${stat.bar} h-1.5 rounded-full`}
                  style={{ width: `${Math.min((stat.value / 20) * 100, 100)}%` }}
                />
              </div>
              <Link
                to={stat.link}
                className="text-xs font-semibold underline underline-offset-2 opacity-70 hover:opacity-100 transition"
              >
                {stat.linkLabel} →
              </Link>
            </div>
          ))}
        </div>

        {/* ── MAIN GRID — Recent Courses + Quick Actions ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Recent Courses — takes 2/3 width on desktop */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-base">Recent Courses</h2>
              <Link
                to="/admin/dashboard/AddCourse"
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                + Add New
              </Link>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-sm">No courses yet</p>
                <Link
                  to="/admin/dashboard/AddCourse"
                  className="mt-3 inline-block text-indigo-600 text-sm font-semibold hover:underline"
                >
                  Add your first course →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {courses.slice(0, 6).map((course) => (
                  <div
                    key={course._id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition"
                  >
                    {/* Course image */}
                    <div className="w-12 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={course.courseImage}
                        alt={course.courseName}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    </div>

                    {/* Course info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {course.courseName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {course.duration} · ₹{course.fee?.toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* Type badge */}
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0
                      ${course.type === "Tech"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-amber-100 text-amber-700"
                      }`}>
                      {course.type || "—"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN — Quick Actions + Summary */}
          <div className="flex flex-col gap-4">

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h2 className="font-bold text-gray-900 text-base mb-4">Quick Actions</h2>
              <div className="flex flex-col gap-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.path}
                    to={action.path}
                    className={`${action.color} text-white text-sm font-medium px-4 py-2.5 rounded-xl transition flex items-center gap-2`}
                  >
                    <span>{action.icon}</span>
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Summary card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-5 text-white shadow-sm">
              <h2 className="font-bold text-base mb-1">Institute Summary</h2>
              <p className="text-indigo-200 text-xs mb-4">Zint Institute Overview</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-indigo-200">Courses</span>
                  <span className="font-bold">{courses.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-indigo-200">Mentors</span>
                  <span className="font-bold">{mentors.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-indigo-200">Placements</span>
                  <span className="font-bold">{placed.length}</span>
                </div>
                <div className="border-t border-indigo-500 pt-2 flex justify-between text-sm">
                  <span className="text-indigo-200">Total Students</span>
                  <span className="font-bold">{students.length || 120}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── RECENT MENTORS ── */}
        {mentors.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-base">Recent Mentors</h2>
              <Link
                to="/admin/dashboard/AddMentor"
                className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold"
              >
                + Add Mentor
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
              {mentors.slice(0, 4).map((mentor) => (
                <div key={mentor._id} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    <img
                      src={mentor.profileImage}
                      alt={mentor.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{mentor.name}</p>
                    <p className="text-xs text-gray-400 truncate">{mentor.designation || "Mentor"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default DashboardHome;
