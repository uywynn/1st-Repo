import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../_lib/supabase";
import { logOut } from "../_lib/actions";
import CreateWallForm from "../_lib/create-wall-form";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  // Walls this person created, newest first.
  const { data: walls } = await supabase
    .from("walls")
    .select("code, name")
    .eq("owner_id", data.user.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <h1>Your account</h1>
      <p>Signed in as {data.user.email}</p>

      <h2>Walls you created</h2>
      {!walls?.length && <p>No walls yet</p>}
      <ul className="wall-list">
        {walls?.map((w) => (
          <li key={w.code}>
            <Link href={`/w/${w.code}`}>{w.name}</Link>
          </li>
        ))}
      </ul>
      <CreateWallForm />

      <form action={logOut} className="logout">
        <button type="submit">Log out</button>
      </form>
    </>
  );
}
