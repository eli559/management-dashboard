"use client";

import { useState } from "react";
import { Lock, Download, Check, AlertTriangle, FileSpreadsheet, Eye, EyeOff, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";

interface Project {
  id: string;
  name: string;
  eventCount: number;
}

interface SettingsClientProps {
  projects: Project[];
}

export function SettingsClient({ projects }: SettingsClientProps) {
  return (
    <div className="space-y-6">
      <PasswordSection />
      <ExportSection projects={projects} />
    </div>
  );
}

function PasswordInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-[12px] text-zinc-300 font-medium mb-1.5">{label}</label>
      <div className="relative">
        <Lock className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 pointer-events-none" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          dir="ltr"
          className="w-full py-2.5 ps-11 pe-11 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-zinc-200 placeholder:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-white/[0.12] transition-all"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute end-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/[0.06] text-zinc-300 transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function PasswordSection() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPass !== confirm) { setStatus("error"); setMessage("הסיסמאות לא תואמות"); return; }
    if (newPass.length < 6) { setStatus("error"); setMessage("הסיסמה החדשה חייבת להכיל לפחות 6 תווים"); return; }

    setStatus("loading");
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: newPass }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success"); setMessage("הסיסמה שונתה בהצלחה");
        setCurrent(""); setNewPass(""); setConfirm(""); setOpen(false);
      } else {
        setStatus("error"); setMessage(data.error || "שגיאה");
      }
    } catch { setStatus("error"); setMessage("שגיאת חיבור"); }
  }

  return (
    <div className="surface rounded-2xl overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={() => { setOpen(!open); setStatus("idle"); setMessage(""); }}
        className="w-full flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-amber-400" />
          <h2 className="text-[16px] font-bold text-white">שינוי סיסמה</h2>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-zinc-300" /> : <ChevronDown className="w-5 h-5 text-zinc-300" />}
      </button>

      {/* Form — collapsible */}
      {open && (
        <div className="px-6 pb-6 border-t border-white/[0.05] pt-4">
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <PasswordInput label="סיסמה נוכחית" value={current} onChange={setCurrent} />
            <PasswordInput label="סיסמה חדשה" value={newPass} onChange={setNewPass} />
            <PasswordInput label="אימות סיסמה חדשה" value={confirm} onChange={setConfirm} />

            {message && (
              <div className={`flex items-center gap-2 text-[13px] px-4 py-2.5 rounded-xl ${status === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                {status === "success" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span>{message}</span>
              </div>
            )}

            <button type="submit" disabled={status === "loading"}
              className="px-6 py-2.5 bg-white text-zinc-900 font-medium text-[13px] rounded-xl hover:bg-zinc-100 disabled:opacity-50 transition-all">
              {status === "loading" ? "משנה..." : "שנה סיסמה"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function ExportSection({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  // "All" item + projects
  const allItems = [{ id: "__all__", name: "כל הפרויקטים", eventCount: projects.reduce((s, p) => s + p.eventCount, 0) }, ...projects];
  const totalPages = Math.ceil(allItems.length / PAGE_SIZE);
  const visible = allItems.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  async function handleExport(projectId: string) {
    setExporting(projectId);
    try {
      const url = projectId === "__all__" ? "/api/export" : `/api/export?project=${projectId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      const disposition = res.headers.get("content-disposition");
      a.download = disposition?.match(/filename="(.+)"/)?.[1] ?? "export.csv";
      a.click();
      URL.revokeObjectURL(a.href);
    } catch { alert("שגיאה בייצוא"); }
    finally { setExporting(null); }
  }

  return (
    <div className="surface rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
          <h2 className="text-[16px] font-bold text-white">ייצוא נתונים</h2>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-zinc-300" /> : <ChevronDown className="w-5 h-5 text-zinc-300" />}
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-white/[0.05] pt-4">
          <p className="text-[13px] text-zinc-300 mb-4">ייצוא אירועים לקובץ CSV (תואם אקסל). עד 10,000 אירועים.</p>

          <div className="space-y-2">
            {visible.map((p) => (
              <button key={p.id} onClick={() => handleExport(p.id)} disabled={exporting !== null}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] transition-all">
                <div className="flex items-center gap-3">
                  <Download className={`w-4 h-4 ${p.id === "__all__" ? "text-emerald-400" : "text-zinc-300"}`} />
                  <span className={`text-[13px] ${p.id === "__all__" ? "text-zinc-200 font-medium" : "text-zinc-200"}`}>{p.name}</span>
                </div>
                <span className="text-[11px] text-zinc-300">
                  {exporting === p.id ? "מייצא..." : `${p.eventCount.toLocaleString("he-IL")} אירועים`}
                </span>
              </button>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-3">
              <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
                className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:bg-white/[0.08] disabled:opacity-30 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-[12px] text-zinc-300 tabular-nums">{page + 1} / {totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
                className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:bg-white/[0.08] disabled:opacity-30 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
