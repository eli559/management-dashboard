import { KpiSkeleton, ChartSkeleton } from "@/components/ui/Skeleton";

export default function ReportsLoading() {
  return (
    <div className="space-y-4 md:space-y-5 animate-page">
      <div className="space-y-1.5">
        <div className="skeleton h-6 w-16 rounded-lg" />
        <div className="skeleton h-4 w-40 rounded" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
        {Array.from({ length: 5 }).map((_, i) => <KpiSkeleton key={i} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><ChartSkeleton /></div>
        <ChartSkeleton />
      </div>
    </div>
  );
}
