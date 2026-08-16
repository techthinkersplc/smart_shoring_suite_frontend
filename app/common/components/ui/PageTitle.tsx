"use client";

import { usePathname } from "next/navigation";
import { navItems } from "./NavItems";

export function PageTitle() {
  const pathname = usePathname();
  const activeItem = navItems.find((item) =>
    item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href)
  );

  return (
    <h1 className="text-xl font-bold text-gray-900">{activeItem?.label ?? "Dashboard"}</h1>
  );
}
