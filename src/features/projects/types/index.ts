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
  WEBSITE: "bg-blue-50 text-blue-700",
  MOBILE_APP: "bg-purple-50 text-purple-700",
  API: "bg-amber-50 text-amber-700",
  SAAS: "bg-emerald-50 text-emerald-700",
  OTHER: "bg-slate-100 text-slate-700",
};

export const PROJECT_STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-emerald-500",
  PAUSED: "bg-amber-500",
  ARCHIVED: "bg-slate-400",
};

export const PROJECT_TYPE_OPTIONS = [
  { value: "WEBSITE", label: "אתר" },
  { value: "MOBILE_APP", label: "אפליקציה" },
  { value: "API", label: "API" },
  { value: "SAAS", label: "SaaS" },
  { value: "OTHER", label: "אחר" },
];
