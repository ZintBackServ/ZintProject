import React, { useRef, useState, useEffect } from "react";

/**
 * SpecularButton — React Bits Specular Button Component
 * Renders a sleek dark pill button with a specular light beam that continuously traces/rotates
 * around the border on hover, combined with mouse-following glass sheen reflections.
 */
export default function SpecularButton({
  children,
  size = "lg",
  radius = 24,
  tint = "#ffffff",
  tintOpacity = 0,
  blur = 0,
  textColor = "#ffffff",
  lineColor = "#bc05f3",
  baseColor = "#8E1387",
  intensity = 1,
  shineSize = 35,
  shineFade = 47,
  thickness = 2,
  speed = 0.35,
  followMouse = true,
  proximity = 300,
  autoAnimate = false,
  onClick,
  className = "",
  style = {},
  type = "button",
  disabled = false,
  ...props
}) {
  const buttonRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [isNear, setIsNear] = useState(false);
  const [beamAngle, setBeamAngle] = useState(0);

  // Size preset dimensions
  const sizeStyles = {
    sm: "px-5 py-2 text-xs font-semibold tracking-wide",
    md: "px-7 py-2.5 text-sm font-bold tracking-wide",
    lg: "px-9 py-3.5 text-base font-bold tracking-wide",
  };

  // 1. Mouse position tracking for glass surface reflection
  useEffect(() => {
    if (!followMouse) return;

    const handleMouseMove = (e) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      const isClose = dist <= proximity;
      setIsNear(isClose);

      if (isClose || isHovered) {
        const xPercent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const yPercent = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
        setMousePos({ x: xPercent, y: yPercent });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [followMouse, proximity, isHovered]);

  // 2. Continuous 360-degree border beam tracing rotation on hover
  useEffect(() => {
    if (!isHovered && !autoAnimate) return;

    let animId;
    const step = () => {
      setBeamAngle((prev) => (prev + 3.5) % 360);
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isHovered, autoAnimate]);

  const activePos = isHovered || isNear || autoAnimate ? mousePos : { x: 50, y: 50 };

  return (
    <button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-flex items-center justify-center overflow-hidden transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none ${
        sizeStyles[size] || sizeStyles.lg
      } ${className}`}
      style={{
        borderRadius: `${radius}px`,
        color: textColor,
        backgroundColor: baseColor || "#8E1387",
        boxShadow: isHovered
          ? `0 0 28px rgba(188, 5, 243, 0.65), 0 0 12px rgba(188, 5, 243, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.2)`
          : `0 0 14px rgba(188, 5, 243, 0.3), inset 0 0 8px rgba(255, 255, 255, 0.1)`,
        transition: `all ${speed}s cubic-bezier(0.4, 0, 0.2, 1)`,
        ...style,
      }}
      {...props}
    >
      {/* Dynamic Rotating Specular Light Beam Tracing Border Perimeter */}
      <span
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          borderRadius: `${radius}px`,
          padding: `${thickness}px`,
          background: isHovered || autoAnimate
            ? `conic-gradient(from ${beamAngle}deg at 50% 50%, transparent 0deg, transparent 230deg, ${lineColor} 290deg, #ffffff 340deg, ${lineColor} 360deg)`
            : `radial-gradient(${shineSize * 3.5}px circle at ${activePos.x}% ${activePos.y}%, ${lineColor} 0%, #ffffff 25%, ${lineColor} 50%, rgba(188, 5, 243, 0.3) 75%, transparent 100%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          opacity: intensity,
        }}
      />

      {/* Subdued Glowing Border Accent Line */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          border: `${thickness}px solid ${lineColor}${isHovered ? "aa" : "55"}`,
          borderRadius: `${radius}px`,
          transition: "border-color 0.3s ease",
        }}
      />

      {/* Glass Surface Reflection Sheen — only active on hover, not on proximity */}
      <span
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          borderRadius: `${radius}px`,
          background: `radial-gradient(ellipse 80% 70% at ${activePos.x}% ${activePos.y}%, rgba(255, 255, 255, 0.25) 0%, ${lineColor}35 50%, transparent 80%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Button Children Content */}
      <span className="relative z-10 flex items-center justify-center gap-2 font-medium tracking-wide">
        {children}
      </span>
    </button>
  );
}
