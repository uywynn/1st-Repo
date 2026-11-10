"use server";
// Deleting an upload for good: the file first, then its listing row.
// Supabase's rules decide who may delete what: your own uploads,
// or anything on a wall you created.
import { revalidatePath } from "next/cache";
import { createClient } from "./supabase";

export async function deleteUpload(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "Please log in again." };

  const { data: row } = await supabase.from("uploads").select("path").eq("id", id).maybeSingle();
  if (!row) return { error: "This upload is already gone." };

  // The file goes first: a wall's creator is allowed to delete it only while its listing still exists.
  const { data: removed, error: fileError } = await supabase.storage.from("uploads").remove([row.path]);
  if (fileError) return { error: "Couldn't delete this upload. Please try again." };
  if (!removed?.length) return { error: "You can't delete this upload." };

  const { error: rowError } = await supabase.from("uploads").delete().eq("id", id);
  if (rowError) return { error: "The file was deleted, but it is still listed. Please try again." };

  revalidatePath("/", "layout");
  return { error: null };
}
