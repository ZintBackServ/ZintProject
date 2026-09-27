import { useEffect, useRef, useState } from "react";
import { Building2, TrendingUp, DollarSign, Clock } from "lucide-react";

// Top hiring partners with Plus91 first
const COMPANIES = [
  { name: "Plus91", logo: "/logos/plus91.jpeg" },
  { name: "Gwalior Smart City", logo: "/logos/gsc.jpeg" },
  { name: "Airtel", logo: "/logos/airtel.jpeg" },
  { name: "Google Pay", logo: "/logos/gpay.jpeg" },
  { name: "Hyundai", logo: "/logos/hyundai.jpeg" },
  { name: "Maruti Suzuki", logo: "/logos/maruti.jpeg" },
  { name: "Paytm", logo: "/logos/paytm.jpeg" },
  { name: "Tata", logo: "/logos/tata.jpeg" },
  { name: "Google", logo: "/logos/google.jpeg" },
  { name: "LIC", logo: "/logos/lic.jpeg" },
  { name: "Aditya", logo: "/logos/aditya.jpeg" },
  { name: "AES", logo: "/logos/aes.jpeg" },
  { name: "AISECT", logo: "/logos/aisect.jpeg" },
  { name: "Anand", logo: "/logos/anand.jpeg" },
  { name: "Avika", logo: "/logos/avika.jpeg" },
  { name: "Babu G", logo: "/logos/babug.jpeg" },
  { name: "Chambal", logo: "/logos/chambal.jpeg" },
  { name: "CHS", logo: "/logos/chs.jpeg" },
  { name: "Decor", logo: "/logos/decor.jpeg" },
  { name: "Fashion", logo: "/logos/fashion.jpeg" },
  { name: "Galav", logo: "/logos/galav.jpeg" },
  { name: "Gastrovedics", logo: "/logos/gastrovedics.jpeg" },
  { name: "Glen", logo: "/logos/glen.jpeg" },
  { name: "Global", logo: "/logos/global.jpeg" },
  { name: "Glomart", logo: "/logos/glomart.jpeg" },
  { name: "Home", logo: "/logos/home.jpeg" },
  { name: "Hotel", logo: "/logos/hotel.jpeg" },
  { name: "JK", logo: "/logos/jk.jpeg" },
  { name: "Landmark", logo: "/logos/landmark.jpeg" },
  { name: "Parth", logo: "/logos/parth.jpeg" },
  { name: "Shriji", logo: "/logos/shriji.jpeg" },
  { name: "Tanuska", logo: "/logos/tanuska.jpeg" },
  { name: "Partner", logo: "/logos/logo2-10kb.jpeg" },
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
    <div className="flex-none flex items-center justify-center rounded-2xl p-2 w-[120px] sm:w-[140px] h-[60px] sm:h-[68px] bg-white border border-white/20 shadow-md hover:border-[#B11FA8] hover:shadow-xl hover:shadow-purple-900/30 hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
      {!imgErr ? (
        <img
          src={company.logo}
          alt={`${company.name} logo`}
          loading="lazy"
          decoding="async"
          className="max-h-[44px] sm:max-h-[50px] max-w-[105px] sm:max-w-[122px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgErr(true)}
        />
      ) : (
        <span className="text-xs font-bold text-slate-800 group-hover:text-[#B11FA8] transition-colors text-center px-1">
          {company.name}
        </span>
      )}
    </div>
  );
}
