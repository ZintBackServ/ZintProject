import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import { FaFacebook, FaPhoneAlt, FaInstagramSquare, FaWhatsapp, FaYoutube, FaLinkedin } from "react-icons/fa";
import { CiMail, CiLocationOn } from "react-icons/ci";
import { RiTelegram2Fill } from "react-icons/ri";

const COMPANY_LINKS = [
  { label: "About Us",        to: "/about"   },
  { label: "Contact Us",      to: "/contact" },
  { label: "FAQ",             to: "/faq"     },
  { label: "Blog",            to: "/blog"    },
  { label: "Career Services", to: "/careers" },
];

const SOCIAL_LINKS = [
  { label: "LinkedIn",  href: "https://www.linkedin.com/in/zint-institute-05a4a12a8/", color: "#0A66C2", icon: <FaLinkedin        className="h-4 w-4" /> },
  { label: "YouTube",   href: "https://youtube.com/@zintinstitute",                    color: "#FF0000", icon: <FaYoutube         className="h-4 w-4" /> },
  { label: "Facebook",  href: "https://www.facebook.com/share/1Cwfquebni/",           color: "#1877F2", icon: <FaFacebook        className="h-4 w-4" /> },
  { label: "Instagram", href: "https://www.instagram.com/zintinstitute/",             color: "#E1306C", icon: <FaInstagramSquare  className="h-4 w-4" /> },
  { label: "Telegram",  href: "https://t.me/zintinstitute",                           color: "#26A5E4", icon: <RiTelegram2Fill   className="h-4 w-4" /> },
  { label: "WhatsApp",  href: "https://chat.whatsapp.com/BbUHk9fOxCa7Z5aEeNiYna",    color: "#25D366", icon: <FaWhatsapp        className="h-4 w-4" /> },
];

