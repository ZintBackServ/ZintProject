import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Search,
  Sparkles,
  Users,
  Video,
  X,
  Zap,
  Award,
  BookOpen,
  ChevronDown,
  MessageCircle,
  HelpCircle,
  Laptop,
  Check,
  Compass,
  ExternalLink,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { apiUrl, toHttps } from "../utils/api";
import { usePageMeta } from "../hooks/usePageMeta";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  status: "Student",
  interest: "Full Stack Web Development",
};

const displayDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const Field = ({ label, children }) => (
  <label className="block text-xs sm:text-sm font-semibold text-slate-700">
    <span className="mb-1.5 block text-slate-700">{label}</span>
    {children}
  </label>
);

const inputStyle =
  "w-full rounded-xl border border-purple-200/80 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#a51fb5] focus:bg-white focus:ring-4 focus:ring-[#a51fb5]/10";

const CATEGORIES = [
  { id: "all", label: "All Sessions" },
  { id: "webdev", label: "Full Stack Web Dev" },
  { id: "python", label: "Python & AI / ML" },
  { id: "cyber", label: "Cyber Security" },
  { id: "career", label: "Career & Placements" },
];

const FAQS = [
  {
    question: "Are these webinars completely free to attend?",
    answer:
      "Yes, 100%! All Zint Live Learning Series webinars are completely free of charge. There are no hidden fees or payment requirements.",
  },
  {
    question: "Will I receive a Certificate of Participation?",
    answer:
      "Yes, all registered attendees who participate in the live session and complete the brief feedback form will receive an official verifiable digital Certificate of Participation from Zint Institute.",
  },
  {
    question: "How and when will I receive the live webinar joining link?",
    answer:
      "Upon successful registration, your seat is confirmed immediately. The live Google Meet / Zoom session joining link along with calendar reminders will be sent directly to your WhatsApp number and email before the session starts.",
  },
  {
    question: "Are session recordings and project source code provided?",
    answer:
      "Yes! Mentor presentation slides, GitHub source code repositories, and cheat sheets covered during the webinar will be shared with registered participants after the live stream.",
  },
  {
    question: "Who is eligible to attend these webinars?",
    answer:
      "Anyone passionate about technology! College students (B.Tech, BCA, MCA, B.Sc), fresh graduates seeking IT jobs, working professionals looking to upskill, and beginners with zero coding experience are all welcome.",
  },
];

