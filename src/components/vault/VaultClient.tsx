"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  KeyRound, Plus, Eye, EyeOff, Copy, Check, Trash2,
  Edit, X, Shield, ExternalLink, Search,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { createPortal } from "react-dom";

interface Credential {
  id: string;
  projectId: string | null;
  type: string;
  serviceName: string;
  loginUrl: string | null;
  username: string | null;
  notes: string | null;
  lastViewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Project { id: string; name: string; }

const TYPE_LABELS: Record<string, string> = {
  hosting: "אחסון", cms: "CMS", email: "אימייל", api: "API",
  db: "מסד נתונים", ftp: "FTP", social: "רשת חברתית", other: "אחר",
};

const TYPE_OPTIONS = [
  { value: "hosting", label: "אחסון" }, { value: "cms", label: "CMS" },
  { value: "email", label: "אימייל" }, { value: "api", label: "API" },
  { value: "db", label: "מסד נתונים" }, { value: "ftp", label: "FTP" },
  { value: "social", label: "רשת חברתית" }, { value: "other", label: "אחר" },
];

function timeAgo(d: string) {
  const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (mins < 1) return "עכשיו";
  if (mins < 60) return `לפני ${mins} דק׳`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `לפני ${h} שע׳`;
  return `לפני ${Math.floor(h / 24)} ימים`;
}

export function VaultClient({ credentials, projects }: { credentials: Credential[]; projects: Project[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const [revealedSecret, setRevealedSecret] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  let filtered = credentials;
  if (search) filtered = filtered.filter((c) => c.serviceName.toLowerCase().includes(search.toLowerCase()) || c.username?.toLowerCase().includes(search.toLowerCase()));
  if (typeFilter) filtered = filtered.filter((c) => c.type === typeFilter);

  async function revealSecret(id: string) {
    if (revealedId === id) { setRevealedId(null); setRevealedSecret(""); return; }
    const res = await fetch(`/api/vault/${id}`);
    if (res.ok) { const d = await res.json(); setRevealedId(id); setRevealedSecret(d.secret); }
  }

  async function copySecret(id: string) {
    const res = await fetch(`/api/vault/${id}`);
    if (res.ok) {
      const d = await res.json();
      await navigator.clipboard.writeText(d.secret);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/vault/${id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    router.refresh();
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = {
      projectId: fd.get("projectId") || null,
      type: fd.get("type"),
      serviceName: fd.get("serviceName"),
      loginUrl: fd.get("loginUrl") || null,
      username: fd.get("username") || null,
      secret: fd.get("secret"),
      notes: fd.get("notes") || null,
    };
    const res = await fetch("/api/vault", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) { setShowForm(false); router.refresh(); }
  }

  return (
    <div className="space-y-5">
      {/* Actions bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="חיפוש..."
            className="w-full ps-9 pe-4 py-2 bg-white/[0.04] border border-white/[0.1] rounded-lg text-[13px] text-zinc-200 placeholder:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-white/[0.15] transition-all" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-lg text-[12px] text-zinc-200 cursor-pointer">
          <option value="">כל הסוגים</option>
          {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 font-medium text-[13px] rounded-lg hover:bg-zinc-100 transition-all">
          <Plus className="w-4 h-4" /><span>גישה חדשה</span>
        </button>
      </div>

      {/* Credentials list */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((cred) => (
            <div key={cred.id} className="surface rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/[0.08] flex items-center justify-center flex-shrink-0">
                  <KeyRound className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[14px] font-bold text-white">{cred.serviceName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/[0.06]">
                      {TYPE_LABELS[cred.type] ?? cred.type}
                    </span>
                  </div>
                  {cred.username && <p className="text-[12px] text-zinc-300 font-mono" dir="ltr">{cred.username}</p>}
                  {cred.loginUrl && (
                    <a href={cred.loginUrl} target="_blank" rel="noopener" className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 mt-1" dir="ltr">
                      {cred.loginUrl.substring(0, 50)}<ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {/* Revealed secret */}
                  {revealedId === cred.id && (
                    <div className="mt-2 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2">
                      <code className="text-[12px] text-amber-300 font-mono break-all" dir="ltr">{revealedSecret}</code>
                    </div>
                  )}

                  <p className="text-[10px] text-zinc-300 mt-2">עודכן {timeAgo(cred.updatedAt)}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => revealSecret(cred.id)} title={revealedId === cred.id ? "הסתר" : "הצג סיסמה"}
                    className="p-2 rounded-lg hover:bg-white/[0.06] text-zinc-300 transition-colors">
                    {revealedId === cred.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => copySecret(cred.id)} title="העתק סיסמה"
                    className="p-2 rounded-lg hover:bg-white/[0.06] text-zinc-300 transition-colors">
                    {copiedId === cred.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setDeleteConfirm(cred.id)} title="מחק"
                    className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-300 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="surface rounded-2xl p-16 text-center">
          <Shield className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-zinc-200 mb-2">הכספת ריקה</h3>
          <p className="text-sm text-zinc-300">הוסף פרטי גישה כדי לשמור אותם בצורה מאובטחת</p>
        </div>
      )}

      {/* Create form modal */}
      {showForm && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative z-[100000] w-full max-w-[440px] max-h-[85vh] overflow-y-auto p-6 rounded-2xl"
            style={{ background: "rgba(12,12,18,0.95)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 80px -12px rgba(0,0,0,0.8)", animation: "dialog-in 200ms ease-out" }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[16px] font-bold text-white">גישה חדשה</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-white/[0.08] text-zinc-300"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[12px] text-zinc-300 mb-1.5">שם השירות *</label>
                <input name="serviceName" required className="w-full py-2.5 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-white/[0.12] transition-all" />
              </div>
              <div>
                <label className="block text-[12px] text-zinc-300 mb-1.5">סוג גישה *</label>
                <select name="type" required className="w-full py-2.5 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-zinc-200 cursor-pointer">
                  {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] text-zinc-300 mb-1.5">פרויקט</label>
                <select name="projectId" className="w-full py-2.5 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-zinc-200 cursor-pointer">
                  <option value="">ללא פרויקט</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] text-zinc-300 mb-1.5">כתובת התחברות</label>
                <input name="loginUrl" dir="ltr" className="w-full py-2.5 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-white/[0.12] transition-all" />
              </div>
              <div>
                <label className="block text-[12px] text-zinc-300 mb-1.5">שם משתמש</label>
                <input name="username" dir="ltr" className="w-full py-2.5 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-white/[0.12] transition-all" />
              </div>
              <div>
                <label className="block text-[12px] text-zinc-300 mb-1.5">סיסמה / מפתח *</label>
                <input name="secret" type="password" required dir="ltr" className="w-full py-2.5 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-white/[0.12] transition-all" />
              </div>
              <div>
                <label className="block text-[12px] text-zinc-300 mb-1.5">הערות</label>
                <textarea name="notes" rows={2} className="w-full py-2.5 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-zinc-200 resize-none focus:outline-none focus:ring-1 focus:ring-white/[0.12] transition-all" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-white text-zinc-900 font-medium text-[13px] rounded-xl hover:bg-zinc-100 transition-all">שמור בכספת</button>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Delete confirm */}
      {deleteConfirm && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative z-[100000] w-full max-w-[340px] p-6 rounded-2xl text-center"
            style={{ background: "rgba(12,12,18,0.95)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 80px -12px rgba(0,0,0,0.8)", animation: "dialog-in 200ms ease-out" }}>
            <Trash2 className="w-10 h-10 text-red-400 mx-auto mb-4" />
            <h3 className="text-[16px] font-bold text-white mb-2">מחיקת גישה</h3>
            <p className="text-[13px] text-zinc-300 mb-6">פעולה זו לא ניתנת לביטול. האם למחוק?</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all">
                כן, מחק
              </button>
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-medium bg-white/[0.05] text-zinc-300 border border-white/[0.1] hover:bg-white/[0.08] transition-all">
                ביטול
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
