import type { Course, CourseSection, Lesson, Resource, SubscriptionPlan, Testimonial } from "@/types";

type LessonSeed = {
  title: string;
  description: string;
  youtubeId: string;
  completed?: boolean;
  locked?: boolean;
};

type CourseSeed = Omit<Course, "lessonsCount" | "sections"> & {
  sections: Array<{
    title: string;
    lessons: LessonSeed[];
  }>;
};

const buildSection = (courseId: string, sectionTitle: string, sectionIndex: number, seeds: LessonSeed[]): CourseSection => {
  const baseLessons: Lesson[] = seeds.map((seed, lessonIndex) => ({
    id: `${courseId}-l${sectionIndex}${lessonIndex + 1}`,
    title: seed.title,
    description: seed.description,
    youtubeId: seed.youtubeId,
    durationSeconds: 780 + lessonIndex * 140,
    orderIndex: lessonIndex + 1,
    completed: seed.completed,
    locked: seed.locked
  }));

  return {
    id: `${courseId}-s${sectionIndex}`,
    title: sectionTitle,
    orderIndex: sectionIndex,
    videos: baseLessons.map((lesson, lessonIndex) => ({
      ...lesson,
      previousVideoId: baseLessons[lessonIndex - 1]?.id ?? null,
      nextVideoId: baseLessons[lessonIndex + 1]?.id ?? null
    }))
  };
};

const buildCourse = (seed: CourseSeed): Course => {
  const sections = seed.sections.map((section, index) => buildSection(seed.id, section.title, index + 1, section.lessons));
  const lessonsCount = sections.reduce((sum, section) => sum + section.videos.length, 0);

  return {
    ...seed,
    lessonsCount,
    sections
  };
};

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

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For learners building steady momentum",
    description: "Unlock subscription-only paths, guided notes, and lighter study tools.",
    priceMonthly: 799,
    priceYearly: 6999,
    features: ["Subscription course access", "AI tutor support", "Progress sync across devices"]
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Best for focused upskilling",
    description: "Includes all Starter benefits plus premium study workflows and certificates.",
    priceMonthly: 1499,
    priceYearly: 12999,
    features: ["Everything in Starter", "Certificate-ready paths", "Priority premium recommendations"],
    recommended: true
  },
  {
    id: "studio",
    name: "Studio",
    tagline: "For serious career transitions",
    description: "A richer membership with deeper premium paths and personalized learning support.",
    priceMonthly: 2299,
    priceYearly: 19999,
    features: ["Everything in Pro", "Advanced system design tracks", "Extended watch history and receipts"]
  }
];

