import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../_lib/supabase";
import UploadForm from "./upload-form";
import UploadTile from "../_lib/upload-tile";

export default async function UploadPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  // This person's uploads, newest first.
  const { data: uploads } = await supabase
    .from("uploads")
    .select("id, path, kind")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="wide">
      <h1>Upload</h1>
      <UploadForm userId={data.user.id} />

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
