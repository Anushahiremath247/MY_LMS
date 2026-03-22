"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import type { Resource } from "@/types";
import { Button } from "./ui/button";
import { Reveal } from "./ui/reveal";

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
      <Reveal className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bubble-card px-6 py-7">
          <div className="relative z-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/75">Resource vault</p>
            <h1 className="bubble-title mt-3 text-4xl sm:text-5xl">Curated YouTube learning links for every stage</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Browse structured videos, playlist searches, and quick study routes without leaving the Lazy Learning flow.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {[
            { label: "Resources", value: resources.length },
            { label: "Categories", value: categories.length - 1 },
            { label: "Beginner friendly", value: resources.filter((resource) => resource.difficulty === "beginner").length }
          ].map((stat) => (
            <div key={stat.label} className="bubble-card px-6 py-6 text-center">
              <p className="relative z-10 text-xs font-semibold uppercase tracking-[0.2em] text-ink/55">{stat.label}</p>
              <p className="relative z-10 mt-3 font-display text-4xl font-bold text-primary">{stat.value}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="bubble-card px-5 py-5" delay={0.03}>
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="glass-panel flex h-14 items-center gap-3 rounded-full px-5">
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
                className={`pressable rounded-full px-4 py-2.5 text-sm font-medium capitalize transition ${
                  difficulty === activeDifficulty
                    ? "bubble-bar text-white"
                    : "glass-panel text-slate-600 hover:text-ink"
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
              className={`pressable rounded-full px-4 py-2.5 text-sm font-medium transition ${
                category === activeCategory
                  ? "bubble-bar text-white"
                  : "glass-panel text-slate-600 hover:text-ink"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </Reveal>

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

      <div className="content-auto grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredResources.map((resource) => (
          <article
            key={resource.id}
            className="bubble-card group px-6 py-6 transition duration-300 hover:-translate-y-1.5"
          >
            <div className="relative z-10 flex items-center justify-between gap-3">
              <span className="rounded-full bg-white/45 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {resource.category}
              </span>
              <span className="glass-panel rounded-full px-3 py-1 text-xs font-medium capitalize text-slate-600">
                {resource.difficulty}
              </span>
            </div>
            <h2 className="relative z-10 mt-5 font-display text-2xl font-bold text-primary">{resource.title}</h2>
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
