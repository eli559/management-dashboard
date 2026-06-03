"use client";

import { Heebo } from "next/font/google";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} antialiased`}>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#06060a",
          color: "#e4e4e7",
          fontFamily: "var(--font-heebo), system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420, padding: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="digitalcraft"
            width={72}
            height={72}
            style={{ margin: "0 auto 32px", borderRadius: 16 }}
          />

          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#f87171"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
          </div>

          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 8px",
            }}
          >
            שגיאת מערכת
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#a1a1aa",
              lineHeight: 1.7,
              margin: "0 0 28px",
            }}
          >
            אירעה שגיאה כללית במערכת.
            <br />
            נסה לרענן את הדף — אם הבעיה נמשכת, צור קשר עם התמיכה.
          </p>

          <button
            onClick={() => unstable_retry()}
            style={{
              padding: "10px 24px",
              borderRadius: 12,
              background: "rgba(99,102,241,0.2)",
              border: "1px solid rgba(99,102,241,0.3)",
              color: "#a5b4fc",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            נסה שוב
          </button>

          {error.digest && (
            <p
              style={{
                marginTop: 24,
                fontSize: 11,
                color: "#3f3f46",
                fontFamily: "monospace",
              }}
              dir="ltr"
            >
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
