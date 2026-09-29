import { useEffect, useState, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Loading from "../components/ui/Loading";
import { DataContext } from "../context/DataContext";
import { usePageMeta } from "../hooks/usePageMeta";
import { buildBreadcrumbSchema, setStructuredData, removeStructuredData } from "../utils/schemaGenerator";

const Courses = () => {
  usePageMeta({
    title: "IT Courses in Gwalior: MERN Full Stack, Python, Java, DCA, PGDCA | Zint Institute",
    description:
      "Explore job-oriented IT and computer courses in Gwalior at Zint Institute — MERN Full Stack Development, Python, Java, Data Science, AI/ML, Web Design, Graphic Design, DCA & PGDCA with 100% Placement Support. Admission open 2025–26.",
    keywords:
      "MERN Full Stack course Gwalior, Python training Gwalior, Java course Gwalior, DCA Gwalior, PGDCA Gwalior, data science course Gwalior, web design course Gwalior, graphic design institute Gwalior, AI ML training Gwalior, digital marketing course Gwalior, CPCT coaching Gwalior, computer course Gwalior, IT courses near me, best computer course Gwalior, programming course Gwalior, software development training Gwalior, hardware networking Gwalior, Tally course Gwalior, Zint Institute courses",
    canonicalPath: "/courses",
  });

  const { data, loading } = useContext(DataContext);
  const location = useLocation();
  const navState = location.state;

  // activeCategory stores the category's _id
  const [activeCategory, setActiveCategory] = useState(navState?.activeCategory ?? null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Consume categories from DataContext
  const categories = data?.categories || [];
  const categoriesLoading = loading;

  useEffect(() => {
    if (navState?.activeCategory !== undefined) setActiveCategory(navState.activeCategory);
    window.history.replaceState({}, document.title);
  }, [location.key]);

  // Inject Breadcrumbs Schema
  useEffect(() => {
    const breadcrumbSchema = buildBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Courses in Gwalior", url: "/courses" },
    ]);
    if (breadcrumbSchema) setStructuredData("courses-breadcrumb", breadcrumbSchema);
    return () => removeStructuredData("courses-breadcrumb");
  }, []);

  const cards = data?.courses || [];

  if (loading) return <Loading />;
  if (!cards.length) return <h1 className="text-center mt-10">No courses available</h1>;

  const getCatId = (c) => c.category?._id ?? "";

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

      {/* PAGE HEADER WITH ON-PAGE KEYWORDS */}
      <div className="bg-white border-b px-6 py-8 text-center">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-500 mb-2">
            <Link to="/" className="hover:text-purple-700">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-purple-700 font-semibold">Courses</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            Professional IT & Computer Courses in Gwalior
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Gain industry-relevant tech skills with practical live project training, certified mentors, and 100% placement assistance at Zint Institute Gwalior.
          </p>
        </div>
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
      <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-3 sm:px-4 py-6 gap-5">

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
          {/* Breadcrumb info */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {activeCategory && (
                <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                  Category: {activeCategoryName}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-800">{filteredCourses.length}</span>{" "}
              course{filteredCourses.length !== 1 ? "s" : ""} available
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
