"use client";

import { useEffect, useRef } from "react";

const CODE_SNIPPETS = [
  "const data = await fetch(url);",
  "if (status === 'ACTIVE') {",
  "return events.filter(e =>",
  "export async function get",
  "prisma.event.count({ where",
  "<KpiCard title={title}",
  "const [state, setState] =",
  "await prisma.project.find",
  "metadata: { browser: 'Chrome'",
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
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: string;
  opacity: number;
  size: number;
  targetOpacity: number;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width;
      canvas!.height = height;
    }

    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    const count = Math.min(Math.floor((width * height) / 80000), 18);
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.1,
      text: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
      opacity: 0,
      size: 10 + Math.random() * 3,
      targetOpacity: 0.04 + Math.random() * 0.04,
    }));

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      for (const p of particlesRef.current) {
        // Smooth opacity approach
        p.opacity += (p.targetOpacity - p.opacity) * 0.005;

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < -200) p.x = width + 100;
        if (p.x > width + 200) p.x = -100;
        if (p.y < -30) p.y = height + 30;
        if (p.y > height + 30) p.y = -30;

        // Draw text
        ctx!.save();
        ctx!.globalAlpha = p.opacity;
        ctx!.font = `${p.size}px monospace`;
        ctx!.fillStyle = "#a1a1aa";
        ctx!.fillText(p.text, p.x, p.y);
        ctx!.restore();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 1 }}
      aria-hidden="true"
    />
  );
}
