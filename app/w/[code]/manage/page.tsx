import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../_lib/supabase";
import { getWall } from "../../../_lib/walls";
import UploadTile from "../../../_lib/upload-tile";
import DownloadAllButton from "../../../_lib/download-all-button";

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

  const urlOf = (path: string) => supabase.storage.from("uploads").getPublicUrl(path).data.publicUrl;
  // Oldest first in the .zip, so the files are numbered in the order they were uploaded.
  const downloads = [...(uploads ?? [])].reverse().map((u) => ({
    url: urlOf(u.path),
    extension: u.path.includes(".") ? u.path.split(".").pop()!.toLowerCase() : u.kind === "video" ? "mp4" : "jpg",
  }));

  const when = (iso: string) =>
    new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }) + " UTC";

  return (
    <div className="wide">
      <h1>Manage: {wall.name}</h1>
      <p>Everyone&apos;s uploads on this wall, newest first. Deleting is permanent.</p>
      <DownloadAllButton wallName={wall.name} items={downloads} />
      {!uploads?.length && <p>Nothing yet.</p>}
      <ul className="uploads">
        {uploads?.map((u) => (
          <UploadTile
            key={u.id}
            id={u.id}
            kind={u.kind}
            url={urlOf(u.path)}
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
