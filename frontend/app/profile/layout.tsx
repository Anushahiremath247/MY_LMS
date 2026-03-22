import { AuthGuard } from "@/components/auth-guard";
import { Navbar } from "@/components/navbar";
import { ProfileGuard } from "@/components/profile/profile-guard";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import { BackButton } from "@/components/ui/back-button";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <main>
        <Navbar />
        <section className="section-shell py-12">
          <ProfileGuard>
            <div className="mb-6">
              <BackButton fallbackHref="/dashboard" label="Back to previous page" />
            </div>
            <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
              <ProfileSidebar />
              <div>{children}</div>
            </div>
          </ProfileGuard>
        </section>
      </main>
    </AuthGuard>
  );
}
