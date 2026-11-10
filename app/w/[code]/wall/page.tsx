import { redirect } from "next/navigation";
import { createClient } from "../../../_lib/supabase";
import { getWall } from "../../../_lib/walls";
import FallingWall, { type WallItem } from "../../../_lib/falling-wall";

// A wall's full-screen falling display.
export default async function FallingScreenPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const wall = await getWall(supabase, code);
  if (!wall) redirect("/account");

  const { data: rows } = await supabase
    .from("uploads")
    .select("id, path, kind")
    .eq("wall_id", wall.id)
    .order("created_at", { ascending: true });

  const items: WallItem[] = (rows ?? []).map((r) => ({
    id: r.id,
    kind: r.kind,
    url: supabase.storage.from("uploads").getPublicUrl(r.path).data.publicUrl,
  }));

  return <FallingWall initialItems={items} wallId={wall.id} />;
}
