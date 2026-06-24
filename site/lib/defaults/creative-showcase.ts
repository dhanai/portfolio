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
  /** @deprecated Use title + direction */
  caption?: string;
};

export type CreativeShowcaseData = {
  enabled: boolean;
  title: string;
  subtitle: string;
  items: CreativeShowcaseItem[];
};

export const defaultCreativeShowcase: CreativeShowcaseData = {
  enabled: true,
  title: "Art & direction",
  subtitle:
    "AI generative, directed shoots, and social — 9×16 campaigns and daily creative practice.",
  items: [],
};
