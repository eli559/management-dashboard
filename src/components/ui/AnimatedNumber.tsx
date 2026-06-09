"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface AnimatedNumberProps {
  value: string;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({ value, duration = 1000, className }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value);
  const rafRef = useRef(0);
  const prevValue = useRef(value);
  const mounted = useRef(false);
  const elRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  const animate = useCallback((targetValue: string) => {
    cancelAnimationFrame(rafRef.current);

    const match = targetValue.match(/(-?[\d,]+\.?\d*)/);
    if (!match) { setDisplay(targetValue); return; }

    const numStr = match[1];
    const numericValue = parseFloat(numStr.replace(/,/g, ""));
    if (isNaN(numericValue) || numericValue === 0) { setDisplay(targetValue); return; }

    const prefix = targetValue.substring(0, match.index!);
    const suffix = targetValue.substring(match.index! + numStr.length);
    const hasCommas = numStr.includes(",");
    const decimalPlaces = numStr.includes(".") ? numStr.split(".")[1].length : 0;

    const startValue = mounted.current
      ? (parseFloat(prevValue.current.match(/(-?[\d,]+\.?\d*)/)?.[1]?.replace(/,/g, "") || "0"))
      : 0;
    mounted.current = true;
    prevValue.current = targetValue;

    // Cap duration on mobile for snappier feel
    const isMobile = window.innerWidth < 768;
    const actualDuration = isMobile ? Math.min(duration, 800) : duration;

    const startTime = performance.now();

    function formatNum(n: number): string {
      const fixed = n.toFixed(decimalPlaces);
      if (!hasCommas) return fixed;
      const [int, dec] = fixed.split(".");
      const formatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return dec !== undefined ? `${formatted}.${dec}` : formatted;
    }

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / actualDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (numericValue - startValue) * eased;
      setDisplay(`${prefix}${formatNum(current)}${suffix}`);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(targetValue);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [duration]);

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    // First mount: use IntersectionObserver to animate only when visible
    if (!hasAnimated.current) {
      const el = elRef.current;
      if (!el) { animate(value); hasAnimated.current = true; return; }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            animate(value);
            hasAnimated.current = true;
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }

    // Subsequent value changes (e.g. live refresh): animate immediately
    animate(value);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, animate]);

  return <span ref={elRef} className={className}>{display}</span>;
}
