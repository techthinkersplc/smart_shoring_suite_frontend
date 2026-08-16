"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { BrandPanel } from "../_components/brand-panel";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/forgot-password/verify-otp?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <BrandPanel />

      {/* Form Container: White on desktop, Background Image on mobile */}
      <div className="relative flex min-h-screen items-center justify-center bg-[url('/image/Want_to_build_your_dream_business_or_investment_property.jpg')] bg-cover bg-center px-6 py-12 md:min-h-full md:bg-white md:bg-none">
        {/* Green-to-black gradient overlay for mobile readability */}
        <div className="absolute inset-0 bg-linear-to-b from-[#2E7D4F]/40 to-black/70 md:hidden" />

        <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-md md:rounded-none md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none">
          <h2 className="text-2xl font-bold text-gray-900">
            Forgot Password?
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            No worries! Enter your email address below and we&apos;ll send
            you a link to reset your password.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Email Address
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
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="duto@gmail.com"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-800 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900"
            >
              Send OTP
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
