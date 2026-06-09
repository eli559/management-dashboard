/* DIGITALCRAFT management — push notifications service worker */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = { title: "פנייה חדשה", body: "מישהו השאיר פרטים", url: "/leads" };
  try {
    if (event.data) data = Object.assign(data, event.data.json());
  } catch (e) { /* keep defaults */ }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      dir: "rtl",
      lang: "he",
      tag: "lead",
      renotify: true,
      vibrate: [120, 60, 120],
      data: { url: data.url || "/leads" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/leads";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ("focus" in c) {
          if ("navigate" in c) { try { c.navigate(url); } catch (e) {} }
          return c.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
