"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { createProjectAction } from "@/features/projects/actions/create-project";
import { PROJECT_TYPE_OPTIONS } from "@/features/projects/types";
import { generateTrackingCode, generateClaudePrompt } from "@/lib/integration-generator";
import { FolderPlus, Sparkles, Copy, Check, Eye, EyeOff, Code, Bot, ArrowLeft } from "lucide-react";

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
}

const TECH_OPTIONS = [
  { value: "js", label: "HTML / JavaScript" },
  { value: "react", label: "React / Vite" },
  { value: "next", label: "Next.js" },
];

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/[\s]+/g, "-").replace(/^-+|-+$/g, "").substring(0, 100);
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-medium bg-white/[0.05] border border-white/[0.1] text-zinc-200 hover:bg-white/[0.08] transition-all"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
      <span>{copied ? "הועתק!" : label}</span>
    </button>
  );
}

export function CreateProjectDialog({ open, onClose }: CreateProjectDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  // Success state
  const [created, setCreated] = useState<{ slug: string; apiKey: string; name: string; techType: string } | null>(null);
  const [showKey, setShowKey] = useState(false);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (!slugEdited) setSlug(generateSlug(e.target.value));
  }, [slugEdited]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createProjectAction(formData);
      if (result.success && result.project) {
        setCreated({ slug: result.project.slug, apiKey: result.project.apiKey, name: result.project.name, techType: result.project.techType });
      } else if (result.errors) {
        setErrors(result.errors);
      }
    });
  };

  const handleClose = useCallback(() => {
    if (created) router.push(`/projects/${created.slug}`);
    setName(""); setSlug(""); setSlugEdited(false); setErrors({}); setCreated(null); setShowKey(false);
    onClose();
  }, [onClose, router, created]);

  // ── Success screen ──
  if (created) {
    const trackingCode = generateTrackingCode(created.apiKey);
    const claudePrompt = generateClaudePrompt(created.apiKey, created.name);
    const maskedKey = created.apiKey.substring(0, 6) + "•".repeat(20) + created.apiKey.slice(-4);

    return (
      <Dialog open={open} onClose={handleClose} title="הפרויקט נוצר בהצלחה!">
        <div className="space-y-5">
          {/* API Key */}
          <div>
            <p className="text-[12px] text-zinc-300 font-semibold mb-2">מפתח API</p>
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2.5">
              <code className="flex-1 text-[12px] font-mono text-zinc-300 truncate" dir="ltr">
                {showKey ? created.apiKey : maskedKey}
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
          <div className="space-y-2">
            <CopyButton text={created.apiKey} label="העתק API Key" />
            <CopyButton text={trackingCode} label="העתק קוד הטמעה" />
            <CopyButton text={claudePrompt} label="העתק פרומפט ל-Claude" />
          </div>

          {/* Go to project */}
          <Button onClick={handleClose} className="w-full">
            <ArrowLeft className="w-4 h-4" />
            <span>עבור לעמוד הפרויקט</span>
          </Button>
        </div>
      </Dialog>
    );
  }

  // ── Create form ──
  return (
    <Dialog open={open} onClose={handleClose} title="פרויקט חדש" description="צור פרויקט חדש והתחל לעקוב אחר אירועים">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input id="name" name="name" label="שם הפרויקט" placeholder="לדוגמה: אתר שלי" icon={FolderPlus}
          value={name} onChange={handleNameChange} error={errors.name?.[0]} required />

        <div>
          <Input id="slug" name="slug" label="כתובת ייחודית (Slug)" placeholder="my-project"
            value={slug} onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
            error={errors.slug?.[0]} dir="ltr" className="font-mono text-[13px]" required />
          <p className="text-[11px] text-zinc-300 mt-1">אותיות קטנות באנגלית, מספרים ומקפים</p>
        </div>

        <Select id="type" name="type" label="סוג פרויקט" options={PROJECT_TYPE_OPTIONS}
          placeholder="בחר סוג..." defaultValue="" error={errors.type?.[0]} required />

        <Input id="websiteUrl" name="websiteUrl" label="כתובת האתר (אופציונלי)" placeholder="https://example.com" dir="ltr" />

        <Select id="techType" name="techType" label="טכנולוגיה" options={TECH_OPTIONS} defaultValue="js" />

        <Textarea id="description" name="description" label="תיאור (אופציונלי)" placeholder="תיאור קצר..." rows={2} />

        {errors._form && (
          <p className="text-sm text-red-400 bg-red-500/10 rounded-xl px-4 py-3">{errors._form[0]}</p>
        )}

        <div className="flex items-center gap-3 pt-1">
          <Button type="submit" isLoading={isPending} className="flex-1">
            <Sparkles className="w-4 h-4" /><span>צור פרויקט</span>
          </Button>
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isPending}>ביטול</Button>
        </div>
      </form>
    </Dialog>
  );
}
