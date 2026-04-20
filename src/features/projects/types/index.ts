export const PROJECT_TYPE_LABELS: Record<string, string> = {
  WEBSITE: "אתר",
  MOBILE_APP: "אפליקציה",
  API: "API",
  SAAS: "SaaS",
  OTHER: "אחר",
};

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "פעיל",
  PAUSED: "מושהה",
  ARCHIVED: "בארכיון",
};

export const PROJECT_TYPE_COLORS: Record<string, string> = {
  WEBSITE: "bg-blue-500/10 text-blue-400 border-blue-500/10",
  MOBILE_APP: "bg-violet-500/10 text-violet-400 border-violet-500/10",
  API: "bg-amber-500/10 text-amber-400 border-amber-500/10",
  SAAS: "bg-emerald-500/10 text-emerald-400 border-emerald-500/10",
  OTHER: "bg-white/[0.06] text-zinc-400 border-white/[0.06]",
};

export const PROJECT_STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-emerald-400",
  PAUSED: "bg-amber-400",
  ARCHIVED: "bg-zinc-500",
};

export const PROJECT_TYPE_OPTIONS = [
  { value: "WEBSITE", label: "אתר" },
  { value: "MOBILE_APP", label: "אפליקציה" },
  { value: "API", label: "API" },
  { value: "SAAS", label: "SaaS" },
  { value: "OTHER", label: "אחר" },
];
