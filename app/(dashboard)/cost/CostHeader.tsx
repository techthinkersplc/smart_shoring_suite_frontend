"use client";

import { useEffect, useState } from "react";
import { SearchIcon } from "@/app/common/components/ui/Icons";
import { useCostData } from "./context";

function formatToday(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function CostHeader() {
  const { summary, searchTerm, setSearchTerm } = useCostData();
  const [today, setToday] = useState(formatToday);

  useEffect(() => {
    // Recompute periodically so this never goes stale — e.g. a tab left open
    // across midnight still shows the real current date without a reload.
    const timer = setInterval(() => setToday(formatToday()), 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-1 items-center gap-6">
      <div className="relative hidden max-w-md flex-1 sm:block">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search cost, category, transaction..."
          className="w-full rounded-full bg-gray-100 py-2 pl-9 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>

      <div className="ml-auto flex items-center gap-6">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Project
          </p>
          <p className="text-sm font-bold text-gray-900">
            {summary?.projectName ?? "..."}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Date
          </p>
          <p className="text-sm font-bold text-gray-900">{today}</p>
        </div>
      </div>
    </div>
  );
}
