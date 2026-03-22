import { resources, subscriptionPlans } from "./demo-data";
import { courses } from "./course-catalog-data";
import type { Course, CourseCatalogSummary, CourseListItem, PaginatedCoursesResponse, Resource, SubscriptionPlan } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? null;
const DEFAULT_REVALIDATE = 60;
const DEFAULT_LIMIT = 12;
const REQUEST_TIMEOUT_MS = 1800;

type CoursePageOptions = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  accessType?: "free" | "paid" | "subscription";
  enrolledOnly?: boolean;
};

const toCourseListItem = ({ sections: _sections, ...course }: Course): CourseListItem => course;

const getCatalogCategories = () => Array.from(new Set(courses.map((course) => course.category))).sort((left, right) => left.localeCompare(right));

const normalizePagination = (page = 1, limit = DEFAULT_LIMIT) => {
  const normalizedPage = Number.isFinite(page) ? Math.trunc(page) : 1;
  const normalizedLimit = Number.isFinite(limit) ? Math.trunc(limit) : DEFAULT_LIMIT;

  return {
    page: Math.max(1, normalizedPage),
    limit: Math.min(24, Math.max(1, normalizedLimit))
  };
};

const getFallbackCourseCatalog = (options: CoursePageOptions = {}): PaginatedCoursesResponse => {
  const { page, limit } = normalizePagination(options.page, options.limit);
  const normalizedQuery = options.search?.trim().toLowerCase() ?? "";

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = !options.category || options.category === "All" || course.category === options.category;
    const matchesAccessType = !options.accessType || course.accessType === options.accessType;
    const matchesEnrollment = !options.enrolledOnly || Boolean(course.isEnrolled);
    const haystack = [course.title, course.instructor, course.shortDescription, course.category].join(" ").toLowerCase();
    const matchesQuery = normalizedQuery.length === 0 || haystack.includes(normalizedQuery);
    return matchesCategory && matchesAccessType && matchesEnrollment && matchesQuery;
  });

  const startIndex = (page - 1) * limit;
  const pageCourses = filteredCourses.slice(startIndex, startIndex + limit).map(toCourseListItem);

  return {
    courses: pageCourses,
    total: filteredCourses.length,
    hasMore: startIndex + limit < filteredCourses.length,
    nextPage: startIndex + limit < filteredCourses.length ? page + 1 : null,
    page,
    limit,
    categories: getCatalogCategories(),
    summary: {
      totalCourses: filteredCourses.length,
      enrolledCourses: filteredCourses.filter((course) => course.isEnrolled).length,
      totalLessons: filteredCourses.reduce((sum, course) => sum + course.lessonsCount, 0),
      freeCourses: filteredCourses.filter((course) => course.accessType === "free").length,
      paidCourses: filteredCourses.filter((course) => course.accessType === "paid").length,
      subscriptionCourses: filteredCourses.filter((course) => course.accessType === "subscription").length
    }
  };
};

const buildQueryString = (params: Record<string, string | number | boolean | undefined>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== false) {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

const createTimeoutSignal = (signal?: AbortSignal | null) => {
  if (signal) {
    return signal;
  }

  if (typeof AbortSignal !== "undefined" && "timeout" in AbortSignal) {
    return AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  }

  return undefined;
};

async function safeFetch<T>(
  path: string,
  init?: RequestInit,
  fallback?: T,
  options?: { revalidate?: number }
): Promise<T> {
  if (!API_URL) {
    if (fallback !== undefined) {
      return fallback;
    }

    throw new Error("API URL is not configured");
  }

  const isGetRequest = !init?.method || init.method === "GET";

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...init,
      cache: init?.cache ?? (isGetRequest ? "force-cache" : "no-store"),
      next: isGetRequest ? { revalidate: options?.revalidate ?? DEFAULT_REVALIDATE } : undefined,
      signal: createTimeoutSignal(init?.signal),
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {})
      }
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
  } catch {
    if (fallback !== undefined) {
      return fallback;
    }

    throw new Error("Failed to fetch data");
  }
}

export const getCourses = async () => courses;

export const getCourseCatalogSummary = async (): Promise<CourseCatalogSummary> => ({
  totalCourses: courses.length,
  enrolledCourses: courses.filter((course) => course.isEnrolled).length,
  totalLessons: courses.reduce((sum, course) => sum + course.lessonsCount, 0),
  freeCourses: courses.filter((course) => course.accessType === "free").length,
  paidCourses: courses.filter((course) => course.accessType === "paid").length,
  subscriptionCourses: courses.filter((course) => course.accessType === "subscription").length
});

export const getFeaturedCourses = async (limit = 3) => courses.slice(0, limit).map(toCourseListItem);

export const getEnrolledCourses = async (limit = 6) =>
  courses.filter((course) => course.isEnrolled).slice(0, limit).map(toCourseListItem);

export const getCoursesPage = (options: CoursePageOptions = {}) =>
  safeFetch<PaginatedCoursesResponse>(
    `/courses${buildQueryString({
      page: options.page ?? 1,
      limit: options.limit ?? DEFAULT_LIMIT,
      search: options.search,
      category: options.category,
      accessType: options.accessType,
      enrolledOnly: options.enrolledOnly
    })}`,
    undefined,
    getFallbackCourseCatalog(options)
  );

export const getCourse = (slug: string) => {
  const fallback = courses.find((item) => item.slug === slug || item.id === slug) ?? courses[0];
  return safeFetch<Course>(`/courses/${slug}`, undefined, fallback);
};

export const getCourseTree = (subjectId: string) => {
  const fallback = courses.find((item) => item.id === subjectId || item.slug === subjectId) ?? courses[0];
  return safeFetch<Course>(`/subjects/${subjectId}/tree`, undefined, fallback);
};

export const getResources = () => safeFetch<Resource[]>("/resources", undefined, resources);

export const getSubscriptionPlans = () =>
  safeFetch<SubscriptionPlan[]>("/courses/plans", undefined, [...subscriptionPlans]);
