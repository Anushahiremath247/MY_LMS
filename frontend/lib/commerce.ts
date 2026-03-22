const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

const requestJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    credentials: "include"
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message || "Request failed");
  }

  return response.json();
};

const buildAuthHeaders = (accessToken?: string | null) =>
  accessToken
    ? {
        Authorization: `Bearer ${accessToken}`
      }
    : undefined;

export const enrollInCourseRequest = (courseId: string, accessToken?: string | null) =>
  requestJson(`/courses/${courseId}/enroll`, {
    method: "POST",
    headers: buildAuthHeaders(accessToken)
  });

export const buyCourseRequest = (
  courseId: string,
  input: { method: "upi" | "card" | "bank_transfer"; simulateFailure?: boolean },
  accessToken?: string | null
) =>
  requestJson(`/courses/${courseId}/buy`, {
    method: "POST",
    headers: buildAuthHeaders(accessToken),
    body: JSON.stringify(input)
  });

export const checkoutSubscriptionRequest = (
  input: {
    planId: string;
    billingCycle: "monthly" | "yearly";
    method: "upi" | "card" | "bank_transfer";
    simulateFailure?: boolean;
  },
  accessToken?: string | null
) =>
  requestJson(`/subscription/checkout`, {
    method: "POST",
    headers: buildAuthHeaders(accessToken),
    body: JSON.stringify(input)
  });
