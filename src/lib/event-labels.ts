/** Hebrew labels for event names displayed in the dashboard */
export const EVENT_LABELS: Record<string, string> = {
  page_view: "צפייה בדף",
  click_whatsapp: "לחיצה על וואטסאפ",
  click_instagram: "לחיצה על אינסטגרם",
  click_phone: "לחיצה על טלפון",
  click_cta: "לחיצה על כפתור",
  click_external: "לחיצה על קישור חיצוני",
  scroll_depth: "עומק גלילה",
  form_submit: "שליחת טופס",
  time_on_page: "זמן בדף",
  button_click: "לחיצה על כפתור",
  signup: "הרשמה",
  login: "התחברות",
  purchase: "רכישה",
  search: "חיפוש",
  download: "הורדה",
  test_event: "אירוע בדיקה",
  click_waze: "לחיצה על Waze",
  booking_submit: "הזמנת תור",
  test_neon: "בדיקת חיבור",
};

export function getEventLabel(eventName: string): string {
  return EVENT_LABELS[eventName] ?? eventName;
}
