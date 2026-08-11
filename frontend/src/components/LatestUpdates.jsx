
import React, { useEffect, useState } from "react";
import SpecularButton from "./SpecularButton";

export default function LatestUpdatesSection() {


  const [updates, setUpdates] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/updates/getAllUpdates`);
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        const data = await res.json();
        setUpdates(data.data || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUpdates();
  }, []);

  const openPdf = (url) => setSelectedPdf(url);
  const closePdf = () => setSelectedPdf(null);

  const PRIMARY = "#8E1387";
  const SECONDARY = "#B11FA8";
  const BLUE = "#53BFEA";
  const GREEN = "#45B51D";
  return (
    <section id="latest-updates" className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16 px-6">
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
          <span className="inline-flex items-center gap-2 bg-purple-100 border border-pink-200  text-xs font-bold uppercase tracking-widest rounded-full px-4 py-1.5 mb-5" style={{ backgroundColor: `${BLUE}` }} >
            <span className="w-2 h-2 rounded-full  animate-pulse" style={{ backgroundColor: `${SECONDARY}` }}></span>
            Institute News
          </span>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Latest{" "}
            <span style={{ color: `${PRIMARY}` }}>
              Updates
            </span>
          </h1>

          <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
            Stay informed with the newest announcements, recruitment updates,
            seminars, and academic activities from our institute.
          </p>

          {/* Card */}

          <div className="bg-white/80 backdrop-blur-xl border border-pink-200/50 rounded-3xl shadow-xl shadow-pink-100/60 p-6 sm:p-8">
            {updates.map((item, idx) => (
              <React.Fragment key={item._id}>
                <div
                  className="flex items-center gap-3 py-3.5 cursor-pointer group"
                  onClick={() => openPdf(item.pdf)}
                >
                  <span className="w-2 h-2 rounded-full bg-pink-500 flex-shrink-0" />
                  <p className="m-0 text-gray-700 text-[15px] group-hover:text-pink-900 transition-colors">
                    {item.heading}
                  </p>
                </div>
                {idx !== updates.length - 1 && (
                  <hr className="border-t border-gray-100 m-0" />
                )}
              </React.Fragment>
            ))}

            <SpecularButton
              size="lg"
              radius={24}
              tint="#ffffff"
              tintOpacity={0}
              blur={0}
              textColor="#ffffff"
              lineColor="#bc05f3"
              baseColor="#8E1387"
              intensity={1}
              shineSize={35}
              shineFade={47}
              thickness={2}
              speed={0.35}
              followMouse
              proximity={300}
              autoAnimate={false}
              className="mt-7 w-full sm:w-auto"
            >
              View All Updates <span className="ml-1">&rarr;</span>
            </SpecularButton>

            {selectedPdf && (
              <div
                className="fixed inset-0 bg-black/55 flex items-center justify-center z-[1000]"
                onClick={closePdf}
              >
                <div
                  className="bg-white w-[90%] max-w-3xl h-[85vh] rounded-lg overflow-hidden flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center px-4 py-2.5 border-b border-gray-200">
                    <a
                      href={selectedPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-900 text-sm font-semibold no-underline"
                    >
                      Open in new tab
                    </a>
                    <button
                      onClick={closePdf}
                      aria-label="Close"
                      className="bg-gray-100 border-none rounded-full w-8 h-8 text-base cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <iframe
                    src={selectedPdf}
                    title="PDF Viewer"
                    className="flex-1 border-none w-full"
                  />
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}