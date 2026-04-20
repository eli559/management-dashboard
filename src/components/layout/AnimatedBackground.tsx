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
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: string;
  opacity: number;
  size: number;
  blur: number;
  color: string;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;

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

    const particles: Particle[] = [];

    // Layer 1: Large code snippets — very visible
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * 2000,
        y: Math.random() * 2000,
        vx: (Math.random() - 0.5) * 0.15,
        vy: 0.03 + Math.random() * 0.08,
        text: SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)],
        opacity: 0.25 + Math.random() * 0.2,  // 0.25 - 0.45 — VERY visible
        size: 13 + Math.random() * 5,          // 13-18px
        blur: 0,
        color: `rgba(130, 140, 180, 1)`,       // bright blue-gray
      });
    }

    // Layer 2: Blurred far code — depth
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: Math.random() * 2000,
        y: Math.random() * 2000,
        vx: (Math.random() - 0.5) * 0.06,
        vy: 0.01 + Math.random() * 0.04,
        text: SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)],
        opacity: 0.12 + Math.random() * 0.1,
        size: 10 + Math.random() * 3,
        blur: 2,
        color: `rgba(100, 110, 150, 1)`,
      });
    }

    // Layer 3: Glyphs — floating symbols
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * 2000,
        y: Math.random() * 2000,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.15,
        text: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        opacity: 0.2 + Math.random() * 0.15,
        size: 16 + Math.random() * 8,          // 16-24px — big
        blur: 0,
        color: `rgba(120, 130, 220, 1)`,        // indigo
      });
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y > h + 50) { p.y = -40; p.x = Math.random() * w; }
        if (p.y < -50) { p.y = h + 40; p.x = Math.random() * w; }
        if (p.x < -400) p.x = w + 100;
        if (p.x > w + 400) p.x = -100;

        ctx!.save();
        ctx!.globalAlpha = p.opacity;
        ctx!.font = `${p.size}px 'Courier New', monospace`;
        ctx!.fillStyle = p.color;
        if (p.blur > 0) {
          ctx!.filter = `blur(${p.blur}px)`;
        }
        ctx!.fillText(p.text, p.x, p.y);
        ctx!.restore();
      }

      frameRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none"
      aria-hidden="true"
    />
  );
}
