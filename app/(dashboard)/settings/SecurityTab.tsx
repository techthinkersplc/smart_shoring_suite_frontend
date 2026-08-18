"use client";

import { useState, type SubmitEvent } from "react";
import { InfoIcon, LockIcon } from "@/app/common/components/ui/Icons";

const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";
const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600";

export function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Security &amp; Access</h2>
        <p className="mt-1 text-sm text-gray-500">
          Protect your account with password management, two-factor authentication, and session
          monitoring.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-100 p-6">
        <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
          <LockIcon className="h-4 w-4 text-gray-700" />
          <h3 className="text-base font-semibold text-gray-900">Change Password</h3>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 max-w-md space-y-4">
          <div>
            <label htmlFor="currentPassword" className={labelClass}>
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="newPassword" className={labelClass}>
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className={labelClass}>
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

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
