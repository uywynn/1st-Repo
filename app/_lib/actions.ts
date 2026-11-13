"use server";
// The three things a visitor can do: sign up, log in, log out.
// These run on the server, never in the visitor's browser.
import { redirect } from "next/navigation";
import { createClient } from "./supabase";

export type FormState = { error: string | null };

// Where to go after signing up or logging in: a wall address if one was given, else /account.
// Only addresses on this site starting with /w/ are accepted.
function nextPage(formData: FormData) {
  const next = String(formData.get("next") ?? "");
  return /^\/w\/[A-Za-z0-9]+(\/(wall|manage))?$/.test(next) ? next : "/account";
}

function readForm(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };
}

export async function signUp(_prev: FormState, formData: FormData): Promise<FormState> {
  const { email, password } = readForm(formData);
  if (!email) return { error: "Please enter an email." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: error.message };
  if (!data.session) {
    // Happens when Supabase's "Confirm email" setting is on.
    return { error: "Check your email to confirm your account, then log in." };
  }
  redirect(nextPage(formData));
}

export async function logIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const { email, password } = readForm(formData);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.code === "invalid_credentials" || error.status === 400) {
      return { error: "Invalid email or password" };
    }
    return { error: "Something went wrong. Please try again." };
  }
  redirect(nextPage(formData));
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
