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
      {/* Multi-zone ambient light */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-200px] start-[20%] w-[900px] h-[700px] bg-indigo-500/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-[-100px] end-[10%] w-[700px] h-[500px] bg-violet-500/[0.025] rounded-full blur-[120px]" />
        <div className="absolute top-[40%] start-[60%] w-[500px] h-[400px] bg-blue-500/[0.02] rounded-full blur-[100px]" />
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
