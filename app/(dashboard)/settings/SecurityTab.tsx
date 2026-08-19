"use client";

import { useEffect, useState, type SubmitEvent } from "react";
import { InfoIcon, LockIcon } from "@/app/common/components/ui/Icons";
import { changePassword, getMyProfile, updateMyProfile, useAuth } from "@/app/(dashboard)/hooks/useAuth";
import { handleApiError } from "@/app/(dashboard)/errors/handleApiError";
import type { AuthUser } from "@/app/(dashboard)/types";

const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";
const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500";
const saveButtonClass =
  "rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-70";

function PasswordField({
  id,
  label,
  value,
  onChange,
  minLength,
  helperText,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  minLength?: number;
  helperText?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isVisible ? "text" : "password"}
          required
          minLength={minLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} pr-10`}
        />
        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          aria-label={isVisible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          {isVisible ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-5 w-5"
            >
              <path d="M3 3l18 18" />
              <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
              <path d="M9.4 5.5A9.9 9.9 0 0 1 12 5c5.5 0 9 5 9 7a12.8 12.8 0 0 1-3.2 3.7M6.2 6.2C4 7.7 2.5 9.9 2.5 12c0 2 3.5 7 9.5 7 1.2 0 2.3-.2 3.3-.5" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-5 w-5"
            >
              <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
              <circle cx="12" cy="12" r="3.5" />
            </svg>
          )}
        </button>
      </div>
      {helperText && <p className="mt-1.5 text-xs text-red-500">{helperText}</p>}
    </div>
  );
}

function ProfileSection() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [syncedId, setSyncedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    getMyProfile()
      .then(setProfile)
      .catch((err) => setLoadError(handleApiError(err)))
      .finally(() => setIsLoading(false));
  }, []);

  if (profile && profile.id !== syncedId) {
    setSyncedId(profile.id);
    setName(profile.name);
    setEmail(profile.email);
  }

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveError("");
    setSaveMessage("");
    setIsSaving(true);
    try {
      const updated = await updateMyProfile({ name, email });
      setProfile(updated);
      updateUser(updated);
      setSaveMessage("Profile updated.");
    } catch (err) {
      setSaveError(handleApiError(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h2 className="border-b border-gray-200 pb-3 text-lg font-bold text-gray-900">
        User Profile
      </h2>

      {isLoading ? (
        <p className="mt-4 text-sm text-gray-500">Loading your profile...</p>
      ) : loadError ? (
        <p className="mt-4 text-sm text-red-600">{loadError}</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4">
          {saveError && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{saveError}</p>
          )}
          {saveMessage && (
            <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {saveMessage}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className={labelClass}>
                Name
              </label>
              <input
                id="fullName"
                required
                minLength={2}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="profileEmail" className={labelClass}>
                Email
              </label>
              <input
                id="profileEmail"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <button type="submit" disabled={isSaving} className={`${saveButtonClass} mt-4`}>
            {isSaving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      )}
    </div>
  );
}

function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation don't match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await changePassword({ currentPassword, newPassword });
      setMessage(result.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-surface p-6">
      <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
        <LockIcon className="h-4 w-4 text-gray-700" />
        <h3 className="text-base font-semibold text-gray-900">Change Password</h3>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 max-w-md space-y-4">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        {message && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>
        )}

        <PasswordField
          id="currentPassword"
          label="Current Password"
          value={currentPassword}
          onChange={setCurrentPassword}
        />
        <PasswordField
          id="newPassword"
          label="New Password"
          value={newPassword}
          onChange={setNewPassword}
          minLength={8}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm New Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          minLength={8}
          helperText={
            confirmPassword && newPassword !== confirmPassword
              ? "Passwords do not match."
              : undefined
          }
        />

        <button type="submit" disabled={isSubmitting} className={saveButtonClass}>
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

export function SecurityTab() {
  return (
    <div className="space-y-6">
      <ProfileSection />

      <div>
        <h2 className="text-lg font-bold text-gray-900">Security &amp; Access</h2>
        <p className="mt-1 text-sm text-gray-500">
          Protect your account with password management, two-factor authentication, and session
          monitoring.
        </p>
      </div>

      <PasswordSection />

      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Security Tip:</span> Never share your DSSS password with
          anyone. Our support team will never ask for your credentials.
        </p>
      </div>
    </div>
  );
}
