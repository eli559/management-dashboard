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
import { FolderPlus, Sparkles } from "lucide-react";

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100);
}

export function CreateProjectDialog({
  open,
  onClose,
}: CreateProjectDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newName = e.target.value;
      setName(newName);
      if (!slugEdited) {
        setSlug(generateSlug(newName));
      }
    },
    [slugEdited]
  );

  const handleSlugChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSlug(e.target.value);
      setSlugEdited(true);
    },
    []
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createProjectAction(formData);

      if (result.success && result.project) {
        handleClose();
        router.push(`/projects/${result.project.slug}`);
      } else if (result.errors) {
        setErrors(result.errors);
      }
    });
  };

  const handleClose = useCallback(() => {
    setName("");
    setSlug("");
    setSlugEdited(false);
    setErrors({});
    onClose();
  }, [onClose]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="פרויקט חדש"
      description="צור פרויקט חדש והתחל לעקוב אחר אירועים"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Project Name */}
        <Input
          id="name"
          name="name"
          label="שם הפרויקט"
          placeholder="לדוגמה: אפליקציית SaaS"
          icon={FolderPlus}
          value={name}
          onChange={handleNameChange}
          error={errors.name?.[0]}
          required
        />

        {/* Slug */}
        <div>
          <Input
            id="slug"
            name="slug"
            label="Slug (כתובת ייחודית)"
            placeholder="my-project"
            value={slug}
            onChange={handleSlugChange}
            error={errors.slug?.[0]}
            dir="ltr"
            className="font-mono text-[13px]"
            required
          />
          <p className="text-[11px] text-slate-400 mt-1.5">
            אותיות קטנות באנגלית, מספרים ומקפים בלבד
          </p>
        </div>

        {/* Type */}
        <Select
          id="type"
          name="type"
          label="סוג פרויקט"
          options={PROJECT_TYPE_OPTIONS}
          placeholder="בחר סוג..."
          defaultValue=""
          error={errors.type?.[0]}
          required
        />

        {/* Description */}
        <Textarea
          id="description"
          name="description"
          label="תיאור (אופציונלי)"
          placeholder="תיאור קצר של הפרויקט..."
          rows={3}
          error={errors.description?.[0]}
        />

        {/* Form Error */}
        {errors._form && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
            {errors._form[0]}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" isLoading={isPending} className="flex-1">
            <Sparkles className="w-4 h-4" />
            <span>צור פרויקט</span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isPending}
          >
            ביטול
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
