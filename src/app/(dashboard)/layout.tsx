import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen relative bg-[#0a0a0c]">
      {/* Ambient glow — behind everything */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 start-1/3 w-[800px] h-[600px] bg-blue-500/[0.015] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 end-1/4 w-[600px] h-[500px] bg-amber-500/[0.01] rounded-full blur-[100px]" />
      </div>

      {/* Code particles — above ambient, below content */}
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