const courseSeeds: CourseSeed[] = [
  {
    id: "python-mastery",
    slug: "python-mastery",
    title: "Python Mastery Blueprint",
    shortDescription: "Build strong Python fundamentals with structured video lessons and quick wins.",
    description:
      "A clear beginner-to-intermediate path covering Python syntax, problem solving, and practical project thinking with AI-assisted study support.",
    instructor: "Dr. Mira Lawson",
    duration: "14h 30m",
    rating: 4.9,
    category: "Programming",
    level: "Beginner",
    accessType: "free",
    price: 0,
    listPrice: 0,
    previewLessonsCount: 6,
    thumbnail:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    progress: 72,
    isEnrolled: true,
    sections: [
      {
        title: "Python Basics",
        lessons: [
          {
            title: "Introduction",
            description: "Understand the Python ecosystem, setup, and what makes the language beginner friendly.",
            youtubeId: "rfscVS0vtbw",
            completed: true
          },
          {
            title: "Variables and Control Flow",
            description: "Work with values, conditional logic, and the mental model behind readable code.",
            youtubeId: "_uQrJ0TkZlc",
            completed: true
          },
          {
            title: "Data Types in Practice",
            description: "Use strings, numbers, lists, dictionaries, and sets in small real examples.",
            youtubeId: "JJmcL1N2KQs"
          }
        ]
      },
      {
        title: "Applied Python Thinking",
        lessons: [
          {
            title: "Functions and Reuse",
            description: "Break repeated logic into functions and understand inputs, outputs, and clean abstractions.",
            youtubeId: "rfscVS0vtbw"
          },
          {
            title: "Loops and Data Workflows",
            description: "Traverse collections, transform values, and build simple automation flows.",
            youtubeId: "_uQrJ0TkZlc",
            locked: true
          },
          {
            title: "Mini Project Build",
            description: "Combine core syntax into a compact project that feels like real software building.",
            youtubeId: "JJmcL1N2KQs",
            locked: true
          }
        ]
      }
    ]
  },
  {
    id: "next-launchpad",
    slug: "next-launchpad",
    title: "Next.js Launchpad",
    shortDescription: "Ship modern web apps with App Router, layouts, and a clean full-stack workflow.",
    description:
      "A polished path through Next.js fundamentals, routing patterns, server rendering, data fetching, and frontend architecture.",
    instructor: "Jordan Pike",
    duration: "10h 10m",
    rating: 4.8,
    category: "Frontend",
    level: "Intermediate",
    accessType: "paid",
    price: 3499,
    listPrice: 4999,
    previewLessonsCount: 2,
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    progress: 34,
    isEnrolled: true,
    sections: [
      {
        title: "App Router Foundations",
        lessons: [
          {
            title: "Routing and Layouts",
            description: "Understand nested layouts, route segments, and how App Router shapes the product structure.",
            youtubeId: "Z1RJmh_OqeA",
            completed: true
          },
          {
            title: "Server Components",
            description: "Learn where server rendering helps performance, security, and simpler data access.",
            youtubeId: "F5mRW0jo-U4"
          },
          {
            title: "Loading and Error States",
            description: "Create resilient route experiences with better transitions and feedback for learners.",
            youtubeId: "ua-CiDNNj30"
          }
        ]
      },
      {
        title: "Production Patterns",
        lessons: [
          {
            title: "Fetching and Mutations",
            description: "Connect UI and data with safe fetching patterns and responsive updates.",
            youtubeId: "GwIo3gDZCVQ"
          },
          {
            title: "Auth and Protected Routes",
            description: "Design modern auth flows without making the product feel heavy or confusing.",
            youtubeId: "F5mRW0jo-U4",
            locked: true
          },
          {
            title: "Deployment Workflow",
            description: "Move from local build to polished deployment with fewer last-minute surprises.",
            youtubeId: "Z1RJmh_OqeA",
            locked: true
          }
        ]
      }
    ]
  },
  {
    id: "system-design",
    slug: "system-design",
    title: "Practical System Design",
    shortDescription: "Learn scalable architecture through approachable visual lessons and tradeoff thinking.",
    description:
      "A modern breakdown of APIs, caching, queues, resilience, and architecture tradeoffs for real product teams.",
    instructor: "Nadia Cruz",
    duration: "9h 45m",
    rating: 4.7,
    category: "Backend",
    level: "Advanced",
    accessType: "subscription",
    price: 0,
    listPrice: 0,
    subscriptionPlanIds: ["pro", "studio"],
    previewLessonsCount: 1,
    thumbnail:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    progress: 18,
    isEnrolled: true,
    sections: [
      {
        title: "Design Building Blocks",
        lessons: [
          {
            title: "Client, Server, Database",
            description: "Map the core system components before diving into scale or optimization.",
            youtubeId: "HXV3zeQKqGY",
            completed: true
          },
          {
            title: "Caching and Throughput",
            description: "Understand how caching shapes performance, latency, and traffic resilience.",
            youtubeId: "GoXwIVyNvX0"
          },
          {
            title: "Queues and Async Work",
            description: "Decouple heavy work and improve reliability with asynchronous processing patterns.",
            youtubeId: "eIrMbAQSU34"
          }
        ]
      },
      {
        title: "Tradeoffs in Production",
        lessons: [
          {
            title: "Scaling Read and Write Paths",
            description: "Separate bottlenecks and reason clearly about throughput-heavy systems.",
            youtubeId: "HXV3zeQKqGY"
          },
          {
            title: "Designing for Failure",
            description: "Plan for retries, limits, fallbacks, and the kind of failure modes real teams see.",
            youtubeId: "GoXwIVyNvX0",
            locked: true
          },
          {
            title: "Interview Frameworks",
            description: "Structure a strong answer under pressure with a repeatable system design narrative.",
            youtubeId: "eIrMbAQSU34",
            locked: true
          }
        ]
      }
    ]
  },
  {
    id: "ai-builder",
    slug: "ai-builder",
    title: "AI Builder Studio",
    shortDescription: "Move from prompts to full AI product workflows with grounded product thinking.",
    description:
      "Learn how to design practical AI experiences, tutor flows, summary generation, and recommendation systems.",
    instructor: "Elena Ward",
    duration: "11h 05m",
    rating: 4.9,
    category: "AI / ML",
    level: "Intermediate",
    accessType: "paid",
    price: 4299,
    listPrice: 5999,
    previewLessonsCount: 2,
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    progress: 56,
    isEnrolled: true,
    sections: [
      {
        title: "Product AI Foundations",
        lessons: [
          {
            title: "What Makes an AI Product Useful",
            description: "Separate novelty from utility and focus on workflows that deliver real learner value.",
            youtubeId: "GwIo3gDZCVQ",
            completed: true
          },
          {
            title: "Prompt and Response Design",
            description: "Write prompts and guardrails that help the assistant stay clear, specific, and grounded.",
            youtubeId: "ua-CiDNNj30",
            completed: true
          },
          {
            title: "Tutor and Summary Flows",
            description: "Build in-product AI flows that support learning instead of distracting from it.",
            youtubeId: "F5mRW0jo-U4"
          }
        ]
      },
      {
        title: "Shipping AI Features",
        lessons: [
          {
            title: "Recommendations and Personalization",
            description: "Recommend next steps using progress, context, and user goals.",
            youtubeId: "Z1RJmh_OqeA"
          },
          {
            title: "Evaluation and Quality",
            description: "Measure whether the assistant is actually helping students learn faster and better.",
            youtubeId: "GwIo3gDZCVQ",
            locked: true
          },
          {
            title: "Operational Safety",
            description: "Handle failure states, hallucinations, and prompt abuse with a product mindset.",
            youtubeId: "ua-CiDNNj30",
            locked: true
          }
        ]
      }
    ]
  },
  {
    id: "cloud-ops-studio",
    slug: "cloud-ops-studio",
    title: "CloudOps Studio",
    shortDescription: "Build a stronger deployment mindset with cloud, Docker, and reliability fundamentals.",
    description:
      "Understand deployment pipelines, cloud primitives, container workflows, and monitoring habits that help software stay healthy in production.",
    instructor: "Reese Harper",
    duration: "8h 20m",
    rating: 4.8,
    category: "Cloud",
    level: "Intermediate",
    accessType: "subscription",
    price: 0,
    listPrice: 0,
    subscriptionPlanIds: ["pro", "studio"],
    previewLessonsCount: 1,
    thumbnail:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    isEnrolled: false,
    sections: [
      {
        title: "Cloud and Containers",
        lessons: [
          {
            title: "Cloud Concepts",
            description: "Learn how compute, storage, networking, and managed services fit together.",
            youtubeId: "GoXwIVyNvX0"
          },
          {
            title: "Docker Workflow",
            description: "Package an app consistently and understand what makes containers practical.",
            youtubeId: "HXV3zeQKqGY"
          },
          {
            title: "Deploying with Confidence",
            description: "Move from local app to deployed service with fewer surprises.",
            youtubeId: "eIrMbAQSU34"
          }
        ]
      },
      {
        title: "Reliability Habits",
        lessons: [
          {
            title: "Logs, Metrics, Alerts",
            description: "Observe what the system is doing before users have to tell you it is failing.",
            youtubeId: "GoXwIVyNvX0"
          },
          {
            title: "Scaling and Cost Awareness",
            description: "Keep the platform fast without ignoring operational cost and complexity.",
            youtubeId: "HXV3zeQKqGY"
          },
          {
            title: "Runbooks and Recovery",
            description: "Respond to incidents calmly with clear operational playbooks.",
            youtubeId: "eIrMbAQSU34"
          }
        ]
      }
    ]
  },
  {
    id: "product-ui-systems",
    slug: "product-ui-systems",
    title: "Product UI Systems",
    shortDescription: "Design calmer, sharper interfaces that feel intentional across product flows.",
    description:
      "A hands-on path through interface hierarchy, layout systems, visual rhythm, and collaboration between designers and frontend engineers.",
    instructor: "Maya Chen",
    duration: "7h 50m",
    rating: 4.8,
    category: "UI / UX",
    level: "Beginner",
    accessType: "free",
    price: 0,
    listPrice: 0,
    previewLessonsCount: 6,
    thumbnail:
      "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80",
    isEnrolled: false,
    sections: [
      {
        title: "Visual Hierarchy",
        lessons: [
          {
            title: "Layouts that Guide Attention",
            description: "Use spacing, contrast, and grouping to make the next action obvious.",
            youtubeId: "F5mRW0jo-U4"
          },
          {
            title: "Cards, States, and Motion",
            description: "Design responsive components that feel polished without becoming noisy.",
            youtubeId: "ua-CiDNNj30"
          },
          {
            title: "Premium Product Direction",
            description: "Develop a consistent visual language that can stand up in company review.",
            youtubeId: "Z1RJmh_OqeA"
          }
        ]
      },
      {
        title: "Systems Thinking",
        lessons: [
          {
            title: "Reusable Components",
            description: "Turn one-off designs into systems that speed up product delivery.",
            youtubeId: "F5mRW0jo-U4"
          },
          {
            title: "Responsive Experience",
            description: "Keep the product coherent across desktop, tablet, and mobile surfaces.",
            youtubeId: "ua-CiDNNj30"
          },
          {
            title: "Design Review Readiness",
            description: "Present choices with confidence, clarity, and the right product reasoning.",
            youtubeId: "Z1RJmh_OqeA"
          }
        ]
      }
    ]
  }
];

