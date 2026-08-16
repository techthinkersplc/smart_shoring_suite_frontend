import type { ComponentType, SVGProps } from "react";
import {
  CostIcon,
  DashboardIcon,
  EquipmentIcon,
  MaterialsIcon,
  ProductionIcon,
  QualityIcon,
  SafetyIcon,
  SettingsIcon,
  SiteProgressIcon,
} from "./Icons";

export type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/executive-dashboard", icon: DashboardIcon },
  { label: "Site Progress", href: "/site-progress", icon: SiteProgressIcon },
  { label: "Equipment", href: "/equipment", icon: EquipmentIcon },
  { label: "Daily Production", href: "/daily-production", icon: ProductionIcon },
  { label: "Quality", href: "/quality", icon: QualityIcon },
  { label: "Materials", href: "/materials", icon: MaterialsIcon },
  { label: "Cost", href: "/cost", icon: CostIcon },
  { label: "Safety", href: "/safety", icon: SafetyIcon },
  { label: "Settings", href: "/settings", icon: SettingsIcon },
];
