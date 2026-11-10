# Project state
Last updated: 2026-11-10

## Works
- GitHub repository exists: uywynn/1st-Repo (default branch main).
- Vercel project 1st-repo exists and serves the live site at https://1st-repo-omega.vercel.app.
- Supabase project exists at https://gbubfdmrooamxxcjmeel.supabase.co.
- Roadmap decided: three slices, see roadmap.md.

## Broken or flaky
- Nothing known. No slice has been started, and the current contents of the live site have not been reviewed.

## Environment notes
- Stack: Next.js (App Router), TypeScript, plain CSS, Supabase, deployed on Vercel.
- Every branch Claude Code pushes gets a Vercel preview link on its pull request. Merging to main deploys the live site.
- Keys and passwords live only in Vercel > 1st-repo > Settings > Environment Variables. Never in chat, prompts, or repo files.
- Claude Code is run in the browser at claude.ai/code with the repository selected. The owner merges all pull requests.
- Decided: on the wall, every photo falls from the top of the screen to the bottom in about 5 seconds (owner's call). This is fast; it may need adjusting once seen live.
- Decided against for now: Google Photos sync (moved to Backlog because of Google's 2025 API limits and the new Google Cloud setup it needs).
- Open question: Supabase "Confirm email" should be off for the Slice 1 checks to pass. Not changed yet.
- Open question: confirm Supabase's current per-file upload limit; the roadmap assumes videos under 40 MB.

## Next session
- Start Slice 1: sign up and log in (the only ACTIVE slice).
- Before the Slice 1 work, the owner turns off Confirm email in Supabase, or decides to keep it and rewrites criterion 1.
- Do not start Slice 2 until all four Slice 1 criteria pass on the live site.