const catalogAngles = [
  "Fundamentals",
  "Projects",
  "Career",
  "Practice",
  "Systems",
  "Interview",
  "Applied",
  "Portfolio",
  "Toolkit",
  "Roadmap",
  "Automation",
  "Essentials"
] as const;

const catalogFormats = [
  "Sprint",
  "Studio",
  "Lab",
  "Workshop",
  "Track",
  "Playbook",
  "Deep Dive",
  "Blueprint",
  "Masterclass",
  "Accelerator",
  "Focus Path",
  "Intensive"
] as const;

const instructorRoster = [
  "Mira Lawson",
  "Jordan Pike",
  "Nadia Cruz",
  "Elena Ward",
  "Reese Harper",
  "Maya Chen",
  "Avery Brooks",
  "Noah Bennett",
  "Sophia Rivera",
  "Leo Hart"
] as const;

const generatedCourseSeeds: CourseSeed[] = courseSeeds.flatMap((seed, seedIndex) =>
  Array.from({ length: 84 }, (_, variantIndex) => {
    const serial = String(variantIndex + 1).padStart(2, "0");
    const angle = catalogAngles[(variantIndex + seedIndex) % catalogAngles.length];
    const format = catalogFormats[(variantIndex * 2 + seedIndex) % catalogFormats.length];
    const minutes = String((variantIndex * 7 + seedIndex * 11) % 60).padStart(2, "0");
    const rating = Number((4.5 + ((variantIndex + seedIndex) % 5) * 0.1).toFixed(1));

    return {
      ...seed,
      id: `${seed.id}-${serial}`,
      slug: `${seed.slug}-${serial}`,
      title: `${seed.title} ${angle} ${format}`,
      shortDescription: `${seed.shortDescription} This edition focuses on ${angle.toLowerCase()} with a calmer ${format.toLowerCase()} pace.`,
      description: `${seed.description} This catalog variation puts extra emphasis on ${angle.toLowerCase()} through a ${format.toLowerCase()} structure that keeps the next step obvious.`,
      instructor: instructorRoster[(variantIndex + seedIndex) % instructorRoster.length],
      duration: `${8 + ((variantIndex + seedIndex) % 9)}h ${minutes}m`,
      rating,
      progress: undefined,
      isEnrolled: false
    };
  })
);

