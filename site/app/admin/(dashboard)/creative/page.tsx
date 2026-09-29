import { getCreativeShowcase } from "@/lib/content";
import { CreativeShowcaseForm } from "@/components/admin/creative-showcase-form";

export default async function AdminCreativePage() {
  const showcase = await getCreativeShowcase({ includeHidden: true });

  return (
    <div>
      <h1 className="text-2xl font-medium">Creative</h1>
      <p className="mt-2 text-sm text-[#737373]">Manage generative pieces</p>

      <CreativeShowcaseForm showcase={showcase} />
    </div>
  );
}
