import { useEffect, useRef, useState } from "react";
import { Building2, TrendingUp, DollarSign, Clock } from "lucide-react";

// Top hiring partners
const COMPANIES = [
  { name: "Google",     logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Microsoft",  logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { name: "Amazon",     logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Meta",       logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
  { name: "IBM",        logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
  { name: "Infosys",    logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" },
  { name: "TCS",        logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg" },
  { name: "Wipro",      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg" },
  { name: "HCL",        logo: "https://upload.wikimedia.org/wikipedia/commons/6/68/HCL_Technologies_logo.svg" },
  { name: "Accenture",  logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg" },
  { name: "Deloitte",   logo: "https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg" },
  { name: "Capgemini",  logo: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Capgemini_logo_2021.svg" },
];

export default function CompanyLogoSlider() {
  const mid  = Math.ceil(COMPANIES.length / 2);
  const row1 = COMPANIES.slice(0, mid);
  const row2 = COMPANIES.slice(mid);

  return (
    <section className="py-12 sm:py-16 bg-[#0d0314] relative overflow-hidden text-white border-y border-white/10">
      
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-[#B11FA8]/10 rounded-full blur-[130px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center mb-8 sm:mb-10 relative z-10">
        <span className="inline-block text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#53BFEA] mb-2">
          Our Global Hiring Network
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
          500+ Leading Companies{" "}
          <span className="bg-gradient-to-r from-[#B11FA8] via-pink-400 to-[#53BFEA] bg-clip-text text-transparent">
            Hire Our Students
          </span>
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-lg mx-auto font-medium">
          Our alumni work at Fortune 500 tech leaders, fast-growing startups, and global consultancy giants.
        </p>
      </div>

      {/* Edge Fade Overlay */}
      <div className="relative z-10">
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-10 pointer-events-none bg-gradient-to-r from-[#0d0314] to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-10 pointer-events-none bg-gradient-to-l from-[#0d0314] to-transparent" />

        <div className="space-y-3">
          <ScrollRow companies={row1} direction={1}  speed={0.9} />
          <ScrollRow companies={row2} direction={-1} speed={1.1} />
        </div>
      </div>

      {/* Key Metric Highlights Strip */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 sm:mt-10 relative z-10">
        <div className="rounded-2xl p-4 sm:p-5 grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-xl">
          {[
            { value: "500+",     label: "Partner Companies", icon: Building2, color: "#B11FA8" },
            { value: "98%",      label: "Placement Rate",    icon: TrendingUp, color: "#53BFEA" },
            { value: "₹3.6 LPA", label: "Average Package",   icon: DollarSign, color: "#45B51D" },
            { value: "2 Months", label: "Avg. Time to Hire", icon: Clock,      color: "#FBBF24" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex flex-col items-center text-center group">
                <div 
                  className="h-8 w-8 rounded-lg flex items-center justify-center mb-1.5 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${stat.color}15`, border: `1px solid ${stat.color}35` }}
                >
                  <Icon className="h-4 w-4" style={{ color: stat.color }} />
                </div>
                <p className="text-xl sm:text-2xl font-black text-white">{stat.value}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}

// Auto-scrolling Row Component
function ScrollRow({ companies, direction, speed }) {
  const scrollRef   = useRef(null);
  const intervalRef = useRef(null);

  // Triple array for seamless infinite looping
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
    if (direction < 0 && scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 3;
    }
    startScroll();
    return () => clearInterval(intervalRef.current);
  }, [direction, speed]);

  return (
    <div
      ref={scrollRef}
      onMouseEnter={stopScroll}
      onMouseLeave={startScroll}
      className="flex gap-3 overflow-x-hidden px-2 py-1 cursor-default"
      style={{ scrollbarWidth: "none" }}
    >
      {loopData.map((company, i) => (
        <LogoCard key={`${company.name}-${i}`} company={company} />
      ))}
    </div>
  );
}

function LogoCard({ company }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="flex-none flex flex-col items-center justify-center rounded-xl p-3 w-[110px] sm:w-[130px] h-[55px] sm:h-[65px] bg-white/[0.04] border border-white/10 hover:border-[#B11FA8] hover:bg-[#B11FA8]/10 hover:shadow-lg hover:shadow-purple-900/30 hover:-translate-y-0.5 transition-all duration-300 group">
      {!imgErr ? (
        <img
          src={company.logo}
          alt={`${company.name} logo`}
          loading="lazy"
          decoding="async"
          className="max-h-5 sm:max-h-6 max-w-[85px] object-contain opacity-70 group-hover:opacity-100 brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
          onError={() => setImgErr(true)}
        />
      ) : (
        <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">
          {company.name}
        </span>
      )}
    </div>
  );
}
