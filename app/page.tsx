import { redirect } from "next/navigation";

// The home page just sends people to their account (or to log in).
export default function Home() {
  redirect("/account");
}
