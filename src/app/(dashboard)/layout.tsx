import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen relative bg-[#06060a]">
      {/* ── Lighting system ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Projector — top-center spotlight */}
        <div className="absolute top-[-300px] start-[40%] w-[1100px] h-[800px] bg-amber-400/[0.04] rounded-full blur-[180px]" />

        {/* KPI zone — cool blue wash */}
        <div className="absolute top-[60px] start-[25%] w-[900px] h-[400px] bg-blue-500/[0.035] rounded-full blur-[140px]" />

        {/* Chart zone — violet accent */}
        <div className="absolute top-[35%] start-[30%] w-[700px] h-[500px] bg-violet-500/[0.03] rounded-full blur-[130px]" />

        {/* Bottom — warm fill */}
        <div className="absolute bottom-[-150px] end-[15%] w-[800px] h-[600px] bg-amber-500/[0.025] rounded-full blur-[150px]" />

        {/* Side accent — left edge light */}
        <div className="absolute top-[20%] start-[280px] w-[300px] h-[600px] bg-indigo-400/[0.02] rounded-full blur-[100px]" />
      </div>

      {/* Code particles */}
      <AnimatedBackground />

      <Sidebar />
      <div
        className="flex-1 flex flex-col min-h-screen relative z-10"
        style={{ marginInlineStart: "272px" }}
      >
        <Topbar />
        <main className="flex-1 p-7 animate-page">{children}</main>
      </div>
    </div>
  );
}
