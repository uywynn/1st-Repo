# Roadmap

## What this is
This is for the people at one event who want to share their photos and videos in one place. Guests sign in and upload photos and videos, and everyone's uploads show on a full-screen wall where they fall down the screen, with each new upload popping up in the middle for a few seconds first.

## What Done means
A stranger opens https://1st-repo-omega.vercel.app, signs up with an email and password, and uploads a photo and a short video for one event. They then open a wall page where every uploaded photo and video falls down a dark screen at a random horizontal position, taking about 5 seconds to cross from the top of the screen to the bottom. When anyone uploads something new while the wall is open, it appears large in the middle for about 5 seconds, fades out, and joins the falling collection. There is one event only, the files live in Supabase, and Google Photos is not involved.

## Slices
Page names used below: /signup, /login, /account, /upload, /wall, /manage.

1. Sign up and log in | done-criteria: (1) Open /signup, type a never-used fake email and a password of 8 or more characters, click Sign up: you land on /account and it shows "Signed in as" followed by that exact email. (2) On /account click Log out: you land on /login; then type /account into the address bar: you are sent back to /login and your email is not shown. (3) On /login enter that email with a wrong password and click Log in: the message "Invalid email or password" appears and you stay on /login. (4) On /login enter that email with the right password: you land on /account showing the email, and it still shows after you refresh the tab. | status: done
2. Upload photos and videos | done-criteria: (1) Signed in, open /upload, choose a .jpg under 10 MB, click Upload: its thumbnail appears under the heading "Your uploads" and is still there after you refresh the tab. (2) Choose an .mp4 under 40 MB and click Upload: it appears under "Your uploads" as a video and clicking it plays it. (3) Choose a .txt file and click Upload: the message "Only photos and videos are allowed" appears and nothing new is added under "Your uploads". (4) Log out, then type /upload into the address bar: you are sent to /login and no upload form is shown. | status: done
3. The falling wall | done-criteria: (1) Signed in with at least 6 photos already uploaded, open /wall: photos appear on a dark background at different horizontal positions and fall down the screen; after you refresh the tab the starting positions and order are different; pick one photo and time it with a phone stopwatch: it takes between 4 and 6 seconds to travel from the top edge of the screen to the bottom edge. (2) Keep /wall open in one tab and upload a new .jpg at /upload in a second tab: within 10 seconds it appears large in the middle of the /wall tab, stays between 3 and 8 seconds, fades out, then reappears falling with the other photos. (3) Repeat with an .mp4 under 40 MB: it plays muted in the middle for the same stretch, fades out, then appears falling with the rest. (4) Log out, then type /wall into the address bar: you are sent to /login and no photos are shown. | status: done
4. Deleting uploads | done-criteria: (1) Signed in as a guest with at least 2 uploads, open /upload, right-click one photo and copy its image address, then click its Delete button and click OK when asked "Delete this upload?": it disappears from "Your uploads", is still gone after you refresh the tab, and pasting the copied address into a new tab shows an error instead of the photo. (2) Signed in as a different, non-admin guest, open /upload: only that guest's own uploads are listed, each with a Delete button; then type /manage into the address bar: you are sent to /account and no uploads list is shown; log out and type /manage again: you are sent to /login. (3) Signed in as the admin account (chosen by the owner and marked as admin in Supabase), open /manage: every account's uploads are listed, each with a Delete button; delete one uploaded by a different account: it disappears from /manage and, after a refresh, from that account's "Your uploads". (4) Keep /wall open in one tab and delete a photo in a second tab: within 10 seconds no new copy of it starts falling (one already mid-fall may finish), and it does not appear again over the next 60 seconds. | status: done

## Backlog
- Sync uploads to a Google Photos album. Cut because Google limited its Photos API in 2025 (apps can only add to albums the app created itself; verify current rules before starting) and it needs a new Google Cloud account and consent setup. Revisit after Done.
- More than one event, event codes, or invite links.
- Guest access without an account, and sign in with Google.
- Password reset.
- Hiding uploads with undo, and moderation beyond deleting (e.g. approving uploads before they show).
- Downloading everything from an event.
- Thumbnails, compression, and videos over 40 MB.
- Sound on the wall.
- Names or captions on photos.
- A wall page that works without login, for a projector.
- Varied or adjustable fall speeds.
