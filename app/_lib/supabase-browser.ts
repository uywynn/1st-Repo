// Creates a Supabase connection that runs in the visitor's browser.
// Uploads go straight from the browser to Supabase, because Vercel
// refuses requests bigger than about 4.5 MB, far too small for videos.
import { createBrowserClient } from "@supabase/ssr";

export function createBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
