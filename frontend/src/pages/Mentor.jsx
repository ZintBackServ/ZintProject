import React, { useEffect, useRef, useState } from "react";
import { toHttps } from "../utils/imgUrl";
import { Award, Briefcase, GraduationCap, Sparkles } from "lucide-react";

const Mentor = () => {
  const [mentors, setMentors] = useState([]);
  const scrollRef = useRef();
  const intervalRef = useRef();

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/mentor/allMentor`);
        if (!res.ok) {
          setMentors([]);
          return;
        }
        const data = await res.json();
        setMentors(Array.isArray(data?.mentors) ? data.mentors : []);
      } catch (err) {
        console.error("Error fetching mentors:", err);
        setMentors([]);
      }
    };

    fetchMentors();
  }, []);

  // Auto scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const startScroll = () => {
      intervalRef.current = setInterval(() => {
        container.scrollLeft += 0.8;
        if (container.scrollLeft >= container.scrollWidth / 3) {
          container.scrollLeft = 0;
        }
      }, 16);
    };

    startScroll();
    return () => clearInterval(intervalRef.current);
  }, [mentors]);

  const stopScroll = () => clearInterval(intervalRef.current);

  const startScrollAgain = () => {
    const container = scrollRef.current;
    if (!container) return;
    intervalRef.current = setInterval(() => {
      container.scrollLeft += 0.8;
      if (container.scrollLeft >= container.scrollWidth / 3) {
        container.scrollLeft = 0;
      }
    }, 16);
  };

  const loopData = Array.isArray(mentors) && mentors.length > 0
    ? [...mentors, ...mentors, ...mentors]
    : [];

  return (
    <section className="py-20 bg-[#09020d] relative overflow-hidden text-white border-b border-white/10">
      
      {/* Background ambient blur */}
      <div className="pointer-events-none absolute top-1/2 left-1/3 w-[500px] h-[300px] bg-[#B11FA8]/15 rounded-full blur-[140px]" />

      {/* ── Section Header ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 relative z-10">
        <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#53BFEA] mb-3">
          World-Class Faculty
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
          Learn Directly From{" "}
          <span className="bg-gradient-to-r from-[#B11FA8] via-pink-400 to-[#53BFEA] bg-clip-text text-transparent">
            Expert Industry Mentors
          </span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-xl mx-auto">
          Experienced software architects, data scientists, and senior engineers dedicated to your technical growth.
        </p>
      </div>

      {/* ── Marquee Row ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Edge Gradient Overlays */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-16 sm:w-28 z-10 bg-gradient-to-r from-[#09020d] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 sm:w-28 z-10 bg-gradient-to-l from-[#09020d] to-transparent" />

        <div
          ref={scrollRef}
          onMouseEnter={stopScroll}
          onMouseLeave={startScrollAgain}
          className="flex gap-6 overflow-x-auto py-4 scrollbar-hide scroll-smooth"
        >
          {loopData.map((item, index) => (
            <div
              key={index}
              className="flex-none w-[240px] sm:w-[280px] rounded-3xl overflow-hidden bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-[#B11FA8] hover:bg-white/[0.08] hover:-translate-y-2 group"
            >
              {/* Top Accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#8E1387] via-[#B11FA8] to-[#53BFEA]" />

              {/* Mentor Image */}
              <div className="relative w-full h-52 overflow-hidden bg-slate-900">
                <img
                  src={toHttps(item.profileImage)}
                  alt={item.mentorName}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"; }}
                />
                
                {/* Experience Pill */}
                {item.experience && (
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/15">
                      <Briefcase className="h-3 w-3 text-[#53BFEA]" />
                      {item.experience}+ Years Exp.
                    </span>
                  </div>
                )}
              </div>

              {/* Mentor Details */}
              <div className="p-5">
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#53BFEA] transition-colors truncate">
                  {item.mentorName}
                </h3>

                {item.expertise && (
                  <p className="text-xs font-semibold text-pink-400 mt-1 flex items-center gap-1 truncate">
                    <Sparkles className="h-3 w-3 shrink-0" />
                    <span className="truncate">{item.expertise}</span>
                  </p>
                )}

                {item.bio && (
                  <p className="text-xs text-slate-400 mt-2.5 line-clamp-3 leading-relaxed">
                    {item.bio}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Mentor;
