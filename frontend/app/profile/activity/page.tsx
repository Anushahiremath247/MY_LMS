import { ProfileActivityView } from "@/components/profile/profile-activity-view";
import { getCoursesPage } from "@/lib/api";

export default async function ProfileActivityPage() {
  const catalog = await getCoursesPage({ page: 1, limit: 12 });

  return <ProfileActivityView courses={catalog.courses} />;
}
