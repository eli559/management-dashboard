/** ניתוח מקורות תנועה ותובנות מהמידע הקיים */

export interface TrafficSource {
  source: string;
  medium: string;
  campaign: string;
  label: string;
  icon: "google" | "google-ads" | "instagram" | "facebook" | "whatsapp" | "direct" | "organic" | "other";
  color: string;
}

export interface VisitorInsight {
  type: "positive" | "warning" | "info";
  text: string;
}

export interface TrafficBreakdown {
  source: string;
  label: string;
  icon: TrafficSource["icon"];
  color: string;
  sessions: number;
  conversions: number;
  conversionRate: number;
  avgEvents: number;
  avgTimeOnPage: number;
}

export interface HourlyData {
  hour: number;
  count: number;
}

export interface DeviceBreakdown {
  type: string;
  count: number;
  percentage: number;
}

export interface EnrichedAnalytics {
  trafficBreakdown: TrafficBreakdown[];
  hourlyDistribution: HourlyData[];
  deviceBreakdown: DeviceBreakdown[];
  conversionFunnel: { step: string; count: number; percentage: number }[];
  bounceRate: number;
  insights: VisitorInsight[];
  totalSessions: number;
  totalConversions: number;
  overallConversionRate: number;
}

const SOURCE_MAP: Record<string, { label: string; icon: TrafficSource["icon"]; color: string }> = {
  "google-ads":  { label: "Google Ads",     icon: "google-ads",  color: "#4285F4" },
  "google":      { label: "גוגל אורגני",   icon: "google",      color: "#34A853" },
  "instagram":   { label: "אינסטגרם",       icon: "instagram",   color: "#E1306C" },
  "facebook":    { label: "פייסבוק",        icon: "facebook",    color: "#1877F2" },
  "whatsapp":    { label: "וואטסאפ",        icon: "whatsapp",    color: "#25D366" },
  "direct":      { label: "ישיר",           icon: "direct",      color: "#8B5CF6" },
  "other":       { label: "אחר",            icon: "other",       color: "#6B7280" },
};

function extractUtmFromUrl(url: string): { source: string; medium: string; campaign: string; content: string; term: string; gclid: boolean; fbclid: boolean } {
  const result = { source: "", medium: "", campaign: "", content: "", term: "", gclid: false, fbclid: false };
  try {
    const u = new URL(url);
    result.source = u.searchParams.get("utm_source") ?? "";
    result.medium = u.searchParams.get("utm_medium") ?? "";
    result.campaign = u.searchParams.get("utm_campaign") ?? "";
    result.content = u.searchParams.get("utm_content") ?? "";
    result.term = u.searchParams.get("utm_term") ?? "";
    result.gclid = !!u.searchParams.get("gclid");
    result.fbclid = !!u.searchParams.get("fbclid");
  } catch {}
  return result;
}

function classifyReferrer(referrer: string): string {
  if (!referrer) return "direct";
  const r = referrer.toLowerCase();
  if (r.includes("google")) return "google";
  if (r.includes("instagram") || r.includes("l.instagram.com")) return "instagram";
  if (r.includes("facebook") || r.includes("l.facebook.com") || r.includes("lm.facebook.com")) return "facebook";
  if (r.includes("whatsapp") || r.includes("wa.me")) return "whatsapp";
  if (r.includes("bing")) return "other";
  if (r.includes("yahoo")) return "other";
  return "other";
}

export function classifySource(metadata: Record<string, unknown>, referrer?: string): string {
  const url = String(metadata?.url ?? "");
  const utm = extractUtmFromUrl(url);

  if (utm.gclid) return "google-ads";
  if (utm.source === "google" && utm.medium === "cpc") return "google-ads";

  if (utm.fbclid) {
    const ref = String(metadata?.referrer ?? referrer ?? "").toLowerCase();
    if (ref.includes("instagram")) return "instagram";
    return "facebook";
  }

  if (utm.source) {
    const s = utm.source.toLowerCase();
    if (s === "ig" || s === "instagram") return "instagram";
    if (s === "fb" || s === "facebook") return "facebook";
    if (s === "google") return utm.medium === "organic" ? "google" : "google";
    if (s === "whatsapp") return "whatsapp";
    return "other";
  }

  const ref = String(metadata?.referrer ?? referrer ?? "");
  if (!ref) return "direct";
  return classifyReferrer(ref);
}

