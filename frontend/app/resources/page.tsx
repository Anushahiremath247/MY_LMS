import { AuthGuard } from "@/components/auth-guard";
import { Navbar } from "@/components/navbar";
import { ResourceBrowser } from "@/components/resource-browser";
import { getResources } from "@/lib/api";

export default async function ResourcesPage() {
  const resources = await getResources();

  return (
    <AuthGuard>
      <main>
        <Navbar />
        <section className="section-shell py-16">
          <ResourceBrowser resources={resources} />
        </section>
      </main>
    </AuthGuard>
  );
}
