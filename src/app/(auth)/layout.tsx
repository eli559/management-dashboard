export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#08080a] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -end-40 w-96 h-96 bg-amber-500/[0.02] rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -start-40 w-96 h-96 bg-blue-500/[0.02] rounded-full blur-[100px]" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
