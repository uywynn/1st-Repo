"use server";
// Deleting an upload for good: its listing row first, then the file itself.
// Supabase's rules decide who may delete what: your own uploads, or anything if you are the admin.
import { revalidatePath } from "next/cache";
import { createClient } from "./supabase";

export async function deleteUpload(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "Please log in again." };

  // Remove the listing. If the rules say no, nothing is removed and we stop here.
  const { data: rows, error } = await supabase.from("uploads").delete().eq("id", id).select("path");
  if (error) return { error: "Couldn't delete this upload. Please try again." };
  if (!rows?.length) return { error: "You can't delete this upload, or it's already gone." };

  // Remove the file, so its link stops working.
  const { error: fileError } = await supabase.storage.from("uploads").remove([rows[0].path]);
  if (fileError) return { error: "The upload was removed from the list, but its file couldn't be deleted." };

  revalidatePath("/upload");
  revalidatePath("/manage");
  return { error: null };
}
