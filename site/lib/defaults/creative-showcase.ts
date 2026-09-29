export type CreativeShowcaseItem = {
  id: string;
  type: "image" | "video";
  /** Image URL, video URL, or path under /public */
  src: string;
  /** Video poster frame (optional) */
  poster?: string;
  /** Display title on the card */
  title: string;
  /** Concept, direction, and craft notes */
  direction?: string;
  /** Accessibility label (defaults to title) */
  alt: string;
  /** When true, kept in CMS but omitted from public /ai and homepage rail */
  hidden?: boolean;
  /** @deprecated Use title + direction */
  caption?: string;
};

export type CreativeShowcaseData = {
  enabled: boolean;
  /** Small label above the heading on /ai */
  eyebrow: string;
  title: string;
  subtitle: string;
  items: CreativeShowcaseItem[];
};

export const defaultCreativeShowcase: CreativeShowcaseData = {
  enabled: true,
  eyebrow: "Generative",
  title: "Generative AI",
  subtitle:
    "Directed generative campaigns, stills, and motion — taste as the production system.",
  items: [],
};
