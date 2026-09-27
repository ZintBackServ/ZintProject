import { useState } from "react";
import { Phone, Mail, MapPin, ArrowUpRight, Clock, Navigation } from "lucide-react";

const contactItems = [
  {
    id: "phone",
    icon: Phone,
    label: "Call Admissions Office",
    lines: ["+91 8965975222", "+91 8817872737", "+91 9754078816"],
    href: "tel:+918965975222",
  },
  {
    id: "email",
    icon: Mail,
    label: "Email Support Desk",
    value: "zintinstitute@gmail.com",
    href: "mailto:zintinstitute@gmail.com",
  },
  {
    id: "location",
    icon: MapPin,
    label: "Campus Address",
    value: "ZINT INSTITUTE, Near Railway Fatak, Sai Baba Road & Khedapati Road, Gwalior (M.P.) - 474002",
    href: "https://maps.google.com/?q=ZINT+INSTITUTE+Gwalior",
  },
];

export default function Location() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="bg-[#FAF9FD] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 border-b border-purple-100/60">
      <div className="w-full max-w-7xl mx-auto">

        {/* ── Section Header ── */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-200 bg-purple-50 text-xs font-bold uppercase tracking-wider text-[#8E1387] mb-3 shadow-sm">
            <Navigation className="h-3.5 w-3.5 text-[#B11FA8]" />
            Visit Our Institute
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight tracking-tight">
            We'd Love To{" "}
            <span className="bg-gradient-to-r from-[#8E1387] to-[#B11FA8] bg-clip-text text-transparent">
              Meet You In Person
            </span>
          </h2>

          <p className="text-slate-600 text-sm leading-relaxed mt-1.5 max-w-2xl">
            Walk into our main campus for one-on-one career counseling, lab tours, and batch schedule consultations.
          </p>
        </div>

        {/* ── All 3 Contact Boxes in Single Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
          {contactItems.map((item) => {
            const Icon = item.icon;
            const isHovered = hovered === item.id;

            return (
              <a
                key={item.id}
                href={item.href}
                target={item.id === "location" ? "_blank" : "_self"}
                rel="noreferrer"
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                className="group flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-purple-300 hover:-translate-y-0.5 transition-all duration-300 no-underline"
              >
                {/* Icon */}
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isHovered
                      ? "bg-gradient-to-tr from-[#8E1387] to-[#B11FA8] text-white shadow-md shadow-purple-900/20 scale-105"
                      : "bg-purple-50 text-[#8E1387]"
                  }`}
                >
                  <Icon size={18} />
                </div>

                {/* Details */}
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    {item.label}
                  </span>
                  {item.lines ? (
                    <div className="flex flex-col gap-0.5">
                      {item.lines.map((line, i) => (
                        <span key={i} className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-[#8E1387] transition-colors leading-snug">
                          {line}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-[#8E1387] transition-colors break-words leading-snug">
                      {item.value}
                    </span>
                  )}
                </div>

                {/* Arrow */}
                <ArrowUpRight
                  size={16}
                  className={`shrink-0 mt-0.5 transition-transform duration-300 ${
                    isHovered ? "text-[#8E1387] translate-x-1 -translate-y-1" : "text-slate-300"
                  }`}
                />
              </a>
            );
          })}
        </div>

        {/* Campus Timing Badge */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-purple-50/70 border border-purple-100 rounded-xl px-4 py-2.5 w-fit">
          <Clock className="h-4 w-4 text-[#8E1387]" />
          <span>Open Mon – Sat: 8:00 AM – 8:00 PM | Sun: 9:00 AM – 2:00 PM</span>
        </div>

      </div>
    </section>
  );
}
