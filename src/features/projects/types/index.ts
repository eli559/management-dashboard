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
  WEBSITE: "bg-zinc-100 text-zinc-700",
  MOBILE_APP: "bg-zinc-100 text-zinc-700",
  API: "bg-zinc-100 text-zinc-700",
  SAAS: "bg-zinc-100 text-zinc-700",
  OTHER: "bg-zinc-100 text-zinc-600",
};

export const PROJECT_STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-emerald-600",
  PAUSED: "bg-amber-500",
  ARCHIVED: "bg-zinc-400",
};

export const PROJECT_TYPE_OPTIONS = [
  { value: "WEBSITE", label: "אתר" },
  { value: "MOBILE_APP", label: "אפליקציה" },
  { value: "API", label: "API" },
  { value: "SAAS", label: "SaaS" },
  { value: "OTHER", label: "אחר" },
];
