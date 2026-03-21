"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import type { Resource } from "@/types";
import { Button } from "./ui/button";

const difficulties = ["All", "beginner", "intermediate", "advanced"] as const;

export const ResourceBrowser = ({ resources }: { resources: Resource[] }) => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDifficulty, setActiveDifficulty] = useState<(typeof difficulties)[number]>("All");
  const deferredQuery = useDeferredValue(query);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(resources.map((resource) => resource.category)))],
    [resources]
  );

  const filteredResources = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesCategory = activeCategory === "All" || resource.category === activeCategory;
      const matchesDifficulty = activeDifficulty === "All" || resource.difficulty === activeDifficulty;
      const haystack = [resource.title, resource.category, resource.type, resource.difficulty].join(" ").toLowerCase();
      const matchesQuery = normalizedQuery.length === 0 || haystack.includes(normalizedQuery);
      return matchesCategory && matchesDifficulty && matchesQuery;
    });
  }, [activeCategory, activeDifficulty, deferredQuery, resources]);

  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory("All");
    }
  }, [activeCategory, categories]);

  return (
    <div className="space-y-8">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-glass backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Resource vault</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
            Curated YouTube learning links for every stage
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-500">
            Browse structured videos, playlist searches, and quick study routes without leaving the Lazy Learning flow.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {[
            { label: "Resources", value: resources.length },
            { label: "Categories", value: categories.length - 1 },
            { label: "Beginner friendly", value: resources.filter((resource) => resource.difficulty === "beginner").length }
          ].map((stat) => (
            <div key={stat.label} className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur-xl">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-2 font-display text-4xl font-semibold text-ink">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/70 bg-white/78 p-5 shadow-glass backdrop-blur-xl">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="flex h-14 items-center gap-3 rounded-full border border-slate-200 bg-white px-5 shadow-soft">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search resources, categories, or difficulty"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                type="button"
                onClick={() => setActiveDifficulty(difficulty)}
                className={`rounded-full px-4 py-2.5 text-sm font-medium capitalize transition ${
                  difficulty === activeDifficulty
                    ? "bg-primary text-white shadow-glass"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-primary/20 hover:text-ink"
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
                category === activeCategory
                  ? "bg-slate-900 text-white shadow-soft"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-primary/20 hover:text-ink"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          Matching resources: <span className="font-semibold text-ink">{filteredResources.length}</span>
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            setQuery("");
            setActiveCategory("All");
            setActiveDifficulty("All");
          }}
        >
          Reset
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredResources.map((resource) => (
          <article
            key={resource.id}
            className="group rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-soft backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:shadow-glass"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {resource.category}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                {resource.difficulty}
              </span>
            </div>
            <h2 className="mt-5 font-display text-2xl font-semibold text-ink">{resource.title}</h2>
            <p className="mt-3 text-sm text-slate-500">
              Type: <span className="font-medium capitalize text-slate-700">{resource.type}</span>
            </p>
            <Link
              href={resource.youtubeUrl}
              target="_blank"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition group-hover:gap-3"
            >
              Open on YouTube
              <ExternalLink className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};
