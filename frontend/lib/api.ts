import { courses, resources } from "./demo-data";
import type { Course, Resource } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

async function safeFetch<T>(path: string, init?: RequestInit, fallback?: T): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...init,
      cache: "no-store",
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

export const getCourses = () => safeFetch<Course[]>("/subjects", undefined, courses);

export const getCourse = async (slug: string) => {
  const list = await getCourses();
  return safeFetch<Course>(`/subjects/${slug}`, undefined, list.find((item) => item.slug === slug)!);
};

export const getCourseTree = async (subjectId: string) => {
  const list = await getCourses();
  return safeFetch<Course>(
    `/subjects/${subjectId}/tree`,
    undefined,
    list.find((item) => item.id === subjectId || item.slug === subjectId) ?? list[0]
  );
};

export const getResources = () => safeFetch<Resource[]>("/resources", undefined, resources);

