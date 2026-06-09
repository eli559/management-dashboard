import { KpiSkeleton, ChartSkeleton, CardSkeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-4 md:space-y-6 animate-page">
      <div className="space-y-1.5">
        <div className="skeleton h-6 w-20 rounded-lg" />
        <div className="skeleton h-4 w-48 rounded" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-5">
        <div className="lg:col-span-3"><ChartSkeleton /></div>
        <div className="lg:col-span-2"><CardSkeleton /></div>
      </div>
    </div>
  );
}
