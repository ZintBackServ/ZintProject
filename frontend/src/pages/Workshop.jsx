import { useState, useMemo, useEffect } from "react";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Sparkles, 
  Search, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  GraduationCap, 
  BookOpen, 
  ArrowRight,
  Image as ImageIcon,
  ZoomIn,
  School,
  Building2,
  Filter,
  ExternalLink,
  FileText
} from "lucide-react";
import { usePageMeta } from "../hooks/usePageMeta";

const FREE_WORKSHOP_FORM_URL = "https://forms.gle/MNC7k3BVMeKLv8s17";

// KRG Workshop Images
import krg1 from "../assets/krg-1.jpg";
import krg2 from "../assets/krg-2.jpg";
import krg3 from "../assets/krg-3.jpg";
import krg4 from "../assets/krg-4.jpg";
import krg5 from "../assets/krg-5.jpg";
import krg6 from "../assets/krg-6.jpg";
import krg7 from "../assets/krg-7.jpg";
import krg8 from "../assets/krg-8.jpg";
import krg9 from "../assets/krg-9.jpg";
import krg10 from "../assets/krg-10.jpg";
import krg11 from "../assets/krg-11.jpg";
import krg12 from "../assets/krg-12.jpg";

// Govt. Girls Hr. Sec. School Images
import ghs1 from "../assets/ghs1.jpeg";
import ghs2 from "../assets/ghs2.jpeg";
import ghs3 from "../assets/ghs3.jpeg";
import ghs4 from "../assets/ghs4.jpeg";
import ghs5 from "../assets/ghs5.jpeg";
import ghs6 from "../assets/ghs6.jpeg";
import ghs7 from "../assets/ghs7.jpeg";
import ghs8 from "../assets/ghs8.jpeg";
import ghs9 from "../assets/ghs9.jpeg";
import ghs10 from "../assets/ghs10.jpeg";
import ghs11 from "../assets/ghs11.jpeg";
import ghs12 from "../assets/ghs12.jpeg";
import ghs13 from "../assets/ghs13.jpeg";

