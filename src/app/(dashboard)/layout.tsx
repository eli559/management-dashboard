import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground";
import { ToastProvider } from "@/components/ui/Toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen relative bg-[#06060a] overflow-x-hidden">
      {/* ── Lighting system ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-300px] start-[40%] w-[1100px] h-[800px] bg-amber-400/[0.04] rounded-full blur-[180px]" />
        <div className="absolute top-[60px] start-[25%] w-[900px] h-[400px] bg-blue-500/[0.035] rounded-full blur-[140px]" />
        <div className="absolute top-[35%] start-[30%] w-[700px] h-[500px] bg-violet-500/[0.03] rounded-full blur-[130px]" />
        <div className="absolute bottom-[-150px] end-[15%] w-[800px] h-[600px] bg-amber-500/[0.025] rounded-full blur-[150px]" />
        <div className="absolute top-[20%] start-[280px] w-[300px] h-[600px] bg-indigo-400/[0.02] rounded-full blur-[100px]" />
      </div>

      <AnimatedBackground />

      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-h-screen relative z-10 md:ms-[272px]">
        <Topbar />
        <main className="flex-1 p-4 md:p-7 mobile-main-padding md:pb-7 animate-page overflow-x-hidden">
          <ToastProvider>{children}</ToastProvider>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
