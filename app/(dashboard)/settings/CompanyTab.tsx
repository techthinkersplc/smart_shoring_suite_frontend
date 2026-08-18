"use client";

import Image from "next/image";
import { useState, type SubmitEvent } from "react";

const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";
const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600";
const sectionHeadingClass =
  "border-b border-gray-200 pb-2 text-base font-semibold text-gray-900";
const saveButtonClass =
  "shrink-0 rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900";

export function CompanyTab() {
  const [profile, setProfile] = useState({
    companyName: "DUTO Smart Shoring",
    registrationNumber: "DSSS-2026-ETH",
    tin: "987654321",
    primaryEmail: "info@duto-shoring.com",
    phoneNumber: "+251 11 661 2345",
    website: "www.duto-shoring.com",
    streetAddress: "Bole Road, Building 45, Office 302",
    city: "Addis Ababa",
    regionState: "Addis Ababa",
    country: "Ethiopia",
  });

  const updateField = (field: keyof typeof profile) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-gray-100 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Organization Profile</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your organization&apos;s profile, registration details, and brand assets.
          </p>
        </div>
        <button type="submit" className={saveButtonClass}>
          Save Changes
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="companyName" className={labelClass}>
            Company Name
          </label>
          <input
            id="companyName"
            value={profile.companyName}
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
            value={profile.registrationNumber}
            onChange={updateField("registrationNumber")}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="tin" className={labelClass}>
            Tax Identification Number (TIN)
          </label>
          <input id="tin" value={profile.tin} onChange={updateField("tin")} className={inputClass} />
        </div>
      </div>

      <div className="mt-8">
        <h3 className={sectionHeadingClass}>Brand Assets</h3>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            <Image src="/image/Duto.jpg" alt="Company logo" fill className="object-contain p-1.5" />
          </div>
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Upload New Logo
          </button>
          <button type="button" className="text-sm font-medium text-red-600 hover:text-red-700">
            Remove Logo
          </button>
        </div>
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
              value={profile.primaryEmail}
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
              value={profile.phoneNumber}
              onChange={updateField("phoneNumber")}
              className={inputClass}
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="website" className={labelClass}>
            Website
          </label>
          <input id="website" value={profile.website} onChange={updateField("website")} className={inputClass} />
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
            value={profile.streetAddress}
            onChange={updateField("streetAddress")}
            className={inputClass}
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className={labelClass}>
              City
            </label>
            <input id="city" value={profile.city} onChange={updateField("city")} className={inputClass} />
          </div>
          <div>
            <label htmlFor="regionState" className={labelClass}>
              Region/State
            </label>
            <input
              id="regionState"
              value={profile.regionState}
              onChange={updateField("regionState")}
              className={inputClass}
            />
          </div>
        </div>
        <div className="mt-4 sm:w-1/2 sm:pr-2">
          <label htmlFor="country" className={labelClass}>
            Country
          </label>
          <input id="country" value={profile.country} onChange={updateField("country")} className={inputClass} />
        </div>
      </div>

      <div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
        <button type="submit" className={saveButtonClass}>
          Save Changes
        </button>
      </div>
    </form>
  );
}
