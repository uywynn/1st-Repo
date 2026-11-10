# Photo Wall App

## Stack
- Next.js (App Router) with TypeScript.
- Plain CSS only. No CSS framework.
- Supabase for sign-in (Auth), the database, and file storage. Project URL: https://gbubfdmrooamxxcjmeel.supabase.co
- Deployed on Vercel (project 1st-repo). Merging to main deploys the live site at https://1st-repo-omega.vercel.app. Every pull request branch gets a Vercel preview link.
- Default branch: main.

## Commands
- npm run dev: start the local dev server.
- npm run build: build the app. Run it before opening a pull request.
- npm run lint: check code style.
- These are the standard Next.js scripts. Read package.json for the real script names first and use those. If one is missing, say so. Do not add one.

## Never
- Add a dependency (any new npm package) without asking first.
- Edit .env or any environment variable. Keys live only in Vercel > 1st-repo > Settings > Environment Variables.
- Change auth configuration without saying what is changing and why.
- Create new top-level folders.
- Put keys, passwords, or connection strings in any file, prompt, or message.
- Use real personal data. Fake names and fake content only.
- Merge a pull request. The owner merges.
- Edit roadmap.md, project-state.md, or CLAUDE.md in a feature task. Only a docs task edits them.
- Work on a slice that is not marked ACTIVE.

## Conventions
- The owner has no coding background and must be able to explain everything in this repo. Explain every change in the pull request description in plain language, and flag anything the owner might be embarrassed not to understand.
- Ask before adding a new library, service, or account.
- Choose the simplest approach that meets the done-criteria. Say so if a request is building a harder version than needed.
- Small, focused commits. One branch per session.
- If a prompt starts by asking you to check this file's first line, do that before anything else. If the first line is not "# Photo Wall App", stop and say which project this is.
- When finished, push the branch and open a draft pull request, then stop.

## Current focus
See roadmap.md, work only on the slice marked ACTIVE.
