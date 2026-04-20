"use client";

import { useEffect, useRef } from "react";

const SNIPPETS = [
  "const data = await fetch(url);",
  "if (status === 'ACTIVE') {",
  "return events.filter(e =>",
  "export async function get(",
  "prisma.event.count({",
  "<KpiCard value={v}",
  "const [s, setS] = useState",
  "await prisma.project.find(",
  "sessionId: generateId()",
  "trackPageView(page);",
  "eventName: 'page_view'",
  "} catch (err) {",
  ".then(r => r.json())",
  "grid-cols-4 gap-5",
  "SELECT COUNT(*) FROM",
  "import { prisma }",
  "function sanitize(raw) {",
  "className='surface'",
  "export default function",
  "Promise.all([",
  "async function send(",
  "const result = await",
  "border: 1px solid",
  "metadata: {}",
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: string;
  opacity: number;
  size: number;
  depth: number; // 0-1: far=0 near=1
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

    // Layer 1: deep, blurry, slow (far)
    // Layer 2: mid
    // Layer 3: near, sharper, slightly faster
    const count = Math.min(Math.floor((w * h) / 35000), 32);
    const particles: Particle[] = Array.from({ length: count }, () => {
      const depth = Math.random();
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * (0.04 + depth * 0.12),
        vy: 0.015 + depth * 0.07,
        text: SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)],
        opacity: 0.04 + depth * 0.1, // far: ~0.04, near: ~0.14
        size: 8 + depth * 5, // far: 8px, near: 13px
        depth,
      };
    });

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y > h + 40) {
          p.y = -30;
          p.x = Math.random() * w;
          p.text = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
        }
        if (p.x < -300) p.x = w + 50;
        if (p.x > w + 300) p.x = -50;

        ctx!.save();
        ctx!.globalAlpha = p.opacity;
        ctx!.font = `${p.size}px 'Courier New', monospace`;

        // Color by depth: far = muted indigo, near = brighter blue-ish
        const r = 50 + Math.floor(p.depth * 30);
        const g = 50 + Math.floor(p.depth * 35);
        const b = 65 + Math.floor(p.depth * 50);
        ctx!.fillStyle = `rgb(${r},${g},${b})`;

        if (p.depth < 0.35) {
          ctx!.filter = "blur(1.5px)";
        } else if (p.depth < 0.6) {
          ctx!.filter = "blur(0.5px)";
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
