import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../_lib/supabase";
import { logOut } from "../_lib/actions";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  return (
    <>
      <h1>Your account</h1>
      <p>Signed in as {data.user.email}</p>
      <p>
        <Link href="/upload">Upload photos and videos</Link>
      </p>
      <form action={logOut}>
        <button type="submit">Log out</button>
      </form>
    </>
  );
}
