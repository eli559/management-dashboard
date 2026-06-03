import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#06060a]">
      <div className="text-center max-w-md">
        <Image
          src="/logo.png"
          alt="digitalcraft"
          width={72}
          height={72}
          className="mx-auto mb-8 rounded-2xl"
        />

        <p className="text-[80px] font-black text-white/10 leading-none select-none mb-2">
          404
        </p>

        <h1 className="text-xl font-bold text-white mb-3">
          הדף לא נמצא
        </h1>
        <p className="text-[14px] text-zinc-400 leading-relaxed mb-8">
          הדף שחיפשת לא קיים או שהוא הועבר למקום אחר.
          <br />
          בדוק שהכתובת נכונה ונסה שוב.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.08] border border-white/[0.1] text-[14px] font-medium text-white hover:bg-white/[0.12] transition-all"
        >
          חזרה לדף הראשי
        </Link>
      </div>
    </div>
  );
}
