import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import Card from "../components/Card";
import Loading from "../components/Loading";
import { DataContext } from "../context/DataContext";

const Courses = () => {
  const { data, loading } = useContext(DataContext);
  const location = useLocation();
  const navState = location.state;

  const [activeType,     setActiveType]     = useState(navState?.activeType     ?? null);
  const [activeCategory, setActiveCategory] = useState(navState?.activeCategory ?? null);
  const [sidebarOpen,    setSidebarOpen]    = useState(false);

  useEffect(() => {
    if (navState?.activeType     !== undefined) setActiveType(navState.activeType);
    if (navState?.activeCategory !== undefined) setActiveCategory(navState.activeCategory);
    window.history.replaceState({}, document.title);
  }, [location.key]);

  const cards = data?.courses || [];

  if (loading) return <Loading />;
  if (!cards.length) return <h1 className="text-center mt-10">No courses available</h1>;

  // course.type is a plain string e.g. "Tech"
  const uniqueTypes = [...new Set(cards.map((c) => c.type).filter(Boolean))];

  // course.category is a populated object — grab its name
  const getCatName = (c) => c.category?.categoryName ?? "";

  const uniqueCategories = activeType
    ? [...new Set(
        cards
          .filter((c) => c.type === activeType)
          .map(getCatName)
          .filter(Boolean)
      )]
    : [];

  const filteredCourses = cards.filter((c) => {
    const matchesType = activeType     ? c.type === activeType           : true;
    const matchesCat  = activeCategory ? getCatName(c) === activeCategory : true;
    return matchesType && matchesCat;
  });

  const handleTypeClick = (type) => {
    setActiveType(type === activeType ? null : type);
    setActiveCategory(null);
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat === activeCategory ? null : cat);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* PAGE HEADER */}
      <div className="bg-white border-b px-6 py-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Our Courses</h1>
      </div>

      {/* TYPE PILLS */}
      <div className="bg-white border-b px-6 py-3 flex justify-center gap-3 flex-wrap sticky top-0 z-10 shadow-lg">
        {uniqueTypes.map((type) => (
          <button
            key={type}
            onClick={() => handleTypeClick(type)}
            className={`px-6 py-2 rounded-full font-semibold text-sm transition border
              ${activeType === type
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400 hover:text-indigo-600"
              }`}
          >
            {type}
          </button>
        ))}
        {(activeType || activeCategory) && (
          <button
            onClick={() => { setActiveType(null); setActiveCategory(null); }}
            className="px-5 py-2 rounded-full text-sm font-medium border border-red-300 text-red-400 hover:bg-red-50 transition"
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* MOBILE toggle */}
      <div className="md:hidden px-4 pt-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full py-2 px-4 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-700 font-medium text-sm flex justify-between items-center"
        >
          <span>{activeCategory || "Select Category"}</span>
          <span>{sidebarOpen ? "▲" : "▼"}</span>
        </button>
      </div>

      {/* LAYOUT */}
      <div className="flex w-full px-4 py-6 gap-5">

        {/* SIDEBAR */}
        <aside className={`${sidebarOpen ? "block" : "hidden"} md:block w-full md:w-56 flex-shrink-0`}>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
            <p className="text-xs font-bold text-gray-400 uppercase px-4 py-3 bg-gray-50 tracking-wider">
              Categories
            </p>
            {uniqueCategories.length === 0 ? (
              <p className="text-gray-400 text-sm px-4 py-3 italic">
                {activeType ? "No categories found" : "Select a type first"}
              </p>
            ) : (
              uniqueCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`w-full text-left px-4 py-3 text-sm font-medium flex justify-between items-center transition border-l-4
                    ${activeCategory === cat
                      ? "border-l-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-l-transparent hover:bg-gray-50 text-gray-700"
                    }`}
                >
                  <span>{cat}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold
                    ${activeCategory === cat
                      ? "bg-indigo-200 text-indigo-700"
                      : "bg-gray-100 text-gray-500"
                    }`}>
                    {cards.filter((c) => getCatName(c) === cat).length}
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
              {activeType && (
                <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
                  {activeType}
                </span>
              )}
              {activeCategory && (
                <>
                  <span className="text-gray-400 text-xs">›</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                    {activeCategory}
                  </span>
                </>
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



// import { useEffect, useState, useContext } from "react";
// import { useLocation } from "react-router-dom"; // ← NEW: read navigation state
// import Card from "../components/Card";
// import Loading from "../components/Loading";
// import { DataContext } from "../context/DataContext";

// const Courses = () => {
//   const { data, loading } = useContext(DataContext);
//   const [cards, setCards] = useState([]);

//   // ── Read state injected by Footer's navigate("/courses", { state: {...} }) ──
//   const location = useLocation();
//   const navState = location.state; // { activeType, activeCategory, activeSubCategory }

//   // ── DEFAULT SELECTIONS — used when NO navigation state is present ──────────
//   // Change these values to update the default fallback filters
//   const DEFAULT_TYPE        = navState?.activeType        ?? "Tech";
//   const DEFAULT_CATEGORY    = navState?.activeCategory    ?? "Data Analyst";
//   const DEFAULT_SUBCATEGORY = navState?.activeSubCategory ?? "Data Analyst";

//   const [activeType,        setActiveType]        = useState(DEFAULT_TYPE);
//   const [activeCategory,    setActiveCategory]    = useState(DEFAULT_CATEGORY);
//   const [activeSubCategory, setActiveSubCategory] = useState(DEFAULT_SUBCATEGORY);

//   // Mobile sidebar toggle
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // ── When the user arrives from the Footer, apply the injected filters ──────
//   useEffect(() => {
//     if (navState?.activeType !== undefined) {
//       setActiveType(navState.activeType);
//     }
//     if (navState?.activeCategory !== undefined) {
//       setActiveCategory(navState.activeCategory);
//     }
//     if (navState?.activeSubCategory !== undefined) {
//       setActiveSubCategory(navState.activeSubCategory);
//     }
//     // Clear the state from history so refreshing the page uses defaults again
//     // (optional — comment out if you want it to persist on refresh)
//     window.history.replaceState({}, document.title);
//   }, [location.key]); // re-run whenever the route key changes (new navigation)

//   useEffect(() => {
//     if (data && data.courses) {
//       setCards(data.courses);
//     }
//   }, [data]);

//   if (loading) return <Loading />;
//   if (!cards.length) return <h1 className="text-center mt-10">No courses available</h1>;

//   // ── Unique types ── change field name "type" if your API uses different key
//   const uniqueTypes = [...new Set(cards.map(c => c.type).filter(Boolean))];

//   // ── Unique categories filtered by active type ──
//   const uniqueCategories = activeType
//     ? [...new Set(
//         cards
//           .filter(c => c.type === activeType)
//           .map(c => c.category)
//           .filter(Boolean)
//       )]
//     : [];

//   // ── Unique subcategories filtered by active type + category ──
//   const uniqueSubCategories = activeCategory
//     ? [...new Set(
//         cards
//           .filter(c => c.type === activeType && c.category === activeCategory)
//           .map(c => c.subCategory)
//           .filter(Boolean)
//       )]
//     : [];

//   // ── Filtered courses ──
//   const filteredCourses = cards.filter(c => {
//     if (activeSubCategory) return c.subCategory === activeSubCategory;
//     if (activeCategory)    return c.category === activeCategory && c.type === activeType;
//     if (activeType)        return c.type === activeType;
//     return true;
//   });

//   // ── Handlers ──
//   const handleTypeClick = (type) => {
//     setActiveType(type);
//     setActiveCategory(null);
//     setActiveSubCategory(null);
//   };

//   const handleCategoryClick = (category) => {
//     setActiveCategory(category);
//     setActiveSubCategory(null);
//   };

//   const handleSubCategoryClick = (sub) => {
//     setActiveSubCategory(activeSubCategory === sub ? null : sub);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">

//       {/* ── PAGE HEADER ── */}
//       <div className="bg-white border-b px-6 py-6 text-center">
//         <h1 className="text-3xl font-bold text-gray-900">Our Courses</h1>
//       </div>

//       {/* ── TYPE BUTTONS — top bar ── */}
//       <div className="bg-white border-b px-6 py-3 flex justify-center gap-5 flex-wrap sticky top-0 z-10 shadow-lg">
//         {uniqueTypes.map((type) => (
//           <button
//             key={type}
//             onClick={() => handleTypeClick(type)}
//             className={`px-6 py-2 rounded-full font-semibold text-sm transition border
//               ${activeType === type
//                 ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
//                 : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400 hover:text-indigo-600"
//               }`}
//           >
//             {type}
//           </button>
//         ))}

//         {/* Clear all filters */}
//         {(activeType || activeCategory || activeSubCategory) && (
//           <button
//             onClick={() => {
//               setActiveType(null);
//               setActiveCategory(null);
//               setActiveSubCategory(null);
//             }}
//             className="px-5 py-2 rounded-full text-sm font-medium border border-red-300 text-red-400 hover:bg-red-50 transition"
//           >
//             ✕ Clear
//           </button>
//         )}
//       </div>

//       {/* ── MOBILE: sidebar toggle button ── */}
//       <div className="md:hidden px-4 pt-4">
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="w-full py-2 px-4 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-700 font-medium text-sm flex justify-between items-center"
//         >
//           <span>
//             {activeCategory || "Select Category"}
//             {activeSubCategory && ` › ${activeSubCategory}`}
//           </span>
//           <span>{sidebarOpen ? "▲" : "▼"}</span>
//         </button>
//       </div>

//       {/* ── MAIN CONTENT AREA ── */}
//       {/* mx-0 + w-full so it stretches edge-to-edge on large screens */}
//       <div className="flex w-full px-4 py-6 gap-5">

//         {/* ── LEFT SIDEBAR ── */}
//         <aside className={`
//           ${sidebarOpen ? "block" : "hidden"} md:block
//           w-full md:w-64 lg:w-72 flex-shrink-0
//         `}>
//           <div className="bg-white rounded-xl lg:h-screen shadow-sm overflow-hidden sticky top-24 flex">

//             {/* CATEGORIES */}
//             <div className="border-r">
//               <p className="text-xs font-bold text-gray-400 uppercase px-8 py-3 bg-gray-50 tracking-wider">
//                 Categories
//               </p>
//               {uniqueCategories.length === 0 ? (
//                 <p className="text-gray-400 text-sm px-4 py-3 italic">Select a type first</p>
//               ) : (
//                 uniqueCategories.map((category) => (
//                   <button
//                     key={category}
//                     onClick={() => { handleCategoryClick(category); setSidebarOpen(false); }}
//                     className={`w-full text-left px-4 py-3 text-sm font-medium flex justify-between items-center transition border-l-4
//                       ${activeCategory === category
//                         ? "border-l-indigo-500 bg-indigo-50 text-indigo-700"
//                         : "border-l-transparent hover:bg-gray-50 text-gray-700"
//                       }`}
//                   >
//                     {category}
//                     <span className="text-gray-400 text-xs">›</span>
//                   </button>
//                 ))
//               )}
//             </div>

//             {/* SUBCATEGORIES */}
//             <div>
//               <p className="text-xs font-bold text-gray-400 uppercase px-4 py-3 bg-gray-50 tracking-wider">
//                 Sub Categories
//               </p>
//               {uniqueSubCategories.length === 0 ? (
//                 <p className="text-gray-400 text-sm px-4 py-3 italic">Select a category first</p>
//               ) : (
//                 uniqueSubCategories.map((sub) => (
//                   <button
//                     key={sub}
//                     onClick={() => { handleSubCategoryClick(sub); setSidebarOpen(false); }}
//                     className={`w-full text-left px-4 py-3 text-sm font-medium flex justify-between items-center transition border-l-4
//                       ${activeSubCategory === sub
//                         ? "border-l-violet-500 bg-violet-50 text-violet-700"
//                         : "border-l-transparent hover:bg-gray-50 text-gray-700"
//                       }`}
//                   >
//                     {sub}
//                     <span className={`text-xs px-2 py-0.5 rounded-full font-semibold
//                       ${activeSubCategory === sub
//                         ? "bg-violet-200 text-violet-700"
//                         : "bg-gray-100 text-gray-500"
//                       }`}>
//                       {cards.filter(c => c.subCategory === sub).length}
//                     </span>
//                   </button>
//                 ))
//               )}
//             </div>

//           </div>
//         </aside>

//         {/* ── RIGHT SIDE — Course Cards ── */}
//         <main className="flex-1 min-w-0">

//           {/* Breadcrumb / results bar */}
//           <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
//             <div className="flex items-center gap-2 flex-wrap">
//               {activeType && (
//                 <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
//                   {activeType}
//                 </span>
//               )}
//               {activeCategory && (
//                 <>
//                   <span className="text-gray-400 text-xs">›</span>
//                   <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
//                     {activeCategory}
//                   </span>
//                 </>
//               )}
//               {activeSubCategory && (
//                 <>
//                   <span className="text-gray-400 text-xs">›</span>
//                   <span className="text-xs bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-medium">
//                     {activeSubCategory}
//                   </span>
//                 </>
//               )}
//             </div>
//             <p className="text-sm text-gray-500">
//               <span className="font-semibold text-gray-800">{filteredCourses.length}</span>{" "}
//               course{filteredCourses.length !== 1 ? "s" : ""} found
//             </p>
//           </div>

//           {/* Course cards grid */}
//           {filteredCourses.length === 0 ? (
//             <div className="text-center py-20 text-gray-400">
//               <p className="text-5xl mb-4">📭</p>
//               <p className="text-lg font-medium">No courses found</p>
//               <p className="text-sm mt-1">Try selecting a different filter</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredCourses.map((item) => (
//                 <Card key={item._id} data={item} />
//               ))}
//             </div>
//           )}

//         </main>
//       </div>
//     </div>
//   );
// };

// export default Courses;
