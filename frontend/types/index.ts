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
  level: "Beginner" | "Intermediate" | "Advanced";
  accessType: "free" | "paid" | "subscription";
  price: number;
  listPrice?: number;
  subscriptionPlanIds?: string[];
  previewLessonsCount?: number;
  lessonsCount: number;
  thumbnail: string;
  progress?: number;
  isEnrolled?: boolean;
  purchased?: boolean;
  hasActiveSubscription?: boolean;
  canAccess?: boolean;
  primaryAction?: "start" | "enroll" | "buy" | "subscribe";
  sections: CourseSection[];
};

export type CourseListItem = Omit<Course, "sections">;

export type CourseCatalogSummary = {
  totalCourses: number;
  enrolledCourses: number;
  totalLessons: number;
  freeCourses: number;
  paidCourses: number;
  subscriptionCourses: number;
};

export type PaginatedCoursesResponse = {
  courses: CourseListItem[];
  total: number;
  hasMore: boolean;
  nextPage: number | null;
  page: number;
  limit: number;
  categories: string[];
  summary: CourseCatalogSummary;
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
  youtubeUrl?: string;
  embedUrl?: string;
  thumbnailUrl?: string;
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

export type SubscriptionPlan = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  recommended?: boolean;
};

export type PaymentHistoryItem = {
  id: string;
  type: "course_purchase" | "subscription";
  courseId?: string;
  courseTitle?: string;
  subscriptionPlanId?: string;
  subscriptionPlanName?: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed";
  method: "upi" | "card" | "bank_transfer";
  reference: string;
  createdAt: string;
};

export type PurchasedCourse = {
  courseId: string;
  purchasedAt: string;
  orderId: string;
  paymentId: string;
};

export type ActiveSubscription = {
  planId: string;
  planName: string;
  startedAt: string;
  expiresAt: string;
  billingCycle: "monthly" | "yearly";
  status: "active" | "expired" | "canceled";
};

export type WatchHistoryItem = {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  subtitle?: string;
  watchedAt: string;
  progressSeconds?: number;
};

export type CourseAccessState = {
  enrolled: boolean;
  purchased: boolean;
  subscribed: boolean;
  canAccess: boolean;
  cta: "start" | "enroll" | "buy" | "subscribe";
  label: string;
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
  purchasedCourses: PurchasedCourse[];
  paymentHistory: PaymentHistoryItem[];
  activeSubscription: ActiveSubscription | null;
  watchHistory: WatchHistoryItem[];
};
