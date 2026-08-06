export type SiteConfigView = {
  name: string;
  fullName: string;
  title: string;
  description: string;
  url: string;
  oneLiner: string;
  links: {
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    instagram: string;
    margenie: string;
    parfade: string;
  };
  nav: readonly { href: string; label: string }[];
};

/** Static fallback when CMS/database unavailable */
export const siteConfig: SiteConfigView = {
  name: "Dhanai",
  fullName: "Dhanai Holtzclaw",
  title: "Dhanai Holtzclaw — Art Direction & Product Design",
  description:
    "Art direction and product design. Brand systems, campaign craft, product UX, and AI generative creative — concept to shipped.",
  url: "https://dhanai.net",
  oneLiner:
    "Creative lead who owns how it looks and how it works — art direction, product design, and the build when it helps.",
  links: {
    email: "DhanaiH@gmail.com",
    phone: "702.321.1971",
    linkedin: "https://linkedin.com/in/dhanai",
    github: "https://github.com/dhanai",
    instagram: "https://instagram.com/byedhanai",
    margenie: "https://www.margenie.co",
    parfade: "https://www.parfade.com",
  },
  nav: [
    { href: "/#work", label: "Work" },
    { href: "/#about", label: "About" },
    { href: "/resume", label: "Resume" },
  ],
};

export const accentColors = {
  takeout: "#FF453A",
  fulfillment: "#0A84FF",
  margenie: "#BF5AF2",
  parfade: "#30D158",
  studio: "#FF9F0A",
  doomsy: "#64D2FF",
  petshirts: "#FF3EA5",
  default: "#FF453A",
} as const;
