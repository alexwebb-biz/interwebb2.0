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
    client: "CLIENT ONE",
    title: "Site One",
    desc: "Swap this with a one-liner on what you delivered and the outcome.",
    tags: ["Next.js", "Tailwind", "TypeScript"],
    image: "https://picsum.photos/800/600?random=21",
    previewVideo: "/previews/site-one.mp4",
    liveUrl: "https://yoursite1.com",
    metric: "Launched in 6 weeks • 40% faster LCP",
    role: "Design & Build",
    accent: "#38bdf8"
  },
  {
    client: "CLIENT TWO",
    title: "Site Two",
    desc: "Short value statement. Include a metric or business impact.",
    tags: ["Next.js", "Tailwind", "TypeScript"],
    image: "https://picsum.photos/800/600?random=22",
    previewVideo: "/previews/site-two.mp4",
    liveUrl: "https://yoursite2.com",
    metric: "Reduced bounce by 28%",
    role: "Full stack",
    accent: "#a855f7"
  },
  {
    client: "CLIENT THREE",
    title: "Site Three",
    desc: "Add a concise problem ? solution line.",
    tags: ["Next.js", "Tailwind", "TypeScript"],
    image: "https://picsum.photos/800/600?random=23",
    previewVideo: "/previews/site-three.mp4",
    liveUrl: "https://yoursite3.com",
    metric: "Uptime 99.98%",
    role: "Engineering",
    accent: "#fbbf24"
  },
  {
    client: "CLIENT FOUR",
    title: "Site Four",
    desc: "Highlight the hardest part you solved.",
    tags: ["Next.js", "Tailwind", "TypeScript"],
    image: "https://picsum.photos/800/600?random=24",
    previewVideo: "/previews/site-four.mp4",
    liveUrl: "https://yoursite4.com",
    metric: "+2x conversion from mobile",
    role: "Lead",
    accent: "#22c55e"
  }
];
