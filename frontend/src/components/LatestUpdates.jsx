export default function LatestUpdatesSection() {
  const updates = [
    "Recruitment Application for Non Teaching Director Post Exam",
    "National Seminar on Social Media and Human Life",
    "National Seminar on Indian Knowledge System in Geology and Management of Geo-Heritage Sites of Madhya Pradesh",
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50 py-20 px-6">
      {/* Background Blur Effects */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-fuchsia-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-sky-300/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left Content */}
        <div>
          {/* Heading */}
          <div className="mb-10">
            {/* <span className="inline-block px-4 py-2 rounded-full bg-fuchsia-100 text-fuchsia-700 text-sm font-semibold tracking-wide mb-4">
              Latest News & Announcements
            </span> */}

            <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
              Latest <span className="text-fuchsia-600">Updates</span>
            </h1>

            <p className="text-gray-600 mt-5 text-lg leading-relaxed max-w-xl">
              Stay informed with the newest announcements, recruitment
              updates, seminars, and academic activities from our institute.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl p-8 hover:shadow-fuchsia-200/50 transition-all duration-500">
            <ul className="space-y-6">
              {updates.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-4 group cursor-pointer"
                >
                  {/* Bullet */}
                  <div className="min-w-[14px] h-[14px] rounded-full mt-2 bg-gradient-to-r from-fuchsia-500 to-sky-400 group-hover:scale-125 transition duration-300"></div>

                  {/* Text */}
                  <p className="text-gray-700 text-lg leading-relaxed group-hover:text-gray-900 transition">
                    {item}
                  </p>
                </li>
              ))}
            </ul>

            {/* Button */}
            <button className="mt-10 w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-sky-500 text-white font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-fuchsia-300 transition-all duration-300">
              View All Updates →
            </button>
          </div>
        </div>

        {/* Right Images Section */}
        <div className="relative flex items-center justify-center min-h-[550px]">
          
          {/* Main Circle Image */}
          <div className="relative z-20">
            <div className="w-[350px] h-[350px] rounded-full overflow-hidden border-[10px] border-white shadow-2xl hover:scale-105 transition duration-500">
              <img
                src="https://thumbs.dreamstime.com/b/update-businessman-soft-colored-wall-119665390.jpg"
                alt="Leader"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Small Floating Image */}
          <div className="absolute bottom-0 left-10 z-30">
            <div className="w-52 h-52 rounded-full overflow-hidden border-[8px] border-white shadow-xl hover:-translate-y-2 transition duration-500">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwYukIsV2ESXCBKbp-W6hpltybt7Mc6RhJoA&s"
                alt="Person"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Floating Gradient Elements */}
          <div className="absolute top-16 right-10 w-20 h-20 rounded-full bg-gradient-to-r from-sky-400 to-fuchsia-500 opacity-70 blur-sm animate-pulse"></div>

          <div className="absolute bottom-12 right-0 w-14 h-14 rounded-full bg-gradient-to-r from-fuchsia-500 to-sky-400 opacity-80"></div>

          <div className="absolute top-1/2 left-0 w-10 h-10 rounded-full bg-green-400 opacity-70"></div>

          {/* Decorative Ring */}
          <div className="absolute w-[420px] h-[420px] rounded-full border border-fuchsia-200 animate-spin-slow"></div>
        </div>
      </div>
    </section>
  );
}