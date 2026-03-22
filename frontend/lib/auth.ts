import type { AuthSession, AuthUser } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const DEFAULT_REDIRECT = "/dashboard";

const parseErrorMessage = async (response: Response) => {
  const payload = (await response.json().catch(() => null)) as { message?: string } | null;
  return payload?.message || "Authentication failed";
};

const requestAuth = async (
  path: "/auth/login" | "/auth/register",
  body: { name?: string; email: string; password: string }
): Promise<AuthSession> => {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  const payload = (await response.json()) as AuthSession;
  return payload;
};

export const loginUser = async (body: { email: string; password: string }): Promise<AuthSession> => {
  return requestAuth("/auth/login", body);
};

export const registerUser = async (body: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthSession> => requestAuth("/auth/register", body);

export const getCurrentUser = async (accessToken: string): Promise<AuthUser> => {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    credentials: "include"
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return response.json();
};

export const refreshSession = async (): Promise<AuthSession> => {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include"
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return response.json();
};

export const logoutUser = async (accessToken?: string | null) => {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`
          }
        : undefined,
      credentials: "include"
    });
  } catch {
    return;
  }
};

export const normalizeRedirectPath = (value?: string | null) => {
  if (!value) {
    return DEFAULT_REDIRECT;
  }

  if (value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  try {
    const base = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const url = new URL(value, base);
    return url.pathname.startsWith("/") ? `${url.pathname}${url.search}${url.hash}` : DEFAULT_REDIRECT;
  } catch {
    return DEFAULT_REDIRECT;
  }
};

export const startSocialLogin = (provider: "google" | "github", redirectTo?: string | null) => {
  if (typeof window === "undefined") {
    return;
  }

  const next = normalizeRedirectPath(redirectTo);
  window.location.assign(`${API_URL}/auth/oauth/${provider}?redirectTo=${encodeURIComponent(next)}`);
};
