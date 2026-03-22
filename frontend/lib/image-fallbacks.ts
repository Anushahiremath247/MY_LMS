const courseFallbacks: Record<string, string> = {
  Python: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
  Java: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  SQL: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
  "Web Development": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  React: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80",
  "Node.js": "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80"
};

export const DEFAULT_AVATAR_SRC = "/panda-logo.svg";
export const DEFAULT_COURSE_THUMBNAIL = "/lazy-learning-logo.svg";

export const isLikelyImageSrc = (value?: string | null) =>
  Boolean(value && String(value).trim().length > 0 && /^(https?:\/\/|\/)/.test(String(value).trim()));

export const resolveAvatarSrc = (value?: string | null) =>
  isLikelyImageSrc(value) ? String(value).trim() : DEFAULT_AVATAR_SRC;

export const getCourseFallbackThumbnail = (category?: string | null) =>
  (category ? courseFallbacks[category] : undefined) ?? DEFAULT_COURSE_THUMBNAIL;
