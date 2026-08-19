"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getOrganizationProfile } from "./api";
import { handleApiError } from "@/app/(dashboard)/errors/handleApiError";
import type { OrganizationProfile } from "./types";

interface OrganizationProfileContextValue {
  profile: OrganizationProfile | null;
  isLoading: boolean;
  loadError: string;
  setProfile: (profile: OrganizationProfile) => void;
}

const OrganizationProfileContext = createContext<OrganizationProfileContextValue | undefined>(
  undefined,
);

export function OrganizationProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<OrganizationProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    getOrganizationProfile()
      .then(setProfile)
      .catch((err) => setLoadError(handleApiError(err)))
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo(
    () => ({ profile, isLoading, loadError, setProfile }),
    [profile, isLoading, loadError],
  );

  return (
    <OrganizationProfileContext.Provider value={value}>
      {children}
    </OrganizationProfileContext.Provider>
  );
}

export function useOrganizationProfile(): OrganizationProfileContextValue {
  const context = useContext(OrganizationProfileContext);
  if (!context) {
    throw new Error("useOrganizationProfile must be used within an OrganizationProfileProvider");
  }
  return context;
}
