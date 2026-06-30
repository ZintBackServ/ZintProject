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
import ContactUs from "../components/ContactUs";
import Mentor from "./Mentor";

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

const events = [
  "Free AI seminar – 20 April",
  "Full Stack demo class and scholarship test",
  "Admission offer up to 25% off selected batches",
];

const whyUs = [
  { title: "100% Placement Support", desc: "Resume help, mock interviews, and interview guidance." },
  { title: "Flexible Batches",        desc: "Morning, evening, and weekend batch options." },
  { title: "Expert Mentors",          desc: "Industry professionals with real-world experience." },
  { title: "Practical Learning",      desc: "Project-based curriculum with live assignments." },
];

// Home 
function Home() {
  const [heroIndex, setHeroIndex] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setInterval(() => setHeroIndex((i) => (i + 1) % hero.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setHeroIndex((i) => (i - 1 + hero.length) % hero.length);
  const next = () => setHeroIndex((i) => (i + 1) % hero.length);

  return (
    <div className="w-full overflow-x-hidden">

      <ImageSlider />
      <LatestUpdates />
      <CourseSlider />
      <PlacedStudentsSlider />

    
          {/* HERO + SIDEBAR */}
  
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:gap-8">

          {/* Hero Card  */}
         
          <div className="flex min-h-[420px] flex-col justify-between rounded-3xl bg-pink-600 p-6 text-white shadow-2xl shadow-pink-300/40 sm:min-h-[460px] sm:rounded-[36px] sm:p-8 lg:min-h-[500px] lg:p-10" style={{backgroundColor:`${DarkPurple}`}}>

            {/* Top content — grows to fill space */}
            <div className="flex flex-col gap-4">
              {/* Badge */}
              <span className="inline-flex w-fit rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-black backdrop-blur-sm sm:text-sm" style={{backgroundColor:`${BLUE}`}}>
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
            <div className="mt-6 flex flex-col gap-4">

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
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        i === heroIndex
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
          </div>

          {/* Sidebar Cards */}
          <div className="flex flex-col gap-5">

            {/* Events Card */}
            <div className="rounded-3xl border border-pink-200 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 p-5 transition hover:shadow-xl hover:shadow-pink-100 sm:rounded-[32px] sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-pink-600 sm:text-sm">
                Upcoming Events &amp; Offers
              </p>
              <div className="mt-4 space-y-3">
                {events.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm sm:rounded-2xl"
                  >
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-pink-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Us Card */}
            <div className="rounded-3xl border border-pink-100 bg-white p-5 shadow-[0_20px_50px_rgba(236,72,153,0.07)] transition hover:shadow-[0_20px_50px_rgba(236,72,153,0.15)] sm:rounded-[32px] sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-pink-600 sm:text-sm">
                Why Choose Us
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {whyUs.map(({ title, desc }) => (
                  <div
                    key={title}
                    className="rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 p-4 transition hover:from-pink-100 hover:to-rose-100"
                  >
                    <h3 className="text-sm font-extrabold leading-snug text-slate-800 sm:text-base">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:leading-6">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <CompanyLogo />
      <Reviews />
      <Mentor />
      <Location />
      <ContactUs />
    </div>
  );
}

export default Home;