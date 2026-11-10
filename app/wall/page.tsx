import { redirect } from "next/navigation";
import { createClient } from "../_lib/supabase";
import Wall, { type WallItem } from "./wall";

export default async function WallPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const { data: rows } = await supabase
    .from("uploads")
    .select("id, path, kind")
    .order("created_at", { ascending: true });

  const items: WallItem[] = (rows ?? []).map((r) => ({
    id: r.id,
    kind: r.kind,
    url: supabase.storage.from("uploads").getPublicUrl(r.path).data.publicUrl,
  }));

  return <Wall initialItems={items} />;
}
