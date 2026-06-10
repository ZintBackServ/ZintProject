import { useState } from "react";
import { FiPhone, FiMail, FiMapPin, FiArrowUpRight } from "react-icons/fi";

const contactItems = [
  {
    id: "phone",
    icon: FiPhone,
    label: "Phone",
    value: "8965975222, 8817872737, 9754078816",
  },
  {
    id: "email",
    icon: FiMail,
    label: "Email",
    value: "zintinstitute@gmail.com",
  },
  {
    id: "location",
    icon: FiMapPin,
    label: "Location",
    value:
      "ZINT INSTITUTE NEAR RAILWAY FATAK SAI BABA ROAD & KHEDAPATI ROAD  GWALIOR -474002",
    href: "#map",
  },
];

export default function Location() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="min-h-screen bg-[#f9f8f5] flex items-center px-5 py-16 sm:px-8 lg:px-16">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* ── LEFT: Info ── */}
        <div className="flex flex-col">

          {/* Eyebrow */}
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-violet-500 mb-4">
            Get in touch
          </span>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0f0e17] leading-tight tracking-tight mb-3">
            We{" "}
            <span className="relative inline-block text-fuchsia-500">
              love
              <span className="absolute bottom-1 left-0 w-full h-[5px] rounded-full bg-violet-200 opacity-60" />
            </span>{" "}
            to help you
          </h1>

          {/* Sub */}
          <p className="text-[15px] text-gray-400 font-light leading-relaxed mb-10">
            Explore new and trending free online courses. Reach out anytime — we're happy to help.
          </p>

          {/* Contact Items */}
          <div className="flex flex-col divide-y divide-gray-200 border-t border-gray-200">
            {contactItems.map((item) => {
              const Icon = item.icon;
              const isHovered = hovered === item.id;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onMouseEnter={() => setHovered(item.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="group flex items-start gap-4 py-5 transition-all duration-200 no-underline"
                >
                  {/* Icon pill */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200
                      ${isHovered
                        ? "bg-pink-500 text-white scale-105 shadow-lg shadow-violet-200"
                        : "bg-violet-100 text-pink-500"
                      }`}
                  >
                    <Icon size={18} />
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-0.5 pt-1 flex-1 min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                      {item.label}
                    </span>
                    <span
                      className={`text-[13.5px] leading-snug font-medium transition-colors duration-200 break-words
                        ${isHovered ? "text-violet-500" : "text-gray-600"}`}
                    >
                      {item.value}
                    </span>
                  </div>

                  {/* Arrow */}
                  <FiArrowUpRight
                    size={16}
                    className={`flex-shrink-0 mt-2 transition-all duration-200
                      ${isHovered ? "text-violet-400 translate-x-0.5 -translate-y-0.5" : "text-gray-300"}`}
                  />
                </a>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: Map ── */}
        <div className="relative ">

          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-violet-200 opacity-30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full bg-violet-300 opacity-20 blur-3xl pointer-events-none" />

          {/* Map card */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-violet-100 ring-1 ring-black/5 aspect-[4/3] w-full">

            {/* Floating badge */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-lg text-[12px] font-semibold text-gray-800">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500" />
              </span>
              ZINT Institute
            </div>

            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.4530243343556!2d78.16774307509867!3d26.21446578974916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3976c69c7a4b2c63%3A0x444afa05bee254e7!2sZINT%20INSTITUTE!5e0!3m2!1sen!2sin!4v1779522543218!5m2!1sen!2sin"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
