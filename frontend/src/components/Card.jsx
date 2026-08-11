import { useNavigate } from "react-router-dom";
import { toHttps } from "../utils/imgUrl";

function Card({ data }) {
  const navigate = useNavigate();

  if (!data) return null;

  const handleCardClick = () => {
    if (data._id) {
      navigate(`/courses/${data._id}`);
    }
  };


  return (
    <div
      onClick={handleCardClick}
      className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
    >
      {/* ── Image & Badges ── */}
      <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
        <img
          src={toHttps(data.courseImage)}
          alt={data.courseName}
          className="w-full h-full object-full group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        
        {/* Gradient Overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top-Right Mode / Trending Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {data.trending && (
            <span className="bg-purple-500 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
              🔥 Trending
            </span>
          )}
          {data.mode && (
            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
              {data.mode}
            </span>
          )}
        </div>

        {/* Top-Left Rating Badge */}
        {/* <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-gray-900 text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
          <span className="text-amber-400">★</span>
          <span>{data.rating ? Number(data.rating).toFixed(1) : "4.9"}</span>
        </div> */}
      </div>

      {/* ── Card Content ── */}
      <div className="p-5 flex flex-col flex-1 gap-3 justify-between">
        {/* Title */}
        <h3 className="text-gray-900 font-extrabold text-[15px] leading-snug line-clamp-2 group-hover:text-pink-600 transition-colors duration-200">
          {data.courseName}
        </h3>

        {/* Info Pills */}
        <div className="flex flex-wrap gap-1.5">
          {data.duration && (
            <span className="text-[11px] bg-pink-50 text-pink-600 font-medium px-2.5 py-0.5 rounded-md flex items-center gap-1">
              ⏱ {data.duration}
            </span>
          )}
          {data.language && (
            <span className="text-[11px] bg-purple-50 text-purple-600 font-medium px-2.5 py-0.5 rounded-md flex items-center gap-1">
              🗣 {data.language}
            </span>
          )}
        </div>

        {/* Short Description */}
        {data.about && (
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
            {data.about}
          </p>
        )}

        {/* Push Footer to Bottom & Full Width Button */}
        <div className="pt-3 border-t border-gray-100 mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 active:scale-98 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-md shadow-pink-200/50 flex items-center justify-center gap-1.5 group-hover:shadow-pink-300"
          >
            <span>View More</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;



