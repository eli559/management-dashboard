"use client";

import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CreateProjectDialog } from "@/features/projects/components/CreateProjectDialog";

interface Props {
  onSearch: (query: string) => void;
}

export function ProjectsPageHeader({ onSearch }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  function handleClear() {
    setSearchValue("");
    onSearch("");
    setSearchOpen(false);
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">פרויקטים</h1>
          <p className="text-zinc-400 mt-1 text-[13px] md:text-[15px]">ניהול ומעקב אחר הפרויקטים שלך</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile: toggle search */}
          {!searchOpen && (
            <button
              onClick={() => setSearchOpen(true)}
              className="sm:hidden p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-zinc-400 hover:bg-white/[0.06] tap-scale transition-all"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
          )}

          {/* Mobile expanded / Desktop always visible */}
          <div className={`${searchOpen ? "flex" : "hidden"} sm:flex relative flex-1 sm:flex-none items-center`}>
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="חיפוש פרויקט..."
              value={searchValue}
              onChange={(e) => { setSearchValue(e.target.value); onSearch(e.target.value); }}
              autoFocus={searchOpen}
              className="w-full sm:w-56 ps-9 pe-9 sm:pe-4 py-2.5 bg-white/[0.04] border border-white/[0.1] rounded-xl text-[13px] text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-sky-500/30 focus:border-sky-500/30 transition-all"
            />
            {/* Mobile close button */}
            {searchOpen && (
              <button
                onClick={handleClear}
                className="sm:hidden absolute end-2 top-1/2 -translate-y-1/2 p-1 rounded-lg text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">פרויקט חדש</span>
            <span className="sm:hidden">חדש</span>
          </Button>
        </div>
      </div>

      <CreateProjectDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}
