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
  createdAt?: string;
};

export type AuthSession = {
  accessToken: string;
  user: AuthUser;
};
