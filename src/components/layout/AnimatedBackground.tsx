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

    // Layer 1: Code snippets — bright, big
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * 2000,
        y: Math.random() * 2000,
        vx: (Math.random() - 0.5) * 0.12,
        vy: 0.02 + Math.random() * 0.06,
        text: SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)],
        opacity: 0.35 + Math.random() * 0.25,
        size: 13 + Math.random() * 4,
        blur: 0,
        color: "rgba(160, 170, 210, 1)",
      });
    }

    // Layer 2: Blurred far
    for (let i = 0; i < 12; i++) {
      particles.push({
        x: Math.random() * 2000,
        y: Math.random() * 2000,
        vx: (Math.random() - 0.5) * 0.05,
        vy: 0.01 + Math.random() * 0.03,
        text: SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)],
        opacity: 0.15 + Math.random() * 0.1,
        size: 10 + Math.random() * 3,
        blur: 2,
        color: "rgba(130, 140, 180, 1)",
      });
    }

    // Layer 3: Glyphs
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: Math.random() * 2000,
        y: Math.random() * 2000,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.12,
        text: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        opacity: 0.3 + Math.random() * 0.2,
        size: 16 + Math.random() * 8,
        blur: 0,
        color: "rgba(140, 150, 240, 1)",
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
        if (p.blur > 0) ctx!.filter = `blur(${p.blur}px)`;
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
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 50, mixBlendMode: "screen", opacity: 0.6 }}
      aria-hidden="true"
    />
  );
}
