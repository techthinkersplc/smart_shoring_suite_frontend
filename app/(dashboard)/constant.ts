export enum UserRole {
  ADMIN = "ADMIN",
  PROJECT_MANAGER = "PROJECT_MANAGER",
  SITE_ENGINEER = "SITE_ENGINEER",
  SAFETY_OFFICER = "SAFETY_OFFICER",
  QUALITY_INSPECTOR = "QUALITY_INSPECTOR",
}

export const ALL_ROLES = Object.values(UserRole);

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Admin",
  [UserRole.PROJECT_MANAGER]: "Project Manager",
  [UserRole.SITE_ENGINEER]: "Site Engineer",
  [UserRole.SAFETY_OFFICER]: "Safety Officer",
  [UserRole.QUALITY_INSPECTOR]: "Quality Inspector",
};

export const AUTH_TOKEN_STORAGE_KEY = "dsss_token";
export const AUTH_USER_STORAGE_KEY = "dsss_user";
export const RESET_TOKEN_SESSION_KEY = "dsss_reset_token";

export const DEFAULT_AUTHENTICATED_ROUTE = "/executive-dashboard";
