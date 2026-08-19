"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ORGANIZATION_LOGO_ORIGIN,
  readOrganizationBranding,
  type CachedOrganizationBranding,
} from "@/app/common/organizationBranding";

export function BrandPanel() {
  const [branding, setBranding] = useState<CachedOrganizationBranding | null>(null);

  useEffect(() => {
    Promise.resolve()
      .then(() => readOrganizationBranding())
      .then(setBranding);
  }, []);

  const logoSrc = branding?.logoUrl
    ? `${ORGANIZATION_LOGO_ORIGIN}${branding.logoUrl}`
    : "/image/Duto.jpg";
  const companyName = branding?.companyName?.trim() || "Smart Shoring Suite";

  return (
    <div className="relative hidden md:block bg-[#1c2620]">
      <Image
        src="/image/Want_to_build_your_dream_business_or_investment_property.jpg"
        alt="Construction site with blueprints"
        fill
        priority
        className="object-cover object-[50%_25%]"
      />

      {/* Green-to-black gradient overlay to match the design */}
      <div className="absolute inset-0 bg-linear-to-b from-[#2E7D4F]/40 to-black/70" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-12 text-center">
        <div className="relative h-28 w-28 overflow-hidden rounded-2xl bg-[#4a5a52] shadow-2xl shadow-black/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt={`${companyName} logo`}
            className="h-full w-full object-contain p-3"
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white drop-shadow-md">{companyName}</h1>
          <p className="max-w-sm text-sm text-white/90 drop-shadow">
            Enterprise-grade structural safety management and equipment
            logistics in one unified platform.
          </p>
        </div>
      </div>
    </div>
  );
}
