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
