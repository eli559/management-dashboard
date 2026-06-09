/**
 * Explains JS errors in Hebrew — what happened, who needs to fix it.
 */

interface ErrorExplanation {
  title: string;       // כותרת קצרה בעברית
  explanation: string; // הסבר מה קרה
  whoFixes: "developer" | "user" | "network" | "unknown";
  whoLabel: string;    // מי צריך לתקן
  suggestion: string;  // מה לעשות
}

const PATTERNS: Array<{ test: (msg: string) => boolean; explain: (msg: string) => ErrorExplanation }> = [
  // Network errors
  {
    test: (m) => /fetch|network|failed to fetch|net::err|cors|mixed content|load failed/i.test(m),
    explain: () => ({
      title: "שגיאת רשת",
      explanation: "הדפדפן לא הצליח להתחבר לשרת. ייתכן שיש בעיית אינטרנט אצל המשתמש, או שהשרת לא זמין.",
      whoFixes: "network",
      whoLabel: "בעיית רשת / משתמש",
      suggestion: "בדרך כלל זו בעיה זמנית אצל המשתמש. אם זה חוזר הרבה — בדוק שה-API endpoint נגיש.",
    }),
  },
  // TypeError
  {
    test: (m) => /typeerror|cannot read prop|is not a function|undefined is not|null is not/i.test(m),
    explain: (msg) => ({
      title: "שגיאת קוד (TypeError)",
      explanation: "הקוד ניסה לגשת למשהו שלא קיים — למשל משתנה ריק או פונקציה שלא מוגדרת.",
      whoFixes: "developer",
      whoLabel: "דורש תיקון בקוד",
      suggestion: "צריך לבדוק את הקוד באזור שבו קרתה השגיאה ולוודא שכל המשתנים מוגדרים.",
    }),
  },
  // ReferenceError
  {
    test: (m) => /referenceerror|is not defined/i.test(m),
    explain: () => ({
      title: "משתנה לא מוגדר",
      explanation: "הקוד מנסה להשתמש במשתנה או פונקציה שלא קיימים.",
      whoFixes: "developer",
      whoLabel: "דורש תיקון בקוד",
      suggestion: "בדוק שהמשתנה מוגדר ושהקובץ שמכיל אותו נטען.",
    }),
  },
  // SyntaxError
  {
    test: (m) => /syntaxerror|unexpected token|unexpected end/i.test(m),
    explain: () => ({
      title: "שגיאת תחביר",
      explanation: "יש שגיאה בכתיבת הקוד — סוגריים חסרים, פסיק מיותר, או תבנית לא תקינה.",
      whoFixes: "developer",
      whoLabel: "דורש תיקון בקוד",
      suggestion: "בדוק את הקובץ שמצוין ב-stack trace ותקן את התחביר.",
    }),
  },
  // ChunkLoadError / module load
  {
    test: (m) => /chunk|loading chunk|dynamic import|module/i.test(m),
    explain: () => ({
      title: "שגיאת טעינת קובץ",
      explanation: "הדפדפן לא הצליח לטעון חלק מהאתר. קורה בדרך כלל אחרי עדכון כשהדפדפן משתמש בקבצים ישנים.",
      whoFixes: "user",
      whoLabel: "רענון דף יפתור",
      suggestion: "המשתמש צריך לרענן את הדף. אם זה ממשיך — לנקות cache.",
    }),
  },
  // ResizeObserver
  {
    test: (m) => /resizeobserver/i.test(m),
    explain: () => ({
      title: "שגיאת גודל אלמנט",
      explanation: "שגיאה טכנית לא מזיקה שקשורה לשינוי גודל אלמנטים בדף. לא משפיעה על המשתמש.",
      whoFixes: "unknown",
      whoLabel: "לא דורש טיפול",
      suggestion: "שגיאה בטוחה להתעלם ממנה. היא לא משפיעה על חווית המשתמש.",
    }),
  },
  // Script error (cross-origin)
  {
    test: (m) => /^script error\.?$/i.test(m.trim()),
    explain: () => ({
      title: "שגיאה מסקריפט חיצוני",
      explanation: "שגיאה שקרתה בסקריפט של צד שלישי (למשל גוגל אנליטיקס, פייסבוק פיקסל). הדפדפן מסתיר את הפרטים מסיבות אבטחה.",
      whoFixes: "unknown",
      whoLabel: "סקריפט חיצוני",
      suggestion: "בדרך כלל לא צריך לטפל. אם זה חוזר — בדוק אילו סקריפטים חיצוניים טעונים.",
    }),
  },
  // Unhandled promise rejection
  {
    test: (m) => /unhandled.*promise|promise.*reject/i.test(m),
    explain: () => ({
      title: "Promise לא מטופל",
      explanation: "פעולה אסינכרונית (למשל קריאת API) נכשלה בלי שהקוד טיפל בשגיאה.",
      whoFixes: "developer",
      whoLabel: "דורש תיקון בקוד",
      suggestion: "צריך להוסיף try-catch או .catch() לפעולה שנכשלה.",
    }),
  },
];

export function explainError(message: string): ErrorExplanation {
  const m = message || "";
  for (const pattern of PATTERNS) {
    if (pattern.test(m)) return pattern.explain(m);
  }

  return {
    title: "שגיאה כללית",
    explanation: "שגיאת JavaScript שלא זוהתה כתבנית מוכרת.",
    whoFixes: "developer",
    whoLabel: "דורש בדיקה",
    suggestion: "בדוק את הודעת השגיאה וה-stack trace כדי להבין מה קרה.",
  };
}

export function truncateError(message: string, maxLen = 30): string {
  if (!message) return "שגיאה לא ידועה";
  if (message.length <= maxLen) return message;
  return message.substring(0, maxLen) + "...";
}
