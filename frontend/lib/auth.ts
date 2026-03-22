import type { AuthSession, AuthUser } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const DEFAULT_REDIRECT = "/dashboard";

const buildFallbackUser = (input: { name?: string; email: string }): AuthUser => {
  const fallbackName =
    input.name?.trim() ||
    input.email
      .split("@")[0]
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ") ||
    "Lazy Learning Student";

  return {
    id: `local-${input.email}`,
    name: fallbackName,
    email: input.email,
    avatar: "/panda-logo.svg",
    role: "student"
  };
};

const isBrowser = typeof window !== "undefined";

export const isAuthApiConfigured = () => {
  if (!isBrowser) {
    return Boolean(process.env.NEXT_PUBLIC_API_URL);
  }

  const onLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const usingLocalFallbackApi = API_URL.startsWith("http://localhost:4000") || API_URL.startsWith("http://127.0.0.1:4000");

  return !usingLocalFallbackApi || onLocalhost;
};

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
  if (!isAuthApiConfigured()) {
    return {
      accessToken: `local-token-${body.email}`,
      user: buildFallbackUser(body)
    };
  }

  return requestAuth("/auth/login", body);
};

export const registerUser = async (body: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthSession> => {
  if (!isAuthApiConfigured()) {
    return {
      accessToken: `local-token-${body.email}`,
      user: buildFallbackUser(body)
    };
  }

  return requestAuth("/auth/register", body);
};

export const getCurrentUser = async (accessToken: string): Promise<AuthUser> => {
  if (!isAuthApiConfigured()) {
    return buildFallbackUser({ email: accessToken.replace(/^local-token-/, "") || "learner@example.com" });
  }

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
  if (!isAuthApiConfigured()) {
    throw new Error("Auth API is not configured");
  }

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
  if (!isAuthApiConfigured()) {
    return;
  }

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

  if (!isAuthApiConfigured()) {
    throw new Error(`${provider === "google" ? "Google" : "GitHub"} login needs a deployed backend API URL first.`);
  }

  const next = normalizeRedirectPath(redirectTo);
  window.location.assign(`${API_URL}/auth/oauth/${provider}?redirectTo=${encodeURIComponent(next)}`);
};
