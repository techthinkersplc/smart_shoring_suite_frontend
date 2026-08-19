import { API_BASE_URL } from "@/app/config/env";

const BRANDING_STORAGE_KEY = "dsss_organization_branding";

export const ORGANIZATION_LOGO_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

export interface CachedOrganizationBranding {
  companyName: string | null;
  logoUrl: string | null;
}

// GET /organization-profile requires an auth token, so pages a user sees
// before logging in (login, forgot-password, ...) can't fetch it directly.
// Whenever an authenticated session loads the profile, it's cached here so
// those pre-login pages can still show the last-known company branding.
export function saveOrganizationBranding(branding: CachedOrganizationBranding): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(branding));
}

export function readOrganizationBranding(): CachedOrganizationBranding | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(BRANDING_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CachedOrganizationBranding;
  } catch {
    return null;
  }
}