export const courses: Course[] = [...courseSeeds, ...generatedCourseSeeds].map(buildCourse);

const directResourceSeeds: Omit<Resource, "id">[] = [
  {
    title: "Python Full Course for Beginners",
    category: "Programming",
    youtubeUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    type: "video",
    difficulty: "beginner"
  },
  {
    title: "Python Tutorial for Beginners",
    category: "Programming",
    youtubeUrl: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
    type: "video",
    difficulty: "beginner"
  },
  {
    title: "Python Data Types Lesson",
    category: "Programming",
    youtubeUrl: "https://www.youtube.com/watch?v=JJmcL1N2KQs",
    type: "video",
    difficulty: "beginner"
  },
  {
    title: "Web Development Crash Course",
    category: "Frontend",
    youtubeUrl: "https://www.youtube.com/watch?v=Z1RJmh_OqeA",
    type: "video",
    difficulty: "beginner"
  },
  {
    title: "Next.js Project Walkthrough",
    category: "Frontend",
    youtubeUrl: "https://www.youtube.com/watch?v=F5mRW0jo-U4",
    type: "video",
    difficulty: "intermediate"
  },
  {
    title: "UI Design Thinking Session",
    category: "UI / UX",
    youtubeUrl: "https://www.youtube.com/watch?v=ua-CiDNNj30",
    type: "video",
    difficulty: "intermediate"
  },
  {
    title: "AI Product Workflow Guide",
    category: "AI / ML",
    youtubeUrl: "https://www.youtube.com/watch?v=GwIo3gDZCVQ",
    type: "video",
    difficulty: "intermediate"
  },
  {
    title: "SQL Full Course",
    category: "Backend",
    youtubeUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
    type: "video",
    difficulty: "beginner"
  },
  {
    title: "JavaScript in Practice",
    category: "Frontend",
    youtubeUrl: "https://www.youtube.com/watch?v=GoXwIVyNvX0",
    type: "video",
    difficulty: "beginner"
  },
  {
    title: "Data Structures and Algorithms",
    category: "DSA",
    youtubeUrl: "https://www.youtube.com/watch?v=eIrMbAQSU34",
    type: "video",
    difficulty: "intermediate"
  }
];

