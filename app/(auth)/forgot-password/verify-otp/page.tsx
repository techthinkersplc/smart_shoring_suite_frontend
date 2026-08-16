"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type SubmitEvent,
} from "react";
import { BrandPanel } from "../../_components/brand-panel";
import { forgotPassword, verifyOtp } from "@/app/(dashboard)/hooks/useAuth";
import { handleApiError } from "@/app/(dashboard)/errors/handleApiError";
import { RESET_TOKEN_SESSION_KEY } from "@/app/(dashboard)/constant";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (resendCooldown === 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return;
    setError("");
    try {
      await forgotPassword({ email });
    } catch (err) {
      setError(handleApiError(err));
      return;
    }
    setDigits(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
  };

  const setDigit = (index: number, value: string) => {
    const next = [...digits];
    next[index] = value;
    setDigits(next);
  };

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigit(index, digit);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length !== OTP_LENGTH) {
      setError("Enter the full 6-digit code.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      const { resetToken } = await verifyOtp({ email, otp });
      window.sessionStorage.setItem(RESET_TOKEN_SESSION_KEY, resetToken);
      router.push(`/forgot-password/reset-password?email=${encodeURIComponent(email)}`);
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
          <h2 className="text-2xl font-bold text-gray-900">Verify OTP</h2>
          <p className="mt-1 text-sm text-gray-500">
            Enter the 6-digit code we sent to{" "}
            {email ? <span className="font-medium text-gray-700">{email}</span> : "your email"}.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <div className="flex justify-between gap-2">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="h-12 w-11 rounded-lg border border-gray-300 text-center text-lg font-semibold text-gray-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-800 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="font-medium text-amber-500 hover:text-amber-600 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:text-gray-400"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
              </button>
            </p>

            <Link
              href="/forgot-password"
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
              Back
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
