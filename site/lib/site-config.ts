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
  title: "Dhanai Holtzclaw — Design Engineer",
  description:
    "Designer, director, and builder. 20+ years in art direction, AI generative creative, and code. Takeout Order, Margenie, Parfade.",
  url: "https://dhanai.net",
  oneLiner:
    "Twenty years designing, directing, and building. Hand-drew a brand to $3.8M in lifetime sales, built software that runs in production, and a daily practice in AI video and creative direction.",
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
    { href: "/work", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/resume", label: "Resume" },
  ],
};

export const accentColors = {
  takeout: "#FF453A",
  fulfillment: "#0A84FF",
  margenie: "#BF5AF2",
  parfade: "#30D158",
  default: "#FF453A",
} as const;
