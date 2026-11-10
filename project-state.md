# Project state
Last updated: 2026-11-10

## Works
- GitHub repository exists: uywynn/1st-Repo (default branch main).
- Vercel project 1st-repo exists and serves the live site at https://1st-repo-omega.vercel.app.
- Supabase project exists at https://gbubfdmrooamxxcjmeel.supabase.co.
- Roadmap decided: three slices, see roadmap.md.
- Slice 1 (sign up and log in) is done: all four criteria passed on the live site on 2026-11-10, checked by the owner. Pages: /signup, /login, /account. / sends you to /account (or /login when signed out).
- Slice 2 (upload photos and videos) is done: all four criteria passed on the live site on 2026-11-10, checked by the owner. Page: /upload, linked from /account.
- Slice 3 (the falling wall) is done: all four criteria passed on the live site on 2026-11-10, checked by the owner. Page: /wall, linked from /account.
- The roadmap's "What Done means" is reached: all three slices pass on the live site.
- Slice 4 (deleting uploads) is done: all four criteria passed on the live site on 2026-11-10, checked by the owner and confirmed in the Supabase request log (a guest delete by wynn-test-3, admin deletes by wynn-test-2). Guests delete their own uploads on /upload; the admin deletes any upload on /manage.

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
- Supabase setup from Slice 4 (applied with the owner's OK; the exact SQL is in pull request #9):
  - a table "admins" holding the admin's account ID (currently wynn-test-2@example.com). It is matched by ID, not email, because Confirm email is off. It has no access rules on purpose, so the app can't read or change it.
  - a function is_admin() that answers only for the signed-in person.
  - delete rules: your own files and rows, or any if you are the admin; plus a read rule on the bucket, which Supabase needs before it allows deleting.
- Deleting is permanent (no undo): app/_lib/delete-actions.ts removes the row first, then the file.
- Test accounts (all fake): wynn-test-2 (admin), wynn-test-3, wynn-test-4.
- Files go straight from the browser to Supabase (app/_lib/supabase-browser.ts), because Vercel refuses requests over about 4.5 MB sent to our server.
- Pages only signed-in people can open are listed in PRIVATE_PAGES in proxy.ts: /account, /upload, /wall, /manage.
- The wall (app/wall/wall.tsx) re-reads the whole uploads list every 4 seconds (polling, with no Supabase Realtime): new items go to the middle display, and deleted items stop falling. One item starts falling every 0.7 s, in a shuffled order.
- Fall speed: one number in app/globals.css (`fall 5.5s`), which is about 4.8 s from the top edge to the bottom edge. The middle display lasts 5 s (`spotlight 5s`).
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
- Start Slice 5: multiple photo walls (the only ACTIVE slice). Slice 6 (share a photo wall) is pending; do not start it until all four Slice 5 criteria pass on the live site.
- Owner's decisions (2026-11-10):
  - two slices: walls first, then sharing
  - anyone with a wall's link must sign up or log in (no account-less guests yet; that stays in the Backlog)
  - the 10 existing uploads move to a wall named "First wall" owned by wynn-test-2
  - anyone signed in who has a wall's link can open its falling screen, the same rule as uploading
  - the account that creates a wall is that wall's admin
- Slice 5 needs Supabase changes: a walls table (name, random code, creator), a wall link on each upload, updated access rules, moving the existing uploads to "First wall", and replacing the single global admin (the admins table) with per-wall admins. Say exactly what is being created and why, and get the owner's OK, before doing it.
- Slice 5 makes /upload, /wall and /manage per-wall (/w/<code>/...). The old addresses send you to /account.
- Before a real event: the owner's real account should create the real wall, so it is that wall's admin.
- Lesson from Slice 4: before marking a slice done, confirm each check in Supabase's request log where possible.
