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
  js_error: "שגיאת JavaScript",
  // אפליקציית אימונים
  water_update: "עדכון שתייה",
  sleep_update: "עדכון שינה",
  meal_add: "הוספת ארוחה",
  meal_delete: "מחיקת ארוחה",
  quick_add: "הוספה מהירה",
  workout_view: "צפייה באימון",
  weight_update: "עדכון משקל",
  period_toggle: "סימון מחזור",
  nutrition_view: "צפייה בערכים תזונתיים",
  trainee_login: "כניסת מתאמן",
  trainer_login: "כניסת מאמן",
  chat_message: "הודעת צ׳אט",
  favorite_add: "הוספה למועדפים",
  favorite_remove: "הסרה ממועדפים",
};

export function getEventLabel(eventName: string): string {
  return EVENT_LABELS[eventName] ?? eventName;
}
