"use client";

import {
  TrendingUp, TrendingDown, AlertTriangle, Info, Lightbulb,
  Smartphone, Monitor, Tablet, Clock, BarChart3, Target,
  Zap, MousePointerClick, Eye, ArrowDown,
} from "lucide-react";
import type { EnrichedAnalytics } from "@/lib/traffic-analyzer";

interface Props {
  analytics: EnrichedAnalytics;
}

function SourceIcon({ icon, className }: { icon: string; className?: string }) {
  switch (icon) {
    case "google": case "google-ads":
      return <span className={className}>G</span>;
    case "instagram":
      return <span className={className}>IG</span>;
    case "facebook":
      return <span className={className}>FB</span>;
    case "whatsapp":
      return <span className={className}>WA</span>;
    case "direct":
      return <Target className={className} />;
    default:
      return <BarChart3 className={className} />;
  }
}

function InsightIcon({ type }: { type: string }) {
  switch (type) {
    case "positive": return <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
    case "warning": return <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />;
    default: return <Lightbulb className="w-4 h-4 text-sky-400 flex-shrink-0" />;
  }
}

function DeviceTypeIcon({ type }: { type: string }) {
  if (type === "טלפון" || type === "mobile") return <Smartphone className="w-4 h-4" />;
  if (type === "טאבלט" || type === "tablet") return <Tablet className="w-4 h-4" />;
  return <Monitor className="w-4 h-4" />;
}

export function TrafficInsights({ analytics }: Props) {
  const {
    trafficBreakdown, hourlyDistribution, deviceBreakdown,
    conversionFunnel, bounceRate, insights,
    totalSessions, totalConversions, overallConversionRate,
  } = analytics;

  const maxHourCount = Math.max(...hourlyDistribution.map(h => h.count), 1);

  return (
    <div className="space-y-4 md:space-y-5">
      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-sky-400" />
            <span className="text-[11px] text-zinc-300">המרות</span>
          </div>
          <p className="text-lg font-bold text-white">{totalConversions}</p>
        </div>
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] text-zinc-300">שיעור המרה</span>
          </div>
          <p className="text-lg font-bold text-white">{overallConversionRate}%</p>
        </div>
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-[11px] text-zinc-300">שיעור נטישה</span>
          </div>
          <p className="text-lg font-bold text-white">{bounceRate}%</p>
        </div>
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-violet-400" />
            <span className="text-[11px] text-zinc-300">מקורות פעילים</span>
          </div>
          <p className="text-lg font-bold text-white">{trafficBreakdown.length}</p>
        </div>
      </div>

      {/* ── Insights Panel ── */}
      {insights.length > 0 && (
        <div className="surface rounded-2xl p-4 md:p-5">
          <h3 className="text-[15px] font-bold text-zinc-200 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            תובנות
          </h3>
          <div className="space-y-2">
            {insights.map((insight, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${
                insight.type === "positive" ? "bg-emerald-500/[0.06] border border-emerald-500/[0.1]" :
                insight.type === "warning" ? "bg-amber-500/[0.06] border border-amber-500/[0.1]" :
                "bg-sky-500/[0.06] border border-sky-500/[0.1]"
              }`}>
                <InsightIcon type={insight.type} />
                <p className="text-[13px] text-zinc-200 leading-relaxed">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        {/* ── Traffic Sources ── */}
        {trafficBreakdown.length > 0 && (
          <div className="surface rounded-2xl p-4 md:p-5">
            <h3 className="text-[15px] font-bold text-zinc-200 mb-4">מקורות תנועה</h3>
            <div className="space-y-3">
              {trafficBreakdown.map((source) => {
                const pct = totalSessions > 0 ? Math.round((source.sessions / totalSessions) * 100) : 0;
                return (
                  <div key={source.source} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: source.color + "30", color: source.color }}>
                          <SourceIcon icon={source.icon} className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[13px] text-zinc-200 font-medium">{source.label}</span>
                          <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                            <span>{source.sessions} מבקרים</span>
                            <span>·</span>
                            <span>{source.conversions} המרות</span>
                            <span>·</span>
                            <span>{source.avgTimeOnPage}ש׳ ממוצע</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left">
                        <span className="text-[14px] font-bold text-white">{pct}%</span>
                        {source.conversionRate > 0 && (
                          <p className="text-[10px] text-emerald-400">{source.conversionRate}% המרה</p>
                        )}
                      </div>
                    </div>
                    <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: source.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Conversion Funnel ── */}
        <div className="surface rounded-2xl p-4 md:p-5">
          <h3 className="text-[15px] font-bold text-zinc-200 mb-4 flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-sky-400" />
            משפך המרה
          </h3>
          <div className="space-y-2">
            {conversionFunnel.map((step, i) => {
              const width = conversionFunnel[0]?.count > 0
                ? Math.max(8, Math.round((step.count / conversionFunnel[0].count) * 100))
                : 0;
              const colors = ["from-sky-500 to-sky-400", "from-violet-500 to-violet-400", "from-amber-500 to-amber-400", "from-emerald-500 to-emerald-400"];
              return (
                <div key={step.step}>
                  {i > 0 && <div className="flex justify-center my-1"><ArrowDown className="w-3.5 h-3.5 text-zinc-500" /></div>}
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] text-zinc-300">{step.step}</span>
                        <span className="text-[12px] text-zinc-400 tabular-nums">{step.count} ({step.percentage}%)</span>
                      </div>
                      <div className="h-6 bg-white/[0.04] rounded-lg overflow-hidden">
                        <div className={`h-full bg-gradient-to-l ${colors[i]} rounded-lg flex items-center justify-end pe-2 transition-all duration-700`} style={{ width: `${width}%` }}>
                          {step.count > 0 && <span className="text-[10px] font-bold text-white/90">{step.count}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        {/* ── Hourly Distribution ── */}
        <div className="surface rounded-2xl p-4 md:p-5">
          <h3 className="text-[15px] font-bold text-zinc-200 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-violet-400" />
            התפלגות לפי שעות
          </h3>
          <div className="flex items-end gap-[3px] h-28" dir="ltr">
            {hourlyDistribution.map((h) => {
              const height = maxHourCount > 0 ? Math.max(2, (h.count / maxHourCount) * 100) : 2;
              return (
                <div key={h.hour} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div className="absolute -top-6 bg-zinc-800 text-[9px] text-zinc-300 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {String(h.hour).padStart(2, "0")}:00 — {h.count} מבקרים
                  </div>
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-sky-500/60 to-violet-500/60 group-hover:from-sky-400 group-hover:to-violet-400 transition-colors"
                    style={{ height: `${height}%` }}
                  />
                  {h.hour % 4 === 0 && <span className="text-[8px] text-zinc-500">{String(h.hour).padStart(2, "0")}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Device Breakdown ── */}
        <div className="surface rounded-2xl p-4 md:p-5">
          <h3 className="text-[15px] font-bold text-zinc-200 mb-4 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            מכשירים
          </h3>
          <div className="space-y-3">
            {deviceBreakdown.map((device) => (
              <div key={device.type} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-zinc-300">
                  <DeviceTypeIcon type={device.type} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] text-zinc-200">{device.type}</span>
                    <span className="text-[12px] text-zinc-400 tabular-nums">{device.count} ({device.percentage}%)</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-l from-sky-500 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${device.percentage}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
