import { accentColors } from "@/lib/site-config";
import type { WorkCardAction } from "@/lib/admin/types";

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  tags: string[];
  year?: string;
  href?: string;
  image?: string;
  cardAction?: WorkCardAction;
  lightboxImage?: string;
  color: string;
};

const BLOB =
  "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work";

export const projects: Project[] = [
  {
    slug: "takeout-order",
    title: "Takeout Order",
    subtitle: "Brand system + growth + fulfillment product · $3.8M",
    tags: ["Brand", "Product", "Growth"],
    year: "2020–present",
    image: `${BLOB}/takeout-order.webp`,
    color: accentColors.takeout,
  },
  {
    slug: "doomsy",
    title: "Doomsy",
    subtitle: "Product UX for an AI creative feed",
    tags: ["Product", "Brand", "AI"],
    year: "2026–present",
    image: `${BLOB}/doomsy.webp`,
    color: accentColors.doomsy,
  },
  {
    slug: "studio",
    title: "Studio",
    subtitle: "AI production system — consistency as a product problem",
    tags: ["Product", "Brand", "AI", "Direction"],
    year: "2026–present",
    image: `${BLOB}/studio.webp`,
    lightboxImage: `${BLOB}/studio-lightbox.webp`,
    color: accentColors.studio,
  },
  {
    slug: "fulfillment-portal",
    title: "Fulfillment portal",
    subtitle: "B2B ops product · Shopify + EasyPost",
    tags: ["Product", "B2B", "Ops"],
    year: "2020–present",
    color: accentColors.fulfillment,
  },
  {
    slug: "margenie",
    title: "Margenie",
    subtitle: "Agent-native brand ops · design system",
    tags: ["Product", "Brand", "AI"],
    year: "2026–present",
    href: "https://www.margenie.co",
    cardAction: "external",
    color: accentColors.margenie,
  },
  {
    slug: "parfade",
    title: "Parfade",
    subtitle: "Product design · golf rounds & side games",
    tags: ["Product", "iOS", "Social"],
    year: "2026–present",
    image: `${BLOB}/parfade.webp`,
    color: accentColors.parfade,
  },
  {
    slug: "petshirts",
    title: "Petshirts",
    subtitle: "AI pet art → print-ready apparel",
    tags: ["Product", "Brand", "AI"],
    year: "2026–present",
    image: `${BLOB}/petshirts.webp`,
    color: accentColors.petshirts,
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
