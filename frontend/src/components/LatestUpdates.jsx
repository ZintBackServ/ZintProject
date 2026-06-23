export default function LatestUpdatesSection() {
  const updates = [
    "Recruitment Application for Non Teaching Director Post Exam",
    "National Seminar on Social Media and Human Life",
    "National Seminar on Indian Knowledge System in Geology and Management of Geo-Heritage Sites of Madhya Pradesh",
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16 px-6">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12 lg:gap-20">

        {/* Images — first on mobile, right on desktop */}
        <div className="relative flex items-center justify-center min-h-[320px] w-full md:w-auto order-1 md:order-2 md:flex-1">

          {/* Decorative Rings */}
          <div className="absolute w-[320px] h-[320px] md:w-[400px] md:h-[400px] rounded-full border border-pink-300/40 animate-spin-slow"></div>
          <div className="absolute w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-full border border-pink-200/30 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "25s" }}></div>

          {/* Main Circle */}
          <div className="relative z-20 w-[240px] h-[240px] md:w-[300px] md:h-[300px] rounded-full overflow-hidden border-[8px] border-white shadow-2xl shadow-pink-300/40 hover:scale-105 transition duration-500">
            <img
              src="https://thumbs.dreamstime.com/b/update-businessman-soft-colored-wall-119665390.jpg"
              alt="Update"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Small Floating Circle */}
          <div className="absolute bottom-2 left-4 z-30 w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden border-[6px] border-white shadow-xl shadow-pink-200/50 hover:-translate-y-2 transition duration-500">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwYukIsV2ESXCBKbp-W6hpltybt7Mc6RhJoA&s"
              alt="Person"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Dots */}
          <div className="absolute top-8 right-8 w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-pink-300 opacity-70 blur-sm animate-pulse"></div>
          <div className="absolute bottom-10 right-2 w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 opacity-80"></div>
          <div className="absolute top-1/2 left-0 w-6 h-6 rounded-full bg-pink-300 opacity-75"></div>
          <div className="absolute top-4 left-16 w-4 h-4 rounded-full bg-purple-400 opacity-60"></div>
        </div>

        {/* Content — second on mobile, left on desktop */}
        <div className="w-full md:flex-1 order-2 md:order-1">

          {/* Eyebrow */}
          <span className="inline-flex items-center gap-2 bg-pink-100 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-widest rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            Institute News
          </span>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Latest{" "}
            <span className=" text-pink-600">
              Updates
            </span>
          </h1>

          <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
            Stay informed with the newest announcements, recruitment updates,
            seminars, and academic activities from our institute.
          </p>

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-pink-200/50 rounded-3xl shadow-xl shadow-pink-100/60 p-6 sm:p-8">
            <ul className="space-y-0 divide-y divide-pink-100">
              {updates.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-4 group cursor-pointer py-4 first:pt-0 last:pb-0"
                >
                  {/* Bullet */}
                  <div className="min-w-[10px] h-[10px] mt-2 rounded-full bg-gradient-to-br from-pink-500 to-pink-300 group-hover:scale-125 group-hover:shadow-md group-hover:shadow-pink-300 transition-all duration-300 shrink-0"></div>

                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed group-hover:text-pink-700 transition-colors duration-200">
                    {item}
                  </p>
                </li>
              ))}
            </ul>

            {/* Button */}
            <button className="mt-7 w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-pink-600 text-white font-semibold text-base shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:scale-105 active:scale-95 transition-all duration-300">
              View All Updates
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}