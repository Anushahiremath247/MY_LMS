"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProfileStore } from "@/store/profile-store";
import { useToastStore } from "@/store/toast-store";
import { Button } from "../ui/button";

const editProfileSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(8, "Enter a valid phone number"),
  bio: z.string().min(20, "Tell us a bit more about yourself"),
  skills: z.string().min(3, "Add at least one skill or interest")
});

type EditProfileValues = z.infer<typeof editProfileSchema>;

export const EditProfileForm = () => {
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const addActivity = useProfileStore((state) => state.addActivity);
  const pushToast = useToastStore((state) => state.pushToast);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema)
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName,
        username: profile.username,
        email: profile.email,
        phone: profile.phone,
        bio: profile.bio,
        skills: profile.skills.join(", ")
      });
    }
  }, [profile, reset]);

  if (!profile) {
    return null;
  }

  const onSubmit = handleSubmit(async (values) => {
    updateProfile({
      fullName: values.fullName,
      username: values.username,
      email: values.email,
      phone: values.phone,
      bio: values.bio,
      skills: values.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      avatar: previewImage ?? profile.avatar
    });
    addActivity({
      title: "Profile updated",
      description: "Basic profile information was edited from the settings form.",
      type: "profile"
    });
    pushToast({
      title: "Profile saved",
      description: "Your profile details were updated successfully.",
      tone: "success"
    });
  });

  return (
    <section className="bubble-card px-8 py-8">
      <p className="relative z-10 text-sm font-semibold uppercase tracking-[0.2em] text-primary/75">Edit profile</p>
      <h1 className="bubble-title relative z-10 mt-3 text-3xl">Update your details</h1>
      <form className="mt-8 space-y-5" onSubmit={onSubmit}>
        <div className="glass-panel flex flex-col gap-4 rounded-[1.75rem] p-5 sm:flex-row sm:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewImage ?? profile.avatar}
            alt={profile.fullName}
            className="h-20 w-20 rounded-[1.5rem] bg-slate-100 object-cover"
          />
          <div className="flex-1">
            <p className="font-medium text-ink">Profile image</p>
            <p className="mt-1 text-sm text-slate-500">Upload a new image and preview it before saving.</p>
          </div>
          <label className="glass-panel inline-flex cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-slate-700">
            Choose image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  setPreviewImage(typeof reader.result === "string" ? reader.result : null);
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Full name</label>
            <input
              {...register("fullName")}
              className="h-12 w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
            />
            {errors.fullName ? <p className="mt-2 text-sm text-rose-500">{errors.fullName.message}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Username</label>
            <input
              {...register("username")}
              className="h-12 w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
            />
            {errors.username ? <p className="mt-2 text-sm text-rose-500">{errors.username.message}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Email</label>
            <input
              {...register("email")}
              className="h-12 w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
            />
            {errors.email ? <p className="mt-2 text-sm text-rose-500">{errors.email.message}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Phone number</label>
            <input
              {...register("phone")}
              className="h-12 w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
            />
            {errors.phone ? <p className="mt-2 text-sm text-rose-500">{errors.phone.message}</p> : null}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">Bio / About me</label>
          <textarea
            rows={5}
            {...register("bio")}
            className="w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          />
          {errors.bio ? <p className="mt-2 text-sm text-rose-500">{errors.bio.message}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">Skills / Interests</label>
          <input
            {...register("skills")}
            placeholder="React, Product Design, System Design"
            className="h-12 w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          />
          {errors.skills ? <p className="mt-2 text-sm text-rose-500">{errors.skills.message}</p> : null}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          Save profile changes
        </Button>
      </form>
    </section>
  );
};
