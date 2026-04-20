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
  "border: 1px solid",
  "metadata: { browser }",
  "apiKey: 'pk_...',",
  "<KpiCard value={v} />",
  "grid-cols-4 gap-5",
  "transition: all 300ms",
  "font-bold text-white",
  "className='surface'",
  "onClick={() => track(",
  "useEffect(() => {",
  "router.push('/dashboard')",
];

// Symbols layer — floating glyphs
const GLYPHS = [
  "{ }", "( )", "=>", "//", "/* */", "< />", "::", "...", "&&", "||",
  "!=", "===", "++", "[]", "/**", "*/", "#!", ">>", "<<", ">>=",
];

interface CodeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: string;
  opacity: number;
  size: number;
  depth: number;
}

interface GlyphParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  glyph: string;
  opacity: number;
  size: number;
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

    // ── Layer 1: Code snippets (far to near) ──
    const codeCount = Math.min(Math.floor((w * h) / 28000), 40);
    const codeParticles: CodeParticle[] = Array.from({ length: codeCount }, () => {
      const depth = Math.random();
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * (0.03 + depth * 0.14),
        vy: 0.01 + depth * 0.08,
        text: SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)],
        opacity: 0.06 + depth * 0.16, // 0.06 → 0.22
        size: 9 + depth * 5,          // 9px → 14px
        depth,
      };
    });

    // ── Layer 2: Glyphs / symbols (mid-layer) ──
    const glyphCount = Math.min(Math.floor((w * h) / 60000), 18);
    const glyphParticles: GlyphParticle[] = Array.from({ length: glyphCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.15,
      glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      opacity: 0.08 + Math.random() * 0.1,
      size: 14 + Math.random() * 6,
    }));

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      // ── Draw code snippets ──
      for (const p of codeParticles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y > h + 40) {
          p.y = -30;
          p.x = Math.random() * w;
          p.text = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
        }
        if (p.x < -350) p.x = w + 50;
        if (p.x > w + 350) p.x = -50;

        ctx!.save();
        ctx!.globalAlpha = p.opacity;
        ctx!.font = `${p.size}px 'Courier New', monospace`;

        // Depth color: far = dim gray-blue, near = brighter indigo
        const brightness = 50 + Math.floor(p.depth * 50);
        ctx!.fillStyle = `rgb(${brightness}, ${brightness + 5}, ${brightness + 25})`;

        // Blur far particles
        if (p.depth < 0.3) {
          ctx!.filter = "blur(2px)";
        } else if (p.depth < 0.55) {
          ctx!.filter = "blur(0.8px)";
        }

        ctx!.fillText(p.text, p.x, p.y);
        ctx!.restore();
      }

      // ── Draw glyphs ──
      for (const g of glyphParticles) {
        g.x += g.vx;
        g.y += g.vy;

        if (g.x < -40) g.x = w + 20;
        if (g.x > w + 40) g.x = -20;
        if (g.y < -40) g.y = h + 20;
        if (g.y > h + 40) g.y = -20;

        ctx!.save();
        ctx!.globalAlpha = g.opacity;
        ctx!.font = `${g.size}px 'Courier New', monospace`;
        ctx!.fillStyle = "rgba(99, 102, 241, 0.5)"; // indigo tint
        ctx!.fillText(g.glyph, g.x, g.y);
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
