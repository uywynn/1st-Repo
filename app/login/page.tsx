import Link from "next/link";
import AuthForm from "../_lib/auth-form";
import { logIn } from "../_lib/actions";

export default function LoginPage() {
  return (
    <>
      <h1>Log in</h1>
      <AuthForm action={logIn} buttonLabel="Log in" />
      <p>
        New here? <Link href="/signup">Sign up</Link>
      </p>
    </>
  );
}
