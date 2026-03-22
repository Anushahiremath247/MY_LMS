import { Navbar } from "@/components/navbar";
import { ProfileGuard } from "@/components/profile/profile-guard";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Navbar />
      <section className="section-shell py-12">
        <ProfileGuard>
          <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
            <ProfileSidebar />
            <div>{children}</div>
          </div>
        </ProfileGuard>
      </section>
    </main>
  );
}
