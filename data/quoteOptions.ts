export type MainOption = {
  id: string;
  name: string;
  desc: string;
  basePrice: number;
  tag?: string;
};

export type AddOn = {
  id: string;
  name: string;
  desc: string;
  price: number;
  tag?: string;
  appliesTo?: MainOption["id"][];
  group: string;
};

export const defaultMainOptions: MainOption[] = [
  {
    id: "express",
    name: "Express Showcase",
    desc: "1-3 page brochure site for trades and local services. Simple, tidy, and quick to ship.",
    basePrice: 299,
    tag: "Fast launch",
  },
  {
    id: "starter",
    name: "Business Website",
    desc: "5-page site with your services, testimonials, contact, and a clear call to action.",
    basePrice: 550,
    tag: "Most picked",
  },
  {
    id: "commerce",
    name: "E-commerce / CRM",
    desc: "Sell online, take bookings, and keep leads organised in one place.",
    basePrice: 780,
  },
];

export const defaultAddOns: AddOn[] = [
  {
    id: "seo-lite",
    name: "SEO Tune-Up",
    desc: "Titles, meta, speed check, and Google-friendly basics.",
    price: 50,
    appliesTo: ["express"],
    group: "Quick boosts",
  },
  {
    id: "logo-badge",
    name: "Logo Refresh",
    desc: "Tidy up or refresh your logo for web use.",
    price: 60,
    appliesTo: ["express"],
    group: "Quick boosts",
  },
  {
    id: "brand-kit",
    name: "Mini Brand Kit",
    desc: "Fonts, colours, and simple usage guide so it all stays consistent.",
    price: 80,
    appliesTo: ["express"],
    group: "Quick boosts",
  },
  {
    id: "copy-touch",
    name: "Copy Tidy-Up",
    desc: "Polish headlines and service blurbs so they read clearly.",
    price: 50,
    appliesTo: ["express"],
    group: "Quick boosts",
  },
  {
    id: "image-pack",
    name: "Image Sourcing",
    desc: "Pick and prep quality stock images that fit your offer.",
    price: 50,
    appliesTo: ["express"],
    group: "Quick boosts",
  },
  {
    id: "pages-5",
    name: "5-Page Build",
    desc: "Design + build up to 5 key pages with responsive layouts.",
    price: 260,
    appliesTo: ["starter", "commerce"],
    group: "Essentials",
  },
  {
    id: "extra-pages",
    name: "2 Extra Pages",
    desc: "Add two more custom pages to the build.",
    price: 90,
    appliesTo: ["starter", "commerce"],
    group: "Essentials",
  },
  {
    id: "blog",
    name: "Blog / CMS",
    desc: "Blog templates and an easy publishing workflow.",
    price: 120,
    appliesTo: ["starter", "commerce"],
    group: "Essentials",
  },
  {
    id: "catalog-setup",
    name: "Shop Setup & Products",
    desc: "Products, variants, and checkout tuned for a small store.",
    price: 200,
    appliesTo: ["commerce"],
    group: "Essentials",
  },
  {
    id: "portal-auth",
    name: "Member / Customer Portal",
    desc: "Account access with gated content or customer areas.",
    price: 180,
    appliesTo: ["commerce"],
    group: "Essentials",
  },
  {
    id: "seo",
    name: "SEO & Speed",
    desc: "On-page basics, faster load times, and tidy tech setup.",
    price: 140,
    appliesTo: ["starter", "commerce"],
    group: "Growth",
  },
  {
    id: "crm-sync",
    name: "Leads into CRM",
    desc: "Send form leads into your CRM with tags and alerts.",
    price: 150,
    appliesTo: ["commerce"],
    group: "Growth",
  },
  {
    id: "payments",
    name: "Bookings / Payments",
    desc: "Take payments or bookings online with clear confirmations.",
    price: 160,
    appliesTo: ["commerce"],
    group: "Growth",
  },
  {
    id: "launch-opt",
    name: "Launch Checks & Tracking",
    desc: "QA pass plus analytics and goals set up before go-live.",
    price: 120,
    appliesTo: ["starter", "commerce"],
    group: "Growth",
  },
  {
    id: "experiment-sprint",
    name: "Conversion Sprint",
    desc: "Two-week cycle of simple tests to lift enquiries or sales.",
    price: 320,
    tag: "Monthly",
    appliesTo: ["commerce"],
    group: "Growth",
  },
  {
    id: "support",
    name: "Ongoing Support",
    desc: "Monthly updates, light fixes, and content swaps (5 hours/mo).",
    price: 120,
    tag: "Monthly",
    appliesTo: ["starter", "commerce"],
    group: "Support",
  },
  {
    id: "priority-retainer",
    name: "Priority Support Retainer",
    desc: "Front-of-queue fixes and fast response times (6 hours/mo).",
    price: 240,
    tag: "Monthly",
    appliesTo: ["commerce"],
    group: "Support",
  },
  {
    id: "care-plan",
    name: "Care Plan & Monitoring",
    desc: "Backups, uptime monitoring, and patching (best for smaller sites).",
    price: 160,
    tag: "Monthly",
    appliesTo: ["starter", "commerce"],
    group: "Support",
  },
  {
    id: "dev-pack",
    name: "Developer Hours Pack (10 hrs)",
    desc: "Prepaid block of hours for changes, iterations, or fixes.",
    price: 520,
    appliesTo: ["starter", "commerce"],
    group: "Support",
  },
];
