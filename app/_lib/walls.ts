// Looking up a photo wall by the code in its address.
import type { createClient } from "./supabase";

type Supabase = Awaited<ReturnType<typeof createClient>>;
export type Wall = { id: string; code: string; name: string; owner_id: string };

// Opening a wall's link while signed in joins it (does nothing for its creator,
// or if the code is wrong). Errors are ignored: looking the wall up below decides access.
export async function joinWall(supabase: Supabase, code: string) {
  await supabase.rpc("join_wall", { p_code: code });
}

// Returns the wall, or null if it doesn't exist or this person may not see it.
export async function getWall(supabase: Supabase, code: string): Promise<Wall | null> {
  const { data } = await supabase
    .from("walls")
    .select("id, code, name, owner_id")
    .eq("code", code)
    .maybeSingle();
  return data;
}
