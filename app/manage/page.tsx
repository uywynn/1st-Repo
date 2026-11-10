import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../_lib/supabase";
import UploadTile from "../_lib/upload-tile";

// Admin only: everyone's uploads, each with a Delete button.
export default async function ManagePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/account");

  const { data: uploads } = await supabase
    .from("uploads")
    .select("id, path, kind, user_id, created_at")
    .order("created_at", { ascending: false });

  const when = (iso: string) =>
    new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }) + " UTC";

  return (
    <div className="wide">
      <h1>Manage all uploads</h1>
      <p>Everyone&apos;s uploads, newest first. Deleting is permanent.</p>
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
        <Link href="/account">Back to your account</Link>
      </p>
    </div>
  );
}
