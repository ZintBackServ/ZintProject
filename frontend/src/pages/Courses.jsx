import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import Card from "../components/Card";
import Loading from "../components/Loading";
import { DataContext } from "../context/DataContext";
import { usePageMeta } from "../hooks/usePageMeta";

const Courses = () => {
  usePageMeta(
    "Courses",
    "Explore all courses at Zint Computer Education Institute — Software, Hardware, Networking, AI, Tally, Steno & more. Practical, job-ready training in Gwalior."
  );
  const { data, loading } = useContext(DataContext);
  const location = useLocation();
  const navState = location.state;

  // activeCategory now stores the category's _id
  const [activeCategory, setActiveCategory] = useState(navState?.activeCategory ?? null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  //Fetch all categories from the API 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/category/getAllCategories`);
        const data = await res.json();
        // Adjust this line if your API wraps the array differently
        // e.g. data.categories or data.data
        const list = data?.categories ?? data?.data ?? data ?? [];
        setCategories(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // ── Apply navigation state (e.g. from Footer links) ────────────────
  useEffect(() => {
    if (navState?.activeCategory !== undefined) setActiveCategory(navState.activeCategory);
    window.history.replaceState({}, document.title);
  }, [location.key]);

  const cards = data?.courses || [];

  if (loading) return <Loading />;
  if (!cards.length) return <h1 className="text-center mt-10">No courses available</h1>;

  // course.category is a populated object — grab its id / name
  const getCatId = (c) => c.category?._id ?? "";
  const getCatName = (c) => c.category?.categoryName ?? "";

  const filteredCourses = cards.filter((c) =>
    activeCategory ? getCatId(c) === activeCategory : true
  );

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId === activeCategory ? null : catId);
    setSidebarOpen(false);
  };

  const activeCategoryName =
    categories.find((cat) => cat._id === activeCategory)?.categoryName ?? "";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* PAGE HEADER */}
      <div className="bg-white border-b px-6 py-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Our Courses</h1>
      </div>

      {/* MOBILE toggle */}
      <div className="md:hidden px-4 pt-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full py-2 px-4 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-700 font-medium text-sm flex justify-between items-center"
        >
          <span>{activeCategoryName || "Select Category"}</span>
          <span>{sidebarOpen ? "▲" : "▼"}</span>
        </button>
      </div>

      {/* LAYOUT */}
      <div className="flex w-full px-4 py-6 gap-5">

        {/* SIDEBAR */}
        <aside className={`${sidebarOpen ? "block" : "hidden"} md:block w-full md:w-56 flex-shrink-0`}>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Categories
              </p>
              {activeCategory && (
                <button
                  onClick={() => setActiveCategory(null)}
                  className="text-xs font-medium text-red-400 hover:text-red-600"
                >
                  ✕ Clear
                </button>
              )}
            </div>

            {categoriesLoading ? (
              <p className="text-gray-400 text-sm px-4 py-3 italic">Loading categories…</p>
            ) : categories.length === 0 ? (
              <p className="text-gray-400 text-sm px-4 py-3 italic">No categories found</p>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat._id)}
                  className={`w-full text-left px-4 py-3 text-sm font-medium flex justify-between items-center transition border-l-4
                    ${activeCategory === cat._id
                      ? "border-l-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-l-transparent hover:bg-gray-50 text-gray-700"
                    }`}
                >
                  <span>{cat.categoryName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold
                    ${activeCategory === cat._id
                      ? "bg-indigo-200 text-indigo-700"
                      : "bg-gray-100 text-gray-500"
                    }`}>
                    {cards.filter((c) => getCatId(c) === cat._id).length}
                  </span>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {activeCategory && (
                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                  {activeCategoryName}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-800">{filteredCourses.length}</span>{" "}
              course{filteredCourses.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {/* Cards */}
          {filteredCourses.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-lg font-medium">No courses found</p>
              <p className="text-sm mt-1">Try selecting a different filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((item) => (
                <Card key={item._id} data={item} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Courses;