const exactSearchResources: Omit<Resource, "id">[] = [
  ["Frontend", "React JS Full Course", "https://www.youtube.com/results?search_query=react+js+full+course", "beginner"],
  ["Frontend", "Next.js Full Course", "https://www.youtube.com/results?search_query=next+js+full+course", "beginner"],
  ["Backend", "Node.js Full Course", "https://www.youtube.com/results?search_query=node+js+full+course", "beginner"],
  ["Backend", "Express.js Tutorial", "https://www.youtube.com/results?search_query=express+js+tutorial", "beginner"],
  ["Backend", "MongoDB Full Course", "https://www.youtube.com/results?search_query=mongodb+full+course", "beginner"],
  ["Backend", "SQL Full Course", "https://www.youtube.com/results?search_query=sql+full+course", "beginner"],
  ["Backend", "PostgreSQL Tutorial", "https://www.youtube.com/results?search_query=postgresql+tutorial", "beginner"],
  ["Frontend", "Tailwind CSS Full Course", "https://www.youtube.com/results?search_query=tailwind+css+full+course", "beginner"],
  ["Frontend", "TypeScript Full Course", "https://www.youtube.com/results?search_query=typescript+full+course", "beginner"],
  ["Frontend", "JavaScript Full Course", "https://www.youtube.com/results?search_query=javascript+full+course", "beginner"],
  ["Cloud", "AWS Cloud Full Course", "https://www.youtube.com/results?search_query=aws+cloud+full+course", "intermediate"],
  ["Cloud", "DevOps Full Course", "https://www.youtube.com/results?search_query=devops+full+course", "intermediate"],
  ["Cloud", "Docker Full Course", "https://www.youtube.com/results?search_query=docker+full+course", "intermediate"],
  ["Cloud", "Kubernetes Course", "https://www.youtube.com/results?search_query=kubernetes+course", "intermediate"],
  ["Cloud", "Git and GitHub Full Course", "https://www.youtube.com/results?search_query=git+github+full+course", "beginner"],
  ["AI / ML", "AI Full Course", "https://www.youtube.com/results?search_query=ai+full+course", "beginner"],
  ["AI / ML", "Machine Learning Projects", "https://www.youtube.com/results?search_query=machine+learning+projects", "intermediate"],
  ["AI / ML", "Deep Learning Projects", "https://www.youtube.com/results?search_query=deep+learning+projects", "intermediate"],
  ["AI / ML", "LangChain Tutorial", "https://www.youtube.com/results?search_query=langchain+tutorial", "intermediate"],
  ["Mobile Dev", "Flutter Full Course", "https://www.youtube.com/results?search_query=flutter+full+course", "beginner"],
  ["Mobile Dev", "React Native Course", "https://www.youtube.com/results?search_query=react+native+course", "beginner"],
  ["Security", "Cyber Security Full Course", "https://www.youtube.com/results?search_query=cyber+security+full+course", "beginner"],
  ["Security", "Ethical Hacking Course", "https://www.youtube.com/results?search_query=ethical+hacking+course", "intermediate"],
  ["DSA", "DSA Full Course", "https://www.youtube.com/results?search_query=dsa+full+course", "intermediate"],
  ["DSA", "Data Structures Algorithms", "https://www.youtube.com/results?search_query=data+structures+algorithms", "intermediate"],
  ["UI / UX", "Figma Full Course", "https://www.youtube.com/results?search_query=figma+full+course", "beginner"],
  ["UI / UX", "UI UX Design Course", "https://www.youtube.com/results?search_query=ui+ux+design+course", "beginner"],
  ["Game Dev", "Unity Game Development", "https://www.youtube.com/results?search_query=unity+game+development", "intermediate"],
  ["Game Dev", "Unreal Engine Course", "https://www.youtube.com/results?search_query=unreal+engine+course", "intermediate"]
].map(([category, title, youtubeUrl, difficulty]) => ({
  category,
  title,
  youtubeUrl,
  type: "search" as const,
  difficulty: difficulty as Resource["difficulty"]
}));

