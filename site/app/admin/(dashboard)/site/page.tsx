import { saveSiteContent } from "@/lib/admin/actions";
import { AdminForm } from "@/components/admin/admin-form";
import {
  AdminField,
  AdminSection,
  AdminSubmit,
  AdminTextarea,
} from "@/components/admin/form";
import { getSiteContent } from "@/lib/content";

export default async function AdminSitePage() {
  const site = await getSiteContent();

  async function action(formData: FormData) {
    "use server";
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
      now: {
        label: String(formData.get("nowLabel")),
        title: String(formData.get("nowTitle")),
        body: String(formData.get("nowBody")),
        linkUrl: String(formData.get("nowLinkUrl")),
        linkLabel: String(formData.get("nowLinkLabel")),
      },
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-medium">Site & Hero</h1>
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

        <AdminSection title="Now section">
          <AdminField label="Label" name="nowLabel" defaultValue={site.now.label} />
          <AdminField label="Title" name="nowTitle" defaultValue={site.now.title} />
          <AdminTextarea label="Body" name="nowBody" defaultValue={site.now.body} rows={3} />
          <AdminField label="Link URL" name="nowLinkUrl" defaultValue={site.now.linkUrl} />
          <AdminField label="Link label" name="nowLinkLabel" defaultValue={site.now.linkLabel} />
        </AdminSection>

        <AdminSubmit />
      </AdminForm>
    </div>
  );
}
