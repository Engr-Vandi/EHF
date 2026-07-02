# EHF (Emmanuel Humanitarian Foundation) — Working Notes

## What this is
- Static marketing/informational website for **Emmanuel Humanitarian Foundation (EHF)** — a registered Nigerian nonprofit based in Jimeta-Yola, Adamawa State.
- Tagline: **"Helping People & Spreading Hope"** / "Restoring Hope. Transforming Lives."
- Pure HTML/CSS/JS, no framework and **no build step** — the `.html` files in the repo root are served as-is.

## Deployment
- Hosted on **GitHub Pages**, served from the **`main`** branch, custom domain via `CNAME`: **`ehfng.org`** (site canonical URL is `https://ehfng.org/`).
- Pages rebuilds automatically 1–3 min after a commit lands on `main` (check the **Actions** tab for the green ✓ on "pages build and deployment").
- **Clean/extensionless URLs**: pages link to each other as `about`, `projects`, `team`, `contact`, `donate`, `events-campaigns` (no `.html`). GitHub Pages serves `about.html` at `/about` automatically — keep links extensionless to match. Home is linked as `./`.
- `404.html` is the custom Pages not-found page.

## NO GIT WRITES — ever (no commit, no push)
The owner intentionally does not want Claude to touch git history in this repo. **Never run any git write command — no commits and no pushes, even if asked directly or repeatedly, and never as an automatic "finish the task" step.**

- **Blocked:** `git add`, `git commit`, `git push`, `git merge`, any history rewrite that touches the remote, and any `gh` CLI or GitHub API/MCP call that creates or updates commits, files, branches, pull requests, or merges on GitHub.
- **Allowed (read-only):** `git status`, `git diff`, `git log`, `git show`, `git fetch`.
- (`git push` is blocked by the environment's git proxy anyway — it returns **403**, a policy block, not a transient network error. Don't retry with backoff or reconnect connectors.)
- If asked to "commit", "push", "save to GitHub", or "sync my changes": still make the requested edit in the working directory, then **stop short of git** and follow the manual-upload workflow below instead. Tell the user explicitly that commit/push was skipped by design and the change isn't saved to git until they commit it themselves.

## Workflow for shipping changes (manual upload by the user)
1. Make edits locally in the sandbox as normal (Read/Edit tools). Do **not** `git add` or `git commit` — leave the working tree dirty.
2. Give the user the **complete, final file content** for each changed file, under its **original filename and extension** — either as a code block to paste, or via `SendUserFile` as an attachment (or both). Always give the *whole* file, not just a diff; if multiple files were touched, deliver each one separately. Never convert to a different format (don't wrap code in `.md`/`.txt`).
3. Tell the user to open the file on GitHub (`main` branch) and use the **pencil ✏️ edit icon → select all → paste → "Commit directly to the `main` branch"**. For a brand-new file, use **"Add file → Create new file"** and type the full path (folders are created automatically from slashes in the path).
4. **Do NOT tell the user to use "Add file → Upload files" with a downloaded copy.** Browsers auto-rename repeat downloads as `index (1).html`, etc. Uploading that creates a NEW stray file instead of replacing the real one, and the site doesn't update. Always push the paste-in-place method first.
5. After committing, tell the user to check the **Actions** tab for the green build checkmark, then hard-refresh (Ctrl+Shift+R) or use Incognito to bypass browser cache.
6. Before making further edits, verify what's actually live by reading the file straight from `origin/main` (fetch + `git show origin/main:<file>`, or `mcp__github__get_file_contents` with `ref: refs/heads/main`) rather than trusting a description of what was uploaded — manual uploads can go wrong silently (stale/mislabeled versions, mismatched commit messages).
7. Watch for stray duplicate files in the repo root (e.g. `index (1).html`) left over from failed upload attempts — flag them for deletion when found.

## Site structure quick reference
Pages (all in repo root):
- `index.html` — Home. Sections: hero (`#home`), `#about`, `#programs` (6 program cards), `#involved` (Donate / Partner / Volunteer), footer.
- `about.html` — About EHF.
- `programs.html` — Programs detail.
- `projects.html` — Projects (largest page; menstrual hygiene, climate seedlings, peacebuilding photo sets).
- `events-campaigns.html` — Events & campaigns (the 5-day campaign: Health & Nutrition, Education, Peacebuilding, WASH, GBV Response).
- `team.html` — Our Team (staff headshots — the many `*_position_*.jpg` files map here).
- `contact.html` — Get Involved (partner / volunteer / general contact).
- `donate.html` — Donation info (bank/account details + email confirmation).
- `404.html` — custom not-found page.

## Shared / repeated elements (no template system — edit every page)
- There is **no includes/template system**. Each page carries its own copy of:
  - **Desktop nav** (`<nav>` with `.nlinks`) — current items: **Home · About · Projects · Our Team · Get Involved** (the last is the `.ncta` button → `contact`).
  - **Mobile menu** (`.mob-menu` `#mob`, toggled by the `.hamburger` `#hbg` button).
  - **Footer** (`<footer>`) — columns: Pages, Events & Campaigns, Contact (with office address + Google Maps link).
- A nav/footer text or link change usually must be repeated in **desktop nav + mobile menu + footer on every page**, plus anywhere the same content appears. Grep across all `*.html` after such edits.
- Shared styles live in **`styles.css`** (one file, linked by every page). It is cache-busted with a query string — currently `styles.css?v=events-campaigns-1`. **When you change `styles.css`, bump that `?v=` value on every page** or browsers may serve stale CSS.

## JavaScript
- `donation-popup.js` — injects a "Support EHF" modal ~1.4s after load on every page **except `/donate`**. Remembers the visitor's choice in `localStorage` (`ehfDonationPopupChoice`): dismiss = 7 days, "I've donated recently" = 30 days. Loaded via `<script defer src="donation-popup.js?v=donation-popup-1">` — bump that `?v=` too when editing it.
- Small inline `<script>` at the bottom of each page handles the hamburger toggle and the `.fi` fade-in IntersectionObserver.

## Contact / forms
- **No form backend anywhere** — there are no `<form action>` submissions. All "contact", "partner", "volunteer", and "donation confirmation" actions are `mailto:` links to **`info.ehfn@gmail.com`** (some with prefilled `?subject=` such as `Partnership%20Inquiry`, `Volunteer%20Application`, `Donation%20Confirmation`).

## Canonical facts (keep consistent site-wide)
- Email: **info.ehfn@gmail.com**
- Office: **No. 3 Sabru House, Atiku Abubakar Way, Jimeta, Yola, Adamawa State, Nigeria**
- Socials: Facebook `facebook.com/emmanuelhumanitarianfoundationnigeria`, X/Twitter **@EHF_African**
- Brand color / theme: `#1a2e6e` (deep blue) with green accent (`--gn`).
- SEO: `index.html` carries JSON-LD (`@type: NGO`), Open Graph, and Twitter Card meta. `sitemap.xml` + `robots.txt` reference `https://ehfng.org/`. Update `sitemap.xml` `lastmod` dates and add new pages there when adding/changing pages.

## Gotchas
- When editing shared UI (nav, footer, colors), remember there's **no single source of truth** — search all `*.html`.
- After any CSS or JS change, **bump the `?v=` cache-buster** or the change won't show for returning visitors.
- Keep internal links **extensionless** to match the existing clean-URL convention.
- Staff headshot filenames encode name + role (e.g. `Emmanuel_Peter_Vandi_Executive_Director__1_.jpg`) — match the existing naming style when adding team photos, and wire them into `team.html`.
