import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2),
    username: z.string().min(3),
    email: z.string().email(),
    phone: z.string().min(8).optional().or(z.literal("")),
    bio: z.string().min(10).optional().or(z.literal("")),
    skills: z.array(z.string()).default([]),
    imageUrl: z.string().url().optional().or(z.literal(""))
  })
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(8)
  })
});

export const updatePrivacySchema = z.object({
  body: z.object({
    profileVisibility: z.boolean(),
    showEmail: z.boolean(),
    showPhone: z.boolean(),
    showBio: z.boolean()
  })
});

export const updateNotificationSchema = z.object({
  body: z.object({
    emailNotifications: z.boolean(),
    courseUpdateNotifications: z.boolean(),
    newContentAlerts: z.boolean()
  })
});

export const deleteAccountSchema = z.object({
  body: z.object({
    confirm: z.literal("DELETE")
  })
});
