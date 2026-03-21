"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import type { Course } from "@/types";
import { CourseCard } from "./course-card";
import { Button } from "./ui/button";

const pageSize = 6;

export const CourseBrowser = ({ courses }: { courses: Course[] }) => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const deferredQuery = useDeferredValue(query);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(courses.map((course) => course.category)))],
    [courses]
  );

  const filteredCourses = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesCategory = activeCategory === "All" || course.category === activeCategory;
      const haystack = [course.title, course.instructor, course.shortDescription, course.category].join(" ").toLowerCase();
      const matchesQuery = normalizedQuery.length === 0 || haystack.includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, courses, deferredQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / pageSize));
  const visibleCourses = filteredCourses.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, deferredQuery]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <div className="space-y-8">
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-glass backdrop-blur-xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Explore with focus
          </div>
          <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">
            Subjects built for steady momentum
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-500">
            Search by topic, narrow by category, and jump into course paths with a cleaner sense of what to learn next.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {[
            { label: "Courses", value: courses.length },
            { label: "Enrolled", value: courses.filter((course) => course.isEnrolled).length },
            { label: "Lessons", value: courses.reduce((sum, course) => sum + course.lessonsCount, 0) }
          ].map((stat) => (
            <div key={stat.label} className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur-xl">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-2 font-display text-4xl font-semibold text-ink">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 rounded-[2rem] border border-white/70 bg-white/78 p-5 shadow-glass backdrop-blur-xl lg:grid-cols-[1fr_auto] lg:items-center">
        <label className="flex h-14 items-center gap-3 rounded-full border border-slate-200 bg-white px-5 shadow-soft">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by course, topic, or instructor"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-white shadow-glass"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-primary/20 hover:text-ink"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          Showing <span className="font-semibold text-ink">{visibleCourses.length}</span> of{" "}
          <span className="font-semibold text-ink">{filteredCourses.length}</span> courses
        </p>
        <p className="text-sm text-slate-500">
          Page <span className="font-semibold text-ink">{page}</span> of{" "}
          <span className="font-semibold text-ink">{totalPages}</span>
        </p>
      </div>

      {visibleCourses.length ? (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {visibleCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-soft">
          <h2 className="font-display text-3xl font-semibold text-ink">No matching courses</h2>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Try a different keyword or switch the category filter to see more learning paths.
          </p>
          <div className="mt-6 flex justify-center">
            <Button
              variant="secondary"
              onClick={() => {
                setQuery("");
                setActiveCategory("All");
              }}
            >
              Reset filters
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="secondary" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => setPage(pageNumber)}
            className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold transition ${
              pageNumber === page
                ? "bg-primary text-white shadow-glass"
                : "border border-slate-200 bg-white text-slate-600 hover:border-primary/20 hover:text-ink"
            }`}
          >
            {pageNumber}
          </button>
        ))}
        <Button
          variant="secondary"
          onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
          disabled={page === totalPages}
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
