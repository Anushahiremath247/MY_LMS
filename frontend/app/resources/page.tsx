import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { getResources } from "@/lib/api";

export default async function ResourcesPage() {
  const resources = await getResources();

  return (
    <main>
      <Navbar />
      <section className="section-shell py-16">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Resources</p>
            <h1 className="mt-3 font-display text-5xl font-semibold">200+ curated YouTube learning links</h1>
          </div>
          <div className="glass-panel flex w-full max-w-md items-center rounded-full px-4 py-3">
            <input placeholder="Search resources..." className="w-full bg-transparent text-sm outline-none" />
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {["All", "Frontend", "Backend", "Cloud", "AI / ML"].map((category) => (
            <button
              key={category}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                category === "All" ? "bg-primary text-white" : "glass-panel text-slate-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <article key={resource.id} className="glass-panel rounded-4xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{resource.category}</p>
              <h2 className="mt-3 font-display text-2xl font-semibold">{resource.title}</h2>
              <p className="mt-3 text-sm text-slate-500">Difficulty: {resource.difficulty}</p>
              <Link
                href={resource.youtubeUrl}
                target="_blank"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                Open resource
                <ExternalLink className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

