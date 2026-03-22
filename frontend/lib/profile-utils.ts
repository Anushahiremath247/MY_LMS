import type { AuthUser, UserProfile } from "@/types";

const completionFields = (profile: UserProfile) => [
  profile.avatar,
  profile.fullName,
  profile.username,
  profile.email,
  profile.phone,
  profile.bio,
  profile.skills.length ? "skills" : ""
];

export const calculateProfileCompletion = (profile: UserProfile) => {
  const filled = completionFields(profile).filter((value) => value && String(value).trim().length > 0).length;
  return Math.round((filled / completionFields(profile).length) * 100);
};

export const buildInitialProfile = (user: AuthUser): UserProfile => {
  const firstName = user.name.split(" ")[0]?.toLowerCase() || "learner";
  const timestamp = new Date().toISOString();

  return {
    userId: user.id,
    fullName: user.name,
    username: `${firstName}${user.id.slice(-4)}`,
    email: user.email,
    phone: "",
    bio: "Building momentum through focused, structured learning.",
    skills: ["Learning Systems", "Product Thinking", "Self-paced Growth"],
    avatar:
      user.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(user.name)}`,
    role: user.role ?? "student",
    privacy: {
      profileVisibility: "public",
      showEmail: true,
      showPhone: false,
      showBio: true
    },
    notifications: {
      emailNotifications: true,
      courseUpdates: true,
      newContentAlerts: true
    },
    activity: [
      {
        id: "welcome",
        title: "Profile created",
        description: "Your Lazy Learning profile is ready to personalize.",
        type: "profile",
        timestamp
      }
    ],
    sessions: [
      {
        id: "current-device",
        label: "Current browser session",
        location: "Primary device",
        lastActiveAt: timestamp,
        current: true
      }
    ],
    lastLoginAt: timestamp,
    accountStatus: "active",
    passwordUpdatedAt: timestamp,
    purchasedCourses: [],
    paymentHistory: [],
    activeSubscription: null,
    watchHistory: []
  };
};

export const timeAgoLabel = (value: string) => {
  const timestamp = new Date(value).getTime();
  const diff = Date.now() - timestamp;
  const minutes = Math.max(1, Math.floor(diff / (1000 * 60)));

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days}d ago`;
  }

  return new Date(value).toLocaleDateString();
};
