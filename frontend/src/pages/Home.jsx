import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageSlider from "../components/HomeImageSlider";
import LatestUpdates from "../components/LatestUpdates";
import CompanyLogo from "../components/CompanyLogoSlider";
import CourseSlider from "./trendingCourseSlider";
import PlacedStudentsSlider from "../components/PlacedStudentSlider";
import Location from "../components/Location";
import Reviews from "../components/Reviews";
import ContactUS from "../components/ContactUS";
import Mentor from "./Mentor";
import MagicBento, { MagicBentoWrapper } from "./MagicBento";
import Antigravity from "./Antigravity";
import { usePageMeta } from "../hooks/usePageMeta";
import VideoLectures from "../components/VideoLectures";


const DarkPurple = "#8E1387";
const PrimaryPurple = "#B11FA8";
const BLUE = "#53BFEA";
const GREEN = "#45B51D";

//  Data 
const hero = [
  [
    "Admissions Open",
    "Build job-ready skills at Zint Institute.",
    "Learn programming, AI, cloud computing, steno, tally, and many other in-demand skills. Gain hands-on experience through practical sessions, real-world assignments, and expert guidance.",
  ],
  [
    "Upcoming Events",
    "Join workshops, seminars, and scholarship offers.",
    "Participate in interactive workshops led by experienced trainers and industry professionals. Attend career seminars, skill-development sessions, and scholarship programs designed to support your journey.",
  ],
  [
    "Placement Focus",
    "Training that moves students toward real careers.",
    "Work on practical projects that simulate real industry challenges. Receive interview preparation, resume-building support, and career mentoring from experienced professionals.",
  ],
];

const whyUs = [
  { title: "100% Placement Support", desc: "Resume help, mock interviews, and interview guidance." },
  { title: "Flexible Batches", desc: "Morning, evening, and weekend batch options." },
  { title: "Expert Mentors", desc: "Industry professionals with real-world experience." },
  { title: "Practical Learning", desc: "Project-based curriculum with live assignments." },
];

