"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { PaginatedCoursesResponse } from "@/types";
import { CourseCard } from "./course-card";
import { CourseCardSkeleton } from "./course-card-skeleton";
import { Button } from "./ui/button";
import { Reveal } from "./ui/reveal";

const pageSize = 12;
const accessTabs = [
  { id: "all", label: "All courses" },
  { id: "free", label: "Free courses" },
  { id: "paid", label: "Premium courses" },
  { id: "subscription", label: "Subscription only" }
] as const;

type CourseBrowserProps = {
  initialCatalog: PaginatedCoursesResponse;
};

const buildCatalogUrl = (
  page: number,
  query: string,
  category: string,
  accessType: (typeof accessTabs)[number]["id"]
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(pageSize)
  });

  if (query.trim()) {
    params.set("search", query.trim());
  }

  if (category !== "All") {
    params.set("category", category);
  }

  if (accessType !== "all") {
    params.set("accessType", accessType);
  }

  return `/api/courses?${params.toString()}`;
};

export const CourseBrowser = ({ initialCatalog }: CourseBrowserProps) => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeAccessType, setActiveAccessType] = useState<(typeof accessTabs)[number]["id"]>("all");
  const [catalog, setCatalog] = useState(initialCatalog);
  const [isFetching, setIsFetching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const requestIdRef = useRef(0);

  const categories = useMemo(() => ["All", ...catalog.categories], [catalog.categories]);
  const visibleCourses = catalog.courses;

  const fetchCatalog = useCallback(
    async (page: number, replace = false) => {
      const requestId = ++requestIdRef.current;
      setError(null);
      setIsFetching(true);
      setIsRefreshing(replace);

      try {
        const response = await fetch(buildCatalogUrl(page, deferredQuery, activeCategory, activeAccessType), {
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const nextCatalog = (await response.json()) as PaginatedCoursesResponse;

        if (requestId !== requestIdRef.current) {
          return;
        }

        setCatalog((current) => ({
          ...nextCatalog,
          courses: replace ? nextCatalog.courses : [...current.courses, ...nextCatalog.courses]
        }));
      } catch {
        if (requestId === requestIdRef.current) {
          setError("We couldn't load more courses right now. Try again in a moment.");
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setIsFetching(false);
          setIsRefreshing(false);
        }
      }
    },
    [activeAccessType, activeCategory, deferredQuery]
  );

  useEffect(() => {
    const usingInitialFilters =
      activeCategory === "All" &&
      activeAccessType === "all" &&
      deferredQuery.trim().length === 0;

    if (usingInitialFilters) {
      setCatalog(initialCatalog);
      setError(null);
      setIsFetching(false);
      setIsRefreshing(false);
      return;
    }

    fetchCatalog(1, true);
  }, [activeAccessType, activeCategory, deferredQuery, fetchCatalog, initialCatalog]);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !catalog.hasMore || isFetching || isRefreshing) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting && catalog.nextPage) {
          fetchCatalog(catalog.nextPage);
        }
      },
      { rootMargin: "420px 0px" }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [catalog.hasMore, catalog.nextPage, fetchCatalog, isFetching, isRefreshing]);

  return (
    <div className="space-y-8">
      <Reveal className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="bubble-card px-6 py-7">
          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Explore with focus
            </div>
            <h1 className="bubble-title text-4xl sm:text-5xl">Free, premium, and membership courses in one clean catalog</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Search by topic, filter by access type, and browse a professional catalog that keeps the next best course easy to find.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {[
            { label: "Courses", value: catalog.summary.totalCourses },
            { label: "Free", value: catalog.summary.freeCourses },
            { label: "Premium", value: catalog.summary.paidCourses }
          ].map((stat) => (
            <div key={stat.label} className="bubble-card px-6 py-6 text-center">
              <p className="relative z-10 text-xs font-semibold uppercase tracking-[0.2em] text-ink/55">{stat.label}</p>
              <p className="relative z-10 mt-3 font-display text-4xl font-bold text-primary">{stat.value}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="bubble-card grid gap-4 px-5 py-5 lg:grid-cols-[1fr_auto] lg:items-center" delay={0.03}>
        <label className="glass-panel flex h-14 items-center gap-3 rounded-full px-5">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by course, topic, or instructor"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {accessTabs.map((tab) => {
            const isActive = activeAccessType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveAccessType(tab.id)}
                className={`pressable rounded-full px-4 py-2.5 text-sm font-medium transition ${
                  isActive ? "bubble-bar text-white" : "glass-panel text-slate-600 hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2 lg:col-span-2">
          {categories.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`pressable rounded-full px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bubble-bar text-white"
                    : "glass-panel text-slate-600 hover:text-ink"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </Reveal>

      <Reveal className="grid gap-4 md:grid-cols-3" delay={0.05}>
        <div className="bubble-card px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Free start</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{catalog.summary.freeCourses} open-enrollment paths</p>
        </div>
        <div className="bubble-card px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Premium depth</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{catalog.summary.paidCourses} purchase-ready masterclasses</p>
        </div>
        <div className="bubble-card px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Membership</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{catalog.summary.subscriptionCourses} subscription-unlocked tracks</p>
        </div>
      </Reveal>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          Showing <span className="font-semibold text-ink">{visibleCourses.length}</span> of{" "}
          <span className="font-semibold text-ink">{catalog.total}</span> courses
        </p>
        <p className="text-sm text-slate-500">{isRefreshing ? "Refreshing courses..." : `Loaded batch ${catalog.page}`}</p>
      </div>

      {isRefreshing && visibleCourses.length === 0 ? (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <CourseCardSkeleton key={`refresh-${index}`} />
          ))}
        </div>
      ) : visibleCourses.length ? (
        <div className="content-auto grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {visibleCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
          {isFetching && !isRefreshing
            ? Array.from({ length: 3 }, (_, index) => <CourseCardSkeleton key={`loading-${index}`} />)
            : null}
        </div>
      ) : (
        <Reveal className="bubble-card px-10 py-10 text-center">
          <h2 className="relative z-10 font-display text-3xl font-semibold text-primary">No matching courses</h2>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Try a different keyword or switch the category filter to see more learning paths.
          </p>
          <div className="mt-6 flex justify-center">
            <Button
              variant="secondary"
              onClick={() => {
                setQuery("");
                setActiveCategory("All");
                setActiveAccessType("all");
              }}
            >
              Reset filters
            </Button>
          </div>
        </Reveal>
      )}

      {error ? (
        <div className="rounded-[2rem] border border-rose-200 bg-white px-6 py-5 text-center text-sm text-rose-500 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
          <p>{error}</p>
          <div className="mt-4 flex justify-center">
            <Button
              variant="secondary"
              onClick={() => fetchCatalog(catalog.courses.length === 0 ? 1 : catalog.nextPage ?? catalog.page, catalog.courses.length === 0)}
            >
              Retry loading
            </Button>
          </div>
        </div>
      ) : null}

      <div ref={loadMoreRef} className="flex min-h-16 items-center justify-center">
        {catalog.hasMore ? (
          <p className="text-sm text-slate-500">{isFetching ? "Loading more courses..." : "Scroll to load more courses"}</p>
        ) : visibleCourses.length ? (
          <p className="text-sm font-medium text-slate-500">No more courses to load.</p>
        ) : null}
      </div>
    </div>
  );
};
