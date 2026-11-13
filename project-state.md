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
- Slice 5 (multiple photo walls) is done: all four criteria passed on the live site, checked by the owner and confirmed in Supabase on 2026-11-13 (wynn-test-6 created Test Wall A and B, with one upload on A only). Any account can create walls from /account; each wall has /w/<code> (upload), /w/<code>/wall (falling screen) and /w/<code>/manage (creator only).
- Slice 6 (share and join a photo wall) is done: all four criteria passed on the live site on 2026-11-13, checked by the owner and confirmed in Supabase (wynn-test-8 signed up from Test Wall A's link, joined it, uploaded a .jpg and an .mp4, deleted its own .mp4, and uploaded again). Each wall page has a Share button; /account lists "Walls you created" and "Walls you joined".

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
- Supabase setup now (Slice 5 replaced Slice 4's single admin; the exact SQL is in pull request #12):
  - a table "walls": id, code (12 random characters, used in the address), name (1–60 characters), owner_id (the creator, who is that wall's admin), created_at.
  - uploads.wall_id: every upload belongs to one wall. The 10 uploads from before Slice 5 are on "First wall", owned by wynn-test-2.
  - helper checks: owns_wall, can_access_wall (creator, or anyone who joined), can_access_upload_path, owns_wall_of_path. They run with owner rights so the rules don't loop.
  - rules: you see walls you created and their uploads, plus your own uploads; you upload only into your own folder, on walls you can access; you delete your own uploads, or anything on a wall you created. Files can only be listed by their owner or by people with access to their wall.
  - a table "wall_members" (wall_id, user_id, joined_at): who joined which wall. You can only see your own rows; nobody inserts directly. join_wall(code) adds the signed-in person when they open a wall's link (not the creator, not a wrong code, not signed out). The exact SQL is in pull request #14.
  - the old "admins" table and is_admin() were removed.
  - a wall's "see" rule checks owner_id directly as well as the helper, because a brand-new wall isn't visible to the helper yet while it is being saved.
- Deleting is permanent (no undo): app/_lib/delete-actions.ts removes the file first, then its row (a wall's creator may delete a file only while its row still exists).
- Test accounts (all fake): wynn-test-2 (owns "First wall"), wynn-test-3, wynn-test-4, wynn-test-5 and wynn-test-6 (own test walls), wynn-test-7 and wynn-test-8 (joined wynn-test-6's Test Wall A).
- Files go straight from the browser to Supabase (app/_lib/supabase-browser.ts), because Vercel refuses requests over about 4.5 MB sent to our server.
- Pages only signed-in people can open are listed in PRIVATE_PAGES in proxy.ts: /account, /upload, /wall, /manage, /w. The old /upload, /wall and /manage now just send you to /account.
- Signed-out visitors to a wall go to /login?next=<wall address>; Log in and Sign up carry it and return there afterwards. Only /w/<code>, /w/<code>/wall and /w/<code>/manage are accepted as "next", so the login page can't be used to send people to other sites.
- The falling screen (app/_lib/falling-wall.tsx) re-reads its wall's uploads list every 4 seconds (polling, with no Supabase Realtime): new items go to the middle display, and deleted items stop falling. One item starts falling every 0.7 s, in a shuffled order.
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
- No slice is ACTIVE. Slices 1–6 are done.
- The owner picks what comes next from the Backlog in roadmap.md. A docs task then adds it as a new slice with done-criteria and marks it ACTIVE, before any feature work starts.
- Possible next picks, the owner's call: password reset (people who forget their password are currently stuck), and leaving a joined wall.
- Preview links are behind Vercel's login (Deployment Protection). Test signed-out steps on a preview by logging out of the app in a normal window, not in a private window. The live site has no such guard.
- Apply Supabase changes so the live code keeps working until the new code is merged (Slice 5 broke live uploads for a while; Slice 6's additive change did not).
- Before a real event: the owner's real account should create the real wall, so it is that wall's admin.
