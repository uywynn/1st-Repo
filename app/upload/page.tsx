import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../_lib/supabase";
import UploadForm from "./upload-form";

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
        {uploads?.map((u) => {
          const url = supabase.storage.from("uploads").getPublicUrl(u.path).data.publicUrl;
          return (
            <li key={u.id}>
              {u.kind === "video" ? (
                <video src={url} controls preload="metadata" playsInline />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="Uploaded photo" loading="lazy" />
              )}
            </li>
          );
        })}
      </ul>
      <p>
        <Link href="/account">Back to your account</Link>
      </p>
    </div>
  );
}
