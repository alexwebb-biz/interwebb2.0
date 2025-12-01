export type PackageTier = {
  slug: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  highlight?: boolean;
};

export const packageTiers: PackageTier[] = [
  {
    slug: "starter",
    name: "STARTER",
    price: 599,
    description: "Perfect for startups needing a professional, high-impact presence.",
    features: [
      "Custom UI/UX Design",
      "5-Page React Website",
      "CMS Integration",
      "Basic SEO Setup",
      "1 Month Support",
      "Basic Analytics",
    ],
    highlight: false,
  },
  {
    slug: "growth",
    name: "GROWTH",
    price: 999,
    description: "For businesses ready to scale with advanced functionality.",
    features: [
      "Strategy Workshop",
      "10+ Pages / Blog",
      "Advanced Animations",
      "Conversion Optimization",
      "Analytics Dashboard",
      "3 Months Support",
    ],
    highlight: true,
  },
  {
    slug: "enterprise",
    name: "ENTERPRISE",
    price: 1499,
    description: "Complex platforms and bespoke digital products.",
    features: [
      "Full Product Design",
      "Custom Web App (SaaS)",
      "API Integrations",
      "Scalable Cloud Arch.",
      "Dedicated Team",
      "SLA Support",
    ],
    highlight: false,
  },
];
