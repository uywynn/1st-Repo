import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../_lib/supabase";
import { getWall } from "../../../_lib/walls";
import UploadTile from "../../../_lib/upload-tile";

// For the wall's creator only: every upload on this wall, each with a Delete button.
export default async function ManageWallPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const wall = await getWall(supabase, code);
  if (!wall || wall.owner_id !== data.user.id) redirect("/account");

  const { data: uploads } = await supabase
    .from("uploads")
    .select("id, path, kind, user_id, created_at")
    .eq("wall_id", wall.id)
    .order("created_at", { ascending: false });

  const when = (iso: string) =>
    new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }) + " UTC";

  return (
    <div className="wide">
      <h1>Manage: {wall.name}</h1>
      <p>Everyone&apos;s uploads on this wall, newest first. Deleting is permanent.</p>
      {!uploads?.length && <p>Nothing yet.</p>}
      <ul className="uploads">
        {uploads?.map((u) => (
          <UploadTile
            key={u.id}
            id={u.id}
            kind={u.kind}
            url={supabase.storage.from("uploads").getPublicUrl(u.path).data.publicUrl}
            label={`${u.user_id === data.user.id ? "Yours" : "Another account"} · ${when(u.created_at)}`}
          />
        ))}
      </ul>
      <p>
        <Link href={`/w/${wall.code}`}>Back to {wall.name}</Link>
      </p>
    </div>
  );
}
