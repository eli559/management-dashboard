/** Hebrew labels for page paths */
const PAGE_LABELS: Record<string, string> = {
  "/": "עמוד ראשי",
  "/index.html": "עמוד ראשי",
  "/about": "אודות",
  "/contact": "יצירת קשר",
  "/pricing": "מחירים",
  "/services": "שירותים",
  "/gallery": "גלריה",
  "/blog": "בלוג",
  "/faq": "שאלות נפוצות",
  "/terms": "תנאי שימוש",
  "/privacy": "מדיניות פרטיות",
  "/dashboard": "דשבורד",
  "/settings": "הגדרות",
  "/login": "התחברות",
  "/register": "הרשמה",
  "/signup": "הרשמה",
  "/docs": "תיעוד",
  "/neon-works": "בדיקת חיבור",
  "/test": "בדיקה",
  "/neon-test": "בדיקה",
  "/verify-fix": "אימות",
  "/trainer-app-test": "בדיקה",
};

export function getPageLabel(path: string | null): string {
  if (!path) return "לא ידוע";

  // Exact match
  const exact = PAGE_LABELS[path];
  if (exact) return exact;

  // Try without trailing slash
  const clean = path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
  const cleanMatch = PAGE_LABELS[clean];
  if (cleanMatch) return cleanMatch;

  // Return path as-is if no translation
  return path;
}
