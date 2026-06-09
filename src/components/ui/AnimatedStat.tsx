"use client";

import { AnimatedNumber } from "./AnimatedNumber";

export function AnimatedStat({ value }: { value: string }) {
  return (
    <p className="text-[clamp(1.125rem,4vw,1.5rem)] font-extrabold text-white tracking-tight">
      <AnimatedNumber value={value} />
    </p>
  );
}
