export type WorkItem = {
  client: string;
  title: string;
  desc: string;
  tags: string[];
  image: string;
  liveUrl: string;
  previewVideo?: string;
  metric?: string;
  role?: string;
  accent?: string;
};

export const workItems: WorkItem[] = [
  {
    client: "Future Wave",
    title: "Future Wave Summit",
    desc: "Website for a tech conference.",
    tags: ["React.js", "Tailwind", "TypeScript"],
    image: "https://picsum.photos/800/600?random=21",
    previewVideo: "/previews/site-one.mp4",
    liveUrl: "https://futurewave-summit.vercel.app/",
    metric: "Launched in 6 weeks � 40% faster LCP",
    role: "Design & Build",
    accent: "#38bdf8"
  },
  {
    client: "Local Lens",
    title: "Local Business Directory",
    desc: "Boosting local business visibility online.",
    tags: ["React.js", "Tailwind", "TypeScript"],
    image: "https://picsum.photos/800/600?random=22",
    previewVideo: "/previews/site-two.mp4",
    liveUrl: "https://locallens-three.vercel.app/",
    metric: "Reduced bounce by 28%",
    role: "Full stack",
    accent: "#a855f7"
  },
  {
    client: "Reliable Plumbing",
    title: "Reliable Plumbing Site",
    desc: "Showcase Site for local plumber",
    tags: ["Next.js", "Tailwind", "TypeScript"],
    image: "https://picsum.photos/800/600?random=23",
    previewVideo: "/previews/site-three.mp4",
    liveUrl: "https://reliable-plumbing.vercel.app/",
    metric: "Uptime 99.98%",
    role: "Engineering",
    accent: "#fbbf24"
  },
  {
    client: "Atomic Habits Tracker",
    title: "Web App for Habit Tracking",
    desc: "Usable across devices to help users build atomic habits.",
    tags: ["Next.js", "Tailwind", "TypeScript"],
    image: "https://picsum.photos/800/600?random=24",
    previewVideo: "/previews/site-four.mp4",
    liveUrl: "https://atomic-habits-tracker-six.vercel.app/",
    metric: "+2x conversion from mobile",
    role: "Lead",
    accent: "#22c55e"
  }
];
