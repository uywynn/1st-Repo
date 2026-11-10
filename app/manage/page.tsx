import { redirect } from "next/navigation";

// Uploads now live on photo walls. This old address sends people to their account page.
export default function OldAddress() {
  redirect("/account");
}
