import { useContext, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import DashboardAnalytics from "../../components/admin/DashboardAnalytics";

const API = import.meta.env.VITE_API_URL;

/* ─── tiny helper ─── */
const fetchJSON = async (url, opts = {}) => {
  try {
    const res = await fetch(url, { credentials: "include", ...opts });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

/* ─── shortcut groups ─── */
const SHORTCUT_GROUPS = [
  {
    groupLabel: "📚 Content & Mentors",
    color: "border-indigo-200 bg-indigo-50/60",
    headerColor: "text-indigo-700",
    items: [
      { label: "Add Course",   icon: "➕", path: "/admin/dashboard/AddCourse",    bg: "bg-indigo-600 hover:bg-indigo-700" },
      { label: "All Courses",  icon: "📚", path: "/admin/dashboard/ShowAllCourse", bg: "bg-indigo-500 hover:bg-indigo-600" },
      { label: "Categories",   icon: "🗂️", path: "/admin/dashboard/AddCategory",  bg: "bg-violet-600 hover:bg-violet-700" },
      { label: "Add Mentor",   icon: "👨‍🏫", path: "/admin/dashboard/AddMentor",    bg: "bg-emerald-600 hover:bg-emerald-700"},
    ],
  },
  {
    groupLabel: "👥 People & Records",
    color: "border-sky-200 bg-sky-50/60",
    headerColor: "text-sky-700",
    items: [
      { label: "Registered Users",  icon: "👤", path: "/admin/dashboard/UserAdminDashboard",  bg: "bg-sky-600 hover:bg-sky-700"   },
      { label: "Course Enrollments",icon: "🎓", path: "/admin/dashboard/EnrolledStudent",      bg: "bg-teal-600 hover:bg-teal-700" },
      { label: "Placed Students",   icon: "🏆", path: "/admin/dashboard/PlacedStudentDashboard", bg: "bg-amber-600 hover:bg-amber-700" },
    ],
  },
  {
    groupLabel: "📋 Registrations & Applications",
    color: "border-rose-200 bg-rose-50/60",
    headerColor: "text-rose-700",
    items: [
      { label: "Event Registrations",      icon: "📅", path: "/admin/dashboard/AllEventRegistration",   bg: "bg-rose-600 hover:bg-rose-700" },
      { label: "Internship Applications", icon: "💼", path: "/admin/dashboard/InternshipRegistration", bg: "bg-pink-600 hover:bg-pink-700" },
      { label: "Placement Applications",  icon: "📝", path: "/admin/dashboard/PlacementRegistration",  bg: "bg-orange-600 hover:bg-orange-700"},
    ],
  },
  {
    groupLabel: "⚙️ System & Feedback",
    color: "border-emerald-200 bg-emerald-50/60",
    headerColor: "text-emerald-700",
    items: [
      { label: "Enquiries",            icon: "💬", path: "/admin/dashboard/Enquiries",           bg: "bg-cyan-600 hover:bg-cyan-700" },
      { label: "Curriculum Downloads", icon: "📄", path: "/admin/dashboard/CurriculumDownloads", bg: "bg-purple-600 hover:bg-purple-700" },
      { label: "Ratings & Reviews",    icon: "⭐", path: "/admin/dashboard/Rating",              bg: "bg-yellow-500 hover:bg-yellow-600" },
      { label: "Notifications",        icon: "🔔", path: "/admin/dashboard/Notification",        bg: "bg-purple-600 hover:bg-purple-700" },
      { label: "Time Table",           icon: "🗓️", path: "/admin/dashboard/TimeTable",           bg: "bg-slate-600 hover:bg-slate-700" },
    ],
  },
];

function SectionHeader({ title, to, linkLabel }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
      <h2 className="font-bold text-gray-900 text-sm sm:text-base">{title}</h2>
      {to && (
        <Link to={to} className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex-shrink-0">
          {linkLabel || "+ View All"}
        </Link>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════ MAIN COMPONENT ══ */
function DashboardHome() {
  const { data } = useContext(DataContext);

  const [greeting, setGreeting]       = useState("Good morning");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveData, setLiveData]       = useState({});
  const [loadingLive, setLoadingLive] = useState(true);

  const courses    = data?.courses    || [];
  const categories = data?.categories || [];

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
    const t = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const fetchLiveData = useCallback(async () => {
    setLoadingLive(true);
    const [
      mentorsRes, placedRes, usersRes,
      enrollRes, eventRegRes, ratingsRes,
      enquiryRes, notifRes, internRes, placementRegRes,
    ] = await Promise.all([
      fetchJSON(`${API}/mentor/allMentor`),
      fetchJSON(`${API}/placedStudent/allPlacedStudent`),
      fetchJSON(`${API}/user/allUsers`),
      fetchJSON(`${API}/api/enrollments`),
      fetchJSON(`${API}/eventRegistration/all`),
      fetchJSON(`${API}/rating/all`),
      fetchJSON(`${API}/enquiry/allEnquiries`),
      fetchJSON(`${API}/notification/all`),
      fetchJSON(`${API}/internshipRegistration/allInternshipRegistrations`),
      fetchJSON(`${API}/placementRegistration/allPlacementRegistrations`),
    ]);

    setLiveData({
      mentors:        mentorsRes?.mentors       || mentorsRes?.data       || [],
      placedStudents: placedRes?.placedStudents || placedRes?.data        || [],
      users:          usersRes?.users           || usersRes?.data         || [],
      enrollments:    enrollRes?.enrollments    || enrollRes?.data        || [],
      eventReg:       eventRegRes?.registrations|| eventRegRes?.data      || [],
      ratings:        ratingsRes?.ratings       || ratingsRes?.data       || [],
      enquiries:      enquiryRes?.enquiries     || enquiryRes?.data       || [],
      notifications:  notifRes?.notifications   || notifRes?.data         || [],
      internshipReg:  internRes?.registrations  || internRes?.data        || [],
      placementReg:   placementRegRes?.registrations || placementRegRes?.data || [],
    });
    setLoadingLive(false);
  }, []);

  useEffect(() => { fetchLiveData(); }, [fetchLiveData]);

  const {
    mentors = [], placedStudents = [], users = [],
    enrollments = [], eventReg = [], ratings = [],
    enquiries = [], notifications = [], internshipReg = [], placementReg = [],
  } = liveData;

  const avgRating = ratings.length
    ? (ratings.reduce((s, r) => s + (r.rating || 0), 0) / ratings.length).toFixed(1)
    : "—";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 pb-16 space-y-6">

      {/* ─────────────── HEADER ─────────────── */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 md:px-8 py-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-gray-400 font-medium">{greeting} 👋</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {currentTime.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              <span className="ml-2 font-semibold text-indigo-500">
                {currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchLiveData}
              className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3.5 py-2 rounded-xl transition"
            >
              🔄 Refresh Data
            </button>
            <Link
              to="/admin/dashboard/AddCourse"
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition shadow-sm"
            >
              ➕ Add New Course
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8 space-y-6">

        {/* ─────────────── 1. ANALYTICS & CHARTS AT THE TOP ─────────────── */}
        <section>
          <DashboardAnalytics
            users={users}
            enrollments={enrollments}
            eventReg={eventReg}
            placementReg={placementReg}
            internshipReg={internshipReg}
            enquiries={enquiries}
            loading={loadingLive}
          />
        </section>

        {/* ─────────────── 2. INSTANT METRICS BAR (Non-repeating overview) ─────────────── */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: "Total Courses",    value: courses.length,        icon: "📚", link: "/admin/dashboard/ShowAllCourse" },
            { label: "Categories",       value: categories.length,     icon: "🗂️", link: "/admin/dashboard/AddCategory" },
            { label: "Active Mentors",   value: mentors.length,        icon: "👨‍🏫", link: "/admin/dashboard/AddMentor" },
            { label: "Placed Students",  value: placedStudents.length, icon: "🏆", link: "/admin/dashboard/PlacedStudentDashboard" },
            { label: "Average Rating",   value: `${avgRating} ★`,      icon: "⭐", link: "/admin/dashboard/Rating" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.link}
              className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between transition hover:shadow-md hover:-translate-y-0.5"
            >
              <div>
                <p className="text-xs font-semibold text-gray-400">{item.label}</p>
                <p className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  {loadingLive ? <span className="animate-pulse bg-gray-200 rounded w-8 h-6 inline-block" /> : item.value}
                </p>
              </div>
              <span className="text-2xl p-2 rounded-xl bg-slate-50">{item.icon}</span>
            </Link>
          ))}
        </section>

        {/* ─────────────── 3. QUICK SHORTCUT GROUPS ─────────────── */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Actions & Navigation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {SHORTCUT_GROUPS.map((group) => (
              <div key={group.groupLabel} className={`rounded-2xl border ${group.color} p-4`}>
                <p className={`text-xs font-extrabold uppercase tracking-wider ${group.headerColor} mb-3`}>{group.groupLabel}</p>
                <div className="flex flex-col gap-2">
                  {group.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`${item.bg} text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─────────────── 4. CONTENT & FEED GRID ─────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Courses List (2/3 width) */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <SectionHeader title="📚 Course Catalog Overview" to="/admin/dashboard/ShowAllCourse" linkLabel="Manage All →" />
              {courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                  <span className="text-4xl">📭</span>
                  <p className="text-xs">No courses listed yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {courses.slice(0, 6).map((course) => {
                    const catName =
                      typeof course.category === "object"
                        ? course.category?.categoryName
                        : categories.find((c) => String(c._id) === String(course.category))?.categoryName;
                    return (
                      <div key={course._id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/80 transition">
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-indigo-50 flex items-center justify-center text-lg">
                          {course.courseImage ? (
                            <img
                              src={course.courseImage}
                              alt={course.courseName}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                          ) : (
                            "📖"
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{course.courseName}</p>
                          <p className="text-xs text-gray-400 truncate">
                            {course.duration}
                            {course.fee != null && ` · ₹${course.fee.toLocaleString("en-IN")}`}
                            {catName && <span className="ml-1 text-violet-500 font-medium">· {catName}</span>}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                              course.mode === "Online"
                                ? "bg-indigo-100 text-indigo-700"
                                : course.mode === "Offline"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {course.mode || "—"}
                          </span>
                          <Link
                            to={`/admin/dashboard/EditCourse/${course._id}`}
                            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {courses.length > 6 && (
              <div className="px-5 py-3 bg-slate-50/50 border-t border-gray-100 text-center">
                <Link to="/admin/dashboard/ShowAllCourse" className="text-xs text-indigo-600 font-bold hover:underline">
                  View all {courses.length} courses in catalog →
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Recent Curriculum Downloads, Enquiries & Ratings */}
          <div className="space-y-6">

            {/* Recent Curriculum Downloads */}
            <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
              <SectionHeader title="📄 Latest Curriculum Downloads" to="/admin/dashboard/CurriculumDownloads" linkLabel="View All" />
              {enquiries.filter(e => e.mode?.toLowerCase() === "curriculum download").length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-xs">No curriculum downloads recorded yet</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {enquiries
                    .filter(e => e.mode?.toLowerCase() === "curriculum download")
                    .slice(0, 3)
                    .map((eq) => (
                      <div key={eq._id} className="flex items-start gap-3 px-4 py-3 hover:bg-purple-50/20 transition">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {(eq.fullName || eq.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900">{eq.fullName || eq.name}</p>
                          <p className="text-[11px] text-purple-700 font-semibold truncate">
                            {eq.course?.courseName || eq.course || "Course Curriculum"}
                          </p>
                          <p className="text-[10px] text-gray-400 truncate">📱 {eq.mobile || eq.phone || eq.email}</p>
                        </div>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            eq.isContacted ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {eq.isContacted ? "Contacted" : "Pending"}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Recent Enquiries */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <SectionHeader title="💬 Latest Enquiries" to="/admin/dashboard/Enquiries" linkLabel="View All" />
              {enquiries.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-xs">No enquiries received yet</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {enquiries.slice(0, 4).map((eq) => (
                    <div key={eq._id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50/60 transition">
                      <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {(eq.fullName || eq.name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900">{eq.fullName || eq.name}</p>
                        <p className="text-[11px] text-gray-400 truncate">{eq.email || eq.mobile}</p>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          eq.isContacted ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"
                        }`}
                      >
                        {eq.isContacted ? "Contacted" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Ratings */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <SectionHeader title="⭐ Recent Student Reviews" to="/admin/dashboard/Rating" linkLabel="Manage" />
              {ratings.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-xs">No ratings received yet</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {ratings.slice(0, 4).map((r) => (
                    <div key={r._id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50/60 transition">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {(r.studentName || r.name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-gray-900 truncate">{r.studentName || r.name}</p>
                          <span className="text-[10px] text-amber-500 font-bold">{"★".repeat(r.rating || 0)}</span>
                        </div>
                        {r.review && <p className="text-[11px] text-gray-400 truncate mt-0.5">{r.review}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default DashboardHome;
