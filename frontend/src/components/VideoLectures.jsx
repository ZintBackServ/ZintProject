import React from "react";
import { PlayCircle, Clock, Video } from "lucide-react";

const DEFAULT_LECTURES = [
  {
    id: "1",
    title: "Master Full Stack Web Development",
    category: "Full-Stack Dev",
    duration: "6 Mins",
    embedUrl: "https://www.youtube-nocookie.com/embed/KBdCZZ1aH38?si=ZQLGTlOqnYOT_FAT",
    description: "Step-by-step introduction to modern frontend & backend architectures with practical live coding examples.",
  },
  {
    id: "2",
    title: "Python & Machine Learning from Scratch",
    category: "AI & Data Science",
    duration: "3 Mins",
    embedUrl: "https://www.youtube-nocookie.com/embed/WRk-luEy_TA?si=3dgqJ7PDz05kVDna",
    description: "Discover real-world applications of AI, Python automation, and prompt engineering used across the industry.",
  },
  {
    id: "3",
    title: "SQL & Relational Database Architecture",
    category: "Database Engineering",
    duration: "5 Mins",
    embedUrl: "https://www.youtube-nocookie.com/embed/P0AXehrnNNM?si=KgvhUrwhYNyD5paQ",
    description: "Learn essential database design, indexing, complex query optimization, and schema design principles.",
  }
];

function VideoLectures({ lectures = DEFAULT_LECTURES }) {
  return (
    <section className="w-full py-10 sm:py-14 bg-gradient-to-b from-white via-purple-50/20 to-white overflow-hidden border-b border-purple-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* ── Section Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#8E1387] border border-purple-200 text-[10px] font-extrabold uppercase tracking-wider mb-2.5 shadow-sm">
            <Video className="h-3 w-3 text-[#B11FA8]" />
            <span>Free Interactive Demo Classes</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-2">
            Preview Our <span className="bg-gradient-to-r from-[#8E1387] to-[#B11FA8] bg-clip-text text-transparent">Classroom Lectures</span>
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-medium">
            Watch sample mentor sessions from Zint Institute. Experience our practical, hands-on teaching methodology before enrolling.
          </p>
        </div>

        {/* ── Responsive Video Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {lectures.map((lecture) => (
            <div
              key={lecture.id}
              className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-purple-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* ── 16:9 Video Frame ── */}
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

              {/* ── Video Metadata ── */}
              <div className="p-4 sm:p-4.5 flex flex-col flex-1 gap-2.5 justify-between">
                <div>
                  {/* Category & Duration Pill */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-extrabold text-[#8E1387] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                      {lecture.category}
                    </span>
                    {lecture.duration && (
                      <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3 text-[#B11FA8]" />
                        {lecture.duration}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-[#8E1387] transition-colors line-clamp-2">
                    {lecture.title}
                  </h3>

                  {/* Description */}
                  {lecture.description && (
                    <p className="text-xs text-slate-500 leading-relaxed mt-1.5 line-clamp-2">
                      {lecture.description}
                    </p>
                  )}
                </div>

                {/* Footer Badge */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto text-xs font-semibold">
                  <span className="flex items-center gap-1 text-[#8E1387] group-hover:text-[#B11FA8] transition-colors text-[11px]">
                    <PlayCircle className="h-3.5 w-3.5" />
                    <span>Watch Online</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    Full HD
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