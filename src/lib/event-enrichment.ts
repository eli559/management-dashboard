/**
 * Enriches event data for display — extracts meaningful info from metadata.
 * Used in tables and breakdowns to show human-readable details.
 */

export function enrichEventDescription(eventName: string, metadata: string | null): string {
  if (!metadata) return "";

  try {
    const meta = typeof metadata === "string" ? JSON.parse(metadata) : metadata;

    switch (eventName) {
      case "time_on_page": {
        const seconds = Number(meta.seconds);
        if (!seconds || seconds < 1) return "";
        if (seconds < 60) return `${seconds} שניות`;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return secs > 0 ? `${mins} דקות ו-${secs} שניות` : `${mins} דקות`;
      }

      case "scroll_depth": {
        const depth = Number(meta.depth);
        if (!depth) return "";
        if (depth >= 100) return "גלל עד סוף הדף";
        if (depth >= 75) return "גלל 75% מהדף";
        if (depth >= 50) return "גלל עד אמצע הדף";
        if (depth >= 25) return "גלל 25% מהדף";
        return `גלל ${depth}%`;
      }

      case "click_cta":
      case "button_click": {
        const text = meta.text || meta.element_id;
        if (text) return `כפתור: "${text}"`;
        return "";
      }

      case "click_whatsapp":
        return "פתח וואטסאפ";

      case "click_instagram":
        return "פתח אינסטגרם";

      case "click_phone": {
        const number = meta.number;
        return number ? `חייג: ${number}` : "חייג";
      }

      case "click_waze":
        return "פתח ניווט ב-Waze";

      case "click_external": {
        const href = meta.href;
        if (href) {
          try {
            return new URL(href).hostname;
          } catch {
            return href.substring(0, 40);
          }
        }
        return "";
      }

      case "form_submit":
      case "booking_submit": {
        const formId = meta.form_id;
        if (formId && formId !== "unknown") return `טופס: ${formId}`;
        return "";
      }

      case "js_error": {
        const msg = meta.message;
        return msg ? String(msg).substring(0, 60) : "";
      }

      case "water_update": {
        const liters = Number(meta.glasses ?? meta.liters ?? meta.value);
        return liters ? `${liters} ליטר` : "";
      }

      case "sleep_update": {
        const hours = Number(meta.hours ?? meta.value);
        return hours ? `${hours} שעות` : "";
      }

      case "meal_add":
      case "quick_add": {
        const name = meta.name ?? meta.meal_name ?? meta.food;
        const cal = meta.calories;
        if (name && cal) return `${name} (${cal} קל׳)`;
        if (name) return String(name);
        if (cal) return `${cal} קלוריות`;
        return "";
      }

      case "meal_delete": {
        const mealName = meta.name ?? meta.meal_name;
        return mealName ? `${mealName}` : "";
      }

      case "weight_update": {
        const kg = meta.weight ?? meta.value;
        return kg ? `${kg} ק״ג` : "";
      }

      case "trainee_login":
      case "trainer_login": {
        const userName = meta.name ?? meta.user;
        return userName ? String(userName) : "";
      }

      case "chat_message":
        return meta.direction === "sent" ? "נשלחה הודעה" : "התקבלה הודעה";

      default:
        return "";
    }
  } catch {
    return "";
  }
}