export function getSourceInfo(sourceKey: string) {
  return SOURCE_MAP[sourceKey] ?? SOURCE_MAP["other"];
}

export function getUtmDetails(metadata: Record<string, unknown>): { source: string; medium: string; campaign: string; content: string; term: string } | null {
  const url = String(metadata?.url ?? "");
  const utm = extractUtmFromUrl(url);
  if (!utm.source && !utm.medium && !utm.campaign) return null;
  return { source: utm.source, medium: utm.medium, campaign: utm.campaign, content: utm.content, term: utm.term };
}

const CONVERSION_EVENTS = new Set([
  "click_whatsapp", "click_phone", "click_cta", "form_submit", "booking_submit",
  "click_instagram", "click_waze", "signup", "purchase",
]);

export function isConversion(eventName: string): boolean {
  return CONVERSION_EVENTS.has(eventName);
}

interface RawSessionData {
  sessionId: string;
  events: { eventName: string; metadata: string; createdAt: Date }[];
  deviceType: string;
}

export function analyzeTraffic(sessions: RawSessionData[]): EnrichedAnalytics {
  const sourceGroups: Record<string, { sessions: RawSessionData[]; conversions: number; totalEvents: number; totalTime: number }> = {};
  const hourCounts: Record<number, number> = {};
  const deviceCounts: Record<string, number> = {};
  let totalConversions = 0;
  let bounceSessions = 0;

  const funnelCounts = { page_view: 0, scroll: 0, click_cta: 0, conversion: 0 };

  for (const session of sessions) {
    const firstEvent = session.events[0];
    let meta: Record<string, unknown> = {};
    try { meta = JSON.parse(firstEvent?.metadata ?? "{}"); } catch {}

    const sourceKey = classifySource(meta);
    if (!sourceGroups[sourceKey]) {
      sourceGroups[sourceKey] = { sessions: [], conversions: 0, totalEvents: 0, totalTime: 0 };
    }

    const group = sourceGroups[sourceKey];
    group.sessions.push(session);
    group.totalEvents += session.events.length;

    let hasConversion = false;
    let hasPageView = false;
    let hasScroll = false;
    let hasCta = false;
    let maxTime = 0;

    for (const evt of session.events) {
      if (isConversion(evt.eventName)) hasConversion = true;
      if (evt.eventName === "page_view") hasPageView = true;
      if (evt.eventName === "scroll_depth") hasScroll = true;
      if (evt.eventName === "click_cta" || evt.eventName === "click_whatsapp" || evt.eventName === "click_phone") hasCta = true;

      try {
        const m = JSON.parse(evt.metadata ?? "{}");
        if (m.seconds && typeof m.seconds === "number") maxTime = Math.max(maxTime, m.seconds);
      } catch {}
    }

    if (hasConversion) { group.conversions++; totalConversions++; }
    group.totalTime += maxTime;

    if (hasPageView) funnelCounts.page_view++;
    if (hasScroll) funnelCounts.scroll++;
    if (hasCta) funnelCounts.click_cta++;
    if (hasConversion) funnelCounts.conversion++;

    if (session.events.length <= 1) bounceSessions++;

    const hour = firstEvent?.createdAt ? new Date(firstEvent.createdAt).getHours() : 0;
    hourCounts[hour] = (hourCounts[hour] ?? 0) + 1;

    const dev = session.deviceType || "מחשב";
    deviceCounts[dev] = (deviceCounts[dev] ?? 0) + 1;
  }

  const trafficBreakdown: TrafficBreakdown[] = Object.entries(sourceGroups)
    .map(([key, data]) => {
      const info = getSourceInfo(key);
      return {
        source: key,
        label: info.label,
        icon: info.icon,
        color: info.color,
        sessions: data.sessions.length,
        conversions: data.conversions,
        conversionRate: data.sessions.length > 0 ? Math.round((data.conversions / data.sessions.length) * 100) : 0,
        avgEvents: data.sessions.length > 0 ? Math.round(data.totalEvents / data.sessions.length) : 0,
        avgTimeOnPage: data.sessions.length > 0 ? Math.round(data.totalTime / data.sessions.length) : 0,
      };
    })
    .sort((a, b) => b.sessions - a.sessions);

  const hourlyDistribution: HourlyData[] = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: hourCounts[i] ?? 0,
  }));

  const totalDevices = Object.values(deviceCounts).reduce((a, b) => a + b, 0);
  const deviceBreakdown: DeviceBreakdown[] = Object.entries(deviceCounts)
    .map(([type, count]) => ({ type, count, percentage: totalDevices > 0 ? Math.round((count / totalDevices) * 100) : 0 }))
    .sort((a, b) => b.count - a.count);

  const total = sessions.length;
  const conversionFunnel = [
    { step: "צפייה בדף", count: funnelCounts.page_view, percentage: total > 0 ? Math.round((funnelCounts.page_view / total) * 100) : 0 },
    { step: "גלילה בעמוד", count: funnelCounts.scroll, percentage: total > 0 ? Math.round((funnelCounts.scroll / total) * 100) : 0 },
    { step: "לחיצה על כפתור", count: funnelCounts.click_cta, percentage: total > 0 ? Math.round((funnelCounts.click_cta / total) * 100) : 0 },
    { step: "המרה", count: funnelCounts.conversion, percentage: total > 0 ? Math.round((funnelCounts.conversion / total) * 100) : 0 },
  ];

  const bounceRate = total > 0 ? Math.round((bounceSessions / total) * 100) : 0;
  const overallConversionRate = total > 0 ? Math.round((totalConversions / total) * 100) : 0;

  const insights = generateInsights(trafficBreakdown, bounceRate, hourlyDistribution, deviceBreakdown, conversionFunnel, total);

  return {
    trafficBreakdown,
    hourlyDistribution,
    deviceBreakdown,
    conversionFunnel,
    bounceRate,
    insights,
    totalSessions: total,
    totalConversions,
    overallConversionRate,
  };
}

