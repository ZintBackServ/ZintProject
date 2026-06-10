import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════
   ZINT COLOR SYSTEM
   #B026B5  Purple  — primary brand
   #38BDF8  Sky     — highlights / hover
   #22C55E  Green   — trust / success
   #111827  Dark    — sections
   #F8FAFC  Off-white — backgrounds
═══════════════════════════════════════════ */

/* ── Company list with logo URLs ── */
const COMPANIES = [
  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { name: "Amazon",  logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
  { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
  { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" },
  { name: "TCS", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg" },
  { name: "Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg" },
  { name: "HCL", logo: "https://upload.wikimedia.org/wikipedia/commons/6/68/HCL_Technologies_logo.svg" },
  { name: "Accenture", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg" },
  { name: "Deloitte", logo: "https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg" },
  { name: "Capgemini", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Capgemini_logo_2021.svg" },
];

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function CompanyLogoSlider() {
  /* Row 1 scrolls left, Row 2 scrolls right */
  const mid    = Math.ceil(COMPANIES.length / 2);
  const row1   = COMPANIES.slice(0, mid);
  const row2   = COMPANIES.slice(mid);

  return (
    <section className="py-16 overflow-hidden" style={{ background: "#111827" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-10">
        {/* section label */}
        <p className="text-xs text-fuchsia-200 font-bold uppercase tracking-widest mb-2">
          Our Hiring Partners
        </p>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          500+ Companies{" "}
          <span style={{
            background: "linear-gradient(90deg, #B026B5, #38BDF8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Trust Our Students
          </span>
        </h2>
        <p className="text-gray-400 text-sm mt-2 max-w-lg mx-auto">
          Our graduates are working at the world's leading technology and consulting firms.
        </p>
      </div>

      {/* ── edge fade masks ── */}
      <div className="relative">
        {/* left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #111827, transparent)" }} />
        {/* right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #111827, transparent)" }} />

        <div className="space-y-5">
          <ScrollRow companies={row1} direction={1} speed={1} />
          <ScrollRow companies={row2} direction={-1} speed={1.2} />
        </div>
      </div>

      {/* bottom trust strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        <div className="rounded-2xl px-6 py-5 flex flex-wrap items-center justify-center gap-6 md:gap-10 border"
          style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}>
          {[
            { value: "500+",  label: "Partner Companies",  color: "#B026B5" },
            { value: "98%",   label: "Placement Rate",      color: "#38BDF8" },
            { value: "₹9.5 LPA", label: "Average Package",   color: "#22C55E" },
            { value: "2 Months",  label: "Avg. Time to Hire",   color: "#B026B5" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SCROLL ROW — interval-based, pause on hover
══════════════════════════════════════════════════════ */
function ScrollRow({ companies, direction, speed }) {
  const scrollRef   = useRef(null);
  const intervalRef = useRef(null);

  /* duplicate for seamless infinite loop */
  const loopData = [...companies, ...companies, ...companies];

  const startScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    intervalRef.current = setInterval(() => {
      el.scrollLeft += direction * speed;
      if (direction > 0 && el.scrollLeft >= el.scrollWidth / 3) {
        el.scrollLeft = 0;
      }
      if (direction < 0 && el.scrollLeft <= 0) {
        el.scrollLeft = el.scrollWidth / 3;
      }
    }, 16);
  };

  const stopScroll = () => clearInterval(intervalRef.current);

  useEffect(() => {
    /* set initial position for reverse row */
    if (direction < 0 && scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 3;
    }
    startScroll();
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div
      ref={scrollRef}
      onMouseEnter={stopScroll}
      onMouseLeave={startScroll}
      className="flex gap-4 overflow-x-hidden px-2 py-2 cursor-default"
      style={{ scrollbarWidth: "none" }}
    >
      {loopData.map((company, i) => (
        <LogoCard key={`${company.name}-${i}`} company={company} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   LOGO CARD
══════════════════════════════════════════════════════ */
function LogoCard({ company }) {
  const [hov, setHov]       = useState(false);
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      className="flex-none flex flex-col items-center justify-center gap-2 rounded-2xl transition-all duration-300"
      style={{
        minWidth:    "140px",
        height:      "80px",
        background:  hov ? "rgba(176,38,181,0.10)" : "rgba(255,255,255,0.05)",
        border:      `1px solid ${hov ? "#B026B5" : "rgba(255,255,255,0.08)"}`,
        boxShadow:   hov ? "0 8px 28px rgba(176,38,181,0.2)" : "none",
        transform:   hov ? "translateY(-3px) scale(1.03)" : "translateY(0) scale(1)",
        padding:     "12px 20px",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {!imgErr ? (
        <img
          src={company.logo}
          alt={company.name}
          className="max-h-8 max-w-[100px] object-contain transition-all duration-300"
          style={{ filter: hov ? "brightness(1.1)" : "brightness(0) invert(1)", opacity: hov ? 1 : 0.65 }}
          onError={() => setImgErr(true)}
        />
      ) : (
        /* fallback: company name text */
        <span className="text-sm font-bold tracking-wide transition-all duration-300"
          style={{ color: hov ? "#B026B5" : "#9ca3af" }}>
          {company.name}
        </span>
      )}
    </div>
  );
}
