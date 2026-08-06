import { saveSiteContent } from "@/lib/admin/actions";
import { AdminForm } from "@/components/admin/admin-form";
import {
  AdminField,
  AdminSection,
  AdminSubmit,
  AdminTextarea,
} from "@/components/admin/form";
import { getSiteContent } from "@/lib/content";
import { prisma } from "@/lib/prisma";

export default async function AdminSitePage() {
  const [site, publishedCount] = await Promise.all([
    getSiteContent(),
    prisma.work.count({ where: { published: true } }),
  ]);

  async function action(formData: FormData) {
    "use server";
    const current = await getSiteContent();
    return saveSiteContent({
      name: String(formData.get("name")),
      fullName: String(formData.get("fullName")),
      title: String(formData.get("title")),
      description: String(formData.get("description")),
      url: String(formData.get("url")),
      oneLiner: String(formData.get("oneLiner")),
      links: {
        email: String(formData.get("email")),
        phone: String(formData.get("phone")),
        linkedin: String(formData.get("linkedin")),
        github: String(formData.get("github")),
        instagram: String(formData.get("instagram")),
        margenie: String(formData.get("margenie")),
        parfade: String(formData.get("parfade")),
      },
      hero: {
        label: String(formData.get("heroLabel")),
        title: String(formData.get("heroTitle")),
        titleMuted: String(formData.get("heroTitleMuted")),
      },
      homepageWorkCount: (() => {
        const n = Number(formData.get("homepageWorkCount"));
        if (!Number.isFinite(n)) return current.homepageWorkCount;
        return Math.min(24, Math.max(1, Math.round(n)));
      })(),
      // Homepage no longer renders "Now" — preserve existing CMS values.
      now: current.now,
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-medium">Site & Hero</h1>
      <p className="mt-2 text-sm text-[#737373]">
        One-pager homepage: hero → selected work → creative showcase → about +
        resume CTA.
      </p>
      <AdminForm action={action} successMessage="Site settings saved" className="mt-8 space-y-6">
        <AdminSection title="Identity">
          <AdminField label="Short name" name="name" defaultValue={site.name} required />
          <AdminField label="Full name" name="fullName" defaultValue={site.fullName} required />
          <AdminField label="Page title" name="title" defaultValue={site.title} required />
          <AdminTextarea label="Meta description" name="description" defaultValue={site.description} rows={2} />
          <AdminField label="Site URL" name="url" defaultValue={site.url} required />
          <AdminTextarea label="One-liner" name="oneLiner" defaultValue={site.oneLiner} rows={2} />
        </AdminSection>

        <AdminSection title="Contact links">
          <AdminField label="Email" name="email" defaultValue={site.links.email} />
          <AdminField label="Phone" name="phone" defaultValue={site.links.phone} />
          <AdminField label="LinkedIn" name="linkedin" defaultValue={site.links.linkedin} />
          <AdminField label="GitHub" name="github" defaultValue={site.links.github} />
          <AdminField label="Instagram" name="instagram" defaultValue={site.links.instagram} />
          <AdminField label="Margenie" name="margenie" defaultValue={site.links.margenie} />
          <AdminField label="Parfade" name="parfade" defaultValue={site.links.parfade} />
        </AdminSection>

        <AdminSection title="Home hero">
          <AdminField label="Eyebrow label" name="heroLabel" defaultValue={site.hero.label} />
          <AdminField label="Headline" name="heroTitle" defaultValue={site.hero.title} />
          <AdminField label="Headline (muted part)" name="heroTitleMuted" defaultValue={site.hero.titleMuted} />
        </AdminSection>

        <AdminSection title="Homepage work">
          <AdminField
            label="Work items to show"
            name="homepageWorkCount"
            type="number"
            defaultValue={String(site.homepageWorkCount)}
            hint={`How many published projects appear in Selected work (1–24). You have ${publishedCount} published. Order follows Work admin drag sort.`}
            required
          />
        </AdminSection>

        <AdminSubmit />
      </AdminForm>
    </div>
  );
}
