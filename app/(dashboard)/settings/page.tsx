"use client";

import { useState } from "react";
import { BuildingIcon, LockIcon } from "@/app/common/components/ui/Icons";
import { CompanyTab } from "./CompanyTab";
import { SecurityTab } from "./SecurityTab";

type SettingsTab = "company" | "security";

const TABS: { id: SettingsTab; label: string; icon: typeof BuildingIcon }[] = [
  { id: "company", label: "Company Profile", icon: BuildingIcon },
  { id: "security", label: "User Profile", icon: LockIcon },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("company");

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
      <nav className="h-fit rounded-xl border border-gray-200 bg-surface p-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gray-200 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {activeTab === "company" ? <CompanyTab /> : <SecurityTab />}
    </div>
  );
}
