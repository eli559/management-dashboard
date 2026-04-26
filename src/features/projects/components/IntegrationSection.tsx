"use client";

import { useState } from "react";
import { Copy, Check, Code, Bot, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import { generateTrackingCode, generateClaudePrompt } from "@/lib/integration-generator";
import { useToast } from "@/components/ui/Toast";

interface IntegrationSectionProps {
  apiKey: string;
  projectName: string;
  eventCount: number;
}

function CopyBtn({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  return (
    <button
      onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); toast.success("הועתק ללוח"); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium bg-white/[0.05] border border-white/[0.1] text-zinc-200 hover:bg-white/[0.08] transition-all"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
      <span>{copied ? "הועתק!" : label}</span>
    </button>
  );
}

export function IntegrationSection({ apiKey, projectName, eventCount }: IntegrationSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const maskedKey = apiKey.substring(0, 6) + "•".repeat(20) + apiKey.slice(-4);

  return (
    <div className="surface rounded-2xl overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 text-start hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <Code className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-[15px] font-bold text-zinc-200">הטמעה</h3>
            <p className="text-[12px] text-zinc-300 mt-0.5">
              {eventCount > 0 ? (
                <span className="text-emerald-400">● פעיל — {eventCount} אירועים נקלטו</span>
              ) : (
                <span className="text-zinc-300">○ ממתין להטמעה</span>
              )}
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-zinc-300" /> : <ChevronDown className="w-5 h-5 text-zinc-300" />}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-6 pb-6 space-y-4 border-t border-white/[0.05] pt-4">
          {/* API Key */}
          <div>
            <p className="text-[12px] text-zinc-300 font-semibold mb-2">מפתח API</p>
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2.5">
              <code className="flex-1 text-[12px] font-mono text-zinc-300 truncate" dir="ltr">
                {showKey ? apiKey : maskedKey}
              </code>
              <button onClick={() => setShowKey(!showKey)} className="p-1 rounded hover:bg-white/[0.06] text-zinc-300">
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Endpoint */}
          <div>
            <p className="text-[12px] text-zinc-300 font-semibold mb-2">Endpoint</p>
            <code className="block text-[11px] font-mono text-zinc-300 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2.5 truncate" dir="ltr">
              https://management-dashboard-248948614304.me-west1.run.app/api/events/ingest
            </code>
          </div>

          {/* Copy buttons */}
          <div className="flex flex-wrap gap-2">
            <CopyBtn text={apiKey} label="העתק API Key" />
            <CopyBtn text={generateTrackingCode(apiKey)} label="העתק קוד הטמעה" />
            <CopyBtn text={generateClaudePrompt(apiKey, projectName)} label="העתק פרומפט Claude" />
          </div>
        </div>
      )}
    </div>
  );
}
