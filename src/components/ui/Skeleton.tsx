import { cn } from "@/utils/cn";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("skeleton", className)} />;
}

export function KpiSkeleton() {
  return (
    <div className="surface rounded-2xl p-4 md:p-6 space-y-3">
      <div className="flex items-start justify-between">
        <div className="skeleton w-10 h-10 md:w-11 md:h-11 rounded-xl" />
      </div>
      <div className="skeleton h-8 w-20 rounded-lg" />
      <div className="skeleton h-4 w-28 rounded" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="surface rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton h-3 w-36 rounded" />
        </div>
      </div>
      <div className="flex items-end gap-[6px] h-40">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 skeleton rounded-md"
            style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="surface rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton h-3 w-20 rounded" />
        </div>
      </div>
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-3/4 rounded" />
    </div>
  );
}
