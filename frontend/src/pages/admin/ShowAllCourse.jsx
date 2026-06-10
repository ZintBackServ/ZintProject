import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ShowAllCourse() {
  const [courses, setCourses]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [deleting, setDeleting] = useState(null); // track which course is being deleted
  const [search, setSearch]     = useState("");
  const [filterType, setFilterType] = useState("All");
  const navigate = useNavigate();

  // ── Fetch all courses ──
  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/course/getAllCourse`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Failed to fetch courses.");
        return;
      }

      // ✅ handle both { courses: [] } and direct array response
      setCourses(Array.isArray(data) ? data : data.courses || []);

    } catch (err) {
      setError("Network error. Is backend running on port 2000?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ── Delete course ──
  const handleDelete = async (id, courseName) => {
    const confirm = window.confirm(`Are you sure you want to delete "${courseName}"?`);
    if (!confirm) return;

    setDeleting(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/course/deleteCourse/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Failed to delete course.");
        return;
      }

      // remove from state without refetching
      setCourses((prev) => prev.filter((c) => c._id !== id));

    } catch (err) {
      alert("Network error while deleting.");
    } finally {
      setDeleting(null);
    }
  };

  // ── Filter + Search ──
  const uniqueTypes = ["All", ...new Set(courses.map((c) => c.type).filter(Boolean))];

  const filtered = courses.filter((c) => {
    const matchSearch = c.courseName?.toLowerCase().includes(search.toLowerCase()) ||
                        c.category?.toLowerCase().includes(search.toLowerCase()) ||
                        c.subCategory?.toLowerCase().includes(search.toLowerCase());
    const matchType   = filterType === "All" || c.type === filterType;
    return matchSearch && matchType;
  });

  // ── Loading state ──
  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading courses...</p>
      </div>
    </div>
  );

  // ── Error state ──
  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl text-sm">
      {error}
    </div>
  );

  return (
    <div>

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Courses</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {courses.length} course{courses.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/dashboard/AddCourse")}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition self-start sm:self-auto"
        >
          ➕ Add New Course
        </button>
      </div>

      {/* ── SEARCH + FILTER ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">

        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by name, category or sub-category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
        </div>

        {/* Type filter */}
        <div className="flex gap-2 flex-wrap">
          {uniqueTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition
                ${filterType === type
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* ── RESULTS COUNT ── */}
      {(search || filterType !== "All") && (
        <p className="text-sm text-gray-400 mb-4">
          Showing <span className="font-semibold text-gray-700">{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""}
          {filterType !== "All" && <span> in <span className="text-indigo-600 font-semibold">{filterType}</span></span>}
          {search && <span> for "<span className="text-indigo-600 font-semibold">{search}</span>"</span>}
          <button
            onClick={() => { setSearch(""); setFilterType("All"); }}
            className="ml-3 text-red-400 hover:text-red-600 text-xs font-medium"
          >
            ✕ Clear
          </button>
        </p>
      )}

      {/* ── NO RESULTS ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <p className="text-5xl mb-3">📭</p>
          <p className="font-medium">No courses found</p>
          <p className="text-sm mt-1">Try a different search or filter</p>
        </div>
      ) : (

        /* ── COURSE TABLE — desktop | cards — mobile ── */
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">#</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Course</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Duration</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Fee</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((course, index) => (
                  <tr key={course._id} className="hover:bg-gray-50 transition">

                    {/* # */}
                    <td className="px-5 py-4 text-gray-400 text-xs">{index + 1}</td>

                    {/* Course name + image */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={course.courseImage}
                            alt={course.courseName}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{course.courseName}</p>
                          <p className="text-xs text-gray-400">{course.subCategory}</p>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full
                        ${course.type === "Tech"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-amber-100 text-amber-700"
                        }`}>
                        {course.type || "—"}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 text-gray-600">{course.category || "—"}</td>

                    {/* Duration */}
                    <td className="px-5 py-4 text-gray-600">{course.duration}</td>

                    {/* Fee */}
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      ₹{course.fee?.toLocaleString("en-IN")}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/course/${course._id}`)}
                          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/admin/dashboard/EditCourse/${course._id}`)}
                          className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg transition font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(course._id, course.courseName)}
                          disabled={deleting === course._id}
                          className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg transition font-medium disabled:opacity-50"
                        >
                          {deleting === course._id ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {filtered.map((course, index) => (
              <div key={course._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                {/* Image */}
                <div className="w-full h-36 bg-gray-100">
                  <img
                    src={course.courseImage}
                    alt={course.courseName}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>

                <div className="p-4">
                  {/* Name + badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-bold text-gray-900 text-base">{course.courseName}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0
                      ${course.type === "Tech"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-amber-100 text-amber-700"
                      }`}>
                      {course.type || "—"}
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                    <span>📁 {course.category}</span>
                    <span>⏱ {course.duration}</span>
                    <span>💰 ₹{course.fee?.toLocaleString("en-IN")}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/course/${course._id}`)}
                      className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/admin/dashboard/EditCourse/${course._id}`)}
                      className="flex-1 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-lg transition font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id, course.courseName)}
                      disabled={deleting === course._id}
                      className="flex-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg transition font-medium disabled:opacity-50"
                    >
                      {deleting === course._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ShowAllCourse;
