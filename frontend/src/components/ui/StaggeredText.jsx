import React, { useEffect, useState } from "react";

/**
 * StaggeredText Component
 * -----------------------
 * Feature-rich text animation component for staggered letter/word reveals.
 */
export default function StaggeredText({
  text = "",
  className = "",
  staggerDelay = 0.035,
  duration = 0.5,
  splitBy = "characters", // "characters" | "words"
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 120);
    return () => clearTimeout(timer);
  }, []);

  const items = splitBy === "words" ? text.split(" ") : text.split("");

  return (
    <span className={`inline-flex flex-wrap justify-center ${className}`}>
      {items.map((item, index) => (
        <span
          key={index}
          className="inline-block transition-all ease-out transform-gpu will-change-transform"
          style={{
            transitionDuration: `${duration}s`,
            transitionDelay: `${index * staggerDelay}s`,
            opacity: isVisible ? 1 : 0,
            transform: isVisible
              ? "translateY(0px) rotateX(0deg) scale(1)"
              : "translateY(120%) rotateX(-80deg) scale(0.5)",
            filter: isVisible ? "blur(0px)" : "blur(10px)",
          }}
        >
          {item === " " ? "\u00A0" : item}
        </span>
      ))}
    </span>
  );
}
