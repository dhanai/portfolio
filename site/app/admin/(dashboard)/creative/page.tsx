import { getCreativeShowcase } from "@/lib/content";
import { saveCreativeShowcaseFromForm } from "@/lib/admin/actions";
import { CreativeShowcaseForm } from "@/components/admin/creative-showcase-form";

export default async function AdminCreativePage() {
  const showcase = await getCreativeShowcase();

  return (
    <div>
      <h1 className="text-2xl font-medium">Creative showcase</h1>
      <p className="mt-2 max-w-2xl text-sm text-[#737373]">
        Horizontal 9×16 gallery on the homepage (below Selected work). Upload
        images and videos, add a title and concept/direction notes for each
        piece. Production uploads go to Vercel Blob; local dev saves to{" "}
        <code className="text-[#ff453a]">public/assets/creative/</code>.
      </p>

      <CreativeShowcaseForm
        showcase={showcase}
        saveAction={saveCreativeShowcaseFromForm}
      />
    </div>
  );
}
