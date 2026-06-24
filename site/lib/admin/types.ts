export type ActionResult =
  | { ok: true }
  | { unchanged: true }
  | { error: string };

export type WorkFormData = {
  id?: string;
  slug: string;
  title: string;
  subtitle: string;
  tags: string;
  year: string;
  color: string;
  href: string;
  image: string;
  role: string;
  externalUrl: string;
  diagram: string;
  reflection: string;
  sectionsJson: string;
  published: boolean;
};
