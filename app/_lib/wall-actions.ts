"use server";
// Creating a new photo wall. The person who creates it is its admin.
import { redirect } from "next/navigation";
import { createClient } from "./supabase";

export type CreateWallState = { error: string | null };

export async function createWall(_prev: CreateWallState, formData: FormData): Promise<CreateWallState> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Please give the wall a name." };
  if (name.length > 60) return { error: "Wall names can be at most 60 characters." };

  const supabase = await createClient();
  const { data, error } = await supabase.from("walls").insert({ name }).select("code").single();
  if (error || !data) return { error: "Couldn't create the wall. Please try again." };
  redirect(`/w/${data.code}`);
}

// Leaving a wall you joined: removes it from "Walls you joined". Your photos stay on the wall.
// Opening the wall's link again rejoins it.
export async function leaveWall(wallId: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "Please log in again." };

  const { data, error } = await supabase
    .from("wall_members")
    .delete()
    .eq("wall_id", wallId)
    .eq("user_id", auth.user.id)
    .select("wall_id");
  if (error) return { error: "Couldn't leave the wall. Please try again." };
  if (!data?.length) return { error: "You're not a member of this wall." };
  redirect("/account");
}