// Comprehensive Workshop Dataset
const WORKSHOPS_DATA = [
  {
    id: "krg-career-guidance-2026",
    title: "KRG Govt. Girls PG College — Career Guidance & Tech Skills Workshop",
    shortName: "KRG Autonomous Girls PG College",
    date: "13 June 2026",
    rawDate: "2026-06-13",
    category: "College Workshop",
    venue: "K.R.G. Autonomous Girls PG College, Gwalior (M.P.)",
    attendees: "650+ Students",
    speaker: "Senior Tech Architects & Zint Career Mentors",
    description:
      "A high-impact interactive workshop empowering female undergraduate and postgraduate students with modern IT career pathways, hands-on software development awareness, AI productivity workflows, full-stack technologies, and technical interview preparation masterclasses.",
    highlights: [
      "Live demonstrations of modern web technologies, Git version control, and AI developer tools",
      "One-on-one career counseling and roadmap for IT industry placements and internship drives",
      "Interactive Q&A session on competitive exams, campus placements, and private tech sector opportunities",
      "Certificate of participation and mementos presented in coordination with college faculty"
    ],
    badge: "Featured College Workshop",
    images: [
      { 
        src: krg1, 
        caption: "Official Workshop Poster: Career Guidance & Emerging Technologies Workshop at K.R.G. Autonomous Girls PG College", 
        alt: "KRG Workshop Poster Banner",
        isPoster: true 
      },
      { 
        src: krg2, 
        caption: "Packed auditorium with 650+ female students attending the Career Guidance & Tech Trends keynote", 
        alt: "KRG Students Lecture" 
      },
      { 
        src: krg3, 
        caption: "Zint mentors explaining high-growth career roadmaps in Full-Stack, AI, and IT Industry", 
        alt: "KRG Tech Presentation" 
      },
      { 
        src: krg4, 
        caption: "Interactive doubt-clearing and career counseling session with enthusiastic students", 
        alt: "KRG Interactive Q&A" 
      },
      { 
        src: krg5, 
        caption: "Live demonstration on modern software development tools, Git, and web technologies", 
        alt: "KRG Live Coding Demo" 
      },
      { 
        src: krg6, 
        caption: "Faculty interaction & presenting Certificate of Appreciation to K.R.G. College for empowering women in tech", 
        alt: "KRG Faculty Appreciation" 
      },
      { 
        src: krg7, 
        caption: "K.R.G. College faculty and leadership warmly welcoming Zint Education Institute mentors on stage", 
        alt: "KRG Faculty Welcome" 
      },
      { 
        src: krg8, 
        caption: "Honoring college coordinators and department faculty for promoting hands-on industry skill development", 
        alt: "KRG Faculty Recognition" 
      },
      { 
        src: krg9, 
        caption: "Specialized session on Generative AI tools, Python, and emerging tech careers in 2026", 
        alt: "KRG Emerging Tech" 
      },
      { 
        src: krg10, 
        caption: "Inspiring closing keynote and student feedback on career readiness and coding bootcamps", 
        alt: "KRG Keynote Session" 
      },
      { 
        src: krg11, 
        caption: "Certificate distribution ceremony recognizing active student participants", 
        alt: "KRG Certificate Ceremony" 
      },
      { 
        src: krg12, 
        caption: "Commemorative group photograph with college faculty, department heads, and Zint mentors", 
        alt: "KRG Group Photograph" 
      }
    ]
  },
  {
    id: "govt-girls-hs-school-shinde-chhawani",
    title: "Govt. Girls Higher Secondary School, Shinde Ki Chhawani — Career Guidance & Digital Literacy Workshop",
    shortName: "Govt. Girls H.S. School, Shinde Ki Chhawani",
    date: "01 August 2026",
    rawDate: "2026-08-01",
    category: "School Workshop",
    venue: "Govt. Girls H.S. School, Shinde Ki Chhawani, Lashkar, Gwalior (M.P.)",
    attendees: "250+ Students",
    speaker: "Senior Tech Architects & Zint Career Mentorship Team",
    description:
      "An inspiring foundational tech awareness and career counseling workshop organized for high school students. The seminar focused on digital literacy, future careers in software and technology, practical guidance on higher education options after 10th and 12th (BCA, B.Tech, Vocational Diplomas), and building early computer skills.",
    highlights: [
      "Introduction to computer science fundamentals, digital literacy, and modern tech career opportunities",
      "Step-by-step career path counseling for 10th & 12th students aspiring for IT and technical education",
      "Interactive doubt resolution on higher education choices, government scholarship schemes, and computer courses",
      "Practical guidance from industry mentors on self-learning, digital safety, and early coding fundamentals",
      "Special felicitation and distribution of participation certificates in coordination with school leadership and teachers"
    ],
    badge: "Campus Outreach",
    images: [
      { 
        src: ghs1, 
        caption: "Official Workshop Banner: Career Guidance & IT Awareness Seminar at Govt. Girls H.S. School, Shinde Ki Chhawani, Gwalior", 
        alt: "Govt Girls HS School Workshop Banner",
        isPoster: true 
      },
      { 
        src: ghs2, 
        caption: "Opening address introducing students to foundational computer concepts, digital literacy, and IT career prospects", 
        alt: "Opening Session with Students" 
      },
      { 
        src: ghs3, 
        caption: "Zint mentors explaining higher education roadmaps in BCA, B.Tech, and professional computer certifications", 
        alt: "Mentorship and Career Presentation" 
      },
      { 
        src: ghs4, 
        caption: "Attentive high school students actively participating and taking notes during the career guidance session", 
        alt: "Students in Classroom Session" 
      },
      { 
        src: ghs5, 
        caption: "Interactive discussion on modern computer skills, programming fundamentals, and digital learning tools", 
        alt: "Interactive Discussion with Students" 
      },
      { 
        src: ghs6, 
        caption: "One-on-one student counseling addressing queries regarding subject selections and career options in tech", 
        alt: "Student Career Guidance" 
      },
      { 
        src: ghs7, 
        caption: "Encouraging girl students to explore technical education, software development, and digital entrepreneurship", 
        alt: "Women in Tech Empowerment Session" 
      },
      { 
        src: ghs8, 
        caption: "Demonstration of practical learning pathways, educational web resources, and computer applications for school students", 
        alt: "Practical Learning Insights" 
      },
      { 
        src: ghs9, 
        caption: "Engaging Q&A round answering student queries regarding technology courses, certifications, and scholarships", 
        alt: "Student Doubt Clearing Q&A" 
      },
      { 
        src: ghs10, 
        caption: "School faculty and teachers coordinating with the Zint mentorship team to support student learning", 
        alt: "Faculty Collaboration" 
      },
      { 
        src: ghs11, 
        caption: "Student acknowledgment session celebrating enthusiasm, participation, and academic curiosity", 
        alt: "Student Recognition Ceremony" 
      },
      { 
        src: ghs12, 
        caption: "Presenting token of appreciation and mementos to respected school faculty and coordinators", 
        alt: "Faculty Memento Presentation" 
      },
      { 
        src: ghs13, 
        caption: "Commemorative group photograph with school principal, faculty members, and Zint Institute mentors", 
        alt: "School Faculty & Mentors Group Photo" 
      }
    ]
  }
];

