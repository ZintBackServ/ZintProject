import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  Briefcase, 
  Star,
  Award,
  CheckCircle2,
  TrendingUp,
  Zap,
  Clock,
  Code,
  Users
} from "lucide-react";
import { lazy, Suspense } from "react";
import ImageSlider from "../components/HomeImageSlider";
import LatestUpdates from "../components/LatestUpdates";
import CourseSlider from "./trendingCourseSlider";
import Antigravity from "./Antigravity";
import { usePageMeta } from "../hooks/usePageMeta";
import CardSpread from "../components/CardSpread";

// Lazy-loaded below-the-fold components (code split to improve FCP/LCP)
const CompanyLogo           = lazy(() => import("../components/CompanyLogoSlider"));
const PlacedStudentsSlider  = lazy(() => import("../components/PlacedStudentSlider"));
const VideoLectures         = lazy(() => import("../components/VideoLectures"));
const Location              = lazy(() => import("../components/Location"));
const Reviews               = lazy(() => import("../components/Reviews"));
const ContactUS             = lazy(() => import("../components/ContactUS"));
const FAQ                   = lazy(() => import("../components/FAQ"));
const Mentor                = lazy(() => import("./Mentor"));

// Brand Identity Palette
const BRAND = {
  darkPurple: "#160321",
  deepViolet: "#28073b",
  primaryMagenta: "#B11FA8",
  brightPurple: "#C026D3",
  cyanBlue: "#53BFEA",
  emeraldGreen: "#45B51D",
};

// Hero Content Slides
const heroSlides = [
  {
    badge: "Admissions Open 2025–26",
    badgeIcon: Sparkles,
    badgeColor: BRAND.cyanBlue,
    headlinePrefix: "Transform Your Career With ",
    headlineGradient: "Industry-Ready Tech Skills.",
    subtext: "Master Full-Stack Development, AI, Cloud Computing, Data Science, Tally & Stenography. Gain hands-on project experience guided by top engineering mentors.",
    ctaPrimary: "Enroll Now",
    ctaPrimaryLink: "/Admission",
    ctaSecondary: "Explore Courses",
    ctaSecondaryLink: "/Courses",
    highlightText: "100% Placement Assistance"
  },
  {
    badge: "Workshops & Masterclasses",
    badgeIcon: Zap,
    badgeColor: BRAND.primaryMagenta,
    headlinePrefix: "Join Live Tech Seminars, ",
    headlineGradient: "Bootcamps & Hackathons.",
    subtext: "Participate in hands-on coding workshops led by veteran industry architects. Network with tech leaders and earn verified skill certifications.",
    ctaPrimary: "View Upcoming Events",
    ctaPrimaryLink: "/Events",
    ctaSecondary: "Apply Scholarship",
    ctaSecondaryLink: "/Admission",
    highlightText: "Industry Certified Mentors"
  },
  {
    badge: "100% Placement Record",
    badgeIcon: TrendingUp,
    badgeColor: BRAND.emeraldGreen,
    headlinePrefix: "From Classroom to ",
    headlineGradient: "Top IT & MNC Careers.",
    subtext: "Work on live enterprise-grade projects that simulate real work environments. Get 1-on-1 resume reviews, mock technical interviews, and direct hiring referrals.",
    ctaPrimary: "View Placed Students",
    ctaPrimaryLink: "/About",
    ctaSecondary: "Explore Programs",
    ctaSecondaryLink: "/Courses",
    highlightText: "50+ Hiring Partners"
  },
];

// Why Choose Us Pillars for Compact Bento
const whyChoosePillars = [
  {
    icon: Award,
    badge: "CAREER FIRST",
    title: "100% Placement Support",
    desc: "Resume prep, mock interviews & 50+ recruiting partners.",
    color: "#B11FA8",
    badgeBg: "bg-purple-950/80 border-purple-500/40 text-pink-300",
  },
  {
    icon: Clock,
    badge: "SELF-PACED",
    title: "Flexible Batches",
    desc: "Morning, evening & weekend batches for all learners.",
    color: "#53BFEA",
    badgeBg: "bg-cyan-950/80 border-cyan-500/40 text-cyan-300",
  },
  {
    icon: Users,
    badge: "INDUSTRY PROS",
    title: "Expert Mentors",
    desc: "Learn from senior engineers with 10+ years field exp.",
    color: "#45B51D",
    badgeBg: "bg-emerald-950/80 border-emerald-500/40 text-emerald-300",
  },
  {
    icon: Code,
    badge: "HANDS-ON",
    title: "Practical Learning",
    desc: "Live enterprise projects, Git workflows & capstones.",
    color: "#EAB308",
    badgeBg: "bg-amber-950/80 border-amber-500/40 text-amber-300",
  },
];

