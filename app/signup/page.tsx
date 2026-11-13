import Link from "next/link";
import AuthForm from "../_lib/auth-form";
import { signUp } from "../_lib/actions";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <>
      <h1>Sign up</h1>
      <AuthForm action={signUp} buttonLabel="Sign up" minPasswordLength={8} next={next} />
      <p>
        Already have an account?{" "}
        <Link href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}>Log in</Link>
      </p>
    </>
  );
}