const resourceTopics = [
  ["Programming", "python"],
  ["Frontend", "react js"],
  ["Frontend", "next js"],
  ["Frontend", "javascript"],
  ["Frontend", "typescript"],
  ["Frontend", "tailwind css"],
  ["Backend", "node js"],
  ["Backend", "express js"],
  ["Backend", "mongodb"],
  ["Backend", "postgresql"],
  ["Backend", "sql"],
  ["Backend", "prisma"],
  ["Backend", "system design"],
  ["Cloud", "aws cloud"],
  ["Cloud", "docker"],
  ["Cloud", "kubernetes"],
  ["Cloud", "devops"],
  ["Cloud", "git github"],
  ["AI / ML", "ai"],
  ["AI / ML", "machine learning"],
  ["AI / ML", "deep learning"],
  ["AI / ML", "llm engineering"],
  ["AI / ML", "langchain"],
  ["AI / ML", "prompt engineering"],
  ["Mobile Dev", "flutter"],
  ["Mobile Dev", "react native"],
  ["Security", "cyber security"],
  ["Security", "ethical hacking"],
  ["DSA", "dsa"],
  ["DSA", "data structures algorithms"],
  ["UI / UX", "figma"],
  ["UI / UX", "ui ux design"],
  ["UI / UX", "design systems"],
  ["Game Dev", "unity game development"],
  ["Game Dev", "unreal engine"],
  ["Programming", "java"],
  ["Programming", "c++"],
  ["Programming", "go language"],
  ["Backend", "redis"],
  ["Cloud", "linux"]
] as const;

const resourcePatterns = [
  ["full course", "beginner"],
  ["tutorial", "beginner"],
  ["from scratch", "beginner"],
  ["projects", "intermediate"],
  ["roadmap", "intermediate"],
  ["best practices", "advanced"]
] as const;

const toTitleCase = (value: string) =>
  value
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const generatedResources: Omit<Resource, "id">[] = resourceTopics.flatMap(([category, topic]) =>
  resourcePatterns.map(([pattern, difficulty]) => ({
    title: `${toTitleCase(topic)} ${toTitleCase(pattern)}`,
    category,
    youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${topic} ${pattern}`)}`,
    type: "search" as const,
    difficulty: difficulty as Resource["difficulty"]
  }))
);

export const resources: Resource[] = Array.from(
  new Map([...directResourceSeeds, ...exactSearchResources, ...generatedResources].map((resource) => [resource.youtubeUrl, resource])).values()
).map((resource, index) => ({
  ...resource,
  id: `r${index + 1}`
}));
