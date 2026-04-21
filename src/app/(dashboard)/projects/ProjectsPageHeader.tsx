"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CreateProjectDialog } from "@/features/projects/components/CreateProjectDialog";

interface Props {
  onSearch: (query: string) => void;
}

export function ProjectsPageHeader({ onSearch }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">פרויקטים</h1>
          <p className="text-zinc-300 mt-1 text-[15px]">ניהול ומעקב אחר הפרויקטים שלך</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
            <input
              type="text"
              placeholder="חיפוש פרויקט..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-56 ps-9 pe-4 py-2 bg-white/[0.04] border border-white/[0.1] rounded-lg text-[13px] text-zinc-200 placeholder:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-white/[0.15] focus:border-white/[0.15] transition-all"
            />
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            <span>פרויקט חדש</span>
          </Button>
        </div>
      </div>

      <CreateProjectDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}
