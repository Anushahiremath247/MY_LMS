"use client";

import { useProfileStore } from "@/store/profile-store";
import { useToastStore } from "@/store/toast-store";
import { ToggleSwitch } from "../ui/toggle-switch";

export const NotificationSettingsPanel = () => {
  const profile = useProfileStore((state) => state.profile);
  const updateNotifications = useProfileStore((state) => state.updateNotifications);
  const addActivity = useProfileStore((state) => state.addActivity);
  const pushToast = useToastStore((state) => state.pushToast);

  if (!profile) {
    return null;
  }

  const handleUpdate = (key: keyof typeof profile.notifications, value: boolean) => {
    updateNotifications({ [key]: value });
    addActivity({
      title: "Notification preferences updated",
      description: "You adjusted how Lazy Learning keeps you informed.",
      type: "profile"
    });
    pushToast({
      title: "Notifications saved",
      description: "Your preference changes are active now.",
      tone: "success"
    });
  };

  return (
    <section id="notifications" className="bubble-card px-8 py-8">
      <p className="relative z-10 text-sm font-semibold uppercase tracking-[0.2em] text-primary/75">Notifications</p>
      <h2 className="bubble-title relative z-10 mt-3 text-3xl">Stay updated without the noise</h2>
      <div className="mt-6 grid gap-4">
        <ToggleSwitch
          checked={profile.notifications.emailNotifications}
          onChange={(checked) => handleUpdate("emailNotifications", checked)}
          label="Email notifications"
          description="Receive account and profile updates by email."
        />
        <ToggleSwitch
          checked={profile.notifications.courseUpdates}
          onChange={(checked) => handleUpdate("courseUpdates", checked)}
          label="Course updates"
          description="Get notified when your active courses receive fresh content or structural changes."
        />
        <ToggleSwitch
          checked={profile.notifications.newContentAlerts}
          onChange={(checked) => handleUpdate("newContentAlerts", checked)}
          label="New content alerts"
          description="Be notified when new lessons, recommendations, or resources are added to your learning path."
        />
      </div>
    </section>
  );
};
