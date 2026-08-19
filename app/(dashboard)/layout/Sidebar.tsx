"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogoutIcon, MenuIcon, SupportIcon } from "@/app/common/components/ui/Icons";
import { navItems } from "@/app/common/components/ui/NavItems";
import { useAuth } from "@/app/(dashboard)/hooks/useAuth";
import { ORGANIZATION_LOGO_ORIGIN } from "@/app/(dashboard)/settings/api";
import { useOrganizationProfile } from "@/app/(dashboard)/settings/context";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { profile } = useOrganizationProfile();
  const [collapsed, setCollapsed] = useState(false);

  const logoSrc = profile?.logoUrl
    ? `${ORGANIZATION_LOGO_ORIGIN}${profile.logoUrl}`
    : "/image/Duto.jpg";
  const companyName = profile?.companyName?.trim() || "DSSS";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-gray-200 bg-white transition-all ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between px-4 pt-4">
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-col items-center px-4 pb-6 pt-3 text-center mb-2.5">
        <div className="relative h-15 w-15 overflow-hidden rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt={`${companyName} logo`} className="h-full w-full object-contain p-1.5" />
        </div>
        {!collapsed && (
          <>
            <p className="mt-2 text-lg font-bold tracking-tight text-gray-900">{companyName}</p>
            <p className="text-[10px] font-medium tracking-widest text-gray-400">
              DUTO SMART SHORING SUITE
            </p>
          </>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/executive-dashboard/"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-emerald-800 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-gray-200 px-3 py-4">
        <Link
          href="/support"
          title={collapsed ? "Support" : undefined}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <SupportIcon className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Support</span>}
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogoutIcon className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
