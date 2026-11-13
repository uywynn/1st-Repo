import Link from "next/link";
import AuthForm from "../_lib/auth-form";
import { logIn } from "../_lib/actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <>
      <h1>Log in</h1>
      <AuthForm action={logIn} buttonLabel="Log in" next={next} />
      <p>
        New here? <Link href={next ? `/signup?next=${encodeURIComponent(next)}` : "/signup"}>Sign up</Link>
      </p>
    </>
  );
}