const CATEGORIES = ["All", "College Workshop", "School Workshop"];

export default function Workshop() {
  usePageMeta(
    "Workshops & Campus Seminars",
    "Explore interactive tech workshops and career guidance seminars conducted by Zint Computer Education Institute across top colleges and schools in Gwalior and Central India."
  );

  const [selectedId, setSelectedId] = useState(WORKSHOPS_DATA[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Lightbox Modal State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Filtered workshops for the selector
  const filteredWorkshops = useMemo(() => {
    return WORKSHOPS_DATA.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shortName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Selected workshop
  const activeWorkshop = useMemo(() => {
    return WORKSHOPS_DATA.find((w) => w.id === selectedId) || WORKSHOPS_DATA[0];
  }, [selectedId]);

  // Separate poster (image 0) and gallery photos (images 1+)
  const posterImage = activeWorkshop?.images?.[0];
  const galleryPhotos = useMemo(() => {
    return (activeWorkshop?.images || []).slice(1);
  }, [activeWorkshop]);

  // Handle body scroll locking when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, lightboxIndex, activeWorkshop]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handlePrevImage = () => {
    if (!activeWorkshop?.images?.length) return;
    setLightboxIndex((prev) => (prev === 0 ? activeWorkshop.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!activeWorkshop?.images?.length) return;
    setLightboxIndex((prev) => (prev === activeWorkshop.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      
      {/* ── HERO BANNER ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-10 sm:pt-14 pb-12 sm:pb-16 border-b border-slate-800/80 bg-radial-[at_50%_0%] from-purple-900/25 via-slate-950 to-slate-950">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent" />
        
        {/* Glow orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-fuchsia-400" />
              <span>Campus Engagements & Tech Masterclasses</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 sm:mb-4 leading-tight">
              Zint <span className="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Workshops & Seminars</span>
            </h1>
            
            <p className="text-slate-300 sm:text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-7 px-2">
              Explore hands-on technical bootcamps, digital literacy drives, and career guidance seminars conducted across top academic institutions and partner campuses in Gwalior.
            </p>

            {/* Free Workshop Registration CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-7 sm:mb-8">
              <a
                href={FREE_WORKSHOP_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-pink-600 to-cyan-500 hover:from-fuchsia-500 hover:via-pink-500 hover:to-cyan-400 text-white font-bold text-sm sm:text-base shadow-xl shadow-fuchsia-600/30 hover:shadow-fuchsia-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>Register for Free Workshop (Google Form)</span>
                <ExternalLink className="w-4 h-4 text-white/90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Free for all school &amp; college students
              </span>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 max-w-4xl mx-auto pt-1">
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center shadow-lg">
                <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">35+</div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">Institutions Partnered</div>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center shadow-lg">
                <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">18,000+</div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">Students Guided</div>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center shadow-lg">
                <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">100%</div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">Practical Hands-on</div>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center shadow-lg">
                <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">4.9/5</div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">Student Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MOBILE / TABLET FREE REGISTRATION BAR ── */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-1">
        <a
          href={FREE_WORKSHOP_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-fuchsia-950/90 via-purple-950/80 to-slate-900 border border-fuchsia-500/50 shadow-lg text-white hover:border-fuchsia-400 transition-all"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="p-2 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 shrink-0">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">Free</span>
                <span className="text-xs font-bold text-white truncate">Workshop Registration</span>
              </div>
              <div className="text-[11px] text-slate-300 truncate">For all school &amp; college students</div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-fuchsia-600 to-pink-600 px-3 py-1.5 rounded-xl shrink-0 shadow-md">
            <span>Register</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </a>
      </div>

      {/* ── MOBILE / TABLET QUICK SELECTOR BAR (Visible on < lg screens) ── */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-lg">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>Select Workshop to View</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {WORKSHOPS_DATA.map((w) => {
              const active = w.id === selectedId;
              return (
                <button
                  key={w.id}
                  onClick={() => setSelectedId(w.id)}
                  className={`text-left p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                    active
                      ? "bg-fuchsia-950/60 border-fuchsia-500 text-white shadow-md ring-1 ring-fuchsia-500/40"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      active ? "bg-fuchsia-500/30 text-fuchsia-200" : "bg-slate-800 text-slate-400"
                    }`}>
                      {w.category}
                    </span>
                    <span className="text-[10px] text-amber-400 font-medium">{w.date}</span>
                  </div>
                  <div className="text-xs font-bold line-clamp-1">{w.shortName || w.title}</div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-slate-500" />
                    <span>{w.images.length} Captures</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE: LEFT (LIST) & RIGHT (GALLERY) ──────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* ── FREE WORKSHOP REGISTRATION ANNOUNCEMENT BANNER ── */}
        <div className="mb-6 sm:mb-8 bg-gradient-to-r from-fuchsia-950/70 via-slate-900 to-purple-950/80 border border-fuchsia-500/40 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-fuchsia-500/10 to-transparent pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 border border-fuchsia-500/40 flex items-center justify-center shrink-0 shadow-inner">
                <GraduationCap className="w-6 h-6 text-fuchsia-400" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                    Free Registration
                  </span>
                  <span className="text-xs font-semibold text-fuchsia-300">
                    Open for All Students
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  Join Zint's Free Tech &amp; Career Guidance Workshop
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Hands-on learning in programming, software tools, and career roadmaps. Fill out the Google Form to reserve your seat.
                </p>
              </div>
            </div>

            <a
              href={FREE_WORKSHOP_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-fuchsia-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 w-full md:w-auto text-center"
            >
              <FileText className="w-4 h-4" />
              <span>Fill Google Form</span>
              <ExternalLink className="w-4 h-4 ml-0.5 opacity-90" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ═════════════════════════════════════════════════════════════
              LEFT SIDE: WORKSHOP LIST & SELECTOR (col-span-4, Desktop)
             ═════════════════════════════════════════════════════════════ */}
          <aside className="hidden lg:flex lg:col-span-4 xl:col-span-4 flex-col gap-4 lg:sticky lg:top-6">
            
            {/* Header & Filter Controls Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-fuchsia-400" />
                  <h2 className="text-base font-bold text-white tracking-wide">All Workshops</h2>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {filteredWorkshops.length} Found
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by college, school or date..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/50 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                        active
                          ? "bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/30"
                          : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List of Workshops */}
            <div className="space-y-3.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {filteredWorkshops.length === 0 ? (
                <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-6 text-center">
                  <p className="text-sm text-slate-400">No workshops match your search.</p>
                  <button
                    onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                    className="mt-2.5 text-xs text-fuchsia-400 hover:underline font-semibold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredWorkshops.map((item) => {
                  const isSelected = item.id === selectedId;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`group relative cursor-pointer p-4 rounded-2xl transition-all duration-200 border text-left ${
                        isSelected
                          ? "bg-gradient-to-r from-fuchsia-950/80 via-slate-900 to-slate-900 border-fuchsia-500/80 shadow-lg shadow-fuchsia-950/50 ring-1 ring-fuchsia-500/30"
                          : "bg-slate-900/70 hover:bg-slate-850 border-slate-800/90 hover:border-slate-700"
                      }`}
                    >
                      {/* Active Indicator Bar */}
                      {isSelected && (
                        <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-gradient-to-b from-fuchsia-400 to-pink-500 rounded-r-full" />
                      )}

                      {/* Header Badge & Date */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md ${
                          isSelected 
                            ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30" 
                            : "bg-slate-800 text-slate-400"
                        }`}>
                          {item.category}
                        </span>

                        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{item.date}</span>
                        </div>
                      </div>

                      {/* Workshop Name */}
                      <h3 className={`text-sm font-bold leading-snug mb-1.5 transition-colors ${
                        isSelected ? "text-white" : "text-slate-200 group-hover:text-fuchsia-300"
                      }`}>
                        {item.title}
                      </h3>

                      {/* Venue */}
                      <div className="flex items-start gap-1.5 text-xs text-slate-400 mb-2.5 line-clamp-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span className="truncate">{item.venue}</span>
                      </div>

                      {/* Footer Row: Photo count & Selection arrow */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                        <span className="text-slate-400 font-medium flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.images.length} Captures</span>
                        </span>
                        <span className={`flex items-center gap-1 font-semibold ${
                          isSelected ? "text-fuchsia-400" : "text-slate-500 group-hover:text-slate-300"
                        }`}>
                          {isSelected ? "Viewing Gallery" : "View Details"}
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? "translate-x-0.5" : "group-hover:translate-x-1"}`} />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Free Student Workshop Registration Card */}
            <div className="bg-gradient-to-br from-fuchsia-950/70 via-slate-900 to-purple-950/60 border border-fuchsia-500/40 rounded-2xl p-4 text-center shadow-lg">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold mb-2.5">
                <Sparkles className="w-3 h-3" />
                <span>100% Free For All Students</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Student Workshop Registration</h4>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Register for our upcoming interactive tech &amp; career guidance workshop. Open for all students.
              </p>
              <a
                href={FREE_WORKSHOP_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-3 text-xs font-bold rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white shadow-md shadow-fuchsia-600/20 hover:scale-[1.01] transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Fill Google Form</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Quick Campus Workshop Request Card */}
            <div className="bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-800/40 rounded-2xl p-4 text-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-fuchsia-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white mb-1">Host a Workshop at Your Campus</h4>
              <p className="text-xs text-slate-400 mb-3">
                Invite Zint industry experts to conduct customized tech & career seminars for your students.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-md transition-all"
              >
                <span>Request Campus Workshop</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </aside>

          {/* ═════════════════════════════════════════════════════════════
              RIGHT SIDE: WORKSHOP SHOWCASE & IMAGE GALLERY (col-span-8)
             ═════════════════════════════════════════════════════════════ */}
          <section className="lg:col-span-8 xl:col-span-8 space-y-6">
            
            {/* Active Workshop Header Info Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

              {/* Badges & Status */}
              <div className="flex flex-wrap items-center gap-2 mb-3.5">
                <span className="px-3 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 text-xs font-bold uppercase tracking-wider">
                  {activeWorkshop.category}
                </span>
                {activeWorkshop.badge && (
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                    ★ {activeWorkshop.badge}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Successfully Completed
                </span>
              </div>

              {/* Workshop Title */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-snug mb-4">
                {activeWorkshop.title}
              </h2>

              {/* Key Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5 mb-5">
                
                {/* Stat 1: Date */}
                <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-950/70 border border-slate-800/80 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Date & Schedule</div>
                    <div className="font-bold text-slate-200 text-xs sm:text-sm">{activeWorkshop.date}</div>
                  </div>
                </div>

                {/* Stat 2: Venue */}
                <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-950/70 border border-slate-800/80 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Host Institution / Venue</div>
                    <div className="font-bold text-slate-200 text-xs sm:text-sm truncate" title={activeWorkshop.venue}>
                      {activeWorkshop.venue}
                    </div>
                  </div>
                </div>

                {/* Stat 3: Attendees */}
                <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-950/70 border border-slate-800/80 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-fuchsia-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Attendance & Reach</div>
                    <div className="font-bold text-slate-200 text-xs sm:text-sm">{activeWorkshop.attendees}</div>
                  </div>
                </div>

              </div>

              {/* Description */}
              <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed mb-5">
                {activeWorkshop.description}
              </p>

              {/* Highlights Bullet List */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Key Takeaways & Highlights
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                  {activeWorkshop.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ═════════════════════════════════════════════════════════════
                FEATURED WORKSHOP POSTER & BANNER SHOWCASE (Full Width)
               ═════════════════════════════════════════════════════════════ */}
            {posterImage && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <div className="p-1.5 sm:p-2 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-white leading-tight">
                        Official Workshop Poster & Announcement
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-400">
                        Official banner and program schedule released for this event
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => openLightbox(0)}
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shrink-0"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Enlarge Poster</span>
                    <span className="sm:hidden">Enlarge</span>
                  </button>
                </div>

                {/* Poster Frame */}
                <div
                  onClick={() => openLightbox(0)}
                  className="group relative w-full rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer bg-slate-950 border border-slate-800 hover:border-fuchsia-500/60 shadow-xl transition-all duration-300"
                >
                  <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] flex items-center justify-center bg-slate-950 overflow-hidden">
                    {/* Ambient Blur Backdrop */}
                    <img
                      src={posterImage.src}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30 scale-110"
                    />

                    {/* Main Sharp Poster */}
                    <img
                      src={posterImage.src}
                      alt={posterImage.alt || activeWorkshop.title}
                      loading="lazy"
                      className="relative z-10 max-h-full max-w-full w-auto h-auto object-contain group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="px-4 py-2 rounded-xl bg-slate-900/90 border border-fuchsia-500/50 text-fuchsia-200 text-xs font-semibold flex items-center gap-2 backdrop-blur-md shadow-2xl">
                        <ZoomIn className="w-4 h-4" />
                        <span>Click to View Full Poster</span>
                      </span>
                    </div>

                    {/* Top Chip */}
                    <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 z-20 px-2.5 sm:px-3 py-1 rounded-lg bg-fuchsia-600/90 backdrop-blur-md text-[11px] sm:text-xs font-bold text-white shadow-lg flex items-center gap-1.5 border border-fuchsia-400/40">
                      <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>Poster • Photo 1 of {activeWorkshop.images.length}</span>
                    </div>
                  </div>

                  {/* Poster Caption Bar */}
                  {posterImage.caption && (
                    <div className="p-3 sm:p-3.5 bg-slate-900/95 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                      <p className="text-xs sm:text-sm text-slate-300 font-medium leading-snug">
                        {posterImage.caption}
                      </p>
                      <span className="text-xs text-fuchsia-400 font-semibold shrink-0 flex items-center gap-1">
                        <span>Click to Expand</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════
                EVENT LIVE PHOTOGRAPHS & GALLERY GRID (Photos 2 onwards)
               ═════════════════════════════════════════════════════════════ */}
            <div className="space-y-4 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-bold text-white">Event Live Photographs</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 font-semibold border border-fuchsia-500/30">
                    {galleryPhotos.length} Live Captures
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  Click any photograph to open full-screen gallery preview
                </span>
              </div>

              {/* Clean Symmetrical Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                {galleryPhotos.map((img, photoIdx) => {
                  const actualGlobalIndex = photoIdx + 1; // index 1 onwards in activeWorkshop.images
                  
                  return (
                    <div
                      key={photoIdx}
                      onClick={() => openLightbox(actualGlobalIndex)}
                      className="group relative bg-slate-900 border border-slate-800 hover:border-fuchsia-500/60 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-fuchsia-950/40 transition-all duration-300 flex flex-col"
                    >
                      {/* Image Container with fixed uniform 4:3 aspect ratio */}
                      <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-950">
                        <img
                          src={img.src}
                          alt={img.alt || activeWorkshop.title}
                          loading="lazy"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" />

                        {/* Enlarge Button on Hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-900/90 border border-fuchsia-500/50 text-fuchsia-200 text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md shadow-xl">
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>View Fullscreen</span>
                          </span>
                        </div>

                        {/* Photo index chip */}
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] sm:text-[11px] font-semibold text-slate-300 border border-white/10">
                          {actualGlobalIndex + 1} / {activeWorkshop.images.length}
                        </div>
                      </div>

                      {/* Balanced Caption with uniform height */}
                      {img.caption && (
                        <div className="p-3 sm:p-3.5 bg-slate-900/95 flex-1 flex flex-col justify-center border-t border-slate-800/80">
                          <p className="text-xs text-slate-300 leading-snug line-clamp-2">
                            {img.caption}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Callout / Assurance Banner */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white mb-1">Looking for Free Workshop Registration or Course Details?</h4>
                <p className="text-xs sm:text-sm text-slate-400">
                  Join our upcoming free workshops for students or explore our offline practical curriculums and internship tracks.
                </p>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap gap-2.5 shrink-0 w-full sm:w-auto">
                <a
                  href={FREE_WORKSHOP_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 text-center px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white transition-all shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Free Workshop Form</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="/courses"
                  className="flex-1 sm:flex-initial text-center px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                >
                  View Courses
                </a>
                <a
                  href="/contact"
                  className="flex-1 sm:flex-initial text-center px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                >
                  Contact Zint
                </a>
              </div>
            </div>

          </section>

        </div>
      </main>

      {/* ── FULL-SCREEN LIGHTBOX MODAL ──────────────────────────────── */}
      {lightboxOpen && activeWorkshop?.images?.[lightboxIndex] && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition-all shadow-xl"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Previous Arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
            className="absolute left-2 sm:left-6 z-50 p-2 sm:p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition-all shadow-xl"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Next Arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
            className="absolute right-2 sm:right-6 z-50 p-2 sm:p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition-all shadow-xl"
            title="Next (Right Arrow)"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Modal Content */}
          <div 
            className="max-w-5xl w-full max-h-[92vh] flex flex-col items-center justify-center px-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[70vh] sm:max-h-[76vh] w-full flex items-center justify-center overflow-hidden rounded-2xl bg-black border border-slate-800 shadow-2xl">
              <img
                src={activeWorkshop.images[lightboxIndex].src}
                alt={activeWorkshop.images[lightboxIndex].caption || activeWorkshop.title}
                className="max-h-[70vh] sm:max-h-[76vh] max-w-full w-auto object-contain select-none"
              />
            </div>

            {/* Modal Caption Bar */}
            <div className="w-full max-w-3xl mt-3 sm:mt-4 text-center bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 shadow-lg">
              <div className="text-xs text-fuchsia-400 font-semibold mb-0.5">
                {activeWorkshop.title} • Photo {lightboxIndex + 1} of {activeWorkshop.images.length}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-medium">
                {activeWorkshop.images[lightboxIndex].caption}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
