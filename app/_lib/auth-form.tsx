"use client";
// The email + password form, shared by the sign-up and log-in pages.
import { useActionState } from "react";
import type { FormState } from "./actions";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  buttonLabel: string;
  minPasswordLength?: number;
  next?: string;
};

export default function AuthForm({ action, buttonLabel, minPasswordLength, next }: Props) {
  const [state, formAction, pending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="form">
      {next && <input type="hidden" name="next" value={next} />}
      <label>
        Email
        <input type="email" name="email" required autoComplete="email" />
      </label>
      <label>
        Password
        <input
          type="password"
          name="password"
          required
          minLength={minPasswordLength}
          autoComplete={minPasswordLength ? "new-password" : "current-password"}
        />
      </label>
      {state.error && (
        <p className="error" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending}>
        {pending ? "Please wait…" : buttonLabel}
      </button>
    </form>
  );
}
