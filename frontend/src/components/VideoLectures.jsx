import React from "react";
import { FiPlayCircle, FiClock, FiTv, FiVideo } from "react-icons/fi";

const DEFAULT_LECTURES = [
  {
    id: "1",
    title: "Learn - Full Stack Development",
    category: "Web Development",
    duration: "6 Mins",
    embedUrl: "https://www.youtube-nocookie.com/embed/KBdCZZ1aH38?si=ZQLGTlOqnYOT_FAT",
    description: "Step-by-step introduction to modern frontend & backend architectures with practical examples.",
  },
  {
    id: "2",
    title: "Learn Python from Scratch",
    category: "AI & Data Science",
    duration: "3 Mins",
    embedUrl: "https://www.youtube-nocookie.com/embed/WRk-luEy_TA?si=3dgqJ7PDz05kVDna",
    description: "Discover real-world applications of AI, Machine Learning, and prompt engineering in industry.",
  },
  {
    id: "3",
    title: "Learn SQL | from basic to advance",
    category: "Language",
    duration: "5 Mins",
    embedUrl: "https://www.youtube-nocookie.com/embed/P0AXehrnNNM?si=KgvhUrwhYNyD5paQ",
    description: "Learn fundamental programming concepts, loops, memory management, and problem-solving with C.",
  }
];

function VideoLectures({ lectures = DEFAULT_LECTURES }) {
  return (
    <section className="w-full py-12 sm:py-16 bg-gradient-to-b from-white via-pink-50/30 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/80 text-pink-700 text-xs sm:text-sm font-semibold mb-4 border border-pink-200 shadow-sm">
            <FiVideo className="text-pink-600 animate-pulse" />
            <span>Free Demo Lectures</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
            Experience Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">Video Lectures</span>
          </h2>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Watch sample classes by industry expert mentors at ZINT Institute. Learn practical skills, build real projects, and upgrade your career.
          </p>
        </div>

        {/* ── Responsive Video Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {lectures.map((lecture) => (
            <div
              key={lecture.id}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* ── 16:9 Responsive Video Iframe ── */}
              <div className="relative w-full aspect-video bg-black overflow-hidden shadow-inner">
                <iframe
                  className="w-full h-full border-0"
                  src={lecture.embedUrl}
                  title={lecture.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>

              {/* ── Video Metadata & Details ── */}
              <div className="p-5 flex flex-col flex-1 gap-3 justify-between">
                <div>
                  {/* Category & Duration Pill */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-md border border-pink-100">
                      {lecture.category}
                    </span>
                    {lecture.duration && (
                      <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                        <FiClock className="text-pink-500" />
                        {lecture.duration}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-extrabold text-gray-900 leading-snug group-hover:text-pink-600 transition-colors line-clamp-2">
                    {lecture.title}
                  </h3>

                  {/* Description */}
                  {lecture.description && (
                    <p className="text-xs text-gray-500 leading-relaxed mt-2 line-clamp-2">
                      {lecture.description}
                    </p>
                  )}
                </div>

                {/* Card Footer Badge */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto text-xs font-semibold text-gray-700">
                  <span className="flex items-center gap-1.5 text-pink-600">
                    <FiPlayCircle className="text-base" />
                    <span>Watch Online</span>
                  </span>
                  <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                    HD Video
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default VideoLectures;