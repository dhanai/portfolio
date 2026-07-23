-- AlterTable
ALTER TABLE "Work" ADD COLUMN IF NOT EXISTS "cardAction" TEXT NOT NULL DEFAULT 'caseStudy';
ALTER TABLE "Work" ADD COLUMN IF NOT EXISTS "lightboxImage" TEXT;

-- Preserve existing external card links
UPDATE "Work"
SET "cardAction" = 'external'
WHERE "href" IS NOT NULL AND TRIM("href") <> '';
