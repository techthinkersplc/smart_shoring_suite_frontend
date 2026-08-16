"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type SubmitEvent } from "react";
import { BrandPanel } from "../../_components/brand-panel";
import { resetPassword } from "@/app/(dashboard)/hooks/useAuth";
import { handleApiError } from "@/app/(dashboard)/errors/handleApiError";
import { RESET_TOKEN_SESSION_KEY } from "@/app/(dashboard)/constant";

function subscribeToResetToken() {
  return () => {};
}

function getResetTokenSnapshot() {
  return window.sessionStorage.getItem(RESET_TOKEN_SESSION_KEY);
}

function getResetTokenServerSnapshot() {
  return null;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSucceeded, setHasSucceeded] = useState(false);
  const resetToken = useSyncExternalStore(
    subscribeToResetToken,
    getResetTokenSnapshot,
    getResetTokenServerSnapshot,
  );

  useEffect(() => {
    // Skip once we've already reset the password: clearing the token below
    // triggers this same check, and it must not hijack the redirect to
    // /login with one back to /forgot-password.
    if (!resetToken && !hasSucceeded) {
      router.replace("/forgot-password");
    }
  }, [resetToken, hasSucceeded, router]);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword || !resetToken) return;

    setError("");
    setIsSubmitting(true);
    try {
      await resetPassword({ resetToken, newPassword: password });
      setHasSucceeded(true);
      window.sessionStorage.removeItem(RESET_TOKEN_SESSION_KEY);
      router.push("/login");
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <BrandPanel />

      {/* Form Container: White on desktop, Background Image on mobile */}
      <div className="relative flex min-h-screen items-center justify-center bg-[url('/image/Want_to_build_your_dream_business_or_investment_property.jpg')] bg-cover bg-center px-6 py-12 md:min-h-full md:bg-white md:bg-none">
        {/* Green-to-black gradient overlay for mobile readability */}
        <div className="absolute inset-0 bg-linear-to-b from-[#2E7D4F]/40 to-black/70 md:hidden" />

        <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-md md:rounded-none md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none">
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <p className="mt-1 text-sm text-gray-500">
            Your identity has been verified. Set your new password below.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="h-5 w-5"
                  >
                    <rect x="5" y="11" width="14" height="9" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
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
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="h-5 w-5"
                  >
                    <rect x="5" y="11" width="14" height="9" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
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
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1.5 text-xs text-red-500">Passwords do not match.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !resetToken}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-800 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>

            <Link
              href="/login"
              className="flex items-center justify-center gap-1.5 text-sm font-medium text-emerald-800 hover:text-emerald-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-4 w-4"
              >
                <path d="M19 12H5" />
                <path d="M11 18l-6-6 6-6" />
              </svg>
              Back to Login
            </Link>
          </form>

          <p className="mt-10 text-center text-xs text-gray-400">
            © 2026 DUTO Smart Shoring Suite. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
