# Project state
Last updated: 2026-11-10

## Works
- GitHub repository exists: uywynn/1st-Repo (default branch main).
- Vercel project 1st-repo exists and serves the live site at https://1st-repo-omega.vercel.app.
- Supabase project exists at https://gbubfdmrooamxxcjmeel.supabase.co.
- Roadmap decided: three slices, see roadmap.md.
- Slice 1 (sign up and log in) is done: all four criteria passed on the live site on 2026-11-10, checked by the owner. Pages: /signup, /login, /account. / sends you to /account (or /login when signed out).
- Slice 2 (upload photos and videos) is done: all four criteria passed on the live site on 2026-11-10, checked by the owner. Page: /upload, linked from /account.

## Broken or flaky
- Nothing known.

## Environment notes
- Stack: Next.js 16 (App Router), React 19, TypeScript 5, plain CSS, Supabase, deployed on Vercel.
- Approved packages: next, react, react-dom, @supabase/supabase-js, @supabase/ssr; build-only: typescript, @types/react, @types/node. Anything else needs the owner's OK first.
- Approved top-level folder: app/ (the pages). Shared code lives in app/_lib/ (the underscore means "not a page").
- Next.js 16 calls the before-every-page file proxy.ts, not middleware.ts. It keeps the sign-in cookie fresh and sends signed-out visitors from /account to /login.
- Supabase setup from Slice 2 (applied with the owner's OK; the exact SQL is in pull request #4):
  - a public storage bucket "uploads": images and videos only, 50 MB per file. Anyone with a file's exact link can view it; links are random and not listable.
  - a table "uploads": id, user_id, path, kind (photo or video), created_at.
  - access rules: signed-in users can upload only into a folder named after their own user id, and can read the whole uploads list.
- Files go straight from the browser to Supabase (app/_lib/supabase-browser.ts), because Vercel refuses requests over about 4.5 MB sent to our server.
- Pages only signed-in people can open are listed in PRIVATE_PAGES in proxy.ts. Add /wall there in Slice 3.
- Vercel Framework Preset is set to Next.js. It was "Other" at first, because the project was created before any code existed, and that broke the build ("No Output Directory named public").
- Vercel environment variables, set for Production and Preview: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Values live only in Vercel > 1st-repo > Settings > Environment Variables. Never in chat, prompts, or repo files.
- Every branch Claude Code pushes gets a Vercel preview link on its pull request. Merging to main deploys the live site.
- Claude Code is run in the browser at claude.ai/code with the repository selected. The owner merges all pull requests.
- Supabase "Confirm email" is off, so sign-up logs you straight in.
- No npm run lint yet: the owner chose to skip it (it needs 2 more packages). npm run build still checks the code.
- Fake test accounts exist in Supabase from the Slice 1 checks (e.g. wynn-test-1@example.com, wynn-test-2@example.com).
- Decided: on the wall, every photo falls from the top of the screen to the bottom in about 5 seconds (owner's call). This is fast; it may need adjusting once seen live.
- Decided against for now: Google Photos sync (moved to Backlog because of Google's 2025 API limits and the new Google Cloud setup it needs).
- Upload size: the bucket allows 50 MB per file, and an .mp4 under 40 MB uploaded fine on the live site. Supabase's own plan-wide limit has not been looked up.
- Known gap: iPhone .mov videos may not play in some browsers (e.g. Chrome on Windows).
- Supabase security check: "leaked password protection" is off. Not changed; it was off from the start.

## Next session
- Start Slice 3: the falling wall (the only ACTIVE slice).
- Criterion 2 needs the wall to notice a new upload within 10 seconds. Simplest way: the wall re-checks the uploads table every few seconds. Supabase Realtime (live push) would need a Supabase change; say so and ask before using it.
- Criterion 1 needs at least 6 photos already uploaded; use fake test photos only.
- Slice 3 is the last slice. When all four criteria pass on the live site, the roadmap's "What Done means" should be checked end to end.