function generateInsights(
  traffic: TrafficBreakdown[],
  bounceRate: number,
  hourly: HourlyData[],
  devices: DeviceBreakdown[],
  funnel: { step: string; count: number; percentage: number }[],
  total: number,
): VisitorInsight[] {
  const insights: VisitorInsight[] = [];
  if (total < 5) return insights;

  const topSource = traffic[0];
  if (topSource && total > 0) {
    const pct = Math.round((topSource.sessions / total) * 100);
    insights.push({
      type: "info",
      text: `${topSource.label} מביא ${pct}% מהתנועה שלך (${topSource.sessions} מבקרים)`,
    });
  }

  const bestConverter = [...traffic].filter(t => t.sessions >= 3).sort((a, b) => b.conversionRate - a.conversionRate)[0];
  if (bestConverter && bestConverter.conversionRate > 0) {
    insights.push({
      type: "positive",
      text: `${bestConverter.label} הוא המקור עם שיעור ההמרה הגבוה ביותר — ${bestConverter.conversionRate}%`,
    });
  }

  const worstConverter = [...traffic].filter(t => t.sessions >= 3 && t.conversionRate === 0)[0];
  if (worstConverter) {
    insights.push({
      type: "warning",
      text: `${worstConverter.label} מביא ${worstConverter.sessions} מבקרים אבל ללא המרות — שווה לבדוק`,
    });
  }

  if (bounceRate > 60) {
    insights.push({
      type: "warning",
      text: `שיעור נטישה גבוה: ${bounceRate}% — רוב המבקרים עוזבים אחרי צפייה אחת`,
    });
  } else if (bounceRate < 30 && total > 10) {
    insights.push({
      type: "positive",
      text: `שיעור נטישה נמוך: ${bounceRate}% — המבקרים מעורבים באתר`,
    });
  }

  const peakHour = hourly.reduce((best, h) => h.count > best.count ? h : best, hourly[0]);
  if (peakHour && peakHour.count > 0) {
    insights.push({
      type: "info",
      text: `שעת השיא: ${String(peakHour.hour).padStart(2, "0")}:00 — הזמן הכי טוב לפרסם`,
    });
  }

  const mobile = devices.find(d => d.type === "טלפון" || d.type === "mobile");
  if (mobile && mobile.percentage > 70) {
    insights.push({
      type: "info",
      text: `${mobile.percentage}% מהמבקרים גולשים מהטלפון — תוודא שהאתר מותאם למובייל`,
    });
  }

  const funnelDrop = funnel[0] && funnel[2] ? funnel[0].count - funnel[2].count : 0;
  if (funnel[0] && funnel[0].count > 10 && funnel[2] && funnel[2].count === 0) {
    insights.push({
      type: "warning",
      text: `${funnel[0].count} מבקרים נכנסו אבל אף אחד לא לחץ על כפתור — שקול לשפר את ה-CTA`,
    });
  }

  return insights;
}
