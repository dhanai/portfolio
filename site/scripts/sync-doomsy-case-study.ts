/** Sync only Doomsy's case-study copy; preserve other work and site content. */
import { writeFile } from "node:fs/promises";
import { prisma } from "@/lib/prisma";
import { caseStudies } from "@/lib/case-studies";

async function main() {
  const study = caseStudies.find((item) => item.slug === "doomsy");
  if (!study) throw new Error("Missing Doomsy case study");
  const before = await prisma.work.findUniqueOrThrow({ where: { slug: "doomsy" } });
  const data = {
    subtitle: study.subtitle,
    role: study.role,
    reflection: study.reflection,
    sections: JSON.stringify(study.sections),
  };
  if (!process.argv.includes("--apply")) {
    console.log(JSON.stringify({ slug: before.slug, fields: Object.keys(data), headings: study.sections.map((s) => s.heading) }, null, 2));
    return;
  }
  const backupPath = process.env.DOOMSY_BACKUP_PATH;
  if (!backupPath) throw new Error("Set DOOMSY_BACKUP_PATH before applying");
  await writeFile(backupPath, JSON.stringify(before, null, 2), { flag: "wx" });
  const result = await prisma.work.updateMany({
    where: { id: before.id, updatedAt: before.updatedAt },
    data,
  });
  if (result.count !== 1) throw new Error("Doomsy changed during sync; review before retrying");
  console.log("Updated Doomsy copy only; prior row saved for recovery.");
}
main().catch(() => {
  console.error("Doomsy sync failed; inspect the database connection, backup path, and current row before retrying.");
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