const Footer = () => {
  const navigate = useNavigate();
  const { data, loading } = useContext(DataContext);
  const courses = data?.courses || [];

  // All unique category names from courses
  const allCategories = [
    ...new Map(
      courses
        .filter((c) => c.category?.categoryName)
        .map((c) => [c.category._id, { name: c.category.categoryName, type: c.type }])
    ).values(),
  ];

  const handleCategoryClick = (catName, type) => {
    navigate("/courses", { state: { activeType: type, activeCategory: catName } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#080712] text-gray-400">

      {/* ── TAGLINE ── */}
      <div className="border-b border-white/[0.07] px-5 sm:px-10 lg:px-16 pt-10 pb-8">
        <p className="text-[10px] tracking-[0.2em] uppercase text-amber-500/70 mb-2 font-medium">
          Zint Institute
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold text-white leading-snug max-w-2xl"
            style={{ fontFamily: "'Georgia', serif" }}>
          Where curiosity meets craft —{" "}
          <span className="text-amber-400 italic">build skills that outlast every trend.</span>
        </h2>
        <p className="mt-2 text-sm text-gray-500 max-w-md">
          Invest in knowledge today. The returns compound forever.
        </p>
      </div>

      {/* ── TOP GRID : Brand | Company | Social ── */}
      <div className="border-b border-white/[0.07] px-5 sm:px-10 lg:px-16 py-8
                      grid grid-cols-2 sm:grid-cols-3 gap-8">

        {/* Brand + Contact */}
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-amber-400 text-xl">◈</span>
            <span className="text-white text-xl font-semibold tracking-wide"
                  style={{ fontFamily: "'Georgia', serif" }}>
              Zint<span className="text-amber-400">Skills</span>
            </span>
          </div>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="tel:+919876543210"
                 className="flex items-center gap-2.5 hover:text-amber-300 transition-colors">
                <FaPhoneAlt className="h-3.5 w-3.5 shrink-0 text-amber-500/60" />
                +91 98765 43210
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <CiLocationOn className="h-4 w-4 shrink-0 text-amber-500/60" />
              Main Campus, Gwalior
            </li>
            <li>
              <a href="mailto:info@zinstitute.in"
                 className="flex items-center gap-2.5 hover:text-amber-300 transition-colors">
                <CiMail className="h-4 w-4 shrink-0 text-amber-500/60" />
                info@zinstitute.in
              </a>
            </li>
          </ul>
          <div className="mt-5 inline-flex items-center gap-2 bg-white/[0.04] border border-white/10
                          rounded-lg px-3 py-2 text-xs text-gray-500">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-amber-400
                            flex items-center justify-center text-white font-bold text-[8px]">
              ISO
            </div>
            ISO 9001:2015 Certified
          </div>
        </div>

        {/* Company */}
        <div>
          <FootColTitle>Company</FootColTitle>
          <ul className="space-y-2.5">
            {COMPANY_LINKS.map(({ label, to }) => (
              <li key={to}>
                <Link to={to}
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      className="text-sm hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 group">
                  <span className="text-gray-600 group-hover:text-amber-500">›</span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <FootColTitle>Follow Us</FootColTitle>
          <ul className="space-y-2.5">
            {SOCIAL_LINKS.map(({ label, href, icon, color }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2.5 group">
                  <span className="w-6 h-6 rounded-md flex items-center justify-center text-white shrink-0
                                   transition-transform group-hover:scale-110"
                        style={{ backgroundColor: color }}>
                    {icon}
                  </span>
                  <span className="text-sm group-hover:text-white transition-colors">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── COURSES SECTION — full width category grid ── */}
      <div className="px-5 sm:px-10 lg:px-16 py-8 border-b border-white/[0.07]">
        <FootColTitle>Courses</FootColTitle>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-9 rounded-lg bg-white/[0.06]" />
            ))}
          </div>
        ) : allCategories.length === 0 ? (
          <p className="text-xs text-gray-600 italic">No courses available yet</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
            {allCategories.map(({ name, type }) => (
              <button
                key={name}
                onClick={() => handleCategoryClick(name, type)}
                className="text-left text-sm text-gray-400 px-3 py-2.5 rounded-lg
                           bg-white/[0.03] border border-white/[0.07]
                           hover:bg-amber-400/10 hover:border-amber-400/40 hover:text-amber-300
                           transition-all duration-200 group"
              >
                <span className="text-gray-600 group-hover:text-amber-500 mr-1.5">›</span>
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="px-5 sm:px-10 lg:px-16 py-4
                      flex flex-col sm:flex-row items-start sm:items-center
                      justify-between gap-2 text-xs text-gray-600">
        <span>© {new Date().getFullYear()} ZintSkills. All rights reserved.</span>
        <div className="flex gap-4 flex-wrap">
          {[["Privacy Policy", "/privacy"], ["Terms & Conditions", "/terms"], ["Refund Policy", "/refund"]].map(
            ([label, to]) => (
              <Link key={to} to={to} className="hover:text-amber-400 transition-colors">{label}</Link>
            )
          )}
        </div>
      </div>

    </footer>
  );
};

const FootColTitle = ({ children }) => (
  <p className="text-[11px] font-semibold text-white uppercase tracking-widest mb-4
                pb-2 border-b border-amber-400/40 w-fit">
    {children}
  </p>
);

export default Footer;



// import { useContext } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { DataContext } from "../context/DataContext"; 
// import { FaFacebook, FaPhoneAlt, FaInstagramSquare, FaWhatsapp, FaYoutube, FaLinkedin,FaTelegram } from "react-icons/fa";
// import { CiMail, CiLocationOn } from "react-icons/ci";
// import { RiTelegram2Fill } from "react-icons/ri";

// // ── Static company navigation links ──────────────────────────────────────────
// const COMPANY_LINKS = [
//   { label: "About Us",        to: "/about"   },
//   { label: "Contact Us",      to: "/contact" },
//   { label: "FAQ",             to: "/faq"     },
//   { label: "Blog",            to: "/blog"    },
//   { label: "Career Services", to: "/careers" },
// ];

// // Scroll to top of the page on click
// const scrollUpToPage = () =>{
//      window.scrollTo({ top: 0, behavior: "smooth" });
// }

// // // ── Social links ──────────────────────────────────────────────────────────────
// const SOCIAL_LINKS = [
//   {
//     label: "LinkedIn", href: "https://www.linkedin.com/in/zint-institute-05a4a12a8/", color: "bg-blue-600",
//     icon: (
//       <FaLinkedin className="h-4 w-4" />
//     ),
//   },
//   {
//     label: "YouTube", href: "https://youtube.com/@zintinstitute?si=hs6oYmKtUX6nuji8", color: "bg-red-600",
//     icon: (
//       <FaYoutube className="h-4 w-4" />
//     ),
//   },
//   {
//     label: "Facebook", href: "https://www.facebook.com/share/1Cwfquebni/", color: "bg-sky-600",
//     icon: (
//       <FaFacebook className="h-4 w-4" />
//     ),
//   },
//   {
//     label: "Instagram", href: "https://www.instagram.com/zintinstitute/",
//     color: "bg-gradient-to-br from-purple-500 via-fuchsia-700 to-orange-400",
//     icon: (
//        <FaInstagramSquare  className="h-4 w-4" />
//     ),
//   },
//   {
//     label: "Telegram", href: "https://www.instagram.com/zintinstitute/",
//     color: "bg-blue-400",
//     icon: (
//        <RiTelegram2Fill  className="h-4 w-4" />
//     ),
//   },
//   {
//     label: "WhatsApp", href: "https://chat.whatsapp.com/BbUHk9fOxCa7Z5aEeNiYna",
//     color: "bg-green-500",
//     icon: (
//        <FaWhatsapp className="h-4 w-4" />
//     ),
//   },
// ];

// // ── Footer ────────────────────────────────────────────────────────────────────
// const Footer = () => {
//   const navigate = useNavigate();

//   // Pull course data from same DataContext that Courses.jsx uses
//   const { data, loading } = useContext(DataContext);
//   const courses = data?.courses || [];

//   // ── Build { type → [category, ...] } map (mirrors Courses.jsx logic) ──
//   const uniqueTypes = [...new Set(courses.map((c) => c.type).filter(Boolean))];

//   const typeMap = uniqueTypes.reduce((acc, type) => {
//     const filtered = courses.filter((c) => c.type === type);
//     acc[type] = [...new Set(filtered.map((c) => c.category).filter(Boolean))];
//     return acc;
//   }, {});

//   /**
//    * Navigate to /courses and inject activeType + activeCategory as location.state.
//    * Courses.jsx reads this state on mount to auto-select the correct filters.
//    */
//   const handleCategoryClick = (type, category) => {
//     navigate("/courses", {
//       state: { activeType: type, activeCategory: category, activeSubCategory: null },
//     });
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Skeleton placeholder rows
//   const SkeletonCol = () => (
//     <div className="space-y-2.5 animate-pulse">
//       <div className="h-3 bg-white/10 rounded w-28 mb-4" />
//       {[75, 60, 80, 55].map((w, i) => (
//         <div key={i} className="h-3 bg-white/[0.07] rounded" style={{ width: `${w}%` }} />
//       ))}
//     </div>
//   );

//   return (
//     <footer className="w-full bg-[#0b0914] text-gray-400 relative overflow-hidden">

//       {/* Google Fonts */}
//       <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,600;1,500&display=swap');`}</style>

//       {/* Decorative glows */}
//       <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-violet-900/20 blur-[120px]" />
//       <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 rounded-full bg-amber-900/10 blur-[100px]" />

//       {/* ══════════════════════════════════
//           TAGLINE SECTION
//       ══════════════════════════════════ */}
//       <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 pt-16 pb-10 border-b border-white/[0.06]">
//         <h2
//           className="text-[clamp(1.5rem,3vw,2.4rem)] leading-snug text-white max-w-3xl"
//           style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
//         >
//           Where curiosity meets craft —{" "}
//           <em className="text-amber-400 not-italic" style={{ fontStyle: "italic" }}>
//             build skills that outlast every trend.
//           </em>
//         </h2>
//         <p className="mt-3 text-sm text-gray-500 max-w-lg leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
//           Invest in knowledge today. The returns compound forever.
//         </p>
//       </div>

//       {/* ══════════════════════════════════
//           MAIN GRID
//       ══════════════════════════════════ */}
//       <div
//         className="relative z-10 w-full px-6 sm:px-12 lg:px-20 py-14
//                    grid gap-x-10 gap-y-10
//                    grid-cols-2 md:grid-cols-3 xl:grid-cols-[200px_160px_repeat(auto-fill,minmax(160px,1fr))_180px]
//                    border-b border-white/[0.06]"
//         style={{ fontFamily: "'DM Sans', sans-serif" }}
//       >

//         {/* ── BRAND / CONTACT ── */}
//         <div className="col-span-2 md:col-span-1 xl:col-span-1">
//           {/* Logo */}
//           <div
//             className="text-[1.6rem] font-semibold text-white mb-5 flex items-center gap-2 tracking-wide"
//             style={{ fontFamily: "'Cormorant Garamond', serif" }}
//           >
//             <span className="text-amber-400 text-2xl">◈</span>
//             Zint<span className="text-amber-400">Skills</span>
//           </div>

//           <div 
//              className="space-y-3 text-sm leading-relaxed"
//           >
//              {/* Phone */}
//              <p className="flex items-start gap-2.5">
//                  <a 
//                      className="inline-flex items-center gap-2 hover:text-amber-300" 
//                      href="tel:+919876543210">
//                      <FaPhoneAlt className="h-4 w-4" />+91 98765 43210
//                   </a>
//              </p>

//              {/* Address */}
//              <span 
//                  className="inline-flex items-center gap-2"
//               >
//                  <CiLocationOn className="h-4 w-4" />Main Campus, Gwalior
//              </span>

//              {/* Email */}
//              <p className="flex items-start gap-2.5">
//                   <a 
//                      className="inline-flex items-center gap-2 hover:text-amber-300" href="mailto:info@zinstitute.in">
//                      <CiMail className="h-4 w-4" />info@zinstitute.in
//                   </a>
//               </p>
//             </div>

//           {/* ISO badge */}
//           <div className="mt-5 inline-flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-500">
//             <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-amber-400 flex items-center justify-center text-white font-bold text-[9px]">
//               ISO
//             </div>
//             ISO 9001:2015 Certified
//           </div>
//         </div>

//         {/* ── COMPANY LINKS ── */}
//         <div>
//           <ColTitle>Company</ColTitle>
//           <ul className="space-y-2.5">
//             {COMPANY_LINKS.map(({ label, to }) => (
//               <li key={to}>
//                 <Link to={to} 
//                   onClick={() => scrollUpToPage()}
//                   className="text-sm text-gray-400 hover:text-amber-400 transition-all duration-200 hover:translate-x-1 inline-block">
//                   {label}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* ── DYNAMIC CATEGORY COLUMNS (one column per type) ──
//             Each category is a clickable button. On click → navigate to /courses
//             with { activeType, activeCategory } in location.state so Courses.jsx
//             can auto-select the correct filters.
//         ── */}
//         {loading ? (
//           [1, 2].map((n) => <SkeletonCol key={n} />)
//         ) : (
//           Object.entries(typeMap).map(([type, categories]) => (
//             <div key={type}>
//               {/* Column heading = Type name */}
//               <ColTitle>{type}</ColTitle>
//               <ul className="space-y-2.5">
//                 {categories.map((category) => (
//                   <li key={category}>
//                     <button
//                       onClick={() => handleCategoryClick(type, category)}
//                       className="text-sm text-gray-400 hover:text-amber-400 transition-all duration-200 hover:translate-x-1 text-left flex items-center gap-1.5 group w-full"
//                     >
//                       <span className="text-gray-600 group-hover:text-amber-500 transition-colors">›</span>
//                       {category}
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))
//         )}

//         {/* ── FOLLOW US ── */}
//         <div>
//           <ColTitle>Follow Us</ColTitle>
//           <ul className="space-y-3">
//             {SOCIAL_LINKS.map(({ label, href, icon, color }) => (
//               <li key={label}>
//                 <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
//                   <span className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center text-white shrink-0
//                                    transition-transform duration-200 group-hover:scale-110`}>
//                     {icon}
//                   </span>
//                   <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-200">
//                     {label}
//                   </span>
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </div>

//       </div>{/* end main grid */}

//       {/* ══════════════════════════════════
//           BOTTOM BAR
//       ══════════════════════════════════ */}
//       <div
//         className="relative z-10 w-full px-6 sm:px-12 lg:px-20 py-5
//                    flex flex-col sm:flex-row items-start sm:items-center
//                    justify-between gap-3 text-xs text-gray-600"
//         style={{ fontFamily: "'DM Sans', sans-serif" }}
//       >
//         <span>© {new Date().getFullYear()} ZintSkills. All rights reserved.</span>
//         <div className="flex gap-5 flex-wrap">
//           {[["Privacy Policy","/privacy"],["Terms and Conditions","/terms"],["Refund Policy","/refund"]].map(([label, to]) => (
//             <Link key={to} to={to} className="hover:text-amber-400 transition-colors">{label}</Link>
//           ))}
//         </div>
//       </div>

//     </footer>
//   );
// };

// // ── Reusable column title ─────────────────────────────────────────────────────
// const ColTitle = ({ children }) => (
//   <p className="text-xs font-semibold text-white uppercase tracking-widest mb-4 pb-2
//                 border-b border-amber-400/50 w-fit">
//     {children}
//   </p>
// );

// export default Footer;
