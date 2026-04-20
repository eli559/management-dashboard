"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CreateProjectDialog } from "@/features/projects/components/CreateProjectDialog";

export function ProjectsPageHeader() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">פרויקטים</h1>
          <p className="text-slate-500 mt-1 text-[15px]">
            ניהול ומעקב אחר הפרויקטים שלך
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          <span>פרויקט חדש</span>
        </Button>
      </div>

      <CreateProjectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}
