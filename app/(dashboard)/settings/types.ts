export interface OrganizationProfile {
  id: string;
  companyName: string | null;
  registrationNumber: string | null;
  taxIdentificationNumber: string | null;
  logoUrl: string | null;
  primaryEmail: string | null;
  phoneNumber: string | null;
  website: string | null;
  streetAddress: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  updatedAt: string;
}

export type OrganizationProfileForm = {
  companyName: string;
  registrationNumber: string;
  taxIdentificationNumber: string;
  primaryEmail: string;
  phoneNumber: string;
  website: string;
  streetAddress: string;
  city: string;
  region: string;
  country: string;
};
