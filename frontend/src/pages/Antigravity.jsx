import React, { useRef, useEffect } from "react";

export default function Antigravity({
  count = 100,
  magnetRadius = 6,
  ringRadius = 7,
  waveSpeed = 0.4,
  waveAmplitude = 1,
  particleSize = 1.2,
  lerpSpeed = 0.05,
  color = "#5227FF",
  autoAnimate = false,
  particleVariance = 1,
  rotationSpeed = 0,
  depthFactor = 1,
  pulseSpeed = 3,
  particleShape = "capsule",
  fieldStrength = 10,
  cardBoundsRef = null,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Mouse tracking across full screen
    let mouse = { x: -1000, y: -1000, active: false };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Initial random positions across screen (No ring or circle)
    const particles = Array.from({ length: count }, () => {
      const x = Math.random() * width;
      const y = Math.random() * height;
      return {
        homeX: x,
        homeY: y,
        cx: x,
        cy: y,
        offset: Math.random() * Math.PI * 2,
        size: particleSize * (Math.random() * 0.8 + 1.2),
        speed: 0.005 + Math.random() * 0.01,
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const time = Date.now() * 0.001;

      // Card bounding rectangle exclusion area
      let cardRect = null;
      if (cardBoundsRef && cardBoundsRef.current) {
        const cRect = cardBoundsRef.current.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        cardRect = {
          left: cRect.left - canvasRect.left,
          top: cRect.top - canvasRect.top,
          right: cRect.right - canvasRect.left,
          bottom: cRect.bottom - canvasRect.top,
        };
      }

      particles.forEach((p) => {
        let targetX = p.homeX;
        let targetY = p.homeY;

        // Soft ambient floating
        targetX += Math.sin(time * waveSpeed + p.offset) * 15;
        targetY += Math.cos(time * waveSpeed + p.offset) * 15;

        let isNearMouse = false;
        let dist = 1000;

        if (mouse.active && mouse.x >= 0 && mouse.y >= 0) {
          const dx = p.cx - mouse.x;
          const dy = p.cy - mouse.y;
          dist = Math.hypot(dx, dy);

          const effectRadius = magnetRadius * 25;

          if (dist < effectRadius && dist > 0) {
            isNearMouse = true;
            const force = (1 - dist / effectRadius) * fieldStrength * 6;
            // Antigravity repelling from pointer
            targetX += (dx / dist) * force;
            targetY += (dy / dist) * force;
          }
        }

        // Smooth position interpolation
        p.cx += (targetX - p.cx) * lerpSpeed;
        p.cy += (targetY - p.cy) * lerpSpeed;

        // Render ONLY when user hovers near the particle
        if (!isNearMouse) return;

        // EXCLUDE rendering inside sign-in card background
        if (
          cardRect &&
          p.cx >= cardRect.left &&
          p.cx <= cardRect.right &&
          p.cy >= cardRect.top &&
          p.cy <= cardRect.bottom
        ) {
          return;
        }

        // Calculate opacity fade based on distance to cursor
        const effectRadius = magnetRadius * 25;
        const opacity = Math.max(0, Math.min(1, 1 - dist / effectRadius));

        if (opacity <= 0.05) return;

        // Capsule points facing the mouse cursor
        const capsuleAngle = Math.atan2(p.cy - mouse.y, p.cx - mouse.x) + Math.PI / 2;

        ctx.save();
        ctx.translate(p.cx, p.cy);
        ctx.rotate(capsuleAngle);

        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.globalAlpha = opacity * 0.85;

        // Subtle capsule shape (decreased size & clean lines)
        const w = p.size * 1.5;
        const h = p.size * 4;
        ctx.beginPath();
        ctx.roundRect(-w / 2, -h / 2, w, h, w / 2);
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [
    count,
    magnetRadius,
    particleSize,
    lerpSpeed,
    color,
    autoAnimate,
    waveSpeed,
    waveAmplitude,
    pulseSpeed,
    fieldStrength,
    cardBoundsRef,
  ]);

  return <canvas ref={canvasRef} className="w-full h-full absolute inset-0 pointer-events-none" />;
}
