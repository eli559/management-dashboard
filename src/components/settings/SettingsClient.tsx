"use client";

import { useState } from "react";
import { Lock, Download, Check, AlertTriangle, FileSpreadsheet } from "lucide-react";

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

function PasswordSection() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPass !== confirm) {
      setStatus("error");
      setMessage("הסיסמאות לא תואמות");
      return;
    }
    if (newPass.length < 6) {
      setStatus("error");
      setMessage("הסיסמה החדשה חייבת להכיל לפחות 6 תווים");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: newPass }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("הסיסמה שונתה בהצלחה");
        setCurrent("");
        setNewPass("");
        setConfirm("");
      } else {
        setStatus("error");
        setMessage(data.error || "שגיאה");
      }
    } catch {
      setStatus("error");
      setMessage("שגיאת חיבור");
    }
  }

  return (
    <div className="surface rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <Lock className="w-5 h-5 text-amber-400" />
        <h2 className="text-[16px] font-bold text-white">שינוי סיסמה</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-[12px] text-zinc-300 font-medium mb-1.5">סיסמה נוכחית</label>
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
            dir="ltr"
            className="w-full py-2.5 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-zinc-200 placeholder:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-white/[0.12] transition-all"
          />
        </div>
        <div>
          <label className="block text-[12px] text-zinc-300 font-medium mb-1.5">סיסמה חדשה</label>
          <input
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
            dir="ltr"
            className="w-full py-2.5 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-zinc-200 placeholder:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-white/[0.12] transition-all"
          />
        </div>
        <div>
          <label className="block text-[12px] text-zinc-300 font-medium mb-1.5">אימות סיסמה חדשה</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            dir="ltr"
            className="w-full py-2.5 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-zinc-200 placeholder:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-white/[0.12] transition-all"
          />
        </div>

        {message && (
          <div className={`flex items-center gap-2 text-[13px] px-4 py-2.5 rounded-xl ${status === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
            {status === "success" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{message}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-2.5 bg-white text-zinc-900 font-medium text-[13px] rounded-xl hover:bg-zinc-100 disabled:opacity-50 transition-all"
        >
          {status === "loading" ? "משנה..." : "שנה סיסמה"}
        </button>
      </form>
    </div>
  );
}

function ExportSection({ projects }: { projects: Project[] }) {
  const [exporting, setExporting] = useState<string | null>(null);

  async function handleExport(projectId?: string) {
    const key = projectId ?? "all";
    setExporting(key);
    try {
      const url = projectId ? `/api/export?project=${projectId}` : "/api/export";
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      const disposition = res.headers.get("content-disposition");
      const filename = disposition?.match(/filename="(.+)"/)?.[1] ?? `export_${key}.csv`;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      alert("שגיאה בייצוא");
    } finally {
      setExporting(null);
    }
  }

  return (
    <div className="surface rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
        <h2 className="text-[16px] font-bold text-white">ייצוא נתונים</h2>
      </div>

      <p className="text-[13px] text-zinc-300 mb-5">
        ייצוא אירועים לקובץ CSV (תואם אקסל). עד 10,000 אירועים אחרונים.
      </p>

      <div className="space-y-2">
        {/* Export all */}
        <button
          onClick={() => handleExport()}
          disabled={exporting !== null}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] transition-all group"
        >
          <div className="flex items-center gap-3">
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="text-[13px] text-zinc-200 font-medium">ייצוא כל הפרויקטים</span>
          </div>
          <span className="text-[11px] text-zinc-300">
            {exporting === "all" ? "מייצא..." : "CSV"}
          </span>
        </button>

        {/* Export per project */}
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => handleExport(p.id)}
            disabled={exporting !== null}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] transition-all"
          >
            <div className="flex items-center gap-3">
              <Download className="w-4 h-4 text-zinc-300" />
              <span className="text-[13px] text-zinc-200">{p.name}</span>
            </div>
            <span className="text-[11px] text-zinc-300">
              {exporting === p.id ? "מייצא..." : `${p.eventCount.toLocaleString("he-IL")} אירועים`}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
