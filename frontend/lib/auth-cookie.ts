export const AUTH_PRESENCE_COOKIE = "lazy-learning-session";
const AUTH_PRESENCE_MAX_AGE = 60 * 60 * 24 * 30;

export const setAuthPresenceCookie = () => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${AUTH_PRESENCE_COOKIE}=1; Max-Age=${AUTH_PRESENCE_MAX_AGE}; Path=/; SameSite=Lax`;
};

export const clearAuthPresenceCookie = () => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${AUTH_PRESENCE_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
};
