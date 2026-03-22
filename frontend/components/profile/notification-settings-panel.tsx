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
    <section id="notifications" className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-soft backdrop-blur-xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Notifications</p>
      <h2 className="mt-3 font-display text-3xl font-semibold text-ink">Stay updated without the noise</h2>
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
