"use client";
// The "choose a file, click Upload" form.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "../_lib/supabase-browser";

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB, the same limit as the Supabase bucket

export default function UploadForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = event.currentTarget;
    const file = (form.elements.namedItem("file") as HTMLInputElement).files?.[0];
    if (!file) return setError("Please choose a file first.");

    const kind = file.type.startsWith("image/")
      ? "photo"
      : file.type.startsWith("video/")
        ? "video"
        : null;
    if (!kind) return setError("Only photos and videos are allowed");
    if (file.size > MAX_BYTES) return setError("Files must be 50 MB or smaller.");

    setBusy(true);
    const supabase = createBrowserSupabase();
    const extension = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "";
    // Each file goes in a folder named after the uploader, under a random name.
    const path = `${userId}/${crypto.randomUUID()}${extension ? "." + extension : ""}`;

    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(path, file, { contentType: file.type });
    if (uploadError) {
      setBusy(false);
      return setError(`Upload failed: ${uploadError.message}`);
    }

    const { error: rowError } = await supabase.from("uploads").insert({ path, kind });
    setBusy(false);
    if (rowError) return setError(`Upload failed: ${rowError.message}`);

    form.reset();
    router.refresh(); // reload the list under "Your uploads"
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <label>
        Photo or video
        <input type="file" name="file" accept="image/*,video/*" required />
      </label>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy}>
        {busy ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}
