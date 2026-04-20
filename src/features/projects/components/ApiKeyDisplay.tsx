"use client";

import { useState, useCallback } from "react";
import { Copy, Check, Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils/cn";

interface ApiKeyDisplayProps {
  apiKey: string;
}

export function ApiKeyDisplay({ apiKey }: ApiKeyDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const maskedKey = apiKey.substring(0, 6) + "•".repeat(20) + apiKey.slice(-4);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [apiKey]);

  return (
    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
      <code
        className="flex-1 text-[13px] font-mono text-slate-700 select-all truncate"
        dir="ltr"
      >
        {revealed ? apiKey : maskedKey}
      </code>

      <button
        onClick={() => setRevealed(!revealed)}
        className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-600 flex-shrink-0"
        title={revealed ? "הסתר" : "הצג"}
      >
        {revealed ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>

      <button
        onClick={handleCopy}
        className={cn(
          "p-1.5 rounded-lg transition-colors flex-shrink-0",
          copied
            ? "bg-emerald-50 text-emerald-600"
            : "hover:bg-slate-200 text-slate-400 hover:text-slate-600"
        )}
        title="העתק"
      >
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
