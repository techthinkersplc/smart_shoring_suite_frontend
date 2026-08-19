import { api } from "@/app/(dashboard)/axios";
import { API_BASE_URL } from "@/app/config/env";
import { AUTH_TOKEN_STORAGE_KEY } from "@/app/(dashboard)/constant";
import { saveOrganizationBranding } from "@/app/common/organizationBranding";
import type { OrganizationProfile, OrganizationProfileForm } from "./types";

export { ORGANIZATION_LOGO_ORIGIN } from "@/app/common/organizationBranding";

function cacheBranding(profile: OrganizationProfile): OrganizationProfile {
  saveOrganizationBranding({ companyName: profile.companyName, logoUrl: profile.logoUrl });
  return profile;
}

export const EMPTY_PROFILE_FORM: OrganizationProfileForm = {
  companyName: "",
  registrationNumber: "",
  taxIdentificationNumber: "",
  primaryEmail: "",
  phoneNumber: "",
  website: "",
  streetAddress: "",
  city: "",
  region: "",
  country: "",
};

export function toProfileForm(profile: OrganizationProfile): OrganizationProfileForm {
  return {
    companyName: profile.companyName ?? "",
    registrationNumber: profile.registrationNumber ?? "",
    taxIdentificationNumber: profile.taxIdentificationNumber ?? "",
    primaryEmail: profile.primaryEmail ?? "",
    phoneNumber: profile.phoneNumber ?? "",
    website: profile.website ?? "",
    streetAddress: profile.streetAddress ?? "",
    city: profile.city ?? "",
    region: profile.region ?? "",
    country: profile.country ?? "",
  };
}

export async function getOrganizationProfile(): Promise<OrganizationProfile> {
  const response = await api.get<OrganizationProfile>("/organization-profile");
  return cacheBranding(response.data);
}

export async function updateOrganizationProfile(
  form: OrganizationProfileForm,
): Promise<OrganizationProfile> {
  const payload = Object.fromEntries(
    Object.entries(form)
      .map(([key, value]) => [key, value.trim()])
      .filter(([, value]) => value.length > 0),
  );
  const response = await api.patch<OrganizationProfile>("/organization-profile", payload);
  return cacheBranding(response.data);
}

export async function uploadOrganizationLogo(file: File): Promise<OrganizationProfile> {
  const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  const body = new FormData();
  body.append("logo", file);

  const response = await fetch(`${API_BASE_URL}/organization-profile/logo`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(typeof data?.message === "string" ? data.message : "Failed to upload logo.");
  }
  return cacheBranding(data as OrganizationProfile);
}

export async function removeOrganizationLogo(): Promise<OrganizationProfile> {
  const response = await api.delete<OrganizationProfile>("/organization-profile/logo");
  return cacheBranding(response.data);
}
