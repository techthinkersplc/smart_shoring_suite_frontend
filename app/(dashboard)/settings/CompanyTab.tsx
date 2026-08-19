"use client";

import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { UserRole } from "@/app/(dashboard)/constant";
import { useAuth } from "@/app/(dashboard)/hooks/useAuth";
import { handleApiError } from "@/app/(dashboard)/errors/handleApiError";
import {
  EMPTY_PROFILE_FORM,
  ORGANIZATION_LOGO_ORIGIN,
  removeOrganizationLogo,
  toProfileForm,
  updateOrganizationProfile,
  uploadOrganizationLogo,
} from "./api";
import { useOrganizationProfile } from "./context";
import type { OrganizationProfileForm } from "./types";

const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";
const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500";
const sectionHeadingClass =
  "border-b border-gray-200 pb-2 text-base font-semibold text-gray-900";
const saveButtonClass =
  "shrink-0 rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-70";

export function CompanyTab() {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;
  const { profile, isLoading, loadError, setProfile } = useOrganizationProfile();

  const [form, setForm] = useState<OrganizationProfileForm>(EMPTY_PROFILE_FORM);
  const [syncedProfileId, setSyncedProfileId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState("");

  if (profile && profile.id !== syncedProfileId) {
    setSyncedProfileId(profile.id);
    setForm(toProfileForm(profile));
  }

  const updateField = (field: keyof OrganizationProfileForm) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveError("");
    setSaveMessage("");
    setIsSaving(true);
    try {
      const updated = await updateOrganizationProfile(form);
      setProfile(updated);
      setForm(toProfileForm(updated));
      setSaveMessage("Changes saved.");
    } catch (err) {
      setSaveError(handleApiError(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setLogoError("");
    setIsUploadingLogo(true);
    try {
      const updated = await uploadOrganizationLogo(file);
      setProfile(updated);
    } catch (err) {
      setLogoError(err instanceof Error ? err.message : "Failed to upload logo.");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleRemoveLogo = async () => {
    setLogoError("");
    setIsUploadingLogo(true);
    try {
      const updated = await removeOrganizationLogo();
      setProfile(updated);
    } catch (err) {
      setLogoError(handleApiError(err));
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const logoUrl = profile?.logoUrl ?? null;

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
        Loading organization profile...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-red-600">
        {loadError}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Organization Profile</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your organization&apos;s profile, registration details, and brand assets.
          </p>
        </div>
        {isAdmin && (
          <button type="submit" disabled={isSaving} className={saveButtonClass}>
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>

      {!isAdmin && (
        <p className="mt-4 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-500">
          Only administrators can edit the organization profile.
        </p>
      )}
      {saveError && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{saveError}</p>
      )}
      {saveMessage && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {saveMessage}
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="companyName" className={labelClass}>
            Company Name
          </label>
          <input
            id="companyName"
            disabled={!isAdmin}
            value={form.companyName}
            onChange={updateField("companyName")}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="registrationNumber" className={labelClass}>
            Registration Number
          </label>
          <input
            id="registrationNumber"
            disabled={!isAdmin}
            value={form.registrationNumber}
            onChange={updateField("registrationNumber")}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="taxIdentificationNumber" className={labelClass}>
            Tax Identification Number (TIN)
          </label>
          <input
            id="taxIdentificationNumber"
            disabled={!isAdmin}
            value={form.taxIdentificationNumber}
            onChange={updateField("taxIdentificationNumber")}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-8">
        <h3 className={sectionHeadingClass}>Brand Assets</h3>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${ORGANIZATION_LOGO_ORIGIN}${logoUrl}`}
                alt="Company logo"
                className="h-full w-full object-contain p-1.5"
              />
            ) : (
              <span className="text-xs text-gray-400">No logo</span>
            )}
          </div>
          {isAdmin && (
            <>
              <input
                id="companyLogoInput"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleLogoSelect}
                disabled={isUploadingLogo}
                className="hidden"
              />
              <label
                htmlFor="companyLogoInput"
                className={`rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 ${
                  isUploadingLogo ? "pointer-events-none opacity-70" : "cursor-pointer"
                }`}
              >
                {isUploadingLogo ? "Uploading..." : "Upload New Logo"}
              </label>
              {logoUrl && (
                <button
                  type="button"
                  disabled={isUploadingLogo}
                  onClick={handleRemoveLogo}
                  className="text-sm font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Remove Logo
                </button>
              )}
            </>
          )}
        </div>
        {logoError && <p className="mt-2 text-sm text-red-600">{logoError}</p>}
      </div>

      <div className="mt-8">
        <h3 className={sectionHeadingClass}>Contact Information</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="primaryEmail" className={labelClass}>
              Primary Email
            </label>
            <input
              id="primaryEmail"
              type="email"
              disabled={!isAdmin}
              value={form.primaryEmail}
              onChange={updateField("primaryEmail")}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className={labelClass}>
              Phone Number
            </label>
            <input
              id="phoneNumber"
              disabled={!isAdmin}
              value={form.phoneNumber}
              onChange={updateField("phoneNumber")}
              className={inputClass}
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="website" className={labelClass}>
            Website
          </label>
          <input
            id="website"
            disabled={!isAdmin}
            value={form.website}
            onChange={updateField("website")}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-8">
        <h3 className={sectionHeadingClass}>Office Address</h3>
        <div className="mt-4">
          <label htmlFor="streetAddress" className={labelClass}>
            Street Address
          </label>
          <input
            id="streetAddress"
            disabled={!isAdmin}
            value={form.streetAddress}
            onChange={updateField("streetAddress")}
            className={inputClass}
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className={labelClass}>
              City
            </label>
            <input
              id="city"
              disabled={!isAdmin}
              value={form.city}
              onChange={updateField("city")}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="region" className={labelClass}>
              Region/State
            </label>
            <input
              id="region"
              disabled={!isAdmin}
              value={form.region}
              onChange={updateField("region")}
              className={inputClass}
            />
          </div>
        </div>
        <div className="mt-4 sm:w-1/2 sm:pr-2">
          <label htmlFor="country" className={labelClass}>
            Country
          </label>
          <input
            id="country"
            disabled={!isAdmin}
            value={form.country}
            onChange={updateField("country")}
            className={inputClass}
          />
        </div>
      </div>

      {isAdmin && (
        <div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
          <button type="submit" disabled={isSaving} className={saveButtonClass}>
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </form>
  );
}
