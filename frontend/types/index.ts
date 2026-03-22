export type Course = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  instructor: string;
  duration: string;
  rating: number;
  category: string;
  lessonsCount: number;
  thumbnail: string;
  progress?: number;
  isEnrolled?: boolean;
  sections: CourseSection[];
};

export type CourseSection = {
  id: string;
  title: string;
  orderIndex: number;
  videos: Lesson[];
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  durationSeconds: number;
  orderIndex: number;
  locked?: boolean;
  completed?: boolean;
  previousVideoId?: string | null;
  nextVideoId?: string | null;
};

export type Resource = {
  id: string;
  title: string;
  category: string;
  youtubeUrl: string;
  type: "video" | "search" | "playlist";
  difficulty: "beginner" | "intermediate" | "advanced";
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role?: "student" | "admin";
  createdAt?: string;
};

export type AuthSession = {
  accessToken: string;
  user: AuthUser;
};

export type PrivacySettings = {
  profileVisibility: "public" | "private";
  showEmail: boolean;
  showPhone: boolean;
  showBio: boolean;
};

export type NotificationSettings = {
  emailNotifications: boolean;
  courseUpdates: boolean;
  newContentAlerts: boolean;
};

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  type: "profile" | "security" | "course" | "system";
  timestamp: string;
};

export type DeviceSession = {
  id: string;
  label: string;
  location: string;
  lastActiveAt: string;
  current?: boolean;
};

export type Certificate = {
  id: string;
  title: string;
  courseTitle: string;
  issuedAt: string;
  status: "earned" | "in-progress";
};

export type UserProfile = {
  userId: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  skills: string[];
  avatar: string;
  role: "student" | "admin";
  privacy: PrivacySettings;
  notifications: NotificationSettings;
  activity: ActivityItem[];
  sessions: DeviceSession[];
  lastLoginAt: string;
  accountStatus: "active" | "deactivated";
  passwordUpdatedAt: string;
};
