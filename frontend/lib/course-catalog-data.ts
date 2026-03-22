import type { Course, CourseSection, Lesson } from "@/types";
import seedCourses from "@/data/seed_courses.json";
import seedVideos from "@/data/seed_videos.json";
import { getCourseFallbackThumbnail } from "./image-fallbacks";

type CourseAccessType = "free" | "paid" | "subscription";
type CourseLevel = Course["level"];

type CourseSeed = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  level: CourseLevel;
  accessType: CourseAccessType;
  price: number;
  listPrice: number;
  previewLessonsCount: number;
  instructor: string;
  duration: string;
  rating: number;
  videoPool: string;
  videoOffset: number;
  videoCount: number;
  sectionTitles: string[];
  subscriptionPlanCode?: string;
};

type VideoSeed = {
  pool: string;
  title: string;
  description: string;
  youtubeUrl: string;
};

const enrolledCourseDefaults = new Map<string, number>([
  ["python-basics-course", 68],
  ["java-foundations-course", 42],
  ["sql-fundamentals-course", 35],
  ["html-css-bootcamp", 57],
  ["react-foundations-course", 26],
  ["nodejs-fundamentals-course", 31]
]);

const extractYoutubeId = (youtubeUrl: string) => {
  try {
    const url = new URL(youtubeUrl);

    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "");
    }

    if (url.searchParams.get("v")) {
      return url.searchParams.get("v") ?? "";
    }

    const segments = url.pathname.split("/").filter(Boolean);
    const shortIndex = segments.findIndex((segment) => segment === "shorts");
    if (shortIndex >= 0) {
      return segments[shortIndex + 1] ?? "";
    }

    return segments[segments.length - 1] ?? "";
  } catch {
    return youtubeUrl;
  }
};

const buildEmbedUrl = (youtubeId: string) => `https://www.youtube.com/embed/${youtubeId}`;
const buildThumbnailUrl = (youtubeId: string) => `https://img.youtube.com/vi/${youtubeId}/0.jpg`;

const groupVideosByPool = (videos: VideoSeed[]) =>
  videos.reduce<Record<string, VideoSeed[]>>((accumulator, video) => {
    accumulator[video.pool] ??= [];
    accumulator[video.pool].push(video);
    return accumulator;
  }, {});

const buildLessons = (courseSeed: CourseSeed, videoPool: VideoSeed[]) => {
  const poolSize = videoPool.length;
  const selectedVideos = Array.from({ length: courseSeed.videoCount }, (_, index) => {
    const source = videoPool[(courseSeed.videoOffset + index) % poolSize];
    const youtubeId = extractYoutubeId(source.youtubeUrl);

    return {
      ...source,
      youtubeId,
      embedUrl: buildEmbedUrl(youtubeId),
      thumbnailUrl: buildThumbnailUrl(youtubeId),
      orderIndex: index + 1
    };
  });

  const lessonsPerSection = Math.ceil(selectedVideos.length / courseSeed.sectionTitles.length);

  const sections: CourseSection[] = courseSeed.sectionTitles.map((sectionTitle, sectionIndex) => {
    const sectionLessons = selectedVideos.slice(sectionIndex * lessonsPerSection, (sectionIndex + 1) * lessonsPerSection);

    const videos: Lesson[] = sectionLessons.map((source, lessonIndex) => ({
      id: `${courseSeed.slug}-lesson-${source.orderIndex}`,
      title: source.title,
      description: source.description,
      youtubeId: source.youtubeId,
      youtubeUrl: source.youtubeUrl,
      embedUrl: source.embedUrl,
      thumbnailUrl: source.thumbnailUrl,
      durationSeconds: 780 + source.orderIndex * 75,
      orderIndex: lessonIndex + 1,
      completed: enrolledCourseDefaults.has(courseSeed.slug) ? source.orderIndex <= 2 : false,
      locked: false
    }));

    return {
      id: `${courseSeed.slug}-section-${sectionIndex + 1}`,
      title: sectionTitle,
      orderIndex: sectionIndex + 1,
      videos: videos.map((lesson, lessonIndex) => ({
        ...lesson,
        previousVideoId: selectedVideos[sourceIndex(sectionIndex, lessonIndex, lessonsPerSection) - 1]
          ? `${courseSeed.slug}-lesson-${sourceIndex(sectionIndex, lessonIndex, lessonsPerSection)}`
          : null,
        nextVideoId: selectedVideos[sourceIndex(sectionIndex, lessonIndex, lessonsPerSection) + 1]
          ? `${courseSeed.slug}-lesson-${sourceIndex(sectionIndex, lessonIndex, lessonsPerSection) + 2}`
          : null
      }))
    };
  });

  return {
    sections,
    thumbnail: getCourseFallbackThumbnail(courseSeed.category)
  };
};

const sourceIndex = (sectionIndex: number, lessonIndex: number, lessonsPerSection: number) =>
  sectionIndex * lessonsPerSection + lessonIndex;

const courseSeeds = seedCourses as CourseSeed[];
const videoSeeds = seedVideos as VideoSeed[];
const videosByPool = groupVideosByPool(videoSeeds);

export const courses: Course[] = courseSeeds.map((courseSeed) => {
  const pool = videosByPool[courseSeed.videoPool] ?? [];
  const { sections, thumbnail } = buildLessons(courseSeed, pool);
  const lessonsCount = sections.reduce((sum, section) => sum + section.videos.length, 0);
  const progress = enrolledCourseDefaults.get(courseSeed.slug);

  return {
    id: courseSeed.slug,
    slug: courseSeed.slug,
    title: courseSeed.title,
    shortDescription: courseSeed.shortDescription,
    description: courseSeed.description,
    instructor: courseSeed.instructor,
    duration: courseSeed.duration,
    rating: courseSeed.rating,
    category: courseSeed.category,
    level: courseSeed.level,
    accessType: courseSeed.accessType,
    price: courseSeed.price,
    listPrice: courseSeed.listPrice,
    subscriptionPlanIds: courseSeed.subscriptionPlanCode ? [courseSeed.subscriptionPlanCode] : undefined,
    previewLessonsCount: courseSeed.previewLessonsCount,
    lessonsCount,
    thumbnail,
    progress,
    isEnrolled: progress !== undefined,
    sections
  };
});
