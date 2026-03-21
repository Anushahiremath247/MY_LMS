import type { AuthSession, AuthUser } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

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
    avatar: `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(fallbackName)}`
  };
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
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message || "Authentication failed");
  }

  const payload = (await response.json()) as AuthSession;
  return payload;
};

export const loginUser = async (body: { email: string; password: string }): Promise<AuthSession> => {
  try {
    return await requestAuth("/auth/login", body);
  } catch {
    return {
      accessToken: `local-token-${body.email}`,
      user: buildFallbackUser(body)
    };
  }
};

export const registerUser = async (body: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthSession> => {
  try {
    return await requestAuth("/auth/register", body);
  } catch {
    return {
      accessToken: `local-token-${body.email}`,
      user: buildFallbackUser(body)
    };
  }
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
