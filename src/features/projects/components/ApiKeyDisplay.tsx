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
    <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5">
      <code className="flex-1 text-[13px] font-mono text-zinc-400 select-all truncate" dir="ltr">
        {revealed ? apiKey : maskedKey}
      </code>
      <button
        onClick={() => setRevealed(!revealed)}
        className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors text-zinc-400 hover:text-zinc-400 flex-shrink-0"
        title={revealed ? "הסתר" : "הצג"}
      >
        {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
      <button
        onClick={handleCopy}
        className={cn(
          "p-1.5 rounded-lg transition-colors flex-shrink-0",
          copied ? "bg-emerald-500/10 text-emerald-400" : "hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-400"
        )}
        title="העתק"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}
