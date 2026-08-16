"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/app/(dashboard)/axios";
import {
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from "@/app/(dashboard)/constant";
import type {
  AuthUser,
  CreateUserPayload,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  ManagedUser,
  MessageResponse,
  ResetPasswordPayload,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "@/app/(dashboard)/types";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    const storedUser = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);

    // Route both branches through one promise chain so every state update
    // lands inside a .then/.catch/.finally callback rather than running
    // synchronously in the effect body.
    const session = token
      ? api.get<AuthUser>("/auth/me")
      : Promise.reject(new Error("No stored session"));

    session
      .then((response) => {
        setUser(response.data);
        window.localStorage.setItem(
          AUTH_USER_STORAGE_KEY,
          JSON.stringify(response.data),
        );
      })
      .catch(() => {
        if (storedUser) {
          window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
        }
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await api.post<LoginResponse>("/auth/login", payload);
    const { token, user: loggedInUser } = response.data;

    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    window.localStorage.setItem(
      AUTH_USER_STORAGE_KEY,
      JSON.stringify(loggedInUser),
    );
    setUser(loggedInUser);

    return loggedInUser;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, isAuthenticated: user !== null, login, logout }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<MessageResponse> {
  const response = await api.post<MessageResponse>(
    "/auth/forgot-password",
    payload,
  );
  return response.data;
}

export async function verifyOtp(
  payload: VerifyOtpPayload,
): Promise<VerifyOtpResponse> {
  const response = await api.post<VerifyOtpResponse>(
    "/auth/verify-otp",
    payload,
  );
  return response.data;
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<MessageResponse> {
  const response = await api.post<MessageResponse>(
    "/auth/reset-password",
    payload,
  );
  return response.data;
}

export async function createUser(
  payload: CreateUserPayload,
): Promise<ManagedUser> {
  const response = await api.post<ManagedUser>("/users", payload);
  return response.data;
}

export async function listUsers(): Promise<ManagedUser[]> {
  const response = await api.get<ManagedUser[]>("/users");
  return response.data;
}
