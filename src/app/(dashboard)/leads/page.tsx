import { getLeads } from "@/lib/dal/leads";
import { LiveRefresh } from "@/components/LiveRefresh";
import { PushToggle } from "@/components/notifications/PushToggle";
import { Phone, MessageCircle, Inbox } from "lucide-react";

export const dynamic = "force-dynamic";

function waLink(phone: string): string {
  let d = (phone || "").replace(/\D/g, "");
  if (d.startsWith("0")) d = "972" + d.slice(1);
  return "https://wa.me/" + d;
}

function timeAgo(d: Date): string {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "הרגע";
  const m = Math.floor(s / 60);
  if (m < 60) return `לפני ${m} ד׳`;
  const h = Math.floor(m / 60);
  if (h < 24) return `לפני ${h} ש׳`;
  const days = Math.floor(h / 24);
  return `לפני ${days} ימים`;
}

export default async function LeadsPage() {
  const leads = await getLeads(200);

  return (
    <div className="space-y-4 md:space-y-6">
      <LiveRefresh interval={20} />

      <div className="flex flex-wrap items-start justify-between gap-3 animate-slide-up stagger-1">
        <div>
          <h1 className="text-[clamp(1.2rem,3vw,1.375rem)] font-bold text-white tracking-tight">פניות</h1>
          <p className="text-zinc-300 mt-0.5 text-[clamp(0.75rem,2vw,0.875rem)]">
            לידים שנכנסו מדפי הנחיתה — {leads.length} פניות
          </p>
        </div>
        <PushToggle />
      </div>

      {leads.length === 0 ? (
        <div className="animate-slide-up stagger-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-10 text-center">
          <Inbox className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
          <p className="text-zinc-300 font-semibold">עדיין אין פניות</p>
          <p className="text-zinc-500 text-sm mt-1">ברגע שמישהו ימלא את הטופס בדף הנחיתה, הפנייה תופיע כאן ותגיע אליך התראה.</p>
        </div>
      ) : (
        <div className="grid gap-3 animate-slide-up stagger-2 sm:grid-cols-2 xl:grid-cols-3">
          {leads.map((l) => (
            <div key={l.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white truncate">{l.name}</span>
                    {l.status === "new" && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/25 rounded-full px-2 py-0.5 shrink-0">חדש</span>
                    )}
                  </div>
                  <a href={`tel:${l.phone}`} className="text-sky-400 text-sm font-mono" dir="ltr">{l.phone}</a>
                </div>
                <span className="text-[11px] text-zinc-500 shrink-0">{timeAgo(l.createdAt)}</span>
              </div>

              <div className="text-xs text-zinc-400 space-y-1">
                {l.services && <div><span className="text-zinc-500">מבקש/ת: </span>{l.services}</div>}
                {l.business && <div><span className="text-zinc-500">תחום: </span>{l.business}</div>}
                {l.budget && <div><span className="text-zinc-500">תקציב: </span>{l.budget}</div>}
                {l.source && <div><span className="text-zinc-500">מקור: </span>{l.source}</div>}
              </div>

              <div className="flex gap-2 mt-auto pt-1">
                <a href={`tel:${l.phone}`} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/25 text-xs font-semibold py-2 hover:bg-sky-500/25 transition-colors">
                  <Phone className="w-3.5 h-3.5" /> חייג
                </a>
                <a href={waLink(l.phone)} target="_blank" rel="noopener" className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-xs font-semibold py-2 hover:bg-emerald-500/25 transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" /> וואטסאפ
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
