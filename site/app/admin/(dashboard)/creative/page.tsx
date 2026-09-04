import { getCreativeShowcase } from "@/lib/content";
import { CreativeShowcaseForm } from "@/components/admin/creative-showcase-form";

export default async function AdminCreativePage() {
  const showcase = await getCreativeShowcase({ includeHidden: true });

  return (
    <div>
      <h1 className="text-2xl font-medium">Creative showcase</h1>
      <p className="mt-2 max-w-2xl text-sm text-[#737373]">
        Manage generative pieces for the homepage rail and{" "}
        <code className="text-[#ff453a]">/ai</code>. Changes save automatically —
        no separate publish step. Uploads go to Vercel Blob (local:{" "}
        <code className="text-[#ff453a]">public/assets/creative/</code>).
      </p>

      <CreativeShowcaseForm showcase={showcase} />
    </div>
  );
}
