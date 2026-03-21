import type { Course, Resource, Testimonial } from "@/types";

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Priya Menon",
    role: "Frontend Engineer",
    quote: "Lazy Learning feels calm and structured. I always know what to study next."
  },
  {
    id: "2",
    name: "Arjun Patel",
    role: "Career Switcher",
    quote: "The lesson flow and progress tracking made self-learning feel much less overwhelming."
  },
  {
    id: "3",
    name: "Maya Chen",
    role: "Product Designer",
    quote: "The AI tutor gives just enough guidance without getting in the way of focused study."
  }
];

export const courses: Course[] = [
  {
    id: "python-mastery",
    slug: "python-mastery",
    title: "Python Mastery Blueprint",
    shortDescription: "Build strong Python fundamentals with structured video lessons.",
    description:
      "A clear beginner-to-intermediate path covering Python syntax, problem solving, and practical project thinking with AI-assisted study support.",
    instructor: "Dr. Mira Lawson",
    duration: "14h 30m",
    rating: 4.9,
    category: "Programming",
    lessonsCount: 12,
    thumbnail:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    progress: 72,
    isEnrolled: true,
    sections: [
      {
        id: "py-1",
        title: "Python Basics",
        orderIndex: 1,
        videos: [
          {
            id: "py-v1",
            title: "Introduction",
            description: "Understand the Python ecosystem and setup.",
            youtubeId: "rfscVS0vtbw",
            durationSeconds: 1200,
            orderIndex: 1,
            completed: true,
            nextVideoId: "py-v2"
          },
          {
            id: "py-v2",
            title: "Variables",
            description: "Learn how values, names, and state work in Python.",
            youtubeId: "_uQrJ0TkZlc",
            durationSeconds: 980,
            orderIndex: 2,
            completed: true,
            previousVideoId: "py-v1",
            nextVideoId: "py-v3"
          },
          {
            id: "py-v3",
            title: "Data Types",
            description: "Explore strings, numbers, lists, and dictionaries.",
            youtubeId: "JJmcL1N2KQs",
            durationSeconds: 1100,
            orderIndex: 3,
            previousVideoId: "py-v2"
          }
        ]
      }
    ]
  },
  {
    id: "next-launchpad",
    slug: "next-launchpad",
    title: "Next.js Launchpad",
    shortDescription: "Ship modern web apps with App Router, layouts, and server actions.",
    description:
      "A polished path through Next.js fundamentals, routing patterns, server rendering, data fetching, and frontend architecture.",
    instructor: "Jordan Pike",
    duration: "10h 10m",
    rating: 4.8,
    category: "Frontend",
    lessonsCount: 10,
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    progress: 34,
    isEnrolled: true,
    sections: []
  },
  {
    id: "system-design",
    slug: "system-design",
    title: "Practical System Design",
    shortDescription: "Learn scalable architecture through approachable visual lessons.",
    description:
      "A modern breakdown of APIs, caching, queues, resilience, and architecture tradeoffs for real product teams.",
    instructor: "Nadia Cruz",
    duration: "9h 45m",
    rating: 4.7,
    category: "Backend",
    lessonsCount: 8,
    thumbnail:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    sections: []
  },
  {
    id: "ai-builder",
    slug: "ai-builder",
    title: "AI Builder Studio",
    shortDescription: "Move from prompts to full AI product workflows.",
    description:
      "Learn how to design practical AI experiences, tutor flows, summary generation, and recommendation systems.",
    instructor: "Elena Ward",
    duration: "11h 05m",
    rating: 4.9,
    category: "AI / ML",
    lessonsCount: 14,
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    sections: []
  }
];

export const resources: Resource[] = [
  {
    id: "r1",
    title: "Python Full Course for Beginners",
    category: "Programming",
    youtubeUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    type: "video",
    difficulty: "beginner"
  },
  {
    id: "r2",
    title: "React JS Full Course Search",
    category: "Frontend",
    youtubeUrl: "https://www.youtube.com/results?search_query=react+js+full+course",
    type: "search",
    difficulty: "intermediate"
  },
  {
    id: "r3",
    title: "AWS Cloud Full Course Search",
    category: "Cloud",
    youtubeUrl: "https://www.youtube.com/results?search_query=aws+cloud+full+course",
    type: "search",
    difficulty: "intermediate"
  }
];

