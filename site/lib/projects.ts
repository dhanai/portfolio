import { accentColors } from "@/lib/site-config";

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  tags: string[];
  year: string;
  href?: string;
  image?: string;
  color: string;
};

export const projects: Project[] = [
  {
    slug: "takeout-order",
    title: "Takeout Order",
    subtitle: "$3.8M hand-drawn apparel brand",
    tags: ["Brand", "Design", "Growth"],
    year: "2020–2024",
    color: accentColors.takeout,
  },
  {
    slug: "fulfillment-portal",
    title: "Fulfillment portal",
    subtitle: "B2B print partner ops · Shopify + EasyPost",
    tags: ["AngularJS", "Firebase", "B2B"],
    year: "2019–2024",
    color: accentColors.fulfillment,
  },
  {
    slug: "margenie",
    title: "Margenie",
    subtitle: "Agent-native brand ops",
    tags: ["Next.js", "Design system", "AI"],
    year: "2024–present",
    href: "https://www.margenie.co",
    color: accentColors.margenie,
  },
  {
    slug: "parfade",
    title: "Parfade",
    subtitle: "Golf rounds, side games, friends",
    tags: ["Expo", "iOS", "Social"],
    year: "2023–present",
    href: "https://www.parfade.com",
    color: accentColors.parfade,
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
