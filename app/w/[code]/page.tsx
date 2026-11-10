import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../_lib/supabase";
import { getWall } from "../../_lib/walls";
import UploadForm from "../../_lib/upload-form";
import UploadTile from "../../_lib/upload-tile";

// A wall's own page: upload to it, and see and delete your uploads on it.
export default async function WallHomePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const wall = await getWall(supabase, code);
  if (!wall) redirect("/account");
  const isAdmin = wall.owner_id === data.user.id;

  const { data: uploads } = await supabase
    .from("uploads")
    .select("id, path, kind")
    .eq("wall_id", wall.id)
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="wide">
      <h1>{wall.name}</h1>
      <p className="wall-links">
        <Link href={`/w/${wall.code}/wall`}>Open the falling screen</Link>
        {isAdmin && <Link href={`/w/${wall.code}/manage`}>Manage this wall</Link>}
      </p>
      <UploadForm userId={data.user.id} wallId={wall.id} />

      <h2>Your uploads</h2>
      {!uploads?.length && <p>Nothing yet.</p>}
      <ul className="uploads">
        {uploads?.map((u) => (
          <UploadTile
            key={u.id}
            id={u.id}
            kind={u.kind}
            url={supabase.storage.from("uploads").getPublicUrl(u.path).data.publicUrl}
          />
        ))}
      </ul>
      <p>
        <Link href="/account">Back to your account</Link>
      </p>
    </div>
  );
}
