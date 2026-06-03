"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <div className="text-center max-w-md">
        <Image
          src="/logo.png"
          alt="digitalcraft"
          width={64}
          height={64}
          className="mx-auto mb-6 rounded-2xl"
        />

        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>

        <h1 className="text-lg font-bold text-white mb-2">
          משהו השתבש
        </h1>
        <p className="text-[14px] text-zinc-400 leading-relaxed mb-6">
          אירעה שגיאה בלתי צפויה. הצוות שלנו קיבל התראה.
          <br />
          נסה לרענן או לחזור לדף הראשי.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => unstable_retry()}
            className="px-5 py-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-[13px] font-medium text-indigo-300 hover:bg-indigo-500/30 transition-all"
          >
            נסה שוב
          </button>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-[13px] font-medium text-zinc-300 hover:bg-white/[0.1] transition-all"
          >
            דף ראשי
          </Link>
        </div>

        {error.digest && (
          <p className="mt-6 text-[11px] text-zinc-600 font-mono" dir="ltr">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