export default function Webinar() {
  usePageMeta({
    title: "Free Live Webinars & Masterclasses | Zint Institute",
    description:
      "Join free live tech webinars, hands-on coding sessions, and career guidance workshops hosted by industry leaders from top tech firms at Zint Institute.",
  });

  const [webinars, setWebinars] = useState([]);
  const [categories, setCategories] = useState([{ id: "all", label: "All Sessions" }]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  useEffect(() => {
    // 1. Fetch Webinars
    fetch(apiUrl("/webinar"))
      .then((response) => response.json().then((data) => ({ response, data })))
      .then(({ response, data }) => {
        if (!response.ok) throw new Error(data.message);
        setWebinars(data.webinars || []);
      })
      .catch(() => setWebinars([]))
      .finally(() => setLoading(false));

    // 2. Fetch Categories from Category API
    fetch(apiUrl("/category/getAllCategories"))
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && Array.isArray(data.categories)) {
          const apiCats = data.categories.map((c) => ({
            id: c.categoryName?.trim(),
            label: c.categoryName?.trim(),
          })).filter((c) => Boolean(c.id));
          setCategories(apiCats);
        }
      })
      .catch(() => {});
  }, []);

  // Compute all unique category tabs dynamically (API categories + categories on existing webinars)
  const activeCategoryTabs = useMemo(() => {
    const map = new Map();
    map.set("all", { id: "all", label: "All Sessions" });

    // Add categories from API
    categories.forEach((cat) => {
      if (cat.id && cat.id !== "all") {
        map.set(cat.id.toLowerCase(), { id: cat.id, label: cat.label });
      }
    });

    // Add unique categories from webinars (including custom created ones)
    webinars.forEach((w) => {
      if (w.category && w.category.trim()) {
        const catName = w.category.trim();
        const key = catName.toLowerCase();
        if (!map.has(key)) {
          map.set(key, { id: catName, label: catName });
        }
      }
    });

    return Array.from(map.values());
  }, [categories, webinars]);

  const visibleWebinars = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();
    const cat = selectedCategory.trim().toLowerCase();

    return webinars.filter((webinar) => {
      const matchesSearch =
        !search ||
        [webinar.title, webinar.mentor, webinar.description, webinar.category, webinar.mentorRole].some(
          (value) => value?.toLowerCase().includes(search)
        );

      const wCat = (webinar.category || "").trim().toLowerCase();
      const matchesCategory =
        cat === "all" ||
        wCat === cat ||
        wCat.includes(cat) ||
        cat.includes(wCat);

      return matchesSearch && matchesCategory;
    });
  }, [webinars, searchQuery, selectedCategory]);

  const openRegistration = (webinar) => {
    setSelectedWebinar(webinar);
    setForm(initialForm);
    setResult(null);
    setDetailOpen(false);
    setModalOpen(true);
  };

  const openDetails = (webinar) => {
    setSelectedWebinar(webinar);
    setDetailOpen(true);
  };

  const update = (event) =>
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const register = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setResult(null);
      const response = await fetch(apiUrl(`/webinar/${selectedWebinar._id}/register`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Unable to register.");
      setResult({ success: true, text: data.message, whatsAppSent: data.whatsAppSent });
    } catch (error) {
      setResult({ success: false, text: error.message || "Unable to register." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#faf8fc] text-slate-900 selection:bg-fuchsia-500 selection:text-white">
      {/* ══════════════════════════════════════════════════════
          HERO SECTION — Premium Radiant Dark Theme
      ══════════════════════════════════════════════════════ */}
      <section className="relative isolate overflow-hidden bg-[#0d0118] px-4 pb-28 pt-16 sm:pb-36 sm:pt-24 text-white">
        {/* Ambient Gradient Background & Mesh Orbs */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_10%,#9e1bb8_0%,transparent_35%),radial-gradient(circle_at_85%_20%,#4328b8_0%,transparent_30%),radial-gradient(circle_at_50%_90%,#801487_0%,transparent_35%),linear-gradient(135deg,#0c0017_0%,#30053e_50%,#0e052c_100%)]" />

        {/* Dynamic Tech Grid Pattern Overlay */}
        <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.09)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />

        {/* Floating Glowing Neon Blobs */}
        <div className="absolute -left-20 top-16 -z-10 h-72 w-72 rounded-full bg-[#e95cff]/20 blur-[100px] animate-pulse" />
        <div className="absolute -right-20 top-32 -z-10 h-80 w-80 rounded-full bg-[#00d2a8]/20 blur-[110px]" />

        <div className="relative mx-auto max-w-6xl text-center">
          {/* Top Live Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-extrabold tracking-wider text-white shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34d399] opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#10b981]"></span>
            </span>
            <span className="bg-gradient-to-r from-pink-200 via-purple-100 to-emerald-200 bg-clip-text text-transparent uppercase text-[11px] sm:text-xs">
              ZINT LIVE MASTERCLASS SERIES
            </span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="mx-auto mt-6 max-w-4xl text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Transform Your Career With{" "}
            <span className="bg-gradient-to-r from-[#ff9aff] via-[#eb7bff] to-[#6ee7b7] bg-clip-text text-transparent drop-shadow-sm">
              Expert-Led Webinars
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-purple-100/90 sm:text-base md:text-lg font-normal">
            Join free live interactive webinars, hands-on coding sessions, and career guidance masterclasses hosted by top industry tech leaders.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#webinars-grid"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#b325be] to-[#8d179f] px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-purple-900/40 transition-all hover:scale-105 hover:from-[#c832d4] hover:to-[#9c1cb1]"
            >
              <Video className="h-4 w-4" />
              Explore Live Sessions
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-purple-100 backdrop-blur-md transition hover:bg-white/15 hover:text-white"
            >
              <Sparkles className="h-4 w-4 text-emerald-300" />
              Why Attend Free?
            </a>
          </div>

          {/* 4 Feature Value Highlights Strip */}
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 text-left sm:grid-cols-4 sm:gap-4">
            {[
              {
                value: "1,200+",
                label: "Students Enrolled",
                desc: "Active community",
                icon: Users,
                color: "text-purple-300",
                bg: "from-purple-500/10 to-transparent",
              },
              {
                value: "4.9 / 5.0",
                label: "Average Rating",
                desc: "Verified student feedback",
                icon: GraduationCap,
                color: "text-pink-300",
                bg: "from-pink-500/10 to-transparent",
              },
              {
                value: "100% Free",
                label: "Live Webinars",
                desc: "Zero registration cost",
                icon: Video,
                color: "text-emerald-300",
                bg: "from-emerald-500/10 to-transparent",
              },
              {
                value: "Live Q&A",
                label: "Mentor Guidance",
                desc: "Direct doubt clearing",
                icon: Zap,
                color: "text-amber-300",
                bg: "from-amber-500/10 to-transparent",
              },
            ].map(({ value, label, desc, icon: Icon, color, bg }) => (
              <div
                key={label}
                className={`group relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.12] bg-gradient-to-b ${bg}`}
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <strong className="mt-3 block text-lg sm:text-xl font-black text-white">{value}</strong>
                <span className="text-xs font-bold text-slate-200 block">{label}</span>
                <span className="text-[10px] text-purple-200/60 block mt-0.5">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          EXPLORE WEBINARS SECTION
      ══════════════════════════════════════════════════════ */}
      <section
        id="webinars-grid"
        className="relative z-10 mx-auto -mt-12 max-w-7xl px-4 pb-16 sm:-mt-16 sm:pb-24"
      >
        <div className="rounded-[2rem] border border-purple-100 bg-white p-5 shadow-[0_20px_60px_rgba(72,11,94,0.08)] sm:p-8">
          {/* Header & Filter Controls */}
          <div className="flex flex-col gap-6 border-b border-purple-100/80 pb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#8c179f]">
                  <Sparkles className="h-3.5 w-3.5 text-[#B11FA8]" />
                  Upcoming & Recorded Sessions
                </div>
                <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  Explore Live Webinars
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                  Join interactive sessions, ask doubts live, and get digital participation certificates.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-purple-600" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search topic, mentor, skill..."
                  className="w-full rounded-2xl border border-purple-200/80 bg-slate-50/70 py-2.5 pl-10 pr-9 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#a51fb5] focus:bg-white focus:ring-4 focus:ring-purple-500/10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills (Dynamic from API + Live Webinars) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {activeCategoryTabs.map((cat) => {
                const isActive =
                  selectedCategory.toLowerCase() === cat.id.toLowerCase() ||
                  (selectedCategory === "all" && cat.id === "all");
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-extrabold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-[#8d179f] to-[#b325be] text-white shadow-md shadow-purple-500/20"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-purple-200 hover:bg-purple-50/50 hover:text-slate-900"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Webinar Cards Grid ── */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-[#8d179f]" />
              <p className="mt-4 text-sm font-semibold text-slate-500">Loading live webinars...</p>
            </div>
          ) : visibleWebinars.length === 0 ? (
            /* Empty State */
            <div className="my-8 rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50/50 via-white to-emerald-50/40 p-8 sm:p-14 text-center shadow-inner">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8d179f] to-[#c13bc9] text-white shadow-lg shadow-purple-500/25">
                <Video className="h-8 w-8" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">
                {searchQuery || selectedCategory !== "all"
                  ? "No webinars matching your filter"
                  : "New Live Webinars Coming Soon!"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                {searchQuery || selectedCategory !== "all"
                  ? "Try adjusting your search terms or selecting a different category to view available sessions."
                  : "Our tech mentors are preparing the next batch of interactive coding masterclasses. Register below to be notified first on WhatsApp!"}
              </p>
              {(searchQuery || selectedCategory !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-100 px-4 py-2 text-xs font-bold text-purple-800 hover:bg-purple-200 transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            /* Cards List */
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleWebinars.map((webinar) => (
                <article
                  key={webinar._id}
                  onClick={() => openDetails(webinar)}
                  className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-purple-200/80 bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer"
                >
                  {/* Top Bar with Status on Left & Category on Right */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black tracking-wide text-emerald-800 border border-emerald-300">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      {webinar.isRegistrationOpen ? "FREE REGISTRATION" : "CLOSED"}
                    </span>

                    {webinar.category && (
                      <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#8E1387] border border-purple-200">
                        {webinar.category}
                      </span>
                    )}
                  </div>

                  {/* Poster Thumbnail - Fully Visible & Crisp */}
                  <div className="relative w-full aspect-[16/10] bg-gradient-to-b from-purple-50/40 to-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-purple-100/60 p-2">
                    <img
                      src={toHttps(webinar.poster)}
                      alt={`${webinar.title} poster`}
                      className="max-h-full max-w-full w-auto h-auto object-contain rounded-xl shadow-xs transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>

                  {/* Card Content Body */}
                  <div className="flex flex-1 flex-col pt-4">
                    {/* Date & Time Chips */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600 mb-3">
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 px-3 py-1.5 text-xs font-extrabold text-[#8E1387]">
                        <Calendar className="h-3.5 w-3.5" />
                        {displayDate(webinar.date)}
                      </span>
                      {webinar.time && (
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-extrabold text-slate-700">
                          <Clock3 className="h-3.5 w-3.5 text-slate-500" />
                          {webinar.time}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug group-hover:text-[#8E1387] transition line-clamp-2">
                      {webinar.title}
                    </h3>

                    {/* Description Snippet */}
                    <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {webinar.description}
                    </p>

                    {/* Mentor Info Box */}
                    <div className="mt-4 flex items-center gap-3 rounded-2xl bg-purple-50/50 p-3 border border-purple-100/70">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8E1387] to-[#B11FA8] text-sm font-black text-white shadow-xs">
                        {webinar.mentor?.[0]?.toUpperCase() || "M"}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-extrabold text-slate-900 truncate">{webinar.mentor}</p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {webinar.mentorRole || "Industry Expert"}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2.5 mt-auto">
                      <button
                        disabled={!webinar.isRegistrationOpen}
                        onClick={(e) => {
                          e.stopPropagation();
                          openRegistration(webinar);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8E1387] to-[#B11FA8] py-2.5 px-4 text-xs font-extrabold text-white shadow-md shadow-purple-500/20 transition-all hover:scale-[1.02] hover:from-[#780e72] hover:to-[#9c1893] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                      >
                        {webinar.isRegistrationOpen ? (
                          <>
                            Register Free <ArrowRight className="h-3.5 w-3.5" />
                          </>
                        ) : (
                          "Registration Closed"
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetails(webinar);
                        }}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-purple-50 hover:border-purple-200 hover:text-[#8E1387] transition"
                        title="View Full Details"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS (4-Step Timeline)
      ══════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-white border-y border-purple-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-[#8E1387] border border-purple-200 text-xs font-bold uppercase tracking-wider mb-3">
              <Compass className="h-3.5 w-3.5 text-[#B11FA8]" />
              Seamless Experience
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              How Live Webinars Work
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2">
              Four simple steps from registration to hands-on skill building & career readiness.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Register for Free",
                desc: "Fill in your basic details. No credit card or registration fee required.",
                icon: Laptop,
                color: "bg-purple-100 text-[#8E1387]",
              },
              {
                step: "02",
                title: "Get WhatsApp Link",
                desc: "Receive the direct session link, reminder alerts, and syllabus instantly.",
                icon: MessageCircle,
                color: "bg-emerald-100 text-emerald-800",
              },
              {
                step: "03",
                title: "Attend & Code Live",
                desc: "Build real projects alongside mentors with live doubt resolution & Q&A.",
                icon: Zap,
                color: "bg-amber-100 text-amber-800",
              },
              {
                step: "04",
                title: "Career Roadmap & Code",
                desc: "Access full project source code, interview cheat sheets, and expert career guidance.",
                icon: BookOpen,
                color: "bg-blue-100 text-blue-800",
              },
            ].map(({ step, title, desc, icon: Icon, color }) => (
              <div
                key={step}
                className="relative rounded-3xl border border-slate-200/80 bg-[#FAF8FC] p-6 shadow-xs transition-all duration-300 hover:border-purple-300 hover:bg-white hover:shadow-lg hover:shadow-purple-500/5"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-slate-300 tracking-wider font-mono">
                    {step}
                  </span>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-base font-extrabold text-slate-900">{title}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHY ATTEND ZINT WEBINARS
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-b from-[#FAF8FC] to-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a51fb5]">
              Built for your career
            </p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Why Attend Zint Masterclasses?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-500">
              Designed to deliver maximum practical value and real industry readiness.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [
                "100% Live & Hands-on",
                "Interact with expert instructors live, get doubts cleared, and code alongside industry leaders.",
                Sparkles,
                "text-purple-600 bg-purple-50",
              ],
              [
                "Real Industry Projects",
                "Build production-grade applications live and add tangible projects directly to your resume.",
                Laptop,
                "text-emerald-600 bg-emerald-50",
              ],
              [
                "Free Code & Resources",
                "Access source code, lecture slides, cheat sheets, and curated interview preparation kits.",
                CheckCircle2,
                "text-pink-600 bg-pink-50",
              ],
              [
                "Placement Strategies",
                "Get insider advice on high-paying tech jobs, campus recruitment, and interview roadmaps.",
                UserCheck,
                "text-amber-600 bg-amber-50",
              ],
            ].map(([title, text, Icon, theme]) => (
              <div
                key={title}
                className="group rounded-3xl border border-purple-100/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/10"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${theme} shadow-xs transition group-hover:scale-110`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">{title}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          INTERACTIVE FAQS SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#8c179f]">
            <HelpCircle className="h-3.5 w-3.5 text-[#B11FA8]" />
            Got Questions?
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Everything you need to know about Zint Live Webinars and Masterclasses.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={faq.question}
                className={`overflow-hidden rounded-2xl border transition-all ${
                  isOpen
                    ? "border-purple-300 bg-purple-50/40 shadow-sm"
                    : "border-slate-200 bg-white hover:border-purple-200"
                }`}
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-extrabold text-slate-900 transition"
                >
                  <span>{faq.question}</span>
                  <div
                    className={`ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                      isOpen ? "bg-purple-200 text-[#8E1387] rotate-180" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 pt-0 sm:px-5">
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          DETAILS MODAL
      ══════════════════════════════════════════════════════ */}
      {detailOpen && selectedWebinar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="relative w-full max-h-[420px] bg-gradient-to-b from-[#faf5fc] to-[#f4eaf7] flex items-center justify-center p-4 overflow-hidden border-b border-purple-100">
              <img
                src={toHttps(selectedWebinar.poster)}
                alt={selectedWebinar.title}
                className="max-h-[360px] max-w-full w-auto h-auto object-contain rounded-2xl shadow-md"
              />
              <button
                onClick={() => setDetailOpen(false)}
                className="absolute right-4 top-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition shadow-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {/* Chips */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-1 text-xs font-bold text-[#8E1387]">
                  <Calendar className="h-3.5 w-3.5" />
                  {displayDate(selectedWebinar.date)}
                </span>
                {selectedWebinar.time && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    <Clock3 className="h-3.5 w-3.5" />
                    {selectedWebinar.time}
                  </span>
                )}
                {selectedWebinar.category && (
                  <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                    {selectedWebinar.category}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {selectedWebinar.title}
              </h2>

              {/* Mentor Row */}
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#8E1387] to-[#B11FA8] text-sm font-black text-white">
                  {selectedWebinar.mentor?.[0]?.toUpperCase() || "M"}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-900">{selectedWebinar.mentor}</p>
                  <p className="text-xs text-slate-500">
                    {selectedWebinar.mentorRole || "Senior Industry Expert"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                  Session Overview
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {selectedWebinar.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex items-center gap-3 pt-5 border-t border-slate-100">
                <button
                  disabled={!selectedWebinar.isRegistrationOpen}
                  onClick={() => openRegistration(selectedWebinar)}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-[#8E1387] to-[#B11FA8] py-3.5 text-sm font-extrabold text-white shadow-lg shadow-purple-500/20 hover:scale-[1.01] transition disabled:opacity-50"
                >
                  {selectedWebinar.isRegistrationOpen ? "Register For Free Seat" : "Registration Closed"}
                </button>
                <button
                  onClick={() => setDetailOpen(false)}
                  className="rounded-2xl border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          REGISTRATION MODAL
      ══════════════════════════════════════════════════════ */}
      {modalOpen && selectedWebinar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#5a0b67] via-[#8E1387] to-[#B11FA8] p-6 text-white relative">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute right-4 top-4 rounded-full bg-white/15 p-2 text-white hover:bg-white/25 transition"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white backdrop-blur">
                <Sparkles className="h-3 w-3 text-emerald-300" />
                100% Free Live Seat
              </div>
              <h2 className="mt-2.5 text-xl sm:text-2xl font-black leading-snug line-clamp-2">
                {selectedWebinar.title}
              </h2>
              <p className="mt-2 text-xs font-semibold text-purple-200">
                📅 {displayDate(selectedWebinar.date)} · ⏰ {selectedWebinar.time}
              </p>
            </div>

            {/* Form or Result */}
            {result?.success ? (
              <div className="p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="mt-4 text-2xl font-black text-slate-900">You are registered! 🎉</h2>
                <p className="mt-2 text-sm text-slate-600">{result.text}</p>
                <div className="mt-4 rounded-2xl bg-emerald-50/70 p-3 text-xs text-emerald-800 border border-emerald-200">
                  {result.whatsAppSent
                    ? "✅ A confirmation message has been sent to your WhatsApp number."
                    : "📱 Your registration is recorded. The session link will be sent to your WhatsApp before the webinar."}
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="mt-6 w-full rounded-xl bg-[#8E1387] py-3 text-sm font-bold text-white hover:bg-[#780e72] transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={register} className="grid gap-3.5 p-6 sm:grid-cols-2">
                <Field label="Full Name">
                  <input
                    required
                    name="fullName"
                    value={form.fullName}
                    onChange={update}
                    placeholder="e.g. Rahul Sharma"
                    className={inputStyle}
                  />
                </Field>

                <Field label="WhatsApp Number">
                  <input
                    required
                    name="phone"
                    value={form.phone}
                    onChange={update}
                    placeholder="+91 98765 43210"
                    className={inputStyle}
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Email Address">
                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={update}
                      placeholder="you@example.com"
                      className={inputStyle}
                    />
                  </Field>
                </div>

                <Field label="Current Status">
                  <select name="status" value={form.status} onChange={update} className={inputStyle}>
                    <option>Student</option>
                    <option>Fresher</option>
                    <option>Working Professional</option>
                  </select>
                </Field>

                <Field label="Primary Interest">
                  <select
                    name="interest"
                    value={form.interest}
                    onChange={update}
                    className={inputStyle}
                  >
                    <option>Full Stack Web Development</option>
                    <option>Python & AI / Data Science</option>
                    <option>Cyber Security</option>
                    <option>Placement & Interview Prep</option>
                  </select>
                </Field>

                {result && (
                  <p className="sm:col-span-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
                    {result.text}
                  </p>
                )}

                <button
                  disabled={submitting}
                  className="sm:col-span-2 mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#8E1387] to-[#B11FA8] py-3.5 text-sm font-extrabold text-white shadow-lg shadow-purple-500/25 transition hover:scale-[1.01] hover:from-[#780e72] hover:to-[#9c1893] disabled:opacity-60"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Securing Your Free Seat...
                    </span>
                  ) : (
                    <>
                      Confirm Free Registration <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <p className="sm:col-span-2 text-center text-[11px] text-slate-400">
                  🔒 Zero spam. Webinar joining link and reminders will be sent to your WhatsApp.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
