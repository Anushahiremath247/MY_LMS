import { AccountSettingsPanel } from "@/components/profile/account-settings-panel";
import { NotificationSettingsPanel } from "@/components/profile/notification-settings-panel";
import { PrivacySettingsPanel } from "@/components/profile/privacy-settings-panel";

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-6">
      <PrivacySettingsPanel />
      <NotificationSettingsPanel />
      <AccountSettingsPanel />
    </div>
  );
}
