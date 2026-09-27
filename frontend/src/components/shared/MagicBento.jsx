import React, { useRef, useState, useEffect } from "react";
import { FiAward, FiClock, FiUsers, FiCode, FiCheckCircle } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

/**
 * MagicBento — Sleek, interactive Bento Grid component with modern animations:
 * - Mouse spotlight glow
 * - Dynamic border glow
 * - Canvas star particles
 * - Magnetic hover movement
 * - Click shockwave/ripple effect
 * - Smooth auto-hide text transitions
 */
export default function MagicBento({
  sectionTitle = "Why Choose Us",
  sectionSubtitle = "Empowering Your Tech Journey",
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = false,
  enableMagnetism = true,
  clickEffect = true,
  spotlightRadius = 330,
  particleCount = 12,
  glowColor = "132, 0, 255", // RGB values
  disableAnimations = false,
  items,
}) {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState([]);

  // Default items if none provided
  const defaultItems = [
    {
      id: "placement",
      title: "100% Placement Support",
      badge: "Career First",
      desc: "Resume preparation, 1-on-1 mock interviews, portfolio review & direct referrals to top tech companies.",
      icon: FiAward,
      accent: "#B11FA8",
    },
    {
      id: "batches",
      title: "Flexible Batches",
      badge: "Self-Paced",
      desc: "Choose from morning, evening, or weekend batches tailored for working professionals and students.",
      icon: FiClock,
      accent: "#53BFEA",
    },
    {
      id: "mentors",
      title: "Expert Mentors",
      badge: "Industry Pros",
      desc: "Learn directly from senior software engineers & tech leads with 10+ years of active field experience.",
      icon: FiUsers,
      accent: "#45B51D",
    },
    {
      id: "practical",
      title: "Practical Learning",
      badge: "Hands-On",
      desc: "Work on real-world production projects, live API integrations, code reviews & capstone applications.",
      icon: FiCode,
      accent: "#EAB308",
    },
  ];

  const cardItems = items || defaultItems;

  // Track global container mouse movement
  const handleMouseMove = (e) => {
    if (disableAnimations || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: -1000, y: -1000 });
  };

  // Click shockwave ripple handler
  const handleClick = (e) => {
    if (!clickEffect || disableAnimations || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 700);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="relative w-full rounded-[32px] p-6 overflow-hidden transition-all duration-300 select-none"
      style={{
        background: "linear-gradient(135deg, rgba(15, 3, 24, 0.95) 0%, rgba(26, 5, 41, 0.98) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
      }}
    >
      {/* Background Spotlight Layer */}
      {enableSpotlight && isHovered && !disableAnimations && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle ${spotlightRadius}px at ${mousePos.x}px ${mousePos.y}px, rgba(${glowColor}, 0.22), transparent 80%)`,
          }}
        />
      )}

      {/* Click Shockwave Ripples */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none absolute rounded-full animate-ping"
          style={{
            left: ripple.x - 50,
            top: ripple.y - 50,
            width: 100,
            height: 100,
            background: `radial-gradient(circle, rgba(${glowColor}, 0.6) 0%, transparent 70%)`,
          }}
        />
      ))}

      {/* Header */}
      <div className="relative z-10 mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <HiSparkles className="h-4 w-4" style={{ color: `rgb(${glowColor})` }} />
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-purple-300">
              {sectionTitle}
            </p>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 sm:text-2xl">
            {sectionSubtitle}
          </h2>
        </div>
      </div>

      {/* Grid of Bento Cards */}
      <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cardItems.map((item, idx) => (
          <BentoCard
            key={item.id || idx}
            item={item}
            containerMousePos={mousePos}
            glowColor={glowColor}
            enableBorderGlow={enableBorderGlow}
            enableStars={enableStars}
            enableMagnetism={enableMagnetism}
            enableTilt={enableTilt}
            particleCount={particleCount}
            textAutoHide={textAutoHide}
            disableAnimations={disableAnimations}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Individual Bento Card with star canvas & magnetic tilt
 */
function BentoCard({
  item,
  containerMousePos,
  glowColor,
  enableBorderGlow,
  enableStars,
  enableMagnetism,
  enableTilt,
  particleCount,
  textAutoHide,
  disableAnimations,
}) {
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const [cardHover, setCardHover] = useState(false);
  const [transform, setTransform] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });

  const IconComp = item.icon || FiCheckCircle;

  // Handle magnetic / tilt physics
  const handleMouseMove = (e) => {
    if (disableAnimations || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    let moveX = 0;
    let moveY = 0;
    let rX = 0;
    let rY = 0;

    if (enableMagnetism) {
      moveX = deltaX * 0.1;
      moveY = deltaY * 0.1;
    }
    if (enableTilt) {
      rX = (deltaY / rect.height) * -12;
      rY = (deltaX / rect.width) * 12;
    }

    setTransform({ x: moveX, y: moveY, rotateX: rX, rotateY: rY });
  };

  const handleMouseLeave = () => {
    setCardHover(false);
    setTransform({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  };

  // Canvas star particles animation
  useEffect(() => {
    if (!enableStars || !canvasRef.current || disableAnimations) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const width = (canvas.width = canvas.offsetWidth || 250);
    const height = (canvas.height = canvas.offsetHeight || 160);

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedY: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.7 + 0.3,
      pulseSpeed: Math.random() * 0.03 + 0.01,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.y -= p.speedY;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        p.opacity += Math.sin(Date.now() * p.pulseSpeed) * 0.02;
        const boundedOpacity = Math.max(0.1, Math.min(0.9, p.opacity));

        ctx.fillStyle = `rgba(${glowColor}, ${boundedOpacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [enableStars, particleCount, glowColor, disableAnimations]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setCardHover(true)}
      onMouseLeave={handleMouseLeave}
      onClick={item.onClick || undefined}
      className={`group relative flex flex-col justify-between rounded-2xl p-5 transition-all duration-200 ${
        item.onClick ? "cursor-pointer" : ""
      }`}
      style={{
        background: cardHover
          ? "rgba(255, 255, 255, 0.08)"
          : "rgba(255, 255, 255, 0.04)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        transform: `perspective(1000px) translate3d(${transform.x}px, ${transform.y}px, 0px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
      }}
    >
      {/* Particle Canvas */}
      {enableStars && (
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full rounded-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}

      {/* Card Border Glow */}
      {enableBorderGlow && cardHover && (
        <div
          className="pointer-events-none absolute -inset-[1px] rounded-2xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 120px at ${containerMousePos.x}px ${containerMousePos.y}px, rgba(${glowColor}, 0.5), transparent 70%)`,
            zIndex: 0,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-3">
        {/* Icon & Badge */}
        <div className="flex items-center justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
            style={{
              background: `rgba(${glowColor}, 0.15)`,
              color: item.accent || "#B11FA8",
              border: `1px solid rgba(${glowColor}, 0.3)`,
            }}
          >
            <IconComp className="h-5 w-5" />
          </div>
          {item.badge && (
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/80"
              style={{ background: "rgba(255, 255, 255, 0.08)" }}
            >
              {item.badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white transition-colors duration-200 group-hover:text-purple-200 sm:text-lg">
          {item.title}
        </h3>

        {/* Description — auto-hide / hover expand feature */}
        <p
          className={`text-xs leading-relaxed text-slate-300 sm:text-sm transition-all duration-300 ${
            textAutoHide
              ? cardHover
                ? "max-h-32 opacity-100"
                : "max-h-12 opacity-75 line-clamp-2"
              : "opacity-90"
          }`}
        >
          {item.desc}
        </p>
      </div>
    </div>
  );
}

/**
 * MagicBentoWrapper — Single container wrapper that applies:
 * - Mouse spotlight
 * - Particle stars canvas
 * - Border glow
 * - Click shockwave ripple
 * to ANY custom element / card (like the Hero Purple Box or Upcoming Events Card).
 */
export function MagicBentoWrapper({
  children,
  className = "",
  style = {},
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  clickEffect = true,
  spotlightRadius = 350,
  particleCount = 12,
  glowColor = "132, 0, 255",
  bubbleMode = false,       // ← NEW: renders hollow rising bubbles instead of solid dots
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState([]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleClick = (e) => {
    if (!clickEffect || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 700);
  };

  // Canvas particle / bubble animation
  useEffect(() => {
    if (!enableStars || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const width  = (canvas.width  = canvas.offsetWidth  || 400);
    const height = (canvas.height = canvas.offsetHeight || 300);

    const particles = Array.from({ length: particleCount }, () => ({
      x:          Math.random() * width,
      y:          Math.random() * height,
      // bubbles: radius 2-7 px; dots: 0.5-2.5 px
      size:       bubbleMode
                    ? Math.random() * 5 + 2
                    : Math.random() * 2 + 0.5,
      speedY:     bubbleMode
                    ? Math.random() * 0.5 + 0.2    // bubbles rise faster
                    : Math.random() * 0.3 + 0.1,
      speedX:     bubbleMode ? (Math.random() - 0.5) * 0.3 : 0,  // gentle horizontal drift
      opacity:    Math.random() * 0.6 + 0.3,
      pulseSpeed: Math.random() * 0.02 + 0.008,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.y -= p.speedY;
        if (bubbleMode) p.x += p.speedX;
        if (p.y < -p.size) {
          p.y = height + p.size;
          p.x = Math.random() * width;
        }
        if (bubbleMode && (p.x < -p.size || p.x > width + p.size)) {
          p.x = Math.random() * width;
        }
        p.opacity += Math.sin(Date.now() * p.pulseSpeed) * 0.015;
        const op = Math.max(0.08, Math.min(0.85, p.opacity));

        if (bubbleMode) {
          // Hollow bubble: ring stroke + soft inner glow
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          // Inner radial glow
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          grd.addColorStop(0,   `rgba(${glowColor}, ${op * 0.25})`);
          grd.addColorStop(0.6, `rgba(${glowColor}, ${op * 0.08})`);
          grd.addColorStop(1,   `rgba(${glowColor}, 0)`);
          ctx.fillStyle = grd;
          ctx.fill();
          // Ring
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${glowColor}, ${op * 0.7})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          // Tiny highlight (top-left of bubble)
          ctx.beginPath();
          ctx.arc(
            p.x - p.size * 0.3,
            p.y - p.size * 0.3,
            p.size * 0.18,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(255, 255, 255, ${op * 0.5})`;
          ctx.fill();
          ctx.restore();
        } else {
          // Original solid dot
          ctx.fillStyle = `rgba(${glowColor}, ${op})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [enableStars, particleCount, glowColor]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: -1000, y: -1000 });
      }}
      onClick={handleClick}
      className={`relative overflow-hidden transition-all duration-300 ${className}`}
      style={{
        ...style,
        border: isHovered
          ? `2px solid rgba(${glowColor}, 0.85)`
          : `2px solid rgba(${glowColor}, 0.15)`,
        boxShadow: isHovered
          ? `0 0 0 1px rgba(${glowColor}, 0.25), 0 0 24px rgba(${glowColor}, 0.3), 0 0 60px rgba(${glowColor}, 0.12)`
          : "none",
      }}
    >
      {/* Particle Canvas */}
      {enableStars && (
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full opacity-60 transition-opacity duration-300 group-hover:opacity-100 z-0"
        />
      )}

      {/* Spotlight */}
      {enableSpotlight && isHovered && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(circle ${spotlightRadius}px at ${mousePos.x}px ${mousePos.y}px, rgba(${glowColor}, 0.25), transparent 80%)`,
          }}
        />
      )}

      {/* Border Glow */}
      {enableBorderGlow && isHovered && (
        <div
          className="pointer-events-none absolute -inset-[1px] rounded-[inherit] transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, rgba(${glowColor}, 0.5), transparent 70%)`,
          }}
        />
      )}

      {/* Shockwave Ripples */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none absolute rounded-full animate-ping z-0"
          style={{
            left: ripple.x - 50,
            top: ripple.y - 50,
            width: 100,
            height: 100,
            background: `radial-gradient(circle, rgba(${glowColor}, 0.6) 0%, transparent 70%)`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}