// Quick Stats Counter
const quickStats = [
  { icon: GraduationCap, label: "Students Trained", value: "10,000+", color: BRAND.cyanBlue },
  { icon: Briefcase, label: "Placement Rate", value: "95%+", color: BRAND.primaryMagenta },
  { icon: Award, label: "Certified Programs", value: "50+", color: BRAND.emeraldGreen },
  { icon: Star, label: "Google Rating", value: "4.9 / 5.0", color: "#FBBF24" },
];

function Home() {
  usePageMeta(
    "Home",
    "Zint Computer Education Institute, Gwalior — ISO 9001:2015 Certified. Courses in Software, Hardware, Networking, AI, Tally & more. 100% Placement Support."
  );
  
  const [heroIndex, setHeroIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  // Auto-advance hero slides with pause-on-hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Fetch latest 5 events for the Events card
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/event/allEvent`);
        const data = await res.json();

        if (res.ok && Array.isArray(data.events)) {
          const startOfToday = new Date();
          startOfToday.setHours(0, 0, 0, 0);

          const upcomingFive = data.events
            .filter((e) => e.date && new Date(e.date) >= startOfToday)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5);
          setEvents(upcomingFive);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.log("Failed to fetch events:", error);
        setEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const prevSlide = () => setHeroIndex((i) => (i - 1 + heroSlides.length) % heroSlides.length);
  const nextSlide = () => setHeroIndex((i) => (i + 1) % heroSlides.length);
  const currentSlide = heroSlides[heroIndex];
  const BadgeIcon = currentSlide.badgeIcon;

  return (
    <div className="w-full overflow-x-hidden bg-[#0a020f] text-slate-100 font-sans selection:bg-[#B11FA8] selection:text-white">
      
      {/* Top Banner & Sliders */}
      <ImageSlider />
      <LatestUpdates />
      <CourseSlider />
      <Suspense fallback={<div className="h-40" />}>
        <PlacedStudentsSlider />
        <VideoLectures />
      </Suspense>

      {/* ========================================================================= */}
      {/* WHY ZINT PILLARS - INTERACTIVE CARD SPREAD SECTION (COMPACT)              */}
      {/* ========================================================================= */}
      <section className="relative mx-auto w-full max-w-7xl px-4 pt-8 pb-3 sm:px-6 lg:px-8 text-center">
        {/* Background ambient lighting */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[240px] w-[450px] rounded-full bg-[#B11FA8]/12 blur-[90px]" />

        {/* Section Header Tag */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-950/50 px-3 py-0.5 backdrop-blur-md shadow-md shadow-purple-950/30 mb-2">
          <Sparkles className="h-3 w-3 text-pink-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">
            Why Choose Zint Education
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight mb-1.5">
          Built on <span className="bg-gradient-to-r from-[#B11FA8] via-fuchsia-400 to-[#53BFEA] bg-clip-text text-transparent">5 Pillars of Excellence</span>
        </h2>

        <p className="text-slate-400 text-xs sm:text-[13px] max-w-md mx-auto mb-2">
          Hover over the deck to explore our verified ecosystem and career support.
        </p>

        {/* Interactive Compact Fanned Deck */}
        <CardSpread spreadDistance={56} maxAngle={13} />
      </section>

      {/* ========================================================================= */}
      {/* COMPACT MODERN HERO + DYNAMIC SIDEBAR SECTION                             */}
      {/* ========================================================================= */}
      <section className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        
        {/* Ambient Background Glows */}
        <div className="pointer-events-none absolute -top-16 left-1/4 -z-10 h-[380px] w-[380px] rounded-full bg-[#B11FA8]/20 blur-[120px]" />
        <div className="pointer-events-none absolute top-1/2 right-8 -z-10 h-[350px] w-[350px] rounded-full bg-[#53BFEA]/15 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-8 -z-10 h-[300px] w-[300px] rounded-full bg-[#45B51D]/12 blur-[110px]" />

        {/* Section Tag Badge */}
        <div className="mb-6 flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/50 px-4 py-1 backdrop-blur-md shadow-lg shadow-purple-950/30">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B11FA8] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#B11FA8]"></span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-200">
              ISO 9001:2015 Certified Premium IT Academy
            </span>
          </div>
        </div>

        {/* Main Balanced 2-Column Grid (Left ~60%, Right ~40%) */}
        <div className="grid gap-5 lg:grid-cols-12 lg:gap-6 items-stretch">

          {/* ==================== LEFT HERO SHOWCASE (7 cols) ==================== */}
          <div 
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="lg:col-span-7 h-full flex flex-col"
          >
            <div 
              className="relative flex flex-col justify-between h-full rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 overflow-hidden border border-white/10 shadow-2xl shadow-purple-950/60 backdrop-blur-2xl transition-all duration-300 hover:border-purple-500/30"
              style={{
                background: "linear-gradient(145deg, rgba(22, 3, 33, 0.96) 0%, rgba(35, 6, 52, 0.98) 50%, rgba(14, 2, 22, 0.98) 100%)"
              }}
            >
              {/* Antigravity floating particles effect */}
              <div className="absolute inset-0 pointer-events-none z-0 opacity-60">
                <Antigravity
                  count={60}
                  magnetRadius={8}
                  particleSize={1.2}
                  lerpSpeed={0.06}
                  color="#B11FA8"
                  autoAnimate={false}
                  fieldStrength={10}
                />
              </div>

              {/* Decorative Subtle Gradient Orb */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-purple-500/20 bg-gradient-to-br from-pink-500/10 to-transparent blur-2xl" />

              {/* Top Content: Badges & Headings */}
              <div className="relative z-10 flex flex-col gap-3.5">
                
                {/* Dynamic Status Badges */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span 
                    className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-slate-950 shadow-md backdrop-blur-md transition-all duration-300"
                    style={{ backgroundColor: currentSlide.badgeColor }}
                  >
                    <BadgeIcon className="h-3 w-3" />
                    {currentSlide.badge}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-200 bg-white/10 border border-white/15 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    {currentSlide.highlightText}
                  </span>
                </div>

                {/* Animated Headline with Gradient */}
                <h1 className="text-2xl sm:text-3.5xl lg:text-[2.65rem] font-black leading-[1.18] sm:leading-[1.14] tracking-tight text-white transition-all duration-300">
                  {currentSlide.headlinePrefix}
                  <span className="bg-gradient-to-r from-[#53BFEA] via-pink-200 to-[#C026D3] bg-clip-text text-transparent">
                    {currentSlide.headlineGradient}
                  </span>
                </h1>

                {/* Concise Paragraph */}
                <p className="text-xs sm:text-sm lg:text-[0.95rem] leading-relaxed text-slate-300 max-w-xl font-normal">
                  {currentSlide.subtext}
                </p>

                {/* Two CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-1.5">
                  <button
                    onClick={() => navigate(currentSlide.ctaPrimaryLink)}
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#B11FA8] to-[#8E1387] px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-purple-900/40 transition-all duration-300 hover:shadow-pink-500/40 hover:scale-[1.03] active:scale-[0.98]"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <span>{currentSlide.ctaPrimary}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>

                  <button
                    onClick={() => navigate(currentSlide.ctaSecondaryLink)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.06] px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/[0.12] hover:border-pink-400/40 active:scale-[0.98]"
                  >
                    <span>{currentSlide.ctaSecondary}</span>
                  </button>
                </div>
              </div>

              {/* Bottom Section: Trust Row & Slide Navigation Controls */}
              <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                {/* Trust Metrics & Student Avatars */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 overflow-hidden">
                    <img width="28" height="28" className="inline-block h-7 w-7 rounded-full ring-2 ring-purple-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Student" />
                    <img width="28" height="28" className="inline-block h-7 w-7 rounded-full ring-2 ring-purple-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Student" />
                    <img width="28" height="28" className="inline-block h-7 w-7 rounded-full ring-2 ring-purple-900 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="Student" />
                    <img width="28" height="28" className="inline-block h-7 w-7 rounded-full ring-2 ring-purple-900 object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" alt="Student" />
                  </div>
                  <div className="text-[11px]">
                    <div className="flex items-center gap-1 font-bold text-white leading-tight">
                      <span className="text-amber-400">★★★★★</span>
                      <span>4.9 / 5.0</span>
                      <span className="text-slate-400 font-normal hidden sm:inline">(1,200+ Reviews)</span>
                    </div>
                    <p className="text-[10px] text-slate-300 leading-tight">
                      <span className="font-semibold text-pink-300">10,000+ Students</span> placed in top IT firms
                    </p>
                  </div>
                </div>

                {/* Slide Indicators & Navigation Arrows */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="flex items-center gap-1.5">
                    {heroSlides.map((slide, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setHeroIndex(idx)}
                        aria-label={`Slide ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === heroIndex
                            ? "w-8 bg-gradient-to-r from-[#B11FA8] to-[#53BFEA] shadow-sm shadow-purple-500/50"
                            : "w-2 bg-white/25 hover:bg-white/50"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={prevSlide}
                      aria-label="Previous slide"
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all hover:bg-[#B11FA8] hover:scale-105 active:scale-95"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={nextSlide}
                      aria-label="Next slide"
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all hover:bg-[#B11FA8] hover:scale-105 active:scale-95"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ==================== RIGHT DYNAMIC SIDEBAR (5 cols) ==================== */}
          <div className="lg:col-span-5 flex flex-col gap-4 justify-between h-full">

            {/* Top: Compact Live Events Card */}
            <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-[#1b0326]/90 via-[#260538]/90 to-[#14021e]/90 p-3.5 sm:p-4 backdrop-blur-xl shadow-lg shadow-purple-950/40 transition-all duration-300 hover:border-purple-500/40">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#53BFEA] opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#53BFEA]"></span>
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#53BFEA]">
                    Live Events &amp; Workshops
                  </p>
                </div>
                <button 
                  onClick={() => navigate(`/Events`)}
                  className="text-[11px] font-semibold text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-0.5"
                >
                  View All <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              {eventsLoading ? (
                <div className="h-9 animate-pulse rounded-xl bg-white/5" />
              ) : events.length === 0 ? (
                <div className="rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2 truncate">
                    <span>🚀</span>
                    <span className="truncate text-[11px] sm:text-xs">Upcoming workshops announced weekly</span>
                  </div>
                  <button
                    onClick={() => navigate(`/Events`)}
                    className="shrink-0 text-[10px] font-bold text-pink-300 bg-pink-950/80 border border-pink-500/30 px-2.5 py-0.5 rounded-full hover:bg-pink-900 transition-colors"
                  >
                    Calendar
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {events.slice(0, 2).map((event) => (
                    <div
                      key={event._id}
                      onClick={() => navigate(`/Events`)}
                      className="group flex items-center justify-between gap-2 rounded-xl bg-white/[0.05] border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-200 cursor-pointer transition-all duration-200 hover:bg-[#B11FA8]/20 hover:border-[#B11FA8]/50"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#B11FA8] group-hover:bg-[#53BFEA] transition-colors" />
                        <span className="truncate font-semibold text-slate-200 group-hover:text-white text-xs">{event.name}</span>
                      </div>
                      <span className="shrink-0 text-[9px] font-bold text-pink-300 bg-pink-950/80 border border-pink-500/30 px-2 py-0.5 rounded-full">
                        Register
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom: Why Choose Us - Compact 2x2 Bento Grid (Fully Visible & Aligned) */}
            <div className="flex-1 rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-[#14021e]/95 via-[#220533]/95 to-[#0f0117]/95 p-3.5 sm:p-4 backdrop-blur-xl shadow-xl shadow-purple-950/50 flex flex-col justify-between">
              
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#B11FA8]" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-300">
                    Why Choose Us
                  </p>
                </div>
                <span className="text-[10px] font-medium text-slate-400 hidden sm:inline">
                  Empowering Your Tech Journey
                </span>
              </div>

              {/* 2x2 Grid with zero clipping */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {whyChoosePillars.map((pillar, idx) => {
                  const PillarIcon = pillar.icon;
                  return (
                    <div
                      key={idx}
                      className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 sm:p-3 transition-all duration-300 hover:bg-white/[0.08] hover:border-purple-500/40 hover:-translate-y-0.5 shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div 
                            className="flex h-7 w-7 items-center justify-center rounded-lg shadow-inner transition-transform group-hover:scale-110"
                            style={{ backgroundColor: `${pillar.color}25`, border: `1px solid ${pillar.color}45` }}
                          >
                            <PillarIcon className="h-3.5 w-3.5" style={{ color: pillar.color }} />
                          </div>
                          <span className={`text-[8px] sm:text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full border ${pillar.badgeBg}`}>
                            {pillar.badge}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white leading-snug group-hover:text-purple-200 transition-colors">
                          {pillar.title}
                        </h4>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight mt-1 line-clamp-2">
                        {pillar.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </div>

        {/* ==================== QUICK STATS STRIP ==================== */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {quickStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.08] hover:border-purple-500/30 hover:scale-[1.02] shadow-lg shadow-black/40"
              >
                <div className="flex items-center gap-3.5">
                  <div 
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 shadow-inner"
                    style={{ backgroundColor: `${stat.color}20`, border: `1px solid ${stat.color}40` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: stat.color }} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white transition-all">
                      {stat.value}
                    </h2>
                    <p className="text-xs font-medium text-slate-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* Rest of the Homepage Sections */}
      <Suspense fallback={<div className="h-40" />}>
        <CompanyLogo />
        <Reviews />
        <Mentor />
        <FAQ />
        <Location />
        <ContactUS />
      </Suspense>
    </div>
  );
}

export default Home;