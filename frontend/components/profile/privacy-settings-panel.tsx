"use client";

import { useProfileStore } from "@/store/profile-store";
import { useToastStore } from "@/store/toast-store";
import { ToggleSwitch } from "../ui/toggle-switch";

export const PrivacySettingsPanel = () => {
  const profile = useProfileStore((state) => state.profile);
  const updatePrivacy = useProfileStore((state) => state.updatePrivacy);
  const addActivity = useProfileStore((state) => state.addActivity);
  const pushToast = useToastStore((state) => state.pushToast);

  if (!profile) {
    return null;
  }

  const handleUpdate = (updates: Parameters<typeof updatePrivacy>[0]) => {
    updatePrivacy(updates);
    addActivity({
      title: "Privacy settings updated",
      description: "Visibility preferences were adjusted from the profile settings page.",
      type: "profile"
    });
    pushToast({
      title: "Privacy saved",
      description: "Your visibility preferences were updated.",
      tone: "success"
    });
  };

  return (
    <section id="privacy" className="bubble-card px-8 py-8">
      <p className="relative z-10 text-sm font-semibold uppercase tracking-[0.2em] text-primary/75">Privacy</p>
      <h2 className="bubble-title relative z-10 mt-3 text-3xl">Control what others can see</h2>
      <div className="mt-6 grid gap-4">
        <div className="glass-panel relative z-10 rounded-[1.5rem] p-4">
          <p className="font-medium text-ink">Profile visibility</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {(["public", "private"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleUpdate({ profileVisibility: value })}
                className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
                  profile.privacy.profileVisibility === value
                    ? "bubble-bar text-white"
                    : "glass-panel text-slate-600"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <ToggleSwitch
          checked={profile.privacy.showEmail}
          onChange={(checked) => handleUpdate({ showEmail: checked })}
          label="Show email"
          description="Allow other users or mentors to view your email on shared profile views."
        />
        <ToggleSwitch
          checked={profile.privacy.showPhone}
          onChange={(checked) => handleUpdate({ showPhone: checked })}
          label="Show phone number"
          description="Keep your phone number private unless you explicitly want it visible."
        />
        <ToggleSwitch
          checked={profile.privacy.showBio}
          onChange={(checked) => handleUpdate({ showBio: checked })}
          label="Show bio"
          description="Hide your about section if you prefer a more minimal public profile."
        />
      </div>
    </section>
  );
};
