 import React, { useRef, useEffect } from "react";

export default function Antigravity({
  count = 60,
  magnetRadius = 6,
  ringRadius: _ringRadius = 7,
  waveSpeed = 0.4,
  waveAmplitude = 1,
  particleSize = 1.2,
  lerpSpeed = 0.05,
  color = "#5227FF",
  autoAnimate = false,
  particleVariance: _particleVariance = 1,
  rotationSpeed: _rotationSpeed = 0,
  depthFactor: _depthFactor = 1,
  pulseSpeed = 3,
  particleShape: _particleShape = "capsule",
  fieldStrength = 10,
  cardBoundsRef = null,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId = null;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    let mouse = { x: -1000, y: -1000, active: false };
    let cachedCardRect = null;
    let lastRectCheck = 0;
    let isVisible = false;
    let isRunning = false;
    let idleFrames = 0;

    const startLoop = () => {
      if (!isRunning && isVisible && !document.hidden) {
        isRunning = true;
        idleFrames = 0;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
      idleFrames = 0;
      startLoop();
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

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
      };
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && (autoAnimate || mouse.active)) {
          startLoop();
        } else if (!isVisible && animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          isRunning = false;
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const render = () => {
      if (!isVisible || document.hidden) {
        isRunning = false;
        animationFrameId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const nowMs = Date.now();
      const time = nowMs * 0.001;

      let cardRect = null;
      if (cardBoundsRef && cardBoundsRef.current) {
        if (nowMs - lastRectCheck > 400 || !cachedCardRect) {
          lastRectCheck = nowMs;
          const cRect = cardBoundsRef.current.getBoundingClientRect();
          const canvasRect = canvas.getBoundingClientRect();
          cachedCardRect = {
            left: cRect.left - canvasRect.left,
            top: cRect.top - canvasRect.top,
            right: cRect.right - canvasRect.left,
            bottom: cRect.bottom - canvasRect.top,
          };
        }
        cardRect = cachedCardRect;
      }

      let activeParticles = 0;

      particles.forEach((p) => {
        let targetX = p.homeX;
        let targetY = p.homeY;

        if (autoAnimate) {
          targetX += Math.sin(time * waveSpeed + p.offset) * 15;
          targetY += Math.cos(time * waveSpeed + p.offset) * 15;
        }

        let isNearMouse = false;
        let dist = 1000;

        if (mouse.active && mouse.x >= 0 && mouse.y >= 0) {
          const dx = p.cx - mouse.x;
          const dy = p.cy - mouse.y;
          dist = Math.hypot(dx, dy);

          const effectRadius = magnetRadius * 25;

          if (dist < effectRadius && dist > 0) {
            isNearMouse = true;
            activeParticles++;
            const force = (1 - dist / effectRadius) * fieldStrength * 6;
            targetX += (dx / dist) * force;
            targetY += (dy / dist) * force;
          }
        }

        p.cx += (targetX - p.cx) * lerpSpeed;
        p.cy += (targetY - p.cy) * lerpSpeed;

        if (!isNearMouse) return;

        if (
          cardRect &&
          p.cx >= cardRect.left &&
          p.cx <= cardRect.right &&
          p.cy >= cardRect.top &&
          p.cy <= cardRect.bottom
        ) {
          return;
        }

        const effectRadius = magnetRadius * 25;
        const opacity = Math.max(0, Math.min(1, 1 - dist / effectRadius));

        if (opacity <= 0.05) return;

        const capsuleAngle = Math.atan2(p.cy - mouse.y, p.cx - mouse.x) + Math.PI / 2;

        ctx.save();
        ctx.translate(p.cx, p.cy);
        ctx.rotate(capsuleAngle);

        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = opacity * 0.85;

        const w = p.size * 1.5;
        const h = p.size * 4;
        ctx.beginPath();
        ctx.roundRect(-w / 2, -h / 2, w, h, w / 2);
        ctx.fill();

        ctx.restore();
      });

      // If no active interaction and not autoAnimate, pause animation loop to free CPU/main thread
      if (!autoAnimate && activeParticles === 0 && !mouse.active) {
        idleFrames++;
        if (idleFrames > 30) {
          isRunning = false;
          animationFrameId = null;
          return;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
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
