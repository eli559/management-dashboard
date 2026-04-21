/** Parse user agent string to device type and name in Hebrew */

export interface DeviceInfo {
  type: string;  // "טלפון" | "מחשב" | "טאבלט"
  name: string;  // "iPhone" | "Android" | "Windows" | "Mac"
}

export function parseDevice(ua: string | null | undefined): DeviceInfo {
  if (!ua) return { type: "לא ידוע", name: "לא ידוע" };

  const s = ua.toLowerCase();

  // Type
  const isTablet = s.includes("ipad") || (s.includes("android") && !s.includes("mobile"));
  const isMobile = s.includes("mobile") || s.includes("iphone") || (s.includes("android") && !isTablet);
  const type = isTablet ? "טאבלט" : isMobile ? "טלפון" : "מחשב";

  // Device name
  let name = "לא ידוע";

  if (s.includes("iphone")) name = "iPhone";
  else if (s.includes("ipad")) name = "iPad";
  else if (s.includes("samsung")) name = "Samsung";
  else if (s.includes("huawei")) name = "Huawei";
  else if (s.includes("xiaomi") || s.includes("redmi")) name = "Xiaomi";
  else if (s.includes("pixel")) name = "Pixel";
  else if (s.includes("android")) name = "Android";
  else if (s.includes("macintosh") || s.includes("mac os")) name = "Mac";
  else if (s.includes("windows")) name = "Windows";
  else if (s.includes("linux")) name = "Linux";
  else if (s.includes("cros")) name = "Chromebook";

  return { type, name };
}
