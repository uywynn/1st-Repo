import Link from "next/link";
import AuthForm from "../_lib/auth-form";
import { signUp } from "../_lib/actions";

export default function SignupPage() {
  return (
    <>
      <h1>Sign up</h1>
      <AuthForm action={signUp} buttonLabel="Sign up" minPasswordLength={8} />
      <p>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </>
  );
}
