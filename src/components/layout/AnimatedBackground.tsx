"use client";

import { useEffect, useRef } from "react";

const CODE_LINES = [
  "const data = await fetch(url);",
  "if (status === 'ACTIVE') {",
  "return events.filter(e =>",
  "export async function get",
  "prisma.event.count({ where",
  "<KpiCard title={title}",
  "const [state, setState] =",
  "await prisma.project.find",
  "metadata: { browser: 'Ch'",
  "sessionId: generateId()",
  "trackPageView(page);",
  "apiKey: 'pk_...',",
  "eventName: 'page_view'",
  "} catch (err) {",
  "export default function",
  ".then(res => res.json())",
  "border-radius: 16px;",
  "transition: all 300ms",
  "grid-cols-4 gap-5",
  "font-bold text-white",
  "function sanitizePage(r) {",
  "SELECT COUNT(*) FROM ev",
  "import { prisma } from",
  "const token = generateId",
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: string;
  opacity: number;
  targetOpacity: number;
  size: number;
  blur: number;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    const count = Math.min(Math.floor((width * height) / 60000), 22);
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.08 + 0.02,
      text: CODE_LINES[Math.floor(Math.random() * CODE_LINES.length)],
      opacity: 0,
      targetOpacity: 0.06 + Math.random() * 0.06,
      size: 11 + Math.random() * 3,
      blur: Math.random() > 0.6 ? 1 : 0,
    }));

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.opacity += (p.targetOpacity - p.opacity) * 0.003;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -300) p.x = width + 100;
        if (p.x > width + 300) p.x = -100;
        if (p.y > height + 40) {
          p.y = -30;
          p.x = Math.random() * width;
          p.text = CODE_LINES[Math.floor(Math.random() * CODE_LINES.length)];
        }

        ctx!.save();
        ctx!.globalAlpha = p.opacity;
        if (p.blur > 0) {
          ctx!.filter = `blur(${p.blur}px)`;
        }
        ctx!.font = `${p.size}px 'Courier New', monospace`;
        ctx!.fillStyle = "#71717a";
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
