import type { Project } from "@/lib/projects";

export type WorkLane = "all" | "brand" | "product";

export const WORK_LANES: { id: WorkLane; label: string }[] = [
  { id: "all", label: "All" },
  { id: "brand", label: "Brand" },
  { id: "product", label: "Product" },
];

const LANE_TAGS: Record<Exclude<WorkLane, "all">, string[]> = {
  brand: ["brand", "campaign", "direction", "animation", "motion"],
  product: ["product", "ux", "b2b", "ops", "ios", "mobile", "saas"],
};

export function projectMatchesLane(project: Project, lane: WorkLane): boolean {
  if (lane === "all") return true;
  const tags = project.tags.map((t) => t.toLowerCase());
  return LANE_TAGS[lane].some((needle) =>
    tags.some((tag) => tag === needle || tag.includes(needle)),
  );
}

/** Emphasize Brand / Product lane tags on cards */
export function isLaneTag(tag: string): boolean {
  const t = tag.toLowerCase();
  return t === "brand" || t === "product";
}
