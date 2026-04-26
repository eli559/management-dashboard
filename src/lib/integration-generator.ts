const ENDPOINT = "https://management-dashboard-248948614304.me-west1.run.app/api/events/ingest";

export function generateTrackingCode(apiKey: string): string {
  return `/**
 * Analytics Tracking — מערכת ניהול פרויקטים
 * קוד מעקב אוטומטי. אין תלויות חיצוניות.
 * שולח page_view בכל כניסה לדף.
 */

var TRACKING_API_KEY = '${apiKey}';
var TRACKING_ENDPOINT = '${ENDPOINT}';

;(function() {
  try {
    if (typeof window === 'undefined') return;
    var sid = sessionStorage.getItem('_t_sid') || (function() {
      var id = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      try { sessionStorage.setItem('_t_sid', id); } catch(e) {}
      return id;
    })();

    function send(eventName, metadata) {
      try {
        fetch(TRACKING_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey: TRACKING_API_KEY,
            eventName: eventName,
            sessionId: sid,
            userIdentifier: null,
            page: window.location.pathname,
            value: null,
            metadata: Object.assign({ ua: navigator.userAgent.substring(0, 200), screen: window.innerWidth + 'x' + window.innerHeight }, metadata || {})
          }),
          keepalive: true
        }).catch(function() {});
      } catch(e) {}
    }

    // Click tracking
    document.addEventListener('click', function(e) {
      var el = e.target;
      while (el && el !== document.body) {
        var href = el.getAttribute && el.getAttribute('href') || '';
        if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp') !== -1) { send('click_whatsapp'); return; }
        if (href.indexOf('instagram.com') !== -1) { send('click_instagram'); return; }
        if (href.indexOf('tel:') === 0) { send('click_phone'); return; }
        if (href.indexOf('waze.com') !== -1) { send('click_waze'); return; }
        var cls = typeof el.className === 'string' ? el.className : '';
        if (cls.indexOf('btn') !== -1 || cls.indexOf('cta') !== -1) { send('click_cta', { text: (el.textContent || '').trim().substring(0, 50) }); return; }
        el = el.parentElement;
      }
    }, true);

    // Scroll depth
    var marks = {};
    window.addEventListener('scroll', function() {
      var pct = Math.round((window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
      [25, 50, 75, 100].forEach(function(m) { if (pct >= m && !marks[m]) { marks[m] = true; send('scroll_depth', { depth: m }); } });
    }, { passive: true });

    // Form submit
    document.addEventListener('submit', function(e) {
      send('form_submit', { form_id: e.target.id || 'unknown' });
    }, true);

    // Time on page
    var t0 = Date.now();
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'hidden') { var s = Math.round((Date.now() - t0) / 1000); if (s > 2) send('time_on_page', { seconds: s }); }
    });

    // Page view
    send('page_view', { url: window.location.href, referrer: document.referrer ? document.referrer.substring(0, 200) : '' });
  } catch(e) {}
})();`;
}

export function generateClaudePrompt(apiKey: string, projectName: string): string {
  return `# משימה: הטמעת מעקב אנליטי בפרויקט הזה

אתה מטמיע מערכת מעקב אנליטי פרטית בפרויקט הזה. המערכת שייכת לבעל האתר — זה לא שירות חיצוני.

## כללים קריטיים

1. **אל תשנה שום לוגיקה קיימת, UI, או קוד**
2. **אל תתקין חבילות npm**
3. **צור קובץ אחד בלבד:** \`tracking.js\`
4. **הוסף שורת import אחת** לקובץ הראשי
5. **אל תשלח מידע רגיש** — לא תוכן טפסים, לא סיסמאות, לא PII

## הגדרות

- **שם הפרויקט:** ${projectName}
- **API Key:** \`${apiKey}\`
- **Endpoint:** \`${ENDPOINT}\`

## שלב 1 — צור \`tracking.js\`

צור את הקובץ \`tracking.js\` (או \`src/lib/tracking.js\` אם יש תיקיית src) עם התוכן הבא:

\`\`\`js
var TRACKING_API_KEY = '${apiKey}';
var TRACKING_ENDPOINT = '${ENDPOINT}';

;(function() {
  try {
    if (typeof window === 'undefined') return;
    var sid = sessionStorage.getItem('_t_sid') || (function() {
      var id = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      try { sessionStorage.setItem('_t_sid', id); } catch(e) {}
      return id;
    })();

    function send(eventName, metadata) {
      try {
        fetch(TRACKING_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey: TRACKING_API_KEY, eventName: eventName, sessionId: sid,
            userIdentifier: null, page: window.location.pathname, value: null,
            metadata: Object.assign({ ua: navigator.userAgent.substring(0,200) }, metadata || {})
          }),
          keepalive: true
        }).catch(function() {});
      } catch(e) {}
    }

    document.addEventListener('click', function(e) {
      var el = e.target;
      while (el && el !== document.body) {
        var href = el.getAttribute && el.getAttribute('href') || '';
        if (href.indexOf('wa.me') !== -1) { send('click_whatsapp'); return; }
        if (href.indexOf('instagram.com') !== -1) { send('click_instagram'); return; }
        if (href.indexOf('tel:') === 0) { send('click_phone'); return; }
        el = el.parentElement;
      }
    }, true);

    document.addEventListener('submit', function(e) {
      send('form_submit', { form_id: e.target.id || 'unknown' });
    }, true);

    send('page_view', { url: window.location.href });
  } catch(e) {}
})();
\`\`\`

## שלב 2 — הוסף import

מצא את קובץ ה-HTML הראשי או קובץ ה-entry של האפליקציה והוסף:

**HTML:** \`<script src="tracking.js"></script>\` לפני \`</body>\`
**React/Vite:** \`import "./lib/tracking";\` ב-\`main.jsx\`

## שלב 3 — סיום

זהו. הקובץ שולח page_view אוטומטי + לחיצות על וואטסאפ, אינסטגרם וטלפון.`;
}