// Home 
function Home() {
  usePageMeta(
    "Home",
    "Zint Computer Education Institute, Gwalior — ISO 9001:2015 Certified. Courses in Software, Hardware, Networking, AI, Tally & more. 100% Placement Support."
  );
  const [heroIndex, setHeroIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex((i) => (i + 1) % hero.length), 5000);
    return () => clearInterval(timer);
  }, []);

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
            .filter((e) => e.date && new Date(e.date) >= startOfToday) // keep today + future, drop past days
            .sort((a, b) => new Date(a.date) - new Date(b.date)) // soonest first
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

  const prev = () => setHeroIndex((i) => (i - 1 + hero.length) % hero.length);
  const next = () => setHeroIndex((i) => (i + 1) % hero.length);

  return (
    <div className="w-full overflow-x-hidden">

      <ImageSlider />
      <LatestUpdates />
      <CourseSlider />
      <PlacedStudentsSlider />
      <VideoLectures />


      {/* HERO + SIDEBAR */}

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:gap-8">

          {/* Hero Card with MagicBento Effects & Antigravity */}
          <MagicBentoWrapper
            className="flex min-h-[420px] flex-col justify-between rounded-3xl p-6 text-white shadow-2xl shadow-purple-900/60 sm:min-h-[460px] sm:rounded-[36px] sm:p-8 lg:min-h-[500px] lg:p-10 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(15, 3, 24, 0.97) 0%, rgba(20, 4, 32, 1) 50%, rgba(10, 5, 20, 1) 100%)" }}
            enableStars={false}
            enableSpotlight
            enableBorderGlow
            glowColor="168, 85, 247"
            spotlightRadius={400}
          >
            {/* Antigravity floating particles effect */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <Antigravity
                count={80}
                magnetRadius={8}
                particleSize={1.2}
                lerpSpeed={0.06}
                color="#A855F7"
                autoAnimate={false}
                fieldStrength={10}
              />
            </div>

            {/* Top content — grows to fill space */}
            <div className="flex flex-col gap-4 relative z-10">
              {/* Badge */}
              <span className="inline-flex w-fit rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-black backdrop-blur-sm sm:text-sm" style={{ backgroundColor: `${BLUE}` }}>
                {hero[heroIndex][0]}
              </span>

              {/* Headline */}
              <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl xl:text-5xl ">
                {hero[heroIndex][1]}
              </h1>

              {/* Body — clamp lines so it doesn't push buttons off on small screens */}
              <p className="line-clamp-4 text-sm leading-7 text-white sm:line-clamp-none sm:text-base lg:text-lg">
                {hero[heroIndex][2]}
              </p>
            </div>

            {/* Bottom — CTAs + dots + arrows — always pinned to bottom */}
            <div className="mt-6 flex flex-col gap-4 relative z-10">

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(`/Courses`)}
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-pink-700 shadow-md transition hover:bg-pink-50 hover:shadow-pink-200 sm:px-6 sm:py-3"
                >
                  Explore Courses
                </button>
                <button
                  onClick={() => navigate(`/Events`)}
                  className="rounded-full border-2 border-white/30 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 sm:px-6 sm:py-3"
                >
                  Upcoming Events
                </button>
              </div>

              {/* Dots + Arrows */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {hero.map((s, i) => (
                    <button
                      key={s[0]}
                      type="button"
                      onClick={() => setHeroIndex(i)}
                      aria-label={`Slide ${i + 1}`}
                      className={`h-2.5 rounded-full transition-all duration-300 ${i === heroIndex
                          ? "w-8 bg-white sm:w-10"
                          : "w-2.5 bg-white/35 hover:bg-white/60"
                        }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous slide"
                    className="rounded-full border border-white/20 bg-white/10 p-2 transition hover:bg-white/20 sm:p-2.5"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next slide"
                    className="rounded-full border border-white/20 bg-white/10 p-2 transition hover:bg-white/20 sm:p-2.5"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </MagicBentoWrapper>

          {/* Sidebar Cards */}
          <div className="flex flex-col gap-5">

            {/* Events Card — compact bullet list with Antigravity */}
            <MagicBentoWrapper
              className="rounded-3xl border border-purple-900/60 p-5 sm:rounded-[32px] sm:p-6 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(15, 3, 24, 0.95) 0%, rgba(26, 5, 41, 0.98) 100%)" }}
              enableStars={false}
              enableSpotlight
              enableBorderGlow
              glowColor="132, 0, 255"
              spotlightRadius={300}
            >
              {/* Antigravity floating particles effect */}
              <div className="absolute inset-0 pointer-events-none z-0">
                <Antigravity
                  count={50}
                  magnetRadius={6}
                  particleSize={1.1}
                  lerpSpeed={0.06}
                  color="#A855F7"
                  autoAnimate={false}
                  fieldStrength={8}
                />
              </div>

              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-pink-400 sm:text-sm">
                  Upcoming Events &amp; Offers
                </p>
                <div className="mt-4 space-y-3">
                  {eventsLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-11 animate-pulse rounded-2xl bg-white/10" />
                    ))
                  ) : events.length === 0 ? (
                    <p className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium text-slate-300 backdrop-blur-sm">
                      No events right now — check back soon.
                    </p>
                  ) : (
                    events.map((event) => (
                      <div
                        key={event._id}
                        onClick={() => navigate(`/Events`)}
                        className="flex items-start gap-3 rounded-2xl bg-white/10 backdrop-blur-md px-4 py-3 text-sm font-semibold text-white shadow-sm cursor-pointer transition hover:bg-purple-600/30 hover:shadow-md"
                      >
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-pink-400" />
                        {event.name}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </MagicBentoWrapper>

            {/* Why Choose Us - MagicBento Grid */}
            <MagicBento 
              textAutoHide={true}
              enableStars={false}
              enableSpotlight
              enableBorderGlow={true}
              enableTilt={false}
              enableMagnetism
              clickEffect
              spotlightRadius={330}
              glowColor="132, 0, 255"
              disableAnimations={false}
            />

          </div>
        </div>
      </section>

      <CompanyLogo />
      <Reviews />
      <Mentor />
      <Location />
      <ContactUS />
    </div>
  );
}

export default Home;