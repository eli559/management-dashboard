"use client";

import { useEffect, useRef } from "react";

const SNIPPETS = [
  "const data = await fetch(url);",
  "if (status === 'ACTIVE') {",
  "return events.filter(e =>",
  "export async function get(",
  "prisma.event.count({",
  "const [s, setS] = useState(",
  "await prisma.project.find(",
  "sessionId: generateId()",
  "trackPageView(page);",
  "eventName: 'page_view'",
  "} catch (err) {",
  ".then(r => r.json())",
  "SELECT COUNT(*) FROM",
  "import { prisma } from",
  "function sanitize(raw) {",
  "export default function",
  "Promise.all([",
  "async function send(",
  "const result = await db",
  "metadata: { browser }",
  "apiKey: 'pk_...',",
  "onClick={() => track(",
  "useEffect(() => {",
  "router.push('/dashboard')",
];

const GLYPHS = [
  "{ }", "( )", "=>", "//", "< />", "::", "&&", "||",
  "===", "++", "[]", "/**", "*/", ">>", "<<",
];

interface Particle {
  x: number; y: number; vx: number; vy: number;
  text: string; opacity: number; size: number; color: string;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    let paused = false;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    // Pause when tab is hidden — saves battery
    function onVisibility() { paused = document.hidden; }
    document.addEventListener("visibilitychange", onVisibility);

    const particles: Particle[] = [];
    const snippetCount = isMobile ? 14 : 25;
    const bgCount = isMobile ? 4 : 12;
    const glyphCount = isMobile ? 6 : 15;

    for (let i = 0; i < snippetCount; i++) {
      particles.push({
        x: Math.random() * 2000, y: Math.random() * 2000,
        vx: (Math.random() - 0.5) * 0.12, vy: 0.02 + Math.random() * 0.06,
        text: SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)],
        opacity: 0.4 + Math.random() * 0.3, size: 13 + Math.random() * 4,
        color: "rgba(212, 175, 55, 1)",
      });
    }
    for (let i = 0; i < bgCount; i++) {
      particles.push({
        x: Math.random() * 2000, y: Math.random() * 2000,
        vx: (Math.random() - 0.5) * 0.05, vy: 0.01 + Math.random() * 0.03,
        text: SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)],
        opacity: 0.2 + Math.random() * 0.15, size: 10 + Math.random() * 3,
        color: "rgba(180, 150, 50, 1)",
      });
    }
    for (let i = 0; i < glyphCount; i++) {
      particles.push({
        x: Math.random() * 2000, y: Math.random() * 2000,
        vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.12,
        text: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        opacity: 0.35 + Math.random() * 0.25, size: 16 + Math.random() * 8,
        color: "rgba(235, 195, 65, 1)",
      });
    }

    let frameCount = 0;

    function draw() {
      frameRef.current = requestAnimationFrame(draw);
      if (paused) return;

      frameCount++;
      // Mobile: render every 3rd frame (~20fps) for battery
      if (isMobile && frameCount % 3 !== 0) return;

      ctx!.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.y > h + 50) { p.y = -40; p.x = Math.random() * w; }
        if (p.y < -50) { p.y = h + 40; p.x = Math.random() * w; }
        if (p.x < -400) p.x = w + 100;
        if (p.x > w + 400) p.x = -100;
        ctx!.save();
        ctx!.globalAlpha = p.opacity;
        ctx!.font = `${p.size}px 'Courier New', monospace`;
        ctx!.fillStyle = p.color;
        if (!isMobile) {
          ctx!.shadowColor = p.color;
          ctx!.shadowBlur = 8;
        }
        ctx!.fillText(p.text, p.x, p.y);
        ctx!.restore();
      }
    }

    draw();
    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, mixBlendMode: "screen", opacity: 0.6 }}
      aria-hidden="true"
    />
  );
}
