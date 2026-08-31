import React, { useState } from "react";
import { ArrowRight, Sparkles, ShieldCheck, Award, Briefcase, Users, Laptop } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * CardSpread Component (Compact & Sleek)
 * ------------------------------------------------
 * A fanned deck of cards with 3D perspective that spreads open on hover.
 */
export default function CardSpread({
  cards = [],
  spreadDistance = 56,
  maxAngle = 13,
  className = "",
  onCardClick,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const navigate = useNavigate();

  // 5 Core Pillars
  const defaultCards = [
    {
      id: "pillar-1",
      tag: "Career Support",
      icon: Briefcase,
      title: "100% Placement Help",
      subtitle: "50+ hiring partners, mock interviews & direct job referrals.",
      color: "from-purple-600 to-indigo-600",
      accent: "#B11FA8",
      stat: "95%+ Placed",
      cta: "Placements",
      link: "/About",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "pillar-2",
      tag: "Accredited",
      icon: Award,
      title: "ISO Certified Certificates",
      subtitle: "ISO 9001:2015 certified qualification, valid across top IT MNCs & tech corporate jobs.",
      color: "from-fuchsia-600 to-pink-600",
      accent: "#E02694",
      stat: "ISO 9001:2015",
      cta: "Verify",
      link: "/About",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "pillar-3",
      tag: "Practical",
      icon: ShieldCheck,
      title: "Live Industry Projects",
      subtitle: "Enterprise workflows with Git versioning & live cloud deployments.",
      color: "from-cyan-600 to-blue-600",
      accent: "#53BFEA",
      stat: "10+ Projects",
      cta: "Syllabus",
      link: "/Courses",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "pillar-4",
      tag: "Mentorship",
      icon: Users,
      title: "1-on-1 Senior Guidance",
      subtitle: "Learn directly from veteran software engineers & specialists.",
      color: "from-emerald-600 to-teal-600",
      accent: "#45B51D",
      stat: "10+ Yrs Exp",
      cta: "Faculty",
      link: "/About",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "pillar-5",
      tag: "Campus",
      icon: Laptop,
      title: "High-Tech Smart Labs",
      subtitle: "AC modern workstations, high-speed fiber & digital classrooms.",
      color: "from-amber-600 to-orange-600",
      accent: "#F59E0B",
      stat: "Modern Labs",
      cta: "Campus",
      link: "/Contact",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=500&q=80",
    },
  ];

  const items = cards.length > 0 ? cards : defaultCards;
  const count = items.length;

  const handleCardClick = (card) => {
    if (onCardClick) {
      onCardClick(card);
    } else if (card.link) {
      navigate(card.link);
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center py-2 select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveCardIndex(null);
      }}
      onTouchStart={() => setIsHovered((prev) => !prev)}
      style={{ perspective: "1000px" }}
    >
      {/* Compact Deck Container */}
      <div className="relative h-[255px] sm:h-[280px] w-[180px] sm:w-[200px] flex items-center justify-center">
        {items.map((card, idx) => {
          const mid = (count - 1) / 2;
          const offset = idx - mid; // e.g. -2, -1, 0, 1, 2

          let rotate = offset * (maxAngle / (mid || 1));
          let translateX = offset * spreadDistance;
          let translateY = Math.abs(offset) * 8;
          let scale = 1;
          let zIndex = idx + 1;

          if (!isHovered) {
            rotate = offset * 7;
            translateX = offset * 10;
            translateY = Math.abs(offset) * 6;
            scale = 1 - Math.abs(offset) * 0.04;
            zIndex = idx + 1;
          } else {
            if (activeCardIndex === idx) {
              scale = 1.05;
              translateY = translateY - 14;
              rotate = 0;
              zIndex = 50;
            }
          }

          const CardIcon = card.icon || Sparkles;

          return (
            <div
              key={card.id || idx}
              onMouseEnter={() => setActiveCardIndex(idx)}
              onMouseLeave={() => setActiveCardIndex(null)}
              onClick={() => handleCardClick(card)}
              style={{
                transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
                zIndex: zIndex,
                transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease",
              }}
              className={`absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 ${
                activeCardIndex === idx
                  ? "border-pink-400 shadow-xl shadow-purple-950/80"
                  : "border-white/20 shadow-lg shadow-black/60"
              } bg-gradient-to-b from-slate-900/95 via-purple-950/90 to-slate-950/95 backdrop-blur-xl group`}
            >
              {/* Background Image with Ambient Gradient Overlay */}
              {card.image && (
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    width="200"
                    height="280"
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                </div>
              )}

              {/* Ambient Top Glow */}
              <div
                className={`absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-br ${card.color || "from-purple-600 to-pink-600"} opacity-30 blur-xl pointer-events-none`}
              />

              {/* Card Content */}
              <div className="relative z-10 flex flex-col justify-between h-full p-3 sm:p-3.5 text-left">
                {/* Top Row: Tag & Badge */}
                <div className="flex items-center justify-between gap-1">
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-pink-300 bg-pink-950/70 border border-pink-500/30 px-2 py-0.5 rounded-full backdrop-blur-md">
                    <CardIcon className="w-2.5 h-2.5 text-pink-400" />
                    {card.tag}
                  </span>

                  {card.stat && (
                    <span className="text-[8px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                      {card.stat}
                    </span>
                  )}
                </div>

                {/* Middle / Bottom Content */}
                <div className="mt-auto space-y-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-white leading-snug group-hover:text-pink-200 transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-[10px] text-slate-300 line-clamp-2 leading-tight font-normal">
                    {card.subtitle}
                  </p>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-pink-400 group-hover:text-white transition-colors flex items-center gap-1">
                      {card.cta || "Explore"}{" "}
                      <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#B11FA8] transition-colors">
                      <ArrowRight className="w-2 h-2 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
