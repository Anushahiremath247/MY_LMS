import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/app-error.js";
import { compareValue, hashValue } from "../../utils/hash.js";

const buildUsername = (name: string, email: string) => {
  const base =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ".")
      .replace(/(^\.|\.$)/g, "") || email.split("@")[0];

  return `${base}.${Math.floor(Math.random() * 900 + 100)}`;
};

const createActivity = async (userId: string, action: string, description: string) => {
  await prisma.activityLog.create({
    data: {
      userId,
      action,
      description
    }
  });
};

const ensureProfileDefaults = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  await prisma.profile.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      username: buildUsername(user.name, user.email),
      bio: "Building momentum through focused, structured learning.",
      skills: "Learning Systems,Product Thinking,Self-paced Growth",
      imageUrl: user.avatar ?? undefined
    }
  });

  await prisma.privacySetting.upsert({
    where: { userId },
    update: {},
    create: {
      userId
    }
  });

  await prisma.notificationSetting.upsert({
    where: { userId },
    update: {},
    create: {
      userId
    }
  });
};

const calculateCompletion = (profile: {
  username: string | null;
  phone: string | null;
  bio: string | null;
  skills: string | null;
  imageUrl: string | null;
  email: string;
  name: string;
}) => {
  const fields = [
    profile.imageUrl,
    profile.name,
    profile.username,
    profile.email,
    profile.phone,
    profile.bio,
    profile.skills
  ];

  return Math.round((fields.filter((value) => value && String(value).trim().length > 0).length / fields.length) * 100);
};

export const getProfileOverview = async (userId: string) => {
  await ensureProfileDefaults(userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      privacy: true,
      notifications: true,
      enrollments: {
        include: {
          subject: {
            include: {
              sections: {
                include: {
                  videos: true
                }
              }
            }
          }
        }
      },
      progress: true,
      certificates: true
    }
  });

  if (!user || !user.profile || !user.privacy || !user.notifications) {
    throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
  }

  const enrolledCourses = user.enrollments.map((enrollment) => {
    const videos = enrollment.subject.sections.flatMap((section) => section.videos);
    const completed = user.progress.filter(
      (progress) => videos.some((video) => video.id === progress.videoId) && progress.isCompleted
    ).length;
    const percentage = videos.length ? Math.round((completed / videos.length) * 100) : 0;

    return {
      id: enrollment.subject.id,
      title: enrollment.subject.title,
      slug: enrollment.subject.slug,
      thumbnail: enrollment.subject.thumbnail,
      progress: percentage,
      lessonsCount: videos.length
    };
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      lastLoginAt: user.lastLoginAt,
      accountStatus: user.deactivatedAt ? "deactivated" : "active"
    },
    profile: {
      username: user.profile.username,
      phone: user.profile.phone,
      bio: user.profile.bio,
      skills: user.profile.skills?.split(",").filter(Boolean) ?? [],
      imageUrl: user.profile.imageUrl
    },
    privacy: user.privacy,
    notifications: user.notifications,
    summary: {
      profileCompletion: calculateCompletion({
        username: user.profile.username,
        phone: user.profile.phone,
        bio: user.profile.bio,
        skills: user.profile.skills,
        imageUrl: user.profile.imageUrl,
        email: user.email,
        name: user.name
      }),
      enrolledCoursesCount: enrolledCourses.length,
      certificatesEarned: user.certificates.filter((certificate) => certificate.status === "earned").length,
      courseProgressSummary: enrolledCourses
    },
    certificates: user.certificates
  };
};

export const updateProfileDetails = async (
  userId: string,
  input: {
    fullName: string;
    username: string;
    email: string;
    phone?: string;
    bio?: string;
    skills: string[];
    imageUrl?: string;
  }
) => {
  await ensureProfileDefaults(userId);

  const existingProfile = await prisma.profile.findFirst({
    where: {
      username: input.username,
      userId: { not: userId }
    }
  });

  if (existingProfile) {
    throw new AppError("Username is already in use", StatusCodes.CONFLICT);
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: input.email,
      id: { not: userId }
    }
  });

  if (existingUser) {
    throw new AppError("Email is already in use", StatusCodes.CONFLICT);
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        name: input.fullName,
        email: input.email,
        avatar: input.imageUrl || undefined
      }
    }),
    prisma.profile.update({
      where: { userId },
      data: {
        username: input.username,
        phone: input.phone || null,
        bio: input.bio || null,
        skills: input.skills.join(","),
        imageUrl: input.imageUrl || null
      }
    })
  ]);

  await createActivity(userId, "profile.updated", "Updated profile information");

  return getProfileOverview(userId);
};

export const changeProfilePassword = async (
  userId: string,
  input: {
    currentPassword: string;
    newPassword: string;
  }
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  const isValid = await compareValue(input.currentPassword, user.passwordHash);
  if (!isValid) {
    throw new AppError("Current password is incorrect", StatusCodes.UNAUTHORIZED);
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash: await hashValue(input.newPassword)
    }
  });

  await createActivity(userId, "security.password_changed", "Changed account password");
};

export const getUserActivity = async (userId: string) =>
  prisma.activityLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20
  });

export const getUserCourseSummary = async (userId: string) => {
  const profile = await getProfileOverview(userId);
  return profile.summary.courseProgressSummary;
};

export const getPrivacySettings = async (userId: string) => {
  await ensureProfileDefaults(userId);
  return prisma.privacySetting.findUniqueOrThrow({ where: { userId } });
};

export const updatePrivacySettings = async (
  userId: string,
  input: {
    profileVisibility: boolean;
    showEmail: boolean;
    showPhone: boolean;
    showBio: boolean;
  }
) => {
  const privacy = await prisma.privacySetting.upsert({
    where: { userId },
    update: input,
    create: {
      userId,
      ...input
    }
  });

  await createActivity(userId, "privacy.updated", "Updated privacy preferences");
  return privacy;
};

export const getNotificationSettings = async (userId: string) => {
  await ensureProfileDefaults(userId);
  return prisma.notificationSetting.findUniqueOrThrow({ where: { userId } });
};

export const updateNotificationSettings = async (
  userId: string,
  input: {
    emailNotifications: boolean;
    courseUpdateNotifications: boolean;
    newContentAlerts: boolean;
  }
) => {
  const notifications = await prisma.notificationSetting.upsert({
    where: { userId },
    update: input,
    create: {
      userId,
      ...input
    }
  });

  await createActivity(userId, "notifications.updated", "Updated notification preferences");
  return notifications;
};

export const deactivateUserAccount = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      deactivatedAt: new Date()
    }
  });

  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() }
  });

  await createActivity(userId, "account.deactivated", "Deactivated account");
};

export const deleteUserAccount = async (userId: string) => {
  await prisma.user.delete({
    where: { id: userId }
  });
};
