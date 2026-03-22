"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useProfileStore } from "@/store/profile-store";
import { useToastStore } from "@/store/toast-store";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";

export const AccountSettingsPanel = () => {
  const router = useRouter();
  const deactivateAccount = useProfileStore((state) => state.deactivateAccount);
  const clearProfile = useProfileStore((state) => state.clearProfile);
  const clearSession = useAuthStore((state) => state.clearSession);
  const pushToast = useToastStore((state) => state.pushToast);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDeactivate = () => {
    deactivateAccount();
    setDeactivateOpen(false);
    pushToast({
      title: "Account deactivated",
      description: "Your profile is now marked as inactive.",
      tone: "info"
    });
  };

  const handleDelete = () => {
    clearProfile();
    clearSession();
    setDeleteOpen(false);
    pushToast({
      title: "Account removed",
      description: "Your local account state has been cleared.",
      tone: "success"
    });
    router.push("/");
  };

  return (
    <section id="account" className="bubble-card px-8 py-8">
      <p className="relative z-10 text-sm font-semibold uppercase tracking-[0.2em] text-primary/75">Account</p>
      <h2 className="bubble-title relative z-10 mt-3 text-3xl">Danger zone</h2>
      <p className="mt-3 max-w-2xl text-base leading-8 text-slate-500">
        Use these actions carefully. Deactivation keeps your data inactive; deletion clears your local account state entirely.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => setDeactivateOpen(true)}>
          Deactivate account
        </Button>
        <Button className="bg-rose-500 hover:bg-rose-600" onClick={() => setDeleteOpen(true)}>
          Delete account
        </Button>
      </div>

      <Modal open={deactivateOpen} title="Deactivate account?" onClose={() => setDeactivateOpen(false)}>
        <p className="text-sm leading-7 text-slate-500">
          Your account will be marked inactive and can be restored later.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" onClick={() => setDeactivateOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeactivate}>Confirm deactivation</Button>
        </div>
      </Modal>

      <Modal open={deleteOpen} title="Delete account?" onClose={() => setDeleteOpen(false)}>
        <p className="text-sm leading-7 text-slate-500">
          This clears the local account state from this LMS workspace. Continue only if you are sure.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-rose-500 hover:bg-rose-600" onClick={handleDelete}>
            Delete now
          </Button>
        </div>
      </Modal>
    </section>
  );
};
